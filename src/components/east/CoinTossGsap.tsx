'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  CoinTossLine,
  IChingReading,
  CoinCode,
  tossCoins,
  buildReadingFromLines,
  createCoinTossLine,
  parseCoinTossLinesInput,
  buildCoinTossLinesFromCodes
} from '@/lib/metaphysics/iching';
import {
  getCurrentLiuYaoTimeInfo,
  parseLocalDateTimeInput,
  getLocalTimezoneLabel,
  formatLineName,
  formatLineNameEn,
  BRANCH_ELEMENT,
  ELEMENT_EN,
  PALACE_EN,
  SIX_RELATIVE_EN,
  SIX_BEAST_EN,
  BRANCH_EN,
  GENERATION_NAME_EN,
  isBranchXunKong,
  isBranchYuePo,
  formatBranchesEn,
  type LiuYaoTimeInfo
} from '@/lib/metaphysics/najia';
import {
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Coins,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { usePointsGate } from '@/components/site/PointsGateProvider';
import { LiuYaoFollowUpWidget } from './LiuYaoFollowUpWidget';
import { MarkdownView } from '@/components/common/MarkdownView';
import { saveReading, getSavedReadings } from '@/lib/storage/reading-history';

gsap.registerPlugin(useGSAP);

interface CoinTossGsapProps {
  onReadingReady?: (reading: IChingReading) => void;
  lang?: string;
}

const LINE_OPTIONS: Array<{
  code: CoinCode;
  zhLabel: string;
  zhSymbol: string;
  enLabel: string;
}> = [
  { code: 6, zhLabel: '老阴', zhSymbol: '⚋×', enLabel: 'Old Yin' },
  { code: 7, zhLabel: '少阳', zhSymbol: '⚊', enLabel: 'Y. Yang' },
  { code: 8, zhLabel: '少阴', zhSymbol: '⚋', enLabel: 'Y. Yin' },
  { code: 9, zhLabel: '老阳', zhSymbol: '⚊○', enLabel: 'Old Yang' }
];

function getTodayLocalStrings(): { dateStr: string; timeStr: string } {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    dateStr: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    timeStr: `${pad(now.getHours())}:${pad(now.getMinutes())}`
  };
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
  const [castMode, setCastMode] = useState<'coin' | 'manual'>('coin');
  const [currentLine, setCurrentLine] = useState<number>(0); // 0 to 6
  const [lines, setLines] = useState<CoinTossLine[]>([]);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [displayCoins, setDisplayCoins] = useState<[number, number, number]>([3, 3, 2]);
  const [reading, setReading] = useState<IChingReading | null>(null);
  const [timeInfo, setTimeInfo] = useState<LiuYaoTimeInfo | null>(null);
  const [tzLabel, setTzLabel] = useState<string>('');

  // 手录模式状态（自初爻至上爻）
  const [manualCodes, setManualCodes] = useState<Array<CoinCode | null>>([
    null,
    null,
    null,
    null,
    null,
    null
  ]);
  const [manualText, setManualText] = useState<string>('');
  const [useCustomTime, setUseCustomTime] = useState<boolean>(false);
  const [customDateStr, setCustomDateStr] = useState<string>('');
  const [customTimeStr, setCustomTimeStr] = useState<string>('');
  const [manualError, setManualError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);

  // 次要信息折叠开关
  const [showTimeDetails, setShowTimeDetails] = useState<boolean>(false);
  const [showHexDetails, setShowHexDetails] = useState<boolean>(false);

  const [aiReport, setAiReport] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [restoredMessages, setRestoredMessages] = useState<
    Array<{ id: string; role: 'user' | 'assistant'; content: string; timestamp: string }>
  >([]);
  const pointsGate = usePointsGate();

  // 客户端初始化当地时区与当前起卦时间（避免 SSR 与浏览器当地时区不一致）
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setTzLabel(getLocalTimezoneLabel());
      setTimeInfo((prev) => prev ?? getCurrentLiuYaoTimeInfo());
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  // 复制完整解卦与卦象报告
  const handleCopyReport = () => {
    if (!aiReport || !reading) return;
    const title = isEn ? `【YiTarot · I Ching Oracle Report】\n` : `【YiTarot · 京房纳甲六爻解卦档案】\n`;
    const q = question ? (isEn ? `Inquiry: ${question}\n` : `求问事项：${question}\n`) : '';
    const hex = isEn
      ? `Primary: ${reading.primaryHexagram.nameEn} (${reading.najia ? PALACE_EN[reading.najia.palace] : ''} Palace)\n`
      : `本卦：${reading.primaryHexagram.nameZh}（${reading.najia?.palace}宫${reading.najia?.palaceElement}）${reading.transformedHexagram ? ` -> 变卦：${reading.transformedHexagram.nameZh}` : '（六爻安静）'}\n`;
    const body = isEn
      ? `\n【AI Oracle Interpretation】\n${aiReport}\n`
      : `\n【AI 神谕全息解读】\n${aiReport}\n`;
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
            ? isEn
              ? reading.transformedHexagram.nameEn
              : reading.transformedHexagram.nameZh
            : undefined
        }
      });
    }
  }, [aiReport, isGeneratingAi, reading, question, isEn]);

  // 历史卦例回访入口：支持 ?session_id=xxx 直接恢复全盘卦象、深度解卦与追问历史，继续互动
  useEffect(() => {
    const rawSessionId = new URLSearchParams(window.location.search).get('session_id');
    if (!rawSessionId) return;

    fetch(`/api/east/liuyao/sessions?id=${encodeURIComponent(rawSessionId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.session) {
          setSessionId(data.session.id);
          if (data.session.question) setQuestion(data.session.question);
          if (data.session.reading_snapshot) {
            const snap = data.session.reading_snapshot;
            setReading(snap);
            if (snap.najia?.timeInfo) {
              setTimeInfo(snap.najia.timeInfo);
            }
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

        const localList = getSavedReadings();
        const found = localList.find((r) => r.id === rawSessionId);
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

  // 验收 / 复现入口：支持 ?lines=101011（0/1 阴阳）或 ?lines=978678（6/7/8/9），复用标准解析逻辑，绝不强行正规化非法编码
  useEffect(() => {
    const rawParam = new URLSearchParams(window.location.search).get('lines');
    if (rawParam === null) return;

    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (cancelled) return;
      try {
        const presetLines = parseCoinTossLinesInput(rawParam, { allowBinary: true });
        const curTime = getCurrentLiuYaoTimeInfo();
        const presetReading = buildReadingFromLines(presetLines, curTime);

        setTimeInfo(curTime);
        setLines(presetLines);
        setDisplayCoins(presetLines[0].coins);
        setCurrentLine(6);
        setReading(presetReading);
        setManualCodes(presetLines.map((l) => l.sum as CoinCode));
        setManualText(presetLines.map((l) => String(l.sum)).join(''));
        setUrlError(null);
        onReadingReady?.(presetReading);
      } catch {
        setUrlError(
          isEn
            ? `Invalid URL parameter "?lines=${rawParam}". Expected 6 digits of 6/7/8/9 or 0/1.`
            : `URL 参数 "?lines=${rawParam}" 无效，需提供 6 位纯 6/7/8/9 或 0/1（自初爻至上爻）。`
        );
      }
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [onReadingReady, isEn]);

  // GSAP 掷币抛掷物理时间轴
  const handleCastNextLine = useCallback(() => {
    if (currentLine >= 6 || isFlipping) return;

    setIsFlipping(true);
    const coins = tossCoins();
    setDisplayCoins(coins);

    const coinEls = [coin1Ref.current, coin2Ref.current, coin3Ref.current].filter(Boolean);

    const tl = gsap.timeline({
      onComplete: () => {
        const sum = (coins[0] + coins[1] + coins[2]) as CoinCode;
        const baseLine = createCoinTossLine(currentLine + 1, sum);
        const newLine: CoinTossLine = { ...baseLine, coins };

        const updatedLines = [...lines, newLine];
        setLines(updatedLines);
        setCurrentLine(currentLine + 1);
        setIsFlipping(false);

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
    setSessionId('');
    setRestoredMessages([]);
    setDisplayCoins([3, 3, 2]);
    setTimeInfo(getCurrentLiuYaoTimeInfo());
    setManualError(null);
    setUrlError(null);
  };

  // 手录单爻选择（第 1 爻至第 6 爻）
  const handleSelectManualLine = (lineIdxZeroBased: number, code: CoinCode) => {
    setManualError(null);
    const next = [...manualCodes];
    next[lineIdxZeroBased] = code;
    setManualCodes(next);
    if (next.every((v): v is CoinCode => v !== null)) {
      setManualText(next.join(''));
    } else {
      setManualText('');
    }
  };

  // 手录快捷文本输入（6/7/8/9，自初爻至上爻）
  const handleManualTextChange = (val: string) => {
    setManualText(val);
    setManualError(null);
    try {
      const parsed = parseCoinTossLinesInput(val, { allowBinary: false });
      setManualCodes(parsed.map((l) => l.sum as CoinCode));
    } catch {
      // 尚未输入满 6 位或含待修正字符时不覆盖按钮状态
    }
  };

  // 切换自定义起卦日期时刻
  const handleToggleCustomTime = (enabled: boolean) => {
    setUseCustomTime(enabled);
    setManualError(null);
    if (enabled && !customDateStr) {
      const { dateStr, timeStr } = getTodayLocalStrings();
      setCustomDateStr(dateStr);
      setCustomTimeStr(timeStr);
    }
  };

  // 手录起卦提交
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setManualError(null);

    try {
      let manualLines: CoinTossLine[];
      if (manualText.trim()) {
        manualLines = parseCoinTossLinesInput(manualText, { allowBinary: false });
      } else if (manualCodes.every((c): c is CoinCode => c !== null)) {
        manualLines = buildCoinTossLinesFromCodes(manualCodes, { allowBinary: false });
      } else {
        throw new Error(
          isEn
            ? 'Please select or enter all 6 lines (6/7/8/9) from Line 1 to Line 6.'
            : '请完整点选或输入第 1 至第 6 爻（仅限 6/7/8/9）。'
        );
      }

      let targetTimeInfo: LiuYaoTimeInfo;
      if (useCustomTime) {
        const customDate = parseLocalDateTimeInput(customDateStr, customTimeStr);
        targetTimeInfo = getCurrentLiuYaoTimeInfo(customDate);
      } else {
        targetTimeInfo = getCurrentLiuYaoTimeInfo();
      }

      const completeReading = buildReadingFromLines(manualLines, targetTimeInfo);
      setTimeInfo(targetTimeInfo);
      setLines(manualLines);
      setDisplayCoins(manualLines[0].coins);
      setCurrentLine(6);
      setReading(completeReading);
      setAiReport('');
      setSessionId('');
      setRestoredMessages([]);
      setUrlError(null);
      onReadingReady?.(completeReading);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : isEn
            ? 'Invalid manual input.'
            : '手录卦象或日期无效。';
      setManualError(msg);
    }
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
                  setAiReport((prev) => prev + parsed.text);
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

  const activeTimeInfo = reading?.najia?.timeInfo ?? timeInfo;
  const monthElement = activeTimeInfo?.monthZhi ? BRANCH_ELEMENT[activeTimeInfo.monthZhi] : undefined;
  const dayElement = activeTimeInfo?.dayZhi ? BRANCH_ELEMENT[activeTimeInfo.dayZhi] : undefined;

  return (
    <div ref={containerRef} className="w-full max-w-5xl mx-auto flex flex-col items-center">
      {/* URL 参数无效提醒 */}
      {urlError && (
        <div
          role="alert"
          className="w-full max-w-2xl mb-4 px-4 py-3 rounded-xl bg-[#F5F5F6] border border-[#171717]/30 text-xs text-[#171717] flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{urlError}</span>
        </div>
      )}

      {/* 提问框 */}
      <div className="w-full max-w-2xl mb-8 p-4 sm:p-5 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs">
        <label className="block text-xs font-serif font-semibold text-[#52525B] mb-2">
          {isEn ? 'Inquiry Focus' : '所求之事'}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isFlipping || isGeneratingAi}
            className="flex-1 bg-[#F5F5F6] border border-[#E4E4E7] text-[#171717] text-sm rounded-xl px-4 py-2.5 focus:outline-hidden focus:border-[#171717] transition-all disabled:opacity-75"
            placeholder={isEn ? 'Enter your inquiry...' : '输入你心中所问之事...'}
          />
        </div>
      </div>

      {/* 起卦主交互区 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start w-full">
        {/* 左侧：3D 铜钱摇卦台 + 手录入口 */}
        <div className="md:col-span-5 flex flex-col items-center p-5 sm:p-7 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs">
          {/* 模式切换：保留 3D 铜钱入口，新增黑白手录入口 */}
          <div className="w-full grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#F5F5F6] border border-[#E4E4E7] mb-5">
            <button
              type="button"
              onClick={() => setCastMode('coin')}
              className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-serif font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                castMode === 'coin'
                  ? 'bg-[#171717] text-white shadow-2xs'
                  : 'text-[#52525B] hover:text-[#171717]'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>{isEn ? '3D Coin Cast' : '铜钱摇卦'}</span>
            </button>
            <button
              type="button"
              onClick={() => setCastMode('manual')}
              className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-serif font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                castMode === 'manual'
                  ? 'bg-[#171717] text-white shadow-2xs'
                  : 'text-[#52525B] hover:text-[#171717]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{isEn ? 'Manual Entry' : '手录六爻'}</span>
            </button>
          </div>

          {castMode === 'coin' ? (
            <>
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
                <div className="absolute bottom-3 inset-x-6 h-6 rounded-full bg-black/5 blur-md pointer-events-none" />

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
                        <div className="w-full h-full rounded-full border border-[#8B6508]/60 flex items-center justify-center relative bg-[#C59B27]/90 shadow-inner">
                          <div className="w-6 h-6 sm:w-6.5 sm:h-6.5 bg-white border border-[#8B6508] shadow-inner" />

                          {isYinWordFace ? (
                            <>
                              <span className="absolute top-1 text-[9px] sm:text-[10px] font-serif font-black text-[#4A3B18]">乾</span>
                              <span className="absolute bottom-1 text-[9px] sm:text-[10px] font-serif font-black text-[#4A3B18]">隆</span>
                              <span className="absolute left-1 text-[9px] sm:text-[10px] font-serif font-black text-[#4A3B18]">通</span>
                              <span className="absolute right-1 text-[9px] sm:text-[10px] font-serif font-black text-[#4A3B18]">宝</span>
                            </>
                          ) : (
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

              <div className="h-6 flex items-center justify-center mt-2">
                <span className="text-xs font-mono text-[#52525B]">
                  {getCurrentCoinsFormula()}
                </span>
              </div>

              <div className="w-full mt-4 flex flex-col items-center gap-3">
                {currentLine < 6 ? (
                  <button
                    type="button"
                    onClick={handleCastNextLine}
                    disabled={isFlipping}
                    className="w-full sm:w-auto min-h-[44px] px-7 py-2.5 rounded-full bg-[#171717] hover:bg-[#333333] text-white font-serif text-xs tracking-wider transition-all cursor-pointer shadow-sm"
                  >
                    <span>
                      {isFlipping
                        ? isEn
                          ? 'Casting Coins...'
                          : '流转抛掷中...'
                        : isEn
                          ? `Cast Line ${currentLine + 1}`
                          : `掷第 ${currentLine + 1} 爻`}
                    </span>
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-serif text-[#171717] flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#171717]" />{' '}
                      {isEn ? 'Hexagram Cast Completed' : '六爻已排定'}
                    </span>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-serif bg-[#F5F5F6] hover:bg-[#E4E4E7] text-[#171717] transition-colors border border-[#E4E4E7] flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" /> {isEn ? 'Reset' : '重起'}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* 手录六爻交互区（黑白，适配手机端触控） */
            <form onSubmit={handleManualSubmit} className="w-full space-y-4">
              <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-2.5">
                <span className="font-serif font-semibold text-xs text-[#171717]">
                  {isEn ? 'Manual Line Entry (6/7/8/9)' : '手录六爻（6 / 7 / 8 / 9）'}
                </span>
                <span className="text-[11px] font-mono text-[#52525B]">
                  {isEn ? 'Line 1 → Line 6' : '自初爻至上爻'}
                </span>
              </div>

              {/* 快捷 6 位数输入 */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono text-[#52525B]">
                  {isEn
                    ? 'Quick Code (6 digits, bottom to top, e.g. 978678)'
                    : '快捷输入（自初爻至上爻 6 位数字，如 978678）'}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={manualText}
                  onChange={(e) => handleManualTextChange(e.target.value)}
                  placeholder="978678"
                  className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-[#F5F5F6] border border-[#8A8A91]/50 text-[#171717] font-mono text-sm tracking-widest focus:outline-hidden focus:border-[#171717]"
                />
              </div>

              {/* 逐爻四选一触控条（第 1 爻到第 6 爻） */}
              <div className="space-y-2">
                {[0, 1, 2, 3, 4, 5].map((idx) => {
                  const lineNum = idx + 1;
                  const selected = manualCodes[idx];
                  const posLabel = isEn
                    ? `L${lineNum}`
                    : lineNum === 1
                      ? '初爻'
                      : lineNum === 6
                        ? '上爻'
                        : `${lineNum}爻`;

                  return (
                    <div key={lineNum} className="flex items-center gap-2">
                      <span className="w-10 shrink-0 text-[11px] font-serif font-semibold text-[#171717]">
                        {posLabel}
                      </span>
                      <div className="flex-1 grid grid-cols-4 gap-1.5">
                        {LINE_OPTIONS.map((opt) => {
                          const isSelected = selected === opt.code;
                          return (
                            <button
                              key={opt.code}
                              type="button"
                              onClick={() => handleSelectManualLine(idx, opt.code)}
                              aria-pressed={isSelected}
                              className={`min-h-[42px] px-1 py-1.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center leading-tight ${
                                isSelected
                                  ? 'bg-[#171717] text-white border-[#171717]'
                                  : 'bg-[#F5F5F6] text-[#171717] border-[#E4E4E7] hover:border-[#8A8A91]'
                              }`}
                            >
                              <span className="font-mono text-xs font-bold">{opt.code}</span>
                              <span className="text-[10px] opacity-85">
                                {isEn ? opt.enLabel : `${opt.zhLabel}${opt.zhSymbol}`}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 可选日期与时刻（明示浏览器当地时区） */}
              <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] space-y-2.5">
                <label className="flex items-center justify-between gap-2 cursor-pointer select-none">
                  <span className="flex items-center gap-1.5 text-xs font-serif font-medium text-[#171717]">
                    <Calendar className="w-3.5 h-3.5 text-[#52525B]" />
                    <span>{isEn ? 'Custom Date & Time (Optional)' : '自选起卦日期时刻（可选）'}</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={useCustomTime}
                    onChange={(e) => handleToggleCustomTime(e.target.checked)}
                    className="w-4 h-4 accent-[#171717] cursor-pointer"
                  />
                </label>

                {useCustomTime ? (
                  <div className="space-y-2 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-mono text-[#52525B] mb-1">
                          {isEn ? 'Date (YYYY-MM-DD)' : '公历日期'}
                        </label>
                        <input
                          type="date"
                          value={customDateStr}
                          onChange={(e) => {
                            setCustomDateStr(e.target.value);
                            setManualError(null);
                          }}
                          className="w-full min-h-[40px] px-2.5 py-1.5 rounded-lg bg-white border border-[#8A8A91]/60 text-[#171717] font-mono text-sm focus:outline-hidden focus:border-[#171717]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-[#52525B] mb-1">
                          {isEn ? 'Time (Optional, HH:mm)' : '时刻（可选，默认 12:00）'}
                        </label>
                        <input
                          type="time"
                          value={customTimeStr}
                          onChange={(e) => {
                            setCustomTimeStr(e.target.value);
                            setManualError(null);
                          }}
                          className="w-full min-h-[40px] px-2.5 py-1.5 rounded-lg bg-white border border-[#8A8A91]/60 text-[#171717] font-mono text-sm focus:outline-hidden focus:border-[#171717]"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] font-mono text-[#52525B] leading-snug">
                      {isEn
                        ? `Local browser timezone: ${tzLabel || 'Local'}. Invalid calendar dates are rejected.`
                        : `按浏览器当地时区解析：${tzLabel || '当地时区'}；留空时刻则按 12:00 计，不存在日期将被拒绝。`}
                    </p>
                  </div>
                ) : (
                  <p className="text-[11px] font-mono text-[#71717A]">
                    {isEn
                      ? `Uses current local time (${tzLabel || 'Browser Local'}).`
                      : `当前默认使用实时当地时区（${tzLabel || '浏览器当地时区'}）。`}
                  </p>
                )}
              </div>

              {manualError && (
                <div
                  role="alert"
                  className="px-3 py-2.5 rounded-xl bg-[#F5F5F6] border border-[#171717] text-xs text-[#171717] flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{manualError}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 min-h-[44px] px-5 py-2.5 rounded-full bg-[#171717] hover:bg-[#333333] text-white font-serif text-xs tracking-wider transition-all cursor-pointer shadow-sm"
                >
                  {reading
                    ? isEn
                      ? 'Update Hexagram Chart'
                      : '重新排定卦象'
                    : isEn
                      ? 'Build Hexagram Chart'
                      : '生成纳甲排盘'}
                </button>
                {reading && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="min-h-[44px] px-3.5 py-2 rounded-full border border-[#8A8A91] bg-white hover:bg-[#F5F5F6] text-[#171717] text-xs font-serif flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Clear' : '清空'}</span>
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* 右侧：正统京房纳甲六爻排盘面板 */}
        <div
          ref={linesBoardRef}
          className="md:col-span-7 flex flex-col p-4 sm:p-6 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-4"
        >
          {/* 起卦时空提纲（保留核心月建五行、日辰五行、旬空，次要四柱/农历可折叠） */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] text-xs space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[#52525B] text-[11px] font-mono">
              <span className="flex items-center gap-1.5">
                <Clock size={12} />
                <span>
                  {activeTimeInfo?.solarDate ||
                    (isEn ? 'Loading chart time...' : '加载时空盘...')}
                </span>
              </span>
              <button
                type="button"
                onClick={() => setShowTimeDetails((v) => !v)}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-[#52525B] hover:text-[#171717] cursor-pointer"
              >
                <span>{isEn ? 'Pillars & Lunar' : '四柱与农历'}</span>
                {showTimeDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1.5 border-t border-[#E4E4E7] text-[#171717] font-mono">
              <span className="bg-[#171717] text-white px-2 py-0.5 rounded">
                {isEn
                  ? `Month: ${activeTimeInfo?.monthZhi ?? '--'} ${
                      activeTimeInfo?.monthZhi ? BRANCH_EN[activeTimeInfo.monthZhi] ?? '' : ''
                    } (${monthElement ? ELEMENT_EN[monthElement] : '--'})`
                  : `月建：${activeTimeInfo?.monthZhi ?? '--'}${monthElement ?? ''}`}
              </span>
              <span className="bg-[#171717] text-white px-2 py-0.5 rounded">
                {isEn
                  ? `Day: ${activeTimeInfo?.dayZhi ?? '--'} ${
                      activeTimeInfo?.dayZhi ? BRANCH_EN[activeTimeInfo.dayZhi] ?? '' : ''
                    } (${dayElement ? ELEMENT_EN[dayElement] : '--'})`
                  : `日辰：${activeTimeInfo?.dayZhi ?? '--'}${dayElement ?? ''}`}
              </span>
              <span className="bg-[#F4F4F5] border border-[#E4E4E7] px-2 py-0.5 rounded text-[#171717]">
                {isEn
                  ? `Void: ${activeTimeInfo ? formatBranchesEn(activeTimeInfo.xunKong) : '--'}`
                  : `旬空：${activeTimeInfo?.xunKong ?? '--'}`}
              </span>
            </div>

            {showTimeDetails && activeTimeInfo && (
              <div className="pt-2 border-t border-[#E4E4E7] text-[11px] font-mono text-[#52525B] space-y-1">
                <div>
                  {isEn
                    ? `Four Pillars: ${activeTimeInfo.yearGanzhi} · ${activeTimeInfo.monthGanzhi} · ${activeTimeInfo.dayGanzhi} · ${activeTimeInfo.timeGanzhi}`
                    : `四柱：${activeTimeInfo.yearGanzhi}年 ${activeTimeInfo.monthGanzhi}月 ${activeTimeInfo.dayGanzhi}日 ${activeTimeInfo.timeGanzhi}时`}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <span>
                    {isEn ? `Lunar: ${activeTimeInfo.lunarDate}` : `农历：${activeTimeInfo.lunarDate}`}
                  </span>
                  {tzLabel && (
                    <span>{isEn ? `Timezone: ${tzLabel}` : `时区：${tzLabel}`}</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 卦宫与本变卦名 Header */}
          {reading ? (
            <div className="space-y-2.5 pb-3 border-b border-[#E4E4E7]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg sm:text-xl font-serif font-black text-[#171717]">
                      {reading.primaryHexagram.symbol}{' '}
                      {isEn ? reading.primaryHexagram.nameEn : reading.primaryHexagram.nameZh}
                    </span>
                    {reading.najia && (
                      <span className="text-xs text-[#52525B] font-mono">
                        {isEn
                          ? `(${PALACE_EN[reading.najia.palace]} · ${ELEMENT_EN[reading.najia.palaceElement]})`
                          : `(${reading.najia.palace}宫${reading.najia.palaceElement})`}
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-[#71717A] font-serif">
                    {reading.transformedHexagram
                      ? isEn
                        ? '→'
                        : '之 ➔'
                      : isEn
                        ? '(Static)'
                        : '（六爻安静）'}
                  </span>

                  {reading.transformedHexagram && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg sm:text-xl font-serif font-black text-[#171717]">
                        {reading.transformedHexagram.symbol}{' '}
                        {isEn ? reading.transformedHexagram.nameEn : reading.transformedHexagram.nameZh}
                      </span>
                      {reading.najia?.transformedChart && (
                        <span className="text-xs text-[#52525B] font-mono">
                          {isEn
                            ? `(${PALACE_EN[reading.najia.transformedChart.palace]} · ${ELEMENT_EN[reading.najia.transformedChart.palaceElement]})`
                            : `(${reading.najia.transformedChart.palace}宫${reading.najia.transformedChart.palaceElement})`}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {reading.najia && (
                  <span className="text-[11px] font-mono text-[#52525B] bg-[#FAFAFA] border border-[#E4E4E7] px-2 py-0.5 rounded">
                    {isEn
                      ? `Shi L${reading.najia.shiIndex} · Ying L${reading.najia.yingIndex}`
                      : `世${reading.najia.shiIndex}爻 · 应${reading.najia.yingIndex}爻`}
                  </span>
                )}
              </div>

              {reading.najia && (
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#52525B] font-mono">
                  <span>
                    {isEn
                      ? `${PALACE_EN[reading.najia.palace]} Palace (${ELEMENT_EN[reading.najia.palaceElement]}) · ${
                          GENERATION_NAME_EN[reading.najia.generationName] ?? reading.najia.generationName
                        }`
                      : `本卦：${reading.najia.palace}宫【${reading.najia.palaceElement}】· ${reading.najia.generationName}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowHexDetails((v) => !v)}
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-[#52525B] hover:text-[#171717] cursor-pointer"
                  >
                    <span>{isEn ? 'Classical Text & Meta' : '卦辞与次要信息'}</span>
                    {showHexDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between pb-2 border-b border-[#E4E4E7]">
              <h4 className="font-serif font-bold text-xs text-[#171717]">
                {isEn ? 'Orthodox Najia Lines' : '正统纳甲六爻对照盘'}
              </h4>
              <span className="text-[11px] font-mono text-[#71717A]">
                {isEn ? 'Bottom (Line 1) to Top (Line 6)' : '自初爻至上爻'}
              </span>
            </div>
          )}

          {/* 6 爻正统对照排盘区（可横向滚动，保证移动端表头与爻行对齐不挤压） */}
          <div className="overflow-x-auto -mx-1 px-1">
            <div className={isEn ? 'min-w-[660px] space-y-2' : 'min-w-[540px] space-y-2'}>
              {/* 表头：本卦 vs 动变 vs 变卦 */}
              {reading && (
                <div
                  className={`grid gap-1 text-[11px] font-mono text-[#71717A] px-2 pb-1 border-b border-[#F4F4F5] ${
                    isEn
                      ? 'grid-cols-[88px_minmax(0,1fr)_52px_minmax(0,1fr)]'
                      : 'grid-cols-[54px_minmax(0,1fr)_48px_minmax(0,1fr)]'
                  }`}
                >
                  <div>{isEn ? 'Beast' : '六神'}</div>
                  <div className="flex items-center justify-between pr-2">
                    <span className="font-medium text-[#171717] truncate">
                      {isEn
                        ? `[Primary] ${reading.primaryHexagram.nameEn}`
                        : `【本卦】${reading.primaryHexagram.nameZh}`}
                    </span>
                    <span>{isEn ? 'Line / Tags' : '爻象 / 标记'}</span>
                  </div>
                  <div className="text-center font-medium">{isEn ? 'Move' : '动变'}</div>
                  <div className="flex items-center justify-between pl-2">
                    <span>{isEn ? 'Line' : '爻象'}</span>
                    <span className="font-medium text-[#171717] truncate">
                      {reading.transformedHexagram
                        ? isEn
                          ? `[Changed] ${reading.transformedHexagram.nameEn}`
                          : `【变卦】${reading.transformedHexagram.nameZh}`
                        : isEn
                          ? '[Static]'
                          : '【无变卦 · 纯静】'}
                    </span>
                  </div>
                </div>
              )}

              {/* 6 爻行（倒序排列：第 6 爻在最上，第 1 爻在最下） */}
              <div className="flex flex-col-reverse gap-2 my-1">
                {[1, 2, 3, 4, 5, 6].map((idx) => {
                  const lineData = lines.find((l) => l.lineIndex === idx);
                  const najiaDetail = reading?.najia?.lines.find((l) => l.lineIndex === idx);
                  const transformedDetail = reading?.najia?.transformedChart?.lines.find(
                    (l) => l.lineIndex === idx
                  );

                  const isXunKong = najiaDetail
                    ? (najiaDetail.isXunKong ??
                      (activeTimeInfo ? isBranchXunKong(najiaDetail.branch, activeTimeInfo.xunKong) : false))
                    : false;
                  const isYuePo = najiaDetail
                    ? (najiaDetail.isYuePo ??
                      (activeTimeInfo ? isBranchYuePo(najiaDetail.branch, activeTimeInfo.monthZhi) : false))
                    : false;

                  return (
                    <div
                      key={idx}
                      className={`grid items-center p-2 sm:p-2.5 rounded-xl border text-xs gap-1 transition-all ${
                        isEn
                          ? 'grid-cols-[88px_minmax(0,1fr)_52px_minmax(0,1fr)]'
                          : 'grid-cols-[54px_minmax(0,1fr)_48px_minmax(0,1fr)]'
                      } ${
                        lineData?.isChanging
                          ? 'bg-[#FAFAFA] border-[#171717]'
                          : 'bg-[#F5F5F6] border-[#E4E4E7]'
                      }`}
                    >
                      {/* 1. 六神 */}
                      <div className="font-mono text-[11px] font-medium text-[#171717] truncate">
                        {najiaDetail
                          ? isEn
                            ? SIX_BEAST_EN[najiaDetail.sixBeast]
                            : najiaDetail.sixBeast
                          : idx === 1
                            ? isEn
                              ? 'Beasts'
                              : '六神'
                            : '···'}
                      </div>

                      {/* 2. 本卦 6 爻信息 + 世应 + 旬空/月破可核对标记 */}
                      <div className="flex items-center justify-between gap-1.5 pr-2 border-r border-[#E4E4E7]/80 min-w-0">
                        <span className="font-serif text-[11px] text-[#52525B] shrink-0">
                          {lineData
                            ? isEn
                              ? `L${idx}`
                              : formatLineName(idx, lineData.isYang)
                            : isEn
                              ? `L${idx}`
                              : idx === 1
                                ? '初爻'
                                : idx === 6
                                  ? '上爻'
                                  : `${idx}爻`}
                        </span>

                        <span
                          className="font-serif text-[11px] text-[#171717] font-medium truncate"
                          title={
                            najiaDetail && isEn
                              ? `${formatLineNameEn(idx, najiaDetail.isYang)}: ${SIX_RELATIVE_EN[najiaDetail.relative]} · ${najiaDetail.branch} ${BRANCH_EN[najiaDetail.branch] ?? ''} (${ELEMENT_EN[najiaDetail.element]})`
                              : undefined
                          }
                        >
                          {najiaDetail
                            ? isEn
                              ? `${SIX_RELATIVE_EN[najiaDetail.relative]} ${BRANCH_EN[najiaDetail.branch] ?? najiaDetail.branch}·${ELEMENT_EN[najiaDetail.element]}`
                              : `${najiaDetail.relative} ${najiaDetail.branch}${najiaDetail.element}`
                            : '——'}
                        </span>

                        {/* 本卦爻画 */}
                        <div className="w-10 h-2 flex items-center justify-center shrink-0">
                          <div className="relative w-full h-full flex items-center justify-between">
                            {lineData ? (
                              lineData.isYang ? (
                                <div className="w-full h-full bg-[#171717] rounded-xs" />
                              ) : (
                                <>
                                  <div className="w-[calc(50%-2.5px)] h-full bg-[#171717] rounded-xs" />
                                  <div className="w-[calc(50%-2.5px)] h-full bg-[#171717] rounded-xs" />
                                </>
                              )
                            ) : (
                              <div className="w-full h-full border-b border-dashed border-[#171717]/30" />
                            )}
                          </div>
                        </div>

                        {/* 世应 + 旬空 + 月破可核对标记 */}
                        <div className="flex items-center gap-1 shrink-0">
                          {najiaDetail?.isShi && (
                            <span className="text-[10px] font-mono bg-[#171717] text-white px-1 py-0.2 rounded font-medium">
                              {isEn ? 'Shi' : '世'}
                            </span>
                          )}
                          {najiaDetail?.isYing && (
                            <span className="text-[10px] font-mono bg-[#E4E4E7] text-[#171717] px-1 py-0.2 rounded">
                              {isEn ? 'Ying' : '应'}
                            </span>
                          )}
                          {isXunKong && najiaDetail && (
                            <span
                              title={
                                isEn
                                  ? `Day Xun Kong (${activeTimeInfo?.xunKong ?? ''}) includes branch ${najiaDetail.branch}`
                                  : `日旬空地支（${activeTimeInfo?.xunKong ?? ''}）含本爻 ${najiaDetail.branch}`
                              }
                              className="text-[10px] font-mono border border-dashed border-[#52525B] bg-white text-[#171717] px-1 py-0.2 rounded"
                            >
                              {isEn ? 'Void' : '旬空'}
                            </span>
                          )}
                          {isYuePo && najiaDetail && (
                            <span
                              title={
                                isEn
                                  ? `Month branch ${activeTimeInfo?.monthZhi ?? ''} clashes branch ${najiaDetail.branch}`
                                  : `月建 ${activeTimeInfo?.monthZhi ?? ''} 六冲本爻 ${najiaDetail.branch}`
                              }
                              className="text-[10px] font-mono border border-[#171717] bg-[#171717]/10 text-[#171717] px-1 py-0.2 rounded font-medium"
                            >
                              {isEn ? 'Clash' : '月破'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 3. 中间动变通道 */}
                      <div className="flex items-center justify-center text-center">
                        {lineData?.isChanging ? (
                          <span className="text-[10px] font-mono text-[#171717] font-bold bg-white border border-[#171717] px-1 py-0.5 rounded">
                            {isEn
                              ? lineData.isYang
                                ? '○→'
                                : '✕→'
                              : lineData.isYang
                                ? '○动➔'
                                : '✕动➔'}
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-[#A1A1AA]">
                            {lineData ? (isEn ? 'Static' : '静') : isEn ? '—' : '待'}
                          </span>
                        )}
                      </div>

                      {/* 4. 变卦 6 爻信息 */}
                      <div className="flex items-center justify-between gap-1.5 pl-2 border-l border-[#E4E4E7]/80 min-w-0">
                        {transformedDetail ? (
                          <>
                            <div className="w-10 h-2 flex items-center justify-center shrink-0">
                              <div className="relative w-full h-full flex items-center justify-between">
                                {transformedDetail.isYang ? (
                                  <div
                                    className={`w-full h-full rounded-xs ${
                                      transformedDetail.isChanged ? 'bg-[#171717]' : 'bg-[#71717A]'
                                    }`}
                                  />
                                ) : (
                                  <>
                                    <div
                                      className={`w-[calc(50%-2.5px)] h-full rounded-xs ${
                                        transformedDetail.isChanged ? 'bg-[#171717]' : 'bg-[#71717A]'
                                      }`}
                                    />
                                    <div
                                      className={`w-[calc(50%-2.5px)] h-full rounded-xs ${
                                        transformedDetail.isChanged ? 'bg-[#171717]' : 'bg-[#71717A]'
                                      }`}
                                    />
                                  </>
                                )}
                              </div>
                            </div>

                            <span
                              className={`font-serif text-[11px] truncate ${
                                transformedDetail.isChanged ? 'text-[#171717] font-bold' : 'text-[#52525B]'
                              }`}
                            >
                              {isEn
                                ? `${SIX_RELATIVE_EN[transformedDetail.relative]} ${
                                    BRANCH_EN[transformedDetail.branch] ?? transformedDetail.branch
                                  }·${ELEMENT_EN[transformedDetail.element]}`
                                : `${transformedDetail.relative} ${transformedDetail.branch}${transformedDetail.element}`}
                            </span>

                            <span className="font-serif text-[11px] text-[#71717A] shrink-0">
                              {isEn ? `L${idx}` : transformedDetail.lineNameZh}
                            </span>
                          </>
                        ) : (
                          <div className="w-full text-center text-[10px] text-[#A1A1AA] font-mono">
                            {lineData ? (isEn ? '(Static · Unchanged)' : '（无动爻 · 守静）') : '···'}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 可折叠次要详情：文王序、上下卦、卦辞、大象传与变卦详情 */}
          {reading && showHexDetails && (
            <div className="pt-3 border-t border-[#E4E4E7] space-y-3 animate-in fade-in">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-[#52525B]">
                <span className="bg-[#FAFAFA] border border-[#E4E4E7] px-2 py-0.5 rounded">
                  {isEn
                    ? `King Wen #${reading.primaryHexagram.number}`
                    : `文王序第 ${reading.primaryHexagram.number} 卦`}
                </span>
                {reading.transformedHexagram && reading.najia?.transformedChart && (
                  <span className="bg-[#FAFAFA] border border-[#E4E4E7] px-2 py-0.5 rounded">
                    {isEn
                      ? `Changed: King Wen #${reading.transformedHexagram.number} · ${PALACE_EN[reading.najia.transformedChart.palace]} Palace (${ELEMENT_EN[reading.najia.transformedChart.palaceElement]})`
                      : `变卦：第 ${reading.transformedHexagram.number} 卦 · ${reading.najia.transformedChart.palace}宫【${reading.najia.transformedChart.palaceElement}】· ${reading.najia.transformedChart.generationName}`}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-xs text-[#171717] flex items-center gap-1">
                      <span>
                        {isEn
                          ? `Primary: ${reading.primaryHexagram.nameEn}`
                          : `本卦：【${reading.primaryHexagram.nameZh}】`}
                      </span>
                      <span className="text-base">{reading.primaryHexagram.symbol}</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#71717A]">
                      {isEn
                        ? `${reading.primaryHexagram.upperTrigramEn} / ${reading.primaryHexagram.lowerTrigramEn}`
                        : `下${reading.primaryHexagram.lowerTrigram}上${reading.primaryHexagram.upperTrigram}`}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#52525B] leading-relaxed italic">
                    {isEn
                      ? reading.primaryHexagram.judgmentEn
                      : `卦辞：“${reading.primaryHexagram.judgmentZh}”`}
                  </p>
                  <p className="text-[10px] text-[#71717A] leading-relaxed">
                    {isEn
                      ? reading.primaryHexagram.imageEn
                      : `大象：“${reading.primaryHexagram.imageZh}”`}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] space-y-1.5">
                  {reading.transformedHexagram ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-xs text-[#171717] flex items-center gap-1">
                          <span>
                            {isEn
                              ? `Transformed: ${reading.transformedHexagram.nameEn}`
                              : `变卦：【${reading.transformedHexagram.nameZh}】`}
                          </span>
                          <span className="text-base">{reading.transformedHexagram.symbol}</span>
                        </span>
                        <span className="text-[10px] font-mono text-[#52525B]">
                          {isEn
                            ? `${reading.transformedHexagram.upperTrigramEn} / ${reading.transformedHexagram.lowerTrigramEn}`
                            : `下${reading.transformedHexagram.lowerTrigram}上${reading.transformedHexagram.upperTrigram}`}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#52525B] leading-relaxed italic">
                        {isEn
                          ? reading.transformedHexagram.judgmentEn
                          : `变卦卦辞：“${reading.transformedHexagram.judgmentZh}”`}
                      </p>
                      <p className="text-[10px] text-[#71717A] leading-relaxed">
                        {isEn
                          ? reading.transformedHexagram.imageEn
                          : `变卦大象：“${reading.transformedHexagram.imageZh}”`}
                      </p>
                    </>
                  ) : (
                    <div className="h-full flex flex-col justify-center text-center py-2 space-y-1">
                      <span className="font-serif font-medium text-xs text-[#171717]">
                        {isEn ? 'All Lines Static · Unchanged' : '六爻安静 · 纯守本卦'}
                      </span>
                      <p className="text-[11px] text-[#71717A] leading-relaxed">
                        {isEn
                          ? 'No Old Yang (9) or Old Yin (6) moving lines are present.'
                          : '此卦无老阳（9）老阴（6）发动，无变卦。'}
                      </p>
                    </div>
                  )}
                </div>
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
                    ? isEn
                      ? 'Consulting Lines & Moon/Day...'
                      : 'AI 正在依纳甲断爻...'
                    : isEn
                      ? 'Generate Comprehensive Reading'
                      : '让 AI 深度解卦'}
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
                ? 'Hexagram chart completed. Click the button above to generate a deep strategic reading with AI.'
                : '京房纳甲六爻已排定。点击上方按钮，让 AI 依据你叩问之事，结合时空提纲、日月旺衰、世应与动爻转化提供深层决策剖析。'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
