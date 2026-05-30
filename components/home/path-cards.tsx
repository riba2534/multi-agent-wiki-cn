'use client';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Compass, GitBranch, Server, PlusCircle, ArrowRight, type LucideIcon } from 'lucide-react';

interface Path {
  role: string;
  title: string;
  desc: string;
  href: string;
  Icon: LucideIcon;
}

/** Mirrors the "推荐阅读路径" list in content/wiki/index.md. */
const PATHS: Path[] = [
  { role: '新来的',     title: '从分类法开始',     desc: '用五个工程维度建立全局心智模型', href: '/taxonomy', Icon: Compass },
  { role: '选择设计方案', title: '决策矩阵',         desc: '按约束快速定位适合的模式组合', href: '/decision-matrix', Icon: GitBranch },
  { role: '搭建平台',   title: '生产运行时架构',   desc: '编排、可观测性与安全护栏的落地', href: '/implementation/production-runtime', Icon: Server },
  { role: '添加新模式', title: '模式页面模板',     desc: '用统一结构贡献一种新交互模式', href: '/implementation/pattern-page-template', Icon: PlusCircle },
];

export function PathCards() {
  const reduce = useReducedMotion();
  return (
    <section className="mt-24">
      <div className="mb-8 flex flex-col gap-2">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          从哪开始
        </span>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
          按你的目标选一条阅读路径
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {PATHS.map((p, i) => {
          const Icon = p.Icon;
          return (
            <motion.div
              key={p.href}
              initial={reduce ? undefined : { opacity: 0, y: 16 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={p.href}
                className="group flex h-full items-start gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[var(--shadow-card-hover)]"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand/15">
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    {p.role}
                  </span>
                  <h3 className="mt-1 flex items-center gap-1.5 text-[15px] font-semibold text-foreground transition-colors group-hover:text-brand">
                    {p.title}
                    <ArrowRight className="size-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                  </h3>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">{p.desc}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
