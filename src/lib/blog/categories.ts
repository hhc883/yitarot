import { BlogCategory } from '@/types/blog';

export interface BlogCategoryMeta {
  id: BlogCategory;
  nameZh: string;
  nameEn: string;
  descZh: string;
  descEn: string;
}

export const BLOG_CATEGORIES: BlogCategoryMeta[] = [
  {
    id: 'tarot',
    nameZh: '塔罗研习',
    nameEn: 'Tarot Wisdom',
    descZh: '78张牌义深度剖析、经典牌阵与实修指南',
    descEn: 'Deep-dive into 78 archetypes, spreads, and intuitive practice'
  },
  {
    id: 'metaphysics',
    nameZh: '东方数术',
    nameEn: 'Eastern Metaphysics',
    descZh: '八字命理格局、周易六爻与五行调候',
    descEn: 'BaZi blueprint, I Ching hexagrams, and elemental harmony'
  },
  {
    id: 'mind',
    nameZh: '心学与心理',
    nameEn: 'Mind & Depth',
    descZh: '荣格共时性、潜意识投射与自我赋权',
    descEn: 'Jungian synchronicity, archetypal projection, and self-agency'
  },
  {
    id: 'cases',
    nameZh: '真实复盘',
    nameEn: 'Case Studies',
    descZh: '真实推演复盘、职业抉择与情感疗愈',
    descEn: 'Real-world reading analysis, career choices, and emotional healing'
  }
];
