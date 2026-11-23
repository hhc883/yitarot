import { GoogleGenAI } from '@google/genai';

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface StreamLLMOptions {
  systemInstruction?: string;
  messages: LLMMessage[];
  temperature?: number;
  /** 可选覆盖使用的模型提供商: 'deepseek' | 'gemini' | 'auto' */
  provider?: 'deepseek' | 'gemini' | 'auto';
  /** 上下文预算（字符）。超限直接抛错，不静默截断 */
  maxContextChars?: number;
}

/**
 * 统一多大模型流式适配器（统一封装 DeepSeek 与 Google Gemini）
 * - 优先走 DeepSeek（中文国学功底深厚、成本断崖式降低）
 * - 支持 Gemini 官方 SDK 自动热切换与故障逃生（Failover）
 */
export async function* streamLLM(options: StreamLLMOptions): AsyncGenerator<string, void, unknown> {
  if (options.maxContextChars) {
    const total = (options.systemInstruction?.length ?? 0) +
      options.messages.reduce((n, m) => n + m.content.length, 0);
    if (total > options.maxContextChars) {
      throw new Error(`上下文超预算：${total} > ${options.maxContextChars}`);
    }
  }

  const { systemInstruction, messages, temperature = 0.7, provider = 'auto' } = options;

  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const configuredProvider = process.env.METAPHYSICS_LLM_PROVIDER || 'auto';

  const shouldTryDeepSeek =
    (provider === 'deepseek' || configuredProvider === 'deepseek' || (provider === 'auto' && Boolean(deepseekKey))) &&
    Boolean(deepseekKey);

  // 1. 尝试 DeepSeek 通道
  if (shouldTryDeepSeek) {
    try {
      yield* streamDeepSeek({
        apiKey: deepseekKey!,
        systemInstruction,
        messages,
        temperature
      });
      return;
    } catch (err) {
      console.warn('DeepSeek 调用异常，准备平滑切换备选通道:', err);
    }
  }

  // 2. 尝试 Gemini 通道
  if (geminiKey) {
    try {
      yield* streamGemini({
        apiKey: geminiKey,
        systemInstruction,
        messages
      });
      return;
    } catch (err) {
      console.warn('Gemini 4 调用异常:', err);
    }
  }

  throw new Error('未配置有效的大模型 API 密钥（DEEPSEEK_API_KEY 或 GEMINI_API_KEY），或所有通道调用受限');
}

/**
 * DeepSeek 官方 API 流式请求（兼容 OpenAI 协议）
 */
async function* streamDeepSeek(opts: {
  apiKey: string;
  systemInstruction?: string;
  messages: LLMMessage[];
  temperature?: number;
}): AsyncGenerator<string, void, unknown> {
  const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
  const url = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/chat/completions';

  const apiMessages: Array<{ role: string; content: string }> = [];
  if (opts.systemInstruction) {
    apiMessages.push({ role: 'system', content: opts.systemInstruction });
  }
  for (const m of opts.messages) {
    apiMessages.push({ role: m.role, content: m.content });
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${opts.apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: apiMessages,
      temperature: opts.temperature ?? 0.7,
      stream: true
    })
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(`DeepSeek API 请求失败 [HTTP ${res.status}]: ${errorText}`);
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
        // 忽略单个 chunk 的解析异常
      }
    }
  }
}

/**
 * Google Gemini 官方 API 流式请求
 */
async function* streamGemini(opts: {
  apiKey: string;
  systemInstruction?: string;
  messages: LLMMessage[];
}): AsyncGenerator<string, void, unknown> {
  const ai = new GoogleGenAI({ apiKey: opts.apiKey });

  // 拼接多轮 transcript，保留求问者与易学师对话历史
  const transcript = opts.messages
    .map(m => `${m.role === 'user' ? '求问者' : m.role === 'assistant' ? '易学师' : '说明'}: ${m.content}`)
    .join('\n\n');
  if (!transcript.trim()) throw new Error('Gemini 通道输入为空');

  const stream = await ai.interactions.create({
    model: 'gemini-4-hydrogen',
    system_instruction: opts.systemInstruction,
    input: transcript,
    stream: true
  });

  for await (const event of stream) {
    if (event.event_type === 'step.delta' && event.delta?.type === 'text') {
      yield event.delta.text ?? '';
    }
  }
}
