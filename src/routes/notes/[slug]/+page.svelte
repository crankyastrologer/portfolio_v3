<script lang="ts">
  let { data } = $props();
</script>

<svelte:head>
  <title>{data.metadata.title} · Ansh Verma</title>
  <meta name="description" content={data.metadata.excerpt} />
  <meta property="og:title"       content="{data.metadata.title} · Ansh Verma" />
  <meta property="og:description" content={data.metadata.excerpt} />
</svelte:head>

<svelte:component this={data.content} />
