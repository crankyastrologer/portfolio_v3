<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
  <title>Ansh Verma · AI/ML Engineer</title>
  <meta name="description" content="Portfolio of Ansh Verma — AI/ML engineer building eval frameworks, CUDA kernels, and agentic systems." />
  <link rel="canonical" href="https://ansh.site" />
  <meta name="theme-color" content="#1a1b26" />

  <!-- Open Graph -->
  <meta property="og:type"        content="website" />
  <meta property="og:url"         content="https://ansh.site" />
  <meta property="og:title"       content="Ansh Verma · AI/ML Engineer" />
  <meta property="og:description" content="Portfolio of Ansh Verma — AI/ML engineer building eval frameworks, CUDA kernels, and agentic systems." />
  <meta property="og:image"       content="https://ansh.site/og.png" />

  <!-- Twitter -->
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="Ansh Verma · AI/ML Engineer" />
  <meta name="twitter:description" content="Portfolio of Ansh Verma — AI/ML engineer building eval frameworks, CUDA kernels, and agentic systems." />
  <meta name="twitter:image"       content="https://ansh.site/og.png" />

  <!-- JSON-LD Person schema -->
  {@html `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Ansh Verma",
  "url": "https://ansh.site",
  "email": "ansh0verma@gmail.com",
  "jobTitle": "AI/ML Engineer",
  "sameAs": [
    "https://github.com/crankyastrologer",
    "https://www.linkedin.com/in/ansh-vermaai/"
  ]
}
<\/script>`}
</svelte:head>

{@render children()}
