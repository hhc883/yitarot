import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HeroFloatingCards } from '@/components/tarot/HeroFloatingCards';
import { DailyDrawWidget } from '@/components/tarot/DailyDrawWidget';
import { IconScrollBaZi, IconCoinLiuYao, IconZodiacDragon } from '@/components/icons/QiIcons';
import { CONTAINER } from './constants';

/**
 * 必须保留区：现有网站已经做好的东方周易三张卡 + 西方塔罗扇形交互 + 每日一签。
 * 原样保留，不改结构、不改交互，仅对齐到新版首页的窄栏与垂直节奏。
 */
export function LegacyShowcase({ lang = 'zh' }: { lang?: string }) {
  const isEn = lang === 'en';

  return (
    <>
      {/* 东方周易 */}
      <section className="w-full border-t border-line">
        <div className={`${CONTAINER} py-20 lg:py-[110px]`}>
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="font-serif text-[22px] font-black tracking-[-0.01em] text-[#111111]">
              {isEn ? 'Eastern Metaphysics' : '东方周易'}
            </h2>

            <Link
              href={`/${lang}/fatemaster`}
              className="flex items-center gap-1 text-xs font-serif text-[#6E675B] transition-colors hover:text-[#111111]"
            >
              <span>{isEn ? 'Explore I Ching' : '进入专厅'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Link
              href={`/${lang}/fatemaster/bazi`}
              className="group rounded-2xl border border-[#111111]/8 bg-[#FFFDF9] p-6 shadow-xs transition-all hover:border-[#111111]/20 hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F3EF] text-[#8C6D23]">
                <IconScrollBaZi size={20} />
              </div>
              <h3 className="mb-1.5 font-serif text-base font-bold text-[#111111] transition-colors group-hover:text-[#8C6D23]">
                {isEn ? 'BaZi Chart' : '四柱八字排盘'}
              </h3>
              <p className="text-xs leading-relaxed text-[#6E675B]">
                {isEn
                  ? 'Precise 24 solar terms, five elements, and core archetype.'
                  : '节气换柱、五行生克与日主元神深度推演。'}
              </p>
            </Link>

            <Link
              href={`/${lang}/fatemaster/liuyao`}
              className="group rounded-2xl border border-[#111111]/8 bg-[#FFFDF9] p-6 shadow-xs transition-all hover:border-[#111111]/20 hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F3EF] text-[#8C6D23]">
                <IconCoinLiuYao size={20} />
              </div>
              <h3 className="mb-1.5 font-serif text-base font-bold text-[#111111] transition-colors group-hover:text-[#8C6D23]">
                {isEn ? 'Six Lines Oracle' : '周易六爻神谕'}
              </h3>
              <p className="text-xs leading-relaxed text-[#6E675B]">
                {isEn
                  ? '3D coin toss oracle, changing lines, and hexagram shifts.'
                  : '乾隆通宝 3D 物理掷币，自下而上筑爻断卦。'}
              </p>
            </Link>

            <Link
              href={`/${lang}/fatemaster/compatibility`}
              className="group rounded-2xl border border-[#111111]/8 bg-[#FFFDF9] p-6 shadow-xs transition-all hover:border-[#111111]/20 hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F3EF] text-[#8C6D23]">
                <IconZodiacDragon size={20} />
              </div>
              <h3 className="mb-1.5 font-serif text-base font-bold text-[#111111] transition-colors group-hover:text-[#8C6D23]">
                {isEn ? 'Compatibility' : '生肖五行合盘'}
              </h3>
              <p className="text-xs leading-relaxed text-[#6E675B]">
                {isEn
                  ? '144 pairwise combinations, harmony and friction points.'
                  : '144 组干支配对，天作六合与相冲相克分析。'}
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* 西方塔罗（交互原样保留：点牌 / 翻牌 / 重抽 / 每日一句） */}
      <section className="w-full border-t border-line">
        <div className={`${CONTAINER} py-20 lg:py-[110px]`}>
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="font-serif text-[22px] font-black tracking-[-0.01em] text-[#111111]">
              {isEn ? 'Western Tarot' : '西方塔罗'}
            </h2>

            <Link
              href={`/${lang}/reading`}
              className="flex items-center gap-1 text-xs font-serif text-[#6E675B] transition-colors hover:text-[#111111]"
            >
              <span>{isEn ? 'Explore Tarot' : '进入专厅'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <HeroFloatingCards />
            <DailyDrawWidget lang={lang} />
          </div>
        </div>
      </section>

      {/* 共时性与心理原型（克制定调） */}
      <section className="w-full border-t border-line">
        <div className={`${CONTAINER} py-20 lg:py-[110px]`}>
          <div className="max-w-[640px]">
            <h2 className="font-serif text-[19px] font-bold text-ink">
              {isEn ? 'Synchronicity & The Archetypes' : '共时性与心理原型'}
            </h2>
            <p className="mt-5 text-[13.5px] leading-[1.85] text-soft">
              {isEn
                ? 'As Carl Jung stated, divination is a mirror of subconscious synchronicity. We provide clear psychological reflection rather than fatalistic decrees.'
                : '荣格在《周易》序言中提出“共时性原则”：蓍草数变与塔罗图腾，皆为潜意识对时空能量的投射。不做宿命判决，只作内心镜像。'}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
