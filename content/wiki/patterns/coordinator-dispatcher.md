---
title: 协调器 / 调度器
description: 跨 agent、工作流和工具分发请求——管理任务状态、重试、超时和路由。
---

# 协调器 / 调度器

## 定义

调度器向 agent、工作流或工具分发请求，并维护任务状态、重试、超时和路由策略。相比 Router，它更偏工程导向；相比 Supervisor，它更像一个系统组件。

**类别**：控制结构

## 结构

```mermaid
flowchart TD
  U[用户请求] --> D[调度器]
  D --> Q[任务队列]
  D --> P[策略引擎]
  D --> R[路由器]
  R --> A1[Agent A]
  R --> A2[Agent B]
  R --> W[工作流]
  A1 --> D
  A2 --> D
  W --> D
```

## 适用场景

内部平台、长时间运行的任务、多租户 agent 服务、需要可恢复调度和统一策略的系统。

## 不适用场景

一次性演示、单 agent 对话或无状态恢复需求的轻量级任务。

## 实现方式

1. 将调度器设计为服务层——而非 LLM agent。
2. 对每个请求，创建 task / run / session 并写入检查点。
3. 根据策略选择同步执行、异步队列、工作流或交接。
4. 将 agent 结果归约为统一状态：`success / blocked / need_input / failed`。
5. 在调度器层面集中管理重试、取消、超时和预算。

## 最小化伪代码

```ts
type DispatchDecision = {
  mode: "agent" | "workflow" | "tool" | "ask_user";
  target: string;
  async: boolean;
  reason: string;
};

async function dispatch(req: UserRequest) {
  const run = await runs.create(req);
  const decision = await router.decide(req, policy.allowedTargets(req));
  return scheduler.schedule(run, decision);
}
```

## 推荐的追踪事件

- `dispatch.request.created`
- `dispatch.decision.made`
- `dispatch.scheduled`
- `dispatch.completed`

## 常见失败模式

- 调度器开始编写复杂 prompt——变成了一个不透明的 agent。
- 缺少 task / run / session 分层。
- 重试策略分散在各个 agent 内部。

## 实现检查清单

- [ ] 触发条件和退出条件已定义。
- [ ] 输入/输出 schema 已定义。
- [ ] 权限、预算、超时和重试策略已定义。
- [ ] 追踪事件已定义。
- [ ] 降级或人工接管策略已定义。

## 参考资料

- [Google ADK 模式](https://developers.googleblog.com/developers-guide-to-multi-agent-patterns-in-adk/)