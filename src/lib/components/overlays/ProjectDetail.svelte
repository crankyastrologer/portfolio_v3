<script lang="ts">
  import { PROJECTS } from '$lib/data';
  import Sparkline from '../base/Sparkline.svelte';

  let {
    projId,
    onClose,
  }: {
    projId: string | null;
    onClose: () => void;
  } = $props();

  let p = $derived(PROJECTS.find(x => x.id === projId) ?? null);
</script>

{#if p}
  <div class="cd-detail-overlay" role="presentation" onclick={onClose}>
    <div class="cd-detail" role="dialog" aria-modal="true" onclick={(e) => e.stopPropagation()}>
      <div class="cd-detail-head">
        <div class="cd-detail-bcrumb">
          <span class="cd-dim">work / </span>
          <span>{p.title}.md</span>
        </div>
        <button class="cd-detail-close" onclick={onClose}>esc ✕</button>
      </div>
      <div class="cd-detail-body">
        <div class="cd-detail-tag">// {p.org} · {p.year} · {p.status}</div>
        <h2 class="cd-detail-h">{p.title}</h2>
        <div class="cd-detail-blurb">{p.blurb}</div>

        <div class="cd-detail-metrics">
          {#each p.metrics as m}
            <div class="cd-detail-metric">
              <div class="cd-dim">{m.label}</div>
              <div class="cd-detail-mv">{m.value}</div>
              <div class="cd-metric-d">{m.delta}</div>
            </div>
          {/each}
        </div>

        <div class="cd-detail-section-h">// readme</div>
        <div class="cd-detail-long">
          {#each p.long as line}<p>{line || ' '}</p>{/each}
        </div>

        <div class="cd-detail-section-h">// stack</div>
        <div class="cd-stack">
          {#each p.stack as s}<span class="cd-tag cd-tag-lg">{s}</span>{/each}
        </div>

        <div class="cd-detail-section-h">// activity</div>
        <Sparkline data={p.spark} />

        <div class="cd-detail-cta">
          <a class="cd-cta cd-cta-primary" href={p.href} target="_blank" rel="noreferrer">
            view source<span class="cd-arr">↗</span>
          </a>
          <button class="cd-cta" onclick={onClose}>← back</button>
        </div>
      </div>
    </div>
  </div>
{/if}
