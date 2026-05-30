<div align="center">

# 多智能体 Wiki · Multi-Agent Wiki

**多智能体（Multi-Agent）交互模式、分类与工程实现的实用参考**

[![在线访问](https://img.shields.io/badge/在线访问-magent.wiki-6d4aff?style=flat-square)](https://magent.wiki)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react)](https://react.dev)
[![部署](https://img.shields.io/badge/部署-Cloudflare%20Pages-f38020?style=flat-square&logo=cloudflare)](https://pages.cloudflare.com)

[**🌐 在线预览 magent.wiki**](https://magent.wiki)

</div>

---

一个面向工程师的**多智能体系统设计模式知识库**：**29 种交互模式**，按**五维工程分类法**组织，外加 **6 篇生产级实现指南**和一份术语表。

每一种模式都回答四个问题：**解决什么问题、控制结构如何、怎样落地、何时不该用**。多数模式页还内嵌一个**实时动画可视化**，逐步演示消息在智能体之间的流转。

> 不按框架名称分类，而是按工程维度分类——任何真实系统通常都同时组合多种模式。

## ✨ 特性

- **五维分类法** — 控制结构 / 信息流 / 决策 / 执行环境 / 协议互联（外加专项模式），把 29 种模式按工程关注点组织。
- **结构化模式页** — 每页包含：拓扑图、适用 / 不适用场景、最小化伪代码、推荐追踪事件、常见失败模式、落地检查清单、参考资料。
- **实时可视化** — 一套手写动画引擎，逐步高亮节点与连线、演示消息流转；封面的全景星座、首页的分类切换器、模式页内嵌动画**共用同一套引擎**。
- **Observatory 视觉风格** — 暗色画布、节点呼吸、连线脉冲、发光粒子；支持明暗双主题。
- **⌘K 命令面板** — 全站全文检索，快速跳转任意模式 / 指南 / 术语。
- **移动端适配** — 抽屉式导航、阅读进度、紧凑控制条，手机上同样好用。
- **Agent 友好** — 提供 `/llms.txt`、`/llms-full.txt` 端点，方便大模型抓取整站内容。
- **内容即代码** — 所有内容都是 `content/wiki/` 下的 Markdown，唯一数据源，易于贡献。

## 🛠 技术栈

- **框架**：Next.js 16（App Router）+ React 19 + TypeScript
- **样式**：Tailwind CSS v4（shadcn 风格设计 token，`next-themes` 明暗主题）
- **动画**：framer-motion + 手写 SVG 动画引擎
- **内容渲染**：react-markdown + remark-gfm + rehype-highlight
- **图表**：mermaid + `@xyflow/react`（React Flow）+ dagre 自动布局
- **字体**：Geist Sans / Geist Mono
- **测试**：Playwright（E2E）

## 🚀 本地开发

```bash
git clone https://github.com/riba2534/multi-agent-wiki-cn.git
cd multi-agent-wiki-cn
npm install
npm run dev
```

打开 <http://localhost:3000> 即可预览。

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 生产构建（静态导出到 `out/`） |
| `npm start` | 运行生产构建 |
| `npm run lint` | ESLint 检查 |
| `npm run test:e2e` | 运行 Playwright E2E 测试 |
| `npm run test:e2e:ui` | Playwright 交互式 UI 模式 |

## 📁 项目结构

```
app/
  layout.tsx              根布局（顶栏、命令面板、移动端抽屉、主题、环境光）
  page.tsx                首页封面（全屏星座 + 六维分类切换器）
  (docs)/
    layout.tsx            文档布局（持久化左侧栏）
    [...slug]/page.tsx    catch-all，渲染任意 wiki 页；模式页顶部内嵌动画
  llms.txt/ llms-full.txt route handler（Agent 友好端点，构建时静态生成）
  sitemap.ts · robots.ts · manifest.ts · opengraph-image.tsx
  globals.css             设计 token、动画样式、observatory 主题
components/
  home/                   封面 cover、星座 constellation、分类切换器、分类卡片、路径卡
  wiki/                   markdown 渲染、mermaid、侧栏、布局壳、动画组件、移动导航……
  search/                 ⌘K 命令面板
  ui/                     shadcn 风格基础组件（Button / Card / Badge / Separator）
  DiagramCanvas · Controls  动画可视化画布与控制条
content/wiki/             所有 Markdown 内容（唯一数据源）
  index.md · taxonomy.md · decision-matrix.md
  patterns/              29 种模式
  implementation/        6 篇实现指南
  reference/             术语表、参考资料
data/patterns.ts          动画数据（驱动模式页与切换器的逐步动画）
hooks/useAnimationEngine.ts
lib/                      内容加载、导航树、pattern 映射、搜索索引、工具函数
e2e/                      Playwright 测试
```

## 📝 新增一个模式页

1. 在 `content/wiki/patterns/<slug>.md` 新建文件，参考 [`content/wiki/implementation/pattern-page-template.md`](content/wiki/implementation/pattern-page-template.md) 模板。
2. 在 `lib/pattern-map.ts` 把该 slug 登记到对应的分类维度，使其出现在侧栏与分类法中。
3. （可选）若该模式有动画版本，在 `data/patterns.ts` 添加动画数据，模式页会自动内嵌实时可视化。

## 🤖 Agent 友好端点

| 地址 | 用途 |
| --- | --- |
| [`/llms.txt`](https://magent.wiki/llms.txt) | 站点概览 + 每页一行摘要（[llms.txt 规范](https://llmstxt.org/)） |
| [`/llms-full.txt`](https://magent.wiki/llms-full.txt) | 全站每一页拼接成纯 Markdown |

两者均在构建时由 `content/wiki/` 静态生成，HTML `<head>` 也声明了 `<link rel="alternate" type="text/markdown">` 便于发现。

## ☁️ 部署（Cloudflare Pages）

站点是**纯静态导出**（`next.config.ts` 中 `output: 'export'`，构建产物在 `out/`），托管在 **Cloudflare Pages**，通过 **Git 集成**实现每次推送 `main` 自动构建部署。

- **构建命令**：`npm run build`
- **输出目录**：`out`
- **生产域名**：[magent.wiki](https://magent.wiki)

> 注意：依赖必须从公共 npm registry（`registry.npmjs.org`）安装——项目已内置 `.npmrc` 固定公共源，避免内部镜像污染 `package-lock.json` 导致云端构建失败。

## 🙏 致谢

本项目在 [fuergaosi233/multiagent-explorer](https://github.com/fuergaosi233/multiagent-explorer) 的基础上完成简体中文本地化与界面重设计，感谢原作者的工作。

## 📄 License

本仓库尚未声明开源许可证。如需复用，请先与作者确认。
