import { NextRequest } from 'next/server';
import { calculateBaZi } from '@/lib/metaphysics/bazi';
import { streamBaziReading, BaziAiRequest } from '@/lib/metaphysics/fatemaster-ai';
import { verifyReadingSpend, pointsErrorResponse } from '@/lib/points/server';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as BaziAiRequest;

    if (!body.year || !body.month || !body.day) {
      return new Response(JSON.stringify({ error: '缺少出生年月日数据' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 积分校验：确认本次测算已完成扣分（服务端二次防线）
    const spend = await verifyReadingSpend(body.points_ref);
    if (!spend.ok) return pointsErrorResponse(spend.status);

    const baziData = calculateBaZi(
      body.year,
      body.month,
      body.day,
      body.hour ?? 12,
      body.minute ?? 0
    );

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamBaziReading(baziData, body)) {
            const data = JSON.stringify({ text: chunk });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : '推演过程异常';
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
