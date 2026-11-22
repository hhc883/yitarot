'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CONTAINER } from './constants';
import { UserAvatar } from './UserAvatar';
import { useUser } from '@/lib/auth/use-user';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { READING_COST } from '@/lib/points/constants';
import { getSavedReadings, deleteSavedReading, type SavedReading } from '@/lib/storage/reading-history';
import { MarkdownView } from '@/components/common/MarkdownView';
import { ChevronDown, ChevronUp, Copy, Check, Trash2, MessageSquare, BookOpen } from 'lucide-react';

interface LedgerEntry {
  id: number;
  kind: string;
  amount: number;
  balance_after: number;
  ref_id: string | null;
  created_at: string;
}

const KIND_LABELS: Record<string, [string, string]> = {
  signup_bonus: ['注册奖励', 'Signup bonus'],
  daily_claim: ['每日领取', 'Daily claim'],
  purchase: ['购买积分', 'Purchase'],
  reading_spend: ['测算消费', 'Reading'],
  refund: ['积分退还', 'Refund'],
  expire: ['积分过期', 'Expired']
};

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function AccountClient({ lang = 'zh' }: { lang?: string }) {
  const isEn = lang === 'en';
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const { loading, user, balance, dailyClaimed, refresh } = useUser();

  const [ledger, setLedger] = useState<LedgerEntry[] | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState('');
  const [savedReadings, setSavedReadings] = useState<SavedReading[]>([]);
  const [expandedReadingId, setExpandedReadingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setSavedReadings(getSavedReadings());
  }, []);

  const handleCopySaved = (reading: SavedReading) => {
    let full = isEn ? `【YiTarot · Divination Record】\n` : `【YiTarot · 测算档案】\n`;
    full += `${isEn ? 'Title' : '标题'}：${reading.title}\n`;
    if (reading.question) full += `${isEn ? 'Inquiry' : '事项'}：${reading.question}\n`;
    if (reading.cards?.length) {
      full += `${isEn ? 'Spread' : '牌阵'}：${reading.cards.map(c => `${c.position} - ${c.name}${c.isReversed ? ' (逆位)' : ''}`).join('; ')}\n`;
    }
    if (reading.hexagram) {
      full += `${isEn ? 'Hexagram' : '卦象'}：本卦 ${reading.hexagram.primary}${reading.hexagram.transformed ? ` -> 变卦 ${reading.hexagram.transformed}` : ''}\n`;
    }
    full += `\n【${isEn ? 'Report' : '解读正文'}】\n${reading.fullContent}\n`;
    if (reading.chatHistory?.length) {
      full += `\n【${isEn ? 'Follow-up Dialogues' : '追问对话'}】\n`;
      reading.chatHistory.forEach(m => {
        full += `${m.role === 'user' ? (isEn ? 'Q: ' : '问：') : (isEn ? 'A: ' : '答：')}${m.text}\n`;
      });
    }
    navigator.clipboard.writeText(full);
    setCopiedId(reading.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteSaved = (id: string) => {
    deleteSavedReading(id);
    setSavedReadings(prev => prev.filter(r => r.id !== id));
    if (expandedReadingId === id) setExpandedReadingId(null);
  };

  // 未登录 → 登录页
  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/${lang}/login`);
    }
  }, [loading, user, router, lang]);

  const loadLedger = useCallback(async () => {
    try {
      const res = await fetch('/api/points/ledger', { cache: 'no-store' });
      if (res.status === 401) return null;
      const data = (await res.json()) as { entries: LedgerEntry[] };
      return data.entries ?? [];
    } catch {
      return [];
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    void loadLedger().then((entries) => {
      if (!cancelled && entries !== null) setLedger(entries);
    });
    return () => {
      cancelled = true;
    };
  }, [user, loadLedger]);

  const handleClaim = async () => {
    if (claiming || dailyClaimed) return;
    setClaiming(true);
    setClaimError('');
    try {
      const res = await fetch('/api/points/daily-claim', { method: 'POST' });
      if (res.status === 401) {
        router.replace(`/${lang}/login`);
        return;
      }
      const data = (await res.json()) as { status?: string; message?: string };
      if (data.status === 'ok') {
        await refresh();
        await loadLedger();
      } else if (data.status === 'already_claimed') {
        await refresh();
      } else {
        setClaimError(isEn ? 'Claim failed, please retry.' : '领取失败，请稍后重试。');
      }
    } catch {
      setClaimError(isEn ? 'Claim failed, please retry.' : '领取失败，请稍后重试。');
    } finally {
      setClaiming(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace(`/${lang}`);
    router.refresh();
  };

  if (loading || !user) {
    return (
      <div className={`${CONTAINER} flex min-h-[60svh] items-center justify-center py-24`}>
        <p className="text-[13px] text-whisper">{isEn ? 'Loading…' : '加载中…'}</p>
      </div>
    );
  }

  return (
    <div className={`${CONTAINER} pb-24 pt-16 lg:pt-24`}>
      {/* 用户信息 + 退出 */}
      <div className="mkt-rise flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <UserAvatar user={user} size={56} />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-medium text-ink">{user.display_name || user.email}</p>
            <p className="mt-0.5 truncate text-[12.5px] text-whisper">{user.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="shrink-0 rounded-full border border-line px-4 py-2 text-[12.5px] text-soft transition-colors hover:border-ink/25 hover:text-ink"
        >
          {isEn ? 'Sign out' : '退出登录'}
        </button>
      </div>

      {/* 余额大数字 */}
      <div className="mkt-rise mkt-rise-1 mt-12">
        <p className="text-[12px] tracking-[0.14em] text-whisper">
          {isEn ? 'CURRENT BALANCE' : '当前积分'}
        </p>
        <p className="mt-2 font-serif text-[56px] leading-none text-ink tabular-nums lg:text-[64px]">
          {balance}
        </p>
      </div>

      {/* 每日领取 */}
      <div className="mkt-rise mkt-rise-2 mt-12 rounded-[14px] border border-line bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[16px] font-semibold text-ink">
              {isEn ? 'Daily claim' : '每日领取'}
            </h2>
            <p className="mt-1.5 text-[13px] text-soft">
              {isEn
                ? `Claim ${READING_COST} free points today, resets at midnight (UTC+8).`
                : `今日可领 ${READING_COST} 积分，北京时间每日 00:00 重置。`}
            </p>
            {claimError ? <p className="mt-1.5 text-[12px] text-[#B84034]">{claimError}</p> : null}
          </div>

          <button
            type="button"
            onClick={handleClaim}
            disabled={claiming || dailyClaimed}
            className={`inline-flex h-11 shrink-0 items-center justify-center rounded-full px-6 text-[13px] transition-opacity sm:w-auto ${
              dailyClaimed
                ? 'cursor-default bg-mist text-whisper'
                : 'bg-ink text-white hover:opacity-80 disabled:opacity-50'
            }`}
          >
            {dailyClaimed
              ? isEn
                ? 'Claimed today'
                : '今日已领取'
              : claiming
                ? isEn
                  ? 'Claiming…'
                  : '领取中…'
                : isEn
                  ? `Claim ${READING_COST} points`
                  : `领取今日 ${READING_COST} 积分`}
          </button>
        </div>
      </div>

      {/* 测算与会话档案 */}
      <div className="mkt-rise mkt-rise-3 mt-12">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-semibold text-ink">
              {isEn ? 'Saved readings & conversations' : '测算与会话档案'}
            </h2>
            <p className="mt-1 text-[12.5px] text-whisper">
              {isEn
                ? 'Review your past I Ching, Tarot, and BaZi interpretations and follow-up dialogues.'
                : '回顾你过往的六爻、塔罗与八字推演报告及追问问答。'}
            </p>
          </div>
          <span className="text-[12px] font-mono text-soft tabular-nums">
            {savedReadings.length} {isEn ? 'records' : '条档案'}
          </span>
        </div>

        <div className="mt-4 border-t border-line">
          {savedReadings.length === 0 ? (
            <div className="py-10 text-center text-[13px] text-whisper">
              <BookOpen className="mx-auto mb-2 h-5 w-5 text-whisper" />
              <p>{isEn ? 'No saved divination dialogues yet. Start a reading to record.' : '暂无保存的测算对话。发起一次六爻或塔罗占卜后将自动在此归档。'}</p>
            </div>
          ) : (
            <div className="divide-y divide-line">
              {savedReadings.map((item) => {
                const isExpanded = expandedReadingId === item.id;
                const isCopied = copiedId === item.id;
                return (
                  <div key={item.id} className="py-4.5 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-block rounded-full bg-mist px-2.5 py-0.5 text-[11px] font-medium text-ink">
                            {item.type === 'liuyao' ? (isEn ? 'I Ching' : '纳甲六爻') : item.type === 'tarot' ? (isEn ? 'Tarot' : '塔罗牌阵') : (isEn ? 'BaZi' : '八字命理')}
                          </span>
                          <h3 className="truncate font-serif text-[15px] font-medium text-ink">
                            {item.title}
                          </h3>
                        </div>
                        {item.question && (
                          <p className="mt-1 truncate text-[12.5px] text-soft">
                            {isEn ? 'Inquiry: ' : '事项：'}{item.question}
                          </p>
                        )}
                        <p className="mt-1 text-[11px] font-mono text-whisper">
                          {formatDateTime(item.timestamp)}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
                        <button
                          type="button"
                          onClick={() => handleCopySaved(item)}
                          title={isEn ? 'Copy full record' : '复制完整档案'}
                          className="flex h-8 items-center gap-1 rounded-full border border-line px-3 text-[12px] text-soft transition-colors hover:border-ink/30 hover:text-ink cursor-pointer"
                        >
                          {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                          <span className="hidden sm:inline">{isCopied ? (isEn ? 'Copied' : '已复制') : (isEn ? 'Copy' : '复制')}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSaved(item.id)}
                          title={isEn ? 'Delete record' : '删除此记录'}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-whisper transition-colors hover:border-red-300 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setExpandedReadingId(isExpanded ? null : item.id)}
                          className="flex h-8 items-center gap-1 rounded-full bg-ink px-3 text-[12px] text-white transition-opacity hover:opacity-80 cursor-pointer"
                        >
                          <span>{isExpanded ? (isEn ? 'Collapse' : '收起') : (isEn ? 'View' : '查看完整报告')}</span>
                          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 rounded-xl border border-line bg-mist/30 p-5 animate-in fade-in space-y-4">
                        <MarkdownView content={item.fullContent} className="text-[13px] sm:text-[13.5px] leading-relaxed text-ink" />

                        {item.chatHistory && item.chatHistory.length > 0 && (
                          <div className="border-t border-line pt-4 space-y-3">
                            <h4 className="flex items-center gap-1.5 font-serif text-[13px] font-semibold text-ink">
                              <MessageSquare className="h-3.5 w-3.5" />
                              <span>{isEn ? 'Follow-up Dialogues' : '追问与问答记录'}</span>
                            </h4>
                            <div className="space-y-2.5">
                              {item.chatHistory.map((m, idx) => (
                                <div
                                  key={idx}
                                  className={`rounded-lg p-3 text-xs leading-relaxed ${
                                    m.role === 'user' ? 'bg-white border border-line text-ink font-medium' : 'bg-mist/80 text-soft'
                                  }`}
                                >
                                  <span className="font-semibold text-ink mr-1.5">{m.role === 'user' ? (isEn ? 'Q: ' : '问：') : (isEn ? 'A: ' : '答：')}</span>
                                  <MarkdownView content={m.text} className="inline text-xs" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 积分流水 */}
      <div className="mkt-rise mkt-rise-3 mt-12">
        <h2 className="text-[16px] font-semibold text-ink">{isEn ? 'Points history' : '积分流水'}</h2>

        <div className="mt-4 border-t border-line">
          {ledger === null ? (
            <p className="py-8 text-[13px] text-whisper">{isEn ? 'Loading…' : '加载中…'}</p>
          ) : ledger.length === 0 ? (
            <p className="py-8 text-[13px] text-whisper">
              {isEn ? 'No point records yet.' : '暂无积分记录。'}
            </p>
          ) : (
            <ul>
              {ledger.map((entry) => {
                const label = KIND_LABELS[entry.kind]?.[isEn ? 1 : 0] ?? entry.kind;
                const positive = entry.amount > 0;
                return (
                  <li
                    key={entry.id}
                    className="flex items-center justify-between gap-4 border-b border-line py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[13.5px] text-ink">{label}</p>
                      <p className="mt-0.5 text-[11.5px] text-whisper">{formatDateTime(entry.created_at)}</p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p
                        className={`text-[14px] tabular-nums ${positive ? 'text-ink' : 'text-soft'}`}
                      >
                        {positive ? `+${entry.amount}` : `−${Math.abs(entry.amount)}`}
                      </p>
                      <p className="mt-0.5 text-[11.5px] text-whisper tabular-nums">
                        {isEn ? 'Balance' : '余额'} {entry.balance_after}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
