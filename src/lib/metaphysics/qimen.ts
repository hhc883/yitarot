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
  /** 暗干（时干入值使宫，按阳顺阴逆飞布九宫） */
  hiddenStem?: string | null;
  /** 天盘干十二长生状态 */
  heavenStemState?: string | null;
  /** 地盘干十二长生状态 */
  earthStemState?: string | null;
  /** 是否空亡宫 */
  isKong?: boolean;
  /** 是否驿马宫 */
  isMa?: boolean;
  companionStar: string | null;
  companionStem: string | null;
  isAuspiciousGate: boolean;
}

export type QimenMethod = "zhuanpan" | "feipan";

export interface QimenOptions {
  /** 排盘制式：zhuanpan（转盘，默认）或 feipan（飞盘） */
  method?: QimenMethod;
  /** 飞盘星门是否按「阳顺阴逆」飞布（默认 true） */
  feipanReverseYin?: boolean;
  /** 中五宫寄宫设置：2（坤二，默认）、8（艮八）或 auto（阳遁寄艮八，阴遁寄坤二） */
  centerHost?: 2 | 8 | "auto";
}

export interface QimenChartResult {
  /** Beijing standard wall time (fixed UTC+08:00), independent of device timezone. */
  time: string;
  method?: QimenMethod;
  centerHostPalace?: 2 | 8;
  feipanReverseYin?: boolean;
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
  zhifuStar: string;
  zhifuStarEn: string;
  zhifuPalace: OuterPalace;
  zhishiGate: string;
  zhishiGateEn: string;
  zhishiPalace: OuterPalace;
  /** 时柱旬空两支 */
  xunKong?: [string, string];
  /** 时支驿马 */
  maXing?: string;
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

function hostedPalace(id: PalaceId, centerHost: OuterPalace = CENTER_HOST): OuterPalace {
  return id === 5 ? centerHost : id;
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

const CHANG_SHENG_ORDER = ["长生", "沐浴", "冠带", "临官", "帝旺", "衰", "病", "死", "墓", "绝", "胎", "养"] as const;
const CHANG_SHENG_START: Record<string, { startZhi: string; dir: 1 | -1 }> = {
  乙: { startZhi: "午", dir: -1 }, 丙: { startZhi: "寅", dir: 1 },
  丁: { startZhi: "酉", dir: -1 }, 戊: { startZhi: "寅", dir: 1 },
  己: { startZhi: "酉", dir: -1 }, 庚: { startZhi: "巳", dir: 1 },
  辛: { startZhi: "子", dir: -1 }, 壬: { startZhi: "申", dir: 1 },
  癸: { startZhi: "卯", dir: -1 },
};
/** 九宫对应地支（用于计算天/地盘干十二状态及空亡/马星落宫） */
const PALACE_BRANCHES: Record<PalaceId, string[]> = {
  1: ["子"], 2: ["未", "申"], 3: ["卯"], 4: ["辰", "巳"],
  5: [], 6: ["戌", "亥"], 7: ["酉"], 8: ["丑", "寅"], 9: ["午"],
};
const MA_XING_MAP: Record<string, string> = {
  申: "寅", 子: "寅", 辰: "寅",
  寅: "申", 午: "申", 戌: "申",
  巳: "亥", 酉: "亥", 丑: "亥",
  亥: "巳", 卯: "巳", 未: "巳",
};

function getStemPalaceState(stem: string | null, palaceId: PalaceId): string | null {
  if (!stem || palaceId === 5) return null;
  const cfg = CHANG_SHENG_START[stem];
  const branches = PALACE_BRANCHES[palaceId];
  if (!cfg || !branches.length) return null;
  const sIdx = BRANCHES.indexOf(cfg.startZhi);
  return branches
    .map((b) => {
      const zIdx = BRANCHES.indexOf(b);
      const step = mod((zIdx - sIdx) * cfg.dir, 12);
      return CHANG_SHENG_ORDER[step];
    })
    .join("/");
}

/** 时家转盘/飞盘 · 拆补。按实际交节、北京时间 23:00 换日、支持飞盘星门阳顺阴逆与寄宫配置。 */
export function calculateQimen(
  targetDate: Date = new Date(),
  options: QimenOptions = {}
): QimenChartResult {
  const method: QimenMethod = options.method === "feipan" ? "feipan" : "zhuanpan";
  const feipanReverseYin = options.feipanReverseYin ?? true;
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
  const epochIndex = getEpochIndex(cycleIndex(ganzhi.day));
  const [epoch, epochEn] = EPOCHS[epochIndex];
  const juNumber = juByEpoch[epochIndex];
  const yang = YANG_TERMS.has(solarTermZh);
  const sign = yang ? 1 : -1;
  const centerHostPalace: 2 | 8 =
    options.centerHost === "auto" ? (yang ? 8 : 2) : (options.centerHost ?? CENTER_HOST);

  // 阴遁逆排、阳遁顺排，以局数宫起戊。甲遁入对应旬首仪。
  const earthByPalace = PALACES_ASC.map((id) => EARTH_STEMS[mod(sign * (id - juNumber), 9)]);
  const palaceOf = (stem: string): PalaceId => {
    const id = PALACES_ASC[earthByPalace.indexOf(stem)];
    if (!id) throw new RangeError("Invalid Qimen stem.");
    return id;
  };
  const hourIndex = cycleIndex(ganzhi.hour);
  const cycleHeadIndex = Math.floor(hourIndex / 10);
  const cycleHeadStem = EARTH_STEMS[cycleHeadIndex];
  const cycleHead = CYCLE_HEADS[cycleHeadIndex];
  const officeHome = palaceOf(cycleHeadStem);
  const officeRingHome = hostedPalace(officeHome, centerHostPalace);
  const hourStep = hourIndex % 10;
  const zhifuRawPalace = palaceOf(hourStep === 0 ? cycleHeadStem : ganzhi.hour[0]);
  const zhifuPalace = hostedPalace(zhifuRawPalace, centerHostPalace);
  const zhishiRawPalace = PALACES_ASC[mod(officeHome - 1 + sign * hourStep, 9)];
  const zhishiPalace = hostedPalace(zhishiRawPalace, centerHostPalace);

  // 旬空、马星与暗干（时干入值使宫，阳顺阴逆飞布九宫）
  const xunStartIdx = cycleHeadIndex * 10;
  const xunKong: [string, string] = [
    BRANCHES[mod(xunStartIdx + 10, 12)],
    BRANCHES[mod(xunStartIdx + 11, 12)],
  ];
  const maXing = MA_XING_MAP[ganzhi.hour[1]] ?? "寅";
  const hourStemForAnGan = hourStep === 0 ? cycleHeadStem : ganzhi.hour[0];
  const hourStemOrderIdx = EARTH_STEMS.indexOf(hourStemForAnGan);
  const hiddenByPalace = PALACES_ASC.map((id) =>
    hourStemOrderIdx >= 0 ? EARTH_STEMS[mod(hourStemOrderIdx + sign * (id - zhishiRawPalace), 9)] : null
  );

  let palaces: QimenPalace[];

  if (method === "feipan") {
    // 飞盘：九星按洛书九宫（1..9）飞布，阳顺阴逆（feipanReverseYin=false 时固定顺飞）
    const flyDir = yang || !feipanReverseYin ? 1 : -1;
    const starOffset = mod(zhifuRawPalace - officeHome, 9);
    const gateOffset = mod(zhishiRawPalace - officeHome, 9);

    palaces = PALACES_ASC.map((palaceId): QimenPalace => {
      const { bagua, directionZh, directionEn, elementZh, elementEn } = PALACE[palaceId];
      const earthStem = earthByPalace[palaceId - 1];
      const starHome = PALACES_ASC[mod((palaceId - 1) - flyDir * starOffset, 9)];
      const star = PALACE[starHome];
      const gateSourceId = PALACES_ASC[mod((palaceId - 1) - flyDir * gateOffset, 9)];
      const gateHome = hostedPalace(gateSourceId, centerHostPalace);
      const gate = PALACE[gateHome];
      const ringIndex = palaceId === 5 ? -1 : OUTER_RING.indexOf(palaceId);
      const [deity, deityEn] =
        ringIndex >= 0
          ? DEITIES[mod(sign * (ringIndex - OUTER_RING.indexOf(zhifuPalace)), 8)]
          : [null, null];

      const heavenStem = earthByPalace[starHome - 1];
      return {
        palaceId,
        bagua,
        directionZh,
        directionEn,
        elementZh,
        elementEn,
        currentStar: star.star,
        currentStarEn: star.starEn,
        currentGate: palaceId === 5 ? null : gate.gate,
        currentGateEn: palaceId === 5 ? null : gate.gateEn,
        currentDeity: deity,
        currentDeityEn: deityEn,
        heavenStem,
        earthStem,
        hiddenStem: hiddenByPalace[palaceId - 1],
        heavenStemState: getStemPalaceState(heavenStem, palaceId),
        earthStemState: getStemPalaceState(earthStem, palaceId),
        isKong: PALACE_BRANCHES[palaceId].some((b) => xunKong.includes(b)),
        isMa: PALACE_BRANCHES[palaceId].includes(maXing),
        companionStar: null,
        companionStem: null,
        isAuspiciousGate: palaceId !== 5 && ["生门", "开门", "休门"].includes(gate.gate),
      };
    });
  } else {
    // 转盘：Stars + heaven stems rotate together; gates rotate separately along outer ring.
    const starShift = OUTER_RING.indexOf(zhifuPalace) - OUTER_RING.indexOf(officeRingHome);
    const gateShift = OUTER_RING.indexOf(zhishiPalace) - OUTER_RING.indexOf(officeRingHome);
    palaces = PALACES_ASC.map((palaceId): QimenPalace => {
      const { bagua, directionZh, directionEn, elementZh, elementEn } = PALACE[palaceId];
      const earthStem = earthByPalace[palaceId - 1];
      const base = { palaceId, bagua, directionZh, directionEn, elementZh, elementEn, earthStem };
      if (palaceId === 5) {
        return {
          ...base, currentStar: null, currentStarEn: null, currentGate: null, currentGateEn: null,
          currentDeity: null, currentDeityEn: null, heavenStem: null,
          hiddenStem: hiddenByPalace[4], heavenStemState: null, earthStemState: null,
          isKong: false, isMa: false,
          companionStar: null, companionStem: null, isAuspiciousGate: false,
        };
      }
      const ringIndex = OUTER_RING.indexOf(palaceId);
      const starHome = OUTER_RING[mod(ringIndex - starShift, 8)];
      const star = PALACE[starHome];
      const gate = PALACE[OUTER_RING[mod(ringIndex - gateShift, 8)]];
      const [deity, deityEn] = DEITIES[mod(sign * (ringIndex - OUTER_RING.indexOf(zhifuPalace)), 8)];
      const hostsCenter = starHome === centerHostPalace;
      const heavenStem = earthByPalace[starHome - 1];
      return {
        ...base,
        currentStar: star.star,
        currentStarEn: star.starEn,
        currentGate: gate.gate,
        currentGateEn: gate.gateEn,
        currentDeity: deity,
        currentDeityEn: deityEn,
        heavenStem,
        hiddenStem: hiddenByPalace[palaceId - 1],
        heavenStemState: getStemPalaceState(heavenStem, palaceId),
        earthStemState: getStemPalaceState(earthStem, palaceId),
        isKong: PALACE_BRANCHES[palaceId].some((b) => xunKong.includes(b)),
        isMa: PALACE_BRANCHES[palaceId].includes(maXing),
        companionStar: hostsCenter ? PALACE[5].star : null,
        companionStem: hostsCenter ? earthByPalace[4] : null,
        isAuspiciousGate: ["生门", "开门", "休门"].includes(gate.gate),
      };
    });
  }

  return {
    time,
    method,
    centerHostPalace,
    feipanReverseYin,
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
    zhifuStar: PALACE[officeHome].star,
    zhifuStarEn: PALACE[officeHome].starEn,
    zhifuPalace,
    zhishiGate: PALACE[officeRingHome].gate,
    zhishiGateEn: PALACE[officeRingHome].gateEn,
    zhishiPalace,
    xunKong,
    maXing,
    palaces,
  };
}
