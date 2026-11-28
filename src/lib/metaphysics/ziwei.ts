import { astro } from "iztro";
import { Solar } from "lunar-typescript";
import { calculateBaZi, type BaZiCalculationResult } from "./bazi";

export interface ZiweiStar {
  name: string;
  nameEn?: string;
  type: "major" | "lucky" | "fierce" | "transformation" | "adjective";
  brightness?: "庙" | "旺" | "得" | "利" | "平" | "不" | "陷";
  brightnessEn?: string;
  transformation?: "禄" | "权" | "科" | "忌";
  transformationEn?: string;
  elementZh?: string;
  meaningZh?: string;
}

export interface ZiweiPalace {
  index: number; // 0 (子) to 11 (亥)
  branch: string; // 子丑寅卯辰巳午未申酉戌亥
  stem: string; // 甲乙丙丁戊己庚辛壬癸
  name: string; // 命宫、兄弟宫、夫妻宫...
  nameEn: string;
  isLifePalace: boolean;
  isBodyPalace: boolean;
  isOriginalPalace?: boolean; // 来因宫
  majorStars: ZiweiStar[];
  minorStars: ZiweiStar[];
  adjectiveStars?: ZiweiStar[];
  boshi12?: string;
  changsheng12?: string;
  suiqian12?: string;
  jiangqian12?: string;
  ages?: number[];
  decadalStart?: number;
  decadalEnd?: number;
  transformations: string[]; // e.g. ["化禄", "化权"]
  transformationsEn: string[];
  decadalRange: string; // 大限年龄段 e.g. "3 - 12"
  summaryZh: string;
  summaryEn: string;
}

export interface ZiweiHoroscopeLayer {
  index: number; // 0..11 palace index (地支索引)
  name: string;
  heavenlyStem: string;
  earthlyBranch: string;
  palaceNames: string[];
  mutagen: string[];
}

export interface ZiweiChartResult {
  solarDate: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute?: number;
  };
  lunarDate: {
    yearGanZhi: string;
    monthZh: string;
    dayZh: string;
    hourBranch: string;
    shengXiao: string;
    fullText?: string;
  };
  genderLabel?: string; // 阳男 / 阴男 / 阳女 / 阴女
  soul?: string; // 命主
  body?: string; // 身主
  bazi?: BaZiCalculationResult;
  bureau: {
    nameZh: string; // e.g. "木三局"
    nameEn: string;
    number: number; // 3
    elementZh: string;
    elementEn: string;
  };
  lifePalaceBranch: string; // e.g. "亥"
  bodyPalaceBranch: string; // e.g. "亥"
  dayMasterStar: string; // 命宫主星
  dayMasterStarEn: string;
  palaces: ZiweiPalace[]; // 12 palaces ordered 子(0)..亥(11)
  horoscope?: {
    decadal: ZiweiHoroscopeLayer;
    yearly: ZiweiHoroscopeLayer;
    monthly: ZiweiHoroscopeLayer;
    daily: ZiweiHoroscopeLayer;
    hourly: ZiweiHoroscopeLayer;
  };
  fourTransformations: {
    lu: string;
    quan: string;
    ke: string;
    ji: string;
  };
  fourTransformationsEn: {
    lu: string;
    quan: string;
    ke: string;
    ji: string;
  };
  overallProfileZh: {
    personality: string;
    career: string;
    wealth: string;
    marriage: string;
  };
  overallProfileEn: {
    personality: string;
    career: string;
    wealth: string;
    marriage: string;
  };
}

export interface ZiweiMarriageResult {
  chartA: ZiweiChartResult;
  chartB: ZiweiChartResult;
  nameA: string;
  nameB: string;
  overallScore: number; // 0-100
  palaceSynastry: {
    lifePalaceResonanceZh: string;
    lifePalaceResonanceEn: string;
    spousePalaceResonanceZh: string;
    spousePalaceResonanceEn: string;
    fourTransformationsEchoZh: string;
    fourTransformationsEchoEn: string;
  };
  verdictZh: string;
  verdictEn: string;
  strengths: string[];
  strengthsEn?: string[];
  challenges: string[];
  challengesEn?: string[];
  harmonyGuidance: string[];
  harmonyGuidanceEn?: string[];
}

const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
export const BRANCH_NAMES_EN: Record<string, string> = {
  子: "Zi (Rat)", 丑: "Chou (Ox)", 寅: "Yin (Tiger)", 卯: "Mao (Rabbit)",
  辰: "Chen (Dragon)", 巳: "Si (Snake)", 午: "Wu (Horse)", 未: "Wei (Goat)",
  申: "Shen (Monkey)", 酉: "You (Rooster)", 戌: "Xu (Dog)", 亥: "Hai (Pig)",
};

export const PALACE_NAMES_EN: Record<string, string> = {
  命宫: "Life Palace", 兄弟宫: "Siblings Palace", 夫妻宫: "Spouses Palace", 子女宫: "Children Palace",
  财帛宫: "Wealth Palace", 疾厄宫: "Health Palace", 迁移宫: "Travel Palace", 仆役宫: "Friends Palace",
  交友宫: "Friends Palace", 官禄宫: "Career Palace", 田宅宫: "Property Palace", 福德宫: "Fortune Palace",
  父母宫: "Parents Palace",
};

export const STAR_NAMES_EN: Record<string, string> = {
  紫微: "Zi Wei", 天机: "Tian Ji", 太阳: "Tai Yang", 武曲: "Wu Qu", 天同: "Tian Tong", 廉贞: "Lian Zhen",
  天府: "Tian Fu", 太阴: "Tai Yin", 贪狼: "Tan Lang", 巨门: "Ju Men", 天相: "Tian Xiang", 天梁: "Tian Liang",
  七杀: "Qi Sha", 破军: "Po Jun", 左辅: "Zuo Fu", 右弼: "You Bi", 文昌: "Wen Chang", 文曲: "Wen Qu",
  天魁: "Tian Kui", 天钺: "Tian Yue", 禄存: "Lu Cun", 天马: "Tian Ma", 擎羊: "Qing Yang", 陀罗: "Tuo Luo",
  火星: "Huo Xing", 铃星: "Ling Xing", 地空: "Di Kong", 地劫: "Di Jie",
};

const BRIGHTNESS_EN: Record<string, string> = {
  庙: "Temple", 旺: "Prosperous", 得: "Gaining", 利: "Beneficial", 平: "Neutral", 不: "Unfavorable", 陷: "Fallen",
};

const TRANS_EN: Record<string, string> = {
  禄: "Lu", 权: "Quan", 科: "Ke", 忌: "Ji",
};

const SI_HUA_MAP: Record<string, { lu: string; quan: string; ke: string; ji: string }> = {
  甲: { lu: "廉贞", quan: "破军", ke: "武曲", ji: "太阳" },
  乙: { lu: "天机", quan: "天梁", ke: "紫微", ji: "太阴" },
  丙: { lu: "天同", quan: "天机", ke: "文昌", ji: "廉贞" },
  丁: { lu: "太阴", quan: "天同", ke: "天机", ji: "巨门" },
  戊: { lu: "贪狼", quan: "太阴", ke: "右弼", ji: "天机" },
  己: { lu: "武曲", quan: "贪狼", ke: "天梁", ji: "文曲" },
  庚: { lu: "太阳", quan: "武曲", ke: "太阴", ji: "天同" },
  辛: { lu: "巨门", quan: "太阳", ke: "文曲", ji: "文昌" },
  壬: { lu: "天梁", quan: "紫微", ke: "左辅", ji: "武曲" },
  癸: { lu: "破军", quan: "巨门", ke: "太阴", ji: "贪狼" },
};

const BUREAU_MAP: Record<string, { num: number; el: string; elEn: string; nameEn: string }> = {
  水二局: { num: 2, el: "水", elEn: "Water", nameEn: "Water 2 Bureau" },
  木三局: { num: 3, el: "木", elEn: "Wood", nameEn: "Wood 3 Bureau" },
  金四局: { num: 4, el: "金", elEn: "Metal", nameEn: "Metal 4 Bureau" },
  土五局: { num: 5, el: "土", elEn: "Earth", nameEn: "Earth 5 Bureau" },
  火六局: { num: 6, el: "火", elEn: "Fire", nameEn: "Fire 6 Bureau" },
};

/** 24小时转 iztro 时辰索引：0=早子(0点), 1=丑(1-2), ..., 11=亥(21-22), 12=晚子(23点) */
export function hourToIztroTimeIndex(hour: number): number {
  const h = ((Math.trunc(hour) % 24) + 24) % 24;
  if (h === 0) return 0;
  if (h === 23) return 12;
  return Math.floor((h + 1) / 2);
}

function normalizePalaceName(raw: string): string {
  if (raw === "命宫") return "命宫";
  if (raw === "仆役") return "交友宫";
  return raw.endsWith("宫") ? raw : `${raw}宫`;
}

export function calculateZiwei(
  year: number,
  month: number,
  day: number,
  hour: number = 12,
  minute: number = 0,
  options: { gender?: "male" | "female"; horoscopeDate?: Date } = {}
): ZiweiChartResult {
  const gender = options.gender === "female" ? "female" : "male";
  const genderZh = gender === "female" ? "女" : "男";
  const solarStr = `${year}-${month}-${day}`;
  const timeIdx = hourToIztroTimeIndex(hour);

  const astrolabe = astro.bySolar(solarStr, timeIdx, genderZh, true, "zh-CN");
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();
  const ec = lunar.getEightChar();
  const yearStem = ec.getYearGan();
  const bazi = calculateBaZi(year, month, day, hour, minute, { gender, sect: 2 });

  const bMeta = BUREAU_MAP[astrolabe.fiveElementsClass] ?? BUREAU_MAP["木三局"];
  const trans = SI_HUA_MAP[yearStem] ?? SI_HUA_MAP["甲"];
  const transEn = {
    lu: STAR_NAMES_EN[trans.lu] || trans.lu,
    quan: STAR_NAMES_EN[trans.quan] || trans.quan,
    ke: STAR_NAMES_EN[trans.ke] || trans.ke,
    ji: STAR_NAMES_EN[trans.ji] || trans.ji,
  };

  // 将 iztro 12 宫（寅起顺排）重新索引为 子(0)..亥(11) 以兼容原有 4x4 网格坐标
  const palacesByBranch = new Array<ZiweiPalace>(12);
  let lifePalaceBranch = "亥";
  let bodyPalaceBranch = "亥";

  for (const p of astrolabe.palaces) {
    const bIdx = BRANCHES.indexOf(p.earthlyBranch);
    if (bIdx < 0) continue;
    const normName = normalizePalaceName(p.name);
    const isLife = p.name === "命宫";
    if (isLife) lifePalaceBranch = p.earthlyBranch;
    if (p.isBodyPalace) bodyPalaceBranch = p.earthlyBranch;

    const mapStar = (s: { name: string; brightness?: string; mutagen?: string }, defaultType: ZiweiStar["type"]): ZiweiStar => {
      const mut = s.mutagen as ZiweiStar["transformation"] | undefined;
      const br = (s.brightness || undefined) as ZiweiStar["brightness"];
      const fierceNames = new Set(["擎羊", "陀罗", "火星", "铃星", "地空", "地劫"]);
      const type: ZiweiStar["type"] =
        defaultType === "lucky" && fierceNames.has(s.name) ? "fierce" : defaultType;
      return {
        name: s.name,
        nameEn: STAR_NAMES_EN[s.name] || s.name,
        type,
        brightness: br,
        brightnessEn: br ? BRIGHTNESS_EN[br] : undefined,
        transformation: mut,
        transformationEn: mut ? TRANS_EN[mut] : undefined,
      };
    };

    const majorStars = p.majorStars.map((s) => mapStar(s, "major"));
    const minorStars = p.minorStars.map((s) => mapStar(s, "lucky"));
    const adjectiveStars = p.adjectiveStars.map((s) => mapStar(s, "adjective"));

    const transformations: string[] = [];
    const transformationsEn: string[] = [];
    for (const s of [...majorStars, ...minorStars]) {
      if (s.transformation) {
        transformations.push(`化${s.transformation}`);
        transformationsEn.push(`Hua ${TRANS_EN[s.transformation] || s.transformation}`);
      }
    }

    const majorNames = majorStars.map((s) => s.name).join(" · ") || "空宫借星";
    const decStart = p.decadal.range[0];
    const decEnd = p.decadal.range[1];

    palacesByBranch[bIdx] = {
      index: bIdx,
      branch: p.earthlyBranch,
      stem: p.heavenlyStem,
      name: normName,
      nameEn: PALACE_NAMES_EN[normName] || normName,
      isLifePalace: isLife,
      isBodyPalace: p.isBodyPalace,
      isOriginalPalace: p.isOriginalPalace,
      majorStars,
      minorStars,
      adjectiveStars,
      boshi12: p.boshi12,
      changsheng12: p.changsheng12,
      suiqian12: p.suiqian12,
      jiangqian12: p.jiangqian12,
      ages: p.ages,
      decadalStart: decStart,
      decadalEnd: decEnd,
      transformations,
      transformationsEn,
      decadalRange: `${decStart} - ${decEnd}`,
      summaryZh: `${normName}（${p.heavenlyStem}${p.earthlyBranch}）坐守【${majorNames}】，大限 ${decStart}–${decEnd} 岁。`,
      summaryEn: `${PALACE_NAMES_EN[normName] || normName} (${p.heavenlyStem}${p.earthlyBranch}) holds [${majorStars.map((s) => s.nameEn).join(" · ") || "Empty"}].`,
    };
  }

  const hTarget = options.horoscopeDate ?? new Date(year, month - 1, day, hour, minute);
  const hDateStr = `${hTarget.getFullYear()}-${hTarget.getMonth() + 1}-${hTarget.getDate()}`;
  const hObj = astrolabe.horoscope(hDateStr, hourToIztroTimeIndex(hTarget.getHours()));
  const toBranchIndex = (iztroIdx: number): number => {
    const p = astrolabe.palaces[iztroIdx];
    return p ? Math.max(0, BRANCHES.indexOf(p.earthlyBranch)) : 0;
  };
  const mapLayer = (l: { index: number; name: string; heavenlyStem: string; earthlyBranch: string; palaceNames: string[]; mutagen: string[] }): ZiweiHoroscopeLayer => ({
    index: toBranchIndex(l.index),
    name: l.name,
    heavenlyStem: l.heavenlyStem,
    earthlyBranch: l.earthlyBranch,
    palaceNames: l.palaceNames,
    mutagen: l.mutagen,
  });

  const lifePalace = palacesByBranch.find((p) => p.isLifePalace);
  const lifeStars = lifePalace?.majorStars.map((s) => s.name).join(" · ") || "空宫借星";
  const lifeStarsEn = lifePalace?.majorStars.map((s) => s.nameEn).join(" · ") || "Empty Palace";
  const isYangYear = ["甲", "丙", "戊", "庚", "壬"].includes(yearStem);
  const genderLabel = `${isYangYear ? "阳" : "阴"}${genderZh}`;

  return {
    solarDate: { year, month, day, hour, minute },
    lunarDate: {
      yearGanZhi: ec.getYear(),
      monthZh: `${lunar.getMonthInChinese()}月`,
      dayZh: lunar.getDayInChinese(),
      hourBranch: `${ec.getTimeZhi()}时`,
      shengXiao: ec.getYearZhi(),
      fullText: `${astrolabe.lunarDate} ${hour === 23 ? "晚子时" : hour === 0 ? "早子时" : `${ec.getTimeZhi()}时`}`,
    },
    genderLabel,
    soul: astrolabe.soul,
    body: astrolabe.body,
    bazi,
    bureau: {
      nameZh: astrolabe.fiveElementsClass,
      nameEn: bMeta.nameEn,
      number: bMeta.num,
      elementZh: bMeta.el,
      elementEn: bMeta.elEn,
    },
    lifePalaceBranch,
    bodyPalaceBranch,
    dayMasterStar: lifeStars,
    dayMasterStarEn: lifeStarsEn,
    palaces: palacesByBranch,
    horoscope: {
      decadal: mapLayer(hObj.decadal),
      yearly: mapLayer(hObj.yearly),
      monthly: mapLayer(hObj.monthly),
      daily: mapLayer(hObj.daily),
      hourly: mapLayer(hObj.hourly),
    },
    fourTransformations: trans,
    fourTransformationsEn: transEn,
    overallProfileZh: {
      personality: `命坐【${lifePalaceBranch}】宫，主星逢【${lifeStars}】，命主【${astrolabe.soul}】，身主【${astrolabe.body}】。`,
      career: `官禄宫星曜清晰，宜结合大限流年四化顺势布局，稳步积累核心壁垒。`,
      wealth: `财帛宫与命宫三方相照，正财稳固，重在长期复利与风险边界控制。`,
      marriage: `夫妻宫气象和合，宜择三观契合、彼此尊重独立空间的伴侣。`,
    },
    overallProfileEn: {
      personality: `Life Palace in [${BRANCH_NAMES_EN[lifePalaceBranch] || lifePalaceBranch}] governed by [${lifeStarsEn}]. Soul: ${astrolabe.soul}, Body: ${astrolabe.body}.`,
      career: `Career Palace reflects steady strategic development aligned with decadal transformations.`,
      wealth: `Wealth Palace resonates with the Life Palace triads, favoring long-term compounding.`,
      marriage: `Spouses Palace favors balanced partnership built on mutual respect and shared vision.`,
    },
  };
}

/**
 * 紫微合婚推演
 */
export function analyzeZiweiMarriage(
  chartA: ZiweiChartResult,
  chartB: ZiweiChartResult,
  nameA: string = "男方",
  nameB: string = "女方"
): ZiweiMarriageResult {
  const palaceA_Life = chartA.palaces.find((p) => p.isLifePalace);
  const palaceB_Life = chartB.palaces.find((p) => p.isLifePalace);

  const starsA_Life = palaceA_Life?.majorStars.map((s) => s.name).join(" ") || "天梁";
  const starsB_Life = palaceB_Life?.majorStars.map((s) => s.name).join(" ") || "天相";

  let baseScore = 82;
  if (starsA_Life.includes("紫微") && starsB_Life.includes("天府")) baseScore += 10;
  if (starsA_Life.includes("太阳") && starsB_Life.includes("太阴")) baseScore += 8;

  const score = Math.min(96, Math.max(72, baseScore));

  return {
    chartA,
    chartB,
    nameA,
    nameB,
    overallScore: score,
    palaceSynastry: {
      lifePalaceResonanceZh: `${nameA} 命宫逢【${starsA_Life}】，${nameB} 命宫逢【${starsB_Life}】。星耀互照，刚柔相济，磁场自然相吸。`,
      lifePalaceResonanceEn: `${nameA} sits with [${starsA_Life}], while ${nameB} sits with [${starsB_Life}] in the Life Palace. The major stars illuminate each other harmoniously.`,
      spousePalaceResonanceZh: `双方夫妻宫皆受主星庇佑，气象庄严，对待婚姻皆有敬畏心与长期承诺愿力。`,
      spousePalaceResonanceEn: `Both Spouses Palaces are guarded by noble stars, reflecting mutual respect and long-term commitment.`,
      fourTransformationsEchoZh: `生年四化互为引动，一方之禄入另一方之财官，预示婚后家业昌隆、互相旺益。`,
      fourTransformationsEchoEn: `Natal transformations mutually activate wealth and career palaces, forecasting shared prosperity.`,
    },
    verdictZh: score >= 88 ? "紫府同宫 · 鸾凤和鸣" : "星汉交辉 · 德业相成",
    verdictEn: score >= 88 ? "Divine Union of Imperial Stars" : "Celestial Harmony of Complementary Stars",
    strengths: [
      "双方命宫星耀性格互补，遇事一人拿大主意、一人精细执行",
      "三观底色纯正，对家庭责任与财务规划共识明确",
      "遇风雨考验时能同舟共济，具备深厚的情感韧性",
    ],
    strengthsEn: [
      "Complementary strengths in core palaces.",
      "Aligned values on family responsibility and financial stewardship.",
      "Strong emotional resilience together.",
    ],
    challenges: [
      "双方骨子里皆有傲气与原则底线，偶有意见分歧易陷入冷战",
      "需注意将外界工作压力及时过滤，勿带入家庭私密空间",
    ],
    challengesEn: [
      "Both hold strong principles; occasional disagreements require patient dialogue.",
      "Keep external work stress outside private domestic space.",
    ],
    harmonyGuidance: [
      "以柔克刚，日常交流多些幽默赞赏，少些居高临下的说教",
      "设立家庭共同愿景账户与年度旅行计划，持续注入情感新鲜感",
      "逢大限流年波动时，互为后方定海神针",
    ],
    harmonyGuidanceEn: [
      "Communicate with warmth and appreciation.",
      "Build shared long-term milestones together.",
      "Support each other during major decadal transitions.",
    ],
  };
}
