import { NextRequest } from 'next/server';
import { verifyDomesticCallbackSignature } from '@/lib/payments/domestic';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { creditUserPoints } from '@/lib/points/fulfill';

/**
 * POST /api/webhooks/domestic
 * 接收国内支付网关异步回调
 */
export async function POST(req: NextRequest) {
  const params: Record<string, string> = {};

  const contentType = req.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      const json = await req.json();
      for (const [k, v] of Object.entries(json)) {
        params[k] = String(v);
      }
    } catch {
      return new Response('fail', { status: 400 });
    }
  } else {
    try {
      const formData = await req.formData();
      formData.forEach((value, key) => {
        params[key] = String(value);
      });
    } catch {
      const text = await req.text();
      const search = new URLSearchParams(text);
      search.forEach((value, key) => {
        params[key] = value;
      });
    }
  }

  const appSecret = process.env.DOMESTIC_PAY_APP_SECRET;
  if (appSecret) {
    const valid = verifyDomesticCallbackSignature(params, appSecret);
    if (!valid) {
      console.warn('[Domestic Webhook] Invalid signature from domestic gateway');
      return new Response('fail', { status: 400 });
    }
  }

  const status = params.status;
  const tradeOrderId = params.trade_order_id;

  // 状态 'OD' 表示支付成功（标准协议规范）
  if (status === 'OD' && tradeOrderId) {
    const admin = getSupabaseAdminClient();
    if (admin) {
      const { data: order } = await admin
        .from('orders')
        .select('id, user_id, points, status')
        .eq('id', tradeOrderId)
        .maybeSingle();

      if (order && order.points > 0) {
        console.log(`[Domestic Webhook] Crediting ${order.points} points for order ${order.id}`);
        await creditUserPoints({
          userId: order.user_id,
          points: order.points,
          refId: `domestic:${order.id}`,
          orderId: order.id
        });
      }
    }
  }

  return new Response('success', { status: 200 });
}
