import { MetaphysicsSkill } from './types';
import { defaultLiuYaoSkill } from './default-skill';
import { customLiuYaoSkill } from './custom';

/**
 * 易学专业 Skill 注册与调度中心
 * 自动检测并加载当前生效的 Skill，实现解卦流派与心法知识库的热插拔。
 */
export function getActiveLiuYaoSkill(): MetaphysicsSkill {
  // 1. 如果用户已经在 custom 插槽中放入了有效 Skill，则优先使用用户自定义 Skill
  if (customLiuYaoSkill && customLiuYaoSkill.manifest?.id) {
    return customLiuYaoSkill;
  }

  // 2. 默认使用系统内置的标准京房纳甲 + 增删卜易官方基准 Skill
  return defaultLiuYaoSkill;
}

/**
 * 获取当前所有已安装的 Skill 列表（方便未来在前端下拉选择导师流派）
 */
export function listInstalledLiuYaoSkills(): MetaphysicsSkill[] {
  const skills: MetaphysicsSkill[] = [defaultLiuYaoSkill];
  if (customLiuYaoSkill) {
    skills.push(customLiuYaoSkill);
  }
  return skills;
}
