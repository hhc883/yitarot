import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllCards, getCardBySlug } from '@/lib/tarot/deck';
import { ALL_CARD_DETAIL_EN } from '@/lib/tarot/card-detail-en';
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
  const { lang: rawLang, slug } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const card = getCardBySlug(slug);
  if (!card) return { title: lang === 'en' ? 'Card Not Found | YiTatro' : '未找到卡牌 | YiTatro' };

  if (lang === 'en') {
    const enDetail = ALL_CARD_DETAIL_EN[slug];
    if (enDetail) {
      return {
        title: `${card.nameEn} (${card.nameZh}) Tarot Meaning - Upright, Reversed, Love, Career & Symbolism | YiTatro`,
        description: `Explore the deep tarot meaning of ${card.nameEn} (${card.nameZh}): upright & reversed themes (${enDetail.uprightKeywords.join(', ')}), with insights on love, career, and archetypal symbolism.`
      };
    }
    return {
      title: `${card.nameEn} (${card.nameZh}) Tarot Meaning | YiTatro`,
      description: `Tarot reading and archetype interpretation for ${card.nameEn} (${card.nameZh}). Chinese detailed commentary available.`
    };
  }

  return {
    title: `${card.nameZh}（${card.nameEn}）牌义详解 - 正逆位、爱情、事业与象征 | YiTatro`,
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

  const enDetail = lang === 'en' ? ALL_CARD_DETAIL_EN[slug] : undefined;
  const isFallbackEn = lang === 'en' && !enDetail;

  const keywords = enDetail ? enDetail.keywords : card.keywords;
  const uprightKeywords = enDetail ? enDetail.uprightKeywords : card.uprightKeywords;
  const reversedKeywords = enDetail ? enDetail.reversedKeywords : card.reversedKeywords;
  const uprightMeaning = enDetail ? enDetail.uprightMeaning : card.uprightMeaning;
  const reversedMeaning = enDetail ? enDetail.reversedMeaning : card.reversedMeaning;
  const loveMeaning = enDetail ? enDetail.loveMeaning : card.loveMeaning;
  const careerMeaning = enDetail ? enDetail.careerMeaning : card.careerMeaning;
  const symbolism = enDetail ? enDetail.symbolism : card.symbolism;
  const advice = enDetail ? enDetail.advice : card.advice;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 lg:py-12">
      {/* 返回牌库 */}
      <div className="mb-6 sm:mb-8">
        <Link
          href={`/${lang}/cards`}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors group focus:outline-hidden focus:underline"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>{lang === 'en' ? 'Back to Card Library' : '返回 78 牌义库'}</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 lg:gap-y-6 lg:gap-x-10 items-start">
        {/* 标头信息：移动端排第 1，桌面端位于右栏顶部 */}
        <header className="order-1 lg:order-none lg:col-span-7 lg:col-start-6">
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 border border-zinc-200">
              {card.arcana === 'major'
                ? (lang === 'en' ? `Major Arcana ${card.romanNumeral}` : `大阿卡纳 ${card.romanNumeral}`)
                : (lang === 'en' ? `${card.suit} · Minor Arcana` : `${card.suit} · 小阿卡纳`)}
            </span>
            {card.element && (
              <span className="text-xs text-zinc-500 font-medium">
                {lang === 'en' ? `Element: ${card.element}` : `元素：${card.element}`}
              </span>
            )}
          </div>

          <h1 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-zinc-900 tracking-tight leading-tight">
            {lang === 'en' ? (
              <>
                {card.nameEn}{' '}
                <span lang="zh-CN" className="text-lg sm:text-xl lg:text-2xl font-normal text-zinc-400 font-sans ml-1.5">
                  ({card.nameZh})
                </span>
              </>
            ) : (
              <>
                {card.nameZh}{' '}
                <span className="text-lg sm:text-xl lg:text-2xl font-normal text-zinc-400 font-sans ml-1.5">
                  ({card.nameEn})
                </span>
              </>
            )}
          </h1>

          <div
            className="flex flex-wrap gap-1.5 mt-3"
            {...(isFallbackEn ? { lang: 'zh-CN' } : {})}
          >
            {keywords.map((kw, i) => (
              <span
                key={i}
                className="px-2.5 py-0.5 rounded-md bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 font-normal"
              >
                #{kw}
              </span>
            ))}
          </div>

          {isFallbackEn && (
            <div className="mt-4 p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span>This interpretation is currently available in Chinese.</span>
              <Link
                href={`/zh/cards/${card.slug}`}
                className="font-medium text-zinc-900 underline hover:text-zinc-600 transition-colors inline-block"
              >
                View in Chinese
              </Link>
            </div>
          )}
        </header>

        {/* 卡牌预览：移动端排第 2（与标题相邻且先于正逆位），桌面端位于左栏并随长文滚动 */}
        <div className="order-2 lg:order-none lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:row-end-3 lg:sticky lg:top-8 flex flex-col items-center p-6 rounded-2xl bg-white border border-zinc-200 text-center shadow-xs">
          <TarotCardView
            card={card}
            isReversed={false}
            isFlipped={true}
            size="xl"
            showDetails={false}
            className="mb-4"
          />
          <p className="text-xs text-zinc-500 leading-normal">
            {lang === 'en' ? '💡 Tap card to flip and inspect archetypal symbols' : '💡 点击卡牌可翻转查看背影日月图腾'}
          </p>

          <div className="mt-6 w-full pt-4 border-t border-zinc-200 flex flex-col gap-2">
            <Link
              href={`/${lang}/reading?card=${card.id}`}
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors border border-transparent shadow-xs focus:outline-hidden focus:ring-2 focus:ring-zinc-400"
            >
              <Sparkles className="w-4 h-4 text-zinc-300" />
              <span>{lang === 'en' ? 'Ask AI with this Card' : '以此牌向 AI 塔罗师提问'}</span>
            </Link>
          </div>
        </div>

        {/* 牌义详析分组：移动端排第 3，桌面端位于右栏标题下方 */}
        <div
          className="order-3 lg:order-none lg:col-span-7 lg:col-start-6 flex flex-col gap-6"
          {...(isFallbackEn ? { lang: 'zh-CN' } : {})}
        >
          {/* 正位与逆位对比 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 正位 */}
            <div className="p-4 sm:p-5 rounded-xl bg-white border border-zinc-200 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-zinc-900 mb-2">
                <span className="w-2 h-2 rounded-full bg-zinc-900" />
                <span>{lang === 'en' ? 'Upright Reading' : '正位解读（Upright）'}</span>
              </div>
              <div className="text-xs text-zinc-600 font-medium mb-2.5">
                {uprightKeywords.join(lang === 'en' && !isFallbackEn ? ' · ' : ' · ')}
              </div>
              <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
                {uprightMeaning}
              </p>
            </div>

            {/* 逆位 */}
            <div className="p-4 sm:p-5 rounded-xl bg-white border border-zinc-200 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-zinc-900 mb-2">
                <span className="w-2 h-2 rounded-full border border-zinc-900 bg-zinc-300" />
                <span>{lang === 'en' ? 'Reversed Reading' : '逆位解读（Reversed）'}</span>
              </div>
              <div className="text-xs text-zinc-600 font-medium mb-2.5">
                {reversedKeywords.join(lang === 'en' && !isFallbackEn ? ' · ' : ' · ')}
              </div>
              <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
                {reversedMeaning}
              </p>
            </div>
          </div>

          {/* 感情与事业细分 */}
          <div className="p-4 sm:p-5 rounded-xl bg-white border border-zinc-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 flex items-center gap-2 mb-1.5">
                <IconLove size={16} className="text-zinc-700" />
                <span>{lang === 'en' ? 'Love & Relationship Insight' : '情感与人际启示'}</span>
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                {loveMeaning}
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-100">
              <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 flex items-center gap-2 mb-1.5">
                <IconCareer size={16} className="text-zinc-700" />
                <span>{lang === 'en' ? 'Career & Wealth Insight' : '职场与财富启示'}</span>
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                {careerMeaning}
              </p>
            </div>
          </div>

          {/* 象征图腾与灵性箴言 */}
          <div className="p-4 sm:p-5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-4">
            <div>
              <span className="text-xs font-semibold text-zinc-900 uppercase tracking-wider block mb-1.5">
                {lang === 'en' ? 'Archetypal Symbolism' : '图腾象征意义（Symbolism）'}
              </span>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                {symbolism}
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-200">
              <span className="text-xs font-semibold text-zinc-900 uppercase tracking-wider block mb-1.5">
                {lang === 'en' ? 'Oracle Advice' : '神谕行动指引（Oracle Advice）'}
              </span>
              <p className="font-serif italic text-xs sm:text-sm text-zinc-900 leading-relaxed">
                “{advice}”
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
