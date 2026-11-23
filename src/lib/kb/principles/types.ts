export type PrincipleCategory = 'wuxing-chengzhi' | 'ganzhi-mechanics' | 'twelve-stages';

export interface PrincipleEntry {
  /** 唯一稳定标识，形如 'jsyc.wuxing.01' */
  id: string;
  /** 原理条目标题 */
  title: string;
  /** 所属核心范畴 */
  category: PrincipleCategory;
  /** 中文范畴名 */
  categoryNameZh: string;
  /** 出处与作者 */
  source: {
    book: string;
    author: string;
    era: string;
  };
  /** 天道哲学机理 / 气机生成机理 / 本原定义 */
  originTheory: string;
  /** 推演指导价值 / 吉凶倾向总结 / 人事与物理映射 */
  practicalGuidance: string;
  /** 检索与触发表征关键词 */
  keywords: string[];
}
