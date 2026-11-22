import { NextRequest } from 'next/server';
import { streamVisionLiuYaoReading } from '@/lib/metaphysics/vision-liuyao';
import { verifyReadingSpend, pointsErrorResponse } from '@/lib/points/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, question, lang = 'zh', points_ref } = body;

    if (!image || typeof image !== 'string') {
      return new Response(JSON.stringify({ error: '请上传有效的卦象截图或排盘图片' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 积分校验：若启用积分网关，校验本次测算
    if (points_ref) {
      const spend = await verifyReadingSpend(points_ref);
      if (!spend.ok) return pointsErrorResponse(spend.status);
    }

    // 解析 Data URL: data:image/png;base64,xxxx
    let mimeType = 'image/png';
    let base64Data = image;

    const dataUrlMatch = image.match(/^data:([^;]+);base64,(.+)$/);
    if (dataUrlMatch) {
      mimeType = dataUrlMatch[1];
      base64Data = dataUrlMatch[2];
    }

    // 限制单次图片 Base64 长度（~8MB limit）
    if (base64Data.length > 12 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: '图片体积过大，请上传小于 8MB 的图片' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamVisionLiuYaoReading({
            imageBase64: base64Data,
            mimeType,
            question,
            lang: lang === 'en' ? 'en' : 'zh'
          })) {
            const data = JSON.stringify({ text: chunk });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : '识图解卦过程异常';
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
