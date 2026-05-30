'use client';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Constellation } from './constellation';

/**
 * Full-bleed landing cover (the site's first screen). An "observatory" canvas
 * carries the 30-pattern constellation behind an oversized headline + dual CTA.
 * Scrolling past it reveals the category switcher and the rest of the wiki.
 * The canvas follows the site's light/dark theme: `.cover-observatory` in
 * globals.css paints its gradient from theme design tokens (--background,
 * --muted, --brand), so the hero and every token-driven child adapt together.
 */
export function Cover({
  patternCount,
  titles,
}: {
  patternCount: number;
  titles?: Record<string, string>;
}) {
  const reduce = useReducedMotion();
  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="cover-observatory relative isolate flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden px-6">
      {/* Constellation backdrop + readability vignette */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Constellation titles={titles} className="absolute inset-0 size-full" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 58% 50% at 50% 46%, oklch(from var(--background) l c h / 0.72), oklch(from var(--background) l c h / 0.28) 55%, transparent 80%)',
          }}
        />
        {/* top + bottom fades so the nav and the section seam read cleanly */}
        <div
          className="absolute inset-x-0 top-0 h-32"
          style={{ background: 'linear-gradient(to bottom, oklch(from var(--background) l c h / 0.9), transparent)' }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40"
          style={{ background: 'linear-gradient(to top, var(--background), transparent)' }}
        />
      </div>

      <div className="relative z-10 flex max-w-3xl flex-col items-center text-center">
        <motion.span
          {...fade(0)}
          className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/[0.08] px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-brand backdrop-blur-sm"
        >
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-70" />
            <span className="relative inline-flex size-1.5 rounded-full bg-brand" />
          </span>
          {patternCount} 模式 · 工程维度分类 · 生产级实现
        </motion.span>

        <motion.h1
          {...fade(0.08)}
          className="mt-6 font-bold text-foreground"
          style={{ fontSize: 'clamp(2.75rem, 6.5vw, 4.75rem)', lineHeight: 1.03, letterSpacing: '-0.035em' }}
        >
          多智能体系统的
          <br />
          <span className="brand-gradient-text">设计模式库</span>
        </motion.h1>

        <motion.p
          {...fade(0.16)}
          className="mt-6 max-w-[40rem] text-[15.5px] leading-relaxed text-muted-foreground"
        >
          {patternCount} 种交互模式、工程维度分类法与生产级实现。每种模式都回答四个问题：解决什么问题、控制结构如何、怎样落地、何时不该用。
        </motion.p>

        <motion.div {...fade(0.24)} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            variant="brand"
            size="xl"
            className="bg-[image:var(--brand-gradient)] text-white shadow-lg shadow-brand/30 hover:opacity-95"
          >
            <Link href="/taxonomy">
              从分类法开始
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="outline" size="xl" className="backdrop-blur-sm">
            <Link href="/patterns">浏览全部模式</Link>
          </Button>
        </motion.div>
      </div>

      <motion.a
        href="#explore"
        aria-label="向下滚动查看分类"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground/70 transition-colors hover:text-foreground"
        initial={reduce ? undefined : { opacity: 0 }}
        animate={reduce ? undefined : { opacity: 1, y: [0, 7, 0] }}
        transition={reduce ? undefined : { opacity: { delay: 0.6 }, y: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } }}
      >
        <ChevronDown className="size-6" />
      </motion.a>
    </section>
  );
}
