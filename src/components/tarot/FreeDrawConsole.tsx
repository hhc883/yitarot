'use client';

import React, { useState, useEffect, useRef } from 'react';
import { drawRandomCards, DrawnCard } from '@/lib/tarot/deck';
import { TarotCardView } from './TarotCardView';
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
      {/* 标题 */}
      <div className="w-full text-center mb-6">
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#111111] tracking-tight">
          {isEn ? 'Free Tarot Draw' : '自由抽牌'}
        </h1>
        <p className="text-xs sm:text-sm font-serif text-[#52525B] mt-1.5 max-w-md mx-auto">
          {isEn
            ? 'Free from fixed spread boundaries. Select 1 to 6 cards to mirror your present subconscious state.'
            : '无需固定牌阵束缚。自由设定抽取 1 至 6 张卡牌，探寻当下潜意识的真实镜像。'}
        </p>
      </div>

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
            <span>{isEn ? 'Reshuffle' : '重新洗牌'}</span>
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
              className="w-full max-w-[260px] min-h-[440px] p-4 rounded-xl bg-[#FFFDF9] border border-[#111111]/10 flex flex-col items-center justify-between"
            >
              <div className="w-full flex flex-col items-center mb-3">
                <span className="w-14 h-2.5 rounded bg-[#E4E4E7] animate-pulse block mb-1.5" />
                <span className="w-20 h-3.5 rounded bg-[#E4E4E7] animate-pulse block" />
              </div>
              <div className="relative w-28 h-48 sm:w-32 sm:h-56 rounded-2xl border border-[#C8A858]/30 bg-[#FAF6ED] flex items-center justify-center shadow-xs">
                <div className="w-10 h-10 rounded-full border border-[#C8A858]/30 border-t-[#111111] animate-spin" />
              </div>
              <div className="w-full mt-3 pt-3 border-t border-[#111111]/10 flex flex-col items-center gap-1.5">
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
            const meaning = drawn.isReversed
              ? drawn.card.reversedMeaning
              : drawn.card.uprightMeaning;

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
                    onFlip={() => toggleFlip(index)}
                  />
                </div>

                <div className="w-full mt-3 pt-3 border-t border-[#111111]/8 text-left">
                  <p className="text-[11px] font-serif leading-relaxed text-[#444444] line-clamp-3">
                    {meaning}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 综合启示 */}
      <div className="w-full rounded-xl bg-white border border-[#111111]/10 p-6 sm:p-8 text-xs font-serif leading-relaxed text-[#111111] space-y-3">
        <h3 className="font-serif font-black text-base text-[#111111] pb-2 border-b border-[#111111]/8">
          {isEn ? 'Subconscious Mirror & Synthesis' : '潜意识能量投射与综合启示'}
        </h3>
        <p className="text-[#333333]">
          {isEn
            ? `You have drawn ${cardCount} cards. When viewing multiple cards side by side, notice the elemental flow (fire, water, air, earth). Where your eye lands first often points to what your subconscious is currently prioritizing.`
            : `你当前共抽取了 ${cardCount} 张卡牌。多张卡牌并置时，观察元素能量的流转（权杖之火、圣杯之水、宝剑之风、星币之土）。视线停留最久的那张牌，往往映射出你当下最迫切需要觉察的心智焦点。`}
        </p>
      </div>
    </div>
  );
}
