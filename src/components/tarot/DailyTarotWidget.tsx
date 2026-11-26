'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getAllCards, DrawnCard } from '@/lib/tarot/deck';
import { getTarotEvidence } from '@/lib/tarot/waite-basis';
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

  const evidence = getTarotEvidence(card.slug, isReversed, isEn ? 'en' : 'zh');
  const sourceBase = evidence
    ? (evidence.sourceName.includes('Waite') ? evidence.sourceName : `A. E. Waite · ${evidence.sourceName}`)
    : '';
  const sourceLabel = evidence
    ? (evidence.sourceRef ? `${sourceBase} · ${evidence.sourceRef}` : sourceBase)
    : '';

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

          {/* 今日解读与文献依据 */}
          <div className="flex-1 space-y-4 text-xs font-serif leading-relaxed text-neutral-900 w-full">
            <div className="pb-3 border-b border-neutral-200">
              <span className="text-[11px] text-neutral-500 block uppercase tracking-wide">
                {t.todayArchetype} · {isEn ? 'Site daily slot' : '本站每日牌位'}
              </span>
              <h2 className="font-serif font-black text-lg text-black mt-0.5">
                {cardName}
                <span className="ml-2 text-xs font-normal text-neutral-500">
                  ({orientationStr} · {arcanaOrSuitLabel})
                </span>
              </h2>
            </div>

            <div>
              <span className="font-bold text-neutral-700 block mb-0.5">
                {isEn ? 'Verified Card Meaning' : '【核验牌义】'}
              </span>
              {evidence ? (
                <>
                  <p className="text-neutral-800 leading-normal">
                    {evidence.basisText}
                  </p>
                  <p className="mt-2 text-[11px] text-neutral-600">
                    {isEn ? 'Original source: ' : '原始文献依据：'}
                    <a
                      href={evidence.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black underline underline-offset-4 hover:text-neutral-600 focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2"
                    >
                      {sourceLabel}
                    </a>
                  </p>
                </>
              ) : (
                <p className="text-neutral-600 leading-normal">
                  {isEn
                    ? `No verified A. E. Waite source excerpt is currently available for ${cardName} (${orientationStr}).`
                    : `暂无「${cardName}（${orientationStr}）」对应的 A. E. Waite 原始文献核验释义。`}
                </p>
              )}
              <Link
                href={`/${isEn ? 'en' : 'zh'}/cards/${card.slug}`}
                className="mt-2 inline-flex min-h-[36px] items-center text-xs font-medium text-black underline underline-offset-4 hover:text-neutral-600 focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2"
              >
                {isEn ? `Explore ${cardName} full meaning →` : `查看「${cardName}」完整牌义 →`}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
