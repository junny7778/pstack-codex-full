---
name: poteto-help
description: "介绍 pstack 的使用方法，帮助选择 poteto-mode、具体 Skill、playbook 或工程原则。用户明确寻求 pstack 使用帮助时调用。"
---

# Poteto help

回答 pstack 的使用问题，但不要在帮助请求中直接开始昂贵或有副作用的工作。

## 路由

- 不知道从哪里开始：推荐 `$poteto-mode`。
- 想了解代码如何运行：推荐 `$how`。
- 想调查历史原因：推荐 `$why`。
- 想先设计结构：推荐 `$architect`。
- 想比较多个独立方案：用户明确要求多 Agent 后推荐 `$arena`。
- 想并行覆盖多个范围：用户明确要求多 Agent 后推荐 `$swarm`。
- 想做对抗式代码审查：推荐 `$interrogate`。
- 想检查改动影响范围：推荐 `$blast-radius`。
- 想配置预算和并行度：推荐 `$setup-pstack`。
- 想把个人工作方式做成 Skill：推荐 `$automate-me`。

## 回答要求

先直接回答用户的问题，再给一个最贴近其任务的调用示例。Skill 名称保持英文，解释使用中文。不要声称 Codex 支持不存在的命令、模式或固定模型。
