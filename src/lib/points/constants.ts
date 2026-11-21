/** 每次测算消耗的积分 */
export const READING_COST = 10;
/** 每次对卦象追问消耗的积分 */
export const FOLLOWUP_COST = 2;

/** 允许的测算类型（写入 readings.type） */
export const READING_TYPES = ['tarot', 'bazi', 'liuyao', 'liuyao_followup'] as const;
export type ReadingType = (typeof READING_TYPES)[number];

export function getCostForType(type: ReadingType): number {
  return type === 'liuyao_followup' ? FOLLOWUP_COST : READING_COST;
}

export function isReadingType(value: unknown): value is ReadingType {
  return typeof value === 'string' && (READING_TYPES as readonly string[]).includes(value);
}
