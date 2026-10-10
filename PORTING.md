# 移植说明

## 兼容策略

51 个 Skill 分为三类：

- 原则和独立写作 Skill 尽量保留上游规则，只修改中文调用描述。
- 已存在于 `pstack-plugin 0.2.0` 的 26 个 Skill，使用其 Codex/ChatGPT 适配作为兼容基线，并合并上游资源。
- 新增的总控、多 Agent、长期运行和 PR 工作流按 Codex 的授权与协作模型重写。

## 平台映射

| 上游概念 | Codex 处理方式 |
|---|---|
| Cursor Task Agent | Codex 子 Agent 协作工具 |
| Cursor Custom Mode | Skill 触发和 `$poteto-mode` 路由 |
| 固定 Claude/Grok 模型 | 默认继承当前模型 |
| Cursor loop | 等待机制或 heartbeat automation |
| Cursor AskQuestion | 必要时向用户提出一个简短问题 |
| `.cursor/skills` | 插件 `skills/` 或项目 `.agents/skills/` |

## 安全边界

- Skill 不扩大用户原请求的范围和权限。
- 多 Agent 只在用户明确要求多 Agent、并行、委派或相应工作流时使用。
- PR 合并、部署、删除、外部消息、权限和凭证操作需要请求本身明确授权。
- 长期运行要求持续推进，但不代表可以执行未授权操作。

## 验证

`scripts/audit-port.mjs` 检查 Skill 数量、中文描述、引用完整性和残留平台依赖。每个 Skill 还需要通过 frontmatter 解析和代表性行为测试。
