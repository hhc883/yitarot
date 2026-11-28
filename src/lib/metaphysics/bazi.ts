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
  /** 十神（日柱主星为「日主/元神」） */
  shiShen?: string;
  /** 地支藏干 */
  hideGan?: string[];
  /** 地支藏干十神 */
  shiShenZhi?: string[];
  /** 旬空 */
  xunKong?: string;
  /** 星运（日主对本柱地支十二长生） */
  xingYun?: string;
  /** 自坐（本柱天干对本柱地支十二长生） */
  ziZuo?: string;
  /** 本柱神煞列表 */
  shenSha?: string[];
}

export interface BaZiOptions {
  /** 性别：1/"male" 为男，0/"female" 为女（用于排大运流年） */
  gender?: "male" | "female" | 1 | 0;
  /** 早晚子时流派：2 为区分早晚子时（23点日柱不变，默认），1 为 23 点换日柱 */
  sect?: 1 | 2;
  /** 返回大运步数（默认 8 步） */
  daYunCount?: number;
}

export interface LiuYueItem {
  termName: string;
  termDate: string;
  ganZhi: string;
}

export interface DaYunStep {
  index: number;
  isXiaoYun?: boolean;
  ganZhi: string;
  startAge: number;
  endAge: number;
  startYear: number;
  endYear: number;
  liuNian: Array<{
    year: number;
    age: number;
    ganZhi: string;
    xiaoYunGanZhi?: string;
    liuYue?: LiuYueItem[];
  }>;
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
  /** 早晚子时流派（1=23点换日柱，2=区分早晚子时） */
  sect?: 1 | 2;
  /** 胎元 */
  taiYuan?: string;
  /** 胎息 */
  taiXi?: string;
  /** 命宫 */
  mingGong?: string;
  /** 身宫 */
  shenGong?: string;
  /** 日柱旬空 */
  dayXunKong?: string;
  /** 月令司令藏干 */
  siLing?: string;
  /** 小运与流年完整柱信息 */
  extraPillars?: {
    xiaoYun?: PillarData;
    liuNian?: PillarData;
  };
  /** 起运与大运流年 */
  yun?: {
    gender: "male" | "female";
    startYear: number;
    startMonth: number;
    startDay: number;
    startDate: string;
    xiaoYunGanZhi?: string;
    currentYearGanZhi?: string;
    daYun: DaYunStep[];
  };
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

export const ELEMENT_COLORS: Record<WuXing, string> = {
  Wood: "#10B981",
  Fire: "#EF4444",
  Earth: "#F59E0B",
  Metal: "#94A3B8",
  Water: "#06B6D4"
};

export const ELEMENT_ZH_MAP: Record<WuXing, string> = {
  Wood: "木",
  Fire: "火",
  Earth: "土",
  Metal: "金",
  Water: "水"
};

const CHANG_SHENG_ORDER = ["长生", "沐浴", "冠带", "临官", "帝旺", "衰", "病", "死", "墓", "绝", "胎", "养"] as const;
const ZHI_ORDER = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;
const CHANG_SHENG_START: Record<string, { startZhi: string; dir: 1 | -1 }> = {
  甲: { startZhi: "亥", dir: 1 }, 乙: { startZhi: "午", dir: -1 },
  丙: { startZhi: "寅", dir: 1 }, 丁: { startZhi: "酉", dir: -1 },
  戊: { startZhi: "寅", dir: 1 }, 己: { startZhi: "酉", dir: -1 },
  庚: { startZhi: "巳", dir: 1 }, 辛: { startZhi: "子", dir: -1 },
  壬: { startZhi: "申", dir: 1 }, 癸: { startZhi: "卯", dir: -1 },
};

const STEMS_10 = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
const HIDE_GAN_MAP: Record<string, string[]> = {
  子: ["癸"], 丑: ["己", "癸", "辛"], 寅: ["甲", "丙", "戊"], 卯: ["乙"],
  辰: ["戊", "乙", "癸"], 巳: ["丙", "庚", "戊"], 午: ["丁", "己"], 未: ["己", "丁", "乙"],
  申: ["庚", "壬", "戊"], 酉: ["辛"], 戌: ["戊", "辛", "丁"], 亥: ["壬", "甲"],
};
const NAYIN_60: Record<string, string> = {
  甲子: "海中金", 乙丑: "海中金", 丙寅: "炉中火", 丁卯: "炉中火", 戊辰: "大林木", 己巳: "大林木",
  庚午: "路旁土", 辛未: "路旁土", 壬申: "剑锋金", 癸酉: "剑锋金", 甲戌: "山头火", 乙亥: "山头火",
  丙子: "涧下水", 丁丑: "涧下水", 戊寅: "城头土", 己卯: "城头土", 庚辰: "白蜡金", 辛巳: "白蜡金",
  壬午: "杨柳木", 癸未: "杨柳木", 甲申: "泉中水", 乙酉: "泉中水", 丙戌: "屋上土", 丁亥: "屋上土",
  戊子: "霹雳火", 己丑: "霹雳火", 庚寅: "松柏木", 辛卯: "松柏木", 壬辰: "长流水", 癸巳: "长流水",
  甲午: "沙中金", 乙未: "沙中金", 丙申: "山下火", 丁酉: "山下火", 戊戌: "平地木", 己亥: "平地木",
  庚子: "壁上土", 辛丑: "壁上土", 壬寅: "金箔金", 癸卯: "金箔金", 甲辰: "覆灯火", 乙巳: "覆灯火",
  丙午: "天河水", 丁未: "天河水", 戊申: "大驿土", 己酉: "大驿土", 庚戌: "钗钏金", 辛亥: "钗钏金",
  壬子: "桑柘木", 癸丑: "桑柘木", 甲寅: "大溪水", 乙卯: "大溪水", 丙辰: "沙中土", 丁巳: "沙中土",
  戊午: "天上火", 己未: "天上火", 庚申: "石榴木", 辛酉: "石榴木", 壬戌: "大海水", 癸亥: "大海水",
};

export function getShiShen(dayGan: string, targetGan: string): string {
  const d = STEMS_MAP[dayGan];
  const t = STEMS_MAP[targetGan];
  if (!d || !t) return "";
  const samePol = d.polarity === t.polarity;
  const gen: Record<WuXing, WuXing> = { Wood: "Fire", Fire: "Earth", Earth: "Metal", Metal: "Water", Water: "Wood" };
  const ke: Record<WuXing, WuXing> = { Wood: "Earth", Earth: "Water", Water: "Fire", Fire: "Metal", Metal: "Wood" };
  if (d.element === t.element) return samePol ? "比肩" : "劫财";
  if (gen[d.element] === t.element) return samePol ? "食神" : "伤官";
  if (gen[t.element] === d.element) return samePol ? "偏印" : "正印";
  if (ke[d.element] === t.element) return samePol ? "偏财" : "正财";
  return samePol ? "七杀" : "正官";
}

export const SHISHEN_SHORT: Record<string, string> = {
  比肩: "比", 劫财: "劫", 食神: "食", 伤官: "伤",
  偏财: "才", 正财: "财", 七杀: "杀", 正官: "官",
  偏印: "枭", 正印: "印",
};

function getXunKongOf(gan: string, zhi: string): string {
  const gIdx = STEMS_10.indexOf(gan as (typeof STEMS_10)[number]);
  const zIdx = ZHI_ORDER.indexOf(zhi as (typeof ZHI_ORDER)[number]);
  if (gIdx < 0 || zIdx < 0) return "";
  const start = ((zIdx - gIdx) % 12 + 12) % 12;
  return `${ZHI_ORDER[(start + 10) % 12]}${ZHI_ORDER[(start + 11) % 12]}`;
}

function getPillarShenSha(
  gan: string,
  zhi: string,
  dayGan: string,
  dayZhi: string,
  yearZhi: string,
  monthZhi: string,
  isDayPillar: boolean
): string[] {
  const list: string[] = [];
  const tianYi: Record<string, string> = { 甲: "丑未", 戊: "丑未", 庚: "丑未", 乙: "子申", 己: "子申", 丙: "亥酉", 丁: "亥酉", 壬: "巳卯", 癸: "巳卯", 辛: "午寅" };
  const taiJi: Record<string, string> = { 甲: "子午", 乙: "子午", 丙: "卯酉", 丁: "卯酉", 戊: "辰戌丑未", 己: "辰戌丑未", 庚: "寅亥", 辛: "寅亥", 壬: "巳申", 癸: "巳申" };
  const wenChang: Record<string, string> = { 甲: "巳", 乙: "午", 丙: "申", 丁: "酉", 戊: "申", 己: "酉", 庚: "亥", 辛: "子", 壬: "寅", 癸: "卯" };
  const tianChu: Record<string, string> = { 甲: "巳", 乙: "午", 丙: "子", 丁: "巳", 戊: "午", 己: "申", 庚: "寅", 辛: "午", 壬: "酉", 癸: "亥" };
  const fuXing: Record<string, string> = { 甲: "寅", 丙: "寅", 乙: "丑", 癸: "丑", 戊: "申", 己: "未", 丁: "亥", 庚: "午", 辛: "巳", 壬: "辰" };
  const guoYin: Record<string, string> = { 甲: "戌", 乙: "亥", 丙: "丑", 丁: "寅", 戊: "丑", 己: "寅", 庚: "辰", 辛: "巳", 壬: "未", 癸: "申" };
  const hongYan: Record<string, string> = { 甲: "午", 乙: "午", 丙: "寅", 丁: "未", 戊: "辰", 己: "辰", 庚: "戌", 辛: "酉", 壬: "子", 癸: "申" };
  const jinYu: Record<string, string> = { 甲: "辰", 乙: "巳", 丙: "未", 丁: "申", 戊: "未", 己: "申", 庚: "戌", 辛: "亥", 壬: "丑", 癸: "寅" };
  const tianDe: Record<string, string> = { 寅: "丁", 卯: "申", 辰: "壬", 巳: "辛", 午: "亥", 未: "甲", 申: "癸", 酉: "寅", 戌: "丙", 亥: "乙", 子: "巳", 丑: "庚" };
  const deXiu: Record<string, string> = { 寅: "丙丁", 午: "丙丁", 戌: "丙丁", 申: "壬癸", 子: "壬癸", 辰: "壬癸", 巳: "庚辛", 酉: "庚辛", 丑: "庚辛", 亥: "甲乙", 卯: "甲乙", 未: "甲乙" };
  const sanHe: Record<string, { jiang: string; tao: string; ma: string; jie: string; zai: string; wang: string }> = {
    申: { jiang: "子", tao: "酉", ma: "寅", jie: "巳", zai: "午", wang: "亥" },
    子: { jiang: "子", tao: "酉", ma: "寅", jie: "巳", zai: "午", wang: "亥" },
    辰: { jiang: "子", tao: "酉", ma: "寅", jie: "巳", zai: "午", wang: "亥" },
    寅: { jiang: "午", tao: "卯", ma: "申", jie: "亥", zai: "子", wang: "巳" },
    午: { jiang: "午", tao: "卯", ma: "申", jie: "亥", zai: "子", wang: "巳" },
    戌: { jiang: "午", tao: "卯", ma: "申", jie: "亥", zai: "子", wang: "巳" },
    巳: { jiang: "酉", tao: "午", ma: "亥", jie: "寅", zai: "卯", wang: "申" },
    酉: { jiang: "酉", tao: "午", ma: "亥", jie: "寅", zai: "卯", wang: "申" },
    丑: { jiang: "酉", tao: "午", ma: "亥", jie: "寅", zai: "卯", wang: "申" },
    亥: { jiang: "卯", tao: "子", ma: "巳", jie: "申", zai: "酉", wang: "寅" },
    卯: { jiang: "卯", tao: "子", ma: "巳", jie: "申", zai: "酉", wang: "寅" },
    未: { jiang: "卯", tao: "子", ma: "巳", jie: "申", zai: "酉", wang: "寅" },
  };
  if (tianYi[dayGan]?.includes(zhi)) list.push("天乙贵人");
  if (tianDe[monthZhi] === gan || tianDe[monthZhi] === zhi) list.push("天德贵人");
  if (deXiu[monthZhi]?.includes(gan)) list.push("德秀贵人");
  if (wenChang[dayGan] === zhi) list.push("文昌贵人");
  if (tianChu[dayGan] === zhi) list.push("天厨贵人");
  if (fuXing[dayGan] === zhi) list.push("福星贵人");
  if (taiJi[dayGan]?.includes(zhi)) list.push("太极贵人");
  if (guoYin[dayGan] === zhi) list.push("国印贵人");
  const grpDay = sanHe[dayZhi];
  const grpYear = sanHe[yearZhi];
  if (grpDay?.jiang === zhi || grpYear?.jiang === zhi) list.push("将星");
  if (hongYan[dayGan] === zhi) list.push("红艳");
  if (grpDay?.tao === zhi || grpYear?.tao === zhi) list.push("桃花");
  if (grpDay?.jie === zhi || grpYear?.jie === zhi) list.push("劫煞");
  if (grpDay?.zai === zhi || grpYear?.zai === zhi) list.push("灾煞");
  if (grpDay?.ma === zhi) list.push("日马");
  if (grpDay?.wang === zhi || grpYear?.wang === zhi) list.push("亡神");
  if (jinYu[dayGan] === zhi) list.push("金舆");
  if (isDayPillar) {
    if (["甲辰", "乙巳", "丙申", "丁亥", "戊戌", "己丑", "庚辰", "辛巳", "壬申", "癸亥"].includes(`${gan}${zhi}`)) list.push("十恶大败");
    if (["乙巳", "丁巳", "辛亥", "戊申", "壬寅", "戊午", "壬子", "丙午"].includes(`${gan}${zhi}`)) list.push("孤鸾煞");
  }
  return Array.from(new Set(list)).slice(0, 7);
}

function buildDynamicPillar(
  nameZh: string,
  nameEn: string,
  ganZhi: string,
  dayGan: string,
  dayZhi: string,
  yearZhi: string,
  monthZhi: string
): PillarData {
  const gan = ganZhi[0] || "甲";
  const zhi = ganZhi[1] || "子";
  const ganInfo = STEMS_MAP[gan] || STEMS_MAP["甲"];
  const zhiInfo = BRANCHES_MAP[zhi] || BRANCHES_MAP["子"];
  const hideGan = HIDE_GAN_MAP[zhi] || [];
  return {
    nameEn,
    nameZh,
    gan,
    ganInfo,
    zhi,
    zhiInfo,
    naYin: NAYIN_60[ganZhi] || "",
    lifeDomainEn: nameEn,
    lifeDomainZh: nameZh,
    shiShen: getShiShen(dayGan, gan),
    hideGan,
    shiShenZhi: hideGan.map((hg) => getShiShen(dayGan, hg)),
    xunKong: getXunKongOf(gan, zhi),
    xingYun: getChangSheng(dayGan, zhi),
    ziZuo: getChangSheng(gan, zhi),
    shenSha: getPillarShenSha(gan, zhi, dayGan, dayZhi, yearZhi, monthZhi, false),
  };
}

function getSiLingStem(solar: Solar, monthZhi: string): string {
  const prevJie = solar.getLunar().getPrevJie(false);
  const daysSince = Math.max(0, Math.floor((solar.getJulianDay() - prevJie.getSolar().getJulianDay())));
  const rules: Record<string, Array<[string, number]>> = {
    寅: [["戊", 7], ["丙", 7], ["甲", 16]],
    卯: [["甲", 10], ["乙", 20]],
    辰: [["乙", 9], ["癸", 3], ["戊", 18]],
    巳: [["戊", 5], ["庚", 9], ["丙", 16]],
    午: [["丙", 10], ["己", 9], ["丁", 11]],
    未: [["丁", 9], ["乙", 3], ["己", 18]],
    申: [["戊", 7], ["壬", 7], ["庚", 16]],
    酉: [["庚", 10], ["辛", 20]],
    戌: [["辛", 9], ["丁", 3], ["戊", 18]],
    亥: [["戊", 7], ["甲", 5], ["壬", 18]],
    子: [["壬", 10], ["癸", 20]],
    丑: [["癸", 9], ["辛", 3], ["己", 18]],
  };
  const segs = rules[monthZhi];
  if (!segs) return HIDE_GAN_MAP[monthZhi]?.[0] || "壬";
  let acc = 0;
  for (const [stem, days] of segs) {
    acc += days;
    if (daysSince < acc) return stem;
  }
  return segs[segs.length - 1][0];
}
  const LIU_YUE_TERMS = [
  ["立春", "2.4"], ["惊蛰", "3.5"], ["清明", "4.5"], ["立夏", "5.5"],
  ["芒种", "6.5"], ["小暑", "7.7"], ["立秋", "8.7"], ["白露", "9.7"],
  ["寒露", "10.8"], ["立冬", "11.7"], ["大雪", "12.7"], ["小寒", "1.5"],
] as const;

function getChangSheng(gan: string, zhi: string): string {
  const cfg = CHANG_SHENG_START[gan];
  if (!cfg) return "";
  const sIdx = ZHI_ORDER.indexOf(cfg.startZhi as (typeof ZHI_ORDER)[number]);
  const zIdx = ZHI_ORDER.indexOf(zhi as (typeof ZHI_ORDER)[number]);
  if (sIdx < 0 || zIdx < 0) return "";
  const step = (((zIdx - sIdx) * cfg.dir) % 12 + 12) % 12;
  return CHANG_SHENG_ORDER[step];
}

/**
 * Calculates BaZi Four Pillars, Day Master, Five Elements, Ten Gods, XunKong, and DaYun
 */
export function calculateBaZi(
  year: number,
  month: number,
  day: number,
  hour: number = 12,
  minute: number = 0,
  options: BaZiOptions = {}
): BaZiCalculationResult {
  const sect: 1 | 2 = options.sect === 1 ? 1 : 2;
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();
  eightChar.setSect(sect);

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
      lifeDomainZh: "祖业根基、外在气象与早年社会运势",
      shiShen: eightChar.getYearShiShenGan(),
      hideGan: eightChar.getYearHideGan(),
      shiShenZhi: eightChar.getYearShiShenZhi(),
      xunKong: eightChar.getYearXunKong(),
      xingYun: eightChar.getYearDiShi(),
      ziZuo: getChangSheng(yearGan, yearZhi),
      shenSha: getPillarShenSha(yearGan, yearZhi, dayGan, dayZhi, yearZhi, monthZhi, false),
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
      lifeDomainZh: "事业格局、父母家风与青年进取运势",
      shiShen: eightChar.getMonthShiShenGan(),
      hideGan: eightChar.getMonthHideGan(),
      shiShenZhi: eightChar.getMonthShiShenZhi(),
      xunKong: eightChar.getMonthXunKong(),
      xingYun: eightChar.getMonthDiShi(),
      ziZuo: getChangSheng(monthGan, monthZhi),
      shenSha: getPillarShenSha(monthGan, monthZhi, dayGan, dayZhi, yearZhi, monthZhi, false),
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
      lifeDomainZh: "本命日主元神与夫妻婚姻内宫",
      shiShen: options.gender === "female" || options.gender === 0 ? "元女" : "元男",
      hideGan: eightChar.getDayHideGan(),
      shiShenZhi: eightChar.getDayShiShenZhi(),
      xunKong: eightChar.getDayXunKong(),
      xingYun: eightChar.getDayDiShi(),
      ziZuo: getChangSheng(dayGan, dayZhi),
      shenSha: getPillarShenSha(dayGan, dayZhi, dayGan, dayZhi, yearZhi, monthZhi, true),
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
      lifeDomainZh: "深层潜意识、子女晚景与归宿归宿",
      shiShen: eightChar.getTimeShiShenGan(),
      hideGan: eightChar.getTimeHideGan(),
      shiShenZhi: eightChar.getTimeShiShenZhi(),
      xunKong: eightChar.getTimeXunKong(),
      xingYun: eightChar.getTimeDiShi(),
      ziZuo: getChangSheng(timeGan, timeZhi),
      shenSha: getPillarShenSha(timeGan, timeZhi, dayGan, dayZhi, yearZhi, monthZhi, false),
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

  const genderNum = options.gender === "female" || options.gender === 0 ? 0 : 1;
  const yunObj = eightChar.getYun(genderNum);
  const maxSteps = Math.max(1, Math.min(12, options.daYunCount ?? 10));
  const allDaYun = yunObj.getDaYun(1 + maxSteps);
  const firstXiaoYun = allDaYun[0]?.getXiaoYun()?.[0]?.getGanZhi();
  const firstLiuNian = allDaYun[0]?.getLiuNian()?.[0]?.getGanZhi();
  // 包含第 0 步「小运」以及后续 maxSteps 步「大运」
  const daYun: DaYunStep[] = allDaYun.slice(0, 1 + maxSteps).map((dy, idx) => {
    const xiaoList = dy.getXiaoYun();
    return {
      index: dy.getIndex(),
      isXiaoYun: idx === 0,
      ganZhi: idx === 0 ? "小运" : dy.getGanZhi(),
      startAge: dy.getStartAge(),
      endAge: dy.getEndAge(),
      startYear: dy.getStartYear(),
      endYear: dy.getEndYear(),
      liuNian: dy.getLiuNian().map((ln, lIdx) => ({
        year: ln.getYear(),
        age: ln.getAge(),
        ganZhi: ln.getGanZhi(),
        xiaoYunGanZhi: xiaoList[lIdx]?.getGanZhi() ?? firstXiaoYun,
        liuYue: ln.getLiuYue().map((ly, mIdx) => ({
          termName: LIU_YUE_TERMS[mIdx]?.[0] ?? ly.getMonthInChinese(),
          termDate: LIU_YUE_TERMS[mIdx]?.[1] ?? "",
          ganZhi: ly.getGanZhi(),
        })),
      })),
    };
  });

  const siLing = getSiLingStem(solar, monthZhi);
  const extraPillars = {
    xiaoYun: firstXiaoYun
      ? buildDynamicPillar("小运", "XiaoYun", firstXiaoYun, dayGan, dayZhi, yearZhi, monthZhi)
      : undefined,
    liuNian: firstLiuNian
      ? buildDynamicPillar("流年", "LiuNian", firstLiuNian, dayGan, dayZhi, yearZhi, monthZhi)
      : undefined,
  };

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
    elementRecommendationsZh,
    sect,
    taiYuan: eightChar.getTaiYuan(),
    taiXi: eightChar.getTaiXi(),
    mingGong: eightChar.getMingGong(),
    shenGong: eightChar.getShenGong(),
    dayXunKong: eightChar.getDayXunKong(),
    siLing,
    extraPillars,
    yun: {
      gender: genderNum === 1 ? "male" : "female",
      startYear: yunObj.getStartYear(),
      startMonth: yunObj.getStartMonth(),
      startDay: yunObj.getStartDay(),
      startDate: yunObj.getStartSolar().toYmd(),
      xiaoYunGanZhi: firstXiaoYun,
      currentYearGanZhi: firstLiuNian,
      daYun,
    },
  };
}
