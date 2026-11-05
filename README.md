# ansh.site

Personal portfolio of **Ansh Verma** — an IDE/terminal-inspired dashboard for ML engineering work across LLM inference infrastructure, evaluation systems, and CUDA kernels.

Built with **SvelteKit 2 + Svelte 5 (runes)**, TypeScript, mdsvex, and adapter-static. Deployed on Vercel.

## Features

- **Console dashboard** (`/`) — explorer sidebar, project list, Gantt timeline, notes, live GitHub event log, experience timeline, and stack filters.
- **Command palette** (`⌘K` / `Ctrl+K`) — search projects, links, and files.
- **Project detail overlays** — metrics, long-form writeups, stacks, and sparklines.
- **Terminal mode** (`/boot`) — interactive shell with `whoami`, `ls`, `cat resume`, `open github`, and more.
- **Notes** (`/notes/[slug]`) — markdown posts rendered with mdsvex.
- **Contact form** — powered by [Web3Forms](https://web3forms.com) with a honeypot.
- **Theming** — runtime accent colors and density presets.
- **SEO** — Open Graph/Twitter metadata, JSON-LD Person schema, and a generated OG image.

## Getting started

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. To test the production build:

```sh
npm run build
npm run preview
```

## Environment

Create a `.env` file with a Web3Forms access key:

```sh
PUBLIC_WEB3FORMS_KEY=your_key_here
```

Get a free key at <https://web3forms.com>. Without it, the contact form will fail to submit.

## Scripts

| Command            | Description                                      |
| ------------------ | ------------------------------------------------ |
| `npm run dev`      | Start the dev server                             |
| `npm run build`    | Build the static site into `build/`              |
| `npm run preview`  | Preview the production build                     |
| `npm run check`    | Run `svelte-check` (TypeScript + Svelte)         |
| `npm run gen:og`   | Regenerate `static/og.png` via `@resvg/resvg-js` |

## Project structure

```text
src/
  app.css                    global design system + responsive layout
  app.html                   HTML shell
  lib/
    data.ts                  projects, experience, notes index, log feed, currently
    components/
      base/                  Pulse, Sparkline
      layout/                Sidebar, Rail
      panels/                Hero, ProjectsList, ContribPanel, NotesPanel
      overlays/              ProjectDetail, ContactModal, TechPanel, Palette
    content/notes/           markdown posts (frontmatter + body)
  routes/
    +page.svelte             main dashboard
    boot/+page.svelte        interactive terminal
    notes/[slug]/            note loading + reading layout
scripts/gen-og.mjs           OG image generator
static/                      favicon, robots.txt, og.png
```

## Editing content

- **Projects, experience, logs, “currently”**: `src/lib/data.ts`. Hidden projects (`hidden: true`) stay searchable through stack pills but are omitted from the main list, sidebar, and timeline.
- **Notes**: add a markdown file under `src/lib/content/notes/` and register its slug in `NOTES` in `src/lib/data.ts`. Notes are prerendered from the `NOTES` list.
- **Resume link, social links, email**: update the relevant strings in `src/lib/components/` and `src/routes/boot/+page.svelte`.

## Deployment

The project uses `@sveltejs/adapter-static` with prerendering enabled. `vercel.json` points Vercel at `build/`.

```sh
npm run build
```

Deploy the `build/` directory to any static host.

## Credits

Design and content by [Ansh Verma](https://github.com/crankyastrologer).
