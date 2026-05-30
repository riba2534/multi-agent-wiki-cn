import { Badge } from '../ui/badge';
import { Mermaid } from './mermaid';

interface Props {
  chart: string;
}

/**
 * Static topology hero — used at the top of pattern pages that don't have an
 * animated counterpart. Visually matches the AnimatedPattern widget so every
 * pattern page leads with a topology diagram.
 */
export function TopologyHero({ chart }: Props) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/10 p-4 shadow-lg shadow-brand/5 ring-1 ring-inset ring-white/5 dark:ring-white/[0.02]">
      <header className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="border-border/60 bg-muted/40 text-muted-foreground shadow-sm">
          拓扑
        </Badge>
        <span className="text-[12px] text-muted-foreground">
          结构草图 — 该模式的动态动画尚未实现。
        </span>
      </header>
      <Mermaid chart={chart} />
    </section>
  );
}
