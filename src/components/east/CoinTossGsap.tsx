'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  CoinTossLine,
  IChingReading,
  tossCoins,
  buildReadingFromLines
} from '@/lib/metaphysics/iching';
import {
  getCurrentLiuYaoTimeInfo,
  formatLineName,
  type LiuYaoTimeInfo
} from '@/lib/metaphysics/najia';
import { Sparkles, RotateCcw, CheckCircle2, Clock } from 'lucide-react';
import { usePointsGate } from '@/components/site/PointsGateProvider';
import { LiuYaoFollowUpWidget } from './LiuYaoFollowUpWidget';

gsap.registerPlugin(useGSAP);

interface CoinTossGsapProps {
  onReadingReady?: (reading: IChingReading) => void;
  lang?: string;
}

export function CoinTossGsap({ onReadingReady, lang = 'zh' }: CoinTossGsapProps) {
  const isEn = lang === 'en';
  const containerRef = useRef<HTMLDivElement>(null);
  const coin1Ref = useRef<HTMLDivElement>(null);
  const coin2Ref = useRef<HTMLDivElement>(null);
  const coin3Ref = useRef<HTMLDivElement>(null);
  const linesBoardRef = useRef<HTMLDivElement>(null);

  const [question, setQuestion] = useState(
    isEn
      ? 'What is the outlook and turning point for my strategic career initiative?'
      : '我近期的事业合作与重大决策，走向与转机如何？'
  );
  const [currentLine, setCurrentLine] = useState<number>(0); // 0 to 6
  const [lines, setLines] = useState<CoinTossLine[]>([]);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [displayCoins, setDisplayCoins] = useState<[number, number, number]>([3, 3, 2]);
  const [reading, setReading] = useState<IChingReading | null>(null);
  const [timeInfo, setTimeInfo] = useState<LiuYaoTimeInfo | null>(() => getCurrentLiuYaoTimeInfo());
  const [aiReport, setAiReport] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const pointsGate = usePointsGate();

  // 验收 / 复现入口：支持 ?lines=101011（0/1 阴阳）或 ?lines=978678（6=老阴, 7=少阳, 8=少阴, 9=老阳）
  useEffect(() => {
    const rawParam = new URLSearchParams(window.location.search).get('lines');
    if (!rawParam) return;
    const clean = rawParam.replace(/[^016789]/g, '');
    if (clean.length !== 6) return;

    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (cancelled) return;
      const curTime = getCurrentLiuYaoTimeInfo();
      setTimeInfo(curTime);

      const presetLines: CoinTossLine[] = clean.split('').map((ch, i) => {
        let sum = 7;
        let isYang = true;
        let isChanging = false;
        let changedYang = true;
        let coins: [number, number, number] = [3, 2, 2];

        if (ch === '6') {
          sum = 6;
          isYang = false;
          isChanging = true;
          changedYang = true;
          coins = [2, 2, 2];
        } else if (ch === '9') {
          sum = 9;
          isYang = true;
          isChanging = true;
          changedYang = false;
          coins = [3, 3, 3];
        } else if (ch === '8' || ch === '0') {
          sum = 8;
          isYang = false;
          isChanging = false;
          changedYang = false;
          coins = [3, 3, 2];
        } else {
          // '7' or '1'
          sum = 7;
          isYang = true;
          isChanging = false;
          changedYang = true;
          coins = [3, 2, 2];
        }

        return {
          lineIndex: i + 1,
          coins,
          sum,
          isYang,
          isChanging,
          changedYang
        };
      });

      const presetReading = buildReadingFromLines(presetLines, curTime);
      setLines(presetLines);
      setDisplayCoins(presetLines[0].coins);
      setCurrentLine(6);
      setReading(presetReading);
      onReadingReady?.(presetReading);
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [onReadingReady]);

  // GSAP 掷币抛掷物理时间轴
  const handleCastNextLine = useCallback(() => {
    if (currentLine >= 6 || isFlipping) return;

    setIsFlipping(true);
    const coins = tossCoins();
    setDisplayCoins(coins);

    const coinEls = [coin1Ref.current, coin2Ref.current, coin3Ref.current].filter(Boolean);

    // GSAP 抛掷抛物线与 3D 翻滚
    const tl = gsap.timeline({
      onComplete: () => {
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

        // 如果已满 6 爻，按六爻阴阳标准查表定卦并完成京房纳甲排盘
        if (currentLine + 1 === 6) {
          const curTime = timeInfo || getCurrentLiuYaoTimeInfo();
          const completeReading: IChingReading = buildReadingFromLines(updatedLines, curTime);
          setReading(completeReading);
          if (onReadingReady) onReadingReady(completeReading);
        }
      }
    });

    coinEls.forEach((el, i) => {
      const isHeads = coins[i] === 3;
      const targetRotateX = isHeads ? 720 : 900;
      const targetRotateY = (i === 1 ? -1 : 1) * 540;

      tl.to(
        el,
        {
          y: -110 - Math.random() * 30,
          rotationX: `+=${targetRotateX}`,
          rotationY: `+=${targetRotateY}`,
          duration: 0.6 + i * 0.08,
          ease: 'power2.out'
        },
        0
      ).to(
        el,
        {
          y: 0,
          rotationX: `+=${isHeads ? 360 : 180}`,
          rotationY: `+=${(i === 1 ? -1 : 1) * 180}`,
          duration: 0.5 + i * 0.06,
          ease: 'bounce.out'
        },
        '>-0.1'
      );
    });
  }, [currentLine, isFlipping, lines, onReadingReady, timeInfo]);

  // 重置起卦流程
  const handleReset = () => {
    setCurrentLine(0);
    setLines([]);
    setReading(null);
    setAiReport('');
    setDisplayCoins([3, 3, 2]);
    setTimeInfo(getCurrentLiuYaoTimeInfo());
  };

  // 生成 AI 六爻断卦报告
  const handleGenerateAiReport = async () => {
    if (!reading) return;

    let pointsRef: string | undefined;
    if (pointsGate) {
      const consumed = await pointsGate.consume('liuyao');
      if (!consumed.ok) return;
      pointsRef = consumed.ref_id;
    }

    setIsGeneratingAi(true);
    setAiReport('');

    try {
      const response = await fetch('/api/east/liuyao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          reading,
          lang,
          points_ref: pointsRef
        })
      });

      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split('\n\n');
          buffer = events.pop() || '';

          for (const ev of events) {
            const line = ev.trim();
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  setAiReport(prev => prev + parsed.text);
                }
              } catch {
                // Ignore parse errors for keep-alive comments
              }
            }
          }
        }
      } else {
        throw new Error('API unavailable');
      }
    } catch {
      // 本地离线备用
      const fullText = isEn
        ? `Regarding your inquiry: “${question}”, the six coins have cast their classical oracle.\n\n`
        : `针对你所叩问之事：“${question}”，铜钱六掷，京房纳甲神谕已成。\n\n`;

      let i = 0;
      const timer = setInterval(() => {
        i += 8;
        setAiReport(fullText.slice(0, i));
        if (i >= fullText.length) {
          clearInterval(timer);
        }
      }, 20);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // 当前摇卦组合说明
  const getCurrentCoinsFormula = () => {
    const sum = displayCoins[0] + displayCoins[1] + displayCoins[2];
    if (sum === 7) return isEn ? 'Two Words, One Back (2+2+3=7) · Young Yang ⚊ [Static]' : '两字一背 (2+2+3=7) · 少阳 ⚊ (静爻)';
    if (sum === 8) return isEn ? 'One Word, Two Backs (2+3+3=8) · Young Yin ⚋ [Static]' : '一字两背 (2+3+3=8) · 少阴 ⚋ (静爻)';
    if (sum === 9) return isEn ? 'Three Backs (3+3+3=9) · Old Yang ⚊ ○ [Moving Pivot]' : '三背全阳 (3+3+3=9) · 老阳 ⚊ ○ (动爻发动)';
    if (sum === 6) return isEn ? 'Three Words (2+2+2=6) · Old Yin ⚋ × [Moving Pivot]' : '三字全阴 (2+2+2=6) · 老阴 ⚋ × (动爻发动)';
    return '';
  };

  return (
    <div ref={containerRef} className="w-full max-w-5xl mx-auto flex flex-col items-center">
      {/* 提问框 */}
      <div className="w-full max-w-2xl mb-8 p-4 sm:p-5 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs">
        <label className="block text-xs font-serif font-semibold text-[#52525B] mb-2">
          {isEn ? 'Inquiry Focus' : '所求之事'}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            disabled={currentLine > 0}
            className="flex-1 bg-[#F5F5F6] border border-[#E4E4E7] text-[#171717] text-xs sm:text-sm rounded-xl px-4 py-2.5 focus:outline-hidden focus:border-[#171717] transition-all disabled:opacity-75"
            placeholder={isEn ? 'Enter your inquiry...' : '输入你心中所问之事...'}
          />
        </div>
      </div>

      {/* 起卦主交互区 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start w-full">
        {/* 左侧：3D 铜钱摇卦台 */}
        <div className="md:col-span-5 flex flex-col items-center p-6 sm:p-8 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs">
          <div className="w-full flex items-center justify-between mb-4 border-b border-[#E4E4E7] pb-3">
            <span className="font-serif font-semibold text-xs tracking-wider text-[#171717]">
              {isEn ? 'Three Coins Ritual' : '乾隆通宝 · 火珠林掷钱法'}
            </span>
            <span className="text-[11px] font-mono text-[#52525B] bg-[#F5F5F6] px-2.5 py-0.5 rounded-full border border-[#E4E4E7]">
              {currentLine}/6 {isEn ? 'Casts' : '爻已掷'}
            </span>
          </div>

          {/* 铜钱展示区 (3D 抛掷台) */}
          <div className="relative w-full h-44 sm:h-48 flex items-center justify-center gap-3 sm:gap-5 my-2 perspective-1000">
            {/* 铜钱阴影台面 */}
            <div className="absolute bottom-3 inset-x-6 h-6 rounded-full bg-black/5 blur-md pointer-events-none" />

            {/* 三枚乾隆通宝铜钱（字面为阴/2，背面为阳/3） */}
            {[
              { ref: coin1Ref, val: displayCoins[0] },
              { ref: coin2Ref, val: displayCoins[1] },
              { ref: coin3Ref, val: displayCoins[2] }
            ].map((coin, idx) => {
              const isYinWordFace = coin.val === 2;
              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div
                    ref={coin.ref}
                    className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-full border-2 border-[#B8860B] bg-gradient-to-tr from-[#996515] via-[#DAA520] to-[#FFD700] p-1.5 shadow-md flex items-center justify-center text-center select-none transform-style-3d cursor-pointer hover:scale-105 transition-transform"
                    onClick={currentLine < 6 ? handleCastNextLine : undefined}
                  >
                    {/* 外圆内方铜钱纹样 */}
                    <div className="w-full h-full rounded-full border border-[#8B6508]/60 flex items-center justify-center relative bg-[#C59B27]/90 shadow-inner">
                      {/* 方孔 */}
                      <div className="w-6 h-6 sm:w-6.5 sm:h-6.5 bg-white border border-[#8B6508] shadow-inner" />

                      {isYinWordFace ? (
                        /* 字面（乾隆通宝）· 阴面 · 记数 2 */
                        <>
                          <span className="absolute top-1 text-[9px] sm:text-[10px] font-serif font-black text-[#4A3B18]">乾</span>
                          <span className="absolute bottom-1 text-[9px] sm:text-[10px] font-serif font-black text-[#4A3B18]">隆</span>
                          <span className="absolute left-1 text-[9px] sm:text-[10px] font-serif font-black text-[#4A3B18]">通</span>
                          <span className="absolute right-1 text-[9px] sm:text-[10px] font-serif font-black text-[#4A3B18]">宝</span>
                        </>
                      ) : (
                        /* 背面（满文宝泉局）· 阳面 · 记数 3 */
                        <>
                          <span className="absolute left-1 text-[10px] sm:text-[11px] font-serif font-bold text-[#4A3B18] transform -rotate-90">ᠪᠣᠣ</span>
                          <span className="absolute right-1 text-[10px] sm:text-[11px] font-serif font-bold text-[#4A3B18] transform -rotate-90">ᠴᡳᠣᠠᠨ</span>
                          <div className="absolute inset-1 rounded-full border border-dashed border-[#8B6508]/40 pointer-events-none" />
                        </>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#52525B] bg-[#FAFAFA] border border-[#E4E4E7] px-2 py-0.5 rounded-full">
                    {isYinWordFace ? (isEn ? 'Word · Yin (2)' : '字 · 阴 [2]') : (isEn ? 'Back · Yang (3)' : '背 · 阳 [3]')}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 实时摇出配数公式 */}
          <div className="h-6 flex items-center justify-center mt-2">
            <span className="text-xs font-mono text-[#52525B]">
              {getCurrentCoinsFormula()}
            </span>
          </div>

          {/* 掷币按钮与状态 */}
          <div className="w-full mt-4 flex flex-col items-center gap-3">
            {currentLine < 6 ? (
              <button
                onClick={handleCastNextLine}
                disabled={isFlipping}
                className="w-full sm:w-auto px-7 py-2.5 rounded-full bg-[#171717] hover:bg-[#333333] text-white font-serif text-xs tracking-wider transition-all cursor-pointer shadow-sm"
              >
                <span>
                  {isFlipping
                    ? (isEn ? 'Casting Coins...' : '流转抛掷中...')
                    : (isEn ? `Cast Line ${currentLine + 1}` : `掷第 ${currentLine + 1} 爻`)}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-xs font-serif text-[#171717] flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#171717]" /> {isEn ? 'Hexagram Cast Completed' : '六爻已排定'}
                </span>
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-lg text-xs font-serif bg-[#F5F5F6] hover:bg-[#E4E4E7] text-[#171717] transition-colors border border-[#E4E4E7] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> {isEn ? 'Reset' : '重起'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 右侧：正统京房纳甲六爻排盘面板 */}
        <div
          ref={linesBoardRef}
          className="md:col-span-7 flex flex-col p-4 sm:p-6 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-4"
        >
          {/* 起卦时空提纲（年月日时干支、月建、日辰、旬空） */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] text-xs space-y-1.5">
            <div className="flex items-center justify-between text-[#71717A] text-[11px] font-mono">
              <span className="flex items-center gap-1">
                <Clock size={12} />
                <span>{timeInfo?.solarDate || '加载时空盘...'}</span>
              </span>
              <span>{timeInfo?.lunarDate}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#E4E4E7] text-[#171717] font-mono">
              <span className="bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#E4E4E7]">
                四柱：{timeInfo?.yearGanzhi}年 {timeInfo?.monthGanzhi}月 {timeInfo?.dayGanzhi}日 {timeInfo?.timeGanzhi}时
              </span>
              <span className="bg-[#171717] text-white px-2 py-0.5 rounded">
                月建：{timeInfo?.monthZhi}水
              </span>
              <span className="bg-[#171717] text-white px-2 py-0.5 rounded">
                日辰：{timeInfo?.dayZhi}火
              </span>
              <span className="bg-[#F4F4F5] px-2 py-0.5 rounded text-[#52525B]">
                空亡：{timeInfo?.xunKong}空
              </span>
            </div>
          </div>

          {/* 卦宫与本变卦名 Header */}
          {reading ? (
            <div className="space-y-3 pb-3 border-b border-[#E4E4E7]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-serif font-black text-[#171717]">
                      {reading.primaryHexagram.symbol} {isEn ? reading.primaryHexagram.nameEn : reading.primaryHexagram.nameZh}
                    </span>
                    <span className="text-xs text-[#52525B] font-mono">
                      ({reading.najia?.palace}宫{reading.najia?.palaceElement})
                    </span>
                  </div>

                  <span className="text-xs text-[#71717A] font-serif">
                    {reading.transformedHexagram ? (
                      isEn ? 'transforms into' : '之 ➔'
                    ) : (
                      isEn ? '(Static Hexagram)' : '（六爻安静）'
                    )}
                  </span>

                  {reading.transformedHexagram && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl font-serif font-black text-[#171717]">
                        {reading.transformedHexagram.symbol} {isEn ? reading.transformedHexagram.nameEn : reading.transformedHexagram.nameZh}
                      </span>
                      {reading.najia?.transformedChart && (
                        <span className="text-xs text-[#52525B] font-mono">
                          ({reading.najia.transformedChart.palace}宫{reading.najia.transformedChart.palaceElement})
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <span className="text-[11px] font-mono text-[#71717A] bg-[#FAFAFA] border border-[#E4E4E7] px-2 py-0.5 rounded">
                  文王序第 {reading.primaryHexagram.number} 卦
                </span>
              </div>

              {reading.najia && (
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#52525B] font-mono">
                  <span>本卦：{reading.najia.palace}宫【{reading.najia.palaceElement}】· {reading.najia.generationName}</span>
                  <span>•</span>
                  <span>世在第 {reading.najia.shiIndex} 爻 · 应在第 {reading.najia.yingIndex} 爻</span>
                  {reading.transformedHexagram && (
                    <>
                      <span>•</span>
                      <span className="text-red-700 font-medium">
                        变卦：{reading.najia.transformedChart?.palace}宫【{reading.najia.transformedChart?.palaceElement}】· {reading.najia.transformedChart?.generationName}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between pb-2 border-b border-[#E4E4E7]">
              <h4 className="font-serif font-bold text-xs text-[#171717]">
                {isEn ? 'Orthodox Najia Lines' : '正统纳甲六爻对照盘'}
              </h4>
              <span className="text-[11px] font-mono text-[#71717A]">
                {isEn ? 'Cast bottom to top' : '自初爻至上爻逐掷'}
              </span>
            </div>
          )}

          {/* 表头：本卦 vs 动变 vs 变卦 */}
          {reading && (
            <div className="grid grid-cols-12 gap-1 text-[11px] font-mono text-[#71717A] px-2 pb-1 border-b border-[#F4F4F5]">
              <div className="col-span-1">六神</div>
              <div className="col-span-5 flex items-center justify-between pr-2">
                <span className="font-medium text-[#171717]">
                  【本卦】{reading.primaryHexagram.nameZh}
                </span>
                <span>爻象</span>
              </div>
              <div className="col-span-1 text-center font-medium">动变</div>
              <div className="col-span-5 flex items-center justify-between pl-2">
                <span>爻象</span>
                <span className="font-medium text-[#171717]">
                  {reading.transformedHexagram
                    ? `【变卦】${reading.transformedHexagram.nameZh}`
                    : '【无变卦 · 纯静】'}
                </span>
              </div>
            </div>
          )}

          {/* 6 爻正统对照排盘区（倒序排列：第6爻在最上，第1爻在最下） */}
          <div className="flex flex-col-reverse gap-2 my-1 overflow-x-auto">
            {[1, 2, 3, 4, 5, 6].map(idx => {
              const lineData = lines.find(l => l.lineIndex === idx);
              const najiaDetail = reading?.najia?.lines.find(l => l.lineIndex === idx);
              const transformedDetail = reading?.najia?.transformedChart?.lines.find(l => l.lineIndex === idx);

              return (
                <div
                  key={idx}
                  className={`grid grid-cols-12 items-center p-2 sm:p-2.5 rounded-xl border text-xs gap-1 transition-all ${
                    lineData?.isChanging
                      ? 'bg-red-50/40 border-red-200'
                      : 'bg-[#F5F5F6] border-[#E4E4E7]'
                  }`}
                >
                  {/* 1. 六神 */}
                  <div className="col-span-1 font-mono text-[11px] font-medium text-[#171717] truncate">
                    {najiaDetail ? najiaDetail.sixBeast : (idx === 1 ? '六神' : '···')}
                  </div>

                  {/* 2. 本卦 6 爻信息 */}
                  <div className="col-span-5 flex items-center justify-between pr-2 border-r border-[#E4E4E7]/60">
                    {/* 爻名 */}
                    <span className="font-serif text-[11px] text-[#52525B] w-8 shrink-0">
                      {lineData
                        ? formatLineName(idx, lineData.isYang)
                        : (idx === 1 ? (isEn ? 'Line 1' : '初爻') : idx === 6 ? (isEn ? 'Line 6' : '上爻') : (isEn ? `Line ${idx}` : `${idx}爻`))}
                    </span>

                    {/* 六亲地支 (如: 父母 戌土) */}
                    <span className="font-serif text-[11px] text-[#171717] font-medium truncate px-1">
                      {najiaDetail ? `${najiaDetail.relative} ${najiaDetail.branch}${najiaDetail.element}` : '——'}
                    </span>

                    {/* 本卦爻画 */}
                    <div className="w-12 h-2 flex items-center justify-center shrink-0">
                      <div className="relative w-full h-full flex items-center justify-between">
                        {lineData ? (
                          lineData.isYang ? (
                            <div className="w-full h-full bg-[#171717] rounded-xs" />
                          ) : (
                            <>
                              <div className="w-[calc(50%-3px)] h-full bg-[#171717] rounded-xs" />
                              <div className="w-[calc(50%-3px)] h-full bg-[#171717] rounded-xs" />
                            </>
                          )
                        ) : (
                          <div className="w-full h-full border-b border-dashed border-[#171717]/30" />
                        )}
                      </div>
                    </div>

                    {/* 世应徽章 */}
                    <div className="w-5 text-center shrink-0">
                      {najiaDetail?.isShi && (
                        <span className="text-[10px] font-mono bg-[#171717] text-white px-1 py-0.2 rounded font-medium">
                          世
                        </span>
                      )}
                      {najiaDetail?.isYing && (
                        <span className="text-[10px] font-mono bg-[#E4E4E7] text-[#171717] px-1 py-0.2 rounded">
                          应
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 3. 中间动变通道 */}
                  <div className="col-span-1 flex items-center justify-center text-center">
                    {lineData?.isChanging ? (
                      <span className="text-[10px] font-mono text-red-600 font-bold bg-white border border-red-200 px-1 py-0.5 rounded shadow-2xs animate-pulse">
                        {lineData.isYang ? '○动➔' : '✕动➔'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-[#A1A1AA]">
                        {lineData ? '静' : '待'}
                      </span>
                    )}
                  </div>

                  {/* 4. 变卦 6 爻信息 */}
                  <div className="col-span-5 flex items-center justify-between pl-2 border-l border-[#E4E4E7]/60">
                    {transformedDetail ? (
                      <>
                        {/* 变卦爻画 */}
                        <div className="w-12 h-2 flex items-center justify-center shrink-0">
                          <div className="relative w-full h-full flex items-center justify-between">
                            {transformedDetail.isYang ? (
                              <div className={`w-full h-full rounded-xs ${transformedDetail.isChanged ? 'bg-red-600' : 'bg-[#171717]'}`} />
                            ) : (
                              <>
                                <div className={`w-[calc(50%-3px)] h-full rounded-xs ${transformedDetail.isChanged ? 'bg-red-600' : 'bg-[#171717]'}`} />
                                <div className={`w-[calc(50%-3px)] h-full rounded-xs ${transformedDetail.isChanged ? 'bg-red-600' : 'bg-[#171717]'}`} />
                              </>
                            )}
                          </div>
                        </div>

                        {/* 变卦六亲地支 */}
                        <span className={`font-serif text-[11px] truncate px-1 ${transformedDetail.isChanged ? 'text-red-700 font-bold' : 'text-[#52525B]'}`}>
                          {transformedDetail.relative} {transformedDetail.branch}{transformedDetail.element}
                        </span>

                        {/* 变卦爻名 */}
                        <span className="font-serif text-[11px] text-[#71717A] w-8 text-right shrink-0">
                          {transformedDetail.lineNameZh}
                        </span>
                      </>
                    ) : (
                      <div className="w-full text-center text-[10px] text-[#A1A1AA] font-mono">
                        {lineData ? '（无动爻 · 守静）' : '···'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 双卦全息卡片 (本卦 + 变卦并列解析) */}
          {reading && (
            <div className="mt-4 pt-3 border-t border-[#E4E4E7] grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in">
              {/* 本卦精要卡 */}
              <div className="p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-xs text-[#171717] flex items-center gap-1">
                    <span>本卦：【{reading.primaryHexagram.nameZh}】</span>
                    <span className="text-base">{reading.primaryHexagram.symbol}</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#71717A]">
                    下{reading.primaryHexagram.lowerTrigram}上{reading.primaryHexagram.upperTrigram}
                  </span>
                </div>
                <p className="text-[11px] text-[#52525B] leading-relaxed line-clamp-2 italic">
                  卦辞：“{reading.primaryHexagram.judgmentZh}”
                </p>
                <p className="text-[10px] text-[#71717A] leading-relaxed line-clamp-2">
                  大象：“{reading.primaryHexagram.imageZh}”
                </p>
              </div>

              {/* 变卦精要卡 */}
              <div className="p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] space-y-1.5">
                {reading.transformedHexagram ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-xs text-red-700 flex items-center gap-1">
                        <span>变卦：【{reading.transformedHexagram.nameZh}】</span>
                        <span className="text-base">{reading.transformedHexagram.symbol}</span>
                      </span>
                      <span className="text-[10px] font-mono text-red-600">
                        下{reading.transformedHexagram.lowerTrigram}上{reading.transformedHexagram.upperTrigram}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#52525B] leading-relaxed line-clamp-2 italic">
                      变卦卦辞：“{reading.transformedHexagram.judgmentZh}”
                    </p>
                    <p className="text-[10px] text-red-700 leading-relaxed line-clamp-2">
                      转机趋向：动爻引动气场流转，事情终局将向【{reading.transformedHexagram.nameZh}】所指引的格局演化。
                    </p>
                  </>
                ) : (
                  <div className="h-full flex flex-col justify-center text-center py-2 space-y-1">
                    <span className="font-serif font-medium text-xs text-[#171717]">
                      六爻安静 · 纯守本卦
                    </span>
                    <p className="text-[11px] text-[#71717A] leading-relaxed">
                      此卦无老阳老阴发动，气象沉凝平稳。事无剧变，守常得安。
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI 六爻全息神谕报告 */}
      {reading && (
        <div className="w-full mt-8 rounded-3xl bg-white border border-[#E4E4E7] p-6 sm:p-8 shadow-2xs text-left animate-in fade-in slide-in-from-bottom-4 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E4E4E7]">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F5F5F6] text-[#52525B] border border-[#E4E4E7]">
                {isEn ? 'Orthodox I Ching · AI Oracle' : '正统纳甲六爻 · AI 神谕解卦'}
              </span>
              <h4 className="font-serif font-black text-xl text-[#171717] mt-1">
                {isEn
                  ? `【${reading.primaryHexagram.nameEn}】Oracle Insight`
                  : `【${reading.primaryHexagram.nameZh}】神谕全息洞察`}
              </h4>
            </div>

            <button
              onClick={handleGenerateAiReport}
              disabled={isGeneratingAi}
              className="px-6 py-2.5 rounded-full bg-[#171717] hover:bg-[#333333] text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-white/80" />
              <span>
                {isGeneratingAi
                  ? (isEn ? 'Consulting Lines & Moon/Day...' : 'AI 正在依纳甲断爻...')
                  : (isEn ? 'Generate Comprehensive Reading' : '让 AI 深度解卦')}
              </span>
            </button>
          </div>

          {aiReport ? (
            <div className="space-y-6">
              <div className="prose prose-stone max-w-none text-[#171717] text-xs sm:text-sm leading-relaxed space-y-4 whitespace-pre-line animate-in fade-in">
                {aiReport}
              </div>

              {/* 针对当前卦象的 2 积分多轮追问组件 */}
              <LiuYaoFollowUpWidget
                reading={reading}
                initialQuestion={question}
                lang={lang === 'en' ? 'en' : 'zh'}
              />
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#52525B]">
              {isEn
                ? 'Hexagram cast completed. Click the button above to generate a deep strategic reading with AI.'
                : '京房纳甲六爻已排定。点击上方按钮，让 AI 依据你叩问之事，结合时空提纲、日月旺衰、世应与动爻转化提供深层决策剖析。'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
