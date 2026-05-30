---
title: 并行扇出 / 汇聚
description: 将任务并行拆分到多个 agent；由汇聚器合并结果。
---

# 并行扇出 / 汇聚

## 定义

将任务拆分到多个 agent 并发执行，然后由汇聚器合并、投票或综合结果。

**类别**：信息流

## 结构

```mermaid
flowchart TD
  T[任务] --> A[Agent A]
  T --> B[Agent B]
  T --> C[Agent C]
  A --> G[汇聚 / 聚合器]
  B --> G
  C --> G
  G --> R[结果]
```

## 适用场景

多视角探索、并行检索、并行代码阅读、日志分析、模型集成。

## 不适用场景

任务强依赖顺序、分支需要共享可变状态或预算紧张时。

## 实现方式

1. 扇出前，为每个分支设定明确目标——避免重复工作。
2. 分支默认共享只读上下文，绝不共享工作空间。
3. 汇聚步骤执行去重、冲突检测和证据合并——而非简单的拼接。
4. 配置并发数、超时、取消和预算上限。

## 最小化伪代码

```ts
const branches = plan.branches.map(branch =>
  runWithTimeout(agentFor(branch).run(branch), branch.timeoutMs)
);
const results = await Promise.allSettled(branches);
return aggregator.run({ task, results });
```

## 推荐的追踪事件

- `fanout.started`
- `branch.started`
- `branch.completed`
- `branch.timeout`
- `gather.started`
- `gather.completed`

## 常见失败模式

- 多个 agent 做相同的工作。
- 汇聚器静默合并了矛盾的结论。
- 并发写入破坏了共享工作空间。

## 实现检查清单

- [ ] 输入/输出 schema 已定义。
- [ ] 每个 agent 的权限边界已定义。
- [ ] 每次 agent 调用都携带 run id / trace id。
- [ ] 失败、超时、取消和重试策略已定义。
- [ ] 传入的上下文为所需的最小量，而非完整历史。
- [ ] 高风险操作受审批或验证器门控。

## 参考资料

- [Google ADK 模式](https://developers.googleblog.com/developers-guide-to-multi-agent-patterns-in-adk/)