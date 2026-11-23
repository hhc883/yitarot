import { CEZI_RULES, type CeziRuleEntry } from './rules';
import { CEZI_CASES, type CeziCaseEntry } from './cases';
import {
  RADICAL_IMAGERY_MAP,
  CHARACTER_BODY_ANATOMY
} from './concepts';

export * from './rules';
export * from './cases';
export * from './concepts';

/** 根据 ID 检索断法通则 */
export function getCeziRuleById(id: string): CeziRuleEntry | undefined {
  return CEZI_RULES.find(r => r.id === id);
}

/** 根据汉字在程省 35 个经典实战案例中检索历史占验 */
export function findCeziCasesByChar(char: string): CeziCaseEntry[] {
  if (!char) return [];
  const c = char.trim();
  return CEZI_CASES.filter(
    k => k.character === c || k.title.includes(c) || k.timeAndData.includes(`“${c}”`)
  );
}

/** 根据问事门类检索相关测字通则 */
export function findCeziRulesByTopic(topic: string): CeziRuleEntry[] {
  if (!topic) return [];
  return CEZI_RULES.filter(
    r => r.topic.includes(topic) || r.title.includes(topic) || r.text.includes(topic)
  );
}

/**
 * 结构化析字拆解引擎（全息汉字剖析）
 */
export function analyzeCharacterDeconstruction(char: string) {
  const c = char.trim().charAt(0);
  const matchedCases = findCeziCasesByChar(c);

  // 检查偏旁部首
  let detectedRadical: string | null = null;
  for (const [key, item] of Object.entries(RADICAL_IMAGERY_MAP)) {
    if (
      item.auspiciousItems.some(i => i.char === c) ||
      item.inauspiciousItems.some(i => i.char === c)
    ) {
      detectedRadical = key;
      break;
    }
  }

  return {
    char: c,
    matchedCases,
    detectedRadical: detectedRadical ? RADICAL_IMAGERY_MAP[detectedRadical] : null,
    anatomy: CHARACTER_BODY_ANATOMY
  };
}

/**
 * 组装测字全息象数推演快照（供 AI System Instruction 或前端卡片呈现）
 */
export function buildCeziInsightSnapshot(char: string, question?: string): string {
  const c = char.trim().charAt(0);
  if (!c) return '';

  const parts: string[] = [];
  const matchedCases = findCeziCasesByChar(c);

  if (matchedCases.length > 0) {
    const caseItem = matchedCases[0];
    parts.push(`- 【程省先贤经典卦案·${c}字占验】（${caseItem.title}）：\n  * 占问情境：${caseItem.timeAndData}，${caseItem.query}\n  * 析字机括：${caseItem.analysis}\n  * 最终应验：${caseItem.result}`);
  }

  // 偏旁五行取格检索
  for (const item of Object.values(RADICAL_IMAGERY_MAP)) {
    const aus = item.auspiciousItems.find(i => i.char === c);
    const inaus = item.inauspiciousItems.find(i => i.char === c);
    if (aus) {
      parts.push(`- 【部首全息吉格·${item.name}】：字属「${c}」，${aus.meaning}。（${item.overview}）`);
      break;
    } else if (inaus) {
      parts.push(`- 【部首全息凶格·${item.name}】：字属「${c}」，${inaus.meaning}。（${item.overview}）`);
      break;
    }
  }

  // 推荐核心法则
  if (parts.length === 0) {
    parts.push(`- 【相字至理】：以字象人，头正心公，足实履安；若遇装头、接脚、穿心、包笼之象，当察其虚实偏正。`);
  }

  if (question) {
    const relevantRules = findCeziRulesByTopic(question).slice(0, 2);
    for (const r of relevantRules) {
      parts.push(`- 【${r.title}】（${r.topic}）：${r.text}（应期：${r.timing}）`);
    }
  }

  return `【测字秘牒·汉字全息象数指归（清·程省）】\n${parts.join('\n')}`;
}
