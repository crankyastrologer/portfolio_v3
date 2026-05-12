import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [mdsvex({ extensions: ['.md'] })],
	compilerOptions: {
		// Force runes mode for project files, but not .md files (mdsvex generates Svelte 4 output)
		runes: ({ filename }) => {
			if (filename.endsWith('.md')) return undefined;
			if (filename.split(/[/\\]/).includes('node_modules')) return undefined;
			return true;
		}
	},
	kit: {
		adapter: adapter({ fallback: undefined }),
		prerender: { handleHttpError: 'warn' }
	}
};

export default config;
