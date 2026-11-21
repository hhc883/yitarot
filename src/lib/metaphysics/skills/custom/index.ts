import { MetaphysicsSkill } from '../types';

/**
 * 【用户预留自定义 Skill 插槽】
 * 当你找到满意的第三方 Skill 或自研断卦心法时，将 customLiuYaoSkill 赋值为你自己的 Skill 对象即可。
 * 系统会自动检测：若此对象不为 null，则立即接管默认解卦心法！
 */
export const customLiuYaoSkill: MetaphysicsSkill | null = null;
