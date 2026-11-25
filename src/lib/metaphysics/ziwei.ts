import { LunarUtil, Solar } from "lunar-typescript";

export type ZiweiGender = "male" | "female";

export interface ZiweiStar {
  name: string;
  nameEn?: string;
  type: "major" | "lucky" | "fierce" | "transformation";
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
  isEmpty: boolean;
  oppositeBranch: string;
  oppositeMajorStarNames: string[];
  oppositeMajorStarNamesEn: string[];
  majorStars: ZiweiStar[];
  minorStars: ZiweiStar[];
  transformations: string[]; // e.g. ["化禄", "化权"]
  transformationsEn: string[];
  decadalStartAge: number;
  decadalEndAge: number;
  decadalRange: string; // 大限年龄段 e.g. "6 - 15"
  summaryZh: string;
  summaryEn: string;
}

export interface ZiweiTransformationLocation {
  key: "lu" | "quan" | "ke" | "ji";
  labelZh: "化禄" | "化权" | "化科" | "化忌";
  labelEn: string;
  starZh: string;
  starEn: string;
  palaceIndex: number;
  palaceNameZh: string;
  palaceNameEn: string;
  palaceStem: string;
  palaceBranch: string;
}

export interface ZiweiChartResult {
  gender: ZiweiGender;
  decadalDirection: "clockwise" | "counterclockwise";
  decadalDirectionZh: string;
  decadalDirectionEn: string;
  solarDate: {
    year: number;
    month: number;
    day: number;
    hour: number;
  };
  lunarDate: {
    yearGanZhi: string;
    monthZh: string;
    dayZh: string;
    hourBranch: string;
    shengXiao: string;
  };
  bureau: {
    nameZh: string; // e.g. "火六局"
    nameEn: string;
    number: number; // 2, 3, 4, 5, 6
    elementZh: string;
    elementEn: string;
  };
  lifePalaceStem: string;
  lifePalaceBranch: string; // e.g. "寅"
  bodyPalaceBranch: string; // e.g. "寅"
  dayMasterStar: string; // 命宫主星或空宫实际说明
  dayMasterStarEn: string;
  palaces: ZiweiPalace[]; // 12 palaces ordered 子(0)..亥(11)
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
  transformationLocations: ZiweiTransformationLocation[];
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
  convention: {
    rulesZh: string;
    rulesEn: string;
    unsupportedZh: string;
    unsupportedEn: string;
  };
}

export interface ZiweiMarriagePalaceSnapshot {
  nameZh: string;
  nameEn: string;
  stem: string;
  branch: string;
  isEmpty: boolean;
  majorStars: ZiweiStar[];
  minorStars: ZiweiStar[];
  transformations: string[];
  transformationsEn: string[];
  oppositeBranch: string;
  oppositeMajorStarNames: string[];
  oppositeMajorStarNamesEn: string[];
}

export interface ZiweiMarriagePartnerSnapshot {
  name: string;
  gender: ZiweiGender;
  yearGanZhi: string;
  bureau: ZiweiChartResult["bureau"];
  decadalDirectionZh: string;
  decadalDirectionEn: string;
  lifePalace: ZiweiMarriagePalaceSnapshot;
  spousePalace: ZiweiMarriagePalaceSnapshot;
  fourTransformations: ZiweiTransformationLocation[];
}

export interface ZiweiMarriageResult {
  chartA: ZiweiChartResult;
  chartB: ZiweiChartResult;
  nameA: string;
  nameB: string;
  partnerA: ZiweiMarriagePartnerSnapshot;
  partnerB: ZiweiMarriagePartnerSnapshot;
  factualNotesZh: string[];
  factualNotesEn: string[];
  schoolBoundaryZh: string;
  schoolBoundaryEn: string;
}

const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
export const BRANCH_NAMES_EN: Record<string, string> = {
  "子": "Zi (Rat)",
  "丑": "Chou (Ox)",
  "寅": "Yin (Tiger)",
  "卯": "Mao (Rabbit)",
  "辰": "Chen (Dragon)",
  "巳": "Si (Snake)",
  "午": "Wu (Horse)",
  "未": "Wei (Goat)",
  "申": "Shen (Monkey)",
  "酉": "You (Rooster)",
  "戌": "Xu (Dog)",
  "亥": "Hai (Pig)"
};
const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];

const PALACE_NAMES = [
  "命宫", "兄弟宫", "夫妻宫", "子女宫",
  "财帛宫", "疾厄宫", "迁移宫", "仆役宫",
  "官禄宫", "田宅宫", "福德宫", "父母宫"
];

export const PALACE_NAMES_EN: Record<string, string> = {
  "命宫": "Life Palace",
  "兄弟宫": "Siblings Palace",
  "夫妻宫": "Spouses Palace",
  "子女宫": "Children Palace",
  "财帛宫": "Wealth Palace",
  "疾厄宫": "Health Palace",
  "迁移宫": "Travel Palace",
  "仆役宫": "Friends Palace",
  "官禄宫": "Career Palace",
  "田宅宫": "Property Palace",
  "福德宫": "Spirit Palace",
  "父母宫": "Parents Palace"
};

export const STAR_NAMES_EN: Record<string, string> = {
  "紫微": "Ziwei",
  "天机": "Tianji",
  "太阳": "Taiyang",
  "武曲": "Wuqu",
  "天同": "Tiantong",
  "廉贞": "Lianzhen",
  "天府": "Tianfu",
  "太阴": "Taiyin",
  "贪狼": "Tanlang",
  "巨门": "Jumen",
  "天相": "Tianxiang",
  "天梁": "Tianliang",
  "七杀": "Qisha",
  "破军": "Pojun",
  "天魁": "Tiankui",
  "天钺": "Tianyue",
  "文昌": "Wenchang",
  "文曲": "Wenqu",
  "左辅": "Zuofu",
  "右弼": "Youbi"
};

export const TRANSFORMATION_NAMES_EN: Record<string, string> = {
  "禄": "Lu (Prosperity)",
  "权": "Quan (Authority)",
  "科": "Ke (Fame)",
  "忌": "Ji (Obstacle)",
  "化禄": "Lu",
  "化权": "Quan",
  "化科": "Ke",
  "化忌": "Ji"
};

export const BRIGHTNESS_EN: Record<string, string> = {
  "庙": "Exalted",
  "旺": "Flourishing",
  "得": "Advantaged",
  "利": "Beneficial",
  "平": "Neutral",
  "不": "Dim",
  "陷": "Fallen"
};

// 五虎遁月表：以年干求寅宫天干
const FIVE_TIGERS: Record<string, string> = {
  甲: "丙", 己: "丙",
  乙: "戊", 庚: "戊",
  丙: "庚", 辛: "庚",
  丁: "壬", 壬: "壬",
  戊: "甲", 癸: "甲"
};

// 生年四化星表（甲廉破武阳…癸破巨阴贪）
const FOUR_TRANSFORMATIONS_MAP: Record<string, { lu: string; quan: string; ke: string; ji: string }> = {
  甲: { lu: "廉贞", quan: "破军", ke: "武曲", ji: "太阳" },
  乙: { lu: "天机", quan: "天梁", ke: "紫微", ji: "太阴" },
  丙: { lu: "天同", quan: "天机", ke: "文昌", ji: "廉贞" },
  丁: { lu: "太阴", quan: "天同", ke: "天机", ji: "巨门" },
  戊: { lu: "贪狼", quan: "太阴", ke: "右弼", ji: "天机" },
  己: { lu: "武曲", quan: "贪狼", ke: "天梁", ji: "文曲" },
  庚: { lu: "太阳", quan: "武曲", ke: "太阴", ji: "天同" },
  辛: { lu: "巨门", quan: "太阳", ke: "文曲", ji: "文昌" },
  壬: { lu: "天梁", quan: "紫微", ke: "天府", ji: "武曲" },
  癸: { lu: "破军", quan: "巨门", ke: "太阴", ji: "贪狼" }
};

// 安天魁、天钺：甲戊庚牛羊，乙己鼠猴乡，丙丁猪鸡位，壬癸兔蛇藏，六辛逢马虎（先魁后钺）
const KUI_YUE_MAP: Record<string, { kui: number; yue: number }> = {
  甲: { kui: 1, yue: 7 }, 戊: { kui: 1, yue: 7 }, 庚: { kui: 1, yue: 7 }, // 丑, 未
  乙: { kui: 0, yue: 8 }, 己: { kui: 0, yue: 8 }, // 子, 申
  丙: { kui: 11, yue: 9 }, 丁: { kui: 11, yue: 9 }, // 亥, 酉
  壬: { kui: 3, yue: 5 }, 癸: { kui: 3, yue: 5 }, // 卯, 巳
  辛: { kui: 6, yue: 2 } // 午, 寅
};

const BUREAU_TABLE: Record<string, { nameZh: string; nameEn: string; number: number; elementZh: string; elementEn: string }> = {
  水: { nameZh: "水二局", nameEn: "Water 2nd Bureau", number: 2, elementZh: "水", elementEn: "Water" },
  木: { nameZh: "木三局", nameEn: "Wood 3rd Bureau", number: 3, elementZh: "木", elementEn: "Wood" },
  金: { nameZh: "金四局", nameEn: "Metal 4th Bureau", number: 4, elementZh: "金", elementEn: "Metal" },
  土: { nameZh: "土五局", nameEn: "Earth 5th Bureau", number: 5, elementZh: "土", elementEn: "Earth" },
  火: { nameZh: "火六局", nameEn: "Fire 6th Bureau", number: 6, elementZh: "火", elementEn: "Fire" }
};

/**
 * 完整六十甲子纳音 => 五行局（不以默认木掩盖漏项）
 */
export function getBureauByGanZhi(gz: string): { nameZh: string; nameEn: string; number: number; elementZh: string; elementEn: string } {
  const naYin = LunarUtil.NAYIN[gz];
  if (!naYin) {
    throw new RangeError(`Unsupported sexagenary pillar for NaYin bureau lookup: ${gz}`);
  }
  const elementZh = naYin.slice(-1);
  const bureau = BUREAU_TABLE[elementZh];
  if (!bureau) {
    throw new RangeError(`Invalid NaYin element "${elementZh}" for pillar: ${gz}`);
  }
  return bureau;
}

function getBureau(yearStem: string, lifePalaceBranchIndex: number) {
  const startStem = FIVE_TIGERS[yearStem];
  if (!startStem) {
    throw new RangeError(`Invalid year stem for Five Tigers lookup: ${yearStem}`);
  }
  const startStemIndex = STEMS.indexOf(startStem);
  const offset = (lifePalaceBranchIndex - 2 + 12) % 12; // 寅宫为索引 2
  const lifeStem = STEMS[(startStemIndex + offset) % 10];
  const lifeBranch = BRANCHES[lifePalaceBranchIndex];
  const gz = lifeStem + lifeBranch;
  return { lifeStem, bureau: getBureauByGanZhi(gz) };
}

// 求紫微星宫位
function getZiweiIndex(bureauNumber: number, lunarDay: number): number {
  let day = lunarDay;
  const remainder = day % bureauNumber;
  let addCount = 0;

  if (remainder !== 0) {
    addCount = bureauNumber - remainder;
    day += addCount;
  }

  const quotient = Math.floor(day / bureauNumber);
  // 若所补数 addCount 为奇数，则减去；为偶数则加上
  let targetBranchIndex: number;
  if (addCount % 2 === 1) {
    targetBranchIndex = (quotient - addCount - 1 + 12) % 12;
  } else {
    targetBranchIndex = (quotient + addCount - 1 + 12) % 12;
  }

  // 紫微星从寅宫(index 2)为起点推演
  return (2 + targetBranchIndex + 12) % 12;
}

function describePalaceFactZh(palace: ZiweiPalace): string {
  const majorDesc = palace.majorStars.length > 0
    ? palace.majorStars.map(s => `${s.name}${s.transformation ? `(化${s.transformation})` : ""}`).join("、")
    : `空宫（无主星，对宫${palace.oppositeBranch}有：${palace.oppositeMajorStarNames.join("、") || "亦无主星"}）`;
  const minorDesc = palace.minorStars.length > 0
    ? `；辅星见${palace.minorStars.map(s => `${s.name}${s.transformation ? `(化${s.transformation})` : ""}`).join("、")}`
    : "";
  return `${palace.name}坐${palace.stem}${palace.branch}，主星：${majorDesc}${minorDesc}。大限 ${palace.decadalRange} 岁。`;
}

function describePalaceFactEn(palace: ZiweiPalace): string {
  const majorDesc = palace.majorStars.length > 0
    ? palace.majorStars.map(s => `${s.nameEn || s.name}${s.transformation ? ` (${TRANSFORMATION_NAMES_EN["化" + s.transformation] || s.transformation})` : ""}`).join(", ")
    : `Empty Palace (no major stars; opposite ${BRANCH_NAMES_EN[palace.oppositeBranch] || palace.oppositeBranch}: ${palace.oppositeMajorStarNamesEn.join(", ") || "also empty"})`;
  const minorDesc = palace.minorStars.length > 0
    ? `; lucky/auxiliary stars: ${palace.minorStars.map(s => `${s.nameEn || s.name}${s.transformation ? ` (${TRANSFORMATION_NAMES_EN["化" + s.transformation] || s.transformation})` : ""}`).join(", ")}`
    : "";
  return `${palace.nameEn} in ${palace.stem}${palace.branch} (${BRANCH_NAMES_EN[palace.branch] || palace.branch}): ${majorDesc}${minorDesc}. Decadal Age ${palace.decadalRange}.`;
}

export const ZIWEI_YEAR_MIN = 1920;
export const ZIWEI_YEAR_MAX = 2035;

function validateZiweiSolarInput(year: number, month: number, day: number, hour: number, gender: ZiweiGender): void {
  if (!Number.isInteger(year) || year < ZIWEI_YEAR_MIN || year > ZIWEI_YEAR_MAX) {
    throw new RangeError(`Year must be an integer between ${ZIWEI_YEAR_MIN} and ${ZIWEI_YEAR_MAX}: ${year}`);
  }
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new RangeError(`Month must be an integer between 1 and 12: ${month}`);
  }
  if (!Number.isInteger(day) || day < 1 || day > 31) {
    throw new RangeError(`Day must be an integer between 1 and 31: ${day}`);
  }
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (
    probe.getUTCFullYear() !== year ||
    probe.getUTCMonth() !== month - 1 ||
    probe.getUTCDate() !== day
  ) {
    throw new RangeError(`Invalid Gregorian calendar date: ${year}-${month}-${day}`);
  }
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
    throw new RangeError(`Hour must be an integer between 0 and 23: ${hour}`);
  }
  if (gender !== "male" && gender !== "female") {
    throw new RangeError(`Invalid gender: ${String(gender)}`);
  }
}

export function calculateZiwei(
  year: number,
  month: number,
  day: number,
  hour: number = 12,
  gender: ZiweiGender = "male"
): ZiweiChartResult {
  validateZiweiSolarInput(year, month, day, hour, gender);
  const solar = Solar.fromYmdHms(year, month, day, hour, 0, 0);
  const lunar = solar.getLunar();

  // 口径：农历正月初一换年 (对应 iztro yearDivide: 'normal')
  const yearStem = lunar.getYearGan();
  const yearGanZhi = lunar.getYearInGanZhi();
  const lunarMonth = Math.abs(lunar.getMonth());
  const lunarDay = lunar.getDay();

  // 时支索引 (23:00-00:59 为子时 index 0, 01:00-02:59 为丑时 index 1...)
  const hourBranchIndex = Math.floor((hour + 1) % 24 / 2);

  // 1. 求命宫与身宫
  // 命宫：寅起正月顺数至生月，再从生月逆数至生时
  const monthTarget = (2 + (lunarMonth - 1)) % 12;
  const lifePalaceIndex = (monthTarget - hourBranchIndex + 12) % 12;

  // 身宫：寅起正月顺数至生月，再顺数至生时
  const bodyPalaceIndex = (monthTarget + hourBranchIndex) % 12;

  // 2. 求完整纳音五行局
  const { lifeStem, bureau } = getBureau(yearStem, lifePalaceIndex);

  // 3. 求紫微星与天府星位置
  const ziweiIndex = getZiweiIndex(bureau.number, lunarDay);
  // 天府星与紫微星在 寅-申 对称轴上：(4 - ziweiIndex + 12) % 12
  const tianfuIndex = (4 - ziweiIndex + 12) % 12;

  // 4. 安十四主星（不标注无完整流派依据的固定庙旺）
  const ziweiSeries: { name: string; offset: number }[] = [
    { name: "紫微", offset: 0 },
    { name: "天机", offset: -1 },
    { name: "太阳", offset: -3 },
    { name: "武曲", offset: -4 },
    { name: "天同", offset: -5 },
    { name: "廉贞", offset: -8 }
  ];

  const tianfuSeries: { name: string; offset: number }[] = [
    { name: "天府", offset: 0 },
    { name: "太阴", offset: 1 },
    { name: "贪狼", offset: 2 },
    { name: "巨门", offset: 3 },
    { name: "天相", offset: 4 },
    { name: "天梁", offset: 5 },
    { name: "七杀", offset: 6 },
    { name: "破军", offset: 10 }
  ];

  const majorStarsInPalace: Record<number, ZiweiStar[]> = {};
  const minorStarsInPalace: Record<number, ZiweiStar[]> = {};
  for (let i = 0; i < 12; i++) {
    majorStarsInPalace[i] = [];
    minorStarsInPalace[i] = [];
  }

  ziweiSeries.forEach(s => {
    const idx = (ziweiIndex + s.offset + 24) % 12;
    majorStarsInPalace[idx].push({
      name: s.name,
      nameEn: STAR_NAMES_EN[s.name] || s.name,
      type: "major",
      meaningZh: "紫微星系主星"
    });
  });

  tianfuSeries.forEach(s => {
    const idx = (tianfuIndex + s.offset + 24) % 12;
    majorStarsInPalace[idx].push({
      name: s.name,
      nameEn: STAR_NAMES_EN[s.name] || s.name,
      type: "major",
      meaningZh: "天府星系主星"
    });
  });

  // 5. 安辅星：天魁/天钺（生年干各安一次）、文昌/文曲（生时支各安一次）、左辅/右弼（生月各安一次）
  const kuiYue = KUI_YUE_MAP[yearStem];
  if (!kuiYue) {
    throw new RangeError(`Invalid year stem for Kui/Yue placement: ${yearStem}`);
  }
  minorStarsInPalace[kuiYue.kui].push({ name: "天魁", nameEn: STAR_NAMES_EN["天魁"], type: "lucky" });
  minorStarsInPalace[kuiYue.yue].push({ name: "天钺", nameEn: STAR_NAMES_EN["天钺"], type: "lucky" });

  // 文昌：戌(10)起子时逆数；文曲：辰(4)起子时顺数
  const wenchangIndex = (10 - hourBranchIndex + 12) % 12;
  const wenquIndex = (4 + hourBranchIndex) % 12;
  minorStarsInPalace[wenchangIndex].push({ name: "文昌", nameEn: STAR_NAMES_EN["文昌"], type: "lucky" });
  minorStarsInPalace[wenquIndex].push({ name: "文曲", nameEn: STAR_NAMES_EN["文曲"], type: "lucky" });

  // 左辅：辰(4)起正月顺数；右弼：戌(10)起正月逆数（保证戊年右弼化科可落宫）
  const zuofuIndex = (4 + (lunarMonth - 1)) % 12;
  const youbiIndex = (10 - (lunarMonth - 1) + 12) % 12;
  minorStarsInPalace[zuofuIndex].push({ name: "左辅", nameEn: STAR_NAMES_EN["左辅"], type: "lucky" });
  minorStarsInPalace[youbiIndex].push({ name: "右弼", nameEn: STAR_NAMES_EN["右弼"], type: "lucky" });

  // 6. 四化星定位（遍历实际主星与辅星）
  const trans = FOUR_TRANSFORMATIONS_MAP[yearStem];
  if (!trans) {
    throw new RangeError(`Invalid year stem for Four Transformations: ${yearStem}`);
  }
  const transEn = {
    lu: STAR_NAMES_EN[trans.lu] || trans.lu,
    quan: STAR_NAMES_EN[trans.quan] || trans.quan,
    ke: STAR_NAMES_EN[trans.ke] || trans.ke,
    ji: STAR_NAMES_EN[trans.ji] || trans.ji
  };

  // 7. 大限顺逆：生年天干阴阳 + 排盘性别（阳男阴女顺行，阴男阳女逆行）
  const isYangYear = STEMS.indexOf(yearStem) % 2 === 0;
  const isClockwise = (isYangYear && gender === "male") || (!isYangYear && gender === "female");
  const decadalDirection: "clockwise" | "counterclockwise" = isClockwise ? "clockwise" : "counterclockwise";
  const decadalDirectionZh = `${isYangYear ? "阳" : "阴"}${gender === "male" ? "男" : "女"}${isClockwise ? "顺行" : "逆行"}`;
  const decadalDirectionEn = `${isYangYear ? "Yang" : "Yin"} Year · ${gender === "male" ? "Male" : "Female"} · ${isClockwise ? "Clockwise" : "Counterclockwise"}`;

  // 8. 构筑十二宫
  const startStem = FIVE_TIGERS[yearStem];
  const startStemIndex = STEMS.indexOf(startStem);

  const palaces: ZiweiPalace[] = [];
  const transformationLocations: ZiweiTransformationLocation[] = [];

  for (let i = 0; i < 12; i++) {
    // 宫名：以命宫为第0宫，逆时针排布十二宫
    const nameIndex = (lifePalaceIndex - i + 12) % 12;
    const palaceName = PALACE_NAMES[nameIndex];
    const palaceNameEn = PALACE_NAMES_EN[palaceName] || palaceName;

    // 宫干（五虎遁）
    const offsetFromYin = (i - 2 + 12) % 12;
    const palaceStem = STEMS[(startStemIndex + offsetFromYin) % 10];

    const currentMajorStars = majorStarsInPalace[i] || [];
    const currentMinorStars = minorStarsInPalace[i] || [];
    const oppositeIndex = (i + 6) % 12;
    const oppositeStars = majorStarsInPalace[oppositeIndex] || [];
    const isEmpty = currentMajorStars.length === 0;

    // 大限年龄区间：顺行按顺时针步数，逆行按逆时针步数
    const decadalStep = isClockwise
      ? (i - lifePalaceIndex + 12) % 12
      : (lifePalaceIndex - i + 12) % 12;
    const decadalStartAge = bureau.number + decadalStep * 10;
    const decadalEndAge = decadalStartAge + 9;
    const decadalRange = `${decadalStartAge} - ${decadalEndAge}`;

    // 检查此宫所有实际主辅星是否带有生年四化
    const palaceTrans: string[] = [];
    const palaceTransEn: string[] = [];

    const applyTrans = (
      st: ZiweiStar,
      key: "lu" | "quan" | "ke" | "ji",
      charZh: "禄" | "权" | "科" | "忌",
      labelZh: "化禄" | "化权" | "化科" | "化忌"
    ) => {
      st.transformation = charZh;
      st.transformationEn = TRANSFORMATION_NAMES_EN[charZh];
      palaceTrans.push(labelZh);
      palaceTransEn.push(TRANSFORMATION_NAMES_EN[labelZh]);
      transformationLocations.push({
        key,
        labelZh,
        labelEn: TRANSFORMATION_NAMES_EN[labelZh],
        starZh: st.name,
        starEn: st.nameEn || st.name,
        palaceIndex: i,
        palaceNameZh: palaceName,
        palaceNameEn,
        palaceStem,
        palaceBranch: BRANCHES[i]
      });
    };

    [...currentMajorStars, ...currentMinorStars].forEach(st => {
      if (st.name === trans.lu) applyTrans(st, "lu", "禄", "化禄");
      if (st.name === trans.quan) applyTrans(st, "quan", "权", "化权");
      if (st.name === trans.ke) applyTrans(st, "ke", "科", "化科");
      if (st.name === trans.ji) applyTrans(st, "ji", "忌", "化忌");
    });

    const palaceObj: ZiweiPalace = {
      index: i,
      branch: BRANCHES[i],
      stem: palaceStem,
      name: palaceName,
      nameEn: palaceNameEn,
      isLifePalace: i === lifePalaceIndex,
      isBodyPalace: i === bodyPalaceIndex,
      isEmpty,
      oppositeBranch: BRANCHES[oppositeIndex],
      oppositeMajorStarNames: oppositeStars.map(s => s.name),
      oppositeMajorStarNamesEn: oppositeStars.map(s => s.nameEn || s.name),
      majorStars: currentMajorStars,
      minorStars: currentMinorStars,
      transformations: palaceTrans,
      transformationsEn: palaceTransEn,
      decadalStartAge,
      decadalEndAge,
      decadalRange,
      summaryZh: "",
      summaryEn: ""
    };

    palaceObj.summaryZh = isEmpty
      ? `${palaceStem}${BRANCHES[i]}宫 · 空宫（无主星，对宫${BRANCHES[oppositeIndex]}：${oppositeStars.map(s => s.name).join("、") || "无主星"}）`
      : `${palaceStem}${BRANCHES[i]}宫 · ${currentMajorStars.map(s => s.name).join(" ")}`;
    palaceObj.summaryEn = isEmpty
      ? `${palaceStem}${BRANCHES[i]} Palace · Empty (opposite ${BRANCH_NAMES_EN[BRANCHES[oppositeIndex]]}: ${oppositeStars.map(s => s.nameEn || s.name).join(", ") || "Empty"})`
      : `${palaceStem}${BRANCHES[i]} Palace · ${currentMajorStars.map(s => s.nameEn || s.name).join(", ")}`;

    palaces.push(palaceObj);
  }

  const orderMap = { lu: 0, quan: 1, ke: 2, ji: 3 };
  transformationLocations.sort((a, b) => orderMap[a.key] - orderMap[b.key]);

  const lifePalace = palaces.find(p => p.isLifePalace)!;
  const careerPalace = palaces.find(p => p.name === "官禄宫")!;
  const wealthPalace = palaces.find(p => p.name === "财帛宫")!;
  const spousePalace = palaces.find(p => p.name === "夫妻宫")!;

  const lifeStars = lifePalace.majorStars.map(s => s.name).join(" · ") ||
    `空宫（无主星；对宫${lifePalace.oppositeBranch}：${lifePalace.oppositeMajorStarNames.join("、") || "无主星"}）`;
  const lifeStarsEn = lifePalace.majorStars.map(s => s.nameEn || s.name).join(" & ") ||
    `Empty Palace (opposite ${BRANCH_NAMES_EN[lifePalace.oppositeBranch]}: ${lifePalace.oppositeMajorStarNamesEn.join(", ") || "Empty"})`;

  return {
    gender,
    decadalDirection,
    decadalDirectionZh,
    decadalDirectionEn,
    solarDate: { year, month, day, hour },
    lunarDate: {
      yearGanZhi,
      monthZh: lunar.getMonthInChinese() + "月",
      dayZh: lunar.getDayInChinese(),
      hourBranch: BRANCHES[hourBranchIndex] + "时",
      shengXiao: lunar.getYearShengXiao()
    },
    bureau,
    lifePalaceStem: lifeStem,
    lifePalaceBranch: BRANCHES[lifePalaceIndex],
    bodyPalaceBranch: BRANCHES[bodyPalaceIndex],
    dayMasterStar: lifeStars,
    dayMasterStarEn: lifeStarsEn,
    palaces,
    fourTransformations: trans,
    fourTransformationsEn: transEn,
    transformationLocations,
    overallProfileZh: {
      personality: describePalaceFactZh(lifePalace),
      career: describePalaceFactZh(careerPalace),
      wealth: describePalaceFactZh(wealthPalace),
      marriage: describePalaceFactZh(spousePalace)
    },
    overallProfileEn: {
      personality: describePalaceFactEn(lifePalace),
      career: describePalaceFactEn(careerPalace),
      wealth: describePalaceFactEn(wealthPalace),
      marriage: describePalaceFactEn(spousePalace)
    },
    convention: {
      rulesZh: "口径：农历正月初一换年（对应 iztro 默认 yearDivide: normal）、闰月暂按本月数计、23:00 子时归当日（dayDivide: current）；完整六十甲子纳音定五行局；大限依生年天干阴阳与排盘性别定顺逆（阳男阴女顺行，阴男阳女逆行）；星曜含十四主星及天魁、天钺、文昌、文曲、左辅、右弼。",
      rulesEn: "Convention: Lunar New Year (正月初一) year boundary (matching iztro default yearDivide: normal), leap months use base month number, 23:00–23:59 Zi hour stays on the current day (dayDivide: current). Five-element bureau follows the full 60 Jiazi NaYin table. Decadal direction follows year-stem polarity + gender (Yang Male / Yin Female clockwise; Yin Male / Yang Female counterclockwise). Includes 14 major stars plus Tiankui, Tianyue, Wenchang, Wenqu, Zuofu, Youbi.",
      unsupportedZh: "边界与未支持流派：星曜庙旺利陷因流派表格存在差异，本盘不展示固定预设庙/旺标签；暂不支持飞星派宫干飞化、钦天四化、中州派亮度表、禄羊陀火铃空劫及流年/流月运限。",
      unsupportedEn: "Scope & Unsupported Schools: Brightness grades (Exalted/Flourishing/Fallen) vary across schools and are intentionally omitted rather than hardcoded. Flying-star palace transformations, Qintian four-transformations, Zhongzhou brightness tables, minor malefics/Lucun, and annual/monthly horoscopes are not supported here."
    }
  };
}

function buildPalaceSnapshot(palace: ZiweiPalace): ZiweiMarriagePalaceSnapshot {
  return {
    nameZh: palace.name,
    nameEn: palace.nameEn,
    stem: palace.stem,
    branch: palace.branch,
    isEmpty: palace.isEmpty,
    majorStars: palace.majorStars,
    minorStars: palace.minorStars,
    transformations: palace.transformations,
    transformationsEn: palace.transformationsEn,
    oppositeBranch: palace.oppositeBranch,
    oppositeMajorStarNames: palace.oppositeMajorStarNames,
    oppositeMajorStarNamesEn: palace.oppositeMajorStarNamesEn
  };
}

function buildPartnerSnapshot(chart: ZiweiChartResult, name: string): ZiweiMarriagePartnerSnapshot {
  const life = chart.palaces.find(p => p.isLifePalace)!;
  const spouse = chart.palaces.find(p => p.name === "夫妻宫")!;
  return {
    name,
    gender: chart.gender,
    yearGanZhi: chart.lunarDate.yearGanZhi,
    bureau: chart.bureau,
    decadalDirectionZh: chart.decadalDirectionZh,
    decadalDirectionEn: chart.decadalDirectionEn,
    lifePalace: buildPalaceSnapshot(life),
    spousePalace: buildPalaceSnapshot(spouse),
    fourTransformations: chart.transformationLocations
  };
}

function formatPalaceStarsZh(p: ZiweiMarriagePalaceSnapshot): string {
  const major = p.majorStars.length > 0
    ? p.majorStars.map(s => `${s.name}${s.transformation ? `(化${s.transformation})` : ""}`).join("、")
    : `空宫（无主星，对宫${p.oppositeBranch}：${p.oppositeMajorStarNames.join("、") || "无主星"}）`;
  const minor = p.minorStars.length > 0
    ? `；辅星：${p.minorStars.map(s => `${s.name}${s.transformation ? `(化${s.transformation})` : ""}`).join("、")}`
    : "";
  return `${p.stem}${p.branch}【${major}${minor}】`;
}

function formatPalaceStarsEn(p: ZiweiMarriagePalaceSnapshot): string {
  const major = p.majorStars.length > 0
    ? p.majorStars.map(s => `${s.nameEn || s.name}${s.transformation ? ` (${TRANSFORMATION_NAMES_EN["化" + s.transformation]})` : ""}`).join(", ")
    : `Empty Palace (opposite ${BRANCH_NAMES_EN[p.oppositeBranch] || p.oppositeBranch}: ${p.oppositeMajorStarNamesEn.join(", ") || "Empty"})`;
  const minor = p.minorStars.length > 0
    ? `; Aux: ${p.minorStars.map(s => `${s.nameEn || s.name}${s.transformation ? ` (${TRANSFORMATION_NAMES_EN["化" + s.transformation]})` : ""}`).join(", ")}`
    : "";
  return `${p.stem}${p.branch} [${major}${minor}]`;
}

/**
 * 紫微双盘对照（仅列客观盘面事实：实际命宫、夫妻宫、各自生年四化及宫位，不输出固定断语或伪精确百分比）
 */
export function analyzeZiweiMarriage(
  chartA: ZiweiChartResult,
  chartB: ZiweiChartResult,
  nameA: string = "甲方",
  nameB: string = "乙方"
): ZiweiMarriageResult {
  const partnerA = buildPartnerSnapshot(chartA, nameA);
  const partnerB = buildPartnerSnapshot(chartB, nameB);

  const factualNotesZh: string[] = [
    `命宫实况：${nameA} ${formatPalaceStarsZh(partnerA.lifePalace)}；${nameB} ${formatPalaceStarsZh(partnerB.lifePalace)}。`,
    `夫妻宫实况：${nameA} ${formatPalaceStarsZh(partnerA.spousePalace)}；${nameB} ${formatPalaceStarsZh(partnerB.spousePalace)}。`,
    `各自生年四化落宫：${nameA}（${chartA.lunarDate.yearGanZhi}年）${partnerA.fourTransformations.map(t => `${t.labelZh}${t.starZh}→${t.palaceNameZh}(${t.palaceStem}${t.palaceBranch})`).join("，")}；${nameB}（${chartB.lunarDate.yearGanZhi}年）${partnerB.fourTransformations.map(t => `${t.labelZh}${t.starZh}→${t.palaceNameZh}(${t.palaceStem}${t.palaceBranch})`).join("，")}。`
  ];

  const factualNotesEn: string[] = [
    `Life Palaces: ${nameA} ${formatPalaceStarsEn(partnerA.lifePalace)}; ${nameB} ${formatPalaceStarsEn(partnerB.lifePalace)}.`,
    `Spouses Palaces: ${nameA} ${formatPalaceStarsEn(partnerA.spousePalace)}; ${nameB} ${formatPalaceStarsEn(partnerB.spousePalace)}.`,
    `Natal Four Transformations: ${nameA} (${chartA.lunarDate.yearGanZhi}) ${partnerA.fourTransformations.map(t => `${t.labelEn} ${t.starEn} -> ${t.palaceNameEn} (${t.palaceStem}${t.palaceBranch})`).join(", ")}; ${nameB} (${chartB.lunarDate.yearGanZhi}) ${partnerB.fourTransformations.map(t => `${t.labelEn} ${t.starEn} -> ${t.palaceNameEn} (${t.palaceStem}${t.palaceBranch})`).join(", ")}.`
  ];

  if (partnerA.lifePalace.branch === partnerB.lifePalace.branch) {
    factualNotesZh.push(`地支对照：双方命宫同落【${partnerA.lifePalace.branch}】宫。`);
    factualNotesEn.push(`Branch Alignment: Both Life Palaces share branch [${BRANCH_NAMES_EN[partnerA.lifePalace.branch] || partnerA.lifePalace.branch}].`);
  }
  if (partnerA.lifePalace.branch === partnerB.spousePalace.branch) {
    factualNotesZh.push(`地支对照：${nameA} 命宫与 ${nameB} 夫妻宫同在【${partnerA.lifePalace.branch}】宫。`);
    factualNotesEn.push(`Branch Alignment: ${nameA}'s Life Palace and ${nameB}'s Spouses Palace both sit at [${BRANCH_NAMES_EN[partnerA.lifePalace.branch] || partnerA.lifePalace.branch}].`);
  }
  if (partnerB.lifePalace.branch === partnerA.spousePalace.branch) {
    factualNotesZh.push(`地支对照：${nameB} 命宫与 ${nameA} 夫妻宫同在【${partnerB.lifePalace.branch}】宫。`);
    factualNotesEn.push(`Branch Alignment: ${nameB}'s Life Palace and ${nameA}'s Spouses Palace both sit at [${BRANCH_NAMES_EN[partnerB.lifePalace.branch] || partnerB.lifePalace.branch}].`);
  }

  return {
    chartA,
    chartB,
    nameA,
    nameB,
    partnerA,
    partnerB,
    factualNotesZh,
    factualNotesEn,
    schoolBoundaryZh: "口径与边界：本合盘仅据双方本命盘如实并列命宫、夫妻宫（含空宫实况及对宫星曜参考）与各自生年四化实际落宫。不支持飞星四化互飞、钦天四化、中州派亮度加权、流年合参，亦不生成主观吉凶断语或百分比评分。",
    schoolBoundaryEn: "Scope & Boundary: This comparison strictly lists each chart's actual Life Palace, Spouses Palace (explicitly marking Empty Palaces and opposite-palace stars), and Natal Four Transformations by landing palace. Flying-star cross-chart transformations, Qintian mutagens, Zhongzhou brightness weights, annual horoscopes, fixed verdicts, and arbitrary percentage scores are intentionally excluded."
  };
}
