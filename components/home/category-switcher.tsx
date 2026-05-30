'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { AnimatedPattern } from '@/components/wiki/animated-pattern';
import {
  PATTERN_CATEGORIES,
  CATEGORY_HEX,
  CATEGORY_ZH,
  CATEGORY_REPRESENTATIVE,
  PATTERN_TO_WIKI,
  type PatternCategory,
} from '@/lib/pattern-map';
import { cn } from '@/lib/utils';

/**
 * Home "category switcher": one tab per taxonomy dimension; selecting a tab
 * plays that dimension's representative pattern in a shared canvas. Reuses the
 * exact <AnimatedPattern> widget (engine + DiagramCanvas + controls) from the
 * pattern pages, so the home page and the docs stay visually in sync. Remounts
 * the widget on tab change (via `key`) to reset + autoplay the new pattern.
 */
export function CategorySwitcher({ titles }: { titles: Record<string, string> }) {
  const [active, setActive] = useState<PatternCategory>(PATTERN_CATEGORIES[0].label);
  const current = PATTERN_CATEGORIES.find(c => c.label === active)!;
  const hex = CATEGORY_HEX[active];
  const repId = CATEGORY_REPRESENTATIVE[active];
  const repSlug = PATTERN_TO_WIKI[repId];

  return (
    <section className="mt-2">
      <div className="mb-8 flex flex-col gap-2">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          分类动画 · Live
        </span>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
          每个维度，挑一种代表模式跑给你看
        </h2>
        <p className="max-w-[42rem] text-[14px] leading-relaxed text-muted-foreground">
          切换下面的工程维度，观察该维度最具代表性的交互模式如何一步步运转——和模式页里嵌入的是同一套实时可视化。
        </p>
      </div>

      {/* dimension tabs */}
      <div role="tablist" aria-label="模式维度" className="flex flex-wrap gap-2">
        {PATTERN_CATEGORIES.map(({ label: c, slugs }) => {
          const on = c === active;
          const chex = CATEGORY_HEX[c];
          return (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setActive(c)}
              className={cn(
                'relative rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-all hover:-translate-y-px',
                on ? 'text-foreground' : 'border-border/60 text-muted-foreground hover:text-foreground',
              )}
              style={on ? { borderColor: chex } : undefined}
            >
              {on && (
                <motion.span
                  layoutId="cat-switch-pill"
                  className="absolute inset-0 -z-0 rounded-full"
                  style={{ background: `color-mix(in oklab, ${chex} 14%, transparent)` }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <span className="size-1.5 rounded-full" style={{ background: chex }} />
                {CATEGORY_ZH[c]}
                <span className="font-mono text-[10px] tabular-nums opacity-50">{slugs.length}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* shared animation canvas — remounts on tab change to reset + autoplay */}
      <div className="mt-6">
        <AnimatedPattern key={active} patternId={repId} />
      </div>

      {/* every pattern in the active dimension */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          本维度模式
        </span>
        {current.slugs.map(s => {
          const isRep = s === repSlug;
          return (
            <Link
              key={s}
              href={`/patterns/${s}`}
              className={cn(
                'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[12px] transition-all hover:-translate-y-px',
                isRep
                  ? 'text-foreground'
                  : 'border-border/60 bg-card/60 text-muted-foreground hover:text-foreground hover:border-border',
              )}
              style={
                isRep
                  ? { borderColor: hex, background: `color-mix(in oklab, ${hex} 10%, transparent)` }
                  : undefined
              }
            >
              {isRep && <Play className="size-3" style={{ color: hex }} />}
              {titles[s] ?? s}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
