import { MEIHUA_RULES, type MeihuaRuleEntry } from './rules';
import { MEIHUA_CASES, type MeihuaCaseEntry } from './cases';
import { BAGUA_WANWU_IMAGERY, CHAR_DIVINATION_GUIDE, OUTER_RESPONSE_GUIDE, type TrigramWanwuDetail } from './concepts';
import { retrieveEastCanon, type EastCanonBundle, type EastCanonEntry } from '../east-canon';

export {
  MEIHUA_RULES,
  MEIHUA_CASES,
  BAGUA_WANWU_IMAGERY,
  CHAR_DIVINATION_GUIDE,
  OUTER_RESPONSE_GUIDE,
  type MeihuaRuleEntry,
  type MeihuaCaseEntry,
  type TrigramWanwuDetail
};

/**
 * 依据排卦所得本卦与变卦，检索是否有邵康节经典对应卦例
 */
export function findMatchingMeihuaCase(
  primaryHex: number,
  transformedHex?: number
): MeihuaCaseEntry | undefined {
  return MEIHUA_CASES.find(c => {
    if (c.pan.primaryHex === primaryHex) {
      if (!transformedHex || !c.pan.transformedHex) return true;
      return c.pan.transformedHex === transformedHex;
    }
    return false;
  });
}

/**
 * 提取指定八卦的万物类象
 */
export function getTrigramImagery(trigramName: string): TrigramWanwuDetail | undefined {
  const key = trigramName.charAt(0);
  return BAGUA_WANWU_IMAGERY[key];
}

export function retrieveMeihuaKnowledge(chartSummary: string, question?: string): EastCanonBundle {
  const entries: EastCanonEntry[] = MEIHUA_RULES.filter((r) => r.text || r.condition).map((r) => ({
    id: r.id,
    source: { book: '梅花易数', chapter: r.title },
    keywords: [r.title, r.topic, '体卦', '用卦', '互卦', '变卦', '动爻'],
    isGeneral: r.topic.includes('通论'),
    text: r.text || r.condition,
    timing: r.timing,
    credibility: r.credibility,
  }));
  return retrieveEastCanon('MH', entries, `${chartSummary} ${question || ''}`, 6);
}
