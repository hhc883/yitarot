import { Solar } from 'lunar-typescript';
import { LINE_TEXTS } from '@/lib/kb/canon';
import { hexagramSymbol, lookupEntryByBinary } from './hexagrams64';

export const MEIHUA_TIME_MIN = '1900-01-01T00:00:00';
export const MEIHUA_TIME_MAX = '2100-12-31T23:59:59';
const BEIJING_OFFSET_MS = 8 * 60 * 60 * 1000;
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;
const BRANCHES_EN: Record<string, string> = {
  子: 'Zi', 丑: 'Chou', 寅: 'Yin', 卯: 'Mao', 辰: 'Chen', 巳: 'Si',
  午: 'Wu', 未: 'Wei', 申: 'Shen', 酉: 'You', 戌: 'Xu', 亥: 'Hai'
};

export interface TrigramInfo {
  number: number; // 1 to 8
  nameZh: string; // 乾、兑、离、震、巽、坎、艮、坤
  nameEn?: string;
  symbol: string; // ☰, ☱, ☲, ☳, ☴, ☵, ☶, ☷
  natureZh: string; // 天、泽、火、雷、风、水、山、地
  natureEn?: string;
  element: "Metal" | "Wood" | "Water" | "Fire" | "Earth";
  elementZh: string;
  lines: [boolean, boolean, boolean]; // bottom to top: true=yang, false=yin
}

export const TRIGRAMS: Record<number, TrigramInfo> = {
  1: { number: 1, nameZh: "乾", nameEn: "Qian (Heaven)", symbol: "☰", natureZh: "天", natureEn: "Heaven", element: "Metal", elementZh: "金", lines: [true, true, true] },
  2: { number: 2, nameZh: "兑", nameEn: "Dui (Lake)", symbol: "☱", natureZh: "泽", natureEn: "Lake", element: "Metal", elementZh: "金", lines: [true, true, false] },
  3: { number: 3, nameZh: "离", nameEn: "Li (Fire)", symbol: "☲", natureZh: "火", natureEn: "Fire", element: "Fire", elementZh: "火", lines: [true, false, true] },
  4: { number: 4, nameZh: "震", nameEn: "Zhen (Thunder)", symbol: "☳", natureZh: "雷", natureEn: "Thunder", element: "Wood", elementZh: "木", lines: [true, false, false] },
  5: { number: 5, nameZh: "巽", nameEn: "Xun (Wind)", symbol: "☴", natureZh: "风", natureEn: "Wind", element: "Wood", elementZh: "木", lines: [false, true, true] },
  6: { number: 6, nameZh: "坎", nameEn: "Kan (Water)", symbol: "☵", natureZh: "水", natureEn: "Water", element: "Water", elementZh: "水", lines: [false, true, false] },
  7: { number: 7, nameZh: "艮", nameEn: "Gen (Mountain)", symbol: "☶", natureZh: "山", natureEn: "Mountain", element: "Earth", elementZh: "土", lines: [false, false, true] },
  8: { number: 8, nameZh: "坤", nameEn: "Kun (Earth)", symbol: "☷", natureZh: "地", natureEn: "Earth", element: "Earth", elementZh: "土", lines: [false, false, false] }
};

export interface MeihuaCalculationBasis {
  mode: 'time' | 'numbers';
  methodZh: string;
  methodEn: string;
  beijingTime?: string;
  lunarYearGanZhi?: string;
  yearBranch?: string;
  yearBranchEn?: string;
  yearBranchNum?: number;
  lunarMonth?: number;
  lunarMonthZh?: string;
  isLeapMonth?: boolean;
  lunarDay?: number;
  lunarDayZh?: string;
  hourBranch?: string;
  hourBranchEn?: string;
  hourBranchNum?: number;
  sumUpper?: number;
  sumLower?: number;
  inputNumbers?: [number, number, number];
  remainders: {
    upper: number;
    lower: number;
    moving: number;
    upperRawMod: number;
    lowerRawMod: number;
    movingRawMod: number;
  };
  conventionNoteZh: string;
  conventionNoteEn: string;
}

export interface MeihuaSourceRef {
  id: 'meihua.v1.time' | 'meihua.v1.mutual' | 'meihua.v2.tiyong' | 'meihua.v2.guaduan' | 'meihua.v2.zhanbu';
  bookZh: string;
  bookEn: string;
  chapterZh: string;
  chapterEn: string;
  url: string;
}

export const MEIHUA_SOURCES: Record<MeihuaSourceRef['id'], MeihuaSourceRef> = {
  'meihua.v1.time': {
    id: 'meihua.v1.time',
    bookZh: '《梅花易数》卷一',
    bookEn: 'Meihua Yishu, Vol. 1',
    chapterZh: '年月日时起例',
    chapterEn: 'Year-Month-Day-Hour Casting',
    url: 'https://zh.wikisource.org/zh-hant/梅花易數/卷一#年月日時起例'
  },
  'meihua.v1.mutual': {
    id: 'meihua.v1.mutual',
    bookZh: '《梅花易数》卷一',
    bookEn: 'Meihua Yishu, Vol. 1',
    chapterZh: '互卦起例',
    chapterEn: 'Constructing the Nuclear Trigrams',
    url: 'https://zh.wikisource.org/zh-hant/梅花易數/卷一#互卦起例'
  },
  'meihua.v2.tiyong': {
    id: 'meihua.v2.tiyong',
    bookZh: '《梅花易数》卷二',
    bookEn: 'Meihua Yishu, Vol. 2',
    chapterZh: '体用总诀',
    chapterEn: 'General Principles of Ti & Yong (体用总诀)',
    url: 'https://zh.wikisource.org/zh-hant/梅花易數/卷二#體用總訣'
  },
  'meihua.v2.guaduan': {
    id: 'meihua.v2.guaduan',
    bookZh: '《梅花易数》卷二',
    bookEn: 'Meihua Yishu, Vol. 2',
    chapterZh: '卦断遗论',
    chapterEn: 'Supplementary Discourse on Hexagram Judgment (卦断遗论)',
    url: 'https://zh.wikisource.org/zh-hant/梅花易數/卷二#卦斷遺論'
  },
  'meihua.v2.zhanbu': {
    id: 'meihua.v2.zhanbu',
    bookZh: '《梅花易数》卷二',
    bookEn: 'Meihua Yishu, Vol. 2',
    chapterZh: '占卜总决',
    chapterEn: 'General Summary of Divination (占卜总决)',
    url: 'https://zh.wikisource.org/zh-hant/梅花易數/卷二#占卜總決'
  }
};

export type ComparisonStage = 'primary_use' | 'mutual_upper' | 'mutual_lower' | 'transformed_use';

export type RelationDirection =
  | 'target_generates_body'
  | 'body_overcomes_target'
  | 'same'
  | 'body_generates_target'
  | 'target_overcomes_body';

export interface StageComparison {
  stage: ComparisonStage;
  stageLabelZh: string;
  stageLabelEn: string;
  stageRoleZh: string;
  stageRoleEn: string;
  body: TrigramInfo;
  target: TrigramInfo;
  direction: RelationDirection;
  directionLabelZh: string;
  directionLabelEn: string;
  polarity: 'supportive' | 'draining_or_pressured';
  ruleTextZh: string;
  ruleTextEn: string;
  source: MeihuaSourceRef;
}

export interface MeihuaSynthesis {
  comparisons: StageComparison[];
  hasMixedSignals: boolean;
  headlineZh: string;
  headlineEn: string;
  summaryZh: string;
  summaryEn: string;
  sources: MeihuaSourceRef[];
}

export interface MeihuaAssessments {
  seasonal: {
    status: 'not_assessed';
    hasDateContext: boolean;
    labelZh: string;
    labelEn: string;
    reasonZh: string;
    reasonEn: string;
  };
  externalOmens: {
    status: 'not_assessed';
    labelZh: string;
    labelEn: string;
    reasonZh: string;
    reasonEn: string;
  };
}

export interface MeihuaIChingCanon {
  primary: {
    number: number;
    nameZh: string;
    nameEn: string;
    judgmentZh: string;
    imageZh: string;
  };
  transformed: {
    number: number;
    nameZh: string;
    nameEn: string;
    judgmentZh: string;
    imageZh: string;
  };
  movingLineNumber: number;
  movingLineText: string | null;
}

export interface MeihuaDivinationResult {
  question: string;
  castMode: "time" | "numbers";
  numbers: [number, number, number];
  basis: MeihuaCalculationBasis;
  primaryHexagram: {
    upper: TrigramInfo;
    lower: TrigramInfo;
    fullNameZh: string;
    fullNameEn?: string;
    symbol: string;
    lines: boolean[]; // 6 lines from 1 (bottom) to 6 (top)
  };
  movingLine: number; // 1 to 6
  bodyTrigram: {
    trigram: TrigramInfo;
    position: "upper" | "lower";
    role: "体卦 (我方/所占之事)";
    roleEn?: string;
  };
  applicationTrigram: {
    trigram: TrigramInfo;
    position: "upper" | "lower";
    role: "用卦 (事态/对方境遇)";
    roleEn?: string;
  };
  mutualHexagram: {
    basis: 'primary' | 'transformed';
    upper: TrigramInfo;
    lower: TrigramInfo;
    fullNameZh: string;
    fullNameEn?: string;
    symbol?: string;
    summaryZh: string;
    summaryEn?: string;
  };
  transformedHexagram: {
    upper: TrigramInfo;
    lower: TrigramInfo;
    fullNameZh: string;
    fullNameEn?: string;
    symbol?: string;
    changedApplication: TrigramInfo;
    summaryZh: string;
    summaryEn?: string;
  };
  synthesis: MeihuaSynthesis;
  assessments: MeihuaAssessments;
  ichingCanon: MeihuaIChingCanon;
}

const HEXAGRAM_NAMES: Record<string, string> = {
  "1_1": "乾为天", "1_2": "天泽履", "1_3": "天火同人", "1_4": "天雷无妄", "1_5": "天风姤", "1_6": "天水讼", "1_7": "天山遁", "1_8": "天地否",
  "2_1": "泽天夬", "2_2": "兑为泽", "2_3": "泽火革", "2_4": "泽雷随", "2_5": "泽风大过", "2_6": "泽水困", "2_7": "泽山咸", "2_8": "泽地萃",
  "3_1": "火天大有", "3_2": "火泽睽", "3_3": "离为火", "3_4": "火雷噬嗑", "3_5": "火风鼎", "3_6": "火水未济", "3_7": "火山旅", "3_8": "火地晋",
  "4_1": "雷天大壮", "4_2": "雷泽归妹", "4_3": "雷火丰", "4_4": "震为雷", "4_5": "雷风恒", "4_6": "雷水解", "4_7": "雷山小过", "4_8": "雷地豫",
  "5_1": "风天小畜", "5_2": "风泽中孚", "5_3": "风火家人", "5_4": "风雷益", "5_5": "巽为风", "5_6": "风水涣", "5_7": "风山渐", "5_8": "风地观",
  "6_1": "水天需", "6_2": "水泽节", "6_3": "水火既济", "6_4": "水雷屯", "6_5": "水风井", "6_6": "坎为水", "6_7": "水山蹇", "6_8": "水地比",
  "7_1": "山天大畜", "7_2": "山泽损", "7_3": "山火贲", "7_4": "山雷颐", "7_5": "山风蛊", "7_6": "山水蒙", "7_7": "艮为山", "7_8": "山地剥",
  "8_1": "地天泰", "8_2": "地泽临", "8_3": "地火明夷", "8_4": "地雷复", "8_5": "地风升", "8_6": "地水师", "8_7": "地山谦", "8_8": "坤为地"
};

function trigramFromLines(lines: [boolean, boolean, boolean]): TrigramInfo {
  for (let i = 1; i <= 8; i++) {
    const t = TRIGRAMS[i];
    if (t.lines[0] === lines[0] && t.lines[1] === lines[1] && t.lines[2] === lines[2]) {
      return t;
    }
  }
  return TRIGRAMS[1];
}

const ELEMENT_GENERATION: Record<string, string> = {
  Wood: "Fire", Fire: "Earth", Earth: "Metal", Metal: "Water", Water: "Wood"
};

const ELEMENT_OVERCOMING: Record<string, string> = {
  Wood: "Earth", Earth: "Water", Water: "Fire", Fire: "Metal", Metal: "Wood"
};

/**
 * Parse a manually entered Beijing standard wall time (UTC+08:00) without host timezone rollover.
 */
export function parseMeihuaBeijingTime(input: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?$/.test(input)) return null;
  const wall = input.length === 16 ? input + ':00' : input;
  if (wall < MEIHUA_TIME_MIN || wall > MEIHUA_TIME_MAX) return null;
  const instant = new Date(wall + '+08:00');
  if (!Number.isFinite(instant.getTime())) return null;
  return new Date(instant.getTime() + BEIJING_OFFSET_MS).toISOString().slice(0, 19) === wall ? instant : null;
}

/**
 * Format an instant as Beijing standard wall time (YYYY-MM-DDTHH:mm:ss).
 */
export function formatMeihuaBeijingTime(date: Date = new Date()): string {
  const beijing = new Date(date.getTime() + BEIJING_OFFSET_MS);
  return beijing.toISOString().slice(0, 19);
}

const STAGE_META: Record<
  ComparisonStage,
  {
    labelZh: string;
    labelEn: string;
    roleZh: string;
    roleEn: string;
    targetNounZh: string;
    targetNounEn: string;
    source: MeihuaSourceRef;
  }
> = {
  primary_use: {
    labelZh: '体 vs 本卦用',
    labelEn: 'Body vs. Primary Application',
    roleZh: '体为己方主体，本卦用为当前所占之事与外部境遇。',
    roleEn: 'Body represents the subject; Primary Application represents the matter at hand.',
    targetNounZh: '用',
    targetNounEn: 'Application',
    source: MEIHUA_SOURCES['meihua.v2.tiyong']
  },
  mutual_upper: {
    labelZh: '体 vs 互之上',
    labelEn: 'Body vs. Upper Nuclear',
    roleZh: '上互为互卦上部，按传统体用法与体卦比较。',
    roleEn: 'The upper nuclear trigram is compared with Body in the traditional method.',
    targetNounZh: '互',
    targetNounEn: 'Upper Nuclear',
    source: MEIHUA_SOURCES['meihua.v2.guaduan']
  },
  mutual_lower: {
    labelZh: '体 vs 互之下',
    labelEn: 'Body vs. Lower Nuclear',
    roleZh: '下互为互卦下部，按传统体用法与体卦比较。',
    roleEn: 'The lower nuclear trigram is compared with Body in the traditional method.',
    targetNounZh: '互',
    targetNounEn: 'Lower Nuclear',
    source: MEIHUA_SOURCES['meihua.v2.guaduan']
  },
  transformed_use: {
    labelZh: '体 vs 变之新用',
    labelEn: 'Body vs. Transformed Application',
    roleZh: '变卦为动爻之后的事态转归与后续回应。',
    roleEn: 'Transformed Application represents the later response after the moving line shifts.',
    targetNounZh: '变',
    targetNounEn: 'Transformed Application',
    source: MEIHUA_SOURCES['meihua.v2.guaduan']
  }
};

function compareBodyToTarget(
  body: TrigramInfo,
  target: TrigramInfo,
  stage: ComparisonStage
): StageComparison {
  const meta = STAGE_META[stage];
  const bEl = body.element;
  const tEl = target.element;
  const bNameZh = `${body.nameZh}（${body.elementZh}）`;
  const tNameZh = `${target.nameZh}（${target.elementZh}）`;
  const bNameEn = `${body.nameEn || body.nameZh} [${body.element}]`;
  const tNameEn = `${target.nameEn || target.nameZh} [${target.element}]`;

  let direction: RelationDirection = 'same';
  let directionLabelZh = stage === 'primary_use' ? '体用比和' : `体${meta.targetNounZh}比和`;
  let directionLabelEn = `Body & ${meta.targetNounEn} in Concord (比和)`;
  let polarity: 'supportive' | 'draining_or_pressured' = 'supportive';
  let ruleTextZh = `体${bNameZh}与${meta.targetNounZh}${tNameZh}五行同属${body.elementZh}。《体用总诀》将同类称为比和。`;
  let ruleTextEn = `Body ${bNameEn} and ${meta.targetNounEn} ${tNameEn} share element ${body.element}. Per Ti-Yong General Principles, concord (比和) indicates mutual alignment without element clash at this stage.`;

  if (ELEMENT_GENERATION[tEl] === bEl) {
    direction = 'target_generates_body';
    directionLabelZh = `${meta.targetNounZh}生体`;
    directionLabelEn = `${meta.targetNounEn} Generates Body (${meta.targetNounZh}生体)`;
    polarity = 'supportive';
    ruleTextZh = `${meta.targetNounZh}${tNameZh}生体${bNameZh}。按《体用总诀》，这是体卦受生。`;
    ruleTextEn = `${meta.targetNounEn} ${tNameEn} generates Body ${bNameEn}. Per Ti-Yong General Principles & Supplementary Discourse, generation toward Body indicates supportive inflow at this stage.`;
  } else if (ELEMENT_OVERCOMING[bEl] === tEl) {
    direction = 'body_overcomes_target';
    directionLabelZh = `体克${meta.targetNounZh}`;
    directionLabelEn = `Body Overcomes ${meta.targetNounEn} (体克${meta.targetNounZh})`;
    polarity = 'supportive';
    ruleTextZh = `体${bNameZh}克${meta.targetNounZh}${tNameZh}。按《体用总诀》，这是体克对照卦。`;
    ruleTextEn = `Body ${bNameEn} overcomes ${meta.targetNounEn} ${tNameEn}. Per Ti-Yong General Principles, this marks the direction of restraint from Body to the other trigram.`;
  } else if (ELEMENT_GENERATION[bEl] === tEl) {
    direction = 'body_generates_target';
    directionLabelZh = `体生${meta.targetNounZh}`;
    directionLabelEn = `Body Generates ${meta.targetNounEn} (体生${meta.targetNounZh})`;
    polarity = 'draining_or_pressured';
    ruleTextZh = `体${bNameZh}生${meta.targetNounZh}${tNameZh}。《体用总诀》将体卦生出称为泄气。`;
    ruleTextEn = `Body ${bNameEn} generates ${meta.targetNounEn} ${tNameEn}. Per Ti-Yong General Principles, Body generating target indicates the traditional notion of Qi draining from Body at this stage.`;
  } else if (ELEMENT_OVERCOMING[tEl] === bEl) {
    direction = 'target_overcomes_body';
    directionLabelZh = `${meta.targetNounZh}克体`;
    directionLabelEn = `${meta.targetNounEn} Overcomes Body (${meta.targetNounZh}克体)`;
    polarity = 'draining_or_pressured';
    ruleTextZh = `${meta.targetNounZh}${tNameZh}克体${bNameZh}。据《体用总诀》及《卦断遗论》，此段见克制压迫；若互变再重见克体党类，压力更甚，若互变见生扶则可减缓。`;
    ruleTextEn = `${meta.targetNounEn} ${tNameEn} overcomes Body ${bNameEn}. Per Ti-Yong General Principles & Supplementary Discourse, overcoming toward Body indicates resistance/pressure at this stage, which may be compounded or relieved by other stages.`;
  }

  return {
    stage,
    stageLabelZh: meta.labelZh,
    stageLabelEn: meta.labelEn,
    stageRoleZh: meta.roleZh,
    stageRoleEn: meta.roleEn,
    body,
    target,
    direction,
    directionLabelZh,
    directionLabelEn,
    polarity,
    ruleTextZh,
    ruleTextEn,
    source: meta.source
  };
}

function buildSynthesis(comparisons: StageComparison[]): MeihuaSynthesis {
  const [primaryUse, mutualUpper, mutualLower, transformedUse] = comparisons;
  const hasMixedSignals = comparisons.some(comp => comp.polarity !== primaryUse.polarity);

  const laterStagesZh = `互之上（${mutualUpper.directionLabelZh}）、互之下（${mutualLower.directionLabelZh}）、变之新用（${transformedUse.directionLabelZh}）`;
  const laterStagesEn = `Upper Nuclear (${mutualUpper.directionLabelEn}), Lower Nuclear (${mutualLower.directionLabelEn}), and Transformed Application (${transformedUse.directionLabelEn})`;

  const headlineZh = hasMixedSignals ? '本卦与互变需合看' : '本卦与互变的生克倾向一致';
  const headlineEn = hasMixedSignals
    ? 'Read the Primary, Nuclear and Transformed Relations Together'
    : 'The Primary, Nuclear and Transformed Relations Align';
  const summaryZh = `本卦用（${primaryUse.directionLabelZh}），${laterStagesZh}。${
    hasMixedSignals ? '《卦断遗论》以互、变参与判断，表示初见的生克仍需互相参照。' : '按《体用总诀》，这些关系可合看，完整推断还须参照时令与其他条件。'
  }`;
  const summaryEn = `Primary Application (${primaryUse.directionLabelEn}), ${laterStagesEn}. ${
    hasMixedSignals
      ? 'Supplementary Discourse considers nuclear and transformed relations alongside the primary relation.'
      : 'General Principles reads these relations together and also considers seasonal strength and other circumstances.'
  }`;

  return {
    comparisons,
    hasMixedSignals,
    headlineZh,
    headlineEn,
    summaryZh,
    summaryEn,
    sources: [
      MEIHUA_SOURCES['meihua.v1.mutual'],
      MEIHUA_SOURCES['meihua.v2.tiyong'],
      MEIHUA_SOURCES['meihua.v2.guaduan'],
      MEIHUA_SOURCES['meihua.v2.zhanbu']
    ]
  };
}

/**
 * 梅花易数核心推演函数
 */
export function divineMeihua(
  question: string,
  mode: "time" | "numbers" = "time",
  customNumbers?: [number, number, number],
  targetDate: Date = new Date()
): MeihuaDivinationResult {
  let numUpper = 1;
  let numLower = 1;
  let numMoving = 1;
  let basis: MeihuaCalculationBasis;

  if (mode === "numbers") {
    if (
      !customNumbers ||
      customNumbers.length !== 3 ||
      customNumbers.some(n => !Number.isInteger(n) || n < 1)
    ) {
      throw new RangeError('Custom numbers must be three positive integers.');
    }
    const [rawUpper, rawLower, rawMoving] = customNumbers;
    const upperRawMod = rawUpper % 8;
    const lowerRawMod = rawLower % 8;
    const movingRawMod = rawMoving % 6;

    numUpper = upperRawMod || 8;
    numLower = lowerRawMod || 8;
    numMoving = movingRawMod || 6;

    basis = {
      mode: 'numbers',
      methodZh: '站内数字直取规则（三正整数分别取上卦、下卦、动爻）',
      methodEn: 'Site Three-Number Rule (direct positive integers for Upper, Lower, Moving Line)',
      inputNumbers: [rawUpper, rawLower, rawMoving],
      remainders: {
        upper: numUpper,
        lower: numLower,
        moving: numMoving,
        upperRawMod,
        lowerRawMod,
        movingRawMod
      },
      conventionNoteZh: '本模式为站内快捷数字规则（三数分别对 8、8、6 取余，余 0 取 8 或 6），并非《梅花易数》经典“二数加时取动爻”法。',
      conventionNoteEn: 'This mode uses the site direct three-number rule (modulo 8, 8, 6 with 0 mapped to 8 or 6), rather than the classical two-number-plus-hour method.'
    };
  } else {
    if (!Number.isFinite(targetDate.getTime())) {
      throw new RangeError('Invalid target date for Meihua time casting.');
    }
    const beijing = new Date(targetDate.getTime() + BEIJING_OFFSET_MS);
    const wallIso = beijing.toISOString().slice(0, 19);
    if (wallIso < MEIHUA_TIME_MIN || wallIso > MEIHUA_TIME_MAX) {
      throw new RangeError('Target date outside supported Meihua range (1900-2100).');
    }

    // 固定使用北京时间 (UTC+08:00) 口径，脱离宿主设备时区；遵循《梅花易数》卷一「年月日時起例」
    const solar = Solar.fromYmdHms(
      beijing.getUTCFullYear(),
      beijing.getUTCMonth() + 1,
      beijing.getUTCDate(),
      beijing.getUTCHours(),
      beijing.getUTCMinutes(),
      beijing.getUTCSeconds()
    );
    const lunar = solar.getLunar();

    const yearBranchIndex = lunar.getYearZhiIndex(); // 0=子..11=亥 (农历正月初一换年)
    const yearBranchNum = yearBranchIndex + 1; // 1..12
    const yearBranch = BRANCHES[yearBranchIndex];
    const yearGanZhi = lunar.getYearInGanZhi();

    const rawLunarMonth = lunar.getMonth();
    const isLeapMonth = rawLunarMonth < 0;
    const lunarMonth = Math.abs(rawLunarMonth);
    const lunarMonthZh = lunar.getMonthInChinese() + '月';
    const lunarDay = lunar.getDay();
    const lunarDayZh = lunar.getDayInChinese();

    const hourBranchIndex = lunar.getTimeZhiIndex(); // 0=子..11=亥 (23:00-00:59 为子时)
    const hourBranchNum = hourBranchIndex + 1; // 1..12
    const hourBranch = BRANCHES[hourBranchIndex];

    const sumUpper = yearBranchNum + lunarMonth + lunarDay;
    const sumLower = sumUpper + hourBranchNum;
    const upperRawMod = sumUpper % 8;
    const lowerRawMod = sumLower % 8;
    const movingRawMod = sumLower % 6;

    numUpper = upperRawMod || 8;
    numLower = lowerRawMod || 8;
    numMoving = movingRawMod || 6;

    basis = {
      mode: 'time',
      methodZh: '《梅花易数》卷一「年月日时起例」（北京时间 UTC+08:00）',
      methodEn: 'Meihua Yishu Vol. 1 Time Method (Beijing Time UTC+08:00)',
      beijingTime: wallIso.replace('T', ' '),
      lunarYearGanZhi: yearGanZhi,
      yearBranch,
      yearBranchEn: BRANCHES_EN[yearBranch] || yearBranch,
      yearBranchNum,
      lunarMonth,
      lunarMonthZh,
      isLeapMonth,
      lunarDay,
      lunarDayZh,
      hourBranch,
      hourBranchEn: BRANCHES_EN[hourBranch] || hourBranch,
      hourBranchNum,
      sumUpper,
      sumLower,
      remainders: {
        upper: numUpper,
        lower: numLower,
        moving: numMoving,
        upperRawMod,
        lowerRawMod,
        movingRawMod
      },
      conventionNoteZh: '口径：固定北京时间（UTC+08:00）；年支按农历正月初一换年（子1至亥12），月日取农历实数（闰月按本月数计），23:00–00:59 作子时（1）且归当日，余 0 取 8（卦）或 6（爻）。',
      conventionNoteEn: 'Convention: fixed Beijing time (UTC+08:00); year branch follows the lunar new year (Zi=1 to Hai=12), month/day use lunar numbers (leap month uses its base month number), 23:00–00:59 is Zi hour (1) on the same day, remainder 0 resolves to 8 (trigram) or 6 (line).'
    };
  }

  const upperIndex = ((numUpper - 1) % 8) + 1;
  const lowerIndex = ((numLower - 1) % 8) + 1;
  const movingLine = ((numMoving - 1) % 6) + 1; // 1 to 6

  const upperTri = TRIGRAMS[upperIndex];
  const lowerTri = TRIGRAMS[lowerIndex];
  const primaryName = HEXAGRAM_NAMES[`${upperIndex}_${lowerIndex}`] || `${upperTri.nameZh}${lowerTri.natureZh}`;

  // 6 爻组合：初爻到六爻 (从下至上)
  const allLines = [...lowerTri.lines, ...upperTri.lines];

  // 体用判定：动爻所在为用卦，不动者为体卦
  const isMovingInLower = movingLine <= 3;
  const bodyTri = isMovingInLower ? upperTri : lowerTri;
  const useTri = isMovingInLower ? lowerTri : upperTri;

  // 变卦：动爻阴阳翻转
  const changedLines = [...allLines];
  changedLines[movingLine - 1] = !changedLines[movingLine - 1];

  const changedLower = trigramFromLines([changedLines[0], changedLines[1], changedLines[2]]);
  const changedUpper = trigramFromLines([changedLines[3], changedLines[4], changedLines[5]]);
  const changedName = HEXAGRAM_NAMES[`${changedUpper.number}_${changedLower.number}`] || "变卦显化";
  const changedUseTri = isMovingInLower ? changedLower : changedUpper;

  // 《梅花易数》卷一〈互卦起例〉：乾坤取变卦之互，其余取本卦之互。
  const mutualUsesTransformed = upperIndex === lowerIndex && (upperIndex === 1 || upperIndex === 8);
  const mutualLines = mutualUsesTransformed ? changedLines : allLines;
  const mutualLower = trigramFromLines([mutualLines[1], mutualLines[2], mutualLines[3]]);
  const mutualUpper = trigramFromLines([mutualLines[2], mutualLines[3], mutualLines[4]]);
  const mutualName = HEXAGRAM_NAMES[`${mutualUpper.number}_${mutualLower.number}`];

  const comparisons: StageComparison[] = [
    compareBodyToTarget(bodyTri, useTri, 'primary_use'),
    compareBodyToTarget(bodyTri, mutualUpper, 'mutual_upper'),
    compareBodyToTarget(bodyTri, mutualLower, 'mutual_lower'),
    compareBodyToTarget(bodyTri, changedUseTri, 'transformed_use')
  ];
  const synthesis = buildSynthesis(comparisons);

  const assessments: MeihuaAssessments = {
    seasonal: {
      status: 'not_assessed',
      hasDateContext: mode === 'time',
      labelZh: '时令旺衰：未评估',
      labelEn: 'Seasonal Qi Strength: Not Assessed',
      reasonZh:
        mode === 'numbers'
          ? '数字起卦未提供日期与节气时令，无法判定体用八卦之四时旺衰，已按未评估标明。'
          : '已记录起卦时间（北京时间 / 农历月日），但本工具尚未内置经核验的节气四时旺衰映射，请另行核对春木、夏火、秋金、冬水及四季土旺衰。',
      reasonEn:
        mode === 'numbers'
          ? 'Numerical entry has no date or seasonal context; seasonal Qi strength is explicitly not assessed.'
          : 'Cast time is recorded, but a verified solar-term seasonal Qi mapping is not yet implemented here; seasonal strength is not assessed.'
    },
    externalOmens: {
      status: 'not_assessed',
      labelZh: '外应（三要十应）：未评估',
      labelEn: 'External Omens (Three Essentials & Ten Responses): Not Assessed',
      reasonZh: '未采集占时现场声色物象与具体人事背景，三要十应未纳入本推演。',
      reasonEn: 'On-site sensory omens and situational context are not captured in this tool and are not assessed.'
    }
  };

  // 按自下而上的二进制爻线查文王六十四卦。
  const primaryBinary = allLines.map(b => (b ? '1' : '0')).join('');
  const primaryEntry = lookupEntryByBinary(primaryBinary);
  const mutualBinary = [...mutualLower.lines, ...mutualUpper.lines].map(b => (b ? '1' : '0')).join('');
  const mutualEntry = lookupEntryByBinary(mutualBinary);
  const changedBinary = changedLines.map(b => (b ? '1' : '0')).join('');
  const changedEntry = lookupEntryByBinary(changedBinary);

  const ichingCanon: MeihuaIChingCanon = {
    primary: {
      number: primaryEntry.number,
      nameZh: primaryEntry.nameZh,
      nameEn: primaryEntry.nameEn,
      judgmentZh: primaryEntry.judgmentZh,
      imageZh: primaryEntry.imageZh
    },
    transformed: {
      number: changedEntry.number,
      nameZh: changedEntry.nameZh,
      nameEn: changedEntry.nameEn,
      judgmentZh: changedEntry.judgmentZh,
      imageZh: changedEntry.imageZh
    },
    movingLineNumber: movingLine,
    movingLineText: LINE_TEXTS[primaryEntry.number]?.[movingLine] ?? null
  };

  return {
    question: question || "当前关键决策与事态走向",
    castMode: mode,
    numbers: [numUpper, numLower, numMoving],
    basis,
    primaryHexagram: {
      upper: upperTri,
      lower: lowerTri,
      fullNameZh: primaryName,
      fullNameEn: `${primaryEntry.nameEn} (${upperTri.natureEn || upperTri.nameEn} over ${lowerTri.natureEn || lowerTri.nameEn})`,
      symbol: hexagramSymbol(primaryEntry.number),
      lines: allLines
    },
    movingLine,
    bodyTrigram: {
      trigram: bodyTri,
      position: isMovingInLower ? "upper" : "lower",
      role: "体卦 (我方/所占之事)",
      roleEn: "Body (Self / Subject)"
    },
    applicationTrigram: {
      trigram: useTri,
      position: isMovingInLower ? "lower" : "upper",
      role: "用卦 (事态/对方境遇)",
      roleEn: "Application (Situation / Object)"
    },
    mutualHexagram: {
      basis: mutualUsesTransformed ? 'transformed' : 'primary',
      upper: mutualUpper,
      lower: mutualLower,
      fullNameZh: mutualName,
      fullNameEn: `${mutualEntry.nameEn} (${mutualUpper.natureEn || mutualUpper.nameEn} over ${mutualLower.natureEn || mutualLower.nameEn})`,
      symbol: hexagramSymbol(mutualEntry.number),
      summaryZh: mutualUsesTransformed
        ? '乾、坤按卷一〈互卦起例〉从变卦取互。下互取二至四爻，上互取三至五爻。'
        : '下互取本卦二至四爻，上互取本卦三至五爻。传统体用法以互卦对照中段。',
      summaryEn: mutualUsesTransformed
        ? 'For Qian and Kun, Vol. 1 takes the nuclear trigrams from the transformed hexagram: lines 2–4 below and 3–5 above.'
        : 'The lower nuclear trigram uses original lines 2–4 and the upper uses lines 3–5. The traditional method compares them with Body for the intermediate stage.'
    },
    transformedHexagram: {
      upper: changedUpper,
      lower: changedLower,
      fullNameZh: changedName,
      fullNameEn: `${changedEntry.nameEn} (${changedUpper.natureEn || changedUpper.nameEn} over ${changedLower.natureEn || changedLower.nameEn})`,
      symbol: hexagramSymbol(changedEntry.number),
      changedApplication: changedUseTri,
      summaryZh: `动爻引动显化为变卦【${changedName}】，反映动后新用与后续回应。`,
      summaryEn: `The moving line shifts the application trigram into the transformed hexagram, representing the later response.`
    },
    synthesis,
    assessments,
    ichingCanon
  };
}
