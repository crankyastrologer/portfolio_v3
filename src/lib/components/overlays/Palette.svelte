<script lang="ts">
  import { PROJECTS } from '$lib/data';

  let {
    open,
    onClose,
    onOpenProj,
  }: {
    open: boolean;
    onClose: () => void;
    onOpenProj: (id: string) => void;
  } = $props();

  const items = [
    ...PROJECTS.map(p => ({ kind: 'project', id: p.id, label: p.title, hint: p.blurb, href: '' })),
    { kind: 'link', id: '', label: 'open chat.ansh.site', hint: '↗ external', href: 'https://chat.ansh.site' },
    { kind: 'link', id: '', label: 'github.com/crankyastrologer', hint: '↗ external', href: 'https://github.com/crankyastrologer' },
    { kind: 'link', id: '', label: 'linkedin/ansh-vermaai', hint: '↗ external', href: 'https://www.linkedin.com/in/ansh-vermaai/' },
    { kind: 'link', id: '', label: 'mailto:ansh0verma@gmail.com', hint: '✉ direct', href: 'mailto:ansh0verma@gmail.com' },
    { kind: 'doc', id: '', label: 'cat resume.pdf', hint: 'download cv', href: '' },
    { kind: 'doc', id: '', label: 'cat about.md', hint: 'long-form bio', href: '' },
  ];

  let q = $state('');
  let sel = $state(0);
  let inputEl = $state<HTMLInputElement | null>(null);

  let filtered = $derived(
    items.filter(i => !q || (i.label + ' ' + i.hint).toLowerCase().includes(q.toLowerCase()))
  );

  $effect(() => {
    if (open) {
      q = '';
      sel = 0;
      setTimeout(() => inputEl?.focus(), 30);
    }
  });

  function activate(it: typeof items[0]) {
    if (it.kind === 'project') onOpenProj(it.id);
    else if (it.kind === 'link' && it.href) window.open(it.href, '_blank');
    onClose();
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(filtered.length - 1, sel + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, sel - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); if (filtered[sel]) activate(filtered[sel]); }
    else if (e.key === 'Escape') onClose();
  }
</script>

{#if open}
  <div class="cd-palette-overlay" role="presentation" onclick={onClose}>
    <div class="cd-palette" role="dialog" aria-modal="true" onclick={(e) => e.stopPropagation()}>
      <div class="cd-palette-input-row">
        <span class="cd-prompt">›</span>
        <input
          bind:this={inputEl}
          class="cd-palette-input"
          value={q}
          oninput={(e) => { q = (e.target as HTMLInputElement).value; sel = 0; }}
          onkeydown={onKey}
          placeholder="search projects, links, files…"
          spellcheck={false}
          autocomplete="off"
        />
        <span class="cd-palette-kbd">esc</span>
      </div>
      <div class="cd-palette-list">
        {#if filtered.length === 0}
          <div class="cd-palette-empty">no matches.</div>
        {/if}
        {#each filtered as it, i}
          <div
            class="cd-palette-item"
            class:is-sel={i === sel}
            role="button"
            tabindex="0"
            onmouseenter={() => sel = i}
            onclick={() => activate(it)}
            onkeydown={(e) => e.key === 'Enter' && activate(it)}
          >
            <span class="cd-palette-kind cd-pk-{it.kind}">{it.kind}</span>
            <span class="cd-palette-label">{it.label}</span>
            <span class="cd-palette-hint">{it.hint}</span>
          </div>
        {/each}
      </div>
      <div class="cd-palette-foot">
        <span><kbd>↑↓</kbd> navigate</span>
        <span><kbd>↵</kbd> open</span>
        <span><kbd>esc</kbd> close</span>
      </div>
    </div>
  </div>
{/if}
