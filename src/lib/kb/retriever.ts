import type { IChingReading } from '@/lib/metaphysics/iching';
import type { KBEntry, KnowledgeBundle, KnowledgeHit, ConditionKey } from './types';
import { CONDITION_LABEL } from './types';
import { deriveChartFacts, resolveYongShen } from './pan';
import { getCanonEntries } from './canon';
import { RULES_DB } from './rules';

export interface RetrieveOptions {
  question: string;
  reading: IChingReading;
  lang?: 'zh' | 'en';
  maxRules?: number; // 默认 8
  maxCases?: number; // 默认 3
}

interface ScoredRule {
  entry: KBEntry;
  score: number;
  reason: string;
}

/**
 * 三路检索：
 * 1. canon 直取（易经经传原文，必进，永不淘汰）
 * 2. rules 条件匹配（增删卜易断法，条件打分取 top maxRules）
 * 3. cases 案例库（本期为空，保留调用位）
 *
 * 排序与编号严格确定，保证模型引用稳定可重放。
 */
export function retrieveKnowledge(input: RetrieveOptions): KnowledgeBundle {
  const maxRules = input.maxRules ?? 8;
  const isEn = input.lang === 'en';

  // 1. 推演盘面事实与用神
  const facts = deriveChartFacts(input.reading);
  const yongShen = resolveYongShen(input.question, { facts });

  // 2. 取 canon（易经经传）
  const canonEntries = getCanonEntries(input.reading);

  // 3. rules 匹配与打分（英文模式跳过中文 rules）
  const candidateRules: ScoredRule[] = [];

  if (!isEn) {
    for (const rule of RULES_DB) {
      let score = 0;
      let categoryHit = false;
      const matchedConds: ConditionKey[] = [];
      const matchedRelatives: string[] = [];

      // A. 用神匹配
      const rRel = rule.when.relative ?? [];
      const primaryMatched = rRel.some(rel => yongShen.primary.includes(rel));
      const secondaryMatched = rRel.some(rel => yongShen.secondary.includes(rel));
      if (primaryMatched) {
        score += 5;
        categoryHit = true;
        matchedRelatives.push(...rRel.filter(rel => yongShen.primary.includes(rel)));
      } else if (secondaryMatched) {
        score += 2;
        categoryHit = true;
        matchedRelatives.push(...rRel.filter(rel => yongShen.secondary.includes(rel)));
      }

      // B. 占问主题匹配
      const rTopic = rule.when.topic ?? [];
      if (rTopic.includes(yongShen.topic)) {
        score += 3;
        categoryHit = true;
      }

      // C. 盘面条件匹配
      const rConds = rule.when.conditions ?? [];
      for (const cond of rConds) {
        if (facts.conditions.has(cond)) {
          score += 3;
          matchedConds.push(cond);
          categoryHit = true;
        }
      }
      if (matchedConds.length >= 2) {
        score += 2; // 命中 ≥2 个条件加 2 分
      }

      // D. 卦象匹配
      const rHex = rule.when.hexagram ?? [];
      if (rHex.includes(input.reading.primaryHexagram.number)) {
        score += 4;
        categoryHit = true;
      }
      if (input.reading.transformedHexagram && rHex.includes(input.reading.transformedHexagram.number)) {
        score += 2;
        categoryHit = true;
      }

      // E. 过滤规则：relative/conditions/topic/hexagram 至少命中一类才入候选
      if (!categoryHit) {
        continue;
      }

      // F. 动爻位匹配
      const rLines = rule.when.lineIndex ?? [];
      if (rLines.some(idx => input.reading.changingLineIndices.includes(idx))) {
        score += 2;
      }

      // G. 条目状态
      if (rule.status === 'verified') {
        score += 1;
      }

      // H. 权威度加分
      score += 0.5 * (rule.credibility ?? 5);

      // 组装 reason 说明
      const reasonParts: string[] = [];
      if (matchedRelatives.length > 0) {
        reasonParts.push(`用神${matchedRelatives.join('/')}`);
      }
      if (matchedConds.length > 0) {
        reasonParts.push(matchedConds.map(c => CONDITION_LABEL[c] || c).join('+'));
      }
      if (rTopic.includes(yongShen.topic)) {
        reasonParts.push(`主题${yongShen.topic}`);
      }

      const reason = reasonParts.join(' · ') || rule.source.chapter;

      candidateRules.push({
        entry: rule,
        score,
        reason
      });
    }

    // 平手排序：score desc → credibility desc → id asc（严格稳定）
    candidateRules.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const bCred = b.entry.credibility ?? 5;
      const aCred = a.entry.credibility ?? 5;
      if (bCred !== aCred) return bCred - aCred;
      return a.entry.id.localeCompare(b.entry.id);
    });
  }

  const selectedRules = candidateRules.slice(0, maxRules);

  // 4. cases 检索（本期为占位，后续可基于相似卦例扩展）
  const selectedCases: KBEntry[] = [];

  // 5. 组装 hits 并固定按顺序分配 KB-01..KB-xx
  const hits: KnowledgeHit[] = [];
  const byRef = new Map<string, KBEntry>();

  let refIndex = 1;

  // 1) canon
  for (const canon of canonEntries) {
    const ref = `KB-${String(refIndex++).padStart(2, '0')}`;
    let reason = '易经经传';
    if (canon.id.includes('.judgment')) {
      reason = canon.id.includes(String(input.reading.primaryHexagram.number)) ? '本卦卦辞' : '变卦卦辞';
    } else if (canon.id.includes('.image')) {
      reason = '本卦大象';
    } else if (canon.id.includes('.line.')) {
      reason = '动爻爻辞';
    }

    const hit: KnowledgeHit = {
      ref,
      entry: canon,
      score: 100, // canon 必进最高优先级
      reason
    };
    hits.push(hit);
    byRef.set(ref, canon);
  }

  // 2) rules
  for (const item of selectedRules) {
    const ref = `KB-${String(refIndex++).padStart(2, '0')}`;
    const hit: KnowledgeHit = {
      ref,
      entry: item.entry,
      score: item.score,
      reason: item.reason
    };
    hits.push(hit);
    byRef.set(ref, item.entry);
  }

  // 3) cases
  for (const caseEntry of selectedCases) {
    const ref = `KB-${String(refIndex++).padStart(2, '0')}`;
    const hit: KnowledgeHit = {
      ref,
      entry: caseEntry,
      score: 50,
      reason: '实战案例'
    };
    hits.push(hit);
    byRef.set(ref, caseEntry);
  }

  return {
    hits,
    byRef,
    yongShen,
    topic: yongShen.topic,
    facts
  };
}
