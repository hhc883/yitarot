'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  drawRandomCards,
  DrawnCard,
  getDaysInMonth,
  getMonthlyPhases,
  type MonthPhase
} from '@/lib/tarot/deck';
import { getTarotEvidence } from '@/lib/tarot/waite-basis';
import { TarotCardView } from './TarotCardView';
import { RotateCcw } from 'lucide-react';
import { getDictionary } from '@/lib/i18n/dict';

export type { MonthPhase };
export { getDaysInMonth, getMonthlyPhases };

export function MonthlyTarotWidget({ lang = 'zh' }: { lang?: string }) {
  const isEn = lang === 'en';
  const cardLang: 'zh' | 'en' = isEn ? 'en' : 'zh';
  const d = getDictionary(lang);
  const t = d.fortune;

  const [cards, setCards] = useState<DrawnCard[]>([]);
  const [activeTab, setActiveTab] = useState<'anchor' | number>('anchor');
  const [monthMeta, setMonthMeta] = useState<{ year: number; month: number; monthName: string }>(() => ({
    year: 2026,
    month: 1,
    monthName: isEn ? 'This Month' : '本月'
  }));

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const now = new Date();
      setMonthMeta({
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        monthName: now.toLocaleDateString(isEn ? 'en-US' : 'zh-CN', { month: 'long' })
      });
      setCards(prev => (prev.length === 5 ? prev : drawRandomCards(5)));
    });
    return () => cancelAnimationFrame(frame);
  }, [isEn]);

  const handleShuffle = () => {
    setCards(drawRandomCards(5));
    setActiveTab('anchor');
  };

  const phases = getMonthlyPhases(monthMeta.year, monthMeta.month);

  const getCardEvidence = (dc: DrawnCard) =>
    getTarotEvidence(dc.card.slug, dc.isReversed, cardLang);

  const formatSourceLabel = (sourceName: string, sourceRef: string) => {
    const base = sourceName.includes('Waite') ? sourceName : `A. E. Waite · ${sourceName}`;
    return sourceRef ? `${base} · ${sourceRef}` : base;
  };

  if (cards.length < 5) {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#171717] tracking-tight">
            {t.monthlyTitle}
          </h1>
          <p className="text-xs sm:text-sm font-serif text-[#52525B] mt-2">
            {t.monthlySubtitle}
          </p>
        </div>
        <div className="rounded-2xl bg-white border border-[#E4E4E7] p-8 text-center text-xs font-serif text-[#52525B]">
          {isEn ? 'Preparing your monthly spread...' : '正在洗牌推演月度运势...'}
        </div>
      </div>
    );
  }

  const anchorCard = cards[0];
  const weeklyCards = cards.slice(1);
  const { monthName } = monthMeta;

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* 极简标题 */}
      <div className="text-center mb-8">
        <span className="text-[11px] font-mono tracking-widest text-[#52525B] uppercase block mb-1">
          {monthName} {isEn ? 'TAROT PROJECTION' : '月度运势罗盘'}
        </span>
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#171717] tracking-tight">
          {t.monthlyTitle}
        </h1>
        <p className="text-xs sm:text-sm font-serif text-[#52525B] mt-2">
          {t.monthlySubtitle}
        </p>
      </div>

      {/* 核心卡片容器 */}
      <div className="rounded-2xl bg-white border border-[#E4E4E7] p-6 sm:p-8 shadow-2xs space-y-8">
        {/* 月度核心大牌 + 四周卡片展示 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* 月度锚点大牌 */}
          <button
            type="button"
            onClick={() => setActiveTab('anchor')}
            aria-pressed={activeTab === 'anchor'}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-between text-center ${
              activeTab === 'anchor'
                ? 'bg-[#171717] text-white border-[#171717]'
                : 'bg-[#F5F5F6] text-[#171717] border-[#E4E4E7] hover:bg-[#EBEBEF]'
            }`}
          >
            <div className="text-center">
              <span className={`text-[10px] font-mono uppercase tracking-wider block ${
                activeTab === 'anchor' ? 'text-white/60' : 'text-[#52525B]'
              }`}>
                {isEn ? 'Core Anchor' : '本月主轴'}
              </span>
              <span className="text-xs font-serif font-bold">
                {isEn ? 'Monthly Master Archetype' : '全月统摄原型'}
              </span>
            </div>

            <div className="my-2 pointer-events-none">
              <TarotCardView
                card={anchorCard.card}
                isReversed={anchorCard.isReversed}
                isFlipped={true}
                size="sm"
                lang={cardLang}
              />
            </div>

            <div className="text-center">
              <span className="text-xs font-serif font-bold block">
                {isEn ? anchorCard.card.nameEn : anchorCard.card.nameZh}
              </span>
              <span className={`text-[10px] font-serif block ${
                activeTab === 'anchor' ? 'text-white/60' : 'text-[#52525B]'
              }`}>
                {isEn ? (anchorCard.isReversed ? 'Reversed' : 'Upright') : (anchorCard.isReversed ? '逆位' : '正位')}
              </span>
            </div>
          </button>

          {/* 4 周 progression */}
          {weeklyCards.map((drawn, idx) => {
            const phase = phases[idx];
            const isSelected = activeTab === idx;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveTab(idx)}
                aria-pressed={isSelected}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-between text-center ${
                  isSelected
                    ? 'bg-[#171717] text-white border-[#171717]'
                    : 'bg-[#F5F5F6] text-[#171717] border-[#E4E4E7] hover:bg-[#EBEBEF]'
                }`}
              >
                <div className="text-center">
                  <span className={`text-[10px] font-mono tracking-wider block ${
                    isSelected ? 'text-white/60' : 'text-[#52525B]'
                  }`}>
                    {isEn ? phase.timingEn : phase.timingZh}
                  </span>
                  <span className="text-[11px] font-serif font-bold truncate block">
                    {isEn ? `Week ${idx + 1}` : `第 ${idx + 1} 周`}
                  </span>
                </div>

                <div className="my-2 pointer-events-none">
                  <TarotCardView
                    card={drawn.card}
                    isReversed={drawn.isReversed}
                    isFlipped={true}
                    size="sm"
                    lang={cardLang}
                  />
                </div>

                <div className="text-center w-full">
                  <span className="text-[11px] font-serif font-bold truncate block">
                    {isEn ? drawn.card.nameEn : drawn.card.nameZh}
                  </span>
                  <span className={`text-[10px] font-serif block ${
                    isSelected ? 'text-white/60' : 'text-[#52525B]'
                  }`}>
                    {isEn ? (drawn.isReversed ? 'Reversed' : 'Upright') : (drawn.isReversed ? '逆位' : '正位')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 详情解读面板 */}
        <div className="p-6 rounded-xl bg-[#F5F5F6] border border-[#E4E4E7] space-y-4">
          {activeTab === 'anchor' ? (
            (() => {
              const evidence = getCardEvidence(anchorCard);
              const cardName = isEn ? anchorCard.card.nameEn : anchorCard.card.nameZh;
              const orientation = isEn
                ? (anchorCard.isReversed ? 'Reversed' : 'Upright')
                : (anchorCard.isReversed ? '逆位' : '正位');
              return (
                <div>
                  <div className="pb-3 border-b border-[#E4E4E7] flex items-baseline justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-[11px] font-mono tracking-widest text-[#52525B] uppercase block">
                        {isEn ? 'SITE PERIOD LAYOUT · MONTHLY MASTER SLOT' : '本站月度时段位阶 · 核心主牌位'}
                      </span>
                      <h3 className="font-serif font-black text-lg text-[#171717]">
                        {isEn
                          ? `${monthName} Core Slot · ${cardName} (${orientation})`
                          : `${monthName} 核心位 · ${cardName}（${orientation}）`}
                      </h3>
                    </div>
                    <span className="text-xs font-serif text-[#52525B]">
                      {isEn ? 'Site layout: Monthly Overarching Baseline' : '本站位阶定义：全局能量主轴'}
                    </span>
                  </div>

                  <div className="space-y-3 text-xs font-serif leading-relaxed text-[#171717] mt-4">
                    <div>
                      <span className="font-bold text-[#52525B] block mb-0.5">
                        {isEn ? 'Verified Card Meaning' : '【核验牌义】'}
                      </span>
                      {evidence ? (
                        <>
                          <p className="text-[#171717]">
                            {evidence.basisText}
                          </p>
                          <p className="mt-2 text-[11px] text-[#52525B]">
                            {isEn ? 'Original source: ' : '原始文献依据：'}
                            <a
                              href={evidence.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#171717] underline underline-offset-4 hover:text-[#52525B]"
                            >
                              {formatSourceLabel(evidence.sourceName, evidence.sourceRef)}
                            </a>
                          </p>
                        </>
                      ) : (
                        <p className="text-[#52525B]">
                          {isEn
                            ? `No verified A. E. Waite source excerpt is currently available for ${cardName} (${orientation}).`
                            : `暂无「${cardName}（${orientation}）」对应的 A. E. Waite 原始文献核验释义。`}
                        </p>
                      )}
                      <Link
                        href={`/${cardLang}/cards/${anchorCard.card.slug}`}
                        className="mt-2 inline-flex min-h-[32px] items-center text-xs font-medium text-[#171717] underline underline-offset-4 hover:text-[#52525B]"
                      >
                        {isEn ? `Explore ${cardName} full meaning →` : `查看「${cardName}」完整牌义 →`}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div>
              {(() => {
                const phase = phases[activeTab as number];
                const card = weeklyCards[activeTab as number];
                const evidence = getCardEvidence(card);
                const cardName = isEn ? card.card.nameEn : card.card.nameZh;
                const orientation = isEn
                  ? (card.isReversed ? 'Reversed' : 'Upright')
                  : (card.isReversed ? '逆位' : '正位');
                return (
                  <div>
                    <div className="pb-3 border-b border-[#E4E4E7] flex items-baseline justify-between flex-wrap gap-2">
                      <div>
                        <span className="text-[11px] font-mono tracking-widest text-[#52525B] uppercase block">
                          {isEn ? `SITE PERIOD LAYOUT · ${phase.timingEn}` : `本站月度时段位阶 · ${phase.timingZh}`}
                        </span>
                        <h3 className="font-serif font-black text-lg text-[#171717]">
                          {isEn
                            ? `${phase.nameEn} · ${cardName} (${orientation})`
                            : `${phase.nameZh} · ${cardName}（${orientation}）`}
                        </h3>
                      </div>
                      <span className="text-xs font-serif text-[#52525B]">
                        {isEn ? `Site layout: ${phase.themeEn}` : `本站位阶定义：${phase.themeZh}`}
                      </span>
                    </div>

                    <div className="space-y-3 text-xs font-serif leading-relaxed text-[#171717] mt-4">
                      <div>
                        <span className="font-bold text-[#52525B] block mb-0.5">
                          {isEn ? 'Verified Card Meaning' : '【核验牌义】'}
                        </span>
                        {evidence ? (
                          <>
                            <p className="text-[#171717]">
                              {evidence.basisText}
                            </p>
                            <p className="mt-2 text-[11px] text-[#52525B]">
                              {isEn ? 'Original source: ' : '原始文献依据：'}
                              <a
                                href={evidence.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#171717] underline underline-offset-4 hover:text-[#52525B]"
                              >
                                {formatSourceLabel(evidence.sourceName, evidence.sourceRef)}
                              </a>
                            </p>
                          </>
                        ) : (
                          <p className="text-[#52525B]">
                            {isEn
                              ? `No verified A. E. Waite source excerpt is currently available for ${cardName} (${orientation}).`
                              : `暂无「${cardName}（${orientation}）」对应的 A. E. Waite 原始文献核验释义。`}
                          </p>
                        )}
                        <Link
                          href={`/${cardLang}/cards/${card.card.slug}`}
                          className="mt-2 inline-flex min-h-[32px] items-center text-xs font-medium text-[#171717] underline underline-offset-4 hover:text-[#52525B]"
                        >
                          {isEn ? `Explore ${cardName} full meaning →` : `查看「${cardName}」完整牌义 →`}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* 底部洗牌操作 */}
        <div className="pt-2 border-t border-[#E4E4E7] flex justify-center">
          <button
            type="button"
            onClick={handleShuffle}
            className="px-4 py-2 rounded-xl bg-white hover:bg-[#F5F5F6] text-xs font-serif text-[#171717] border border-[#E4E4E7] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#52525B]" />
            <span>{isEn ? 'Redraw Monthly Spread' : '重新抽取月度运势'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
