import { GoogleGenAI } from '@google/genai';

export interface VisionLiuYaoRequest {
  imageBase64: string;
  mimeType: string;
  question?: string;
  lang?: 'zh' | 'en';
}

export const VISION_LIUYAO_SYSTEM_PROMPT_ZH = `你是一位精通周易六十四卦、纳甲六爻、梅花易数与现代博弈决策的易学宗师。
你正在接收一张用户上传的“卦象截图”或“起卦排盘照片”（可能来自其他排盘软件、手抄卦单、铜钱照片或草图）。

【核心视觉识别与解卦规范】：
1. **精准识图**：仔细识别图中的六条爻线（自下而上：初爻至上爻）、卦名（如《泽水困》《雷水解》等）、动爻标记（老阳○、老阴×、圈点、红色箭头、变爻提示）、变卦（之卦）、以及图中的干支日建、月令或神煞（若存在）。
2. **拒绝盲猜，实事求是**：若图片过于模糊、缺失关键爻位或完全非卦象，请礼貌明确指出缺失部分，并指导用户如何重新截图或拍照。
3. **结构化深度解卦**：结合用户提出的具体问题（若未提供问题，则按综合运势与时机决策展开），输出辞章典雅、逻辑严密、赋能行动的专业解读。

【必须遵循的输出结构】：
# 📷 截图卦象识别与排盘核验
- **识别本卦**：[卦名] [卦象符号]（下X卦上X卦）
- **动爻爻位**：[如：九二动爻、六五动爻，或无动爻]
- **显化变卦**：[变卦卦名与卦象，若无动爻则说明体用纯守本卦]
- **截图信息摘录**：[如日辰干支、纳甲装卦信息，若无则注明从纯卦理推演]

# 🌌 本卦时势与核心格局
(结合卦名、卦辞与大象传，深刻剖析求问者当前面临的整体客观环境、能量阻力或机遇节点)

# ⚡ 动爻转折与变卦走向
(详细剖析动爻所处的人生阶段隐喻、阴阳转化因果，以及变卦所指引的最终演化方向)

# 🧭 破局行动指南
- 💡 **宜（Do）**：[具体、务实、可落地的战略行动举措]
- ⚠️ **忌（Don't）**：[应坚决避免的心智误区、侥幸心理或冲动行为]

# ✨ 易道天心箴言
(提炼一句直击心灵的哲理格言，帮助求问者重获内心笃定与主观能动性)`;

export const VISION_LIUYAO_SYSTEM_PROMPT_EN = `You are a revered grandmaster of the classical I Ching (Book of Changes), Liu Yao divination, Mei Hua Yi Shu, and modern strategic decision-making.
You are inspecting a user-uploaded image containing a hexagram screenshot or natal divination chart.

[Core Recognition & Oracle Principles]:
1. **Accurate Visual Extraction**: Carefully recognize all six lines (from bottom line 1 to top line 6), hexagram names, moving line markers (circles, crosses, arrows), transformed hexagram (Zhi Gua), and any calendar pillars (Day/Month stems) present in the image.
2. **Empowerment Over Fatalism**: Deliver a profound, empowering strategic reading grounded in classical principles. If the image is illegible or not a divination chart, politely ask for a clearer image.

[Mandatory Structural Output]:
# 📷 Image Hexagram Recognition
- **Primary Hexagram**: [King Wen Number, Name, Symbol, Trigrams]
- **Moving Lines**: [Specific lines changing, or none]
- **Transformed Hexagram**: [Resulting Hexagram, or purely static]

# 🌌 Primary Hexagram Timing & Atmosphere
(In-depth analysis of the current phase, energetic friction, and strategic climate)

# ⚡ Moving Lines & Evolutionary Arc
(Causal dynamics of the moving lines and how they bridge into the transformed hexagram)

# 🧭 Strategic Action Principles
- 💡 **DO**: [Empowered, proactive steps]
- ⚠️ **DON'T**: [Pitfalls and hasty reactions to avoid]

# ✨ I Ching Axiom
(An uplifting aphorism to cultivate composure and clarity)`;

async function* streamDeepSeekVision(opts: {
  apiKey: string;
  systemInstruction: string;
  promptText: string;
  imageBase64: string;
  mimeType: string;
}): AsyncGenerator<string, void, unknown> {
  const model = process.env.DEEPSEEK_VISION_MODEL || 'deepseek-flash';
  const url = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/chat/completions';
  const mime = opts.mimeType || 'image/png';
  const dataUrl = `data:${mime};base64,${opts.imageBase64}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${opts.apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: opts.systemInstruction },
        {
          role: 'user',
          content: [
            { type: 'text', text: opts.promptText },
            { type: 'image_url', image_url: { url: dataUrl } }
          ]
        }
      ],
      temperature: 0.5,
      stream: true
    })
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(`DeepSeek Vision API 请求失败 [HTTP ${res.status}]: ${errorText}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error('DeepSeek 流式响应不可用');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data: ')) continue;
      const dataStr = trimmed.slice(6).trim();
      if (dataStr === '[DONE]') return;

      try {
        const parsed = JSON.parse(dataStr);
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) {
          yield delta;
        }
      } catch {
        // ignore chunk parsing error
      }
    }
  }
}

export async function* streamVisionLiuYaoReading(
  req: VisionLiuYaoRequest
): AsyncGenerator<string, void, unknown> {
  const isEn = req.lang === 'en';
  const systemInstruction = isEn ? VISION_LIUYAO_SYSTEM_PROMPT_EN : VISION_LIUYAO_SYSTEM_PROMPT_ZH;

  const defaultQuestion = isEn
    ? 'Please analyze this hexagram image, verify the lines, and provide comprehensive strategic counsel.'
    : '请仔细识别这张截图中的卦象、爻线与动爻，结合求问者当下的运势与决策关切进行全面解卦。';

  const userQuestion = req.question && req.question.trim().length > 0 ? req.question.trim() : defaultQuestion;

  const promptText = isEn
    ? `Querent Inquiry / Focus: "${userQuestion}"\n\nPlease examine the attached image, extract all hexagram lines, and produce the comprehensive I Ching oracle according to the mandatory structure.`
    : `求问者关切之事：“${userQuestion}”\n\n请仔细观察所附截图中展示的卦象、爻位、动爻与排盘数据，严格按照规范的格式输出详尽严谨的六爻解卦报告。`;

  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!deepseekKey && !geminiKey) {
    yield isEn
      ? 'Vision reading requires an active API key (DEEPSEEK_API_KEY or GEMINI_API_KEY). Please verify your system configuration.'
      : '视觉识卦功能需配置有效的 API 密钥（DEEPSEEK_API_KEY 或 GEMINI_API_KEY）。请检查系统环境变量配置。';
    return;
  }

  // 1. 优先尝试 DeepSeek 视觉模型 (deepseek-flash)
  if (deepseekKey) {
    try {
      yield* streamDeepSeekVision({
        apiKey: deepseekKey,
        systemInstruction,
        promptText,
        imageBase64: req.imageBase64,
        mimeType: req.mimeType || 'image/png'
      });
      return;
    } catch (err) {
      console.warn('DeepSeek 视觉识卦调用受限，平滑切换备选通道:', err);
    }
  }

  // 2. 备选通道：Google Gemini
  if (geminiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      const stream = await ai.interactions.create({
        model: 'gemini-4-hydrogen',
        system_instruction: systemInstruction,
        input: [
          {
            type: 'image',
            mime_type: req.mimeType || 'image/png',
            data: req.imageBase64
          },
          {
            type: 'text',
            text: promptText
          }
        ],
        stream: true
      });

      for await (const event of stream) {
        if (event.event_type === 'step.delta' && event.delta?.type === 'text') {
          yield event.delta.text ?? '';
        }
      }
      return;
    } catch (err: unknown) {
      console.error('Gemini 视觉识卦异常:', err);
    }
  }

  yield isEn
    ? '\n\n[Vision Interpretation Notice]: Encountered a temporary processing error. Please ensure the screenshot clearly displays the six hexagram lines.'
    : '\n\n【视觉识卦提示】：视觉大模型处理图片时遇到异常。请确认截图清晰包含六爻卦象信息后重试。';
}
