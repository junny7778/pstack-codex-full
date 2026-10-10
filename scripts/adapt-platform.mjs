import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

async function markdownFiles(dir) {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await markdownFiles(path));
    else if (entry.isFile() && entry.name.endsWith(".md")) result.push(path);
  }
  return result;
}

const replacements = [
  [/~\/\.cursor\/rules\/pstack-models\.mdc/g, "~/.codex/pstack-models.md"],
  [/~\/\.cursor\/skills/g, "~/.codex/skills"],
  [/\.cursor\/skills/g, ".agents/skills"],
  [/\.cursor\/rules/g, ".codex/rules"],
  [/Cursor's `\/loop` command/g, "Codex 的 heartbeat automation"],
  [/Cursor's `\/loop`/g, "Codex heartbeat automation"],
  [/`\/loop` command/g, "Codex heartbeat automation"],
  [/`\/loop`/g, "heartbeat automation"],
  [/\/loop\b/g, "heartbeat automation"],
  [/AskQuestion/g, "简短询问用户"],
  [/\bTask tool\b/g, "Codex 子 Agent 协作工具"],
  [/`Task`/g, "`spawn_agent`"],
  [/subagent_type/g, "role"],
  [/claude-(?:opus|sonnet)-[a-z0-9.-]+/gi, "inherit-parent"],
  [/grok-[a-z0-9.-]+/gi, "inherit-parent"],
  [/Cursor transcripts?/gi, "Codex 对话记录"],
  [/Cursor Custom Modes?/gi, "Codex Skill 调用"],
  [/Cursor Agent/gi, "Codex Agent"],
  [/Cursor/gi, "Codex"]
];

let changed = 0;
for (const file of await markdownFiles(join(root, "skills"))) {
  const before = await readFile(file, "utf8");
  let after = before;
  for (const [pattern, replacement] of replacements) after = after.replace(pattern, replacement);
  if (after !== before) {
    await writeFile(file, after, "utf8");
    changed += 1;
  }
}

console.log(`已完成 ${changed} 个 Markdown 文件的平台词汇适配。`);
