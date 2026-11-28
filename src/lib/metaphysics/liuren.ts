import { Solar } from "lunar-typescript";

export type LiuQin = "父母" | "子孙" | "官鬼" | "妻财" | "兄弟";
export type WuXingZh = "木" | "火" | "土" | "金" | "水";

export interface LiurenKe {
  /** 第几课（1..4） */
  index: number;
  labelZh: string;
  /** 上神（天盘地支） */
  top: string;
  /** 下神（地盘地支或日干） */
  bottom: string;
  /** 上神遁干 */
  tianGan?: string | null;
  /** 天将 */
  tianJiang: string;
  /** 上神五行 */
  topElement: WuXingZh;
}

export interface LiurenChuan {
  /** 第几传：初传 / 中传 / 末传 */
  stage: "初传" | "中传" | "末传";
  /** 地支 */
  branch: string;
  /** 遁干（空亡则为 null） */
  tianGan: string | null;
  /** 天将 */
  tianJiang: string;
  /** 六亲 */
  liuQin: LiuQin;
  /** 是否落空亡 */
  isKong: boolean;
  /** 旬空标记 */
  kongTag: "空" | "";
}

export interface LiurenPalaceSlot {
  /** 地盘地支（固定：子..亥） */
  earthBranch: string;
  /** 天盘地支（月将加占时后所得上神） */
  heavenBranch: string;
  /** 十二天将 */
  tianJiang: string;
  /** 遁干 */
  tianGan: string | null;
  /** 是否旬空 */
  isKong: boolean;
}

export interface LiurenPillarDetail {
  ganzhi: string;
  xunKong: string;
  naYin: string;
}

export interface LiurenShenSha {
  name: string;
  branch: string;
  desc: string;
}

export interface LiurenChartResult {
  time: string;
  lunarDateText: string;
  ganzhi: { year: string; month: string; day: string; hour: string };
  pillarDetails?: {
    year: LiurenPillarDetail;
    month: LiurenPillarDetail;
    day: LiurenPillarDetail;
    hour: LiurenPillarDetail;
  };
  shenSha?: LiurenShenSha[];
  /** 月将地支与将名（如 亥 / 登明） */
  yueJiang: string;
  yueJiangName: string;
  /** 当前所处中气 */
  prevZhongQi: string;
  /** 昼占 / 夜占（决定阳贵或阴贵） */
  isDay: boolean;
  /** 贵人所临天盘地支与地盘落宫 */
  guiRenBranch: string;
  /** 日干寄宫地支 */
  dayStemPalace: string;
  /** 日柱旬空两支 */
  xunKong: [string, string];
  /** 占时与月将 */
  hourBranch: string;
  /** 九宗门课体名称（如 贼克·重审 / 涉害·见机 / 伏吟·自任 等） */
  keTi: string;
  /** 九宗门主类 */
  zongMen:
    | "贼克"
    | "比用"
    | "涉害"
    | "遥克"
    | "昴星"
    | "别责"
    | "八专"
    | "伏吟"
    | "反吟";
  /** 四课 */
  siKe: [LiurenKe, LiurenKe, LiurenKe, LiurenKe];
  /** 三传 */
  sanChuan: [LiurenChuan, LiurenChuan, LiurenChuan];
  /** 十二宫天地盘与天将 */
  palaces: LiurenPalaceSlot[];
}

export interface LiurenOptions {
  /** 强制指定昼占(true)或夜占(false)；不传则按卯~申为昼、酉~寅为夜 */
  isDayOverride?: boolean;
  /** 贵人口诀流派：jia_wu_geng_niu_yang（甲戊庚牛羊，默认）或 jia_yang_wu_geng_niu（甲羊戊庚牛） */
  guiRenRule?: "jia_wu_geng_niu_yang" | "jia_yang_wu_geng_niu";
  /** 涉害取法：depth（涉害深度法，默认）或 meng_zhong_ji（直取孟仲季） */
  sheHaiRule?: "depth" | "meng_zhong_ji";
  /** 手动指定月将地支（如 "寅"） */
  customYueJiang?: string;
  /** 报数起课（按报数取时支） */
  numberCast?: number;
}

const BEIJING_OFFSET_MS = 8 * 60 * 60 * 1000;
const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;

const STEM_ELEMENT: Record<string, WuXingZh> = {
  甲: "木", 乙: "木",
  丙: "火", 丁: "火",
  戊: "土", 己: "土",
  庚: "金", 辛: "金",
  壬: "水", 癸: "水",
};

const BRANCH_ELEMENT: Record<string, WuXingZh> = {
  子: "水", 亥: "水",
  寅: "木", 卯: "木",
  巳: "火", 午: "火",
  申: "金", 酉: "金",
  辰: "土", 戌: "土", 丑: "土", 未: "土",
};

const STEM_YIN_YANG: Record<string, 1 | -1> = {
  甲: 1, 丙: 1, 戊: 1, 庚: 1, 壬: 1,
  乙: -1, 丁: -1, 己: -1, 辛: -1, 癸: -1,
};

const BRANCH_YIN_YANG: Record<string, 1 | -1> = {
  子: 1, 寅: 1, 辰: 1, 午: 1, 申: 1, 戌: 1,
  丑: -1, 卯: -1, 巳: -1, 未: -1, 酉: -1, 亥: -1,
};

/** 十干寄宫：甲课在寅，乙课在辰，丙戊课在巳，丁己课在未，庚课在申，辛课在戌，壬课在亥，癸课在丑 */
const STEM_PALACE: Record<string, string> = {
  甲: "寅", 乙: "辰", 丙: "巳", 丁: "未", 戊: "巳",
  己: "未", 庚: "申", 辛: "戌", 壬: "亥", 癸: "丑",
};

/** 甲戊庚牛羊，乙己鼠猴乡，丙丁猪鸡位，壬癸蛇兔藏，六辛逢马虎（[阳贵/昼, 阴贵/夜]） */
const GUIREN_MAP: Record<string, [string, string]> = {
  甲: ["丑", "未"], 戊: ["丑", "未"], 庚: ["丑", "未"],
  乙: ["子", "申"], 己: ["子", "申"],
  丙: ["亥", "酉"], 丁: ["亥", "酉"],
  壬: ["巳", "卯"], 癸: ["巳", "卯"],
  辛: ["午", "寅"],
};

/** 甲羊戊庚牛口诀 */
const GUIREN_MAP_ALT: Record<string, [string, string]> = {
  ...GUIREN_MAP,
  甲: ["未", "丑"],
  戊: ["丑", "未"],
  庚: ["丑", "未"],
};

/** 十二天将顺序 */
const TIAN_JIANG = [
  "贵人", "螣蛇", "朱雀", "六合", "勾陈", "青龙",
  "天空", "白虎", "太常", "玄武", "太阴", "天后",
] as const;

export const TIAN_JIANG_SHORT: Record<string, string> = {
  贵人: "贵", 螣蛇: "蛇", 朱雀: "雀", 六合: "合",
  勾陈: "勾", 青龙: "龙", 天空: "空", 白虎: "虎",
  太常: "常", 玄武: "玄", 太阴: "阴", 天后: "后",
};

/** 十二月将（中气太阳过宫） */
const ZHONGQI_YUEJIANG: Record<string, [string, string]> = {
  雨水: ["亥", "登明"], 惊蛰: ["亥", "登明"],
  春分: ["戌", "河魁"], 清明: ["戌", "河魁"],
  谷雨: ["酉", "从魁"], 立夏: ["酉", "从魁"],
  小满: ["申", "传送"], 芒种: ["申", "传送"],
  夏至: ["未", "小吉"], 小暑: ["未", "小吉"],
  大暑: ["午", "胜光"], 立秋: ["午", "胜光"],
  处暑: ["巳", "太乙"], 白露: ["巳", "太乙"],
  秋分: ["辰", "天罡"], 寒露: ["辰", "天罡"],
  霜降: ["卯", "太冲"], 立冬: ["卯", "太冲"],
  小雪: ["寅", "功曹"], 大雪: ["寅", "功曹"],
  冬至: ["丑", "大吉"], 小寒: ["丑", "大吉"],
  大寒: ["子", "神后"], 立春: ["子", "神后"],
};

/** 孟仲季（涉害法深浅对比用：孟=寅申巳亥, 仲=子午卯酉, 季=辰戌丑未） */
const MENG_ZHONG_JI: Record<string, number> = {
  寅: 3, 申: 3, 巳: 3, 亥: 3,
  子: 2, 午: 2, 卯: 2, 酉: 2,
  辰: 1, 戌: 1, 丑: 1, 未: 1,
};

const WUXING_GEN: Record<WuXingZh, WuXingZh> = {
  木: "火", 火: "土", 土: "金", 金: "水", 水: "木",
};

const WUXING_KE: Record<WuXingZh, WuXingZh> = {
  木: "土", 土: "水", 水: "火", 火: "金", 金: "木",
};

function mod12(n: number): number {
  return ((n % 12) + 12) % 12;
}

function branchIdx(b: string): number {
  return BRANCHES.indexOf(b as (typeof BRANCHES)[number]);
}

function getLiuQin(dayEl: WuXingZh, targetEl: WuXingZh): LiuQin {
  if (dayEl === targetEl) return "兄弟";
  if (WUXING_GEN[targetEl] === dayEl) return "父母";
  if (WUXING_GEN[dayEl] === targetEl) return "子孙";
  if (WUXING_KE[targetEl] === dayEl) return "官鬼";
  return "妻财";
}

function isKe(upperEl: WuXingZh, lowerEl: WuXingZh): boolean {
  return WUXING_KE[upperEl] === lowerEl;
}

/** 地支六冲 */
function chongOf(b: string): string {
  return BRANCHES[mod12(branchIdx(b) + 6)];
}

/** 地支三刑（含自刑，用于伏吟/反吟定中末传） */
function xingOf(b: string): string {
  const map: Record<string, string> = {
    子: "卯", 卯: "子",
    寅: "巳", 巳: "申", 申: "寅",
    丑: "戌", 戌: "未", 未: "丑",
    辰: "辰", 午: "午", 酉: "酉", 亥: "亥",
  };
  return map[b] ?? b;
}

/**
 * 大六壬核心排盘函数（月将、昼夜贵人、天地盘、四课、九宗门三传、十二天将、六亲、旬空）
 */
export function calculateLiuren(
  targetDate: Date = new Date(),
  options: LiurenOptions = {}
): LiurenChartResult {
  const bj = new Date(targetDate.getTime() + BEIJING_OFFSET_MS);
  const time = bj.toISOString().slice(0, 19);
  const lunar = Solar.fromYmdHms(
    bj.getUTCFullYear(),
    bj.getUTCMonth() + 1,
    bj.getUTCDate(),
    bj.getUTCHours(),
    bj.getUTCMinutes(),
    bj.getUTCSeconds()
  ).getLunar();

  const ganzhi = {
    year: lunar.getYearInGanZhiExact(),
    month: lunar.getMonthInGanZhiExact(),
    day: lunar.getDayInGanZhiExact(),
    hour: lunar.getTimeInGanZhi(),
  };

  const dayGan = ganzhi.day[0];
  const dayZhi = ganzhi.day[1];
  const hourBranch =
    options.numberCast && options.numberCast > 0
      ? BRANCHES[mod12(Math.trunc(options.numberCast) - 1)]
      : ganzhi.hour[1];
  const dayStemPalace = STEM_PALACE[dayGan] ?? "寅";

  // 1. 月将（取上一个中气/节气对应的太阳过宫，支持手动覆盖）
  const prevTerm = lunar.getPrevQi(false) ?? lunar.getPrevJieQi(false);
  const prevZhongQi = prevTerm.getName();
  const [defaultYJ, defaultYJName] = ZHONGQI_YUEJIANG[prevZhongQi] ?? ["亥", "登明"];
  const yueJiang =
    options.customYueJiang && BRANCHES.includes(options.customYueJiang as (typeof BRANCHES)[number])
      ? options.customYueJiang
      : defaultYJ;
  const yueJiangName =
    Object.values(ZHONGQI_YUEJIANG).find(([b]) => b === yueJiang)?.[1] ?? defaultYJName;

  // 2. 天地盘：月将加占时
  const offset = mod12(branchIdx(yueJiang) - branchIdx(hourBranch));
  const heavenOf = (earthBranch: string): string =>
    BRANCHES[mod12(branchIdx(earthBranch) + offset)];
  const earthOf = (heavenBranch: string): string =>
    BRANCHES[mod12(branchIdx(heavenBranch) - offset)];

  // 3. 昼夜贵人：卯辰巳午未申为昼，酉戌亥子丑寅为夜
  const isDay = options.isDayOverride ?? "卯辰巳午未申".includes(hourBranch);
  const guiMap = options.guiRenRule === "jia_yang_wu_geng_niu" ? GUIREN_MAP_ALT : GUIREN_MAP;
  const [dayGui, nightGui] = guiMap[dayGan] ?? ["丑", "未"];
  const guiRenBranch = isDay ? dayGui : nightGui;
  // 贵人落在地盘亥~辰（前六辰）顺布天将，巳~戌（后六辰）逆布天将
  const guiRenEarth = earthOf(guiRenBranch);
  const jiangDir = "亥子丑寅卯辰".includes(guiRenEarth) ? 1 : -1;
  const jiangAtHeaven = (heavenBranch: string): string => {
    const step = mod12(jiangDir * (branchIdx(heavenBranch) - branchIdx(guiRenBranch)));
    return TIAN_JIANG[step];
  };

  // 4. 旬首与遁干、旬空
  const dayStemIdx = STEMS.indexOf(dayGan as (typeof STEMS)[number]);
  const dayZhiIdx = branchIdx(dayZhi);
  const xunStartZhiIdx = mod12(dayZhiIdx - dayStemIdx);
  const xunKong: [string, string] = [
    BRANCHES[mod12(xunStartZhiIdx + 10)],
    BRANCHES[mod12(xunStartZhiIdx + 11)],
  ];
  const dunGanOf = (branch: string): string | null => {
    if (xunKong.includes(branch)) return null;
    const stemOffset = mod12(branchIdx(branch) - xunStartZhiIdx);
    return STEMS[stemOffset] ?? null;
  };

  // 5. 四课
  const ke1Top = heavenOf(dayStemPalace);
  const ke2Top = heavenOf(ke1Top);
  const ke3Top = heavenOf(dayZhi);
  const ke4Top = heavenOf(ke3Top);

  const rawKe: Array<{ index: number; labelZh: string; top: string; bottom: string; bottomEl: WuXingZh }> = [
    { index: 1, labelZh: "第一课（干阳）", top: ke1Top, bottom: dayGan, bottomEl: STEM_ELEMENT[dayGan] },
    { index: 2, labelZh: "第二课（干阴）", top: ke2Top, bottom: ke1Top, bottomEl: BRANCH_ELEMENT[ke1Top] },
    { index: 3, labelZh: "第三课（支阳）", top: ke3Top, bottom: dayZhi, bottomEl: BRANCH_ELEMENT[dayZhi] },
    { index: 4, labelZh: "第四课（支阴）", top: ke4Top, bottom: ke3Top, bottomEl: BRANCH_ELEMENT[ke3Top] },
  ];

  const siKe = rawKe.map((k) => ({
    index: k.index,
    labelZh: k.labelZh,
    top: k.top,
    bottom: k.bottom,
    tianGan: dunGanOf(k.top),
    tianJiang: jiangAtHeaven(k.top),
    topElement: BRANCH_ELEMENT[k.top],
  })) as [LiurenKe, LiurenKe, LiurenKe, LiurenKe];

  // 6. 九宗门起三传
  const dayYinYang = STEM_YIN_YANG[dayGan];
  const sameYinYang = (b: string) => BRANCH_YIN_YANG[b] === dayYinYang;

  let zongMen: LiurenChartResult["zongMen"] = "贼克";
  let keTi = "";
  let c1 = ke1Top;
  let c2 = ke2Top;
  let c3 = ke3Top;

  if (offset === 0) {
    // 伏吟
    zongMen = "伏吟";
    const xiaZei = rawKe.filter((k) => isKe(k.bottomEl, BRANCH_ELEMENT[k.top]));
    const shangKe = rawKe.filter((k) => isKe(BRANCH_ELEMENT[k.top], k.bottomEl));
    if (xiaZei.length > 0) {
      c1 = xiaZei[0].top;
      keTi = "伏吟·不备克";
    } else if (shangKe.length > 0) {
      c1 = shangKe[0].top;
      keTi = "伏吟·上克";
    } else if (dayYinYang === 1) {
      c1 = ke1Top;
      keTi = "伏吟·自任";
    } else {
      c1 = ke3Top;
      keTi = "伏吟·自信";
    }
    const x1 = xingOf(c1);
    c2 = x1 === c1 ? chongOf(c1) : x1;
    const x2 = xingOf(c2);
    c3 = x2 === c2 || x2 === c1 ? chongOf(c2) : x2;
    if (c1 === c2 && c2 === c3) keTi = "伏吟·杜传";
  } else if (offset === 6) {
    // 反吟：先查贼克，无克则取驿马发用（井栏射/无依）
    const xiaZei = rawKe.filter((k) => isKe(k.bottomEl, BRANCH_ELEMENT[k.top]));
    const shangKe = rawKe.filter((k) => isKe(BRANCH_ELEMENT[k.top], k.bottomEl));
    if (xiaZei.length > 0 || shangKe.length > 0) {
      const pool = xiaZei.length > 0 ? xiaZei : shangKe;
      const picked = pool.find((k) => sameYinYang(k.top)) ?? pool[0];
      zongMen = "反吟";
      keTi = "反吟·有克";
      c1 = picked.top;
      c2 = heavenOf(c1);
      c3 = heavenOf(c2);
    } else {
      zongMen = "反吟";
      keTi = "反吟·无依（井栏射）";
      // 驿马：申子辰马在寅，寅午戌马在申，巳酉丑马在亥，亥卯未马在巳
      const yiMaMap: Record<string, string> = {
        申: "寅", 子: "寅", 辰: "寅",
        寅: "申", 午: "申", 戌: "申",
        巳: "亥", 酉: "亥", 丑: "亥",
        亥: "巳", 卯: "巳", 未: "巳",
      };
      c1 = yiMaMap[dayZhi] ?? "寅";
      c2 = ke3Top;
      c3 = ke1Top;
    }
  } else {
    const xiaZei = rawKe.filter((k) => isKe(k.bottomEl, BRANCH_ELEMENT[k.top]));
    const shangKe = rawKe.filter((k) => isKe(BRANCH_ELEMENT[k.top], k.bottomEl));

    const resolveCandidates = (pool: typeof rawKe, isZei: boolean) => {
      if (pool.length === 1) {
        zongMen = "贼克";
        keTi = isZei ? "贼克·重审" : "贼克·元首";
        return pool[0].top;
      }
      // 比用：取与日干同阴阳者
      const bi = pool.filter((k) => sameYinYang(k.top));
      if (bi.length === 1) {
        zongMen = "比用";
        keTi = "比用·知一";
        return bi[0].top;
      }
      // 涉害：以归本家经历克数及孟仲季深浅定
      const shePool = bi.length > 1 ? bi : pool;
      zongMen = "涉害";
      const scored = shePool.map((k) => {
        const startEarth = earthOf(k.top);
        const startIdx = branchIdx(startEarth);
        const endIdx = branchIdx(k.top);
        let depth = 0;
        for (let step = 0; step < 12; step++) {
          const cur = BRANCHES[mod12(startIdx + step)];
          if (isZei ? isKe(BRANCH_ELEMENT[cur], BRANCH_ELEMENT[k.top]) : isKe(BRANCH_ELEMENT[k.top], BRANCH_ELEMENT[cur])) {
            depth++;
          }
          if (mod12(startIdx + step) === endIdx) break;
        }
        return { k, depth, mzj: MENG_ZHONG_JI[startEarth] ?? 1 };
      });
      scored.sort((a, b) =>
        options.sheHaiRule === "meng_zhong_ji"
          ? b.mzj - a.mzj || b.depth - a.depth
          : b.depth - a.depth || b.mzj - a.mzj
      );
      keTi = scored[0].mzj === 3 ? "涉害·见机" : scored[0].mzj === 2 ? "涉害·察微" : "涉害·复等";
      return scored[0].k.top;
    };

    if (xiaZei.length > 0) {
      c1 = resolveCandidates(xiaZei, true);
      c2 = heavenOf(c1);
      c3 = heavenOf(c2);
    } else if (shangKe.length > 0) {
      c1 = resolveCandidates(shangKe, false);
      c2 = heavenOf(c1);
      c3 = heavenOf(c2);
    } else {
      // 无贼克，查遥克（2/3/4课上神与日干相克）
      const dayEl = STEM_ELEMENT[dayGan];
      const yaoShangKe = rawKe.slice(1).filter((k) => isKe(BRANCH_ELEMENT[k.top], dayEl));
      const yaoKeDay = rawKe.slice(1).filter((k) => isKe(dayEl, BRANCH_ELEMENT[k.top]));
      if (yaoShangKe.length > 0 || yaoKeDay.length > 0) {
        zongMen = "遥克";
        const pool = yaoShangKe.length > 0 ? yaoShangKe : yaoKeDay;
        const bi = pool.filter((k) => sameYinYang(k.top));
        const picked = (bi.length > 0 ? bi : pool)[0];
        keTi = yaoShangKe.length > 0 ? "遥克·蒿矢" : "遥克·弹射";
        c1 = picked.top;
        c2 = heavenOf(c1);
        c3 = heavenOf(c2);
      } else {
        // 检查八专 / 别责 / 昴星
        const uniqueTops = new Set([ke1Top, ke2Top, ke3Top, ke4Top]);
        if (dayStemPalace === dayZhi) {
          // 八专：日干寄宫与日支同位
          zongMen = "八专";
          keTi = "八专·帷簿";
          if (dayYinYang === 1) {
            c1 = BRANCHES[mod12(branchIdx(ke1Top) + 2)];
          } else {
            c1 = BRANCHES[mod12(branchIdx(ke4Top) - 2)];
          }
          c2 = ke1Top;
          c3 = ke1Top;
        } else if (uniqueTops.size < 4) {
          // 别责：四课不全
          zongMen = "别责";
          keTi = "别责·不备";
          if (dayYinYang === 1) {
            // 阳日取干合神上神
            const heGanIdx = (dayStemIdx + 5) % 10;
            const hePalace = STEM_PALACE[STEMS[heGanIdx]];
            c1 = heavenOf(hePalace);
          } else {
            // 阴日取日支三合前一位
            c1 = BRANCHES[mod12(branchIdx(dayZhi) + 4)];
          }
          c2 = ke1Top;
          c3 = ke1Top;
        } else {
          // 昴星：四课全备无克
          zongMen = "昴星";
          if (dayYinYang === 1) {
            keTi = "昴星·虎视";
            c1 = heavenOf("酉");
            c2 = ke3Top;
            c3 = ke1Top;
          } else {
            keTi = "昴星·冬蛇掩目";
            c1 = earthOf("酉");
            c2 = ke1Top;
            c3 = ke3Top;
          }
        }
      }
    }
  }

  const dayEl = STEM_ELEMENT[dayGan];
  const makeChuan = (stage: "初传" | "中传" | "末传", branch: string): LiurenChuan => {
    const isKong = xunKong.includes(branch);
    return {
      stage,
      branch,
      tianGan: dunGanOf(branch),
      tianJiang: jiangAtHeaven(branch),
      liuQin: getLiuQin(dayEl, BRANCH_ELEMENT[branch]),
      isKong,
      kongTag: isKong ? "空" : "",
    };
  };

  const sanChuan: [LiurenChuan, LiurenChuan, LiurenChuan] = [
    makeChuan("初传", c1),
    makeChuan("中传", c2),
    makeChuan("末传", c3),
  ];

  const palaces: LiurenPalaceSlot[] = BRANCHES.map((earthBranch) => {
    const heavenBranch = heavenOf(earthBranch);
    return {
      earthBranch,
      heavenBranch,
      tianJiang: jiangAtHeaven(heavenBranch),
      tianGan: dunGanOf(heavenBranch),
      isKong: xunKong.includes(heavenBranch),
    };
  });

  const eightChar = lunar.getEightChar();
  const lunarDateText = `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`;
  const pillarDetails = {
    year: { ganzhi: ganzhi.year, xunKong: eightChar.getYearXunKong(), naYin: eightChar.getYearNaYin() },
    month: { ganzhi: ganzhi.month, xunKong: eightChar.getMonthXunKong(), naYin: eightChar.getMonthNaYin() },
    day: { ganzhi: ganzhi.day, xunKong: eightChar.getDayXunKong(), naYin: eightChar.getDayNaYin() },
    hour: { ganzhi: ganzhi.hour, xunKong: eightChar.getTimeXunKong(), naYin: eightChar.getTimeNaYin() },
  };

  const yearZhi = ganzhi.year[1];
  const monthZhi = ganzhi.month[1];
  const yiMaMap: Record<string, string> = {
    申: "寅", 子: "寅", 辰: "寅",
    寅: "申", 午: "申", 戌: "申",
    巳: "亥", 酉: "亥", 丑: "亥",
    亥: "巳", 卯: "巳", 未: "巳",
  };
  const taoHuaMap: Record<string, string> = {
    申: "酉", 子: "酉", 辰: "酉",
    寅: "卯", 午: "卯", 戌: "卯",
    巳: "午", 酉: "午", 丑: "午",
    亥: "子", 卯: "子", 未: "子",
  };
  const riLuMap: Record<string, string> = {
    甲: "寅", 乙: "卯", 丙: "巳", 丁: "午", 戊: "巳",
    己: "午", 庚: "申", 辛: "酉", 壬: "亥", 癸: "子",
  };
  const wenChangMap: Record<string, string> = {
    甲: "巳", 乙: "午", 丙: "申", 丁: "酉", 戊: "申",
    己: "酉", 庚: "亥", 辛: "子", 壬: "寅", 癸: "卯",
  };
  const tianXiMap: Record<string, string> = {
    寅: "戌", 卯: "戌", 辰: "戌",
    巳: "丑", 午: "丑", 未: "丑",
    申: "辰", 酉: "辰", 戌: "辰",
    亥: "未", 子: "未", 丑: "未",
  };
  const youDuMap: Record<string, string> = {
    甲: "丑", 己: "丑", 乙: "子", 丙: "寅", 丁: "巳",
    戊: "申", 庚: "寅", 辛: "巳", 壬: "申", 癸: "亥",
  };
  const tianYi = BRANCHES[mod12(branchIdx(monthZhi) + 2)];
  const sangMen = BRANCHES[mod12(branchIdx(yearZhi) + 2)];
  const diaoKe = BRANCHES[mod12(branchIdx(yearZhi) - 2)];
  const bingFu = BRANCHES[mod12(branchIdx(yearZhi) - 1)];
  const kuShen = BRANCHES[mod12(branchIdx(yearZhi) - 2)];
  const tianEn = BRANCHES[mod12(branchIdx(monthZhi) + 2)];

  const shenSha: LiurenShenSha[] = [
    { name: "驿马", branch: yiMaMap[dayZhi] ?? "寅", desc: "主出行、变动、迁移、奔波" },
    { name: "桃花", branch: taoHuaMap[dayZhi] ?? "酉", desc: "主感情、人缘、魅力、风流" },
    { name: "日禄", branch: riLuMap[dayGan] ?? "寅", desc: "主俸禄、财源、衣食、正职" },
    { name: "文昌", branch: wenChangMap[dayGan] ?? "巳", desc: "主学业、文书、考运、才智" },
    { name: "天喜", branch: tianXiMap[monthZhi] ?? "未", desc: "主喜庆、婚恋、和合、吉兆" },
    { name: "天医", branch: tianYi, desc: "主医药、康复、贵人救护" },
    { name: "丧门", branch: sangMen, desc: "主孝服、悲伤、宜防惊恐" },
    { name: "吊客", branch: diaoKe, desc: "主丧吊、探病、远行防忧" },
    { name: "病符", branch: bingFu, desc: "主疾厄、体弱、调养身心" },
    { name: "游都", branch: youDuMap[dayGan] ?? "子", desc: "主行人、盗贼、动静行踪" },
    { name: "哭神", branch: kuShen, desc: "主忧郁、哭泣、情绪波动" },
    { name: "天恩", branch: tianEn, desc: "主恩泽、赦免、贵人提拔" },
  ];

  return {
    time,
    lunarDateText,
    ganzhi,
    pillarDetails,
    shenSha,
    yueJiang,
    yueJiangName,
    prevZhongQi,
    isDay,
    guiRenBranch,
    dayStemPalace,
    xunKong,
    hourBranch,
    keTi,
    zongMen,
    siKe,
    sanChuan,
    palaces,
  };
}

const CHANG_SHENG_LABELS = ["长", "沐", "冠", "临", "帝", "衰", "病", "死", "墓", "绝", "胎", "养"] as const;
const CHANG_SHENG_START: Record<string, { startBranch: string; forward: boolean }> = {
  甲: { startBranch: "亥", forward: true },
  乙: { startBranch: "午", forward: false },
  丙: { startBranch: "寅", forward: true },
  丁: { startBranch: "酉", forward: false },
  戊: { startBranch: "寅", forward: true },
  己: { startBranch: "酉", forward: false },
  庚: { startBranch: "巳", forward: true },
  辛: { startBranch: "子", forward: false },
  壬: { startBranch: "申", forward: true },
  癸: { startBranch: "卯", forward: false },
};

export function getTwelveChangShengForStem(stem: string): Array<{ label: string; branch: string }> {
  const cfg = CHANG_SHENG_START[stem] ?? CHANG_SHENG_START["甲"];
  const startIdx = BRANCHES.indexOf(cfg.startBranch as (typeof BRANCHES)[number]);
  return CHANG_SHENG_LABELS.map((label, i) => {
    const idx = cfg.forward ? (startIdx + i) % 12 : (startIdx - i + 12) % 12;
    return { label, branch: BRANCHES[idx] };
  });
}
