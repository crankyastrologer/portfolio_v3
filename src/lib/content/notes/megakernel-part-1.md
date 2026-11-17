---
title: vLLM and llama.cpp both leave half the memory roofline unused on a 135M model
date: 2026-11
tag: systems
excerpt: MegaKernel on a 4060, part 1 — single-stream decode on SmolLM2-135M lands at 40–47% of the memory roofline while Qwen2.5-1.5B reaches 94%. This is the measurement.
---

## Summary

Small models leave most of a GPU's memory bandwidth unused at batch 1. I measured single-stream decode on an RTX 4060 Laptop GPU against a memory-bandwidth roofline for three paths: vLLM, llama.cpp and my own PyTorch CUDA-graph path.

- **Qwen2.5-1.5B:** vLLM runs at about 94% of the weight-read floor. Decode is memory-bound and there is almost nothing left to win.
- **SmolLM2-135M:** vLLM reaches 42–47% and llama.cpp 40–44%. Two unrelated engines land in the same place, with more than half the roofline unused.
- **My own path:** 3.39 ms per token, or 30% of the roofline, against about 2.3 ms for both engines. I am behind, and the profile shows why: about 1,370 kernel launches per token, roughly 1,100 of them small elementwise operations.

This series is about closing that gap by fusing those kernels. Part 1 is the measurement.

<figure>
  <img src="/images/megakernel/fig1_roofline_by_engine.png" alt="Percent of memory roofline by engine for SmolLM2-135M and Qwen2.5-1.5B" />
  <figcaption>Percent of the measured memory-bandwidth roofline by engine. Qwen2.5-1.5B stays near the weight-read floor; SmolLM2-135M leaves more than half of it unused.</figcaption>
</figure>

## Setup

- **Hardware:** one NVIDIA RTX 4060 Laptop GPU (8 GB GDDR6, 24 SMs, 38 W power cap), under WSL2 Ubuntu. The display ran on the integrated GPU, so the 4060 was idle apart from the benchmark.
- **Models:** SmolLM2-135M-Instruct (134.5M parameters, 30 layers) and Qwen2.5-1.5B-Instruct (1.544B parameters, 28 layers), both in bf16.
- **Workload:** batch size 1, greedy decoding, decode only. Prefill and graph capture are outside the timed region. Prompt lengths are 128, 512 and 2048 tokens.
- **Engines:** vLLM 0.33.0 with CUDA graphs enabled, llama.cpp built from source for sm\_89, and my own path on PyTorch 2.9.1 with a static KV cache.
- **Timing:** median time per token over 50 measured steps after warm-up, at steady clocks.

The full methodology, including versions and per-engine timing, is in the appendix.

## The roofline

At batch 1 and short context, the KV cache and the activations are small. The dominant memory traffic is the weights: every decode step reads essentially every weight once. That gives a simple lower bound on time per token, which is the weight bytes divided by the GPU's sustained read bandwidth.

| Model | Parameters | Weight bytes (bf16) | Floor per token |
| --- | --- | --- | --- |
| SmolLM2-135M-Instruct | 134.5M | 0.269 GB | 1.02 ms |
| Qwen2.5-1.5B-Instruct | 1.544B | 3.087 GB | 11.72 ms |

I measured the bandwidth directly rather than taking it from the spec. A Triton streaming-read kernel reads a 512 MB bf16 buffer; I tried six block and warp configurations and took the median of 50 timed iterations. The best sustained read was **263.5 GB/s**. The theoretical figure at the measured memory clock of 9022 MHz is 288.7 GB/s, so the kernel reaches about 91% of it.

One disclosure: I run a small memory overclock on this card through MSI Afterburner, and the stock figure for the laptop 4060 is 256 GB/s. Every percentage in this post uses the bandwidth measured on the same machine, so the comparison between engines is unaffected. Absolute tokens per second would be a little lower at stock clocks.

Percent of roofline is the floor divided by the measured time per token. The floor counts weight reads only, so the true limit is slightly higher and no real decode reaches 100%.

## Qwen2.5-1.5B is memory-bound

Median ms per token, with percent of roofline in brackets:

| Runtime | 128 tokens | 512 tokens | 2048 tokens |
| --- | --- | --- | --- |
| vLLM (bf16, CUDA graphs) | 12.49 (93.8%) | 12.34 (95.0%) | 12.54 (93.4%) |
| Mine: CUDA graph | 14.45 (81.1%) | 15.46 (75.8%) | 18.68 (62.7%) |
| Mine: torch.compile | 14.47 (81.0%) | 14.79 (79.2%) | 17.26 (67.9%) |

vLLM is within 5–7% of the floor at every context length. At this size the GPU spends nearly all its time reading weights, and no amount of kernel work can recover more than a few percent. The only way to go meaningfully faster is to read fewer bytes, which means quantization.

So I stopped here for this model. My own path starts at 81% and degrades with context, because the attention fix described below is applied only to the SmolLM2 path. llama.cpp was not run on Qwen.

## SmolLM2-135M is overhead-bound

Median ms per token, with percent of roofline in brackets. The Q4 row uses its own weight bytes (0.104 GB, a 0.39 ms floor).

| Runtime | 128 tokens | 512 tokens | 2048 tokens |
| --- | --- | --- | --- |
| vLLM (bf16, CUDA graphs) | 2.30 (44.5%) | 2.18 (46.8%) | 2.41 (42.3%) |
| llama.cpp F16, FlashAttention on | 2.32 (44.0%) | 2.37 (43.1%) | 2.54 (40.2%) |
| llama.cpp F16, FlashAttention off | 2.78 (36.7%) | 2.75 (37.1%) | 2.91 (35.1%) |
| llama.cpp Q4\_K\_M, FlashAttention on | 1.75 (22.5%) | 1.70 (23.2%) | 1.88 (20.9%) |
| Mine: CUDA graph | 3.39 (30.1%) | 3.43 (29.8%) | 3.72 (27.5%) |
| Mine: torch.compile | 7.40 (13.8%) | 7.85 (13.0%) | 6.94 (14.7%) |

The floor is 1.02 ms, and the two engines take about 2.3 ms. They share no code, yet they land within a few percent of each other. Quantization tells the same story: Q4\_K\_M reads 61% fewer bytes than F16 but is only 25% faster. Bytes are not the limit here.

**Why.** A decode step is not one computation. It is a long sequence of small GPU kernels: a matrix multiply, a normalization, an activation, an add, repeated across 30 layers. In eager PyTorch the CPU launches each one, and at this model size that cost dominates: my eager path takes 20.7 ms per token, under 5% of the roofline.

A CUDA graph records the sequence once and replays it without returning to Python between launches. That takes my path from 20.7 ms to 3.39 ms, and both engines do the same: vLLM ran with CUDA graphs enabled in these tests, and llama.cpp [uses them by default at batch size 1](https://developer.nvidia.com/blog/optimizing-llama-cpp-ai-inference-with-cuda-graphs).

A graph still executes every kernel, though. Each launch carries a fixed GPU-side cost for setting up and tearing down its work, and with more than a thousand per token those costs add up: in my path the small kernels alone take longer than the 1.02 ms floor. Meanwhile the memory bus sits partly idle, which is what a 44% roofline figure means.

Qwen runs a similar sequence of kernels, but each one moves about eleven times more data, so the fixed cost disappears into the work.

One caveat: I profiled only my own path. That vLLM and llama.cpp lose their time the same way is an inference from the two landing on the same number, not something I measured inside them.

## Related work

This post is the small-model end of a picture others have drawn for large models. In a [llama.cpp discussion on token generation in the CUDA backend](https://github.com/ggml-org/llama.cpp/discussions/17621), the author treats generation as memory-bound, estimates about 520 tokens per second for gpt-oss-20b on an RTX 5090, and measures about 419, roughly 80% of the estimate. The gains there came from kernel fusion (RMS norm, adds and GEMV) and from running the Q, K and V projections on concurrent streams, which took that model from 329 to 419 tokens per second.

Two things follow for this post. Large models sitting near the memory limit is consistent with my Qwen result. And llama.cpp already fuses some of its small kernels, yet it reaches only 40–44% on SmolLM2-135M. Partial fusion does not close the gap at this size, which is the case for going further in part 2, and also a caution about how much fusion alone can buy.

## My path, and the context-scaling bug

My first working decode path was a CUDA graph over a static KV cache. It was already behind the engines at short context, and it did not stay flat: 4.80 ms at 128 tokens, 4.30 ms at 512 and 6.69 ms at 2048, while vLLM stayed near 2.2–2.4 ms. That divergence was the first sign that launch overhead was not the whole story.

I profiled with torch.profiler and Chrome traces. Attention grew from 0.33 ms to 2.99 ms over that range. The cause is a known one: Transformers builds a 4D causal mask for the static cache, and PyTorch's scaled-dot-product attention cannot use its flash backend when a mask is present. It falls back to the memory-efficient CUTLASS kernel, which parallelizes poorly for a single query token and whose cost scales with the full cache length. The same dispatch behaviour is described on the [PyTorch forums](https://discuss.pytorch.org/t/scaled-dot-product-attention-not-useful-for-inference/220828) and measured in the [SAFE-DiT paper](https://arxiv.org/pdf/2606.29360), which calls it the mask-induced dispatch tax.

During decode the mask does only one job, which is hiding the unfilled slots of the preallocated cache. I first tried to remove it with sentinel keys in those slots, but a constant negative key produces a positive score whenever the query sums to less than zero, so the softmax silently weights garbage. That dead end pointed to the real fix: attention that knows the current length.

So I wrote a split-K Triton kernel. Sixteen programs per query head each scan one slice of the cache with an online softmax, and a small reduction combines their maximum, denominator and weighted-value results. The length comes from the cache's device-side counter, so shapes stay fixed and the kernel works inside a CUDA graph. Prefill keeps the original masked path.

| Prompt length | Before (ms per token) | After (ms per token) |
| --- | --- | --- |
| 128 | 4.80 | 3.39 |
| 512 | 4.30 | 3.43 |
| 2048 | 6.69 | 3.72 |

Attention at 2048 tokens fell from 2.99 ms to 0.50 ms. The path now grows by 0.33 ms over a 16x change in context, against 0.22 ms for llama.cpp and 0.11 ms for vLLM. Generated tokens match the eager reference exactly.

<figure>
  <img src="/images/megakernel/fig2_context_scaling.png" alt="ms per token against prompt length, before and after the split-K attention fix, compared with vLLM and llama.cpp" />
  <figcaption>Context scaling before and after the split-K Triton attention kernel. The dashed line is the 1.02 ms weight-read floor.</figcaption>
</figure>

## Where 3.36 ms goes

At 128 tokens the profiled CUDA-graph step takes 3.36 ms, which is 3.3x the 1.02 ms weight-read floor. The extra 2.34 ms is not one problem.

| Component | ms per token |
| --- | --- |
| Weight streaming (GEMM and GEMV kernels) | 1.59 |
| Elementwise and other small kernels | 1.33 |
| Host gap | 0.26 |
| Attention | 0.17 |
| Sampling (argmax) | 0.011 |
| **Total** | **3.36** |
| Weight-read floor | 1.02 |

- **Weight streaming** is already 0.57 ms above the floor. The per-layer kernels at batch 1 do not reach the sustained read rate, and I do not yet know how much of that gap is recoverable.
- **Elementwise work** is the largest recoverable part: 1.33 ms across roughly 1,100 launches for RMSNorm, RoPE, SwiGLU, residual adds, the KV append, casts and copies.
- **Attention** is small at this context and rises to 0.50 ms at 2048 tokens.
- **The host gap** is what remains between graph replays.

The graph removed the per-launch trip through Python, but it still runs every one of those small kernels. Fusing them is the subject of part 2.

<figure>
  <img src="/images/megakernel/fig3_breakdown.png" alt="Stacked breakdown of the 3.36 ms decode step, with the 1.02 ms weight-read floor marked" />
  <figcaption>Where the 3.36 ms CUDA-graph step goes at 128 tokens, broken down by component.</figcaption>
</figure>

## Next

Part 2 fuses the elementwise work into the kernels around it.

1. One MLP block as a single Triton kernel, checked for token parity and measured in isolation.
2. A fused kernel per layer.
3. A persistent kernel for the whole model.

The target is 1.8–2.1 ms per token, which is 50–58% of the roofline and 1.1–1.3x faster than vLLM and llama.cpp. If a fused path cannot get under their 2.3 ms, fusion at this level is not worth its complexity on this hardware, and I will report that.

## Limitations

- One laptop GPU, under WSL2, with a memory overclock and clocks that cannot be locked.
- Two engines. llama.cpp was run on SmolLM2 only.
- My path and vLLM use different PyTorch versions.
- I profiled only my own path, not the inside of vLLM or llama.cpp.
- Greedy decoding at batch 1, decode only.
- The attention kernel reads a single cache length, so it assumes one sequence. It is applied to the SmolLM2 path only.
- The roofline counts weight reads and ignores KV-cache traffic.

## Reproduce

Code, raw results and the exact commands are in the repository: [github.com/crankyastrologer/megakernel](https://github.com/crankyastrologer/megakernel). Results in this post are from commit `168d680`.

*I'm looking for inference and GPU performance roles. You can reach me through [ansh.site](https://ansh.site).*

## Appendix: methodology

**Hardware and clocks**

- NVIDIA RTX 4060 Laptop GPU: 8 GB GDDR6, 24 SMs, 32 MB L2 cache, compute capability 8.9, 38 W power cap.
- WSL2 Ubuntu on Windows. The display ran on the integrated AMD 780M, so the 4060 showed 0 MiB used at idle.
- Driver KMD 617.42 with CUDA UMD 13.4; CUDA toolkit 13.0.
- Idle clocks: about 1620 MHz SM, 7001 MHz memory, 8 W. Sustained load: about 2100 MHz SM, 9022 MHz memory, 33 W, 47–51 °C.
- WSL2 does not allow clock locking, so every timing follows a warm-up burn and clocks are logged.

**Software**

| Component | Version |
| --- | --- |
| Python | 3.11.15 |
| PyTorch (my path) | 2.9.1+cu126 |
| Triton | 3.5.1 |
| Transformers (my path) | 5.22.2 |
| vLLM (separate environment) | 0.33.0, with PyTorch 2.14.0+cu130 and Transformers 5.20.2 |
| llama.cpp | commit b7ad48ebd, CUDA 13.0, built for sm\_89 |

nsys produced no CUDA kernel data under WSL2, so torch.profiler with Chrome traces was the GPU profiler.

**Models**

- SmolLM2-135M-Instruct, bf16: 134,515,008 parameters, 0.26903 GB, 30 layers, hidden size 576, 3 KV heads, head dimension 64.
- Qwen2.5-1.5B-Instruct, bf16: 1,543,714,304 parameters, 3.08743 GB, 28 layers, hidden size 1536, 2 KV heads, head dimension 128. I chose it as an ungated model of this size with a 32K context.
- For llama.cpp: SmolLM2-135M-Instruct GGUF files in F16 (259 MB) and Q4\_K\_M (101 MB).

**Workload**

- Batch size 1, greedy decoding, no sampling. Prefill and graph capture or compilation are outside the timed region.
- The prompt is a fixed repeated text, tokenized once and truncated to exactly 128, 512 or 2048 tokens. My path and vLLM use the same token ids; I compared prompt hashes.
- Caches are sized for the whole run.

**Timing, my path**

1. Load the model in bf16 and prefill the prompt.
2. Build the decoder for the chosen mode: eager, static cache, CUDA graph or torch.compile.
3. Run 2048×2048 bf16 matrix multiplies for 0.3 s so clocks are at steady state. Without this, short-prompt runs execute at lower clocks.
4. Discard 10 warm-up decode steps.
5. Time 50 steps with CUDA events around each step, synchronizing once at the end.

I report the median. For the CUDA graph, the single-token forward and argmax are captured after prefill and replayed once before timing. torch.compile uses the default mode, because reduce-overhead crashes on this stack with the static cache's in-place updates.

**Timing, vLLM**

- Engine created with bf16, CUDA graphs enabled, GPU memory utilization 0.8 and seed 0.
- One warm-up generation, then 5 repetitions of 50 tokens for a single request.
- Time per output token comes from engine timestamps: last token time minus first token time, divided by the number of tokens minus one. This excludes prefill. I report the median of the 5 repetitions.

**Timing, llama.cpp**

- `llama-bench -p 0 -n 64 -d 128,512,2048 -r 5 -fa 1`, and `-fa 0` for comparison.
- `-d` sets the KV-cache depth, `-n` the generated tokens and `-r` the repetitions. ms per token is 1000 divided by the reported tokens per second.

**Parity**

Hugging Face `generate` diverged from my manual decode loop for Qwen at 128 tokens, while manual eager, the CUDA graph and vLLM agreed exactly. Parity checks therefore use manual eager as the reference.
