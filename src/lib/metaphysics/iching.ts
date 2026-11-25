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
export type CoinCode = 6 | 7 | 8 | 9;
export type LineCodeInput = CoinCode | '6' | '7' | '8' | '9' | '0' | '1';

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
 * 根据单爻代码（6/7/8/9，或 URL 兼容的 0/1）构建标准 CoinTossLine。
 * 非法行号或非法代码直接抛错，不静默纠偏。
 */
export function createCoinTossLine(lineIndex: number, code: LineCodeInput): CoinTossLine {
  if (!Number.isInteger(lineIndex) || lineIndex < 1 || lineIndex > 6) {
    throw new Error(`爻位序号无效：${lineIndex}（仅允许 1-6）`);
  }

  const key = String(code);
  if (key === '6') {
    return {
      lineIndex,
      coins: [2, 2, 2],
      sum: 6,
      isYang: false,
      isChanging: true,
      changedYang: true
    };
  }
  if (key === '9') {
    return {
      lineIndex,
      coins: [3, 3, 3],
      sum: 9,
      isYang: true,
      isChanging: true,
      changedYang: false
    };
  }
  if (key === '8' || key === '0') {
    return {
      lineIndex,
      coins: [3, 3, 2],
      sum: 8,
      isYang: false,
      isChanging: false,
      changedYang: false
    };
  }
  if (key === '7' || key === '1') {
    return {
      lineIndex,
      coins: [3, 2, 2],
      sum: 7,
      isYang: true,
      isChanging: false,
      changedYang: true
    };
  }

  throw new Error(`无效爻值：${String(code)}（仅允许 6/7/8/9）`);
}

/**
 * 由自初爻至上爻的 6 个代码构建 CoinTossLine[]。
 * 默认仅允许 6/7/8/9；传入 allowBinary: true 时兼容纯 0/1 编码（不可混用）。
 */
export function buildCoinTossLinesFromCodes(
  codes: ReadonlyArray<LineCodeInput>,
  options?: { allowBinary?: boolean }
): CoinTossLine[] {
  if (!Array.isArray(codes) || codes.length !== 6) {
    throw new Error(`需提供自初爻至上爻共 6 个爻数（当前 ${Array.isArray(codes) ? codes.length : 0} 个）`);
  }

  const allowBinary = options?.allowBinary ?? false;
  const tokens = codes.map((c) => String(c).trim());

  const allSixToNine = tokens.every((t) => /^[6789]$/.test(t));
  const allZeroOne = tokens.every((t) => /^[01]$/.test(t));

  if (!allSixToNine && !(allowBinary && allZeroOne)) {
    throw new Error(
      allowBinary
        ? '六爻编码必须为 6 位纯 6/7/8/9 或纯 0/1，不可混用或包含其他字符'
        : '手录六爻仅允许自初爻至上爻输入 6 个 6/7/8/9 数字'
    );
  }

  return tokens.map((tok, i) => createCoinTossLine(i + 1, tok as LineCodeInput));
}

/**
 * 解析字符串形式的六爻输入（支持连续 6 位如 "978678" / "101011"，或空格/逗号分隔如 "9,7,8,6,7,8"）。
 * 绝不剔除非法字符后强行凑满 6 位；任何非法字符或位数不符直接抛错。
 */
export function parseCoinTossLinesInput(
  raw: string,
  options?: { allowBinary?: boolean }
): CoinTossLine[] {
  if (typeof raw !== 'string') {
    throw new Error('六爻输入不能为空');
  }
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error('请输入自初爻至上爻共 6 个爻数');
  }

  const hasSeparator = /[\s,，、|-]/.test(trimmed);
  const tokens = hasSeparator ? trimmed.split(/[\s,，、|-]+/) : trimmed.split('');

  return buildCoinTossLinesFromCodes(tokens as LineCodeInput[], options);
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
  if (!Array.isArray(lines) || lines.length !== 6) {
    throw new Error(`六爻数量错误：${Array.isArray(lines) ? lines.length : 0}（必须为 6 爻）`);
  }

  const sorted = [...lines].sort((a, b) => a.lineIndex - b.lineIndex);
  for (let i = 0; i < 6; i++) {
    const line = sorted[i];
    if (!line || line.lineIndex !== i + 1) {
      throw new Error(`六爻序号不完整或重复：期望第 ${i + 1} 爻`);
    }
    if (line.sum !== 6 && line.sum !== 7 && line.sum !== 8 && line.sum !== 9) {
      throw new Error(`第 ${i + 1} 爻数值无效：${line.sum}（仅允许 6/7/8/9）`);
    }
    const expectedYang = line.sum === 7 || line.sum === 9;
    const expectedChanging = line.sum === 6 || line.sum === 9;
    const expectedChangedYang = line.sum === 6 ? true : line.sum === 9 ? false : expectedYang;
    if (
      line.isYang !== expectedYang ||
      line.isChanging !== expectedChanging ||
      line.changedYang !== expectedChangedYang
    ) {
      throw new Error(`第 ${i + 1} 爻阴阳动静标记与爻值 ${line.sum} 不一致`);
    }
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
    const line = createCoinTossLine(i, sum as CoinCode);
    lines.push({ ...line, coins });
  }

  return buildReadingFromLines(lines);
}
