---
title: 编排器实现指南
description: 多智能体平台的调度器、路由器和状态机
---

# 编排器实现指南

编排器是多智能体平台的核心。它**不是**"一个会写优质提示词的智能体"——它是**工作流引擎 + 策略引擎 + 智能体调度器 + 追踪事件发射器**的组合。

## 职责

| 职责 | 描述 |
|---|---|
| 规划 | 将用户目标转化为任务树或工作流 |
| 路由 | 选择智能体、工具、下一个状态 |
| 调度 | 控制并发、超时、重试、取消 |
| 检查点 | 持久化状态以支持恢复 |
| 验证 | 调用评审器 / 测试 / 人工审批 |
| 观测 | 发射追踪事件 |
| 治理 | 强制执行权限、预算和安全策略 |

## 路由策略

### 1. 基于规则的路由

适用于确定性流程：

```ts
function routeByRule(task: Task): AgentId {
  if (task.goal.includes("test")) return "test-agent";
  if (task.goal.includes("code")) return "code-agent";
  if (task.goal.includes("search")) return "search-agent";
  return "general-agent";
}
```

### 2. LLM 路由

适用于开放性任务，但输出必须结构化：

```ts
const decisionSchema = z.object({
  action: z.enum(["call_agent", "handoff", "ask_user", "final"]),
  target: z.string().optional(),
  reason: z.string(),
  confidence: z.number(),
});
```

### 3. 混合路由

生产环境推荐方案：规则缩小候选范围，LLM 在允许的集合内选择。

```ts
const allowed = policy.allowedAgents(state);
const decision = await llmRouter.pick({ state, allowed });
if (!allowed.includes(decision.target)) throw new PolicyError();
```

## 调度策略

| 策略 | 适用场景 |
|---|---|
| 先进先出 (FIFO) | 普通任务队列 |
| 优先级队列 | 优先处理阻塞用户的任务 |
| 预算感知 | 按 token / 时间 / 成本预算限制 |
| 投机执行 | 并行运行多个智能体，取最优结果 |
| 退避重试 | 工具或网络故障 |
| 熔断器 | 某智能体反复失败时跳闸 |

## 检查点结构

每个检查点至少应包含：

```ts
export type Checkpoint = {
  sessionId: string;
  runId: string;
  workflowNode: string;
  taskTree: Task[];
  activeAgent?: string;
  blackboardVersion: string;
  messageCursor: string;
  toolCallCursor: string;
  budget: BudgetState;
  createdAt: string;
};
```

## 常见错误

- 编排器自己包办一切——退化为单一智能体。
- 没有检查点机制——任务无法恢复。
- LLM 路由缺少策略护栏——智能体调用不该用的工具。
- 子智能体输出缺少模式约束——下游节点无法解析。