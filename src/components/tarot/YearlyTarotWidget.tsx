'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  DrawnCard,
  getOrCreateYearSpread,
  redrawYearSpread,
  type YearlySpreadMap
} from '@/lib/tarot/deck';
import { getTarotEvidence } from '@/lib/tarot/waite-basis';
import { TarotCardView } from './TarotCardView';
import { RotateCcw } from 'lucide-react';
import { getDictionary } from '@/lib/i18n/dict';

export interface QuarterInfo {
  nameZh: string;
  nameEn: string;
  seasonZh: string;
  seasonEn: string;
  timeframeZh: string;
  timeframeEn: string;
  energyRoleZh: string;
  energyRoleEn: string;
}

export type { YearlySpreadMap };
export { getOrCreateYearSpread, redrawYearSpread };

const QUARTERS: QuarterInfo[] = [
  { nameZh: '第一季度 · 春生', nameEn: 'Q1 · Spring Awakening', seasonZh: '春分之气', seasonEn: 'Vernal Equinox', timeframeZh: '1月 - 3月', timeframeEn: 'Jan - Mar', energyRoleZh: '初生萌芽与锚定方向', energyRoleEn: 'Germination & Grounding Intent' },
  { nameZh: '第二季度 · 夏长', nameEn: 'Q2 · Summer Ascendance', seasonZh: '夏至烈焰', seasonEn: 'Summer Solstice', timeframeZh: '4月 - 6月', timeframeEn: 'Apr - Jun', energyRoleZh: '炽热进取与资源拓展', energyRoleEn: 'Expansion & Dynamic Momentum' },
  { nameZh: '第三季度 · 秋收', nameEn: 'Q3 · Autumn Harvest', seasonZh: '秋分澄澈', seasonEn: 'Autumnal Equinox', timeframeZh: '7月 - 9月', timeframeEn: 'Jul - Sep', energyRoleZh: '成果检验与果决取舍', energyRoleEn: 'Harvest Evaluation & Pruning' },
  { nameZh: '第四季度 · 冬藏', nameEn: 'Q4 · Winter Stillness', seasonZh: '冬至潜蓄', seasonEn: 'Winter Solstice', timeframeZh: '10月 - 12月', timeframeEn: 'Oct - Dec', energyRoleZh: '复盘休整与沉淀新生', energyRoleEn: 'Introspection & Regeneration' }
];

export function YearlyTarotWidget({ lang = 'zh' }: { lang?: string }) {
  const isEn = lang === 'en';
  const cardLang: 'zh' | 'en' = isEn ? 'en' : 'zh';
  const d = getDictionary(lang);
  const t = d.fortune;

  const [baseYear, setBaseYear] = useState<number>(2026);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [cardsByYear, setCardsByYear] = useState<YearlySpreadMap>({});
  const [activeTab, setActiveTab] = useState<'annual' | number>('annual');

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const yr = new Date().getFullYear();
      setBaseYear(yr);
      setSelectedYear(yr);
      setCardsByYear(prev => getOrCreateYearSpread(prev, yr));
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleSelectYear = (yr: number) => {
    setSelectedYear(yr);
    setCardsByYear(prev => getOrCreateYearSpread(prev, yr));
    setActiveTab('annual');
  };

  const handleShuffle = () => {
    setCardsByYear(prev => redrawYearSpread(prev, selectedYear));
    setActiveTab('annual');
  };

  const cards = cardsByYear[selectedYear];

  const getCardEvidence = (dc: DrawnCard) =>
    getTarotEvidence(dc.card.slug, dc.isReversed, cardLang);

  const formatSourceLabel = (sourceName: string, sourceRef: string) => {
    const base = sourceName.includes('Waite') ? sourceName : `A. E. Waite · ${sourceName}`;
    return sourceRef ? `${base} · ${sourceRef}` : base;
  };

  if (!cards || cards.length < 5) {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#171717] tracking-tight">
            {selectedYear} {isEn ? 'Tarot Yearly Outlook' : '塔罗年运'}
          </h1>
          <p className="text-xs sm:text-sm font-serif text-[#52525B] mt-2">
            {t.yearlySubtitle}
          </p>
        </div>
        <div className="rounded-2xl bg-white border border-[#E4E4E7] p-8 text-center text-xs font-serif text-[#52525B]">
          {isEn ? 'Preparing your yearly spread...' : '正在洗牌推演年运牌阵...'}
        </div>
      </div>
    );
  }

  const annualCard = cards[0];
  const quarterCards = cards.slice(1);
  const yearOptions = [baseYear, baseYear + 1];

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* 极简标题与年份切换 */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          {yearOptions.map(yr => (
            <button
              key={yr}
              type="button"
              aria-pressed={selectedYear === yr}
              onClick={() => handleSelectYear(yr)}
              className={`px-3 py-1 rounded-lg text-xs font-serif transition-all cursor-pointer ${
                selectedYear === yr
                  ? 'bg-[#171717] text-white'
                  : 'bg-[#F5F5F6] text-[#52525B] hover:bg-[#EBEBEF]'
              }`}
            >
              {isEn ? `${yr} Projection` : `${yr} 年度推演`}
            </button>
          ))}
        </div>
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#171717] tracking-tight">
          {selectedYear} {isEn ? 'Tarot Yearly Outlook' : '塔罗年运'}
        </h1>
        <p className="text-xs sm:text-sm font-serif text-[#52525B] mt-2">
          {t.yearlySubtitle}
        </p>
      </div>

      {/* 核心卡片容器 */}
      <div className="rounded-2xl bg-white border border-[#E4E4E7] p-6 sm:p-8 shadow-2xs space-y-8">
        {/* 全年大牌 + 四季卡片横排 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* 年度灵魂主轴卡 */}
          <button
            type="button"
            onClick={() => setActiveTab('annual')}
            aria-pressed={activeTab === 'annual'}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-between text-center ${
              activeTab === 'annual'
                ? 'bg-[#171717] text-white border-[#171717]'
                : 'bg-[#F5F5F6] text-[#171717] border-[#E4E4E7] hover:bg-[#EBEBEF]'
            }`}
          >
            <div className="text-center">
              <span className={`text-[10px] font-mono uppercase tracking-wider block ${
                activeTab === 'annual' ? 'text-white/60' : 'text-[#52525B]'
              }`}>
                {isEn ? 'Year Master' : '年度主牌'}
              </span>
              <span className="text-xs font-serif font-bold">
                {isEn ? 'Annual Soul Archetype' : '年度统摄课题'}
              </span>
            </div>

            <div className="my-2 pointer-events-none">
              <TarotCardView
                card={annualCard.card}
                isReversed={annualCard.isReversed}
                isFlipped={true}
                size="sm"
                lang={cardLang}
              />
            </div>

            <div className="text-center">
              <span className="text-xs font-serif font-bold block">
                {isEn ? annualCard.card.nameEn : annualCard.card.nameZh}
              </span>
              <span className={`text-[10px] font-serif block ${
                activeTab === 'annual' ? 'text-white/60' : 'text-[#52525B]'
              }`}>
                {isEn ? (annualCard.isReversed ? 'Reversed' : 'Upright') : (annualCard.isReversed ? '逆位' : '正位')}
              </span>
            </div>
          </button>

          {/* 四季卡牌 */}
          {quarterCards.map((drawn, idx) => {
            const q = QUARTERS[idx];
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
                    {isEn ? q.timeframeEn : q.timeframeZh}
                  </span>
                  <span className="text-[11px] font-serif font-bold truncate block">
                    {isEn ? q.nameEn.split(' · ')[1] : q.nameZh.split(' · ')[1]}
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
          {activeTab === 'annual' ? (
            (() => {
              const evidence = getCardEvidence(annualCard);
              const cardName = isEn ? annualCard.card.nameEn : annualCard.card.nameZh;
              const orientation = isEn
                ? (annualCard.isReversed ? 'Reversed' : 'Upright')
                : (annualCard.isReversed ? '逆位' : '正位');
              return (
                <div>
                  <div className="pb-3 border-b border-[#E4E4E7] flex items-baseline justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-[11px] font-mono tracking-widest text-[#52525B] uppercase block">
                        {isEn ? `SITE PERIOD LAYOUT · ${selectedYear} ANNUAL SLOT` : `本站年度时段位阶 · ${selectedYear} 年度主牌位`}
                      </span>
                      <h3 className="font-serif font-black text-lg text-[#171717]">
                        {isEn
                          ? `Annual Soul Archetype · ${cardName} (${orientation})`
                          : `年度核心原型 · ${cardName}（${orientation}）`}
                      </h3>
                    </div>
                    <span className="text-xs font-serif text-[#52525B]">
                      {isEn ? 'Site layout: Yearlong Spiritual Bedrock' : '本站位阶定义：全年生命能量基底'}
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
                        href={`/${cardLang}/cards/${annualCard.card.slug}`}
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
                const q = QUARTERS[activeTab as number];
                const card = quarterCards[activeTab as number];
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
                          {isEn ? `SITE PERIOD LAYOUT · ${q.timeframeEn}` : `本站年度时段位阶 · ${q.timeframeZh}`}
                        </span>
                        <h3 className="font-serif font-black text-lg text-[#171717]">
                          {isEn
                            ? `${q.nameEn} · ${cardName} (${orientation})`
                            : `${q.nameZh} · ${cardName}（${orientation}）`}
                        </h3>
                      </div>
                      <span className="text-xs font-serif text-[#52525B]">
                        {isEn ? `Site layout: ${q.energyRoleEn}` : `本站位阶定义：${q.energyRoleZh}`}
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

        {/* 底部洗牌操作（仅重抽当前选中年份） */}
        <div className="pt-2 border-t border-[#E4E4E7] flex flex-col items-center gap-1.5">
          <button
            type="button"
            onClick={handleShuffle}
            className="px-4 py-2 rounded-xl bg-white hover:bg-[#F5F5F6] text-xs font-serif text-[#171717] border border-[#E4E4E7] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#52525B]" />
            <span>{isEn ? `Redraw ${selectedYear} Spread` : `重抽 ${selectedYear} 年运牌阵`}</span>
          </button>
          <span className="text-[11px] font-serif text-[#71717A]">
            {isEn
              ? 'Each year retains its own drawn spread in this session; redrawing only updates the selected year.'
              : '各年份在本次会话中独立保留牌组，切回可恢复；重抽仅刷新当前选中年份。'}
          </span>
        </div>
      </div>
    </div>
  );
}
