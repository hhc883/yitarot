import { calculateBaZi, BaZiCalculationResult, WuXing, ELEMENT_ZH_MAP, STEMS_MAP, BRANCHES_MAP } from "./bazi";

export type RelationshipType =
  | "marriage"        // 八字合婚
  | "lover"           // 恋爱合盘
  | "business"        // 事业合盘
  | "mother-in-law"   // 婆媳合盘
  | "best-friends"    // 闺蜜合盘
  | "parent-child"    // 父子关系
  | "mother-child"    // 母子关系
  | "friends"         // 朋友关系
  | "leader";         // 领导下属

export interface RelationshipConfig {
  type: RelationshipType;
  titleZh: string;
  titleEn: string;
  roleAZh: string;
  roleBZh: string;
  summaryZh: string;
  focusZh: string;
}

export const RELATIONSHIP_CONFIGS: Record<RelationshipType, RelationshipConfig> = {
  marriage: {
    type: "marriage",
    titleZh: "八字合婚",
    titleEn: "BaZi Marriage Synastry",
    roleAZh: "男方 (乾造)",
    roleBZh: "女方 (坤造)",
    summaryZh: "推演纳音相生、天干五合、地支刑冲破害与喜用神互补，全景评估夫妻缘分深浅与婚后家风长久度。",
    focusZh: "夫妻宫生克 · 喜用调候互补 · 子女福德缘"
  },
  lover: {
    type: "lover",
    titleZh: "恋爱合盘",
    titleEn: "Romantic Compatibility",
    roleAZh: "一方",
    roleBZh: "另一方",
    summaryZh: "深入剖析两性相吸的原型磁场、情感依恋模式、情绪共鸣点与恋爱磨合期的冲突化解之道。",
    focusZh: "浪漫吸引力 · 情感沟通波长 · 依赖与独立"
  },
  business: {
    type: "business",
    titleZh: "事业合盘",
    titleEn: "Business Partnership",
    roleAZh: "合伙人 A",
    roleBZh: "合伙人 B",
    summaryZh: "解析十神财官互动，剖析谁利开拓财源、谁掌运营规范、谁擅长风险兜底，明晰权责边界与防范背离风险。",
    focusZh: "财源共振 · 权责分工清晰度 · 信任与契约"
  },
  "mother-in-law": {
    type: "mother-in-law",
    titleZh: "婆媳合盘",
    titleEn: "Mother-in-law & Daughter-in-law",
    roleAZh: "婆婆 (长辈)",
    roleBZh: "媳妇 (晚辈)",
    summaryZh: "传统命理中“印财相争”之破局指南。洞悉两代女性核心价值取向，提供不内耗的相处边界与情商调候策略。",
    focusZh: "印星与财星调候 · 边界感维护 · 柔性沟通"
  },
  "best-friends": {
    type: "best-friends",
    titleZh: "闺蜜合盘",
    titleEn: "Best Friends Resonance",
    roleAZh: "密友 A",
    roleBZh: "密友 B",
    summaryZh: "解读闺蜜比劫星相生互助、情绪树洞默契与趣味共鸣，寻找彼此灵魂深处的无条件共情与支持纽带。",
    focusZh: "情绪托底 · 兴趣三观契合 · 忠诚度与舒适感"
  },
  "parent-child": {
    type: "parent-child",
    titleZh: "父子关系",
    titleEn: "Father & Son Dynamics",
    roleAZh: "父亲",
    roleBZh: "儿子",
    summaryZh: "探索偏财与七杀的父权互动，解析威严与叛逆背后的心理投射，助力建立亦师亦友、互相尊重的成年人相处范式。",
    focusZh: "父爱表达 · 权威与自主平衡 · 事业传承指引"
  },
  "mother-child": {
    type: "mother-child",
    titleZh: "母子关系",
    titleEn: "Mother & Child Harmony",
    roleAZh: "母亲",
    roleBZh: "孩子",
    summaryZh: "剖析正印庇护与孩子日主之承接度，规避过度关爱带来的束缚感，找寻科学放手、温润滋养的亲情平衡点。",
    focusZh: "滋养与边界 · 依恋关系 · 情绪支持与自我成长"
  },
  friends: {
    type: "friends",
    titleZh: "朋友关系",
    titleEn: "Friendship Synastry",
    roleAZh: "朋友 A",
    roleBZh: "朋友 B",
    summaryZh: "分析志同道合度、社交圈层互动与君子之交的舒适距离，评估长久维系的纯粹度与彼此助力格局。",
    focusZh: "志趣相投 · 社交共振 · 互不消耗的真诚度"
  },
  leader: {
    type: "leader",
    titleZh: "领导下属",
    titleEn: "Leader & Subordinate",
    roleAZh: "管理者 / 领导",
    roleBZh: "执行者 / 下属",
    summaryZh: "结合正官七杀与食伤执行力，推演授权信任度、汇报契合节奏与向上管理之道，促进职场双赢升维。",
    focusZh: "领导风格匹配 · 执行契合度 · 向上管理与赋能"
  }
};

export interface StemBranchInteraction {
  category: "heavenly_combination" | "earthly_six_harmony" | "earthly_three_harmony" | "clash" | "penalty" | "harm";
  label: string;
  pillarPair: string;
  descZh: string;
  isPositive: boolean;
}

export interface RelationshipAnalysisResult {
  config: RelationshipConfig;
  personA: {
    name: string;
    bazi: BaZiCalculationResult;
  };
  personB: {
    name: string;
    bazi: BaZiCalculationResult;
  };
  scores: {
    overall: number; // 0-100
    chemistry: number; // 默契共鸣
    stability: number; // 稳固长久
    growth: number;    // 互助赋能
    communication: number; // 沟通包容
    resolution: number; // 矛盾化解力
  };
  verdictZh: string;
  verdictEn: string;
  interactions: StemBranchInteraction[];
  wuxingAnalysis: {
    personAPreferred: WuXing | string;
    personBPreferred: WuXing | string;
    complementarityScore: number;
    complementarityDescZh: string;
  };
  insights: {
    coreDynamicZh: string;
    strengths: string[];
    potentialFrictions: string[];
    goldenAdvice: string[];
  };
}

// 天干五合
const HEAVENLY_COMBINATIONS: [string, string, string][] = [
  ["甲", "己", "中正之合 (合化土)"],
  ["乙", "庚", "仁义之合 (合化金)"],
  ["丙", "辛", "威制之合 (合化水)"],
  ["丁", "壬", "淫匿/深情之合 (合化木)"],
  ["戊", "癸", "无情/智慧之合 (合化火)"]
];

// 地支六合
const EARTHLY_SIX_HARMONIES: [string, string, string][] = [
  ["子", "丑", "子丑合土"],
  ["寅", "亥", "寅亥合木"],
  ["卯", "戌", "卯戌合火"],
  ["辰", "酉", "辰酉合金"],
  ["巳", "申", "巳申合水"],
  ["午", "未", "午未合土/日月合"]
];

// 地支六冲
const EARTHLY_SIX_CLASHES: [string, string, string][] = [
  ["子", "午", "水火激荡，情绪多起伏"],
  ["丑", "未", "湿土与燥土冲突，易生暗滞"],
  ["寅", "申", "金木交战，行动与决策易生争执"],
  ["卯", "酉", "金木相克，心思细腻易生敏感"],
  ["辰", "戌", "库冲激荡，观念与底线碰撞"],
  ["巳", "亥", "水火冲击，作息与生活习惯差异"]
];

function checkPair(a: string, b: string, list: [string, string, string][]): [string, string, string] | null {
  for (const item of list) {
    if ((item[0] === a && item[1] === b) || (item[0] === b && item[1] === a)) {
      return item;
    }
  }
  return null;
}

export function analyzeRelationship(
  type: RelationshipType,
  nameA: string,
  birthA: { year: number; month: number; day: number; hour: number; minute?: number },
  nameB: string,
  birthB: { year: number; month: number; day: number; hour: number; minute?: number }
): RelationshipAnalysisResult {
  const config = RELATIONSHIP_CONFIGS[type] || RELATIONSHIP_CONFIGS.marriage;
  const baziA = calculateBaZi(birthA.year, birthA.month, birthA.day, birthA.hour, birthA.minute ?? 0);
  const baziB = calculateBaZi(birthB.year, birthB.month, birthB.day, birthB.hour, birthB.minute ?? 0);

  const interactions: StemBranchInteraction[] = [];

  // 1. 日干五合检测（日柱代表两人的元神本质）
  const dmA = baziA.dayMaster.stem;
  const dmB = baziB.dayMaster.stem;
  const dmComb = checkPair(dmA, dmB, HEAVENLY_COMBINATIONS);
  if (dmComb) {
    interactions.push({
      category: "heavenly_combination",
      label: `日干天作之合 · ${dmA}${dmB}`,
      pillarPair: "日主元神",
      descZh: `双方日柱天干呈现“${dmComb[2]}”，天然具备极强的吸引力与本能默契。`,
      isPositive: true
    });
  }

  // 2. 年支（生肖）相合/相冲检测（根基、家世与长线磁场）
  const yzA = baziA.pillars.year.zhi;
  const yzB = baziB.pillars.year.zhi;
  const yzHarm = checkPair(yzA, yzB, EARTHLY_SIX_HARMONIES);
  if (yzHarm) {
    interactions.push({
      category: "earthly_six_harmony",
      label: `年柱六合 · 根基深厚 (${yzA}${yzB})`,
      pillarPair: "年支属相",
      descZh: `生肖逢六合【${yzHarm[2]}】，代表双方家庭背景认同度高，早期交往无违和感。`,
      isPositive: true
    });
  }

  const yzClash = checkPair(yzA, yzB, EARTHLY_SIX_CLASHES);
  if (yzClash) {
    interactions.push({
      category: "clash",
      label: `年柱相冲 · 性格差异 (${yzA}${yzB})`,
      pillarPair: "年支属相",
      descZh: `生肖逢六冲：${yzClash[2]}。遇事习惯与节奏存在先天差异，需建立包容机制。`,
      isPositive: false
    });
  }

  // 3. 日支（夫妻宫 / 内心密宫）相合/相冲检测
  const dzA = baziA.pillars.day.zhi;
  const dzB = baziB.pillars.day.zhi;
  const dzHarm = checkPair(dzA, dzB, EARTHLY_SIX_HARMONIES);
  if (dzHarm) {
    interactions.push({
      category: "earthly_six_harmony",
      label: `日支六合 · 内心相契 (${dzA}${dzB})`,
      pillarPair: "日支内宫",
      descZh: `双方夫妻宫/私密宫【${dzHarm[2]}】，相处时自然松弛，生活作息与情感节奏极易调和。`,
      isPositive: true
    });
  }

  const dzClash = checkPair(dzA, dzB, EARTHLY_SIX_CLASHES);
  if (dzClash) {
    interactions.push({
      category: "clash",
      label: `日支相冲 · 亲密摩擦 (${dzA}${dzB})`,
      pillarPair: "日支内宫",
      descZh: `日支逢冲：${dzClash[2]}。在深度亲密接触或独处时，情绪敏感点易发生碰撞。`,
      isPositive: false
    });
  }

  // 4. 五行互补度分析 (Person A 缺失什么，Person B 是否旺盛)
  const aLacking = baziA.lackingElement;
  const bLacking = baziB.lackingElement;
  const aDominant = baziA.dominantElement;
  const bDominant = baziB.dominantElement;

  let compScore = 80;
  let compDesc = "双方五行能量流转相对协调，无严重克制。";

  if (aLacking && bDominant === aLacking) {
    compScore += 10;
    compDesc = `${nameB} 命局中最旺盛的【${ELEMENT_ZH_MAP[bDominant]}】，恰好能弥补 ${nameA} 所欠缺的五行气场，形成绝佳后天调候！`;
  }
  if (bLacking && aDominant === bLacking) {
    compScore += 10;
    compDesc += ` 反之，${nameA} 旺盛的【${ELEMENT_ZH_MAP[aDominant]}】亦能滋养 ${nameB}，双方如鱼得水、互为贵人。`;
  }

  // 5. 评分合成算法
  let baseScore = 78;
  if (dmComb) baseScore += 8;
  if (yzHarm) baseScore += 5;
  if (dzHarm) baseScore += 7;
  if (yzClash) baseScore -= 6;
  if (dzClash) baseScore -= 6;
  baseScore = Math.min(98, Math.max(62, baseScore));

  const chemistry = Math.min(99, Math.max(60, baseScore + (dmComb ? 6 : -2)));
  const stability = Math.min(99, Math.max(60, baseScore + (yzHarm ? 5 : yzClash ? -6 : 1)));
  const growth = Math.min(99, Math.max(60, compScore));
  const communication = Math.min(99, Math.max(60, baseScore + (dzHarm ? 5 : dzClash ? -7 : 2)));
  const resolution = Math.min(99, Math.max(60, Math.round((communication + stability) / 2)));

  // 根据关系类型定制评语与锦囊
  let verdictZh = "天作之美 · 刚柔互济";
  let verdictEn = "Harmonious & Synergistic Bond";

  if (baseScore >= 90) {
    verdictZh = "夙世良缘 · 珠联璧合";
    verdictEn = "Destined Twin Resonance";
  } else if (baseScore >= 82) {
    verdictZh = "相依相成 · 温良互敬";
    verdictEn = "Complementary & Enduring Alliance";
  } else if (baseScore >= 74) {
    verdictZh = "和而不同 · 磨合见真";
    verdictEn = "Balanced Dynamic Through Growth";
  } else {
    verdictZh = "阴阳有异 · 敬重守界";
    verdictEn = "Mindful Boundaries Required";
  }

  // 针对不同类型的具体见解
  const typeInsights: Record<RelationshipType, { strengths: string[]; friction: string[]; advice: string[] }> = {
    marriage: {
      strengths: ["家庭责任担当明确，能共同面对生活风雨", "双方元神气场能够形成深层依托", "长期生活方式具备互补潜质"],
      friction: ["遇到重要家庭财务或子女决策时，底层思维逻辑偶有差异", "疲惫或压力过大时，需防情绪借题发挥"],
      advice: ["定期设立专属双人沟通时间，就事论事不翻旧账", "重大开支与亲友交往提前达成共识原则", "借助彼此喜用五行优化居所环境"]
    },
    lover: {
      strengths: ["天然吸引力强烈，对彼此的世界保持着持久的好奇心", "在浪漫表达与仪式感上容易同频共鸣"],
      friction: ["期望对方能未卜先知猜中自己心思，易滋生暗中失望", "占有欲与独立空间需求需磨合平衡"],
      advice: ["将真实需求直接温和地说出来，不用冷战测试爱意", "保留各自独立的爱好与朋友圈子，距离产生持久美感"]
    },
    business: {
      strengths: ["技能与思维视角高度互补，一个擅长冲锋开拓，一个善于防守复盘", "商业触觉敏锐，合力可放大战果"],
      friction: ["在发展速度与风险承受度上可能存在分歧", "权责重叠时易出现推诿或重复决策"],
      advice: ["丑话说在前面，将分工、权责、退出机制写进白纸黑字的契约", "对外统一发声，对内民主争鸣，杜绝暗中博弈"]
    },
    "mother-in-law": {
      strengths: ["共同深爱着家庭的核心纽带，出发点皆为家庭向好发展", "在传统礼节与长幼尊卑上具备良性认同"],
      friction: ["两代人生活习惯、育儿理念或消费习惯大相径庭", "容易产生“谁在这个家说了算”的无意识主权竞争"],
      advice: ["保持“亲而有间”的健康物理与心理边界，不强求亲如母女", "男方需积极作为情绪缓冲带，绝不传话激化矛盾", "用倾听与点赞化解日常挑剔"]
    },
    "best-friends": {
      strengths: ["懂彼此的奇奇怪怪，不用戴面具社交", "在至暗时刻能给予无条件的情绪托底与陪伴"],
      friction: ["当人生轨迹、婚姻状态或财富层级拉开差距时易产生微妙疏离感"],
      advice: ["允许对方有不同的人生阶段与节奏，不以占有心态维系友谊", "常记初相识时的纯粹与真挚，相见欢，离去念"]
    },
    "parent-child": {
      strengths: ["血脉相连的深沉牵挂，父爱如山提供人生远航的底气", "儿子能从父亲身上汲取坚韧品质与开拓格局"],
      friction: ["两代男性皆好强自尊，易形成无话可说的沉默壁垒或激烈顶撞"],
      advice: ["父亲放下绝对权威，学会倾听儿子的独立见解；儿子理解父亲那代人的表达局限", "通过具体合作项目或户外运动打破情感坚冰"]
    },
    "mother-child": {
      strengths: ["深沉的情感连接，母亲给予最温柔温暖的生命庇护", "孩子极具孝心，体恤母亲的付出"],
      friction: ["母亲容易过度焦虑与事无巨细干涉，孩子渴望展翅易产生窒息反叛"],
      advice: ["爱是适度放手，让孩子去体验属于自己的挫折与荣耀", "彼此视对方为独立的个体，情感交流少用说教、多用拥抱"]
    },
    friends: {
      strengths: ["志趣相投，沟通轻松愉悦，能共同开拓认知边界", "互为人生道路上的同行者与一面明镜"],
      friction: ["长时间不联络容易渐行渐远，利益牵扯时需审慎"],
      advice: ["君子之交淡如水，贵在关键时刻的守望相助与长久信义"]
    },
    leader: {
      strengths: ["领导能指明战略大方向与赋能资源，下属具备强劲执行落地力", "权责层级清晰，协同效率高效"],
      friction: ["目标拆解不清晰导致执行走样，向上管理预期未达成共识"],
      advice: ["下属凡事多做闭环汇报（有始有终、带着方案请示），领导提供充足信任与纠偏容错空间"]
    }
  };

  const specificInsights = typeInsights[type] || typeInsights.marriage;

  return {
    config,
    personA: {
      name: nameA || config.roleAZh,
      bazi: baziA
    },
    personB: {
      name: nameB || config.roleBZh,
      bazi: baziB
    },
    scores: {
      overall: baseScore,
      chemistry,
      stability,
      growth,
      communication,
      resolution
    },
    verdictZh,
    verdictEn,
    interactions,
    wuxingAnalysis: {
      personAPreferred: aLacking ? ELEMENT_ZH_MAP[aLacking] : "平衡",
      personBPreferred: bLacking ? ELEMENT_ZH_MAP[bLacking] : "平衡",
      complementarityScore: compScore,
      complementarityDescZh: compDesc
    },
    insights: {
      coreDynamicZh: `双方命盘相遇，天干地支呈现 ${interactions.filter(i => i.isPositive).length} 组相合吉象与 ${interactions.filter(i => !i.isPositive).length} 组磨合冲相。整体气场以【${verdictZh}】为主旋律。`,
      strengths: specificInsights.strengths,
      potentialFrictions: specificInsights.friction,
      goldenAdvice: specificInsights.advice
    }
  };
}
