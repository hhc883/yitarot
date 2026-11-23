import type { IChingReading } from '@/lib/metaphysics/iching';
import type { KBEntry } from './types';

/**
 * 爻辞文本静态库（硬约束：不得凭记忆写爻辞，初始为空对象）
 * 结构：LINE_TEXTS[卦序 1-64][爻位 1-6] = "爻辞原文"
 */
export const LINE_TEXTS: Record<number, Record<number, string>> = {};

/**
 * 从盘面中直取标准经传文本（本卦卦辞、本卦大象、变卦卦辞、真实动爻爻辞）
 * canon 属于正统经传，必进检索，永不被预算淘汰
 */
export function getCanonEntries(reading: IChingReading): KBEntry[] {
  const entries: KBEntry[] = [];
  const primary = reading.primaryHexagram;

  // 1. 本卦卦辞
  if (primary.judgmentZh) {
    entries.push({
      id: `canon.hex.${primary.number}.judgment`,
      kind: 'canon',
      status: 'verified',
      source: { book: '易经', chapter: `${primary.nameZh}卦` },
      when: { hexagram: [primary.number] },
      text: `〔本卦卦辞·${primary.nameZh}〕${primary.judgmentZh}`,
      credibility: 5
    });
  }

  // 2. 本卦大象传
  if (primary.imageZh) {
    entries.push({
      id: `canon.hex.${primary.number}.image`,
      kind: 'canon',
      status: 'verified',
      source: { book: '易经·大象传', chapter: `${primary.nameZh}卦` },
      when: { hexagram: [primary.number] },
      text: `〔本卦大象·${primary.nameZh}〕${primary.imageZh}`,
      credibility: 5
    });
  }

  // 3. 变卦卦辞（如有变卦）
  if (reading.transformedHexagram && reading.transformedHexagram.judgmentZh) {
    const transformed = reading.transformedHexagram;
    entries.push({
      id: `canon.hex.${transformed.number}.judgment`,
      kind: 'canon',
      status: 'verified',
      source: { book: '易经', chapter: `${transformed.nameZh}卦` },
      when: { hexagram: [transformed.number] },
      text: `〔变卦卦辞·${transformed.nameZh}〕${transformed.judgmentZh}`,
      credibility: 5
    });
  }

  // 4. 动爻爻辞（仅当静态库存在权威文本时收录，无则跳过，绝不编造）
  for (const lineIndex of reading.changingLineIndices) {
    const lineText = LINE_TEXTS[primary.number]?.[lineIndex];
    if (lineText) {
      entries.push({
        id: `canon.line.${primary.number}.${lineIndex}`,
        kind: 'canon',
        status: 'verified',
        source: { book: '易经·爻辞', chapter: `${primary.nameZh}第${lineIndex}爻` },
        when: { hexagram: [primary.number], lineIndex: [lineIndex] },
        text: `〔动爻爻辞·${primary.nameZh}第${lineIndex}爻〕${lineText}`,
        credibility: 5
      });
    }
  }

  return entries;
}
