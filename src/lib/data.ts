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
  hidden?: boolean;  // hidden from main list/sidebar/gantt; still searchable via stack pills
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
  slug: string;
}

export interface CurrentlyItem {
  v: string;
  t: string;
  link?: string;
}

// Single source of truth for external links — update here, not in components.
export const LINKS = {
  site:     'https://ansh.site',
  email:    'ansh0verma@gmail.com',
  resume:   'https://drive.google.com/file/d/1OB3zlnOW6wqRZhWNKx3buR2sbYaEM1Zd/view',
  github:   'https://github.com/crankyastrologer',
  linkedin: 'https://www.linkedin.com/in/ansh-vermaai/',
  jeva:     'https://github.com/crankyastrologer/Jeva',
  inference:'https://github.com/crankyastrologer/inference_server',
} as const;

export const PROJECTS: Project[] = [
  {
    id: 'llm-inference',
    title: 'llm-inference',
    org: 'side-project',
    year: '2026',
    started: '2026-08',
    blurb: 'from-scratch inference server · paged kv · continuous batching',
    long: [
      'building an llm inference server from scratch to understand why vllm',
      'behaves the way it does in production — the memory and scheduling layer,',
      'not the model.',
      '',
      'target: serve qwen2.5 (0.5b/1.5b) behind an openai-compatible streaming',
      'api, manage the kv cache in fixed-size blocks with a real allocator, run',
      'continuous batching with recompute-based preemption under memory pressure,',
      'and use a hand-written cuda paged-attention decode kernel (gqa-aware,',
      'online softmax).',
      '',
      'built so far: a poisson-arrival load generator with ttft / itl / e2e /',
      'goodput-under-slo metrics, and a golden-activation harness that diffs a',
      'from-scratch transformer forward pass against huggingface one internal',
      'stage at a time.',
      '',
      'benchmarked on a single rtx 4060 (8gb) against hf generate, static',
      'batching, continuous batching, paged kv, and real vllm.',
    ],
    stack: ['python', 'pytorch', 'cuda', 'fastapi', 'uv'],
    metrics: [
      { label: 'kv cache', value: 'paged', delta: 'fixed-size blocks' },
      { label: 'batching', value: 'continuous', delta: 'recompute preempt' },
      { label: 'decode kernel', value: 'hand-written', delta: 'gqa · online softmax' },
    ],
    spark: [2,3,3,4,5,5,6,6,7,8,8,9,9,10,10,11,11,11,12,12],
    href: LINKS.inference,
    status: 'shipping',
  },
  {
    id: 'jevad',
    title: 'jevad · jeva-4b',
    org: 'open-source',
    year: '2026',
    started: '2026-09',
    blurb: 'openai-compatible inference server · system one decisions',
    long: [
      'an openai-compatible inference service for jeva-4b, a single-pass system',
      'one decision model: /v1/decide, /v1/rank and chat/completions endpoints,',
      'sse streaming, bearer auth, prometheus metrics, and a request queue with',
      '429/504 backpressure.',
      '',
      'fit the 8.8 gb bf16 model onto an 8 gb rtx 4060 by adding 4-bit/8-bit',
      '(bitsandbytes nf4) quantization to the library: 3.6 gib vram and about',
      '130 ms per 3-question request.',
      '',
      'cut latency 2.0–2.7× with within-request batching and from 262 ms to',
      '10 ms on exact repeats with state, option and set caching; added',
      'option-bank priming so later requests encode zero option tokens.',
      '',
      'benchmarked each optimization and rejected the ones that hurt, such as',
      'torch.compile on the head (370 ms vs 262 ms). refactored the app from',
      '495 to 41 lines behind routers, with 12 golden http responses and 30',
      'tests. built in personal time at a reading group’s request, open-sourced',
      'with manager approval, and piloted with several clients.',
    ],
    stack: ['python', 'pytorch', 'fastapi', 'bitsandbytes', 'cuda'],
    metrics: [
      { label: 'vram', value: '3.6 GiB', delta: '4-bit nf4' },
      { label: 'latency', value: '~130ms', delta: '3 questions' },
      { label: 'exact repeats', value: '262→10ms', delta: 'cached' },
    ],
    spark: [4,5,5,6,7,7,8,8,9,9,10,10,10,11,11,11,11,12,12,12],
    href: LINKS.jeva,
    status: 'live',
  },
  {
    id: 'prompt-studio',
    title: 'prompt-studio',
    org: 'LivePerson',
    year: '2026',
    started: '2026-08',
    blurb: 'llm migration platform · judge parity · auto-rewrite',
    long: [
      'an internal platform (next.js + fastapi monorepo) that migrates client',
      'prompts and conversational flows between llms, using llm-as-a-judge',
      'against a user-set parity goal — by default, the new model must match',
      'or beat the old on at least 80% of cases — replacing roughly a day of',
      'manual testing per migration.',
      '',
      'implemented parity checks across configurable metrics, with ai-assisted',
      'metric selection and synthetic dataset generation, plus an automated',
      'loop that rewrites prompts for the target model until the quality goal',
      'is met.',
      '',
      'integrated with internal tools to import and export flows and prompts,',
      'and exposed per-model configuration for tuning generation behavior.',
    ],
    stack: ['next', 'fastapi', 'python', 'typescript', 'llm-judge'],
    metrics: [
      { label: 'manual testing', value: '~1 day', delta: 'saved / migration' },
      { label: 'parity goal', value: '≥80%', delta: 'judge-scored' },
      { label: 'rewrite loop', value: 'automatic', delta: 'until goal' },
    ],
    spark: [3,4,4,5,6,7,8,8,9,10,10,11,11,11,12,12,12,12,13,13],
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
    blurb: 'gpt-2 small from scratch · c++/cuda kernels',
    long: [
      'a gpt-2 small (124m-param) training/inference engine in c++ and cuda,',
      'implementing every transformer operation outside cublas gemms as raw',
      'kernels — embeddings, layernorm, fused causal softmax, gelu, attention',
      'transposes, adamw — with no high-level framework.',
      '',
      'a shared-memory tiled transpose with bank-conflict-free padding (32×33',
      'tiles) runs 3.4× faster than the naïve version at 768×768, lifting',
      'achieved memory bandwidth from ~93 gb/s to ~316 gb/s (saturating the',
      'rtx 4060’s dram bandwidth).',
      '',
      'a fused causal-masked softmax benchmarks 4.1× faster than pytorch at',
      'gpt-2 scale (seq=1024) by collapsing masking, 1/√d scaling, and the',
      'numerically-stable softmax into a single coalesced pass.',
      '',
      'optimized throughput via coalesced access patterns, parallel-reduction',
      'kernels (layernorm/softmax), and grid-stride loops across sms. validated',
      'every kernel against pytorch with a reproducible cuda-event harness',
      '(10 warmup + 100 timed iters, fp32).',
    ],
    stack: ['cuda', 'c++', 'pytorch'],
    metrics: [
      { label: 'transpose', value: '3.4×', delta: '32×33 tiling' },
      { label: 'fused softmax', value: '4.1×', delta: 'vs pytorch' },
      { label: 'bandwidth', value: '316 GB/s', delta: '~93 → 316' },
    ],
    spark: [2,2,3,3,4,5,5,6,7,8,8,9,9,9,10,10,10,11,11,11],
    href: 'https://github.com/crankyastrologer/gpt2_from_scratch',
    status: 'live',
  },
  {
    id: 'eval-agent',
    title: 'eval-agent',
    org: 'Litt',
    year: '2026',
    started: '2026-01',
    ended: '2026-06',
    blurb: 'judge-as-a-service · llm trace forensics',
    long: [
      'a high-fidelity "judge-as-a-service" framework that scores multi-agent',
      'llm workflows on hallucination vs groundedness, agent handoff quality,',
      'and tool-use behavior — cutting evaluation time from days to hours.',
      '',
      'built on opentelemetry with a dual-storage trace ecosystem: truncated',
      'jsons for sub-second retrieval, full-content archive for human review.',
      '',
      'built the benchmarking dashboard for the harness (streamlit, plotly):',
      'a/b comparison of versioned agent runs with judge win rates, cost-quality',
      'pareto frontiers, tool-usage divergence diffs, and arize phoenix trace',
      'integration.',
      '',
      'pairs with an adversarial suite — distinguisher, proceduralist,',
      'shepardizer — that stress-tests agentic decision-making and surfaces',
      'logic divergences between model versions before they ship.',
    ],
    stack: ['otel', 'fastapi', 'qdrant', 'langchain', 'pydantic', 'streamlit'],
    metrics: [
      { label: 'p50 retrieval', value: '420ms', delta: '−92%' },
      { label: 'spans/run', value: '128k', delta: 'searchable' },
      { label: 'divergences caught', value: '37', delta: 'shipped → blocked' },
    ],
    spark: [3,4,3,5,4,6,5,7,6,8,7,9,7,8,9,9,10,9,10,11],
    href: '#',
    status: 'live',
  },
  {
    id: 'dineleap',
    title: 'dineleap',
    org: 'Dineleap',
    year: '2024',
    started: '2024-09',
    ended: '2024-12',
    blurb: 'qr-ordering · live menu · realtime analytics',
    long: [
      'co-built and shipped a qr-based restaurant ordering system (hono,',
      'mongodb, redis), piloted live at multiple restaurants with dynamic',
      'qr-code menus.',
      '',
      'shipped type-safe apis (zod, openapi) with redis caching for low-latency',
      'ordering, plus real-time sales and popular-item analytics with',
      'cdn-backed image optimization.',
    ],
    stack: ['hono', 'redis', 'mongo', 'zod', 'cloudflare'],
    metrics: [
      { label: 'restaurants', value: 'multiple', delta: 'live pilot' },
      { label: 'order TTI', value: '180ms', delta: '−67%' },
      { label: 'menu render', value: 'edge', delta: 'cdn' },
    ],
    spark: [5,5,4,5,6,6,5,7,7,8,7,8,9,8,9,9,9,9,10,9],
    href: '#',
    status: 'archived',
  },
  {
    id: 'browser-auto',
    title: 'browser-automation',
    org: 'Litt',
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
    status: 'archived',
    hidden: true,
  },
  {
    id: 'llm-from-scratch',
    title: 'llm-from-scratch',
    org: 'side-project',
    year: '2025',
    started: '2025-03',
    ended: '2025-06',
    blurb: 'full transformer · trained on open webtext',
    long: [
      'designed and trained a GPT-style language model end-to-end, following',
      '"attention is all you need" and Karpathy\'s nanoGPT lineage.',
      '',
      'trained on the Open WebText corpus using PyTorch DirectML — routing',
      'through AMD GPU compute without CUDA, which meant hand-rolling',
      'workarounds for unsupported ops and tuning the data pipeline',
      'to keep the GPU saturated.',
      '',
      'full pipeline: tokenisation → batching → training loop →',
      'checkpoint → inference. documented as a learning artefact.',
    ],
    stack: ['pytorch', 'directml', 'python', 'transformers'],
    metrics: [
      { label: 'corpus', value: '8GB', delta: 'open webtext' },
      { label: 'params', value: '~117M', delta: 'gpt-style' },
      { label: 'pipeline', value: 'e2e', delta: 'train → infer' },
    ],
    spark: [1,2,2,3,4,4,5,6,6,7,8,8,9,9,10,10,10,11,10,10],
    href: 'https://github.com/crankyastrologer/LLM_from_scratch',
    status: 'archived',
    hidden: true,
  },
  {
    id: 'rust-webserver',
    title: 'rust-webserver',
    org: 'side-project',
    year: '2025',
    started: '2025-01',
    ended: '2025-02',
    blurb: 'multithreaded http server · zero deps',
    long: [
      'a multithreaded HTTP/1.1 server written in Rust with no external',
      'web-framework dependencies — just the standard library.',
      '',
      'thread pool with bounded work queue, graceful shutdown via channel',
      'signalling, and a custom request parser. built to internalise Rust\'s',
      'ownership model under real concurrent load rather than toy examples.',
      '',
      'exercises: arc/mutex sharing across threads, channel-based task',
      'dispatch, and lifetime management across async boundaries.',
    ],
    stack: ['rust', 'threading', 'tcp/ip'],
    metrics: [
      { label: 'deps', value: '0', delta: 'stdlib only' },
      { label: 'concurrency', value: 'thread pool', delta: 'bounded queue' },
      { label: 'shutdown', value: 'graceful', delta: 'channel signal' },
    ],
    spark: [5,6,7,8,9,10,10,11,10,10,9,9,8,8,8,7,7,6,6,5],
    href: 'https://github.com/crankyastrologer/Rust_multithreaded_webserver',
    status: 'archived',
    hidden: true,
  },
  {
    id: 'chatbot-theme',
    title: 'chatbot-theme-id',
    org: 'side-project',
    year: '2025',
    started: '2025-07',
    ended: '2025-09',
    blurb: 'theme extraction · svelte + python · full-stack',
    long: [
      'full-stack chatbot that classifies conversational themes in real time.',
      'svelte frontend streams responses via SSE; python backend runs a',
      'fine-tuned classifier over sliding context windows.',
      '',
      'the interesting bit: theme labels are injected back into the context',
      'so the LLM can steer its own tone — a lightweight form of',
      'self-conditioning without re-training.',
    ],
    stack: ['svelte', 'python', 'fastapi', 'nlp'],
    metrics: [
      { label: 'latency', value: 'streaming', delta: 'SSE' },
      { label: 'themes', value: '12', delta: 'classified' },
      { label: 'arch', value: 'full-stack', delta: 'svelte + py' },
    ],
    spark: [3,4,5,5,6,7,7,8,8,9,9,10,10,10,9,9,9,8,8,8],
    href: 'https://github.com/crankyastrologer/chatbot-theme-identifier',
    status: 'archived',
    hidden: true,
  },
  {
    id: 'rag-chain',
    title: 'rag-chain',
    org: 'side-project',
    year: '2025',
    started: '2025-04',
    ended: '2025-06',
    blurb: 'retrieval-augmented generation · semantic search',
    long: [
      'a RAG pipeline with semantic chunking, embedding via sentence-transformers,',
      'and retrieval over a qdrant vector store.',
      '',
      'query rewriting + re-ranking pass before generation to improve',
      'answer faithfulness over long documents.',
    ],
    stack: ['python', 'qdrant', 'langchain', 'fastapi'],
    metrics: [
      { label: 'retrieval', value: 'semantic', delta: 'top-k=5' },
      { label: 'rerank', value: 'cross-enc', delta: 'faithfulness' },
      { label: 'latency', value: '~800ms', delta: 'e2e' },
    ],
    spark: [3,4,5,6,7,8,8,9,9,10,9,9,8,8,7,7,6,6,5,5],
    href: 'https://github.com/crankyastrologer/RAG_chain_backend',
    status: 'archived',
    hidden: true,
  },
  {
    id: 'news-app',
    title: 'news-app',
    org: 'side-project',
    year: '2024',
    started: '2024-06',
    ended: '2024-08',
    blurb: 'svelte news aggregator · graphql · hygraph cms',
    long: [
      'a news aggregation frontend built with svelte, pulling content from',
      'a hygraph headless CMS over graphql.',
      '',
      'cdn-optimised images via uploadthing, deployed on vercel with',
      'edge caching for near-instant loads.',
    ],
    stack: ['svelte', 'graphql', 'typescript', 'vercel'],
    metrics: [
      { label: 'cms', value: 'hygraph', delta: 'graphql' },
      { label: 'deploy', value: 'vercel', delta: 'edge cache' },
      { label: 'ttfb', value: '<100ms', delta: 'cdn' },
    ],
    spark: [4,5,5,6,6,7,7,8,8,8,7,7,6,6,6,5,5,5,4,4],
    href: 'https://github.com/crankyastrologer/NewsApp',
    status: 'archived',
    hidden: true,
  },
  {
    id: 'orbital-sim',
    title: 'orbital-sim',
    org: 'iiit delhi',
    year: '2023',
    started: '2023-06',
    ended: '2023-08',
    blurb: 'satellite collision sim · norad ingestion · web frontend',
    long: [
      'built local server middleware exposing satellite trajectory prediction',
      'and collision simulation from a supercomputer to a web frontend.',
      '',
      'reduced simulation load by 70% by pruning decayed debris from NORAD',
      'data, optimizing simulation step granularity, and deferring renders',
      'until full data load.',
      '',
      'automated a daily ingestion pipeline pulling from NORAD and other',
      'agencies, storing incremental diffs to handle inconsistent debris',
      'tracking across sources. redesigned the frontend with color-coded',
      'debris classification and rebuilt the search UX.',
    ],
    stack: ['python', 'numpy', 'mongo', 'flask'],
    metrics: [
      { label: 'sim load', value: '−70%', delta: 'vs baseline' },
      { label: 'ingestion', value: 'daily', delta: 'incremental diffs' },
      { label: 'pipeline', value: 'automated', delta: 'norad' },
    ],
    spark: [5,6,7,8,9,9,10,10,9,8,8,7,7,6,6,5,5,4,4,4],
    href: '#',
    status: 'archived',
    hidden: true,
  },
];

export const EXPERIENCE: Experience[] = [
  {
    co: 'LivePerson',
    role: 'dsml 1',
    when: 'aug 2026 — now',
    location: 'gurugram, IN',
    bullets: [
      'built prompt studio — llm prompt/flow migration platform (next.js + fastapi) using llm-as-a-judge parity, replacing ~1 day of manual testing per migration',
      'implemented configurable parity metrics, ai-assisted metric selection, synthetic datasets, and an auto-rewrite loop until a quality goal is met',
      'audited inference infra (grafana, k8s, gpu, istio): found tgi could not switch requests during prefill, causing ~82× error-rate cascades; shut down ~3 idle models/zone (~half of capacity)',
      'benchmarked vllm on production gpus and wrote the tgi → vllm migration code (rollout in progress)',
      'built and open-sourced, with manager approval, an inference server for jeva, an open-source system one decision model — piloted with several clients',
    ],
  },
  {
    co: 'Litt',
    role: 'ai/ml engineer',
    when: 'jun 2025 — jun 2026',
    location: 'delhi, IN',
    bullets: [
      'built judge-as-a-service, an llm-as-a-judge eval framework scoring multi-agent workflows on hallucination vs groundedness, handoff quality, and tool use — cutting eval time days → hours',
      'built the benchmarking dashboard (streamlit, plotly): a/b judge win rates, cost-quality pareto frontiers, tool-usage divergence diffs, arize phoenix traces',
      'digitized ~50k supreme court cases via a gpu-parallel pipeline; structured metadata powered hybrid rag + mongodb search',
      'designed a 3-phase chronology extraction pipeline (duckling → vllm slm → llm merge/dedup), cutting cost ~10× from $15 to $2 per 5m-token document',
      'owned the data pipeline for a dubai credit-card recommendation platform (~100k offers) with llm-driven metadata extraction for rag + faceted filtering',
      'cut recommendation chat latency 5min → 20s by redesigning structured llm response streaming',
      'built browser agents on government portals combining vision + grounding models with playwright',
      'fine-tuned gliner ner on legal pii and built a presidio redaction pipeline; evaluation informed model selection, privacy policy, and a desktop app rearchitecture',
    ],
  },
  {
    co: 'Dineleap',
    role: 'co-founder · full-stack',
    when: 'sep 2024 — dec 2024',
    location: 'gurugram, IN',
    bullets: [
      'co-built a qr-based restaurant ordering system (hono, mongodb, redis), piloted live at multiple restaurants with dynamic qr-code menus',
      'shipped type-safe apis (zod, openapi) with redis caching for low-latency ordering',
      'built real-time sales and popular-item analytics with cdn-backed image optimization',
    ],
  },
  {
    co: 'iiit delhi',
    role: 'software engineering intern',
    when: 'jun 2023 — aug 2023',
    location: 'delhi, IN',
    bullets: [
      'built local server middleware exposing satellite trajectory prediction and collision simulation from a supercomputer to a web frontend',
      'reduced simulation load 70% by pruning decayed debris from norad data, optimizing step granularity, and deferring renders until full load',
      'automated a daily ingestion pipeline from norad and other agencies, storing incremental diffs across inconsistent debris tracking',
      'redesigned the frontend with color-coded debris classification and rebuilt the search ux',
    ],
  },
];

export const LOG_FEED: LogEntry[] = [
  { t: '08:42:11', lvl: 'INF', msg: 'migrated <span class="hi">3 flows</span> in prompt studio · parity 86%' },
  { t: '08:42:14', lvl: 'OK ', msg: 'tgi → vllm migration patch · staging' },
  { t: '08:42:18', lvl: 'INF', msg: 'paged kv allocator · <span class="hi">16-token blocks</span> · 0 fragmentation' },
  { t: '08:42:22', lvl: 'OK ', msg: 'decode kernel passes golden activations · gqa 4:1' },
  { t: '08:42:27', lvl: 'WRN', msg: 'preempting seq 42 · recompute under kv pressure' },
  { t: '08:42:31', lvl: 'INF', msg: 'continuous batch · 8 reqs · ttft p50 210ms' },
  { t: '08:42:36', lvl: 'OK ', msg: 'jevad exact-repeat cache <span class="hi">262ms → 10ms</span>' },
  { t: '08:42:40', lvl: 'INF', msg: 'transpose kernel 32×33 · <span class="hi">316 GB/s</span>' },
  { t: '08:42:44', lvl: 'OK ', msg: 'fused causal softmax <span class="hi">4.1×</span> vs pytorch' },
  { t: '08:42:48', lvl: 'INF', msg: 'profiled tgi prefill switch · <span class="hi">82×</span> error cascade' },
  { t: '08:42:52', lvl: 'OK ', msg: 'shut down 3 idle models/zone · ~50% capacity recovered' },
  { t: '08:42:55', lvl: 'OK ', msg: 'ci passed · <span class="hi">30 tests · 12 golden responses</span>' },
];

export const NOTES: Note[] = [
  { t: '2026.05', title: 'how we built the eval system at litt',              tag: 'eval',    slug: 'eval-system-at-litt'        },
  { t: '2026.04', title: 'why i write cuda kernels by hand',                  tag: 'systems', slug: 'why-i-write-cuda-kernels'   },
  { t: '2026.03', title: 'judging an llm is a search problem',                tag: 'eval',    slug: 'judging-an-llm'             },
  { t: '2026.02', title: 'on logging at the trace level, not the request level', tag: 'otel', slug: 'logging-at-trace-level'     },
  { t: '2026.01', title: 'attention is a transpose',                          tag: 'systems', slug: 'attention-is-a-transpose'   },
  { t: '2025.12', title: 'a kernel journal · ch. 1',                          tag: 'systems', slug: 'kernel-journal-ch-1'        },
];

export const CURRENTLY: CurrentlyItem[] = [
  { v: 'building', t: 'llm-inference · paged kv + continuous batching' },
  { v: 'working',  t: 'prompt studio @ LivePerson' },
  { v: 'reading',  t: 'vllm internals · paged attention', link: 'https://arxiv.org/abs/2309.06180' },
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
