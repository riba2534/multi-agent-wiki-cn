import { PATTERN_CATEGORIES, CATEGORY_HEX, type PatternCategory } from '@/lib/pattern-map';
import { cn } from '@/lib/utils';

/**
 * The cover's hero visual: a 30-pattern "constellation". Every pattern is a
 * glowing star, grouped into seven clusters (one per taxonomy dimension). Stars
 * breathe and the links between clusters pulse with flowing light — a pure
 * SVG + CSS ambience (no RAF engine), so it server-renders and degrades to a
 * static map under `prefers-reduced-motion` via the global CSS fallback.
 *
 * Coordinates are fully deterministic (a golden-angle spiral keyed by index),
 * so SSR and the first client paint agree — no Math.random, no hydration drift.
 */

const CLUSTER: Record<PatternCategory, { cx: number; cy: number; zh: string }> = {
  Control:     { cx: 330, cy: 250, zh: '控制结构' },
  Workflow:    { cx: 512, cy: 110, zh: '工作流' },
  Information: { cx: 648, cy: 238, zh: '信息流' },
  Decision:    { cx: 912, cy: 268, zh: '决策' },
  Environment: { cx: 820, cy: 556, zh: '执行环境' },
  Protocol:    { cx: 470, cy: 626, zh: '协议互联' },
  Specialized: { cx: 178, cy: 470, zh: '专项模式' },
};

/** Inter-cluster links: an outer ring + diagonals → a networked star map. */
const CLUSTER_LINKS: [PatternCategory, PatternCategory][] = [
  ['Control', 'Information'], ['Information', 'Decision'], ['Decision', 'Environment'],
  ['Environment', 'Protocol'], ['Protocol', 'Specialized'], ['Specialized', 'Control'],
  ['Control', 'Environment'], ['Information', 'Protocol'], ['Decision', 'Specialized'],
  ['Control', 'Workflow'], ['Workflow', 'Information'],
];

const GOLDEN = 2.399963229728653;

/** Deterministic spiral placement of a cluster's nodes around its center. */
function nodePos(cx: number, cy: number, n: number, i: number, baseR: number) {
  if (n <= 1) return { x: cx, y: cy };
  const r = baseR * Math.sqrt((i + 0.55) / n);
  const a = i * GOLDEN;
  return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
}

const vars = (o: Record<string, string | number>) => o as React.CSSProperties;

export interface ConstellationProps {
  /** slug → display title, used for the hover tooltip on each star. */
  titles?: Record<string, string>;
  className?: string;
}

export function Constellation({ titles, className }: ConstellationProps) {
  let k = 0; // global star index → staggers the breathing animation
  return (
    <svg
      viewBox="0 0 1200 760"
      className={cn('constellation', className)}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {/* inter-cluster links */}
      <g className="c-links">
        {CLUSTER_LINKS.map(([a, b], i) => {
          const A = CLUSTER[a], B = CLUSTER[b];
          return (
            <line
              key={`${a}-${b}`}
              x1={A.cx} y1={A.cy} x2={B.cx} y2={B.cy}
              className="c-link"
              style={vars({ '--d': `${(i * 0.7) % 5}s` })}
            />
          );
        })}
      </g>

      {PATTERN_CATEGORIES.map(({ label, slugs }) => {
        const C = CLUSTER[label];
        const hex = CATEGORY_HEX[label];
        const n = slugs.length;
        const baseR = 30 + n * 7;
        return (
          <g key={label}>
            {/* spokes from cluster center to each star */}
            <g className="c-spokes">
              {slugs.map((s, i) => {
                const p = nodePos(C.cx, C.cy, n, i, baseR);
                return (
                  <line
                    key={s}
                    x1={C.cx} y1={C.cy} x2={p.x} y2={p.y}
                    className="c-spoke"
                    style={vars({ stroke: hex, '--d': `${(i * 0.5) % 4}s` })}
                  />
                );
              })}
            </g>
            {/* stars */}
            <g className="c-stars">
              {slugs.map((s, i) => {
                const p = nodePos(C.cx, C.cy, n, i, baseR);
                const kk = k++;
                return (
                  <g
                    key={s}
                    className="c-node"
                    style={vars({ color: hex, '--dur': `${3 + (kk % 5) * 0.5}s`, '--d': `${(kk % 9) * 0.4}s` })}
                  >
                    <circle cx={p.x} cy={p.y} r={13} className="c-halo" />
                    <circle cx={p.x} cy={p.y} r={4.5} className="c-core" />
                    {titles?.[s] && <title>{titles[s]}</title>}
                  </g>
                );
              })}
            </g>
            <text
              x={C.cx}
              y={C.cy - baseR - 16}
              className="c-cluster-label"
              style={{ fill: hex }}
            >
              {C.zh}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
