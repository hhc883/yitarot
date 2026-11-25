import { getSupabaseUser } from '@/lib/supabase/server';
import { verifyRedemptionCodeFormat } from '@/lib/payments/domestic';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { objectRecord } from '@/lib/payments/shared';

export async function POST(req: Request) {
  const user = await getSupabaseUser();
  if (!user) return Response.json({ error: 'unauthenticated' }, { status: 401 });

  const body = objectRecord(await req.json().catch(() => null));
  const code = typeof body?.code === 'string' ? body.code.trim().toUpperCase() : '';
  if (!code || code.length > 96) return Response.json({ error: 'invalid_code' }, { status: 400 });

  const checked = verifyRedemptionCodeFormat(code);
  const admin = getSupabaseAdminClient();
  if (checked.unavailable || !admin) return Response.json({ error: 'redeem_unavailable' }, { status: 503 });
  if (!checked.valid || !checked.points) return Response.json({ error: 'invalid_code' }, { status: 400 });

  const { data, error } = await admin.rpc('redeem_payment_code', {
    p_user_id: user.id, p_points: checked.points, p_ref: 'redeem:' + code
  });
  if (error) console.error('[Redeem] Settlement unavailable', error.code);
  if (data?.status === 'used') return Response.json({ error: 'code_already_used' }, { status: 409 });
  if (error || data?.status !== 'ok') return Response.json({ error: 'fulfill_failed' }, { status: 503 });
  return Response.json({ ok: true, pointsAdded: checked.points, newBalance: data.balance });
}
