'use client';

import React, { useState, useEffect } from 'react';
import { getAllCards, DrawnCard, TarotCardData } from '@/lib/tarot/deck';
import { TarotCardView } from './TarotCardView';
import { RotateCcw } from 'lucide-react';

function getDailyCard(): DrawnCard {
  const cards = getAllCards();
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % cards.length;
  const isReversed = (seed % 7) === 0; // 约1/7概率逆位
  return {
    card: cards[index],
    isReversed
  };
}

export function DailyTarotWidget({ lang = 'zh' }: { lang?: string }) {
  const [drawn, setDrawn] = useState<DrawnCard>(getDailyCard);
  const [isFlipped, setIsFlipped] = useState(true);
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const today = new Date();
    setDateStr(
      today.toLocaleDateString(lang === 'en' ? 'en-US' : 'zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      })
    );
  }, [lang]);

  const handleReshuffle = () => {
    const cards = getAllCards();
    const randomIndex = Math.floor(Math.random() * cards.length);
    const randomReversed = Math.random() > 0.6;
    setIsFlipped(false);
    setTimeout(() => {
      setDrawn({ card: cards[randomIndex], isReversed: randomReversed });
      setIsFlipped(true);
    }, 300);
  };

  const { card, isReversed } = drawn;
  const orientationStr = isReversed ? '逆位' : '正位';
  const meaning = isReversed ? card.reversedMeaning : card.uprightMeaning;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* 极简标题 */}
      <div className="text-center mb-8">
        <span className="text-[11px] font-mono tracking-widest text-[#736B5E] uppercase block mb-1">
          {dateStr || 'DAILY TAROT'}
        </span>
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#111111] tracking-tight">
          每日塔罗运势
        </h1>
        <p className="text-xs sm:text-sm font-serif text-[#736B5E] mt-2">
          清晨抽取专属原型卡牌，倾听当下心智的能量流动与行动指引。
        </p>
      </div>

      {/* 核心卡片容器 */}
      <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* 3D 卡牌 */}
          <div className="shrink-0 flex justify-center">
            <TarotCardView
              card={card}
              isReversed={isReversed}
              isFlipped={isFlipped}
              size="md"
              onFlip={() => setIsFlipped(!isFlipped)}
            />
          </div>

          {/* 今日解读 */}
          <div className="flex-1 space-y-4 text-xs font-serif leading-relaxed text-[#111111]">
            <div className="pb-3 border-b border-[#111111]/8">
              <span className="text-[11px] text-[#736B5E] block">今日主导能量原型</span>
              <h3 className="font-serif font-black text-lg text-[#111111] mt-0.5">
                {card.nameZh}
                <span className="ml-2 text-xs font-normal text-[#736B5E]">
                  ({orientationStr} · {card.nameEn})
                </span>
              </h3>
            </div>

            <div>
              <span className="font-bold text-[#736B5E] block mb-0.5">【心境共振】</span>
              <p className="text-[#333333]">{meaning}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-[#FAF6ED] border border-[#111111]/8">
                <span className="font-bold text-emerald-800 block mb-1">【宜 · 顺势作为】</span>
                <p className="text-[#333333] text-[11px]">
                  {isReversed
                    ? '放慢脚步，接纳不完美，清理过度负荷的心思。'
                    : '主动沟通表达，落实酝酿已久的想法，拥抱新的可能性。'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF6ED] border border-[#111111]/8">
                <span className="font-bold text-stone-700 block mb-1">【忌 · 觉察规避】</span>
                <p className="text-[#333333] text-[11px]">
                  {isReversed
                    ? '逃避关键冲突，固执己见，或沉溺于过去的无益情绪。'
                    : '急躁冒进，忽视细微感受，在未准备充分时仓促承诺。'}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#111111]/8">
              <span className="font-bold text-[#736B5E] block mb-0.5">【暮色静心题】</span>
              <p className="text-[#555555] italic text-[11px]">
                “今天在哪个瞬间，我最清晰地感受到了自己的真实心意？”
              </p>
            </div>
          </div>
        </div>

        {/* 重新抽牌按钮 */}
        <div className="pt-4 border-t border-[#111111]/8 flex justify-center">
          <button
            type="button"
            onClick={handleReshuffle}
            className="px-4 py-2 rounded-xl bg-[#FAF6ED] hover:bg-[#F2ECE1] text-xs font-serif text-[#111111] border border-[#111111]/10 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#736B5E]" />
            <span>重新感应抽牌</span>
          </button>
        </div>
      </div>
    </div>
  );
}
