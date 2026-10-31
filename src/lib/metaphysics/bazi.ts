import { Solar } from "lunar-typescript";

export type WuXing = "Wood" | "Fire" | "Earth" | "Metal" | "Water";

export interface StemInfo {
  char: string;
  pinyin: string;
  nameEn: string;
  polarity: "Yang" | "Yin";
  element: WuXing;
  archetypeEn: string;
  archetypeZh: string;
}

export interface BranchInfo {
  char: string;
  pinyin: string;
  animalEn: string;
  animalZh: string;
  element: WuXing;
  polarity: "Yang" | "Yin";
}

export interface PillarData {
  nameEn: string;
  nameZh: string;
  gan: string;
  ganInfo: StemInfo;
  zhi: string;
  zhiInfo: BranchInfo;
  naYin: string;
  lifeDomainEn: string;
  lifeDomainZh: string;
}

export interface DayMasterProfile {
  stem: string;
  nameEn: string;
  nameZh: string;
  polarity: "Yang" | "Yin";
  element: WuXing;
  elementZh: string;
  archetypeEn: string;
  archetypeZh: string;
  essenceEn: string;
  essenceZh: string;
  strengthsEn: string[];
  strengthsZh: string[];
  growthAreasEn: string[];
  growthAreasZh: string[];
  cosmicAdviceEn: string;
  cosmicAdviceZh: string;
}

export interface ElementBalance {
  element: WuXing;
  elementZh: string;
  count: number;
  percentage: number;
  status: "Lacking" | "Balanced" | "Dominant";
  statusZh: "偏弱" | "均衡" | "旺盛";
  colorHex: string;
}

export interface BaZiCalculationResult {
  birthSolar: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
  };
  lunarString: string;
  zodiacSignEn: string;
  zodiacSignZh: string;
  pillars: {
    year: PillarData;
    month: PillarData;
    day: PillarData;
    hour: PillarData;
  };
  dayMaster: DayMasterProfile;
  fiveElements: ElementBalance[];
  dominantElement: WuXing;
  lackingElement: WuXing | null;
  elementRecommendationsEn: string;
  elementRecommendationsZh: string;
}

export const STEMS_MAP: Record<string, StemInfo> = {
  甲: { char: "甲", pinyin: "Jiǎ", nameEn: "Yang Wood", polarity: "Yang", element: "Wood", archetypeEn: "The Towering Oak", archetypeZh: "参天大木" },
  乙: { char: "乙", pinyin: "Yǐ", nameEn: "Yin Wood", polarity: "Yin", element: "Wood", archetypeEn: "The Resilient Vine", archetypeZh: "藤蔓芳草" },
  丙: { char: "丙", pinyin: "Bǐng", nameEn: "Yang Fire", polarity: "Yang", element: "Fire", archetypeEn: "The Radiant Sun", archetypeZh: "普照烈日" },
  丁: { char: "丁", pinyin: "Dīng", nameEn: "Yin Fire", polarity: "Yin", element: "Fire", archetypeEn: "The Sacred Flame", archetypeZh: "引路烛火" },
  戊: { char: "戊", pinyin: "Wù", nameEn: "Yang Earth", polarity: "Yang", element: "Earth", archetypeEn: "The Ancient Mountain", archetypeZh: "巍巍崇山" },
  己: { char: "己", pinyin: "Jǐ", nameEn: "Yin Earth", polarity: "Yin", element: "Earth", archetypeEn: "The Fertile Garden", archetypeZh: "滋养田园" },
  庚: { char: "庚", pinyin: "Gēng", nameEn: "Yang Metal", polarity: "Yang", element: "Metal", archetypeEn: "The Celestial Blade", archetypeZh: "肃穆神剑" },
  辛: { char: "辛", pinyin: "Xīn", nameEn: "Yin Metal", polarity: "Yin", element: "Metal", archetypeEn: "The Polished Gem", archetypeZh: "璀璨金玉" },
  壬: { char: "壬", pinyin: "Rén", nameEn: "Yang Water", polarity: "Yang", element: "Water", archetypeEn: "The Boundless Ocean", archetypeZh: "浩荡江海" },
  癸: { char: "癸", pinyin: "Guǐ", nameEn: "Yin Water", polarity: "Yin", element: "Water", archetypeEn: "The Morning Mist", archetypeZh: "润物雨露" },
};

export const BRANCHES_MAP: Record<string, BranchInfo> = {
  子: { char: "子", pinyin: "Zǐ", animalEn: "Rat", animalZh: "鼠", element: "Water", polarity: "Yang" },
  丑: { char: "丑", pinyin: "Chǒu", animalEn: "Ox", animalZh: "牛", element: "Earth", polarity: "Yin" },
  寅: { char: "寅", pinyin: "Yín", animalEn: "Tiger", animalZh: "虎", element: "Wood", polarity: "Yang" },
  卯: { char: "卯", pinyin: "Mǎo", animalEn: "Rabbit", animalZh: "兔", element: "Wood", polarity: "Yin" },
  辰: { char: "辰", pinyin: "Chén", animalEn: "Dragon", animalZh: "龙", element: "Earth", polarity: "Yang" },
  巳: { char: "巳", pinyin: "Sì", animalEn: "Snake", animalZh: "蛇", element: "Fire", polarity: "Yin" },
  午: { char: "午", pinyin: "Wǔ", animalEn: "Horse", animalZh: "马", element: "Fire", polarity: "Yang" },
  未: { char: "未", pinyin: "Wèi", animalEn: "Goat", animalZh: "羊", element: "Earth", polarity: "Yin" },
  申: { char: "申", pinyin: "Shēn", animalEn: "Monkey", animalZh: "猴", element: "Metal", polarity: "Yang" },
  酉: { char: "酉", pinyin: "Yǒu", animalEn: "Rooster", animalZh: "鸡", element: "Metal", polarity: "Yin" },
  戌: { char: "戌", pinyin: "Xū", animalEn: "Dog", animalZh: "狗", element: "Earth", polarity: "Yang" },
  亥: { char: "亥", pinyin: "Hài", animalEn: "Pig", animalZh: "猪", element: "Water", polarity: "Yin" },
};

const DAY_MASTER_DETAILS: Record<string, Omit<DayMasterProfile, "stem">> = {
  甲: {
    nameEn: "Yang Wood (Jia)",
    nameZh: "甲木（阳木）",
    polarity: "Yang",
    element: "Wood",
    elementZh: "木",
    archetypeEn: "The Towering Oak",
    archetypeZh: "顶天立地的参天大木",
    essenceEn: "Steadfast, righteous, and progressive. You possess immense vitality and natural leadership, standing tall in storms.",
    essenceZh: "正直仁慈，进取心极强。具有大将风度与独立担当，如同挺拔的大树，庇荫四方。",
    strengthsEn: ["Pioneering vision", "Unwavering integrity", "Resilient stamina", "Protective leadership"],
    strengthsZh: ["胸怀开阔", "坚毅不拔", "仁爱公道", "勇于拓荒"],
    growthAreasEn: ["Inflexibility or stubbornness", "Difficulty yielding or showing vulnerability"],
    growthAreasZh: ["易宁折不弯", "过刚易折", "偶尔固执"],
    cosmicAdviceEn: "Embrace flexibility without compromising your roots. True strength learns to bend like bamboo in high winds.",
    cosmicAdviceZh: "大木宜适度修剪与取柔，刚柔并济方能化作栋梁之材。"
  },
  乙: {
    nameEn: "Yin Wood (Yi)",
    nameZh: "乙木（阴木）",
    polarity: "Yin",
    element: "Wood",
    elementZh: "木",
    archetypeEn: "The Resilient Vine",
    archetypeZh: "柔韧通达的灵秀芳草",
    essenceEn: "Graceful, diplomatic, and supremely adaptable. You navigate obstacles by winding around them with artistic finesse.",
    essenceZh: "外柔内刚，富有同理心与应变智慧。善于借力使力，在逆境中如藤蔓般顽强攀升。",
    strengthsEn: ["High emotional intelligence", "Diplomatic charm", "Supreme adaptability", "Aesthetic intuition"],
    strengthsZh: ["见机行事", "灵动优雅", "善结人缘", "艺术鉴赏力高"],
    growthAreasEn: ["Indecision or codependency", "Vulnerability to changing winds"],
    growthAreasZh: ["易受环境牵引", "偶显摇摆不定", "多愁善感"],
    cosmicAdviceEn: "Choose strong supports and allies to climb towards your highest sunlight.",
    cosmicAdviceZh: "善于寻找良木依托，顺势而为，以柔克刚即是最大福分。"
  },
  丙: {
    nameEn: "Yang Fire (Bing)",
    nameZh: "丙火（阳火）",
    polarity: "Yang",
    element: "Fire",
    elementZh: "火",
    archetypeEn: "The Radiant Sun",
    archetypeZh: "照临四方的普照烈日",
    essenceEn: "Generous, charismatic, and luminous. You illuminate every room, radiating warmth, energy, and passionate optimism.",
    essenceZh: "热情奔放，光明磊落。如旭日普照大地，毫无保留地释放光明与温度，极具感染力。",
    strengthsEn: ["Inspiring presence", "Boundless warmth", "Transparent honesty", "Magnetic charisma"],
    strengthsZh: ["大公无私", "激情澎湃", "乐善好施", "感染力卓越"],
    growthAreasEn: ["Impatience or burnout", "Tendency to overshadow others or crave constant validation"],
    growthAreasZh: ["性急易怒", "易三分钟热度", "燃烧过度忽视自我充能"],
    cosmicAdviceEn: "Channel your solar energy into sustainable focus; remember that the sun also sets to recharge.",
    cosmicAdviceZh: "阳光普照时亦需敛光内照，持之以恒胜过瞬间炽热。"
  },
  丁: {
    nameEn: "Yin Fire (Ding)",
    nameZh: "丁火（阴火）",
    polarity: "Yin",
    element: "Fire",
    elementZh: "火",
    archetypeEn: "The Sacred Flame",
    archetypeZh: "点亮暗夜的引路烛火",
    essenceEn: "Refined, spiritual, and laser-focused. Like candlelight or starfire, you guide the lost and illuminate unseen truths.",
    essenceZh: "温和谦逊，内蕴慧光。思维深邃敏感，如暗夜明灯，擅长在专业领域与精神世界深度探索。",
    strengthsEn: ["Profound intuition", "Devoted mentorship", "Strategic precision", "Spiritual perception"],
    strengthsZh: ["洞察入微", "奉献利他", "专注深耕", "富有哲思"],
    growthAreasEn: ["Hypersensitivity to critique", "Overthinking or passive-aggressive reticence"],
    growthAreasZh: ["多疑多虑", "内心易生内耗", "防备心偏重"],
    cosmicAdviceEn: "Keep your inner flame fed with peaceful solitude and nourishing spiritual fuels.",
    cosmicAdviceZh: "常添心油以保长明，少陷入枝节计较，慧火方能化为光明之灯。"
  },
  戊: {
    nameEn: "Yang Earth (Wu)",
    nameZh: "戊土（阳土）",
    polarity: "Yang",
    element: "Earth",
    elementZh: "土",
    archetypeEn: "The Ancient Mountain",
    archetypeZh: "镇守八方的巍巍崇山",
    essenceEn: "Solid, trustworthy, and monumental. You are a natural rock for others, offering immense security and patience.",
    essenceZh: "沉稳厚重，重信守诺。如高山厚土，包容沉静，能承担重任，是身边人最信赖的依靠。",
    strengthsEn: ["Rock-solid dependability", "Strategic patience", "Generous sanctuary", "Moral fortitude"],
    strengthsZh: ["厚德载物", "信用笃实", "胸襟宽博", "抗压能力极强"],
    growthAreasEn: ["Rigidity or inertia", "Resistance to fast innovation"],
    growthAreasZh: ["行动稍缓", "略显固执保守", "不善表达内心情感"],
    cosmicAdviceEn: "Allow the winds of change to shape your peaks; true mountains remain immovable while blessing the valleys.",
    cosmicAdviceZh: "土厚宜水木疏通，适度接纳创新与流通，方不致厚重板结。"
  },
  己: {
    nameEn: "Yin Earth (Ji)",
    nameZh: "己土（阴土）",
    polarity: "Yin",
    element: "Earth",
    elementZh: "土",
    archetypeEn: "The Fertile Garden",
    archetypeZh: "孕育万物的温润田园",
    essenceEn: "Nurturing, practical, and culturally refined. You possess the alchemy to cultivate raw potential into bountiful harvest.",
    essenceZh: "温和包容，善解人意。如田园之土，滋养万物生根发芽，多才多艺且极具包容亲和力。",
    strengthsEn: ["Exceptional resourcefulness", "Nurturing patience", "Tactful diplomacy", "Artistic appreciation"],
    strengthsZh: ["宽容体贴", "善于调和", "多才多艺", "细腻周全"],
    growthAreasEn: ["People-pleasing tendencies", "Stashing emotional grievances"],
    growthAreasZh: ["委曲求全", "多思多虑", "易生优柔寡断"],
    cosmicAdviceEn: "Protect your fertile soil from being over-farmed by others; set conscious emotional boundaries.",
    cosmicAdviceZh: "自爱方能爱人，守好自身边界，阳光与灌溉均衡则福报深厚。"
  },
  庚: {
    nameEn: "Yang Metal (Geng)",
    nameZh: "庚金（阳金）",
    polarity: "Yang",
    element: "Metal",
    elementZh: "金",
    archetypeEn: "The Celestial Blade",
    archetypeZh: "斩断杂乱的肃穆神剑",
    essenceEn: "Decisive, principled, and courageous. You cut through falsehood with razor clarity and thrive under pressure and refinement.",
    essenceZh: "刚毅果敢，重情重义。性情豪迈直爽，敢作敢当，历经火炼磨砺方能铸成无上神兵利器。",
    strengthsEn: ["Unmatched decisiveness", "Fierce loyalty", "Crisp execution", "Moral justice"],
    strengthsZh: ["仗义疏财", "行事利落", "百折不挠", "富有开拓胆魄"],
    growthAreasEn: ["Blunt tactlessness", "Reluctance to forgive slight offenses"],
    growthAreasZh: ["性烈刚猛", "说话直率易伤人", "好打抱不平易树敌"],
    cosmicAdviceEn: "Embrace the tempering fire of life with grace; every challenge sharpens your sacred blade.",
    cosmicAdviceZh: "宝剑锋从磨砺出，克制急躁与锋芒，大将之风在于知止与包容。"
  },
  辛: {
    nameEn: "Yin Metal (Xin)",
    nameZh: "辛金（阴金）",
    polarity: "Yin",
    element: "Metal",
    elementZh: "金",
    archetypeEn: "The Polished Gem",
    archetypeZh: "耀世生辉的璀璨金玉",
    essenceEn: "Refined, eloquent, and elegant. You demand excellence, possessing supreme aesthetic standards and resilient inner fortitude.",
    essenceZh: "温润灵秀，自重矜贵。注重品位、形象与精神洁癖，在逆境中愈磨愈亮，如宝石般闪烁光芒。",
    strengthsEn: ["Impeccable aesthetics", "Sharp analytical wit", "Self-mastery", "Distinguished charm"],
    strengthsZh: ["自律严谨", "谈吐风雅", "心思缜密", "追求完美"],
    growthAreasEn: ["Critical perfectionism", "Hypersensitivity to vanity and status"],
    growthAreasZh: ["易追求虚荣", "求全责备", "清高自傲易孤芳自赏"],
    cosmicAdviceEn: "Value your inner luster over external applause; true jewels shine brightest in gentle light.",
    cosmicAdviceZh: "水润金明，多以智水洗濯心尘，温和谦逊能纳万般尊荣。"
  },
  壬: {
    nameEn: "Yang Water (Ren)",
    nameZh: "壬水（阳水）",
    polarity: "Yang",
    element: "Water",
    elementZh: "水",
    archetypeEn: "The Boundless Ocean",
    archetypeZh: "奔涌不息的浩瀚江海",
    essenceEn: "Visionary, expansive, and unstoppable. You flow through barriers, possessing deep intelligence and vast global foresight.",
    essenceZh: "智谋深广，襟怀坦荡。如滔滔江河奔流到海，极富开拓精神与远见卓识，适应力与行动力极强。",
    strengthsEn: ["Strategic mastermind", "Dynamic agility", "Inspirational vision", "Generous abundance"],
    strengthsZh: ["智勇双全", "应变如神", "豁达洒脱", "宏观格局大"],
    growthAreasEn: ["Restlessness or lack of follow-through", "Overwhelming intensity"],
    growthAreasZh: ["任性放任", "情绪起伏大", "易冲动决堤缺乏收敛"],
    cosmicAdviceEn: "Build conscious banks and channels (Earth) for your mighty river to generate enduring civilization.",
    cosmicAdviceZh: "海纳百川需堤岸规范，懂得自律与克制，方能水到渠成造福四方。"
  },
  癸: {
    nameEn: "Yin Water (Gui)",
    nameZh: "癸水（阴水）",
    polarity: "Yin",
    element: "Water",
    elementZh: "水",
    archetypeEn: "The Morning Mist",
    archetypeZh: "润物无声的甘露清泉",
    essenceEn: "Intuitive, gentle, and profoundly perceptive. You penetrate the deepest mysteries with quiet spiritual grace and universal empathy.",
    essenceZh: "聪明聪颖，心性纯善。如春风化雨润物无声，擅长心理感悟与默默付出，灵性与洞察力极高。",
    strengthsEn: ["Deep psychic intuition", "Quiet persistence", "Selfless empathy", "Philosophical wisdom"],
    strengthsZh: ["聪慧灵动", "柔和包容", "悟性超绝", "默默滋润人心"],
    growthAreasEn: ["Secretiveness or escapism", "Absorbing others' negative energy"],
    growthAreasZh: ["多愁善感", "易陷入消极逃避", "内心防线脆弱"],
    cosmicAdviceEn: "Anchor your misty reflections into tangible creations so your sacred insights nourish the world.",
    cosmicAdviceZh: "甘露宜滋润良木，保持阳光心态，将灵感化作切实的行动与温情。"
  }
};

const ELEMENT_COLORS: Record<WuXing, string> = {
  Wood: "#10B981",
  Fire: "#EF4444",
  Earth: "#F59E0B",
  Metal: "#94A3B8",
  Water: "#06B6D4"
};

const ELEMENT_ZH_MAP: Record<WuXing, string> = {
  Wood: "木",
  Fire: "火",
  Earth: "土",
  Metal: "金",
  Water: "水"
};

/**
 * Calculates BaZi Four Pillars, Day Master and Five Elements distribution
 */
export function calculateBaZi(
  year: number,
  month: number,
  day: number,
  hour: number = 12,
  minute: number = 0
): BaZiCalculationResult {
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  const yearGan = eightChar.getYearGan();
  const yearZhi = eightChar.getYearZhi();
  const monthGan = eightChar.getMonthGan();
  const monthZhi = eightChar.getMonthZhi();
  const dayGan = eightChar.getDayGan();
  const dayZhi = eightChar.getDayZhi();
  const timeGan = eightChar.getTimeGan();
  const timeZhi = eightChar.getTimeZhi();

  const yearGanInfo = STEMS_MAP[yearGan] || STEMS_MAP["甲"];
  const yearZhiInfo = BRANCHES_MAP[yearZhi] || BRANCHES_MAP["子"];
  const monthGanInfo = STEMS_MAP[monthGan] || STEMS_MAP["甲"];
  const monthZhiInfo = BRANCHES_MAP[monthZhi] || BRANCHES_MAP["子"];
  const dayGanInfo = STEMS_MAP[dayGan] || STEMS_MAP["甲"];
  const dayZhiInfo = BRANCHES_MAP[dayZhi] || BRANCHES_MAP["子"];
  const timeGanInfo = STEMS_MAP[timeGan] || STEMS_MAP["甲"];
  const timeZhiInfo = BRANCHES_MAP[timeZhi] || BRANCHES_MAP["子"];

  const pillars = {
    year: {
      nameEn: "Year Pillar",
      nameZh: "年柱",
      gan: yearGan,
      ganInfo: yearGanInfo,
      zhi: yearZhi,
      zhiInfo: yearZhiInfo,
      naYin: eightChar.getYearNaYin(),
      lifeDomainEn: "Ancestry, Social Persona & Generational Theme",
      lifeDomainZh: "祖业根基、外在气象与早年社会运势"
    },
    month: {
      nameEn: "Month Pillar",
      nameZh: "月柱",
      gan: monthGan,
      ganInfo: monthGanInfo,
      zhi: monthZhi,
      zhiInfo: monthZhiInfo,
      naYin: eightChar.getMonthNaYin(),
      lifeDomainEn: "Career Calling, Parents & Societal Drive",
      lifeDomainZh: "事业格局、父母家风与青年进取运势"
    },
    day: {
      nameEn: "Day Pillar (The Core)",
      nameZh: "日柱（命核）",
      gan: dayGan,
      ganInfo: dayGanInfo,
      zhi: dayZhi,
      zhiInfo: dayZhiInfo,
      naYin: eightChar.getDayNaYin(),
      lifeDomainEn: "The True Self (Day Master) & Intimate Palace",
      lifeDomainZh: "本命日主元神与夫妻婚姻内宫"
    },
    hour: {
      nameEn: "Hour Pillar",
      nameZh: "时柱",
      gan: timeGan,
      ganInfo: timeGanInfo,
      zhi: timeZhi,
      zhiInfo: timeZhiInfo,
      naYin: eightChar.getTimeNaYin(),
      lifeDomainEn: "Inner Ambition, Children & Late-Life Legacy",
      lifeDomainZh: "深层潜意识、子女晚景与归宿归宿"
    }
  };

  // Day Master
  const dayMasterDetails = DAY_MASTER_DETAILS[dayGan] || DAY_MASTER_DETAILS["甲"];
  const dayMaster: DayMasterProfile = {
    stem: dayGan,
    ...dayMasterDetails
  };

  // Count elements from 4 stems + 4 branches (total 8 elements base)
  const elementCounts: Record<WuXing, number> = {
    Wood: 0,
    Fire: 0,
    Earth: 0,
    Metal: 0,
    Water: 0
  };

  [yearGanInfo.element, monthGanInfo.element, dayGanInfo.element, timeGanInfo.element].forEach(
    el => elementCounts[el]++
  );
  [yearZhiInfo.element, monthZhiInfo.element, dayZhiInfo.element, timeZhiInfo.element].forEach(
    el => elementCounts[el]++
  );

  const total = 8;
  const elementsOrder: WuXing[] = ["Wood", "Fire", "Earth", "Metal", "Water"];
  const fiveElements: ElementBalance[] = elementsOrder.map(el => {
    const count = elementCounts[el];
    const pct = Math.round((count / total) * 100);
    let status: "Lacking" | "Balanced" | "Dominant" = "Balanced";
    let statusZh: "偏弱" | "均衡" | "旺盛" = "均衡";

    if (count === 0 || pct <= 12) {
      status = "Lacking";
      statusZh = "偏弱";
    } else if (count >= 3 || pct >= 35) {
      status = "Dominant";
      statusZh = "旺盛";
    }

    return {
      element: el,
      elementZh: ELEMENT_ZH_MAP[el],
      count,
      percentage: pct,
      status,
      statusZh,
      colorHex: ELEMENT_COLORS[el]
    };
  });

  // Sort to find dominant and lacking
  const sorted = [...fiveElements].sort((a, b) => b.count - a.count);
  const dominantElement = sorted[0].element;
  const lacking = [...fiveElements].find(e => e.count === 0 || e.status === "Lacking");
  const lackingElement = lacking ? lacking.element : null;

  // Recommendations
  let elementRecommendationsEn = "";
  let elementRecommendationsZh = "";

  if (lackingElement === "Wood") {
    elementRecommendationsEn = "Your chart lacks Wood energy. Nurture vitality with living green plants, botanical scents, spending time in forests, and wearing jade or forest green hues.";
    elementRecommendationsZh = "命局木气偏弱，宜亲近自然、多养阔叶绿植，起居多用青绿色、木质家居，保持蓬勃朝气。";
  } else if (lackingElement === "Fire") {
    elementRecommendationsEn = "Your chart lacks Fire energy. Cultivate warmth through morning sunshine, bright lighting, dynamic cardiovascular movement, and wearing red or warm amber accents.";
    elementRecommendationsZh = "命局火气偏弱，宜多迎晨光朝阳，多做有氧运动，佩戴暖色晶石或着红紫色系衣物，激发内心热情。";
  } else if (lackingElement === "Earth") {
    elementRecommendationsEn = "Your chart lacks Earth energy. Ground your spirit through mindful walking, ceramics, pottery, balanced warm whole foods, and grounding brown/ochre tones.";
    elementRecommendationsZh = "命局土气偏弱，宜常做赤足接地气冥想，接触陶艺奇石，饮食宜温厚甘润，家居选用米黄色系增添定力。";
  } else if (lackingElement === "Metal") {
    elementRecommendationsEn = "Your chart lacks Metal energy. Sharpen your precision through minimalist decluttering, structured routines, breathwork, and wearing refined platinum/white jewelry.";
    elementRecommendationsZh = "命局金气偏弱，宜崇尚极简断舍离，培养规律作息与决断力，佩戴纯银白金饰品以聚肃整之气。";
  } else if (lackingElement === "Water") {
    elementRecommendationsEn = "Your chart lacks Water energy. Refresh your intuition through hydrating waterscapes, deep swimming, reflective journaling, and wearing navy/abyssal black.";
    elementRecommendationsZh = "命局水气偏弱，宜临水安居或常置流水风水轮，多饮优质好水与深层静修，着深蓝墨黑色调以润灵台。";
  } else {
    elementRecommendationsEn = "Your five elements are remarkably harmonized. Focus on steady internal rhythm, conscious breathing, and mindful self-regulation to sustain your natural equilibrium.";
    elementRecommendationsZh = "五行气场流转相对中和平衡，平日重在修心养性、顺应四时节气，自得安泰吉祥。";
  }

  return {
    birthSolar: { year, month, day, hour, minute },
    lunarString: `${lunar.getYearInGanZhi()}年 (${lunar.getYearShengXiao()}) ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
    zodiacSignEn: yearZhiInfo.animalEn,
    zodiacSignZh: yearZhiInfo.animalZh,
    pillars,
    dayMaster,
    fiveElements,
    dominantElement,
    lackingElement,
    elementRecommendationsEn,
    elementRecommendationsZh
  };
}
