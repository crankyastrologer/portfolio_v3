<script lang="ts">
  import { PROJECTS } from '$lib/data';
  const VISIBLE = PROJECTS.filter(p => !p.hidden);
  import Sparkline from '../base/Sparkline.svelte';

  let {
    activeProj,
    onSelectProj,
    onOpenProj,
  }: {
    activeProj: string | null;
    onSelectProj: (id: string) => void;
    onOpenProj: (id: string) => void;
  } = $props();
</script>

<div class="cd-panel">
  <div class="cd-panel-head">
    <span class="cd-panel-title">work[].json</span>
    <span class="cd-dim">{VISIBLE.length} entries · sorted by recency</span>
  </div>
  <div class="cd-projects">
    {#each VISIBLE as p, idx}
      <div
        class="cd-proj"
        class:is-active={activeProj === p.id}
        role="button"
        tabindex="0"
        onmouseenter={() => onSelectProj(p.id)}
        onclick={() => onOpenProj(p.id)}
        onkeydown={(e) => e.key === 'Enter' && onOpenProj(p.id)}
      >
        <div class="cd-proj-head">
          <span class="cd-proj-id">{String(idx + 1).padStart(2, '0')}</span>
          <span class="cd-proj-title">{p.title}</span>
          <span class="cd-proj-status cd-status-{p.status}">{p.status}</span>
          <span class="cd-proj-arrow">↗</span>
        </div>
        <div class="cd-proj-blurb">{p.blurb}</div>
        <div class="cd-proj-foot">
          <div class="cd-stack">
            {#each p.stack as s}<span class="cd-tag">{s}</span>{/each}
          </div>
          <div class="cd-metric">
            <span class="cd-dim">{p.metrics[0].label}</span>
            <span class="cd-metric-v">{p.metrics[0].value}</span>
            <span class="cd-metric-d">{p.metrics[0].delta}</span>
            <Sparkline data={p.spark} />
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
