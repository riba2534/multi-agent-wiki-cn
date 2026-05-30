'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { NavLeaf } from '@/lib/wiki-nav';
import type { Heading } from '@/lib/markdown-utils';
import { Markdown } from './markdown';
import { Toc } from './toc';
import { ReadingProgress } from './reading-progress';
import { BackToTop } from './back-to-top';
import { cn } from '@/lib/utils';
import { CATEGORY_TONE, type PatternCategory } from '@/lib/pattern-map';

interface Props {
  title: string;
  description?: string;
  content: string;
  slug: string[];
  prev?: NavLeaf;
  next?: NavLeaf;
  widget?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  headings?: Heading[];
  category?: PatternCategory;
  editPath?: string;
}

/**
 * Article body for a wiki page. Top nav + left sidebar live in the root
 * layout so they persist across navigation — this component owns only the
 * main content column and the optional right-side TOC.
 */
export function WikiShell({
  title, description, content, slug, prev, next, widget, breadcrumbs, headings, category, editPath,
}: Props) {
  return (
    <>
      <ReadingProgress />
      <BackToTop />
      <main className="min-w-0 flex-1 py-10 lg:pl-12 lg:pr-10">
        <motion.div
          key={slug.join('/') || 'home'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[760px]"
        >
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="mb-4 flex items-center gap-1.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {breadcrumbs.map((b, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && <span className="opacity-30">/</span>}
                  {b.href ? (
                    <Link href={b.href} className="transition-colors hover:text-foreground">
                      {b.label}
                    </Link>
                  ) : (
                    <span className="text-foreground/80">{b.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}

          <header className="mb-8">
            {category && (
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border bg-gradient-to-r px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider shadow-sm',
                  CATEGORY_TONE[category],
                )}
              >
                {category}
              </span>
            )}
            <h1 className="mt-3 text-[2.375rem] font-bold leading-[1.1] tracking-tight text-foreground sm:text-[2.75rem]">
              {title}
            </h1>
            {description && (
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}
          </header>

          {widget && <div className="mb-6">{widget}</div>}

          <Markdown content={content} slug={slug} />

          {(prev || next) && (
            <nav className="mt-14 grid gap-4 border-t border-border/60 pt-8 sm:grid-cols-2">
              {prev ? (
                <Link
                  href={prev.href}
                  className="group flex flex-col gap-1.5 rounded-xl border border-border/60 bg-gradient-to-br from-muted/30 via-card to-muted/10 p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md"
                >
                  <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors group-hover:text-brand">
                    <ChevronLeft className="size-3" />
                    上一页
                  </span>
                  <span className="text-sm font-medium text-foreground transition-colors group-hover:text-brand">
                    {prev.label}
                  </span>
                </Link>
              ) : <span />}
              {next ? (
                <Link
                  href={next.href}
                  className="group flex flex-col items-end gap-1.5 rounded-xl border border-border/60 bg-gradient-to-br from-muted/30 via-card to-muted/10 p-4 text-right shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md"
                >
                  <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors group-hover:text-brand">
                    下一页
                    <ChevronRight className="size-3" />
                  </span>
                  <span className="text-sm font-medium text-foreground transition-colors group-hover:text-brand">
                    {next.label}
                  </span>
                </Link>
              ) : <span />}
            </nav>
          )}

          <footer className="mt-20 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-8 text-[11px] text-muted-foreground">
            <span>Multi-Agent Wiki — 工程知识库。</span>
            {editPath && (
              <a
                href={`https://github.com/riba2534/multi-agent-wiki-cn/edit/main/${editPath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                编辑此页 →
              </a>
            )}
          </footer>
        </motion.div>
      </main>

      {headings && headings.length > 0 && (
        <aside className="hidden w-[200px] shrink-0 xl:block">
          <Toc headings={headings} />
        </aside>
      )}
    </>
  );
}
