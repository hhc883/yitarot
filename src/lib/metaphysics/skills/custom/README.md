# 🛠️ 自定义 Skill 插件预留插槽

这里是为你预留的 **自定义易学 Skill 插件插槽**。

当你找到合适的 Skill（或者自己编写了新的断卦流派、提示词库、典籍语料）时，你可以直接通过以下两种方式之一将其接入系统：

---

### 方式 A（最简单）：直接在此目录下的 `index.ts` 中写入你的 Skill
修改 `src/lib/metaphysics/skills/custom/index.ts`，导出符合 `MetaphysicsSkill` 接口的对象：
```ts
import { MetaphysicsSkill } from '../types';

export const customLiuYaoSkill: MetaphysicsSkill = {
  manifest: {
    id: 'my-custom-skill',
    name: '我的专属大师断卦心法',
    version: '1.0.0',
    description: '我精选的易经断卦法则',
    category: 'liuyao'
  },
  systemInstruction: `这里粘贴你找到的大师系统提示词与断卦法则...`,
  assembleContext: (ctx) => `针对卦象动态注入的知识...`
};
```

---

### 方式 B：通过环境变量指定激活的 Skill ID
在 `.env.local` 或生产环境中配置：
```bash
# 默认使用 default-liuyao，配置后会自动优先加载对应的自定义 Skill
ACTIVE_LIUYAO_SKILL_ID=my-custom-skill
```

系统在启动和解卦时会自动优先从该目录加载自定义 Skill！
