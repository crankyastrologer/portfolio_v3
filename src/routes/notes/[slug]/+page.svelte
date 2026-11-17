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
  <meta property="og:site_name"   content="Ansh Verma" />
  <meta property="og:url"         content="{LINKS.site}/notes/{data.slug}" />
  <meta property="og:title"       content="{data.metadata.title} · Ansh Verma" />
  <meta property="og:description" content={data.metadata.excerpt} />
  <meta property="og:image"       content="{LINKS.site}/og.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt"   content={data.metadata.title} />
  <meta property="article:author" content="Ansh Verma" />

  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="{data.metadata.title} · Ansh Verma" />
  <meta name="twitter:description" content={data.metadata.excerpt} />
  <meta name="twitter:image"       content="{LINKS.site}/og.png" />
  <meta name="twitter:image:alt"   content={data.metadata.title} />
</svelte:head>

<Content />
