import { BlogToolCta } from '@/types/blog';

export const BLOG_TOOLS: Record<string, BlogToolCta> = {
  'tool-tarot-draw': {
    id: 'tool-tarot-draw',
    nameZh: '每日单牌与共时性抽牌',
    nameEn: 'Daily Card & Synchronicity Draw',
    descZh: '静心凝神，翻开一张映照你此刻潜意识盲区的镜中之牌。',
    descEn: 'Center your mind and reveal the mirror card reflecting your subconscious right now.',
    ctaZh: '抽取属于当下的牌 →',
    ctaEn: 'Draw Your Card →',
    href: '/draw'
  },
  'tool-tarot-reading': {
    id: 'tool-tarot-reading',
    nameZh: 'AI 智能塔罗占卜',
    nameEn: 'YiTarot AI Reading',
    descZh: '结合具体问题语境与牌阵结构，获得清晰、深度的 AI 塔罗解读。',
    descEn: 'Pair your question context with structured card spreads for grounded AI tarot guidance.',
    ctaZh: '开始 AI 塔罗占卜 →',
    ctaEn: 'Try AI Tarot Reading →',
    href: '/reading'
  },
  'tool-bazi-chart': {
    id: 'tool-bazi-chart',
    nameZh: '专业四柱八字全息排盘',
    nameEn: 'Holographic BaZi Natal Chart',
    descZh: '输入生辰八字，秒级生成四柱五行强弱与十神全景图谱。',
    descEn: 'Calculate your four pillars, five elements equilibrium, and Ten Gods distribution.',
    ctaZh: '测算我的八字格局 →',
    ctaEn: 'Calculate My BaZi Chart →',
    href: '/east/bazi'
  },
  'tool-reading-ai': {
    id: 'tool-reading-ai',
    nameZh: '全域智慧推演（塔罗与易经）',
    nameEn: 'Holistic Metaphysical Reading',
    descZh: '输入你的困惑，AI 融合东方卦象与西方牌阵进行多维心智启发。',
    descEn: 'Enter your inquiry for multidimensional synthesis of hexagrams and archetypal spreads.',
    ctaZh: '开启深度推演 →',
    ctaEn: 'Begin In-Depth Reading →',
    href: '/reading'
  },
  'tool-yes-no': {
    id: 'tool-yes-no',
    nameZh: 'Yes / No 塔罗即时指引',
    nameEn: 'Yes or No Tarot',
    descZh: '针对二元抉择快速抽牌，获得带有情境解释的方向性建议。',
    descEn: 'Get fast directional clarity for binary decisions with grounded card context.',
    ctaZh: '获取 Yes/No 指引 →',
    ctaEn: 'Try Yes/No Tarot →',
    href: '/yes-no'
  },
  'tool-love': {
    id: 'tool-love',
    nameZh: '情感与关系塔罗牌阵',
    nameEn: 'Love Tarot Reading',
    descZh: '梳理双方情绪投射、关系张力与下一步沟通方向。',
    descEn: 'Explore relationship dynamics, emotional clarity, and constructive next steps.',
    ctaZh: '开启爱情塔罗 →',
    ctaEn: 'Explore Love Tarot →',
    href: '/love'
  },
  'tool-daily-fortune': {
    id: 'tool-daily-fortune',
    nameZh: '每日运势与今日之牌',
    nameEn: 'Daily Fortune & Tarot',
    descZh: '查看今日能量气象与行动提醒，保持清醒的日常节奏。',
    descEn: 'Check your daily energetic forecast and card-of-the-day reflection.',
    ctaZh: '查看今日指引 →',
    ctaEn: 'View Daily Forecast →',
    href: '/fortune/daily'
  }
};
