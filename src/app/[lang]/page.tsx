import { use } from "react";
import Link from "next/link";
import { Sparkles, Compass, HeartHandshake, ArrowRight, ShieldCheck, Sun, Moon, Flame, Wind } from "lucide-react";
import { getDictionary, Locale } from "@/lib/i18n/dictionaries";

export default function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = use(params);
  const lang: Locale = rawLang === "zh" ? "zh" : "en";
  const dict = getDictionary(lang);

  return (
    <div className="space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative pt-16 sm:pt-24 pb-12 overflow-hidden text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="zen-badge animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>{dict.hero.badge}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-slate-100 leading-tight">
          {dict.hero.titleStart} <span className="gold-gradient-text">{dict.hero.titleHighlight}</span> {dict.hero.titleEnd}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {dict.hero.subtitle}
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href={`/${lang}/calculator/bazi`}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f3d068] text-slate-950 font-semibold text-sm hover:brightness-110 active:scale-95 transition-all shadow-[0_0_25px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{dict.hero.ctaPrimary}</span>
          </Link>
          <Link
            href={`/${lang}/calculator/iching`}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-sm font-medium transition-all flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-[#d4af37]" />
            <span>{dict.hero.ctaSecondary}</span>
          </Link>
        </div>

        {/* Stats / Trust Badges */}
        <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-800/80 max-w-3xl mx-auto text-xs text-slate-400">
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
            <span>{dict.hero.statUsers}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{dict.hero.statAccuracy}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>{dict.hero.statWisdom}</span>
          </div>
        </div>
      </section>

      {/* THE BRIDGE: EAST MEETS WEST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <div className="zen-badge">
            <Compass className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{dict.bridge.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-100">
            {dict.bridge.title}
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            {dict.bridge.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Western Card */}
          <div className="zen-card p-6 sm:p-8 space-y-3 bg-gradient-to-b from-[#111726] to-[#0c101a] border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Sun className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-slate-100">
              {dict.bridge.westCardTitle}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {dict.bridge.westCardDesc}
            </p>
          </div>

          {/* Synthesis Bridge Card */}
          <div className="zen-card p-6 sm:p-8 space-y-3 border-[#d4af37]/40 bg-gradient-to-b from-[#161f33] to-[#0c101a] shadow-[0_0_30px_rgba(212,175,55,0.12)]">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <span className="text-lg">☯</span>
            </div>
            <h3 className="text-lg font-serif font-bold text-[#f5d77f]">
              {dict.bridge.synthesisTitle}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {dict.bridge.synthesisDesc}
            </p>
          </div>

          {/* Eastern BaZi Card */}
          <div className="zen-card p-6 sm:p-8 space-y-3 bg-gradient-to-b from-[#111726] to-[#0c101a] border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Moon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-slate-100">
              {dict.bridge.eastCardTitle}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {dict.bridge.eastCardDesc}
            </p>
          </div>
        </div>
      </section>

      {/* CORE INTERACTIVE TOOLS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <div className="zen-badge">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{dict.tools.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-100">
            {dict.tools.title}
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            {dict.tools.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tool 1: Dual Blueprint */}
          <div className="zen-card p-6 sm:p-8 flex flex-col justify-between group hover:border-[#d4af37]/60 transition-all bg-gradient-to-b from-[#141b2a] to-[#0c101a]">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] text-xl font-bold">
                ☯
              </div>
              <h3 className="text-xl font-serif font-bold text-slate-100 group-hover:text-[#f5d77f] transition-colors">
                {dict.tools.baziTitle}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {dict.tools.baziDesc}
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-800">
              <Link
                href={`/${lang}/calculator/bazi`}
                className="w-full py-2.5 rounded-xl bg-[#d4af37]/15 hover:bg-[#d4af37]/25 text-[#f5d77f] border border-[#d4af37]/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <span>{dict.tools.baziBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Tool 2: 144 Zodiac Compatibility */}
          <div className="zen-card p-6 sm:p-8 flex flex-col justify-between group hover:border-[#d4af37]/60 transition-all bg-gradient-to-b from-[#141b2a] to-[#0c101a]">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 text-xl font-bold">
                ♥
              </div>
              <h3 className="text-xl font-serif font-bold text-slate-100 group-hover:text-[#f5d77f] transition-colors">
                {dict.tools.compatTitle}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {dict.tools.compatDesc}
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-800">
              <Link
                href={`/${lang}/compatibility`}
                className="w-full py-2.5 rounded-xl bg-[#d4af37]/15 hover:bg-[#d4af37]/25 text-[#f5d77f] border border-[#d4af37]/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <span>{dict.tools.compatBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Tool 3: I Ching 3-Coin Oracle */}
          <div className="zen-card p-6 sm:p-8 flex flex-col justify-between group hover:border-[#d4af37]/60 transition-all bg-gradient-to-b from-[#141b2a] to-[#0c101a]">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-xl font-bold">
                ䷀
              </div>
              <h3 className="text-xl font-serif font-bold text-slate-100 group-hover:text-[#f5d77f] transition-colors">
                {dict.tools.ichingTitle}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {dict.tools.ichingDesc}
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-800">
              <Link
                href={`/${lang}/calculator/iching`}
                className="w-full py-2.5 rounded-xl bg-[#d4af37]/15 hover:bg-[#d4af37]/25 text-[#f5d77f] border border-[#d4af37]/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <span>{dict.tools.ichingBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* METAPHYSICAL LIBRARY / KNOWLEDGE HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-[#d4af37] font-semibold uppercase tracking-wider block">
              {dict.knowledge.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100">
              {dict.knowledge.title}
            </h2>
          </div>
          <Link
            href={`/${lang}/knowledge`}
            className="text-xs font-semibold text-[#d4af37] flex items-center gap-1.5 hover:underline"
          >
            <span>{dict.knowledge.readMore}</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dict.knowledge.articles.map((art, idx) => (
            <div
              key={idx}
              className="zen-card p-6 space-y-3 bg-gradient-to-b from-[#111726] to-[#0c101a] hover:border-[#d4af37]/40 transition-all"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#f5d77f] font-medium">{art.category}</span>
                <span className="text-slate-500 font-mono">{art.readTime}</span>
              </div>
              <h3 className="text-base font-serif font-bold text-slate-100 leading-snug">
                {art.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {art.excerpt}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
