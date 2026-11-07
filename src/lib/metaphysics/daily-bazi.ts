import { Solar } from "lunar-typescript";
import { calculateBaZi, BaZiCalculationResult, WuXing, ELEMENT_ZH_MAP, STEMS_MAP, BRANCHES_MAP } from "./bazi";

export interface HourlyFortune {
  hourIndex: number;
  timeRange: string;
  branchName: string;
  branchNameEn?: string;
  stemName: string;
  element: WuXing;
  score: number; // 0-100
  verdict: string;
  verdictEn?: string;
  isFavorable: boolean;
}

export interface DailyBaziFortuneResult {
  queryDate: {
    year: number;
    month: number;
    day: number;
    dayOfWeekZh: string;
    dayOfWeekEn?: string;
    solarTerms: string;
    solarTermsEn?: string;
  };
  todayGanZhi: {
    year: string;
    month: string;
    day: string;
    dayStem: string;
    dayBranch: string;
    dayElement: WuXing;
    dayElementZh: string;
    naYin: string;
  };
  userDayMaster: {
    stem: string;
    element: WuXing;
    elementZh: string;
    elementEn?: string;
    nameZh: string;
    nameEn?: string;
  };
  dailyTenGod: {
    nameZh: string;
    nameEn: string;
    descZh: string;
    descEn?: string;
    cosmicThemeZh: string;
    cosmicThemeEn?: string;
  };
  scores: {
    overall: number; // 0-100
    career: number;
    wealth: number;
    romance: number;
    wellness: number;
  };
  elementSynergy: {
    relationType: "generates" | "overcomes" | "same" | "generatedBy" | "overcomeBy";
    labelZh: string;
    labelEn?: string;
    descZh: string;
    descEn?: string;
  };
  dosAndDonts: {
    dos: string[];
    dosEn?: string[];
    donts: string[];
    dontsEn?: string[];
  };
  luckyGuides: {
    colorZh: string;
    colorEn?: string;
    colorHex: string;
    directionZh: string;
    directionEn?: string;
    number: number;
    timeWindowZh: string;
    timeWindowEn?: string;
    mindsetZh: string;
    mindsetEn?: string;
  };
  hourlyTimeline: HourlyFortune[];
}

// 十神推导算法：根据日主天干与流日天干推导十神
const TEN_GOD_MAP: Record<string, Record<string, { zh: string; en: string; desc: string; theme: string }>> = {
  甲: {
    甲: { zh: "比肩", en: "Friend", desc: "自我赋能，朋侪同气相求，适宜团队协作与独立开局", theme: "自律笃行 · 见贤思齐" },
    乙: { zh: "劫财", en: "Rob Wealth", desc: "社交开销增大，需提防冲动消费与无谓的意气之争", theme: "谨言慎行 · 稳守财库" },
    丙: { zh: "食神", en: "Eating God", desc: "灵感泉涌，才华自然舒展，极利于创意构思与享受美食", theme: "福慧双修 · 优雅表达" },
    丁: { zh: "伤官", en: "Hurting Officer", desc: "思维敏捷激进，敢于打破常规，但须克制言语锋芒", theme: "革故鼎新 · 藏锋敛锐" },
    戊: { zh: "偏财", en: "Indirect Wealth", desc: "商机敏锐，利于灵活理财、商业谈判或偶得偏财转机", theme: "洞察先机 · 稳健运筹" },
    己: { zh: "正财", en: "Direct Wealth", desc: "甲己合土，正财入位。付出与收获成正比，踏实劳作得吉", theme: "天道酬勤 · 守成蓄力" },
    庚: { zh: "七杀", en: "Seven Killings", desc: "压力与魄力并存，面临重要任务或挑战，迎难而上可立功", theme: "迎锋破浪 · 砥砺心智" },
    辛: { zh: "正官", en: "Direct Officer", desc: "贵人相助，规矩井然，利于汇报请示、面试考职与规范管理", theme: "修身立德 · 顺理成章" },
    壬: { zh: "偏印", en: "Indirect Resource", desc: "直觉深邃，利于深度学习、形而上思考或研究冷门专业", theme: "静观悟道 · 沉淀内省" },
    癸: { zh: "正印", en: "Direct Resource", desc: "慈和长辈与师友庇佑，心绪安泰，宜阅读、疗愈与补充元气", theme: "润泽生息 · 纳福安康" }
  }
};

// 补齐其余 9 天干对流日天干的十神对应
const STEM_ELEMENTS: Record<string, { element: WuXing; polarity: "Yang" | "Yin" }> = {
  甲: { element: "Wood", polarity: "Yang" },
  乙: { element: "Wood", polarity: "Yin" },
  丙: { element: "Fire", polarity: "Yang" },
  丁: { element: "Fire", polarity: "Yin" },
  戊: { element: "Earth", polarity: "Yang" },
  己: { element: "Earth", polarity: "Yin" },
  庚: { element: "Metal", polarity: "Yang" },
  辛: { element: "Metal", polarity: "Yin" },
  壬: { element: "Water", polarity: "Yang" },
  癸: { element: "Water", polarity: "Yin" }
};

const ELEMENT_GENERATION: Record<WuXing, WuXing> = {
  Wood: "Fire",
  Fire: "Earth",
  Earth: "Metal",
  Metal: "Water",
  Water: "Wood"
};

const ELEMENT_OVERCOMING: Record<WuXing, WuXing> = {
  Wood: "Earth",
  Earth: "Water",
  Water: "Fire",
  Fire: "Metal",
  Metal: "Wood"
};

export function getTenGod(dayMasterStem: string, targetStem: string) {
  if (TEN_GOD_MAP[dayMasterStem] && TEN_GOD_MAP[dayMasterStem][targetStem]) {
    return TEN_GOD_MAP[dayMasterStem][targetStem];
  }

  const dm = STEM_ELEMENTS[dayMasterStem] || STEM_ELEMENTS["甲"];
  const tg = STEM_ELEMENTS[targetStem] || STEM_ELEMENTS["甲"];
  const samePolarity = dm.polarity === tg.polarity;

  if (dm.element === tg.element) {
    return samePolarity
      ? { zh: "比肩", en: "Friend", desc: "能量共振，利于自主开局与合力协作", theme: "自律笃行 · 见贤思齐" }
      : { zh: "劫财", en: "Rob Wealth", desc: "社交繁复，需保持内省避免冲动消耗", theme: "谨言慎行 · 稳守气场" };
  }
  if (ELEMENT_GENERATION[dm.element] === tg.element) {
    return samePolarity
      ? { zh: "食神", en: "Eating God", desc: "才华舒展，利于创造性劳动与灵感释放", theme: "福慧双修 · 优雅从容" }
      : { zh: "伤官", en: "Hurting Officer", desc: "思维机敏，敢破成规，宜将锐气化为行动", theme: "革故鼎新 · 沉稳决断" };
  }
  if (ELEMENT_OVERCOMING[dm.element] === tg.element) {
    return samePolarity
      ? { zh: "偏财", en: "Indirect Wealth", desc: "商机活跃，利于开拓新财源与灵活洽谈", theme: "洞察先机 · 稳健运筹" }
      : { zh: "正财", en: "Direct Wealth", desc: "辛勤有报，踏实执行收获实实在在的成果", theme: "天道酬勤 · 步步为营" };
  }
  if (ELEMENT_OVERCOMING[tg.element] === dm.element) {
    return samePolarity
      ? { zh: "七杀", en: "Seven Killings", desc: "挑战与磨砺显现，宜专注核心把控局面", theme: "坚毅笃守 · 破局生长" }
      : { zh: "正官", en: "Direct Officer", desc: "秩序与信誉加持，利于体制、管理与公关事务", theme: "修身立德 · 顺理成章" };
  }
  if (ELEMENT_GENERATION[tg.element] === dm.element) {
    return samePolarity
      ? { zh: "偏印", en: "Indirect Resource", desc: "慧眼独具，适合沉浸式钻研与深度学习", theme: "静观悟道 · 蓄势沉淀" }
      : { zh: "正印", en: "Direct Resource", desc: "贵人助力，身心滋养，宜制定中长线战略", theme: "润泽生息 · 纳福安康" };
  }

  return { zh: "比肩", en: "Friend", desc: "平稳自律之日", theme: "从容中道" };
}

/**
 * 计算用户八字在今日的运势
 */
export function calculateDailyBaziFortune(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  birthHour: number = 12,
  targetDate: Date = new Date()
): DailyBaziFortuneResult {
  const userBazi = calculateBaZi(birthYear, birthMonth, birthDay, birthHour, 0);
  const dmStem = userBazi.dayMaster.stem;
  const dmElement = userBazi.dayMaster.element;

  // 今日天象历法
  const targetSolar = Solar.fromDate(targetDate);
  const targetLunar = targetSolar.getLunar();
  const todayEightChar = targetLunar.getEightChar();

  const todayDayStem = todayEightChar.getDayGan();
  const todayDayBranch = todayEightChar.getDayZhi();
  const todayStemInfo = STEMS_MAP[todayDayStem] || STEMS_MAP["甲"];
  const todayElement = todayStemInfo.element;

  // 十神推导
  const dailyTenGod = getTenGod(dmStem, todayDayStem);

  // 五行生克关系
  let relationType: "generates" | "overcomes" | "same" | "generatedBy" | "overcomeBy" = "same";
  let relationLabel = "同气相生";
  let relationDesc = "今日日主与流日五行气场同频，能量稳定。";

  if (todayElement === dmElement) {
    relationType = "same";
    relationLabel = "五行比和";
    relationDesc = `今日干支五行同为【${ELEMENT_ZH_MAP[dmElement]}】，自身能量充沛，做事底气充足。`;
  } else if (ELEMENT_GENERATION[todayElement] === dmElement) {
    relationType = "generatedBy";
    relationLabel = "日来生我 (生身进气)";
    relationDesc = `今日五行【${ELEMENT_ZH_MAP[todayElement]}】生助你的日主【${ELEMENT_ZH_MAP[dmElement]}】，外界多助力，易得灵感与长辈支持。`;
  } else if (ELEMENT_GENERATION[dmElement] === todayElement) {
    relationType = "generates";
    relationLabel = "我生流日 (秀气流行)";
    relationDesc = `你的日主五行【${ELEMENT_ZH_MAP[dmElement]}】生泄流日【${ELEMENT_ZH_MAP[todayElement]}】，适合对外展示创意、倾诉交流与执行落地。`;
  } else if (ELEMENT_OVERCOMING[dmElement] === todayElement) {
    relationType = "overcomes";
    relationLabel = "我克流日 (求财进取)";
    relationDesc = `你的日主克制流日五行【${ELEMENT_ZH_MAP[todayElement]}】，为财气涌动之象，适合把握商务机会与实干决断。`;
  } else {
    relationType = "overcomeBy";
    relationLabel = "流日制我 (立威自律)";
    relationDesc = `流日五行【${ELEMENT_ZH_MAP[todayElement]}】克制你的日主，事情节奏偏紧凑，保持冷静专注，能将压力转化为威信。`;
  }

  // 基础综合分算法（基于五行喜忌与十神特质平滑映射）
  let baseOverall = 80;
  if (relationType === "generatedBy" || relationType === "same") baseOverall += 8;
  if (relationType === "overcomeBy") baseOverall -= 4;
  if (dailyTenGod.zh === "正官" || dailyTenGod.zh === "食神" || dailyTenGod.zh === "正印") baseOverall += 6;
  if (dailyTenGod.zh === "七杀" || dailyTenGod.zh === "伤官") baseOverall -= 2;

  // 确保在 65-98 之间的合理区间
  const overall = Math.min(98, Math.max(68, baseOverall));
  const career = Math.min(99, Math.max(65, overall + (dailyTenGod.zh.includes("官") || dailyTenGod.zh.includes("杀") ? 6 : -2)));
  const wealth = Math.min(99, Math.max(65, overall + (dailyTenGod.zh.includes("财") ? 7 : -3)));
  const romance = Math.min(99, Math.max(65, overall + (dailyTenGod.zh.includes("合") || dailyTenGod.zh === "正财" || dailyTenGod.zh === "正官" ? 6 : -1)));
  const wellness = Math.min(99, Math.max(65, overall + (relationType === "generatedBy" ? 6 : -4)));

  // 宜忌清单
  const dosPool: Record<string, string[]> = {
    比肩: ["团队会议复盘", "与好友小聚", "巩固既定方案", "自律健身"],
    劫财: ["稳妥储蓄理财", "向内沉淀专注", "清点日常开支", "签署清晰协议"],
    食神: ["撰写企划创意", "享受健康美食", "审美与空间整理", "深度沟通"],
    伤官: ["攻坚技术难题", "打破陈旧流程", "独立方案构想", "运动排解"],
    偏财: ["考察市场商机", "灵活调整配置", "拜访潜在客户", "物色合作伙伴"],
    正财: ["踏实推进主业", "核对财务明细", "优化日常效率", "契约履约"],
    七杀: ["果断清除积压", "应对关键汇报", "保持自律作息", "设立行动止损"],
    正官: ["正式拜访客户", "提交重要审批", "依章办事遵循规矩", "公开讲演"],
    偏印: ["深入阅读专著", "独自研习技能", "做冥想与身心扫描", "整理案卷"],
    正印: ["拜访师长长辈", "休养生息慢节奏", "办理认证事务", "向内汲取智慧"]
  };

  const dontsPool: Record<string, string[]> = {
    比肩: ["单打独斗排斥他人", "固执己见无视建议"],
    劫财: ["冲动高风险跟投", "为人过度作保借贷", "情绪化争执"],
    食神: ["拖延耽溺口腹之欲", "流于空想缺乏落实"],
    伤官: ["与上级硬碰正面起冲", "口无遮拦伤害同仁"],
    偏财: ["贪多求快盲目下注", "轻信道听途说之消息"],
    正财: ["过度吝啬计较细枝末节", "安于现状失去进取心"],
    七杀: ["情绪失控大发雷霆", "透支体能连续通宵"],
    正官: ["投机取巧违规操作", "死板教条不知变通"],
    偏印: ["过度猜忌孤芳自赏", "钻牛角尖自我消耗"],
    正印: ["被动等待错失机缘", "过分安逸拒绝行动"]
  };

  const dos = dosPool[dailyTenGod.zh] || ["保持平稳心境", "踏实推进当前任务", "多饮水补足体能"];
  const donts = dontsPool[dailyTenGod.zh] || ["急躁行事", "盲目冲动决断"];

  // 幸运指南
  const luckyColors: Record<WuXing, { zh: string; en: string; hex: string }> = {
    Wood: { zh: "松柏绿 / 青玉色", en: "Pine Green / Jade", hex: "#10B981" },
    Fire: { zh: "朱砂赤 / 暖橙红", en: "Cinnabar Red / Amber", hex: "#B84034" },
    Earth: { zh: "宣纸米 / 琥珀黄", en: "Xuan Paper Ochre / Warm Gold", hex: "#C8A858" },
    Metal: { zh: "素雅白 / 月光银", en: "Pure White / Moon Silver", hex: "#736B5E" },
    Water: { zh: "曜石墨 / 深海蓝", en: "Obsidian Ink / Deep Blue", hex: "#111111" }
  };

  const luckyDirections: Record<WuXing, { zh: string; en: string }> = {
    Wood: { zh: "正东方、东南方", en: "East, Southeast" },
    Fire: { zh: "正南方", en: "South" },
    Earth: { zh: "中宫、东北与西南", en: "Center, Northeast & Southwest" },
    Metal: { zh: "正西方、西北方", en: "West, Northwest" },
    Water: { zh: "正北方", en: "North" }
  };

  const BRANCH_EN_MAP: Record<string, string> = {
    子: "Rat (Zi)", 丑: "Ox (Chou)", 寅: "Tiger (Yin)", 卯: "Rabbit (Mao)",
    辰: "Dragon (Chen)", 巳: "Snake (Si)", 午: "Horse (Wu)", 未: "Goat (Wei)",
    申: "Monkey (Shen)", 酉: "Rooster (You)", 戌: "Dog (Xu)", 亥: "Pig (Hai)"
  };

  // 十二时辰吉凶能量波形
  const branchesList = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  const timeRanges = [
    "23:00 - 01:00", "01:00 - 03:00", "03:00 - 05:00", "05:00 - 07:00",
    "07:00 - 09:00", "09:00 - 11:00", "11:00 - 13:00", "13:00 - 15:00",
    "15:00 - 17:00", "17:00 - 19:00", "19:00 - 21:00", "21:00 - 23:00"
  ];

  const hourlyTimeline: HourlyFortune[] = branchesList.map((b, idx) => {
    const bInfo = BRANCHES_MAP[b] || BRANCHES_MAP["子"];
    const isHarmonious = bInfo.element === dmElement || ELEMENT_GENERATION[bInfo.element] === dmElement;
    const hScore = Math.min(95, Math.max(62, overall + (isHarmonious ? 8 : -6) + (idx % 3 === 0 ? 3 : -2)));
    return {
      hourIndex: idx,
      timeRange: timeRanges[idx],
      branchName: b + "时",
      branchNameEn: BRANCH_EN_MAP[b] || b,
      stemName: "",
      element: bInfo.element,
      score: hScore,
      verdict: hScore >= 82 ? "大吉 · 能量充沛" : hScore >= 74 ? "平顺 · 宜稳打稳扎" : "需谨慎 · 宜静不宜动",
      verdictEn: hScore >= 82 ? "Auspicious · High Vitality" : hScore >= 74 ? "Smooth · Steady Progress" : "Prudent · Rest & Center",
      isFavorable: hScore >= 78
    };
  });

  const dosEnPool: Record<string, string[]> = {
    比肩: ["Collaborate with trusted peers", "Execute independent goals", "Build disciplined routines"],
    劫财: ["Review discretionary budget", "Practice measured speech", "Protect capital reserves"],
    食神: ["Brainstorm creative concepts", "Draft strategic frameworks", "Enjoy mindful nourishment"],
    伤官: ["Innovate legacy methods", "Express original artistic ideas", "Channel intensity constructively"],
    偏财: ["Explore market opportunities", "Rebalance investment allocation", "Engage external partners"],
    正财: ["Execute core workflows", "Audit accounts meticulously", "Deliver on signed commitments"],
    七杀: ["Resolve legacy bottlenecks", "Lead high-stakes initiatives", "Establish strict boundaries"],
    正官: ["Present formal deliverables", "Submit administrative approvals", "Uphold rigorous standards"],
    偏印: ["Deep reading & study", "Solitary skill refinement", "Reflective meditation"],
    正印: ["Consult respected mentors", "Recharge physical vitality", "Consolidate core foundations"]
  };

  const dontsEnPool: Record<string, string[]> = {
    比肩: ["Isolate or reject assistance", "Ignore constructive critiques"],
    劫财: ["Impulsive high-risk speculation", "Over-leveraging financial exposure", "Ego-driven debates"],
    食神: ["Procrastination through indulgence", "Unrealistic daydreams without execution"],
    伤官: ["Direct friction with management", "Sharp unvetted verbal delivery"],
    偏财: ["Chasing speculative rumors", "Unhedged aggressive wagers"],
    正财: ["Micromanaging minor frictions", "Complacency that stalls progress"],
    七杀: ["Impulsive anger outbreaks", "Chronically depleting rest"],
    正官: ["Bypassing established protocols", "Inflexible bureaucratic paralysis"],
    偏印: ["Overthinking isolated suspicions", "Self-absorbing theoretical spirals"],
    正印: ["Passive waiting that misses timing", "Over-comfort that delays action"]
  };

  const dosEn = dosEnPool[dailyTenGod.zh] || ["Maintain a centered mind", "Execute primary commitments", "Nourish bodily vitality"];
  const dontsEn = dontsEnPool[dailyTenGod.zh] || ["Hasty overreactions", "Impulsive speculative decisions"];

  const tenGodEnMap: Record<string, { desc: string; theme: string }> = {
    比肩: { desc: "Empowered self-agency and peer synergy. Excellent window for focused collaboration and bold individual craftsmanship.", theme: "Self-Discipline & Peer Synergy" },
    劫财: { desc: "Social outflow expands. Guard capital reserves and avoid emotionally charged financial commitments.", theme: "Prudent Stewardship & Composure" },
    食神: { desc: "Creativity flows effortlessly. Natural expression is favored alongside strategic ideation and fine dining.", theme: "Cultivating Wisdom & Gracious Output" },
    伤官: { desc: "Sharp, unconventional analytical breakthroughs. Dare to renovate old models while keeping verbal tact in check.", theme: "Radical Innovation & Restrained Edge" },
    偏财: { desc: "Acute commercial instinct. Favorable timing for flexible deals, negotiations, and noticing asymmetric upside.", theme: "Keen Vision & Nimble Resourcefulness" },
    正财: { desc: "Earthly reward directly mirrors disciplined effort. Consistent dedication yields steady, satisfying harvest.", theme: "Diligence & Compound Growth" },
    七杀: { desc: "High pressure paired with decisive resolve. Rising to core challenges yields breakthrough authority.", theme: "Navigating Surges & Tempered Grit" },
    正官: { desc: "Sponsor support and institutional harmony. Ideal for executive briefings, examinations, and clear protocols.", theme: "Ethical Leadership & Natural Order" },
    偏印: { desc: "Profound intuitive depth. Exceptional day for technical research, non-traditional study, and strategic synthesis.", theme: "Insightful Contemplation & Deep Learning" },
    正印: { desc: "Nourished by mentors and calm surroundings. Inner peace restores clarity; favor rest, reading, and foundational vitality.", theme: "Nourishing Life & Tranquil Focus" }
  };

  const tgMeta = tenGodEnMap[dailyTenGod.zh] || { desc: "Balanced daily flow across five elements.", theme: "Natural Harmony" };

  return {
    queryDate: {
      year: targetDate.getFullYear(),
      month: targetDate.getMonth() + 1,
      day: targetDate.getDate(),
      dayOfWeekZh: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][targetDate.getDay()],
      dayOfWeekEn: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][targetDate.getDay()],
      solarTerms: targetLunar.getJieQi() || "平运流转",
      solarTermsEn: targetLunar.getJieQi() || "Season Flow"
    },
    todayGanZhi: {
      year: todayEightChar.getYear(),
      month: todayEightChar.getMonth(),
      day: todayEightChar.getDay(),
      dayStem: todayDayStem,
      dayBranch: todayDayBranch,
      dayElement: todayElement,
      dayElementZh: ELEMENT_ZH_MAP[todayElement],
      naYin: todayEightChar.getDayNaYin()
    },
    userDayMaster: {
      stem: dmStem,
      element: dmElement,
      elementZh: ELEMENT_ZH_MAP[dmElement],
      elementEn: dmElement,
      nameZh: userBazi.dayMaster.nameZh,
      nameEn: `${userBazi.dayMaster.stem} (${userBazi.dayMaster.element})`
    },
    dailyTenGod: {
      nameZh: dailyTenGod.zh,
      nameEn: dailyTenGod.en,
      descZh: dailyTenGod.desc,
      descEn: tgMeta.desc,
      cosmicThemeZh: dailyTenGod.theme,
      cosmicThemeEn: tgMeta.theme
    },
    scores: {
      overall,
      career,
      wealth,
      romance,
      wellness
    },
    elementSynergy: {
      relationType,
      labelZh: relationLabel,
      labelEn: relationType === 'generates' ? 'Flowing Support' : relationType === 'overcomes' ? 'Decisive Command' : relationType === 'same' ? 'Peer Resonance' : relationType === 'generatedBy' ? 'Nurturing Input' : 'Tension & Challenge',
      descZh: relationDesc,
      descEn: `Interaction between Day Master (${dmElement}) and Daily Celestial Energy (${todayElement}).`
    },
    dosAndDonts: {
      dos,
      dosEn,
      donts,
      dontsEn
    },
    luckyGuides: {
      colorZh: luckyColors[todayElement].zh,
      colorEn: luckyColors[todayElement].en,
      colorHex: luckyColors[todayElement].hex,
      directionZh: luckyDirections[todayElement].zh,
      directionEn: luckyDirections[todayElement].en,
      number: ((birthDay + targetDate.getDate()) % 9) + 1,
      timeWindowZh: "09:00 - 11:00 (巳时) & 15:00 - 17:00 (申时)",
      timeWindowEn: "09:00 - 11:00 (Si Hour) & 15:00 - 17:00 (Shen Hour)",
      mindsetZh: "不以物喜，不以己悲。顺天应人，定静生慧。",
      mindsetEn: "Remain unswayed by external fluctuations. Act in accordance with natural timing; serenity generates wisdom."
    },
    hourlyTimeline
  };
}
