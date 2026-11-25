import { getSupabaseAdminClient } from '@/lib/supabase/admin';

export async function settleCheckoutOrder(payment: {
  orderId: string;
  provider: 'stripe' | 'domestic';
  currency: 'USD' | 'CNY';
  amount: number;
  transaction: string;
}) {
  const admin = getSupabaseAdminClient();
  if (!admin) return null;
  const { data, error } = await admin.rpc('settle_checkout_order', {
    p_order_id: payment.orderId,
    p_provider: payment.provider,
    p_currency: payment.currency,
    p_minor: payment.amount,
    p_transaction: payment.transaction
  });
  if (error) {
    console.error('[Checkout] Settlement unavailable', error.code);
    return null;
  }
  return data as { status: string; points?: number; balance?: number };
}
