<script lang="ts">
  import { slide } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { PROJECTS, NOTES, CURRENTLY } from '$lib/data';
  const VISIBLE = PROJECTS.filter(p => !p.hidden);

  let {
    activeProj,
    mobileOpen = false,
    onSelectProj,
    onOpenPalette,
    onOpenProj,
    onOpenContact,
    onScrollTo,
  }: {
    activeProj: string | null;
    mobileOpen?: boolean;
    onSelectProj: (id: string) => void;
    onOpenPalette: () => void;
    onOpenProj: (id: string) => void;
    onOpenContact: () => void;
    onScrollTo: (section: string) => void;
  } = $props();

  // Folder open/close state
  let open = $state({
    root:       true,
    home:       true,
    work:       true,
    notes:      true,
    experience: true,
  });

  function toggle(key: keyof typeof open) {
    open[key] = !open[key];
  }
</script>

<aside class="cd-sidebar" class:is-open={mobileOpen}>
  <div class="cd-side-head">
    <span>EXPLORER</span>
    <button class="cd-side-kbd" onclick={onOpenPalette} title="Command palette">⌘K</button>
  </div>

  <div class="cd-tree">
    <!-- Root -->
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div class="cd-tree-folder" onclick={() => toggle('root')}>
      <span class="cd-arr" class:cd-arr-closed={!open.root}>▼</span> ansh.site
    </div>

    {#if open.root}
      <div transition:slide={{ duration: 200, easing: cubicOut }}>

        <!-- home -->
        <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
        <div class="cd-tree-folder cd-indent" onclick={() => toggle('home')}>
          <span class="cd-arr" class:cd-arr-closed={!open.home}>▼</span> home
        </div>
        {#if open.home}
          <div transition:slide={{ duration: 180, easing: cubicOut }}>
            <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
            <div class="cd-tree-file cd-indent2 is-active" onclick={() => onScrollTo('home')}>— hero.tsx</div>
            <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
            <div class="cd-tree-file cd-indent2" onclick={() => onScrollTo('home')}>— bio.md</div>
          </div>
        {/if}

        <!-- work -->
        <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
        <div class="cd-tree-folder cd-indent" onclick={() => toggle('work')}>
          <span class="cd-arr" class:cd-arr-closed={!open.work}>▼</span> work
        </div>
        {#if open.work}
          <div transition:slide={{ duration: 180, easing: cubicOut }}>
            {#each VISIBLE as p}
              <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
              <div
                class="cd-tree-file cd-indent2"
                class:is-active={activeProj === p.id}
                onclick={() => { onSelectProj(p.id); onOpenProj(p.id); }}
              >— {p.title}</div>
            {/each}
          </div>
        {/if}

        <!-- notes -->
        <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
        <div class="cd-tree-folder cd-indent" onclick={() => toggle('notes')}>
          <span class="cd-arr" class:cd-arr-closed={!open.notes}>▼</span> notes
        </div>
        {#if open.notes}
          <div transition:slide={{ duration: 180, easing: cubicOut }}>
            {#each NOTES.slice(0, 3) as n}
              <a class="cd-tree-file cd-indent2" href="/notes/{n.slug}">— {n.title.slice(0, 22)}…</a>
            {/each}
          </div>
        {/if}

        <!-- experience -->
        <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
        <div class="cd-tree-folder cd-indent" onclick={() => toggle('experience')}>
          <span class="cd-arr" class:cd-arr-closed={!open.experience}>▼</span> experience
        </div>
        {#if open.experience}
          <div transition:slide={{ duration: 180, easing: cubicOut }}>
            <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
            <div class="cd-tree-file cd-indent2" onclick={() => onScrollTo('experience')}>— Litt.log</div>
            <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
            <div class="cd-tree-file cd-indent2" onclick={() => onScrollTo('experience')}>— iiitd.log</div>
          </div>
        {/if}

        <!-- flat files under root -->
        <a class="cd-tree-file cd-indent" href="/resume.pdf" target="_blank" rel="noreferrer">— resume.pdf</a>
        <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
        <div class="cd-tree-file cd-indent" onclick={onOpenContact}>— contact.md</div>

      </div>
    {/if}
  </div>

  <div class="cd-side-head cd-side-head-2">CURRENTLY</div>
  <div class="cd-currently">
    {#each CURRENTLY as c}
      {#if c.link}
        <a class="cd-curr-row cd-curr-link" href={c.link} target="_blank" rel="noreferrer">
          <span class="cd-curr-v">{c.v}</span>
          <span class="cd-curr-text">{c.t}</span>
          <span class="cd-curr-arr">→</span>
        </a>
      {:else}
        <div class="cd-curr-row">
          <span class="cd-curr-v">{c.v}</span>
          <span>{c.t}</span>
        </div>
      {/if}
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
