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
      <section className="w-full max-w-5xl mx-auto px-4 pt-16 pb-20 text-center flex flex-col items-center">
        {/* 太极阴阳鱼核心图腾 */}
        <div className="mb-6 flex justify-center">
          <YinYangFish size={84} spin={true} glow={true} />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-[#FFE59A]/30 border border-[#E8CF86]/50 px-4 py-1.5 text-xs font-medium text-[#8C6D23] mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FateMaster · AI 驱动的东方智慧解析系统</span>
        </div>

        <h1 className="font-serif font-black text-4xl sm:text-6xl text-[#111111] tracking-tight leading-tight max-w-3xl mb-6">
          先由规则严谨排盘，<br />
          <span className="text-[#8C6D23] italic">再由 AI 提供个性化解读。</span>
        </h1>

        <p className="text-base sm:text-lg text-[#5C5549] max-w-2xl leading-relaxed mb-10">
          摒弃模棱两可的模糊占卜。FateMaster 严格依据中国古代天文历法、真太阳时与二十四节气换柱，将四柱八字与周易六爻转化为现代人直观可用的决策罗盘。
        </p>

        {/* 核心双入口 */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
          <Link
            href={`/${lang}/fatemaster/bazi`}
            className="flex-1 py-4 px-6 rounded-2xl bg-[#111111] hover:bg-[#333333] text-[#FFFDF9] font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-103"
          >
            <span>八字四柱排盘</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href={`/${lang}/fatemaster/liuyao`}
            className="flex-1 py-4 px-6 rounded-2xl bg-[#FFFDF9] hover:bg-[#FAF6ED] text-[#111111] ring-1 ring-[#111111]/10 font-medium text-sm flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-103"
          >
            <span>周易六爻神谕</span>
            <Compass className="w-4 h-4 text-[#8C6D23]" />
          </Link>
        </div>
      </section>

      {/* 三大核心命理分析系统 */}
      <section className="w-full max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-[#8C6D23] uppercase tracking-widest">
            METAPHYSICAL SUITE
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#111111] mt-1">
            三大东方命理分析系统
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 八字排盘 */}
          <div className="rounded-3xl bg-[#FFFDF9] ring-1 ring-[#111111]/10 p-7 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 shadow-xs">
                <IconScrollBaZi size={26} />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#111111] mb-2">
                八字四柱排盘
              </h3>
              <p className="text-xs text-[#5C5549] leading-relaxed mb-4">
                基于公历/农历智能换算四柱（年、月、日、时），计算十神生克、五行能量分布及日主元神特质。
              </p>
              <ul className="text-xs text-[#736B5E] space-y-1.5 font-medium">
                <li>• 严格 24 节气换月柱</li>
                <li>• 五行动态雷达与缺失调候</li>
                <li>• 天赋事业与财富格局洞察</li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-[#111111]/8">
              <Link
                href={`/${lang}/fatemaster/bazi`}
                className="w-full py-2.5 rounded-xl bg-[#FAF6ED] hover:bg-[#111111] hover:text-[#FFFDF9] text-[#111111] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                立即排盘体验
              </Link>
            </div>
          </div>

          {/* 周易六爻 */}
          <div className="rounded-3xl bg-[#FFFDF9] ring-1 ring-[#111111]/10 p-7 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 shadow-xs">
                <IconCoinLiuYao size={26} />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#111111] mb-2">
                周易六爻铜钱神谕
              </h3>
              <p className="text-xs text-[#5C5549] leading-relaxed mb-4">
                真实模拟古法“乾隆通宝”三枚铜钱 3D 物理掷币，推演初爻至上爻、本卦、动爻与变卦破局。
              </p>
              <ul className="text-xs text-[#736B5E] space-y-1.5 font-medium">
                <li>• GSAP 3D 抛掷与波浪翻转</li>
                <li>• 六十四卦全息卦爻辞数据库</li>
                <li>• 针对具体决策的应行应忌指南</li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-[#111111]/8">
              <Link
                href={`/${lang}/fatemaster/liuyao`}
                className="w-full py-2.5 rounded-xl bg-[#FAF6ED] hover:bg-[#111111] hover:text-[#FFFDF9] text-[#111111] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                开始金钱起卦
              </Link>
            </div>
          </div>

          {/* 生肖合盘 */}
          <div className="rounded-3xl bg-[#FFFDF9] ring-1 ring-[#111111]/10 p-7 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center mb-4 shadow-xs">
                <IconZodiacDragon size={26} />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#111111] mb-2">
                生肖与五行合盘
              </h3>
              <p className="text-xs text-[#5C5549] leading-relaxed mb-4">
                全覆盖 144 组生肖纳音配对矩阵，结合天作六合、三合吉局与相冲磨砺，推演恋爱、婚姻与事业合作。
              </p>
              <ul className="text-xs text-[#736B5E] space-y-1.5 font-medium">
                <li>• 144 组干支配对全覆盖</li>
                <li>• 婚姻契合度与信任指数分析</li>
                <li>• 相处避坑与互补破局指引</li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-[#111111]/8">
              <Link
                href={`/${lang}/fatemaster/compatibility`}
                className="w-full py-2.5 rounded-xl bg-[#FAF6ED] hover:bg-[#111111] hover:text-[#FFFDF9] text-[#111111] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                测算两人合盘
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
                A: 现代标准时间（北京时间）是基于东经 120 度的行政区时，而传统八字命理计算依据的是太阳真正照射到当地地平线正南方的时刻。如果出生在新疆或黑龙江，实际真太阳时与钟表时间可能相差 1 至 2 小时，直接影响时柱天干地支。FateMaster 原生支持经度真太阳时校准。
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
