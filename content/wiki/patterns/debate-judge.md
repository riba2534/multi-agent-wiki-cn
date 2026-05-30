---
title: 辩论 / 裁判 / 投票
description: 多个Agent进行辩论；由裁判或投票机制得出结论。
---

# 辩论 / 裁判 / 投票

## 定义

多个Agent提出不同立场或答案并相互质疑；由裁判或投票机制选出最终结果。

**分类**：决策

## 结构

```mermaid
flowchart TD
  Q[问题] --> P[正方Agent]
  Q --> C[反方Agent]
  P --> D[辩论线程]
  C --> D
  D --> J[裁判]
  J --> R[决策 + 理由]
```

## 适用场景

选项选择、红队/蓝队对抗、事实核查、复杂推理、在多个候选答案中进行选择。

## 不适用场景

答案可通过工具验证时、成本敏感时、或裁判本身不可靠时。

## 实现方法

1. 让Agent独立生成初始立场，减少交叉污染。
2. 限制辩论轮数，避免无休止的争论。
3. 裁判必须引用证据和评分标准——而非仅凭偏好。
4. 对于可验证的任务，优先使用工具验证而非LLM裁判。

## 最简伪代码

```ts
const proposals = await Promise.all(agents.map(a => a.propose(question)));
const debate = await runDebate(proposals, { rounds: 2 });
const verdict = await judge.evaluate({ question, proposals, debate, rubric });
return verdict;
```

## 推荐的追踪事件

- `debate.proposal.created`
- `debate.round.completed`
- `judge.verdict.created`
- `vote.tallied`

## 常见失败模式

- 有说服力但事实上错误的论点胜出。
- 裁判偏向更善辩的Agent。
- 成本超过决策本身的价值。

## 实现检查清单

- [ ] 输入/输出schema已定义。
- [ ] 每个Agent的权限边界已定义。
- [ ] 每次Agent调用都携带 run id / trace id。
- [ ] 失败、超时、取消和重试策略已定义。
- [ ] 传递的上下文为最小必要信息，而非完整历史记录。
- [ ] 高风险操作由审批或验证者把关。

## 参考文献

- [Survey: LLM-based multi-agent](https://arxiv.org/html/2412.17481v2)