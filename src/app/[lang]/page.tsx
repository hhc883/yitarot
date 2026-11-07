import React from 'react';
import Link from 'next/link';
import { MasterScrollytellingHero } from '@/components/portal/MasterScrollytellingHero';
import { HeroFloatingCards } from '@/components/tarot/HeroFloatingCards';
import { DailyDrawWidget } from '@/components/tarot/DailyDrawWidget';
import { ArrowRight } from 'lucide-react';
import {
  IconScrollBaZi,
  IconCoinLiuYao,
  IconZodiacDragon
} from '@/components/icons/QiIcons';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export default async function MasterPortalPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';

  return (
    <div className="w-full flex flex-col items-center overflow-hidden">
      {/* 1. 核心长卷交互 */}
      <MasterScrollytellingHero lang={lang} />

      {/* 2. 东方周易 */}
      <section id="portal-content" className="w-full max-w-5xl mx-auto px-5 py-20 border-t border-[#111111]/8">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-serif font-black text-2xl text-[#111111]">
            {lang === 'en' ? 'Eastern Metaphysics' : '东方周易'}
          </h2>

          <Link
            href={`/${lang}/fatemaster`}
            className="flex items-center gap-1 text-xs font-serif text-[#6E675B] hover:text-[#111111] transition-colors"
          >
            <span>{lang === 'en' ? 'Explore I Ching' : '进入专厅'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Link
            href={`/${lang}/fatemaster/bazi`}
            className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#111111]/8 hover:border-[#111111]/20 shadow-xs hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F7F3EF] text-[#8C6D23] flex items-center justify-center mb-4">
              <IconScrollBaZi size={20} />
            </div>
            <h3 className="font-serif font-bold text-base text-[#111111] mb-1.5 group-hover:text-[#8C6D23] transition-colors">
              {lang === 'en' ? 'BaZi Chart' : '四柱八字排盘'}
            </h3>
            <p className="text-xs text-[#6E675B] leading-relaxed">
              {lang === 'en' ? 'Precise 24 solar terms, five elements, and core archetype.' : '节气换柱、五行生克与日主元神深度推演。'}
            </p>
          </Link>

          <Link
            href={`/${lang}/fatemaster/liuyao`}
            className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#111111]/8 hover:border-[#111111]/20 shadow-xs hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F7F3EF] text-[#8C6D23] flex items-center justify-center mb-4">
              <IconCoinLiuYao size={20} />
            </div>
            <h3 className="font-serif font-bold text-base text-[#111111] mb-1.5 group-hover:text-[#8C6D23] transition-colors">
              {lang === 'en' ? 'Six Lines Oracle' : '周易六爻神谕'}
            </h3>
            <p className="text-xs text-[#6E675B] leading-relaxed">
              {lang === 'en' ? '3D coin toss oracle, changing lines, and hexagram shifts.' : '乾隆通宝 3D 物理掷币，自下而上筑爻断卦。'}
            </p>
          </Link>

          <Link
            href={`/${lang}/fatemaster/compatibility`}
            className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#111111]/8 hover:border-[#111111]/20 shadow-xs hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F7F3EF] text-[#8C6D23] flex items-center justify-center mb-4">
              <IconZodiacDragon size={20} />
            </div>
            <h3 className="font-serif font-bold text-base text-[#111111] mb-1.5 group-hover:text-[#8C6D23] transition-colors">
              {lang === 'en' ? 'Compatibility' : '生肖五行合盘'}
            </h3>
            <p className="text-xs text-[#6E675B] leading-relaxed">
              {lang === 'en' ? '144 pairwise combinations, harmony and friction points.' : '144 组干支配对，天作六合与相冲相克分析。'}
            </p>
          </Link>
        </div>
      </section>

      {/* 3. 西方塔罗 */}
      <section className="w-full max-w-5xl mx-auto px-5 py-20 border-t border-[#111111]/8">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-serif font-black text-2xl text-[#111111]">
            {lang === 'en' ? 'Western Tarot' : '西方塔罗'}
          </h2>

          <Link
            href={`/${lang}/reading`}
            className="flex items-center gap-1 text-xs font-serif text-[#6E675B] hover:text-[#111111] transition-colors"
          >
            <span>{lang === 'en' ? 'Explore Tarot' : '进入专厅'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <HeroFloatingCards />
          <DailyDrawWidget lang={lang} />
        </div>
      </section>

      {/* 4. 共时性与心理原型 */}
      <section className="w-full max-w-3xl mx-auto px-5 py-20">
        <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/8 p-8 sm:p-12 text-center">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#111111] mb-3">
            {lang === 'en' ? 'Synchronicity & The Archetypes' : '共时性与心理原型'}
          </h2>
          <p className="text-xs sm:text-sm text-[#6E675B] leading-relaxed">
            {lang === 'en'
              ? 'As Carl Jung stated, divination is a mirror of subconscious synchronicity. We provide clear psychological reflection rather than fatalistic decrees.'
              : '荣格在《周易》序言中提出“共时性原则”：蓍草数变与塔罗图腾，皆为潜意识对时空能量的投射。不做宿命判决，只作内心镜像。'}
          </p>
        </div>
      </section>
    </div>
  );
}
