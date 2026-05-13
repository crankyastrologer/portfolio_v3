<script lang="ts">
  import { onMount } from 'svelte';
  import { slide, fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { LOG_FEED, EXPERIENCE, type LogEntry } from '$lib/data';
  import Pulse from '../base/Pulse.svelte';

  let {
    now,
    mobileOpen = false,
    onSelectTech,
  }: {
    now: Date;
    mobileOpen?: boolean;
    onSelectTech: (tech: string) => void;
  } = $props();

  let timeStr = $derived(
    now.toLocaleTimeString('en-GB', { hour12: false, timeZone: 'Asia/Kolkata' }).slice(0, 8)
  );

  // ── GitHub events log ──────────────────────────────────────────────
  let entries     = $state<LogEntry[]>([]);
  let visible     = $state(0);
  let fetchState  = $state<'loading' | 'live' | 'fallback'>('loading');
  let logEl       = $state<HTMLElement | null>(null);

  function relTime(iso: string): string {
    const diff  = Date.now() - new Date(iso).getTime();
    const mins  = Math.floor(diff / 60_000);
    const hours = Math.floor(diff / 3_600_000);
    const days  = Math.floor(diff / 86_400_000);
    if (mins  <  60) return `${mins}m ago`;
    if (hours <  24) return `${hours}h ago`;
    if (days  <   7) return `${days}d ago`;
    return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  }

  function fmtEvent(ev: any): LogEntry | null {
    const repo = ev.repo.name.split('/')[1];
    const t    = relTime(ev.created_at);
    switch (ev.type) {
      case 'PushEvent': {
        const msg = ev.payload.commits?.[0]?.message?.split('\n')[0].slice(0, 52) ?? 'pushed code';
        return { t, lvl: ' OK ', msg: `pushed <span class="hi">${msg}</span> → ${repo}` };
      }
      case 'CreateEvent':
        return { t, lvl: ' INF', msg: `created ${ev.payload.ref_type} <span class="hi">${ev.payload.ref ?? repo}</span>` };
      case 'PullRequestEvent': {
        const pr = ev.payload.pull_request;
        return { t, lvl: ' INF', msg: `${ev.payload.action} PR <span class="hi">#${pr.number}</span> · ${pr.title.slice(0, 38)}` };
      }
      case 'IssuesEvent':
        return { t, lvl: ' WRN', msg: `${ev.payload.action} issue <span class="hi">#${ev.payload.issue.number}</span> in ${repo}` };
      case 'IssueCommentEvent':
        return { t, lvl: ' INF', msg: `commented on <span class="hi">#${ev.payload.issue.number}</span> · ${repo}` };
      case 'WatchEvent':
        return { t, lvl: ' INF', msg: `starred <span class="hi">${repo}</span>` };
      case 'ForkEvent':
        return { t, lvl: ' INF', msg: `forked <span class="hi">${repo}</span>` };
      case 'DeleteEvent':
        return { t, lvl: ' WRN', msg: `deleted ${ev.payload.ref_type} in <span class="hi">${repo}</span>` };
      case 'ReleaseEvent':
        return { t, lvl: ' OK ', msg: `released <span class="hi">${ev.payload.release.tag_name}</span> · ${repo}` };
      default:
        return null;
    }
  }

  function stream(list: LogEntry[]) {
    let i = 0;
    function next() {
      if (i >= list.length) return;
      visible = i + 1;
      i++;
      // keep newest entry visible as log fills up
      setTimeout(() => {
        if (logEl) logEl.scrollTop = logEl.scrollHeight;
      }, 0);
      setTimeout(next, 110 + Math.random() * 140);
    }
    setTimeout(next, 300);
  }

  const GH_CACHE_KEY  = 'gh-events';
  const GH_CACHE_TIME = 'gh-events-ts';
  const GH_TTL        = 10 * 60 * 1000; // 10 minutes

  function applyEvents(evs: any[]) {
    const lines = evs.map(fmtEvent).filter((l): l is LogEntry => l !== null).slice(0, 3).reverse();
    entries    = lines.length ? lines : LOG_FEED.slice(-3);
    fetchState = lines.length ? 'live' : 'fallback';
    stream(entries);
  }

  onMount(() => {
    // Serve from sessionStorage if <10 min old
    try {
      const ts  = sessionStorage.getItem(GH_CACHE_TIME);
      const raw = sessionStorage.getItem(GH_CACHE_KEY);
      if (ts && raw && Date.now() - Number(ts) < GH_TTL) {
        applyEvents(JSON.parse(raw));
        return;
      }
    } catch { /* sessionStorage unavailable or parse error */ }

    fetch('https://api.github.com/users/crankyastrologer/events/public')
      .then(r => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      })
      .then((evs: any[]) => {
        try {
          sessionStorage.setItem(GH_CACHE_KEY,  JSON.stringify(evs));
          sessionStorage.setItem(GH_CACHE_TIME, String(Date.now()));
        } catch { /* storage full or blocked */ }
        applyEvents(evs);
      })
      .catch(() => {
        entries    = LOG_FEED.slice(-3);
        fetchState = 'fallback';
        stream(entries);
      });
  });

  // ── Experience hover ───────────────────────────────────────────────
  let hoveredExp = $state<string | null>(null);

  const STACK = [
    { label: 'ml',   color: 'var(--blue)',      clickable: true,  items: ['pytorch', 'cuda', 'directml', 'langchain', 'qdrant', 'sklearn'] },
    { label: 'web',  color: 'var(--cd-accent)', clickable: true,  items: ['svelte', 'next', 'hono', 'fastapi', 'flask', 'graphql'] },
    { label: 'db',   color: 'var(--amber)',      clickable: true,  items: ['mongo', 'redis', 'postgres'] },
    { label: 'lang', color: 'var(--red)',        clickable: true,  items: ['python', 'rust', 'c/c++', 'typescript', 'java'] },
    { label: 'cert', color: 'var(--fg-3)',       clickable: false, items: ['aws', 'nptel c++', 'nptel bizan'] },
  ];
</script>

<aside class="cd-rail" class:is-open={mobileOpen}>
  <!-- Live log feed -->
  <div class="cd-panel cd-panel-rail">
    <div class="cd-panel-head">
      <span class="cd-panel-title">~/now.log</span>
      {#if fetchState === 'loading'}
        <span class="cd-dim" style="font-size:10px">fetching…</span>
      {:else if fetchState === 'live'}
        <Pulse />
      {:else}
        <span class="cd-dim" style="font-size:10px">cached</span>
      {/if}
    </div>
    <div class="cd-log" bind:this={logEl}>
      {#each entries.slice(0, visible) as l}
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
        {@const expanded  = hoveredExp === e.co}
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
              {#if cat.clickable}
                <button class="cd-stack-pill" style="--cat: {cat.color};" onclick={() => onSelectTech(item)}>{item}</button>
              {:else}
                <span class="cd-stack-pill cd-stack-pill-static" style="--cat: {cat.color};">{item}</span>
              {/if}
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
</aside>
