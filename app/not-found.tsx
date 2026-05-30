import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-w-0 flex-1 py-16 lg:pl-10 lg:pr-8">
      <div className="max-w-[760px]">
        <span className="inline-flex items-center rounded-md border border-border bg-muted/40 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          404
        </span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">页面未找到</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
          你要找的百科页面不存在。请浏览侧边栏，或直接跳转到以下页面：
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            { href: '/', label: '首页', sub: '概览与推荐路径' },
            { href: '/patterns', label: '模式', sub: '30 种多智能体模式' },
            { href: '/workflows', label: '工作流', sub: '动态工作流编排' },
            { href: '/taxonomy', label: '分类', sub: '工程维度视角' },
            { href: '/decision-matrix', label: '决策矩阵', sub: '按任务选择' },
          ].map(it => (
            <Link
              key={it.href}
              href={it.href}
              className="group flex flex-col gap-1 rounded-lg border border-border p-3 transition-colors hover:border-brand/40 hover:bg-accent/30"
            >
              <span className="text-sm font-medium text-foreground transition-colors group-hover:text-brand">
                {it.label}
              </span>
              <span className="text-[12px] text-muted-foreground">{it.sub}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
