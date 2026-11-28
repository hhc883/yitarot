import { Solar } from 'lunar-typescript';

export type PalaceName = '乾' | '兑' | '离' | '震' | '巽' | '坎' | '艮' | '坤';
export type ElementName = '金' | '木' | '水' | '火' | '土';
export type SixRelativeName = '父母' | '兄弟' | '子孙' | '妻财' | '官鬼';
export type SixBeastName = '青龙' | '朱雀' | '勾陈' | '螣蛇' | '白虎' | '玄武';

export interface LiuYaoTimeInfo {
  solarDate: string; // "2026-11-21 21:30"
  lunarDate: string; // "丙午年十月十二"
  yearGanzhi: string; // "丙午"
  monthGanzhi: string; // "己亥"
  dayGanzhi: string; // "己亥"
  timeGanzhi: string; // "乙亥"
  monthZhi: string; // "亥" (月建)
  dayZhi: string; // "亥" (日辰)
  dayGan: string; // "己" (用于定六神)
  xunKong: string; // "辰巳" (空亡)
  /** 四柱纳音与旬空 */
  naYin?: { year: string; month: string; day: string; time: string };
  pillarKong?: { year: string; month: string; day: string; time: string };
}

export interface LineNajiaDetail {
  lineIndex: number; // 1 to 6 (1 = 初爻, 6 = 上爻)
  lineNameZh: string; // "初六", "九二", "九三", "九四", "九五", "上九"
  lineNameEn: string;
  isYang: boolean;
  isChanging: boolean;
  /** 浑天甲子纳干（如 庚、乙） */
  stem?: string;
  branch: string; // "子", "丑", "寅"...
  element: ElementName; // "水", "土", "木"...
  relative: SixRelativeName; // "父母", "兄弟", "子孙", "妻财", "官鬼"
  sixBeast: SixBeastName; // "青龙", "朱雀"...
  isShi: boolean; // 是否世爻
  isYing: boolean; // 是否应爻
  isKong?: boolean; // 是否空亡
  /** 伏神（全排本宫首卦，isMissing=true 为京房缺神） */
  fuShen?: {
    stem?: string;
    branch: string;
    element: ElementName;
    relative: SixRelativeName;
    isMissing?: boolean;
  };
  // 动爻化出之爻（仅在动爻存在时有值）
  transformed?: {
    isYang: boolean;
    stem?: string;
    branch: string;
    element: ElementName;
    relative: SixRelativeName;
  };
}

export interface TransformedLineDetail {
  lineIndex: number; // 1 to 6
  lineNameZh: string; // "初九", "六二"...
  lineNameEn: string;
  isYang: boolean;
  stem?: string;
  branch: string;
  element: ElementName;
  relative: SixRelativeName;
  isChanged: boolean; // 是否由动爻转化而来
}

export interface TransformedHexChart {
  palace: PalaceName;
  palaceElement: ElementName;
  generationName: string;
  hexTag?: '六合' | '六冲';
  lines: TransformedLineDetail[]; // 包含变卦全部 6 爻（动爻变后 + 静爻照搬）
}

export interface FullNajiaChart {
  timeInfo: LiuYaoTimeInfo;
  palace: PalaceName;
  palaceElement: ElementName;
  generationName: string; // "本宫卦(八纯)", "一世卦", "游魂卦"...
  hexTag?: '六合' | '六冲';
  shiIndex: number; // 1-6
  yingIndex: number; // 1-6
  /** 卦身地支 */
  guaShen?: string;
  /** 世身地支 */
  shiShenBranch?: string;
  /** 常用神煞（驿马、桃花、日禄、文昌、天喜、天医、丧门、吊客、病符、游都、哭神、天恩） */
  shenSha?: Record<string, string>;
  lines: LineNajiaDetail[]; // 1 to 6
  transformedChart: TransformedHexChart | null; // 完整变卦 6 爻排盘（无动爻时为 null）
}

// 八宫基础定义
interface PalaceDef {
  name: PalaceName;
  element: ElementName;
  triBits: string; // 3-bit binary
}

const PALACE_DEFS: PalaceDef[] = [
  { name: '乾', element: '金', triBits: '111' },
  { name: '兑', element: '金', triBits: '110' },
  { name: '离', element: '火', triBits: '101' },
  { name: '震', element: '木', triBits: '100' },
  { name: '巽', element: '木', triBits: '011' },
  { name: '坎', element: '水', triBits: '010' },
  { name: '艮', element: '土', triBits: '001' },
  { name: '坤', element: '土', triBits: '000' }
];

function flipBit(bits: string, index: number): string {
  const arr = bits.split('');
  arr[index] = arr[index] === '1' ? '0' : '1';
  return arr.join('');
}

// 生成京房八宫查表映射表
interface HexPalaceMeta {
  palace: PalaceName;
  palaceElement: ElementName;
  generationName: string;
  generation: number;
  shi: number;
  ying: number;
}

const HEX_PALACE_MAP = new Map<string, HexPalaceMeta>();

const GEN_NAMES = [
  '本宫卦(八纯)',
  '一世卦',
  '二世卦',
  '三世卦',
  '四世卦',
  '五世卦',
  '游魂卦',
  '归魂卦'
];
const SHI_LINES = [6, 1, 2, 3, 4, 5, 4, 3];
const YING_LINES = [3, 4, 5, 6, 1, 2, 1, 6];

for (const p of PALACE_DEFS) {
  let cur = p.triBits + p.triBits; // 6 bits: lower + upper
  const sequence: string[] = [cur];

  // 1世到5世：依次由初爻向上变
  for (let i = 0; i < 5; i++) {
    cur = flipBit(cur, i);
    sequence.push(cur);
  }
  // 游魂卦：第4爻往回变
  cur = flipBit(cur, 3);
  sequence.push(cur);
  // 归魂卦：下三爻（0, 1, 2）复原
  cur = flipBit(flipBit(flipBit(cur, 0), 1), 2);
  sequence.push(cur);

  for (let g = 0; g < 8; g++) {
    HEX_PALACE_MAP.set(sequence[g], {
      palace: p.name,
      palaceElement: p.element,
      generationName: GEN_NAMES[g],
      generation: g,
      shi: SHI_LINES[g],
      ying: YING_LINES[g]
    });
  }
}

// 地支五行映射
export const BRANCH_ELEMENT: Record<string, ElementName> = {
  子: '水', 丑: '土', 寅: '木', 卯: '木',
  辰: '土', 巳: '火', 午: '火', 未: '土',
  申: '金', 酉: '金', 戌: '土', 亥: '水'
};

// 八卦内外卦纳甲天干表（乾内甲外壬，坤内乙外癸，其余六卦内外同干）
const NAJIA_STEMS: Record<string, { inner: string; outer: string }> = {
  '111': { inner: '甲', outer: '壬' }, // 乾
  '000': { inner: '乙', outer: '癸' }, // 坤
  '100': { inner: '庚', outer: '庚' }, // 震
  '011': { inner: '辛', outer: '辛' }, // 巽
  '010': { inner: '戊', outer: '戊' }, // 坎
  '101': { inner: '己', outer: '己' }, // 离
  '001': { inner: '丙', outer: '丙' }, // 艮
  '110': { inner: '丁', outer: '丁' }, // 兑
};

// 八卦内外卦纳甲地支表（初爻至三爻为内，四爻至六爻为外）
const NAJIA_BRANCHES: Record<string, { inner: string[]; outer: string[] }> = {
  '111': { inner: ['子', '寅', '辰'], outer: ['午', '申', '戌'] }, // 乾
  '000': { inner: ['未', '巳', '卯'], outer: ['丑', '亥', '酉'] }, // 坤
  '100': { inner: ['子', '寅', '辰'], outer: ['午', '申', '戌'] }, // 震
  '011': { inner: ['丑', '亥', '酉'], outer: ['未', '巳', '卯'] }, // 巽
  '010': { inner: ['寅', '辰', '午'], outer: ['申', '戌', '子'] }, // 坎
  '101': { inner: ['卯', '丑', '亥'], outer: ['酉', '未', '巳'] }, // 离
  '001': { inner: ['辰', '午', '申'], outer: ['戌', '子', '寅'] }, // 艮
  '110': { inner: ['巳', '卯', '丑'], outer: ['亥', '酉', '未'] }  // 兑
};

// 计算六亲（生克关系）
function deriveSixRelative(palaceElement: ElementName, branchElement: ElementName): SixRelativeName {
  if (palaceElement === branchElement) return '兄弟';

  const generatingMap: Record<ElementName, ElementName> = {
    木: '火', 火: '土', 土: '金', 金: '水', 水: '木'
  };

  if (generatingMap[branchElement] === palaceElement) return '父母'; // 生我者为父母
  if (generatingMap[palaceElement] === branchElement) return '子孙'; // 我生者为子孙

  const overcomingMap: Record<ElementName, ElementName> = {
    木: '土', 土: '水', 水: '火', 火: '金', 金: '木'
  };

  if (overcomingMap[branchElement] === palaceElement) return '官鬼'; // 克我者为官鬼
  if (overcomingMap[palaceElement] === branchElement) return '妻财'; // 我克者为妻财

  return '兄弟';
}

// 计算六神
const SIX_BEASTS_CYCLE: SixBeastName[] = ['青龙', '朱雀', '勾陈', '螣蛇', '白虎', '玄武'];

function deriveSixBeasts(dayGan: string): SixBeastName[] {
  let startIndex = 0;
  if (dayGan === '甲' || dayGan === '乙') startIndex = 0; // 青龙
  else if (dayGan === '丙' || dayGan === '丁') startIndex = 1; // 朱雀
  else if (dayGan === '戊') startIndex = 2; // 勾陈
  else if (dayGan === '己') startIndex = 3; // 螣蛇
  else if (dayGan === '庚' || dayGan === '辛') startIndex = 4; // 白虎
  else if (dayGan === '壬' || dayGan === '癸') startIndex = 5; // 玄武

  const result: SixBeastName[] = [];
  for (let i = 0; i < 6; i++) {
    result.push(SIX_BEASTS_CYCLE[(startIndex + i) % 6]);
  }
  return result; // index 0 is 初爻, index 5 is 上爻
}

// 规范爻名生成（初九/初六、九二/六二、九三/六三...）
export function formatLineName(lineIndex: number, isYang: boolean): string {
  const digit = isYang ? '九' : '六';
  if (lineIndex === 1) return isYang ? '初九' : '初六';
  if (lineIndex === 6) return isYang ? '上九' : '上六';
  const posNames = ['', '', '二', '三', '四', '五'];
  return `${digit}${posNames[lineIndex]}`;
}

export function formatLineNameEn(lineIndex: number, isYang: boolean): string {
  const digit = isYang ? 'Nine' : 'Six';
  if (lineIndex === 1) return isYang ? 'Initial Nine' : 'Initial Six';
  if (lineIndex === 6) return isYang ? 'Top Nine' : 'Top Six';
  return `${digit} on Line ${lineIndex}`;
}

/**
 * 获取当前起卦的时空四柱干支与月建日辰旬空
 */
export function getCurrentLiuYaoTimeInfo(customDate?: Date): LiuYaoTimeInfo {
  const now = customDate || new Date();
  const solar = Solar.fromDate(now);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  const pad = (n: number) => String(n).padStart(2, '0');
  const solarDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const lunarDate = `${eightChar.getYear()}年 ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`;

  const dayGanzhi = eightChar.getDay();
  const dayGan = dayGanzhi.charAt(0);
  const dayZhi = dayGanzhi.charAt(1);
  const monthGanzhi = eightChar.getMonth();
  const monthZhi = monthGanzhi.charAt(1);

  return {
    solarDate,
    lunarDate,
    yearGanzhi: eightChar.getYear(),
    monthGanzhi,
    dayGanzhi,
    timeGanzhi: eightChar.getTime(),
    monthZhi,
    dayZhi,
    dayGan,
    xunKong: eightChar.getDayXunKong(),
    naYin: {
      year: eightChar.getYearNaYin(),
      month: eightChar.getMonthNaYin(),
      day: eightChar.getDayNaYin(),
      time: eightChar.getTimeNaYin(),
    },
    pillarKong: {
      year: eightChar.getYearXunKong(),
      month: eightChar.getMonthXunKong(),
      day: eightChar.getDayXunKong(),
      time: eightChar.getTimeXunKong(),
    },
  };
}

const LIU_HE_BINARIES = new Set(['000111', '111000', '110010', '010110', '101001', '001101', '000100', '100000']);
const LIU_CHONG_BINARIES = new Set(['111111', '000000', '100100', '011011', '010010', '101101', '001001', '110110', '100111', '111100']);
const BRANCHES_12 = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;

function getHexTag(binary: string): '六合' | '六冲' | undefined {
  if (LIU_HE_BINARIES.has(binary)) return '六合';
  if (LIU_CHONG_BINARIES.has(binary)) return '六冲';
  return undefined;
}

/** 卦身：阳世从子起，阴世从午起，数至世爻 */
function computeGuaShen(shiIndex: number, isShiYang: boolean): string {
  const startIdx = isShiYang ? 0 : 6; // 子=0, 午=6
  return BRANCHES_12[(startIdx + shiIndex - 1) % 12];
}

/** 世身：子午持世身居初、丑未身居二、寅申身居三、卯酉身居四、辰戌身居五、巳亥身居六 */
function computeShiShenBranch(shiBranch: string, primaryBranches: string[]): string {
  const posMap: Record<string, number> = {
    子: 0, 午: 0, 丑: 1, 未: 1, 寅: 2, 申: 2,
    卯: 3, 酉: 3, 辰: 4, 戌: 4, 巳: 5, 亥: 5,
  };
  return primaryBranches[posMap[shiBranch] ?? 0] ?? shiBranch;
}

export const CHANG_SHENG_LABELS = ['长', '沐', '冠', '临', '帝', '衰', '病', '死', '墓', '绝', '胎', '养'] as const;

export function getChangShengRow(
  stemOrElement: string,
  earthRule: 'fire_earth' | 'water_earth' = 'fire_earth'
): string[] {
  const map: Record<string, { start: string; dir: 1 | -1 }> = {
    甲: { start: '亥', dir: 1 }, 木: { start: '亥', dir: 1 },
    乙: { start: '午', dir: -1 },
    丙: { start: '寅', dir: 1 }, 火: { start: '寅', dir: 1 },
    丁: { start: '酉', dir: -1 },
    戊: { start: earthRule === 'water_earth' ? '申' : '寅', dir: 1 },
    土: { start: earthRule === 'water_earth' ? '申' : '寅', dir: 1 },
    己: { start: earthRule === 'water_earth' ? '卯' : '酉', dir: -1 },
    庚: { start: '巳', dir: 1 }, 金: { start: '巳', dir: 1 },
    辛: { start: '子', dir: -1 },
    壬: { start: '申', dir: 1 }, 水: { start: '申', dir: 1 },
    癸: { start: '卯', dir: -1 },
  };
  const cfg = map[stemOrElement] ?? map['甲'];
  const sIdx = BRANCHES_12.indexOf(cfg.start as (typeof BRANCHES_12)[number]);
  return Array.from({ length: 12 }, (_, i) => BRANCHES_12[((sIdx + i * cfg.dir) % 12 + 12) % 12]);
}

/**
 * 对六爻爻线进行正统京房纳甲排盘
 */
export function buildNajiaChart(
  primaryBinary: string, // 6 位二进制，初爻至上爻
  transformedBinary: string | null,
  linesStatus: { isChanging: boolean }[],
  timeInfo?: LiuYaoTimeInfo
): FullNajiaChart {
  const time = timeInfo || getCurrentLiuYaoTimeInfo();
  const meta = HEX_PALACE_MAP.get(primaryBinary);

  if (!meta) {
    throw new Error(`无法匹配卦宫：${primaryBinary}`);
  }

  const lowerTri = primaryBinary.slice(0, 3);
  const upperTri = primaryBinary.slice(3, 6);

  const innerBranches = NAJIA_BRANCHES[lowerTri].inner;
  const outerBranches = NAJIA_BRANCHES[upperTri].outer;
  const primaryBranches = [...innerBranches, ...outerBranches]; // 0 to 5
  const innerStem = NAJIA_STEMS[lowerTri].inner;
  const outerStem = NAJIA_STEMS[upperTri].outer;
  const primaryStems = [innerStem, innerStem, innerStem, outerStem, outerStem, outerStem];

  const sixBeasts = deriveSixBeasts(time.dayGan);

  // 变卦纳甲（若有）
  let transformedBranches: string[] | null = null;
  let transformedStems: string[] | null = null;
  if (transformedBinary) {
    const tLower = transformedBinary.slice(0, 3);
    const tUpper = transformedBinary.slice(3, 6);
    transformedBranches = [
      ...NAJIA_BRANCHES[tLower].inner,
      ...NAJIA_BRANCHES[tUpper].outer
    ];
    const tInStem = NAJIA_STEMS[tLower].inner;
    const tOutStem = NAJIA_STEMS[tUpper].outer;
    transformedStems = [tInStem, tInStem, tInStem, tOutStem, tOutStem, tOutStem];
  }

  const linesDetail: LineNajiaDetail[] = [];

  for (let i = 0; i < 6; i++) {
    const lineIndex = i + 1;
    const isYang = primaryBinary.charAt(i) === '1';
    const isChanging = linesStatus[i]?.isChanging || false;
    const stem = primaryStems[i];
    const branch = primaryBranches[i];
    const element = BRANCH_ELEMENT[branch];
    const relative = deriveSixRelative(meta.palaceElement, element);

    let transformedInfo: LineNajiaDetail['transformed'] = undefined;
    if (isChanging && transformedBinary && transformedBranches && transformedStems) {
      const tYang = transformedBinary.charAt(i) === '1';
      const tStem = transformedStems[i];
      const tBranch = transformedBranches[i];
      const tElement = BRANCH_ELEMENT[tBranch];
      // 变爻六亲依然以【本卦卦宫五行】为基准推导（增删卜易正统定论：变卦爻之六亲以本卦为本）
      const tRelative = deriveSixRelative(meta.palaceElement, tElement);
      transformedInfo = {
        isYang: tYang,
        stem: tStem,
        branch: tBranch,
        element: tElement,
        relative: tRelative
      };
    }

    linesDetail.push({
      lineIndex,
      lineNameZh: formatLineName(lineIndex, isYang),
      lineNameEn: formatLineNameEn(lineIndex, isYang),
      isYang,
      isChanging,
      stem,
      branch,
      element,
      relative,
      sixBeast: sixBeasts[i],
      isShi: meta.shi === lineIndex,
      isYing: meta.ying === lineIndex,
      isKong: time.xunKong.includes(branch),
      transformed: transformedInfo
    });
  }

  // 全排伏神 + 京房缺神标记：从本宫首卦（八纯卦）对应爻位取纳干地支六亲
  const presentRelatives = new Set(linesDetail.map((l) => l.relative));
  const ALL_RELATIVES: SixRelativeName[] = ['父母', '兄弟', '子孙', '妻财', '官鬼'];
  const missingRelatives = new Set(ALL_RELATIVES.filter((r) => !presentRelatives.has(r)));
  const palaceDef = PALACE_DEFS.find((p) => p.name === meta.palace);
  if (palaceDef) {
    const pureBranches = [
      ...NAJIA_BRANCHES[palaceDef.triBits].inner,
      ...NAJIA_BRANCHES[palaceDef.triBits].outer
    ];
    const pInStem = NAJIA_STEMS[palaceDef.triBits].inner;
    const pOutStem = NAJIA_STEMS[palaceDef.triBits].outer;
    const pureStems = [pInStem, pInStem, pInStem, pOutStem, pOutStem, pOutStem];
    for (let i = 0; i < 6; i++) {
      const fBranch = pureBranches[i];
      const fElement = BRANCH_ELEMENT[fBranch];
      const fRelative = deriveSixRelative(meta.palaceElement, fElement);
      linesDetail[i].fuShen = {
        stem: pureStems[i],
        branch: fBranch,
        element: fElement,
        relative: fRelative,
        isMissing: missingRelatives.has(fRelative),
      };
    }
  }

  // 构造变卦完整 6 爻排盘（包含动爻化后与静爻照搬）
  let transformedChart: TransformedHexChart | null = null;
  if (transformedBinary && transformedBranches && transformedStems) {
    const tMeta = HEX_PALACE_MAP.get(transformedBinary);
    const tLines: TransformedLineDetail[] = [];
    for (let i = 0; i < 6; i++) {
      const lineIndex = i + 1;
      const tYang = transformedBinary.charAt(i) === '1';
      const tStem = transformedStems[i];
      const tBranch = transformedBranches[i];
      const tElement = BRANCH_ELEMENT[tBranch];
      const tRelative = deriveSixRelative(meta.palaceElement, tElement);
      const isChanged = linesStatus[i]?.isChanging || false;
      tLines.push({
        lineIndex,
        lineNameZh: formatLineName(lineIndex, tYang),
        lineNameEn: formatLineNameEn(lineIndex, tYang),
        isYang: tYang,
        stem: tStem,
        branch: tBranch,
        element: tElement,
        relative: tRelative,
        isChanged
      });
    }

    if (tMeta) {
      transformedChart = {
        palace: tMeta.palace,
        palaceElement: tMeta.palaceElement,
        generationName: tMeta.generationName,
        hexTag: getHexTag(transformedBinary),
        lines: tLines
      };
    }
  }

const SHENSHA_GUIREN: Record<string, string> = {
  甲: '丑未', 戊: '丑未', 庚: '丑未', 乙: '子申', 己: '子申',
  丙: '亥酉', 丁: '亥酉', 壬: '巳卯', 癸: '巳卯', 辛: '午寅',
};
const SHENSHA_LU: Record<string, string> = {
  甲: '寅', 乙: '卯', 丙: '巳', 丁: '午', 戊: '巳',
  己: '午', 庚: '申', 辛: '酉', 壬: '亥', 癸: '子',
};
const SHENSHA_YANGREN: Record<string, string> = {
  甲: '卯', 乙: '辰', 丙: '午', 丁: '未', 戊: '午',
  己: '未', 庚: '酉', 辛: '戌', 壬: '子', 癸: '丑',
};
const SHENSHA_WENCHANG: Record<string, string> = {
  甲: '巳', 乙: '午', 丙: '申', 丁: '酉', 戊: '申',
  己: '酉', 庚: '亥', 辛: '子', 壬: '寅', 癸: '卯',
};
const SHENSHA_SANHE_GROUP: Record<string, { ma: string; taohua: string; huagai: string; jiangxing: string; jiesha: string; zaisha: string }> = {
  申: { ma: '寅', taohua: '酉', huagai: '辰', jiangxing: '子', jiesha: '巳', zaisha: '午' },
  子: { ma: '寅', taohua: '酉', huagai: '辰', jiangxing: '子', jiesha: '巳', zaisha: '午' },
  辰: { ma: '寅', taohua: '酉', huagai: '辰', jiangxing: '子', jiesha: '巳', zaisha: '午' },
  寅: { ma: '申', taohua: '卯', huagai: '戌', jiangxing: '午', jiesha: '亥', zaisha: '子' },
  午: { ma: '申', taohua: '卯', huagai: '戌', jiangxing: '午', jiesha: '亥', zaisha: '子' },
  戌: { ma: '申', taohua: '卯', huagai: '戌', jiangxing: '午', jiesha: '亥', zaisha: '子' },
  巳: { ma: '亥', taohua: '午', huagai: '丑', jiangxing: '酉', jiesha: '寅', zaisha: '卯' },
  酉: { ma: '亥', taohua: '午', huagai: '丑', jiangxing: '酉', jiesha: '寅', zaisha: '卯' },
  丑: { ma: '亥', taohua: '午', huagai: '丑', jiangxing: '酉', jiesha: '寅', zaisha: '卯' },
  亥: { ma: '巳', taohua: '子', huagai: '未', jiangxing: '卯', jiesha: '申', zaisha: '酉' },
  卯: { ma: '巳', taohua: '子', huagai: '未', jiangxing: '卯', jiesha: '申', zaisha: '酉' },
  未: { ma: '巳', taohua: '子', huagai: '未', jiangxing: '卯', jiesha: '申', zaisha: '酉' },
};

function computeLiuYaoShenSha(dayGan: string, dayZhi: string, monthZhi: string): Record<string, string> {
  const grp = SHENSHA_SANHE_GROUP[dayZhi];
  const monthIdx = BRANCHES_12.indexOf(monthZhi as (typeof BRANCHES_12)[number]);
  const tianYi = monthIdx >= 0 ? BRANCHES_12[(monthIdx + 11) % 12] : ''; // 天医：月建前一位
  const tianXiMap: Record<string, string> = {
    寅: '戌', 卯: '戌', 辰: '戌', 巳: '丑', 午: '丑', 未: '丑',
    申: '辰', 酉: '辰', 戌: '辰', 亥: '未', 子: '未', 丑: '未',
  };
  const sangMen = monthIdx >= 0 ? BRANCHES_12[(monthIdx + 2) % 12] : '';
  const diaoKe = monthIdx >= 0 ? BRANCHES_12[(monthIdx + 10) % 12] : '';
  const bingFu = monthIdx >= 0 ? BRANCHES_12[(monthIdx + 11) % 12] : '';
  const youDu = ({ 甲: '丑', 乙: '子', 丙: '亥', 丁: '戌', 戊: '酉', 己: '申', 庚: '未', 辛: '午', 壬: '巳', 癸: '辰' } as Record<string, string>)[dayGan] || '子';

  return {
    驿马: grp?.ma || '',
    桃花: grp?.taohua || '',
    日禄: SHENSHA_LU[dayGan] || '',
    文昌: SHENSHA_WENCHANG[dayGan] || '',
    天喜: tianXiMap[monthZhi] || '未',
    天医: tianYi,
    丧门: sangMen,
    吊客: diaoKe,
    病符: bingFu,
    游都: youDu,
    贵人: SHENSHA_GUIREN[dayGan] || '',
    羊刃: SHENSHA_YANGREN[dayGan] || '',
  };
}

  const shiLine = linesDetail[meta.shi - 1];
  const guaShen = computeGuaShen(meta.shi, shiLine?.isYang ?? true);
  const shiShenBranch = computeShiShenBranch(shiLine?.branch ?? '子', primaryBranches);

  return {
    timeInfo: time,
    palace: meta.palace,
    palaceElement: meta.palaceElement,
    generationName: meta.generationName,
    hexTag: getHexTag(primaryBinary),
    shiIndex: meta.shi,
    yingIndex: meta.ying,
    guaShen,
    shiShenBranch,
    shenSha: computeLiuYaoShenSha(time.dayGan, time.dayZhi, time.monthZhi),
    lines: linesDetail,
    transformedChart
  };
}
