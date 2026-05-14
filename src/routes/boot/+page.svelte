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
      'ai/ml engineer · Litt',
      'b.tech cs · northcap university · 9.0 cgpa · 2021–2025',
      'delhi, india · ' + new Date().toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' }) + ' IST',
    ],
    'ls': () => [
      'drwx------  ansh  staff   work/        # eval-agent, dineleap, gpt-2-cuda',
      'drwxr-xr-x  ansh  staff   experience/  # Litt, iiitd',
      '-rw-r--r--  ansh  staff   resume.pdf',
      '-rw-r--r--  ansh  staff   contact.md',
    ],
    'cat about': () => [
      'i build agents that watch other agents work, and the kernels that make them fast.',
      '',
      'currently @ Litt, where i architect "judge-as-a-service" frameworks for',
      'auditing multi-agent llm traces — sub-second retrieval over a dual-storage',
      'opentelemetry pipeline, plus an adversarial suite (distinguisher, proceduralist,',
      'shepardizer) that stress-tests agentic decision-making.',
      '',
      'before that, i wrote gpt-2 from scratch in c++/cuda — coalesced memory access,',
      'grid-stride gelu, transpose kernels for head-contiguous attention.',
      '',
      'i also ship products. dineleap is a qr-ordering system on hono + redis + mongo.',
    ],
    'cat resume': () => [
      '# experience',
      '  Litt           ai/ml engineer       jun 2025 – present',
      '  iiit delhi            research intern      jun 2023 – aug 2023',
      '',
      '# projects',
      '  eval-agent            judge-as-a-service for llm trace forensics',
      '  gpt-2-cuda            transformer kernels in raw c++/cuda',
      '  dineleap              qr-ordering system · hono · redis · mongo',
      '  browser-automation    vision+grounding models on government portals',
      '',
      '# stack',
      '  ml      pytorch · langchain · qdrant · cuda · stable-baselines · scikit',
      '  web     svelte · next · hono · fastapi · flask · express · mongo',
      '  langs   python · c/c++ · ts · java',
      '',
      '# certs',
      '  aws cloud practitioner',
      '  nptel · business analytics & data mining (silver, top 5%)',
      '  nptel · modern c++ (silver, top 2%)',
    ],
      'cd home': () => {goto('/'); return ['→ launching ansh.site …'];},
    'open resume': () => { window.open('https://kmvtiv3h5z.ufs.sh/f/z6mi9BYbVtivC6XusspEq0Z9kAeuYCpfLMXyPxIURKiOT2Vv', '_blank'); return ['→ opening resume.pdf …']; },
    'open github': () => { window.open('https://github.com/crankyastrologer', '_blank'); return ['→ github.com/crankyastrologer']; },
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
      '  open linkedin     → linkedin',
      '  mail              → email me',
      '  clear             clear screen',
      '  help              this',
    ],
    'clear': () => '__CLEAR__',
  };

  const SUGGESTIONS = ['whoami', 'ls', 'cat about', 'cat resume', 'open resume', 'mail', 'help'];

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
  ╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝   v25.06`}</pre>
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
