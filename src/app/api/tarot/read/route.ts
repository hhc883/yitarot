import { NextRequest } from 'next/server';
import { streamTarotReading, InterpretationRequest } from '@/lib/tarot/ai-interpreter';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as InterpretationRequest;

    if (!body.question || !body.drawnCards || body.drawnCards.length === 0) {
      return new Response(JSON.stringify({ error: '缺少问题或卡牌数据' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamTarotReading(body)) {
            const data = JSON.stringify({ text: chunk });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (err: any) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: err.message || '解读过程异常' })}\n\n`)
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
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || '服务器内部错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
