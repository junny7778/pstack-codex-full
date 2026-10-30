# pstack Codex 完整版

这是 GitHub 原版 pstack 的 Codex 移植版本，包含 58 个 Skill，基于上游 `0.15.36`。

当前版本保留原版 Skill 名称和主要工作方法，并完成以下适配：

- 58 个 Skill 的调用描述改为中文。
- 将 Cursor Agent 工作流适配为 Codex 当前会话可用的协作规则。
- 删除固定 Claude、Grok 模型依赖，默认继承当前模型。
- 将 Cursor 循环机制改为 Codex 等待或 heartbeat automation。
- 明确外部写入、合并、部署、删除和权限操作的授权边界。
- 多 Agent 工作流要求用户明确提出多 Agent、并行或委派。

插件入口是 `$poteto-mode`。Skill 可按描述自动匹配，也可通过名称显式调用。不知道使用哪个 Skill 时可调用 `$poteto-help`。

当前插件由个人云端插件发布。仓库版本与插件 release 分开管理；推送 GitHub 不会自动更新已安装插件。
