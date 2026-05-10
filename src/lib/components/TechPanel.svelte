<script lang="ts">
  import { PROJECTS, type Project } from '$lib/data';

  let {
    tech,
    onClose,
    onOpenProj,
  }: {
    tech: string | null;
    onClose: () => void;
    onOpenProj: (id: string) => void;
  } = $props();

  // loose match: "c/c++" pill matches "c++" in stack, "pytorch" matches "pytorch", etc.
  function matches(p: Project, t: string) {
    const tl = t.toLowerCase();
    return p.stack.some(s => {
      const sl = s.toLowerCase();
      return sl === tl || sl.includes(tl) || tl.includes(sl);
    });
  }

  let results = $derived(tech ? PROJECTS.filter(p => matches(p, tech!)) : []);

  const STATUS_COLOR: Record<Project['status'], string> = {
    shipping: 'var(--cd-accent)',
    live:     'var(--blue)',
    archived: 'var(--fg-3)',
  };
</script>

{#if tech}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div class="cd-detail-overlay" onclick={onClose}>
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div class="cd-detail" onclick={(e) => e.stopPropagation()}>
      <div class="cd-detail-head">
        <div class="cd-detail-bcrumb">
          <span class="cd-dim">stack / </span>
          <span>{tech}</span>
        </div>
        <button class="cd-detail-close" onclick={onClose}>esc ✕</button>
      </div>

      <div class="cd-detail-body cd-tech-body">
        <div class="cd-detail-tag">
          // {results.length} project{results.length !== 1 ? 's' : ''} using {tech}
        </div>
        <h2 class="cd-detail-h">{tech}</h2>

        {#if results.length === 0}
          <p class="cd-tech-empty">no projects in this portfolio use <strong>{tech}</strong> directly — but it's in the stack.</p>
        {:else}
          <div class="cd-tech-list">
            {#each results as p}
              <div class="cd-tech-proj">
                <div class="cd-tech-proj-head">
                  <span class="cd-tech-proj-title">{p.title}</span>
                  <span class="cd-proj-status cd-status-{p.status}">{p.status}</span>
                </div>
                <p class="cd-tech-proj-blurb">{p.blurb}</p>
                <div class="cd-tech-proj-stack">
                  {#each p.stack as s}
                    <span
                      class="cd-tag"
                      class:cd-tech-tag-active={s.toLowerCase() === tech.toLowerCase() || s.toLowerCase().includes(tech.toLowerCase()) || tech.toLowerCase().includes(s.toLowerCase())}
                    >{s}</span>
                  {/each}
                </div>
                <button
                  class="cd-cta cd-cta-primary cd-tech-proj-cta"
                  onclick={() => { onOpenProj(p.id); onClose(); }}
                >
                  open project <span class="cd-arr">↗</span>
                </button>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
