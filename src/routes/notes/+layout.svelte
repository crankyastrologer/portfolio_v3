<script lang="ts">
  import { page } from '$app/state';
  let { children } = $props();

  let meta = $derived((page.data as any)?.metadata as Record<string, string> | undefined);
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
    <a href="/" class="note-back">← back to portfolio</a>
  </footer>
</div>
