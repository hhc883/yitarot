import { NextRequest } from 'next/server';
import { streamLiuYaoReading, LiuYaoAiRequest } from '@/lib/metaphysics/east-ai';
import { normalizeIChingReading } from '@/lib/metaphysics/iching';
import { verifyReadingSpend, pointsErrorResponse } from '@/lib/points/server';
import { createSupabaseServerClient, getSupabaseUser } from '@/lib/supabase/server';
import { auditLiuYaoReport } from '@/lib/kb/guard';
import type { KnowledgeBundle } from '@/lib/kb/types';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LiuYaoAiRequest;

    if (!body.question || !body.reading) {
      return new Response(JSON.stringify({ error: '缺少问题或卦象数据' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 积分校验：确认本次测算已完成扣分（服务端二次防线）
    const spend = await verifyReadingSpend(body.points_ref);
    if (!spend.ok) return pointsErrorResponse(spend.status);

    // 以爻线查表结果为准：客户端传来的卦名 / 卦符 / 卦辞一律丢弃，按 6 条爻线重建
    let request: LiuYaoAiRequest;
    try {
      request = { ...body, reading: normalizeIChingReading(body.reading) };
    } catch {
      return new Response(JSON.stringify({ error: '卦象爻线数据无效' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const encoder = new TextEncoder();
    let fullReportText = '';

    const stream = new ReadableStream({
      async start(controller) {
        try {
          let bundle: KnowledgeBundle | undefined;

          for await (const chunk of streamLiuYaoReading(request, {
            onKnowledge: (b) => {
              bundle = b;
            }
          })) {
            fullReportText += chunk;
            const data = JSON.stringify({ text: chunk });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }

          // 流结束后审计
          let auditResult: unknown = null;
          if (bundle) {
            const audit = auditLiuYaoReport(fullReportText, {
              allowedRefs: bundle.hits.map(h => h.ref),
              reading: request.reading,
              lang: request.lang === 'en' ? 'en' : 'zh'
            });
            if (!audit.ok) {
              console.warn('[liuyao-guard]', audit.issues);
            }
            auditResult = audit;
          }

          // 自动将 AI 解卦与卦象快照持久化到用户的个人账号（Supabase liuyao_sessions）
          try {
            const user = await getSupabaseUser();
            if (user) {
              const supabase = await createSupabaseServerClient();
              const { data: sessionData, error: sessionErr } = await supabase
                .from('liuyao_sessions')
                .insert({
                  user_id: user.id,
                  question: request.question,
                  reading_snapshot: {
                    ...request.reading,
                    ai_report: fullReportText,
                    audit: auditResult
                  }
                })
                .select('id')
                .maybeSingle();

              if (!sessionErr && sessionData?.id) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ session_id: sessionData.id })}\n\n`)
                );
              }
            }
          } catch (saveErr) {
            console.warn('Auto-save liuyao_session to Supabase warning:', saveErr);
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : '解卦过程异常';
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
