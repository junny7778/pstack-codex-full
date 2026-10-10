import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const skillsRoot = join(root, "skills");

const descriptions = {
  "architect": "在编码前设计类型、接口、模块边界和所有权。适用于“架构设计”“设计这个系统”“这个逻辑应该放在哪里”，以及直接编码可能锁定错误结构的复杂任务。",
  "arena": "让多个子 Agent 独立完成同一个任务，比较候选方案，选出最佳基础并吸收其他方案的优点。仅在用户明确要求 arena、多方案竞争或平行原型时使用。",
  "automate-me": "根据用户反复表达的偏好、纠正和工作方式，创建或更新个人工作模式 Skill。适用于“自动化我的工作方式”“把我的偏好做成 Skill”。",
  "benchmark-checklist": "在报告或采用性能数字前，检查瓶颈、参数、误差、重复性和端到端相关性。适用于基准测试、加速比例和性能回归结论。",
  "blast-radius": "追踪代码改动在 diff 之外可能破坏的调用者、契约、共享数据和下游系统，并用真实运行结果验证关键安全假设。",
  "bro": "把上一条消息改写成没有术语、普通人容易理解的表达，同时保持原意。",
  "correct": "找出 Agent 在当前仓库反复犯的错误，并优先通过架构、类型、lint 或测试让错误难以再次发生。用户明确要求 correct 或持续纠错时使用。",
  "create-verification-skill": "为当前项目创建可重复执行的验证 Skill 和功能地图，让 Codex 能通过真实 UI、CLI 或服务入口证明功能行为。",
  "figure-it-out": "当现有工作流都不适合时，为大型迁移、复杂多阶段任务或无人值守工作设计可审计的执行方案。",
  "how": "通过检查实际源码解释代码库、子系统或功能如何运行。适用于代码走读、运行流程、模块所有权和“这段逻辑应该放在哪里”。",
  "interrogate": "使用多个独立子 Agent 从不同角度对代码或方案进行对抗式审查，寻找正确性、架构、测试和维护性盲点。仅在用户明确要求多 Agent 审查或点名 interrogate 时使用。",
  "maintain-verification-skill": "审计并维护项目现有的验证 Skill 和功能地图，通过源码核对和真实运行修正已经漂移的验证步骤。",
  "make-bot-ui": "构建通过 webhook 唤醒机器人任务的页面或控制面板。仅在用户明确要求机器人 UI、webhook 控制或相关网络暴露方案时使用。",
  "no-comments": "审查代码注释，删除无价值或掩盖坏设计的注释，并把必要约束改用类型、lint、测试或结构表达。仅在用户明确要求注释审查或删除注释时修改代码。",
  "poteto-help": "介绍 pstack 的使用方法，帮助选择 poteto-mode、具体 Skill、playbook 或工程原则。用户明确寻求 pstack 使用帮助时调用。",
  "poteto-mode": "pstack 的 Codex 总控工作流。为复杂工程任务选择合适的 playbook、辅助 Skill、子 Agent 分工和验证方式；普通闲聊或用户明确退出时不使用。",
  "principle-attack-the-premise": "当基于同一前提的两个以上修复都失败时，先检查问题参与者和状态分布，再质疑原始前提。",
  "principle-boundary-discipline": "在 CLI、配置、网络和外部 API 等系统边界集中做解析、校验和错误处理，内部业务逻辑依赖可靠类型。",
  "principle-build-the-lever": "处理非简单编辑、迁移、分析或检查时，优先构建可重复运行的脚本、生成器、codemod 或验证工具。",
  "principle-encode-lessons-in-structure": "当同一条指令或纠正重复出现时，把它固化成类型、lint、元数据、运行检查或脚本。",
  "principle-exhaust-the-design-space": "面对没有先例的重要 UI 或架构决策时，先制作两到三个结构不同的原型并进行比较。",
  "principle-experience-first": "处理产品、体验或功能范围取舍时，优先保证用户体验，宁可减少范围也不交付粗糙功能。",
  "principle-explain-the-number": "在相信、报告或依据性能与评测数字做决定前，解释限制因素并排除错误测量。",
  "principle-fix-root-causes": "调试时先复现并追踪根因，在根因处修复，避免用空值保护或兜底逻辑隐藏故障。",
  "principle-foundational-thinking": "编写逻辑前先确定核心类型、数据结构、状态所有权和并发参与者，让后续实现建立在正确基础上。",
  "principle-guard-the-context-window": "处理大输出、长文件或并行调查时，把批量工作交给子 Agent，主线程只保留结论和必要证据。",
  "principle-laziness-protocol": "重构或扩展时偏向删除和最小改动，避免无必要的抽象、层级和信号传递。",
  "principle-make-operations-idempotent": "设计可能遭遇中断、重启和重试的命令或流程时，使重复执行收敛到同一正确状态。",
  "principle-migrate-callers-then-delete-legacy-apis": "引入新的内部 API 时，在同一轮迁移所有调用者并删除旧 API，避免保留长期兼容层。",
  "principle-minimize-reader-load": "代码难以追踪时，减少问题与答案之间的层级、隐藏状态和一次性包装函数。",
  "principle-model-the-domain": "有状态逻辑出现大量分支或重复形状判断时，用明确的领域结构表达状态、规则和变体。",
  "principle-never-block-on-the-human": "对任务范围内可逆且低风险的工作直接推进；只有不可逆、越权或必须由用户判断的事项才暂停询问。",
  "principle-outcome-oriented-execution": "执行分阶段重写或迁移时持续收敛到目标架构，不为短暂中间状态增加最终会删除的兼容代码。",
  "principle-prove-it-works": "完成任务后检查真实产物、运行真实路径并读取实际结果，不能只依赖编译通过或自我报告。",
  "principle-redesign-from-first-principles": "新需求改变基础假设时，按它从项目第一天就存在的方式重新设计，而不是继续附加特殊分支。",
  "principle-separate-before-serializing-shared-state": "并发参与者可能写入同一文件、分支或状态时，先消除共享，再考虑锁或串行化。",
  "principle-sequence-verifiable-units": "把迁移、批量修改和多阶段工作拆成连续可验证的小单元，每一步都结束在可运行状态。",
  "principle-subtract-before-you-add": "新增、重构或重写前先删除死代码、重复校验和占位引用，再在更简单的基础上实现。",
  "principle-test-behavior-not-implementation": "测试应通过公共入口调用代码并断言用户可观察结果，避免只检查内部调用或 mock。",
  "principle-type-system-discipline": "设计类型或编写静态类型代码时，让非法状态不可表达，在边界解析外部数据并穷举所有变体。",
  "recall": "从近期对话、当前状态和共享记录中恢复某个主题的工作上下文，输出精炼的当前状态和下一步。",
  "reflect": "在长任务完成后使用多个子 Agent 复盘执行过程，提取可证明的经验并提出具体 Skill 改进。仅在用户明确要求 reflect 或多 Agent 复盘时使用。",
  "setup-pstack": "配置 pstack 在 Codex 中的推理预算、并行度和角色偏好；默认继承当前模型，不依赖固定模型名称。用户明确要求配置 pstack 时使用。",
  "show-me-your-work": "为长时间或无人值守任务维护可审查的 TSV 决策日志，记录决定、原因、证据和结果。",
  "swarm": "把不同范围的工作并行分配给多个子 Agent，等待并汇总为一份报告。仅在用户明确要求并行覆盖、竞赛、群体调查或点名 swarm 时使用。",
  "tdd": "用户明确要求 TDD、失败测试或回归测试，或者缺陷存在便宜而明确的本地测试入口时，先写失败测试再修复。",
  "teach": "结合实际运行机制和历史原因，把代码、系统或改动讲到用户真正理解，适用于“教我”“带我理解”。",
  "technical-writing": "编写或审查技术文档、RFC、README、PR 描述和提交信息时，应用分层文档结构和清晰技术写作规则。",
  "typescript-best-practices": "读取或编辑 TypeScript 与 TSX 文件时应用类型建模、边界解析、穷举检查和真实测试等最佳实践。",
  "unslop": "清理写作中的 AI 套话、空话、机械排比和不必要修饰，同时保持原意与自然语气。所有写作任务均应应用。",
  "why": "调查代码、设计、阈值、限制或历史决策为何存在，综合源码历史和可访问的项目证据输出有出处的结论。"
};

const entries = await readdir(skillsRoot, { withFileTypes: true });
for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const skillName = entry.name;
  const description = descriptions[skillName];
  if (!description) throw new Error(`缺少中文描述: ${skillName}`);

  const file = join(skillsRoot, skillName, "SKILL.md");
  const source = await readFile(file, "utf8");
  const match = source.match(/^---\n[\s\S]*?\n---\n?/);
  if (!match) throw new Error(`无效 frontmatter: ${file}`);

  const paths = skillName === "typescript-best-practices"
    ? "\npaths: [\"**/*.ts\", \"**/*.tsx\"]"
    : "";
  const frontmatter = `---\nname: ${skillName}\ndescription: ${JSON.stringify(description)}${paths}\n---\n`;
  await writeFile(file, frontmatter + source.slice(match[0].length), "utf8");
}

console.log(`已更新 ${Object.keys(descriptions).length} 个 Skill 的中文描述。`);
