<script lang="ts">
  let { data } = $props();
  const Content = data.content;
</script>

<svelte:head>
  <title>{data.metadata.title} · Ansh Verma</title>
  <meta name="description" content={data.metadata.excerpt} />
  <meta property="og:title"       content="{data.metadata.title} · Ansh Verma" />
  <meta property="og:description" content={data.metadata.excerpt} />
</svelte:head>

<Content />
