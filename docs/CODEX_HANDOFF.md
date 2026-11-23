# YiTatro 典籍知识库与全息数术推演系统 · Codex 接手交接手册

> **文档版本**：2026-11-23  
> **代码仓库**：`https://github.com/hhc883/yitarot.git`  
> **交接分支**：`codex/yitatro-design-handoff`（已与 `main` 完全同步）  
> **最新提交**：`011e26f`（测试与构建 100% 全绿）

---

## 一、Codex 快速接手一览（TL;DR）

如果你是在 **OpenAI Codex / Cursor / Claude Code / VSCode** 中打开本项目，请按以下步骤无缝接手：

1. **环境准备与依赖安装**：
   ```bash
   git checkout codex/yitatro-design-handoff
   npm ci
   ```
2. **运行跨学科知识库自动化验证套件**：
   ```bash
   node scripts/kb/run-test.mjs
   ```
   *预期结果*：六爻纳甲 245 条通则 + 62 个案例、梅花易数 15 条体用通则 + 10 个宗师案例、京氏易传 55 条宇宙原理、测字秘牒 35 条通则 + 35 个案例，Guard 引用审计全部通过。
3. **构建与生产服务启动**：
   ```bash
   npm run build
   npm run start
   ```

---

## 二、多门类典籍知识库全息架构

系统采用**「多学科分仓治理 + 知识硬约束检索（Retriever）+ 反幻觉 Guard 审计 + 本地专家引擎兜底」**的架构。

### 1. 已全量收录的 5 部易学经典

| 学科门类 | 书名与作者 | 模式分类 | 归档原件路径 | 代码库映射 | 核心内容 |
|---|---|---|---|---|---|
| **六爻纳甲** | 《增删卜易》· 清·野鹤老人 | **模式 A**（实战应用型） | `data/kb/liuyao/zengshan-extracted.md` | `src/lib/kb/golden-rules.ts`<br>`src/lib/kb/cases.ts` | 30 条核心黄金理法通则、42 个名家占验案例、六亲六神象意字典 |
| **六爻纳甲** | 《卜筮全书》· 明·姚际隆/刘伯温 | **模式 A**（实战应用型） | `data/kb/liuyao/bushiquanshu-extracted.md` | `src/lib/kb/bushiquanshu-rules.ts`<br>`src/lib/kb/bushiquanshu-cases.ts` | 35 条分类专论通则、20 个经典占验案例、三维爻位领域映射与特殊辨格 |
| **象数心易** | 《梅花易数》· 宋·邵雍 | **模式 A**（实战应用型） | `data/kb/meihua/meihuayishu-extracted.md` | `src/lib/kb/meihua/` | 15 条体用断法通则、10 个千古经典卦案（观梅占、牡丹占等）、八卦万物类象与心易拆字 |
| **宇宙原理** | 《京氏易传》· 西汉·京房 | **模式 C**（宇宙原理型） | `data/kb/principles/jingshi-extracted.md` | `src/lib/kb/principles/` | 55 条元典：20条五行亢害承制、20条干支冲合会刑成因、15条四时旺相长生墓绝物理模型 |
| **测字断相** | 《测字秘牒》· 清·程省 | **模式 A**（实战应用型） | `data/kb/cezi/cezimidi-extracted.md` | `src/lib/kb/cezi/` | 35 条核心相字通则、35 例程省实战占验、五行偏旁取格字典、头心身足骨骼散格系统 |

---

## 三、业务推演引擎如何联动书籍知识

### 1. 六爻推演（`/zh/east/liuyao`）
* **硬检索打通**：`src/lib/kb/retriever.ts` 依据盘面事实（月破、旬空、发动、化回头生/克、化进退等），在 `RULES_DB`（245条）中毫秒级匹配最贴近的典籍规则，分配 `[KB-xx]` 编号。
* **深层原理注入**：`src/lib/kb/concepts.ts` 自动探测盘中是否出现游魂/归魂卦、地支三刑（无恩/恃势/无礼/自刑）或六害，注入西汉京房天道物理成因。
* **双轨解卦保障**：
  * **AI 在线轨**：大模型接收 `<knowledge_base>`，受【引用铁律】约束，每句论断必须附带 `[KB-xx]`，封杀 17 种模糊套话，输出后经过 `auditLiuYaoReport` 严格审计。
  * **本地引擎轨**：`generateLocalLiuYaoReport` 在免 API Key 或离线状态下，直接根据命中的《增删卜易》《卜筮全书》通则与应期之律，输出标准五段式断卦报告。

### 2. 梅花易数（`/zh/east/meihua`）
* `src/lib/metaphysics/meihua.ts` 中的 `divineMeihua` 自动计算主卦、互卦、变卦的体用五行生克。
* 自动匹配邵雍 10 大千古卦案，若匹配命中，前端 `MeihuaDecisionWidget.tsx` 直接高亮展示宗师同卦实战卡片。

### 3. 测字心易
* `src/lib/kb/cezi/` 提供结构化析字拆解引擎与全息象数推演快照；
* `src/lib/metaphysics/east-ai.ts` 提供 `buildCeziPrompt` 与 `streamCeziReading` 适配器。

---

## 四、后续典籍录入通用标准提示词（Prompt Template）

如需继续向系统导入古籍（如《火珠林》《断易天机》《五行大义》《易隐》等），可直接在任何 AI 对话中输入以下指令让其自动提取：

````markdown
请对以下书籍文献进行深度阅读与结构化提炼。

### 第一步：全自动文献类型识别
从以下三种模式中判定其归属：
- [模式 A·实战应用型]：有明确断法通则 + 详尽实战案例（如《增删卜易》《梅花易数》《测字秘牒》）；
- [模式 B·歌诀口诀型]：全书通篇为韵文口诀（如《黄金策》《断易天机》）；
- [模式 C·宇宙原理型]：纯粹阐述五行机理、干支成因与物理律动（如《京氏易传》《五行大义》）。

### 第二步：结构化提取
1. 若为模式 A：
   - 【模块一：核心断法通则（Rules）】：包含适用门类、触发盘面条件、核心断语与易理、应期推法；
   - 【模块二：经典实战占验案例（Cases）】：包含时空与盘面数据、占问事项、核心推演分析、实际应验结果；
   - 【模块三：独门象意概念（Concepts）】。
2. 若为模式 C：
   - 【模块一：五行机理与亢害承制法则】；
   - 【模块二：干支冲合会刑根本成因】；
   - 【模块三：四时旺相与长生墓绝界定】。
````

---

## 五、换机接手与多端对齐

* 本项目所有改动均已严格符合全仓黑白设计、Next.js 16.4.3 规范与 TypeScript 严格模式；
* 如在 Codex 中对话，只需发送：
  > “我已将代码库切换至 `codex/yitatro-design-handoff` 分支，请阅读 `docs/CODEX_HANDOFF.md`，接手 YiTatro 典籍知识库项目并继续推进。”
