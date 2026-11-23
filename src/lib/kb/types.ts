import type { ElementName, SixBeastName, SixRelativeName, PalaceName } from '@/lib/metaphysics/najia';
import type { ChartFacts } from './pan';

export type KBKind = 'canon' | 'rule' | 'case';
export type KBStatus = 'draft' | 'verified';

export type ConditionKey =
  | 'month-break' | 'day-break' | 'xun-kong' | 'dark-move' | 'moving' | 'all-quiet'
  | 'transform-advance' | 'transform-retreat' | 'hui-tou-sheng' | 'hui-tou-ke'
  | 'hua-mu' | 'hua-jue' | 'hua-kong' | 'ru-mu'
  | 'liu-chong-gua' | 'liu-he-gua' | 'fan-yin' | 'fu-yin'
  | 'shi-ying-chong' | 'shi-ying-he'
  | 'yong-shen-bu-xian' | 'yong-shen-liang-xian';

export type TopicKey =
  | '事业' | '财运' | '婚恋' | '疾病' | '诉讼' | '出行' | '家宅'
  | '考试' | '寻人' | '失物' | 'other';

/** 条件键 → 中文标签，写进 prompt 时用 */
export const CONDITION_LABEL: Record<ConditionKey, string> = {
  'month-break': '用神临月破',
  'day-break': '日破',
  'xun-kong': '旬空',
  'dark-move': '暗动',
  'moving': '发动',
  'all-quiet': '六爻安静',
  'transform-advance': '化进神',
  'transform-retreat': '化退神',
  'hui-tou-sheng': '化回头生',
  'hui-tou-ke': '化回头克',
  'hua-mu': '化墓',
  'hua-jue': '化绝',
  'hua-kong': '化空',
  'ru-mu': '入墓',
  'liu-chong-gua': '六冲卦',
  'liu-he-gua': '六合卦',
  'fan-yin': '反吟',
  'fu-yin': '伏吟',
  'shi-ying-chong': '世应相冲',
  'shi-ying-he': '世应相合',
  'yong-shen-bu-xian': '用神不上卦',
  'yong-shen-liang-xian': '用神两现'
};

export interface KBEntry {
  /** 稳定标识，形如 'zsy.month_break.01'，不参与 prompt 编号 */
  id: string;
  kind: KBKind;
  status: KBStatus;
  source: { book: string; chapter: string; note?: string };
  /** 触发条件，用于硬匹配（不是语义相似度） */
  when: {
    hexagram?: number[];          // 本卦/变卦卦序 1-64
    lineIndex?: number[];         // 爻位 1-6
    relative?: SixRelativeName[]; // 用神
    conditions?: ConditionKey[];
    topic?: TopicKey[];
    /** 自由补充条件，仅作展示，不参与匹配 */
    note?: string;
  };
  /** 断语原文（可摘录，不得改写语义） */
  text: string;
  verdict?: '成' | '不成' | '成中有阻' | '先难后易' | '先合后离' | '先离后合' | '凶' | '吉';
  /** 应期推法原文 */
  timing?: string;
  /** 5=典籍 4=名家 3=同门 2=普通案例 */
  credibility: 1 | 2 | 3 | 4 | 5;
}

/** 检索结果，ref 形如 'KB-03'，由 retriever 按固定顺序分配 */
export interface KnowledgeHit {
  ref: string;
  entry: KBEntry;
  score: number;
  reason: string;   // '本卦卦辞' / '用神妻财 + 月破' / '同卦同用神案例'
}

export interface KnowledgeBundle {
  hits: KnowledgeHit[];
  /** 'KB-03' → entry，供 guard 校验 */
  byRef: Map<string, KBEntry>;
  yongShen: { primary: SixRelativeName[]; secondary: SixRelativeName[]; reason: string };
  topic: TopicKey;
  facts: ChartFacts;
}

export type { ElementName, SixBeastName, SixRelativeName, PalaceName };
