'use client';

import type { FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Gift, Loader2, QrCode } from 'lucide-react';
import { useUser } from '@/lib/auth/use-user';
import { PAYMENT_TIERS } from '@/lib/payments/catalog';

type Region = 'domestic' | 'overseas';
type DomesticChannel = 'wechat' | 'alipay';
type CheckoutOptions = {
  region: Region | null;
  domesticAvailable: boolean;
  domesticChannel: DomesticChannel | null;
  overseasAvailable: boolean;
};

const PLANS = ([100, 500, 2000] as const).map((points) => {
  const tier = PAYMENT_TIERS[points];
  return {
    points,
    usd: `$${(tier.usd / 100).toFixed(2)}`,
    cny: `¥${(tier.cny / 100).toFixed(2)}`,
    payhipUrl: `https://payhip.com/b/${tier.payhip}`,
    popular: points === 500,
  };
});
type Plan = typeof PLANS[number];
type PaymentReturn = 'pending' | 'cancelled' | 'checking' | 'retry' | 'paid';

const focus = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink';
const action = `inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2 text-center text-sm font-medium text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 ${focus}`;
const textAction = `mt-2 inline-flex min-h-11 items-center text-sm underline underline-offset-4 ${focus}`;

function normalizeOptions(data: Partial<CheckoutOptions>): CheckoutOptions {
  const channel = data.domesticChannel === 'wechat' || data.domesticChannel === 'alipay' ? data.domesticChannel : null;
  return {
    region: data.region === 'domestic' || data.region === 'overseas' ? data.region : null,
    domesticAvailable: data.domesticAvailable === true && channel !== null,
    domesticChannel: channel,
    overseasAvailable: data.overseasAvailable === true,
  };
}

function httpsUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

function clearVerifiedReturn(sessionId: string) {
  const url = new URL(window.location.href);
  if (url.searchParams.get('payment_status') !== 'success' || url.searchParams.get('session_id') !== sessionId) return;
  url.searchParams.delete('payment_status');
  url.searchParams.delete('session_id');
  window.history.replaceState(window.history.state, '', url);
}

export function PricingCards({ lang = 'zh' }: { lang?: 'zh' | 'en' }) {
  const isEn = lang === 'en';
  const router = useRouter();
  const { user, refresh, loading: authLoading } = useUser();
  const login = () => router.push(`/${lang}/login?from=pricing`);

  const [checkout, setCheckout] = useState<CheckoutOptions | null>(null);
  const [lookupFailed, setLookupFailed] = useState(false);
  const [lookupAttempt, setLookupAttempt] = useState(0);
  const [manualRegion, setManualRegion] = useState<Region | null>(null);
  const region = manualRegion ?? checkout?.region ?? null;
  const domesticChannel = checkout?.domesticAvailable ? checkout.domesticChannel : null;
  const channelName = domesticChannel === 'alipay' ? (isEn ? 'Alipay' : '支付宝') : (isEn ? 'WeChat Pay' : '微信支付');

  const [loadingPoints, setLoadingPoints] = useState<number | null>(null);
  const purchaseInProgress = useRef(false);
  const [actionError, setActionError] = useState('');
  const [qr, setQr] = useState<{ plan: Plan; url: string } | null>(null);
  const [qrFailed, setQrFailed] = useState(false);
  const [paymentReturn, setPaymentReturn] = useState<PaymentReturn | null>(null);
  const [verifyAttempt, setVerifyAttempt] = useState(0);

  const [redeemCode, setRedeemCode] = useState('');
  const [redeeming, setRedeeming] = useState(false);
  const redemptionInProgress = useRef(false);
  const [redeemSuccess, setRedeemSuccess] = useState('');
  const [redeemError, setRedeemError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    void fetch('/api/checkout/region', { cache: 'no-store', signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error('Checkout options unavailable');
        const data = await res.json();
        if (!data || typeof data !== 'object') throw new Error('Invalid checkout options');
        if (!controller.signal.aborted) setCheckout(normalizeOptions(data));
      })
      .catch(() => {
        if (!controller.signal.aborted) setLookupFailed(true);
      });
    return () => controller.abort();
  }, [lookupAttempt]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('payment_status');
    const sessionId = params.get('session_id');
    const controller = new AbortController();
    const frame = window.requestAnimationFrame(() => {
      if (status === 'pending') {
        setPaymentReturn('pending');
        void refresh();
      } else if (status === 'cancelled') {
        setPaymentReturn('cancelled');
      } else if (status === 'success' && sessionId) {
        setPaymentReturn('checking');
        void fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`, {
          cache: 'no-store',
          signal: controller.signal,
        })
          .then(async (response) => {
            if (!response.ok) throw new Error('Unable to check payment');
            const data = await response.json();
            if (data?.ok !== true || data.status !== 'paid') throw new Error('Payment unconfirmed');
            if (!controller.signal.aborted) {
              setPaymentReturn('paid');
              clearVerifiedReturn(sessionId);
              void refresh();
            }
          })
          .catch(() => {
            if (!controller.signal.aborted) setPaymentReturn('retry');
          });
      }
    });
    return () => {
      window.cancelAnimationFrame(frame);
      controller.abort();
    };
  }, [refresh, verifyAttempt]);

  const chooseRegion = (value: Region) => {
    setManualRegion(value);
    setActionError('');
    setQr(null);
  };

  const handleOverseasCheckout = (plan: Plan) => {
    if (!checkout?.overseasAvailable || authLoading) return;
    if (!user) {
      login();
      return;
    }
    window.open(plan.payhipUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDomesticCheckout = async (plan: Plan) => {
    if (!domesticChannel || purchaseInProgress.current || authLoading) return;
    if (!user) {
      login();
      return;
    }

    purchaseInProgress.current = true;
    setLoadingPoints(plan.points);
    setActionError('');
    setQr(null);
    setQrFailed(false);

    try {
      const res = await fetch('/api/checkout/domestic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points: plan.points, channel: domesticChannel, lang }),
      });
      if (res.status === 401) {
        login();
        return;
      }
      const data = await res.json();
      if (!res.ok || data?.ok !== true) throw new Error('Checkout could not start');

      const payUrl = httpsUrl(data.payUrl);
      const qrUrl = httpsUrl(data.qrUrl);
      if (payUrl && (!qrUrl || window.matchMedia('(pointer: coarse)').matches)) {
        window.location.assign(payUrl);
      } else if (qrUrl) {
        setQr({ plan, url: qrUrl });
      } else {
        throw new Error('No checkout address returned');
      }
    } catch {
      setActionError(isEn ? 'Could not start checkout. Please try again.' : '暂时无法发起支付，请重试。');
    } finally {
      purchaseInProgress.current = false;
      setLoadingPoints(null);
    }
  };

  const handleRedeem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (redemptionInProgress.current || authLoading) return;
    if (!user) {
      login();
      return;
    }
    const code = redeemCode.trim().toUpperCase();
    if (!code) return;

    redemptionInProgress.current = true;
    setRedeeming(true);
    setRedeemError('');
    setRedeemSuccess('');

    try {
      const res = await fetch('/api/points/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (res.status === 401) {
        login();
        return;
      }
      const data = await res.json();
      if (res.ok && data?.ok === true) {
        setRedeemSuccess(isEn ? 'Code redeemed. Your balance is being updated.' : '兑换成功，正在更新积分余额。');
        setRedeemCode('');
        await refresh();
      } else {
        setRedeemError(res.status >= 500
          ? isEn ? 'Redemption is temporarily unavailable. Please try again.' : '暂时无法兑换，请稍后重试。'
          : isEn ? 'Could not redeem this code. Check it and try again.' : '无法兑换此卡密，请核对后重试。');
      }
    } catch {
      setRedeemError(isEn ? 'Redemption is temporarily unavailable. Please try again.' : '暂时无法兑换，请稍后重试。');
    } finally {
      redemptionInProgress.current = false;
      setRedeeming(false);
    }
  };

  const available = region === 'domestic' ? domesticChannel !== null : checkout?.overseasAvailable === true;

  return (
    <div className="w-full">
      {paymentReturn && (
        <aside role="status" className="mb-7 rounded-xl border border-line bg-white px-5 py-4 text-sm leading-relaxed text-ink">
          {paymentReturn === 'pending' && (
            <>
              <p>{isEn ? 'Payment has not been confirmed yet. Points are added after the payment provider confirms it.' : '支付尚未确认。支付平台确认后，积分会自动入账。'}</p>
              <button type="button" onClick={() => void refresh()} className={textAction}>
                {isEn ? 'Refresh balance' : '刷新余额'}
              </button>
            </>
          )}
          {paymentReturn === 'cancelled' && <p>{isEn ? 'Payment was cancelled.' : '已取消支付。'}</p>}
          {paymentReturn === 'checking' && <p>{isEn ? 'Checking payment status…' : '正在核验支付状态…'}</p>}
          {paymentReturn === 'paid' && <p>{isEn ? 'Payment confirmed. Your points balance has been updated.' : '已确认支付，积分余额已更新。'}</p>}
          {paymentReturn === 'retry' && (
            <>
              <p>{isEn ? 'Payment could not be confirmed yet. You can try checking again.' : '暂未确认支付结果，可重新核验。'}</p>
              <button type="button" onClick={() => setVerifyAttempt((n) => n + 1)} className={textAction}>
                {isEn ? 'Check payment again' : '重新核验支付'}
              </button>
            </>
          )}
        </aside>
      )}

      {actionError && <p role="alert" className="mb-7 rounded-xl border border-line px-5 py-4 text-sm text-ink">{actionError}</p>}

      <div className="mb-8 min-h-28" aria-busy={!checkout && !lookupFailed}>
        {!checkout ? (
          lookupFailed ? (
            <div className="rounded-xl border border-line px-5 py-4">
              <p role="alert" className="text-sm leading-relaxed text-ink">{isEn ? 'Payment options could not load. You can still redeem a code below.' : '暂时无法加载支付选项。你仍可在下方兑换卡密。'}</p>
              <button type="button" onClick={() => { setLookupFailed(false); setLookupAttempt((n) => n + 1); }} className={textAction}>
                {isEn ? 'Retry payment options' : '重新加载支付选项'}
              </button>
            </div>
          ) : <p role="status" className="rounded-xl border border-line px-5 py-4 text-sm text-soft">{isEn ? 'Loading payment options…' : '正在加载支付选项…'}</p>
        ) : (
          <>
            <fieldset disabled={loadingPoints !== null} className="min-w-0">
              <legend className="text-sm font-semibold text-ink">{isEn ? 'Payment region' : '支付地区'}</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {([
                  ['domestic', isEn ? 'Mainland China · CNY' : '中国大陆 · CNY'],
                  ['overseas', isEn ? 'International · USD' : '国际 · USD'],
                ] as const).map(([value, label]) => (
                  <label key={value} className="relative inline-flex">
                    <input type="radio" name="pricing-region" className="peer sr-only" value={value} checked={region === value} onChange={() => chooseRegion(value)} />
                    <span className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-line px-4 py-2 text-sm text-ink hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-ink peer-disabled:cursor-not-allowed peer-disabled:opacity-60">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <p className="mt-3 text-sm leading-relaxed text-soft" role="status">
              {!region
                ? isEn ? 'Choose the region that matches how you want to pay.' : '请选择与你的付款方式匹配的地区。'
                : isEn ? 'You can switch payment regions at any time.' : '你可以随时切换支付地区。'}
            </p>
          </>
        )}
      </div>

      {(() => {
        const displayRegion: Region = region ?? (isEn ? 'overseas' : 'domestic');
        return (
          <>
            {checkout && region && !available && (
              <p role="status" className="mb-6 rounded-xl border border-line bg-[#FAFAFA] px-5 py-4 text-sm leading-relaxed text-ink">
                {isEn
                  ? 'Online checkout is currently unavailable for this region. You can switch regions above or redeem an official code below.'
                  : '该地区的在线支付暂未开启。你可以切换支付地区，或在下方使用官方兑换码即时充值。'}
              </p>
            )}
            {checkout && region && available && (
              <p className="mb-5 text-sm leading-relaxed text-soft">
                {region === 'domestic'
                  ? isEn ? `CNY checkout uses ${channelName}.` : `人民币结算使用${channelName}。`
                  : isEn ? 'Payhip handles USD checkout. Use the same email address as your YiTatro account to receive your points.' : '美元由 Payhip 结算。购买时请使用与 YiTatro 账号相同的邮箱，以便积分入账。'}
              </p>
            )}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {PLANS.map((plan) => {
                const price = displayRegion === 'domestic' ? plan.cny : plan.usd;
                const canCheckout = Boolean(checkout && region && available);
                return (
                  <article key={plan.points} className={`flex min-w-0 flex-col rounded-2xl border bg-white p-5 sm:p-6 transition-colors ${plan.popular ? 'border-ink shadow-xs' : 'border-line'}`}>
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="break-words text-sm font-semibold text-ink">{plan.points} {isEn ? 'points' : '积分'}</h2>
                      {plan.popular && (
                        <span className="rounded-full bg-[#171717] px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-white">
                          {isEn ? 'Popular' : '推荐'}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 flex flex-wrap items-baseline gap-x-2">
                      <span className="font-serif text-4xl leading-none text-ink">{price}</span>
                      <span className="text-xs text-soft">{displayRegion === 'domestic' ? 'CNY' : 'USD'}</span>
                    </p>
                    <p className="my-4 grow border-t border-line pt-4 text-sm text-soft">
                      {isEn
                        ? 'Use points for deep AI hexagram, BaZi, and tarot readings with multi-turn follow-up.'
                        : '可用于 AI 深度六爻解卦、八字详批、塔罗牌阵推理与多轮追问。'}
                    </p>
                    <button
                      type="button"
                      className={action}
                      disabled={!canCheckout || authLoading || loadingPoints !== null}
                      onClick={() => displayRegion === 'domestic' ? void handleDomesticCheckout(plan) : handleOverseasCheckout(plan)}
                    >
                      {loadingPoints === plan.points ? (
                        <><Loader2 aria-hidden="true" className="h-4 w-4 shrink-0 motion-safe:animate-spin" />{isEn ? 'Opening checkout…' : '正在打开收银台…'}</>
                      ) : !canCheckout ? (
                        <span>{isEn ? 'Redeem code below' : '请使用下方兑换码'}</span>
                      ) : displayRegion === 'domestic' ? (
                        <><QrCode aria-hidden="true" className="h-4 w-4 shrink-0" />{isEn ? `Pay with ${channelName}` : `使用${channelName}付款`}</>
                      ) : (
                        <><CreditCard aria-hidden="true" className="h-4 w-4 shrink-0" />{isEn ? 'Continue to Payhip' : '前往 Payhip 付款'}</>
                      )}
                    </button>
                  </article>
                );
              })}
            </div>
          </>
        );
      })()}

      {qr && (
        <section aria-labelledby="pricing-qr-title" className="mt-8 rounded-2xl border border-line p-6">
          <h2 id="pricing-qr-title" className="font-serif text-xl text-ink">{isEn ? `Scan with ${channelName}` : `使用${channelName}扫码`}</h2>
          <p className="mt-2 text-sm text-soft">{qr.plan.points} {isEn ? 'points' : '积分'} · {qr.plan.cny} CNY</p>
          {qrFailed ? (
            <p role="alert" className="mt-4 text-sm text-ink">{isEn ? 'The payment QR code could not load. Close it and try again.' : '支付二维码加载失败，请关闭后重试。'}</p>
          ) : (
            // The gateway supplies the HTTPS image; it is not fetched via the Next.js optimizer.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr.url} alt={isEn ? `${channelName} checkout QR code` : `${channelName}收银台二维码`} className="mt-4 h-48 w-48 max-w-full rounded-lg border border-line object-contain" referrerPolicy="no-referrer" onError={() => setQrFailed(true)} />
          )}
          <p className="mt-4 text-sm leading-relaxed text-soft">{isEn ? 'Points are added when the payment provider confirms your payment.' : '支付平台确认后，积分会自动入账。'}</p>
          <button type="button" onClick={() => setQr(null)} className={textAction}>{isEn ? 'Close QR code' : '关闭二维码'}</button>
        </section>
      )}

      <section aria-labelledby="pricing-redeem-title" className="mt-12 rounded-2xl border border-line bg-white p-5 sm:p-8">
        <div className="max-w-[700px]">
          <h2 id="pricing-redeem-title" className="inline-flex items-center gap-2 font-serif text-xl text-ink">
            <Gift aria-hidden="true" className="h-4 w-4" />{isEn ? 'Redeem a code' : '兑换积分'}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-soft">{isEn ? 'Already have an official redemption code? Add its points to your account here.' : '已有官方兑换码？在这里将积分加入你的账户。'}</p>
          <form onSubmit={handleRedeem} className="mt-5">
            <label htmlFor="pricing-redeem-code" className="block text-sm font-medium text-ink">{isEn ? 'Redemption code' : '卡密兑换码'}</label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <input
                id="pricing-redeem-code"
                type="text"
                autoCapitalize="characters"
                autoComplete="off"
                spellCheck={false}
                value={redeemCode}
                onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                placeholder="YITA100-XXXXXX-XXXXXX"
                className={`min-h-11 w-full min-w-0 flex-1 rounded-full border border-line px-4 py-2 font-mono text-sm text-ink placeholder:text-whisper ${focus}`}
              />
              <button type="submit" disabled={authLoading || redeeming || !redeemCode.trim()} className={`${action} sm:w-auto sm:shrink-0`}>
                {redeeming ? <><Loader2 aria-hidden="true" className="h-4 w-4 motion-safe:animate-spin" />{isEn ? 'Redeeming…' : '兑换中…'}</> : isEn ? 'Redeem code' : '立即兑换'}
              </button>
            </div>
          </form>
          {redeemSuccess && <p role="status" className="mt-3 text-sm text-ink">{redeemSuccess}</p>}
          {redeemError && <p role="alert" className="mt-3 text-sm text-ink">{redeemError}</p>}
        </div>
      </section>
    </div>
  );
}
