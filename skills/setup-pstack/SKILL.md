---
name: setup-pstack
description: "配置 pstack 在 Codex 中的推理预算、并行度和角色偏好；默认继承当前模型，不依赖固定模型名称。用户明确要求配置 pstack 时使用。"
---

# Setup pstack

为 pstack 创建可选的 Codex 本地配置。没有配置时，所有工作流继承当前模型，并遵守 Codex 当前的并发限制。

## 配置内容

- `reasoning_budget`: `small`、`medium`、`large` 或 `unlimited`。
- `max_parallel_agents`: 不超过当前环境允许的并发数。
- `default_model`: 默认 `inherit-parent`。
- `review_agents`: 多 Agent 评审的默认数量。
- `arena_candidates`: Arena 的默认候选数量。

## 工作流

1. 读取已有配置；不存在时使用安全默认值。
2. 只列出当前 Codex 环境明确支持的模型。无法确认时保留 `inherit-parent`。
3. 向用户展示拟写入的完整配置和位置，询问一次是否确认。
4. 用户确认后写入 `~/.codex/pstack-config.json`。重复运行应覆盖为同一规范结构。
5. 重新读取文件并核对实际值。
6. 告知用户新配置将在后续 pstack 任务中使用。

不得写入模型凭证，也不得根据其他产品的模型名称猜测 Codex 模型。
