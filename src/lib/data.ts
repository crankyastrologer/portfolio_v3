export interface Metric {
  label: string;
  value: string;
  delta: string;
}

export interface Project {
  id: string;
  title: string;
  org: string;
  year: string;
  started: string;   // 'YYYY-MM'
  ended?: string;    // 'YYYY-MM' — omit if ongoing
  blurb: string;
  long: string[];
  stack: string[];
  metrics: Metric[];
  spark: number[];
  href: string;
  status: 'shipping' | 'live' | 'archived';
}

export interface Experience {
  co: string;
  role: string;
  when: string;
  location: string;
  bullets: string[];
}

export interface LogEntry {
  t: string;
  lvl: string;
  msg: string;
}

export interface Note {
  t: string;
  title: string;
  tag: string;
}

export interface CurrentlyItem {
  v: string;
  t: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'eval-agent',
    title: 'eval-agent',
    org: 'wasserstoff',
    year: '2026',
    started: '2026-01',
    blurb: 'judge-as-a-service · llm trace forensics',
    long: [
      'a high-fidelity "judge-as-a-service" framework that lets engineers do',
      'forensic archaeology on multi-agent llm execution traces. built on',
      'opentelemetry, with a dual-storage trace ecosystem: truncated jsons',
      'for sub-second retrieval, full-content archive for human review.',
      '',
      'pairs with an adversarial suite — distinguisher, proceduralist,',
      'shepardizer — that stress-tests agentic decision-making and surfaces',
      'logic divergences between model versions before they ship.',
    ],
    stack: ['otel', 'fastapi', 'qdrant', 'langchain', 'pydantic'],
    metrics: [
      { label: 'p50 retrieval', value: '420ms', delta: '−92%' },
      { label: 'spans/run', value: '128k', delta: 'searchable' },
      { label: 'divergences caught', value: '37', delta: 'shipped → blocked' },
    ],
    spark: [3,4,3,5,4,6,5,7,6,8,7,9,7,8,9,9,10,9,10,11],
    href: '#',
    status: 'shipping',
  },
  {
    id: 'gpt-2-cuda',
    title: 'gpt-2 · cuda',
    org: 'side-project',
    year: '2025',
    started: '2025-06',
    ended: '2025-09',
    blurb: 'transformer kernels in raw c++/cuda',
    long: [
      'a custom gpt-2 inference + training engine in c++/cuda, with',
      'transformer internals written as raw kernels — bypassing the',
      'overhead of high-level frameworks.',
      '',
      'coalesced memory access for layernorm and embeddings, parallel',
      'reduction kernels, a specialized attention transpose into head-',
      'contiguous layouts to minimize bus traffic, and grid-stride loops',
      'over gelu and vector adds for hardware-agnostic scaling.',
      '',
      'documented as a "kernel journal" mapping transformer math →',
      'thread-level execution.',
    ],
    stack: ['cuda', 'c++', 'pytorch'],
    metrics: [
      { label: 'tok/s @ 124M', value: '42k', delta: '+3.1×' },
      { label: 'mem latency', value: '−61%', delta: 'vs naïve' },
      { label: 'kernels written', value: '14', delta: 'documented' },
    ],
    spark: [2,2,3,3,4,5,5,6,7,8,8,9,9,9,10,10,10,11,11,11],
    href: 'https://github.com/crankyastrologer',
    status: 'archived',
  },
  {
    id: 'dineleap',
    title: 'dineleap',
    org: 'side-project',
    year: '2025',
    started: '2025-10',
    blurb: 'qr-ordering · live menu · realtime analytics',
    long: [
      'a qr-based ordering system shipped for a real restaurant. dynamic qr',
      'menus, robust api contracts (zod + openapi), redis-cached order +',
      'menu delivery for ultra-low latency.',
      '',
      'realtime analytics dashboards (sales, popular items) driven by mongo',
      'aggregations + cdn-optimized images.',
    ],
    stack: ['hono', 'redis', 'mongo', 'zod', 'cloudflare'],
    metrics: [
      { label: 'order TTI', value: '180ms', delta: '−67%' },
      { label: 'restaurants', value: '1', delta: 'pilot' },
      { label: 'menu render', value: 'edge', delta: 'cdn' },
    ],
    spark: [5,5,4,5,6,6,5,7,7,8,7,8,9,8,9,9,9,9,10,9],
    href: '#',
    status: 'live',
  },
  {
    id: 'browser-auto',
    title: 'browser-automation',
    org: 'wasserstoff',
    year: '2025',
    started: '2025-08',
    ended: '2025-12',
    blurb: 'vision + grounding on government portals',
    long: [
      'pioneered advanced browser automation on complex, javascript-heavy',
      'government portals by integrating vision + grounding models with',
      'playwright and pytorch.',
      '',
      'automates high-friction manual web workflows that defeat conventional',
      'selectors — the model literally looks at the page and decides where',
      'to click.',
    ],
    stack: ['playwright', 'pytorch', 'vlm', 'fastapi'],
    metrics: [
      { label: 'flow success', value: '94%', delta: '+41pp' },
      { label: 'steps/run', value: '~30', delta: 'autonomous' },
      { label: 'human handoff', value: '6%', delta: 'fallback' },
    ],
    spark: [4,4,5,5,6,6,7,7,7,8,8,8,9,9,9,9,10,10,10,11],
    href: '#',
    status: 'shipping',
  },
];

export const EXPERIENCE: Experience[] = [
  {
    co: 'wasserstoff',
    role: 'ai/ml engineer',
    when: 'jun 2025 — now',
    location: 'delhi, IN',
    bullets: [
      'architected eval-agent, a judge-as-a-service framework',
      'engineered dual-storage otel trace ecosystem',
      'built adversarial agent suite — distinguisher / proceduralist / shepardizer',
      'cut rec-chat ttfb from 5min → 20s via streaming structured llm output',
      'pioneered vision-grounded browser automation on gov portals',
    ],
  },
  {
    co: 'iiit delhi',
    role: 'research intern',
    when: 'jun 2023 — aug 2023',
    location: 'delhi, IN',
    bullets: [
      'deployed local server bridging supercomputer ↔ frontend',
      'rebuilt data pipeline → 5× faster website load',
      'shipped frontend features: filters, satellite-relative views',
      'set up local mongo + automated data mining',
    ],
  },
];

export const LOG_FEED: LogEntry[] = [
  { t: '08:42:11', lvl: 'INF', msg: 'shipped <span class="hi">eval-agent v0.7</span> · adversarial suite enabled' },
  { t: '08:42:14', lvl: 'OK ', msg: 'trace replay <span class="hi">128k spans</span> in 1.2s' },
  { t: '08:42:18', lvl: 'INF', msg: 'cuda kernel: gelu grid-stride · committed' },
  { t: '08:42:22', lvl: 'OK ', msg: 'rec chat ttfb <span class="hi">5m → 20s</span>' },
  { t: '08:42:27', lvl: 'INF', msg: 'wrote kernel-journal/14_attention_transpose.md' },
  { t: '08:42:31', lvl: 'WRN', msg: 'mongo replica lag 480ms — autoscaling triggered' },
  { t: '08:42:36', lvl: 'INF', msg: 'distinguisher caught divergence · gpt-4.1 vs sonnet-4.5' },
  { t: '08:42:40', lvl: 'OK ', msg: 'load time <span class="hi">−500%</span> on iiitd dashboard' },
  { t: '08:42:44', lvl: 'INF', msg: 'qdrant index rebuilt · 2.1M vectors' },
  { t: '08:42:48', lvl: 'OK ', msg: 'shepardizer found 3 logic gaps in legal flow' },
  { t: '08:42:52', lvl: 'INF', msg: 'pushed dineleap edge worker · cf' },
  { t: '08:42:55', lvl: 'OK ', msg: 'ci passed · <span class="hi">all 312 tests</span>' },
];

export const NOTES: Note[] = [
  { t: '2026.04', title: 'why i write cuda kernels by hand', tag: 'systems' },
  { t: '2026.03', title: 'judging an llm is a search problem', tag: 'eval' },
  { t: '2026.02', title: 'on logging at the trace level, not the request level', tag: 'otel' },
  { t: '2026.01', title: 'attention is a transpose', tag: 'systems' },
  { t: '2025.12', title: 'a kernel journal · ch. 1', tag: 'systems' },
];

export const CURRENTLY: CurrentlyItem[] = [
  { v: 'building', t: 'eval-agent v0.8 · adversarial coverage' },
  { v: 'reading', t: 'cuda c best practices guide' },
  { v: 'writing', t: 'kernel-journal · ch. 14' },
  { v: 'listening', t: 'tycho · simulcast' },
];

export function makeContribGraph(seed = 11): number[][] {
  const weeks = 52;
  const days = 7;
  const out: number[][] = [];
  let r = seed;
  const rand = () => { r = (r * 9301 + 49297) % 233280; return r / 233280; };
  for (let w = 0; w < weeks; w++) {
    const col: number[] = [];
    for (let d = 0; d < days; d++) {
      const recency = w / weeks;
      const weekday = d > 0 && d < 6 ? 0.25 : 0;
      const base = recency * 0.55 + weekday + rand() * 0.5 - 0.25;
      col.push(Math.max(0, Math.min(4, Math.round(base * 4))));
    }
    out.push(col);
  }
  return out;
}
