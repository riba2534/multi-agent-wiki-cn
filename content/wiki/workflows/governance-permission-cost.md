---
title: 治理、权限与成本
description: 动态工作流是工程系统，不是聊天功能。审批、权限、成本、恢复、可观测性、回滚都必须在长任务跑起来之前设计好。
---

# 治理、权限与成本

## 定义

一个会扇出几十个带写权限的子智能体、连续跑上几小时、消耗成百上千 token 的动态工作流，本质上不是一次聊天交互，而是一次**生产级工程操作**。它会修改文件、执行 shell、发起 MCP 调用、留下分支与 commit。把它当作一次数据库迁移或一次线上发布来对待——上线前要审批、要划权限、要算成本、要能恢复、要能观测、要能回滚。

**类别**：治理与运维

> 本页基于 Claude Code 动态工作流的真实 API（研究预览阶段，签名可能演进）。原语是**全局函数** `agent()` / `parallel()` / `pipeline()` / `phase()` / `log()` 与全局对象 `budget` / `args`，恢复用 `Workflow({ scriptPath, resumeFromRunId })` 自动重放——**没有** `ctx.checkpoint()` 这类原语。

## 治理面板

七个治理维度共同构成一道运行前到运行后的纵深防线，按"工作流生命周期"自然排序：

```mermaid
flowchart LR
  A["运行前审批<br/>(看脚本/估成本)"] --> B["权限继承<br/>(allowlist 预批)"]
  B --> C["成本控制<br/>(budget/model/上限)"]
  C --> D["执行 + 可观测性<br/>(/workflows + trace)"]
  D --> E["恢复<br/>(resumeFromRunId)"]
  E --> F["回滚<br/>(worktree/PR/人工门)"]
  F --> G["管理员控制<br/>(禁用/限定)"]
```

## 运行前审批：把脚本当迁移脚本审

动态工作流的**计划是一份显式的脚本产物**，这正是它相比"让 lead 在脑子里推理"的 Agent Teams 最重要的治理优势——计划在执行前可见、可读、可拒。启动前你应当看到三样东西：

- **阶段列表**：脚本里 `phase()` 划定的命名阶段，以及 `export const meta.phases` 声明的进度组。
- **成本估算**：基于扇出形状（多少个 item × 多少个 stage）与各 agent 体量估出的 token 总量。
- **脚本原文**：Claude 生成的工作流脚本本身，在执行之前。

不要跳过这一步。脚本是一等公民——像在生产库上跑迁移脚本前那样逐行读它。审查时重点核对：

- **阶段边界对不对**：`phase()` 是否切在你预期的位置？该并行的地方用了 `parallel()`/`pipeline()` 还是退化成串行？
- **扇出形状匹不匹配范围**：是 5 个 item 还是 500 个？`pipeline` 还是 `parallel`（前者无 barrier、墙钟更短，后者收齐全集、适合去重/排序，取舍见 [/patterns/parallel-fanout-gather](/patterns/parallel-fanout-gather)）？
- **有没有停止条件**：`while` 循环是否绑定了 `budget.remaining()` 或收敛计数，还是会无限跑？
- **写不写文件、写哪些路径**：哪些 `agent()` 带了写工具？有没有 `isolation: 'worktree'`？会落到哪个分支/目录？
- **确定性陷阱**：脚本里有没有 `Date.now()` / `Math.random()` / 无参 `new Date()`？这三个会抛错并破坏 resume——见下文恢复一节。

## 权限继承：子智能体继承父会话的 allowlist

子智能体**不会**获得比父 Claude Code 会话更宽的权限，但会**完整继承**父会话的工具 allowlist：

- 父会话 allowlist 里有 `Bash` → 每个子智能体都能执行 shell。
- 父会话 allowlist 里有 `Edit`/`Write` → 每个子智能体都能写文件。
- MCP 工具、Web 访问及其他能力同样逐级下传。

这意味着一个扇出 50 个 agent 的工作流，会把这 50 份能力放大成 50 倍的副作用面。运行大工作流前：

1. **审视当前 allowlist**：哪些工具已经被预先批准？
2. **评估范围是否配得上宽度**：一个只读审计工作流，真的需要 `Bash` 和 `Write` 在 allowlist 里吗？
3. **必要时收窄**：为这次工作流会话临时移除用不到的工具，是最便宜的爆炸半径控制。

**运行中权限弹窗会阻塞工作流。** 即便 allowlist 已经够宽，某些 shell 命令、Web 抓取或 MCP 调用仍可能在运行中触发权限提示。问题在于：一个在后台扇出几十个 agent 的工作流，一旦某个 agent 卡在弹窗上，整条链会停在那里等人点确认——而你可能根本没盯着。所以原则是**预批**：启动前把预期会用到的工具类别一次性批准，不要让长任务在半路停下来等一次本可提前完成的授权。

## 成本控制：小范围、小模型、硬上限、停止条件

工作流会把 token 用量**成倍放大**。一次 50 文件审计、每文件配一个验证者，最少就是 100 次 agent 调用，每次都带各自的上下文。把成本当成必须设计的约束，而不是事后才看的账单。

| 控制手段 | 真实 API / 做法 |
|---|---|
| 先小范围 | 先在 5 个文件上跑，确认扇出形状和产出质量，再放到 500 个 |
| 低风险阶段用小模型 | 发现/映射类 agent 用 `agent(prompt, { model: 'haiku' })`，综合/裁决类才用大模型 |
| 并发上限 | runtime 内置：单工作流并发 agent 上限 = `min(16, 核数 - 2)`，超出自动排队；生命周期总数硬上限 **1000** |
| Token 硬上限 | `budget.total`（用户用「+500k」式指令设定）是**硬上限**：`spent()` 触顶后再调 `agent()` 直接抛错 |
| 停止条件 | 用 `budget.remaining()` 或收敛计数做 `while` 循环退出，而非靠预算耗尽崩出来 |

**分模型省钱**——把廉价的发现阶段交给 `haiku`，把昂贵的判断留给主模型：

```javascript
export const meta = {
  name: "scoped-audit",
  description: "先小范围审计代码库，低风险阶段用更小模型",
  phases: ["发现", "深审"]
};

phase("发现");
// 发现/映射类只是粗筛，用更小模型，省下大头预算
const candidates = await parallel(
  FILES.map(f => () => agent(`扫描 ${f}，列出可疑点`, {
    label: `scan:${f}`,
    model: "haiku",
    schema: SuspicionSchema
  }))
);

phase("深审");
// 只对粗筛命中的文件用主模型深审（不传 model 即继承主循环模型）
const hits = candidates.filter(Boolean).filter(c => c.suspicious);
const findings = await parallel(
  hits.map(c => () => agent(`深入审计 ${c.file}`, { label: `audit:${c.file}`, schema: FindingSchema }))
);
```

**用 `budget` 做硬上限与动态停止**——预算是工作流的"熔断器"，而不是装饰：

```javascript
// budget.total 为 null 表示用户未设上限；设了就当熔断器用
const bugs = [];
while (budget.total && budget.remaining() > 50_000 && bugs.length < 10) {
  const found = await agent("再找一个未覆盖的边界 bug", { schema: BugSchema });
  if (!found) break;          // 用户跳过该 agent 时返回 null
  bugs.push(found);
}
log(`预算停在 spent=${budget.spent()} / total=${budget.total}，已找到 ${bugs.length} 个`);
```

**经验法则**：没在一个小范围任务上先跑过的工作流，不要直接放到整个代码库上。先验证扇出形状，再放量。成本从来不是孤立约束——它和权限宽度、可观测性深度在同一条决策线上互相拉扯：收窄 allowlist 既降爆炸半径又省掉无谓写操作的成本，多打 `log()`、多留人工门会增加墙钟与 token，却换来可定位、可回滚。把这三者放在一起权衡，而不是只盯账单。

## 恢复：同会话 resumeFromRunId，靠自动 journaling

工作流的持久化/恢复是 **runtime 自动完成的 journaling，不是脚本手动调用**。每次 Workflow 调用都会自动把脚本持久化，并返回 `scriptPath` 与 `runId`。恢复方式：

```javascript
// 中断后，在同一会话内重启
await Workflow({ scriptPath, resumeFromRunId });
```

重放规则是确定性的：脚本中**最长未改动前缀**的 `agent()` 调用直接返回缓存结果，从第一个被改动或新增的调用开始才真正重跑。所以：

- **同脚本 + 同 args → 100% 缓存命中**，恢复几乎零成本。
- 想从某一步开始重跑，就**改动那一步**——前面的全部命中缓存，后面的全部重算。

**为什么 `Date.now()` / `Math.random()` / 无参 `new Date()` 被禁**：它们每次返回不同值，会让缓存键失效、破坏重放的确定性，因此 runtime 直接让它们抛错。需要时间戳就通过 `args` 传入；需要随机性就按 `index` 派生。

**让阶段幂等**，这样从缓存重放才安全：

- 阶段的"启动"不应产生不可重复的副作用（例如发一封不可撤销的邮件、对外部系统做一次非幂等写）。把这类不可逆动作放到人工门之后。
- pipeline 模式下每个 item 独立流经所有 stage，天然适合做"逐 item 可重入"；某 stage 抛错时该 item 落为 `null` 并跳过其余 stage，不会污染其他 item。

**两条硬约束需要心里有数**：

1. **跨会话不保证**。关闭会话后 runtime 上下文就没了，恢复依赖会话连续性。长任务尽量在一个会话里跑完。
2. **缓存 TTL 是 5 分钟**。Anthropic 提示缓存 TTL 为 5 分钟；如果 resume 跨过了 5 分钟,上下文会以未缓存方式重读——更慢、更贵。中断后尽快恢复。

> 上游把恢复写成 `ctx.checkpoint(state)` 手动打点——**这是错的**。真实机制是自动 journaling + `resumeFromRunId`，脚本里不存在 checkpoint 原语。

## 可观测性：多粒度 + trace 事件

一次工作流运行应当在多个粒度上可观测，缺一个粒度就少一层定位问题的抓手：

| 粒度 | 关注什么 |
|---|---|
| 工作流 | 当前阶段名、阶段状态、累计耗时、token 总量、活动 agent 数 |
| 阶段（phase） | 起止时间、输入 item 数、输出 item 数 |
| Agent | 派生/完成时间、`label`、token 用量、返回的 schema |
| 断言（claim） | 来源 agent、验证者 agent、裁决结果、证据 |

在 Claude Code 里用 **`/workflows`** 查看运行中与历史工作流：进度视图含当前阶段、活动 agent 数、token 总量、耗时、阶段级状态。后台运行的工作流会返回一个 task id，完成时收到 `<task-notification>`。

用 `log()` 主动输出叙述性进度，并遵守**不静默截断**原则——一旦做了 top-N、采样或任何丢弃，必须 `log()` 出被丢掉的部分，否则可观测性就是假的：

```javascript
const ranked = findings.filter(Boolean).sort((a, b) => b.severity - a.severity);
const top = ranked.slice(0, 20);
if (ranked.length > top.length) {
  log(`按严重度取前 20，丢弃 ${ranked.length - top.length} 条低优先发现（未验证）`);
}
```

需要更深的可观测性时，把工作流的 trace 事件路由到你自己的日志或监控系统。可观测性在生产环境的落地细节（trace 事件结构、指标采集、与监控系统对接）见 [/implementation/observability](/implementation/observability)，相关术语见 [/reference/glossary](/reference/glossary)。

## 回滚：worktree 隔离 / PR 门 / 人工门 / dry-run

写文件的工作流会在规模上放大"意外改动"的风险。**回滚要在跑之前就设计好**，事后再补已经晚了：

| 技术 | 何时用 | 真实 API |
|---|---|---|
| worktree 隔离 | 并行写文件、避免互相覆盖、改完再审 diff | `agent(prompt, { isolation: 'worktree' })`——让该 agent 在独立 git worktree 中改文件 |
| PR 输出门 | 让 agent 把产出写到分支，由人工合并到 main | 工作流写分支，合并交给人工/CI 门 |
| 人工审批门 | 把工作流切成"发现 → 人工批准 → 执行"三段 | 在 `phase()` 之间插入人工确认，把不可逆动作放到批准之后 |
| dry-run 模式 | 只想看计划、不想落盘 | 收窄 allowlist 去掉写工具，工作流只产出计划供审查 |

`isolation: 'worktree'` 的代价不低（每个 worktree 都要建/切/清），所以只在**确实需要并行写同一仓库**时用；只读或单写场景不必付这个成本。隔离模式本身的细节见 [/patterns/workspace-isolation](/patterns/workspace-isolation)。

```javascript
phase("并行重构");
// 每个模块在独立 worktree 中改，互不写冲突；改完返回 patch 供审
const patches = await parallel(
  MODULES.map(m => () => agent(`重构模块 ${m}，只改本模块文件`, {
    label: `refactor:${m}`,
    isolation: "worktree",
    schema: PatchSchema
  }))
);
```

**任何写文件的工作流的最低底线**：在 worktree 或分支上跑，绝不在没有审查的情况下直接打到 main。

## 管理员控制：可禁用、可限定

平台管理员可以在受管（managed）Claude Code 环境中**整体禁用动态工作流**，或将其**限定**到特定用户或项目。这是部署级的控制，独立于单次运行的 allowlist。具体能力以最新的 Claude Code managed settings 文档为准——动态工作流仍在研究预览阶段，从预览走向正式可用的过程中这些控制会演进。

## 治理检查清单

- [ ] 运行前已读过脚本原文，确认阶段边界、扇出形状、停止条件、写入路径。
- [ ] 当前 allowlist 已审视并按工作流范围收窄；预期工具类别已预批。
- [ ] 设了 `budget` 硬上限，`while` 循环绑定了 `budget.remaining()` 或收敛计数。
- [ ] 低风险阶段用了 `model: 'haiku'` 等更小模型；先在小范围跑过再放量。
- [ ] 脚本不含 `Date.now()` / `Math.random()` / 无参 `new Date()`；阶段设计为幂等。
- [ ] 写文件的 agent 用了 `isolation: 'worktree'` 或落到分支，未直接打 main。
- [ ] 不可逆动作放在人工审批门之后。
- [ ] `/workflows` 进度视图可看；做了截断的地方都 `log()` 了被丢弃的部分。

## 参考资料

- [并行扇出 / 收敛](/patterns/parallel-fanout-gather)
- [顺序流水线](/patterns/sequential-pipeline)
- [可观测性落地](/implementation/observability)
- [工作区 / 沙箱隔离](/patterns/workspace-isolation)
- [人类在环（HITL）](/patterns/human-in-the-loop)
- [术语表](/reference/glossary)
