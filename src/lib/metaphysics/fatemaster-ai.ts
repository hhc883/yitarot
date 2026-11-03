import { calculateBaZi, BaZiCalculationResult } from './bazi';
import { IChingReading } from './iching';

export interface BaziAiRequest {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute?: number;
  gender: 'male' | 'female';
  name?: string;
  focusArea?: 'career' | 'wealth' | 'love' | 'health' | 'general';
}

export interface LiuYaoAiRequest {
  question: string;
  reading: IChingReading;
}

/**
 * 构造八字深度推演的 System & User Prompt
 */
export function buildBaziPrompt(data: BaZiCalculationResult, req: BaziAiRequest): string {
  return `你是一位兼具正统子平八字命理精髓与现代荣格心理学视角的资深命理宗师（类似 FateMaster.ai 权威架构）。
求问者：${req.name || '求问者'}，性别：${req.gender === 'male' ? '男（乾造）' : '女（坤造）'}
公历出生：${data.birthSolar.year}年${data.birthSolar.month}月${data.birthSolar.day}日${data.birthSolar.hour}时，农历：${data.lunarString}
【四柱八字】：
- 年柱：${data.pillars.year.gan}${data.pillars.year.zhi}（${data.pillars.year.naYin}）
- 月柱：${data.pillars.month.gan}${data.pillars.month.zhi}（${data.pillars.month.naYin}）
- 日柱：${data.pillars.day.gan}${data.pillars.day.zhi}（${data.pillars.day.naYin}）
- 时柱：${data.pillars.hour.gan}${data.pillars.hour.zhi}（${data.pillars.hour.naYin}）

【日主元神】：${data.dayMaster.nameZh}（${data.dayMaster.archetypeZh}）
【五行分布】：
${data.fiveElements.map(e => `- ${e.elementZh}：${e.count}个 (${e.percentage}%) - ${e.statusZh}`).join('\n')}

请为求问者撰写一份客观、深刻、现代且极具指导意义的【AI 命理全息蓝图】：
# 🌟 原局元神与性格底色
# ⚖️ 五行生克与能量调候
# 💼 事业发展与天赋赛道
# 🪙 财富格局与进财指南
# ❤️ 情感姻缘与相处之道
# 🧭 后天补运与破局策略（包含颜色、方位、作息与心性修炼建议）`;
}

/**
 * 构造六爻占卦的 System & User Prompt
 */
export function buildLiuYaoPrompt(req: LiuYaoAiRequest): string {
  const { question, reading } = req;
  const p = reading.primaryHexagram;
  const t = reading.transformedHexagram;

  return `你是一位精通周易六十四卦、纳甲六爻与时代决断的易学智者。
求问者所决之事：“${question}”
起卦结果：
- 【本卦】：第 ${p.number} 卦 · ${p.nameZh}（${p.upperTrigram}上 / ${p.lowerTrigram}下）
- 卦辞断语：${p.judgmentZh}
- 大象传：${p.imageZh}
${t ? `- 【变卦】：第 ${t.number} 卦 · ${t.nameZh}（${t.upperTrigram}上 / ${t.lowerTrigram}下）
- 变卦断语：${t.judgmentZh}
- 变动爻位：${reading.changingLineIndices.map(i => `第 ${i} 爻`).join('、')}` : '- 无变爻，纯取本卦体用'}

请为求问者生成结构严谨、辞章典雅的六爻神谕解析：
# ䷀ 卦象全景与当下时势
# 🔍 卦爻辞深层映射
# ⚖️ 本卦与变卦的转机因果
# 🧭 破局行动指南（应为之事 Do & 当避之戒 Don't）
# ✨ 易道天心箴言`;
}

/**
 * 本地智能八字解读引擎（离线/免 Key 降级保障）
 */
export function generateLocalBaziReport(data: BaZiCalculationResult): string {
  const dm = data.dayMaster;
  const dominantElement = data.fiveElements.reduce((prev, curr) => (curr.percentage > prev.percentage ? curr : prev));
  const lackingElement = data.fiveElements.reduce((prev, curr) => (curr.percentage < prev.percentage ? curr : prev));

  return `### 🌟 原局元神与性格底色
你的日柱天干为**【${dm.nameZh}】**，在古典命理中被称为“${dm.archetypeZh}”。
${dm.essenceZh}
你天生具有深厚的领悟力与稳健的步调，但在面对突如其来的变化时，有时容易陷入过度思虑。

---

### ⚖️ 五行生克与能量调候
原局中，你的五行以**【${dominantElement.elementZh}】**气场最为旺盛（占比约 ${dominantElement.percentage}%），而**【${lackingElement.elementZh}】**能量相对潜藏。
- **生克动态**：五行流通顺畅则诸事从容，旺者宜泄宜化，弱者需培需扶。
- **调候重点**：在日常生活与职业规划中，注重补充【${lackingElement.elementZh}】属性的思维方式与生活习惯。

---

### 💼 事业发展与天赋赛道
${dm.cosmicAdviceZh}
在职业发展上，你适合需要深度专研、战略谋划或独立把控核心环节的领域。尽量避免在流于形式、琐碎内耗的环境中空转，专注打磨你的不可替代性。

---

### 🪙 财富格局与进财指南
财星依附于食伤生发或官杀约束。对于你而言，财富属于**“长线复利型”**，宜守正出奇，重视资产的稳固与技能护城河，避免盲目追逐高杠杆短期投机。

---

### ❤️ 情感姻缘与相处之道
在亲密关系中，你注重精神层面的同频与彼此尊重的界限。学会适度放下防备与理智审视，用柔软的温度给予伴侣安全感，将收获相濡以沫的良缘。

---

### 🧭 后天补运与破局策略
- 💡 **调和建议**：${data.elementRecommendationsZh}
- 🌿 **心性修炼**：顺应自然节律，知止而有定，定而后能安。`;
}

/**
 * 本地六爻神谕解读引擎
 */
export function generateLocalLiuYaoReport(req: LiuYaoAiRequest): string {
  const { question, reading } = req;
  const p = reading.primaryHexagram;
  const t = reading.transformedHexagram;

  return `针对你所叩问之事：**“${question}”**，铜钱六掷，神谕已成。

---

### ䷀ 卦象全景与当下时势
本卦得**【${p.nameZh}】**（${p.upperTrigram}上 / ${p.lowerTrigram}下）。
> *“${p.judgmentZh}”*
大象传云：*“${p.imageZh}”*
当前事情正处于【${p.nameZh}】的节律之中，整体气场反映出内在能量正在蓄势或面临方向上的重新校准。

---

### 🔍 卦爻辞深层映射
${reading.lines.map(l => `- 第 ${l.lineIndex} 爻（${l.isYang ? '阳' : '阴'}${l.isChanging ? ' · 动爻 ⚡' : ''}）：得数 ${l.sum}，${l.isChanging ? '主此阶段发生核心转折' : '气象平稳'}。`).join('\n')}

${t ? `### ⚡ 变卦走向：【${t.nameZh}】
动爻引动气场流转，变卦显化为**【${t.nameZh}】**。
> *“${t.judgmentZh}”*
这预示着经过初期的磨合与动荡后，事情将朝着${t.nameZh}所示的方向演进。` : '六爻安静，纯守本卦，宜稳扎稳打。'}

---

### 🧭 破局行动指南
- 💡 **宜（Do）**：${p.careerAdviceZh} 保持诚笃守正的心态，凡事提前谋篇布局。
- ⚠️ **忌（Don't）**：切忌急功近利、在情绪未定之时强行推进行动。

---

### ✨ 易道天心箴言
> *“天地感而万物化生，圣人感人心而天下和平。顺应大势所趋，吉无不利。”*`;
}

/**
 * 流式输出适配器
 */
export async function* streamLiuYaoReading(req: LiuYaoAiRequest): AsyncGenerator<string, void, unknown> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (apiKey) {
    try {
      const userPrompt = buildLiuYaoPrompt(req);
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${apiKey}&alt=sse`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }]
          })
        }
      );

      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const json = JSON.parse(line.slice(6));
                const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) yield text;
              } catch {
                // ignore
              }
            }
          }
        }
        return;
      }
    } catch (err) {
      console.warn('Gemini 调用受限，平滑切换至内置易经专家引擎:', err);
    }
  }

  // 本地专家引擎流式输出
  const fullText = generateLocalLiuYaoReport(req);
  const parts = fullText.split(/(?<=\n|。|！|？|：|；|\*\*)/);
  for (const p of parts) {
    yield p;
    await new Promise(r => setTimeout(r, 25));
  }
}

/**
 * 八字命理流式输出适配器
 */
export async function* streamBaziReading(data: BaZiCalculationResult, req: BaziAiRequest): AsyncGenerator<string, void, unknown> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (apiKey) {
    try {
      const userPrompt = buildBaziPrompt(data, req);
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${apiKey}&alt=sse`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }]
          })
        }
      );

      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const json = JSON.parse(line.slice(6));
                const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) yield text;
              } catch {
                // ignore
              }
            }
          }
        }
        return;
      }
    } catch (err) {
      console.warn('Gemini 调用受限，平滑切换至内置八字命理引擎:', err);
    }
  }

  // 本地专家引擎流式输出
  const fullText = generateLocalBaziReport(data);
  const parts = fullText.split(/(?<=\n|。|！|？|：|；|\*\*)/);
  for (const p of parts) {
    yield p;
    await new Promise(r => setTimeout(r, 20));
  }
}
