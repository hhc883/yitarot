import React from 'react';
import Link from 'next/link';
import { MasterScrollytellingHero } from '@/components/portal/MasterScrollytellingHero';
import { HeroFloatingCards } from '@/components/tarot/HeroFloatingCards';
import { DailyDrawWidget } from '@/components/tarot/DailyDrawWidget';
import { Sparkles, ArrowRight, Compass, Layers, ShieldCheck, Heart } from 'lucide-react';
import { YinYangFish } from '@/components/common/YinYangFish';
import {
  IconScrollBaZi,
  IconCoinLiuYao,
  IconZodiacDragon,
  IconCrystalBall
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
      {/* 1. 核心双门开幕：900% GSAP 钉图深度长卷交互 */}
      <MasterScrollytellingHero lang={lang} />

      {/* 2. 东方周易特质专区展示 */}
      <section id="portal-content" className="w-full max-w-6xl mx-auto px-5 py-16 border-t border-[#111111]/8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
          <div>
            <span className="text-xs font-semibold text-[#8C6D23] uppercase tracking-widest">
              EASTERN METAPHYSICS
            </span>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#111111] mt-1">
              东方易境 · QiCosmos 周易
            </h2>
            <p className="text-xs sm:text-sm text-[#736B5E] mt-1">
              四柱八字严格按节气换柱 · 乾隆通宝 3D 金钱卦 · 五行能量全息调候
            </p>
          </div>

          <Link
            href={`/${lang}/fatemaster`}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#111111] hover:text-[#8C6D23] transition-colors"
          >
            <span>进入东方命理专区</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            href={`/${lang}/fatemaster/bazi`}
            className="p-6 rounded-3xl bg-[#FFFDF9] ring-1 ring-[#111111]/10 shadow-xs hover:shadow-md transition-all group"
          >
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs">
              <IconScrollBaZi size={22} />
            </div>
            <h3 className="font-serif font-bold text-base text-[#111111] mb-1">
              四柱八字排盘
            </h3>
            <p className="text-xs text-[#5C5549] leading-relaxed">
              天干地支、五行生克、十神格局、大运流年与日主元神特质深度剖析。
            </p>
          </Link>

          <Link
            href={`/${lang}/fatemaster/liuyao`}
            className="p-6 rounded-3xl bg-[#FFFDF9] ring-1 ring-[#111111]/10 shadow-xs hover:shadow-md transition-all group"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs">
              <IconCoinLiuYao size={22} />
            </div>
            <h3 className="font-serif font-bold text-base text-[#111111] mb-1">
              周易六爻铜钱神谕
            </h3>
            <p className="text-xs text-[#5C5549] leading-relaxed">
              乾隆通宝 3D 物理掷币，自下而上筑就六爻，辨本卦变卦之吉凶机缘。
            </p>
          </Link>

          <Link
            href={`/${lang}/fatemaster/compatibility`}
            className="p-6 rounded-3xl bg-[#FFFDF9] ring-1 ring-[#111111]/10 shadow-xs hover:shadow-md transition-all group"
          >
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs">
              <IconZodiacDragon size={22} />
            </div>
            <h3 className="font-serif font-bold text-base text-[#111111] mb-1">
              生肖五行合盘
            </h3>
            <p className="text-xs text-[#5C5549] leading-relaxed">
              144 组干支配对全覆盖，测算天作六合、三合生财与相冲磨砺指数。
            </p>
          </Link>
        </div>
      </section>

      {/* 3. 西方塔罗特质专区展示 */}
      <section className="w-full max-w-6xl mx-auto px-5 py-16 border-t border-[#111111]/8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
          <div>
            <span className="text-xs font-semibold text-[#8C6D23] uppercase tracking-widest">
              WESTERN TAROT
            </span>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#111111] mt-1">
              西方秘境 · QiCosmos 塔罗
            </h2>
            <p className="text-xs sm:text-sm text-[#736B5E] mt-1">
              78 张经典韦特塔罗全解 · 3D 洗牌抽牌 · 多位专属 AI 导师陪伴解牌
            </p>
          </div>

          <Link
            href={`/${lang}/reading`}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#8C6D23] hover:text-[#111111] transition-colors"
          >
            <span>进入西方塔罗空间</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 动态卡牌与每日一签组合预览 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <HeroFloatingCards />
          <DailyDrawWidget lang={lang} />
        </div>
      </section>

      {/* 4. 东西合璧哲学背景 (荣格心理学共时性) */}
      <section className="w-full max-w-4xl mx-auto px-5 py-16">
        <div className="rounded-3xl bg-[#FAF6ED] ring-1 ring-[#111111]/10 p-8 sm:p-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-3 text-[#8C6D23]">
            <YinYangFish size={24} spin={false} />
            <span className="text-sm opacity-60">✦</span>
            <IconCrystalBall size={24} />
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#111111] mb-3">
            东方生克，西方原型 · 终归天人之镜
          </h2>
          <p className="text-xs sm:text-sm text-[#5C5549] max-w-2xl mx-auto leading-relaxed mb-6">
            卡尔·荣格（Carl Jung）在为卫礼贤《周易》英译本作序时曾提出“共时性原则（Synchronicity）”：
            无论是东方蓍草铜钱的数变，还是西方塔罗牌面的图腾，都是人类潜意识对当下时空能量的一次精准投射。
            我们不做宿命论的判决，只为你提供最清澈的心灵镜像。
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-[#8C6D23] font-medium">
            <span>• 先由严谨规则排盘</span>
            <span>• 再由智能 AI 深度解读</span>
            <span>• 赋能当下自主抉择</span>
          </div>
        </div>
      </section>
    </div>
  );
}
