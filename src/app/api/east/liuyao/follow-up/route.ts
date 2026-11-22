import { NextRequest } from 'next/server';
import { verifyReadingSpend, pointsErrorResponse } from '@/lib/points/server';
import { normalizeIChingReading, IChingReading } from '@/lib/metaphysics/iching';
import { getActiveLiuYaoSkill } from '@/lib/metaphysics/skills/registry';
import { streamLLM, LLMMessage } from '@/lib/llm/adapter';
import { createSupabaseServerClient, getSupabaseUser } from '@/lib/supabase/server';

interface FollowUpRequest {
  question: string;
  reading: IChingReading;
  previous_messages?: Array<{ role: 'user' | 'assistant'; content: string }>;
  session_id?: string;
  points_ref?: string;
  lang?: 'zh' | 'en';
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as FollowUpRequest;
    const { question, reading: rawReading, previous_messages = [], session_id, points_ref, lang = 'zh' } = body;

    if (!question || !rawReading) {
      return new Response(JSON.stringify({ error: '缺少追问问题或卦象数据' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 1. 积分校验：每次追问需消耗 2 积分（服务端二次校验）
    const spend = await verifyReadingSpend(points_ref);
    if (!spend.ok) return pointsErrorResponse(spend.status);

    // 2. 规范化卦象爻线
    const reading = normalizeIChingReading(rawReading);
    const activeSkill = getActiveLiuYaoSkill();

    const p = reading.primaryHexagram;
    const t = reading.transformedHexagram;
    const n = reading.najia;

    // 3. 构建追问专属上下文与心法
    const hexContext = `【当前排定卦象图谱】
- 本卦：第 ${p.number} 卦 · ${p.nameZh} ${p.symbol}（下${p.lowerTrigram}上${p.upperTrigram}）· ${n?.palace}宫${n?.palaceElement}
- 卦辞：“${p.judgmentZh}”
${t ? `- 变卦：第 ${t.number} 卦 · ${t.nameZh} ${t.symbol}（下${t.lowerTrigram}上${t.upperTrigram}）· 动爻：${reading.changingLineIndices.map(i => `第${i}爻`).join('、')}` : '- 无变爻（六爻安静）'}
${n ? `- 起卦时空：${n.timeInfo.yearGanzhi}年 ${n.timeInfo.monthGanzhi}月 ${n.timeInfo.dayGanzhi}日 ${n.timeInfo.timeGanzhi}时（月建：${n.timeInfo.monthZhi}，日辰：${n.timeInfo.dayZhi}，旬空：${n.timeInfo.xunKong}）
- 世应爻位：世在第 ${n.shiIndex} 爻，应在第 ${n.yingIndex} 爻` : ''}`;

    const followUpRule = activeSkill.followUpInstruction
      ? activeSkill.followUpInstruction
          .replace('{{PRIMARY_HEX}}', p.nameZh)
          .replace('{{TRANSFORMED_HEX}}', t ? t.nameZh : '纯静无变')
      : `【追问答疑宗纲】
你正在针对此卦解答求问者的进一步追问。
1. 严禁更换原卦象数理与卦名，严禁另起新卦；
2. 紧扣原卦之动爻与用神在月日生克下的演进态势，直接犀利切中问题核心；
3. 给出切实的具体时间窗（如应期月日、出空之时）或行动抉择指引。`;

    const langInstruction = lang === 'en' ? '\nPlease respond fluently in English.' : '\n请使用地道典雅的中文易学风格作答。';
    const systemInstruction = `${activeSkill.systemInstruction}\n\n${hexContext}\n\n${followUpRule}${langInstruction}`;

    const llmMessages: LLMMessage[] = [
      ...previous_messages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: question }
    ];

    const encoder = new TextEncoder();
    let fullResponseText = '';

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamLLM({
            systemInstruction,
            messages: llmMessages,
            temperature: 0.7
          })) {
            fullResponseText += chunk;
            const data = JSON.stringify({ text: chunk });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }

          // 追问完成后，若存在 session_id，将问答异步归档保存
          const user = await getSupabaseUser();
          if (user && session_id) {
            try {
              const supabase = await createSupabaseServerClient();
              await supabase.from('liuyao_messages').insert([
                { session_id, user_id: user.id, role: 'user', content: question, points_spent: 2 },
                { session_id, user_id: user.id, role: 'assistant', content: fullResponseText, points_spent: 0 }
              ]);
            } catch (dbErr) {
              console.warn('追问消息持久化失败（不影响客户端结果展示）:', dbErr);
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : '追问解卦异常';
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: errMsg })}\n\n`)
          );
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive'
      }
    });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : '服务器内部错误';
    return new Response(JSON.stringify({ error: errMsg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
