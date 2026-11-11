/** 每次测算消耗的积分 */
export const READING_COST = 10;

/** 允许的测算类型（写入 readings.type） */
export const READING_TYPES = ['tarot', 'bazi', 'liuyao'] as const;
export type ReadingType = (typeof READING_TYPES)[number];

export function isReadingType(value: unknown): value is ReadingType {
  return typeof value === 'string' && (READING_TYPES as readonly string[]).includes(value);
}
