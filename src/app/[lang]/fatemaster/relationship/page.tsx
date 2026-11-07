import React from 'react';
import Link from 'next/link';
import { RELATIONSHIP_CONFIGS, RelationshipType } from '@/lib/metaphysics/relationship';
import { ArrowRight } from 'lucide-react';
import { RelationshipSynastryWidget } from '@/components/fatemaster/RelationshipSynastryWidget';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
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
    <div className="w-full max-w-5xl mx-auto px-4 py-12 sm:py-16">
      {/* 核心交互推演台 */}
      <RelationshipSynastryWidget lang={lang} />

      {/* 9 种关系合盘矩阵 */}
      <section className="w-full mt-20 pt-12 border-t border-[#111111]/8">
        <div className="mb-8">
          <h2 className="font-serif font-black text-xl sm:text-2xl text-[#111111]">
            {isEn ? 'All Relationship Types' : '全系关系合盘专厅'}
          </h2>
          <p className="text-xs font-serif text-[#736B5E] mt-1">
            {isEn
              ? 'Comprehensive metaphysical synastry across marriage, emotion, commerce, family, and workplace dynamics.'
              : '涵盖婚姻、情感、商道、家族与职场全谱系深度命理契合度测算'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {typesList.map(t => {
            const cfg = RELATIONSHIP_CONFIGS[t];
            return (
              <Link
                key={t}
                href={`/${lang}/fatemaster/relationship/${t}`}
                className="group p-5 rounded-2xl bg-[#FFFDF9] border border-[#111111]/8 hover:border-[#111111]/25 transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-serif font-bold text-base text-[#111111] group-hover:text-[#8C6D23] transition-colors">
                      {isEn ? cfg.titleEn : cfg.titleZh}
                    </h3>
                    <ArrowRight className="w-3.5 h-3.5 text-[#736B5E] group-hover:translate-x-0.5 group-hover:text-[#111111] transition-all" />
                  </div>
                  <p className="text-xs font-serif text-[#524B40] leading-relaxed line-clamp-2">
                    {isEn ? (cfg.summaryEn || cfg.summaryZh) : cfg.summaryZh}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#111111]/6 flex justify-between items-center text-[11px] font-serif text-[#8C6D23]">
                  <span>{isEn ? (cfg.focusEn?.split('·')[0] || cfg.focusZh.split('·')[0]) : cfg.focusZh.split('·')[0]}</span>
                  <span className="text-[#736B5E] group-hover:text-[#111111] transition-colors">
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