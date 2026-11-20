import { GoogleGenAI } from '@google/genai';
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
  lang?: string;
  /** 积分扣分幂等键（/api/readings/consume 返回） */
  points_ref?: string;
}

export interface TarotFollowUpRequest {
  question: string;
  category?: string;
  reader: TarotReader;
  drawnCards: DrawnCard[];
  initialInterpretation: string;
  followUpHistory: { role: 'user' | 'assistant'; content: string }[];
  followUpQuestion: string;
  lang?: string;
}

/**
 * 构造提供给大模型的 System Prompt
 */
export function buildTarotSystemPrompt(reader: TarotReader, lang: string = 'zh'): string {
  if (lang === 'en') {
    return `You are a revered AI Tarot Master and holistic psychological counselor.
${reader.systemPromptAddon}

[Core Interpretation Principles]:
1. Tarot is a mirror of subconscious synchronicity, not a fatalistic decree. The future flows; personal agency and self-awareness guide the path.
2. Ground your reading strictly in the querent's question, the positions of the spread, and the exact cards drawn (upright/reversed and their symbolic elements).
3. Deliver a poetic, structured, and compassionate reading in GitHub-flavored Markdown.

[Required Structural Sections]:
# 🌌 Energetic Overview of the Spread
(2-3 paragraphs analyzing the elemental balance, overarching atmosphere, and dynamic flow)

# 🃏 Card-by-Card Perspective
(Analyze each card according to its position: position name, card name with upright/reversed indicator, core symbols, and resonance with the inquiry)

# 🔮 Subconscious Blindspots & Core Lessons
(Directly reveal emotional undercurrents, limiting assumptions, or hidden dynamics)

# 🧭 Action Roadmap
- 💡 **DO**: Practical, empowering steps forward
- ⚠️ **DON'T**: Mental pitfalls or hasty reactions to avoid

# ✨ Oracle Blessing
(Conclude with a memorable, uplifting aphorism)`;
  }

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
  const { question, reader, spread, drawnCards, category, lang = 'zh' } = req;
  const isEn = lang === 'en';

  if (isEn) {
    const greeting = reader.id === 'luna'
      ? `Dear friend, place your hands gently upon your heart and take three deep breaths. Regarding "${question}", the cards have laid bare the truest energetic reflection of your soul.`
      : reader.id === 'sophia'
      ? `Regarding your central inquiry: "${question}", the ${drawnCards.length} cards revealed through the [${spread.nameEn}] have mapped the underlying causes with strategic clarity.`
      : `"${question}"—rivers inevitably return to the ocean, and wind rises from stillness. Let us explore the natural currents mirrored in this tarot forest.`;

    const cardsBreakdown = drawnCards.map(c => {
      const cardName = c.card.nameEn || c.card.nameZh;
      const meaning = c.isReversed ? c.card.reversedMeaning : c.card.uprightMeaning;
      return `### 📍 ${c.positionName || 'Card Position'} · ${cardName} (${c.isReversed ? 'Reversed 🔄' : 'Upright ✨'})
- **Symbolism**: ${c.card.symbolism}
- **Placement Insight**: ${c.positionDesc || ''} Here, ${cardName} indicates: ${meaning}
- **Empowering Advice**: ${c.card.advice}`;
    }).join('\n\n');

    return `${greeting}

---

## 🌌 Energetic Overview of the Spread
Within the [${spread.nameEn}], ${drawnCards.map(c => c.card.nameEn || c.card.nameZh).join(' and ')} assemble an evocative energetic field.
The prevailing resonance is **"Awareness and Realignment"**. What feels like an impasse is in fact a vital cognitive pivot. External circumstances invite you to release habitual defenses and clarify what you genuinely seek to manifest.

---

## 🃏 Card-by-Card Perspective
${cardsBreakdown}

---

## 🔮 Subconscious Blindspots & Core Lessons
The spread highlights the root of inner friction: **craving control over final outcomes while secretly fearing the disruption that transformation brings**.
Accepting uncertainty is the very gateway to lasting clarity.

---

## 🧭 Action Roadmap
- 💡 **DO**:
  1. Maintain an open mind and communicate with gentle authenticity.
  2. Allow at least a 24-hour quiet reflection window before making irreversible choices.
  3. Ground large ambitions into deliberate, bite-sized actions you can take today.
- ⚠️ **DON'T**:
  1. Do not use external approval as the sole validator of your intrinsic worth.
  2. Guard against rumination on past paths not taken; they have fulfilled their teaching purpose.

---

## ✨ Oracle Blessing
> *“${reader.id === 'luna' ? 'Clouds cannot dim the radiance of the moon. However long the night, your inner gentleness and courage will light the way.' : reader.id === 'sophia' ? 'The scales of destiny never lean toward hesitation. When your boundaries are clear, the world makes way.' : 'Like spring rain revitalizing dormant roots, trust the natural rhythm of unfolding; all is arriving in its proper season.'}”*`;
  }

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
 * 流式输出适配器（调用官方 @google/genai SDK，采用 gemini-4-hydrogen 模型，支持优雅本地降级）
 */
export async function* streamTarotReading(req: InterpretationRequest): AsyncGenerator<string, void, unknown> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const isEn = req.lang === 'en';

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemPrompt = buildTarotSystemPrompt(req.reader, req.lang);
      const userPrompt = isEn
        ? `Querent Inquiry: ${req.question}
Category: ${req.category}
Spread: ${req.spread.nameEn} (${req.drawnCards.length} cards)
Drawn Cards Details:
${req.drawnCards.map((c, i) => `Position ${i + 1} [${c.positionName} - ${c.positionDesc}]: ${c.card.nameEn || c.card.nameZh} (${c.isReversed ? 'Reversed' : 'Upright'}), Keywords: ${(c.isReversed ? c.card.reversedKeywords : c.card.uprightKeywords).join(', ')}`).join('\n')}

Please act as the Tarot reader and craft a profound, empathetic, and structurally comprehensive interpretation in English.`
        : `求问者问题：${req.question}
求问类别：${req.category}
所用牌阵：${req.spread.nameZh}（共 ${req.drawnCards.length} 张）
牌阵站位与抽出卡牌详情：
${req.drawnCards.map((c, i) => `站位 ${i + 1}【${c.positionName} - ${c.positionDesc}】：${c.card.nameZh}（${c.isReversed ? '逆位' : '正位'}），关键词：${c.isReversed ? c.card.reversedKeywords.join(',') : c.card.uprightKeywords.join(',')}`).join('\n')}

请作为塔罗师为求问者做出完整且富有温度的深度解读。`;

      const stream = await ai.interactions.create({
        model: 'gemini-4-hydrogen',
        system_instruction: systemPrompt,
        input: userPrompt,
        stream: true
      });

      for await (const event of stream) {
        if (event.event_type === 'step.delta' && event.delta?.type === 'text') {
          yield event.delta.text ?? '';
        }
      }
      return;
    } catch (err) {
      console.warn('Gemini 4 Hydrogen 调用受限，平滑回退至内置高精塔罗专家引擎:', err);
    }
  }

  // 本地高精合成引擎模拟流式打字效果
  const fullText = generateLocalTarotReading(req);
  const words = fullText.split(/(?<=\n|。|！|？|：|；|\*\*)/);
  for (const part of words) {
    yield part;
    await new Promise(r => setTimeout(r, 25));
  }
}

/**
 * 塔罗多轮深解追问本地合成引擎（离线/免 Key 降级）
 */
export function generateLocalTarotFollowUp(req: TarotFollowUpRequest): string {
  const { reader, drawnCards, followUpQuestion, lang = 'zh' } = req;
  const isEn = lang === 'en';
  const dominantCard = drawnCards[0]?.card;
  const cardName = isEn ? (dominantCard?.nameEn || dominantCard?.nameZh || 'the cards') : (dominantCard?.nameZh || '核心牌');

  if (isEn) {
    if (reader.id === 'luna') {
      return `Regarding your follow-up inquiry: **"${followUpQuestion}"**, the vibration of **【${cardName}】** gently speaks to your subconscious need for self-trust.

1. **Inner Resonance**: Beneath the surface dilemma, this moment asks you not to rush into forced conclusions. Emotional clarity requires breathing space.
2. **Card Wisdom**: ${dominantCard?.advice || 'Honor your inner sanctuary.'}
3. **Gentle Action**: Before taking external action, ask yourself: *"Does this choice nourish my peace or fuel my anxiety?"* Trust the quiet answer that arises.`;
    } else if (reader.id === 'sophia') {
      return `Addressing your inquiry: **"${followUpQuestion}"**, let us distill the core variables reflected in **【${cardName}】**.

1. **Strategic Pivot**: The key bottleneck is separating what is under your direct control from what is external noise.
2. **Card Directive**: ${dominantCard?.advice || 'Delineate clear non-negotiable boundaries.'}
3. **Next Step**: Define your primary baseline criteria first. Once your non-negotiables are documented, the tactical direction will become unmistakably evident.`;
    } else {
      return `Regarding "${followUpQuestion}", like mist flowing through the mountain forest, **【${cardName}】** counsels walking with natural timing rather than forcing immediate breakthroughs.

1. **Flow of Timing**: Situations move through seasons of consolidation and growth. Forcing a seed to sprout before its season brings friction.
2. **Oracle Guidance**: ${dominantCard?.advice || 'Align with the organic flow of events.'}
3. **Patience & Stillness**: Allow three to seven days for latent factors to crystallize. The ideal opening will present itself naturally.`;
    }
  }

  if (reader.id === 'luna') {
    return `关于你深入探讨的：“${followUpQuestion}”，牌阵中的【${cardName}】再次泛起温柔的涟漪：

1. **潜意识回应**：你之所以产生这个追问，说明你内心深处渴望得到更加明确的安全感与笃定。塔罗牌在此刻提醒你：答案并不在外界的瞬息万变里，而在你对自己直觉的信任中。
2. **牌面印证**：${dominantCard?.advice || '给心灵留出沉淀的余白。'}
3. **温煦建议**：今晚不妨放下紧绷的思维分析，问问自己的身体：“怎样的决定能让我感到踏实与安宁？”你的直觉早就已经有了答案。`;
  } else if (reader.id === 'sophia') {
    return `针对你所追问的核心事项：“${followUpQuestion}”，从理智与博弈的视角对照【${cardName}】：

1. **矛盾关键**：当下的困扰本质在于权衡的优先级不够清晰。你可能在试图兼顾两个互相冲突的目标。
2. **牌面决断**：${dominantCard?.advice || '明确底线与核心诉求。'}
3. **行动策略**：先做减法，列出你在此事中最不可妥协的一条原则。只要守住核心利益，其余旁枝末节自然会迎刃而解。`;
  } else {
    return `你所叩问的“${followUpQuestion}”，正如山间迷雾遇风而散，【${cardName}】所示正是顺应天道节律：

1. **时势玄机**：物极必反，否极泰来。当下的滞碍并非终止符，而是机缘未至时的蓄力阶段。
2. **易理启示**：${dominantCard?.advice || '顺应自然流转，静观其变。'}
3. **修心践行**：无需与当下的局面强行角力。静待数日，外部阻力减退之时，顺势而为方能事半功倍。`;
  }
}

/**
 * 塔罗多轮深解追问流式适配器（基于 @google/genai SDK 与 gemini-4-hydrogen）
 */
export async function* streamTarotFollowUp(req: TarotFollowUpRequest): AsyncGenerator<string, void, unknown> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const isEn = req.lang === 'en';

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemPrompt = isEn
        ? `You are the AI Tarot reader and spiritual mentor (${req.reader.name}).
${req.reader.systemPromptAddon}

Original Querent Inquiry: "${req.question}"
Spread used: ${req.drawnCards.map((c, i) => `Pos ${i + 1} (${c.positionName}): ${c.card.nameEn || c.card.nameZh} [${c.isReversed ? 'Reversed' : 'Upright'}]`).join(', ')}
Initial Reading Summary:
${req.initialInterpretation.slice(0, 800)}

Guidelines for Follow-Up Inquiries:
1. Ground your answers deeply in the cards that were drawn and their symbolic synergy.
2. Embody the persona of ${req.reader.name}—speak with personal presence, psychological insight, and practical clarity.
3. Keep the answer structured, thoughtful, and articulate in English Markdown.`
        : `你是专属 AI 塔罗占卜导师（${req.reader.name}）。
${req.reader.systemPromptAddon}

求问者原问题：“${req.question}”
本次抽出牌面：
${req.drawnCards.map((c, i) => `站位 ${i + 1}【${c.positionName}】：${c.card.nameZh}（${c.isReversed ? '逆位' : '正位'}），核心象征：${c.card.symbolism}`).join('\n')}
初始解读概要：
${req.initialInterpretation.slice(0, 800)}

【多轮追问指引】：
1. 解答必须紧密结合本次抽出的牌阵能量，将求问者追问的具体疑惑映射到牌面符号与生活抉择中。
2. 保持【${req.reader.name}】一贯的说话风格与专业素养，给出深刻洞察与具体行动点。
3. 请使用清晰美观的 Markdown 进行分段输出。`;

      const conversationHistoryText = req.followUpHistory.length > 0
        ? req.followUpHistory.map(h => `${h.role === 'user' ? '求问者' : req.reader.name}：${h.content}`).join('\n\n') + '\n\n'
        : '';

      const userPrompt = `${conversationHistoryText}求问者最新追问：“${req.followUpQuestion}”\n\n请作为塔罗师为求问者深入剖析并指引方向。`;

      const stream = await ai.interactions.create({
        model: 'gemini-4-hydrogen',
        system_instruction: systemPrompt,
        input: userPrompt,
        stream: true
      });

      for await (const event of stream) {
        if (event.event_type === 'step.delta' && event.delta?.type === 'text') {
          yield event.delta.text ?? '';
        }
      }
      return;
    } catch (err) {
      console.warn('Gemini 4 Hydrogen 追问调用受限，平滑切换至本地高精导师引擎:', err);
    }
  }

  // 本地高精引擎降级流式输出
  const fullText = generateLocalTarotFollowUp(req);
  const words = fullText.split(/(?<=\n|。|！|？|：|；|\*\*)/);
  for (const part of words) {
    yield part;
    await new Promise(r => setTimeout(r, 20));
  }
}
