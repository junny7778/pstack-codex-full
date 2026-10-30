---
name: principle-guard-the-context-window
description: "处理大输出、长文件或并行调查时，把批量工作交给子 Agent，主线程只保留结论和必要证据。"
---

# Guard the Context Window

**Why:** Context overflow degrades reasoning quality, creates compression artifacts, and halts progress.

**Pattern:**
- **Size phases and cap scope.** Limit files per phase, set turn budgets, account for mechanism costs.
