import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Compass, Layers, ShieldCheck, Flame, BookOpen } from 'lucide-react';
import { YinYangFish } from '@/components/common/YinYangFish';
import { IconScrollBaZi, IconCoinLiuYao, IconZodiacDragon } from '@/components/icons/QiIcons';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export default async function FateMasterHomePage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';

  return (
    <div className="w-full flex flex-col items-center">
      {/* 头部 Hero */}
      <section className="w-full max-w-5xl mx-auto px-4 pt-16 pb-16 text-center flex flex-col items-center">
        {/* 太极阴阳鱼核心图腾 */}
        <div className="mb-6 flex justify-center">
          <YinYangFish size={72} spin={true} glow={true} />
        </div>

        <h1 className="font-serif font-black text-3xl sm:text-5xl text-[#111111] tracking-tight leading-tight max-w-3xl mb-4">
          {lang === 'en' ? (
            'Authentic Metaphysical Calculation with AI Insight'
          ) : (
            <>
              先由规则严谨排盘，<br />
              <span className="text-[#8C6D23] italic">再由 AI 提供个性化解读。</span>
            </>
          )}
        </h1>

        <p className="text-sm sm:text-base text-[#5C5549] max-w-2xl leading-relaxed mb-8">
          {lang === 'en'
            ? 'Rigorous calculations based on Chinese astronomical calendar, solar terms, and classic I Ching principles.'
            : '严格依据中国古代天文历法与二十四节气换柱，将四柱八字与周易六爻转化为清晰的决策参考。'}
        </p>

        {/* 核心双入口 */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm justify-center">
          <Link
            href={`/${lang}/fatemaster/bazi`}
            className="flex-1 py-3 px-5 rounded-xl bg-[#111111] hover:bg-[#333333] text-[#FFFDF9] font-serif text-xs tracking-wider flex items-center justify-center gap-2 transition-all"
          >
            <span>{lang === 'en' ? 'BaZi Chart' : '八字排盘'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href={`/${lang}/fatemaster/liuyao`}
            className="flex-1 py-3 px-5 rounded-xl bg-[#FFFDF9] hover:bg-[#FAF6ED] text-[#111111] border border-[#111111]/10 font-serif text-xs tracking-wider flex items-center justify-center gap-2 transition-all"
          >
            <span>{lang === 'en' ? 'I Ching Oracle' : '六爻起卦'}</span>
          </Link>
        </div>
      </section>

      {/* 三大核心命理分析系统 */}
      <section className="w-full max-w-5xl mx-auto px-4 py-12 border-t border-[#111111]/8">
        <div className="mb-8">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#111111]">
            {lang === 'en' ? 'Metaphysics Systems' : '命理系统'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 八字排盘 */}
          <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-6 shadow-2xs hover:border-[#111111]/25 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#F7F3EF] text-[#8C6D23] flex items-center justify-center mb-4">
                <IconScrollBaZi size={22} />
              </div>
              <h3 className="font-serif font-bold text-base text-[#111111] mb-2">
                {lang === 'en' ? 'BaZi Four Pillars' : '八字四柱排盘'}
              </h3>
              <p className="text-xs text-[#5C5549] leading-relaxed mb-4">
                {lang === 'en'
                  ? 'Calculate four pillars, ten gods, and five elements based on solar calendar.'
                  : '基于公历/农历智能换算四柱，计算十神生克、五行能量分布及日主元神特质。'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#111111]/8">
              <Link
                href={`/${lang}/fatemaster/bazi`}
                className="w-full py-2 rounded-lg bg-[#FAF6ED] hover:bg-[#111111] hover:text-[#FFFDF9] text-[#111111] text-xs font-serif text-center block transition-colors"
              >
                {lang === 'en' ? 'Open BaZi' : '进入排盘'}
              </Link>
            </div>
          </div>

          {/* 周易六爻 */}
          <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-6 shadow-2xs hover:border-[#111111]/25 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#F7F3EF] text-[#8C6D23] flex items-center justify-center mb-4">
                <IconCoinLiuYao size={22} />
              </div>
              <h3 className="font-serif font-bold text-base text-[#111111] mb-2">
                {lang === 'en' ? 'I Ching Coin Toss' : '周易六爻神谕'}
              </h3>
              <p className="text-xs text-[#5C5549] leading-relaxed mb-4">
                {lang === 'en'
                  ? '3D coin toss simulation with hexagram judgments and changing lines.'
                  : '模拟古法三枚铜钱 3D 物理掷币，推演初爻至上爻、本卦、动爻与变卦。'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#111111]/8">
              <Link
                href={`/${lang}/fatemaster/liuyao`}
                className="w-full py-2 rounded-lg bg-[#FAF6ED] hover:bg-[#111111] hover:text-[#FFFDF9] text-[#111111] text-xs font-serif text-center block transition-colors"
              >
                {lang === 'en' ? 'Cast Hexagram' : '开始起卦'}
              </Link>
            </div>
          </div>

          {/* 生肖合盘 */}
          <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-6 shadow-2xs hover:border-[#111111]/25 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#F7F3EF] text-[#8C6D23] flex items-center justify-center mb-4">
                <IconZodiacDragon size={22} />
              </div>
              <h3 className="font-serif font-bold text-base text-[#111111] mb-2">
                {lang === 'en' ? 'Zodiac Compatibility' : '生肖与五行合盘'}
              </h3>
              <p className="text-xs text-[#5C5549] leading-relaxed mb-4">
                {lang === 'en'
                  ? '144 pairs matrix for compatibility, mutual affinities, and balance.'
                  : '144 组生肖纳音配对矩阵，结合六合、三合吉局与相冲，推演关系契合度。'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#111111]/8">
              <Link
                href={`/${lang}/fatemaster/compatibility`}
                className="w-full py-2 rounded-lg bg-[#FAF6ED] hover:bg-[#111111] hover:text-[#FFFDF9] text-[#111111] text-xs font-serif text-center block transition-colors"
              >
                {lang === 'en' ? 'Check Compatibility' : '测算合盘'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 常见问题 FAQ */}
      <section className="w-full max-w-4xl mx-auto px-4 py-16">
        <div className="rounded-3xl bg-[#FAF6ED] ring-1 ring-[#111111]/10 p-8 sm:p-12">
          <h2 className="font-serif font-bold text-2xl text-[#111111] text-center mb-8">
            关于东方命理，你可能想了解
          </h2>
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/80 ring-1 ring-[#111111]/6">
              <h4 className="font-bold text-xs text-[#111111] mb-1">
                Q: 什么是八字中的“真太阳时”？为什么排盘前需要校准？
              </h4>
              <p className="text-xs text-[#5C5549] leading-relaxed">
                A: 现代标准时间（北京时间）是基于东经 120 度的行政区时，而传统八字命理计算依据的是太阳真正照射到当地地平线正南方的时刻。如果出生在新疆或黑龙江，实际真太阳时与钟表时间可能相差 1 至 2 小时，直接影响时柱天干地支。QiCosmos 原生支持经度真太阳时校准。
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 ring-1 ring-[#111111]/6">
              <h4 className="font-bold text-xs text-[#111111] mb-1">
                Q: 八字排盘和周易六爻有什么区别？我该选择哪一个？
              </h4>
              <p className="text-xs text-[#5C5549] leading-relaxed">
                A: **八字**是“原局与长线大运”，像一个人出厂自带的基因蓝图与气候四季，适合了解自己的天赋、性格盲区与长期运势走势；而**六爻**是“一事一卦”，针对眼下具体的一件事（如某笔投资、跳槽决策、某次谈判）在特定时空中的吉凶动向进行即时决断。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
