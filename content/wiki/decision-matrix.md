---
title: 决策矩阵
description: 按任务特征选择多 Agent 模式
---

# 决策矩阵

## 按任务特征

| 任务特征 | 推荐模式 | 避免模式 | 原因 |
|---|---|---|---|
| 单轮专家查询 | Agents-as-tools | Handoff / Group Chat | 宿主可以直接保持控制权 |
| 多轮领域接管 | Handoff | Agents-as-tools | 专家需要直接与用户对话 |
| 固定流程 | Sequential Pipeline / Workflow | Swarm | 确定性是核心目标 |
| 多个独立子任务 | Parallel Fan-out / Gather | Sequential | 并行带来最大加速 |
| 长周期、复杂任务 | Graph Workflow + Task Registry | 纯 prompt 编排 | 需要支持恢复、取消、追踪 |
| 需要质量审查 | Generator-Critic / Refinement Loop | 单 Agent 自评分 | 自评分常常复现相同错误 |
| 比较多选项 | Debate / Voting / MoA | 单一路径 | 多候选项能暴露冲突 |
| 异步多方工作 | Blackboard / Event Bus | Group Chat | 共享状态比长对话更稳定 |
| 高风险操作 | Human-in-the-loop + Guardrails | 全自动化 | 权限和问责必须显式明确 |
| 跨工具生态 | MCP | 自定义工具协议 | 降低集成成本 |
| 跨 Agent/跨厂商 | A2A / ACP | 私有 RPC | 更适合互操作性 |
| IDE 到编码 Agent | Agent Client Protocol | 临时 HTTP API | 更接近编码 Agent 标准接入方式 |

## 按工程阶段

| 阶段 | 目标 | 推荐技术栈 |
|---|---|---|
| Demo | 证明可行性 | Single Agent + Tools + Agents-as-tools |
| MVP | 可用的产品 | Supervisor + Handoff + Trace |
| 内部平台 | 稳定、可恢复 | Graph Workflow + Task Registry + Blackboard + MCP |
| 生产平台 | 安全、可审计 | Runtime + Guardrails + HITL + Event Bus + Workspace Isolation |
| 生态 | 与其他系统互联 | MCP + A2A/ACP + Agent Client Protocol |

## 反模式

1. **一开始就上 Group Chat。** 看起来像多 Agent，但很少收敛。
2. **长任务没有状态机。** 半途任务无法恢复，也无法调试。
3. **所有 Agent 共享一个上下文。** 污染严重，权限边界消失。
4. **代码生成没有验证器。** Agent 会自信地生成错误的 diff。
5. **没有事件日志。** 出问题时，无法追溯发生了什么。