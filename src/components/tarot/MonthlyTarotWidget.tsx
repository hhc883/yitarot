'use client';

import React, { useState } from 'react';
import { drawRandomCards, DrawnCard } from '@/lib/tarot/deck';
import { TarotCardView } from './TarotCardView';
import { RotateCcw } from 'lucide-react';

interface MonthPhase {
  name: string;
  enName: string;
  timing: string;
  theme: string;
}

const PHASES: MonthPhase[] = [
  { name: '第一周 · 启序播种', enName: 'Inception', timing: '第 1 - 7 天', theme: '新机缘萌发与目标确立' },
  { name: '第二周 · 磨砺探索', enName: 'Friction', timing: '第 8 - 14 天', theme: '遭遇现实摩擦与策略微调' },
  { name: '第三周 · 聚力突破', enName: 'Breakthrough', timing: '第 15 - 21 天', theme: '主线推进与关键成果涌现' },
  { name: '第四周 · 沉淀融通', enName: 'Integration', timing: '第 22 - 30 天', theme: '盘整收尾与下一阶段蓄力' }
];

export function MonthlyTarotWidget({ lang = 'zh' }: { lang?: string }) {
  // 1 张月度统摄牌 + 4 张周进阶牌
  const [cards, setCards] = useState<DrawnCard[]>(() => drawRandomCards(5));
  const [activeTab, setActiveTab] = useState<'anchor' | number>('anchor');

  const handleShuffle = () => {
    setCards(drawRandomCards(5));
    setActiveTab('anchor');
  };

  const anchorCard = cards[0];
  const weeklyCards = cards.slice(1);

  const monthName = new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'zh-CN', {
    month: 'long'
  });

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* 极简标题 */}
      <div className="text-center mb-8">
        <span className="text-[11px] font-mono tracking-widest text-[#736B5E] uppercase block mb-1">
          {monthName} TAROT PROJECTION
        </span>
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#111111] tracking-tight">
          月运塔罗
        </h1>
        <p className="text-xs sm:text-sm font-serif text-[#736B5E] mt-2">
          月度宏观原型统摄，结合四周节律递进推演，把控月度能量高低起伏。
        </p>
      </div>

      {/* 核心卡片容器 */}
      <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-6 sm:p-8 shadow-2xs space-y-8">
        {/* 月度核心大牌 + 四周卡片展示 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* 月度锚点大牌 (占据突出的视觉位置) */}
          <div
            onClick={() => setActiveTab('anchor')}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-between ${
              activeTab === 'anchor'
                ? 'bg-[#111111] text-[#FFFDF9] border-[#111111]'
                : 'bg-[#FAF6ED] text-[#111111] border-[#111111]/10 hover:bg-[#F2ECE1]'
            }`}
          >
            <div className="text-center">
              <span className={`text-[10px] font-mono uppercase tracking-wider block ${
                activeTab === 'anchor' ? 'text-[#FFFDF9]/60' : 'text-[#736B5E]'
              }`}>
                Core Anchor
              </span>
              <span className="text-xs font-serif font-bold">全月统摄原型</span>
            </div>

            <div className="my-2 pointer-events-none">
              <TarotCardView
                card={anchorCard.card}
                isReversed={anchorCard.isReversed}
                isFlipped={true}
                size="sm"
              />
            </div>

            <div className="text-center">
              <span className="text-xs font-serif font-bold block">{anchorCard.card.nameZh}</span>
              <span className={`text-[10px] font-serif block ${
                activeTab === 'anchor' ? 'text-[#FFFDF9]/60' : 'text-[#736B5E]'
              }`}>
                {anchorCard.isReversed ? '逆位' : '正位'}
              </span>
            </div>
          </div>

          {/* 4 周 progression */}
          {weeklyCards.map((drawn, idx) => {
            const phase = PHASES[idx];
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
                    {phase.timing}
                  </span>
                  <span className="text-[11px] font-serif font-bold truncate block">
                    第 {idx + 1} 周
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
          {activeTab === 'anchor' ? (
            <div>
              <div className="pb-3 border-b border-[#111111]/8 flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] font-mono tracking-widest text-[#736B5E] uppercase block">
                    MONTHLY MASTER LESSON
                  </span>
                  <h3 className="font-serif font-black text-lg text-[#111111]">
                    {monthName}核心课题 · {anchorCard.card.nameZh}（{anchorCard.isReversed ? '逆位' : '正位'}）
                  </h3>
                </div>
                <span className="text-xs font-serif text-[#736B5E]">全局能量主轴</span>
              </div>

              <div className="space-y-3 text-xs font-serif leading-relaxed text-[#111111] mt-4">
                <div>
                  <span className="font-bold text-[#736B5E] block mb-0.5">【本月心智成长主旋律】</span>
                  <p className="text-[#333333]">
                    {anchorCard.isReversed ? anchorCard.card.reversedMeaning : anchorCard.card.uprightMeaning}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-[#736B5E] block mb-0.5">【月度战略建议】</span>
                  <p className="text-[#333333]">
                    将本月的重点放在深层价值的沉淀与自省上。不急于快速变现所有想法，而是先筑牢底盘，厘清主次轻重。
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {(() => {
                const phase = PHASES[activeTab as number];
                const card = weeklyCards[activeTab as number];
                return (
                  <div>
                    <div className="pb-3 border-b border-[#111111]/8 flex items-baseline justify-between">
                      <div>
                        <span className="text-[11px] font-mono tracking-widest text-[#736B5E] uppercase block">
                          WEEKLY EVOLUTION · {phase.timing}
                        </span>
                        <h3 className="font-serif font-black text-lg text-[#111111]">
                          {phase.name} · {card.card.nameZh}（{card.isReversed ? '逆位' : '正位'}）
                        </h3>
                      </div>
                      <span className="text-xs font-serif text-[#736B5E]">{phase.theme}</span>
                    </div>

                    <div className="space-y-3 text-xs font-serif leading-relaxed text-[#111111] mt-4">
                      <div>
                        <span className="font-bold text-[#736B5E] block mb-0.5">【阶段能量特征】</span>
                        <p className="text-[#333333]">
                          {card.isReversed ? card.card.reversedMeaning : card.card.uprightMeaning}
                        </p>
                      </div>
                      <div>
                        <span className="font-bold text-[#736B5E] block mb-0.5">【当周践行要点】</span>
                        <p className="text-[#333333]">
                          {activeTab === 0 && '适合立下清晰小目标，轻装上阵，不被琐事分散心神。'}
                          {activeTab === 1 && '可能遇到沟通或执行上的摩擦，保持情绪脱敏，专注于就事论事。'}
                          {activeTab === 2 && '能量高涨阶段，全力攻克此前积压的硬骨头，收获阶段性反馈。'}
                          {activeTab === 3 && '主动做减法，复盘经验得失，为下个月的循环做好整备。'}
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
            <span>重新抽取月度运势</span>
          </button>
        </div>
      </div>
    </div>
  );
}
