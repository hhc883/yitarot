'use client';

import React, { useState } from 'react';
import { drawRandomCards, DrawnCard } from '@/lib/tarot/deck';
import { TarotCardView } from './TarotCardView';
import { RotateCcw } from 'lucide-react';

interface LoveScenario {
  id: string;
  label: string;
  desc: string;
}

const LOVE_SCENARIOS: LoveScenario[] = [
  { id: 'ambiguous', label: '暧昧探索', desc: '推演双方好感度与推进时机' },
  { id: 'dating', label: '恋爱磨合', desc: '洞察彼此期待与相处核心盲区' },
  { id: 'single', label: '单身寻缘', desc: '照见近期情感机缘与内在阻力' },
  { id: 'conflict', label: '矛盾化解', desc: '剖析争执根源与破冰切入点' },
  { id: 'reunion', label: '复合推演', desc: '审视前缘羁绊与重归于好几率' },
];

function calculateLoveHarmony(cards: DrawnCard[]): {
  score: number;
  level: string;
  dynamicSummary: string;
} {
  let score = 65;

  cards.forEach(c => {
    const name = c.card.nameEn.toLowerCase();
    const isRev = c.isReversed;

    // 圣杯牌与爱意牌增加和谐度
    if (c.card.suit === 'cups' || name.includes('lovers') || name.includes('empress') || name.includes('star') || name.includes('sun')) {
      score += isRev ? 2 : 10;
    }
    // 宝剑牌或塔牌带来摩擦
    if (c.card.suit === 'swords' || name.includes('tower') || name.includes('devil')) {
      score -= isRev ? 5 : 10;
    }
    // 权杖带来激情
    if (c.card.suit === 'wands') {
      score += isRev ? -3 : 6;
    }
    // 星币带来稳固
    if (c.card.suit === 'pentacles') {
      score += isRev ? 0 : 5;
    }
  });

  score = Math.max(35, Math.min(98, score));

  let level = '良性共振';
  let dynamicSummary = '';

  if (score >= 85) {
    level = '深层心智共振';
    dynamicSummary = '双方在情感需求与灵魂步调上高度契合，彼此能提供充分的安全感与滋养，是一段能够共同成长的双向关系。';
  } else if (score >= 70) {
    level = '温润和谐相长';
    dynamicSummary = '总体基调温和顺畅，存在真实的情感流动。偶有的观念分歧属于良性磨合，坦诚沟通即可消除隔阂。';
  } else if (score >= 50) {
    level = '现实与期待博弈';
    dynamicSummary = '双方目前可能处于不同步调，或受到外界现实因素（工作、距离、家庭）的牵制，内心期待与实际行动存在微弱落差。';
  } else {
    level = '亟待破冰与重构';
    dynamicSummary = '彼此防御心较强，可能存在未表达的委屈或误解。当前最需要的是放下输赢执念，退一步审视关系的本质需求。';
  }

  return { score, level, dynamicSummary };
}

export function LoveTarotWidget({ lang = 'zh' }: { lang?: string }) {
  const [selectedScenario, setSelectedScenario] = useState<string>('ambiguous');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[] | null>(null);
  const [flippedMap, setFlippedMap] = useState<Record<number, boolean>>({ 0: false, 1: false, 2: false });
  const [isDealing, setIsDealing] = useState(false);

  const handleDraw = () => {
    setIsDealing(true);
    const cards = drawRandomCards(3);
    setDrawnCards(cards);
    setFlippedMap({ 0: false, 1: false, 2: false });

    // 逐张翻开
    setTimeout(() => {
      setFlippedMap(prev => ({ ...prev, 0: true }));
    }, 400);
    setTimeout(() => {
      setFlippedMap(prev => ({ ...prev, 1: true }));
    }, 800);
    setTimeout(() => {
      setFlippedMap(prev => ({ ...prev, 2: true }));
      setIsDealing(false);
    }, 1200);
  };

  const handleReset = () => {
    setDrawnCards(null);
    setFlippedMap({ 0: false, 1: false, 2: false });
  };

  const currentScenarioObj = LOVE_SCENARIOS.find(s => s.id === selectedScenario) || LOVE_SCENARIOS[0];
  const harmony = drawnCards ? calculateLoveHarmony(drawnCards) : null;

  const positions = [
    { title: '你的心态与深层投射', role: '你当前的内在渴望、防御机制与情感准备度' },
    { title: '对方的状态与真实态度', role: '对方目前的生活重心、对你的感知与潜在顾虑' },
    { title: '关系演化与融通之道', role: '未来一段时期的走向预演，以及最适宜的相处行动' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* 极简标题 */}
      <div className="text-center mb-8">
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#111111] tracking-tight">
          爱情塔罗
        </h1>
        <p className="text-xs sm:text-sm font-serif text-[#736B5E] mt-2">
          三维情感镜像。照见彼此潜意识的真实心声与关系融通路径。
        </p>
      </div>

      {/* 核心卡片容器 */}
      <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-6 sm:p-8 shadow-2xs">
        {!drawnCards ? (
          <div className="space-y-6">
            {/* 场景选择器 */}
            <div>
              <span className="block text-xs font-serif text-[#736B5E] mb-3">
                选择你当前的情感状态：
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {LOVE_SCENARIOS.map(item => {
                  const isSelected = selectedScenario === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedScenario(item.id)}
                      className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#111111] text-[#FFFDF9] border-[#111111]'
                          : 'bg-[#FAF6ED] text-[#111111] border-[#111111]/10 hover:bg-[#F2ECE1]'
                      }`}
                    >
                      <div className="text-xs font-serif font-bold">{item.label}</div>
                      <div
                        className={`text-[11px] font-serif mt-1 ${
                          isSelected ? 'text-[#FFFDF9]/70' : 'text-[#736B5E]'
                        }`}
                      >
                        {item.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 抽牌按钮 */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleDraw}
                disabled={isDealing}
                className="w-full py-3.5 rounded-xl bg-[#111111] hover:bg-[#2A2A2A] text-xs font-serif tracking-widest text-[#FFFDF9] transition-all cursor-pointer shadow-xs active:scale-[0.99]"
              >
                起 卦 抽 取 爱 意 牌 阵
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* 当前情境回显 */}
            <div className="flex items-center justify-between pb-4 border-b border-[#111111]/8">
              <div>
                <span className="text-[11px] font-serif text-[#736B5E]">当前推演情境</span>
                <span className="ml-2 text-xs font-serif font-bold text-[#111111]">
                  {currentScenarioObj.label}
                </span>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-serif text-[#736B5E] hover:text-[#111111] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>换个情境重新测</span>
              </button>
            </div>

            {/* 3 张卡牌横向排布 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {drawnCards.map((drawn, index) => {
                const pos = positions[index];
                const isFlipped = flippedMap[index] ?? false;

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center p-4 rounded-xl bg-[#FAF6ED] border border-[#111111]/10"
                  >
                    <span className="text-[11px] font-serif font-bold text-[#736B5E] mb-1">
                      {pos.title}
                    </span>
                    <span className="text-[10px] font-serif text-[#736B5E]/80 mb-3 text-center h-7 flex items-center">
                      {pos.role}
                    </span>

                    <div className="my-2">
                      <TarotCardView
                        card={drawn.card}
                        isReversed={drawn.isReversed}
                        isFlipped={isFlipped}
                        size="sm"
                        onFlip={() =>
                          setFlippedMap(prev => ({ ...prev, [index]: !prev[index] }))
                        }
                      />
                    </div>

                    <div className="text-center mt-3 w-full">
                      <div className="text-xs font-serif font-bold text-[#111111]">
                        {drawn.card.nameZh}
                        <span className="ml-1 text-[11px] font-normal text-[#736B5E]">
                          ({drawn.isReversed ? '逆位' : '正位'})
                        </span>
                      </div>
                      <p className="text-[11px] font-serif text-[#555555] mt-1.5 line-clamp-3 leading-relaxed text-left">
                        {drawn.isReversed ? drawn.card.reversedMeaning : drawn.card.uprightMeaning}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 综合合盘洞见 */}
            {harmony && (
              <div className="p-5 rounded-xl bg-[#FAF6ED] border border-[#111111]/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#111111]/8">
                  <div>
                    <span className="text-xs font-serif font-bold text-[#111111]">
                      契合共振指数：{harmony.score}%
                    </span>
                    <span className="ml-2 text-xs font-serif text-[#736B5E]">
                      （{harmony.level}）
                    </span>
                  </div>
                  <div className="w-full sm:w-48 h-1.5 rounded-full bg-[#111111]/10 overflow-hidden">
                    <div
                      className="h-full bg-[#111111] transition-all duration-700"
                      style={{ width: `${harmony.score}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-3 text-xs font-serif leading-relaxed text-[#111111]">
                  <div>
                    <span className="font-bold text-[#736B5E] block mb-0.5">【能量态势】</span>
                    <p className="text-[#333333]">{harmony.dynamicSummary}</p>
                  </div>
                  <div>
                    <span className="font-bold text-[#736B5E] block mb-0.5">【融通之道】</span>
                    <p className="text-[#333333]">
                      保持心理边界的弹性，不将过去的经验投射到当下。面对感情中的未知，以好奇代替恐惧，以倾听代替预设立场。
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
