import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllCards, getCardBySlug } from '@/lib/tarot/deck';
import { TarotCardView } from '@/components/tarot/TarotCardView';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { IconLove, IconCareer } from '@/components/icons/QiIcons';

export async function generateStaticParams() {
  const cards = getAllCards();
  const langs = ['zh', 'en'];
  const params: { lang: string; slug: string }[] = [];
  for (const lang of langs) {
    for (const card of cards) {
      params.push({ lang, slug: card.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  if (!card) return { title: '未找到卡牌' };

  return {
    title: `${card.nameZh}（${card.nameEn}）牌义详解 - 正逆位、爱情、事业与象征 | QiCosmos`,
    description: `深入解析塔罗牌【${card.nameZh}】的正位与逆位含义：${card.uprightKeywords.join('、')}。在爱情、工作与心理学层面的深刻启示。`
  };
}

export default async function CardDetailPage({
  params
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: rawLang, slug } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const card = getCardBySlug(slug);

  if (!card) {
    notFound();
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-16">
      {/* 返回上级 */}
      <Link
        href={`/${lang}/cards`}
        className="inline-flex items-center gap-1.5 text-xs text-[#736B5E] hover:text-[#1E1B18] transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> {lang === 'en' ? 'Back to Codex' : '返回 78 牌义库'}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* 左侧：3D 卡牌大图展示 */}
        <div className="md:col-span-5 flex flex-col items-center p-6 rounded-3xl bg-[#FFFDF9] border border-[#1E1B18]/10 shadow-sm text-center">
          <TarotCardView
            card={card}
            isReversed={false}
            isFlipped={true}
            size="xl"
            showDetails={false}
            className="mb-4"
          />
          <span className="text-[11px] text-[#736B5E]">
            {lang === 'en' ? '💡 Tap card to flip and inspect archetypal symbols' : '💡 点击卡牌可翻转查看背影日月图腾'}
          </span>

          <div className="mt-6 w-full pt-4 border-t border-[#1E1B18]/10 flex flex-col gap-2">
            <Link
              href={`/${lang}/reading?card=${card.id}`}
              className="w-full py-3 rounded-2xl bg-[#1E1B18] hover:bg-[#38332D] text-[#FFFDF9] font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>{lang === 'en' ? 'Ask AI with this Card' : '以此牌向 AI 塔罗师提问'}</span>
            </Link>
          </div>
        </div>

        {/* 右侧：牌义详析 */}
        <div className="md:col-span-7 flex flex-col gap-6">
          {/* 标头信息 */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#C29026]/10 text-[#8C6D23] border border-[#C29026]/20">
                {card.arcana === 'major'
                  ? (lang === 'en' ? `Major Arcana ${card.romanNumeral}` : `大阿卡纳 ${card.romanNumeral}`)
                  : (lang === 'en' ? `${card.suit} · Minor Arcana` : `${card.suit} · 小阿卡纳`)}
              </span>
              {card.element && (
                <span className="text-xs text-[#736B5E]">{lang === 'en' ? `Element: ${card.element}` : `元素：${card.element}`}</span>
              )}
            </div>
            <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#1E1B18]">
              {lang === 'en' ? card.nameEn : card.nameZh}{' '}
              <span className="text-xl sm:text-2xl font-normal italic text-[#736B5E]">
                ({lang === 'en' ? card.nameZh : card.nameEn})
              </span>
            </h1>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {card.keywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF6ED] border border-[#1E1B18]/5 text-xs text-[#5C5549] font-medium"
                >
                  #{kw}
                </span>
              ))}
            </div>
          </div>

          {/* 正位与逆位对比 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 正位 */}
            <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-emerald-200 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> {lang === 'en' ? 'Upright Reading' : '正位解读（Upright）'}
              </div>
              <div className="text-[11px] text-emerald-700 font-medium mb-2">
                {card.uprightKeywords.join(' · ')}
              </div>
              <p className="text-xs text-[#1E1B18] leading-relaxed">
                {card.uprightMeaning}
              </p>
            </div>

            {/* 逆位 */}
            <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-amber-200 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> {lang === 'en' ? 'Reversed Reading' : '逆位解读（Reversed）'}
              </div>
              <div className="text-[11px] text-amber-700 font-medium mb-2">
                {card.reversedKeywords.join(' · ')}
              </div>
              <p className="text-xs text-[#1E1B18] leading-relaxed">
                {card.reversedMeaning}
              </p>
            </div>
          </div>

          {/* 感情与事业细分 */}
          <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#1E1B18]/10 shadow-xs space-y-4">
            <div>
              <h3 className="text-xs font-bold text-[#1E1B18] flex items-center gap-1.5 mb-1">
                <IconLove size={15} className="text-rose-500" /> {lang === 'en' ? 'Love & Relationship Insight' : '情感与人际启示'}
              </h3>
              <p className="text-xs text-[#5C5549] leading-relaxed">
                {card.loveMeaning}
              </p>
            </div>

            <div className="pt-3 border-t border-[#1E1B18]/8">
              <h3 className="text-xs font-bold text-[#1E1B18] flex items-center gap-1.5 mb-1">
                <IconCareer size={15} className="text-[#8C6D23]" /> {lang === 'en' ? 'Career & Wealth Insight' : '职场与财富启示'}
              </h3>
              <p className="text-xs text-[#5C5549] leading-relaxed">
                {card.careerMeaning}
              </p>
            </div>
          </div>

          {/* 象征图腾与灵性箴言 */}
          <div className="p-5 rounded-2xl bg-[#FAF6ED] border border-[#1E1B18]/10 space-y-3">
            <div>
              <span className="text-[11px] font-semibold text-[#8C6D23] uppercase tracking-wider block mb-1">
                {lang === 'en' ? 'Archetypal Symbolism' : '图腾象征意义（Symbolism）'}
              </span>
              <p className="text-xs text-[#5C5549] leading-relaxed">
                {card.symbolism}
              </p>
            </div>
            <div className="pt-3 border-t border-[#1E1B18]/10">
              <span className="text-[11px] font-semibold text-[#8C6D23] uppercase tracking-wider block mb-1">
                {lang === 'en' ? 'Oracle Advice' : '神谕行动指引（Oracle Advice）'}
              </span>
              <p className="font-serif italic text-xs text-[#1E1B18] leading-relaxed">
                “{card.advice}”
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
