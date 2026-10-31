"use client";

import { useState, use } from "react";
import { Sparkles, Calendar, Clock, Compass, ShieldAlert, ArrowRight } from "lucide-react";
import { calculateBaZi, BaZiCalculationResult } from "@/lib/metaphysics/bazi";
import { getWesternZodiacSign, WesternZodiacSign } from "@/lib/metaphysics/western-astrology";
import FiveElementsChart from "@/components/FiveElementsChart";
import BaZiCard from "@/components/BaZiCard";
import { Locale } from "@/lib/i18n/dictionaries";

export default function BaZiCalculatorPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = use(params);
  const lang: Locale = rawLang === "zh" ? "zh" : "en";

  // Form input state
  const [year, setYear] = useState<number>(1995);
  const [month, setMonth] = useState<number>(8);
  const [day, setDay] = useState<number>(18);
  const [hour, setHour] = useState<number>(14);
  const [gender, setGender] = useState<"female" | "male">("female");

  // Output state (pre-calculated initial state)
  const [baziResult, setBaziResult] = useState<BaZiCalculationResult>(() =>
    calculateBaZi(1995, 8, 18, 14, 0)
  );
  const [westernSign, setWesternSign] = useState<WesternZodiacSign>(() =>
    getWesternZodiacSign(8, 18)
  );

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const bz = calculateBaZi(year, month, day, hour, 0);
    const ws = getWesternZodiacSign(month, day);
    setBaziResult(bz);
    setWesternSign(ws);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="zen-badge">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>{lang === "en" ? "Flagship Dual Blueprint" : "旗舰双盘合一"}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-100">
          {lang === "en" ? (
            <>
              Decode Your <span className="gold-gradient-text">Cosmic Blueprint</span>
            </>
          ) : (
            <>
              测算你的 <span className="gold-gradient-text">本命宇宙蓝图</span>
            </>
          )}
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          {lang === "en"
            ? "Enter your solar birth date to reveal your Western Zodiac archetype united with your Eastern Four Pillars (BaZi), Day Master soul, and Wu Xing energy distribution."
            : "输入公历出生时刻，一键推演西方太阳星座与东方八字四柱、日主元神及五行生克能量分布。"}
        </p>
      </div>

      {/* Input Form */}
      <div className="zen-card p-6 sm:p-8 max-w-3xl mx-auto">
        <form onSubmit={handleCalculate} className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Year */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{lang === "en" ? "Year" : "出生年"}</span>
              </label>
              <input
                type="number"
                min="1900"
                max="2050"
                value={year}
                onChange={e => setYear(parseInt(e.target.value) || 2000)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-100 text-sm focus:border-[#d4af37] focus:outline-none"
                required
              />
            </div>

            {/* Month */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                {lang === "en" ? "Month" : "月"}
              </label>
              <select
                value={month}
                onChange={e => setMonth(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-100 text-sm focus:border-[#d4af37] focus:outline-none"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>
                    {m} {lang === "en" ? "Month" : "月"}
                  </option>
                ))}
              </select>
            </div>

            {/* Day */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                {lang === "en" ? "Day" : "日"}
              </label>
              <select
                value={day}
                onChange={e => setDay(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-100 text-sm focus:border-[#d4af37] focus:outline-none"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                  <option key={d} value={d}>
                    {d} {lang === "en" ? "" : "日"}
                  </option>
                ))}
              </select>
            </div>

            {/* Hour */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{lang === "en" ? "Birth Hour" : "时辰"}</span>
              </label>
              <select
                value={hour}
                onChange={e => setHour(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-100 text-sm focus:border-[#d4af37] focus:outline-none"
              >
                <option value={0}>00:00 - 01:00 (子时)</option>
                <option value={2}>01:00 - 03:00 (丑时)</option>
                <option value={4}>03:00 - 05:00 (寅时)</option>
                <option value={6}>05:00 - 07:00 (卯时)</option>
                <option value={8}>07:00 - 09:00 (辰时)</option>
                <option value={10}>09:00 - 11:00 (巳时)</option>
                <option value={12}>11:00 - 13:00 (午时 - 正午)</option>
                <option value={14}>13:00 - 15:00 (未时)</option>
                <option value={16}>15:00 - 17:00 (申时)</option>
                <option value={18}>17:00 - 19:00 (酉时)</option>
                <option value={20}>19:00 - 21:00 (戌时)</option>
                <option value={22}>21:00 - 23:00 (亥时)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {/* Gender toggle */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{lang === "en" ? "Gender:" : "性别:"}</span>
              <button
                type="button"
                onClick={() => setGender("female")}
                className={`px-3 py-1 rounded-lg border transition-all ${
                  gender === "female"
                    ? "border-[#d4af37] bg-[#d4af37]/20 text-[#f5d77f]"
                    : "border-slate-800 text-slate-400"
                }`}
              >
                {lang === "en" ? "Female" : "女"}
              </button>
              <button
                type="button"
                onClick={() => setGender("male")}
                className={`px-3 py-1 rounded-lg border transition-all ${
                  gender === "male"
                    ? "border-[#d4af37] bg-[#d4af37]/20 text-[#f5d77f]"
                    : "border-slate-800 text-slate-400"
                }`}
              >
                {lang === "en" ? "Male" : "男"}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f3d068] text-slate-950 font-semibold text-sm hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{lang === "en" ? "Update Blueprint" : "生成命盘解析"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* RESULTS SECTION */}
      <div className="space-y-8 animate-fade-in">
        {/* Synthesis Banner: Western meets Eastern */}
        <div className="zen-card p-6 sm:p-8 bg-gradient-to-r from-[#111726] via-[#161c2e] to-[#111726] border-[#d4af37]/40 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold">
                {lang === "en" ? "Dual Cosmic Synthesis" : "东西双重视角融合"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100">
                {lang === "en"
                  ? `${westernSign.nameEn} Sun × ${baziResult.dayMaster.nameEn}`
                  : `${westernSign.nameZh}（${westernSign.elementZh}）× ${baziResult.dayMaster.nameZh}`}
              </h2>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                {lang === "en"
                  ? `Your outer personality shines with ${westernSign.nameEn}'s ${westernSign.element.toLowerCase()} vitality, while your core spiritual essence is anchored by ${baziResult.dayMaster.archetypeEn}.`
                  : `你的外在人格流淌着${westernSign.nameZh}的${westernSign.elementZh}特质，而灵魂深处的能量元神则由“${baziResult.dayMaster.archetypeZh}”镇守。`}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex flex-col items-center justify-center text-center">
                <span className="text-2xl">{westernSign.symbol}</span>
                <span className="text-[10px] text-slate-400 mt-0.5">{westernSign.nameEn}</span>
              </div>
              <span className="text-xl text-[#d4af37] font-light">✕</span>
              <div className="w-16 h-16 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-serif text-[#f5d77f] font-bold">
                  {baziResult.dayMaster.stem}
                </span>
                <span className="text-[10px] text-[#f5d77f] mt-0.5">
                  {lang === "en" ? baziResult.dayMaster.element : `${baziResult.dayMaster.elementZh}主`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Four Pillars BaZi Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif font-semibold text-slate-100">
              {lang === "en" ? "The Four Pillars of Destiny (BaZi)" : "本命生辰八字四柱排盘"}
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {baziResult.lunarString}
            </span>
          </div>
          <BaZiCard pillars={baziResult.pillars} lang={lang} />
        </div>

        {/* Day Master Deep Dive */}
        <div className="zen-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] text-lg font-serif font-bold">
              {baziResult.dayMaster.stem}
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold">
                {lang === "en" ? "Day Master Archetype" : "日元神特质深度剖析"}
              </span>
              <h4 className="text-xl font-serif font-bold text-slate-100">
                {lang === "en" ? baziResult.dayMaster.archetypeEn : baziResult.dayMaster.archetypeZh}
              </h4>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {lang === "en" ? baziResult.dayMaster.essenceEn : baziResult.dayMaster.essenceZh}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                {lang === "en" ? "✦ Inborn Gifts & Strengths" : "✦ 天赋与核心优势"}
              </span>
              <ul className="text-xs text-slate-300 space-y-1">
                {(lang === "en" ? baziResult.dayMaster.strengthsEn : baziResult.dayMaster.strengthsZh).map((s, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-emerald-400" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                {lang === "en" ? "✦ Conscious Growth Areas" : "✦ 修行与注意盲点"}
              </span>
              <ul className="text-xs text-slate-300 space-y-1">
                {(lang === "en" ? baziResult.dayMaster.growthAreasEn : baziResult.dayMaster.growthAreasZh).map((g, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-amber-400" />
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#d4af37]/10 to-transparent border-l-2 border-[#d4af37] text-xs text-[#f5d77f] leading-relaxed">
            <span className="font-semibold block mb-0.5">
              {lang === "en" ? "Cosmic Alignment Advice:" : "大师调和箴言:"}
            </span>
            {lang === "en" ? baziResult.dayMaster.cosmicAdviceEn : baziResult.dayMaster.cosmicAdviceZh}
          </div>
        </div>

        {/* Five Elements Wu Xing Balance */}
        <div className="zen-card p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-serif font-semibold text-slate-100">
              {lang === "en" ? "Five Elements (Wu Xing) Energy Distribution" : "五行能量平衡与雷达图谱"}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === "en"
                ? "Ancient Chinese metaphysics sees life as an interplay of Wood, Fire, Earth, Metal, and Water. Here is your chart's baseline percentage."
                : "东方命理以木、火、土、金、水为宇宙原动力，以下是您命局四柱的五行能量占比。"}
            </p>
          </div>

          <FiveElementsChart elements={baziResult.fiveElements} lang={lang} />

          {/* Remediation Advice */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs">
            <span className="font-semibold text-[#d4af37] flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              {lang === "en" ? "Balancing & Remediation Protocol:" : "后天五行平衡调理指引:"}
            </span>
            <p className="text-slate-300 leading-relaxed">
              {lang === "en"
                ? baziResult.elementRecommendationsEn
                : baziResult.elementRecommendationsZh}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
