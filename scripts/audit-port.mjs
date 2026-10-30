import { access, readdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const skillsRoot = join(root, "skills");
const forbidden = [
  ["Cursor 配置目录", /\.cursor\//],
  ["Cursor 循环命令", /\/loop\b/],
  ["Cursor Task 工具", /\bTask tool\b|`Task`/],
  ["Cursor Agent 类型", /subagent_type/],
  ["Cursor 提问工具", /AskQuestion/],
  ["硬编码 Claude 模型", /claude-(?:opus|sonnet)/i],
  ["硬编码 Grok 模型", /grok-\d/i]
];

const entries = (await readdir(skillsRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .sort((a, b) => a.name.localeCompare(b.name));

const errors = [];
if (entries.length !== 58) errors.push(`Skill 数量应为 58，实际为 ${entries.length}`);

async function collectMarkdown(dir, { skipNodeModules = false } = {}) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (skipNodeModules && entry.isDirectory() && entry.name === "node_modules") continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await collectMarkdown(path, { skipNodeModules }));
    else if (entry.isFile() && entry.name.endsWith(".md")) files.push(path);
  }
  return files;
}

for (const entry of entries) {
  const skillDir = join(skillsRoot, entry.name);
  const skillFile = join(skillDir, "SKILL.md");
  let source;
  try {
    source = await readFile(skillFile, "utf8");
  } catch {
    errors.push(`${entry.name}: 缺少 SKILL.md`);
    continue;
  }

  const frontmatter = source.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatter) {
    errors.push(`${entry.name}: frontmatter 无效`);
  } else {
    if (!frontmatter[1].includes(`name: ${entry.name}`)) errors.push(`${entry.name}: name 与目录不一致`);
    const description = frontmatter[1].match(/description:\s*(.+)/)?.[1] ?? "";
    if (!/[\u3400-\u9fff]/.test(description)) errors.push(`${entry.name}: description 不是中文`);
  }

  for (const file of await collectMarkdown(skillDir, { skipNodeModules: true })) {
    const body = await readFile(file, "utf8");
    for (const [label, pattern] of forbidden) {
      if (pattern.test(body)) errors.push(`${file.slice(root.length + 1)}: 残留${label}`);
    }

    for (const match of body.matchAll(/\[[^\]]+\]\((?!https?:|#|mailto:)([^)]+\.md(?:#[^)]+)?)\)/g)) {
      const target = match[1].split("#")[0];
      const absolute = resolve(dirname(file), target);
      try {
        await access(absolute);
      } catch {
        errors.push(`${file.slice(root.length + 1)}: 引用不存在 ${match[1]}`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log("迁移检查通过：58 个 Skill、中文描述、引用和平台兼容性均符合要求。");
}
