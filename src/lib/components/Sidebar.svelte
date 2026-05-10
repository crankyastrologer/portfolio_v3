<script lang="ts">
  import { PROJECTS, NOTES, CURRENTLY } from '$lib/data';

  let {
    activeProj,
    onSelectProj,
    onOpenPalette,
    onOpenProj,
    onOpenContact,
    onScrollTo,
  }: {
    activeProj: string | null;
    onSelectProj: (id: string) => void;
    onOpenPalette: () => void;
    onOpenProj: (id: string) => void;
    onOpenContact: () => void;
    onScrollTo: (section: string) => void;
  } = $props();
</script>

<aside class="cd-sidebar">
  <div class="cd-side-head">
    <span>EXPLORER</span>
    <button class="cd-side-kbd" onclick={onOpenPalette} title="Command palette">⌘K</button>
  </div>
  <div class="cd-tree">
    <div class="cd-tree-folder">▼ ansh.site</div>
    <div class="cd-tree-folder cd-indent">▼ home</div>
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div class="cd-tree-file cd-indent2 is-active" onclick={() => onScrollTo('home')}>— hero.tsx</div>
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div class="cd-tree-file cd-indent2" onclick={() => onScrollTo('home')}>— bio.md</div>
    <div class="cd-tree-folder cd-indent">▼ work</div>
    {#each PROJECTS as p}
      <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
      <div
        class="cd-tree-file cd-indent2"
        class:is-active={activeProj === p.id}
        onclick={() => { onSelectProj(p.id); onOpenProj(p.id); }}
      >— {p.title}</div>
    {/each}
    <div class="cd-tree-folder cd-indent">▼ notes</div>
    {#each NOTES.slice(0, 3) as n}
      <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
      <div class="cd-tree-file cd-indent2" onclick={() => onScrollTo('notes')}>— {n.title.slice(0, 22)}…</div>
    {/each}
    <div class="cd-tree-folder cd-indent">▼ experience</div>
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div class="cd-tree-file cd-indent2" onclick={() => onScrollTo('experience')}>— wasserstoff.log</div>
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div class="cd-tree-file cd-indent2" onclick={() => onScrollTo('experience')}>— iiitd.log</div>
    <a class="cd-tree-file cd-indent" href="/resume.pdf" target="_blank" rel="noreferrer">— resume.pdf</a>
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div class="cd-tree-file cd-indent" onclick={onOpenContact}>— contact.md</div>
  </div>

  <div class="cd-side-head cd-side-head-2">CURRENTLY</div>
  <div class="cd-currently">
    {#each CURRENTLY as c}
      <div class="cd-curr-row">
        <span class="cd-curr-v">{c.v}</span>
        <span>{c.t}</span>
      </div>
    {/each}
  </div>

  <div class="cd-side-head cd-side-head-2">LINKS</div>
  <div class="cd-links">
    <a href="https://github.com/crankyastrologer" target="_blank" rel="noreferrer">→ github.com/crankyastrologer</a>
    <a href="https://www.linkedin.com/in/ansh-vermaai/" target="_blank" rel="noreferrer">→ linkedin/ansh-vermaai</a>
    <a href="https://chat.ansh.site" target="_blank" rel="noreferrer">→ chat.ansh.site</a>
    <a href="mailto:ansh0verma@gmail.com">→ ansh0verma@gmail.com</a>
  </div>
</aside>
