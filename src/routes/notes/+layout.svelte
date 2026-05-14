<script lang="ts">
  import { page } from '$app/state';
  import { NOTES } from '$lib/data';
  let { children } = $props();

  let meta    = $derived((page.data as any)?.metadata as Record<string, string> | undefined);
  let slug    = $derived((page.data as any)?.slug as string | undefined);
  let others  = $derived(NOTES.filter(n => n.slug !== slug).slice(0, 3));
</script>

<div class="note-shell">
  <header class="note-nav">
    <a href="/" class="note-back">← ansh.site</a>
    {#if meta}
      <span class="note-bcrumb">
        <span class="note-dim">/ notes /</span>
        <span>{(page.data as any).slug}</span>
      </span>
    {/if}
  </header>

  <article class="note-article">
    {#if meta}
      <div class="note-meta">
        <span class="note-date">{meta.date}</span>
        <span class="note-tag">{meta.tag}</span>
      </div>
      <h1 class="note-title">{meta.title}</h1>
      {#if meta.excerpt}
        <p class="note-excerpt">{meta.excerpt}</p>
      {/if}
      <hr class="note-rule" />
    {/if}

    <div class="note-body">
      {@render children()}
    </div>
  </article>

  <footer class="note-footer">
    <hr class="note-rule" />

    <div class="note-byline">
      <span>ansh verma</span>
      {#if meta?.date}<span class="note-dim">· {meta.date}</span>{/if}
    </div>

    <a class="note-reply" href="mailto:ansh0verma@gmail.com?subject=re: {meta?.title ?? 'your note'}">
      thoughts? reply via email →
    </a>

    {#if others.length}
      <div class="note-more-head">more notes</div>
      <div class="note-more">
        {#each others as n}
          <a class="note-more-item" href="/notes/{n.slug}" data-sveltekit-preload-data="hover">
            <span class="note-tag">{n.tag}</span>
            <span class="note-more-title">{n.title}</span>
          </a>
        {/each}
      </div>
    {/if}

    <a href="/" class="note-back" style="margin-top: 32px; display: inline-block;">← ansh.site</a>
  </footer>
</div>
