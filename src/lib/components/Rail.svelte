<script lang="ts">
  import { slide, fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { LOG_FEED, EXPERIENCE } from '$lib/data';
  import Pulse from './Pulse.svelte';

  let {
    logCount,
    now,
    onSelectTech,
  }: {
    logCount: number;
    now: Date;
    onSelectTech: (tech: string) => void;
  } = $props();

  let timeStr = $derived(
    now.toLocaleTimeString('en-GB', { hour12: false, timeZone: 'Asia/Kolkata' }).slice(0, 8)
  );

  let hoveredExp = $state<string | null>(null);

  const STACK = [
    { label: 'ml',   color: 'var(--blue)',        items: ['pytorch', 'cuda', 'langchain', 'qdrant', 'sklearn'] },
    { label: 'web',  color: 'var(--cd-accent)',   items: ['svelte', 'next', 'hono', 'fastapi', 'flask'] },
    { label: 'db',   color: 'var(--amber)',        items: ['mongo', 'redis', 'postgres'] },
    { label: 'lang', color: 'var(--red)',          items: ['python', 'c/c++', 'typescript', 'java'] },
    { label: 'cert', color: 'var(--fg-3)',         items: ['aws', 'nptel c++', 'nptel bizan'] },
  ];
</script>

<aside class="cd-rail">
  <!-- Live log feed -->
  <div class="cd-panel cd-panel-rail">
    <div class="cd-panel-head">
      <span class="cd-panel-title">~/now.log</span>
      <Pulse />
    </div>
    <div class="cd-log">
      {#each LOG_FEED.slice(0, logCount) as l}
        <div class="cd-log-line">
          <span class="cd-dim">{l.t}</span>
          <span class="cd-lvl cd-lvl-{l.lvl.trim().toLowerCase()}">{l.lvl}</span>
          <span>{@html l.msg}</span>
        </div>
      {/each}
      <div class="cd-log-line">
        <span class="cd-dim">{timeStr}</span>
        <span class="cd-lvl cd-lvl-inf">INF</span>
        <span><span class="cd-cursor-blink">▋</span></span>
      </div>
    </div>
  </div>

  <!-- Experience -->
  <div class="cd-panel cd-panel-rail" id="section-experience">
    <div class="cd-panel-head">
      <span class="cd-panel-title">experience.tail</span>
      <span class="cd-dim" style="font-size:10px">{EXPERIENCE.length} entries</span>
    </div>
    <div class="cd-timeline">
      {#each EXPERIENCE as e, i}
        {@const isCurrent = e.when.includes('now')}
        {@const expanded = hoveredExp === e.co}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="cd-tl-entry"
          class:is-current={isCurrent}
          onmouseenter={() => hoveredExp = e.co}
          onmouseleave={() => hoveredExp = null}
        >
          <div class="cd-tl-left">
            <div class="cd-tl-node">{#if isCurrent}<span class="cd-tl-node-pulse"></span>{/if}</div>
            {#if i < EXPERIENCE.length - 1}<div class="cd-tl-line"></div>{/if}
          </div>
          <div class="cd-tl-content">
            <div class="cd-tl-head">
              <span class="cd-tl-co">{e.co}</span>
              {#if isCurrent}<span class="cd-tl-now">now</span>{/if}
            </div>
            <div class="cd-tl-meta">
              <span class="cd-tl-role">{e.role}</span>
              <span class="cd-dim cd-tl-loc">{e.location}</span>
            </div>
            <div class="cd-tl-when">{e.when}</div>
            <div class="cd-tl-bullets">
              {#each e.bullets.slice(0, 2) as b}
                <div class="cd-tl-bullet">{b}</div>
              {/each}
              {#if expanded && e.bullets.length > 2}
                <div transition:slide={{ duration: 260, easing: cubicOut }}>
                  {#each e.bullets.slice(2) as b}
                    <div class="cd-tl-bullet">{b}</div>
                  {/each}
                </div>
              {/if}
            </div>
            {#if !expanded && e.bullets.length > 2}
              <div class="cd-tl-more" transition:fade={{ duration: 180 }}>+{e.bullets.length - 2} more</div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Stack -->
  <div class="cd-panel cd-panel-rail">
    <div class="cd-panel-head"><span class="cd-panel-title">stack.lock</span></div>
    <div class="cd-stack-grid">
      {#each STACK as cat}
        <div class="cd-stack-row">
          <span class="cd-stack-cat">{cat.label}</span>
          <div class="cd-stack-pills">
            {#each cat.items as item}
              <button class="cd-stack-pill" style="--cat: {cat.color};" onclick={() => onSelectTech(item)}>{item}</button>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
</aside>
