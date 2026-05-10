<script lang="ts">
  import { PROJECTS } from '$lib/data';
  import Sparkline from './Sparkline.svelte';

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
    <span class="cd-dim">{PROJECTS.length} entries · sorted by recency</span>
  </div>
  <div class="cd-projects">
    {#each PROJECTS as p, idx}
      <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
      <div
        class="cd-proj"
        class:is-active={activeProj === p.id}
        onmouseenter={() => onSelectProj(p.id)}
        onclick={() => onOpenProj(p.id)}
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
