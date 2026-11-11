'use client';

import React, { useState } from 'react';

interface Plan {
  points: number;
  price: string;
  noteZh: string;
  noteEn: string;
}

const PLANS: Plan[] = [
  { points: 100, price: '$4.99', noteZh: '约 10 次测算', noteEn: '≈ 10 readings' },
  { points: 500, price: '$19.99', noteZh: '约 50 次测算', noteEn: '≈ 50 readings' },
  { points: 2000, price: '$59.99', noteZh: '约 200 次测算', noteEn: '≈ 200 readings' }
];

/**
 * 定价占位卡：Stripe 支付 Phase 2 接入，当前点击仅提示「即将上线」。
 */
export function PricingCards({ lang = 'zh' }: { lang?: string }) {
  const isEn = lang === 'en';
  const [pending, setPending] = useState<number | null>(null);

  const handleBuy = (points: number) => {
    setPending(points);
    window.setTimeout(() => setPending((current) => (current === points ? null : current)), 2600);
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {PLANS.map((plan, idx) => {
        const isPending = pending === plan.points;
        return (
          <div
            key={plan.points}
            className={`mkt-rise mkt-rise-${idx + 1} flex h-full flex-col rounded-[14px] border bg-white p-8 transition-[border-color,box-shadow] duration-300 ${
              isPending ? 'border-ink/30' : 'border-line hover:border-ink/20 hover:shadow-[0_24px_50px_-40px_rgba(10,10,10,0.4)]'
            }`}
          >
            <p className="font-display text-[11px] tracking-[0.22em] text-whisper">
              {plan.points} {isEn ? 'POINTS' : '积分'}
            </p>

            <p className="mt-6 font-serif text-[40px] leading-none text-ink">{plan.price}</p>

            <p className="mt-3 text-[13px] text-soft">
              {isEn ? plan.noteEn : plan.noteZh}
            </p>

            <div className="mt-auto pt-8">
              <button
                type="button"
                onClick={() => handleBuy(plan.points)}
                className={`inline-flex h-11 w-full items-center justify-center rounded-full text-[13px] transition-opacity duration-200 ${
                  isPending
                    ? 'cursor-default bg-mist text-whisper'
                    : 'bg-ink text-white hover:opacity-80'
                }`}
              >
                {isPending
                  ? isEn
                    ? 'Coming soon'
                    : '即将上线'
                  : isEn
                    ? `Buy ${plan.points} points`
                    : `购买 ${plan.points} 积分`}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
