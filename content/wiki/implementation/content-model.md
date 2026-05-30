---
title: Wiki 内容模型
description: 如何为每个多 Agent 模式编写页面。
---

# Wiki 内容模型

每个模式页面应遵循统一的结构。这样 Wiki 就不只是一个文章合集，而是一个可以搜索、比较且其导航可自动生成的知识库。

## 页面 frontmatter

```yaml
title: Supervisor / Manager
description: 一个主 Agent 负责规划、路由与综合汇总，专家 Agent 执行子任务。
category: control          # 全小写，与 PatternMeta 类型定义一致
difficulty: medium
productionReadiness: high  # camelCase，与 TypeScript 类型一致
latencyCost: low
tokenCost: medium
bestFor:
  - 生产系统
  - 任务拆解
avoidWhen:
  - 开放式探索
related:                   # 与 PatternMeta.related 字段名一致
  - agents-as-tools
  - graph-workflow
  - generator-critic
```

> **注意**：frontmatter 字段名采用 camelCase（与 TypeScript `PatternMeta` 类型一致）。`category` 值全小写。实际模式页面的 frontmatter 中 `title` 和 `description` 为必填字段，其余为可选的增强元数据。

## 页面章节

1. 定义
2. 结构 (Mermaid)
3. 适用场景
4. 不适用场景
5. 实现方法
6. 最小化伪代码
7. 推荐的追踪事件
8. 常见失败模式
9. 实现检查清单
10. 参考资料

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
content/wiki/
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
│  ├─ safety-guardrails.md
│  ├─ content-model.md
│  └─ pattern-page-template.md
└─ reference/
   ├─ glossary.md
   └─ references.md
```