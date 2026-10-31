"use client";

import { useState } from "react";
import { Sparkles, RotateCcw, ArrowRight } from "lucide-react";
import {
  CoinTossLine,
  IChingReading,
  tossCoins,
  getHexagramByBinary,
  HexagramData
} from "@/lib/metaphysics/iching";
import { Locale } from "@/lib/i18n/dictionaries";

interface Props {
  lang: Locale;
}

export default function CoinTossAnimation({ lang }: Props) {
  const [currentLine, setCurrentLine] = useState<number>(0); // 0 to 6
  const [lines, setLines] = useState<CoinTossLine[]>([]);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [reading, setReading] = useState<IChingReading | null>(null);

  // Coin values for the current throw (visual only)
  const [displayCoins, setDisplayCoins] = useState<[number, number, number]>([3, 3, 2]);

  const handleCastNextLine = () => {
    if (currentLine >= 6 || isFlipping) return;

    setIsFlipping(true);
    const coins = tossCoins();
    setDisplayCoins(coins);

    setTimeout(() => {
      const sum = coins[0] + coins[1] + coins[2];
      const isYang = sum === 7 || sum === 9;
      const isChanging = sum === 6 || sum === 9;
      const changedYang = sum === 6 ? true : sum === 9 ? false : isYang;

      const newLine: CoinTossLine = {
        lineIndex: currentLine + 1,
        coins,
        sum,
        isYang,
        isChanging,
        changedYang
      };

      const updatedLines = [...lines, newLine];
      setLines(updatedLines);
      setCurrentLine(currentLine + 1);
      setIsFlipping(false);

      if (currentLine + 1 === 6) {
        // Hexagram complete!
        let pBinary = "";
        let tBinary = "";
        const changingIndices: number[] = [];

        updatedLines.forEach(l => {
          pBinary += l.isYang ? "1" : "0";
          tBinary += l.changedYang ? "1" : "0";
          if (l.isChanging) changingIndices.push(l.lineIndex);
        });

        const primaryHexagram = getHexagramByBinary(pBinary);
        const transformedHexagram =
          changingIndices.length > 0 ? getHexagramByBinary(tBinary) : null;

        setReading({
          lines: updatedLines,
          primaryHexagram,
          transformedHexagram,
          changingLineIndices: changingIndices
        });
      }
    }, 600);
  };

  const handleAutoCastAll = () => {
    if (isFlipping) return;
    setIsFlipping(true);

    const allLines: CoinTossLine[] = [];
    let pBinary = "";
    let tBinary = "";
    const changingIndices: number[] = [];

    for (let i = 1; i <= 6; i++) {
      const coins = tossCoins();
      const sum = coins[0] + coins[1] + coins[2];
      const isYang = sum === 7 || sum === 9;
      const isChanging = sum === 6 || sum === 9;
      const changedYang = sum === 6 ? true : sum === 9 ? false : isYang;

      allLines.push({
        lineIndex: i,
        coins,
        sum,
        isYang,
        isChanging,
        changedYang
      });

      pBinary += isYang ? "1" : "0";
      tBinary += changedYang ? "1" : "0";
      if (isChanging) changingIndices.push(i);
    }

    setTimeout(() => {
      setDisplayCoins(allLines[5].coins);
      setLines(allLines);
      setCurrentLine(6);
      setIsFlipping(false);

      const primaryHexagram = getHexagramByBinary(pBinary);
      const transformedHexagram =
        changingIndices.length > 0 ? getHexagramByBinary(tBinary) : null;

      setReading({
        lines: allLines,
        primaryHexagram,
        transformedHexagram,
        changingLineIndices: changingIndices
      });
    }, 500);
  };

  const handleReset = () => {
    setCurrentLine(0);
    setLines([]);
    setReading(null);
    setIsFlipping(false);
  };

  return (
    <div className="space-y-8">
      {/* Interactive Toss Area */}
      <div className="zen-card p-6 sm:p-8 flex flex-col items-center text-center">
        <h3 className="text-lg font-semibold text-slate-100 mb-2">
          {lang === "en" ? "Cast the Three Sacred Coins" : "三枚铜钱静心起卦"}
        </h3>
        <p className="text-xs text-slate-400 max-w-md mb-6">
          {lang === "en"
            ? "Formulate a focused question in your mind. Cast the bronze coins 6 times from bottom to top to reveal your hexagram."
            : "心中默念你想解答的困惑或抉择，共抛掷六次（从初爻至上爻），推演天地阴阳化境。"}
        </p>

        {/* 3 Coins visualization */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 my-4">
          {displayCoins.map((val, idx) => {
            const isHeads = val === 3; // 3 = Heads (Yang / Inscription), 2 = Tails (Yin / Blank)
            return (
              <div
                key={idx}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#d4af37] bg-gradient-to-tr ${
                  isHeads ? "from-[#785b12] to-[#d4af37]" : "from-[#523d0a] to-[#997c23]"
                } flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-transform duration-500 relative select-none ${
                  isFlipping ? "animate-spin" : ""
                }`}
              >
                {/* Ancient square hole */}
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#080b11] border border-[#d4af37]/60 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#d4af37]/40" />
                </div>
                {/* Ancient characters around the hole */}
                <span className="absolute top-1 text-[8px] font-serif text-[#fef3c7] font-bold">通</span>
                <span className="absolute bottom-1 text-[8px] font-serif text-[#fef3c7] font-bold">宝</span>
                <span className="absolute left-1.5 text-[8px] font-serif text-[#fef3c7] font-bold">乾</span>
                <span className="absolute right-1.5 text-[8px] font-serif text-[#fef3c7] font-bold">隆</span>
              </div>
            );
          })}
        </div>

        {/* Buttons & status */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center items-center">
          {currentLine < 6 ? (
            <>
              <button
                onClick={handleCastNextLine}
                disabled={isFlipping}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f3d068] text-slate-950 font-semibold text-sm hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(212,175,55,0.35)] disabled:opacity-50 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {lang === "en"
                    ? `Cast Line ${currentLine + 1} of 6`
                    : `抛掷第 ${currentLine + 1} 爻 (共6爻)`}
                </span>
              </button>
              <button
                onClick={handleAutoCastAll}
                disabled={isFlipping}
                className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-200 text-sm hover:bg-slate-700 transition-all"
              >
                {lang === "en" ? "Fast Cast All 6" : "一键成卦"}
              </button>
            </>
          ) : (
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/15 text-[#f5d77f] text-sm hover:bg-[#d4af37]/25 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{lang === "en" ? "Cast New Divination" : "重新起卦"}</span>
            </button>
          )}
        </div>

        {/* Progress gauge */}
        <div className="mt-5 text-xs text-slate-400">
          <span>{lang === "en" ? "Lines cast: " : "已起爻数: "}</span>
          <span className="text-[#d4af37] font-bold font-mono">{currentLine} / 6</span>
        </div>
      </div>

      {/* Hexagram Lines Stack (Lines built from 6 at top to 1 at bottom) */}
      {lines.length > 0 && (
        <div className="zen-card p-6 flex flex-col items-center">
          <span className="text-xs uppercase tracking-wider text-slate-400 mb-4">
            {lang === "en" ? "Sacred Trigram Lines (From Bottom to Top)" : "六爻卦象生成（从初爻至上爻）"}
          </span>

          <div className="flex flex-col-reverse gap-2.5 w-full max-w-sm">
            {lines.map((line) => (
              <div
                key={line.lineIndex}
                className={`p-2.5 rounded-lg border flex items-center justify-between text-xs transition-all ${
                  line.isChanging
                    ? "border-[#d4af37] bg-[#d4af37]/10 text-[#fef3c7]"
                    : "border-slate-800 bg-slate-900/40 text-slate-300"
                }`}
              >
                <span className="font-mono text-slate-400 w-12">
                  {lang === "en" ? `L${line.lineIndex}` : `第${line.lineIndex}爻`}
                </span>

                {/* Line Visual (Solid for Yang, Broken for Yin) */}
                <div className="flex-1 flex justify-center items-center px-4">
                  {line.isYang ? (
                    // Solid Yang line ⚊
                    <div className="w-full h-2 rounded bg-amber-400/90 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                  ) : (
                    // Broken Yin line ⚋
                    <div className="w-full flex gap-2">
                      <div className="w-1/2 h-2 rounded bg-slate-400" />
                      <div className="w-1/2 h-2 rounded bg-slate-400" />
                    </div>
                  )}
                </div>

                <div className="w-20 text-right font-mono">
                  {line.isChanging && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                      {lang === "en" ? "Changing" : "动爻"}
                    </span>
                  )}
                  {!line.isChanging && (
                    <span className="text-slate-400">
                      {line.isYang ? (lang === "en" ? "Yang" : "少阳") : (lang === "en" ? "Yin" : "少阴")}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hexagram Revealed Results */}
      {reading && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Hexagram */}
            <div className="zen-card p-6 border-[#d4af37]/40 bg-gradient-to-b from-[#141b2c] to-[#0c101a]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold">
                  {lang === "en" ? "Primary Hexagram (Current Reality)" : "本卦（当下境况与时局）"}
                </span>
                <span className="text-3xl font-serif text-[#d4af37]">
                  {reading.primaryHexagram.symbol}
                </span>
              </div>

              <h4 className="text-xl font-serif font-bold text-slate-100 mb-1">
                {lang === "en"
                  ? `${reading.primaryHexagram.number}. ${reading.primaryHexagram.nameEn}`
                  : `第${reading.primaryHexagram.number}卦 · ${reading.primaryHexagram.nameZh} (${reading.primaryHexagram.pinyin})`}
              </h4>
              <p className="text-xs text-slate-400 mb-4">
                {lang === "en"
                  ? `Upper: ${reading.primaryHexagram.upperTrigram} | Lower: ${reading.primaryHexagram.lowerTrigram}`
                  : `上卦: ${reading.primaryHexagram.upperTrigram} | 下卦: ${reading.primaryHexagram.lowerTrigram}`}
              </p>

              {/* Judgment */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed mb-4">
                <span className="text-[#f5d77f] font-semibold block mb-1">
                  {lang === "en" ? "The Judgment:" : "卦辞解意:"}
                </span>
                {lang === "en" ? reading.primaryHexagram.judgmentEn : reading.primaryHexagram.judgmentZh}
              </div>

              {/* Practical Guidance */}
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900/50">
                  <span className="text-emerald-400 font-semibold block">
                    {lang === "en" ? "Career & Decision:" : "事业与决策指引:"}
                  </span>
                  <span className="text-slate-300">
                    {lang === "en" ? reading.primaryHexagram.careerAdviceEn : reading.primaryHexagram.careerAdviceZh}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/50">
                  <span className="text-rose-400 font-semibold block">
                    {lang === "en" ? "Relationship & Emotion:" : "情感与人际相处:"}
                  </span>
                  <span className="text-slate-300">
                    {lang === "en" ? reading.primaryHexagram.relationshipAdviceEn : reading.primaryHexagram.relationshipAdviceZh}
                  </span>
                </div>
              </div>
            </div>

            {/* Transformed Hexagram (if changing lines exist) */}
            {reading.transformedHexagram ? (
              <div className="zen-card p-6 border-cyan-500/30 bg-gradient-to-b from-[#0e1d2c] to-[#0c101a]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5" />
                    {lang === "en" ? "Transformed Hexagram (Future Path)" : "变卦（未来演化与趋向）"}
                  </span>
                  <span className="text-3xl font-serif text-cyan-300">
                    {reading.transformedHexagram.symbol}
                  </span>
                </div>

                <h4 className="text-xl font-serif font-bold text-slate-100 mb-1">
                  {lang === "en"
                    ? `${reading.transformedHexagram.number}. ${reading.transformedHexagram.nameEn}`
                    : `第${reading.transformedHexagram.number}卦 · ${reading.transformedHexagram.nameZh}`}
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  {lang === "en"
                    ? `Changed via line(s): ${reading.changingLineIndices.join(", ")}`
                    : `由第 ${reading.changingLineIndices.join("、")} 动爻变动演化`}
                </p>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed mb-4">
                  <span className="text-cyan-300 font-semibold block mb-1">
                    {lang === "en" ? "Evolutionary Trajectory:" : "转机推演:"}
                  </span>
                  {lang === "en"
                    ? reading.transformedHexagram.judgmentEn
                    : reading.transformedHexagram.judgmentZh}
                </div>

                <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-800/40 text-xs text-cyan-200 leading-relaxed">
                  {lang === "en"
                    ? "Changing lines indicate active cosmic friction in transition. Heed the warnings in the primary hexagram to steer toward the prosperous outcome of the transformed hexagram."
                    : "动爻代表事物正在激化与转变的节点。遵循本卦的谨慎克制，即可顺势步入变卦所指向的吉祥机运。"}
                </div>
              </div>
            ) : (
              <div className="zen-card p-6 flex flex-col items-center justify-center text-center">
                <span className="text-3xl mb-2 text-slate-500">☯</span>
                <h4 className="text-base font-semibold text-slate-200 mb-1">
                  {lang === "en" ? "Unchanging Hexagram" : "静卦无动爻"}
                </h4>
                <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                  {lang === "en"
                    ? "No changing lines were cast. The energy of this situation is consolidated and stable. Focus your entire mindfulness on the primary hexagram's guidance."
                    : "本卦六爻皆定，无动爻转变，说明当前态势稳定笃实，应全神贯注遵循本卦箴言指引。"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
