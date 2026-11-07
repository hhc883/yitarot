'use client';

import React, { useState } from 'react';
import { drawRandomCards, DrawnCard } from '@/lib/tarot/deck';
import { TarotCardView } from './TarotCardView';
import { RotateCcw } from 'lucide-react';

interface QuarterInfo {
  name: string;
  enName: string;
  season: string;
  timeframe: string;
  energyRole: string;
}

const QUARTERS: QuarterInfo[] = [
  { name: '第一季度 · 春生', enName: 'Spring Awakening', season: '春分之气', timeframe: '1月 - 3月', energyRole: '初生萌芽与锚定方向' },
  { name: '第二季度 · 夏长', enName: 'Summer Ascendance', season: '夏至烈焰', timeframe: '4月 - 6月', energyRole: '炽热进取与资源拓展' },
  { name: '第三季度 · 秋收', enName: 'Autumn Harvest', season: '秋分澄澈', timeframe: '7月 - 9月', energyRole: '成果检验与果决取舍' },
  { name: '第四季度 · 冬藏', enName: 'Winter Stillness', season: '冬至潜蓄', timeframe: '10月 - 12月', energyRole: '复盘休整与沉淀新生' }
];

export function YearlyTarotWidget({ lang = 'zh' }: { lang?: string }) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [cards, setCards] = useState<DrawnCard[]>(() => drawRandomCards(5));
  const [activeTab, setActiveTab] = useState<'annual' | number>('annual');

  const handleShuffle = () => {
    setCards(drawRandomCards(5));
    setActiveTab('annual');
  };

  const annualCard = cards[0];
  const quarterCards = cards.slice(1);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* 极简标题 */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          {[currentYear, currentYear + 1].map(yr => (
            <button
              key={yr}
              type="button"
              onClick={() => setSelectedYear(yr)}
              className={`px-3 py-1 rounded-lg text-xs font-serif transition-all cursor-pointer ${
                selectedYear === yr
                  ? 'bg-[#111111] text-[#FFFDF9]'
                  : 'bg-[#FAF6ED] text-[#736B5E] hover:bg-[#F2ECE1]'
              }`}
            >
              {yr} 年度推演
            </button>
          ))}
        </div>
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#111111] tracking-tight">
          {selectedYear} 塔罗年运
        </h1>
        <p className="text-xs sm:text-sm font-serif text-[#736B5E] mt-2">
          四大季度四季流转，锚定年度统领灵魂原型与全年破局心法。
        </p>
      </div>

      {/* 核心卡片容器 */}
      <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-6 sm:p-8 shadow-2xs space-y-8">
        {/* 全年大牌 + 四季卡片横排 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* 年度灵魂主轴卡 */}
          <div
            onClick={() => setActiveTab('annual')}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-between ${
              activeTab === 'annual'
                ? 'bg-[#111111] text-[#FFFDF9] border-[#111111]'
                : 'bg-[#FAF6ED] text-[#111111] border-[#111111]/10 hover:bg-[#F2ECE1]'
            }`}
          >
            <div className="text-center">
              <span className={`text-[10px] font-mono uppercase tracking-wider block ${
                activeTab === 'annual' ? 'text-[#FFFDF9]/60' : 'text-[#736B5E]'
              }`}>
                Year Master
              </span>
              <span className="text-xs font-serif font-bold">年度统摄课题</span>
            </div>

            <div className="my-2 pointer-events-none">
              <TarotCardView
                card={annualCard.card}
                isReversed={annualCard.isReversed}
                isFlipped={true}
                size="sm"
              />
            </div>

            <div className="text-center">
              <span className="text-xs font-serif font-bold block">{annualCard.card.nameZh}</span>
              <span className={`text-[10px] font-serif block ${
                activeTab === 'annual' ? 'text-[#FFFDF9]/60' : 'text-[#736B5E]'
              }`}>
                {annualCard.isReversed ? '逆位' : '正位'}
              </span>
            </div>
          </div>

          {/* 四季卡牌 */}
          {quarterCards.map((drawn, idx) => {
            const q = QUARTERS[idx];
            const isSelected = activeTab === idx;

            return (
              <div
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-between ${
                  isSelected
                    ? 'bg-[#111111] text-[#FFFDF9] border-[#111111]'
                    : 'bg-[#FAF6ED] text-[#111111] border-[#111111]/10 hover:bg-[#F2ECE1]'
                }`}
              >
                <div className="text-center">
                  <span className={`text-[10px] font-mono tracking-wider block ${
                    isSelected ? 'text-[#FFFDF9]/60' : 'text-[#736B5E]'
                  }`}>
                    {q.timeframe}
                  </span>
                  <span className="text-[11px] font-serif font-bold truncate block">
                    {q.name.split(' · ')[1]}
                  </span>
                </div>

                <div className="my-2 pointer-events-none">
                  <TarotCardView
                    card={drawn.card}
                    isReversed={drawn.isReversed}
                    isFlipped={true}
                    size="sm"
                  />
                </div>

                <div className="text-center w-full">
                  <span className="text-[11px] font-serif font-bold truncate block">
                    {drawn.card.nameZh}
                  </span>
                  <span className={`text-[10px] font-serif block ${
                    isSelected ? 'text-[#FFFDF9]/60' : 'text-[#736B5E]'
                  }`}>
                    {drawn.isReversed ? '逆位' : '正位'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 详情解读面板 */}
        <div className="p-6 rounded-xl bg-[#FAF6ED] border border-[#111111]/10 space-y-4">
          {activeTab === 'annual' ? (
            <div>
              <div className="pb-3 border-b border-[#111111]/8 flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] font-mono tracking-widest text-[#736B5E] uppercase block">
                    {selectedYear} SOUL ARCHETYPE
                  </span>
                  <h3 className="font-serif font-black text-lg text-[#111111]">
                    年度核心原型 · {annualCard.card.nameZh}（{annualCard.isReversed ? '逆位' : '正位'}）
                  </h3>
                </div>
                <span className="text-xs font-serif text-[#736B5E]">全年生命能量基底</span>
              </div>

              <div className="space-y-3 text-xs font-serif leading-relaxed text-[#111111] mt-4">
                <div>
                  <span className="font-bold text-[#736B5E] block mb-0.5">【年度命题与深层呼唤】</span>
                  <p className="text-[#333333]">
                    {annualCard.isReversed ? annualCard.card.reversedMeaning : annualCard.card.uprightMeaning}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-[#736B5E] block mb-0.5">【全年贯穿性行事心法】</span>
                  <p className="text-[#333333]">
                    在未来的 365 天中，无论外界环境如何变幻，始终守住这枚原型教导给你的智慧。不因一时的停滞而焦虑，亦不因短暂的顺境而自满，以整全长远的眼光经营自我。
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {(() => {
                const q = QUARTERS[activeTab as number];
                const card = quarterCards[activeTab as number];
                return (
                  <div>
                    <div className="pb-3 border-b border-[#111111]/8 flex items-baseline justify-between">
                      <div>
                        <span className="text-[11px] font-mono tracking-widest text-[#736B5E] uppercase block">
                          QUARTERLY WINDOW · {q.timeframe}
                        </span>
                        <h3 className="font-serif font-black text-lg text-[#111111]">
                          {q.name} · {card.card.nameZh}（{card.isReversed ? '逆位' : '正位'}）
                        </h3>
                      </div>
                      <span className="text-xs font-serif text-[#736B5E]">{q.energyRole}</span>
                    </div>

                    <div className="space-y-3 text-xs font-serif leading-relaxed text-[#111111] mt-4">
                      <div>
                        <span className="font-bold text-[#736B5E] block mb-0.5">【季度态势呈现】</span>
                        <p className="text-[#333333]">
                          {card.isReversed ? card.card.reversedMeaning : card.card.uprightMeaning}
                        </p>
                      </div>
                      <div>
                        <span className="font-bold text-[#736B5E] block mb-0.5">【当季处事着力点】</span>
                        <p className="text-[#333333]">
                          {activeTab === 0 && '春季重在布局。不必急于看到开花结果，耐下心来耕耘种子，建立清晰的同盟与契约。'}
                          {activeTab === 1 && '夏季重在冲刺。释放内在激情与行动力，勇敢拓展业务边界与人际网络。'}
                          {activeTab === 2 && '秋季重在盘整。梳理沉淀已有资产，清理冗余流程，果断剥离不盈利或耗费心神的项目。'}
                          {activeTab === 3 && '冬季重在蓄力。深居内照，减少不必要的消耗，在静定中完成一整年的智慧复盘。'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* 底部洗牌操作 */}
        <div className="pt-2 border-t border-[#111111]/8 flex justify-center">
          <button
            type="button"
            onClick={handleShuffle}
            className="px-4 py-2 rounded-xl bg-[#FAF6ED] hover:bg-[#F2ECE1] text-xs font-serif text-[#111111] border border-[#111111]/10 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#736B5E]" />
            <span>重新推演年运牌阵</span>
          </button>
        </div>
      </div>
    </div>
  );
}
