'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { Maximize2 } from 'lucide-react';
import { MermaidModal } from './mermaid-modal';
import { cn } from '@/lib/utils';

interface Props { chart: string }

export function Mermaid({ chart }: Props) {
  const { resolvedTheme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [err, setErr] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const reactId = useId();
  const id = `m_${reactId.replace(/[^A-Za-z0-9]/g, '_')}`;

  useEffect(() => {
    let cancelled = false;
    async function render() {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: resolvedTheme === 'dark' ? 'dark' : 'neutral',
          themeVariables: resolvedTheme === 'dark'
            ? { background: 'transparent', primaryColor: '#1b1f2a', primaryTextColor: '#f4f4f5', primaryBorderColor: '#6c7c9f', lineColor: '#6c7c9f', secondaryColor: '#2a3142', tertiaryColor: '#1b1f2a', fontFamily: 'var(--font-sans)' }
            : { background: 'transparent', primaryColor: '#f1f3f9', primaryTextColor: '#1a1d23', primaryBorderColor: '#475569', lineColor: '#64748b', secondaryColor: '#e2e8f0', tertiaryColor: '#ffffff', fontFamily: 'var(--font-sans)' },
        });
        const { svg } = await mermaid.render(id, chart);
        if (cancelled) return;
        if (ref.current) ref.current.innerHTML = svg;
        // Recover from any prior failure: a successful re-render (e.g. after a
        // theme toggle or chart edit) clears the wedged error state. Runs in an
        // async continuation, so it is not a synchronous set-state-in-effect.
        setErr(null);
      } catch (e) {
        if (cancelled) return;
        setErr(String(e instanceof Error ? e.message : e));
      }
    }
    render();
    return () => { cancelled = true; };
  }, [chart, resolvedTheme, id]);

  return (
    <>
      {err && (
        <div className="my-4 rounded-xl border border-destructive/30 bg-gradient-to-br from-destructive/10 to-destructive/5 p-3 font-mono text-xs text-destructive shadow-sm">
          Mermaid 渲染错误：{err}
        </div>
      )}
      {/* Keep the render target mounted even while showing an error, so a later
          successful re-render can write the SVG into it (ref stays valid). */}
      <div className={cn(
        'group relative my-4 overflow-x-auto rounded-2xl border border-border/40 bg-gradient-to-br from-muted/20 via-background to-muted/10 p-4 shadow-lg shadow-brand/5 ring-1 ring-inset ring-white/5 dark:ring-white/[0.02] [&_svg]:mx-auto [&_svg]:max-w-full',
        err && 'hidden',
      )}>
        <div ref={ref} />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="全屏查看图表"
          title="全屏查看（缩放和平移）"
          className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-lg bg-background/80 text-muted-foreground opacity-0 shadow-sm backdrop-blur-xl transition-all hover:bg-background hover:text-brand hover:shadow-md group-hover:opacity-100 focus:opacity-100"
        >
          <Maximize2 className="size-3.5" />
        </button>
      </div>
      <MermaidModal chart={chart} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
