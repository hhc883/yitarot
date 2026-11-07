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

      {/* 命理三大核心矩阵 */}
      <section className="w-full max-w-5xl mx-auto px-4 py-12 border-t border-[#111111]/8 space-y-16">
        {/* 1. 八字全系 */}
        <div>
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h2 className="font-serif font-black text-xl sm:text-2xl text-[#111111]">
                {lang === 'en' ? 'BaZi Four Pillars' : '八字命理系统'}
              </h2>
              <p className="text-xs font-serif text-[#736B5E] mt-0.5">
                干支推演 · 五行调候 · 每日运势 · 全息关系合盘
              </p>
            </div>
            <Link
              href={`/${lang}/fatemaster/relationship`}
              className="text-xs font-serif text-[#8C6D23] hover:text-[#111111] transition-colors"
            >
              关系合盘中心 →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href={`/${lang}/fatemaster/bazi`}
              className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#111111]/8 hover:border-[#111111]/25 transition-all shadow-2xs hover:shadow-xs group flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-serif font-bold text-[#111111] group-hover:text-[#8C6D23] transition-colors block mb-1">
                  四柱八字排盘
                </span>
                <p className="text-xs font-serif text-[#524B40] leading-relaxed">
                  24 节气换柱，大运流年与十神格局深度剖析。
                </p>
              </div>
              <span className="text-[11px] font-serif text-[#8C6D23] mt-3 block">排盘 →</span>
            </Link>

            <Link
              href={`/${lang}/fatemaster/bazi-daily`}
              className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#111111]/8 hover:border-[#111111]/25 transition-all shadow-2xs hover:shadow-xs group flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-serif font-bold text-[#111111] group-hover:text-[#8C6D23] transition-colors block mb-1">
                  八字每日运势
                </span>
                <p className="text-xs font-serif text-[#524B40] leading-relaxed">
                  流日十神、时辰吉凶能量波形与天时调候建议。
                </p>
              </div>
              <span className="text-[11px] font-serif text-[#8C6D23] mt-3 block">看今日 →</span>
            </Link>

            <Link
              href={`/${lang}/fatemaster/relationship`}
              className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#111111]/8 hover:border-[#111111]/25 transition-all shadow-2xs hover:shadow-xs group flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-serif font-bold text-[#111111] group-hover:text-[#8C6D23] transition-colors block mb-1">
                  全系关系合盘
                </span>
                <p className="text-xs font-serif text-[#524B40] leading-relaxed">
                  合婚、恋爱、事业、婆媳、亲子、朋友与职场九大合盘。
                </p>
              </div>
              <span className="text-[11px] font-serif text-[#8C6D23] mt-3 block">合盘中心 →</span>
            </Link>

            <Link
              href={`/${lang}/fatemaster/relationship-network`}
              className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#111111]/8 hover:border-[#111111]/25 transition-all shadow-2xs hover:shadow-xs group flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-serif font-bold text-[#111111] group-hover:text-[#8C6D23] transition-colors block mb-1">
                  八字关系图谱
                </span>
                <p className="text-xs font-serif text-[#524B40] leading-relaxed">
                  全景映射配偶、父母、子女与合伙人的多维气场网络。
                </p>
              </div>
              <span className="text-[11px] font-serif text-[#8C6D23] mt-3 block">查看图谱 →</span>
            </Link>
          </div>
        </div>

        {/* 2. 紫微斗数 */}
        <div>
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h2 className="font-serif font-black text-xl sm:text-2xl text-[#111111]">
                {lang === 'en' ? 'Ziwei Doushu' : '紫微斗数系统'}
              </h2>
              <p className="text-xs font-serif text-[#736B5E] mt-0.5">
                十二宫位 · 十四主星 · 生年四化 · 命身双核
              </p>
            </div>
            <Link
              href={`/${lang}/fatemaster/ziwei-marriage`}
              className="text-xs font-serif text-[#8C6D23] hover:text-[#111111] transition-colors"
            >
              紫微合婚 →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href={`/${lang}/fatemaster/ziwei`}
              className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#111111]/8 hover:border-[#111111]/25 transition-all shadow-2xs hover:shadow-xs group flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-serif font-bold text-[#111111] group-hover:text-[#8C6D23] transition-colors block mb-1">
                  AI 紫微斗数排盘
                </span>
                <p className="text-xs font-serif text-[#524B40] leading-relaxed">
                  经典十二宫方形盘面，计算命身宫、五行局与生年四化飞星，全景展现天赋潜能与大限运势。
                </p>
              </div>
              <span className="text-[11px] font-serif text-[#8C6D23] mt-4 block">进入紫微命盘 →</span>
            </Link>

            <Link
              href={`/${lang}/fatemaster/ziwei-marriage`}
              className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#111111]/8 hover:border-[#111111]/25 transition-all shadow-2xs hover:shadow-xs group flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-serif font-bold text-[#111111] group-hover:text-[#8C6D23] transition-colors block mb-1">
                  紫微双盘合婚
                </span>
                <p className="text-xs font-serif text-[#524B40] leading-relaxed">
                  双方命宫与夫妻宫主星互映交辉，分析生年四化引动与深层情缘默契，提供成熟婚后相处指引。
                </p>
              </div>
              <span className="text-[11px] font-serif text-[#8C6D23] mt-4 block">测算紫微合婚 →</span>
            </Link>
          </div>
        </div>

        {/* 3. 易道占卜 */}
        <div>
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h2 className="font-serif font-black text-xl sm:text-2xl text-[#111111]">
                {lang === 'en' ? 'I Ching & Divination' : '易道决策神谕系统'}
              </h2>
              <p className="text-xs font-serif text-[#736B5E] mt-0.5">
                梅花易数 · 周易六爻 · 奇门遁甲
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href={`/${lang}/fatemaster/meihua`}
              className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#111111]/8 hover:border-[#111111]/25 transition-all shadow-2xs hover:shadow-xs group flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-serif font-bold text-[#111111] group-hover:text-[#8C6D23] transition-colors block mb-1">
                  梅花易数 · 每日决策
                </span>
                <p className="text-xs font-serif text-[#524B40] leading-relaxed">
                  邵康节心易神数，体用生克断吉凶，专为当下投资、合作与职场决断提供精准行动指令。
                </p>
              </div>
              <span className="text-[11px] font-serif text-[#8C6D23] mt-3 block">梅花决断 →</span>
            </Link>

            <Link
              href={`/${lang}/fatemaster/liuyao`}
              className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#111111]/8 hover:border-[#111111]/25 transition-all shadow-2xs hover:shadow-xs group flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-serif font-bold text-[#111111] group-hover:text-[#8C6D23] transition-colors block mb-1">
                  周易六爻神谕
                </span>
                <p className="text-xs font-serif text-[#524B40] leading-relaxed">
                  真实模拟乾隆通宝 3D 物理掷币，推演初爻至上爻、本卦、动爻与变卦破局。
                </p>
              </div>
              <span className="text-[11px] font-serif text-[#8C6D23] mt-3 block">金钱起卦 →</span>
            </Link>

            <Link
              href={`/${lang}/fatemaster/qimen`}
              className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#111111]/8 hover:border-[#111111]/25 transition-all shadow-2xs hover:shadow-xs group flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-serif font-bold text-[#111111] group-hover:text-[#8C6D23] transition-colors block mb-1">
                  AI 奇门遁甲
                </span>
                <p className="text-xs font-serif text-[#524B40] leading-relaxed">
                  九宫八门九星八神，计算生门、开门、休门三大吉方，运筹帷幄决胜千里。
                </p>
              </div>
              <span className="text-[11px] font-serif text-[#8C6D23] mt-3 block">运筹奇门 →</span>
            </Link>
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
