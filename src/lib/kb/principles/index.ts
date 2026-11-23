import type { PrincipleEntry, PrincipleCategory } from './types';
import {
  JINGSHI_PRINCIPLES,
  JINGSHI_WUXING_CHENGZHI,
  JINGSHI_GANZHI_MECHANICS,
  JINGSHI_TWELVE_STAGES
} from './jingshi';

export * from './types';
export * from './jingshi';

/**
 * 全量天道宇宙原理与干支生克渊薮知识库
 * 目前纳入：西汉·京房《京氏易传》（55条元典原理）
 */
export const ALL_COSMOLOGICAL_PRINCIPLES: PrincipleEntry[] = [
  ...JINGSHI_PRINCIPLES
];

/** 根据 ID 获取特定原理 */
export function getPrincipleById(id: string): PrincipleEntry | undefined {
  return ALL_COSMOLOGICAL_PRINCIPLES.find(p => p.id === id);
}

/**
 * 获取地支相刑的汉代原理解释
 * @param type '无恩之刑'（寅巳申）| '恃势之刑'（丑戌未）| '无礼之刑'（子卯）| '自刑'（辰午酉亥）
 */
export function getSanXingTheory(
  type: '无恩之刑' | '恃势之刑' | '无礼之刑' | '自刑'
): PrincipleEntry | undefined {
  return JINGSHI_GANZHI_MECHANICS.find(p => p.title.includes(type));
}

/**
 * 获取六害（穿害）的根本成因机理
 */
export function getLiuHaiTheory(): PrincipleEntry | undefined {
  return JINGSHI_GANZHI_MECHANICS.find(p => p.id === 'jsyc.ganzhi.10');
}

/**
 * 获取五行亢害承制核心机理
 */
export function getWuxingChengzhiTheory(keyword: string): PrincipleEntry | undefined {
  return JINGSHI_WUXING_CHENGZHI.find(
    p => p.title.includes(keyword) || p.keywords.some(k => k.includes(keyword))
  );
}

/**
 * 获取十二长生宫位的本原定义与人事物理映射
 * @param stageName '长生' | '沐浴' | '冠带' | '临官' | '帝旺' | '衰' | '病' | '死' | '墓' | '绝' | '胎' | '养'
 */
export function getTwelveStageTheory(stageName: string): PrincipleEntry | undefined {
  return JINGSHI_TWELVE_STAGES.find(p => p.title.includes(`十二宫${stageName}`));
}

/**
 * 根据类别筛选原理
 */
export function getPrinciplesByCategory(category: PrincipleCategory): PrincipleEntry[] {
  return ALL_COSMOLOGICAL_PRINCIPLES.filter(p => p.category === category);
}

/**
 * 根据关键词模糊匹配多条宇宙原理
 */
export function findPrinciplesByKeywords(keywords: string[]): PrincipleEntry[] {
  if (!keywords || keywords.length === 0) return [];
  return ALL_COSMOLOGICAL_PRINCIPLES.filter(p => {
    return keywords.some(kw =>
      p.keywords.some(k => k.includes(kw) || kw.includes(k)) ||
      p.title.includes(kw) ||
      p.originTheory.includes(kw)
    );
  });
}

/**
 * 组装易理深层哲学渊薮快照，供 AI System Instruction 或深度推演卡片调用
 */
export function buildCosmologicalSnapshot(keywords: string[], limit: number = 3): string {
  const matches = findPrinciplesByKeywords(keywords).slice(0, limit);
  if (matches.length === 0) return '';

  const lines = matches.map(m => {
    return `- 【${m.source.book}·${m.title}】（${m.categoryNameZh}）：\n  * 天道机理：${m.originTheory}\n  * 推演指归：${m.practicalGuidance}`;
  });

  return `【天道易理与干支物理渊薮（汉代元典）】\n${lines.join('\n')}`;
}
