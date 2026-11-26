'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { drawRandomCards, DrawnCard } from '@/lib/tarot/deck';
import { TarotCardView } from './TarotCardView';
import { TarotEvidence } from './TarotEvidence';
import { RefreshCw } from 'lucide-react';

export function FreeDrawConsole({
  lang = 'zh',
  initialCount = 3,
}: {
  lang?: string;
  initialCount?: number;
}) {
  const isEn = lang === 'en';
  const validInitialCount = initialCount === 1 ? 1 : 3;

  const [cardCount, setCardCount] = useState<number>(validInitialCount);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  const shuffleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const cardCountRef = useRef<number>(validInitialCount);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (shuffleTimeoutRef.current) {
        clearTimeout(shuffleTimeoutRef.current);
        shuffleTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      if (!isMountedRef.current) return;
      const cards = drawRandomCards(validInitialCount);
      setDrawnCards(cards);
      const flipped: Record<number, boolean> = {};
      for (let i = 0; i < validInitialCount; i++) flipped[i] = true;
      setFlippedCards(flipped);
      setHasMounted(true);
    });
    return () => cancelAnimationFrame(frameId);
  }, [validInitialCount]);

  const handleCardCountChange = (count: number) => {
    if (shuffleTimeoutRef.current) {
      clearTimeout(shuffleTimeoutRef.current);
      shuffleTimeoutRef.current = null;
    }
    setIsShuffling(false);
    cardCountRef.current = count;
    setCardCount(count);
    const newCards = drawRandomCards(count);
    setDrawnCards(newCards);
    const flipped: Record<number, boolean> = {};
    for (let i = 0; i < count; i++) flipped[i] = true;
    setFlippedCards(flipped);
  };

  const handleShuffle = () => {
    if (shuffleTimeoutRef.current) {
      clearTimeout(shuffleTimeoutRef.current);
      shuffleTimeoutRef.current = null;
    }
    setIsShuffling(true);
    shuffleTimeoutRef.current = setTimeout(() => {
      shuffleTimeoutRef.current = null;
      if (!isMountedRef.current) return;
      const currentCount = cardCountRef.current;
      const newCards = drawRandomCards(currentCount);
      setDrawnCards(newCards);
      const flipped: Record<number, boolean> = {};
      for (let i = 0; i < currentCount; i++) flipped[i] = false;
      setFlippedCards(flipped);
      setIsShuffling(false);
    }, 400);
  };

  const toggleFlip = (index: number) => {
    setFlippedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const flipAll = () => {
    const currentCount = cardCountRef.current;
    const flipped: Record<number, boolean> = {};
    for (let i = 0; i < currentCount; i++) flipped[i] = true;
    setFlippedCards(flipped);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
      {/* 控制工具条 (Linear 极简风) */}
      <div className="w-full rounded-xl bg-white border border-[#111111]/10 p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* 卡牌数量切换 */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <span className="text-xs font-serif text-[#52525B]">
            {isEn ? 'Cards to draw:' : '抽取数量：'}
          </span>
          <div className="flex flex-wrap gap-1 justify-center" role="group" aria-label={isEn ? 'Number of cards to draw' : '抽牌数量选择'}>
            {[1, 2, 3, 4, 5, 6].map(num => {
              const isSelected = cardCount === num;
              return (
                <button
                  key={num}
                  type="button"
                  aria-pressed={isSelected}
                  aria-label={isEn ? `Draw ${num} card${num > 1 ? 's' : ''}` : `抽取 ${num} 张牌`}
                  onClick={() => handleCardCountChange(num)}
                  className={`w-8 h-8 rounded-lg text-xs font-serif transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#111111] text-white'
                      : 'bg-[#F5F5F6] text-[#52525B] hover:bg-[#E4E4E7]'
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>

        {/* 快捷操作按钮 */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={flipAll}
            className="px-3.5 py-1.5 rounded-lg bg-[#F5F5F6] hover:bg-[#E4E4E7] text-xs font-serif text-[#111111] border border-[#111111]/10 transition-colors cursor-pointer"
          >
            {isEn ? 'Flip All' : '全部翻开'}
          </button>
          <button
            type="button"
            onClick={handleShuffle}
            disabled={isShuffling}
            className="px-4 py-1.5 rounded-lg bg-[#111111] hover:bg-[#333333] text-xs font-serif text-white tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className={`w-3 h-3 ${isShuffling ? 'animate-spin' : ''}`} />
            <span>{isEn ? (cardCount === 1 ? 'Draw a Card' : 'Draw Again') : '重新洗牌'}</span>
          </button>
        </div>
      </div>

      {/* 卡牌阵列展示 */}
      {!hasMounted ? (
        <div
          className={`w-full ${validInitialCount === 1 ? 'flex justify-center' : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3'} gap-6 mb-10 justify-items-center`}
          aria-label={isEn ? 'Preparing cards...' : '洗牌准备中...'}
        >
          {Array.from({ length: validInitialCount }).map((_, i) => (
            <div
              key={i}
              className="w-full max-w-[260px] min-h-[440px] p-4 rounded-xl bg-white border border-[#E4E4E7] flex flex-col items-center justify-between"
            >
              <div className="w-full flex flex-col items-center mb-3">
                <span className="w-14 h-2.5 rounded bg-[#E4E4E7] animate-pulse block mb-1.5" />
                <span className="w-20 h-3.5 rounded bg-[#E4E4E7] animate-pulse block" />
              </div>
              <div className="relative w-28 h-48 sm:w-32 sm:h-56 rounded-2xl border border-[#E4E4E7] bg-[#F5F5F6] flex items-center justify-center shadow-xs">
                <div className="w-10 h-10 rounded-full border border-[#E4E4E7] border-t-[#171717] animate-spin" />
              </div>
              <div className="w-full mt-3 pt-3 border-t border-[#E4E4E7] flex flex-col items-center gap-1.5">
                <span className="w-full h-3 rounded bg-[#E4E4E7] animate-pulse" />
                <span className="w-3/4 h-2.5 rounded bg-[#E4E4E7] animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`w-full ${drawnCards.length === 1 ? 'flex justify-center' : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3'} gap-6 mb-10 justify-items-center`}>
          {drawnCards.map((drawn, index) => {
            const isFlipped = flippedCards[index] ?? false;
            const cardName = isEn ? drawn.card.nameEn : drawn.card.nameZh;
            const orientationStr = isEn
              ? (drawn.isReversed ? 'Reversed' : 'Upright')
              : (drawn.isReversed ? '逆位' : '正位');

            return (
              <div
                key={index}
                className="w-full max-w-[260px] p-4 rounded-xl bg-white border border-[#111111]/10 flex flex-col items-center justify-between hover:border-[#111111]/25 transition-all"
              >
                <div className="w-full text-center mb-3">
                  <span className="text-[10px] font-mono tracking-widest text-[#52525B] uppercase block">
                    CARD {index + 1}
                  </span>
                  <span className="text-xs font-serif font-bold text-[#111111]">
                    {cardName}
                  </span>
                  <span className="text-[10px] font-serif text-[#52525B] block">
                    ({orientationStr})
                  </span>
                </div>

                <div className="my-2">
                  <TarotCardView
                    card={drawn.card}
                    isReversed={drawn.isReversed}
                    isFlipped={isFlipped}
                    size="sm"
                    lang={isEn ? 'en' : 'zh'}
                    onFlip={() => toggleFlip(index)}
                  />
                </div>

                <div className="w-full mt-3 pt-3 border-t border-[#111111]/8 text-left space-y-2">
                  {isFlipped ? (
                    <TarotEvidence
                      slug={drawn.card.slug}
                      isReversed={drawn.isReversed}
                      lang={isEn ? 'en' : 'zh'}
                      compact
                    />
                  ) : (
                    <p className="text-[11px] font-serif leading-relaxed text-[#52525B]">
                      {isEn
                        ? 'Flip this card to view its historical source basis.'
                        : '翻开卡牌后查看对应的典籍牌义依据。'}
                    </p>
                  )}
                  <Link
                    href={`/${isEn ? 'en' : 'zh'}/cards/${drawn.card.slug}`}
                    className="inline-flex min-h-[36px] items-center text-[11px] font-medium text-[#171717] underline underline-offset-4 hover:text-[#52525B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
                  >
                    {isEn ? `Read ${cardName} meaning →` : `查看「${cardName}」完整牌义 →`}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 使用说明 */}
      <div className="w-full rounded-xl bg-white border border-[#111111]/10 p-6 sm:p-8 text-xs font-serif leading-relaxed text-[#111111] space-y-3">
        <h3 className="font-serif font-black text-base text-[#111111] pb-2 border-b border-[#111111]/8">
          {isEn ? 'How to Use This Free Draw' : '自由抽牌使用说明'}
        </h3>
        <p className="text-[#333333]">
          {isEn
            ? `You have drawn ${cardCount} card${cardCount > 1 ? 's' : ''}. Click any card to flip it, or use "Flip All" above. Each revealed card displays its orientation-specific text from A. E. Waite's The Pictorial Key to the Tarot alongside a link to the full card reference. Use these historical themes as prompts for your own observation rather than fixed predictions.`
            : `你当前抽取了 ${cardCount} 张卡牌。点击单张卡牌即可翻面，或使用上方「全部翻开」。每张翻开的卡牌都会展示对应的韦特《塔罗图钥》原始文献依据，并提供完整牌义详情页链接。请将文献主题作为自我观察的参考线索，而非既定预言。`}
        </p>
      </div>
    </div>
  );
}
