'use client';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Network, Workflow, Share2, Scale, Boxes, Cable, Sparkles, type LucideIcon } from 'lucide-react';
import { CATEGORY_HEX, type PatternCategory } from '@/lib/pattern-map';

export interface HomeCategory {
  label: PatternCategory;
  count: number;
  items: { label: string; href: string }[];
}

/** Chinese name + one-line description + icon for each taxonomy dimension. */
const META: Record<PatternCategory, { zh: string; desc: string; Icon: LucideIcon }> = {
  Control:     { zh: '控制结构', desc: '谁掌握控制权、如何路由与分解任务', Icon: Network },
  Workflow:    { zh: '工作流',   desc: '把计划固化为脚本，编排子智能体扇出执行', Icon: Workflow },
  Information: { zh: '信息流',   desc: 'Agent 之间如何传递上下文与中间结果', Icon: Share2 },
  Decision:    { zh: '决策',     desc: '如何在多个候选输出间收敛出结论', Icon: Scale },
  Environment: { zh: '执行环境', desc: 'Agent 与环境、人、沙箱如何交互', Icon: Boxes },
  Protocol:    { zh: '协议互联', desc: '通过 MCP / A2A 等协议对外暴露与互通', Icon: Cable },
  Specialized: { zh: '专项模式', desc: '组合、联邦、仿真与多智能体学习', Icon: Sparkles },
};

export function CategoryGrid({ categories }: { categories: HomeCategory[] }) {
  const reduce = useReducedMotion();
  return (
    <section className="mt-24">
      <div className="mb-8 flex flex-col gap-2">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          工程维度分类法
        </span>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
          按工程维度组织的 30 种模式
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, i) => {
          const meta = META[cat.label];
          const Icon = meta.Icon;
          const accent = CATEGORY_HEX[cat.label];
          return (
            <motion.div
              key={cat.label}
              initial={reduce ? undefined : { opacity: 0, y: 16 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href="/patterns"
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[var(--shadow-card-hover)]"
              >
                {/* top accent bar in the category's color */}
                <span
                  className="absolute inset-x-0 top-0 h-[3px] opacity-80"
                  style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
                  aria-hidden
                />
                <div className="flex items-center justify-between">
                  <span
                    className="flex size-10 items-center justify-center rounded-xl"
                    style={{ background: `${accent}1a`, color: accent }}
                  >
                    <Icon className="size-5" />
                  </span>
                  <span className="font-mono text-[11px] font-medium tabular-nums text-muted-foreground">
                    {cat.count} 模式
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-brand">
                  {meta.zh}
                </h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">
                  {meta.desc}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {cat.items.slice(0, 3).map(it => (
                    <span
                      key={it.href}
                      className="rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {it.label}
                    </span>
                  ))}
                  {cat.count > 3 && (
                    <span className="rounded-md px-1.5 py-0.5 text-[11px] text-muted-foreground/70">
                      +{cat.count - 3}
                    </span>
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
