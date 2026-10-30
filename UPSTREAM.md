# 上游基线

- 仓库：https://github.com/cursor/plugins/tree/main/pstack
- Commit：`4dd1d05818d19792e7cd6e818f1667f95f7e1dbe`
- 上游插件版本：`0.15.36`
- Codex 插件版本：`0.1.1`
- License：MIT

同步新上游版本时，先比较上游 commit 与本文件记录的 commit，再重新运行：

```text
node scripts/port-to-codex.mjs
node scripts/adapt-platform.mjs
node scripts/audit-port.mjs
```

自动脚本只处理可确定的元数据和平台词汇。`poteto-mode`、多 Agent 工作流、长期运行、PR 合并和删除相关 playbook 必须人工复核。

## 本次同步范围

- 新增 7 个上游 Skill，包含 TLA+/TLC 状态图工具及其完整测试语料。
- 补入 `poteto-mode` 的 PR 监控与 worktree 审计工具文件。
- 保留 Codex 专属的技能调用描述和权限边界。
- 上游 Cursor Agent 定义、Cursor 专属自动化及 Cursor 指南不作为 Codex 插件运行时组件发布；需要时继续逐项移植。
