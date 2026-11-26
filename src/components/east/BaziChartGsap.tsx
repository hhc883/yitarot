'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  calculateBaZi,
  BaZiCalculationResult,
  BaZiYunSect,
  ELEMENT_ZH_MAP,
  ELEMENT_COLORS
} from '@/lib/metaphysics/bazi';
import { Sparkles, Compass, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { usePointsGate } from '@/components/site/PointsGateProvider';
import { MarkdownView } from '@/components/common/MarkdownView';
import { saveReading, getSavedReadings } from '@/lib/storage/reading-history';
import { renderLocalBaziFallback } from '@/lib/metaphysics/bazi-evidence';

gsap.registerPlugin(useGSAP);

const NAYIN_EN_MAP: Record<string, string> = {
  '海中金': 'Sea Metal',
  '炉中火': 'Furnace Fire',
  '大林木': 'Forest Wood',
  '路旁土': 'Roadside Earth',
  '剑锋金': 'Sword Edge Metal',
  '山头火': 'Mountaintop Fire',
  '涧下水': 'Stream Water',
  '城头土': 'City Wall Earth',
  '白蜡金': 'White Wax Metal',
  '杨柳木': 'Willow Wood',
  '泉中水': 'Spring Water',
  '屋上土': 'Rooftop Earth',
  '霹雳火': 'Thunderbolt Fire',
  '松柏木': 'Pine & Cypress Wood',
  '长流水': 'Flowing Stream Water',
  '沙中金': 'Sand Gold Metal',
  '山下火': 'Foot-hill Fire',
  '平地木': 'Plains Wood',
  '壁上土': 'Wall Earth',
  '金箔金': 'Gold Leaf Metal',
  '覆灯火': 'Lamp Fire',
  '天河水': 'Heavenly River Water',
  '大驿土': 'Post Station Earth',
  '钗钏金': 'Hairpin Metal',
  '桑柘木': 'Mulberry Wood',
  '大溪水': 'Great Torrent Water',
  '沙中土': 'Desert Sand Earth',
  '天上火': 'Heavenly Sun Fire',
  '石榴木': 'Pomegranate Wood',
  '大海水': 'Ocean Water'
};

interface BirthFormState {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
}

const DEFAULT_FORM: BirthFormState = {
  year: '1996',
  month: '8',
  day: '18',
  hour: '12',
  minute: '0'
};

function validateBirthForm(
  form: BirthFormState,
  gender: 'male' | 'female' | '',
  isEn: boolean
): { error: string | null; values?: { year: number; month: number; day: number; hour: number; minute: number; gender: 'male' | 'female' } } {
  const specs = [
    { key: 'year' as const, zh: '出生年份', en: 'Year', min: 1900, max: 2100 },
    { key: 'month' as const, zh: '月份', en: 'Month', min: 1, max: 12 },
    { key: 'day' as const, zh: '日期', en: 'Day', min: 1, max: 31 },
    { key: 'hour' as const, zh: '出生小时', en: 'Hour', min: 0, max: 23 },
    { key: 'minute' as const, zh: '出生分钟', en: 'Minute', min: 0, max: 59 }
  ];

  const parsed: Record<string, number> = {};
  for (const spec of specs) {
    const raw = form[spec.key].trim();
    const num = Number(raw);
    if (!/^\d+$/.test(raw) || !Number.isInteger(num) || num < spec.min || num > spec.max) {
      return {
        error: isEn
          ? `${spec.en}: please enter a whole number between ${spec.min} and ${spec.max}.`
          : `${spec.zh}请输入 ${spec.min} 至 ${spec.max} 之间的整数，缺少出生条件不作猜测。`
      };
    }
    parsed[spec.key] = num;
  }

  const checkDate = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day));
  if (
    checkDate.getUTCFullYear() !== parsed.year ||
    checkDate.getUTCMonth() !== parsed.month - 1 ||
    checkDate.getUTCDate() !== parsed.day
  ) {
    return {
      error: isEn
        ? 'The selected calendar date does not exist. Please check month and day.'
        : '该公历日期不存在，请核对出生年月与日期。'
    };
  }

  if (gender !== 'male' && gender !== 'female') {
    return {
      error: isEn
        ? 'Gender is required to compute DaYun (Major Luck Cycles).'
        : '请选择性别（乾造/坤造）以排盘与推算大运。'
    };
  }

  return {
    error: null,
    values: {
      year: parsed.year,
      month: parsed.month,
      day: parsed.day,
      hour: parsed.hour,
      minute: parsed.minute,
      gender
    }
  };
}

function getInitialSavedBaziReport(): string {
  if (typeof window === 'undefined') return '';
  const rawSessionId = new URLSearchParams(window.location.search).get('session_id');
  if (!rawSessionId) return '';
  const list = getSavedReadings();
  const found = list.find((r) => r.id === rawSessionId && r.type === 'bazi');
  return found?.fullContent || '';
}

export function BaziChartGsap({ lang = 'zh' }: { lang?: string }) {
  const isEn = lang === 'en';
  const containerRef = useRef<HTMLDivElement>(null);
  const chartBarsRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);

  // 表单状态（默认保持 1996-08-18 12:00，新增分钟输入默认 0）
  const [form, setForm] = useState<BirthFormState>(DEFAULT_FORM);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [yunSect, setYunSect] = useState<BaZiYunSect>(1);
  const [formError, setFormError] = useState<string | null>(null);
  const [showChartDetails, setShowChartDetails] = useState<boolean>(false);

  const [baziResult, setBaziResult] = useState<BaZiCalculationResult>(() =>
    calculateBaZi(1996, 8, 18, 12, 0, { gender: 'male', yunSect: 1 })
  );

  const [aiReport, setAiReport] = useState('');
  const [isHistoricalReport, setIsHistoricalReport] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const pointsGate = usePointsGate();
  const abortControllerRef = useRef<AbortController | null>(null);
  const requestSeqRef = useRef<number>(0);
  const shouldSaveReportRef = useRef<boolean>(false);

  useEffect(() => {
    const initialSequence = requestSeqRef.current;
    const frame = requestAnimationFrame(() => {
      if (requestSeqRef.current !== initialSequence) return;
      const savedReport = getInitialSavedBaziReport();
      if (savedReport) {
        setAiReport(savedReport);
        setIsHistoricalReport(true);
      }
    });
    return () => {
      cancelAnimationFrame(frame);
      requestSeqRef.current += 1;
      abortControllerRef.current?.abort();
    };
  }, []);

  const cancelPendingAiRequest = () => {
    requestSeqRef.current += 1;
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    shouldSaveReportRef.current = false;
    setIsGeneratingAi(false);
  };

  const handleFieldChange = (field: keyof BirthFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (formError) setFormError(null);
  };

  // 当输入变化时重新推演八字与大运
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (abortControllerRef.current) return;
    const checked = validateBirthForm(form, gender, isEn);
    if (checked.error || !checked.values) {
      setFormError(checked.error);
      return;
    }
    setFormError(null);
    cancelPendingAiRequest();
    const { year, month, day, hour, minute, gender: validGender } = checked.values;
    const res = calculateBaZi(year, month, day, hour, minute, {
      gender: validGender,
      yunSect
    });
    setBaziResult(res);
    setAiReport('');
    setIsHistoricalReport(false);
  };

  const handleSectChange = (nextSect: BaZiYunSect) => {
    if (abortControllerRef.current) return;
    setYunSect(nextSect);
    const checked = validateBirthForm(form, gender, isEn);
    if (!checked.error && checked.values) {
      cancelPendingAiRequest();
      const { year, month, day, hour, minute, gender: validGender } = checked.values;
      setBaziResult(
        calculateBaZi(year, month, day, hour, minute, {
          gender: validGender,
          yunSect: nextSect
        })
      );
      setAiReport('');
      setIsHistoricalReport(false);
    }
  };

  // GSAP 动画：四柱与五行能量条动态伸展
  useGSAP(() => {
    if (chartBarsRef.current) {
      const bars = chartBarsRef.current.querySelectorAll('.wuxing-bar');
      gsap.fromTo(
        bars,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out' }
      );
    }

    if (pillarsRef.current) {
      const pillarBoxes = pillarsRef.current.querySelectorAll('.pillar-box');
      gsap.fromTo(
        pillarBoxes,
        { y: 25, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, stagger: 0.08, duration: 0.6, ease: 'back.out(1.5)' }
      );
    }
  }, { dependencies: [baziResult], scope: containerRef });

  // 八字 AI 报告生成完成自动存入用户档案（仅保存完整新生成的报告，避免重复与残缺存档）
  useEffect(() => {
    if (shouldSaveReportRef.current && aiReport && !isGeneratingAi && baziResult) {
      shouldSaveReportRef.current = false;
      const yearGz = `${baziResult.pillars.year.gan}${baziResult.pillars.year.zhi}`;
      const monthGz = `${baziResult.pillars.month.gan}${baziResult.pillars.month.zhi}`;
      const dayGz = `${baziResult.pillars.day.gan}${baziResult.pillars.day.zhi}`;
      const { year, month, day, hour, minute } = baziResult.birthSolar;
      const hm = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      const chartGender = baziResult.yun?.gender ?? gender;

      saveReading({
        type: 'bazi',
        title: isEn
          ? `BaZi Natal Chart (${yearGz} ${monthGz} ${dayGz})`
          : `八字命理全息洞察（${yearGz}年 ${monthGz}月 ${dayGz}日）`,
        question: isEn
          ? `Birth: ${year}-${month}-${day} ${hm} (${chartGender})`
          : `出生公历：${year}年${month}月${day}日 ${hm}（${chartGender === 'male' ? '乾造' : '坤造'}）`,
        summary: aiReport.slice(0, 140) + '...',
        fullContent: aiReport
      });
    }
  }, [aiReport, isGeneratingAi, baziResult, gender, isEn]);

  // 生成 AI 命理全息报告：先扣 10 积分（失败弹「积分不足」），再等待服务端循证校验完成
  const handleGenerateAiReport = async () => {
    if (abortControllerRef.current) return;

    const seq = ++requestSeqRef.current;
    const controller = new AbortController();
    abortControllerRef.current = controller;

    shouldSaveReportRef.current = false;
    setIsGeneratingAi(true);
    setAiReport('');
    setIsHistoricalReport(false);

    const chartSnapshot = baziResult;
    const { year, month, day, hour, minute } = chartSnapshot.birthSolar;
    const chartGender = chartSnapshot.yun?.gender ?? gender;
    const chartYunSect = chartSnapshot.yun?.sect ?? yunSect;
    let paid = false;

    try {
      const consumed = await pointsGate.consume('bazi');
      if (requestSeqRef.current !== seq || controller.signal.aborted) return;
      if (!consumed.ok) return;
      paid = true;

      const response = await fetch('/api/east/bazi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          year,
          month,
          day,
          hour,
          minute,
          gender: chartGender,
          yunSect: chartYunSect,
          lang,
          points_ref: consumed.ref_id
        })
      });

      if (response.status === 401 || response.status === 402 || response.status === 403 || response.status === 400) {
        // 未登录 / 积分不足 / 权限受限 / 参数错误：不降级本地引擎，避免绕过鉴权与计费
        return;
      }

      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let streamedText = '';
        let receivedDone = false;
        let streamError: string | null = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine.startsWith('data: ')) continue;
            const jsonStr = trimmedLine.slice(6).trim();
            if (jsonStr === '[DONE]') {
              receivedDone = true;
              break;
            }
            try {
              const data = JSON.parse(jsonStr) as { text?: string; error?: string };
              if (typeof data.error === 'string' && data.error.length > 0) {
                streamError = data.error;
                break;
              }
              if (typeof data.text === 'string' && data.text.length > 0) {
                streamedText += data.text;
              }
            } catch {
              streamError = 'Malformed SSE chunk';
              break;
            }
          }

          if (receivedDone || streamError) break;
        }

        if (requestSeqRef.current !== seq) return;

        if (receivedDone && !streamError && streamedText.trim().length > 0) {
          shouldSaveReportRef.current = true;
          setAiReport(streamedText);
          return;
        }

        throw new Error(streamError || 'Incomplete SSE stream');
      }

      throw new Error(`API unavailable (${response.status})`);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      if (requestSeqRef.current !== seq) return;
      if (!paid) return;

      // 已授权但传输失败时，使用共享确定性循证降级报告（无定时器、无固定套话）
      const fallbackReport = renderLocalBaziFallback(chartSnapshot, {
        lang: isEn ? 'en' : 'zh'
      });
      shouldSaveReportRef.current = true;
      setAiReport(fallbackReport);
    } finally {
      if (requestSeqRef.current === seq) {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
        setIsGeneratingAi(false);
      }
    }
  };

  const formattedBirthTime = `${String(baziResult.birthSolar.hour).padStart(2, '0')}:${String(
    baziResult.birthSolar.minute
  ).padStart(2, '0')}`;

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* 出生信息输入表单 */}
      <div className="w-full rounded-sm bg-white border border-[#E4E4E7] p-5 sm:p-6 mb-8">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="font-serif text-[16px] sm:text-[17px] font-normal text-[#171717]">
            {isEn ? 'Four Pillars (BaZi)' : '生辰八字'}
          </h2>
          <span className="text-[12px] text-[#52525B]">
            {isEn
              ? `Solar: ${baziResult.birthSolar.year}-${String(baziResult.birthSolar.month).padStart(2, '0')}-${String(baziResult.birthSolar.day).padStart(2, '0')} ${formattedBirthTime} · Zodiac [${baziResult.zodiacSignEn}]`
              : `农历：${baziResult.lunarString} · ${formattedBirthTime} · 生肖【${baziResult.zodiacSignZh}】`}
          </span>
        </div>

        <form onSubmit={handleCalculate} noValidate className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          <div>
            <label htmlFor="bazi-year" className="block text-[11px] font-medium text-[#52525B] mb-1">
              {isEn ? 'Year' : '出生年份'}
            </label>
            <input
              id="bazi-year"
              type="number"
              value={form.year}
              onChange={e => handleFieldChange('year', e.target.value)}
              min={1900}
              max={2100}
              className="w-full min-h-[40px] px-3 py-2 rounded-sm bg-[#F5F5F6] border border-[#E4E4E7] text-[13px] text-[#171717] transition-colors focus:bg-white focus:border-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
            />
          </div>

          <div>
            <label htmlFor="bazi-month" className="block text-[11px] font-medium text-[#52525B] mb-1">
              {isEn ? 'Month' : '月份'}
            </label>
            <input
              id="bazi-month"
              type="number"
              value={form.month}
              onChange={e => handleFieldChange('month', e.target.value)}
              min={1}
              max={12}
              className="w-full min-h-[40px] px-3 py-2 rounded-sm bg-[#F5F5F6] border border-[#E4E4E7] text-[13px] text-[#171717] transition-colors focus:bg-white focus:border-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
            />
          </div>

          <div>
            <label htmlFor="bazi-day" className="block text-[11px] font-medium text-[#52525B] mb-1">
              {isEn ? 'Day' : '日期'}
            </label>
            <input
              id="bazi-day"
              type="number"
              value={form.day}
              onChange={e => handleFieldChange('day', e.target.value)}
              min={1}
              max={31}
              className="w-full min-h-[40px] px-3 py-2 rounded-sm bg-[#F5F5F6] border border-[#E4E4E7] text-[13px] text-[#171717] transition-colors focus:bg-white focus:border-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
            />
          </div>

          <div>
            <label htmlFor="bazi-hour" className="block text-[11px] font-medium text-[#52525B] mb-1">
              {isEn ? 'Hour (0-23)' : '小时（0-23）'}
            </label>
            <input
              id="bazi-hour"
              type="number"
              value={form.hour}
              onChange={e => handleFieldChange('hour', e.target.value)}
              min={0}
              max={23}
              className="w-full min-h-[40px] px-3 py-2 rounded-sm bg-[#F5F5F6] border border-[#E4E4E7] text-[13px] text-[#171717] transition-colors focus:bg-white focus:border-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
            />
          </div>

          <div>
            <label htmlFor="bazi-minute" className="block text-[11px] font-medium text-[#52525B] mb-1">
              {isEn ? 'Minute (0-59)' : '分钟（0-59）'}
            </label>
            <input
              id="bazi-minute"
              type="number"
              value={form.minute}
              onChange={e => handleFieldChange('minute', e.target.value)}
              min={0}
              max={59}
              className="w-full min-h-[40px] px-3 py-2 rounded-sm bg-[#F5F5F6] border border-[#E4E4E7] text-[13px] text-[#171717] transition-colors focus:bg-white focus:border-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <span className="block text-[11px] font-medium text-[#52525B] mb-1">
              {isEn ? 'Gender' : '性别'}
            </span>
            <div className="flex gap-1.5 h-10">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`flex-1 rounded-sm text-[12px] font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] ${
                  gender === 'male'
                    ? 'bg-[#171717] text-white border border-[#171717]'
                    : 'bg-[#F5F5F6] text-[#52525B] border border-[#E4E4E7] hover:bg-[#E4E4E7] hover:text-[#171717]'
                }`}
              >
                {isEn ? 'Male' : '乾造'}
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`flex-1 rounded-sm text-[12px] font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] ${
                  gender === 'female'
                    ? 'bg-[#171717] text-white border border-[#171717]'
                    : 'bg-[#F5F5F6] text-[#52525B] border border-[#E4E4E7] hover:bg-[#E4E4E7] hover:text-[#171717]'
                }`}
              >
                {isEn ? 'Female' : '坤造'}
              </button>
            </div>
          </div>

          {formError && (
            <p
              role="alert"
              className="col-span-2 sm:col-span-6 border-l-2 border-[#171717] pl-3 py-1 text-[12px] font-medium text-[#171717]"
            >
              {formError}
            </p>
          )}

          <div className="col-span-2 sm:col-span-6 pt-2">
            <button
              type="submit"
              disabled={isGeneratingAi}
              className="w-full min-h-[44px] rounded-sm bg-[#171717] hover:bg-[#333333] text-white text-[14px] font-medium tracking-wide transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
            >
              <span>{isEn ? 'Calculate BaZi Chart' : '开始排盘'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 四柱八字盘面与藏干十神可展开核对 */}
      <div className="w-full mb-8">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="text-[12px] text-[#52525B]">
            {isEn
              ? `Day Master (日主): ${baziResult.dayMaster.stem} · ${baziResult.dayMaster.nameEn}`
              : `日主（元神）：${baziResult.dayMaster.stem} · ${baziResult.dayMaster.nameZh}`}
          </div>
          <button
            type="button"
            aria-expanded={showChartDetails}
            onClick={() => setShowChartDetails(prev => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-[#E4E4E7] bg-white hover:bg-[#F5F5F6] text-[12px] font-medium text-[#171717] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
          >
            {showChartDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>
              {showChartDetails
                ? isEn
                  ? 'Hide Hidden Stems & Ten Gods'
                  : '收起藏干与十神核对'
                : isEn
                ? 'Inspect Hidden Stems & Ten Gods'
                : '展开藏干与十神核对'}
            </span>
          </button>
        </div>

        <div ref={pillarsRef} className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              label: isEn ? 'Year Pillar · Ancestry' : '年柱 · 祖荫',
              p: baziResult.pillars.year
            },
            {
              label: isEn ? 'Month Pillar · Season' : '月柱 · 提纲',
              p: baziResult.pillars.month
            },
            {
              label: isEn ? 'Day Pillar · Day Master' : '日柱 · 日主',
              p: baziResult.pillars.day,
              isSelf: true
            },
            {
              label: isEn ? 'Hour Pillar · Legacy' : '时柱 · 归宿',
              p: baziResult.pillars.hour
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`pillar-box p-3.5 sm:p-4 rounded-sm text-center flex flex-col justify-between transition-colors ${
                item.isSelf
                  ? 'border-2 border-[#171717] bg-[#F5F5F6]/50'
                  : 'border border-[#E4E4E7] bg-white'
              }`}
            >
              <div>
                <span className="text-[11px] font-medium text-[#52525B] block mb-1.5">
                  {item.label}
                </span>

                {/* 天干十神 / 日主标识 */}
                <div className="mb-1.5">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-sm text-[11px] font-medium ${
                      item.isSelf
                        ? 'bg-[#171717] text-white'
                        : 'bg-[#F5F5F6] text-[#171717] border border-[#E4E4E7]'
                    }`}
                  >
                    {item.isSelf
                      ? isEn
                        ? 'Day Master (日主)'
                        : '日主'
                      : isEn
                      ? `${item.p.ganShiShenEn} (${item.p.ganShiShenZh})`
                      : item.p.ganShiShenZh}
                  </span>
                </div>

                {/* 天干 */}
                <div className="text-3xl font-serif font-normal text-[#171717] mb-1">
                  {item.p.gan}
                </div>
                <span className="text-[11px] text-[#52525B] font-mono block mb-2">
                  {isEn
                    ? `${item.p.ganInfo.element} · ${item.p.ganInfo.archetypeEn}`
                    : `${ELEMENT_ZH_MAP[item.p.ganInfo.element]} · ${item.p.ganInfo.archetypeZh}`}
                </span>

                {/* 地支 */}
                <div className="text-3xl font-serif font-normal text-[#171717] mb-1">
                  {item.p.zhi}
                </div>
                <span className="text-[11px] text-[#52525B] block">
                  {isEn ? `Zodiac: ${item.p.zhiInfo.animalEn}` : `生肖：${item.p.zhiInfo.animalZh}`}
                </span>
              </div>

              {showChartDetails && (
                <div className="mt-3 pt-2.5 border-t border-[#E4E4E7] text-left space-y-1.5 text-[11px] text-[#171717]">
                  <div className="font-medium text-[#52525B]">
                    {isEn ? 'Hidden Stems & Ten Gods:' : '地支藏干与十神：'}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {item.p.hiddenStems.map((hs, hIdx) => (
                      <span
                        key={`${hs.gan}-${hIdx}`}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-[#F5F5F6] border border-[#E4E4E7] text-[11px]"
                      >
                        <span className="font-serif font-medium">{hs.gan}</span>
                        <span className="text-[#52525B]">
                          {isEn ? `${hs.shiShenEn}` : hs.shiShenZh}
                        </span>
                      </span>
                    ))}
                  </div>
                  <div className="text-[#52525B] pt-0.5">
                    {isEn
                      ? `Stage: ${item.p.diShi} · Void: ${item.p.xunKong}`
                      : `十二长生：${item.p.diShi} · 空亡：${item.p.xunKong}`}
                  </div>
                </div>
              )}

              <div className="mt-3 pt-2 border-t border-[#E4E4E7] text-[11px] text-[#52525B]">
                {isEn ? `Sound: ${NAYIN_EN_MAP[item.p.naYin] || item.p.naYin}` : `纳音：${item.p.naYin}`}
              </div>
            </div>
          ))}
        </div>

        {(showChartDetails || baziResult.birthSolar.hour === 23) && (
          <p className="mt-3 text-[11px] leading-relaxed text-[#52525B] bg-[#F5F5F6] border border-[#E4E4E7] rounded-sm px-3 py-2">
            {isEn ? baziResult.ziHourRuleEn : baziResult.ziHourRuleZh}
          </p>
        )}
      </div>

      {/* 大运排盘与起运口径 */}
      <div className="w-full rounded-sm bg-white border border-[#E4E4E7] p-5 sm:p-6 mb-8 text-left">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#171717]" />
            <h2 className="font-serif text-[17px] sm:text-[18px] font-normal text-[#171717]">
              {isEn ? 'Major Luck Cycles (DaYun)' : '大运排盘与起运推算'}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-[#52525B] mr-1">{isEn ? 'Caliber:' : '起运口径：'}</span>
            {([1, 2] as const).map((s) => (
              <button
                key={s}
                type="button"
                disabled={isGeneratingAi}
                onClick={() => handleSectChange(s)}
                className={`px-2.5 py-1 rounded-sm border transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] ${
                  yunSect === s
                    ? 'bg-[#171717] text-white border-[#171717]'
                    : 'bg-[#F5F5F6] text-[#52525B] border-[#E4E4E7] hover:text-[#171717]'
                }`}
              >
                {s === 1
                  ? isEn
                    ? '3 Days = 1 Yr (sect=1)'
                    : '三天折一年 (sect=1)'
                  : isEn
                  ? 'Exact Minutes (sect=2)'
                  : '节气分钟 (sect=2)'}
              </button>
            ))}
          </div>
        </div>

        {baziResult.yun ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-sm bg-[#F5F5F6] border border-[#E4E4E7] mb-4 text-[12px]">
              <div>
                <span className="text-[#52525B] block text-[11px]">
                  {isEn ? 'Luck Start Offset' : '起运岁月'}
                </span>
                <span className="font-medium text-[#171717]">
                  {isEn
                    ? `${baziResult.yun.startYearOffset}y ${baziResult.yun.startMonthOffset}m ${baziResult.yun.startDayOffset}d${
                        baziResult.yun.startHourOffset > 0 ? ` ${baziResult.yun.startHourOffset}h` : ''
                      } after birth`
                    : `出生后 ${baziResult.yun.startYearOffset} 年 ${baziResult.yun.startMonthOffset} 个月 ${baziResult.yun.startDayOffset} 天${
                        baziResult.yun.startHourOffset > 0 ? ` ${baziResult.yun.startHourOffset} 小时` : ''
                      }`}
                </span>
              </div>
              <div>
                <span className="text-[#52525B] block text-[11px]">
                  {isEn ? 'Solar Start Date' : '起运交大运公历'}
                </span>
                <span className="font-medium font-mono text-[#171717]">
                  {baziResult.yun.startSolarYmd}
                </span>
              </div>
              <div>
                <span className="text-[#52525B] block text-[11px]">
                  {isEn ? 'Cycle Direction' : '排盘顺逆'}
                </span>
                <span className="font-medium text-[#171717]">
                  {isEn
                    ? `${baziResult.yun.directionEn} (${baziResult.yun.gender === 'male' ? 'Male' : 'Female'})`
                    : `${baziResult.yun.directionZh}（${baziResult.yun.gender === 'male' ? '乾造' : '坤造'}）`}
                </span>
              </div>
            </div>

            {baziResult.yun.preLuck && (
              <p className="text-[11px] text-[#52525B] mb-3">
                {isEn
                  ? `Pre-DaYun period: ages ${baziResult.yun.preLuck.startAge}–${baziResult.yun.preLuck.endAge} (${baziResult.yun.preLuck.startYear}–${baziResult.yun.preLuck.endYear})`
                  : `起运前阶段：虚岁 ${baziResult.yun.preLuck.startAge}–${baziResult.yun.preLuck.endAge} 岁（${baziResult.yun.preLuck.startYear}–${baziResult.yun.preLuck.endYear}）`}
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {baziResult.yun.steps.map((step) => (
                <div
                  key={step.index}
                  className="p-3 rounded-sm border border-[#E4E4E7] bg-white text-center flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] text-[#52525B] block">
                      {isEn ? `Step ${step.index}` : `第 ${step.index} 步`}
                    </span>
                    <div className="text-xl font-serif text-[#171717] mt-0.5">
                      {step.ganZhi}
                    </div>
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded-sm bg-[#F5F5F6] border border-[#E4E4E7] text-[10px] text-[#171717]">
                      {isEn ? step.ganShiShenEn : step.ganShiShenZh}
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-[#E4E4E7] text-[11px] tabular-nums text-[#52525B]">
                    <span className="block font-medium text-[#171717]">
                      {isEn ? `Age ${step.startAge}–${step.endAge}` : `${step.startAge}–${step.endAge} 岁`}
                    </span>
                    <span className="block text-[10px]">
                      {step.startYear}–{step.endYear}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-1 text-[11px] leading-relaxed text-[#52525B] border-t border-[#E4E4E7] pt-3">
              <p>{isEn ? baziResult.yun.sectNoteEn : baziResult.yun.sectNoteZh}</p>
              <p>{isEn ? baziResult.yun.ageCaliberEn : baziResult.yun.ageCaliberZh}</p>
            </div>
          </>
        ) : (
          <div className="py-4 px-3 rounded-sm bg-[#F5F5F6] border border-[#E4E4E7] text-[12px] text-[#52525B]">
            {isEn
              ? 'Birth date, time, and gender are required; DaYun is never guessed when birth conditions are missing.'
              : '缺少完整出生日期、时分或性别条件时不作大运猜测。'}
          </div>
        )}
      </div>

      {/* 八个表层字五行分布统计（明确非旺衰与喜用神） */}
      <div className="w-full rounded-sm bg-white border border-[#E4E4E7] p-5 sm:p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#171717]" />
            <h2 className="font-serif text-[17px] sm:text-[18px] font-normal text-[#171717]">
              {isEn ? 'Surface Five Elements Count (8 Characters)' : '八字表层五行分布（四柱八个字统计）'}
            </h2>
          </div>
          <span className="text-[12px] text-[#52525B]">
            {isEn
              ? '4 Stems + 4 Branches only · Not YongShen'
              : '仅统计 4 天干 + 4 地支共 8 字 · 非喜用神结论'}
          </span>
        </div>

        <div ref={chartBarsRef} className="space-y-3">
          {baziResult.fiveElements.map((el, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-3 text-xs">
              <span className="w-20 sm:w-24 font-medium text-[#171717] shrink-0 text-left tabular-nums">
                {isEn ? el.element : el.elementZh} ({el.count}/8)
              </span>
              <div className="flex-1 h-3 bg-[#F5F5F6] border border-[#E4E4E7] rounded-sm overflow-hidden p-0.5">
                <div
                  className="wuxing-bar h-full rounded-sm transition-all"
                  style={{
                    width: `${el.percentage}%`,
                    backgroundColor: ELEMENT_COLORS[el.element] || '#059669'
                  }}
                />
              </div>
              <span className="w-10 text-right font-mono text-[12px] text-[#52525B] shrink-0">
                {el.percentage}%
              </span>
            </div>
          ))}
        </div>

        <p className="mt-4 pt-3 border-t border-[#E4E4E7] text-left text-[11px] leading-relaxed text-[#52525B]">
          {isEn ? baziResult.surfaceElementsNoteEn : baziResult.surfaceElementsNoteZh}
        </p>
      </div>

      {/* 八字命盘依据报告 */}
      <div className="w-full rounded-sm bg-white border border-[#E4E4E7] p-5 sm:p-6 text-left">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="inline-block px-2 py-0.5 rounded-sm text-[11px] font-medium bg-[#F5F5F6] text-[#52525B] border border-[#E4E4E7] uppercase tracking-wider">
              AI Analysis
            </span>
            <h3 className="font-serif text-[18px] sm:text-[20px] font-normal text-[#171717] mt-1.5">
              {isEn ? 'BaZi Chart Evidence Report' : '八字命盘依据报告'}
            </h3>
          </div>

          <button
            onClick={handleGenerateAiReport}
            disabled={isGeneratingAi}
            className="min-h-[40px] px-5 py-2 rounded-sm bg-[#171717] hover:bg-[#333333] text-white text-[13px] font-medium flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>
              {isEn
                ? (isGeneratingAi ? 'Generating Chart Report...' : 'Generate AI Chart Report')
                : (isGeneratingAi ? '正在生成命盘报告...' : '生成 AI 命盘报告')}
            </span>
          </button>
        </div>

        {aiReport ? (
          <div className="border-t border-[#E4E4E7] pt-6 animate-in fade-in">
            {isHistoricalReport && (
              <div className="mb-4 px-3 py-2.5 rounded-sm bg-[#F5F5F6] border border-[#E4E4E7] text-[12px] leading-relaxed text-[#52525B]">
                <span className="font-medium text-[#171717] mr-1.5">
                  {isEn ? 'Saved report' : '历史报告'}
                </span>
                <span>
                  {isEn
                    ? 'Original saved BaZi report text. The chart above is the current separate chart and was not reconstructed because older saved data lacks chart and sect parameters.'
                    : '此为历史保存的原始八字报告正文；上方盘面为当前独立排盘结果，因旧存档缺少出生盘面与起运口径参数，不作反推还原。'}
                </span>
              </div>
            )}
            <MarkdownView
              content={aiReport}
              className="text-[13px] sm:text-[14px] leading-relaxed text-[#171717]"
            />
          </div>
        ) : (
          <div className="py-8 text-center text-[13px] text-[#52525B] border-t border-[#E4E4E7]">
            {isEn
              ? 'Click the button above to generate an AI report grounded in your verified Four Pillars, Day Master, Ten Gods, Hidden Stems, and DaYun cycles for structural reference only, with no guarantee or inference of life outcomes.'
              : '点击上方按钮，依据已核验的四柱、日主、十神、藏干与大运盘面信息生成 AI 参考报告；仅作命理结构参考，不作人生结果推断或保证。'}
          </div>
        )}
      </div>
    </div>
  );
}
