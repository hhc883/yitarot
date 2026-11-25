import { Solar } from 'lunar-typescript';
import { findMatchingMeihuaCase, getTrigramImagery, type MeihuaCaseEntry, type TrigramWanwuDetail } from '@/lib/kb/meihua';
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
  wuxingRelation: {
    type: "use_generates_body" | "body_overcomes_use" | "same" | "body_generates_use" | "use_overcomes_body";
    levelZh: "大吉" | "中吉" | "平顺" | "耗神" | "遇阻";
    levelEn?: string;
    headlineZh: string;
    headlineEn?: string;
    analysisZh: string;
    analysisEn?: string;
  };
  decisionActionZh: {
    verdict: string; // 直决断语
    suitable: string[]; // 宜
    unsuitable: string[]; // 忌
    tacticalAdvice: string; // 战术策略
  };
  decisionActionEn?: {
    verdict: string;
    suitable: string[];
    unsuitable: string[];
    tacticalAdvice: string;
  };
  /** 邵康节《梅花易数》经典实战卦例（若命中） */
  classicCase?: MeihuaCaseEntry;
  /** 体用八卦万物类象（《梅花易数》伏羲先天类象） */
  trigramImagery?: {
    body?: TrigramWanwuDetail;
    application?: TrigramWanwuDetail;
  };
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

  // 互卦：二三四爻为下互，三四五爻为上互
  const mutualLower = trigramFromLines([allLines[1], allLines[2], allLines[3]]);
  const mutualUpper = trigramFromLines([allLines[2], allLines[3], allLines[4]]);
  const mutualName = HEXAGRAM_NAMES[`${mutualUpper.number}_${mutualLower.number}`] || "互卦成形";

  // 变卦：动爻阴阳翻转
  const changedLines = [...allLines];
  changedLines[movingLine - 1] = !changedLines[movingLine - 1];

  const changedLower = trigramFromLines([changedLines[0], changedLines[1], changedLines[2]]);
  const changedUpper = trigramFromLines([changedLines[3], changedLines[4], changedLines[5]]);
  const changedName = HEXAGRAM_NAMES[`${changedUpper.number}_${changedLower.number}`] || "变卦显化";
  const changedUseTri = isMovingInLower ? changedLower : changedUpper;

  // 五行体用生克分析
  const bEl = bodyTri.element;
  const uEl = useTri.element;

  let relationType: "use_generates_body" | "body_overcomes_use" | "same" | "body_generates_use" | "use_overcomes_body" = "same";
  let levelZh: "大吉" | "中吉" | "平顺" | "耗神" | "遇阻" = "平顺";
  let levelEn = "Peaceful & Harmonious";
  let headlineZh = "体用比和 · 和合共赢";
  let headlineEn = "Body & Application in Concord · Mutual Harmony";
  let analysisZh = `体卦【${bodyTri.nameZh}】与用卦【${useTri.nameZh}】同属【${bodyTri.elementZh}】，双方气场同频，利于合作商议，无外界克制。`;
  let analysisEn = `Body [${bodyTri.nameEn || bodyTri.nameZh}] and Application [${useTri.nameEn || useTri.nameZh}] share element ${bodyTri.element}. Energetic frequency aligns with zero external clash.`;
  let verdict = "事态平稳顺畅，顺理成章推进即可。";
  let verdictEn = "Conditions are smooth and balanced. Proceed steadily according to original plans.";
  let suitable = ["商议协作", "按部就班推进既定方案", "稳健决策"];
  let suitableEn = ["Consultative collaboration", "Step-by-step rollout", "Prudent agreements"];
  let unsuitable = ["盲目激进拓展", "与合伙人内耗互疑"];
  let unsuitableEn = ["Aggressive over-expansion", "Unnecessary internal friction"];
  let tacticalAdvice = "保持沉着公允，尊重共识原则。此卦利于合作共赢，切莫贪功冒进。";
  let tacticalAdviceEn = "Remain composed and fair, adhering to consensus. This reading favors partnership harmony; avoid rash haste.";

  if (ELEMENT_GENERATION[uEl] === bEl) {
    relationType = "use_generates_body";
    levelZh = "大吉";
    levelEn = "Great Auspiciousness";
    headlineZh = "用生体卦 · 顺水推舟";
    headlineEn = "Application Generates Body · Natural Flow";
    analysisZh = `用卦【${useTri.nameZh}（${useTri.elementZh}）】生助体卦【${bodyTri.nameZh}（${bodyTri.elementZh}）】。外部环境与合作方主动助力，水到渠成！`;
    analysisEn = `Application [${useTri.nameEn || useTri.nameZh}] actively generates Body [${bodyTri.nameEn || bodyTri.nameZh}]. External environment and allies lend powerful tailwinds.`;
    verdict = "大吉大利！所问之事逢外界贵人或时势生助，宜大胆决断。";
    verdictEn = "Exceptional fortune! Your undertaking enjoys natural sponsor support; execute boldly.";
    suitable = ["主动出击", "提交重要申请/签约", "推动核心谈判", "开启新项目"];
    suitableEn = ["Take initiative", "Submit key contracts & filings", "Lead core negotiations", "Launch strategic initiatives"];
    unsuitable = ["优柔寡断错失窗口期", "过分谦退推卸责任"];
    unsuitableEn = ["Hesitating and missing the window", "Excessive modesty that delays action"];
    tacticalAdvice = "乘势而上，迅速敲定关键条款，借外力成就自身目标。";
    tacticalAdviceEn = "Ride the momentum; finalize critical terms promptly and leverage external support.";
  } else if (ELEMENT_OVERCOMING[bEl] === uEl) {
    relationType = "body_overcomes_use";
    levelZh = "中吉";
    levelEn = "Favorable Progress";
    headlineZh = "体克用卦 · 劳而有成";
    headlineEn = "Body Overcomes Application · Disciplined Mastery";
    analysisZh = `体卦【${bodyTri.nameZh}（${bodyTri.elementZh}）】克制用卦【${useTri.nameZh}（${useTri.elementZh}）】。主导权在我方手中，需付出一份努力方克全功。`;
    analysisEn = `Body [${bodyTri.nameEn || bodyTri.nameZh}] overcomes Application [${useTri.nameEn || useTri.nameZh}]. Initiative rests firmly in your hands; diligent effort ensures achievement.`;
    verdict = "中吉。事情掌握在你手中，虽然前期需多费心血调和，终能得偿所愿。";
    verdictEn = "Favorable. You hold the steering wheel; though initial coordination requires work, target will be met.";
    suitable = ["攻坚克难", "主动确立规矩", "严格把控验收标准", "强化执行落地"];
    suitableEn = ["Overcome technical bottlenecks", "Set firm protocols", "Enforce strict quality criteria", "Drive execution"];
    unsuitable = ["躺平被动等待", "轻易向不合理要求妥协"];
    unsuitableEn = ["Passive procrastination", "Compromising on vital standards"];
    tacticalAdvice = "保持清晰底线，事必躬亲抓牢关键环节。";
    tacticalAdviceEn = "Hold clear boundaries; personally safeguard mission-critical milestones.";
  } else if (ELEMENT_GENERATION[bEl] === uEl) {
    relationType = "body_generates_use";
    levelZh = "耗神";
    levelEn = "Resource Drainage";
    headlineZh = "体生用卦 · 泄气多耗";
    headlineEn = "Body Generates Application · Energy Drainage";
    analysisZh = `体卦【${bodyTri.nameZh}（${bodyTri.elementZh}）】生泄用卦【${useTri.nameZh}（${useTri.elementZh}）】。付出远大于回馈，需谨防精力或资金被动消耗。`;
    analysisEn = `Body [${bodyTri.nameEn || bodyTri.nameZh}] pours energy into Application [${useTri.nameEn || useTri.nameZh}]. Output outpaces yield; conserve reserves carefully.`;
    verdict = "耗神劳心。当下推进此事成本偏高、周期较长，不宜孤注一掷。";
    verdictEn = "Energy-draining. Advancing now involves high overhead and extended duration; avoid speculative all-in moves.";
    suitable = ["设好止损线", "复盘精简流程", "休养生息蓄力"];
    suitableEn = ["Establish strict stop-loss caps", "Streamline overhead", "Rest and consolidate strength"];
    unsuitable = ["无底线追加投入", "大包大揽替人兜底"];
    unsuitableEn = ["Unbounded capital injections", "Over-promising and underwriting external debts"];
    tacticalAdvice = "适当收缩防线，只做核心最小可行性尝试，避免战线拉得太长。";
    tacticalAdviceEn = "Consolidate defensive lines; limit testing to lightweight MVPs and avoid overextending.";
  } else if (ELEMENT_OVERCOMING[uEl] === bEl) {
    relationType = "use_overcomes_body";
    levelZh = "遇阻";
    levelEn = "Obstacle & Prudence";
    headlineZh = "用克体卦 · 逆风需守";
    headlineEn = "Application Overcomes Body · Strategic Defense";
    analysisZh = `用卦【${useTri.nameZh}（${useTri.elementZh}）】克制体卦【${bodyTri.nameZh}（${bodyTri.elementZh}）】。外部环境或对方带来较强压制阻力，不宜硬碰。`;
    analysisEn = `Application [${useTri.nameEn || useTri.nameZh}] clashes with Body [${bodyTri.nameEn || bodyTri.nameZh}]. External headwinds are pronounced; direct confrontation is inadvisable.`;
    verdict = "需谨慎避险。当下阻力较强，宜避其锋芒、以守为攻。";
    verdictEn = "Exercise prudent caution. Friction is notable; sidestep direct conflict and defend core foundations.";
    suitable = ["静观其变", "补全漏洞资质", "咨询资深智囊", "推迟重大拍板"];
    suitableEn = ["Observe developments quietly", "Audit structural vulnerabilities", "Seek expert advisors", "Defer major signatures"];
    unsuitable = ["情绪化正面交锋", "仓促签订重大法律/金钱协议"];
    unsuitableEn = ["Emotional confrontations", "Rushing irreversible legal or financial covenants"];
    tacticalAdvice = "遇克当求通关，暂勿急于求成。静待时移世易，修整内在实力。";
    tacticalAdviceEn = "Find mediation rather than force. Cultivate internal fortitude until cosmic timing realigns.";
  }

  // 查文王 64 卦序号与匹配梅花历史经典卦案
  const primaryBinary = allLines.map(b => (b ? '1' : '0')).join('');
  const primaryEntry = lookupEntryByBinary(primaryBinary);
  const mutualBinary = [...mutualLower.lines, ...mutualUpper.lines].map(b => (b ? '1' : '0')).join('');
  const mutualEntry = lookupEntryByBinary(mutualBinary);
  const changedBinary = changedLines.map(b => (b ? '1' : '0')).join('');
  const changedEntry = lookupEntryByBinary(changedBinary);

  const classicCase = findMatchingMeihuaCase(primaryEntry.number, changedEntry.number);
  const trigramImagery = {
    body: getTrigramImagery(bodyTri.nameZh),
    application: getTrigramImagery(useTri.nameZh)
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
      upper: mutualUpper,
      lower: mutualLower,
      fullNameZh: mutualName,
      fullNameEn: `${mutualEntry.nameEn} (${mutualUpper.natureEn || mutualUpper.nameEn} over ${mutualLower.natureEn || mutualLower.nameEn})`,
      symbol: hexagramSymbol(mutualEntry.number),
      summaryZh: `互卦见【${mutualName}】，反映事态中间阶段的暗流隐动与转折关口。`,
      summaryEn: `Nuclear hexagram reveals underlying dynamics and transitional nuances of the development stage.`
    },
    transformedHexagram: {
      upper: changedUpper,
      lower: changedLower,
      fullNameZh: changedName,
      fullNameEn: `${changedEntry.nameEn} (${changedUpper.natureEn || changedUpper.nameEn} over ${changedLower.natureEn || changedLower.nameEn})`,
      symbol: hexagramSymbol(changedEntry.number),
      changedApplication: changedUseTri,
      summaryZh: `动爻引动显化为变卦【${changedName}】，预示后续最终归宿与定局气象。`,
      summaryEn: `The moving line triggers evolution into the transformed hexagram, indicating the final resolution.`
    },
    wuxingRelation: {
      type: relationType,
      levelZh,
      levelEn,
      headlineZh,
      headlineEn,
      analysisZh,
      analysisEn
    },
    decisionActionZh: {
      verdict,
      suitable,
      unsuitable,
      tacticalAdvice
    },
    decisionActionEn: {
      verdict: verdictEn,
      suitable: suitableEn,
      unsuitable: unsuitableEn,
      tacticalAdvice: tacticalAdviceEn
    },
    classicCase,
    trigramImagery
  };
}
