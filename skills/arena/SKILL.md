---
name: arena
description: "让多个子 Agent 独立完成同一个任务，比较候选方案，选出最佳基础并吸收其他方案的优点。仅在用户明确要求 arena、多方案竞争或平行原型时使用。"
---

# Arena

Open a todolist with one entry per phase (Frame, Fan out, Cross-judge, Pick, Graft, Verify) before launching anything.

## Phase A: Frame

Every candidate gets the same prompt, so the prompt is the contract.

1. State the artifact each candidate is producing.
2. Derive the rubric, 3-6 concrete gradeable criteria for what success looks like on *this* task. It is the picker's tool in Phase D. Candidates only see the task.
3. Use the `arena runners` preference in `~/.codex/pstack-models.md` only when the current collaboration interface accepts model selection; otherwise use the parent model. Keep at least two independent candidates when available, and state when tool limits prevent that. Pick reasoning effort only when supported.
4. Give each candidate its own output location (a git worktree where possible, otherwise `/tmp/arena-<slug>/candidate-<n>/`), per the **separate-before-serializing-shared-state** principle skill.

## Phase B: Fan out

Launch the candidates through the collaboration tools available in the current session. Do not pass background, role, or read-only options unless the tool exposes them. Give each candidate the task, shared grounding, a distinct output location, and instructions to produce the artifact plus a short rationale.

If a candidate produces no output, proceed with N-1 and note the dropout.

## Phase C: Cross-judge

After the candidates finish, use an independent judge only if the collaboration interface can provide one. Prefer a different model only when model selection is supported and a distinct model is confirmed. Otherwise compare the candidates yourself and state that no independent cross-judge ran. The judge sees the rubric and candidate labels, scores each criterion, and recommends a base. Do not start judging while candidates are still writing.

## Phase D: Pick a base

Read every candidate end to end before picking. Score each against the rubric criterion by criterion, not on holistic feel, and compare with the cross-judge when Phase C ran one. Agreement on the base confirms the pick. Disagreement means one of you is biased or the rubric was ambiguous. Read both rationales before deciding.

Pick the base a future maintainer can extend most easily without breaking invariants. When two feel tied, prefer the cleaner boundary or smaller API, per the Laziness Protocol.

## Phase E: Graft

Walk each losing candidate once more for what is worth porting into the base, usually one or two things per candidate, not most of it. Fold each graft in by hand, per the **redesign-from-first-principles** principle skill, so the result stays coherent under one mental model. Don't paste mechanically.

If the candidates converge on one shape, that is strong agreement. Note it and ship the consensus shape. No graft is needed. If they wildly diverge, Phase A was under-specified. Reframe and re-run rather than averaging the divergence.

## Phase F: Verify

Verify the synthesized artifact like any other output, per the **prove-it-works** principle skill. If verification finds a problem the arena missed, either Phase A was wrong (re-frame and re-run) or a candidate caught it and you missed the graft (go back to Phase E). Don't paper over it.

## Outputs

One synthesized artifact, with a short synthesis note alongside naming the base and why, the cross-judge's verdict or that Phase C skipped the judge, each graft with its source candidate, what was rejected and why, any convergence or dropouts, and the verification result.
