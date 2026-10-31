import { use } from "react";
import Link from "next/link";
import { BookOpen, Sparkles, Compass, Feather, Flame, ArrowRight } from "lucide-react";
import { Locale } from "@/lib/i18n/dictionaries";

export default function KnowledgePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = use(params);
  const lang: Locale = rawLang === "zh" ? "zh" : "en";

  const articles = [
    {
      id: "day-masters-guide",
      category: lang === "en" ? "BaZi Cosmology" : "八字命理",
      icon: Feather,
      title: lang === "en" ? "The 10 Day Masters: Decoding Your Authentic Soul Element" : "十天干日主全解析：你属于哪一种本命元神？",
      excerpt: lang === "en"
        ? "Unlike Western astrology which focuses purely on the Sun, Eastern BaZi calculates your 'Day Master' (日主) — the spiritual nucleus of your birth chart. Learn the 10 archetype personalities from Jia Wood to Gui Water."
        : "西方占星重在太阳星座，而东方八字四柱的核心命核在于“日主”（日元）。详解十种天干元神人格特质，看清自己的核心天赋与修行功课。",
      readTime: lang === "en" ? "8 min read" : "8 分钟阅读",
      link: `/${lang}/calculator/bazi`
    },
    {
      id: "five-elements-balance",
      category: lang === "en" ? "Wu Xing Harmony" : "五行能量",
      icon: Flame,
      title: lang === "en" ? "Balancing the Five Elements in Daily Life (Remediation Protocols)" : "现代生活中的五行调和：缺木火土金水如何后天补救？",
      excerpt: lang === "en"
        ? "Is your chart missing Fire, Earth, or Water? Practical, actionable adjustments to your living space, color palette, morning rituals, and diet to replenish deficient elemental Qi."
        : "命局中缺少火、土或水该如何应对？系统介绍日常起居、色彩穿搭、居室风水与身心调息全方位五行平衡实操建议。",
      readTime: lang === "en" ? "6 min read" : "6 分钟阅读",
      link: `/${lang}/calculator/bazi`
    },
    {
      id: "jung-and-iching",
      category: lang === "en" ? "Philosophical Synthesis" : "哲学溯源",
      icon: Compass,
      title: lang === "en" ? "Carl Jung & the I Ching: The Science of Meaningful Synchronicity" : "荣格心理学与《周易》：共时性背后的宇宙法则",
      excerpt: lang === "en"
        ? "How a 3,000-year-old Chinese oracle deeply transformed Western psychoanalysis. Discover why casting coins taps into acausal connections in your unconscious mind."
        : "三千年周易如何深刻启发西方心理学巨擘卡尔·荣格？解密无因果联系中的共时性投射，理解为何抛掷硬币能照见内心隐秘答案。",
      readTime: lang === "en" ? "9 min read" : "9 分钟阅读",
      link: `/${lang}/calculator/iching`
    },
    {
      id: "feng-shui-basics",
      category: lang === "en" ? "Spatial Energy" : "居室风水",
      icon: Sparkles,
      title: lang === "en" ? "Feng Shui for Urban Apartments: Desk, Bed & Qi Flow Mastery" : "都市公寓现代风水：办公桌与卧室气流优化指南",
      excerpt: lang === "en"
        ? "You don't need expensive statues to practice good Feng Shui. Master the Command Position for your workspace, clear energetic stagnant corners, and invite abundance."
        : "真正的好风水无需繁复摆件。掌握办公桌“将军位”掌控感、梳理床头气流聚气方位，让居家空间成为每日赋能的身心殿堂。",
      readTime: lang === "en" ? "7 min read" : "7 分钟阅读",
      link: `/${lang}/knowledge`
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="zen-badge">
          <BookOpen className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>{lang === "en" ? "The Metaphysical Library" : "东方玄学知识宝库"}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-100">
          {lang === "en" ? (
            <>
              Ancient Wisdom for <span className="gold-gradient-text">Modern Living</span>
            </>
          ) : (
            <>
              东方古老智慧的 <span className="gold-gradient-text">现代化生活指引</span>
            </>
          )}
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          {lang === "en"
            ? "Thoughtfully curated essays, philosophical treatises, and practical energetic guides bridging ancient Chinese cosmology with modern psychology and daily life."
            : "系统化拆解八字四柱、五行气场、现代风水与周易哲学，褪去迷信浮华，探求人与自然的和谐大道。"}
        </p>
      </div>

      {/* Featured Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((art) => {
          const Icon = art.icon;
          return (
            <div
              key={art.id}
              className="zen-card p-6 sm:p-7 flex flex-col justify-between group hover:border-[#d4af37]/50 transition-all bg-gradient-to-b from-[#111726] to-[#0c101a]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/15 text-[#f5d77f] font-medium border border-[#d4af37]/30 flex items-center gap-1.5">
                    <Icon className="w-3 h-3 text-[#d4af37]" />
                    <span>{art.category}</span>
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">{art.readTime}</span>
                </div>

                <h3 className="text-lg font-serif font-bold text-slate-100 group-hover:text-[#f5d77f] transition-colors leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {art.excerpt}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <Link
                  href={art.link}
                  className="text-xs font-semibold text-[#d4af37] flex items-center gap-1.5 group-hover:underline"
                >
                  <span>{lang === "en" ? "Explore Interactive Tool →" : "体验关联测算工具 →"}</span>
                </Link>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#d4af37] group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
