'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Heading } from '@/lib/markdown-utils';
import { cn } from '@/lib/utils';

interface Props {
  headings: Heading[];
}

/**
 * Right-side TOC. Tracks the current section via IntersectionObserver and
 * scrolls the corresponding entry into view. Anchors match the ids injected
 * by rehype-slug in the markdown renderer.
 */
export function Toc({ headings }: Props) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;
    const ids = headings.map(h => h.id);
    const nodes = ids
      .map(id => document.getElementById(id))
      .filter((n): n is HTMLElement => !!n);
    if (nodes.length === 0) return;

    const obs = new IntersectionObserver(
      entries => {
        // Pick the topmost visible heading.
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -65% 0px', threshold: [0, 1] },
    );

    nodes.forEach(n => obs.observe(n));
    return () => obs.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto py-8 pl-6 pr-3">
      <div className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/60">
        本页内容
      </div>
      <ul className="flex flex-col gap-0.5 border-l border-border/70">
        {headings.map(h => {
          const isActive = active === h.id;
          return (
            <li key={h.id} className={cn(h.level === 3 && 'pl-3')}>
              <a
                href={`#${h.id}`}
                className={cn(
                  'relative -ml-px block border-l-[2.5px] py-1.5 pl-3 text-[12px] leading-snug transition-colors duration-200',
                  isActive
                    ? 'border-brand text-foreground font-medium'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                  h.level === 3 && 'text-[11.5px]',
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="toc-active"
                    className="absolute -left-px top-0 h-full w-[2.5px] rounded-full"
                    style={{ background: 'var(--brand-gradient)' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {h.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
