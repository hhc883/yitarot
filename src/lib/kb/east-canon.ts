export type EastCanonPrefix = 'BZ' | 'MH' | 'QM' | 'LR' | 'ZW';

export interface EastCanonEntry {
  id: string;
  source: { book: string; chapter: string };
  /** 关键词匹配（只要盘面摘要或问题中出现任意关键词即命中） */
  keywords: string[];
  /** 是否属于通用总纲/原则条目（当特定命中不足时兜底补足） */
  isGeneral?: boolean;
  text: string;
  timing?: string;
  credibility: 1 | 2 | 3 | 4 | 5;
}

export interface EastCanonHit {
  ref: string;
  entry: EastCanonEntry;
  score: number;
  matchedKeywords: string[];
}

export interface EastCanonBundle {
  hits: EastCanonHit[];
  byRef: Map<string, EastCanonEntry>;
  block: string;
}

export const EAST_REFERENCE_RULES_ZH = `【引用铁律】
1. 每条核心断语后必须紧跟引用编号，形如 [BZ-01] / [MH-01] / [QM-01] / [LR-01] / [ZW-01]；编号只能取自下方【知识库】清单，不得自造、不得改写。
2. 【知识库】未载的典籍条文不得编造原文或古人原话，须严格区分「盘面实况推演」与「典籍条文依据」。
3. 严禁使用「顺其自然」「保持平和」「注意沟通」「静待时机」「因人而异」「量力而行」等泛泛心理安慰套话。
4. 盘面数据（干支、星门、神将、宫位、四化）必须逐字忠实于传入的【排盘数据】，不得篡改。`;

export const EAST_REFERENCE_RULES_EN = `[Reference Rules]
1. Every core judgment must be followed immediately by a citation tag (e.g. [BZ-01], [MH-01], [QM-01], [LR-01], [ZW-01]) strictly drawn from the [Knowledge Base] below; never invent or alter citation IDs.
2. Never fabricate classical quotes not listed in the [Knowledge Base].
3. Avoid vague psychological clichés; ground every conclusion in concrete chart factors and canonical rules.
4. Keep all chart symbols, stems, branches, stars, gates, and transformations faithful to the provided Chart Data.`;

export const EAST_OUTPUT_CONTRACT_ZH = `【输出契约】严格按下列五节 Markdown 输出：
## 一、核心定局
加粗给出明确总断倾向，并说明所据主象与核心格局，挂引用编号。
## 二、典籍依据
分条列出 3 至 6 条，格式：\`盘面条件 → 断语解析（[编号]）\`。
## 三、应期与动向
给出具体时间节点（岁运/流月/旬空出空/冲合填实等）及推演理法，挂引用编号。
## 四、风险信号
列出 1 至 2 条会使格局或判断转向的具体不利条件。
## 五、趋避策略
给出 2 至 3 条可执行的具体行动建议，格式 \`若〈条件〉，则〈应对〉\`。`;

export const EAST_OUTPUT_CONTRACT_EN = `[Output Contract] Strictly output the following five Markdown sections:
## 1. Core Verdict
State a clear overall judgment with primary chart factors and citation tag.
## 2. Canonical Evidence
List 3 to 6 items in the format: \`Chart condition -> Judgment ([ID])\`.
## 3. Timing & Trajectory
Provide concrete timing clues (decadal/annual cycles, void clearance, clash/combination) and deduction basis with citation.
## 4. Risk Signals
List 1 to 2 specific chart conditions that could reverse or weaken the outcome.
## 5. Actionable Strategy
Provide 2 to 3 concrete conditional recommendations: \`If <condition>, then <action>\`.`;

export function retrieveEastCanon(
  prefix: EastCanonPrefix,
  entries: EastCanonEntry[],
  contextText: string,
  maxHits = 8
): EastCanonBundle {
  const scored: Array<{ entry: EastCanonEntry; score: number; matchedKeywords: string[] }> = [];

  for (const entry of entries) {
    const matched = entry.keywords.filter((kw) => kw && contextText.includes(kw));
    if (matched.length > 0 || entry.isGeneral) {
      const score = matched.length * 10 + entry.credibility + (entry.isGeneral ? 1 : 0);
      scored.push({ entry, score, matchedKeywords: matched });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  const picked = scored.slice(0, maxHits);

  const hits: EastCanonHit[] = picked.map((item, idx) => ({
    ref: `${prefix}-${String(idx + 1).padStart(2, '0')}`,
    entry: item.entry,
    score: item.score,
    matchedKeywords: item.matchedKeywords,
  }));

  const byRef = new Map<string, EastCanonEntry>();
  const lines = hits.map((hit) => {
    byRef.set(hit.ref, hit.entry);
    const reason =
      hit.matchedKeywords.length > 0 ? `｜命中:${hit.matchedKeywords.slice(0, 3).join('、')}` : '';
    const timing = hit.entry.timing ? `【应期法：${hit.entry.timing}】` : '';
    return `[${hit.ref}]〔${hit.entry.source.book}·${hit.entry.source.chapter}${reason}〕${hit.entry.text}${timing}`;
  });

  const block = `<knowledge_base>\n${lines.join('\n')}\n</knowledge_base>`;
  return { hits, byRef, block };
}
