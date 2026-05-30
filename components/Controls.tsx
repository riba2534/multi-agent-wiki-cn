'use client';
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Props {
  step: number;
  totalSteps: number;
  playing: boolean;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
  onPrev: () => void;
  onNext: () => void;
  onGotoStep: (i: number) => void;
  onSpeedChange: (s: number) => void;
}

const SPEEDS = [0.5, 1, 1.5, 2];

export default function Controls({
  step, totalSteps, playing, speed,
  onPlay, onPause, onRestart, onPrev, onNext, onGotoStep, onSpeedChange,
}: Props) {
  return (
    <div className="controls flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" onClick={onRestart} className="font-mono text-[11px] shadow-sm transition-all hover:shadow-md hover:-translate-y-px">
        <RotateCcw className="size-3.5" />
        <span className="hidden sm:inline">重播</span>
      </Button>

      <Button variant="outline" size="sm" onClick={onPrev} aria-label="上一步" className="font-mono text-[11px] shadow-sm transition-all hover:shadow-md hover:-translate-y-px">
        <ChevronLeft className="size-3.5" />
        <span className="hidden sm:inline">上一步</span>
      </Button>

      <Button
        variant="brand"
        size="sm"
        onClick={playing ? onPause : onPlay}
        className="primary font-mono text-[11px] shadow-md shadow-brand/20 transition-all hover:shadow-lg hover:shadow-brand/25 hover:-translate-y-px sm:min-w-[80px]"
      >
        {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
        <span className="hidden sm:inline">{playing ? '暂停' : '播放'}</span>
      </Button>

      <Button variant="outline" size="sm" onClick={onNext} aria-label="下一步" className="font-mono text-[11px] shadow-sm transition-all hover:shadow-md hover:-translate-y-px">
        <span className="hidden sm:inline">下一步</span>
        <ChevronRight className="size-3.5" />
      </Button>

      {/* Timeline scrubber — hidden on phones (the prev/next buttons cover
          stepping; 8 dots are too cramped to tap on a narrow screen). */}
      <div className="hidden h-9 min-w-0 flex-1 items-center gap-1.5 rounded-xl border border-border/60 bg-gradient-to-br from-card to-muted/20 px-3 shadow-sm ring-1 ring-inset ring-white/5 dark:ring-white/[0.02] sm:flex">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="flex flex-1 items-center gap-1.5 first:flex-none">
            {i > 0 && (
              <div className={cn(
                'h-px flex-1 transition-colors duration-300',
                i <= step ? 'bg-brand' : 'bg-border',
              )} />
            )}
            <button
              type="button"
              onClick={() => onGotoStep(i)}
              title={`第 ${i + 1} 步`}
              aria-label={`第 ${i + 1} 步`}
              className="relative flex size-3.5 items-center justify-center rounded-full transition-transform hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            >
              {i === step && (
                <motion.span
                  layoutId="timeline-current"
                  className="absolute inset-0 rounded-full bg-brand ring-4 ring-brand/20"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className={cn(
                'relative size-2 rounded-full transition-colors',
                i < step ? 'bg-brand' : i === step ? 'bg-brand-foreground' : 'bg-muted-foreground/30',
              )} />
            </button>
          </div>
        ))}
      </div>

      {/* Speed */}
      <div className="speed-group flex items-center gap-1 rounded-xl border border-border/60 bg-gradient-to-br from-card to-muted/20 p-0.5 shadow-sm ring-1 ring-inset ring-white/5 dark:ring-white/[0.02]">
        {SPEEDS.map(s => (
          <button
            key={s}
            type="button"
            data-speed={s}
            aria-pressed={speed === s}
            onClick={() => onSpeedChange(s)}
            className={cn(
              'relative h-7 min-w-[32px] rounded-lg px-2 font-mono text-[10px] font-medium tracking-wider transition-all',
              speed === s
                ? 'text-brand-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
            )}
          >
            {speed === s && (
              <motion.span
                layoutId="speed-active"
                className="absolute inset-0 rounded-lg bg-brand"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative">{s}×</span>
          </button>
        ))}
      </div>
    </div>
  );
}
