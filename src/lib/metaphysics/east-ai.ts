import { BaZiCalculationResult } from './bazi';
import { IChingReading } from './iching';
import { getActiveLiuYaoSkill } from './skills/registry';
import { streamLLM } from '@/lib/llm/adapter';
import { retrieveKnowledge } from '@/lib/kb/retriever';
import { buildKnowledgeBlock, buildHexSnapshot, buildLiuYaoSystem } from '@/lib/kb/context-builder';
import { buildImagerySnapshot } from '@/lib/kb/concepts';
import type { KnowledgeBundle } from '@/lib/kb/types';

export { buildHexSnapshot } from '@/lib/kb/context-builder';

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
 * 本地六爻神谕解读引擎
 */
export function generateLocalLiuYaoReport(req: LiuYaoAiRequest): string {
  const { question, reading, lang } = req;
  const p = reading.primaryHexagram;
  const t = reading.transformedHexagram;
  const n = reading.najia;

  if (lang === 'en') {
    return `Regarding your inquiry: **“${question}”**, the six coins have completed their classical oracle casting.

---

### ⏳ Divination Timing & Astronomical Pillars
${n ? `- Date & Time: ${n.timeInfo.solarDate} (${n.timeInfo.lunarDate})
- Four Pillars: ${n.timeInfo.yearGanzhi} Year, ${n.timeInfo.monthGanzhi} Month, ${n.timeInfo.dayGanzhi} Day, ${n.timeInfo.timeGanzhi} Hour
- Month Leader (Yue Jian): **${n.timeInfo.monthZhi}** | Day Governor (Ri Chen): **${n.timeInfo.dayZhi}** | Day Void (Xun Kong): **${n.timeInfo.xunKong}**
- Hexagram Palace: **${n.palace} Palace (${n.palaceElement} Element)** · ${n.generationName} | Shi Line: **Line ${n.shiIndex}** · Ying Line: **Line ${n.yingIndex}**` : ''}

---

### ${p.symbol} Primary Hexagram: 【${p.nameEn}】 (${p.nameZh})
Hexagram **【${p.nameEn}】** ${p.symbol} (lower ${p.lowerTrigramEn} / upper ${p.upperTrigramEn}).
> *“${p.judgmentEn}”*
Image Commentary: *“${p.imageEn}”*

---

### 🔍 Classical Najia Lines Progression
${n ? n.lines.map(l => `- **${l.lineNameEn}** [${l.sixBeast}] ${l.relative} ${l.branch}${l.element} (${l.isYang ? 'Yang ⚊' : 'Yin ⚋'})${l.isShi ? ' 【Shi/Self】' : ''}${l.isYing ? ' 【Ying/Other】' : ''}${l.isChanging ? ` ⚡ (Moving -> Transforms into ${l.transformed?.relative} ${l.transformed?.branch}${l.transformed?.element})` : ''}`).join('\n') : reading.lines.map(l => `- Line ${l.lineIndex}: ${l.isYang ? 'Yang ⚊' : 'Yin ⚋'}${l.isChanging ? ' ⚡' : ''}`).join('\n')}

${t ? `---

### ⚡ Transformed Hexagram: 【${t.nameEn}】 (${t.nameZh}) ${t.symbol}
Moving lines catalyze evolution into Hexagram **【${t.nameEn}】**.
> *“${t.judgmentEn}”*
Following transitional friction, matters will mature in the direction governed by ${t.nameEn}.` : 'All six lines are peaceful; adhere strictly to the foundation of the Primary Hexagram.'}

---

### 🧭 Strategic Action Principles
- 💡 **DO**: ${p.careerAdviceEn} Maintain honesty and plan with foresight.
- ⚠️ **DON'T**: Avoid impulsive haste or forcing actions during emotional turbulence.

---

### ✨ Universal Wisdom
> *Act in accordance with ${p.nameEn}. The lookup table above is the sole authority on the name, symbol and judgment.*`;
  }

  return `针对你所叩问之事：**“${question}”**，铜钱六掷，京房纳甲神谕已成。

---

### ⏳ 起卦时空提纲
${n ? `- 公历时间：${n.timeInfo.solarDate} （农历：${n.timeInfo.lunarDate}）
- 四柱干支：**${n.timeInfo.yearGanzhi}年 ${n.timeInfo.monthGanzhi}月 ${n.timeInfo.dayGanzhi}日 ${n.timeInfo.timeGanzhi}时**
- 月令提纲：**${n.timeInfo.monthZhi}水（月建）** | 日辰主宰：**${n.timeInfo.dayZhi}火（日辰）** | 空亡：**${n.timeInfo.xunKong}空**
- 卦宫归属：**${n.palace}宫【${n.palaceElement}】· ${n.generationName}**（世在第 **${n.shiIndex}** 爻，应在第 **${n.yingIndex}** 爻）` : ''}

---

### ${p.symbol} 本卦全景：【${p.nameZh}】 ${p.symbol}
本卦得**【${p.nameZh}】**（下${p.lowerTrigram}上${p.upperTrigram}）。
> 卦辞：*“${p.judgmentZh}”*
大象传云：*“${p.imageZh}”*

---

### 🔍 纳甲六爻全图谱
${n ? n.lines.map(l => `- **${l.lineNameZh}**【${l.sixBeast}】 ${l.relative}${l.branch}${l.element} （${l.isYang ? '阳 ⚊' : '阴 ⚋'}）${l.isShi ? ' 【世】' : ''}${l.isYing ? ' 【应】' : ''}${l.isChanging ? ` ⚡ (动爻○ -> 化出 ${l.transformed?.relative}${l.transformed?.branch}${l.transformed?.element})` : ''}`).join('\n') : reading.lines.map(l => `- 第 ${l.lineIndex} 爻：${l.isYang ? '阳 ⚊' : '阴 ⚋'}${l.isChanging ? ' ⚡' : ''}`).join('\n')}

${t ? `---

### ⚡ 变卦走向：【${t.nameZh}】 ${t.symbol}
动爻引动气场流转，变卦显化为**【${t.nameZh}】 ${t.symbol}**（下${t.lowerTrigram}上${t.upperTrigram}）。
> 变卦卦辞：*“${t.judgmentZh}”*
这预示着经过初期的磨合与动荡后，事情将朝着${t.nameZh}所示的方向演进。` : '六爻安静，纯守本卦，宜稳扎稳打。'}

---

### 🧭 破局行动指南
- 💡 **宜（Do）**：${p.careerAdviceZh} 保持诚笃守正的心态，凡事提前谋篇布局。
- ⚠️ **忌（Don't）**：切忌急功近利、在情绪未定之时强行推进行动。

---

### ✨ 易道天心箴言
> *大象传云：“${p.imageZh}”*`;
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
  const fullText = generateLocalLiuYaoReport(req);
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
