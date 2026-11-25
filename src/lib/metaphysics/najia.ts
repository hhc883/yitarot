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
}

export interface LineNajiaDetail {
  lineIndex: number; // 1 to 6 (1 = 初爻, 6 = 上爻)
  lineNameZh: string; // "初六", "九二", "九三", "九四", "九五", "上九"
  lineNameEn: string;
  isYang: boolean;
  isChanging: boolean;
  branch: string; // "子", "丑", "寅"...
  element: ElementName; // "水", "土", "木"...
  relative: SixRelativeName; // "父母", "兄弟", "子孙", "妻财", "官鬼"
  sixBeast: SixBeastName; // "青龙", "朱雀"...
  isShi: boolean; // 是否世爻
  isYing: boolean; // 是否应爻
  isXunKong?: boolean; // 是否落入日柱旬空地支
  isYuePo?: boolean; // 是否被月建六冲（月破）
  // 动爻化出之爻（仅在动爻存在时有值）
  transformed?: {
    isYang: boolean;
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
  branch: string;
  element: ElementName;
  relative: SixRelativeName;
  isChanged: boolean; // 是否由动爻转化而来
}

export interface TransformedHexChart {
  palace: PalaceName;
  palaceElement: ElementName;
  generationName: string;
  lines: TransformedLineDetail[]; // 包含变卦全部 6 爻（动爻变后 + 静爻照搬）
}

export interface FullNajiaChart {
  timeInfo: LiuYaoTimeInfo;
  palace: PalaceName;
  palaceElement: ElementName;
  generationName: string; // "本宫卦(八纯)", "一世卦", "游魂卦"...
  shiIndex: number; // 1-6
  yingIndex: number; // 1-6
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

// 地支六冲（月建六冲本爻地支即为月破）
export const BRANCH_CLASH: Record<string, string> = {
  子: '午', 午: '子',
  丑: '未', 未: '丑',
  寅: '申', 申: '寅',
  卯: '酉', 酉: '卯',
  辰: '戌', 戌: '辰',
  巳: '亥', 亥: '巳'
};

// 中英对照映射
export const ELEMENT_EN: Record<ElementName, string> = {
  金: 'Metal',
  木: 'Wood',
  水: 'Water',
  火: 'Fire',
  土: 'Earth'
};

export const PALACE_EN: Record<PalaceName, string> = {
  乾: 'Qian',
  兑: 'Dui',
  离: 'Li',
  震: 'Zhen',
  巽: 'Xun',
  坎: 'Kan',
  艮: 'Gen',
  坤: 'Kun'
};

export const SIX_RELATIVE_EN: Record<SixRelativeName, string> = {
  父母: 'Parents',
  兄弟: 'Siblings',
  子孙: 'Offspring',
  妻财: 'Wealth',
  官鬼: 'Official'
};

export const SIX_BEAST_EN: Record<SixBeastName, string> = {
  青龙: 'Azure Dragon',
  朱雀: 'Vermilion Bird',
  勾陈: 'Hook Chen',
  螣蛇: 'Flying Serpent',
  白虎: 'White Tiger',
  玄武: 'Black Tortoise'
};

export const BRANCH_EN: Record<string, string> = {
  子: 'Zi', 丑: 'Chou', 寅: 'Yin', 卯: 'Mao',
  辰: 'Chen', 巳: 'Si', 午: 'Wu', 未: 'Wei',
  申: 'Shen', 酉: 'You', 戌: 'Xu', 亥: 'Hai'
};

export const GENERATION_NAME_EN: Record<string, string> = {
  '本宫卦(八纯)': 'Pure Palace',
  '一世卦': '1st Gen',
  '二世卦': '2nd Gen',
  '三世卦': '3rd Gen',
  '四世卦': '4th Gen',
  '五世卦': '5th Gen',
  '游魂卦': 'Wandering Soul',
  '归魂卦': 'Returning Soul'
};

/** 查地支五行 */
export function getBranchElement(branch: string): ElementName | undefined {
  return BRANCH_ELEMENT[branch];
}

/** 核对本爻地支是否落入日柱旬空 */
export function isBranchXunKong(branch: string, xunKong: string): boolean {
  return Boolean(branch && xunKong && xunKong.includes(branch));
}

/** 核对本爻地支是否被月建六冲（月破） */
export function isBranchYuePo(branch: string, monthZhi: string): boolean {
  return Boolean(branch && monthZhi && BRANCH_CLASH[monthZhi] === branch);
}

/** 格式化地支列表英文说明（如 "辰巳" -> "辰巳 (Chen/Si)"） */
export function formatBranchesEn(branches: string): string {
  if (!branches) return '';
  const names = branches
    .split('')
    .map((ch) => BRANCH_EN[ch])
    .filter(Boolean);
  return names.length ? `${branches} (${names.join('/')})` : branches;
}

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
 * 严格按浏览器/运行环境当地时区解析手录日期时刻（YYYY-MM-DD 与可选 HH:mm）。
 * 拒绝任何不存在的日历日期（如 2026-02-29、2026-02-30、2026-04-31）或越界时刻。
 */
export function parseLocalDateTimeInput(dateStr: string, timeStr?: string): Date {
  const rawDate = (dateStr ?? '').trim();
  if (!rawDate) {
    throw new Error('请输入有效日期 / Please enter a valid date');
  }

  let datePart = rawDate;
  let timePart = (timeStr ?? '').trim();

  const combinedMatch = rawDate.match(/^(\d{4}-\d{2}-\d{2})[T\s](\d{2}:\d{2})$/);
  if (combinedMatch && !timePart) {
    datePart = combinedMatch[1];
    timePart = combinedMatch[2];
  }

  const dateMatch = datePart.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!dateMatch) {
    throw new Error('日期格式无效，应为 YYYY-MM-DD / Invalid date format (expected YYYY-MM-DD)');
  }

  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);

  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) {
    throw new Error('日期超出可排盘范围 / Date out of valid calendar range');
  }

  let hour = 12;
  let minute = 0;
  if (timePart) {
    const timeMatch = timePart.match(/^(\d{2}):(\d{2})$/);
    if (!timeMatch) {
      throw new Error('时刻格式无效，应为 HH:mm / Invalid time format (expected HH:mm)');
    }
    hour = Number(timeMatch[1]);
    minute = Number(timeMatch[2]);
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      throw new Error('时刻超出 00:00-23:59 范围 / Time out of range (00:00-23:59)');
    }
  }

  const parsed = new Date(year, month - 1, day, hour, minute, 0, 0);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day ||
    parsed.getHours() !== hour ||
    parsed.getMinutes() !== minute
  ) {
    throw new Error(`不存在的日历日期：${datePart} / Non-existent calendar date: ${datePart}`);
  }

  return parsed;
}

/**
 * 获取当前当地时区标识（如 "Asia/Shanghai (UTC+8)"）
 */
export function getLocalTimezoneLabel(refDate?: Date): string {
  const d = refDate && !Number.isNaN(refDate.getTime()) ? refDate : new Date();
  const offsetMinutes = -d.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const abs = Math.abs(offsetMinutes);
  const hh = Math.floor(abs / 60);
  const mm = abs % 60;
  const utcOffset = mm > 0 ? `UTC${sign}${hh}:${String(mm).padStart(2, '0')}` : `UTC${sign}${hh}`;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return tz ? `${tz} (${utcOffset})` : utcOffset;
  } catch {
    return utcOffset;
  }
}

/**
 * 获取当前起卦的时空四柱干支与月建日辰旬空
 */
export function getCurrentLiuYaoTimeInfo(customDate?: Date): LiuYaoTimeInfo {
  if (customDate !== undefined) {
    if (!(customDate instanceof Date) || Number.isNaN(customDate.getTime())) {
      throw new Error('无效的起卦日期或时刻 / Invalid divination date or time');
    }
  }
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
    xunKong: eightChar.getDayXunKong()
  };
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

  const sixBeasts = deriveSixBeasts(time.dayGan);

  // 变卦纳甲（若有）
  let transformedBranches: string[] | null = null;
  if (transformedBinary) {
    const tLower = transformedBinary.slice(0, 3);
    const tUpper = transformedBinary.slice(3, 6);
    transformedBranches = [
      ...NAJIA_BRANCHES[tLower].inner,
      ...NAJIA_BRANCHES[tUpper].outer
    ];
  }

  const linesDetail: LineNajiaDetail[] = [];

  for (let i = 0; i < 6; i++) {
    const lineIndex = i + 1;
    const isYang = primaryBinary.charAt(i) === '1';
    const isChanging = linesStatus[i]?.isChanging || false;
    const branch = primaryBranches[i];
    const element = BRANCH_ELEMENT[branch];
    const relative = deriveSixRelative(meta.palaceElement, element);
    const isXunKong = isBranchXunKong(branch, time.xunKong);
    const isYuePo = isBranchYuePo(branch, time.monthZhi);

    let transformedInfo: LineNajiaDetail['transformed'] = undefined;
    if (isChanging && transformedBinary && transformedBranches) {
      const tYang = transformedBinary.charAt(i) === '1';
      const tBranch = transformedBranches[i];
      const tElement = BRANCH_ELEMENT[tBranch];
      // 变爻六亲依然以【本卦卦宫五行】为基准推导（增删卜易正统定论：变卦爻之六亲以本卦为本）
      const tRelative = deriveSixRelative(meta.palaceElement, tElement);
      transformedInfo = {
        isYang: tYang,
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
      branch,
      element,
      relative,
      sixBeast: sixBeasts[i],
      isShi: meta.shi === lineIndex,
      isYing: meta.ying === lineIndex,
      isXunKong,
      isYuePo,
      transformed: transformedInfo
    });
  }

  // 构造变卦完整 6 爻排盘（包含动爻化后与静爻照搬）
  let transformedChart: TransformedHexChart | null = null;
  if (transformedBinary && transformedBranches) {
    const tMeta = HEX_PALACE_MAP.get(transformedBinary);
    const tLines: TransformedLineDetail[] = [];
    for (let i = 0; i < 6; i++) {
      const lineIndex = i + 1;
      const tYang = transformedBinary.charAt(i) === '1';
      const tBranch = transformedBranches[i];
      const tElement = BRANCH_ELEMENT[tBranch];
      const tRelative = deriveSixRelative(meta.palaceElement, tElement);
      const isChanged = linesStatus[i]?.isChanging || false;
      tLines.push({
        lineIndex,
        lineNameZh: formatLineName(lineIndex, tYang),
        lineNameEn: formatLineNameEn(lineIndex, tYang),
        isYang: tYang,
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
        lines: tLines
      };
    }
  }

  return {
    timeInfo: time,
    palace: meta.palace,
    palaceElement: meta.palaceElement,
    generationName: meta.generationName,
    shiIndex: meta.shi,
    yingIndex: meta.ying,
    lines: linesDetail,
    transformedChart
  };
}
