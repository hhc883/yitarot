import { DrawnCard } from './deck';
import { TarotReader } from './readers';
import { TarotSpread } from './spreads';

export interface InterpretationRequest {
  question: string;
  category: string;
  spread: TarotSpread;
  reader: TarotReader;
  drawnCards: DrawnCard[];
  followUpHistory?: { role: 'user' | 'assistant'; content: string }[];
}

/**
 * 构造提供给大模型的 System Prompt
 */
export function buildTarotSystemPrompt(reader: TarotReader): string {
  return `你是专业的 AI 塔罗占卜师与心灵导师。
${reader.systemPromptAddon}

【核心解读原则】：
1. 塔罗是潜意识的投影与共时性镜像，不是宿命论的判决；未来是流动的，关键在于求问者的觉察与选择。
2. 严格结合求问者提出的具体问题、所选牌阵的各个站位含义、以及抽出的具体卡牌（包括其正位/逆位象征）进行深度推演。
3. 结构严谨美观，排版富有呼吸感与文艺美感。请使用清晰的 Markdown 标题与要点输出。

【必须包含的结构板块】：
# 🌌 牌阵能量全景
（用2-3段话概括牌阵中风水火土元素的分布、整体能量流动方向与当下氛围）

# 🃏 逐张牌面透视
（按牌阵站位逐一分析：列出站位名称、牌名与正/逆位、牌面核心符号、它如何精准投射求问者的当下困扰）

# 🔮 潜意识盲区与核心症结
（一针见血指出求问者可能未曾察觉的情绪根源、思维限制或外部隐藏变量）

# 🧭 破局指引与行动清单
- 💡 **应当做（Do）**：具体而微的建议
- ⚠️ **避坑戒（Don't）**：需要警惕的心态或盲动

# ✨ 命运神谕结语
（用一句充满能量、令人释怀的箴言作为收尾）`;
}

/**
 * 本地智能塔罗合成引擎（当没有配置 API Key 或断网时提供同等水准的专业解读）
 */
export function generateLocalTarotReading(req: InterpretationRequest): string {
  const { question, reader, spread, drawnCards, category } = req;

  const greeting = reader.id === 'luna'
    ? `亲爱的朋友，将手轻轻放在心口，深呼吸三次。你所问的“${question}”，牌面已然为你映照出最真实的能量镜像。`
    : reader.id === 'sophia'
    ? `针对你的核心关切：“${question}”，通过【${spread.nameZh}】展开的${drawnCards.length}张牌已将局面各维度因果清晰锁定。`
    : `“${question}”——水流终归入海，风起自有来处。让我们一同看看这片塔罗林海呈现给你的自然之像。`;

  const cardsBreakdown = drawnCards.map(c => {
    const meaning = c.isReversed ? c.card.reversedMeaning : c.card.uprightMeaning;
    const catMeaning = category === 'love' ? c.card.loveMeaning : c.card.careerMeaning;
    return `### 📍 ${c.positionName} · ${c.card.nameZh}（${c.isReversed ? '逆位 🔄' : '正位 ✨'}）
- **牌面意象**：${c.card.symbolism}
- **站位解读**：${c.positionDesc} 在这里，${c.card.nameZh}的${c.isReversed ? '逆位' : '正位'}表明：${meaning}
- **针对关切**：${catMeaning}
- **当下启示**：${c.card.advice}`;
  }).join('\n\n');

  const doAdvice = drawnCards[0].isReversed ? drawnCards[0].card.reversedKeywords[0] : drawnCards[0].card.uprightKeywords[0];
  const dontAdvice = drawnCards[drawnCards.length - 1].isReversed ? '急于求成或执着单一路径' : '封闭心门拒绝接受外界真实反馈';

  return `${greeting}

---

## 🌌 牌阵能量全景
在【${spread.nameZh}】中，${drawnCards.map(c => c.card.nameZh).join(' 与 ')}共同构筑了一个生动的能量场。
牌面展现出的核心基调是**“觉察与重塑”**。你目前所感受到的困惑，并非死胡同，而是一个重要的认知转折点。外部环境正促使你放下某些习惯性的防御机制，向内看清自己真正想要抵达的地方。

---

## 🃏 逐张牌面透视
${cardsBreakdown}

---

## 🔮 潜意识盲区与核心症结
牌阵深刻揭示了你内心深处的纠结根源：**你往往在渴望掌控结果的同时，又在潜意识里畏惧随之而来的变化**。
你或许习惯了用理智过度推演所有的可能性，从而忽略了身体与直觉发出的最真实的警示信号。牌面提醒你：**接纳不确定性，正是力量真正的源头。**

---

## 🧭 破局指引与行动清单
- 💡 **应行之事（Do）**：
  1. 秉持【${doAdvice}】的心态，允许事情按照其自然的节律展开，保持坦诚沟通。
  2. 给自己设定一个至少 24 小时的“冷静观察期”，避免在情绪波动时做出不可逆的冲动决定。
  3. 梳理你手头可控的现实资源，把大目标切碎为今天即可执行的小步骤。
- ⚠️ **避坑之戒（Don't）**：
  1. 切忌【${dontAdvice}】，不要把别人的评价当做衡量自我价值的唯一标尺。
  2. 警惕“如果当初…”式的内耗复盘，过去的事情已经完成了它的启迪使命。

---

## ✨ 命运神谕结语
> *“${reader.id === 'luna' ? '云层遮不住月亮的光华，无论黑夜多长，你内心深处的温柔与勇气自会为你照亮前路。' : reader.id === 'sophia' ? '命运的天平从不偏袒犹豫之人；当你做好了最清晰的权衡，世界自会为你让出一条大道。' : '如枯木逢春，如细雨入泥。顺应天地生命的节奏，最好的安排早已在不远处等待。'}”*`;
}

/**
 * 流式输出适配器（生成逐字逐块流式文本）
 */
export async function* streamTarotReading(req: InterpretationRequest): AsyncGenerator<string, void, unknown> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (apiKey) {
    try {
      const systemPrompt = buildTarotSystemPrompt(req.reader);
      const userPrompt = `
求问者问题：${req.question}
求问类别：${req.category}
所用牌阵：${req.spread.nameZh}（共 ${req.drawnCards.length} 张）
牌阵站位与抽出卡牌详情：
${req.drawnCards.map((c, i) => `站位 ${i + 1}【${c.positionName} - ${c.positionDesc}】：${c.card.nameZh}（${c.isReversed ? '逆位' : '正位'}），关键词：${c.isReversed ? c.card.reversedKeywords.join(',') : c.card.uprightKeywords.join(',')}`).join('\n')}

请作为塔罗师为求问者做出完整且富有温度的深度解读。`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${apiKey}&alt=sse`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
            ]
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
      console.warn('Gemini API 调用受限，平滑回退至内置高精塔罗专家引擎:', err);
    }
  }

  // 本地高精合成引擎模拟流式打字效果
  const fullText = generateLocalTarotReading(req);
  const words = fullText.split(/(?<=\n|。|！|？|：|；|\*\*)/);
  for (const part of words) {
    yield part;
    await new Promise(r => setTimeout(r, 30));
  }
}
