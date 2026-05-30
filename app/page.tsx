import { notFound } from 'next/navigation';
import { loadDoc, getDocTitle } from '@/lib/wiki';
import { extractTopology } from '@/lib/markdown-utils';
import { PATTERN_CATEGORIES } from '@/lib/pattern-map';
import { Cover } from '@/components/home/cover';
import { CategorySwitcher } from '@/components/home/category-switcher';
import { CategoryGrid, type HomeCategory } from '@/components/home/category-grid';
import { PathCards } from '@/components/home/path-cards';
import { Markdown } from '@/components/wiki/markdown';

export default function Home() {
  const home = loadDoc([]);
  if (!home) notFound();

  const categories: HomeCategory[] = PATTERN_CATEGORIES.map(c => ({
    label: c.label,
    count: c.slugs.length,
    items: c.slugs.map(s => ({
      label: getDocTitle(['patterns', s]) ?? s,
      href: `/patterns/${s}`,
    })),
  }));
  const patternCount = PATTERN_CATEGORIES.reduce((n, c) => n + c.slugs.length, 0);

  // slug → 中文标题，用于封面星座节点的 hover 提示
  const titles: Record<string, string> = {};
  for (const c of PATTERN_CATEGORIES)
    for (const s of c.slugs) titles[s] = getDocTitle(['patterns', s]) ?? s;

  // Reuse the taxonomy flowchart from index.md as the single source of truth,
  // so the overview diagram stays in sync with the markdown content.
  const { mermaid } = extractTopology(home.content);
  const overviewMd = [
    '## 一句话定义',
    '',
    '一个**多 Agent 系统**由多个 Agent 组成——每个 Agent 拥有自己的职责、状态、工具或上下文——它们通过消息、工具调用、共享状态、事件流、协议或环境变化来进行协作、竞争、审查、委托和任务分解。',
    ...(mermaid ? ['', '## 全局分类法', '', '```mermaid', mermaid, '```'] : []),
  ].join('\n');

  return (
    <main className="min-w-0 flex-1">
      <Cover patternCount={patternCount} titles={titles} />

      <div id="explore" className="mx-auto max-w-[1080px] px-6 py-20 lg:px-8 lg:py-24">
        <CategorySwitcher titles={titles} />
        <CategoryGrid categories={categories} />
        <PathCards />

        <section className="mt-24 max-w-[760px]">
          <Markdown content={overviewMd} slug={[]} />
        </section>

        <footer className="mt-24 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-8 text-[12px] text-muted-foreground">
          <span>Multi-Agent Wiki — 多 Agent 模式工程知识库。</span>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/riba2534/multi-agent-wiki-cn"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium transition-colors hover:text-foreground"
            >
              GitHub ↗
            </a>
            <a href="/llms.txt" className="font-medium transition-colors hover:text-foreground">
              llms.txt
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
