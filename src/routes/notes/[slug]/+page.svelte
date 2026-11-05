<script lang="ts">
  import { LINKS } from '$lib/data';
  let { data } = $props();
  const Content = data.content;
</script>

<svelte:head>
  <title>{data.metadata.title} · Ansh Verma</title>
  <meta name="description" content={data.metadata.excerpt} />
  <link rel="canonical" href="{LINKS.site}/notes/{data.slug}" />

  <meta property="og:type"        content="article" />
  <meta property="og:url"         content="{LINKS.site}/notes/{data.slug}" />
  <meta property="og:title"       content="{data.metadata.title} · Ansh Verma" />
  <meta property="og:description" content={data.metadata.excerpt} />
  <meta property="og:image"       content="{LINKS.site}/og.png" />

  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="{data.metadata.title} · Ansh Verma" />
  <meta name="twitter:description" content={data.metadata.excerpt} />
  <meta name="twitter:image"       content="{LINKS.site}/og.png" />
</svelte:head>

<Content />
