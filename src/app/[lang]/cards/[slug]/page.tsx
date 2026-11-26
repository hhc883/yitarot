import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllCards, getCardBySlug } from '@/lib/tarot/deck';
import { getTarotEvidence, type TarotEvidence } from '@/lib/tarot/waite-basis';
import { TarotCardView } from '@/components/tarot/TarotCardView';
import { JsonLd } from '@/components/seo/JsonLd';
import { Sparkles, ArrowLeft, ExternalLink } from 'lucide-react';
import { getSiteUrl } from '@/lib/seo/site-url';

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

function buildSourcedSummary(
  lang: 'zh' | 'en',
  upright?: TarotEvidence,
  reversed?: TarotEvidence
): string {
  if (lang === 'en') {
    if (upright && reversed) {
      return `Upright: ${upright.basisText} Reversed: ${reversed.basisText}`;
    }
    if (upright) return `Upright: ${upright.basisText}`;
    if (reversed) return `Reversed: ${reversed.basisText}`;
    return 'No verified Rider-Waite source entry is available for this card.';
  }

  if (upright && reversed) {
    return `正位：${upright.basisText} 逆位：${reversed.basisText}`;
  }
  if (upright) return `正位：${upright.basisText}`;
  if (reversed) return `逆位：${reversed.basisText}`;
  return '暂缺该牌的已核验韦特文献条目。';
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const siteUrl = getSiteUrl();
  const card = getCardBySlug(slug);
  if (!card) return { title: lang === 'en' ? 'Card Not Found' : '未找到卡牌' };

  const isEn = lang === 'en';
  const uprightEvidence = getTarotEvidence(slug, false, lang);
  const reversedEvidence = getTarotEvidence(slug, true, lang);
  const sourcedSummary = buildSourcedSummary(lang, uprightEvidence, reversedEvidence);

  const title = isEn
    ? `${card.nameEn} Tarot Meaning: Upright & Reversed`
    : `${card.nameZh}（${card.nameEn}）牌义：正位与逆位`;
  const socialTitle = `${title} | YiTatro`;

  const description = isEn
    ? `Rider-Waite ${card.nameEn} upright and reversed meanings: ${sourcedSummary}`
    : `韦特塔罗${card.nameZh}（${card.nameEn}）正位与逆位牌义：${sourcedSummary}`;

  const keywords = isEn
    ? [
        card.nameEn,
        `${card.nameEn} tarot meaning`,
        `${card.nameEn} upright`,
        `${card.nameEn} reversed`,
        'Rider-Waite tarot',
        'The Pictorial Key to the Tarot'
      ]
    : [
        card.nameZh,
        card.nameEn,
        `${card.nameZh}牌义`,
        `${card.nameZh}正位`,
        `${card.nameZh}逆位`,
        '韦特塔罗牌',
        'Rider-Waite'
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `${siteUrl}/${lang}/cards/${slug}`,
      languages: {
        zh: `${siteUrl}/zh/cards/${slug}`,
        en: `${siteUrl}/en/cards/${slug}`,
        'x-default': `${siteUrl}/zh/cards/${slug}`
      }
    },
    openGraph: {
      type: 'article',
      locale: isEn ? 'en_US' : 'zh_CN',
      url: `${siteUrl}/${lang}/cards/${slug}`,
      title: socialTitle,
      description,
      siteName: 'YiTatro'
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description
    }
  };
}

function OrientationCard({
  lang,
  orientation,
  evidence
}: {
  lang: 'zh' | 'en';
  orientation: 'upright' | 'reversed';
  evidence?: TarotEvidence;
}) {
  const isEn = lang === 'en';
  const isReversed = orientation === 'reversed';

  const heading = isEn
    ? isReversed
      ? 'Reversed Reference'
      : 'Upright Reference'
    : isReversed
      ? '逆位参考（Reversed）'
      : '正位参考（Upright）';

  const paraphraseLabel = isEn ? 'Paraphrase' : '文献转述';
  const missingText = isEn
    ? 'Missing source data: no verified Rider-Waite reference entry was found for this orientation.'
    : '缺失依据数据：未检索到该正逆位方向的已核验韦特文献条目。';

  return (
    <section
      data-evidence-ref={evidence?.sourceRef}
      className="p-4 sm:p-5 rounded-xl bg-white border border-zinc-200 shadow-xs flex flex-col justify-between gap-4"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide text-zinc-900">
            <span
              className={
                isReversed
                  ? 'w-2 h-2 rounded-full border border-zinc-900 bg-zinc-300 shrink-0'
                  : 'w-2 h-2 rounded-full bg-zinc-900 shrink-0'
              }
            />
            <span>{heading}</span>
          </h3>
          {evidence && (
            <span className="px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200 text-[11px] font-medium text-zinc-700 shrink-0">
              {paraphraseLabel}
            </span>
          )}
        </div>

        {evidence ? (
          <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
            {evidence.basisText}
          </p>
        ) : (
          <p className="text-xs sm:text-sm text-zinc-500 italic leading-relaxed">
            {missingText}
          </p>
        )}
      </div>

      {evidence && (
        <div className="pt-3 border-t border-zinc-100 text-[11px] text-zinc-600 leading-relaxed">
          <div>
            <span className="font-medium text-zinc-800">
              {isEn ? 'Source: ' : '出处：'}
            </span>
            <a
              href={evidence.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-baseline gap-1 text-zinc-700 underline underline-offset-2 hover:text-zinc-950 transition-colors"
            >
              <span>{evidence.sourceName}</span>
              <ExternalLink className="w-3 h-3 self-center shrink-0" aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </section>
  );
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

  const isEn = lang === 'en';
  const uprightEvidence = getTarotEvidence(slug, false, lang);
  const reversedEvidence = getTarotEvidence(slug, true, lang);
  const sourcedSummary = buildSourcedSummary(lang, uprightEvidence, reversedEvidence);

  const siteUrl = getSiteUrl();
  const cardName = isEn ? `${card.nameEn} (${card.nameZh})` : `${card.nameZh}（${card.nameEn}）`;

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: isEn ? 'Home' : '首页',
          item: `${siteUrl}/${lang}`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: isEn ? 'Tarot' : '塔罗专厅',
          item: `${siteUrl}/${lang}/west`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: isEn ? 'Tarot Cards' : '塔罗牌库',
          item: `${siteUrl}/${lang}/cards`
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: cardName,
          item: `${siteUrl}/${lang}/cards/${slug}`
        }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: isEn
        ? `${cardName} Upright & Reversed Tarot Meaning (Rider-Waite)`
        : `${cardName} 正位与逆位牌义参考（韦特塔罗）`,
      description: sourcedSummary,
      image: `${siteUrl}/cards/${card.arcana === 'major' ? 'major-arcana' : 'minor-arcana'}/${card.slug}.webp`,
      author: {
        '@type': 'Organization',
        name: 'YiTatro',
        url: siteUrl
      },
      publisher: {
        '@type': 'Organization',
        name: 'YiTatro',
        url: siteUrl
      },
      mainEntityOfPage: `${siteUrl}/${lang}/cards/${slug}`
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 lg:py-12">
      <JsonLd data={structuredData} />
      {/* 返回牌库 */}
      <div className="mb-6 sm:mb-8">
        <Link
          href={`/${lang}/cards`}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors group focus:outline-hidden focus:underline"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>{isEn ? 'Back to Card Library' : '返回 78 牌义库'}</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 lg:gap-y-6 lg:gap-x-10 items-start">
        {/* 标头信息：移动端排第 1，桌面端位于右栏顶部 */}
        <header className="order-1 lg:order-none lg:col-span-7 lg:col-start-6">
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 border border-zinc-200">
              {card.arcana === 'major'
                ? (isEn ? `Major Arcana ${card.romanNumeral}` : `大阿卡纳 ${card.romanNumeral}`)
                : (isEn ? `${card.suit} · Minor Arcana` : `${card.suit} · 小阿卡纳`)}
            </span>
            {card.element && (
              <span className="text-xs text-zinc-500 font-medium">
                {isEn ? `Element: ${card.element}` : `元素：${card.element}`}
              </span>
            )}
          </div>

          <h1 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-zinc-900 tracking-tight leading-tight">
            {isEn ? (
              card.nameEn
            ) : (
              <>
                {card.nameZh}{' '}
                <span className="text-lg sm:text-xl lg:text-2xl font-normal text-zinc-400 font-sans ml-1.5">
                  ({card.nameEn})
                </span>
              </>
            )}
          </h1>
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
            lang={lang}
          />
          <p className="text-xs text-zinc-500 leading-normal">
            {isEn ? 'Upright card illustration' : '正位牌面'}
          </p>

          <div className="mt-6 w-full pt-4 border-t border-zinc-200 flex flex-col gap-2">
            <Link
              href={`/${lang}/reading`}
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors border border-transparent shadow-xs focus:outline-hidden focus:ring-2 focus:ring-zinc-400"
            >
              <Sparkles className="w-4 h-4 text-zinc-300" />
              <span>{isEn ? 'Open AI Tarot Reading' : '前往 AI 塔罗占卜'}</span>
            </Link>
          </div>
        </div>

        {/* 正逆位历史文献参考：移动端排第 3，桌面端位于右栏标题下方 */}
        <div className="order-3 lg:order-none lg:col-span-7 lg:col-start-6 flex flex-col gap-6">
          <div className="space-y-3">
            <h2 className="font-serif font-semibold text-base sm:text-lg text-zinc-900">
              {isEn
                ? 'Upright & Reversed Reference (Rider-Waite)'
                : '正位与逆位牌义参考（韦特塔罗）'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <OrientationCard lang={lang} orientation="upright" evidence={uprightEvidence} />
              <OrientationCard lang={lang} orientation="reversed" evidence={reversedEvidence} />
            </div>
          </div>

          <section className="p-4 sm:p-5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
            <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
              {isEn ? 'Source & Reference Scope' : '文献依据与参考说明'}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              {isEn
                ? 'These summaries reflect traditional Rider-Waite divinatory themes for historical reference only and do not predict personal outcomes.'
                : '以上牌义仅梳理韦特塔罗传统文献中的象征主题，作历史参考之用，不作现实结果或个人运势预测。'}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
