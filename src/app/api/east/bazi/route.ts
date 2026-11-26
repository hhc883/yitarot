import { NextRequest } from 'next/server';
import { calculateBaZi, type BaZiGender, type BaZiYunSect } from '@/lib/metaphysics/bazi';
import { streamBaziReading, type BaziAiRequest } from '@/lib/metaphysics/east-ai';
import { normalizeBaziFocus, normalizeBaziLang } from '@/lib/metaphysics/bazi-evidence';
import { verifyReadingSpend, pointsErrorResponse } from '@/lib/points/server';

function badRequest(message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req: NextRequest) {
  try {
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return badRequest('请求体必须为合法 JSON');
    }

    if (!rawBody || typeof rawBody !== 'object' || Array.isArray(rawBody)) {
      return badRequest('请求参数格式无效');
    }

    const body = rawBody as Record<string, unknown>;

    if (
      typeof body.year !== 'number' ||
      typeof body.month !== 'number' ||
      typeof body.day !== 'number' ||
      !Number.isInteger(body.year) ||
      !Number.isInteger(body.month) ||
      !Number.isInteger(body.day)
    ) {
      return badRequest('出生年月日必须为有效整数');
    }

    const hour = body.hour === undefined ? 12 : body.hour;
    const minute = body.minute === undefined ? 0 : body.minute;

    if (typeof hour !== 'number' || !Number.isInteger(hour)) {
      return badRequest('出生小时必须为 0 至 23 之间的整数');
    }
    if (typeof minute !== 'number' || !Number.isInteger(minute)) {
      return badRequest('出生分钟必须为 0 至 59 之间的整数');
    }

    let gender: BaZiGender | undefined;
    if (body.gender !== undefined && body.gender !== null && body.gender !== '') {
      if (body.gender !== 'male' && body.gender !== 'female') {
        return badRequest('性别参数无效，仅支持 male 或 female');
      }
      gender = body.gender;
    }

    let yunSect: BaZiYunSect | undefined;
    if (body.yunSect !== undefined && body.yunSect !== null) {
      if (body.yunSect !== 1 && body.yunSect !== 2) {
        return badRequest('起运流派参数无效，仅支持 1 或 2');
      }
      yunSect = body.yunSect;
    }

    let baziData;
    try {
      baziData = calculateBaZi(body.year, body.month, body.day, hour, minute, {
        gender,
        yunSect,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '出生日期时间参数无效';
      return badRequest(msg);
    }

    // 积分校验：确认本次测算已完成扣分（服务端二次防线，不改动计费逻辑）
    const spend = await verifyReadingSpend(body.points_ref);
    if (!spend.ok) return pointsErrorResponse(spend.status);

    const normalizedReq: BaziAiRequest = {
      year: baziData.birthSolar.year,
      month: baziData.birthSolar.month,
      day: baziData.birthSolar.day,
      hour: baziData.birthSolar.hour,
      minute: baziData.birthSolar.minute,
      gender,
      yunSect,
      focusArea: normalizeBaziFocus(body.focusArea),
      lang: normalizeBaziLang(body.lang),
    };

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamBaziReading(baziData, normalizedReq)) {
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
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : '服务器内部错误';
    return new Response(JSON.stringify({ error: errMsg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
