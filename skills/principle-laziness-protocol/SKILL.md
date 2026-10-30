---
name: principle-laziness-protocol
description: "重构或扩展时偏向删除和最小改动，避免无必要的抽象、层级和信号传递。"
---

# Laziness Protocol

- **Consolidate decisions.** Do not repeat the same choice in several places. Put it behind one source of truth and pass the result as a simple flag.
- **Minimize the diff.** Make the smallest change that solves the problem. Fewer lines beat "elegant" boilerplate.
