import type { IChingReading } from '@/lib/metaphysics/iching';
import type { KnowledgeBundle } from './types';

export const REFERENCE_RULES_ZH = `【引用铁律】
1. 每条断语后必须紧跟引用编号，形如 [KB-03]；编号只能取自下方【知识库】清单，不得自造、不得改写。
2. 【知识库】未载的内容一律写「典籍未载」，不得以通用命理常识、心理疏导话术或模糊判断填充。
3. 禁止自造爻辞、卦辞、大象传。清单未给出某爻爻辞时，只可引卦辞、大象与断法条目，不得写出「初九：×××」这类原文。
4. 卦名、卦符、卦辞只能逐字引用【卦象快照】。
5. 盘面数据不足以支撑的断语，直接删除；禁止「可能」「或许」「大概」这类折中表述。
6. 同一编号不得连续引用超过两次充作万能用据。`;

export const OUTPUT_CONTRACT_ZH = `【输出契约】严格按下列五节输出，不得增删标题、不得改标题文字：
## 一、结论
三选一加粗：**成** / **不成** / **成而有阻**。随后一句说明所据用神与关键条件，挂引用。
## 二、依据
分条列出，每条格式为：\`盘面条件 → 断语（[KB-xx]）\`。至少三条、最多六条，必须覆盖用神旺衰与动变。
## 三、应期
给出具体月/旬/日，并写明推法（逢值、逢冲、出空、填实、逢合、冲开墓库之一），挂引用。无法定时写「典籍未载定期之法」，不得写「近期」「适当时候」。
## 四、风险信号
一至两条会使结论翻盘的具体条件（如「若卦中再出酉金克用神」），不写泛泛警示。
## 五、若…则…
至少两条分条件判断，格式 \`若〈条件〉，则〈结论〉\`。

【禁用表述】顺其自然、保持平和、注意沟通、理性看待、顺应变化、调整心态、把握时机、宜守不宜攻、多留意、整体平稳、稳中求进、具体情况具体分析、因人而异、量力而行、放平心态、静待时机、顺势而为。`;

export const REFERENCE_RULES_EN = `[Reference Rules]
1. Every judgment must be followed immediately by a citation tag, e.g. [KB-03]; the ID must strictly be drawn from the [Knowledge Base] below, and must never be fabricated or altered.
2. For anything not documented in the [Knowledge Base], state "Not recorded in classical canons". Do not fill with generic metaphysical common sense or psychological counseling.
3. Never invent line texts, hexagram judgments, or Great Image commentaries. If a line text is not explicitly listed in the Knowledge Base, cite only hexagram judgments, Great Image, and canonical rules. Do not fabricate line texts like "Nine at the beginning: ...".
4. Hexagram names, symbols, and judgments must be quoted verbatim from the [Hexagram Snapshot].`;

export const OUTPUT_CONTRACT_EN = `[Output Contract] Strictly output the following five sections without modifying section headings:
## 1. Verdict
Boldly choose one: **Attainable** / **Unattainable** / **Attainable with obstacles**. Follow with a single sentence explaining the YongShen (Primary Focus) and core condition with citation.
## 2. Evidence
List 3 to 6 items in the exact format: \`Chart condition -> Judgment ([KB-xx])\`, covering YongShen prosperity/decline and transformations.
## 3. Timing
Provide specific month/ten-day/day with classical deduction method (meeting value, clash, emergence from void, filling void, combination, or tomb opening). If cannot be determined, state "Timing deduction not documented in classical canons". Never write "soon" or "at an appropriate time".
## 4. Risk Signals
1-2 specific chart conditions that would reverse the verdict (no generic warnings).
## 5. If… then…
At least 2 conditional judgments in the format: \`If <condition>, then <verdict>\`.`;

export interface BuildKnowledgeBlockOptions {
  maxChars?: number; // 默认 6000
  perEntryChars?: number; // 默认 400
}

/**
 * 组装注入模型的知识库代码块 <knowledge_base>...</knowledge_base>
 */
export function buildKnowledgeBlock(
  bundle: KnowledgeBundle,
  opts?: BuildKnowledgeBlockOptions
): { block: string; usedRefs: string[]; droppedRefs: string[] } {
  const maxChars = opts?.maxChars ?? 6000;
  const perEntryChars = opts?.perEntryChars ?? 400;

  interface FormattedHit {
    ref: string;
    kind: string;
    text: string;
  }

  const formatted: FormattedHit[] = bundle.hits.map(hit => {
    let line = '';
    if (hit.entry.kind === 'canon') {
      line = `[${hit.ref}]${hit.entry.text}`;
    } else {
      const src = `〔${hit.entry.source.book}·${hit.entry.source.chapter}${hit.reason ? '｜' + hit.reason : ''}〕`;
      let body = hit.entry.text;
      if (body.length > perEntryChars) {
        body = body.slice(0, perEntryChars) + '…';
      }
      if (hit.entry.status === 'draft') {
        body += '〔未审〕';
      }
      line = `[${hit.ref}]${src}${body}`;
      if (hit.entry.timing) {
        let timing = hit.entry.timing;
        if (timing.length > perEntryChars) {
          timing = timing.slice(0, perEntryChars) + '…';
        }
        line += `\n应期：${timing}`;
      }
    }
    return {
      ref: hit.ref,
      kind: hit.entry.kind,
      text: line
    };
  });

  const calcTotal = (items: FormattedHit[]) => {
    const inner = items.map(i => i.text).join('\n');
    return `<knowledge_base>\n${inner}\n</knowledge_base>`.length;
  };

  const active = [...formatted];
  const droppedRefs: string[] = [];

  while (active.length > 0 && calcTotal(active) > maxChars) {
    let dropIdx = -1;
    for (let i = active.length - 1; i >= 0; i--) {
      if (active[i].kind !== 'canon') {
        dropIdx = i;
        break;
      }
    }
    if (dropIdx === -1) {
      break;
    }
    const [dropped] = active.splice(dropIdx, 1);
    droppedRefs.push(dropped.ref);
  }

  if (droppedRefs.length > 0) {
    console.warn(`[context-builder] KB block exceeded budget (${maxChars}), dropped ${droppedRefs.length} rules:`, droppedRefs);
  }

  const innerText = active.map(i => i.text).join('\n');
  const block = `<knowledge_base>\n${innerText}\n</knowledge_base>`;
  const usedRefs = active.map(i => i.ref);

  return { block, usedRefs, droppedRefs };
}

/**
 * 抽取标准卦象快照文本（供 system 或 user prompt 引用）
 */
export function buildHexSnapshot(reading: IChingReading, lang?: 'zh' | 'en'): string {
  const isEn = lang === 'en';
  const p = reading.primaryHexagram;
  const t = reading.transformedHexagram;
  const n = reading.najia;

  if (isEn) {
    const lines = n
      ? [
          `- 【Divination Timing】: Year ${n.timeInfo.yearGanzhi}, Month ${n.timeInfo.monthGanzhi} (${n.timeInfo.monthZhi} Month Leader), Day ${n.timeInfo.dayGanzhi} (${n.timeInfo.dayZhi} Day Governor), Hour ${n.timeInfo.timeGanzhi}. Day Void (Xun Kong): ${n.timeInfo.xunKong}.`,
          `- 【Hexagram Palace】: ${n.palace} Palace (${n.palaceElement} Element) · ${n.generationName}. Shi (Self) on Line ${n.shiIndex}, Ying (Other) on Line ${n.yingIndex}.`,
          `- 【Six Lines Najia Structure (Bottom to Top)】:`,
          ...n.lines.map(l => `  * ${l.lineNameZh} [${l.sixBeast}] ${l.relative} ${l.branch}${l.element} ${l.isYang ? '⚊' : '⚋'} ${l.isShi ? '[Shi/Self]' : ''}${l.isYing ? '[Ying/Other]' : ''}${l.isChanging ? ` (Moving ⚡ -> Transforms into ${l.transformed?.relative} ${l.transformed?.branch}${l.transformed?.element})` : ''}`)
        ]
      : [];

    const hexInfo = [
      `- 【Primary Hexagram】: King Wen No. ${p.number} · ${p.nameZh} / ${p.nameEn} ${p.symbol} (lower ${p.lowerTrigramEn} / upper ${p.upperTrigramEn})`,
      `- Canonical judgment (Chinese, from table): ${p.judgmentZh}`,
      `- Canonical image (Chinese, from table): ${p.imageZh}`,
      t
        ? `- 【Transformed Hexagram】: King Wen No. ${t.number} · ${t.nameZh} / ${t.nameEn} ${t.symbol} (lower ${t.lowerTrigramEn} / upper ${t.upperTrigramEn})\n- Transformed judgment: ${t.judgmentZh}\n- Moving Line Indices: ${reading.changingLineIndices.map(i => `Line ${i}`).join(', ')}`
        : '- No changing lines; primary hexagram governs fully.'
    ];

    return `【Hexagram Snapshot】\n${[...lines, ...hexInfo].join('\n')}`;
  }

  const lines = n
    ? [
        `- 【起卦时空提纲】：${n.timeInfo.yearGanzhi}年 ${n.timeInfo.monthGanzhi}月 ${n.timeInfo.dayGanzhi}日 ${n.timeInfo.timeGanzhi}时（月建：${n.timeInfo.monthZhi}，日辰：${n.timeInfo.dayZhi}，旬空：${n.timeInfo.xunKong}）`,
        `- 【卦宫体用】：${n.palace}宫${n.palaceElement}（${n.generationName}），世在第 ${n.shiIndex} 爻，应在第 ${n.yingIndex} 爻`,
        `- 【纳甲六爻图谱（自初爻至上爻）】：`,
        ...n.lines.map(l => `  * ${l.lineNameZh} [${l.sixBeast}] ${l.relative}${l.branch}${l.element} ${l.isYang ? '⚊' : '⚋'} ${l.isShi ? '【世】' : ''}${l.isYing ? '【应】' : ''}${l.isChanging ? ` (动爻○ -> 化出 ${l.transformed?.relative}${l.transformed?.branch}${l.transformed?.element})` : ''}`)
      ]
    : [];

  const hexInfo = [
    `- 【本卦】：第 ${p.number} 卦 · ${p.nameZh} ${p.symbol}（下${p.lowerTrigram}上${p.upperTrigram}）`,
    `- 卦辞：${p.judgmentZh}`,
    `- 大象传：${p.imageZh}`,
    t
      ? `- 【变卦】：第 ${t.number} 卦 · ${t.nameZh} ${t.symbol}（下${t.lowerTrigram}上${t.upperTrigram}）\n- 变卦卦辞：${t.judgmentZh}\n- 变动爻位：${reading.changingLineIndices.map(i => `第 ${i} 爻`).join('、')}`
      : '- 无变爻，纯取本卦体用'
  ];

  return `【卦象快照】\n${[...lines, ...hexInfo].join('\n')}`;
}

export interface BuildLiuYaoSystemArgs {
  lang?: 'zh' | 'en';
  skillInstruction: string;
  block: string;
  yongShenNote: string;
  snapshot?: string;
  anchor?: string;
  extraPrompt?: string;
}

/**
 * 组装模型 System Instruction
 * 顺序固定（利于 KV Cache 命中）：
 * 人设心法 → 引用铁律 → 输出契约 → 卦象快照 → KB 块 → 用神判定 → [首解锚点] → [额外规则]
 */
export function buildLiuYaoSystem(args: BuildLiuYaoSystemArgs): string {
  const isEn = args.lang === 'en';
  const referenceRules = isEn ? REFERENCE_RULES_EN : REFERENCE_RULES_ZH;
  const outputContract = isEn ? OUTPUT_CONTRACT_EN : OUTPUT_CONTRACT_ZH;

  const parts = [
    args.skillInstruction,
    referenceRules,
    outputContract,
    args.snapshot,
    args.block,
    args.yongShenNote,
    args.anchor
      ? isEn
        ? `[First Reading Anchor (Immutable)]\n${args.anchor}`
        : `【首解结论·锚点（不得推翻）】\n${args.anchor}`
      : undefined,
    args.extraPrompt
  ];

  return parts.filter(Boolean).join('\n\n');
}
