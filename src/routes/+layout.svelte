<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { LINKS } from '$lib/data';
	let { children } = $props();
	const isNote = $derived(page.url.pathname.startsWith('/notes/'));
</script>

<svelte:head>
  <meta name="theme-color" content="#1a1b26" />

  {#if !isNote}
    <title>Ansh Verma · ML Engineer</title>
    <meta name="description" content="Portfolio of Ansh Verma — ML engineer building LLM inference infrastructure, evaluation systems, and CUDA kernels." />
    <link rel="canonical" href={LINKS.site} />

    <!-- Open Graph -->
    <meta property="og:type"        content="website" />
    <meta property="og:site_name"   content="Ansh Verma" />
    <meta property="og:url"         content={LINKS.site} />
    <meta property="og:title"       content="Ansh Verma · ML Engineer" />
    <meta property="og:description" content="Portfolio of Ansh Verma — ML engineer building LLM inference infrastructure, evaluation systems, and CUDA kernels." />
    <meta property="og:image"       content="{LINKS.site}/og.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt"   content="Ansh Verma · ML Engineer" />

    <!-- Twitter -->
    <meta name="twitter:card"        content="summary_large_image" />
    <meta name="twitter:title"       content="Ansh Verma · ML Engineer" />
    <meta name="twitter:description" content="Portfolio of Ansh Verma — ML engineer building LLM inference infrastructure, evaluation systems, and CUDA kernels." />
    <meta name="twitter:image"       content="{LINKS.site}/og.png" />
    <meta name="twitter:image:alt"   content="Ansh Verma · ML Engineer" />
  {/if}

  <!-- JSON-LD Person schema -->
  {@html `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Ansh Verma",
  "url": "${LINKS.site}",
  "email": "${LINKS.email}",
  "jobTitle": "ML Engineer",
  "sameAs": [
    "${LINKS.github}",
    "${LINKS.linkedin}"
  ]
}
<\/script>`}
</svelte:head>

{@render children()}
