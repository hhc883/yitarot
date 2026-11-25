import { getSupabaseUser } from '@/lib/supabase/server';
import { createDomesticPaymentOrder, getDomesticGateway } from '@/lib/payments/domestic';
import { isPaymentTier } from '@/lib/payments/catalog';
import { noStore, objectRecord } from '@/lib/payments/shared';

export async function POST(req: Request) {
  const send = (body: Record<string, unknown>, status = 200) =>
    Response.json(body, { status, headers: noStore });
  const user = await getSupabaseUser();
  if (!user) return send({ error: 'unauthenticated' }, 401);

  const body = objectRecord(await req.json().catch(() => null));
  if (!body) return send({ error: 'invalid_json' }, 400);
  if (!isPaymentTier(body.points)) return send({ error: 'invalid_tier' }, 400);

  const gateway = getDomesticGateway();
  if (!gateway) return send({ error: 'domestic_unavailable' }, 503);
  if (body.channel !== gateway.channel) return send({ error: 'invalid_channel' }, 400);

  const result = await createDomesticPaymentOrder({
    userId: user.id, points: body.points, lang: body.lang === 'en' ? 'en' : 'zh', gateway
  });
  return result ? send(result) : send({ error: 'checkout_failed' }, 502);
}
