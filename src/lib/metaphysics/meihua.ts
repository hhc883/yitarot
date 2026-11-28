import { Solar } from "lunar-typescript";
import { findMatchingMeihuaCase, getTrigramImagery, type MeihuaCaseEntry, type TrigramWanwuDetail } from '@/lib/kb/meihua';
import { lookupEntryByBinary } from './hexagrams64';

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

export type MeihuaCastMode = "time" | "hour_minute" | "numbers" | "random" | "text" | "hexagram" | "six_lines";

export interface MeihuaOptions {
  /** 指定起卦时间（默认当前北京时间） */
  date?: Date;
  /** 文字起卦文本 */
  text?: string;
  /** 直接指定上下卦与动爻 */
  hexagram?: { upper: number; lower: number; movingLine: number };
  /** 时分起卦法：1=时数求上/分数求下/时+分求动爻；2=时个+十求上/分个+十求下/相加求动爻 */
  hourMinuteMethod?: 1 | 2;
  /** 两数/三数起卦是否加时辰数 */
  addHour?: boolean;
  /** 三数起卦法：1=一上二下三动爻；2=一上、二三下、一二三动爻 */
  threeNumMethod?: 1 | 2;
  /** 自选六爻（自下而上 true=阳, false=阴）与动爻（1..6） */
  sixLines?: { lines: [boolean, boolean, boolean, boolean, boolean, boolean]; movingLine: number };
}

export interface MeihuaRefHexagram {
  upper: TrigramInfo;
  lower: TrigramInfo;
  fullNameZh: string;
  fullNameEn?: string;
  lines: boolean[];
}

export interface MeihuaDivinationResult {
  question: string;
  castMode: MeihuaCastMode;
  numbers: [number, number, number];
  /** 农历时间起卦详情（time 模式或参考时间） */
  lunarTimeInfo?: {
    yearZhi: string;
    yearNum: number;
    lunarMonth: number;
    lunarDay: number;
    hourZhi: string;
    hourNum: number;
    lunarDateText: string;
  };
  /** 随机起卦生成的 6 爻 0/1 序列（自下而上） */
  randomYaoBits?: (0 | 1)[];
  /** 起卦四柱干支、旬空与纳音 */
  ganZhiInfo?: {
    year: string;
    month: string;
    day: string;
    hour: string;
    yearKong: string;
    monthKong: string;
    dayKong: string;
    hourKong: string;
    yearNaYin: string;
    monthNaYin: string;
    dayNaYin: string;
    hourNaYin: string;
  };
  /** 错卦（[参I]：六爻全反） */
  cuoGua?: MeihuaRefHexagram;
  /** 综卦（[参II]：六爻倒置） */
  zongGua?: MeihuaRefHexagram;
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
  };
  applicationTrigram: {
    trigram: TrigramInfo;
    position: "upper" | "lower";
    role: "用卦 (事态/对方境遇)";
  };
  mutualHexagram: {
    upper: TrigramInfo;
    lower: TrigramInfo;
    fullNameZh: string;
    fullNameEn?: string;
    summaryZh: string;
    summaryEn?: string;
  };
  transformedHexagram: {
    upper: TrigramInfo;
    lower: TrigramInfo;
    fullNameZh: string;
    fullNameEn?: string;
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

const BRANCH_NUM_MAP: Record<string, number> = {
  子: 1, 丑: 2, 寅: 3, 卯: 4, 辰: 5, 巳: 6,
  午: 7, 未: 8, 申: 9, 酉: 10, 戌: 11, 亥: 12,
};

const BEIJING_OFFSET_MS = 8 * 60 * 60 * 1000;

function getBeijingLunar(targetDate: Date = new Date()) {
  const bj = new Date(targetDate.getTime() + BEIJING_OFFSET_MS);
  const solar = Solar.fromYmdHms(
    bj.getUTCFullYear(),
    bj.getUTCMonth() + 1,
    bj.getUTCDate(),
    bj.getUTCHours(),
    bj.getUTCMinutes(),
    bj.getUTCSeconds()
  );
  return solar.getLunar();
}

/**
 * 梅花易数核心推演函数（对标传统农历时空 / 报数 / 随机 / 文字 / 指定卦）
 */
export function divineMeihua(
  question: string,
  mode: MeihuaCastMode = "time",
  customNumbers?: [number, number, number] | [number, number],
  options: MeihuaOptions = {}
): MeihuaDivinationResult {
  let numUpper = 1;
  let numLower = 1;
  let numMoving = 1;
  const lunar = getBeijingLunar(options.date ?? new Date());
  const ec = lunar.getEightChar();
  const yearZhi = lunar.getYearZhiExact();
  const yearNum = BRANCH_NUM_MAP[yearZhi] ?? 1;
  const lunarMonth = Math.abs(lunar.getMonth());
  const lunarDay = lunar.getDay();
  const hourZhi = lunar.getTimeZhi();
  const hourNum = BRANCH_NUM_MAP[hourZhi] ?? 1;

  const lunarTimeInfo: MeihuaDivinationResult["lunarTimeInfo"] = {
    yearZhi,
    yearNum,
    lunarMonth,
    lunarDay,
    hourZhi,
    hourNum,
    lunarDateText: `${lunar.getYearInGanZhiExact()}年 ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()} ${hourZhi}时`,
  };
  const ganZhiInfo: MeihuaDivinationResult["ganZhiInfo"] = {
    year: ec.getYear(),
    month: ec.getMonth(),
    day: ec.getDay(),
    hour: ec.getTime(),
    yearKong: ec.getYearXunKong(),
    monthKong: ec.getMonthXunKong(),
    dayKong: ec.getDayXunKong(),
    hourKong: ec.getTimeXunKong(),
    yearNaYin: ec.getYearNaYin(),
    monthNaYin: ec.getMonthNaYin(),
    dayNaYin: ec.getDayNaYin(),
    hourNaYin: ec.getTimeNaYin(),
  };

  let randomYaoBits: (0 | 1)[] | undefined;

  if (mode === "numbers" && customNumbers) {
    const n1 = Math.max(1, Math.abs(Math.trunc(customNumbers[0])));
    const n2 = Math.max(1, Math.abs(Math.trunc(customNumbers[1])));
    const n3 = customNumbers[2] && customNumbers[2] > 0 ? Math.trunc(customNumbers[2]) : 0;
    const extraHour = options.addHour ? hourNum : 0;

    if (n3 > 0 && options.threeNumMethod === 2) {
      // 三数方法二：一数求上卦，二三数之和求下卦，一二三数之和(+时辰)求动爻
      numUpper = (n1 % 8) || 8;
      numLower = ((n2 + n3) % 8) || 8;
      numMoving = ((n1 + n2 + n3 + extraHour) % 6) || 6;
    } else if (n3 > 0) {
      // 三数方法一：一数上、二数下、三数(+时辰)动爻
      numUpper = (n1 % 8) || 8;
      numLower = (n2 % 8) || 8;
      numMoving = ((n3 + extraHour) % 6) || 6;
    } else {
      // 两数：一数上、二数下，两数之和(+时辰)求动爻
      numUpper = (n1 % 8) || 8;
      numLower = (n2 % 8) || 8;
      numMoving = ((n1 + n2 + extraHour) % 6) || 6;
    }
  } else if (mode === "hour_minute") {
    const bj = new Date((options.date ?? new Date()).getTime() + BEIJING_OFFSET_MS);
    const hh = bj.getUTCHours();
    const mm = bj.getUTCMinutes();
    if (options.hourMinuteMethod === 2) {
      const sH = Math.floor(hh / 10) + (hh % 10);
      const sM = Math.floor(mm / 10) + (mm % 10);
      numUpper = (sH % 8) || 8;
      numLower = (sM % 8) || 8;
      numMoving = ((sH + sM) % 6) || 6;
    } else {
      numUpper = (hh % 8) || 8;
      numLower = (mm % 8) || 8;
      numMoving = ((hh + mm) % 6) || 6;
    }
  } else if (mode === "six_lines" && options.sixLines) {
    const ls = options.sixLines.lines;
    const lowerTri = trigramFromLines([ls[0], ls[1], ls[2]]);
    const upperTri = trigramFromLines([ls[3], ls[4], ls[5]]);
    numUpper = upperTri.number;
    numLower = lowerTri.number;
    numMoving = ((Math.trunc(options.sixLines.movingLine) - 1 + 600) % 6) + 1;
  } else if (mode === "random") {
    // 生成长度为 6 的 0/1 列表（自下而上：初爻到上爻）
    randomYaoBits = Array.from({ length: 6 }, () => (Math.random() >= 0.5 ? 1 : 0)) as (0 | 1)[];
    const lowerTri = trigramFromLines([randomYaoBits[0] === 1, randomYaoBits[1] === 1, randomYaoBits[2] === 1]);
    const upperTri = trigramFromLines([randomYaoBits[3] === 1, randomYaoBits[4] === 1, randomYaoBits[5] === 1]);
    numUpper = upperTri.number;
    numLower = lowerTri.number;
    numMoving = Math.floor(Math.random() * 6) + 1;
  } else if (mode === "text") {
    const raw = (options.text || question || "梅花").replace(/\s+/g, "");
    const chars = Array.from(raw.length > 0 ? raw : "梅花");
    const mid = Math.max(1, Math.floor(chars.length / 2));
    const left = chars.slice(0, mid);
    const right = chars.slice(mid);
    const charWeight = (arr: string[]) =>
      arr.reduce((acc, ch) => acc + ((ch.codePointAt(0) ?? 1) % 64 || 1), 0);
    const sumL = charWeight(left);
    const sumR = charWeight(right.length > 0 ? right : left);
    numUpper = (sumL % 8) || 8;
    numLower = (sumR % 8) || 8;
    numMoving = ((sumL + sumR) % 6) || 6;
  } else if (mode === "hexagram" && options.hexagram) {
    numUpper = ((Math.trunc(options.hexagram.upper) - 1 + 800) % 8) + 1;
    numLower = ((Math.trunc(options.hexagram.lower) - 1 + 800) % 8) + 1;
    numMoving = ((Math.trunc(options.hexagram.movingLine) - 1 + 600) % 6) + 1;
  } else {
    // 传统梅花农历时间起卦：(年支 + 农历月 + 农历日) % 8 为上卦，加时支 % 8 为下卦，总数 % 6 为动爻
    const sumA = yearNum + lunarMonth + lunarDay;
    const sumB = sumA + hourNum;

    numUpper = (sumA % 8) || 8;
    numLower = (sumB % 8) || 8;
    numMoving = (sumB % 6) || 6;
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
  const changedBinary = changedLines.map(b => (b ? '1' : '0')).join('');
  const changedEntry = lookupEntryByBinary(changedBinary);

  const classicCase = findMatchingMeihuaCase(primaryEntry.number, changedEntry.number);
  const trigramImagery = {
    body: getTrigramImagery(bodyTri.nameZh),
    application: getTrigramImagery(useTri.nameZh)
  };

  // 错卦（[参I]：六爻阴阳全反）与 综卦（[参II]：六爻倒置）
  const cuoLines = allLines.map((b) => !b);
  const cuoLower = trigramFromLines([cuoLines[0], cuoLines[1], cuoLines[2]]);
  const cuoUpper = trigramFromLines([cuoLines[3], cuoLines[4], cuoLines[5]]);
  const cuoName = HEXAGRAM_NAMES[`${cuoUpper.number}_${cuoLower.number}`] || "错卦";

  const zongLines = [...allLines].reverse();
  const zongLower = trigramFromLines([zongLines[0], zongLines[1], zongLines[2]]);
  const zongUpper = trigramFromLines([zongLines[3], zongLines[4], zongLines[5]]);
  const zongName = HEXAGRAM_NAMES[`${zongUpper.number}_${zongLower.number}`] || "综卦";

  return {
    question: question || "当前关键决策与事态走向",
    castMode: mode,
    numbers: [numUpper, numLower, numMoving],
    lunarTimeInfo,
    ganZhiInfo,
    randomYaoBits,
    cuoGua: {
      upper: cuoUpper,
      lower: cuoLower,
      fullNameZh: cuoName,
      fullNameEn: `${cuoUpper.nameEn || cuoUpper.nameZh} over ${cuoLower.nameEn || cuoLower.nameZh}`,
      lines: cuoLines,
    },
    zongGua: {
      upper: zongUpper,
      lower: zongLower,
      fullNameZh: zongName,
      fullNameEn: `${zongUpper.nameEn || zongUpper.nameZh} over ${zongLower.nameEn || zongLower.nameZh}`,
      lines: zongLines,
    },
    primaryHexagram: {
      upper: upperTri,
      lower: lowerTri,
      fullNameZh: primaryName,
      fullNameEn: `${upperTri.nameEn || upperTri.nameZh} over ${lowerTri.nameEn || lowerTri.nameZh}`,
      symbol: `䷀`,
      lines: allLines
    },
    movingLine,
    bodyTrigram: {
      trigram: bodyTri,
      position: isMovingInLower ? "upper" : "lower",
      role: "体卦 (我方/所占之事)"
    },
    applicationTrigram: {
      trigram: useTri,
      position: isMovingInLower ? "lower" : "upper",
      role: "用卦 (事态/对方境遇)"
    },
    mutualHexagram: {
      upper: mutualUpper,
      lower: mutualLower,
      fullNameZh: mutualName,
      fullNameEn: `${mutualUpper.nameEn || mutualUpper.nameZh} over ${mutualLower.nameEn || mutualLower.nameZh}`,
      summaryZh: `互卦见【${mutualName}】，反映事态中间阶段的暗流隐动与转折关口。`,
      summaryEn: `Nuclear hexagram reveals underlying dynamics and transitional nuances of the development stage.`
    },
    transformedHexagram: {
      upper: changedUpper,
      lower: changedLower,
      fullNameZh: changedName,
      fullNameEn: `${changedUpper.nameEn || changedUpper.nameZh} over ${changedLower.nameEn || changedLower.nameZh}`,
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
