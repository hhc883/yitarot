export const PAYMENT_TIERS = {
  100: { cny: 2990, usd: 499, payhip: '6gkYN' },
  500: { cny: 9900, usd: 1999, payhip: '6wc09' },
  2000: { cny: 29900, usd: 5999, payhip: 'cKoqG' }
} as const;

export type PaymentTier = keyof typeof PAYMENT_TIERS;

export function isPaymentTier(value: unknown): value is PaymentTier {
  return value === 100 || value === 500 || value === 2000;
}
