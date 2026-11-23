# 六爻解卦知识库与上下文管理 · 实施规格

> 交接对象：实现者（人或 AI）。本文是唯一规格来源，按第 13 节顺序执行。
> 语料已就位，不需要重新解析 PDF，也不需要 OCR。

---

## 0. 目标

解卦与追问时，模型只能基于**盘面事实 + 典籍条目**下断：

1. 每条断语后挂 `[KB-xx]` 编号，编号必须来自本次注入清单，不得自造。
2. 断语必须落到具体对象、具体条件、具体时间窗，禁止"宜守不宜攻"这类通用话术。
3. 多轮上下文由服务端管理：限预算、带首解锚点、不再无条件信任客户端历史。
4. 顺手修掉 Gemini 通道丢历史的 bug。

**验收口径**：随机 20 卦，输出中每条判断都能点回一条典籍条目；无自造爻辞；追问第 3 轮仍记得首解结论。

---

## 1. 现状（必读，避免重复造）

| 文件 | 现状 |
|---|---|
| `src/lib/metaphysics/hexagrams64.ts` | 64 卦静态表，含卦名/卦符/卦辞/大象/上下卦；导出 `STANDARD_HEXAGRAM_NAMES`、`KING_WEN_64`、`buildHexagramSeed`、`lookupEntryByBinary` |
| `src/lib/metaphysics/najia.ts` | `FullNajiaChart` 纳甲排盘：`timeInfo{monthZhi,dayZhi,xunKong,...}`、`lines[]`（含 `relative/branch/element/sixBeast/isShi/isYing/isChanging/transformed`）、`palace`、`palaceElement`、`generationName`、`shiIndex`、`yingIndex`。**没有伏神字段** |
| `src/lib/metaphysics/iching.ts` | `IChingReading`、`normalizeIChingReading()`（按爻线重建，丢弃客户端卦名）、`HEXAGRAMS_DB`（`Record<number, HexagramData>`，canon 直取用它；**不在 hexagrams64.ts**） |
| `src/lib/metaphysics/east-ai.ts` | `buildLiuYaoPrompt()` 拼卦象 + 旧五节标题；`streamLiuYaoReading()` 先试 `streamLLM`，失败降级 `generateLocalLiuYaoReport()` |
| `src/lib/metaphysics/skills/*` | `default-skill/index.ts` 里有 `systemInstruction`（五条心法）与 `assembleContext`。**`assembleContext` 是死代码，从未被调用** |
| `src/lib/llm/adapter.ts` | DeepSeek 优先、Gemini 逃生；Gemini 分支只取最后一条 user 消息（**丢历史，bug**） |
| `src/app/api/east/liuyao/route.ts` | 首解路由：扣分校验 → `normalizeIChingReading` → 流式 → 存 `liuyao_sessions`（`reading_snapshot.ai_report` 存全文）→ 回传 `session_id` |
| `src/app/api/east/liuyao/follow-up/route.ts` | 追问路由：直接把客户端 `previous_messages` 拼进 messages，无裁剪、无校验 |
| `supabase/migrations/20261121000001_liuyao_chat_history.sql` | `liuyao_sessions(id,user_id,question,reading_snapshot,is_vip,expires_at,created_at)`；`liuyao_messages(id,session_id,user_id,role,content,points_spent,created_at)` |
| `data/kb/zengshan-chapters.json` | 《增删卜易》**131 章 / 151,890 字**，已结构化：`chapters[{juan,title,chars,text}]`，`stats{doctrine:40,topic:91}` |
| `scripts/kb/parse-zengshan.mjs` | 语料解析脚本，可重跑；原件 `data/kb/raw/zengshan-buyi.txt`（UTF-16） |

**断法总纲分布**（`chapters[0..38]`）：六亲歌、世应、动变、用神、元神忌神衰旺、五行生克、克处逢生、动静生克、动变生克冲合、四时旺相、月将、日辰、六神、六合、六冲、三刑、暗动、动散、卦变生克墓绝、反伏、旬空、生旺墓绝、各门类题头/应期总注、归魂游魂、月破、飞伏神、进神退神、随鬼入墓、独发、两现、星煞。

---

## 2. 硬约束

1. **不新增运行时依赖**。禁止 LangChain、向量库、PDF 库。现有 11 个依赖保持不变。
2. **不改路由路径、不改积分逻辑**（`verifyReadingSpend`、`points_ref`、`pointsGate.consume` 全部保持原样）。
3. **不得凭记忆写爻辞**。`LINE_TEXTS` 初始为空对象，等用户提供干净经传文本后再导入。守卫逻辑据此拒绝任何自造爻辞。
4. **所有断法条目 `status: 'draft'`**，直到用户人工审核。输出中对 draft 条目追加 `〔未审〕`。
5. **不重构无关代码**。`buildLiuYaoPrompt`、`assembleContext`、`generateLocalLiuYaoReport` 保留导出，不清删。
6. **en 分支只注入 canon + 输出契约**，不注入中文断法条目，避免中英混杂。
7. 守卫结果**先只打日志 + 落库**，不改写输出、不新增 SSE 事件。定点重写留到二期。

---

## 3. 新增文件

```
src/lib/kb/types.ts            条目、命中、盘面事实、上下文类型
src/lib/kb/wuxing.ts           五行/地支/长生墓绝/进退神/旺衰 静态表与判定
src/lib/kb/pan.ts              从 FullNajiaChart 推导 ChartFacts（条件枚举）
src/lib/kb/canon.ts            卦辞/大象直取；LINE_TEXTS 占位
src/lib/kb/rules.ts            断法条目库（180 条）
src/lib/kb/retriever.ts        三路检索 + 打分 + 编号
src/lib/kb/context-builder.ts  KB 块拼装 + 预算控制 + system 组装
src/lib/kb/guard.ts            引用校验 + 空话检测 + 自造爻辞检测
src/lib/llm/conversation.ts    历史裁剪与摘要
```

---

## 4. 数据结构（`types.ts`）

```ts
import type { ElementName, SixBeastName, SixRelativeName, PalaceName } from '@/lib/metaphysics/najia';

export type KBKind = 'canon' | 'rule' | 'case';
export type KBStatus = 'draft' | 'verified';

export type ConditionKey =
  | 'month-break' | 'day-break' | 'xun-kong' | 'dark-move' | 'moving' | 'all-quiet'
  | 'transform-advance' | 'transform-retreat' | 'hui-tou-sheng' | 'hui-tou-ke'
  | 'hua-mu' | 'hua-jue' | 'hua-kong' | 'ru-mu'
  | 'liu-chong-gua' | 'liu-he-gua' | 'fan-yin' | 'fu-yin'
  | 'shi-ying-chong' | 'shi-ying-he'
  | 'yong-shen-bu-xian' | 'yong-shen-liang-xian';

export type TopicKey =
  | '事业' | '财运' | '婚恋' | '疾病' | '诉讼' | '出行' | '家宅'
  | '考试' | '寻人' | '失物' | 'other';

/** 条件键 → 中文标签，写进 prompt 时用 */
export const CONDITION_LABEL: Record<ConditionKey, string> = { /* 见 §6.3 */ };

export interface KBEntry {
  /** 稳定标识，形如 'zsy.month_break.01'，不参与 prompt 编号 */
  id: string;
  kind: KBKind;
  status: KBStatus;
  source: { book: string; chapter: string; note?: string };
  /** 触发条件，用于硬匹配（不是语义相似度） */
  when: {
    hexagram?: number[];          // 本卦/变卦卦序
    lineIndex?: number[];          // 爻位 1-6
    relative?: SixRelativeName[];  // 用神
    conditions?: ConditionKey[];
    topic?: TopicKey[];
    /** 自由补充条件，仅作展示，不参与匹配 */
    note?: string;
  };
  /** 断语原文（可摘录，不得改写语义） */
  text: string;
  verdict?: '成' | '不成' | '成中有阻' | '先难后易' | '先合后离' | '先离后合' | '凶' | '吉';
  /** 应期推法原文 */
  timing?: string;
  /** 5=典籍 4=名家 3=同门 2=普通案例 */
  credibility: 1 | 2 | 3 | 4 | 5;
}

/** 检索结果，ref 形如 'KB-03'，由 retriever 按固定顺序分配 */
export interface KnowledgeHit {
  ref: string;
  entry: KBEntry;
  score: number;
  reason: string;   // '本卦卦辞' / '用神妻财 + 月破' / '同卦同用神案例'
}

export interface KnowledgeBundle {
  hits: KnowledgeHit[];
  /** 'KB-03' → entry，供 guard 校验 */
  byRef: Map<string, KBEntry>;
  yongShen: { primary: SixRelativeName[]; secondary: SixRelativeName[]; reason: string };
  topic: TopicKey;
  facts: ChartFacts;
}
```

`ChartFacts` 与 `LineFact` 定义在 `pan.ts`（§5.3）。

---

## 5. 静态表与盘面推导

### 5.1 `wuxing.ts`

必须包含下列表，全部照《增删卜易》原文，不得凭印象补：

| 表 | 内容 | 出处章节 |
|---|---|---|
| `SHENG` / `KE` | 金生水→水生木→木生火→火生土→土生金；金克木→木克土→土克水→水克火→火克金 | 五行相生章第十一 / 五行相克章第十二 |
| `BRANCH_ELEMENT` | 子水、丑土、寅木、卯木、辰土、巳火、午火、未土、申金、酉金、戌土、亥水 | 日辰章第十七 |
| `BRANCH_CHONG` | 子午、丑未、寅申、卯酉、辰戌、巳亥 | 六冲章第二十 |
| `BRANCH_HE` | 子丑、寅亥、卯戌、辰酉、巳申、午未 | 六合章第十九 |
| `BRANCH_XING` | 寅巳、巳申、子卯、卯午、丑戌、未辰；辰午酉亥自刑 | 三刑章第二十一 |
| `LIFE_STAGE` | 金长生巳旺酉墓丑绝寅；木长生亥旺卯墓未绝申；**水土长生申旺子墓辰绝巳** | 生旺墓绝章第二十六 |
| `JIN_SHEN` | 亥→子、寅→卯、巳→午、申→酉、丑→辰、辰→未、未→戌 | 进神退神章第二十九 |
| `TUI_SHEN` | 子→亥、卯→寅、午→巳、酉→申、辰→丑、未→辰、戌→未 | 同上 |
| `SEASON` | 按月建定五行 旺/相/休/囚/死（见下） | 四时旺相章第十五 |

`SEASON` 规则（照原文归纳，实现成月支 → 状态表）：
- 寅卯月：木旺、火相、其余休囚
- 巳午月：火旺、土相、其余休囚
- 申酉月：金旺、水相、其余休囚
- 亥子月：水旺、木相、其余休囚
- 辰戌丑未月：土旺、金相；未月火有余气、丑月水有余气

导出：

```ts
export function elementOf(branch: string): ElementName;
export function sheng(a: ElementName, b: ElementName): boolean;
export function ke(a: ElementName, b: ElementName): boolean;
export function isChong(a: string, b: string): boolean;
export function isHe(a: string, b: string): boolean;
export function monthState(monthZhi: string, element: ElementName): SeasonState; // '临'|'旺'|'相'|'休'|'囚'|'死'
export function isTomb(element: ElementName, branch: string): boolean;
export function isJue(element: ElementName, branch: string): boolean;
export function isAdvance(from: string, to: string): boolean;
export function isRetreat(from: string, to: string): boolean;
```

### 5.2 用神取法（`resolveYongShen`）

```ts
export function resolveYongShen(question: string, opts?: { gender?: 'male'|'female' }):
  { primary: SixRelativeName[]; secondary: SixRelativeName[]; topic: TopicKey; reason: string };
```

关键词 → 用神（先分词命中主题，再用主题取用神；命中多个主题时按 `primary[0]` 优先）：

| 主题 | 触发关键词（示例，可扩充） | 用神 |
|---|---|---|
| 财运 | 财、钱、生意、买卖、投资、收入、工资、回款、合同款、欠 | 妻财（次：子孙） |
| 事业 | 工作、求职、升职、官、职位、面试、跳槽、领导、体制、官司输赢 | 官鬼（次：父母） |
| 考试 | 考试、考研、考公、证书、录取、面试笔试、学业 | 父母（次：官鬼） |
| 婚恋 | 婚、感情、对象、男友、女友、复合、分手、相亲、追 | 男占：妻财 / 女占：官鬼；性别未知则两者都进 primary，reason 标注"性别未定，财官并看" |
| 疾病 | 病、手术、康复、医生、药、体检 | 官鬼为病、子孙为药：primary `['官鬼','子孙']` |
| 诉讼 | 官司、诉讼、牢、判、纠纷、仲裁、报警 | 官鬼（次：父母） |
| 出行 | 出行、出差、移民、上路、航班、签证 | 父母（次：世爻，世不属六亲则只在 reason 标注） |
| 家宅 | 房子、搬家、装修、租房、买房、祖坟 | 父母（次：妻财） |
| 寻人 | 找人、失联、走失、什么时候回 | 所寻之人六亲（父母/子孙/兄弟/妻财，按"谁"判断）；判断不出则 `['兄弟']` 并在 reason 说明 |
| 失物 | 丢、找不到、遗失 | 妻财（次：官鬼） |
| other | 无命中 | `['官鬼']`，reason 写"未识别主题，暂以官鬼为用神，需在输出中声明" |

要求：`reason` 必须是人话，会展示给模型（如 `"求财，用神取妻财；子孙为财之源，列为次用神"`）。

### 5.3 `pan.ts`

```ts
export interface LineFact {
  lineIndex: number;
  lineNameZh: string;
  relative: SixRelativeName;
  branch: string;
  element: ElementName;
  sixBeast: SixBeastName;
  isYang: boolean;
  isShi: boolean;
  isYing: boolean;
  isMoving: boolean;
  monthState: SeasonState;
  dayRelation: '生' | '克' | '比' | '冲' | '合' | '无';
  isMonthBreak: boolean;   // 月支冲本爻
  isDayBreak: boolean;     // 日支冲 + 月令休囚死
  isDarkMove: boolean;     // 静爻 + 月令旺相 + 日支冲
  isXunKong: boolean;      // branch ∈ xunKong
  isTombInDay: boolean;    // element 墓于日支
  transform?: {
    branch: string;
    element: ElementName;
    relative: SixRelativeName;
    kind: '回头生' | '回头克' | '化进神' | '化退神' | '化墓' | '化绝' | '化空' | '化冲' | '比和';
  };
}

export interface ChartFacts {
  monthZhi: string;
  dayZhi: string;
  xunKongList: string[];
  palace: PalaceName;
  palaceElement: ElementName;
  generationName: string;
  isSixChong: boolean;   // 六爻初四/二五/三上三对全冲
  isSixHe: boolean;      // 三对全合
  isFanYin: boolean;     // 内外卦反吟：变卦与本卦对应爻相冲，见下
  isFuYin: boolean;      // 变卦与本卦对应爻地支全同
  lines: LineFact[];
  byRelative: Record<SixRelativeName, LineFact[]>;  // 多现即多条
  conditions: Set<ConditionKey>;
}

export function deriveChartFacts(reading: IChingReading): ChartFacts;
```

实现要点：

- **六冲卦/六合卦**：不要硬编码卦名表，按纳甲地支机械判定——`(line1,line4)`、`(line2,line5)`、`(line3,line6)` 三对分别全冲 → 六冲；全合 → 六合。用八纯卦 + 天地否做回归校验。
- **反吟**：变卦每爻地支与本卦对应爻相冲即为反吟（爻反吟）；内外卦整体反吟同理。伏吟：对应爻地支全同。两者都只在有动爻时判定。
- **`xunKong`** 是字符串（如 `"辰巳"`），`split('')` 后使用。
- **伏神不入**：`FullNajiaChart` 无伏神字段。用神不上卦时只置 `'yong-shen-bu-xian'` 条件，输出中要求模型声明"用神不上卦，依飞伏章当寻伏神，本局未排伏神"，不得自行编造伏神。
- **`all-quiet`**：`changingLineIndices.length === 0`。

---

## 6. `rules.ts`：断法条目库

### 6.1 规模与分组（合计约 180 条）

| 分组 | 前缀 | 条数 | 主要来源章节 |
|---|---|---|---|
| 用神取法 | `zsy.yong.*` | 14 | 用神章第八 |
| 元神忌神 | `zsy.yuanshen.*` | 18 | 用神元神忌神仇神章第九、元神忌神衰旺章第十 |
| 五行生克 | `zsy.shengke.*` | 12 | 五行相生/相克、克处逢生、动静生克 |
| 月建日辰 | `zsy.wangshuai.*` | 22 | 四时旺相、月将、日辰 |
| 月破 | `zsy.month_break.*` | 6 | 月破章第二十七 |
| 旬空 | `zsy.xunkong.*` | 8 | 旬空章第二十六 |
| 生旺墓绝 | `zsy.mu.*` | 12 | 生旺墓绝章、随鬼入墓章第三十 |
| 动变进退 | `zsy.dongbian.*` | 20 | 动变章第七、动变生克冲合章第十五、进神退神章第二十九 |
| 六冲六合 | `zsy.chonghe.*` | 14 | 六合章第十九、六冲章第二十 |
| 反伏伏吟 | `zsy.fanyin.*` | 8 | 反伏章第二十五 |
| 飞伏 | `zsy.feifu.*` | 8 | 飞伏神章第二十八 |
| 应期 | `zsy.yingqi.*` | 22 | 各门类应期总注章 |
| 杂占 | `zsy.misc.*` | 16 | 两现章、独发章、归魂游魂章、六神章、三刑章、星煞章 |

### 6.2 条目样例（照此颗粒度）

```ts
{
  id: 'zsy.month_break.01',
  kind: 'rule',
  status: 'draft',
  source: { book: '增删卜易', chapter: '月破章第二十七' },
  when: {
    conditions: ['month-break'],
    note: '静而不动，又无日辰动爻生助者',
  },
  text: '用神临月破，静而不动，又无日辰动爻生助者，到底而破；虽有日辰之生，亦不能生。',
  verdict: '不成',
  timing: '目下虽破，出月则不破；实破之日、合之日亦不破。近应日，远应年月。',
  credibility: 5,
},
{
  id: 'zsy.month_break.02',
  when: { conditions: ['month-break', 'moving'] },
  text: '月破之爻动则能伤于爻，作变爻则能伤于动爻。神兆机于动，既动则有祸福之基。',
  verdict: '凶',
  timing: '出月不破；实破之日、合日不破。',
  credibility: 5,
  status: 'draft',
  kind: 'rule',
  source: { book: '增删卜易', chapter: '月破章第二十七' },
},
{
  id: 'zsy.xunkong.01',
  when: { conditions: ['xun-kong'] },
  text: '旺不为空，动不为空，有日建动爻生扶者不为空；动而化空、伏而旺相皆不为空。真空者，春土、夏金、秋木、三冬逢火。',
  timing: '应于填实之日、冲空之日。',
  credibility: 5,
  status: 'draft',
  kind: 'rule',
  source: { book: '增删卜易', chapter: '旬空章第二十六' },
},
```

写法要求：

- `text` 尽量贴原文，可压缩虚词，**不得改写吉凶方向**。
- 每条必须能回答"在什么盘面条件下、断什么、应期怎么推"，缺一项就不要收。
- 条件枚举不够用时，扩展 `ConditionKey`，**不要**在 `when` 里塞自由文本当条件。
- 星煞（贵人/禄神/驿马/天喜）只收"附和用神旺衰、不能独操祸福"这一条总结论，不要拆成吉凶断语（原书明确说过独验者少）。

### 6.3 `CONDITION_LABEL` 映射

```ts
'month-break': '用神临月破', 'day-break': '日破', 'xun-kong': '旬空',
'dark-move': '暗动', 'moving': '发动', 'all-quiet': '六爻安静',
'transform-advance': '化进神', 'transform-retreat': '化退神',
'hui-tou-sheng': '化回头生', 'hui-tou-ke': '化回头克',
'hua-mu': '化墓', 'hua-jue': '化绝', 'hua-kong': '化空', 'ru-mu': '入墓',
'liu-chong-gua': '六冲卦', 'liu-he-gua': '六合卦',
'fan-yin': '反吟', 'fu-yin': '伏吟',
'shi-ying-chong': '世应相冲', 'shi-ying-he': '世应相合',
'yong-shen-bu-xian': '用神不上卦', 'yong-shen-liang-xian': '用神两现',
```

---

## 7. `retriever.ts`：三路检索

```ts
export function retrieveKnowledge(input: {
  question: string;
  reading: IChingReading;
  lang?: 'zh' | 'en';
  maxRules?: number;   // 默认 8
  maxCases?: number;   // 默认 3
}): KnowledgeBundle;
```

### 7.1 顺序（编号即按此顺序分配，保证确定性）

1. **canon 直取（必进，永不淘汰）**
   - `本卦卦辞`、`本卦大象`
   - 有变卦时：`变卦卦辞`
   - 每个动爻：若 `LINE_TEXTS[卦序][爻位]` 有值则加入，否则**跳过**（不要占位、不要编）
   - scene：`ref` 依次 `KB-01…`

2. **rules 条件匹配（打分取前 `maxRules`）**

   | 匹配项 | 分值 |
   |---|---|
   | `relative` 命中 `primary` | +5 |
   | `relative` 命中 `secondary` | +2 |
   | `topic` 命中 | +3 |
   | 每个 `conditions` 命中 | +3 |
   | 命中 ≥2 个条件 | 额外 +2 |
   | `hexagram` 含本卦 | +4 |
   | `hexagram` 含变卦 | +2 |
   | `lineIndex` 与动爻位有交集 | +2 |
   | `status === 'verified'` | +1 |
   | `credibility` | `+0.5 × credibility` |

   **过滤规则**：`relative`/`conditions`/`topic`/`hexagram` 至少命中一类才入候选；`status` 不影响入选。
   **平手排序**：`score desc → credibility desc → id asc`（必须稳定，便于回归）。

3. **cases 相似召回**：本期 `CASES = []`，函数返回空数组，保留调用位。打分规则先写注释，不实现。

### 7.2 编号与理由

```ts
hit.ref = `KB-${String(index + 1).padStart(2, '0')}`;
hit.reason = '本卦卦辞' | '用神妻财 + 月破' | ...
```

`reason` 用于两处：prompt 里每条的来源提示、guard 日志。

---

## 8. `context-builder.ts`：注入与预算

```ts
export function buildKnowledgeBlock(bundle: KnowledgeBundle, opts?: {
  maxChars?: number;    // 默认 6000
  perEntryChars?: number; // 默认 400
}): { block: string; usedRefs: string[]; droppedRefs: string[] };

export function buildHexSnapshot(reading: IChingReading, lang?: 'zh' | 'en'): string;

export function buildLiuYaoSystem(args: {
  lang?: 'zh' | 'en';
  skillInstruction: string;
  block: string;
  yongShenNote: string;
  /** 追加块（追问锚点、followUpRule、语言要求），拼在末尾，顺序即数组顺序 */
  extraBlocks?: string[];
}): string;

/** 铁律与契约单独导出，供需要单独拼装的场景复用；首解与追问统一走 buildLiuYaoSystem */
export const REFERENCE_RULES_ZH: string;
export const OUTPUT_CONTRACT_ZH: string;
export const REFERENCE_RULES_EN: string;
export const OUTPUT_CONTRACT_EN: string;

/** skillInstruction 超长时截断（默认 600 字符），见 §16.2 */
export const SKILL_INSTRUCTION_MAX = 600;
```

### 8.1 KB 块格式（必须严格，模型靠编号引用）

```
<knowledge_base>
[KB-01]〔本卦卦辞·乾〕元亨利贞。
[KB-02]〔本卦大象·乾〕天行健，君子以自强不息。
[KB-03]〔增删卜易·月破章第二十七｜用神妻财+月破〕用神临月破，静而不动……〔未审〕
应期：目下虽破，出月则不破……
</knowledge_base>
用神判定：求财，用神取妻财；子孙为财之源，列为次用神。
```

- draft 条目在正文末加 `〔未审〕`（约束 4）。
- 条目正文截断到 `perEntryChars`，截断处加 `…`，**不得截断引用编号**。
- 预算：canon 永不丢弃；超预算时从 rules 尾部（低分）开始丢，记录 `droppedRefs`，并打 `console.warn`。

### 8.2 预算默认值与上限

| 项 | 值 |
|---|---|
| KB 块 | 6000 字符 |
| 单条正文 | 400 字符 |
| 整体请求（system+messages） | 24000 字符（由 adapter 的 `maxContextChars` 兜底） |

---

## 9. 输出契约与引用铁律（原文，直接进 prompt）

`buildLiuYaoSystem` 的 `system` 拼接顺序**固定**（利于缓存命中）：`人设心法 → 引用铁律 → 输出契约 → 卦象快照 → KB 块 → 用神判定`。

```
【引用铁律】
1. 每条断语后必须紧跟引用编号，形如 [KB-03]；编号只能取自下方【知识库】清单，不得自造、不得改写。
2. 【知识库】未载的内容一律写「典籍未载」，不得以通用命理常识、心理疏导话术或模糊判断填充。
3. 禁止自造爻辞、卦辞、大象传。清单未给出某爻爻辞时，只可引卦辞、大象与断法条目，不得写出「初九：×××」这类原文。
4. 卦名、卦符、卦辞只能逐字引用【卦象快照】。
5. 盘面数据不足以支撑的断语，直接删除；禁止「可能」「或许」「大概」这类折中表述。
6. 同一编号不得连续引用超过两次充作万能用据。

【输出契约】严格按下列五节输出，不得增删标题、不得改标题文字：
## 一、结论
三选一加粗：**成** / **不成** / **成而有阻**。随后一句说明所据用神与关键条件，挂引用。
## 二、依据
分条列出，每条格式为：`盘面条件 → 断语（[KB-xx]）`。至少三条、最多六条，必须覆盖用神旺衰与动变。
## 三、应期
给出具体月/旬/日，并写明推法（逢值、逢冲、出空、填实、逢合、冲开墓库之一），挂引用。无法定时写「典籍未载定期之法」，不得写「近期」「适当时候」。
## 四、风险信号
一至两条会使结论翻盘的具体条件（如「若卦中再出酉金克用神」），不写泛泛警示。
## 五、若…则…
至少两条分条件判断，格式 `若〈条件〉，则〈结论〉`。

【禁用表述】顺其自然、保持平和、注意沟通、理性看待、顺应变化、调整心态、把握时机、宜守不宜攻、多留意、整体平稳、稳中求进、具体情况具体分析、因人而异、量力而行、放平心态、静待时机、顺势而为。
```

en 版保留五节标题（`## 1. Verdict` / `## 2. Evidence` / `## 3. Timing` / `## 4. Risk Signals` / `## 5. If… then…`），铁律条目 1/2/3/4 必须翻译保留，禁用表述不翻。

---

## 10. `guard.ts`

```ts
export interface GuardIssue {
  type: 'unknown_citation' | 'no_citation' | 'banned_phrase' | 'unknown_hexagram' | 'fabricated_line_text';
  detail: string;
}

export function auditLiuYaoReport(text: string, ctx: {
  allowedRefs: string[];
  reading: IChingReading;
  lang?: 'zh' | 'en';
}): { ok: boolean; issues: GuardIssue[]; metrics: { citations: number; bannedHits: number } };
```

检测项：

1. **未知引用**：`/\[KB[-‐]?(\d{1,3})\]/g`，规范化成 `KB-0x` 后必须在 `allowedRefs` 内。
2. **完全无引用**：中文、正文 > 600 字、`allowedRefs` 非空、引用数为 0。
3. **空话/模糊词**：命中 §9 禁用表述任一，或「可能/也许/大概/某些/一定程度上」≥3 次。
4. **非标准卦名**：匹配 `/第\s*\d+\s*卦\s*[·・]?\s*([\u4e00-\u9fa5]{2,3})/` 与 `/【([^】]{2,4})卦】/`，捕获名不在 `STANDARD_HEXAGRAM_NAMES` 且不在白名单（`本卦/变卦/之卦/互卦/六冲/六合/游魂/归魂/八纯/独发/独静/反吟/伏吟/卦`）→ issue。
5. **自造爻辞**：`/(初九|初六|九二|六二|九三|六三|九四|六四|九五|六五|上九|上六)[：:]\s*([^\n。]{2,40})/g`，捕获文本必须能在 `LINE_TEXTS` 对应卦/爻位里找到子串；`LINE_TEXTS` 为空时一律判 `fabricated_line_text`。

调用位置：

- `src/app/api/east/liuyao/route.ts`：流结束后用 `onKnowledge` 捕获的 `usedRefs` 审计。
- `src/app/api/east/liuyao/follow-up/route.ts`：同上。
- 结果：`console.warn('[liuyao-guard]', issues)`；若落库，写入 `reading_snapshot.audit`（首解）或忽略（追问）。**不改写输出、不发 SSE。**

---

## 11. `conversation.ts`：上下文管理

```ts
export interface ConversationTurn { role: 'user' | 'assistant'; content: string }

export function buildFollowUpMessages(args: {
  history: ConversationTurn[];
  question: string;
  budgetChars?: number;  // 默认 8000
}): { messages: LLMMessage[]; droppedTurns: number; note?: string };
```

规则：

1. 先剔除非法 role、空内容、"assistant 自称系统指令"的伪消息（含 `【` 且长度 > 200 的 assistant 消息降级为摘要）。
2. 从最新往回累加字符，超出 `budgetChars` 即停止；**保证最近 2 轮（1 问 1 答）必留**。
3. 被丢弃的更早轮次压成一行摘要：`前文摘要：共 N 轮，最后一次问及「…前 40 字…」`，作为第一条 `system` 内容之外的 `user` 前置？——**不要**：摘要拼进最后一条 user 消息前缀，避免伪造角色。
4. 每条 assistant 历史截断到 800 字符（尾部 `…`），并保留其三节小标题（若存在）。
5. 返回的 `messages` 不得包含 `system` role（system 由调用方给 `systemInstruction`）。

---

## 12. 改动点（逐处）

### 12.1 `src/lib/llm/adapter.ts`

**A. 修 Gemini 丢历史（当前第 146–155 行）**

```ts
// 旧
const lastUserMsg = opts.messages.filter(m => m.role === 'user').pop();
const inputPrompt = lastUserMsg?.content || '';

// 新：按角色拼 transcript，保留多轮
const transcript = opts.messages
  .map(m => `${m.role === 'user' ? '求问者' : m.role === 'assistant' ? '易学师' : '说明'}: ${m.content}`)
  .join('\n\n');
if (!transcript.trim()) throw new Error('Gemini 通道输入为空');
```

`ai.interactions.create({ model, system_instruction, input: transcript, stream: true })` 的调用形态**保持不变**。若该 SDK 明确支持多轮 `contents` 数组，可改为多轮；无法确认时用 transcript（保守且不丢信息）。

**B. 加预算参数**

```ts
export interface StreamLLMOptions {
  // ...原有字段
  /** 上下文预算（字符）。超限直接抛错，不静默截断 */
  maxContextChars?: number;
}
```

在 `streamLLM` 开头：

```ts
if (options.maxContextChars) {
  const total = (systemInstruction?.length ?? 0)
    + messages.reduce((n, m) => n + m.content.length, 0);
  if (total > options.maxContextChars) {
    throw new Error(`上下文超预算：${total} > ${options.maxContextChars}`);
  }
}
```

### 12.2 `src/lib/metaphysics/east-ai.ts`

1. 新增导出：

```ts
import { retrieveKnowledge } from '@/lib/kb/retriever';
import { buildKnowledgeBlock, buildLiuYaoSystem } from '@/lib/kb/context-builder';
import type { KnowledgeBundle } from '@/lib/kb/types';

export interface LiuYaoStreamOptions {
  onKnowledge?: (bundle: KnowledgeBundle) => void;
}

export function buildLiuYaoUserPrompt(req: LiuYaoAiRequest, lang?: 'zh' | 'en'): string;
```

2. `buildHexSnapshot(reading, lang)`：把现 `buildLiuYaoPrompt` 里 `- 【起卦时空提纲】…` 到 `- 变动爻位：…` 这一段整体搬出来（zh/en 各一份），保持文案不变。

3. `buildLiuYaoPrompt(req)`：改为 `return buildLiuYaoUserPrompt(req, req.lang)`，行为等价（**保留导出**，避免影响其他调用方）。

4. `streamLiuYaoReading`：

```ts
export async function* streamLiuYaoReading(
  req: LiuYaoAiRequest,
  options?: LiuYaoStreamOptions
): AsyncGenerator<string, void, unknown> {
  const activeSkill = getActiveLiuYaoSkill();
  const bundle = retrieveKnowledge({ question: req.question, reading: req.reading, lang: req.lang === 'en' ? 'en' : 'zh' });
  const { block } = buildKnowledgeBlock(bundle);
  options?.onKnowledge?.(bundle);

  const systemInstruction = buildLiuYaoSystem({
    lang: req.lang === 'en' ? 'en' : 'zh',
    skillInstruction: activeSkill.systemInstruction,
    block,
    yongShenNote: `用神判定：${bundle.yongShen.reason}`,
  });
  const userPrompt = buildLiuYaoUserPrompt(req, req.lang === 'en' ? 'en' : 'zh');

  try {
    yield* streamLLM({
      systemInstruction,
      messages: [{ role: 'user', content: userPrompt }],
      maxContextChars: 24000,
    });
    return;
  } catch (err) {
    console.warn('大模型调用受限，切换内置引擎:', err);
  }
  // 原有降级逻辑保持不变
}
```

注意：**原有 `LIUYAO_TABLE_RULE` 从 system 里移除**，其内容已被引用铁律第 4 条覆盖；`LIUYAO_TABLE_RULE` 常量保留导出。

5. 降级路径 `generateLocalLiuYaoReport` 不动（无引用属预期）。

### 12.3 `src/app/api/east/liuyao/route.ts`

```ts
import { auditLiuYaoReport } from '@/lib/kb/guard';
import type { KnowledgeBundle } from '@/lib/kb/types';

// 流开始前
let bundle: KnowledgeBundle | undefined;

for await (const chunk of streamLiuYaoReading(request, {
  onKnowledge: (b) => { bundle = b; },
})) { /* 原样 */ }

// 流结束后（在写库之前）
if (bundle) {
  const audit = auditLiuYaoReport(fullReportText, {
    allowedRefs: bundle.hits.map(h => h.ref),
    reading: request.reading,
    lang: request.lang === 'en' ? 'en' : 'zh',
  });
  if (!audit.ok) console.warn('[liuyao-guard]', audit.issues);
  // 落库时带上：reading_snapshot: { ...request.reading, ai_report, audit }
}
```

### 12.4 `src/app/api/east/liuyao/follow-up/route.ts`

重写第 41–65 段（上下文构建 + messages）：

```ts
import { retrieveKnowledge } from '@/lib/kb/retriever';
import { buildKnowledgeBlock, buildLiuYaoSystem } from '@/lib/kb/context-builder';
import { buildFollowUpMessages } from '@/lib/llm/conversation';
import { auditLiuYaoReport } from '@/lib/kb/guard';

// 1. 服务端取历史与首解锚点
let anchor = '';
let history: ConversationTurn[] = [];
if (session_id) {
  const user = await getSupabaseUser();
  if (user) {
    const supabase = await createSupabaseServerClient();
    const [{ data: sessionRow }, { data: msgRows }] = await Promise.all([
      supabase.from('liuyao_sessions')
        .select('reading_snapshot')
        .eq('id', session_id).maybeSingle(),
      supabase.from('liuyao_messages')
        .select('role,content')
        .eq('session_id', session_id)
        .order('created_at', { ascending: true })
        .limit(40),
    ]);
    const snapshot = sessionRow?.reading_snapshot as { ai_report?: string } | null;
    anchor = extractAnchor(snapshot?.ai_report ?? '');
    history = (msgRows ?? []).filter(r => r.role === 'user' || r.role === 'assistant');
  }
}
// 2. 未登录/无 session：回退客户端历史，但必须清洗（最多 8 条、单条 ≤1200 字）
if (!history.length) history = sanitizeClientHistory(previous_messages);

// 3. 检索（与首解同一套）
const bundle = retrieveKnowledge({ question, reading, lang });

// 4. messages：服务端历史优先，客户端只在兜底时生效
const { messages } = buildFollowUpMessages({ history, question, budgetChars: 8000 });

// 5. system：与首解共用同一个装配器，锚点与追问心法放 extraBlocks
//    （buildLiuYaoSystem 内部已含：心法 → 铁律 → 契约 → 卦象快照 → KB 块 → 用神判定）
const systemInstruction = buildLiuYaoSystem({
  lang,
  skillInstruction: activeSkill.systemInstruction,
  block: buildKnowledgeBlock(bundle).block,
  yongShenNote: `用神判定：${bundle.yongShen.reason}`,
  extraBlocks: [
    anchor ? `【首解结论·锚点（不得推翻）】\n${anchor}` : '',
    followUpRule,
    langInstruction,
  ].filter(Boolean),
});
```

**不要在这里手写数组拼接**。首解与追问共用 `buildLiuYaoSystem`，是为了保证两处 system 的段落顺序、铁律措辞完全一致——两处各拼一次，早晚会漂移。

`extractAnchor(report)`：优先取 `## 一、结论` 到下一个 `##` 之间的内容（≤400 字）；找不到则取全文前 1200 字。

`sanitizeClientHistory`：剔除 role 非法、content 为空、assistant 内容含「【引用铁律】」「【输出契约】」等注入特征的消息；截断到最近 8 条。

流结束后审计，逻辑同 12.3。

**前端不改也能跑**：`LiuYaoFollowUpWidget` 继续传 `previous_messages`，服务端在有 `session_id` 时忽略它。

### 12.5 `src/lib/metaphysics/skills/default-skill/index.ts`

`systemInstruction` 末尾追加一句（其余不动）：

```
凡断必引【知识库】编号；知识库未载者，书「典籍未载」，不得以通用命理常识补足。
```

---

## 13. 执行顺序与验证点

| 步骤 | 内容 | 完成判据 |
|---|---|---|
| S1 | `types.ts` / `wuxing.ts` / `pan.ts` | `npx tsc --noEmit` 通过；写一个 `node` 临时脚本，用「水天需变天水讼」验证 `isSixChong`、`xunKongList`、动爻 `transform.kind` 正确 |
| S2 | `canon.ts` / `rules.ts` 先写 60 条（用神、元神忌神、月建日辰、月破、旬空、应期各 10） | 用 S1 脚本跑 `retrieveKnowledge`，打印 `KB-xx + reason`，人工核验用神判定是否合理 |
| S3 | `retriever.ts` / `context-builder.ts` / `guard.ts` / `east-ai.ts` 接入 | 起 `npm run dev`，摇一卦，输出出现 `[KB-xx]` 且五节标题齐全；`guard` 日志无 `unknown_citation` |
| S4 | `adapter.ts` 修复 + `conversation.ts` + `follow-up` 改造 | 同一 `session_id` 连问 3 轮，第 3 轮能复述首解结论；不带 `previous_messages` 也成立 |
| S5 | `rules.ts` 补到 180 条 + 全量验收 | 见下 |

**全量验收**

1. `npx tsc --noEmit` 通过。
2. `npm run lint` 无新增 error。
3. `npm run build` 通过（若时间成本高，至少保证前两项 + dev 环境实测）。
4. 三个固定盘面人工过：
   - 乾为天（六冲、无动爻）
   - 水天需变天水讼（多动爻、有回头生克）
   - 六合卦变六冲（否 → 无妄一类）
   检查：结论三选一、依据带条件、应期有推法、无自造爻辞、无禁用表述。
5. 追问跨轮一致性：同一 session 第 3 轮问「那具体几月」，回答必须落在首解应期上，不得改口。
6. Gemini 通道回归：临时 `METAPHYSICS_LLM_PROVIDER=gemini`，追问第 2 轮能引用第 1 轮内容（修复前必然失败）。

---

## 14. 已知风险与处理

| 风险 | 处理 |
|---|---|
| 五行/长生/进退神表写错，导致条件判定全错 | 全部照《增删卜易》章节原文录入，写完用 3 个已知卦例（元神忌神衰旺章第十的例）反推校验 |
| 六冲/六合判定与流派不一致 | 用机械判定（三对全冲/全合），并回归八纯卦 + 天地否 |
| draft 条目被当权威 | 输出加 `〔未审〕`；`credibility` 参与打分但不掩盖 draft 身份 |
| 断语通篇挂同一条引用 | 铁律第 6 条限制同一编号出现次数；guard 二期可加密度检查 |
| 模型仍写空话 | 契约五节 + 禁用表述 + guard 检测；**本期只检测不改写**，重写留二期 |
| 用神判定错（问题太模糊） | `reason` 显式展示给模型，允许模型在「结论」中声明「用神依…取，若取用不同则结论随之变」 |
| 伏神缺失导致断不细 | 只置 `yong-shen-bu-xian` 条件并要求声明，不编造伏神；二期再补飞伏排盘 |
| en 分支不注入中文条目仍偏泛 | 已知取舍，英文场景不在本期验收范围 |

---

## 15. 交付物清单

```
新增  src/lib/kb/types.ts
新增  src/lib/kb/wuxing.ts
新增  src/lib/kb/pan.ts
新增  src/lib/kb/canon.ts
新增  src/lib/kb/rules.ts            （约 180 条）
新增  src/lib/kb/retriever.ts
新增  src/lib/kb/context-builder.ts
新增  src/lib/kb/guard.ts
新增  src/lib/llm/conversation.ts
改    src/lib/llm/adapter.ts          （Gemini 多轮 + 预算）
改    src/lib/metaphysics/east-ai.ts  （KB 注入 + 新契约）
改    src/app/api/east/liuyao/route.ts        （审计）
改    src/app/api/east/liuyao/follow-up/route.ts （服务端历史 + KB + 审计）
改    src/lib/metaphysics/skills/default-skill/index.ts （一句铁律）
```

不新增依赖，不改数据库结构，不改前端契约。

---

## 16. Skill 层：空插槽、准入规则与优先级

**现状**：`skills/custom/index.ts` 的 `customLiuYaoSkill` 为 `null`，`getActiveLiuYaoSkill()` 直接回退 `defaultLiuYaoSkill`。README 里写的 `ACTIVE_LIUYAO_SKILL_ID` 环境变量**代码从未读取**（全仓仅 README 出现一次）。

因此本期不存在"多 skill 选择"，只有内置基准一条路。**本方案 S1–S5 全部不依赖 skill 插槽，不要为它做额外改动。**

### 16.1 冲突裁决顺序（必须遵守）

1. 引用铁律 + 输出契约 —— **不可被 skill 覆盖**
2. 卦象快照 + KB 证据 —— 唯一事实来源
3. `skill.systemInstruction` —— 人设与流派语气
4. `skill.followUpInstruction` —— 追问补充

### 16.2 长度上限

`buildLiuYaoSystem` 对 `skillInstruction` 截断到 `SKILL_INSTRUCTION_MAX`（600 字符），超出部分丢弃并 `console.warn`。原因：现有 default 已约 700 字，叠加铁律、契约、快照、KB 后 system 接近 6,000 字，中段指令遵从度会明显下降。

### 16.3 装载准入条件（写进 `skills/custom/README.md`）

- `manifest.category === 'liuyao'` 且 `manifest.id` 非空
- `systemInstruction` ≤600 字，且**不得包含**：
  - 要求跳过引用 / 不必挂出处
  - 允许"自由发挥""凭象直断""不必拘泥卦辞"
  - 要求自拟典籍原句
- `assembleContext` 不再调用，类型上标 `@deprecated`（其职责已由 `retriever` 承担）
- 流派差异通过新增的 `kbProfile`（权重/用神偏好/应期偏好）表达，不通过加长提示词
- 违反任一条 → `getActiveLiuYaoSkill()` 回退 default 并 `console.warn`

### 16.4 环境变量：二选一，不要留着假文档

```ts
const wanted = process.env.ACTIVE_LIUYAO_SKILL_ID;
if (customLiuYaoSkill && (!wanted || customLiuYaoSkill.manifest.id === wanted)) {
  return customLiuYaoSkill;
}
if (wanted) console.warn(`[liuyao-skill] 未找到 ${wanted}，回退 default`);
return defaultLiuYaoSkill;
```

不做这个实现，就删掉 README 的"方式 B"。照文档配置却静默不生效，比没有这个功能更糟。

### 16.5 什么时候才该装 skill

顺序固定：**KB 与契约跑通 → 建 20 卦人工基准 → 再装**。届时装两个 `kbProfile` 变体（如"重月破"vs"重动变"）做 A/B，差异才可归因。

在 KB 之前装"大师提示词"型 skill，预期净效果为负：它增加了发挥空间，却没有增加可用证据，还会稀释引用纪律。

