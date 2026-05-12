import { error } from '@sveltejs/kit';
import { NOTES } from '$lib/data';
import type { PageLoad } from './$types';

// tell adapter-static which slugs exist so they all get prerendered
export const entries = () => NOTES.map(n => ({ slug: n.slug }));

export const load: PageLoad = async ({ params }) => {
  const modules = import.meta.glob('/src/lib/content/notes/*.md');
  const loader = modules[`/src/lib/content/notes/${params.slug}.md`];
  if (!loader) throw error(404, 'note not found');
  const mod = await loader() as { default: any; metadata: Record<string, string> };
  return {
    content:  mod.default,
    metadata: mod.metadata,
    slug:     params.slug,
  };
};
