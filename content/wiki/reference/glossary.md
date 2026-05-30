---
title: 术语表
description: 多 Agent 常用术语
---

# 术语表

| 术语 | 含义 |
|---|---|
| Agent（Agent） | 具有目标、上下文、工具和策略的执行单元 |
| 编排器（Orchestrator） | 调度 Agent 、维护状态、驱动流程 |
| 监督者（Supervisor） | 集中式主 Agent——负责规划、路由、综合汇总 |
| 交接（Handoff） | 一个 Agent 将对话控制权转移给另一个 Agent |
| 子 Agent（Subagent） | 由宿主 Agent 调用的 Agent，通常专注于特定领域 |
| 黑板（Blackboard） | 用于共享状态、证据或产物的公共空间 |
| 追踪（Trace） | Agent 执行过程的结构化记录 |
| MCP | Model Context Protocol——连接工具、资源、提示 |
| A2A | Agent-to-Agent Protocol——Agent 间互操作协议（由 Google 发起，已合并原 IBM/BeeAI 的 ACP） |
| ACP | Agent Communication Protocol——原 IBM/BeeAI 发起的 Agent 间通信协议，现已并入 A2A |
| Agent 客户端协议（Agent Client Protocol） | IDE/客户端到编码 Agent 的标准化连接协议（独立协议，与 ACP 无关） |
| ANP | Agent Network Protocol——Agent 网络发现协议 |
| 人在回路（HITL） | Human-in-the-loop——人类审批、纠正、决策 |
| 验证器（Verifier） | 用于验证、审查或评分的 Agent 或工具 |
| 精炼循环（Refinement Loop） | 迭代式的"生成→评估→修订"循环 |
| 混合 Agent（MoA） | Mixture-of-Agents——分层集成 |
| 共识主动性（Stigmergy） | 通过环境痕迹实现 Agent 间间接协作 |
| 检查点（Checkpoint） | 持久化的工作流状态快照，用于任务恢复和重放 |
| 护栏（Guardrails） | 限制 Agent 行为的安全策略机制——包括输入检查、工具限制、输出审查、预算控制 |
| 产出物（Artifact） | Agent 执行过程中产生的文件、代码、文档等结果 |
| 预算（Budget） | 对 Agent 执行的成本、token 数量或调用次数的上限约束 |
| 流水线（Pipeline） | 按固定顺序串联的处理阶段 |
| 扇出/汇聚（Fan-out / Gather） | 将任务并行分发到多个 Agent，再汇聚结果 |
| 群体智能（Swarm） | 去中心化的同构 Agent 协作模式 |
| 合同网（Contract Net） | 基于招标-投标-授标的任务分配协议 |
| Span | 分布式追踪中的时间区间（单个操作） |
| 会话/运行（Session / Run） | 一次用户交互的完整生命周期（Session）及其中的单次执行（Run） |
| 工作区/沙箱（Workspace / Sandbox） | Agent 执行任务的隔离环境，防止副作用扩散 |
| 策略（Policy） | 定义 Agent 权限、工具访问和操作限制的规则集 |