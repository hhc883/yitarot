import type { IChingReading } from '@/lib/metaphysics/iching';
import { KING_WEN_64 } from '@/lib/metaphysics/hexagrams64';
import { LINE_TEXTS } from './canon';

export interface GuardIssue {
  type: 'unknown_citation' | 'no_citation' | 'banned_phrase' | 'unknown_hexagram' | 'fabricated_line_text';
  detail: string;
}

export interface AuditResult {
  ok: boolean;
  issues: GuardIssue[];
  metrics: {
    citations: number;
    bannedHits: number;
  };
}

export const BANNED_PHRASES = [
  '顺其自然',
  '保持平和',
  '注意沟通',
  '理性看待',
  '顺应变化',
  '调整心态',
  '把握时机',
  '宜守不宜攻',
  '多留意',
  '整体平稳',
  '稳中求进',
  '具体情况具体分析',
  '因人而异',
  '量力而行',
  '放平心态',
  '静待时机',
  '顺势而为'
];

const VAGUE_WORDS_REGEX = /可能|也许|大概|某些|一定程度上/g;

// 标准卦名集合与白名单
const STANDARD_HEXAGRAM_NAMES = new Set<string>();
for (const entry of KING_WEN_64) {
  STANDARD_HEXAGRAM_NAMES.add(entry.nameZh);
  // 八纯卦如 "乾为天" 亦补充 "乾"
  if (entry.nameZh.includes('为')) {
    STANDARD_HEXAGRAM_NAMES.add(entry.nameZh.split('为')[0]);
  }
}

const HEX_NAME_WHITELIST = new Set<string>([
  '本卦',
  '变卦',
  '之卦',
  '互卦',
  '六冲',
  '六合',
  '游魂',
  '归魂',
  '八纯',
  '独发',
  '独静',
  '反吟',
  '伏吟',
  '卦'
]);

const LINE_POSITIONS: Record<string, number> = {
  初九: 1,
  初六: 1,
  九二: 2,
  六二: 2,
  九三: 3,
  六三: 3,
  九四: 4,
  六四: 4,
  九五: 5,
  六五: 5,
  上九: 6,
  上六: 6
};

/**
 * 审计六爻解卦 AI 输出报告
 * 验证引用合规性、禁用空话、标准卦名以及自造爻辞
 */
export function auditLiuYaoReport(
  text: string,
  ctx: {
    allowedRefs: string[];
    reading: IChingReading;
    lang?: 'zh' | 'en';
  }
): AuditResult {
  const issues: GuardIssue[] = [];
  const isEn = ctx.lang === 'en';
  const allowedSet = new Set(ctx.allowedRefs);

  // 1. 引用检测
  const citationRegex = /\[KB[-‐]?(\d{1,3})\]/gi;
  let citationsCount = 0;
  let match: RegExpExecArray | null;

  while ((match = citationRegex.exec(text)) !== null) {
    const rawRef = match[0];
    const num = parseInt(match[1], 10);
    const normalized = `KB-${String(num).padStart(2, '0')}`;

    if (!allowedSet.has(normalized)) {
      issues.push({
        type: 'unknown_citation',
        detail: `未知引用编号: ${rawRef} (规范化: ${normalized})`
      });
    } else {
      citationsCount++;
    }
  }

  // 2. 完全无引用检测（中文模式且正文足够长时）
  if (!isEn && text.length > 600 && ctx.allowedRefs.length > 0 && citationsCount === 0) {
    issues.push({
      type: 'no_citation',
      detail: `正文长度 ${text.length} 字且可用引用非空，但未见任何有效引用编号`
    });
  }

  // 3. 空话与模糊词检测
  let bannedHits = 0;
  for (const phrase of BANNED_PHRASES) {
    if (text.includes(phrase)) {
      bannedHits++;
      issues.push({
        type: 'banned_phrase',
        detail: `包含禁用空话表述「${phrase}」`
      });
    }
  }

  const vagueMatches = text.match(VAGUE_WORDS_REGEX);
  if (vagueMatches && vagueMatches.length >= 3) {
    bannedHits += vagueMatches.length;
    issues.push({
      type: 'banned_phrase',
      detail: `包含过多折中模糊词（出现 ${vagueMatches.length} 处: ${vagueMatches.slice(0, 5).join('、')}）`
    });
  }

  // 4. 非标准卦名检测
  // 匹配形如 "第 1 卦·乾为天" 或 "【坤为地卦】"
  const hexNumRegex = /第\s*\d+\s*卦\s*[·・]?\s*([\u4e00-\u9fa5]{2,4})/g;
  while ((match = hexNumRegex.exec(text)) !== null) {
    const name = match[1].replace(/卦$/, '').trim();
    if (!STANDARD_HEXAGRAM_NAMES.has(name) && !HEX_NAME_WHITELIST.has(name)) {
      issues.push({
        type: 'unknown_hexagram',
        detail: `非标准卦名「${name}」`
      });
    }
  }

  const hexBracketRegex = /【([^】]{2,4})卦】/g;
  while ((match = hexBracketRegex.exec(text)) !== null) {
    const name = match[1].trim();
    if (!STANDARD_HEXAGRAM_NAMES.has(name) && !HEX_NAME_WHITELIST.has(name)) {
      issues.push({
        type: 'unknown_hexagram',
        detail: `非标准卦名「${name}」`
      });
    }
  }

  // 5. 自造爻辞检测
  // 匹配形如 "初九：潜龙勿用" 或 "六二: 直方大"
  const lineQuoteRegex = /(初九|初六|九二|六二|九三|六三|九四|六四|九五|六五|上九|上六)[：:]\s*([^\n。]{2,40})/g;
  while ((match = lineQuoteRegex.exec(text)) !== null) {
    const lineTag = match[1];
    const quotedText = match[2].trim();
    const lineIdx = LINE_POSITIONS[lineTag];

    let foundInCanon = false;
    const priSeq = ctx.reading.primaryHexagram.number;
    const transSeq = ctx.reading.transformedHexagram?.number;

    if (lineIdx) {
      const priLineText = LINE_TEXTS[priSeq]?.[lineIdx];
      if (priLineText && priLineText.includes(quotedText)) {
        foundInCanon = true;
      }
      if (!foundInCanon && transSeq) {
        const transLineText = LINE_TEXTS[transSeq]?.[lineIdx];
        if (transLineText && transLineText.includes(quotedText)) {
          foundInCanon = true;
        }
      }
    }

    if (!foundInCanon) {
      issues.push({
        type: 'fabricated_line_text',
        detail: `疑似自造爻辞「${lineTag}：${quotedText}」`
      });
    }
  }

  return {
    ok: issues.length === 0,
    issues,
    metrics: {
      citations: citationsCount,
      bannedHits
    }
  };
}
