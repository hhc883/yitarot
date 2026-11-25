import { detectPaymentRegion } from '@/lib/payments/region';
import { getDomesticGateway } from '@/lib/payments/domestic';
import { noStore } from '@/lib/payments/shared';

export function GET(request: Request) {
  const gateway = getDomesticGateway();
  return Response.json({
    region: detectPaymentRegion(request.headers, {
      vercel: process.env.VERCEL,
      geoSource: process.env.PAYMENT_GEO_SOURCE
    }),
    domesticAvailable: Boolean(gateway),
    domesticChannel: gateway?.channel ?? null,
    overseasAvailable: Boolean(process.env.PAYHIP_API_KEY?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
  }, { headers: noStore });
}
