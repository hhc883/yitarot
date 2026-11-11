'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export interface CurrentUser {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string;
}

export interface UserState {
  loading: boolean;
  user: CurrentUser | null;
  balance: number;
  /** 北京时间今日是否已领取每日积分 */
  dailyClaimed: boolean;
}

/**
 * 客户端登录态 + 积分余额（余额来自 /api/me，即账本求和）。
 * 订阅 Supabase auth 事件，登录 / 退出后自动刷新。
 */
export function useUser() {
  const [state, setState] = useState<UserState>({
    loading: true,
    user: null,
    balance: 0,
    dailyClaimed: false
  });
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/me', { cache: 'no-store' });
      if (res.status === 401) {
        setState({ loading: false, user: null, balance: 0, dailyClaimed: false });
        return;
      }
      if (!res.ok) {
        setState((prev) => ({ ...prev, loading: false }));
        return;
      }
      const data = (await res.json()) as {
        user: CurrentUser;
        balance: number;
        daily_claimed: boolean;
      };
      setState({
        loading: false,
        user: data.user,
        balance: data.balance ?? 0,
        dailyClaimed: Boolean(data.daily_claimed)
      });
    } catch {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    // INITIAL_SESSION 在订阅时立即触发，作为首次加载；之后的登录 / 退出事件再刷新
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event) => {
      if (
        event === 'INITIAL_SESSION' ||
        event === 'SIGNED_IN' ||
        event === 'SIGNED_OUT' ||
        event === 'USER_UPDATED'
      ) {
        void refresh();
      }
    });
    return () => subscription.unsubscribe();
  }, [refresh, supabase]);

  return { ...state, refresh };
}
