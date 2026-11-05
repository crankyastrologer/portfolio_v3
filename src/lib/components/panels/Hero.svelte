<script lang="ts">
  import Pulse from '../base/Pulse.svelte';
  let { onContact }: { onContact: () => void } = $props();
</script>

<section class="cd-hero">
  <div class="cd-hero-top">
    <span class="cd-hero-tag">// ansh-verma.about()</span>
    <span class="cd-hero-status">
      <Pulse />
      shipping @ LivePerson
    </span>
  </div>
  <h1 class="cd-h1">
    i build <span class="cd-accent">inference</span> servers and<br />
    <span class="cd-accent">evals</span> that judge agent traces —<br />
    down to the <span class="cd-accent">cuda kernels</span>.
  </h1>
  <p class="cd-sub">
    ml engineer · b.tech cs (ai/ml) · northcap '25 · 9.0 cgpa.
    currently building prompt studio at LivePerson and an inference server
    with paged kv + continuous batching. previously: judge-as-a-service at
    Litt; gpt-2 from scratch in c++/cuda.
  </p>
  <div class="cd-cta-row">
    <a class="cd-cta cd-cta-primary" href="https://kmvtiv3h5z.ufs.sh/f/z6mi9BYbVtivC6XusspEq0Z9kAeuYCpfLMXyPxIURKiOT2Vv" target="_blank" rel="noreferrer">cat resume.pdf<span class="cd-arr">→</span></a>
    <button class="cd-cta" onclick={onContact}>./contact</button>
  </div>
</section>
