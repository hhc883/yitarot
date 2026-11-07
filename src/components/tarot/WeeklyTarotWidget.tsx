'use client';

import React, { useState } from 'react';
import { drawRandomCards, DrawnCard } from '@/lib/tarot/deck';
import { TarotCardView } from './TarotCardView';
import { RotateCcw } from 'lucide-react';
import { getDictionary } from '@/lib/i18n/dict';

interface WeeklyAspect {
  titleZh: string;
  titleEn: string;
  focusZh: string;
  focusEn: string;
}

const ASPECTS: WeeklyAspect[] = [
  { titleZh: '本周核心基调', titleEn: 'Theme & Anchor', focusZh: '全周能量底色与心境主线', focusEn: 'Core energetic baseline & mind' },
  { titleZh: '职场与专注', titleEn: 'Work & Mind', focusZh: '工作进度、专注力与攻坚方向', focusEn: 'Professional execution & clarity' },
  { titleZh: '情感与人际', titleEn: 'Heart & Bonds', focusZh: '亲密关系、社交互动与沟通', focusEn: 'Interpersonal warmth & connection' },
  { titleZh: '财务与物质', titleEn: 'Wealth & Stability', focusZh: '开支理财、资源调度与稳态', focusEn: 'Financial security & resources' },
  { titleZh: '破局突破口', titleEn: 'Breakthrough', focusZh: '化解阻滞的最优行动切入点', focusEn: 'Strategic pivot & action leverage' }
];

export function WeeklyTarotWidget({ lang = 'zh' }: { lang?: string }) {
  const isEn = lang === 'en';
  const d = getDictionary(lang);
  const t = d.fortune;

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
  const aspectTitle = isEn ? currentAspect.titleEn : currentAspect.titleZh;
  const aspectFocus = isEn ? currentAspect.focusEn : currentAspect.focusZh;
  const cardName = isEn ? currentCard.card.nameEn : currentCard.card.nameZh;
  const orientationStr = isEn
    ? (currentCard.isReversed ? 'Reversed' : 'Upright')
    : (currentCard.isReversed ? '逆位' : '正位');

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* 极简标题 */}
      <div className="text-center mb-8">
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#111111] tracking-tight">
          {t.weeklyTitle}
        </h1>
        <p className="text-xs sm:text-sm font-serif text-[#736B5E] mt-2">
          {t.weeklySubtitle}
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
            const itemTitle = isEn ? aspect.titleEn : aspect.titleZh;
            const itemCardName = isEn ? drawn.card.nameEn : drawn.card.nameZh;

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
                  className={`text-[11px] font-serif font-bold mb-1 truncate max-w-full ${
                    isSelected ? 'text-[#FFFDF9]' : 'text-[#736B5E]'
                  }`}
                >
                  {itemTitle}
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
                    {itemCardName}
                  </span>
                  <span
                    className={`text-[10px] font-serif block ${
                      isSelected ? 'text-[#FFFDF9]/60' : 'text-[#736B5E]'
                    }`}
                  >
                    {isEn ? (drawn.isReversed ? 'Reversed' : 'Upright') : (drawn.isReversed ? '逆位' : '正位')}
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
                {currentAspect.titleEn}
              </span>
              <h3 className="font-serif font-black text-base text-[#111111]">
                {aspectTitle} · {cardName}（{orientationStr}）
              </h3>
            </div>
            <span className="text-xs font-serif text-[#736B5E]">
              {aspectFocus}
            </span>
          </div>

          <div className="space-y-3 text-xs font-serif leading-relaxed text-[#111111]">
            <div>
              <span className="font-bold text-[#736B5E] block mb-0.5">
                {isEn ? '【Archetypal Insight】' : '【核心原型启示】'}
              </span>
              <p className="text-[#333333]">
                {currentCard.isReversed ? currentCard.card.reversedMeaning : currentCard.card.uprightMeaning}
              </p>
            </div>

            <div>
              <span className="font-bold text-[#736B5E] block mb-0.5">
                {isEn ? '【Actionable Guidance】' : '【七日行动切入建议】'}
              </span>
              <p className="text-[#333333]">
                {isEn
                  ? `Regarding ${currentAspect.titleEn}, maintain grounded pacing this week. ${
                      currentCard.isReversed
                        ? 'Beware of energy drain from unworkable routines. Yielding minor ground often yields superior strategic leverage.'
                        : 'Align with the clear positive momentum. Step forward with authentic commitment and embrace the weekly window.'
                    }`
                  : `在${currentAspect.titleZh}方面，本周宜维持客观理性的节律。${
                      currentCard.isReversed
                        ? '留意隐蔽的能量损耗，切勿强行推进行不通的旧模式，适度退让反而能赢得转圜空间。'
                        : '顺应当前清晰的正向动能，主动作出积极承诺与实质行动，把握本周的窗口期。'
                    }`}
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
            <span>{isEn ? 'Redraw Weekly Spread' : '重新抽取本周运势'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
