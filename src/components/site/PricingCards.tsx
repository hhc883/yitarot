'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, CreditCard, QrCode, Gift, Sparkles, Loader2, X, ShieldCheck } from 'lucide-react';
import { useUser } from '@/lib/auth/use-user';

interface Plan {
  points: number;
  usdPrice: string;
  cnyPrice: string;
  payhipUrl: string;
  popular?: boolean;
  bestValue?: boolean;
  descZh: string;
  descEn: string;
  perReadingZh: string;
  perReadingEn: string;
}

const PLANS: Plan[] = [
  {
    points: 100,
    usdPrice: '$4.99',
    cnyPrice: '¥29.9',
    payhipUrl: 'https://payhip.com/b/6gkYN',
    descZh: '约 10 次 AI 深度卦象推演或塔罗全解析',
    descEn: '≈ 10 deep AI hexagram or tarot interpretations',
    perReadingZh: '单次约 ¥2.99',
    perReadingEn: '$0.50 / reading'
  },
  {
    points: 500,
    usdPrice: '$19.99',
    cnyPrice: '¥99.0',
    payhipUrl: 'https://payhip.com/b/6wc09',
    popular: true,
    descZh: '约 50 次深度推演与连贯追问，最受欢迎',
    descEn: '≈ 50 readings & continuous follow-ups (Most popular)',
    perReadingZh: '单次低至 ¥1.98（立省 35%）',
    perReadingEn: '$0.40 / reading (Save 20%)'
  },
  {
    points: 2000,
    usdPrice: '$59.99',
    cnyPrice: '¥299.0',
    payhipUrl: 'https://payhip.com/b/cKoqG',
    bestValue: true,
    descZh: '约 200 次专业级全息推演，永久有效',
    descEn: '≈ 200 readings, maximum value & never expire',
    perReadingZh: '单次低至 ¥1.49（最高性价比）',
    perReadingEn: '$0.30 / reading (Best value)'
  }
];

export function PricingCards({ lang = 'zh' }: { lang?: string }) {
  const isEn = lang === 'en';
  const router = useRouter();
  const { user, refresh } = useUser();

  // 默认根据语言选择支付区域：zh -> domestic (国内), en -> overseas (海外)
  const [region, setRegion] = useState<'domestic' | 'overseas'>(isEn ? 'overseas' : 'domestic');
  const [loadingPoints, setLoadingPoints] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment_status') === 'cancelled') {
      return isEn ? 'Payment was cancelled.' : '已取消支付。';
    }
    return '';
  });

  // 卡密兑换状态
  const [redeemCode, setRedeemCode] = useState('');
  const [redeeming, setRedeeming] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState<string>('');
  const [redeemError, setRedeemError] = useState<string>('');

  // 国内支付弹窗 (当网关返回二维码或人工转账)
  const [domesticModalOpen, setDomesticModalOpen] = useState(false);
  const [domesticModalData, setDomesticModalData] = useState<{
    points: number;
    amount: string;
    qrUrl?: string;
    payUrl?: string;
  } | null>(null);

  // 支付成功横幅/通知
  const [successNotice, setSuccessNotice] = useState<string>('');

  // 检查 URL 是否带支付返回参数
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment_status');
    const sessionId = urlParams.get('session_id');

    if (paymentStatus === 'success' && sessionId) {
      // 向后端验证核销
      fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.ok) {
            setSuccessNotice(
              isEn
                ? `Payment successful! Added +${data.points} points. New balance: ◆ ${data.newBalance ?? ''}`
                : `支付成功！已为您充值 +${data.points} 积分，当前账户余额：◆ ${data.newBalance ?? ''}`
            );
            refresh();
          }
        })
        .catch(() => {});

      // 清除 URL 参数防重刷
      window.history.replaceState({}, '', `/${lang}/pricing`);
    } else if (paymentStatus === 'cancelled') {
      window.history.replaceState({}, '', `/${lang}/pricing`);
    }
  }, [isEn, lang, refresh]);

  // 处理海外 Payhip / PayPal 结账
  const handleOverseasCheckout = (plan: Plan) => {
    if (!user) {
      router.push(`/${lang}/login?from=pricing`);
      return;
    }

    window.open(plan.payhipUrl, '_blank', 'noopener,noreferrer');
  };

  // 处理国内微信/支付宝支付
  const handleDomesticCheckout = async (points: number, channel: 'wechat' | 'alipay') => {
    if (!user) {
      router.push(`/${lang}/login?from=pricing`);
      return;
    }

    setLoadingPoints(points);
    setActionError('');

    const targetPlan = PLANS.find((p) => p.points === points);

    try {
      const res = await fetch('/api/checkout/domestic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points, channel })
      });

      const data = await res.json();
      if (res.status === 401) {
        router.push(`/${lang}/login?from=pricing`);
        return;
      }

      if (data.ok) {
        if (data.payUrl && !data.manualFallback) {
          // 直接跳转聚合收银台或唤起收银
          window.location.assign(data.payUrl);
        } else {
          // 打开扫码/卡密弹窗
          setDomesticModalData({
            points,
            amount: targetPlan?.cnyPrice || '¥29.9',
            qrUrl: data.qrUrl
          });
          setDomesticModalOpen(true);
        }
      } else {
        setActionError(data.message || (isEn ? 'Domestic payment failed.' : '发起国内支付失败，请稍后重试。'));
      }
    } catch {
      setActionError(isEn ? 'Network error, please retry.' : '网络异常，请重试。');
    } finally {
      setLoadingPoints(null);
    }
  };

  // 处理卡密兑换
  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push(`/${lang}/login?from=pricing`);
      return;
    }

    const clean = redeemCode.trim().toUpperCase();
    if (!clean) return;

    setRedeeming(true);
    setRedeemError('');
    setRedeemSuccess('');

    try {
      const res = await fetch('/api/points/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: clean })
      });

      const data = await res.json();
      if (res.status === 401) {
        router.push(`/${lang}/login?from=pricing`);
        return;
      }

      if (data.ok) {
        setRedeemSuccess(
          isEn
            ? `Redeemed successfully! Added +${data.pointsAdded} points. Balance: ◆ ${data.newBalance}`
            : `✓ 兑换成功！已成功增加 +${data.pointsAdded} 积分，当前账户余额：◆ ${data.newBalance}`
        );
        setRedeemCode('');
        await refresh();
      } else {
        setRedeemError(data.message || (isEn ? 'Redemption failed.' : '兑换失败，请检查卡密输入。'));
      }
    } catch {
      setRedeemError(isEn ? 'Network error.' : '网络异常，请重试。');
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <div className="w-full">
      {/* 支付成功公告 */}
      {successNotice ? (
        <div className="mb-8 flex items-center justify-between rounded-[12px] border border-emerald-500/30 bg-emerald-50 px-5 py-4 text-[14px] text-emerald-900">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span>{successNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessNotice('')}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      {/* 错误提示公告 */}
      {actionError ? (
        <div className="mb-8 flex items-center justify-between rounded-[12px] border border-red-500/30 bg-red-50 px-5 py-4 text-[13.5px] text-red-900">
          <span>{actionError}</span>
          <button
            type="button"
            onClick={() => setActionError('')}
            className="text-red-700 hover:text-red-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      {/* 支付通道切换开关 */}
      <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="inline-flex rounded-full border border-line bg-mist/60 p-1">
          <button
            type="button"
            onClick={() => setRegion('domestic')}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-medium transition-all ${
              region === 'domestic'
                ? 'bg-ink text-white shadow-sm'
                : 'text-whisper hover:text-ink'
            }`}
          >
            <span>🇨🇳</span>
            <span>{isEn ? 'China (CNY ¥)' : '国内支付 (微信 / 支付宝)'}</span>
          </button>
          <button
            type="button"
            onClick={() => setRegion('overseas')}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-medium transition-all ${
              region === 'overseas'
                ? 'bg-ink text-white shadow-sm'
                : 'text-whisper hover:text-ink'
            }`}
          >
            <span>🌏</span>
            <span>{isEn ? 'Global (USD $)' : '海外支付 (PayPal / 信用卡)'}</span>
          </button>
        </div>

        {/* 支付保障标语 */}
        <div className="flex items-center gap-2 text-[12px] text-whisper">
          <ShieldCheck className="h-3.5 w-3.5 text-soft" />
          <span>
            {region === 'domestic'
              ? isEn
                ? 'Instant credit · Secure checkout · 24/7 Support'
                : '微信/支付宝安全结算 · 充值即时到账 · 积分永久有效'
              : isEn
                ? 'Secure checkout by Payhip · PayPal & cards'
                : 'Payhip 安全结算 · 支持 PayPal 与国际信用卡'}
          </span>
        </div>
      </div>

      {/* 价格档位卡片矩阵 */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {PLANS.map((plan) => {
          const isLoading = loadingPoints === plan.points;
          const displayPrice = region === 'domestic' ? plan.cnyPrice : plan.usdPrice;

          return (
            <div
              key={plan.points}
              className={`relative flex h-full flex-col rounded-[16px] border bg-white p-7 transition-all duration-300 ${
                plan.popular
                  ? 'border-ink shadow-[0_20px_45px_-30px_rgba(23,23,23,0.35)] ring-1 ring-ink'
                  : 'border-line hover:border-ink/30 hover:shadow-[0_16px_40px_-32px_rgba(10,10,10,0.3)]'
              }`}
            >
              {/* 角标 */}
              {plan.popular ? (
                <div className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-ink px-3 py-0.5 text-[10.5px] font-medium tracking-wide text-white">
                  <Sparkles className="h-2.5 w-2.5" />
                  <span>{isEn ? 'RECOMMENDED' : '推荐首选'}</span>
                </div>
              ) : null}

              {plan.bestValue ? (
                <div className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full border border-line bg-mist px-3 py-0.5 text-[10.5px] font-medium tracking-wide text-ink">
                  <span>{isEn ? 'BEST VALUE' : '最高性价比'}</span>
                </div>
              ) : null}

              {/* 头部积分 */}
              <div className="flex items-baseline justify-between">
                <span className="font-display text-[12px] font-semibold tracking-[0.2em] text-whisper">
                  {plan.points} {isEn ? 'POINTS' : '积分'}
                </span>
                <span className="text-[11.5px] text-soft">
                  {region === 'domestic' ? plan.perReadingZh : plan.perReadingEn}
                </span>
              </div>

              {/* 价格大字 */}
              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-serif text-[42px] font-normal leading-none text-ink">
                  {displayPrice}
                </span>
                <span className="text-[13px] text-whisper">
                  {region === 'domestic' ? '元' : 'USD'}
                </span>
              </div>

              {/* 说明 */}
              <p className="mt-3 text-[13px] leading-[1.6] text-soft">
                {isEn ? plan.descEn : plan.descZh}
              </p>

              {/* 专属权益列表 */}
              <div className="my-6 space-y-2 border-t border-line/70 pt-5 text-[12.5px] text-ink">
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-soft" />
                  <span>{isEn ? 'All divination models included' : '六爻、塔罗、八字全模块通用'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-soft" />
                  <span>{isEn ? 'Infinite context follow-ups' : '支持多轮深度无限追问'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-soft" />
                  <span>{isEn ? 'Never expire' : '积分永久有效，无时间限制'}</span>
                </div>
              </div>

              {/* 底部购买按钮 */}
              <div className="mt-auto pt-2">
                {region === 'overseas' ? (
                  <div>
                    <button
                      type="button"
                      onClick={() => handleOverseasCheckout(plan)}
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-ink text-[13px] font-medium text-white transition-all hover:bg-neutral-800"
                    >
                      <CreditCard className="h-3.5 w-3.5" />
                      <span>
                        {isEn
                          ? `Pay ${plan.usdPrice} with PayPal / Card`
                          : `使用 PayPal / 信用卡支付 ${plan.usdPrice}`}
                      </span>
                    </button>
                    <p className="mt-2 text-center text-[11px] leading-[1.4] text-whisper">
                      {isEn
                        ? 'Use the same email as your yitarot.net account — points are credited automatically.'
                        : '请使用与本站账号相同的邮箱购买，积分将自动到账'}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => handleDomesticCheckout(plan.points, 'wechat')}
                      disabled={isLoading}
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-ink text-[13px] font-medium text-white transition-all hover:bg-neutral-800 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                      ) : (
                        <>
                          <QrCode className="h-3.5 w-3.5" />
                          <span>{isEn ? `Pay ${plan.cnyPrice}` : `微信 / 支付宝支付 ${plan.cnyPrice}`}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 支持渠道图标标牌 */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-[12px] text-whisper">
        <span>{isEn ? 'Supported payment methods:' : '支持支付方式：'}</span>
        {region === 'domestic' ? (
          <div className="flex flex-wrap items-center gap-2 font-mono">
            <span className="rounded-md border border-line bg-white px-2.5 py-1 text-ink">微信支付</span>
            <span className="rounded-md border border-line bg-white px-2.5 py-1 text-ink">支付宝</span>
            <span className="rounded-md border border-line bg-white px-2.5 py-1 text-ink">招商银行 / 国内银联卡</span>
            <span className="rounded-md border border-line bg-white px-2.5 py-1 text-ink">卡密直充</span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 font-mono">
            <span className="rounded-md border border-line bg-white px-2.5 py-1 text-ink">PayPal</span>
            <span className="rounded-md border border-line bg-white px-2.5 py-1 text-ink">Visa</span>
            <span className="rounded-md border border-line bg-white px-2.5 py-1 text-ink">Mastercard</span>
            <span className="rounded-md border border-line bg-white px-2.5 py-1 text-ink">American Express</span>
            <span className="rounded-md border border-line bg-white px-2.5 py-1 text-ink">Apple Pay</span>
          </div>
        )}
      </div>

      {/* 官方卡密 / 兑换码直接充值区域 */}
      <div className="mt-14 rounded-[16px] border border-line bg-white p-7 sm:p-9 shadow-sm">
        <div className="max-w-[700px]">
          <div className="inline-flex items-center gap-2 text-whisper">
            <Gift className="h-4 w-4 text-ink" />
            <h3 className="font-display text-[12px] font-semibold tracking-[0.2em] text-ink uppercase">
              {isEn ? 'Redeem Points Code' : '卡密 / 礼品兑换码即时充值'}
            </h3>
          </div>

          <p className="mt-2 text-[13.5px] leading-[1.6] text-soft">
            {isEn
              ? 'Enter your 16-character official redemption code (e.g. YITA100-XXXXXX-XXXXXX) to credit points to your account instantly.'
              : '支持在小红书、微信、发卡网或客服处获取的 16 位官方卡密（格式如 YITA100-XXXXXX-XXXXXX），输入即时到账。'}
          </p>

          <form onSubmit={handleRedeem} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={redeemCode}
              onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
              placeholder={isEn ? 'Enter redemption code (YITA...)' : '请输入 16 位卡密兑换码 (如 YITA...)'}
              className="h-11 flex-1 rounded-full border border-line bg-mist/30 px-5 font-mono text-[13.5px] text-ink placeholder:text-whisper focus:border-ink focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={redeeming || !redeemCode.trim()}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-7 text-[13px] font-medium text-white transition-opacity hover:opacity-85 disabled:opacity-40"
            >
              {redeeming ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              ) : (
                <span>{isEn ? 'Redeem Now' : '立即兑换'}</span>
              )}
            </button>
          </form>

          {redeemSuccess ? (
            <p className="mt-3 text-[13px] font-medium text-emerald-700">{redeemSuccess}</p>
          ) : null}
          {redeemError ? (
            <p className="mt-3 text-[13px] font-medium text-red-600">{redeemError}</p>
          ) : null}
        </div>
      </div>

      {/* 国内扫码支付/人工卡密弹窗 */}
      {domesticModalOpen && domesticModalData ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-[460px] rounded-[18px] border border-line bg-white p-7 shadow-2xl">
            <button
              type="button"
              onClick={() => setDomesticModalOpen(false)}
              className="absolute right-5 top-5 text-whisper hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center">
              <span className="inline-flex items-center gap-1 rounded-full bg-mist px-3 py-1 text-[11px] font-medium text-ink">
                <span>🇨🇳 国内支付</span>
              </span>
              <h3 className="mt-3 font-serif text-[22px] font-normal text-ink">
                充值 {domesticModalData.points} 积分
              </h3>
              <p className="mt-1 text-[28px] font-semibold text-ink">
                {domesticModalData.amount}
              </p>
            </div>

            <div className="mt-6 rounded-[14px] border border-line bg-mist/30 p-5 text-center">
              {domesticModalData.qrUrl ? (
                <div>
                  <p className="text-[12.5px] text-whisper">请使用微信或支付宝扫描下方二维码：</p>
                  <div className="my-3 flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={domesticModalData.qrUrl}
                      alt="Payment QR"
                      className="h-48 w-48 rounded-lg border border-line bg-white p-2"
                    />
                  </div>
                  <p className="text-[12px] text-soft">支付成功后系统将自动到账</p>
                </div>
              ) : (
                <div className="space-y-3 text-left text-[13px] text-soft">
                  <div className="rounded-lg bg-white p-4 border border-line">
                    <p className="font-medium text-ink">方式一：卡密极速到账（推荐）</p>
                    <p className="mt-1 text-[12.5px] text-whisper">
                      可在淘宝/闲鱼/发卡网购买官方直充卡密，在页面下方直接输入兑换，秒级到账。
                    </p>
                  </div>
                  <div className="rounded-lg bg-white p-4 border border-line">
                    <p className="font-medium text-ink">方式二：人工微信扫码转账</p>
                    <p className="mt-1 text-[12.5px] text-whisper">
                      转账并备注注册邮箱，客服核对后将在 5 分钟内为您手工加分。
                    </p>
                    <p className="mt-2 text-[12px] font-mono text-ink">
                      官方客服微信：<span className="font-semibold select-all">yitarot_service</span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setDomesticModalOpen(false)}
                className="w-full rounded-full border border-line py-2.5 text-[13px] text-ink transition-colors hover:bg-mist"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
