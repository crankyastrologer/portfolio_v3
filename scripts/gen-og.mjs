import { Resvg } from '@resvg/resvg-js';
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'static', 'og.png');

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <style>
      .mono { font-family: 'JetBrains Mono', 'Fira Mono', 'Consolas', 'Courier New', monospace; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="#1a1b26"/>

  <!-- Left accent bar -->
  <rect x="60" y="80" width="4" height="470" fill="#7CE38B" opacity="0.8"/>

  <!-- Faint watermark "A" -->
  <text x="1100" y="520" class="mono"
        font-size="360" font-weight="700"
        fill="#7CE38B" opacity="0.04"
        text-anchor="middle">A</text>

  <!-- Prompt decoration -->
  <text x="88" y="138" class="mono" font-size="16" fill="#7CE38B" opacity="0.7">~/portfolio</text>
  <text x="88" y="166" class="mono" font-size="16" fill="#565f89">$ cat about.md</text>

  <!-- Name -->
  <text x="88" y="280" class="mono" font-size="72" font-weight="700" fill="#c0caf5">Ansh Verma</text>

  <!-- Title -->
  <text x="88" y="348" class="mono" font-size="32" fill="#7CE38B">AI/ML Engineer</text>

  <!-- Tagline -->
  <text x="88" y="408" class="mono" font-size="19" fill="#565f89">eval frameworks · CUDA kernels · agentic systems</text>

  <!-- URL pill -->
  <rect x="86" y="468" width="240" height="44" rx="6" fill="#1f2335" stroke="#7CE38B" stroke-width="1.5" stroke-opacity="0.5"/>
  <text x="206" y="496" class="mono" font-size="17" fill="#7CE38B" text-anchor="middle">ansh.site</text>

  <!-- Bottom accent -->
  <rect x="0" y="614" width="1200" height="16" fill="#7CE38B" opacity="0.12"/>
  <rect x="0" y="624" width="1200" height="6"  fill="#7CE38B" opacity="0.25"/>
</svg>
`.trim();

const resvg = new Resvg(svg, {
	fitTo: { mode: 'width', value: 1200 },
	font: { loadSystemFonts: true },
});
const png = resvg.render().asPng();

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, png);
console.log(`✓ og.png written → ${OUT}  (${png.byteLength} bytes)`);
