---
title: 事件总线 / 发布-订阅
description: Agent通过事件、主题或队列进行异步通信——而非直接调用。
---

# 事件总线 / 发布-订阅

## 定义

Agent通过事件、主题和队列进行异步通信，而不是通过直接函数调用。

**分类**：信息流

## 结构

```mermaid
flowchart LR
  A[Agent A] --> E[(事件总线)]
  B[Agent B] --> E
  E --> C[订阅者 C]
  E --> D[订阅者 D]
  E --> O[可观测性]
```

## 适用场景

平台级异步任务、长时间运行的工作、可观测性、跨服务Agent编排。

## 不适用场景

简单的同步任务，或缺乏事件schema治理的组织。

## 实现方法

1. 设计统一的事件信封：`event_id, run_id, session_id, type, payload, timestamp`。
2. 为每种事件类型定义schema和版本。
3. 每个Agent操作都发布事件；编排器从日志中恢复状态。
4. 支持回放、去重、幂等性和死信队列。

## 最简伪代码

```ts
type AgentEvent = {
  id: string;
  runId: string;
  sessionId: string;
  type: string;
  actor: string;
  payload: unknown;
  ts: string;
  schemaVersion: string;
};
```

## 推荐的追踪事件

- `event.published`
- `event.consumed`
- `event.replayed`
- `event.dead_lettered`

## 常见失败模式

- 事件缺少schema定义。
- 重复消费导致重复副作用。
- 异步流水线难以调试。
- 事件量过大但未进行采样。

## 实现检查清单

- [ ] 输入/输出schema已定义。
- [ ] 每个Agent的权限边界已定义。
- [ ] 每次Agent调用都携带 run id / trace id。
- [ ] 失败、超时、取消和重试策略已定义。
- [ ] 传递的上下文为最小必要信息，而非完整历史记录。
- [ ] 高风险操作由审批或验证者把关。

## 参考文献

- [Microsoft Agent Framework](https://learn.microsoft.com/en-us/agent-framework/overview/)
- [Survey of communication](https://arxiv.org/html/2502.14321v2)