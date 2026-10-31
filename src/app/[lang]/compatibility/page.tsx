"use client";

import { useState, use } from "react";
import Link from "next/link";
import { HeartHandshake, Sparkles, Flame, ShieldAlert, ArrowRight } from "lucide-react";
import { ZODIAC_SIGNS, getZodiacCompatibility } from "@/lib/metaphysics/compatibility";
import { Locale } from "@/lib/i18n/dictionaries";

export default function CompatibilityPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = use(params);
  const lang: Locale = rawLang === "zh" ? "zh" : "en";

  const [signAId, setSignAId] = useState<string>("dragon");
  const [signBId, setSignBId] = useState<string>("rooster");

  const result = getZodiacCompatibility(signAId, signBId);

  // Popular programmatic SEO pairings to showcase
  const popularSlugs = [
    { slug: "dragon-and-rooster", labelEn: "Dragon × Rooster (Six Harmonies)", labelZh: "辰龙 × 酉鸡 (六合神仙眷侣)" },
    { slug: "rat-and-ox", labelEn: "Rat × Ox (Six Harmonies)", labelZh: "子鼠 × 丑牛 (六合天作之合)" },
    { slug: "tiger-and-pig", labelEn: "Tiger × Pig (Six Harmonies)", labelZh: "寅虎 × 亥猪 (六合福禄双全)" },
    { slug: "rabbit-and-dog", labelEn: "Rabbit × Dog (Six Harmonies)", labelZh: "卯兔 × 戌狗 (六合相依相成)" },
    { slug: "monkey-and-dragon", labelEn: "Monkey × Dragon (Triad Synergy)", labelZh: "申猴 × 辰龙 (三合大吉生财)" },
    { slug: "horse-and-tiger", labelEn: "Horse × Tiger (Triad Fire)", labelZh: "午马 × 寅虎 (三合热情洋溢)" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="zen-badge">
          <HeartHandshake className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>{lang === "en" ? "144 Zodiac Compatibility Matrix" : "144 生肖五行合盘矩阵"}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-100">
          {lang === "en" ? (
            <>
              Chinese Zodiac <span className="gold-gradient-text">Love & Synergy Match</span>
            </>
          ) : (
            <>
              十二生肖 <span className="gold-gradient-text">情侣与事业契合度合盘</span>
            </>
          )}
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          {lang === "en"
            ? "Discover how the elemental forces of any two Chinese Zodiac signs interact through ancient principles of Six Harmonies, Three Triads, and Six Clashes."
            : "依循东方古法合婚天机，测算两人生肖五行能量生克、六合三合吉凶及相处调和之道。"}
        </p>
      </div>

      {/* Interactive Picker */}
      <div className="zen-card p-6 sm:p-8 max-w-3xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* Sign A Picker */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              {lang === "en" ? "First Person's Zodiac Sign:" : "第一方生肖属相:"}
            </label>
            <select
              value={signAId}
              onChange={e => setSignAId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:border-[#d4af37] focus:outline-none"
            >
              {ZODIAC_SIGNS.map(sign => (
                <option key={sign.id} value={sign.id}>
                  {sign.emoji} {lang === "en" ? sign.nameEn : sign.nameZh} ({lang === "en" ? sign.element : `${sign.elementZh}行`})
                </option>
              ))}
            </select>
          </div>

          {/* Sign B Picker */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              {lang === "en" ? "Second Person's Zodiac Sign:" : "第二方生肖属相:"}
            </label>
            <select
              value={signBId}
              onChange={e => setSignBId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:border-[#d4af37] focus:outline-none"
            >
              {ZODIAC_SIGNS.map(sign => (
                <option key={sign.id} value={sign.id}>
                  {sign.emoji} {lang === "en" ? sign.nameEn : sign.nameZh} ({lang === "en" ? sign.element : `${sign.elementZh}行`})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* RESULTS DISPLAY */}
      <div className="zen-card p-6 sm:p-10 border-[#d4af37]/40 bg-gradient-to-b from-[#12192a] to-[#0c101a] space-y-8 animate-fade-in">
        {/* Top Score Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-3xl">
              {result.signA.emoji}
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#d4af37] font-semibold uppercase tracking-wider">
                {lang === "en" ? result.verdictEn : result.verdictZh}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100">
                {lang === "en"
                  ? `${result.signA.nameEn} + ${result.signB.nameEn}`
                  : `${result.signA.nameZh} 与 ${result.signB.nameZh} 综合合盘`}
              </h2>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-3xl">
              {result.signB.emoji}
            </div>
          </div>

          {/* Overall Score Circle */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-4 border-[#d4af37] bg-slate-950 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              <span className="text-2xl font-bold font-mono text-[#f5d77f]">{result.overallScore}</span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400">Score</span>
            </div>
          </div>
        </div>

        {/* 3 Metric Scores */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                <Flame className="w-4 h-4" />
                {lang === "en" ? "Romance & Passion" : "婚恋契合度"}
              </span>
              <span className="font-mono text-slate-200 font-bold">{result.romanceScore}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: `${result.romanceScore}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4" />
                {lang === "en" ? "Friendship & Trust" : "友情信任度"}
              </span>
              <span className="font-mono text-slate-200 font-bold">{result.friendshipScore}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${result.friendshipScore}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                {lang === "en" ? "Work & Partnership" : "事业合作指数"}
              </span>
              <span className="font-mono text-slate-200 font-bold">{result.workScore}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${result.workScore}%` }} />
            </div>
          </div>
        </div>

        {/* Dynamic & Strengths */}
        <div className="space-y-4">
          <p className="text-sm text-slate-200 leading-relaxed">
            {lang === "en" ? result.dynamicEn : result.dynamicZh}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-emerald-950/60 space-y-1.5">
              <span className="text-xs font-semibold text-emerald-400 block">
                {lang === "en" ? "✦ Core Harmonious Energies:" : "✦ 核心相处优势:"}
              </span>
              <ul className="text-xs text-slate-300 space-y-1">
                {(lang === "en" ? result.strengthsEn : result.strengthsZh).map((s, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-emerald-400" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-amber-950/60 space-y-1.5">
              <span className="text-xs font-semibold text-amber-400 block">
                {lang === "en" ? "✦ Potential Growth Friction:" : "✦ 需化解与磨合之处:"}
              </span>
              <ul className="text-xs text-slate-300 space-y-1">
                {(lang === "en" ? result.challengesEn : result.challengesZh).map((c, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-amber-400" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#d4af37]/10 border-l-2 border-[#d4af37] text-xs text-[#f5d77f] leading-relaxed">
            <span className="font-semibold block mb-0.5">
              {lang === "en" ? "Master Harmonization Secret:" : "合婚化解通达锦囊:"}
            </span>
            {lang === "en" ? result.harmonizationTipsEn : result.harmonizationTipsZh}
          </div>
        </div>
      </div>

      {/* Programmatic SEO Link Matrix */}
      <div className="space-y-4 pt-6">
        <h3 className="text-lg font-serif font-semibold text-slate-100">
          {lang === "en" ? "Popular Cosmic Pairings (Programmatic Guides)" : "热门生肖配对深度专栏"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {popularSlugs.map(item => (
            <Link
              key={item.slug}
              href={`/${lang}/compatibility/${item.slug}`}
              className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-[#d4af37]/40 hover:bg-slate-800/80 transition-all text-xs text-slate-300 flex items-center justify-between group"
            >
              <span>{lang === "en" ? item.labelEn : item.labelZh}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#d4af37] group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
