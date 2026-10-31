import { use } from "react";
import { Compass, Sparkles, BookOpen } from "lucide-react";
import CoinTossAnimation from "@/components/CoinTossAnimation";
import { Locale } from "@/lib/i18n/dictionaries";

export default function IChingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = use(params);
  const lang: Locale = rawLang === "zh" ? "zh" : "en";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="zen-badge">
          <Compass className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>{lang === "en" ? "Oracle of Changes" : "周易正统起卦"}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-100">
          {lang === "en" ? (
            <>
              I Ching <span className="gold-gradient-text">3-Coin Oracle</span>
            </>
          ) : (
            <>
              易经 <span className="gold-gradient-text">三铜钱即时决策神谕</span>
            </>
          )}
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          {lang === "en"
            ? "Toss ancient bronze coins to tap into the cosmic field of synchronicity. Unfold the 64 sacred hexagrams to illuminate crossroads in career, love, and destiny."
            : "静心凝神，模拟古铜钱抛掷起卦。推演六十四卦阴阳之道与动爻变卦，为重大决策与人生十字路口提供深邃哲学指引。"}
        </p>
      </div>

      {/* Interactive Coin Divination */}
      <CoinTossAnimation lang={lang} />

      {/* Philosophical Insight Section (E-E-A-T & Context) */}
      <div className="zen-card p-6 sm:p-8 space-y-4 border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#d4af37] uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>{lang === "en" ? "The Wisdom Behind the Oracle" : "易经起卦与心理学共时性"}</span>
        </div>
        <h3 className="text-lg font-serif font-semibold text-slate-100">
          {lang === "en"
            ? "Carl Jung & The Principle of Synchronicity"
            : "卡尔·荣格与周易：超越因果的宇宙共鸣"}
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          {lang === "en"
            ? "The I Ching (Book of Changes) is humanity's oldest surviving wisdom text, revered for over 3,000 years. Renowned Swiss psychoanalyst Carl Jung was deeply fascinated by it, coining the term 'Synchronicity' (meaningful coincidence) to explain how the exact moment you cast the coins resonates with your subconscious mind and outer circumstances."
            : "《周易》流传三千余年，被誉为大道之源。瑞士著名心理学大师卡尔·荣格耗费数十年深入研读周易，并据此创立了著名的“共时性理论”（Synchronicity）。起卦并非迷信预测，而是借助无因果联系的客观抛掷，照亮潜意识深处未能觉察的微光。"}
        </p>
      </div>
    </div>
  );
}
