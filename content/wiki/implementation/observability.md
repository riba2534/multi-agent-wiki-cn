---
title: 可观测性与事件模型
description: 多智能体平台的追踪、事件和指标设计。
---

# 可观测性与事件模型

缺乏追踪能力，多智能体平台基本上难以维护。你需要记录的不仅是最终答案——**每一次路由决策、消息、工具调用、交接、状态变更、审批、失败和重试**都需要记录。

## 事件模型

```ts
export type AgentEvent = {
  id: string;
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  sessionId: string;
  runId: string;
  taskId?: string;
  actor: string;
  type: AgentEventType;
  payload: unknown;
  timestamp: string;
  schemaVersion: string;
};
```

## 推荐的事件类型

| 类型 | 含义 |
|---|---|
| `session.started` | 会话开始 |
| `workflow.node.enter` | 进入工作流节点 |
| `agent.message.created` | 智能体生成消息 |
| `agent.task.assigned` | 任务已分配给智能体 |
| `tool.call.started` | 工具调用开始 |
| `tool.call.completed` | 工具调用完成 |
| `handoff.requested` | 发起交接 |
| `handoff.accepted` | 交接被接受 |
| `blackboard.item.created` | 共享状态写入 |
| `approval.requested` | 请求审批 |
| `approval.granted` | 审批通过 |
| `verifier.issue.found` | 验证器发现问题 |
| `loop.round.completed` | 优化循环迭代完成 |
| `budget.exceeded` | 预算耗尽 |
| `session.completed` | 会话结束 |

## 指标

| 指标 | 含义 |
|---|---|
| 任务成功率 | 成功任务的比例 |
| 交接循环率 | 出现交接循环的会话比例 |
| 验证器拒绝率 | 验证器拒绝的频率 |
| 平均智能体深度 | 平均调用深度 |
| 工具失败率 | 每次调用的工具错误率 |
| 每成功任务成本 | 分摊到成功任务上的成本 |
| 人工审批延迟 | 审批队列等待时间 |
| 上下文压缩比 | 压缩有效性 |

## 追踪界面建议

将每个会话渲染为一棵树：

```text
会话
├─ 规划器
│  └─ 计划.已创建
├─ 搜索智能体
│  ├─ 工具.网络搜索
│  └─ 结果.摘要
├─ 代码智能体
│  ├─ 工具.读取文件
│  ├─ 工具.编辑文件
│  └─ 补丁.已创建
├─ 测试智能体
│  └─ 测试.失败
├─ 代码智能体重试
└─ 审查者
   └─ 已批准
```

## 最小可行流水线

1. 首先将所有事件写入仅追加的 JSONL 文件。
2. 将关键字段镜像到 Postgres / ClickHouse。
3. 使用 `traceId / spanId` 进行树形渲染。
4. 对消息和工具调用中的敏感字段进行脱敏。
5. 最终接入 OpenTelemetry 或你自己的可观测性平台。