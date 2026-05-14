<script lang="ts">
  import Pulse from '../base/Pulse.svelte';
  let { onContact }: { onContact: () => void } = $props();
</script>

<section class="cd-hero">
  <div class="cd-hero-top">
    <span class="cd-hero-tag">// ansh-verma.about()</span>
    <span class="cd-hero-status">
      <Pulse />
      shipping @ Litt
    </span>
  </div>
  <h1 class="cd-h1">
    i build <span class="cd-accent">agents</span> that watch other<br />
    agents work, and the <span class="cd-accent">kernels</span><br />
    that make them fast.
  </h1>
  <p class="cd-sub">
    ai/ml engineer · b.tech cs (ai/ml) · northcap '25 · 9.0 cgpa.
    currently architecting judge-as-a-service for multi-agent llm trace
    forensics. previously: gpt-2 from scratch in c++/cuda.
  </p>
  <div class="cd-cta-row">
    <a class="cd-cta cd-cta-primary" href="https://kmvtiv3h5z.ufs.sh/f/z6mi9BYbVtivC6XusspEq0Z9kAeuYCpfLMXyPxIURKiOT2Vv" target="_blank" rel="noreferrer">cat resume.pdf<span class="cd-arr">→</span></a>
    <button class="cd-cta" onclick={onContact}>./contact</button>
  </div>
</section>
