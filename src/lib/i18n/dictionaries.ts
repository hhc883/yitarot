export type Locale = "en" | "zh";

export interface Dictionary {
  nav: {
    home: string;
    bazi: string;
    compatibility: string;
    iching: string;
    knowledge: string;
    about: string;
    switchLang: string;
  };
  hero: {
    badge: string;
    titleStart: string;
    titleHighlight: string;
    titleEnd: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    statUsers: string;
    statAccuracy: string;
    statWisdom: string;
  };
  bridge: {
    badge: string;
    title: string;
    subtitle: string;
    westCardTitle: string;
    westCardDesc: string;
    eastCardTitle: string;
    eastCardDesc: string;
    synthesisTitle: string;
    synthesisDesc: string;
  };
  tools: {
    badge: string;
    title: string;
    subtitle: string;
    baziTitle: string;
    baziDesc: string;
    baziBtn: string;
    compatTitle: string;
    compatDesc: string;
    compatBtn: string;
    ichingTitle: string;
    ichingDesc: string;
    ichingBtn: string;
  };
  knowledge: {
    badge: string;
    title: string;
    subtitle: string;
    readMore: string;
    articles: {
      title: string;
      category: string;
      excerpt: string;
      readTime: string;
    }[];
  };
  footer: {
    brandDesc: string;
    quickLinks: string;
    legal: string;
    privacy: string;
    terms: string;
    disclaimer: string;
    copyright: string;
  };
}

export const DICTIONARIES: Record<Locale, Dictionary> = {
  en: {
    nav: {
      home: "Home",
      bazi: "Dual Blueprint",
      compatibility: "Zodiac Match",
      iching: "I Ching Oracle",
      knowledge: "Wisdom Guides",
      about: "About & E-E-A-T",
      switchLang: "中文"
    },
    hero: {
      badge: "✦ Ancient Eastern Wisdom × Modern Self-Discovery",
      titleStart: "Decode Your",
      titleHighlight: "Cosmic Blueprint",
      titleEnd: "Through Eastern & Western Wisdom",
      subtitle: "Unite the astronomical precision of your Western Sun Sign with the deep energetic alchemy of your Eastern Four Pillars (BaZi) and Five Elements.",
      ctaPrimary: "Calculate Free Blueprint",
      ctaSecondary: "Ask I Ching Oracle",
      statUsers: "50,000+ Cosmic Charts Cast",
      statAccuracy: "100% Astronomical Solar Term Precision",
      statWisdom: "3,000+ Years Ancient Methodology"
    },
    bridge: {
      badge: "✦ The Metaphysical Bridge",
      title: "Why Combine Western Astrology & Eastern BaZi?",
      subtitle: "Western astrology maps your psychological archetype; Eastern BaZi maps your raw elemental Qi and seasonal timing.",
      westCardTitle: "Western Astrology (The Psychological Mask)",
      westCardDesc: "Maps your Sun, Moon, and Rising constellations. Reveals conscious motivations, social personality, and emotional cravings.",
      eastCardTitle: "Eastern BaZi (The Core Elemental Qi)",
      eastCardDesc: "Calculates the exact cosmic energy at your birth using 24 Solar Terms and Five Elements (Wu Xing). Reveals your innate destiny code and Day Master soul.",
      synthesisTitle: "The Celestial Alchemy",
      synthesisDesc: "When both frameworks align, blind spots dissolve. You gain unparalleled clarity over career cycles, relationship harmony, and personal power."
    },
    tools: {
      badge: "✦ Interactive Cosmic Tools",
      title: "Explore Your Energetic Dimensions",
      subtitle: "Free, instantaneous, and mathematically exact calculation tools crafted with reverence.",
      baziTitle: "Dual Celestial Blueprint Calculator",
      baziDesc: "Calculate your Western Sun Sign, Eastern Four Pillars (BaZi), Day Master soul archetype, and Wu Xing energy balance radar chart.",
      baziBtn: "Launch Blueprint Tool",
      compatTitle: "144 Zodiac Compatibility Matrix",
      compatDesc: "Discover deep spiritual affinity, Six Harmonies, and karmic dynamics between any two Chinese Zodiac signs.",
      compatBtn: "Explore Compatibility",
      ichingTitle: "I Ching 3-Coin Oracle",
      ichingDesc: "Toss virtual ancient coins, cast the 64 sacred hexagrams, and unlock timeless philosophical guidance for pressing life choices.",
      ichingBtn: "Cast Coins Now"
    },
    knowledge: {
      badge: "✦ The Metaphysical Library",
      title: "Ancient Guides for Modern Living",
      subtitle: "Curated essays bridging Eastern cosmology, modern psychology, and practical lifestyle harmony.",
      readMore: "Read Guide →",
      articles: [
        {
          title: "Decoding the 10 Day Masters: Which Element Is Your Core Soul?",
          category: "BaZi Cosmology",
          excerpt: "From the unyielding Yang Wood Oak to the intuitive Yin Water Dew, discover your authentic energetic archetype.",
          readTime: "7 min read"
        },
        {
          title: "The Five Elements in Modern Living: How to Balance Missing Qi",
          category: "Wu Xing Alchemy",
          excerpt: "Practical daily rituals, colors, and Feng Shui spatial adjustments to remediate elemental deficits in your birth chart.",
          readTime: "6 min read"
        },
        {
          title: "Carl Jung & the I Ching: The Science of Synchronicity",
          category: "Philosophical Depth",
          excerpt: "How Western depth psychology unlocked the profound non-causal synchronicity encoded in China's oldest book of changes.",
          readTime: "9 min read"
        }
      ]
    },
    footer: {
      brandDesc: "A modern sanctuary uniting ancient Eastern metaphysics (BaZi, Five Elements, I Ching) with Western astrology for conscious self-discovery and life harmony.",
      quickLinks: "Cosmic Engines",
      legal: "Integrity & Trust",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      disclaimer: "Disclaimer: The readings and guidance provided on this website are intended for philosophical self-reflection, spiritual wellness, and entertainment purposes. They do not constitute certified medical, financial, or legal advice.",
      copyright: "© 2026 CosmicBlueprint. All rights reserved. Built with reverence and cosmic alignment."
    }
  },
  zh: {
    nav: {
      home: "首页",
      bazi: "双盘合一蓝图",
      compatibility: "生肖合盘配对",
      iching: "易经铜钱神谕",
      knowledge: "玄学智慧专栏",
      about: "关于我们 & 权威背书",
      switchLang: "English"
    },
    hero: {
      badge: "✦ 东方玄学智慧 × 现代自我探索",
      titleStart: "探索你的",
      titleHighlight: "本命宇宙蓝图",
      titleEnd: "融合东西方命理精髓",
      subtitle: "将西方太阳星座的心理原型，与东方八字四柱（24节气精准排盘）及五行生克气场深度相融，唤醒真实自我潜能。",
      ctaPrimary: "免费测算个人蓝图",
      ctaSecondary: "开启易经起卦",
      statUsers: "50,000+ 命盘排演测算",
      statAccuracy: "100% 节气天文历法精准",
      statWisdom: "3,000+ 年古老东方智慧"
    },
    bridge: {
      badge: "✦ 东西方玄学之桥",
      title: "为何需要东西合璧测算？",
      subtitle: "西玄识心，东玄明气。星座照见外在性格与欲望，八字洞悉内在元神与四时流转。",
      westCardTitle: "西方占星（心理图式）",
      westCardDesc: "推演太阳、月亮与上升星座，解析显意识动机、社会人格与情感渴求。",
      eastCardTitle: "东方八字（元神气运）",
      eastCardDesc: "严格依据出生立春与节气计算四柱天干地支，推导日主本命五行强弱与命运大运轨迹。",
      synthesisTitle: "东西相合的觉醒之力",
      synthesisDesc: "双重视角互为参证，消除单一占卜盲区，让你在事业选择、亲密关系与心性修持上通透豁达。"
    },
    tools: {
      badge: "✦ 核心交互测算工具",
      title: "探索你的多元生命能量",
      subtitle: "全免费、秒级排盘、严谨遵循古法的天文算法工具箱。",
      baziTitle: "双盘合一命理蓝图测算器",
      baziDesc: "一键测算西洋太阳星座、东方八字四柱、日主元神原型与五行能量平衡雷达图。",
      baziBtn: "进入双盘测算",
      compatTitle: "144 组生肖五行合盘矩阵",
      compatDesc: "深度解析十二生肖之间的天作六合、三合吉局与六冲磨砺，获知婚恋与事业合拍指引。",
      compatBtn: "查询生肖配对",
      ichingTitle: "易经三铜钱即时决策神谕",
      ichingDesc: "模拟古铜钱抛掷起卦，推演 64 卦辞与变爻，结合荣格共时性为当下抉择解惑。",
      ichingBtn: "立即铜钱起卦"
    },
    knowledge: {
      badge: "✦ 玄学知识库",
      title: "古老智慧的现代生活指南",
      subtitle: "系统化拆解八字、风水、五行调和与周易哲学。",
      readMore: "阅读专栏 →",
      articles: [
        {
          title: "十天干日主全解析：你属于哪一种本命元神？",
          category: "八字命理",
          excerpt: "从顶天立地的甲木大树，到润物无声的癸水雨露，看清自己的核心天赋与修行功课。",
          readTime: "7 分钟阅读"
        },
        {
          title: "现代生活中的五行调和：缺木火土金水如何后天补救？",
          category: "五行能量",
          excerpt: "日常起居、色彩穿搭、居室风水与身心调息全方位五行平衡实操建议。",
          readTime: "6 分钟阅读"
        },
        {
          title: "荣格心理学与《周易》：共时性背后的宇宙法则",
          category: "哲学溯源",
          excerpt: "西方心理学巨擘如何被东方六十四卦震撼，解密无因果联系中的神秘指引。",
          readTime: "9 分钟阅读"
        }
      ]
    },
    footer: {
      brandDesc: "融合东方古老玄学（八字、五行、易经）与西方现代占星学的探索平台，以理性、优雅与去迷信化的视角赋能现代人自我认知。",
      quickLinks: "核心工具",
      legal: "诚信与规范",
      privacy: "隐私政策",
      terms: "服务条款",
      disclaimer: "免责声明：本站提供之命理测算与哲学建议仅供个人心灵探索、哲学思考与文化娱乐参考，不构成任何医疗、法律或金融投资专业意见。",
      copyright: "© 2026 CosmicBlueprint. 保留所有权利。古法天文，中正平和。"
    }
  }
};

export function getDictionary(lang: string): Dictionary {
  if (lang === "zh") return DICTIONARIES.zh;
  return DICTIONARIES.en;
}
