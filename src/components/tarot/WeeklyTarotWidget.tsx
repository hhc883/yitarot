'use client';

import React, { useState } from 'react';
import { drawRandomCards, DrawnCard } from '@/lib/tarot/deck';
import { TarotCardView } from './TarotCardView';
import { RotateCcw } from 'lucide-react';

interface WeeklyAspect {
  title: string;
  enTitle: string;
  focus: string;
}

const ASPECTS: WeeklyAspect[] = [
  { title: '本周核心基调', enTitle: 'Theme & Anchor', focus: '全周能量底色与心境主线' },
  { title: '职场与专注', enTitle: 'Work & Mind', focus: '工作进度、专注力与攻坚方向' },
  { title: '情感与人际', enTitle: 'Heart & Bonds', focus: '亲密关系、社交互动与沟通' },
  { title: '财务与物质', enTitle: 'Wealth & Stability', focus: '开支理财、资源调度与稳态' },
  { title: '破局突破口', enTitle: 'Breakthrough', focus: '化解阻滞的最优行动切入点' }
];

export function WeeklyTarotWidget({ lang = 'zh' }: { lang?: string }) {
  const [cards, setCards] = useState<DrawnCard[]>(() => drawRandomCards(5));
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [flippedMap, setFlippedMap] = useState<Record<number, boolean>>({
    0: true, 1: true, 2: true, 3: true, 4: true
  });

  const handleShuffle = () => {
    const newCards = drawRandomCards(5);
    setCards(newCards);
    setSelectedIndex(0);
    setFlippedMap({ 0: true, 1: true, 2: true, 3: true, 4: true });
  };

  const currentAspect = ASPECTS[selectedIndex];
  const currentCard = cards[selectedIndex];

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* 极简标题 */}
      <div className="text-center mb-8">
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#111111] tracking-tight">
          周运塔罗
        </h1>
        <p className="text-xs sm:text-sm font-serif text-[#736B5E] mt-2">
          五维周运罗盘。全景扫描未来七天的核心基调、职场、情感、财务与破局机缘。
        </p>
      </div>

      {/* 核心卡片容器 */}
      <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-6 sm:p-8 shadow-2xs space-y-8">
        {/* 五维卡牌横排选择器 */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {cards.map((drawn, idx) => {
            const aspect = ASPECTS[idx];
            const isSelected = selectedIndex === idx;
            const isFlipped = flippedMap[idx] ?? true;

            return (
              <div
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col items-center ${
                  isSelected
                    ? 'bg-[#111111] text-[#FFFDF9] border-[#111111]'
                    : 'bg-[#FAF6ED] text-[#111111] border-[#111111]/10 hover:bg-[#F2ECE1]'
                }`}
              >
                <span
                  className={`text-[11px] font-serif font-bold mb-1 ${
                    isSelected ? 'text-[#FFFDF9]' : 'text-[#736B5E]'
                  }`}
                >
                  {aspect.title}
                </span>

                <div className="my-1 pointer-events-none">
                  <TarotCardView
                    card={drawn.card}
                    isReversed={drawn.isReversed}
                    isFlipped={isFlipped}
                    size="sm"
                  />
                </div>

                <div className="text-center mt-2 w-full">
                  <span className="text-[11px] font-serif block truncate font-bold">
                    {drawn.card.nameZh}
                  </span>
                  <span
                    className={`text-[10px] font-serif block ${
                      isSelected ? 'text-[#FFFDF9]/60' : 'text-[#736B5E]'
                    }`}
                  >
                    {drawn.isReversed ? '逆位' : '正位'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 选中的维度详细解读面板 */}
        <div className="p-6 rounded-xl bg-[#FAF6ED] border border-[#111111]/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#111111]/8">
            <div>
              <span className="text-[11px] font-mono tracking-wider text-[#736B5E] uppercase block">
                {currentAspect.enTitle}
              </span>
              <h3 className="font-serif font-black text-base text-[#111111]">
                {currentAspect.title} · {currentCard.card.nameZh}（{currentCard.isReversed ? '逆位' : '正位'}）
              </h3>
            </div>
            <span className="text-xs font-serif text-[#736B5E]">
              {currentAspect.focus}
            </span>
          </div>

          <div className="space-y-3 text-xs font-serif leading-relaxed text-[#111111]">
            <div>
              <span className="font-bold text-[#736B5E] block mb-0.5">【核心原型启示】</span>
              <p className="text-[#333333]">
                {currentCard.isReversed ? currentCard.card.reversedMeaning : currentCard.card.uprightMeaning}
              </p>
            </div>

            <div>
              <span className="font-bold text-[#736B5E] block mb-0.5">【七日行动切入建议】</span>
              <p className="text-[#333333]">
                在{currentAspect.title}方面，本周宜维持客观理性的节律。
                {currentCard.isReversed
                  ? '留意隐蔽的能量损耗，切勿强行推进行不通的旧模式，适度退让反而能赢得转圜空间。'
                  : '顺应当前清晰的正向动能，主动作出积极承诺与实质行动，把握本周的窗口期。'}
              </p>
            </div>
          </div>
        </div>

        {/* 底部洗牌操作 */}
        <div className="pt-2 border-t border-[#111111]/8 flex justify-center">
          <button
            type="button"
            onClick={handleShuffle}
            className="px-4 py-2 rounded-xl bg-[#FAF6ED] hover:bg-[#F2ECE1] text-xs font-serif text-[#111111] border border-[#111111]/10 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#736B5E]" />
            <span>重新抽取本周运势</span>
          </button>
        </div>
      </div>
    </div>
  );
}
