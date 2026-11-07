import { Solar } from "lunar-typescript";

export interface ZiweiStar {
  name: string;
  type: "major" | "lucky" | "fierce" | "transformation";
  brightness?: "庙" | "旺" | "得" | "利" | "平" | "不" | "陷";
  transformation?: "禄" | "权" | "科" | "忌";
  elementZh?: string;
  meaningZh?: string;
}

export interface ZiweiPalace {
  index: number; // 0 (子) to 11 (亥)
  branch: string; // 子丑寅卯辰巳午未申酉戌亥
  stem: string; // 甲乙丙丁戊己庚辛壬癸
  name: string; // 命宫、兄弟宫、夫妻宫...
  isLifePalace: boolean;
  isBodyPalace: boolean;
  majorStars: ZiweiStar[];
  minorStars: ZiweiStar[];
  transformations: string[]; // e.g. ["化禄", "化权"]
  decadalRange: string; // 大限年龄段 e.g. "24 - 33"
  summaryZh: string;
}

export interface ZiweiChartResult {
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
    nameZh: string; // e.g. "木三局"
    number: number; // 3
    elementZh: string;
  };
  lifePalaceBranch: string; // e.g. "辰"
  bodyPalaceBranch: string; // e.g. "申"
  dayMasterStar: string; // 命宫主星 e.g. "紫微 · 天府"
  palaces: ZiweiPalace[]; // 12 palaces in standard order
  fourTransformations: {
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
}

export interface ZiweiMarriageResult {
  chartA: ZiweiChartResult;
  chartB: ZiweiChartResult;
  nameA: string;
  nameB: string;
  overallScore: number; // 0-100
  palaceSynastry: {
    lifePalaceResonanceZh: string;
    spousePalaceResonanceZh: string;
    fourTransformationsEchoZh: string;
  };
  verdictZh: string;
  verdictEn: string;
  strengths: string[];
  challenges: string[];
  harmonyGuidance: string[];
}

const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];

const PALACE_NAMES = [
  "命宫", "兄弟宫", "夫妻宫", "子女宫",
  "财帛宫", "疾厄宫", "迁移宫", "仆役宫",
  "官禄宫", "田宅宫", "福德宫", "父母宫"
];

// 五虎遁月表：以年干求寅宫天干
const FIVE_TIGERS: Record<string, string> = {
  甲: "丙", 己: "丙",
  乙: "戊", 庚: "戊",
  丙: "庚", 辛: "庚",
  丁: "壬", 壬: "壬",
  戊: "甲", 癸: "甲"
};

// 四化星表
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

// 纳音五行定五行局算法
function getBureau(yearStem: string, lifePalaceBranchIndex: number): { nameZh: string; number: number; elementZh: string } {
  // 根据命宫干支的五行纳音定五行局
  // 五虎遁求命宫天干
  const startStem = FIVE_TIGERS[yearStem] || "丙";
  const startStemIndex = STEMS.indexOf(startStem);
  // 寅宫为索引 2
  const offset = (lifePalaceBranchIndex - 2 + 12) % 12;
  const lifeStem = STEMS[(startStemIndex + offset) % 10];
  const lifeBranch = BRANCHES[lifePalaceBranchIndex];

  // 简易纳音对应五行局
  const bureauTable: Record<string, { nameZh: string; number: number; elementZh: string }> = {
    水: { nameZh: "水二局", number: 2, elementZh: "水" },
    木: { nameZh: "木三局", number: 3, elementZh: "木" },
    金: { nameZh: "金四局", number: 4, elementZh: "金" },
    土: { nameZh: "土五局", number: 5, elementZh: "土" },
    火: { nameZh: "火六局", number: 6, elementZh: "火" }
  };

  // 采用古典六十甲子纳音判定
  const waterStems = ["丙子", "丁丑", "甲申", "乙酉", "壬辰", "癸巳"];
  const fireStems = ["戊子", "己丑", "丙申", "丁酉", "甲辰", "乙巳", "戊午", "己未"];
  const earthStems = ["庚子", "辛丑", "戊申", "己酉", "丙辰", "丁巳", "庚午", "辛未"];
  const metalStems = ["壬申", "癸酉", "庚辰", "辛巳", "甲午", "乙未", "壬寅", "癸卯"];
  
  const gz = lifeStem + lifeBranch;
  if (waterStems.includes(gz)) return bureauTable["水"];
  if (fireStems.includes(gz)) return bureauTable["火"];
  if (earthStems.includes(gz)) return bureauTable["土"];
  if (metalStems.includes(gz)) return bureauTable["金"];
  return bureauTable["木"];
}

// 求紫微星宫位
function getZiweiIndex(bureauNumber: number, lunarDay: number): number {
  let day = lunarDay;
  let remainder = day % bureauNumber;
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

export function calculateZiwei(
  year: number,
  month: number,
  day: number,
  hour: number = 12
): ZiweiChartResult {
  const solar = Solar.fromYmdHms(year, month, day, hour, 0, 0);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  const yearStem = eightChar.getYearGan();
  const yearBranch = eightChar.getYearZhi();
  const lunarMonth = Math.abs(lunar.getMonth());
  const lunarDay = lunar.getDay();

  // 时支索引 (23-1 为子时 index 0, 1-3 为丑时 index 1...)
  const hourBranchIndex = Math.floor((hour + 1) % 24 / 2);

  // 1. 求命宫与身宫
  // 命宫：寅起正月顺数至生月，再从生月逆数至生时
  // 寅 index 2
  const monthTarget = (2 + (lunarMonth - 1)) % 12;
  const lifePalaceIndex = (monthTarget - hourBranchIndex + 12) % 12;

  // 身宫：寅起正月顺数至生月，再顺数至生时
  const bodyPalaceIndex = (monthTarget + hourBranchIndex) % 12;

  // 2. 求五行局
  const bureau = getBureau(yearStem, lifePalaceIndex);

  // 3. 求紫微星与天府星位置
  const ziweiIndex = getZiweiIndex(bureau.number, lunarDay);
  // 天府星与紫微星在 寅-申 对称轴上：(4 - ziweiIndex + 12) % 12
  const tianfuIndex = (4 - ziweiIndex + 12) % 12;

  // 4. 安十四主星
  // 紫微系 (逆时针排列)
  const ziweiSeries: { name: string; offset: number }[] = [
    { name: "紫微", offset: 0 },
    { name: "天机", offset: -1 },
    { name: "太阳", offset: -3 },
    { name: "武曲", offset: -4 },
    { name: "天同", offset: -5 },
    { name: "廉贞", offset: -8 }
  ];

  // 天府系 (顺时针排列)
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

  const starsInPalace: Record<number, ZiweiStar[]> = {};
  for (let i = 0; i < 12; i++) starsInPalace[i] = [];

  ziweiSeries.forEach(s => {
    const idx = (ziweiIndex + s.offset + 24) % 12;
    starsInPalace[idx].push({
      name: s.name,
      type: "major",
      brightness: "庙",
      meaningZh: "北斗星系核心能量"
    });
  });

  tianfuSeries.forEach(s => {
    const idx = (tianfuIndex + s.offset + 24) % 12;
    starsInPalace[idx].push({
      name: s.name,
      type: "major",
      brightness: "旺",
      meaningZh: "南斗星系厚重之气"
    });
  });

  // 四化星定位
  const trans = FOUR_TRANSFORMATIONS_MAP[yearStem] || FOUR_TRANSFORMATIONS_MAP["甲"];

  // 5. 构筑十二宫
  // 五虎遁求十二宫天干
  const startStem = FIVE_TIGERS[yearStem] || "丙";
  const startStemIndex = STEMS.indexOf(startStem);

  const palaces: ZiweiPalace[] = [];

  for (let i = 0; i < 12; i++) {
    // 宫名：以命宫为第0宫，逆时针排布十二宫
    const nameIndex = (lifePalaceIndex - i + 12) % 12;
    const palaceName = PALACE_NAMES[nameIndex];

    // 宫干
    const offsetFromYin = (i - 2 + 12) % 12;
    const palaceStem = STEMS[(startStemIndex + offsetFromYin) % 10];

    const currentStars = starsInPalace[i] || [];

    // 附加大限年龄区间
    const startAge = bureau.number + nameIndex * 10;
    const endAge = startAge + 9;

    // 检查此宫主星是否带有生年四化
    const palaceTrans: string[] = [];
    currentStars.forEach(st => {
      if (st.name === trans.lu) { st.transformation = "禄"; palaceTrans.push("化禄"); }
      if (st.name === trans.quan) { st.transformation = "权"; palaceTrans.push("化权"); }
      if (st.name === trans.ke) { st.transformation = "科"; palaceTrans.push("化科"); }
      if (st.name === trans.ji) { st.transformation = "忌"; palaceTrans.push("化忌"); }
    });

    palaces.push({
      index: i,
      branch: BRANCHES[i],
      stem: palaceStem,
      name: palaceName,
      isLifePalace: i === lifePalaceIndex,
      isBodyPalace: i === bodyPalaceIndex,
      majorStars: currentStars,
      minorStars: [
        { name: i % 2 === 0 ? "天魁" : "天钺", type: "lucky" },
        { name: i % 3 === 0 ? "文昌" : "文曲", type: "lucky" }
      ],
      transformations: palaceTrans,
      decadalRange: `${startAge} - ${endAge}`,
      summaryZh: `${palaceStem}${BRANCHES[i]}宫 · ${currentStars.map(s => s.name).join(' ') || '借对宫星耀'}`
    });
  }

  // 命宫主星
  const lifeStars = starsInPalace[lifePalaceIndex].map(s => s.name).join(" · ") || "机月同梁借星气";

  return {
    solarDate: { year, month, day, hour },
    lunarDate: {
      yearGanZhi: eightChar.getYear(),
      monthZh: lunar.getMonthInChinese() + "月",
      dayZh: lunar.getDayInChinese(),
      hourBranch: BRANCHES[hourBranchIndex] + "时",
      shengXiao: eightChar.getYearZhi()
    },
    bureau,
    lifePalaceBranch: BRANCHES[lifePalaceIndex],
    bodyPalaceBranch: BRANCHES[bodyPalaceIndex],
    dayMasterStar: lifeStars,
    palaces,
    fourTransformations: trans,
    overallProfileZh: {
      personality: `命坐【${BRANCHES[lifePalaceIndex]}】宫，主星逢【${lifeStars}】。性格沉着有度，胸有丘壑。天生具备敏锐洞察力与组织领导才干。`,
      career: `官禄宫吉星拱照，适合深耕具有技术门槛、决策权能或战略布局的专业赛道，稳扎稳打必有大器晚成之局。`,
      wealth: `财帛宫逢运势生发，正财稳固，不宜贪图险峻偏门，宜以知识、信誉与长久产品复利聚财。`,
      marriage: `夫妻宫气象和煦，宜择三观契合、彼此尊重独立空间的伴侣，晚婚或成熟相处模式更为吉祥。`
    }
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
  const palaceA_Life = chartA.palaces.find(p => p.isLifePalace);
  const palaceA_Spouse = chartA.palaces.find(p => p.name === "夫妻宫");
  const palaceB_Life = chartB.palaces.find(p => p.isLifePalace);
  const palaceB_Spouse = chartB.palaces.find(p => p.name === "夫妻宫");

  const starsA_Life = palaceA_Life?.majorStars.map(s => s.name).join(" ") || "天梁";
  const starsB_Life = palaceB_Life?.majorStars.map(s => s.name).join(" ") || "天相";

  let baseScore = 82;
  // 简易共振逻辑
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
      spousePalaceResonanceZh: `双方夫妻宫皆受主星庇佑，气象庄严，对待婚姻皆有敬畏心与长期承诺愿力。`,
      fourTransformationsEchoZh: `生年四化互为引动，一方之禄入另一方之财官，预示婚后家业昌隆、互相旺益。`
    },
    verdictZh: score >= 88 ? "紫府同宫 · 鸾凤和鸣" : "星汉交辉 · 德业相成",
    verdictEn: "Celestial Harmony of Ziwei Stars",
    strengths: [
      "双方命宫星耀性格互补，遇事一人拿大主意、一人精细执行",
      "三观底色纯正，对家庭责任与财务规划共识明确",
      "遇风雨考验时能同舟共济，具备深厚的情感韧性"
    ],
    challenges: [
      "双方骨子里皆有傲气与原则底线，偶有意见分歧易陷入冷战",
      "需注意将外界工作压力及时过滤，勿带入家庭私密空间"
    ],
    harmonyGuidance: [
      "以柔克刚，日常交流多些幽默赞赏，少些居高临下的说教",
      "设立家庭共同愿景账户与年度旅行计划，持续注入情感新鲜感",
      "逢大限流年波动时，互为后方定海神针"
    ]
  };
}
