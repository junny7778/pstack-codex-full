---
name: principle-migrate-callers-then-delete-legacy-apis
description: "引入新的内部 API 时，在同一轮迁移所有调用者并删除旧 API，避免保留长期兼容层。"
---

# Migrate Callers Then Delete Legacy APIs

- Update tests to assert the new contract, and delete tests that only protect pre-refactor implementation details

**When this applies:**
- No external users depend on backward compatibility
- The project can absorb coordinated breaking changes
- The new API is part of a simplification or refactor initiative
