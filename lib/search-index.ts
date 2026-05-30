import { listAllSlugs, loadDoc } from './wiki';
import { extractHeadings } from './markdown-utils';
import { PATTERN_CATEGORY, type PatternCategory } from './pattern-map';

export interface SearchHeading {
  label: string;
  hash: string;
}

export interface SearchEntry {
  title: string;
  href: string;
  description?: string;
  /** Display group: 模式 / 实现指南 / 参考 / 总览 */
  group: string;
  category?: PatternCategory;
  headings: SearchHeading[];
}

const GROUP_BY_SECTION: Record<string, string> = {
  patterns: '模式',
  implementation: '实现指南',
  reference: '参考',
};

const GROUP_ORDER = ['总览', '模式', '实现指南', '参考'];

/**
 * Build a lightweight, client-shippable search index from the wiki markdown.
 * Reuses the same loaders the rest of the site uses, so it has zero extra
 * build steps — the root layout computes this once and serializes it.
 */
export function getSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const slug of listAllSlugs()) {
    const doc = loadDoc(slug);
    if (!doc) continue;

    const section = slug[0];
    const href = slug.length ? '/' + slug.join('/') : '/';
    const group = slug.length === 0 ? '总览' : (GROUP_BY_SECTION[section] ?? '总览');
    const category =
      section === 'patterns' && slug.length === 2 ? PATTERN_CATEGORY[slug[1]] : undefined;

    // Section anchors (h2 only) keep the index lean while still enabling
    // deep links straight to a heading.
    const headings = extractHeadings(doc.content)
      .filter(h => h.level === 2)
      .map(h => ({ label: h.label, hash: '#' + h.id }));

    entries.push({ title: doc.title, href, description: doc.description, group, category, headings });
  }

  entries.sort((a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group));
  return entries;
}
