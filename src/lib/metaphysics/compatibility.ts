export interface ZodiacSignDef {
  id: string; // e.g. "rat", "dragon"
  nameEn: string;
  nameZh: string;
  emoji: string;
  element: "Water" | "Earth" | "Wood" | "Fire" | "Metal";
  elementZh: string;
  personalityEn: string;
  personalityZh: string;
}

export interface CompatibilityResult {
  signA: ZodiacSignDef;
  signB: ZodiacSignDef;
  slug: string; // e.g. "rat-and-dragon"
  overallScore: number; // 0 - 100
  romanceScore: number;
  friendshipScore: number;
  workScore: number;
  verdictEn: string;
  verdictZh: string;
  dynamicEn: string;
  dynamicZh: string;
  strengthsEn: string[];
  strengthsZh: string[];
  challengesEn: string[];
  challengesZh: string[];
  harmonizationTipsEn: string;
  harmonizationTipsZh: string;
}

export const ZODIAC_SIGNS: ZodiacSignDef[] = [
  { id: "rat", nameEn: "Rat", nameZh: "鼠", emoji: "🐀", element: "Water", elementZh: "水", personalityEn: "Quick-witted, resourceful, versatile, and charming.", personalityZh: "机智灵敏，适应力极强，心思细腻，充满进取心。" },
  { id: "ox", nameEn: "Ox", nameZh: "牛", emoji: "🐂", element: "Earth", elementZh: "土", personalityEn: "Steadfast, patient, dependable, and honest.", personalityZh: "沉稳可靠，吃苦耐劳，忠厚纯朴，信誉极高。" },
  { id: "tiger", nameEn: "Tiger", nameZh: "虎", emoji: "🐅", element: "Wood", elementZh: "木", personalityEn: "Brave, magnetic, confident, and adventurous.", personalityZh: "威武勇武，气场强大，敢于冒险，具领袖风采。" },
  { id: "rabbit", nameEn: "Rabbit", nameZh: "兔", emoji: "🐇", element: "Wood", elementZh: "木", personalityEn: "Gentle, elegant, compassionate, and artistic.", personalityZh: "温和文雅，善良真诚，极具审美与共情能力。" },
  { id: "dragon", nameEn: "Dragon", nameZh: "龙", emoji: "🐉", element: "Earth", elementZh: "土", personalityEn: "Visionary, powerful, enthusiastic, and majestic.", personalityZh: "胸怀大志，气宇轩昂，才华横溢，具开拓格局。" },
  { id: "snake", nameEn: "Snake", nameZh: "蛇", emoji: "🐍", element: "Fire", elementZh: "火", personalityEn: "Intuitive, profound, graceful, and discerning.", personalityZh: "深邃睿智，洞察秋毫，神秘优雅，行事沉着。" },
  { id: "horse", nameEn: "Horse", nameZh: "马", emoji: "🐎", element: "Fire", elementZh: "火", personalityEn: "Passionate, free-spirited, vibrant, and warm.", personalityZh: "热情奔放，向往自由，精力充沛，开朗真诚。" },
  { id: "goat", nameEn: "Goat", nameZh: "羊", emoji: "🐐", element: "Earth", elementZh: "土", personalityEn: "Peaceful, creative, empathetic, and kind-hearted.", personalityZh: "性情温顺，富有同情心，富有艺术才华与仁爱之心。" },
  { id: "monkey", nameEn: "Monkey", nameZh: "猴", emoji: "🐒", element: "Metal", elementZh: "金", personalityEn: "Clever, innovative, playful, and observant.", personalityZh: "聪明伶俐，多才善变，幽默风趣，学习能力极强。" },
  { id: "rooster", nameEn: "Rooster", nameZh: "鸡", emoji: "🐓", element: "Metal", elementZh: "金", personalityEn: "Punctual, articulate, observant, and stylish.", personalityZh: "精明强干，守信严谨，注重形象，极具辨识力。" },
  { id: "dog", nameEn: "Dog", nameZh: "狗", emoji: "🐕", element: "Earth", elementZh: "土", personalityEn: "Loyal, just, sincere, and protective.", personalityZh: "忠诚正直，重情重义，富有正义感与奉献精神。" },
  { id: "pig", nameEn: "Pig", nameZh: "猪", emoji: "🐖", element: "Water", elementZh: "水", personalityEn: "Generous, cheerful, honest, and magnanimous.", personalityZh: "敦厚随和，乐观豁达，乐善好施，福泽深厚。" },
];

const SIX_HARMONIES: [string, string][] = [
  ["rat", "ox"],
  ["tiger", "pig"],
  ["rabbit", "dog"],
  ["dragon", "rooster"],
  ["snake", "monkey"],
  ["horse", "goat"],
];

const THREE_HARMONIES_TRIADS: [string, string, string][] = [
  ["monkey", "rat", "dragon"],
  ["pig", "rabbit", "goat"],
  ["tiger", "horse", "dog"],
  ["snake", "rooster", "ox"],
];

const SIX_CLASHES: [string, string][] = [
  ["rat", "horse"],
  ["ox", "goat"],
  ["tiger", "monkey"],
  ["rabbit", "rooster"],
  ["dragon", "dog"],
  ["snake", "pig"],
];

function isPairIn(pair: [string, string], list: [string, string][]): boolean {
  const [a, b] = pair;
  return list.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

function areInSameTriad(a: string, b: string): boolean {
  return THREE_HARMONIES_TRIADS.some(t => t.includes(a) && t.includes(b));
}

export interface ZodiacBranchInfo {
  char: string;
  pinyin: string;
}

export const ZODIAC_BRANCH_MAP: Record<string, ZodiacBranchInfo> = {
  rat: { char: "子", pinyin: "Zǐ" },
  ox: { char: "丑", pinyin: "Chǒu" },
  tiger: { char: "寅", pinyin: "Yín" },
  rabbit: { char: "卯", pinyin: "Mǎo" },
  dragon: { char: "辰", pinyin: "Chén" },
  snake: { char: "巳", pinyin: "Sì" },
  horse: { char: "午", pinyin: "Wǔ" },
  goat: { char: "未", pinyin: "Wèi" },
  monkey: { char: "申", pinyin: "Shēn" },
  rooster: { char: "酉", pinyin: "Yǒu" },
  dog: { char: "戌", pinyin: "Xū" },
  pig: { char: "亥", pinyin: "Hài" },
};

export type ZodiacRuleMatchType =
  | "six_harmony"
  | "three_harmony_pair"
  | "six_clash"
  | "same_sign"
  | "none";

export interface ZodiacRuleCitation {
  bookZh: string;
  bookEn: string;
  chapterZh: string;
  chapterEn: string;
  url: string;
}

export interface ZodiacRuleMatchResult {
  signA: ZodiacSignDef;
  signB: ZodiacSignDef;
  branchA: ZodiacBranchInfo;
  branchB: ZodiacBranchInfo;
  ruleType: ZodiacRuleMatchType;
  citation: ZodiacRuleCitation | null;
  sixHarmonyElement?: { zh: string; en: string };
  triadInfo?: {
    signs: [ZodiacSignDef, ZodiacSignDef, ZodiacSignDef];
    branches: [string, string, string];
    missingSign: ZodiacSignDef;
    missingBranch: string;
    elementZh: string;
    elementEn: string;
  };
}

const SANMING_VOL2_URL =
  "https://zh.wikisource.org/zh-hant/%E4%B8%89%E5%91%BD%E9%80%9A%E6%9C%83/%E5%8D%B7%E4%BA%8C";

const SIX_HARMONY_ELEMENTS: { zh: string; en: string }[] = [
  { zh: "土", en: "Earth" },
  { zh: "木", en: "Wood" },
  { zh: "火", en: "Fire" },
  { zh: "金", en: "Metal" },
  { zh: "水", en: "Water" },
  { zh: "土", en: "Earth" },
];

const TRIAD_ELEMENTS: { zh: string; en: string }[] = [
  { zh: "水", en: "Water" },
  { zh: "木", en: "Wood" },
  { zh: "火", en: "Fire" },
  { zh: "金", en: "Metal" },
];

/**
 * Looks up factual Earthly Branch rule matches between two Chinese Zodiac signs
 * using the core rule arrays and verified Sanming Tonghui Vol. 2 chapters.
 */
export function getZodiacBranchRuleMatch(idA: string, idB: string): ZodiacRuleMatchResult {
  const signA = ZODIAC_SIGNS.find(s => s.id === idA) || ZODIAC_SIGNS[0];
  const signB = ZODIAC_SIGNS.find(s => s.id === idB) || ZODIAC_SIGNS[1];
  const branchA = ZODIAC_BRANCH_MAP[signA.id];
  const branchB = ZODIAC_BRANCH_MAP[signB.id];

  if (signA.id === signB.id) {
    return {
      signA,
      signB,
      branchA,
      branchB,
      ruleType: "same_sign",
      citation: null,
    };
  }

  const sixHarmonyIdx = SIX_HARMONIES.findIndex(
    ([x, y]) => (x === signA.id && y === signB.id) || (x === signB.id && y === signA.id)
  );
  if (sixHarmonyIdx !== -1) {
    return {
      signA,
      signB,
      branchA,
      branchB,
      ruleType: "six_harmony",
      sixHarmonyElement: SIX_HARMONY_ELEMENTS[sixHarmonyIdx],
      citation: {
        bookZh: "《三命通會》卷二",
        bookEn: "Sanming Tonghui, Vol. 2",
        chapterZh: "§論支元六合",
        chapterEn: "§論支元六合 (Six Harmonies)",
        url: SANMING_VOL2_URL,
      },
    };
  }

  const triadIdx = THREE_HARMONIES_TRIADS.findIndex(
    t => t.includes(signA.id) && t.includes(signB.id)
  );
  if (triadIdx !== -1) {
    const triadIds = THREE_HARMONIES_TRIADS[triadIdx];
    const triadSigns = triadIds.map(
      id => ZODIAC_SIGNS.find(s => s.id === id) || ZODIAC_SIGNS[0]
    ) as [ZodiacSignDef, ZodiacSignDef, ZodiacSignDef];
    const triadBranches = triadIds.map(id => ZODIAC_BRANCH_MAP[id].char) as [string, string, string];
    const missingId = triadIds.find(id => id !== signA.id && id !== signB.id) || triadIds[2];
    const missingSign = ZODIAC_SIGNS.find(s => s.id === missingId) || ZODIAC_SIGNS[0];
    const missingBranch = ZODIAC_BRANCH_MAP[missingId].char;
    const el = TRIAD_ELEMENTS[triadIdx];

    return {
      signA,
      signB,
      branchA,
      branchB,
      ruleType: "three_harmony_pair",
      triadInfo: {
        signs: triadSigns,
        branches: triadBranches,
        missingSign,
        missingBranch,
        elementZh: el.zh,
        elementEn: el.en,
      },
      citation: {
        bookZh: "《三命通會》卷二",
        bookEn: "Sanming Tonghui, Vol. 2",
        chapterZh: "§論支元三合",
        chapterEn: "§論支元三合 (Three Harmonies)",
        url: SANMING_VOL2_URL,
      },
    };
  }

  if (isPairIn([signA.id, signB.id], SIX_CLASHES)) {
    return {
      signA,
      signB,
      branchA,
      branchB,
      ruleType: "six_clash",
      citation: {
        bookZh: "《三命通會》卷二",
        bookEn: "Sanming Tonghui, Vol. 2",
        chapterZh: "§論衝擊",
        chapterEn: "§論衝擊 (Six Clashes)",
        url: SANMING_VOL2_URL,
      },
    };
  }

  return {
    signA,
    signB,
    branchA,
    branchB,
    ruleType: "none",
    citation: null,
  };
}

/**
 * Calculates compatibility between two Chinese Zodiac signs
 */
export function getZodiacCompatibility(idA: string, idB: string): CompatibilityResult {
  const signA = ZODIAC_SIGNS.find(s => s.id === idA) || ZODIAC_SIGNS[0];
  const signB = ZODIAC_SIGNS.find(s => s.id === idB) || ZODIAC_SIGNS[1];
  const slug = `${signA.id}-and-${signB.id}`;

  const isSame = signA.id === signB.id;
  const isSixHarmony = isPairIn([signA.id, signB.id], SIX_HARMONIES);
  const isTriad = areInSameTriad(signA.id, signB.id);
  const isClash = isPairIn([signA.id, signB.id], SIX_CLASHES);

  let overallScore = 78;
  let romanceScore = 76;
  let friendshipScore = 80;
  let workScore = 78;
  let verdictEn = "Harmonious Complementary Match";
  let verdictZh = "相依相成 · 温良相契";
  let dynamicEn = "A gentle and balanced union. While differing in temperament, your shared goodwill builds a comfortable sanctuary.";
  let dynamicZh = "性情虽有差异，但能各取所长。在相互理解中能构建温润踏实的关系空间。";
  let strengthsEn = ["Mutual curiosity", "Balancing different perspectives", "Supportive day-to-day dynamic"];
  let strengthsZh = ["视角互补", "包容性高", "相处恬淡稳定"];
  let challengesEn = ["Occasional miscommunication", "Varying pacing in decision making"];
  let challengesZh = ["节奏偶尔不同步", "需多加言辞沟通避免心照不宣带来的误会"];
  let harmonizationTipsEn = "Practice active validation. Acknowledge your partner's distinct gifts and celebrate your differences.";
  let harmonizationTipsZh = "求同存异，学会赞赏对方独特的闪光点，常做高质量倾听。";

  if (isSixHarmony) {
    overallScore = 97;
    romanceScore = 98;
    friendshipScore = 96;
    workScore = 95;
    verdictEn = "Six Harmonies (Celestial Soulmates)";
    verdictZh = "天作之合 · 六合上上吉";
    dynamicEn = "An extraordinary spiritual resonance. You instinctively understand each other's emotional rhythms and elevate one another effortlessly.";
    dynamicZh = "气场极度相契，心意相通。彼此如天生磁铁相互吸引，能互相激发最大的福气与潜能。";
    strengthsEn = ["Unspoken telepathic bond", "Effortless emotional safety", "Natural mutual prosperity"];
    strengthsZh = ["默契无间", "极高信任感", "家业相旺相互扶持"];
    challengesEn = ["Becoming overly comfortable or insular"];
    challengesZh = ["相处过于依赖，需适度保持独立社交圈"];
    harmonizationTipsEn = "Cherish this rare celestial blessing. Keep growing together through shared adventures and long-term joint visions.";
    harmonizationTipsZh = "天定良缘当倍加珍惜，携手规划未来远景必能福禄绵长。";
  } else if (isTriad) {
    overallScore = 91;
    romanceScore = 90;
    friendshipScore = 94;
    workScore = 93;
    verdictEn = "Three Harmonies Triad (Dynamic Synergy)";
    verdictZh = "三合大吉 · 志趣相投";
    dynamicEn = "A powerful flow of shared elemental Qi. You inspire creative ambition and share matching life values and momentum.";
    dynamicZh = "五行同气相求，理想一致。既是亲密爱人，更是并肩作战的黄金拍档，动力充沛。";
    strengthsEn = ["Aligned vision and morals", "Vibrant joint productivity", "Inspiring intellectual banter"];
    strengthsZh = ["志同道合", "同频共振", "合力成事潜能大"];
    challengesEn = ["Spur-of-the-moment intensity during disagreements"];
    challengesZh = ["双方皆有主见，意见相左时易引发较量"];
    harmonizationTipsEn = "Channel your tremendous joint fire into collaborative projects and celebrate each other's individual triumphs.";
    harmonizationTipsZh = "将充沛的能量投入共同目标中，学会退让与适度授权。";
  } else if (isClash) {
    overallScore = 58;
    romanceScore = 62;
    friendshipScore = 55;
    workScore = 56;
    verdictEn = "Six Clashes (Intense Karmic Mirror)";
    verdictZh = "六冲磨砺 · 宿命考验";
    dynamicEn = "High-voltage magnetic polarity. You act as powerful catalysts for each other's profound evolutionary growth, demanding conscious maturity.";
    dynamicZh = "阴阳对冲，张力十足。如同照镜子般互相映射出彼此盲点，需极高的情商与包容方能修成正果。";
    strengthsEn = ["Intense passionate attraction", "Accelerated personal growth", "Breaking rigid comfort zones"];
    strengthsZh = ["吸引力极其强烈", "打破舒适圈", "能促成深刻蜕变"];
    challengesEn = ["Clashing communication styles", "Triggering each other's core vulnerabilities"];
    challengesZh = ["容易针尖对麦芒", "沟通易生争端情绪起伏大"];
    harmonizationTipsEn = "Practice radical non-defensiveness. Realize that differing styles are invitations to expand, not threats to defend against.";
    harmonizationTipsZh = "各退一步海阔天空，放下胜负心，把对方的差异视为完善自我的修行契机。";
  } else if (isSame) {
    overallScore = 82;
    romanceScore = 80;
    friendshipScore = 88;
    workScore = 80;
    verdictEn = "Kindred Spirits (Mirror Match)";
    verdictZh = "同气连枝 · 知己相契";
    dynamicEn = "You share identical instincts, quirks, and life priorities. You feel like meeting a familiar childhood ally.";
    dynamicZh = "生肖相同，心性相近。如同相识已久的旧友，互相极易理解对方的心思与习惯。";
    strengthsEn = ["Instant familiarity", "Shared priorities", "Comfortable companionship"];
    strengthsZh = ["一拍即合", "生活习惯默契", "亲和无压力"];
    challengesEn = ["Amplified shared flaws or stubborn streaks"];
    challengesZh = ["若遇挫折容易情绪共振，产生同样的盲点"];
    harmonizationTipsEn = "Introduce fresh third-party perspectives and diverse activities to avoid emotional stagnation.";
    harmonizationTipsZh = "多接触新鲜事物，避免两个人陷入同样的执念中。";
  }

  return {
    signA,
    signB,
    slug,
    overallScore,
    romanceScore,
    friendshipScore,
    workScore,
    verdictEn,
    verdictZh,
    dynamicEn,
    dynamicZh,
    strengthsEn,
    strengthsZh,
    challengesEn,
    challengesZh,
    harmonizationTipsEn,
    harmonizationTipsZh
  };
}

/**
 * Returns all 144 combinations for Programmatic SEO static params
 */
export function getAll144CompatibilitySlugs(): { slug: string; signA: string; signB: string }[] {
  const result: { slug: string; signA: string; signB: string }[] = [];
  for (const a of ZODIAC_SIGNS) {
    for (const b of ZODIAC_SIGNS) {
      result.push({
        slug: `${a.id}-and-${b.id}`,
        signA: a.id,
        signB: b.id
      });
    }
  }
  return result;
}
