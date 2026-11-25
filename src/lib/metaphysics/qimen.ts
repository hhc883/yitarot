import { Solar } from "lunar-typescript";

type PalaceId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type OuterPalace = Exclude<PalaceId, 5>;
type Epoch = "上元" | "中元" | "下元";

export interface QimenPalace {
  palaceId: PalaceId;
  bagua: string;
  directionZh: string;
  directionEn: string;
  elementZh: string;
  elementEn: string;
  currentStar: string | null;
  currentStarEn: string | null;
  currentGate: string | null;
  currentGateEn: string | null;
  currentDeity: string | null;
  currentDeityEn: string | null;
  heavenStem: string | null;
  earthStem: string;
  companionStar: string | null;
  companionStem: string | null;
  isAuspiciousGate: boolean;
  /** Hour Xunkong (时旬空) Earthly Branches falling in this palace. */
  xunkongBranches: string[];
  xunkongBranchesEn: string[];
  /** Hour-branch Yi Ma (时支驿马) branch if it lands on this palace, otherwise null. */
  yimaBranch: string | null;
  yimaBranchEn: string | null;
}

export interface QimenYimaInfo {
  branch: string;
  branchEn: string;
  palace: OuterPalace;
  hourBranch: string;
  hourBranchEn: string;
  sanheGroup: string;
  sanheGroupEn: string;
}

export interface QimenChartResult {
  /** Beijing standard wall time (fixed UTC+08:00), independent of device timezone. */
  time: string;
  ganzhi: { year: string; month: string; day: string; hour: string };
  solarTermZh: string;
  solarTermEn: string;
  solarTermStart: string;
  epoch: Epoch;
  epochEn: string;
  dunType: "阳遁" | "阴遁";
  dunTypeEn: string;
  juNumber: number;
  cycleHead: string;
  /** Hour cycle head (时旬首), same as cycleHead, kept explicit alongside dayCycleHead. */
  hourCycleHead: string;
  /** Day cycle head (日旬首), used only for Chaibu five-day epoch selection. */
  dayCycleHead: string;
  /** Hour Xunkong (时旬空) two empty branches applied to the nine palaces. */
  hourXunkong: [string, string];
  hourXunkongEn: [string, string];
  /** Day Xunkong (日旬空), shown for reference only (not placed on the palaces). */
  dayXunkong: [string, string];
  dayXunkongEn: [string, string];
  /** Hour-branch Yi Ma (时支驿马) by the four Sanhe groups. */
  yima: QimenYimaInfo;
  zhifuStar: string;
  zhifuStarEn: string;
  zhifuPalace: OuterPalace;
  zhishiGate: string;
  zhishiGateEn: string;
  zhishiPalace: OuterPalace;
  palaces: QimenPalace[];
}

export const QIMEN_TIME_MIN = "1900-01-01T00:00:00";
export const QIMEN_TIME_MAX = "2100-12-31T23:59:59";

const BEIJING_OFFSET_MS = 8 * 60 * 60 * 1000;
const PALACES_ASC = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
const OUTER_RING = [1, 8, 3, 4, 9, 2, 7, 6] as const;
const CENTER_HOST = 2;
const STEMS = "甲乙丙丁戊己庚辛壬癸";
const BRANCHES = "子丑寅卯辰巳午未申酉戌亥";
const EARTH_STEMS = ["戊", "己", "庚", "辛", "壬", "癸", "丁", "丙", "乙"];
const CYCLE_HEADS = ["甲子", "甲戌", "甲申", "甲午", "甲辰", "甲寅"];
const BRANCH_EN: Record<string, string> = {
  子: "Zi", 丑: "Chou", 寅: "Yin", 卯: "Mao", 辰: "Chen", 巳: "Si",
  午: "Wu", 未: "Wei", 申: "Shen", 酉: "You", 戌: "Xu", 亥: "Hai",
};
const XUN_KONG_BRANCHES: readonly [string, string][] = [
  ["戌", "亥"],
  ["申", "酉"],
  ["午", "未"],
  ["辰", "巳"],
  ["寅", "卯"],
  ["子", "丑"],
];
const BRANCH_PALACE: Record<string, OuterPalace> = {
  子: 1, 丑: 8, 寅: 8, 卯: 3, 辰: 4, 巳: 4, 午: 9, 未: 2, 申: 2, 酉: 7, 戌: 6, 亥: 6,
};
const YIMA_RULES: Record<string, { branch: string; palace: OuterPalace; sanheGroup: string; sanheGroupEn: string }> = {
  申: { branch: "寅", palace: 8, sanheGroup: "申子辰", sanheGroupEn: "Shen-Zi-Chen" },
  子: { branch: "寅", palace: 8, sanheGroup: "申子辰", sanheGroupEn: "Shen-Zi-Chen" },
  辰: { branch: "寅", palace: 8, sanheGroup: "申子辰", sanheGroupEn: "Shen-Zi-Chen" },
  寅: { branch: "申", palace: 2, sanheGroup: "寅午戌", sanheGroupEn: "Yin-Wu-Xu" },
  午: { branch: "申", palace: 2, sanheGroup: "寅午戌", sanheGroupEn: "Yin-Wu-Xu" },
  戌: { branch: "申", palace: 2, sanheGroup: "寅午戌", sanheGroupEn: "Yin-Wu-Xu" },
  巳: { branch: "亥", palace: 6, sanheGroup: "巳酉丑", sanheGroupEn: "Si-You-Chou" },
  酉: { branch: "亥", palace: 6, sanheGroup: "巳酉丑", sanheGroupEn: "Si-You-Chou" },
  丑: { branch: "亥", palace: 6, sanheGroup: "巳酉丑", sanheGroupEn: "Si-You-Chou" },
  亥: { branch: "巳", palace: 4, sanheGroup: "亥卯未", sanheGroupEn: "Hai-Mao-Wei" },
  卯: { branch: "巳", palace: 4, sanheGroup: "亥卯未", sanheGroupEn: "Hai-Mao-Wei" },
  未: { branch: "巳", palace: 4, sanheGroup: "亥卯未", sanheGroupEn: "Hai-Mao-Wei" },
};

const PALACE = {
  1: { bagua: "坎", directionZh: "正北", directionEn: "North", elementZh: "水", elementEn: "Water", star: "天蓬", starEn: "Tianpeng", gate: "休门", gateEn: "Rest Gate" },
  2: { bagua: "坤", directionZh: "西南", directionEn: "Southwest", elementZh: "土", elementEn: "Earth", star: "天芮", starEn: "Tianrui", gate: "死门", gateEn: "Death Gate" },
  3: { bagua: "震", directionZh: "正东", directionEn: "East", elementZh: "木", elementEn: "Wood", star: "天冲", starEn: "Tianchong", gate: "伤门", gateEn: "Harm Gate" },
  4: { bagua: "巽", directionZh: "东南", directionEn: "Southeast", elementZh: "木", elementEn: "Wood", star: "天辅", starEn: "Tianfu", gate: "杜门", gateEn: "Hidden Gate" },
  5: { bagua: "中", directionZh: "中央", directionEn: "Center", elementZh: "土", elementEn: "Earth", star: "天禽", starEn: "Tianqin" },
  6: { bagua: "乾", directionZh: "西北", directionEn: "Northwest", elementZh: "金", elementEn: "Metal", star: "天心", starEn: "Tianxin", gate: "开门", gateEn: "Open Gate" },
  7: { bagua: "兑", directionZh: "正西", directionEn: "West", elementZh: "金", elementEn: "Metal", star: "天柱", starEn: "Tianzhu", gate: "惊门", gateEn: "Shock Gate" },
  8: { bagua: "艮", directionZh: "东北", directionEn: "Northeast", elementZh: "土", elementEn: "Earth", star: "天任", starEn: "Tianren", gate: "生门", gateEn: "Life Gate" },
  9: { bagua: "离", directionZh: "正南", directionEn: "South", elementZh: "火", elementEn: "Fire", star: "天英", starEn: "Tianying", gate: "景门", gateEn: "Scenery Gate" },
} as const;

const DEITIES = [
  ["值符", "Chief (Zhifu)"], ["螣蛇", "Soaring Snake"], ["太阴", "Great Yin"], ["六合", "Six Harmonies"],
  ["白虎", "White Tiger"], ["玄武", "Black Tortoise"], ["九地", "Nine Earth"], ["九天", "Nine Heaven"],
] as const;

// 《奇门遁甲统宗》卷一「阴阳二遁顺逆起例」：上、中、下元局数。
const TERMS = {
  冬至: ["Winter Solstice", 1, 7, 4],
  小寒: ["Minor Cold", 2, 8, 5],
  大寒: ["Major Cold", 3, 9, 6],
  立春: ["Start of Spring", 8, 5, 2],
  雨水: ["Rain Water", 9, 6, 3],
  惊蛰: ["Awakening of Insects", 1, 7, 4],
  春分: ["Spring Equinox", 3, 9, 6],
  清明: ["Clear and Bright", 4, 1, 7],
  谷雨: ["Grain Rain", 5, 2, 8],
  立夏: ["Start of Summer", 4, 1, 7],
  小满: ["Grain Buds", 5, 2, 8],
  芒种: ["Grain in Ear", 6, 3, 9],
  夏至: ["Summer Solstice", 9, 3, 6],
  小暑: ["Minor Heat", 8, 2, 5],
  大暑: ["Major Heat", 7, 1, 4],
  立秋: ["Start of Autumn", 2, 5, 8],
  处暑: ["End of Heat", 1, 4, 7],
  白露: ["White Dew", 9, 3, 6],
  秋分: ["Autumn Equinox", 7, 1, 4],
  寒露: ["Cold Dew", 6, 9, 3],
  霜降: ["Frost Descent", 5, 8, 2],
  立冬: ["Start of Winter", 6, 9, 3],
  小雪: ["Minor Snow", 5, 8, 2],
  大雪: ["Major Snow", 4, 7, 1],
} as const;
const YANG_TERMS = new Set([
  "冬至", "小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种",
]);
const EPOCHS = [
  ["上元", "Upper epoch"],
  ["中元", "Middle epoch"],
  ["下元", "Lower epoch"],
] as const;

function mod(index: number, length: number): number {
  return ((index % length) + length) % length;
}

function hostedPalace(id: PalaceId): OuterPalace {
  return id === 5 ? CENTER_HOST : id;
}

function cycleIndex(pillar: string): number {
  const stem = STEMS.indexOf(pillar[0]);
  const branch = BRANCHES.indexOf(pillar[1]);
  const index = Array.from({ length: 6 }, (_, group) => stem + group * 10).find(
    (index) => index % BRANCHES.length === branch,
  );
  if (stem < 0 || branch < 0 || index === undefined) throw new RangeError("Invalid sexagenary pillar.");
  return index;
}

function getEpochIndex(dayIndex: number): 0 | 1 | 2 {
  // 卷二「定三元法」：五日回溯至甲/己符头，由符头支决定三元。
  const headBranch = BRANCHES[Math.floor(dayIndex / 5) * 5 % BRANCHES.length];
  if ("子午卯酉".includes(headBranch)) return 0;
  if ("寅申巳亥".includes(headBranch)) return 1;
  return 2;
}

/** Parse a manually entered Beijing standard wall time without host timezone or rollover. */
export function parseQimenBeijingTime(input: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?$/.test(input)) return null;
  const wall = input.length === 16 ? input + ":00" : input;
  if (wall < QIMEN_TIME_MIN || wall > QIMEN_TIME_MAX) return null;
  const instant = new Date(wall + "+08:00");
  if (!Number.isFinite(instant.getTime())) return null;
  return new Date(instant.getTime() + BEIJING_OFFSET_MS).toISOString().slice(0, 19) === wall ? instant : null;
}

/** 时家转盘 · 拆补。按实际交节、北京时间 23:00 换日、天禽随天芮寄坤二。 */
export function calculateQimen(targetDate: Date = new Date()): QimenChartResult {
  const beijing = new Date(targetDate.getTime() + BEIJING_OFFSET_MS);
  const time = beijing.toISOString().slice(0, 19);
  if (time < QIMEN_TIME_MIN || time > QIMEN_TIME_MAX) throw new RangeError("Qimen date outside supported range.");

  // lunar-typescript's Solar fields represent Beijing wall time. Do not call Solar.fromDate,
  // which would instead pick up the device's local fields.
  const lunar = Solar.fromYmdHms(
    beijing.getUTCFullYear(), beijing.getUTCMonth() + 1, beijing.getUTCDate(),
    beijing.getUTCHours(), beijing.getUTCMinutes(), beijing.getUTCSeconds(),
  ).getLunar();
  const ganzhi = {
    year: lunar.getYearInGanZhiExact(),
    month: lunar.getMonthInGanZhiExact(),
    day: lunar.getDayInGanZhiExact(),
    hour: lunar.getTimeInGanZhi(),
  };

  const term = lunar.getPrevJieQi(false);
  const solarTermZh = term.getName();
  if (!Object.hasOwn(TERMS, solarTermZh)) throw new RangeError("Unsupported solar term.");
  const [solarTermEn, ...juByEpoch] = TERMS[solarTermZh as keyof typeof TERMS];
  const dayIndex = cycleIndex(ganzhi.day);
  const epochIndex = getEpochIndex(dayIndex);
  const [epoch, epochEn] = EPOCHS[epochIndex];
  const juNumber = juByEpoch[epochIndex];
  const yang = YANG_TERMS.has(solarTermZh);
  const sign = yang ? 1 : -1;

  // 阴遁逆排、阳遁顺排，以局数宫起戊。甲遁入对应旬首仪。
  const earthByPalace = PALACES_ASC.map((id) => EARTH_STEMS[mod(sign * (id - juNumber), 9)]);
  const palaceOf = (stem: string): PalaceId => {
    const id = PALACES_ASC[earthByPalace.indexOf(stem)];
    if (!id) throw new RangeError("Invalid Qimen stem.");
    return id;
  };
  const dayCycleHeadIndex = Math.floor(dayIndex / 10);
  const dayCycleHead = CYCLE_HEADS[dayCycleHeadIndex];
  const dayXunkong = XUN_KONG_BRANCHES[dayCycleHeadIndex];
  const dayXunkongEn: [string, string] = [BRANCH_EN[dayXunkong[0]], BRANCH_EN[dayXunkong[1]]];

  const hourIndex = cycleIndex(ganzhi.hour);
  const cycleHeadIndex = Math.floor(hourIndex / 10);
  const cycleHeadStem = EARTH_STEMS[cycleHeadIndex];
  const cycleHead = CYCLE_HEADS[cycleHeadIndex];
  const hourXunkong = XUN_KONG_BRANCHES[cycleHeadIndex];
  const hourXunkongEn: [string, string] = [BRANCH_EN[hourXunkong[0]], BRANCH_EN[hourXunkong[1]]];

  const hourBranch = ganzhi.hour[1];
  const yimaRule = YIMA_RULES[hourBranch];
  if (!yimaRule) throw new RangeError("Invalid hour branch.");
  const yima: QimenYimaInfo = {
    branch: yimaRule.branch,
    branchEn: BRANCH_EN[yimaRule.branch],
    palace: yimaRule.palace,
    hourBranch,
    hourBranchEn: BRANCH_EN[hourBranch],
    sanheGroup: yimaRule.sanheGroup,
    sanheGroupEn: yimaRule.sanheGroupEn,
  };

  const officeHome = palaceOf(cycleHeadStem);
  const officeRingHome = hostedPalace(officeHome);
  const hourStep = hourIndex % 10;
  const zhifuPalace = hostedPalace(palaceOf(hourStep === 0 ? cycleHeadStem : ganzhi.hour[0]));
  const zhishiPalace = hostedPalace(PALACES_ASC[mod(officeHome - 1 + sign * hourStep, 9)]);

  // Stars + heaven stems rotate together; gates rotate separately. The eight deities
  // start at the duty star and run along the outer ring in the dun direction.
  const starShift = OUTER_RING.indexOf(zhifuPalace) - OUTER_RING.indexOf(officeRingHome);
  const gateShift = OUTER_RING.indexOf(zhishiPalace) - OUTER_RING.indexOf(officeRingHome);
  const palaces = PALACES_ASC.map((palaceId): QimenPalace => {
    const { bagua, directionZh, directionEn, elementZh, elementEn } = PALACE[palaceId];
    const earthStem = earthByPalace[palaceId - 1];
    const base = { palaceId, bagua, directionZh, directionEn, elementZh, elementEn, earthStem };
    if (palaceId === 5) {
      return {
        ...base, currentStar: null, currentStarEn: null, currentGate: null, currentGateEn: null,
        currentDeity: null, currentDeityEn: null, heavenStem: null,
        companionStar: null, companionStem: null, isAuspiciousGate: false,
        xunkongBranches: [], xunkongBranchesEn: [],
        yimaBranch: null, yimaBranchEn: null,
      };
    }
    const ringIndex = OUTER_RING.indexOf(palaceId);
    const starHome = OUTER_RING[mod(ringIndex - starShift, 8)];
    const star = PALACE[starHome];
    const gate = PALACE[OUTER_RING[mod(ringIndex - gateShift, 8)]];
    const [deity, deityEn] = DEITIES[mod(sign * (ringIndex - OUTER_RING.indexOf(zhifuPalace)), 8)];
    const hostsCenter = starHome === CENTER_HOST;
    const xunkongBranches = hourXunkong.filter((branch) => BRANCH_PALACE[branch] === palaceId);
    const xunkongBranchesEn = xunkongBranches.map((branch) => BRANCH_EN[branch]);
    const hasYima = yima.palace === palaceId;
    return {
      ...base,
      currentStar: star.star,
      currentStarEn: star.starEn,
      currentGate: gate.gate,
      currentGateEn: gate.gateEn,
      currentDeity: deity,
      currentDeityEn: deityEn,
      heavenStem: earthByPalace[starHome - 1],
      companionStar: hostsCenter ? PALACE[5].star : null,
      companionStem: hostsCenter ? earthByPalace[4] : null,
      isAuspiciousGate: ["生门", "开门", "休门"].includes(gate.gate),
      xunkongBranches,
      xunkongBranchesEn,
      yimaBranch: hasYima ? yima.branch : null,
      yimaBranchEn: hasYima ? yima.branchEn : null,
    };
  });

  return {
    time,
    ganzhi,
    solarTermZh,
    solarTermEn,
    solarTermStart: term.getSolar().toYmdHms().replace(" ", "T"),
    epoch,
    epochEn,
    dunType: yang ? "阳遁" : "阴遁",
    dunTypeEn: yang ? "Yang Dun" : "Yin Dun",
    juNumber,
    cycleHead,
    hourCycleHead: cycleHead,
    dayCycleHead,
    hourXunkong,
    hourXunkongEn,
    dayXunkong,
    dayXunkongEn,
    yima,
    zhifuStar: PALACE[officeHome].star,
    zhifuStarEn: PALACE[officeHome].starEn,
    zhifuPalace,
    zhishiGate: PALACE[officeRingHome].gate,
    zhishiGateEn: PALACE[officeRingHome].gateEn,
    zhishiPalace,
    palaces,
  };
}
