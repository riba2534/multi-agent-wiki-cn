'use client';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PATTERNS } from '@/data/patterns';
import { useAnimationEngine } from '@/hooks/useAnimationEngine';
import DiagramCanvas from '@/components/DiagramCanvas';
import Controls from '@/components/Controls';
import { cn } from '@/lib/utils';

interface Props {
  /** The animation pattern id (matches an entry in data/patterns.ts). */
  patternId: string;
}

/**
 * Compact embeddable visualization: diagram + step caption + transport
 * controls. Used at the top of pattern wiki pages where an animated
 * version exists.
 */
export function AnimatedPattern({ patternId }: Props) {
  const pattern = PATTERNS.find(p => p.id === patternId);
  const engine = useAnimationEngine(pattern ?? null);

  // Keyboard shortcuts scoped to the widget area
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        engine.playing ? engine.pause() : engine.play();
      } else if (e.key === 'ArrowRight' || e.key === 'l') engine.nextStep();
      else if (e.key === 'ArrowLeft' || e.key === 'j') engine.prevStep();
      else if (e.key === 'r') engine.restart();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [engine]);

  if (!pattern) return null;

  const engineState = {
    activeNodes: engine.activeNodes,
    dimNodes: engine.dimNodes,
    firingEdges: engine.firingEdges,
    doneEdges: engine.doneEdges,
  };

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/10 p-4 shadow-lg shadow-brand/[0.06] ring-1 ring-inset ring-white/[0.06] dark:ring-white/[0.02]">
      <header className="flex flex-wrap items-center gap-2.5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/5 px-2.5 py-0.5 text-[11px] font-semibold text-brand shadow-sm shadow-brand/10">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-brand shadow-[0_0_6px_var(--brand-ring)]" />
          </span>
          Live · 实时可视化
        </span>
        <span className="text-[12px] text-muted-foreground">
          动态拓扑 — 按 <kbd className="rounded-md border border-border/60 bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] shadow-sm">Space</kbd> 播放 / 暂停
        </span>
      </header>

      <DiagramCanvas pattern={pattern} engineState={engineState} speed={engine.speed} />

      {pattern.variants && pattern.variants.length >= 2 && (
        <div className="variants flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            变体
          </span>
          {pattern.variants.map((v, i) => {
            const active = i === engine.variantIdx;
            return (
              <button
                key={i}
                type="button"
                onClick={() => engine.selectVariant(i)}
                className={cn(
                  'chip relative rounded-full border px-3 py-1 text-[11px] font-medium transition-all hover:-translate-y-px',
                  active
                    ? 'active bg-gradient-to-r from-brand/15 to-brand/5 border-brand/40 text-brand shadow-sm shadow-brand/10'
                    : 'border-border/60 bg-card/60 text-muted-foreground hover:text-foreground hover:border-border hover:shadow-sm',
                )}
              >
                <span>{v.label}</span>
                {v.sub && <span className="ml-1.5 opacity-60">{v.sub}</span>}
              </button>
            );
          })}
        </div>
      )}

      <div className="caption-wrap flex min-h-[32px] items-center gap-3">
        <div className="step-no font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground whitespace-nowrap tabular-nums">
          <span className="cur text-brand font-semibold">{engine.step + 1}</span>
          <span className="opacity-50"> / {engine.timeline.length}</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={`cap-${pattern.id}-${engine.variantIdx}-${engine.step}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 text-[13px] leading-relaxed text-foreground [&_b]:font-semibold [&_b]:text-brand [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.86em]"
            dangerouslySetInnerHTML={{ __html: engine.caption || '—' }}
          />
        </AnimatePresence>
      </div>

      <Controls
        step={engine.step}
        totalSteps={engine.timeline.length}
        playing={engine.playing}
        speed={engine.speed}
        onPlay={engine.play}
        onPause={engine.pause}
        onRestart={engine.restart}
        onPrev={engine.prevStep}
        onNext={engine.nextStep}
        onGotoStep={engine.gotoStep}
        onSpeedChange={engine.setSpeed}
      />
    </section>
  );
}

