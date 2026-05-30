---
title: 组合模式
description: 真实生产系统将流水线、并行、交接、评审、人机协同、黑板和协议层组合在一起。
---

# 组合模式

## 定义

真实生产系统很少是单一模式。它们将流水线、并行、交接、评审、人机协同、黑板和协议层组合到一个业务流程中。

**分类**：组合

## 结构

```mermaid
flowchart LR
  U[用户] --> D[调度器]
  D --> P[规划器]
  P --> F[并行扇出]
  F --> G[汇聚]
  G --> C[评审]
  C -->|未通过| L[优化循环]
  L --> G
  C -->|有风险| H[人工审批]
  C -->|通过| R[最终输出]
  H --> R
```

## 适用场景

企业级 agent 平台、编码 agent、客服 agent、研究 agent——任何对稳定交付有要求的场景。

## 不适用场景

在单一模式未经验证之前。组合的复杂性会迅速膨胀。

## 如何实现

1. 先确定主流程：工作流 / 图。
2. 在特定节点插入模式：并行检索、交接、评审、审批。
3. 所有模式共享一个状态模型、事件模型和任务注册表。
4. 在每个组合边界定义输入/输出 schema。
5. 先交付 P0 路径；后续迭代添加高级模式。

## 最小化伪代码

```ts
const workflow = graph()
  .node("plan", planner)
  .node("parallel_research", fanout([searchA, searchB]))
  .node("draft", writer)
  .node("review", critic)
  .edge("review", s => s.review.pass ? "final" : "draft");

return workflow.run(userTask);
```

## 推荐的追踪事件

- `composite.workflow.started`
- `composite.pattern.enter`
- `composite.pattern.exit`
- `composite.workflow.completed`

## 常见失败模式

- 组合后无法判断哪个模式导致了问题。
- 状态模型不一致。
- 每个模式有自己的追踪，没有统一的关联手段。

## 实施清单

- [ ] 触发和退出条件已定义。
- [ ] 输入/输出 schema 已定义。
- [ ] 权限、预算、超时和重试策略已定义。
- [ ] 追踪事件已定义。
- [ ] 降级或人工接管策略已定义。

## 参考资料

- [Google ADK 模式](https://developers.googleblog.com/developers-guide-to-multi-agent-patterns-in-adk/)
- [Microsoft Agent Framework](https://learn.microsoft.com/en-us/agent-framework/overview/)