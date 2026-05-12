<script lang="ts">
  import { PROJECTS, type Project } from '$lib/data';

  let { onOpenProj }: { onOpenProj: (id: string) => void } = $props();

  const VISIBLE = PROJECTS.filter(p => !p.hidden);

  function parseYM(s: string) {
    const [y, m] = s.split('-').map(Number);
    return y * 12 + m;
  }

  function ymLabel(ym: number) {
    const month = ((ym - 1) % 12) + 1;
    const year  = Math.floor((ym - 1) / 12);
    const names = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
    return month === 1 ? `jan '${String(year).slice(2)}` : names[month - 1];
  }

  const now     = new Date();
  const nowYM   = now.getFullYear() * 12 + (now.getMonth() + 1);
  const winStart = Math.min(...VISIBLE.map(p => parseYM(p.started)));
  const winEnd   = nowYM;
  const total    = winEnd - winStart + 1;

  const months = Array.from({ length: total }, (_, i) => ({
    label: ymLabel(winStart + i),
    pct: (i / total) * 100,
  }));

  const STATUS_COLOR: Record<Project['status'], string> = {
    shipping: 'var(--cd-accent)',
    live:     'var(--blue)',
    archived: 'var(--fg-3)',
  };

  function bar(p: Project) {
    const s = parseYM(p.started);
    const e = p.ended ? parseYM(p.ended) : nowYM;
    return {
      left:  ((s - winStart) / total) * 100,
      width: ((e - s + 1)   / total) * 100,
      color: STATUS_COLOR[p.status],
    };
  }
</script>

<div class="cd-panel">
  <div class="cd-panel-head">
    <span class="cd-panel-title">project.timeline</span>
    <span class="cd-dim">{total} months · {VISIBLE.length} projects</span>
  </div>
  <div class="cd-gantt">
    <!-- month axis -->
    <div class="cd-gantt-axis">
      <div class="cd-gantt-name-col"></div>
      <div class="cd-gantt-bars" style="position:relative; height:18px;">
        {#each months as m}
          <span class="cd-gantt-mlabel" style="left:{m.pct}%">{m.label}</span>
        {/each}
      </div>
    </div>

    <!-- project rows -->
    {#each VISIBLE as p}
      {@const b = bar(p)}
      <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
      <div class="cd-gantt-row" onclick={() => onOpenProj(p.id)}>
        <div class="cd-gantt-name">
          <span class="cd-gantt-title">{p.title}</span>
          <span class="cd-gantt-status" style="color:{b.color};">{p.status}</span>
        </div>
        <div class="cd-gantt-bars">
          <div class="cd-gantt-grid">
            {#each months as _, i}
              <div class="cd-gantt-tick" class:cd-gantt-tick-new={ymLabel(winStart + i).startsWith('jan')}></div>
            {/each}
          </div>
          <div
            class="cd-gantt-bar"
            style="left:{b.left}%; width:{b.width}%; --bar: {b.color};"
          >
            {#if !p.ended}<span class="cd-gantt-now-pip"></span>{/if}
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
