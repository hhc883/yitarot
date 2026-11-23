import { NextRequest } from 'next/server';
import { verifyReadingSpend, pointsErrorResponse } from '@/lib/points/server';
import { normalizeIChingReading, IChingReading } from '@/lib/metaphysics/iching';
import { getActiveLiuYaoSkill } from '@/lib/metaphysics/skills/registry';
import { streamLLM } from '@/lib/llm/adapter';
import { createSupabaseServerClient, getSupabaseUser } from '@/lib/supabase/server';
import { retrieveKnowledge } from '@/lib/kb/retriever';
import { buildKnowledgeBlock, buildHexSnapshot, buildLiuYaoSystem } from '@/lib/kb/context-builder';
import { buildFollowUpMessages, ConversationTurn } from '@/lib/llm/conversation';
import { auditLiuYaoReport } from '@/lib/kb/guard';

interface FollowUpRequest {
  question: string;
  reading: IChingReading;
  previous_messages?: Array<{ role: 'user' | 'assistant'; content: string }>;
  session_id?: string;
  points_ref?: string;
  lang?: 'zh' | 'en';
}

function extractAnchor(report: string): string {
  if (!report) return '';
  const match = report.match(/##\s*一、结论([\s\S]*?)(?=##|$)/);
  if (match && match[1].trim()) {
    const text = match[1].trim();
    return text.length > 400 ? text.slice(0, 400) + '…' : text;
  }
  const enMatch = report.match(/##\s*1\.\s*Verdict([\s\S]*?)(?=##|$)/i);
  if (enMatch && enMatch[1].trim()) {
    const text = enMatch[1].trim();
    return text.length > 400 ? text.slice(0, 400) + '…' : text;
  }
  return report.length > 1200 ? report.slice(0, 1200) + '…' : report;
}

function sanitizeClientHistory(raw: Array<{ role?: string; content?: string }> = []): ConversationTurn[] {
  const result: ConversationTurn[] = [];
  for (const m of raw) {
    if (!m || typeof m.content !== 'string') continue;
    const content = m.content.trim();
    if (!content) continue;
    if (m.role !== 'user' && m.role !== 'assistant') continue;
    if (
      m.role === 'assistant' &&
      (content.includes('【引用铁律】') ||
        content.includes('【输出契约】') ||
        content.includes('[Reference Rules]'))
    ) {
      continue;
    }
    const truncated = content.length > 1200 ? content.slice(0, 1200) + '…' : content;
    result.push({ role: m.role, content: truncated });
  }
  return result.slice(-8);
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

    // 3. 服务端取历史与首解锚点
    let anchor = '';
    let history: ConversationTurn[] = [];
    if (session_id) {
      const user = await getSupabaseUser();
      if (user) {
        const supabase = await createSupabaseServerClient();
        const [{ data: sessionRow }, { data: msgRows }] = await Promise.all([
          supabase
            .from('liuyao_sessions')
            .select('reading_snapshot')
            .eq('id', session_id)
            .maybeSingle(),
          supabase
            .from('liuyao_messages')
            .select('role,content')
            .eq('session_id', session_id)
            .order('created_at', { ascending: true })
            .limit(40)
        ]);
        const snapshot = sessionRow?.reading_snapshot as { ai_report?: string } | null;
        anchor = extractAnchor(snapshot?.ai_report ?? '');
        history = (msgRows ?? []).filter(r => r.role === 'user' || r.role === 'assistant');
      }
    }

    // 4. 未登录/无 session：回退客户端历史，但必须清洗（最多 8 条、单条 ≤1200 字）
    if (!history.length) {
      history = sanitizeClientHistory(previous_messages);
    }

    // 5. 知识库检索（与首解同一套）
    const bundle = retrieveKnowledge({
      question,
      reading,
      lang: lang === 'en' ? 'en' : 'zh'
    });
    const { block } = buildKnowledgeBlock(bundle);

    // 6. messages：服务端历史优先，客户端只在兜底时生效，预算 8000 字符
    const { messages: llmMessages } = buildFollowUpMessages({
      history,
      question,
      budgetChars: 8000
    });

    // 7. 追问心法与提示词
    const followUpRule = activeSkill.followUpInstruction
      ? activeSkill.followUpInstruction
          .replace('{{PRIMARY_HEX}}', p.nameZh)
          .replace('{{TRANSFORMED_HEX}}', t ? t.nameZh : '纯静无变')
      : `【追问答疑宗纲】
你正在针对此卦解答求问者的进一步追问。
1. 严禁更换原卦象数理与卦名，严禁另起新卦；
2. 紧扣原卦之动爻与用神在月日生克下的演进态势，直接犀利切中问题核心；
3. 给出切实的具体时间窗（如应期月日、出空之时）或行动抉择指引。`;

    const langInstruction = lang === 'en' ? 'Please respond fluently in English.' : '请使用地道典雅的中文易学风格作答。';

    // 8. 组装 System Instruction
    const systemInstruction = buildLiuYaoSystem({
      lang: lang === 'en' ? 'en' : 'zh',
      skillInstruction: activeSkill.systemInstruction,
      snapshot: buildHexSnapshot(reading, lang),
      block,
      yongShenNote: `用神判定：${bundle.yongShen.reason}`,
      anchor,
      extraPrompt: `${followUpRule}\n\n${langInstruction}`
    });

    const encoder = new TextEncoder();
    let fullResponseText = '';

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamLLM({
            systemInstruction,
            messages: llmMessages,
            temperature: 0.7,
            maxContextChars: 24000
          })) {
            fullResponseText += chunk;
            const data = JSON.stringify({ text: chunk });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }

          // 流结束后审计
          if (bundle) {
            const audit = auditLiuYaoReport(fullResponseText, {
              allowedRefs: bundle.hits.map(h => h.ref),
              reading,
              lang: lang === 'en' ? 'en' : 'zh'
            });
            if (!audit.ok) {
              console.warn('[liuyao-guard][follow-up]', audit.issues);
            }
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
