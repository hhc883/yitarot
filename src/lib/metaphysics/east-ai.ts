import { BaZiCalculationResult } from './bazi';
import { IChingReading } from './iching';
import { getActiveLiuYaoSkill } from './skills/registry';
import { streamLLM } from '@/lib/llm/adapter';
import { retrieveKnowledge } from '@/lib/kb/retriever';
import { buildKnowledgeBlock, buildHexSnapshot, buildLiuYaoSystem } from '@/lib/kb/context-builder';
import { buildImagerySnapshot } from '@/lib/kb/concepts';
import { buildCeziInsightSnapshot } from '@/lib/kb/cezi';
import type { KnowledgeBundle } from '@/lib/kb/types';

export { buildHexSnapshot } from '@/lib/kb/context-builder';
export { buildCeziInsightSnapshot } from '@/lib/kb/cezi';

export interface CeziAiRequest {
  char: string;
  question: string;
  lang?: string;
  points_ref?: string;
}

export interface LiuYaoStreamOptions {
  onKnowledge?: (bundle: KnowledgeBundle) => void;
}

export interface BaziAiRequest {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute?: number;
  gender: 'male' | 'female';
  name?: string;
  focusArea?: 'career' | 'wealth' | 'love' | 'health' | 'general';
  lang?: string;
  /** 积分扣分幂等键（/api/readings/consume 返回） */
  points_ref?: string;
}

export interface LiuYaoAiRequest {
  question: string;
  reading: IChingReading;
  lang?: string;
  /** 积分扣分幂等键（/api/readings/consume 返回） */
  points_ref?: string;
}

/**
 * 构造八字深度推演的 System & User Prompt
 */
export function buildBaziPrompt(data: BaZiCalculationResult, req: BaziAiRequest): string {
  if (req.lang === 'en') {
    return `You are a master of classical Zi Ping BaZi metaphysics and modern Jungian archetypal psychology (YiTatro Architecture).
Querent: ${req.name || 'Querent'}, Gender: ${req.gender}
Solar Birth: ${data.birthSolar.year}-${data.birthSolar.month}-${data.birthSolar.day} ${data.birthSolar.hour}:00, Lunar: ${data.lunarString}
【Four Pillars】:
- Year Pillar: ${data.pillars.year.gan}${data.pillars.year.zhi} (${data.pillars.year.naYin})
- Month Pillar: ${data.pillars.month.gan}${data.pillars.month.zhi} (${data.pillars.month.naYin})
- Day Pillar: ${data.pillars.day.gan}${data.pillars.day.zhi} (${data.pillars.day.naYin})
- Hour Pillar: ${data.pillars.hour.gan}${data.pillars.hour.zhi} (${data.pillars.hour.naYin})

【Day Master】: ${data.dayMaster.nameEn} (${data.dayMaster.archetypeEn})
【Five Elements Distribution】:
${data.fiveElements.map(e => `- ${e.element}: ${e.count} (${e.percentage}%) - ${e.status}`).join('\n')}

Please write an objective, profound, and modern 【AI BaZi Holographic Insight】 in English with markdown headings:
# 🌟 Day Master Essence & Archetype
# ⚖️ Five Elements Synergy & Balance
# 💼 Career Trajectory & Genius Zone
# 🪙 Wealth Blueprint & Financial Timing
# ❤️ Romance & Relational Harmony
# 🧭 Action Strategy & Cosmic Balance`;
  }

  return `你是一位兼具正统子平八字命理精髓与现代荣格心理学视角的资深命理宗师（YiTatro 全息推演架构）。
求问者：${req.name || '求问者'}，性别：${req.gender === 'male' ? '男（乾造）' : '女（坤造）'}
公历出生：${data.birthSolar.year}年${data.birthSolar.month}月${data.birthSolar.day}日${data.birthSolar.hour}时，农历：${data.lunarString}
【四柱八字】：
- 年柱：${data.pillars.year.gan}${data.pillars.year.zhi}（${data.pillars.year.naYin}）
- 月柱：${data.pillars.month.gan}${data.pillars.month.zhi}（${data.pillars.month.naYin}）
- 日柱：${data.pillars.day.gan}${data.pillars.day.zhi}（${data.pillars.day.naYin}）
- 时柱：${data.pillars.hour.gan}${data.pillars.hour.zhi}（${data.pillars.hour.naYin}）

【日主元神】：${data.dayMaster.nameZh}（${data.dayMaster.archetypeZh}）
【五行分布】：
${data.fiveElements.map(e => `- ${e.elementZh}：${e.count}个 (${e.percentage}%) - ${e.statusZh}`).join('\n')}

请为求问者撰写一份客观、深刻、现代且极具指导意义的【AI 命理全息蓝图】：
# 🌟 原局元神与性格底色
# ⚖️ 五行生克与能量调候
# 💼 事业发展与天赋赛道
# 🪙 财富格局与进财指南
# ❤️ 情感姻缘与相处之道
# 🧭 后天补运与破局策略（包含颜色、方位、作息与心性修炼建议）`;
}

/**
 * 构造六爻占卦的 System & User Prompt
 */
export const LIUYAO_TABLE_RULE = `【铁律 · 六十四卦标准查表是唯一事实来源】
下列卦名、卦符、卦辞、大象传、上下卦均由爻线（自初爻至上爻，阳=1、阴=0；下三爻为下卦、上三爻为上卦）查标准六十四卦表得出。
1. 只能逐字引用；禁止自创、改写、音译或另起任何卦名（如「乾健生生卦」「坤厚柔化卦」等一切非标准名称）。
2. 禁止自行更换卦符、卦辞、大象传，禁止依据阴阳多寡或凭记忆重新推演卦名。
3. 若你记忆中的卦名与下表不一致，一律以下表为准。
4. 解读只可围绕求问之事与下表卦象展开，不得生成表中不存在的卦名、卦符或卦辞。`;

export const LIUYAO_TABLE_RULE_EN = `[HARD RULE · THE 64-HEXAGRAM LOOKUP TABLE IS THE SOLE SOURCE OF TRUTH]
The names, symbols, judgments, images and trigrams below come from a standard 64-hexagram lookup driven by the six lines (bottom to top, yang=1 / yin=0; lower trigram = first three lines, upper trigram = last three).
1. Quote them verbatim. Never invent, rename, or substitute any hexagram name (no made-up names such as "乾健生生卦").
2. Never change the symbol, judgment or image, and never re-derive a name from yin/yang counts or from memory.
3. If a name you remember disagrees with the table, the table always wins.
4. Interpret only the inquiry and the hexagrams listed below; do not generate any name, symbol or judgment absent from the table.`;

export function buildLiuYaoUserPrompt(req: LiuYaoAiRequest, lang?: 'zh' | 'en'): string {
  const isEn = (lang ?? req.lang) === 'en';
  if (isEn) {
    return `Inquiry: "${req.question}"\n\nPlease generate an I Ching oracle following the [Output Contract] and [Reference Rules].`;
  }
  return `求问者所决之事：“${req.question}”\n\n请按【输出契约】五节输出六爻神谕断语，严格执行【引用铁律】。`;
}

export function buildLiuYaoPrompt(req: LiuYaoAiRequest): string {
  return buildLiuYaoUserPrompt(req, req.lang === 'en' ? 'en' : 'zh');
}

/**
 * 本地智能八字解读引擎（离线/免 Key 降级保障）
 */
export function generateLocalBaziReport(data: BaZiCalculationResult, lang: string = 'zh'): string {
  const dm = data.dayMaster;
  const dominantElement = data.fiveElements.reduce((prev, curr) => (curr.percentage > prev.percentage ? curr : prev));
  const lackingElement = data.fiveElements.reduce((prev, curr) => (curr.percentage < prev.percentage ? curr : prev));

  if (lang === 'en') {
    return `### 🌟 Day Master Essence & Archetype
Your Day Pillar Heavenly Stem is **【${dm.nameEn}】**, classically recognized as the archetype of “${dm.archetypeEn}”.
${dm.essenceEn}
You possess innate insight, strategic vision, and methodical perseverance.

---

### ⚖️ Five Elements Synergy & Balance
In your natal chart, **【${dominantElement.element}】** energy holds prime prominence (~${dominantElement.percentage}%), while **【${lackingElement.element}】** remains latent.
- **Dynamic Balance**: When five elements circulate freely, decisions flow with composure. Dominant energies require constructive release; latent energies benefit from mindful cultivation.
- **Harmony Recommendation**: Integrate habits, environments, and routines aligned with ${lackingElement.element}.

---

### 💼 Career Trajectory & Genius Zone
${dm.cosmicAdviceEn}
You excel in fields requiring strategic depth, intellectual moat, or autonomous mastery over core milestones. Avoid environments paralyzed by cosmetic bureaucracy.

---

### 🪙 Wealth Blueprint & Financial Timing
Wealth roots in sustainable production and disciplined constraints. For you, prosperity follows a **"compounding value curve"**—protect foundational assets and deepen your skill moats rather than pursuing high-frequency speculation.

---

### ❤️ Romance & Relational Harmony
In intimate partnerships, you value mental alignment and respected boundaries. Cultivating warmth and vulnerable authenticity provides enduring emotional security.

---

### 🧭 Action Strategy & Cosmic Balance
- 💡 **Harmonization**: ${data.elementRecommendationsEn}
- 🌿 **Mindset**: Align with natural rhythm; clarity emerges from inner stillness.`;
  }

  return `### 🌟 原局元神与性格底色
你的日柱天干为**【${dm.nameZh}】**，在古典命理中被称为“${dm.archetypeZh}”。
${dm.essenceZh}
你天生具有深厚的领悟力与稳健的步调，但在面对突如其来的变化时，有时容易陷入过度思虑。

---

### ⚖️ 五行生克与能量调候
原局中，你的五行以**【${dominantElement.elementZh}】**气场最为旺盛（占比约 ${dominantElement.percentage}%），而**【${lackingElement.elementZh}】**能量相对潜藏。
- **生克动态**：五行流通顺畅则诸事从容，旺者宜泄宜化，弱者需培需扶。
- **调候重点**：在日常生活与职业规划中，注重补充【${lackingElement.elementZh}】属性的思维方式与生活习惯。

---

### 💼 事业发展与天赋赛道
${dm.cosmicAdviceZh}
在职业发展上，你适合需要深度专研、战略谋划或独立把控核心环节的领域。尽量避免在流于形式、琐碎内耗的环境中空转，专注打磨你的不可替代性。

---

### 🪙 财富格局与进财指南
财星依附于食伤生发或官杀约束。对于你而言，财富属于**“长线复利型”**，宜守正出奇，重视资产的稳固与技能护城河，避免盲目追逐高杠杆短期投机。

---

### ❤️ 情感姻缘与相处之道
在亲密关系中，你注重精神层面的同频与彼此尊重的界限。学会适度放下防备与理智审视，用柔软的温度给予伴侣安全感，将收获相濡以沫的良缘。

---

### 🧭 后天补运与破局策略
- 💡 **调和建议**：${data.elementRecommendationsZh}
- 🌿 **心性修炼**：顺应自然节律，知止而有定，定而后能安。`;
}

/**
 * 本地六爻神谕解读引擎（增删卜易 · 卜筮全书 · 京氏易传理法直出）
 */
export function generateLocalLiuYaoReport(req: LiuYaoAiRequest, customBundle?: KnowledgeBundle): string {
  const { question, reading, lang } = req;
  const n = reading.najia;

  const bundle = customBundle || retrieveKnowledge({ question, reading, lang: lang === 'en' ? 'en' : 'zh' });
  const facts = bundle.facts;
  const yongShenName = bundle.yongShen.primary.join('、') || '用神';

  if (lang === 'en') {
    const topHits = bundle.hits.slice(0, 5);
    const primaryRef = topHits[0] ? `[${topHits[0].ref}]` : '[KB-01]';
    let verdict = 'Attainable';
    if (facts.conditions.has('month-break') || facts.conditions.has('hui-tou-ke') || facts.conditions.has('hua-jue')) {
      verdict = 'Unattainable';
    } else if (facts.conditions.has('xun-kong') || facts.conditions.has('hua-mu') || facts.conditions.has('transform-retreat') || facts.conditions.has('liu-chong-gua')) {
      verdict = 'Attainable with obstacles';
    }

    const evidenceList = topHits.map(h => `- Condition: ${h.reason} -> Judgment: "${h.entry.text.slice(0, 80)}..." ([${h.ref}])`).join('\n');

    return `## 1. Verdict
**${verdict}**. Regarding inquiry "${question}", the primary focus falls on ${yongShenName}. (${primaryRef})

## 2. Evidence
${evidenceList}

## 3. Timing
${topHits[0]?.entry.timing || 'Decided by Day Void clearance (Xun Kong) or Clashing day as documented in canons.'} (${primaryRef})

## 4. Risk Factors
If hostile branches clash or conquer the primary focus line, the affirmative verdict risks reversal.

## 5. If... Then...
- If future solar/lunar dates generate support for ${yongShenName}, then the enterprise prospers;
- If adverse clashing emerges, then restraint preserves vitality.`;
  }

  // 中文模式：严格遵循输出契约与引用规范
  const topHits = bundle.hits.slice(0, 6);
  const ruleHits = topHits.filter(h => h.entry.kind === 'rule');
  const primaryHit = ruleHits[0] || topHits[0];
  const primaryRef = primaryHit ? `[${primaryHit.ref}]` : '[KB-01]';

  // 严格判定结论
  let verdict: '成' | '不成' | '成而有阻' = '成';
  let verdictReason = '用神得日月生扶，气数纯旺';

  if (facts.conditions.has('month-break') || facts.conditions.has('hui-tou-ke') || facts.conditions.has('hua-jue')) {
    verdict = '不成';
    verdictReason = facts.conditions.has('month-break') ? '用神休囚而临月破，根基已伤' : '动化回头克，外助反成内祸';
  } else if (facts.conditions.has('xun-kong') || facts.conditions.has('hua-mu') || facts.conditions.has('transform-retreat') || facts.conditions.has('liu-chong-gua')) {
    verdict = '成而有阻';
    verdictReason = facts.conditions.has('xun-kong') ? '用神虽旺而入旬空，出空方能成事' : '卦逢六冲或动化退神，先难而后易';
  } else if (facts.conditions.has('hui-tou-sheng') || facts.conditions.has('transform-advance') || facts.conditions.has('dark-move') || facts.conditions.has('liu-he-gua')) {
    verdict = '成';
    verdictReason = facts.conditions.has('hui-tou-sheng') ? '动爻化回头生，自内发秀' : '爻临动旺化进神，势如破竹';
  }

  // 依据清单（至少三条，挂引用）
  const evidenceLines: string[] = [];
  for (const h of topHits) {
    if (evidenceLines.length >= 4) break;
    const bookTitle = h.entry.source.book || '增删卜易';
    const chap = h.entry.source.chapter ? `·${h.entry.source.chapter}` : '';
    const cleanText = h.entry.text.length > 70 ? h.entry.text.slice(0, 70) + '…' : h.entry.text;
    evidenceLines.push(`- 盘面条达：${h.reason} → 【${bookTitle}${chap}】：“${cleanText}”（[${h.ref}]）`);
  }
  if (evidenceLines.length < 3 && topHits.length > 0) {
    for (const h of topHits) {
      if (!evidenceLines.some(l => l.includes(`[${h.ref}]`))) {
        evidenceLines.push(`- 盘面机括：${h.reason} → 断语：“${h.entry.text.slice(0, 60)}”（[${h.ref}]）`);
      }
      if (evidenceLines.length >= 3) break;
    }
  }

  // 应期推法
  let timingText = '';
  const timingRule = topHits.find(h => h.entry.timing);
  if (timingRule && timingRule.entry.timing) {
    timingText = `以用神生旺墓绝与冲合之律定之：${timingRule.entry.timing}。（[${timingRule.ref}]）`;
  } else if (facts.conditions.has('xun-kong') && n) {
    timingText = `用神落旬空（${n.timeInfo.xunKong}），以出空逢值、逢冲之日断，过旬即见分晓。（${primaryRef}）`;
  } else if (facts.conditions.has('month-break')) {
    timingText = `用神逢月破，出月逢值逢合之月日方得实破应验。（${primaryRef}）`;
  } else {
    timingText = `动而逢合以冲开之日断，静爻逢值逢生以生旺之月日为期。（${primaryRef}）`;
  }

  // 风险信号
  let riskText = '';
  if (facts.conditions.has('hui-tou-ke')) {
    riskText = '若变爻克绝之支在日辰再次加临发动，则凶势不可解。';
  } else if (facts.conditions.has('month-break')) {
    riskText = '若出月后仍逢日辰重克，则彻底化为真破无救。';
  } else {
    riskText = '若占后日辰遇相刑相冲之煞克制用神，则事生翻覆。';
  }

  // 象意与天道消息快照
  const imagery = buildImagerySnapshot(reading, bundle.yongShen.primary);

  return `## 一、结论
**${verdict}**。占问「${question}」，以${bundle.yongShen.reason}。今盘面用神【${yongShenName}】${verdictReason}。（${primaryRef}）

## 二、依据
${evidenceLines.join('\n')}

## 三、应期
${timingText}

## 四、风险信号
${riskText}

## 五、若…则…
- 若出空或逢合之日生扶用神，则事成定局；
- 若遇忌神生旺克制用神，则中途多生枝节阻遏。

---

${imagery}`;
}

/**
 * 流式输出适配器
 */
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
    snapshot: buildHexSnapshot(req.reading, req.lang === 'en' ? 'en' : 'zh'),
    block,
    yongShenNote: `用神判定：${bundle.yongShen.reason}`,
    imageryNote: req.lang === 'en' ? undefined : buildImagerySnapshot(req.reading, bundle.yongShen.primary),
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

  // 本地专家引擎流式输出
  const fullText = generateLocalLiuYaoReport(req, bundle);
  const parts = fullText.split(/(?<=\n|。|！|？|：|；|\*\*)/);
  for (const p of parts) {
    yield p;
    await new Promise(r => setTimeout(r, 25));
  }
}

/**
 * 八字命理流式输出适配器
 */
export async function* streamBaziReading(data: BaZiCalculationResult, req: BaziAiRequest): AsyncGenerator<string, void, unknown> {
  const userPrompt = buildBaziPrompt(data, req);

  try {
    yield* streamLLM({
      systemInstruction: req.lang === 'en'
        ? 'You are a master of classical Zi Ping BaZi metaphysics and modern psychological counseling (YiTatro Architecture).'
        : '你是一位兼具正统子平八字命理精髓与现代心理学视角的资深命理宗师（YiTatro 全息推演架构）。',
      messages: [{ role: 'user', content: userPrompt }]
    });
    return;
  } catch (err) {
    console.warn('大模型（DeepSeek/Gemini）调用受限，平滑切换至内置八字命理引擎:', err);
  }

  // 本地专家引擎流式输出
  const fullText = generateLocalBaziReport(data, req.lang);
  const parts = fullText.split(/(?<=\n|。|！|？|：|；|\*\*)/);
  for (const p of parts) {
    yield p;
    await new Promise(r => setTimeout(r, 20));
  }
}

/**
 * 构造测字心易全息推演 Prompt（《测字秘牒》清·程省）
 */
export function buildCeziPrompt(req: CeziAiRequest): { systemInstruction: string; userPrompt: string } {
  const snapshot = buildCeziInsightSnapshot(req.char, req.question);
  const systemInstruction = req.lang === 'en'
    ? 'You are an imperial Chinese character divination master grounded in Qing Dynasty maestro Cheng Sheng\'s "Ce Zi Mi Die" (测字秘牒). Analyze character strokes, radicals, anatomy, and homophones without vague modern clichés.'
    : `你是一位精通清代相字宗师程省《测字秘牒》的正统测字心易大师（YiTatro 象数推演架构）。
你的职责是依据求测者所写所指之「单字」，深究其装头、接脚、穿心、包笼、偏旁五行、字画骨骼（头心身足）与程省经典占验，做出直断事体成败吉凶与应期的确切断语。不得使用「顺其自然」「保持平和」等禁用空话。`;

  const userPrompt = req.lang === 'en'
    ? `Querent asks about: "${req.question}" with character "${req.char}".\n\n${snapshot}\n\nPlease provide a clear structural dissection, astrological/elemental mapping, historical case resonance, and definite timing.`
    : `求测事项：「${req.question}」\n所占之字：「${req.char}」\n\n${snapshot}\n\n请按《测字秘牒》之法，详陈字形骨骼结构分析、五行六神体用、吉凶断语与精准应期。`;

  return { systemInstruction, userPrompt };
}

/**
 * 测字断相心易流式输出适配器
 */
export async function* streamCeziReading(req: CeziAiRequest): AsyncGenerator<string, void, unknown> {
  const { systemInstruction, userPrompt } = buildCeziPrompt(req);

  try {
    yield* streamLLM({
      systemInstruction,
      messages: [{ role: 'user', content: userPrompt }]
    });
    return;
  } catch (err) {
    console.warn('大模型调用受限，切换内置测字析字引擎:', err);
  }

  const snapshot = buildCeziInsightSnapshot(req.char, req.question);
  const fallback = `## 一、字理本源
所书「${req.char}」字，按《测字秘牒》相字之法，字具象形与骨骼之体。

## 二、程省断法渊薮
${snapshot}

## 三、吉凶与应期指归
凡问「${req.question}」，字意与生克相合，事机当顺遂而成，切忌犹豫不决；应期以所带五行与冲合之日月定局。`;

  const parts = fallback.split(/(?<=\n|。|！|？|：|；|\*\*)/);
  for (const p of parts) {
    yield p;
    await new Promise(r => setTimeout(r, 20));
  }
}

export type EastChartKind = 'meihua' | 'qimen' | 'liuren' | 'ziwei';

export interface EastChartAiRequest {
  kind: EastChartKind;
  question?: string;
  chartSummary: string;
  localFallback?: string;
  lang?: string;
  points_ref?: string;
}

const EAST_KIND_SYSTEM_PROMPTS: Record<EastChartKind, { zh: string; en: string }> = {
  meihua: {
    zh: '你是一位精通邵雍《梅花易数》的易学宗师（YiTatro 全息推演架构）。严格依据传入的本卦、互卦、变卦、错综卦与体用五行生克断事，给出清晰、务实、有针对性的吉凶判断、应期与行动策略。',
    en: 'You are a master of Shao Yong\'s Plum Blossom Yi (Meihua Yishu). Ground your analysis strictly in the provided Primary, Nuclear, Transformed, Opposite, and Reverse hexagrams and Body-Application Five Elements dynamics.',
  },
  qimen: {
    zh: '你是一位精通奇门遁甲（时家转盘/飞盘拆补法）的实战宗师（YiTatro 全息推演架构）。严格依据传入的局数、节气、值符、值使、九宫星门神干格局、空亡与马星进行吉凶分析、方位抉择与行动建议。',
    en: 'You are a master of Qimen Dunjia. Analyze strictly from the provided Dun bureau, solar term, Zhifu, Zhishi, nine-palace stars/gates/deities/stems, void, and horse star.',
  },
  liuren: {
    zh: '你是一位精通大六壬（《大六壬指南》《毕法赋》）的实战宗师（YiTatro 全息推演架构）。严格依据传入的月将、昼夜贵人、天地盘、四课、九宗门三传、十二天将与旬空进行深度断课，直指事态起因、过程转折与最终结果。',
    en: 'You are a master of Da Liu Ren. Analyze strictly from the provided Monthly General, GuiRen, Four Lessons, Nine ZongMen Three Transmissions, Twelve Generals, and Void.',
  },
  ziwei: {
    zh: '你是一位精通紫微斗数（三合派与四化飞星）的资深命理宗师（YiTatro 全息推演架构）。严格依据传入的命宫、身宫、五行局、命主身主、十二宫星曜庙旺与生年/运限四化进行命格、事业、财运、感情与大限剖析。',
    en: 'You are a master of Zi Wei Dou Shu. Analyze strictly from the provided Life/Body palaces, Five Elements Bureau, star brightness, and Four Transformations.',
  },
};

export async function* streamEastChartReading(req: EastChartAiRequest): AsyncGenerator<string, void, unknown> {
  const isEn = req.lang === 'en';
  const sys = EAST_KIND_SYSTEM_PROMPTS[req.kind]?.[isEn ? 'en' : 'zh'] ?? EAST_KIND_SYSTEM_PROMPTS.meihua.zh;
  const userPrompt = isEn
    ? `${req.question ? `Inquiry: "${req.question}"\n\n` : ''}Chart Data:\n${req.chartSummary}\n\nProvide a structured, insightful Markdown reading covering: 1) Core Verdict, 2) Structural Dynamics, 3) Timing & Key Turning Points, 4) Actionable Advice.`
    : `${req.question ? `求问事项：「${req.question}」\n\n` : ''}排盘数据：\n${req.chartSummary}\n\n请以清晰分节的 Markdown 格式进行深度解析，涵盖：1）核心定局与吉凶总断；2）盘面关键结构与生克机理；3）应期与转折关键；4）具体行动建议与趋避指南。`;

  try {
    yield* streamLLM({
      systemInstruction: sys,
      messages: [{ role: 'user', content: userPrompt }],
    });
    return;
  } catch (err) {
    console.warn(`大模型调用受限，切换内置 ${req.kind} 本地解读:`, err);
  }

  const fallbackText =
    req.localFallback ||
    `### 核心定局与盘面解析\n\n${req.chartSummary}\n\n> 当前已基于本地排盘引擎生成结构化推演，请结合盘面生克与自身处境审慎决策。`;
  const parts = fallbackText.split(/(?<=\n|。|！|？|：|；|\*\*)/);
  for (const p of parts) {
    yield p;
    await new Promise((r) => setTimeout(r, 20));
  }
}

