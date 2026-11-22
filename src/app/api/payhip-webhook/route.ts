import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

interface PayhipWebhookItem {
  product_key?: string;
  product_id?: string | number;
  product_name?: string;
  quantity?: string | number;
}

interface PayhipWebhookPayload {
  type?: string;
  email?: string;
  transaction_id?: string;
  id?: string;
  price?: number | string;
  currency?: string;
  signature?: string;
  items?: PayhipWebhookItem[];
  [key: string]: unknown;
}

/**
 * Payhip 商品码对应积分与美分金额
 * 100 Points: 6gkYN ($4.99 = 499)
 * 500 Points: 6wc09 ($19.99 = 1999)
 * 2000 Points: cKoqG ($59.99 = 5999)
 */
const PAYHIP_PRODUCT_MAP: Record<string, { points: number; expectedPriceCents: number }> = {
  '6gkYN': { points: 100, expectedPriceCents: 499 },
  '6wc09': { points: 500, expectedPriceCents: 1999 },
  'cKoqG': { points: 2000, expectedPriceCents: 5999 }
};

/**
 * POST /api/payhip-webhook
 * Payhip 订单支付与退款异步处理端点
 */
export async function POST(req: NextRequest) {
  let payload: PayhipWebhookPayload;

  // 1. 解析请求 JSON
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  // 2. 签名验证：signature = SHA-256(PAYHIP_API_KEY)
  const apiKey = process.env.PAYHIP_API_KEY;
  if (!apiKey) {
    console.error('[Payhip Webhook] PAYHIP_API_KEY is not configured in server environment variables.');
    return NextResponse.json({ error: 'server_configuration_error' }, { status: 500 });
  }

  const expectedSignature = crypto.createHash('sha256').update(apiKey).digest('hex');
  const providedSignature = typeof payload.signature === 'string' ? payload.signature : '';

  const bufExpected = Buffer.from(expectedSignature, 'utf8');
  const bufProvided = Buffer.from(providedSignature, 'utf8');

  if (
    bufExpected.length === 0 ||
    bufExpected.length !== bufProvided.length ||
    !crypto.timingSafeEqual(bufExpected, bufProvided)
  ) {
    console.warn('[Payhip Webhook] Invalid webhook signature received.');
    return NextResponse.json({ error: 'invalid_signature' }, { status: 401 });
  }

  // 3. 事件过滤：只响应 paid 与 refunded
  const eventType = payload.type;
  if (eventType !== 'paid' && eventType !== 'refunded') {
    return NextResponse.json({ ok: true, ignored: eventType }, { status: 200 });
  }

  // 4. 商品与参数解析
  const items = Array.isArray(payload.items) ? payload.items : [];
  const primaryItem = items.length > 0 ? items[0] : undefined;
  const productKey =
    primaryItem?.product_key || (primaryItem?.product_id ? String(primaryItem.product_id) : '');

  const buyerEmail = typeof payload.email === 'string' ? payload.email.trim() : '';
  const txId =
    typeof payload.transaction_id === 'string'
      ? payload.transaction_id.trim()
      : typeof payload.id === 'string'
        ? payload.id.trim()
        : '';

  const rawPrice = payload.price;
  const priceInCents =
    typeof rawPrice === 'number'
      ? rawPrice
      : typeof rawPrice === 'string'
        ? parseFloat(rawPrice) || 0
        : 0;

  const matched = PAYHIP_PRODUCT_MAP[productKey];

  if (!matched || !buyerEmail || !txId) {
    console.warn(
      `[Payhip Webhook] Unknown product or missing fields: type=${eventType}, email=${buyerEmail}, txId=${txId}, product_key=${productKey}, price=${priceInCents}`
    );
    // 返回 200 避免 Payhip 无效重试
    return NextResponse.json(
      { ok: true, ignored: 'unknown_product_or_missing_fields' },
      { status: 200 }
    );
  }

  // 金额辅助校验警告（不拦截业务加分）
  if (priceInCents !== matched.expectedPriceCents) {
    console.warn(
      `[Payhip Webhook] Price mismatch for product ${productKey}: expected ${matched.expectedPriceCents}, received ${priceInCents}`
    );
  }

  // 5. 初始化 Supabase Service Role 客户端
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('[Payhip Webhook] Missing Supabase service role configuration.');
    return NextResponse.json({ error: 'server_configuration_error' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false }
  });

  // 6. 按邮箱查找本站用户
  let userId: string | null = null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email')
    .ilike('email', buyerEmail)
    .maybeSingle();

  if (profile?.id) {
    userId = profile.id;
  } else {
    // 兜底查询 auth.admin.listUsers
    try {
      const { data: authData } = await supabase.auth.admin.listUsers();
      const foundAuth = authData?.users?.find(
        (u) => u.email && u.email.toLowerCase() === buyerEmail.toLowerCase()
      );
      if (foundAuth?.id) {
        userId = foundAuth.id;
      }
    } catch (authErr) {
      console.warn('[Payhip Webhook] Auth user lookup fallback note:', authErr);
    }
  }

  // 若买家邮箱在本站未匹配到用户，记录日志并返回 200（走人工补分流程）
  if (!userId) {
    console.warn(
      `[Payhip Webhook] No matching user found: email=${buyerEmail}, txId=${txId}, price=${priceInCents}. Flagged for manual review.`
    );
    return NextResponse.json({ ok: true, ignored: 'no_user' }, { status: 200 });
  }

  // 7. 调用数据库 RPC 函数加分或退款
  const isPaid = eventType === 'paid';
  const p_kind = isPaid ? 'purchase' : 'refund';
  const p_amount = isPaid ? matched.points : -matched.points;
  const p_ref = isPaid ? `payhip:${txId}` : `payhip-refund:${txId}`;

  const { data: rpcResult, error: rpcError } = await supabase.rpc('credit_purchase_points', {
    p_user_id: userId,
    p_kind,
    p_amount,
    p_ref
  });

  if (rpcError) {
    console.error('[Payhip Webhook] credit_purchase_points RPC error:', rpcError);
    // 返回 500 让 Payhip 稍后重试
    return NextResponse.json({ error: 'rpc_failed', message: rpcError.message }, { status: 500 });
  }

  const rpcStatus = rpcResult?.status;
  if (rpcStatus !== 'ok' && rpcStatus !== 'already_credited') {
    console.error(`[Payhip Webhook] RPC unexpected status: ${rpcStatus}`);
    return NextResponse.json({ error: 'rpc_error_status', status: rpcStatus }, { status: 500 });
  }

  // 8. 写入/更新 orders 订单记录
  if (isPaid) {
    const orderAmount = (priceInCents > 0 ? priceInCents : matched.expectedPriceCents) / 100;
    const { error: orderInsertErr } = await supabase.from('orders').insert({
      user_id: userId,
      amount: orderAmount,
      points: matched.points,
      status: 'paid',
      payhip_transaction_id: txId
    });

    if (orderInsertErr && orderInsertErr.code !== '23505') {
      console.warn('[Payhip Webhook] Order record insert note:', orderInsertErr.message);
    }
  } else {
    const { error: orderUpdateErr } = await supabase
      .from('orders')
      .update({ status: 'refunded' })
      .eq('payhip_transaction_id', txId);

    if (orderUpdateErr) {
      console.warn('[Payhip Webhook] Order record update note:', orderUpdateErr.message);
    }
  }

  return NextResponse.json({
    ok: true,
    status: 'completed',
    event: eventType,
    points: matched.points,
    balance: rpcResult?.balance
  });
}
