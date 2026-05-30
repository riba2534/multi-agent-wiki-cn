---
title: 模式概览
description: 核心多智能体交互模式索引
---

# 模式概览

以下模式并非互斥——它们可以组合使用。一个生产级的编码智能体可能同时使用 `Supervisor + Parallel Fan-out + Blackboard + Generator-Critic + Human-in-the-loop + MCP`。

| # | 模式 | 类别 | 一句话描述 |
|---:|---|---|---|
| 1 | [Supervisor / Manager](./supervisor-manager) | 控制 | 一个主智能体负责规划、路由和综合；专家智能体执行子任务。 |
| 2 | [Agents-as-tools](./agents-as-tools) | 控制 | 专家以可调用工具形式暴露；宿主保持对话控制权。 |
| 3 | [Handoff / Router](./handoff-router) | 控制 | 当前智能体将控制权转交给另一个智能体，由后者接管对话。 |
| 4 | [Sequential Pipeline](./sequential-pipeline) | 信息 | 任务按固定顺序经过各个智能体；每步的输出是下一步的输入。 |
| 5 | [Parallel Fan-out / Gather](./parallel-fanout-gather) | 信息 | 将任务并行拆分给多个智能体；由一个聚合器合并结果。 |
| 6 | [Hierarchical Decomposition](./hierarchical-decomposition) | 控制 | 多层管理者-执行者层级；上层分解，下层执行，必要时递归。 |
| 7 | [Graph / State Machine / Workflow](./graph-workflow) | 控制 | 用显式的图或状态机定义流程，而非让 LLM 即兴发挥。 |
| 8 | [Group Chat / Meeting](./group-chat) | 信息 | 多个智能体共享一个会话线程；由主持人或选择器决定下一个发言者。 |
| 9 | [Nested Chat / Inner Team](./nested-chat) | 信息 | 一个智能体在对回复前先运行内部多智能体子对话。 |
| 10 | [Debate / Judge](./debate-judge) | 决策 | 多个智能体持对立立场，再由裁判或投票决定结果。 |
| 11 | [Generator-Critic](./generator-critic) | 决策 | 一个智能体生成；另一个评审、验证、评分或提出修改建议。 |
| 12 | [Refinement Loop](./refinement-loop) | 决策 | 生成 → 评估 → 修订，直到满足退出条件或达到预算上限。 |
| 13 | [Role-playing / SOP](./role-playing-sop) | 环境 | 智能体扮演 PM、架构师、开发、QA 等角色，遵循文档化的 SOP。 |
| 14 | [Blackboard / Shared Memory](./blackboard-shared-memory) | 信息 | 智能体通过共享状态、知识库、任务板或工作区间接协作。 |
| 15 | [Event Bus / Pub-Sub](./event-bus-pubsub) | 信息 | 智能体通过事件、主题或队列异步通信——而非直接调用。 |
| 16 | [Market / Auction / Contract Net](./market-auction-contract-net) | 决策 | 通过竞标、定价或合同网协议分配任务和资源。 |
| 17 | [Peer-to-peer / Swarm](./peer-swarm) | 控制 | 没有固定中心；智能体通过直接消息、共享环境或动态交接自组织。 |
| 18 | [Mixture-of-Agents](./mixture-of-agents) | 决策 | 分层集成——每层读取上一层的多个输出并加以改进。 |
| 19 | [Human-in-the-loop](./human-in-the-loop) | 环境 | 人类作为特殊智能体参与审批、纠正、路由、中断或最终决策。 |
| 20 | [Protocol-mediated Network](./protocol-mediated) | 协议 | 通过 MCP、A2A、ACP、Agent Client Protocol 连接工具、智能体、客户端和平台。 |
| 21 | [Clarification-at-edge](./clarification-at-edge) | 决策 | 在智能体之间交接边界或不确定操作前插入澄清步骤。 |
| 22 | [Coordinator / Dispatcher](./coordinator-dispatcher) | 控制 | 调度器将请求分发给智能体、工作流或工具，并管理任务状态、重试、超时和路由。 |
| 23 | [Voting / Ensemble](./voting-ensemble) | 决策 | 多个智能体独立给出候选项；通过投票、评分或验证器选出最终答案。 |
| 24 | [Composite Pattern](./composite-pattern) | 组合 | 真实系统组合 pipeline + parallel + handoff + critic + HITL + blackboard + 协议层。 |
| 25 | [Workspace / Sandbox Isolation](./workspace-isolation) | 环境 | 每个智能体在独立的工作区、git worktree、容器或沙箱中运行，避免并发冲突破坏。 |
| 26 | [Stigmergy / Environment-mediated](./stigmergy-environment-mediated) | 环境 | 智能体在环境中留下痕迹（issue、todo、diff、测试结果）；其他智能体据此做出反应。 |
| 27 | [Coalition / Federation / Holonic](./coalition-federation-holonic) | 组织 | 智能体形成临时联盟、联邦或合弄——涉及治理、成员资格、自治边界。 |
| 28 | [Social Simulation](./social-simulation) | 模拟 | 模拟人群、组织或社会，具备长期记忆、关系网络和涌现行为。 |
| 29 | [MARL / CTDE](./marl-ctde) | 学习 | 多智能体强化学习；集中训练，分散执行。 |