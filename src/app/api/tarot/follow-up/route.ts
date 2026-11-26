import { NextRequest } from 'next/server';
import { streamTarotFollowUp } from '@/lib/tarot/ai-interpreter';
import { normalizeTarotFollowUpRequest, TarotValidationError } from '@/lib/tarot/normalize';

export async function POST(req: NextRequest) {
  try {
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: '请求体 JSON 格式无效' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let normalized;
    try {
      normalized = normalizeTarotFollowUpRequest(rawBody);
    } catch (err: unknown) {
      const msg =
        err instanceof TarotValidationError ? err.message : '追问参数无效';
      return new Response(JSON.stringify({ error: msg }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamTarotFollowUp(normalized)) {
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
