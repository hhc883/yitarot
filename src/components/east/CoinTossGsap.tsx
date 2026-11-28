'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  CoinTossLine,
  IChingReading,
  tossCoins,
  buildReadingFromLines,
  lookupHexagramByLines
} from '@/lib/metaphysics/iching';
import {
  getCurrentLiuYaoTimeInfo,
  formatLineName,
  CHANG_SHENG_LABELS,
  getChangShengRow,
  type LiuYaoTimeInfo
} from '@/lib/metaphysics/najia';
import { divineMeihua, type MeihuaDivinationResult } from '@/lib/metaphysics/meihua';
import { Sparkles, RotateCcw, CheckCircle2, Clock, Copy, Check, X } from 'lucide-react';
import { usePointsGate } from '@/components/site/PointsGateProvider';
import { LiuYaoFollowUpWidget } from './LiuYaoFollowUpWidget';
import { MarkdownView } from '@/components/common/MarkdownView';
import { saveReading, getSavedReadings } from '@/lib/storage/reading-history';

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
  const [copied, setCopied] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [restoredMessages, setRestoredMessages] = useState<Array<{ id: string; role: 'user' | 'assistant'; content: string; timestamp: string }>>([]);
  const pointsGate = usePointsGate();

  // 对标易瑞笔记：6 种起卦方式 + 盘面开关 + 神煞长生弹窗
  type LiuYaoCastMode = 'time' | 'two_num' | 'three_num' | 'self' | 'toss' | 'random';
  const [castMode, setCastMode] = useState<LiuYaoCastMode>('toss');
  const [customDateTime, setCustomDateTime] = useState<string>(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });
  const [num1, setNum1] = useState<number>(3);
  const [num2, setNum2] = useState<number>(7);
  const [num3, setNum3] = useState<number>(2);
  const [addHourNum, setAddHourNum] = useState<boolean>(false);
  const [threeNumMethod, setThreeNumMethod] = useState<1 | 2>(1);
  // 自选 6 爻（7=少阳, 8=少阴, 9=老阳, 6=老阴）
  const [selfSums, setSelfSums] = useState<[number, number, number, number, number, number]>([7, 7, 7, 7, 7, 7]);
  const [showColor, setShowColor] = useState<boolean>(true);
  const [showMeihuaRef, setShowMeihuaRef] = useState<boolean>(false);
  const [onlyMissingFuShen, setOnlyMissingFuShen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalTab, setModalTab] = useState<'shensha' | 'changsheng'>('shensha');
  const [csStem, setCsStem] = useState<string>('乙');
  const [csEarthRule, setCsEarthRule] = useState<'fire_earth' | 'water_earth'>('fire_earth');
  const [meihuaRef, setMeihuaRef] = useState<MeihuaDivinationResult | null>(null);

  const makeLineFromSum = (lineIndex: number, sum: number): CoinTossLine => {
    const isYang = sum === 7 || sum === 9;
    const isChanging = sum === 6 || sum === 9;
    const changedYang = sum === 6 ? true : sum === 9 ? false : isYang;
    const coins: [number, number, number] =
      sum === 6 ? [2, 2, 2] : sum === 7 ? [3, 2, 2] : sum === 8 ? [3, 3, 2] : [3, 3, 3];
    return { lineIndex, coins, sum, isYang, isChanging, changedYang };
  };

  const applyCastLines = (builtLines: CoinTossLine[], tInfo: LiuYaoTimeInfo) => {
    const finalReading = buildReadingFromLines(builtLines, tInfo);
    setLines(builtLines);
    setCurrentLine(6);
    setTimeInfo(tInfo);
    setReading(finalReading);
    setAiReport('');
    setSessionId('');
    setRestoredMessages([]);
    const upperBits = builtLines.slice(3, 6).map((l) => (l.isYang ? 1 : 0));
    const lowerBits = builtLines.slice(0, 3).map((l) => (l.isYang ? 1 : 0));
    const triMap: Record<string, number> = { '111': 1, '011': 2, '101': 3, '001': 4, '110': 5, '010': 6, '100': 7, '000': 8 };
    const mov = builtLines.find((l) => l.isChanging)?.lineIndex ?? 1;
    setMeihuaRef(
      divineMeihua(question, 'hexagram', undefined, {
        hexagram: {
          upper: triMap[upperBits.join('')] ?? 1,
          lower: triMap[lowerBits.join('')] ?? 1,
          movingLine: mov,
        },
      })
    );
    if (onReadingReady) onReadingReady(finalReading);
  };

  const handleDirectCast = () => {
    const targetDate = customDateTime ? new Date(customDateTime) : new Date();
    const validDate = Number.isNaN(targetDate.getTime()) ? new Date() : targetDate;
    const tInfo = getCurrentLiuYaoTimeInfo(validDate);

    if (castMode === 'random') {
      const randLines = Array.from({ length: 6 }, (_, idx) => {
        const c = tossCoins();
        return makeLineFromSum(idx + 1, c[0] + c[1] + c[2]);
      });
      applyCastLines(randLines, tInfo);
      return;
    }

    if (castMode === 'self') {
      const selfLines = selfSums.map((s, idx) => makeLineFromSum(idx + 1, s));
      applyCastLines(selfLines, tInfo);
      return;
    }

    // 时间 / 两数 / 三数：通过梅花起卦得上下卦与动爻，转为六爻 CoinTossLine
    const mh =
      castMode === 'time'
        ? divineMeihua(question, 'time', undefined, { date: validDate })
        : castMode === 'two_num'
          ? divineMeihua(question, 'numbers', [num1, num2], { date: validDate, addHour: addHourNum })
          : divineMeihua(question, 'numbers', [num1, num2, num3], {
              date: validDate,
              addHour: addHourNum,
              threeNumMethod,
            });
    const mhLines = mh.primaryHexagram.lines.map((isYang, idx) => {
      const isMov = mh.movingLine === idx + 1;
      const sum = isYang ? (isMov ? 9 : 7) : isMov ? 6 : 8;
      return makeLineFromSum(idx + 1, sum);
    });
    applyCastLines(mhLines, tInfo);
  };

  // 复制完整解卦与卦象报告
  const handleCopyReport = () => {
    if (!aiReport || !reading) return;
    const title = isEn ? `【YiTarot · I Ching Oracle Report】\n` : `【YiTarot · 京房纳甲六爻解卦档案】\n`;
    const q = question ? (isEn ? `Inquiry: ${question}\n` : `求问事项：${question}\n`) : '';
    const hex = isEn
      ? `Primary: ${reading.primaryHexagram.nameEn} (${reading.najia?.palace} Palace)\n`
      : `本卦：${reading.primaryHexagram.nameZh}（${reading.najia?.palace}宫${reading.najia?.palaceElement}）${reading.transformedHexagram ? ` -> 变卦：${reading.transformedHexagram.nameZh}` : '（六爻安静）'}\n`;
    const body = `\n【AI 神谕全息解读】\n${aiReport}\n`;
    navigator.clipboard.writeText(title + q + hex + body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 自动将六爻卦象与 AI 解卦存入本地档案
  useEffect(() => {
    if (aiReport && !isGeneratingAi && reading) {
      saveReading({
        type: 'liuyao',
        title: isEn
          ? `【${reading.primaryHexagram.nameEn}】I Ching Reading`
          : `【${reading.primaryHexagram.nameZh}】六爻神谕`,
        question,
        summary: aiReport.slice(0, 140) + '...',
        fullContent: aiReport,
        hexagram: {
          primary: isEn ? reading.primaryHexagram.nameEn : reading.primaryHexagram.nameZh,
          transformed: reading.transformedHexagram
            ? (isEn ? reading.transformedHexagram.nameEn : reading.transformedHexagram.nameZh)
            : undefined
        }
      });
    }
  }, [aiReport, isGeneratingAi, reading, question, isEn]);

  // 历史卦例回访入口：支持 ?session_id=xxx 直接恢复全盘卦象、深度解卦与追问历史，继续互动
  useEffect(() => {
    const rawSessionId = new URLSearchParams(window.location.search).get('session_id');
    if (!rawSessionId) return;

    // 1. 优先尝试从云端加载
    fetch(`/api/east/liuyao/sessions?id=${encodeURIComponent(rawSessionId)}`)
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data?.session) {
          setSessionId(data.session.id);
          if (data.session.question) setQuestion(data.session.question);
          if (data.session.reading_snapshot) {
            const snap = data.session.reading_snapshot;
            setReading(snap);
            if (snap.lines && Array.isArray(snap.lines)) {
              setLines(snap.lines);
              setCurrentLine(6);
            }
            if (snap.ai_report) {
              setAiReport(snap.ai_report);
            }
          }
          if (data.messages && Array.isArray(data.messages)) {
            setRestoredMessages(data.messages);
          }
          return;
        }

        // 2. 本地档案兜底恢复
        const localList = getSavedReadings();
        const found = localList.find(r => r.id === rawSessionId);
        if (found) {
          setSessionId(found.id);
          if (found.question) setQuestion(found.question);
          if (found.fullContent) setAiReport(found.fullContent);
          if (found.chatHistory) {
            setRestoredMessages(
              found.chatHistory.map((m, idx) => ({
                id: String(idx),
                role: m.role,
                content: m.text,
                timestamp: m.timestamp || ''
              }))
            );
          }
        }
      })
      .catch(() => {});
  }, []);

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
                if (parsed.session_id) {
                  setSessionId(parsed.session_id);
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

      {/* 起卦方式 Tab（时间 / 两数 / 三数 / 自选 / 摇币 / 随机） */}
      <div className="w-full max-w-2xl mb-6 rounded-2xl bg-white border border-[#E4E4E7] p-4 shadow-2xs space-y-4">
        <div className="grid grid-cols-6 gap-1 rounded-xl bg-[#F4F4F5] p-1 text-xs">
          {(
            [
              ['time', '时间'],
              ['two_num', '两数'],
              ['three_num', '三数'],
              ['self', '自选'],
              ['toss', '摇币'],
              ['random', '随机'],
            ] as const
          ).map(([m, label]) => (
            <button
              key={m}
              type="button"
              onClick={() => setCastMode(m)}
              className={`rounded-lg py-1.5 font-medium transition-all cursor-pointer ${
                castMode === m
                  ? 'bg-white text-[#171717] shadow-2xs'
                  : 'text-[#71717A] hover:text-[#171717]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {castMode !== 'toss' && (
          <div className="space-y-3 text-xs">
            {(castMode === 'time' || castMode === 'two_num' || castMode === 'three_num') && (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] px-3 py-2">
                <span className="text-[#52525B]">时间</span>
                <input
                  type="datetime-local"
                  value={customDateTime}
                  onChange={(e) => setCustomDateTime(e.target.value)}
                  className="bg-transparent text-[#171717] font-mono text-xs focus:outline-hidden"
                />
              </div>
            )}

            {(castMode === 'two_num' || castMode === 'three_num') && (
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-1.5 text-[#52525B]">
                  <span>数字一</span>
                  <input type="number" min={1} value={num1} onChange={(e) => setNum1(Math.max(1, Number(e.target.value)))} className="w-16 rounded-lg border border-[#E4E4E7] bg-[#FAFAFA] px-2 py-1 text-center text-[#171717]" />
                </label>
                <label className="flex items-center gap-1.5 text-[#52525B]">
                  <span>数字二</span>
                  <input type="number" min={1} value={num2} onChange={(e) => setNum2(Math.max(1, Number(e.target.value)))} className="w-16 rounded-lg border border-[#E4E4E7] bg-[#FAFAFA] px-2 py-1 text-center text-[#171717]" />
                </label>
                {castMode === 'three_num' && (
                  <label className="flex items-center gap-1.5 text-[#52525B]">
                    <span>数字三</span>
                    <input type="number" min={1} value={num3} onChange={(e) => setNum3(Math.max(1, Number(e.target.value)))} className="w-16 rounded-lg border border-[#E4E4E7] bg-[#FAFAFA] px-2 py-1 text-center text-[#171717]" />
                  </label>
                )}
                <label className="flex items-center gap-1 cursor-pointer text-[#52525B]">
                  <input type="checkbox" checked={addHourNum} onChange={(e) => setAddHourNum(e.target.checked)} />
                  <span>加时辰</span>
                </label>
                {castMode === 'three_num' && (
                  <button
                    type="button"
                    onClick={() => setThreeNumMethod(threeNumMethod === 1 ? 2 : 1)}
                    className="rounded-lg border border-[#E4E4E7] px-2 py-1 text-[11px] text-[#52525B] cursor-pointer"
                  >
                    {threeNumMethod === 1 ? '法一(一上二下三动)' : '法二(一上二三下总动)'}
                  </button>
                )}
              </div>
            )}

            {castMode === 'self' && (
              <div className="space-y-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] p-4">
                {[5, 4, 3, 2, 1, 0].map((idx) => {
                  const s = selfSums[idx];
                  const isYang = s === 7 || s === 9;
                  const isMoving = s === 6 || s === 9;
                  const labels = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
                  const sumLabel = s === 7 ? '少阳' : s === 8 ? '少阴' : s === 9 ? '老阳' : '老阴';
                  return (
                    <div key={idx} className="flex items-center justify-center gap-4">
                      <span className="w-20 text-right text-xs text-[#52525B]">
                        {labels[idx]}({sumLabel})
                      </span>
                      <button
                        type="button"
                        title="点击切换阴阳"
                        onClick={() => {
                          const next = [...selfSums] as typeof selfSums;
                          next[idx] = isYang ? (isMoving ? 6 : 8) : (isMoving ? 9 : 7);
                          setSelfSums(next);
                        }}
                        className="w-40 h-3.5 flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        {isYang ? (
                          <span className="w-full h-full bg-[#171717] rounded-sm" />
                        ) : (
                          <>
                            <span className="w-[45%] h-full bg-[#171717] rounded-sm" />
                            <span className="w-[45%] h-full bg-[#171717] rounded-sm" />
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const next = [...selfSums] as typeof selfSums;
                          next[idx] = isYang ? (isMoving ? 7 : 9) : (isMoving ? 8 : 6);
                          setSelfSums(next);
                        }}
                        className={`px-2 py-0.5 text-[11px] rounded border cursor-pointer transition-colors ${
                          isMoving
                            ? 'bg-[#171717] text-white border-[#171717] font-medium'
                            : 'bg-[#E4E4E7]/70 text-[#71717A] border-[#D4D4D8] hover:text-[#171717]'
                        }`}
                      >
                        动
                      </button>
                    </div>
                  );
                })}
                <div className="pt-2 text-center text-xs font-serif text-[#52525B]">
                  {(() => {
                    const pLines = selfSums.map((s) => s === 7 || s === 9);
                    const hasChange = selfSums.some((s) => s === 6 || s === 9);
                    const pHex = lookupHexagramByLines(pLines);
                    if (!hasChange) return pHex.nameZh;
                    const tLines = selfSums.map((s) => (s === 6 ? true : s === 9 ? false : s === 7));
                    const tHex = lookupHexagramByLines(tLines);
                    return `${pHex.nameZh} 之 ${tHex.nameZh}`;
                  })()}
                </div>
              </div>
            )}

            {castMode === 'random' && (
              <p className="text-center text-[#71717A] py-1">直接点击「排盘」即可按铜钱概率随机生成六爻</p>
            )}

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 rounded-full border border-[#E4E4E7] py-2 text-xs font-medium text-[#52525B] hover:bg-[#F5F5F6] cursor-pointer"
              >
                重置
              </button>
              <button
                type="button"
                onClick={handleDirectCast}
                className="flex-1 rounded-full bg-[#171717] py-2 text-xs font-medium text-white hover:bg-[#333333] cursor-pointer"
              >
                排盘
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 起卦主交互区 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start w-full">
        {/* 左侧：3D 铜钱摇卦台（仅摇币模式显示） */}
        {castMode === 'toss' && (
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
        )}

        {/* 右侧：正统京房纳甲六爻排盘面板 */}
        <div
          ref={linesBoardRef}
          className={`${castMode === 'toss' ? 'md:col-span-7' : 'md:col-span-12'} flex flex-col p-4 sm:p-6 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-4`}
        >
          {/* 起卦时空提纲（四柱干支、纳音、旬空、卦身、世身、12神煞 + 4个开关胶囊） */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] text-xs space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[#71717A] text-[11px] font-mono">
              <span className="flex items-center gap-1">
                <Clock size={12} />
                <span>{timeInfo?.solarDate || '加载时空盘...'}</span>
              </span>
              <span>{timeInfo?.lunarDate}</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-[#E4E4E7] text-[#171717]">
              <div className="flex flex-wrap items-center gap-3 font-serif text-sm">
                <span>{timeInfo?.yearGanzhi}<span className="text-[10px] text-[#71717A] ml-0.5">{timeInfo?.naYin?.year}</span></span>
                <span>{timeInfo?.monthGanzhi}<span className="text-[10px] text-[#71717A] ml-0.5">{timeInfo?.naYin?.month}</span></span>
                <span className="font-semibold">{timeInfo?.dayGanzhi}<span className="text-[10px] text-[#71717A] font-normal ml-0.5">{timeInfo?.naYin?.day}</span></span>
                <span>{timeInfo?.timeGanzhi}<span className="text-[10px] text-[#71717A] ml-0.5">{timeInfo?.naYin?.time}</span></span>
              </div>
              {reading?.najia && (
                <div className="flex items-center gap-2 text-[11px] text-[#52525B] font-mono">
                  <span>卦身<strong className="text-[#171717] ml-0.5">{reading.najia.guaShen}</strong></span>
                  <span>世身<strong className="text-[#171717] ml-0.5">{reading.najia.shiShenBranch}</strong></span>
                  <span>空亡<strong className="text-[#171717] ml-0.5">{timeInfo?.xunKong}</strong></span>
                </div>
              )}
            </div>
            {reading?.najia?.shenSha && (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-x-2 gap-y-1 pt-1.5 border-t border-[#E4E4E7] text-[11px] text-[#52525B]">
                {Object.entries(reading.najia.shenSha).slice(0, 12).map(([k, v]) => (
                  <span key={k}>{k}-<strong className="text-[#171717] font-normal">{v}</strong></span>
                ))}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2 pt-1.5 border-t border-[#E4E4E7]">
              <button
                type="button"
                onClick={() => setShowColor((v) => !v)}
                className={`px-3 py-0.5 rounded-full text-[11px] border cursor-pointer ${showColor ? 'bg-[#171717] text-white border-[#171717]' : 'bg-white text-[#71717A] border-[#E4E4E7]'}`}
              >
                颜色
              </button>
              <button
                type="button"
                onClick={() => setShowMeihuaRef((v) => !v)}
                className={`px-3 py-0.5 rounded-full text-[11px] border cursor-pointer ${showMeihuaRef ? 'bg-[#171717] text-white border-[#171717]' : 'bg-white text-[#71717A] border-[#E4E4E7]'}`}
              >
                梅花
              </button>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="px-3 py-0.5 rounded-full text-[11px] border bg-white text-[#171717] border-[#E4E4E7] hover:border-[#171717] cursor-pointer"
              >
                神煞/长生
              </button>
              <button
                type="button"
                onClick={() => setOnlyMissingFuShen((v) => !v)}
                className={`px-3 py-0.5 rounded-full text-[11px] border cursor-pointer ${onlyMissingFuShen ? 'bg-[#171717] text-white border-[#171717]' : 'bg-white text-[#71717A] border-[#E4E4E7]'}`}
              >
                京房伏
              </button>
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
                <>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#52525B] font-mono">
                    <span>
                      本卦：{reading.najia.palace}宫({reading.najia.generationName.replace('卦', '')}){reading.najia.hexTag ?? ''}
                    </span>
                    <span>•</span>
                    <span>世在第 {reading.najia.shiIndex} 爻 · 应在第 {reading.najia.yingIndex} 爻</span>
                    {reading.transformedHexagram && reading.najia.transformedChart && (
                      <>
                        <span>•</span>
                        <span className="text-red-700 font-medium">
                          变卦：{reading.najia.transformedChart.palace}宫({reading.najia.transformedChart.generationName.replace('卦', '')}){reading.najia.transformedChart.hexTag ?? ''}
                        </span>
                      </>
                    )}
                  </div>
                </>
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

          {/* 表头：严格等宽纵列对齐 */}
          {reading && (
            <div className="overflow-x-auto">
              <div className="min-w-[540px]">
                <div className="grid grid-cols-[44px_74px_82px_56px_24px_24px_1fr] items-center gap-2 px-3 py-2 text-[11px] font-mono text-[#71717A] border-b border-[#E4E4E7]">
                  <div>六神</div>
                  <div>伏神</div>
                  <div>【{reading.primaryHexagram.nameZh}】</div>
                  <div className="text-center">本卦</div>
                  <div className="text-center"></div>
                  <div className="text-center">动</div>
                  <div className="pl-2">
                    {reading.transformedHexagram
                      ? `【变卦 · ${reading.transformedHexagram.nameZh}】`
                      : '（六爻安静）'}
                  </div>
                </div>

                {/* 6 爻纵列对齐排盘区（第6爻在最上，第1爻在最下） */}
                <div className="divide-y divide-[#F4F4F5] border-b border-[#E4E4E7]">
                  {[6, 5, 4, 3, 2, 1].map((idx) => {
                    const lineData = lines.find((l) => l.lineIndex === idx);
                    const najiaDetail = reading?.najia?.lines.find((l) => l.lineIndex === idx);
                    const transformedDetail = reading?.najia?.transformedChart?.lines.find((l) => l.lineIndex === idx);
                    const elColor =
                      showColor && najiaDetail
                        ? najiaDetail.element === '木'
                          ? '#16A34A'
                          : najiaDetail.element === '火'
                            ? '#DC2626'
                            : najiaDetail.element === '土'
                              ? '#CA8A04'
                              : najiaDetail.element === '金'
                                ? '#64748B'
                                : '#2563EB'
                        : '#171717';

                    return (
                      <div
                        key={idx}
                        className={`grid grid-cols-[44px_74px_82px_56px_24px_24px_1fr] items-center gap-2 px-3 py-2.5 text-xs ${
                          lineData?.isChanging ? 'bg-red-50/40' : 'bg-white'
                        }`}
                      >
                        {/* 1. 六神 */}
                        <div className="font-mono text-[11px] text-[#52525B] truncate">
                          {najiaDetail ? najiaDetail.sixBeast : '—'}
                        </div>

                        {/* 2. 伏神（独立固定列，不挤压主卦） */}
                        <div className="text-[11px] truncate">
                          {najiaDetail?.fuShen && (!onlyMissingFuShen || najiaDetail.fuShen.isMissing) ? (
                            <span className={najiaDetail.fuShen.isMissing ? 'text-[#2563EB] font-medium' : 'text-[#A1A1AA]'}>
                              {najiaDetail.fuShen.relative}{najiaDetail.fuShen.stem ?? ''}{najiaDetail.fuShen.branch}
                            </span>
                          ) : (
                            <span className="text-[#E4E4E7]">—</span>
                          )}
                        </div>

                        {/* 3. 本卦六亲纳干地支 + 空亡 */}
                        <div className="font-serif text-[12px] font-medium truncate" style={{ color: elColor }}>
                          {najiaDetail ? `${najiaDetail.relative}${najiaDetail.stem ?? ''}${najiaDetail.branch}` : '—'}
                          {najiaDetail?.isKong && (
                            <span className="ml-1 text-[10px] font-mono text-[#71717A]">空</span>
                          )}
                        </div>

                        {/* 4. 本卦爻画（固定 56px 宽度，上下绝对对齐） */}
                        <div className="w-14 h-2.5 flex items-center justify-between shrink-0">
                          {lineData ? (
                            lineData.isYang ? (
                              <div className="w-full h-full bg-[#171717] rounded-xs" />
                            ) : (
                              <>
                                <div className="w-[44%] h-full bg-[#171717] rounded-xs" />
                                <div className="w-[44%] h-full bg-[#171717] rounded-xs" />
                              </>
                            )
                          ) : (
                            <div className="w-full h-full border-b border-dashed border-[#171717]/30" />
                          )}
                        </div>

                        {/* 5. 世应徽章 */}
                        <div className="text-center">
                          {najiaDetail?.isShi && (
                            <span className="inline-block text-[10px] font-mono bg-[#171717] text-white px-1 rounded">
                              世
                            </span>
                          )}
                          {najiaDetail?.isYing && (
                            <span className="inline-block text-[10px] font-mono bg-[#E4E4E7] text-[#171717] px-1 rounded">
                              应
                            </span>
                          )}
                        </div>

                        {/* 6. 动变符号 */}
                        <div className="text-center font-mono text-[11px]">
                          {lineData?.isChanging ? (
                            <span className="text-red-600 font-bold">{lineData.isYang ? '○' : '✕'}</span>
                          ) : null}
                        </div>

                        {/* 7. 变卦（仅存在变卦时显示爻画与干支） */}
                        <div className="pl-2 flex items-center gap-3 min-w-0">
                          {transformedDetail ? (
                            <>
                              <div className="w-14 h-2.5 flex items-center justify-between shrink-0">
                                {transformedDetail.isYang ? (
                                  <div className={`w-full h-full rounded-xs ${transformedDetail.isChanged ? 'bg-red-600' : 'bg-[#171717]'}`} />
                                ) : (
                                  <>
                                    <div className={`w-[44%] h-full rounded-xs ${transformedDetail.isChanged ? 'bg-red-600' : 'bg-[#171717]'}`} />
                                    <div className={`w-[44%] h-full rounded-xs ${transformedDetail.isChanged ? 'bg-red-600' : 'bg-[#171717]'}`} />
                                  </>
                                )}
                              </div>
                              <span className={`font-serif text-[12px] truncate ${transformedDetail.isChanged ? 'text-red-700 font-semibold' : 'text-[#52525B]'}`}>
                                {transformedDetail.relative}{transformedDetail.stem ?? ''}{transformedDetail.branch}
                              </span>
                            </>
                          ) : (
                            <span className="text-[11px] text-[#D4D4D8]">—</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 梅花体用参考卡（开启「梅花」胶囊时显示） */}
          {showMeihuaRef && meihuaRef && (
            <div className="p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] text-xs space-y-1.5">
              <div className="flex items-center justify-between font-medium text-[#171717]">
                <span>梅花体用参考：{meihuaRef.wuxingRelation.headlineZh}</span>
                <span className="text-[11px] text-[#52525B]">{meihuaRef.wuxingRelation.levelZh}</span>
              </div>
              <div className="flex flex-wrap gap-3 text-[11px] text-[#52525B]">
                <span>主：{meihuaRef.primaryHexagram.fullNameZh}</span>
                <span>互：{meihuaRef.mutualHexagram.fullNameZh}</span>
                <span>变：{meihuaRef.transformedHexagram.fullNameZh}</span>
                {meihuaRef.cuoGua && <span>错：{meihuaRef.cuoGua.fullNameZh}</span>}
                {meihuaRef.zongGua && <span>综：{meihuaRef.zongGua.fullNameZh}</span>}
              </div>
            </div>
          )}

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

            <div className="flex items-center gap-2">
              {aiReport && (
                <button
                  type="button"
                  onClick={handleCopyReport}
                  className="px-3.5 py-2 rounded-full border border-[#8A8A91] hover:bg-[#F5F5F6] text-[#171717] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (isEn ? 'Copied' : '已复制解卦') : (isEn ? 'Copy Full Report' : '复制解卦报告')}</span>
                </button>
              )}

              <button
                type="button"
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
          </div>

          {aiReport ? (
            <div className="space-y-6">
              <MarkdownView
                content={aiReport}
                className="text-xs sm:text-[13.5px] leading-relaxed text-[#171717] animate-in fade-in"
              />

              {/* 针对当前卦象的 2 积分多轮追问组件 */}
              <LiuYaoFollowUpWidget
                reading={reading}
                initialQuestion={question}
                sessionId={sessionId}
                initialMessages={restoredMessages}
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
      {/* 神煞 / 十二长生弹窗 */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setModalOpen(false)}>
          <div className="w-full max-w-xl rounded-2xl bg-white border border-[#E4E4E7] p-5 shadow-xl space-y-4 text-xs" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="inline-flex rounded-lg bg-[#F4F4F5] p-1">
                <button
                  type="button"
                  onClick={() => setModalTab('shensha')}
                  className={`px-3 py-1 rounded-md font-medium cursor-pointer ${modalTab === 'shensha' ? 'bg-white text-[#171717] shadow-2xs' : 'text-[#71717A]'}`}
                >
                  神煞
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab('changsheng')}
                  className={`px-3 py-1 rounded-md font-medium cursor-pointer ${modalTab === 'changsheng' ? 'bg-white text-[#171717] shadow-2xs' : 'text-[#71717A]'}`}
                >
                  长生
                </button>
              </div>
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-full p-1 text-[#71717A] hover:bg-[#F4F4F5] cursor-pointer">
                <X size={16} />
              </button>
            </div>

            {modalTab === 'shensha' ? (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {reading?.najia?.shenSha ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(reading.najia.shenSha).map(([k, v]) => (
                      <div key={k} className="rounded-lg border border-[#E4E4E7] bg-[#FAFAFA] px-3 py-2 flex items-center justify-between">
                        <span className="text-[#52525B]">{k}</span>
                        <span className="font-serif font-semibold text-[#171717]">{v}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-[#71717A] py-6">请先起卦排盘后查看神煞详情</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-6 gap-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] p-3 text-center">
                  {getChangShengRow(csStem, csEarthRule).map((branch, idx) => (
                    <div key={idx} className="py-1">
                      <span className="text-[#52525B]">{CHANG_SHENG_LABELS[idx]}-</span>
                      <span className="font-serif font-semibold text-[#171717]">{branch}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '木', '火', '土', '金', '水'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setCsStem(s)}
                      className={`px-2.5 py-1 rounded-full border cursor-pointer ${
                        csStem === s ? 'bg-[#171717] text-white border-[#171717]' : 'bg-white text-[#52525B] border-[#E4E4E7]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCsEarthRule('fire_earth')}
                    className={`rounded-full border py-1.5 cursor-pointer ${csEarthRule === 'fire_earth' ? 'border-[#171717] bg-[#171717] text-white' : 'border-[#E4E4E7] text-[#52525B]'}`}
                  >
                    火土同行
                  </button>
                  <button
                    type="button"
                    onClick={() => setCsEarthRule('water_earth')}
                    className={`rounded-full border py-1.5 cursor-pointer ${csEarthRule === 'water_earth' ? 'border-[#171717] bg-[#171717] text-white' : 'border-[#E4E4E7] text-[#52525B]'}`}
                  >
                    水土同行
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
