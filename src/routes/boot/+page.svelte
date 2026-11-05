<script lang="ts">
  import { onMount } from 'svelte';
  import {goto} from "$app/navigation";

  interface HistoryLine {
    kind: 'boot' | 'cmd' | 'out';
    text: string;
  }

  const BOOT_LINES = [
    { t: 0,   text: '[ ok ] mounting /dev/identity ........................ ansh.verma' },
    { t: 80,  text: '[ ok ] loading kernel modules ......................... pytorch, cuda, transformers' },
    { t: 160, text: '[ ok ] initializing neural runtime .................... 12.4M params' },
    { t: 240, text: '[ ok ] establishing telemetry ......................... otel://traces' },
    { t: 320, text: '[ ok ] welcome' },
    { t: 420, text: '' },
  ];

  type FSFn = () => string[] | '__CLEAR__';
  const FS: Record<string, FSFn> = {
    'whoami': () => [
      'ansh verma',
      'ml engineer · LivePerson',
      'b.tech cs (ai/ml) · northcap university · 9.0 cgpa · 2021–2025',
      'gurugram, india · ' + new Date().toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' }) + ' IST',
    ],
    'ls': () => [
      'drwx------  ansh  staff   work/        # llm-inference, jevad, prompt-studio, eval-agent, gpt-2-cuda',
      'drwxr-xr-x  ansh  staff   experience/  # LivePerson, Litt, Dineleap, iiitd',
      '-rw-r--r--  ansh  staff   resume.pdf',
      '-rw-r--r--  ansh  staff   contact.md',
    ],
    'cat about': () => [
      'ml engineer building production llm systems across agentic workflows,',
      'evaluation, and inference infrastructure.',
      '',
      'currently @ LivePerson: built prompt studio, an llm prompt/flow migration',
      'platform using llm-as-a-judge parity; audited production inference infra',
      '(tgi prefill switching, idle model capacity); and migrated serving to vllm.',
      '',
      'i also built jevad, an openai-compatible inference server for a system one',
      'decision model, and gpt-2 from scratch in c++/cuda — fused softmax, tiled',
      'transposes, and raw kernels all the way down.',
      '',
      'right now: a from-scratch llm inference server — paged kv, continuous',
      'batching, recompute preemption, and a hand-written paged-attention decode',
      'kernel, benchmarked against vllm on an rtx 4060.',
    ],
    'cat resume': () => [
      '# experience',
      '  LivePerson     dsml 1                 aug 2026 – present',
      '  Litt           ai/ml engineer         jun 2025 – jun 2026',
      '  Dineleap       co-founder · full-stack  sep 2024 – dec 2024',
      '  iiit delhi     swe intern             jun 2023 – aug 2023',
      '',
      '# projects',
      '  llm-inference         from-scratch server · paged kv · continuous batching',
      '  jevad                 openai-compatible inference server for jeva-4b',
      '  prompt-studio         llm migration platform with judge parity',
      '  gpt-2-cuda            transformer kernels in raw c++/cuda',
      '  eval-agent            judge-as-a-service for llm trace forensics',
      '',
      '# stack',
      '  ml      pytorch · cuda · langchain · qdrant · gliner · presidio',
      '  infra   vllm · tgi · docker · kubernetes · istio · grafana',
      '  web     next · fastapi · flask · express · hono · svelte',
      '  langs   python · c/c++ · java · typescript',
      '',
      '# certs',
      '  aws cloud practitioner',
      '  nptel · business analytics & data mining (silver, top 5%)',
      '  nptel · modern c++ (silver, top 2%)',
    ],
    'cd home': () => {goto('/'); return ['→ launching ansh.site …'];},
    'open resume': () => { window.open('https://kmvtiv3h5z.ufs.sh/f/z6mi9BYbVtivC6XusspEq0Z9kAeuYCpfLMXyPxIURKiOT2Vv', '_blank'); return ['→ opening resume.pdf …']; },
    'open github': () => { window.open('https://github.com/crankyastrologer', '_blank'); return ['→ github.com/crankyastrologer']; },
    'open jeva': () => { window.open('https://github.com/crankyastrologer/Jeva', '_blank'); return ['→ github.com/crankyastrologer/Jeva']; },
    'open inference': () => { window.open('https://github.com/crankyastrologer/inference_server', '_blank'); return ['→ github.com/crankyastrologer/inference_server']; },
    'open linkedin': () => { window.open('https://www.linkedin.com/in/ansh-vermaai/', '_blank'); return ['→ linkedin.com/in/ansh-vermaai']; },
    'mail': () => { window.open('mailto:ansh0verma@gmail.com'); return ['→ ansh0verma@gmail.com']; },
    'help': () => [
      'commands:',
      '  whoami            who am i',
      '  ls                list everything',
      '  cat about         the long version',
      '  cat resume        experience, projects, stack',
      '  cd home           takes you to main page',
      '  open resume       → resume.pdf',
      '  open github       → github',
      '  open jeva         → jeva inference server',
      '  open inference    → from-scratch llm inference server',
      '  open linkedin     → linkedin',
      '  mail              → email me',
      '  clear             clear screen',
      '  help              this',
    ],
    'clear': () => '__CLEAR__',
  };

  const SUGGESTIONS = ['whoami', 'ls', 'cat about', 'cat resume', 'open resume', 'open jeva', 'mail', 'help'];

  let history = $state<HistoryLine[]>([]);
  let input = $state('');
  let booting = $state(true);
  let bootIdx = $state(0);
  let cursorOn = $state(true);
  let cmdHist = $state<string[]>([]);
  let histIdx = $state(-1);

  let inputEl = $state<HTMLInputElement | null>(null);
  let scrollEl = $state<HTMLDivElement | null>(null);

  // Auto-scroll whenever history changes
  $effect(() => {
    history; // track
    if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight;
  });

  onMount(() => {
    // Cursor blink
    const blinkId = setInterval(() => { cursorOn = !cursorOn; }, 530);

    // Boot sequence
    let bootTimeouts: ReturnType<typeof setTimeout>[] = [];
    function addBootLine(idx: number) {
      if (idx >= BOOT_LINES.length) {
        const t = setTimeout(() => {
          const whoamiOut = FS['whoami']() as string[];
          history = [
            ...history,
            { kind: 'cmd', text: 'whoami' },
            ...whoamiOut.map(t => ({ kind: 'out' as const, text: t })),
            { kind: 'out', text: '' },
            { kind: 'out', text: 'type `help` for commands.' },
            { kind: 'out', text: '' },
          ];
          booting = false;
          setTimeout(() => inputEl?.focus(), 50);
        }, 200);
        bootTimeouts.push(t);
        return;
      }
      const line = BOOT_LINES[idx];
      const t = setTimeout(() => {
        history = [...history, { kind: 'boot', text: line.text }];
        bootIdx = idx + 1;
        addBootLine(idx + 1);
      }, line.t || 60);
      bootTimeouts.push(t);
    }
    addBootLine(0);

    return () => {
      clearInterval(blinkId);
      bootTimeouts.forEach(clearTimeout);
    };
  });

  function run(raw: string) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) {
      history = [...history, { kind: 'cmd', text: '' }];
      return;
    }
    cmdHist = [...cmdHist, raw];
    histIdx = -1;
    if (cmd === 'clear') { history = []; return; }
    const fn = FS[cmd];
    let out: string[];
    if (fn) {
      const result = fn();
      if (result === '__CLEAR__') { history = []; return; }
      out = result;
    } else {
      out = [`${cmd}: command not found. type \`help\`.`];
    }
    history = [
      ...history,
      { kind: 'cmd', text: raw },
      ...out.map(t => ({ kind: 'out' as const, text: t })),
      { kind: 'out', text: '' },
    ];
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      run(input);
      input = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHist.length === 0) return;
      const next = histIdx < 0 ? cmdHist.length - 1 : Math.max(0, histIdx - 1);
      histIdx = next;
      input = cmdHist[next] ?? '';
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx < 0) return;
      const next = histIdx + 1;
      if (next >= cmdHist.length) { histIdx = -1; input = ''; }
      else { histIdx = next; input = cmdHist[next]; }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const match = Object.keys(FS).find(k => k.startsWith(input.toLowerCase()));
      if (match) input = match;
    }
  }
</script>

<div class="boot-root" role="presentation" onclick={() => inputEl?.focus()}>
  <!-- Window chrome -->
  <div class="boot-chrome">
    <div class="boot-dots">
      <span class="boot-dot boot-dot-r"></span>
      <span class="boot-dot boot-dot-y"></span>
      <span class="boot-dot boot-dot-g"></span>
    </div>
    <div class="boot-title">ansh@portfolio: ~ — zsh — 96×40</div>
    <div class="boot-meta">
      <span class="boot-pulse"></span>
      <span>online</span>
    </div>
  </div>

  <!-- Terminal body -->
  <div class="boot-body" bind:this={scrollEl}>
    <div class="boot-banner">
      <pre>{`
   █████╗ ███╗   ██╗███████╗██╗  ██╗
  ██╔══██╗████╗  ██║██╔════╝██║  ██║
  ███████║██╔██╗ ██║███████╗███████║
  ██╔══██║██║╚██╗██║╚════██║██╔══██║
  ██║  ██║██║ ╚████║███████║██║  ██║
  ╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝   v26.11`}</pre>
      <div class="boot-banner-sub">portfolio · last build {new Date().toISOString().slice(0,10)} · sha 4f2a91c</div>
    </div>

    {#each history as line, i (i)}
      {#if line.kind === 'boot'}
        {@const isOk = line.text.startsWith('[ ok ]')}
        <div class="boot-line boot-bootline">
          {#if isOk}<span class="boot-ok">[ ok ]</span>{/if}
          <span>{isOk ? line.text.slice(6) : line.text}</span>
        </div>
      {:else if line.kind === 'cmd'}
        <div class="boot-line">
          <span class="boot-prompt">ansh@portfolio</span><span class="boot-sep">:</span><span class="boot-path">~</span><span class="boot-sep">$ </span><span>{line.text}</span>
        </div>
      {:else}
        <div class="boot-line boot-out">{line.text || ' '}</div>
      {/if}
    {/each}

    {#if !booting}
      <div class="boot-line boot-input-row" role="presentation">
        <span class="boot-prompt">ansh@portfolio</span><span class="boot-sep">:</span><span class="boot-path">~</span><span class="boot-sep">$ </span>
        <span class="boot-input-wrap">
          <span>{input}</span>
          <span class="boot-cursor" class:on={cursorOn}></span>
        </span>
        <input
          bind:this={inputEl}
          class="boot-hidden-input"
          bind:value={input}
          onkeydown={onKey}
          autofocus
          spellcheck={false}
          autocomplete="off"
        />
      </div>
    {/if}
  </div>

  <!-- Status bar -->
  <div class="boot-status">
    <div class="boot-status-left">
      <span class="boot-pill">NORMAL</span>
      <span>~/portfolio</span>
      <span class="boot-dim">main</span>
    </div>
    <div class="boot-status-right">
      {#each SUGGESTIONS as s}
        <button
          class="boot-sug"
          onclick={(e) => { e.stopPropagation(); run(s); inputEl?.focus(); }}
        >{s}</button>
      {/each}
    </div>
  </div>
</div>
