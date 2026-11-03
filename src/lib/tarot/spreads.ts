export interface SpreadPosition {
  index: number;
  name: string;
  enName: string;
  description: string;
}

export interface TarotSpread {
  id: string;
  nameZh: string;
  nameEn: string;
  slug: string;
  cardCount: number;
  category: 'general' | 'decision' | 'love' | 'career' | 'advanced';
  summary: string;
  idealFor: string;
  positions: SpreadPosition[];
}

export const TAROT_SPREADS: TarotSpread[] = [
  {
    id: 'single',
    slug: 'single-card',
    nameZh: '单张神谕牌阵',
    nameEn: 'Single Card Oracle',
    cardCount: 1,
    category: 'general',
    summary: '最简单而直接的指引，适合每日一签、特定时刻的心灵灵感与快速能量洞察。',
    idealFor: '“我今天需要注意什么？”、“这件事的核心能量是什么？”',
    positions: [
      {
        index: 0,
        name: '当下核心启示',
        enName: 'Core Message',
        description: '反映此刻最关键的心灵主题、潜在启迪或行动指导。'
      }
    ]
  },
  {
    id: 'yes_no',
    slug: 'yes-no-oracle',
    nameZh: '是否决断牌阵',
    nameEn: 'Yes / No Oracle',
    cardCount: 1,
    category: 'decision',
    summary: '针对非此即彼的纠结问题快速给出倾向性研判（Yes/No/待定），并揭示背后的关键原因与转机。',
    idealFor: '“我该不该现在跳槽？”、“我和他这周末会顺利见面吗？”',
    positions: [
      {
        index: 0,
        name: '倾向判定与症结',
        enName: 'Outcome & Cause',
        description: '断定事情倾向（积极支持 / 谨慎阻滞 / 中立静观），并指出决定结果的核心变量。'
      }
    ]
  },
  {
    id: 'three_cards',
    slug: 'time-triangle',
    nameZh: '圣三角牌阵（时间流）',
    nameEn: 'Past, Present, Future',
    cardCount: 3,
    category: 'general',
    summary: '流传最广的经典三张牌阵，通过时间维度的线性发展梳理事情的前因后果与未来趋势。',
    idealFor: '理清复杂事情的来龙去脉、探究未来可能的发展轨迹。',
    positions: [
      {
        index: 0,
        name: '过去根基（因）',
        enName: 'Past Foundation',
        description: '导致当前局面的过去经历、潜意识根源或已发生的影响。'
      },
      {
        index: 1,
        name: '现在处境（相）',
        enName: 'Present Situation',
        description: '你当前所处的真实状态、核心矛盾或直接面对的课题。'
      },
      {
        index: 2,
        name: '未来走向（果）',
        enName: 'Future Trajectory',
        description: '若依循当前态势发展，即将显化的自然结果与转折点。'
      }
    ]
  },
  {
    id: 'love_three',
    slug: 'love-triangle',
    nameZh: '爱意共鸣三维牌阵',
    nameEn: 'Love Alignment Spread',
    cardCount: 3,
    category: 'love',
    summary: '专为情感关系打造的经典镜像牌阵，透视双方内心潜意识与情感磁场。',
    idealFor: '恋爱纠结、暗恋心意、冷战磨合、复合可能性探索。',
    positions: [
      {
        index: 0,
        name: '你的真实心态',
        enName: 'Your Inner Heart',
        description: '你在这段关系中真正的渴望、恐惧与情绪投射。'
      },
      {
        index: 1,
        name: '对方的心态与状态',
        enName: "Partner's Perception",
        description: '对方目前的真实感受、对你的看法以及面临的外部压力。'
      },
      {
        index: 2,
        name: '关系未来走向与破局',
        enName: 'Relationship Destiny',
        description: '双方能量交汇的演变趋势，以及加深理解的关键建议。'
      }
    ]
  },
  {
    id: 'two_choices',
    slug: 'crossroads-choice',
    nameZh: '二选一分叉牌阵',
    nameEn: 'Two Paths Diverging',
    cardCount: 5,
    category: 'decision',
    summary: '当面临两难抉择（如两份 Offer、两个发展方向）时，清晰对比两条道路的潜能与代价。',
    idealFor: '“选 A 还是选 B？”、“创业还是继续留在大厂？”',
    positions: [
      {
        index: 0,
        name: '当前抉择原点',
        enName: 'Current Dilemma',
        description: '促使你必须做出选择的核心困局与内在动机。'
      },
      {
        index: 1,
        name: '选择 A 的过程体验',
        enName: 'Path A Journey',
        description: '选择选项 A 后将经历的发展过程、挑战与所需付出。'
      },
      {
        index: 2,
        name: '选择 A 的最终结果',
        enName: 'Path A Outcome',
        description: '选项 A 最终为你带来的回报、成长或长远局面。'
      },
      {
        index: 3,
        name: '选择 B 的过程体验',
        enName: 'Path B Journey',
        description: '选择选项 B 后将经历的发展过程、挑战与所需付出。'
      },
      {
        index: 4,
        name: '选择 B 的最终结果',
        enName: 'Path B Outcome',
        description: '选项 B 最终为你带来的回报、成长或长远局面。'
      }
    ]
  },
  {
    id: 'celtic_cross',
    slug: 'celtic-cross',
    nameZh: '经典凯尔特十字牌阵',
    nameEn: 'The Celtic Cross',
    cardCount: 10,
    category: 'advanced',
    summary: '西方塔罗界最具深度与权威的全景牌阵，全方位透析意识、潜意识、阻碍、环境与终局。',
    idealFor: '重大人生转折点、全景深度体检、全方位探寻命运密码。',
    positions: [
      { index: 0, name: '核心现状', enName: 'The Present Heart', description: '当前问题的核心所在与主要氛围。' },
      { index: 1, name: '阻碍或助力', enName: 'The Cross / Obstacle', description: '直接交错在核心之上的主要阻力或推力。' },
      { index: 2, name: '根源与潜意识', enName: 'The Foundation', description: '深藏于心底的深层动因与过往历史。' },
      { index: 3, name: '过往影响', enName: 'The Recent Past', description: '刚刚发生并依然产生余波的关键事件。' },
      { index: 4, name: '意识愿景', enName: 'Higher Consciousness', description: '你头脑中期待的最佳目标与理想蓝图。' },
      { index: 5, name: '近期未来', enName: 'Near Future', description: '即将出现的第一波发展波澜。' },
      { index: 6, name: '自我态度', enName: 'Self-Perception', description: '你如何看待自己在这场局面中的角色。' },
      { index: 7, name: '外部环境', enName: 'External Environment', description: '周围人事物、公司或社会环境对你的影响。' },
      { index: 8, name: '希望与恐惧', enName: 'Hopes and Fears', description: '内心深处最渴望与最担忧的隐秘心结。' },
      { index: 9, name: '最终结果', enName: 'Final Culmination', description: '一切能量综合显化的长远大结局。' }
    ]
  }
];

export function getSpreadById(id: string): TarotSpread | undefined {
  return TAROT_SPREADS.find(s => s.id === id);
}

export function getSpreadBySlug(slug: string): TarotSpread | undefined {
  return TAROT_SPREADS.find(s => s.slug === slug);
}
