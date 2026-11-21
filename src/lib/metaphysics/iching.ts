import {
  KING_WEN_64,
  TRIGRAMS_BY_BITS,
  buildHexagramSeed,
  lookupEntryByBinary,
  type HexagramSeed
} from './hexagrams64';
import {
  buildNajiaChart,
  type FullNajiaChart,
  type LiuYaoTimeInfo
} from './najia';

export type HexagramData = HexagramSeed;

export interface CoinTossLine {
  lineIndex: number; // 1 to 6 (1 is bottom)
  coins: [number, number, number]; // e.g. [2, 3, 3]
  sum: number; // 6, 7, 8, 9
  isYang: boolean; // primary line: 7, 9 are Yang (true), 6, 8 are Yin (false)
  isChanging: boolean; // 6 or 9
  changedYang: boolean; // after change: 6 becomes Yang, 9 becomes Yin
}

export interface IChingReading {
  lines: CoinTossLine[];
  primaryHexagram: HexagramData;
  transformedHexagram: HexagramData | null;
  changingLineIndices: number[];
  najia?: FullNajiaChart;
}

/**
 * 六十四卦标准库（文王序）。卦名、卦符、卦辞、大象、上下卦全部来自
 * hexagrams64.ts 的静态查表，不含任何运行时推演或兜底「合成卦」。
 */
export const HEXAGRAMS_DB: Record<number, HexagramData> = Object.fromEntries(
  KING_WEN_64.map((entry) => [entry.number, buildHexagramSeed(entry)])
);

/**
 * 6 位爻线（自初爻至上爻，阳=1、阴=0）→ 下卦 / 上卦 → 64 卦。
 * 查不到或编码非法直接抛错，绝不返回编造的卦名。
 */
export function getHexagramByBinary(binary: string): HexagramData {
  if (!/^[01]{6}$/.test(binary)) {
    throw new Error(`非法六爻编码：${binary}`);
  }
  const lower = TRIGRAMS_BY_BITS[binary.slice(0, 3)];
  const upper = TRIGRAMS_BY_BITS[binary.slice(3, 6)];
  if (!lower || !upper) {
    throw new Error(`八卦查表失败：${binary}`);
  }
  return buildHexagramSeed(lookupEntryByBinary(binary));
}

/** 按六爻阴阳数组（初爻→上爻）查卦 */
export function lookupHexagramByLines(isYang: boolean[]): HexagramData {
  if (isYang.length !== 6) {
    throw new Error(`六爻数量错误：${isYang.length}`);
  }
  return getHexagramByBinary(isYang.map((yang) => (yang ? '1' : '0')).join(''));
}

/** 由爻线构造完整卦象：本卦、变卦、动爻与京房纳甲全部由查表决定 */
export function buildReadingFromLines(lines: CoinTossLine[], timeInfo?: LiuYaoTimeInfo): IChingReading {
  const sorted = [...lines].sort((a, b) => a.lineIndex - b.lineIndex).slice(0, 6);
  if (sorted.length !== 6) {
    throw new Error(`六爻数量错误：${sorted.length}`);
  }
  const changingLineIndices = sorted.filter((l) => l.isChanging).map((l) => l.lineIndex);
  const primaryHex = lookupHexagramByLines(sorted.map((l) => l.isYang));
  const transformedHex = changingLineIndices.length
    ? lookupHexagramByLines(sorted.map((l) => l.changedYang))
    : null;

  const primaryBinary = sorted.map((l) => (l.isYang ? '1' : '0')).join('');
  const transformedBinary = transformedHex
    ? sorted.map((l) => (l.changedYang ? '1' : '0')).join('')
    : null;

  const najia = buildNajiaChart(primaryBinary, transformedBinary, sorted, timeInfo);

  return {
    lines: sorted,
    primaryHexagram: primaryHex,
    transformedHexagram: transformedHex,
    changingLineIndices,
    najia
  };
}

/**
 * 以爻线查表结果为准：任何外部（客户端 / AI / 旧数据）传入的
 * 卦名、卦符、卦辞一律丢弃重建，避免「乾健生生卦」之类的伪卦名混入。
 */
export function normalizeIChingReading(reading: IChingReading): IChingReading {
  return buildReadingFromLines(reading.lines, reading.najia?.timeInfo);
}

/**
 * Simulates throwing 3 coins (2 for Yin, 3 for Yang)
 */
export function tossCoins(): CoinTossLine["coins"] {
  const flip = () => (Math.random() >= 0.5 ? 3 : 2);
  return [flip(), flip(), flip()];
}

/**
 * Casts a full 6-line I Ching reading
 */
export function castIChingReading(): IChingReading {
  const lines: CoinTossLine[] = [];

  for (let i = 1; i <= 6; i++) {
    const coins = tossCoins();
    const sum = coins[0] + coins[1] + coins[2];
    const isYang = sum === 7 || sum === 9;
    const isChanging = sum === 6 || sum === 9;
    const changedYang = sum === 6 ? true : sum === 9 ? false : isYang;

    lines.push({
      lineIndex: i,
      coins,
      sum,
      isYang,
      isChanging,
      changedYang
    });
  }

  return buildReadingFromLines(lines);
}
