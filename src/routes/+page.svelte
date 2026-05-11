<script lang="ts">
  import { onMount } from 'svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import ProjectsList from '$lib/components/ProjectsList.svelte';
  import ContribPanel from '$lib/components/ContribPanel.svelte';
  import NotesPanel from '$lib/components/NotesPanel.svelte';
  import Rail from '$lib/components/Rail.svelte';
  import ProjectDetail from '$lib/components/ProjectDetail.svelte';
  import ContactModal from '$lib/components/ContactModal.svelte';
  import TechPanel from '$lib/components/TechPanel.svelte';
  import Palette from '$lib/components/Palette.svelte';
  import Pulse from '$lib/components/Pulse.svelte';

  // Theme / tweaks
  let accent = $state('#7CE38B');
  let density = $state<'compact' | 'regular' | 'spacious'>('regular');
  let showContrib = $state(true);
  let railSide = $state<'right' | 'hidden'>('right');
  let accentPickerOpen = $state(false);

  const ACCENTS = [
    { hex: '#7CE38B', name: 'green'  },
    { hex: '#61AFEF', name: 'blue'   },
    { hex: '#E5C07B', name: 'amber'  },
    { hex: '#C678DD', name: 'purple' },
    { hex: '#E06C75', name: 'red'    },
    { hex: '#56B6C2', name: 'cyan'   },
    { hex: '#FF9F43', name: 'orange' },
    { hex: '#FFFFFF', name: 'white'  },
  ];

  const DENSITY = {
    compact:  { fz: '11.5px', pad: '22px', gap: '10px' },
    regular:  { fz: '12.5px', pad: '28px', gap: '12px' },
    spacious: { fz: '13.5px', pad: '36px', gap: '16px' },
  };
  let d = $derived(DENSITY[density] ?? DENSITY.regular);

  // App state
  let activeProj = $state('eval-agent');
  let openProj = $state<string | null>(null);
  let paletteOpen = $state(false);
  let now = $state(new Date());
  let activeTab = $state<'home' | 'work' | 'notes' | 'contact'>('home');
  let contactOpen = $state(false);
  let activeTech  = $state<string | null>(null);
  let mobileSidebarOpen = $state(false);
  let mobileRailOpen    = $state(false);

  function gotoTab(tab: 'home' | 'work' | 'notes' | 'contact') {
    mobileSidebarOpen = false;
    if (tab === 'contact') {
      contactOpen = true;
      return;
    }
    activeTab = tab;
    document.getElementById(`section-${tab}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onMount(() => {
    const clockId = setInterval(() => { now = new Date(); }, 1000);
    return () => clearInterval(clockId);
  });

  function onGlobalKey(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      paletteOpen = !paletteOpen;
    }
    if (e.key === 'Escape') {
      paletteOpen = false;
      openProj = null;
      contactOpen = false;
      activeTech  = null;
      accentPickerOpen = false;
      mobileSidebarOpen = false;
      mobileRailOpen    = false;
    }
  }

  let dateStr = $derived(
    now.toLocaleString('en-US', { weekday: 'short', day: '2-digit', month: 'short' })
  );
  let timeStr = $derived(
    now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata' })
  );
</script>

<svelte:window onkeydown={onGlobalKey} />

<div
  class="cd-root"
  class:cd-rail-hidden={railSide === 'hidden'}
  style="--cd-accent: {accent}; --cd-fz: {d.fz}; --cd-pad: {d.pad}; --cd-gap: {d.gap}"
>
  <!-- Titlebar -->
  <header class="cd-titlebar">
    <div class="cd-tb-left">
      <span class="cd-app-mark">⌥</span>
      <span class="cd-bcrumb">
        <button class="cd-bcrumb-link" onclick={() => gotoTab('home')}>ansh</button>
        <span class="cd-dim"> / </span>
        <button class="cd-bcrumb-link" onclick={() => gotoTab('home')}>portfolio</button>
        <span class="cd-dim"> / </span>
        <span class="cd-fg">{{ home: 'home.tsx', work: 'work.json', notes: 'notes/', contact: 'contact.md' }[activeTab]}</span>
      </span>
    </div>
    <div class="cd-tb-mid">
      <div class="cd-tab" class:cd-tab-active={activeTab === 'home'} onclick={() => gotoTab('home')} role="tab" tabindex="0" onkeydown={(e) => e.key === 'Enter' && gotoTab('home')}>home.tsx</div>
      <div class="cd-tab" class:cd-tab-active={activeTab === 'work'} onclick={() => gotoTab('work')} role="tab" tabindex="0" onkeydown={(e) => e.key === 'Enter' && gotoTab('work')}>work.json</div>
      <div class="cd-tab" class:cd-tab-active={activeTab === 'notes'} onclick={() => gotoTab('notes')} role="tab" tabindex="0" onkeydown={(e) => e.key === 'Enter' && gotoTab('notes')}>notes/</div>
      <div class="cd-tab" class:cd-tab-active={activeTab === 'contact'} onclick={() => gotoTab('contact')} role="tab" tabindex="0" onkeydown={(e) => e.key === 'Enter' && gotoTab('contact')}>contact.md</div>
    </div>
    <div class="cd-tb-right">
      <button class="cd-tb-search" onclick={() => paletteOpen = true}>
        <span>⌕ search</span>
        <span class="cd-kbd">⌘K</span>
      </button>
      <div class="cd-accent-wrap">
        <button
          class="cd-accent-btn"
          style="--swatch: {accent}"
          onclick={() => accentPickerOpen = !accentPickerOpen}
          title="accent color"
          aria-label="choose accent color"
        ></button>
        {#if accentPickerOpen}
          <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
          <div class="cd-accent-backdrop" onclick={() => accentPickerOpen = false}></div>
          <div class="cd-accent-picker">
            <div class="cd-accent-picker-label">accent</div>
            <div class="cd-accent-swatches">
              {#each ACCENTS as a}
                <button
                  class="cd-accent-swatch"
                  class:is-active={accent.toLowerCase() === a.hex.toLowerCase()}
                  style="--swatch: {a.hex}"
                  onclick={() => { accent = a.hex; accentPickerOpen = false; }}
                  title={a.name}
                  aria-label={a.name}
                ></button>
              {/each}
            </div>
          </div>
        {/if}
      </div>
      <span class="cd-tb-status"><Pulse /> build · pass</span>
      <button class="cd-hamburger" onclick={() => mobileSidebarOpen = !mobileSidebarOpen} aria-label="toggle sidebar">☰</button>
      <button class="cd-hamburger cd-rail-toggle" onclick={() => mobileRailOpen = !mobileRailOpen} aria-label="toggle activity rail">⌥</button>
    </div>
  </header>

  <!-- Mobile sidebar backdrop -->
  {#if mobileSidebarOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div class="cd-sidebar-backdrop" onclick={() => mobileSidebarOpen = false}></div>
  {/if}
  <!-- Mobile rail backdrop -->
  {#if mobileRailOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div class="cd-sidebar-backdrop" onclick={() => mobileRailOpen = false}></div>
  {/if}

  <!-- Main grid -->
  <div class="cd-grid">
    <Sidebar
      {activeProj}
      mobileOpen={mobileSidebarOpen}
      onSelectProj={(id) => activeProj = id}
      onOpenPalette={() => paletteOpen = true}
      onOpenProj={(id) => { openProj = id; mobileSidebarOpen = false; }}
      onOpenContact={() => { contactOpen = true; mobileSidebarOpen = false; }}
      onScrollTo={(section) => { document.getElementById(`section-${section}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); mobileSidebarOpen = false; }}
    />

    <main class="cd-main">
      <div id="section-home"><Hero /></div>
      <div id="section-work">
        <ProjectsList
          {activeProj}
          onSelectProj={(id) => activeProj = id}
          onOpenProj={(id) => openProj = id}
        />
      </div>
      {#if showContrib}
        <ContribPanel onOpenProj={(id) => openProj = id} />
      {/if}
      <div id="section-notes"><NotesPanel /></div>
    </main>

    {#if railSide !== 'hidden'}
      <Rail {now} mobileOpen={mobileRailOpen} onSelectTech={(t) => { activeTech = t; mobileRailOpen = false; }} />
    {/if}
  </div>

  <!-- Statusbar -->
  <footer class="cd-statusbar">
    <div class="cd-sb-left">
      <span class="cd-sb-pill">main</span>
      <span>↑ 0  ↓ 0</span>
      <span class="cd-dim">·</span>
      <span>UTF-8</span>
      <span class="cd-dim">·</span>
      <span>LF</span>
      <span class="cd-dim">·</span>
      <span>tsx</span>
    </div>
    <div class="cd-sb-mid cd-dim">
      <span>
        {#if paletteOpen}
          ↑↓ navigate &nbsp;·&nbsp; ↵ open &nbsp;·&nbsp; esc close
        {:else if openProj || contactOpen || activeTech}
          esc to close
        {:else}
          ⌘K to search
        {/if}
      </span>
    </div>
    <div class="cd-sb-right">
      <span class="cd-dim">delhi</span>
      <span>{dateStr}</span>
      <span class="cd-dim">·</span>
      <span>{timeStr}</span>
      <span class="cd-dim">·</span>
      <span class="cd-sb-pill cd-sb-pill-ok">online</span>
    </div>
  </footer>

  <!-- Mobile bottom nav -->
  <nav class="cd-mobile-nav">
    <button class:is-active={activeTab === 'home'}  onclick={() => gotoTab('home')}>home.tsx</button>
    <button class:is-active={activeTab === 'work'}  onclick={() => gotoTab('work')}>work</button>
    <button class:is-active={activeTab === 'notes'} onclick={() => gotoTab('notes')}>notes/</button>
    <button onclick={() => gotoTab('contact')}>contact</button>
    <button class:is-active={mobileSidebarOpen} onclick={() => mobileSidebarOpen = !mobileSidebarOpen}>files</button>
  </nav>

  <!-- Overlays -->
  <ProjectDetail projId={openProj} onClose={() => openProj = null} />
  <ContactModal open={contactOpen} onClose={() => contactOpen = false} />
  <TechPanel tech={activeTech} onClose={() => activeTech = null} onOpenProj={(id) => { openProj = id; activeTech = null; }} />
  <Palette
    open={paletteOpen}
    onClose={() => paletteOpen = false}
    onOpenProj={(id) => { openProj = id; paletteOpen = false; }}
  />
</div>
