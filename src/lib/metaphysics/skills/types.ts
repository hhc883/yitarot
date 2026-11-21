/**
 * YiTatro 易学专业 Skill 规范定义
 * 任何第三方或自定义 Skill 只需符合此接口，即可直接热插拔接入解卦系统。
 */

export interface MetaphysicsSkillManifest {
  /** 唯一标识符，如 "zengshan-buyi", "yehe-laoren", "my-custom-skill" */
  id: string;
  /** 技能名称，如 "野鹤老人六爻实战断卦心法" */
  name: string;
  /** 技能版本号 */
  version: string;
  /** 技能作者或来源 */
  author?: string;
  /** 技能简介与流派特色 */
  description: string;
  /** 适用的数术门类 */
  category: 'liuyao' | 'tarot' | 'bazi';
  /** 适用标签，如 ["实战", "应期", "生克", "断事"] */
  tags?: string[];
}

export interface ReadingContext {
  question: string;
  primaryHexName: string;
  transformedHexName?: string;
  generationName?: string;
  palace?: string;
  palaceElement?: string;
  shiIndex?: number;
  yingIndex?: number;
  monthZhi?: string;
  dayZhi?: string;
  xunKong?: string;
  changingLines?: number[];
  lang?: 'zh' | 'en';
}

export interface MetaphysicsSkill {
  manifest: MetaphysicsSkillManifest;

  /**
   * 注入给大模型的系统人设与核心宗纲（System Instruction）
   * 包含断卦师承、严禁幻觉规则、思维链（Chain of Thought）步骤。
   */
  systemInstruction: string;

  /**
   * 专有知识库与规则提示词组装器（可选）
   * 可以针对当前卦象动态注入古典典籍引文、用神法则、应期断语等。
   */
  assembleContext?: (ctx: ReadingContext) => string;

  /**
   * 多轮追问专属指引（针对 2 积分针对此卦深入追问）
   */
  followUpInstruction?: string;
}
