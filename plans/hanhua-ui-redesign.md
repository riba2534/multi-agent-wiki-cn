# Multi-Agent Wiki 汉化 + UI 重设计计划

## 项目分析摘要

项目是一个 Next.js 16 (App Router) 构建的 Multi-Agent Wiki 知识库站点，包含：

| 层级 | 文件数 | 内容类型 |
|------|--------|---------|
| 内容文件 | 40 个 .md | Wiki 文档（模式说明、分类学、实现指南） |
| 数据文件 | 2 个 .ts | 交互式动画图表的模式数据（节点、连线、时间线标题） |
| React 组件 | ~15 个 .tsx | UI 组件（导航、侧边栏、Markdown 渲染、动画图表、控制面板） |
| 配置/库 | ~10 个 .ts | 站点配置、路由、导航生成 |

### 关键交互组件（必须完整保留并汉化）

1. **DiagramCanvas.tsx** — SVG 驱动的动画拓扑图，带 token 粒子动画、节点脉冲、连线动画
2. **AnimatedPattern.tsx** — 包装 DiagramCanvas，提供播放控制/时间线标题/变体切换
3. **Controls.tsx** — Play/Pause/Prev/Next/Replay/速度控制
4. **FlowDiagram.tsx** — React Flow 驱动的 Mermaid 图表渲染器（拖拽/缩放/全屏）
5. **useAnimationEngine.ts** — 动画状态机 Hook

---

## Phase 1：并行翻译全部内容文件（15 个翻译 Agent）

将 40 个 markdown 内容文件 + 2 个数据文件分成 15 组，每个 Agent 负责一组，并行执行。

### 翻译原则
- **技术术语保留英文**：代码、函数名、协议名（MCP/A2A/ACP）、框架名（LangGraph/OpenAI Agents SDK）
- **描述/说明/标题汉化**：段落文字、列表项、标题、表格内容
- **YAML frontmatter**：title + description 汉化
- **Mermaid 图表标签**：节点标签汉化，保留语法结构
- **代码块保持不变**
- **内部标识符不翻译**：文件路径、slug、id、CSS 类名

### 分组方案（按文件内容量均衡分配）

| Agent | 文件 | 内容量 |
|-------|------|--------|
| tr-01 | index.md, taxonomy.md | 主页 + 分类学（核心页面） |
| tr-02 | decision-matrix.md, patterns/index.md | 决策矩阵 + 模式总览 |
| tr-03 | patterns/supervisor-manager.md, patterns/agents-as-tools.md, patterns/handoff-router.md | 控制类 1 |
| tr-04 | patterns/hierarchical-decomposition.md, patterns/graph-workflow.md, patterns/peer-swarm.md | 控制类 2 |
| tr-05 | patterns/coordinator-dispatcher.md, patterns/sequential-pipeline.md, patterns/parallel-fanout-gather.md | 控制类 3 + 流式 1 |
| tr-06 | patterns/group-chat.md, patterns/nested-chat.md, patterns/blackboard-shared-memory.md | 对话类 |
| tr-07 | patterns/event-bus-pubsub.md, patterns/debate-judge.md, patterns/generator-critic.md | 流式 2 + 决策 1 |
| tr-08 | patterns/refinement-loop.md, patterns/market-auction-contract-net.md, patterns/mixture-of-agents.md, patterns/voting-ensemble.md | 决策类 2 |
| tr-09 | patterns/clarification-at-edge.md, patterns/role-playing-sop.md, patterns/human-in-the-loop.md | 决策 3 + 环境 1 |
| tr-10 | patterns/workspace-isolation.md, patterns/stigmergy-environment-mediated.md, patterns/social-simulation.md, patterns/marl-ctde.md | 环境类 |
| tr-11 | patterns/protocol-mediated.md, patterns/composite-pattern.md, patterns/coalition-federation-holonic.md | 协议 + 专门 |
| tr-12 | implementation/production-runtime.md, implementation/orchestrator.md | 实现指南 1 |
| tr-13 | implementation/observability.md, implementation/safety-guardrails.md | 实现指南 2 |
| tr-14 | implementation/content-model.md, implementation/pattern-page-template.md, reference/glossary.md, reference/references.md | 实现 3 + 参考 |
| tr-15 | data/patterns.ts（前半部分）, data/patterns-extra.ts（前半部分） | 数据文件翻译 |

> 每个翻译 Agent 的工作：读取文件 → 翻译文本内容 → 写入汉化后的文件（到项目工作目录）

---

## Phase 2：组件文本汉化（3 个 Agent 并行）

翻译 React 组件中的用户可见文本，保留代码逻辑和标识符。

### 需要修改的组件

| Agent | 文件 | 翻译内容 |
|-------|------|---------|
| ui-tr-1 | top-nav.tsx, wiki-shell.tsx, Controls.tsx, AnimatedPattern.tsx, TopologyHero.tsx | 导航标签、按钮文字、页脚、Badge 文字 |
| ui-tr-2 | sidebar.tsx, markdown.tsx, code-block.tsx, toc.tsx, mermaid.tsx, mermaid-modal.tsx | 侧边栏无障碍标签、TOC 标题、全屏查看器标签 |
| ui-tr-3 | layout.tsx, page.tsx, site.ts, robots.ts, manifest.ts, not-found.tsx | 站点元数据、SEO、404 页面 |

---

## Phase 3：UI 现代化重设计（4 个 Agent 并行）

在汉化基础上，重新设计视觉样式，使其更现代、更有质感。

### 设计方向
- **色彩体系**：采用更鲜明的渐变 + 毛玻璃效果，品牌色从蓝色系切换为紫蓝渐变
- **排版**：引入更现代的字重对比，标题更大更醒目
- **卡片/容器**：增加微妙的渐变背景、更柔和的阴影、更精致的圆角
- **导航栏**：增加玻璃态效果，加粗品牌标识
- **侧边栏**：优化分组视觉层级，增加悬停过渡动画
- **代码块**：更精致的标题栏、更好的语法高亮配色
- **动画图表**：保持全部交互功能，优化容器样式
- **首页**：增加 Hero 区域的视觉冲击力

| Agent | 文件 | 重设计内容 |
|-------|------|-----------|
| ui-01 | globals.css | 全部 CSS 变量重设计（色彩/圆角/阴影/字体），引入渐变和毛玻璃效果 |
| ui-02 | layout.tsx, top-nav.tsx, theme-toggle.tsx, theme-provider.tsx, logo.tsx | 全局布局、导航栏现代化、Logo 重设计 |
| ui-03 | wiki-shell.tsx, sidebar.tsx, toc.tsx, markdown.tsx, code-block.tsx | 内容区域、侧边栏、TOC、Markdown 渲染现代化 |
| ui-04 | Controls.tsx, AnimatedPattern.tsx, DiagramCanvas.tsx, FlowDiagram.tsx, TopologyHero.tsx, mermaid.tsx | 动画图表组件容器现代化（不改动画逻辑） |

---

## Phase 4：验证构建（1 个 Agent）

```bash
cd <project-dir> && npm install && npm run build
```

确保项目能成功构建，所有页面正常渲染。

---

## 输出目录

所有汉化和重设计后的文件写入 `/Users/hepengcheng/airepo/multi-agent-wiki-cn/` 目录（项目根目录），覆盖现有文件。