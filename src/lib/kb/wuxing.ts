import type { ElementName } from './types';

export type SeasonState = '临' | '旺' | '相' | '休' | '囚' | '死';

/** 五行生克关系表 */
export const SHENG_MAP: Record<ElementName, ElementName> = {
  金: '水',
  水: '木',
  木: '火',
  火: '土',
  土: '金'
};

export const KE_MAP: Record<ElementName, ElementName> = {
  金: '木',
  木: '土',
  土: '水',
  水: '火',
  火: '金'
};

/** 地支五行归属表（日辰章第十七） */
export const BRANCH_ELEMENT: Record<string, ElementName> = {
  子: '水',
  丑: '土',
  寅: '木',
  卯: '木',
  辰: '土',
  巳: '火',
  午: '火',
  未: '土',
  申: '金',
  酉: '金',
  戌: '土',
  亥: '水'
};

/** 六冲地支对（六冲章第二十） */
export const BRANCH_CHONG_PAIRS: [string, string][] = [
  ['子', '午'],
  ['丑', '未'],
  ['寅', '申'],
  ['卯', '酉'],
  ['辰', '戌'],
  ['巳', '亥']
];

/** 六合地支对（六合章第十九） */
export const BRANCH_HE_PAIRS: [string, string][] = [
  ['子', '丑'],
  ['寅', '亥'],
  ['卯', '戌'],
  ['辰', '酉'],
  ['巳', '申'],
  ['午', '未']
];

/** 地支相刑（三刑章第二十一） */
export const BRANCH_XING_PAIRS: [string, string][] = [
  ['寅', '巳'],
  ['巳', '申'],
  ['申', '寅'],
  ['子', '卯'],
  ['卯', '子'],
  ['丑', '戌'],
  ['戌', '未'],
  ['未', '丑'],
  ['辰', '辰'],
  ['午', '午'],
  ['酉', '酉'],
  ['亥', '亥']
];

/**
 * 五行长生十二宫之长生、帝旺、墓、绝（生旺墓绝章第二十六）
 * 《增删卜易》定例：金长生巳旺酉墓丑绝寅；木长生亥旺卯墓未绝申；
 * 水土长生申旺子墓辰绝巳；火长生寅旺午墓戌绝亥
 */
export const LIFE_STAGE: Record<
  ElementName,
  { changsheng: string; wang: string; mu: string; jue: string }
> = {
  金: { changsheng: '巳', wang: '酉', mu: '丑', jue: '寅' },
  木: { changsheng: '亥', wang: '卯', mu: '未', jue: '申' },
  水: { changsheng: '申', wang: '子', mu: '辰', jue: '巳' },
  土: { changsheng: '申', wang: '子', mu: '辰', jue: '巳' },
  火: { changsheng: '寅', wang: '午', mu: '戌', jue: '亥' }
};

/** 进神表（进神退神章第二十九） */
export const JIN_SHEN_MAP: Record<string, string> = {
  亥: '子',
  寅: '卯',
  巳: '午',
  申: '酉',
  丑: '辰',
  辰: '未',
  未: '戌'
};

/** 退神表（进神退神章第二十九） */
export const TUI_SHEN_MAP: Record<string, string> = {
  子: '亥',
  卯: '寅',
  午: '巳',
  酉: '申',
  辰: '丑',
  未: '辰',
  戌: '未'
};

/** 获取地支的五行 */
export function elementOf(branch: string): ElementName {
  const el = BRANCH_ELEMENT[branch];
  if (!el) throw new Error(`未知地支：${branch}`);
  return el;
}

/** 判断 a 是否生 b */
export function sheng(a: ElementName, b: ElementName): boolean {
  return SHENG_MAP[a] === b;
}

/** 判断 a 是否克 b */
export function ke(a: ElementName, b: ElementName): boolean {
  return KE_MAP[a] === b;
}

/** 判断两地支是否相冲 */
export function isChong(a: string, b: string): boolean {
  return BRANCH_CHONG_PAIRS.some(
    ([x, y]) => (x === a && y === b) || (x === b && y === a)
  );
}

/** 判断两地支是否相合 */
export function isHe(a: string, b: string): boolean {
  return BRANCH_HE_PAIRS.some(
    ([x, y]) => (x === a && y === b) || (x === b && y === a)
  );
}

/**
 * 依据月建判定五行的四时旺相休囚死（四时旺相章第十五）
 */
export function monthState(monthZhi: string, element: ElementName): SeasonState {
  const monthEl = BRANCH_ELEMENT[monthZhi];
  if (!monthEl) return '休';

  // 1. 同行者：为旺（若正好临本支亦属临/旺）
  if (element === monthEl) {
    return '旺';
  }

  // 2. 月建所生者：为相
  if (sheng(monthEl, element)) {
    return '相';
  }

  // 3. 生月建者：为休
  if (sheng(element, monthEl)) {
    return '休';
  }

  // 4. 克月建者：为囚
  if (ke(element, monthEl)) {
    return '囚';
  }

  // 5. 月建所克者：为死
  if (ke(monthEl, element)) {
    return '死';
  }

  return '休';
}

/** 判断五行是否墓于指定地支 */
export function isTomb(element: ElementName, branch: string): boolean {
  return LIFE_STAGE[element]?.mu === branch;
}

/** 判断五行是否绝于指定地支 */
export function isJue(element: ElementName, branch: string): boolean {
  return LIFE_STAGE[element]?.jue === branch;
}

/** 判断动变是否为化进神 */
export function isAdvance(from: string, to: string): boolean {
  return JIN_SHEN_MAP[from] === to;
}

/** 判断动变是否为化退神 */
export function isRetreat(from: string, to: string): boolean {
  return TUI_SHEN_MAP[from] === to;
}
