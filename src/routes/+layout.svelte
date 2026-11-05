<script lang="ts">
	import '../app.css';
	import { LINKS } from '$lib/data';
	let { children } = $props();
</script>

<svelte:head>
  <title>Ansh Verma · ML Engineer</title>
  <meta name="description" content="Portfolio of Ansh Verma — ML engineer building LLM inference infrastructure, evaluation systems, and CUDA kernels." />
  <link rel="canonical" href={LINKS.site} />
  <meta name="theme-color" content="#1a1b26" />

  <!-- Open Graph -->
  <meta property="og:type"        content="website" />
  <meta property="og:url"         content={LINKS.site} />
  <meta property="og:title"       content="Ansh Verma · ML Engineer" />
  <meta property="og:description" content="Portfolio of Ansh Verma — ML engineer building LLM inference infrastructure, evaluation systems, and CUDA kernels." />
  <meta property="og:image"       content="{LINKS.site}/og.png" />

  <!-- Twitter -->
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="Ansh Verma · ML Engineer" />
  <meta name="twitter:description" content="Portfolio of Ansh Verma — ML engineer building LLM inference infrastructure, evaluation systems, and CUDA kernels." />
  <meta name="twitter:image"       content="{LINKS.site}/og.png" />

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
