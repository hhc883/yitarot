'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getAllCards, TarotSuit } from '@/lib/tarot/deck';
import { TarotCardView } from '@/components/tarot/TarotCardView';
import { Search } from 'lucide-react';
import { IconBook78 } from '@/components/icons/QiIcons';

type TabType = 'all' | 'major' | TarotSuit;

export default function CardsEncyclopediaPage() {
  const params = useParams();
  const lang = (params?.lang as string) || 'zh';

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allCards = useMemo(() => getAllCards(), []);

  const filteredCards = useMemo(() => {
    return allCards.filter(card => {
      // 类别筛选
      if (activeTab === 'major' && card.arcana !== 'major') return false;
      if (['wands', 'cups', 'swords', 'pentacles'].includes(activeTab) && card.suit !== activeTab) return false;

      // 搜索筛选
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = card.nameZh.toLowerCase().includes(q) || card.nameEn.toLowerCase().includes(q);
        const matchesKw = card.keywords.some(k => k.toLowerCase().includes(q));
        return matchesName || matchesKw;
      }

      return true;
    });
  }, [allCards, activeTab, searchQuery]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10 sm:py-16">
      {/* 头部标题与引言 */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C29026]/10 text-[#8C6D23] border border-[#C29026]/20 text-xs font-medium mb-3">
          <IconBook78 size={14} className="text-[#8C6D23]" /> {lang === 'en' ? '78 Rider-Waite Cards Codex' : '78 张经典韦特塔罗全解'}
        </span>
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#1E1B18] tracking-tight">
          {lang === 'en' ? 'Tarot Card Encyclopedia' : '塔罗牌义百科大全'}
        </h1>
        <p className="text-xs sm:text-sm text-[#736B5E] mt-2 leading-relaxed">
          {lang === 'en'
            ? 'Explore 22 Major Arcana and 56 Minor Arcana. Tap any card to inspect upright and reversed meanings, psychological archetypes, and symbolism.'
            : '深入探索 22 张大阿卡纳与 56 张小阿卡纳。点击任意卡牌即可查阅其正逆位深层牌义、爱情与事业映射、象征图案及神谕启示。'}
        </p>
      </div>

      {/* 搜索与分类 Tab 工具栏 */}
      <div className="w-full max-w-4xl mx-auto mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* 分类 Tab */}
        <div className="flex flex-wrap justify-center gap-1.5 p-1 rounded-2xl bg-[#FFFDF9] border border-[#1E1B18]/10 shadow-xs">
          {[
            { id: 'all' as TabType, label: lang === 'en' ? 'All (78)' : '全部 (78)' },
            { id: 'major' as TabType, label: lang === 'en' ? 'Major (22)' : '大阿卡纳 (22)' },
            { id: 'wands' as TabType, label: lang === 'en' ? 'Wands · Fire (14)' : '权杖 · 火 (14)' },
            { id: 'cups' as TabType, label: lang === 'en' ? 'Cups · Water (14)' : '圣杯 · 水 (14)' },
            { id: 'swords' as TabType, label: lang === 'en' ? 'Swords · Air (14)' : '宝剑 · 风 (14)' },
            { id: 'pentacles' as TabType, label: lang === 'en' ? 'Pentacles · Earth (14)' : '星币 · 土 (14)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#1E1B18] text-[#FFFDF9] shadow-xs'
                  : 'text-[#736B5E] hover:text-[#1E1B18] hover:bg-[#FAF6ED]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 搜索框 */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#736B5E]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={lang === 'en' ? 'Search card (e.g. Fool / Lovers)...' : '搜索牌名（如：愚人 / 恋人）...'}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FFFDF9] border border-[#1E1B18]/12 text-xs sm:text-sm text-[#1E1B18] placeholder-[#736B5E]/50 focus:outline-hidden focus:border-[#C29026]"
          />
        </div>
      </div>

      {/* 卡牌网格展现 */}
      {filteredCards.length === 0 ? (
        <div className="text-center py-20 text-[#736B5E] text-sm">
          {lang === 'en' ? 'No matching cards found. Try another keyword.' : '未检索到匹配的塔罗牌，请尝试更换关键词。'}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {filteredCards.map(card => (
            <Link
              key={card.id}
              href={`/${lang}/cards/${card.slug}`}
              className="group flex flex-col items-center p-3 rounded-2xl bg-[#FFFDF9] border border-[#1E1B18]/10 hover:border-[#C29026]/40 shadow-xs hover:shadow-md transition-all"
            >
              <div className="group-hover:-translate-y-1 transition-transform duration-300">
                <TarotCardView
                  card={card}
                  isReversed={false}
                  isFlipped={true}
                  size="sm"
                  showDetails={false}
                />
              </div>

              <div className="mt-2.5 text-center w-full">
                <span className="font-serif font-bold text-sm text-[#1E1B18] group-hover:text-[#8C6D23] transition-colors block">
                  {card.nameZh}
                </span>
                <span className="text-[10px] text-[#736B5E] block font-serif italic">
                  {card.nameEn}
                </span>
                <div className="mt-1 flex flex-wrap justify-center gap-1">
                  {card.keywords.slice(0, 2).map((kw, i) => (
                    <span
                      key={i}
                      className="text-[9px] px-1.5 py-0.5 rounded-sm bg-[#FAF6ED] text-[#736B5E]"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
