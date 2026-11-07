'use client';

import React, { useState } from 'react';
import { drawRandomCards, DrawnCard } from '@/lib/tarot/deck';
import { TarotCardView } from './TarotCardView';
import { RefreshCw, Sparkles, Plus, Trash2 } from 'lucide-react';

export function FreeDrawConsole({ lang = 'zh' }: { lang?: string }) {
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
          {lang === 'en' ? 'Free Tarot Draw' : '自由抽牌'}
        </h1>
        <p className="text-xs sm:text-sm font-serif text-[#736B5E] mt-1.5 max-w-md mx-auto">
          无需固定牌阵束缚。自由设定抽取 1 至 6 张卡牌，探寻当下潜意识的真实镜像。
        </p>
      </div>

      {/* 控制工具条 (Linear 极简风) */}
      <div className="w-full rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-4 shadow-2xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* 卡牌数量切换 */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-serif text-[#736B5E]">抽取数量：</span>
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
            全部翻开
          </button>
          <button
            type="button"
            onClick={handleShuffle}
            disabled={isShuffling}
            className="px-4 py-1.5 rounded-lg bg-[#111111] hover:bg-[#333333] text-xs font-serif text-[#FFFDF9] tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className={`w-3 h-3 ${isShuffling ? 'animate-spin' : ''}`} />
            <span>重新洗牌</span>
          </button>
        </div>
      </div>

      {/* 卡牌台面展示区 */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8 justify-items-center">
        {drawnCards.map((dc, idx) => {
          const isFlipped = !!flippedCards[idx];
          return (
            <div
              key={idx}
              className="flex flex-col items-center p-4 rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 shadow-2xs w-full max-w-[280px] transition-all hover:border-[#111111]/30"
            >
              <div className="w-full flex items-center justify-between text-xs font-serif text-[#736B5E] mb-3 border-b border-[#111111]/6 pb-2">
                <span>位置 {idx + 1}</span>
                <button
                  type="button"
                  onClick={() => toggleFlip(idx)}
                  className="text-[11px] text-[#8C6D23] hover:underline cursor-pointer"
                >
                  {isFlipped ? '合上' : '翻开'}
                </button>
              </div>

              {/* 3D 牌面 */}
              <div
                onClick={() => toggleFlip(idx)}
                className="cursor-pointer transition-transform duration-300 hover:scale-102 my-1"
              >
                <TarotCardView
                  card={dc.card}
                  isReversed={dc.isReversed}
                  isFlipped={isFlipped}
                  size="md"
                  showDetails={isFlipped}
                />
              </div>

              {/* 牌名与含义精析 */}
              <div className="w-full text-center mt-3 pt-2 border-t border-[#111111]/6 min-h-[58px]">
                {isFlipped ? (
                  <div>
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="font-serif font-bold text-sm text-[#111111]">
                        {dc.card.nameZh}
                      </span>
                      <span className={`text-[10px] font-serif px-1.5 py-0.5 rounded-sm ${
                        dc.isReversed ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {dc.isReversed ? '逆位' : '正位'}
                      </span>
                    </div>
                    <p className="text-[11px] font-serif text-[#524B40] mt-1 line-clamp-2 leading-relaxed">
                      {dc.isReversed ? dc.card.reversedMeaning : dc.card.uprightMeaning}
                    </p>
                  </div>
                ) : (
                  <span className="text-xs font-serif text-[#736B5E] leading-loose">
                    点击牌背翻开象征
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 综合神谕启示 */}
      <div className="w-full rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-6 shadow-2xs">
        <h4 className="font-serif font-bold text-sm text-[#111111] mb-2 border-b border-[#111111]/6 pb-2">
          自由牌阵能量流转
        </h4>
        <p className="text-xs font-serif text-[#524B40] leading-relaxed">
          当前抽取了 {cardCount} 张牌。
          {drawnCards.filter((_, idx) => flippedCards[idx]).map(c => `【${c.card.nameZh}（${c.isReversed ? '逆位' : '正位'}）】`).join('、')}
          共同构建了当下的意念场。首张牌象征当前的潜意识原点，后续展开映射出行动节奏与最终落点。在静默中聆听内心最初的直觉感应。
        </p>
      </div>
    </div>
  );
}
