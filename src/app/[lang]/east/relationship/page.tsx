import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { RELATIONSHIP_CONFIGS, RelationshipType } from '@/lib/metaphysics/relationship';
import { ArrowRight } from 'lucide-react';
import { RelationshipSynastryWidget } from '@/components/east/RelationshipSynastryWidget';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbJsonLd, buildLocalizedMetadata } from '@/lib/seo/metadata';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';

  return buildLocalizedMetadata({
    lang,
    routePath: '/east/relationship',
    title: isEn
      ? 'Relationship Synastry Hub - 9 BaZi & Zodiac Compatibility Models'
      : '关系合盘中心｜八字合婚·恋爱·商业合伙·婆媳职场九大合盘',
    description: isEn
      ? 'Nine specialized BaZi and Zodiac synastry models covering marriage, romance, business partnership, leadership, and family dynamics.'
      : '涵盖八字合婚、恋爱合盘、商业合伙、上下级职场、婆媳与亲子等九大关系合盘模型，深入解析五行互补与沟通契机。',
    keywords: isEn
      ? ['BaZi synastry', 'Relationship compatibility', 'Chinese marriage matching']
      : ['八字合婚', '关系合盘', '恋爱合盘', '商业合伙命理']
  });
}

export default async function RelationshipHubPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';

  const typesList = Object.keys(RELATIONSHIP_CONFIGS) as RelationshipType[];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pt-10 pb-16 sm:pt-14 sm:pb-20 text-[#171717]">
      <JsonLd
        data={buildBreadcrumbJsonLd(lang, [
          { name: isEn ? 'I Ching & BaZi' : '东方专厅', path: '/east' },
          { name: isEn ? 'Relationship Synastry' : '关系合盘中心', path: '/east/relationship' }
        ])}
      />
      {/* 核心交互推演台 */}
      <RelationshipSynastryWidget lang={lang} isHub={true} />

      {/* 9 种关系合盘矩阵 */}
      <section className="w-full mt-16 sm:mt-20 pt-10 sm:pt-12 border-t border-[#E5E5E5]">
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#171717] tracking-tight">
            {isEn ? 'All Relationship Types' : '全系关系合盘专厅'}
          </h2>
          <p className="text-xs sm:text-sm text-[#737373] mt-1.5 max-w-2xl">
            {isEn
              ? 'Comprehensive metaphysical synastry across marriage, emotion, commerce, family, and workplace dynamics.'
              : '涵盖婚姻、情感、商道、家族与职场全谱系深度命理契合度测算'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
          {typesList.map(t => {
            const cfg = RELATIONSHIP_CONFIGS[t];
            return (
              <Link
                key={t}
                href={`/${lang}/east/relationship/${t}`}
                className="group p-5 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] hover:border-[#171717] transition-colors shadow-none flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-serif font-medium text-base text-[#171717] group-hover:text-black transition-colors">
                      {isEn ? cfg.titleEn : cfg.titleZh}
                    </h3>
                    <ArrowRight className="w-4 h-4 text-[#737373] group-hover:translate-x-0.5 group-hover:text-[#171717] transition-all" />
                  </div>
                  <p className="text-xs text-[#52525B] leading-relaxed line-clamp-2">
                    {isEn ? (cfg.summaryEn || cfg.summaryZh) : cfg.summaryZh}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E5E5E5] flex justify-between items-center text-[11px] text-[#737373]">
                  <span>{isEn ? (cfg.focusEn?.split('·')[0] || cfg.focusZh.split('·')[0]) : cfg.focusZh.split('·')[0]}</span>
                  <span className="font-medium text-[#171717] group-hover:underline">
                    {isEn ? 'Calculate →' : '测算 →'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}