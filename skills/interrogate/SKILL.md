---
name: interrogate
description: "使用多个独立子 Agent 从不同角度对代码或方案进行对抗式审查，寻找正确性、架构、测试和维护性盲点。仅在用户明确要求多 Agent 审查或点名 interrogate 时使用。"
---

# Interrogate

让多个独立评审者检查同一份改动，再由主 Agent 作最终判断。默认只审查，不自动修改代码。

## 工作流

1. 确定评审范围。优先使用用户指定的 diff、文件或 PR。
2. 从用户请求、提交信息和代码中写出一段明确的改动意图。
3. 读取 `references/rubric.md`、`references/code-quality-review.md` 和 `references/reviewer-prompt.md`。
4. 用户已明确授权多 Agent 审查时，同时启动至少两个只读评审 Agent。每个 Agent 收到同一意图、范围和评分标准。默认继承当前模型。
5. 收集发现并按具体机制去重。两个评审者独立发现同一问题时提高置信度，但一致意见仍需主 Agent核实源码。
6. 使用 `references/lead-judgment.md` 进行最终分类：必须处理、值得考虑、仅作记录、驳回。
7. 为每个必须处理的问题提供准确文件位置、影响和证据。

## 输出

说明改动意图、评审者范围、必须处理的问题、值得考虑的问题、被驳回的误报和评审分歧。没有可执行问题时明确给出通过结论。
