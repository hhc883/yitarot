'use client';

import React, { useState } from 'react';
import { drawRandomCards, DrawnCard } from '@/lib/tarot/deck';
import { TarotCardView } from './TarotCardView';
import { RotateCcw } from 'lucide-react';
import { getDictionary } from '@/lib/i18n/dict';

interface ElementPosition {
  id: string;
  element: string;
  elementZh: string;
  elementEn: string;
  titleZh: string;
  titleEn: string;
  directionZh: string;
  directionEn: string;
  descriptionZh: string;
  descriptionEn: string;
  governanceZh: string;
  governanceEn: string;
}

const POSITIONS: ElementPosition[] = [
  {
    id: 'spirit',
    element: 'Spirit',
    elementZh: '灵性以太',
    elementEn: 'Spirit / Quintessence',
    titleZh: '中央灵魂之锚',
    titleEn: 'Central Soul Anchor',
    directionZh: '中央',
    directionEn: 'Center',
    descriptionZh: '核心灵魂课题、潜意识主轴与深层觉醒',
    descriptionEn: 'Core soul lesson, subconscious axis & awakening',
    governanceZh: '指导本季度的整全心识方向',
    governanceEn: 'Directs the overarching spiritual trajectory'
  },
  {
    id: 'fire',
    element: 'Fire',
    elementZh: '权杖火象',
    elementEn: 'Fire of Wands',
    titleZh: '意志与事业之火',
    titleEn: 'Fire of Ambition & Will',
    directionZh: '上方 · 南方',
    directionEn: 'Top · South',
    descriptionZh: '行动力、工作野心、开拓进取与生命激情',
    descriptionEn: 'Action, career drive, pioneering vigor & passion',
    governanceZh: '决定事业攻坚与行动决断的效率',
    governanceEn: 'Determines execution velocity and breakthroughs'
  },
  {
    id: 'water',
    element: 'Water',
    elementZh: '圣杯水象',
    elementEn: 'Water of Cups',
    titleZh: '情感与人际之水',
    titleEn: 'Water of Love & Bonds',
    directionZh: '右方 · 西方',
    directionEn: 'Right · West',
    descriptionZh: '亲密羁绊、心理感受、直觉灵感与社交流动',
    descriptionEn: 'Intimate ties, psychological feelings & social flow',
    governanceZh: '映照情感和谐与内心滋养程度',
    governanceEn: 'Reflects emotional harmony and inner nourishment'
  },
  {
    id: 'air',
    element: 'Air',
    elementZh: '宝剑风象',
    elementEn: 'Air of Swords',
    titleZh: '心智与理智之风',
    titleEn: 'Air of Intellect & Clarity',
    directionZh: '左方 · 东方',
    directionEn: 'Left · East',
    descriptionZh: '战略谋划、理性思辨、有效沟通与观念突破',
    descriptionEn: 'Strategic planning, discernment & communication',
    governanceZh: '检验思考清晰度与认知盲点',
    governanceEn: 'Audits mental clarity and eliminates cognitive blind spots'
  },
  {
    id: 'earth',
    element: 'Earth',
    elementZh: '星币土象',
    elementEn: 'Earth of Pentacles',
    titleZh: '财富与基石之土',
    titleEn: 'Earth of Wealth & Foundation',
    directionZh: '下方 · 北方',
    directionEn: 'Bottom · North',
    descriptionZh: '财务收入、实务落地、身体精力与资产安全',
    descriptionEn: 'Financial revenue, tangible grounding & vitality',
    governanceZh: '衡量现实生活与物质基本盘的稳固',
    governanceEn: 'Measures material foundation and security'
  }
];

export function SeasonalSpreadWidget({ lang = 'zh' }: { lang?: string }) {
  const isEn = lang === 'en';
  const d = getDictionary(lang);
  const t = d.fortune;

  const [cards, setCards] = useState<DrawnCard[]>(() => drawRandomCards(5));
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  const handleShuffle = () => {
    setCards(drawRandomCards(5));
    setSelectedIdx(0);
  };

  const currentPos = POSITIONS[selectedIdx];
  const currentCard = cards[selectedIdx];
  const posTitle = isEn ? currentPos.titleEn : currentPos.titleZh;
  const posElement = isEn ? currentPos.elementEn : currentPos.elementZh;
  const posDirection = isEn ? currentPos.directionEn : currentPos.directionZh;
  const cardName = isEn ? currentCard.card.nameEn : currentCard.card.nameZh;
  const orientationStr = isEn
    ? (currentCard.isReversed ? 'Reversed' : 'Upright')
    : (currentCard.isReversed ? '逆位' : '正位');

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* 极简标题 */}
      <div className="text-center mb-8">
        <span className="text-[11px] font-mono tracking-widest text-[#736B5E] uppercase block mb-1">
          SOLSTICE & EQUINOX SACRED GEOMETRY
        </span>
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#111111] tracking-tight">
          {t.seasonalTitle}
        </h1>
        <p className="text-xs sm:text-sm font-serif text-[#736B5E] mt-2">
          {t.seasonalSubtitle}
        </p>
      </div>

      {/* 核心卡片容器 */}
      <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-6 sm:p-8 shadow-2xs space-y-8">
        {/* 经典十字几何阵列 */}
        <div className="flex flex-col items-center">
          {/* 上：火元素 */}
          <div className="mb-2">
            <PositionBadge
              pos={POSITIONS[1]}
              drawn={cards[1]}
              isSelected={selectedIdx === 1}
              onClick={() => setSelectedIdx(1)}
              isEn={isEn}
            />
          </div>

          {/* 中：风元素 + 灵性核心 + 水元素 */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 my-2 w-full max-w-2xl">
            {/* 左：风 */}
            <PositionBadge
              pos={POSITIONS[3]}
              drawn={cards[3]}
              isSelected={selectedIdx === 3}
              onClick={() => setSelectedIdx(3)}
              isEn={isEn}
            />

            {/* 中：灵性 */}
            <PositionBadge
              pos={POSITIONS[0]}
              drawn={cards[0]}
              isSelected={selectedIdx === 0}
              onClick={() => setSelectedIdx(0)}
              isCenter={true}
              isEn={isEn}
            />

            {/* 右：水 */}
            <PositionBadge
              pos={POSITIONS[2]}
              drawn={cards[2]}
              isSelected={selectedIdx === 2}
              onClick={() => setSelectedIdx(2)}
              isEn={isEn}
            />
          </div>

          {/* 下：土元素 */}
          <div className="mt-2">
            <PositionBadge
              pos={POSITIONS[4]}
              drawn={cards[4]}
              isSelected={selectedIdx === 4}
              onClick={() => setSelectedIdx(4)}
              isEn={isEn}
            />
          </div>
        </div>

        {/* 详情解读面板 */}
        <div className="p-6 rounded-xl bg-[#FAF6ED] border border-[#111111]/10 space-y-4">
          <div className="pb-3 border-b border-[#111111]/8 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <span className="text-[11px] font-mono tracking-widest text-[#736B5E] uppercase block">
                {currentPos.element} · {posDirection}
              </span>
              <h3 className="font-serif font-black text-lg text-[#111111]">
                {posTitle}（{posElement}）· {cardName}（{orientationStr}）
              </h3>
            </div>
            <span className="text-xs font-serif text-[#736B5E]">
              {isEn ? currentPos.governanceEn : currentPos.governanceZh}
            </span>
          </div>

          <div className="space-y-3 text-xs font-serif leading-relaxed text-[#111111]">
            <div>
              <span className="font-bold text-[#736B5E] block mb-0.5">
                {isEn ? '【Placement Definition & Mapping】' : '【位阶定义与映射】'}
              </span>
              <p className="text-[#333333]">
                {isEn ? currentPos.descriptionEn : currentPos.descriptionZh}
              </p>
            </div>

            <div>
              <span className="font-bold text-[#736B5E] block mb-0.5">
                {isEn ? '【Archetypal Insight】' : '【卡牌能量启示】'}
              </span>
              <p className="text-[#333333]">
                {currentCard.isReversed ? currentCard.card.reversedMeaning : currentCard.card.uprightMeaning}
              </p>
            </div>

            <div>
              <span className="font-bold text-[#736B5E] block mb-0.5">
                {isEn ? '【Seasonal Counsel】' : '【季内行事调候建议】'}
              </span>
              <p className="text-[#333333]">
                {isEn
                  ? `In this element position, maintain mindful energetic moderation. ${
                      currentCard.isReversed
                        ? 'Guard against defensive resistance or impulsive overextension. Slow down; stepping back often opens strategic horizons.'
                        : 'Energy flows abundantly and cleanly here; make this your anchor for proactive execution this season.'
                    }`
                  : `在该元素位上，保持动态的能量节流。${
                      currentCard.isReversed
                        ? '注意防范内在的防御阻滞或冲动冒进，放慢节奏，以退为进。'
                        : '此位能量充沛通畅，是本季值得重点发力与倚重的坚实支点。'
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
            <span>{isEn ? 'Redraw Seasonal Spread' : '重新起排四季阵盘'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function PositionBadge({
  pos,
  drawn,
  isSelected,
  onClick,
  isCenter = false,
  isEn = false
}: {
  pos: ElementPosition;
  drawn: DrawnCard;
  isSelected: boolean;
  onClick: () => void;
  isCenter?: boolean;
  isEn?: boolean;
}) {
  const badgeElement = isEn ? pos.elementEn.split(' ')[0] : pos.elementZh;
  const badgeTitle = isEn ? pos.titleEn.split(' of ')[0] : pos.titleZh.split('之')[0];
  const cardName = isEn ? drawn.card.nameEn : drawn.card.nameZh;
  const orientationStr = isEn
    ? (drawn.isReversed ? 'Rev' : 'Upr')
    : (drawn.isReversed ? '逆位' : '正位');

  return (
    <div
      onClick={onClick}
      className={`p-2 sm:p-3 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-between ${
        isSelected
          ? 'bg-[#111111] text-[#FFFDF9] border-[#111111] shadow-md scale-105'
          : isCenter
          ? 'bg-[#FAF6ED] text-[#111111] border-[#C29026]/40 hover:bg-[#F2ECE1]'
          : 'bg-[#FAF6ED] text-[#111111] border-[#111111]/10 hover:bg-[#F2ECE1]'
      } w-28 sm:w-36`}
    >
      <div className="text-center w-full">
        <span
          className={`text-[9px] font-mono tracking-wider block truncate ${
            isSelected ? 'text-[#FFFDF9]/60' : 'text-[#736B5E]'
          }`}
        >
          {badgeElement}
        </span>
        <span className="text-[11px] font-serif font-bold truncate block">
          {badgeTitle}
        </span>
      </div>

      <div className="my-1.5 pointer-events-none scale-90 sm:scale-100">
        <TarotCardView
          card={drawn.card}
          isReversed={drawn.isReversed}
          isFlipped={true}
          size="sm"
        />
      </div>

      <div className="text-center w-full">
        <span className="text-[10px] font-serif font-bold truncate block">
          {cardName}
        </span>
        <span
          className={`text-[9px] font-serif block ${
            isSelected ? 'text-[#FFFDF9]/60' : 'text-[#736B5E]'
          }`}
        >
          {orientationStr}
        </span>
      </div>
    </div>
  );
}
