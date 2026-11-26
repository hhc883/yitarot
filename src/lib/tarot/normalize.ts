import { DrawnCard, TarotCardData, getCardById } from './deck';
import { TarotReader, getReaderById } from './readers';
import { TarotSpread, getSpreadById } from './spreads';

export const TAROT_LIMITS = {
  minCards: 1,
  maxCards: 10,
  maxQuestionChars: 1000,
  maxCategoryChars: 64,
  maxInitialInterpretationChars: 1500,
  maxHistoryTurns: 8,
  maxHistoryTurnChars: 800
} as const;

export class TarotValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TarotValidationError';
  }
}

export interface NormalizedTarotReadRequest {
  question: string;
  category: string;
  spread: TarotSpread;
  reader: TarotReader;
  drawnCards: DrawnCard[];
  lang: 'zh' | 'en';
  points_ref?: string;
}

export interface NormalizedTarotFollowUpRequest {
  question: string;
  category: string;
  spread?: TarotSpread;
  reader: TarotReader;
  drawnCards: DrawnCard[];
  initialInterpretation: string;
  followUpHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  followUpQuestion: string;
  lang: 'zh' | 'en';
}

export function normalizeLang(lang: unknown): 'zh' | 'en' {
  return lang === 'en' ? 'en' : 'zh';
}

function normalizeRequiredText(raw: unknown, field: string, maxLen: number): string {
  if (typeof raw !== 'string') {
    throw new TarotValidationError(`${field} must be a non-empty string`);
  }
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new TarotValidationError(`${field} cannot be empty`);
  }
  if (trimmed.length > maxLen) {
    throw new TarotValidationError(`${field} exceeds maximum length of ${maxLen}`);
  }
  return trimmed;
}

function normalizeOptionalText(raw: unknown, maxLen: number): string {
  if (typeof raw !== 'string') return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';
  return trimmed.length > maxLen ? trimmed.slice(0, maxLen) : trimmed;
}

function normalizeCategory(raw: unknown): string {
  if (typeof raw !== 'string') return 'general';
  const trimmed = raw.trim();
  if (!trimmed) return 'general';
  return trimmed.slice(0, TAROT_LIMITS.maxCategoryChars);
}

export function normalizeReaderInput(rawReader: unknown, rawReaderId?: unknown): TarotReader {
  let id = '';
  if (typeof rawReaderId === 'string') {
    id = rawReaderId.trim();
  } else if (rawReader && typeof rawReader === 'object') {
    const candidate = (rawReader as { id?: unknown }).id;
    if (typeof candidate === 'string') {
      id = candidate.trim();
    }
  }
  return getReaderById(id);
}

export function normalizeDrawnCardsInput(
  rawCards: unknown
): Array<{ card: TarotCardData; isReversed: boolean }> {
  if (!Array.isArray(rawCards)) {
    throw new TarotValidationError('drawnCards must be an array');
  }
  if (rawCards.length < TAROT_LIMITS.minCards || rawCards.length > TAROT_LIMITS.maxCards) {
    throw new TarotValidationError(
      `drawnCards length must be between ${TAROT_LIMITS.minCards} and ${TAROT_LIMITS.maxCards}`
    );
  }

  const seenIds = new Set<string>();
  const normalized: Array<{ card: TarotCardData; isReversed: boolean }> = [];

  for (let i = 0; i < rawCards.length; i++) {
    const item = rawCards[i];
    if (!item || typeof item !== 'object') {
      throw new TarotValidationError(`drawnCards[${i}] must be an object`);
    }

    const record = item as { card?: unknown; cardId?: unknown; isReversed?: unknown };
    let cardId = '';
    if (typeof record.cardId === 'string') {
      cardId = record.cardId.trim();
    } else if (record.card && typeof record.card === 'object') {
      const nestedId = (record.card as { id?: unknown }).id;
      if (typeof nestedId === 'string') {
        cardId = nestedId.trim();
      }
    }

    if (!cardId) {
      throw new TarotValidationError(`drawnCards[${i}] is missing card.id`);
    }

    const canonical = getCardById(cardId);
    if (!canonical) {
      throw new TarotValidationError(`Unknown card id: ${cardId}`);
    }

    if (seenIds.has(canonical.id)) {
      throw new TarotValidationError(`Duplicate card id in drawnCards: ${canonical.id}`);
    }
    seenIds.add(canonical.id);

    if (typeof record.isReversed !== 'boolean') {
      throw new TarotValidationError(`drawnCards[${i}].isReversed must be a boolean`);
    }

    normalized.push({
      card: canonical,
      isReversed: record.isReversed
    });
  }

  return normalized;
}

export function mapCardsToAuthoritativePositions(
  cards: ReadonlyArray<{ card: TarotCardData; isReversed: boolean }>,
  spread: TarotSpread | undefined,
  lang: 'zh' | 'en'
): DrawnCard[] {
  const isEn = lang === 'en';
  return cards.map((c, idx) => {
    const pos = spread?.positions[idx];
    const defaultLabel = isEn ? `Position ${idx + 1}` : `第 ${idx + 1} 张牌`;
    const positionName = pos
      ? isEn
        ? pos.enName || pos.name
        : pos.name
      : defaultLabel;
    const positionDesc = pos ? (isEn ? '' : pos.description) : '';
    return {
      card: c.card,
      isReversed: c.isReversed,
      positionName,
      positionDesc
    };
  });
}

function extractSpreadId(body: Record<string, unknown>): string {
  if (typeof body.spreadId === 'string') {
    return body.spreadId.trim();
  }
  if (body.spread && typeof body.spread === 'object') {
    const id = (body.spread as { id?: unknown }).id;
    if (typeof id === 'string') {
      return id.trim();
    }
  }
  return '';
}

function sanitizeFollowUpHistory(
  raw: unknown
): Array<{ role: 'user' | 'assistant'; content: string }> {
  if (!Array.isArray(raw)) return [];
  const result: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const rec = item as { role?: unknown; content?: unknown };
    if (rec.role !== 'user' && rec.role !== 'assistant') continue;
    if (typeof rec.content !== 'string') continue;
    const trimmed = rec.content.trim();
    if (!trimmed) continue;
    result.push({
      role: rec.role,
      content:
        trimmed.length > TAROT_LIMITS.maxHistoryTurnChars
          ? trimmed.slice(0, TAROT_LIMITS.maxHistoryTurnChars) + '…'
          : trimmed
    });
  }
  return result.slice(-TAROT_LIMITS.maxHistoryTurns);
}

/**
 * 服务端规范化塔罗初始解牌请求：
 * - 问题非空且在长度限制内
 * - 牌阵 ID 必须存在于注册表且张数一致
 * - 卡牌通过 getCardById 查表重建，拒绝重复与非布尔正逆位
 * - 塔罗师通过 getReaderById 规范化
 */
export function normalizeTarotReadRequest(raw: unknown): NormalizedTarotReadRequest {
  if (!raw || typeof raw !== 'object') {
    throw new TarotValidationError('Request body must be a JSON object');
  }
  const body = raw as Record<string, unknown>;
  const lang = normalizeLang(body.lang);
  const question = normalizeRequiredText(body.question, 'question', TAROT_LIMITS.maxQuestionChars);
  const category = normalizeCategory(body.category);

  const spreadId = extractSpreadId(body);
  const spread = spreadId ? getSpreadById(spreadId) : undefined;
  if (!spread) {
    throw new TarotValidationError('Unknown or missing spread ID');
  }

  const cards = normalizeDrawnCardsInput(body.drawnCards);
  if (cards.length !== spread.cardCount) {
    throw new TarotValidationError(
      `Card count (${cards.length}) does not match spread "${spread.id}" (${spread.cardCount})`
    );
  }

  const reader = normalizeReaderInput(body.reader, body.readerId);
  const drawnCards = mapCardsToAuthoritativePositions(cards, spread, lang);
  const points_ref = typeof body.points_ref === 'string' ? body.points_ref : undefined;

  return {
    question,
    category,
    spread,
    reader,
    drawnCards,
    lang,
    points_ref
  };
}

/**
 * 服务端规范化塔罗追问请求：
 * - 兼容旧版存档会话（无 spreadId 时不按张数猜测牌阵，显式使用编号牌位）
 * - 忽略客户端传入的牌义、站位名、引用等字段，全部由服务端重建
 * - 对历史对话与初解文本做裁剪清洗，仅作不可信上下文
 */
export function normalizeTarotFollowUpRequest(raw: unknown): NormalizedTarotFollowUpRequest {
  if (!raw || typeof raw !== 'object') {
    throw new TarotValidationError('Request body must be a JSON object');
  }
  const body = raw as Record<string, unknown>;
  const lang = normalizeLang(body.lang);
  const followUpQuestion = normalizeRequiredText(
    body.followUpQuestion,
    'followUpQuestion',
    TAROT_LIMITS.maxQuestionChars
  );
  const question = normalizeOptionalText(body.question, TAROT_LIMITS.maxQuestionChars);
  const category = normalizeCategory(body.category);

  const cards = normalizeDrawnCardsInput(body.drawnCards);

  const spreadId = extractSpreadId(body);
  const candidateSpread = spreadId ? getSpreadById(spreadId) : undefined;
  const spread =
    candidateSpread && candidateSpread.cardCount === cards.length
      ? candidateSpread
      : undefined;

  const reader = normalizeReaderInput(body.reader, body.readerId);
  const drawnCards = mapCardsToAuthoritativePositions(cards, spread, lang);
  const initialInterpretation = normalizeOptionalText(
    body.initialInterpretation,
    TAROT_LIMITS.maxInitialInterpretationChars
  );
  const followUpHistory = sanitizeFollowUpHistory(body.followUpHistory);

  return {
    question,
    category,
    spread,
    reader,
    drawnCards,
    initialInterpretation,
    followUpHistory,
    followUpQuestion,
    lang
  };
}
