'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { READING_COST } from '@/lib/points/constants';

type ConsumeResult = { ok: true; ref_id: string } | { ok: false };

interface PointsGate {
  /** 测算前扣分：成功返回 ref_id（传给测算 API 做服务端校验），失败已弹窗提示 */
  consume: (type: string) => Promise<ConsumeResult>;
}

const PointsGateContext = createContext<PointsGate | null>(null);

const noopGate: PointsGate = {
  // Provider 未挂载的兜底（正常不会走到）
  consume: async () => ({ ok: false })
};

export function usePointsGate(): PointsGate {
  return useContext(PointsGateContext) ?? noopGate;
}

type ModalState =
  | { kind: 'insufficient'; balance: number; need: number }
  | { kind: 'login' }
  | { kind: 'error'; message: string }
  | null;

function randomRef(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `r-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
  }
}

/**
 * 积分网关：挂载在根布局，全站可用。
 * 测算组件调用 consume() → /api/readings/consume（服务端事务扣分 + 幂等），
 * 402 时弹出「积分不足」弹窗。
 */
export function PointsGateProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() || '';
  const lang = pathname.split('/').filter(Boolean)[0] === 'en' ? 'en' : 'zh';
  const [modal, setModal] = useState<ModalState>(null);

  const consume = useCallback(async (type: string): Promise<ConsumeResult> => {
    const refId = randomRef();
    try {
      const res = await fetch('/api/readings/consume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, ref_id: refId })
      });

      if (res.ok) {
        return { ok: true, ref_id: refId };
      }

      if (res.status === 401) {
        setModal({ kind: 'login' });
        return { ok: false };
      }

      if (res.status === 402) {
        const data = (await res.json().catch(() => ({}))) as { balance?: number; need?: number };
        setModal({
          kind: 'insufficient',
          balance: data.balance ?? 0,
          need: data.need ?? READING_COST
        });
        return { ok: false };
      }

      setModal({ kind: 'error', message: lang === 'en' ? 'Points service is unavailable, please retry.' : '积分服务暂时不可用，请稍后重试。' });
      return { ok: false };
    } catch {
      setModal({ kind: 'error', message: lang === 'en' ? 'Network hiccup, please retry.' : '网络波动，请稍后重试。' });
      return { ok: false };
    }
  }, [lang]);

  const value = useMemo(() => ({ consume }), [consume]);

  const close = useCallback(() => setModal(null), []);

  // Esc 关闭
  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModal(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modal]);

  const go = useCallback(
    (path: string) => {
      setModal(null);
      router.push(path);
    },
    [router]
  );

  const isEn = lang === 'en';

  return (
    <PointsGateContext.Provider value={value}>
      {children}

      {modal ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 px-6"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={isEn ? 'Not enough points' : '积分不足'}
        >
          <div
            className="w-full max-w-[400px] rounded-[16px] bg-white p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h2 className="font-serif text-[22px] font-normal tracking-[-0.01em] text-ink">
                {modal.kind === 'insufficient'
                  ? isEn
                    ? 'Not enough points'
                    : '积分不足'
                  : modal.kind === 'login'
                    ? isEn
                      ? 'Sign in required'
                      : '请先登录'
                    : isEn
                      ? 'Notice'
                      : '提示'}
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label={isEn ? 'Close' : '关闭'}
                className="-mr-1 -mt-1 flex h-8 w-8 items-center justify-center rounded-full text-whisper transition-colors hover:text-ink"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                  <path d="M1 1l12 12M13 1L1 13" />
                </svg>
              </button>
            </div>

            <p className="mt-4 text-[13.5px] leading-[1.7] text-soft">
              {modal.kind === 'insufficient'
                ? isEn
                  ? `This reading needs ${modal.need} points, you currently have ${modal.balance}.`
                  : `本次测算需要 ${modal.need} 积分，你当前只有 ${modal.balance} 积分。`
                : modal.kind === 'login'
                  ? isEn
                    ? 'Sign in to claim your daily free points and start readings.'
                    : '登录后即可领取每日积分并开始测算。'
                  : modal.message}
            </p>

            <div className="mt-7 flex flex-col gap-3">
              {modal.kind === 'insufficient' ? (
                <>
                  <button
                    type="button"
                    onClick={() => go(`/${lang}/account`)}
                    className="h-11 w-full rounded-full bg-ink text-[13.5px] text-white transition-opacity hover:opacity-80"
                  >
                    {isEn ? 'Claim today’s points' : '去领取今日积分'}
                  </button>
                  <button
                    type="button"
                    onClick={() => go(`/${lang}/pricing`)}
                    className="h-11 w-full rounded-full border border-ink bg-white text-[13.5px] text-ink transition-colors hover:bg-mist"
                  >
                    {isEn ? 'Buy points' : '去购买积分'}
                  </button>
                </>
              ) : modal.kind === 'login' ? (
                <>
                  <button
                    type="button"
                    onClick={() => go(`/${lang}/login`)}
                    className="h-11 w-full rounded-full bg-ink text-[13.5px] text-white transition-opacity hover:opacity-80"
                  >
                    {isEn ? 'Sign in' : '去登录'}
                  </button>
                  <button
                    type="button"
                    onClick={() => go(`/${lang}/pricing`)}
                    className="h-11 w-full rounded-full border border-ink bg-white text-[13.5px] text-ink transition-colors hover:bg-mist"
                  >
                    {isEn ? 'Buy points' : '去购买积分'}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={close}
                  className="h-11 w-full rounded-full bg-ink text-[13.5px] text-white transition-opacity hover:opacity-80"
                >
                  {isEn ? 'OK' : '知道了'}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </PointsGateContext.Provider>
  );
}
