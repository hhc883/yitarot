import { NextRequest } from 'next/server';
import { streamTarotFollowUp, TarotFollowUpRequest } from '@/lib/tarot/ai-interpreter';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TarotFollowUpRequest;

    if (!body.followUpQuestion?.trim()) {
      return new Response(JSON.stringify({ error: '追问内容不能为空' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!body.drawnCards || body.drawnCards.length === 0) {
      return new Response(JSON.stringify({ error: '缺少卡牌上下文' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamTarotFollowUp(body)) {
            const data = JSON.stringify({ text: chunk });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : '追问解答过程异常';
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
