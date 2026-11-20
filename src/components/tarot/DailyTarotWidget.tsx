'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getAllCards, DrawnCard } from '@/lib/tarot/deck';
import { ALL_CARD_DETAIL_EN } from '@/lib/tarot/card-detail-en';
import { TarotCardView } from './TarotCardView';
import { RotateCcw } from 'lucide-react';
import { getDictionary } from '@/lib/i18n/dict';

function computeDailyCard(): DrawnCard {
  const cards = getAllCards();
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = Math.abs(seed) % cards.length;
  const isReversed = (seed % 7) === 0;
  return {
    card: cards[index],
    isReversed
  };
}

export function DailyTarotWidget({ lang = 'zh' }: { lang?: string }) {
  const isEn = lang === 'en';
  const d = getDictionary(lang);
  const t = d.fortune;

  const [dailyCard, setDailyCard] = useState<DrawnCard | null>(null);
  const [currentDrawn, setCurrentDrawn] = useState<DrawnCard | null>(null);
  const [isRedrawn, setIsRedrawn] = useState(false);
  const [isFlipped, setIsFlipped] = useState(true);
  const [dateStr, setDateStr] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);

  const shuffleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. 客户端挂载后计算当日固定牌与日期字符串，避免 SSR/客户端日期与时区差异导致的 Hydration 不一致
  useEffect(() => {
    let active = true;
    const frameId = requestAnimationFrame(() => {
      if (!active) return;
      const initialDaily = computeDailyCard();
      setDailyCard(initialDaily);
      setCurrentDrawn(initialDaily);
      try {
        const today = new Date();
        setDateStr(
          today.toLocaleDateString(isEn ? 'en-US' : 'zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
          })
        );
      } catch {
        setDateStr(isEn ? 'Daily Tarot' : '每日一牌');
      }
    });

    return () => {
      active = false;
      cancelAnimationFrame(frameId);
      if (shuffleTimerRef.current) {
        clearTimeout(shuffleTimerRef.current);
        shuffleTimerRef.current = null;
      }
    };
  }, [isEn]);

  const handleReshuffle = () => {
    try {
      setErrorMessage(null);
      const cards = getAllCards();
      if (!cards || cards.length === 0) {
        throw new Error(isEn ? 'Unable to load deck.' : '无法加载牌组。');
      }

      // 清理前序未完成的定时器，防止重叠竞态与组件卸载后设值
      if (shuffleTimerRef.current) {
        clearTimeout(shuffleTimerRef.current);
        shuffleTimerRef.current = null;
      }

      const randomIndex = Math.floor(Math.random() * cards.length);
      const randomReversed = Math.random() > 0.6;
      setIsShuffling(true);
      setIsFlipped(false);

      shuffleTimerRef.current = setTimeout(() => {
        setCurrentDrawn({ card: cards[randomIndex], isReversed: randomReversed });
        setIsRedrawn(true);
        setIsFlipped(true);
        setIsShuffling(false);
        shuffleTimerRef.current = null;
      }, 300);
    } catch (err: unknown) {
      setIsShuffling(false);
      const fallback = isEn ? 'Draw failed, please try again.' : '抽牌失败，请重试。';
      setErrorMessage(err instanceof Error ? err.message : fallback);
    }
  };

  // 稳定的小尺寸骨架加载态，等待客户端挂载后基于本地日期种子确定今日卡牌
  if (!currentDrawn) {
    return (
      <div className="w-full max-w-3xl mx-auto px-2 sm:px-0">
        <header className="text-center mb-8">
          <span className="text-[11px] font-mono tracking-widest text-neutral-500 uppercase block mb-1">
            {isEn ? 'DAILY TAROT' : '今日灵感'}
          </span>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-black tracking-tight">
            {t.dailyTitle}
          </h1>
          <p className="text-xs sm:text-sm font-serif text-neutral-600 mt-2 max-w-md mx-auto">
            {t.dailySubtitle}
          </p>
        </header>
        <section className="rounded-2xl bg-white border border-neutral-200 p-8 text-center">
          <div className="inline-block w-8 h-8 rounded-full border-2 border-black border-t-transparent animate-spin motion-reduce:animate-none mb-3" />
          <p className="text-xs font-serif text-neutral-500">
            {isEn ? 'Preparing today’s reading...' : '正在演算今日指引...'}
          </p>
        </section>
      </div>
    );
  }

  const { card, isReversed } = currentDrawn;
  const orientationStr = isEn
    ? (isReversed ? 'Reversed' : 'Upright')
    : (isReversed ? '逆位' : '正位');
  const cardName = isEn ? card.nameEn : card.nameZh;

  // 英文版牌义检查：优先选用已校正的英文牌义，若仅有中文牌义则标记 lang="zh-CN" 并给出明确中英文提示
  const enDetail = isEn ? ALL_CARD_DETAIL_EN[card.slug] : null;
  const hasEnMeaning = Boolean(enDetail);
  const meaning = isEn
    ? (hasEnMeaning
        ? (isReversed ? enDetail!.reversedMeaning : enDetail!.uprightMeaning)
        : (isReversed ? card.reversedMeaning : card.uprightMeaning))
    : (isReversed ? card.reversedMeaning : card.uprightMeaning);

  const suitLabelZh: Record<string, string> = {
    wands: '权杖',
    cups: '圣杯',
    swords: '宝剑',
    pentacles: '星币'
  };
  const suitLabelEn: Record<string, string> = {
    wands: 'Wands',
    cups: 'Cups',
    swords: 'Swords',
    pentacles: 'Pentacles'
  };

  const arcanaOrSuitLabel = card.arcana === 'major'
    ? (isEn ? 'Major Arcana' : '大阿卡纳')
    : (isEn ? (card.suit ? suitLabelEn[card.suit] || card.suit : '') : (card.suit ? suitLabelZh[card.suit] || card.suit : ''));

  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-0">
      {/* 极简标题与说明 */}
      <header className="text-center mb-8">
        <span className="text-[11px] font-mono tracking-widest text-neutral-500 uppercase block mb-1">
          {dateStr || (isEn ? 'DAILY TAROT' : '今日灵感')}
        </span>
        <h1 className="font-serif font-black text-2xl sm:text-3xl text-black tracking-tight">
          {t.dailyTitle}
        </h1>
        <p className="text-xs sm:text-sm font-serif text-neutral-600 mt-2 max-w-md mx-auto">
          {t.dailySubtitle}
        </p>
      </header>

      {/* 异常状态提示 */}
      {errorMessage && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-6 p-3 rounded-lg border border-black bg-neutral-100 text-xs text-black font-medium text-center"
        >
          {errorMessage}
        </div>
      )}

      {/* 主卡片容器：黑白中性基调，保留原画色彩 */}
      <section className="rounded-2xl bg-white border border-neutral-200 p-5 sm:p-8 space-y-6">
        {/* 操作区：清晰标识初始默认每日一牌与再抽一张，提供键盘可访问性与 44px 最小触控区域 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-2 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider border ${
                isRedrawn
                  ? 'bg-neutral-100 text-neutral-800 border-neutral-300'
                  : 'bg-black text-white border-black'
              }`}
            >
              {isRedrawn
                ? (isEn ? 'Random Redraw' : '随机重抽')
                : (isEn ? 'Today’s Card' : '今日牌')}
            </span>
            {isRedrawn && dailyCard && (
              <button
                type="button"
                onClick={() => {
                  if (shuffleTimerRef.current) {
                    clearTimeout(shuffleTimerRef.current);
                    shuffleTimerRef.current = null;
                  }
                  setCurrentDrawn(dailyCard);
                  setIsRedrawn(false);
                  setIsFlipped(true);
                  setIsShuffling(false);
                }}
                className="text-xs text-neutral-600 underline hover:text-black focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2 min-h-[44px] inline-flex items-center px-2 py-1 cursor-pointer transition-colors"
              >
                {isEn ? 'Back to Today’s Card' : '回到今日牌'}
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleReshuffle}
            disabled={isShuffling}
            aria-label={isEn ? 'Draw another card' : '再抽一张'}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] min-w-[44px] rounded-lg border border-black bg-black text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2 text-xs sm:text-sm font-serif transition-colors cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isShuffling ? 'animate-spin motion-reduce:animate-none' : ''}`} />
            <span>{isEn ? 'Draw another card' : '再抽一张'}</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 pt-2">
          {/* 3D 卡牌艺术图稿展示 */}
          <div className="shrink-0 flex justify-center">
            <TarotCardView
              card={card}
              isReversed={isReversed}
              isFlipped={isFlipped}
              size="md"
              onFlip={() => setIsFlipped(!isFlipped)}
            />
          </div>

          {/* 今日解读与结构化指引 */}
          <div className="flex-1 space-y-4 text-xs font-serif leading-relaxed text-neutral-900 w-full">
            <div className="pb-3 border-b border-neutral-200">
              <span className="text-[11px] text-neutral-500 block uppercase tracking-wide">
                {t.todayArchetype}
              </span>
              <h2 className="font-serif font-black text-lg text-black mt-0.5">
                {cardName}
                <span className="ml-2 text-xs font-normal text-neutral-500">
                  ({orientationStr} · {arcanaOrSuitLabel})
                </span>
              </h2>
            </div>

            {/* 英文环境下若无英文牌义，给出明确提示及 zh-CN 语言标记 */}
            {isEn && !hasEnMeaning && (
              <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span>This card interpretation is currently available in Chinese.</span>
                <Link
                  href={`/zh/cards/${card.slug}`}
                  className="font-medium text-black underline hover:text-neutral-600 transition-colors inline-block focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2 min-h-[44px] sm:min-h-0 py-2 sm:py-0 inline-flex items-center"
                >
                  View in Chinese
                </Link>
              </div>
            )}

            <div>
              <span className="font-bold text-neutral-700 block mb-0.5">{t.resonance}</span>
              <p
                className="text-neutral-800 leading-normal"
                {...(isEn && !hasEnMeaning ? { lang: 'zh-CN' } : {})}
              >
                {meaning}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <span className="font-bold text-black block mb-1">{t.doTitle}</span>
                <p className="text-neutral-700 text-[11px] leading-relaxed">
                  {isEn
                    ? (isReversed
                        ? 'Slow down, accept imperfections, and gently declutter mental overload.'
                        : 'Communicate proactively, ground nurtured plans, and embrace fresh opportunities.')
                    : (isReversed
                        ? '放慢脚步，接纳不完美，清理过度负荷的心思。'
                        : '主动沟通表达，落实酝酿已久的想法，拥抱新的可能性。')}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <span className="font-bold text-black block mb-1">{t.dontTitle}</span>
                <p className="text-neutral-700 text-[11px] leading-relaxed">
                  {isEn
                    ? (isReversed
                        ? 'Evading core friction, clinging rigidly to old habits, or dwelling on past regrets.'
                        : 'Rushing ahead prematurely, ignoring subtle emotional cues, or overpromising.')
                    : (isReversed
                        ? '逃避关键冲突，固执己见，或沉溺于过去的无益情绪。'
                        : '急躁冒进，忽视细微感受，在未准备充分时仓促承诺。')}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-200">
              <span className="font-bold text-neutral-700 block mb-0.5">{t.reflectionTitle}</span>
              <p className="text-neutral-600 italic text-[11px] leading-relaxed">
                {t.reflectionQuestion}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
