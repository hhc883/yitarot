'use client';

import React, { useState } from 'react';
import { drawRandomCards, DrawnCard } from '@/lib/tarot/deck';
import { TarotCardView } from './TarotCardView';
import { RefreshCw } from 'lucide-react';

export function FreeDrawConsole({ lang = 'zh' }: { lang?: string }) {
  const isEn = lang === 'en';
  const [cardCount, setCardCount] = useState<number>(3);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>(() => drawRandomCards(3));
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({ 0: true, 1: true, 2: true });
  const [isShuffling, setIsShuffling] = useState<boolean>(false);

  const handleCardCountChange = (count: number) => {
    setCardCount(count);
    const newCards = drawRandomCards(count);
    setDrawnCards(newCards);
    const flipped: Record<number, boolean> = {};
    for (let i = 0; i < count; i++) flipped[i] = true;
    setFlippedCards(flipped);
  };

  const handleShuffle = () => {
    setIsShuffling(true);
    setTimeout(() => {
      const newCards = drawRandomCards(cardCount);
      setDrawnCards(newCards);
      const flipped: Record<number, boolean> = {};
      for (let i = 0; i < cardCount; i++) flipped[i] = false;
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
    const flipped: Record<number, boolean> = {};
    for (let i = 0; i < cardCount; i++) flipped[i] = true;
    setFlippedCards(flipped);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
      {/* 标题 */}
      <div className="w-full text-center mb-6">
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#111111] tracking-tight">
          {isEn ? 'Free Tarot Draw' : '自由抽牌'}
        </h1>
        <p className="text-xs sm:text-sm font-serif text-[#736B5E] mt-1.5 max-w-md mx-auto">
          {isEn
            ? 'Free from fixed spread boundaries. Select 1 to 6 cards to mirror your present subconscious state.'
            : '无需固定牌阵束缚。自由设定抽取 1 至 6 张卡牌，探寻当下潜意识的真实镜像。'}
        </p>
      </div>

      {/* 控制工具条 (Linear 极简风) */}
      <div className="w-full rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-4 shadow-2xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* 卡牌数量切换 */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-serif text-[#736B5E]">
            {isEn ? 'Cards to draw:' : '抽取数量：'}
          </span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => handleCardCountChange(num)}
                className={`w-8 h-8 rounded-lg text-xs font-serif transition-all cursor-pointer ${
                  cardCount === num
                    ? 'bg-[#111111] text-[#FFFDF9]'
                    : 'bg-[#FAF6ED] text-[#736B5E] hover:bg-[#F2ECE1]'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* 快捷操作按钮 */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={flipAll}
            className="px-3.5 py-1.5 rounded-lg bg-[#FAF6ED] hover:bg-[#F2ECE1] text-xs font-serif text-[#111111] border border-[#111111]/10 transition-colors cursor-pointer"
          >
            {isEn ? 'Flip All' : '全部翻开'}
          </button>
          <button
            type="button"
            onClick={handleShuffle}
            disabled={isShuffling}
            className="px-4 py-1.5 rounded-lg bg-[#111111] hover:bg-[#333333] text-xs font-serif text-[#FFFDF9] tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className={`w-3 h-3 ${isShuffling ? 'animate-spin' : ''}`} />
            <span>{isEn ? 'Reshuffle' : '重新洗牌'}</span>
          </button>
        </div>
      </div>

      {/* 卡牌阵列展示 */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-10 justify-items-center">
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
              className="w-full max-w-[260px] p-4 rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 flex flex-col items-center justify-between shadow-2xs hover:border-[#111111]/25 transition-all"
            >
              <div className="w-full text-center mb-3">
                <span className="text-[10px] font-mono tracking-widest text-[#736B5E] uppercase block">
                  CARD {index + 1}
                </span>
                <span className="text-xs font-serif font-bold text-[#111111]">
                  {cardName}
                </span>
                <span className="text-[10px] font-serif text-[#736B5E] block">
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

      {/* 综合启示 */}
      <div className="w-full rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-6 sm:p-8 shadow-2xs text-xs font-serif leading-relaxed text-[#111111] space-y-3">
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
