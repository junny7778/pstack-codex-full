# 上游基线

- 仓库：https://github.com/cursor/plugins/tree/main/pstack
- Commit：`d73344bee8cf22e53b9d5f4cf5749d38ba38c174`
- 上游插件版本：`0.15.15`
- 本地移植版本：`0.1.0`
- License：MIT

同步新上游版本时，先比较上游 commit 与本文件记录的 commit，再重新运行：

```text
node scripts/port-to-codex.mjs
node scripts/adapt-platform.mjs
node scripts/audit-port.mjs
```

自动脚本只处理可确定的元数据和平台词汇。`poteto-mode`、多 Agent 工作流、长期运行、PR 合并和删除相关 playbook 必须人工复核。
