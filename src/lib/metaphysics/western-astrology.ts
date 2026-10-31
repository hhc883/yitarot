export type WesternElement = "Fire" | "Earth" | "Air" | "Water";
export type Modality = "Cardinal" | "Fixed" | "Mutable";

export interface WesternZodiacSign {
  id: string;
  nameEn: string;
  nameZh: string;
  symbol: string;
  dateRange: string;
  element: WesternElement;
  elementZh: string;
  modality: Modality;
  rulingPlanet: string;
  rulingPlanetZh: string;
  keywords: string[];
  descriptionEn: string;
  descriptionZh: string;
}

export const WESTERN_ZODIAC_SIGNS: Record<string, WesternZodiacSign> = {
  aries: {
    id: "aries",
    nameEn: "Aries",
    nameZh: "白羊座",
    symbol: "♈",
    dateRange: "Mar 21 - Apr 19",
    element: "Fire",
    elementZh: "火象",
    modality: "Cardinal",
    rulingPlanet: "Mars",
    rulingPlanetZh: "火星",
    keywords: ["Pioneering", "Bold", "Independent", "Dynamic"],
    descriptionEn: "A passionate trailblazer driven by impulse and high vitality. You initiate action with raw enthusiasm.",
    descriptionZh: "天生的开创者与先锋，拥有旺盛的生命力与进取心，行事果决勇敢。"
  },
  taurus: {
    id: "taurus",
    nameEn: "Taurus",
    nameZh: "金牛座",
    symbol: "♉",
    dateRange: "Apr 20 - May 20",
    element: "Earth",
    elementZh: "土象",
    modality: "Fixed",
    rulingPlanet: "Venus",
    rulingPlanetZh: "金星",
    keywords: ["Grounded", "Patient", "Sensual", "Steadfast"],
    descriptionEn: "Anchored and loyal, with a deep appreciation for beauty, stability, and tangible abundance.",
    descriptionZh: "沉稳可靠，极具耐心与审美鉴赏力，追求安稳与实实在在的物质丰盛。"
  },
  gemini: {
    id: "gemini",
    nameEn: "Gemini",
    nameZh: "双子座",
    symbol: "♊",
    dateRange: "May 21 - Jun 20",
    element: "Air",
    elementZh: "风象",
    modality: "Mutable",
    rulingPlanet: "Mercury",
    rulingPlanetZh: "水星",
    keywords: ["Curious", "Adaptable", "Witty", "Communicative"],
    descriptionEn: "A versatile thinker with insatiable curiosity, effortlessly bridging diverse ideas and people.",
    descriptionZh: "思维敏捷多变，拥有旺盛的求知欲与交流天赋，善于连接多元观念与人群。"
  },
  cancer: {
    id: "cancer",
    nameEn: "Cancer",
    nameZh: "巨蟹座",
    symbol: "♋",
    dateRange: "Jun 21 - Jul 22",
    element: "Water",
    elementZh: "水象",
    modality: "Cardinal",
    rulingPlanet: "Moon",
    rulingPlanetZh: "月亮",
    keywords: ["Intuitive", "Nurturing", "Empathetic", "Protective"],
    descriptionEn: "Deeply emotional and protective, possessing innate emotional radar and devotion to loved ones.",
    descriptionZh: "感知敏锐细腻，富有滋养与关怀天性，对家庭与所爱之人具备天然的保护本能。"
  },
  leo: {
    id: "leo",
    nameEn: "Leo",
    nameZh: "狮子座",
    symbol: "♌",
    dateRange: "Jul 23 - Aug 22",
    element: "Fire",
    elementZh: "火象",
    modality: "Fixed",
    rulingPlanet: "Sun",
    rulingPlanetZh: "太阳",
    keywords: ["Radiant", "Generous", "Charismatic", "Confident"],
    descriptionEn: "A magnetic, warm-hearted natural leader who illuminates any room with confidence and creative spark.",
    descriptionZh: "如太阳般光芒万丈的天生领袖，胸襟开阔，散发着无可阻挡的魅力与自信。"
  },
  virgo: {
    id: "virgo",
    nameEn: "Virgo",
    nameZh: "处女座",
    symbol: "♍",
    dateRange: "Aug 23 - Sep 22",
    element: "Earth",
    elementZh: "土象",
    modality: "Mutable",
    rulingPlanet: "Mercury",
    rulingPlanetZh: "水星",
    keywords: ["Analytical", "Devoted", "Refined", "Pragmatic"],
    descriptionEn: "A keen observer who seeks perfection, transforming raw chaos into structured elegance and service.",
    descriptionZh: "观察细致入微，追求极致与秩序，善于化繁为简，以精益求精的态度处世。"
  },
  libra: {
    id: "libra",
    nameEn: "Libra",
    nameZh: "天秤座",
    symbol: "♎",
    dateRange: "Sep 23 - Oct 22",
    element: "Air",
    elementZh: "风象",
    modality: "Cardinal",
    rulingPlanet: "Venus",
    rulingPlanetZh: "金星",
    keywords: ["Harmonious", "Diplomatic", "Aesthetic", "Charming"],
    descriptionEn: "The master of balance and aesthetics, gifted with diplomacy, grace, and an innate sense of justice.",
    descriptionZh: "追求和谐与平衡的大师，拥有极高的审美修养与外交智慧，处事优雅中正。"
  },
  scorpio: {
    id: "scorpio",
    nameEn: "Scorpio",
    nameZh: "天蝎座",
    symbol: "♏",
    dateRange: "Oct 23 - Nov 21",
    element: "Water",
    elementZh: "水象",
    modality: "Fixed",
    rulingPlanet: "Pluto / Mars",
    rulingPlanetZh: "冥王星 / 火星",
    keywords: ["Intense", "Transformative", "Perceptive", "Magnetic"],
    descriptionEn: "Deeply penetrating and transformative. You see through illusions and wield potent emotional power.",
    descriptionZh: "洞察力直击本质，拥有惊人的意志力与蜕变潜能，情感深邃且极具吸引力。"
  },
  sagittarius: {
    id: "sagittarius",
    nameEn: "Sagittarius",
    nameZh: "射手座",
    symbol: "♐",
    dateRange: "Nov 22 - Dec 21",
    element: "Fire",
    elementZh: "火象",
    modality: "Mutable",
    rulingPlanet: "Jupiter",
    rulingPlanetZh: "木星",
    keywords: ["Philosophical", "Optimistic", "Free-Spirited", "Adventurous"],
    descriptionEn: "The cosmic explorer in pursuit of truth, freedom, and higher horizons across mind and world.",
    descriptionZh: "探索宇宙真理的哲思者，崇尚自由与远方，生性乐观豁达，勇于探索未知。"
  },
  capricorn: {
    id: "capricorn",
    nameEn: "Capricorn",
    nameZh: "摩羯座",
    symbol: "♑",
    dateRange: "Dec 22 - Jan 19",
    element: "Earth",
    elementZh: "土象",
    modality: "Cardinal",
    rulingPlanet: "Saturn",
    rulingPlanetZh: "土星",
    keywords: ["Ambitious", "Disciplined", "Strategic", "Enduring"],
    descriptionEn: "The architect of lasting legacy, driven by patience, mastery, resilience, and quiet determination.",
    descriptionZh: "现实与大局的构建大师，沉稳隐忍，自律克己，具备经得起时间考验的恒心。"
  },
  aquarius: {
    id: "aquarius",
    nameEn: "Aquarius",
    nameZh: "水瓶座",
    symbol: "♒",
    dateRange: "Jan 20 - Feb 18",
    element: "Air",
    elementZh: "风象",
    modality: "Fixed",
    rulingPlanet: "Uranus / Saturn",
    rulingPlanetZh: "天王星 / 土星",
    keywords: ["Visionary", "Individualistic", "Humanitarian", "Original"],
    descriptionEn: "A visionary rebel thinking decades ahead, dedicated to personal freedom and collective evolution.",
    descriptionZh: "前瞻时代的发明家与人道主义者，不落俗套，拥有超越常规的独立思维与大爱胸怀。"
  },
  pisces: {
    id: "pisces",
    nameEn: "Pisces",
    nameZh: "双鱼座",
    symbol: "♓",
    dateRange: "Feb 19 - Mar 20",
    element: "Water",
    elementZh: "水象",
    modality: "Mutable",
    rulingPlanet: "Neptune / Jupiter",
    rulingPlanetZh: "海王星 / 木星",
    keywords: ["Mystical", "Compassionate", "Artistic", "Dreamer"],
    descriptionEn: "The boundless mystic and artist, effortlessly attuned to the spiritual unseen and universal empathy.",
    descriptionZh: "充满灵性的艺术家与造梦者，天生具有超常的同理心与通灵感悟力，性情温柔慈悲。"
  }
};

/**
 * Calculate Western Tropical Zodiac sign from solar month and day
 */
export function getWesternZodiacSign(month: number, day: number): WesternZodiacSign {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return WESTERN_ZODIAC_SIGNS.aries;
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return WESTERN_ZODIAC_SIGNS.taurus;
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return WESTERN_ZODIAC_SIGNS.gemini;
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return WESTERN_ZODIAC_SIGNS.cancer;
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return WESTERN_ZODIAC_SIGNS.leo;
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return WESTERN_ZODIAC_SIGNS.virgo;
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return WESTERN_ZODIAC_SIGNS.libra;
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return WESTERN_ZODIAC_SIGNS.scorpio;
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return WESTERN_ZODIAC_SIGNS.sagittarius;
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return WESTERN_ZODIAC_SIGNS.capricorn;
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return WESTERN_ZODIAC_SIGNS.aquarius;
  return WESTERN_ZODIAC_SIGNS.pisces;
}
