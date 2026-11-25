import { getDomesticGateway, verifyDomesticCallbackSignature } from '@/lib/payments/domestic';
import { objectRecord, parseAmountInMinorUnits, UUID } from '@/lib/payments/shared';
import { settleCheckoutOrder } from '@/lib/points/fulfill';

export async function POST(req: Request) {
  const fail = (status: number) => new Response('fail', { status });
  const gateway = getDomesticGateway();
  if (!gateway) return fail(503);

  const params = Object.create(null) as Record<string, string>;
  try {
    if (req.headers.get('content-type')?.includes('application/json')) {
      const values = objectRecord(await req.json());
      if (!values) return fail(400);
      for (const [key, value] of Object.entries(values)) {
        if (typeof value !== 'string' && typeof value !== 'number') return fail(400);
        params[key] = String(value);
      }
    } else {
      for (const [key, value] of new URLSearchParams(await req.text())) {
        if (key in params) return fail(400);
        params[key] = value;
      }
    }
  } catch {
    return fail(400);
  }

  if (!verifyDomesticCallbackSignature(params, gateway.secret) || params.appid !== gateway.appId) return fail(400);
  if (params.status !== 'OD') return new Response('success');
  const id = params.trade_order_id?.replace(/^([0-9a-f]{8})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{12})$/i, '$1-$2-$3-$4-$5');
  const amount = parseAmountInMinorUnits(params.total_fee);
  const transaction = params.transaction_id || params.open_order_id;
  if (!id || !UUID.test(id) || !amount || !/^[A-Za-z0-9_-]{1,120}$/.test(transaction || '')) return fail(400);

  const settled = await settleCheckoutOrder({ orderId: id, provider: 'domestic', currency: 'CNY', amount, transaction });
  if (!settled || settled.status === 'profile_missing') return fail(503);
  if (settled.status !== 'ok' && settled.status !== 'already_credited') return fail(400);
  return new Response('success');
}
