---
title: Wiki 内容模型
description: 如何为每个多智能体模式编写页面。
---

# Wiki 内容模型

每个模式页面应遵循统一的结构。这样 Wiki 就不只是一个文章合集，而是一个可以搜索、比较且其导航可自动生成的知识库。

## 页面 frontmatter

```yaml
title: Supervisor / Manager
description: 一个主智能体负责规划、路由与综合汇总，专家智能体执行子任务。
category: Control
difficulty: medium
production_readiness: high
related_patterns:
  - agents-as-tools
  - graph-workflow
  - generator-critic
```

## 页面章节

1. 定义
2. 结构 (Mermaid)
3. 何时使用
4. 何时不使用
5. 如何实现
6. 最小化伪代码
7. 推荐的 trace 事件
8. 常见失败模式
9. 实现检查清单
10. 参考文献

## 模式元数据

```ts
export type PatternMeta = {
  slug: string;
  title: string;
  category: "control" | "information" | "decision" | "environment" | "protocol";
  difficulty: "easy" | "medium" | "hard";
  productionReadiness: "low" | "medium" | "high";
  latencyCost: "low" | "medium" | "high";
  tokenCost: "low" | "medium" | "high";
  bestFor: string[];
  avoidWhen: string[];
  related: string[];
};
```

## 推荐站点布局

```text
docs/
├─ index.md
├─ taxonomy.md
├─ decision-matrix.md
├─ patterns/
│  ├─ index.md
│  ├─ supervisor-manager.md
│  ├─ handoff-router.md
│  └─ ...
├─ implementation/
│  ├─ production-runtime.md
│  ├─ orchestrator.md
│  ├─ observability.md
│  └─ safety-guardrails.md
└─ reference/
   ├─ glossary.md
   └─ references.md
```