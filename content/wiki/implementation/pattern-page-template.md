---
title: 模式页面模板
description: 添加新的多 Agent 模式页面时使用此模板。
---

# 模式名称

## 定义

一两句话。说明该模式是什么，以及它与相邻模式的区别。

## 结构

```mermaid
flowchart TD
  A["输入"] --> B["Agent"]
  B --> C["输出"]
```

## 何时使用

- 场景 1
- 场景 2
- 场景 3

## 何时不使用

- 反场景 1
- 反场景 2

## 实现方法

1. 定义输入/输出 schema。
2. 定义 Agent 角色与工具边界。
3. 定义状态、超时、重试、取消。
4. 定义 trace 事件。
5. 定义失败时的降级策略。

## 最小化伪代码

```ts
async function runPattern(input: Input): Promise<Output> {
  // TODO
}
```

## 推荐的追踪事件

- `pattern.started`
- `pattern.completed`
- `pattern.failed`

## 常见失败模式

- 失败模式 1
- 失败模式 2

## 实现检查清单

- [ ] 输入/输出 schema 已定义
- [ ] 权限边界已定义
- [ ] Trace 事件已定义
- [ ] 失败策略已定义
- [ ] 成本与超时已定义

## 参考资料

- 链接 1