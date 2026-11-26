'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  divineMeihua,
  MEIHUA_TIME_MAX,
  MEIHUA_TIME_MIN,
  MEIHUA_SOURCES,
  type MeihuaDivinationResult,
  parseMeihuaBeijingTime
} from '@/lib/metaphysics/meihua';

const PRESET_DECISIONS_ZH = [
  '当前这笔重要的商业合作，是否应当果断推进？',
  '近期考虑跳槽或更换工作赛道，时机成熟吗？',
  '针对眼下这个投资项目，当下该跟进还是观望？',
  '我和他在相处上有阻滞，主动破冰沟通能否化解？',
  '接下来去异地出差或签署合同，能否一切顺利？'
];

const PRESET_DECISIONS_EN = [
  'Should I aggressively push forward with this key commercial deal?',
  'Is the timing right for changing my career path or seeking a new job?',
  'Should I commit capital now or maintain a watchful holding pattern?',
  'Will taking the initiative to break the ice resolve our communication block?',
  'Will my upcoming travel or contract signing proceed smoothly?'
];

export function MeihuaDecisionWidget({ lang = 'zh' }: { lang?: string }) {
  const isEn = lang === 'en';
  const presetList = isEn ? PRESET_DECISIONS_EN : PRESET_DECISIONS_ZH;

  const [question, setQuestion] = useState('');
  const [mode, setMode] = useState<'time' | 'numbers'>('time');
  const [customTime, setCustomTime] = useState('');
  const [numA, setNumA] = useState(3);
  const [numB, setNumB] = useState(7);
  const [numMoving, setNumMoving] = useState(2);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [result, setResult] = useState<MeihuaDivinationResult | null>(null);

  const handleUseCurrentTime = () => {
    setCustomTime('');
    if (errorMessage) setErrorMessage(null);
  };

  const handleCast = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      setErrorMessage(
        isEn
          ? 'Please enter your inquiry question before casting.'
          : '请输入或选择需要推演的决策问题。'
      );
      return;
    }

    if (mode === 'numbers') {
      if (
        !Number.isInteger(numA) ||
        !Number.isInteger(numB) ||
        !Number.isInteger(numMoving) ||
        numA <= 0 ||
        numB <= 0 ||
        numMoving <= 0
      ) {
        setErrorMessage(
          isEn
            ? 'Please enter positive integers for all three numbers.'
            : '请为上卦、下卦和动爻输入有效的正整数。'
        );
        return;
      }
    }

    let targetDate: Date | undefined;
    if (mode === 'time') {
      const trimmedTime = String(new FormData(e.currentTarget).get('beijingTime') ?? '').trim();
      if (trimmedTime) {
        const parsed = parseMeihuaBeijingTime(trimmedTime);
        if (!parsed) {
          setErrorMessage(
            isEn
              ? 'Please enter a valid Beijing time (UTC+08:00) between 1900 and 2100.'
              : '请输入 1900—2100 年间有效的北京时间（UTC+08:00）。'
          );
          return;
        }
        targetDate = parsed;
      } else {
        targetDate = new Date();
      }
    }

    try {
      setErrorMessage(null);
      const res = divineMeihua(
        trimmedQuestion,
        mode,
        mode === 'numbers' ? [numA, numB, numMoving] : undefined,
        targetDate
      );
      setResult(res);
    } catch {
      setErrorMessage(
        isEn
          ? 'Failed to generate divination result. Please adjust inputs and try again.'
          : '起卦推演出现异常，请检查数值后重试。'
      );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-zinc-900 px-2 sm:px-0">
      {/* 标题与简介 */}
      <header className="w-full text-center mb-8">
        <h1 className="font-serif font-semibold text-2xl sm:text-3xl text-zinc-900 tracking-tight">
          {isEn ? 'Meihua Yishu Reading' : '梅花易数推演'}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 mt-2 max-w-xl mx-auto leading-relaxed">
          {isEn
            ? 'Cast a hexagram and compare how its primary, nuclear and transformed trigrams relate to Body (Ti).'
            : '起卦后，查看本卦、互卦和变卦如何与体卦生克，并核对典籍出处。'}
        </p>
      </header>

      {/* 提问与起卦方式输入 */}
      <section
        aria-labelledby="meihua-input-heading"
        className="w-full rounded-xl bg-white border border-zinc-200 p-4 sm:p-6 mb-8"
      >
        <h2 id="meihua-input-heading" className="sr-only">
          {isEn ? 'Divination Setup' : '起卦设定'}
        </h2>

        <form onSubmit={handleCast} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="decision-question-input"
              className="block text-xs font-semibold text-zinc-800 mb-1.5"
            >
              {isEn ? 'Decision Inquiry' : '决策焦点'}
            </label>
            <input
              id="decision-question-input"
              type="text"
              value={question}
              onChange={e => {
                setQuestion(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder={
                isEn
                  ? 'Enter pending decision, contract, or strategy...'
                  : '输入当前面临的抉择、合作或动向...'
              }
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 border border-zinc-300 text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 focus:bg-white"
            />
          </div>

          {/* 常见预设决策速选 */}
          <div>
            <span className="block text-[11px] font-medium text-zinc-500 mb-1.5">
              {isEn ? 'Preset inquiries' : '预设参考'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presetList.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setQuestion(p);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="text-left text-xs px-2.5 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors border border-zinc-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-zinc-900"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* 起卦模式切换与提交 */}
          <div className="pt-3 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-zinc-600 mr-1">
                {isEn ? 'Method:' : '起卦方式：'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setMode('time');
                  if (errorMessage) setErrorMessage(null);
                }}
                aria-pressed={mode === 'time'}
                className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-zinc-900 ${
                  mode === 'time'
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                {isEn ? 'Time (Beijing)' : '时间起卦'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('numbers');
                  if (errorMessage) setErrorMessage(null);
                }}
                aria-pressed={mode === 'numbers'}
                className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-zinc-900 ${
                  mode === 'numbers'
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                {isEn ? 'Three Numbers (Site Rule)' : '三数起卦（站内规则）'}
              </button>
            </div>

            {mode === 'time' ? (
              <div className="flex items-center gap-2 flex-wrap">
                <label className="flex items-center gap-1.5 text-xs text-zinc-600">
                  <span>{isEn ? 'Beijing Time' : '北京时间'}</span>
                  <input
                    type="datetime-local"
                    name="beijingTime"
                    min={MEIHUA_TIME_MIN.slice(0, 16)}
                    max={MEIHUA_TIME_MAX.slice(0, 16)}
                    aria-label={isEn ? 'Beijing Time (UTC+08:00)' : '北京时间 (UTC+08:00)'}
                    value={customTime}
                    onChange={e => {
                      setCustomTime(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="px-2 py-1 rounded-md bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 tabular-nums focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleUseCurrentTime}
                  className="px-2.5 py-1 rounded-md text-xs border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 cursor-pointer focus:outline-none focus:ring-1 focus:ring-zinc-900"
                >
                  {isEn ? 'Current' : '当前时间'}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <label className="flex items-center gap-1 text-xs text-zinc-600">
                  <span>{isEn ? 'Upper' : '上'}</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    aria-label={isEn ? 'Upper Trigram Number' : '上卦数'}
                    value={numA}
                    onChange={e => setNumA(Number(e.target.value))}
                    className="w-14 px-2 py-1 rounded-md bg-zinc-50 border border-zinc-300 text-xs text-center text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"
                  />
                </label>
                <label className="flex items-center gap-1 text-xs text-zinc-600">
                  <span>{isEn ? 'Lower' : '下'}</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    aria-label={isEn ? 'Lower Trigram Number' : '下卦数'}
                    value={numB}
                    onChange={e => setNumB(Number(e.target.value))}
                    className="w-14 px-2 py-1 rounded-md bg-zinc-50 border border-zinc-300 text-xs text-center text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"
                  />
                </label>
                <label className="flex items-center gap-1 text-xs text-zinc-600">
                  <span>{isEn ? 'Line' : '动爻'}</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    aria-label={isEn ? 'Moving Line Number' : '动爻数'}
                    value={numMoving}
                    onChange={e => setNumMoving(Number(e.target.value))}
                    className="w-14 px-2 py-1 rounded-md bg-zinc-50 border border-zinc-300 text-xs text-center text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"
                  />
                </label>
              </div>
            )}

            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium tracking-wide transition-colors cursor-pointer border border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1"
            >
              {isEn ? 'Cast Hexagram' : '排卦推演'}
            </button>
          </div>
        </form>

        {/* 错误状态 */}
        {errorMessage && (
          <div
            role="alert"
            className="mt-4 p-3 rounded-lg border border-zinc-300 bg-zinc-100 text-zinc-800 text-xs"
          >
            {errorMessage}
          </div>
        )}
      </section>

      {/* 结果状态 / 空状态 */}
      {!result ? (
        <section
          aria-label={isEn ? 'Divination Status' : '推演状态'}
          className="w-full rounded-xl bg-white border border-zinc-200 p-8 text-center text-zinc-500 text-xs sm:text-sm"
        >
          {isEn
            ? 'No hexagram cast yet. Enter an inquiry and select Cast Hexagram.'
            : '尚未排定卦象。请输入决策问题后点击“排卦推演”。'}
        </section>
      ) : (
        <>
          {/* 卦象推演三联 (本卦 · 互卦 · 变卦) */}
          <section
            aria-labelledby="hexagram-cards-heading"
            className="w-full mb-8"
          >
            <h2 id="hexagram-cards-heading" className="sr-only">
              {isEn ? 'Hexagram Breakdown' : '卦象解析'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 本卦 */}
              <article className="rounded-xl bg-white border border-zinc-200 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-200">
                    <span className="text-xs font-semibold text-zinc-900">
                      {isEn ? 'Primary · Present' : '本卦 · 现状'}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-600">
                      {isEn
                        ? `Line ${result.movingLine}`
                        : `第 ${result.movingLine} 爻动`}
                    </span>
                  </div>

                  <div className="text-center my-4">
                    <div
                      aria-hidden="true"
                      className="text-3xl leading-none text-zinc-900 mb-1.5 font-serif"
                    >
                      {result.primaryHexagram.symbol}
                    </div>
                    <div className="font-serif font-bold text-xl sm:text-2xl text-zinc-900 mb-1">
                      {isEn
                        ? result.primaryHexagram.fullNameEn ||
                          result.primaryHexagram.fullNameZh
                        : result.primaryHexagram.fullNameZh}
                    </div>
                    <span className="text-xs text-zinc-600 block">
                      {isEn
                        ? `Upper [${result.primaryHexagram.upper.natureEn}] / Lower [${result.primaryHexagram.lower.natureEn}]`
                        : `上【${result.primaryHexagram.upper.nameZh}（${result.primaryHexagram.upper.natureZh}）】 / 下【${result.primaryHexagram.lower.nameZh}（${result.primaryHexagram.lower.natureZh}）】`}
                    </span>
                  </div>

                  {/* 体用标注 */}
                  <div className="space-y-1.5 pt-3 border-t border-zinc-200 text-xs">
                    <div className="flex justify-between items-center p-2 rounded-md bg-zinc-50 border border-zinc-100">
                      <span className="font-medium text-zinc-800">
                        {isEn ? 'Body (Self / Core)' : '体卦 (我方/主体)'}
                      </span>
                      <span className="text-zinc-600 font-mono">
                        {isEn
                          ? `${result.bodyTrigram.trigram.nameEn} · ${result.bodyTrigram.trigram.element}`
                          : `${result.bodyTrigram.trigram.nameZh} · ${result.bodyTrigram.trigram.elementZh}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-md bg-zinc-50 border border-zinc-100">
                      <span className="font-medium text-zinc-800">
                        {isEn
                          ? 'Application (External / Target)'
                          : '用卦 (对方/客体)'}
                      </span>
                      <span className="text-zinc-600 font-mono">
                        {isEn
                          ? `${result.applicationTrigram.trigram.nameEn} · ${result.applicationTrigram.trigram.element}`
                          : `${result.applicationTrigram.trigram.nameZh} · ${result.applicationTrigram.trigram.elementZh}`}
                      </span>
                    </div>
                  </div>
                </div>
              </article>

              {/* 互卦 */}
              <article className="rounded-xl bg-white border border-zinc-200 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-200">
                    <span className="text-xs font-semibold text-zinc-900">
                      {isEn ? 'Nuclear · Process' : '互卦 · 过程'}
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      {isEn ? 'Lines 2-5' : '二至五爻'}
                    </span>
                  </div>

                  <div className="text-center my-4">
                    {result.mutualHexagram.symbol && (
                      <div
                        aria-hidden="true"
                        className="text-2xl leading-none text-zinc-800 mb-1.5 font-serif"
                      >
                        {result.mutualHexagram.symbol}
                      </div>
                    )}
                    <div className="font-serif font-bold text-xl sm:text-2xl text-zinc-900 mb-1">
                      {isEn
                        ? result.mutualHexagram.fullNameEn ||
                          result.mutualHexagram.fullNameZh
                        : result.mutualHexagram.fullNameZh}
                    </div>
                    <span className="text-xs text-zinc-600 block">
                      {isEn
                        ? `Upper [${result.mutualHexagram.upper.natureEn}] / Lower [${result.mutualHexagram.lower.natureEn}]`
                        : `上【${result.mutualHexagram.upper.nameZh}】 / 下【${result.mutualHexagram.lower.nameZh}】`}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-600 leading-relaxed pt-3 border-t border-zinc-200">
                    {isEn
                      ? result.mutualHexagram.summaryEn ||
                        result.mutualHexagram.summaryZh
                      : result.mutualHexagram.summaryZh}
                  </p>
                </div>
              </article>

              {/* 变卦 */}
              <article className="rounded-xl bg-white border border-zinc-200 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-200">
                    <span className="text-xs font-semibold text-zinc-900">
                      {isEn ? 'Transformed · Moving Line' : '变卦 · 动爻变化'}
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      {isEn ? 'Line Shift' : '动爻生变'}
                    </span>
                  </div>

                  <div className="text-center my-4">
                    {result.transformedHexagram.symbol && (
                      <div
                        aria-hidden="true"
                        className="text-2xl leading-none text-zinc-800 mb-1.5 font-serif"
                      >
                        {result.transformedHexagram.symbol}
                      </div>
                    )}
                    <div className="font-serif font-bold text-xl sm:text-2xl text-zinc-900 mb-1">
                      {isEn
                        ? result.transformedHexagram.fullNameEn ||
                          result.transformedHexagram.fullNameZh
                        : result.transformedHexagram.fullNameZh}
                    </div>
                    <span className="text-xs text-zinc-600 block">
                      {isEn
                        ? `New Application: ${result.transformedHexagram.changedApplication.nameEn} (${result.transformedHexagram.changedApplication.element})`
                        : `新用卦：${result.transformedHexagram.changedApplication.nameZh} (${result.transformedHexagram.changedApplication.elementZh})`}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-600 leading-relaxed pt-3 border-t border-zinc-200">
                    {isEn
                      ? result.transformedHexagram.summaryEn ||
                        result.transformedHexagram.summaryZh
                      : result.transformedHexagram.summaryZh}
                  </p>
                </div>
              </article>
            </div>

            {/* 起卦依据与取数余数（折叠说明） */}
            <details className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs text-zinc-700">
              <summary className="cursor-pointer font-medium text-zinc-900 select-none focus:outline-none focus:ring-1 focus:ring-zinc-900 rounded">
                {isEn
                  ? `Casting Basis · ${result.basis.methodEn}`
                  : `起卦依据 · ${result.basis.methodZh}`}
              </summary>
              <div className="mt-3 pt-3 border-t border-zinc-200 space-y-2 leading-relaxed">
                {result.basis.mode === 'time' ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px] text-zinc-800">
                      <div>
                        {isEn ? 'Input Time (UTC+08:00): ' : '输入北京时间：'}
                        {result.basis.beijingTime}
                      </div>
                      <div>
                        {isEn
                          ? `Lunar: ${result.basis.lunarYearGanZhi} Year (${result.basis.yearBranchEn} ${result.basis.yearBranchNum}) · M${result.basis.lunarMonth} · D${result.basis.lunarDay} · Hour ${result.basis.hourBranchEn} (${result.basis.hourBranchNum})`
                          : `农历：${result.basis.lunarYearGanZhi}年（年支${result.basis.yearBranch}序 ${result.basis.yearBranchNum}）· ${result.basis.lunarMonthZh}（${result.basis.lunarMonth}）· ${result.basis.lunarDayZh}（${result.basis.lunarDay}）· 时支${result.basis.hourBranch}（${result.basis.hourBranchNum}）`}
                      </div>
                    </div>
                    <div className="font-mono text-[11px] text-zinc-700">
                      {isEn
                        ? `Upper: (${result.basis.yearBranchNum} + ${result.basis.lunarMonth} + ${result.basis.lunarDay}) = ${result.basis.sumUpper} mod 8 = ${result.basis.remainders.upperRawMod} -> ${result.basis.remainders.upper} | Lower: (${result.basis.sumUpper} + ${result.basis.hourBranchNum}) = ${result.basis.sumLower} mod 8 = ${result.basis.remainders.lowerRawMod} -> ${result.basis.remainders.lower} | Moving: ${result.basis.sumLower} mod 6 = ${result.basis.remainders.movingRawMod} -> Line ${result.basis.remainders.moving}`
                        : `上卦：(${result.basis.yearBranchNum} + ${result.basis.lunarMonth} + ${result.basis.lunarDay}) = ${result.basis.sumUpper}，% 8 余 ${result.basis.remainders.upperRawMod} 取 ${result.basis.remainders.upper}｜下卦：(${result.basis.sumUpper} + ${result.basis.hourBranchNum}) = ${result.basis.sumLower}，% 8 余 ${result.basis.remainders.lowerRawMod} 取 ${result.basis.remainders.lower}｜动爻：${result.basis.sumLower} % 6 余 ${result.basis.remainders.movingRawMod} 取第 ${result.basis.remainders.moving} 爻`}
                    </div>
                  </>
                ) : (
                  <div className="font-mono text-[11px] text-zinc-800">
                    {isEn
                      ? `Input Numbers: [${result.basis.inputNumbers?.join(', ')}] | Upper: mod 8 = ${result.basis.remainders.upperRawMod} -> ${result.basis.remainders.upper} | Lower: mod 8 = ${result.basis.remainders.lowerRawMod} -> ${result.basis.remainders.lower} | Moving: mod 6 = ${result.basis.remainders.movingRawMod} -> Line ${result.basis.remainders.moving}`
                      : `输入三数：[${result.basis.inputNumbers?.join('、')}]｜上卦：% 8 余 ${result.basis.remainders.upperRawMod} 取 ${result.basis.remainders.upper}｜下卦：% 8 余 ${result.basis.remainders.lowerRawMod} 取 ${result.basis.remainders.lower}｜动爻：% 6 余 ${result.basis.remainders.movingRawMod} 取第 ${result.basis.remainders.moving} 爻`}
                  </div>
                )}
                <p className="text-zinc-600">
                  {isEn ? result.basis.conventionNoteEn : result.basis.conventionNoteZh}
                </p>
                {result.basis.mode === 'time' && (
                  <a href={MEIHUA_SOURCES['meihua.v1.time'].url} className="underline underline-offset-4">
                    {isEn ? 'Meihua Yishu Vol. 1 · Year-Month-Day-Hour Casting' : '《梅花易数》卷一 · 年月日时起例'}
                  </a>
                )}
              </div>
            </details>
          </section>

          {/* 体用互变五行生克对照（《梅花易数·卷二》） */}
          <section
            aria-labelledby="tiyong-comparison-heading"
            className="w-full rounded-xl bg-white border border-zinc-200 p-5 sm:p-6 mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-zinc-200 pb-4 mb-5">
              <div>
                <span className="text-[11px] text-zinc-500 uppercase tracking-wide block">
                  {isEn
                    ? 'Meihua Yishu Vol. 2 · Ti-Yong Stage Comparison'
                    : '《梅花易数·卷二》体用互变对照'}
                </span>
                <h3
                  id="tiyong-comparison-heading"
                  className="font-serif font-bold text-lg sm:text-xl text-zinc-900 mt-0.5"
                >
                  {isEn ? result.synthesis.headlineEn : result.synthesis.headlineZh}
                </h3>
                <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
                  {isEn ? result.synthesis.summaryEn : result.synthesis.summaryZh}
                </p>
              </div>
            </div>

            {/* 四重对照卡片：体 vs 本卦用 / 互之上 / 互之下 / 变之新用 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              {result.synthesis.comparisons.map(comp => (
                <article
                  key={comp.stage}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2.5 border-b border-zinc-200">
                      <span className="text-xs font-semibold text-zinc-900">
                        {isEn ? comp.stageLabelEn : comp.stageLabelZh}
                      </span>
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded border ${
                          comp.polarity === 'supportive'
                            ? 'bg-white text-zinc-900 border-zinc-300'
                            : 'bg-zinc-200/70 text-zinc-800 border-zinc-300'
                        }`}
                      >
                        {isEn ? comp.directionLabelEn : comp.directionLabelZh}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-zinc-800 bg-white border border-zinc-200 rounded px-2.5 py-2 mb-2.5">
                      {isEn
                        ? `Body: ${comp.body.nameEn || comp.body.nameZh} [${comp.body.element}] · Compared with: ${comp.target.nameEn || comp.target.nameZh} [${comp.target.element}]`
                        : `体：${comp.body.nameZh}（${comp.body.elementZh}）｜对照卦：${comp.target.nameZh}（${comp.target.elementZh}）`}
                    </div>

                    <p className="text-[11px] text-zinc-500 mb-1.5">
                      {isEn ? comp.stageRoleEn : comp.stageRoleZh}
                    </p>
                    <p className="text-xs text-zinc-700 leading-relaxed">
                      {isEn ? comp.ruleTextEn : comp.ruleTextZh}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-zinc-200 text-[11px] text-zinc-500">
                    <a
                      href={comp.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 hover:text-zinc-900"
                    >
                      {isEn
                        ? `${comp.source.bookEn} · ${comp.source.chapterEn}`
                        : `${comp.source.bookZh}·${comp.source.chapterZh}`}
                    </a>
                  </div>
                </article>
              ))}
            </div>

            {/* 典籍原文 */}
            <div className="pt-3 border-t border-zinc-200 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-zinc-600">
              <span className="font-medium text-zinc-800">
                {isEn ? 'Primary Text Chapters:' : '经典出处核对：'}
              </span>
              {result.synthesis.sources.map(src => (
                <a
                  key={src.id}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-zinc-900"
                >
                  {isEn ? `${src.bookEn} · ${src.chapterEn}` : `${src.bookZh}·${src.chapterZh}`}
                </a>
              ))}
            </div>
          </section>

          {/* 未评估条件与推断边界 */}
          <section
            aria-labelledby="meihua-assessments-heading"
            className="w-full rounded-xl bg-white border border-zinc-200 p-5 sm:p-6 mb-8"
          >
            <h3
              id="meihua-assessments-heading"
              className="text-xs font-semibold text-zinc-900 pb-2 mb-3 border-b border-zinc-200"
            >
              {isEn
                ? 'Unassessed Conditions & Inference Boundaries'
                : '未评估条件与推演范围说明'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200">
                <div className="font-semibold text-zinc-900 mb-1">
                  {isEn
                    ? result.assessments.seasonal.labelEn
                    : result.assessments.seasonal.labelZh}
                </div>
                <p className="text-zinc-600 leading-relaxed">
                  {isEn
                    ? result.assessments.seasonal.reasonEn
                    : result.assessments.seasonal.reasonZh}
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200">
                <div className="font-semibold text-zinc-900 mb-1">
                  {isEn
                    ? result.assessments.externalOmens.labelEn
                    : result.assessments.externalOmens.labelZh}
                </div>
                <p className="text-zinc-600 leading-relaxed">
                  {isEn
                    ? result.assessments.externalOmens.reasonEn
                    : result.assessments.externalOmens.reasonZh}
                </p>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-zinc-500 leading-relaxed">
              {isEn
                ? 'Scope note: This reading presents bounded five-element comparisons across Primary, Nuclear, and Transformed trigrams. It does not imply any timetable, guaranteed outcome, or legal/financial instruction.'
                : '范围说明：以上仅就本卦、互卦、变卦之体用五行生克作有界对照，不推算具体应期，亦不构成必然结果或签约/投资指令。'}
            </p>
          </section>

          {/* 《周易》经传原文参考（与梅花体用断法分列） */}
          <section
            aria-labelledby="iching-canon-heading"
            className="w-full rounded-xl bg-white border border-zinc-200 p-5 sm:p-6 mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-4 border-b border-zinc-200">
              <h3
                id="iching-canon-heading"
                className="text-xs font-semibold text-zinc-900"
              >
                {isEn
                  ? 'Zhou Yi Excerpts'
                  : '《周易》卦辞与大象摘录'}
              </h3>
              <a href="https://zh.wikisource.org/zh-hans/周易" className="text-[11px] text-zinc-600 underline underline-offset-4">
                {isEn ? 'Read the Zhou Yi (Chinese)' : '查阅《周易》'}
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1.5">
                <div className="font-semibold text-zinc-900">
                  {isEn
                    ? `Primary #${result.ichingCanon.primary.number}: ${result.ichingCanon.primary.nameEn} (${result.ichingCanon.primary.nameZh})`
                    : `本卦（第 ${result.ichingCanon.primary.number} 卦·${result.ichingCanon.primary.nameZh}）`}
                </div>
                <p className="text-zinc-700 leading-relaxed">
                  <strong className="text-zinc-900">{isEn ? 'Judgment: ' : '卦辞：'}</strong>
                  <span lang="zh">{result.ichingCanon.primary.judgmentZh}</span>
                </p>
                <p className="text-zinc-600 leading-relaxed">
                  <strong className="text-zinc-900">{isEn ? 'Great Image: ' : '大象传：'}</strong>
                  <span lang="zh">{result.ichingCanon.primary.imageZh}</span>
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1.5">
                <div className="font-semibold text-zinc-900">
                  {isEn
                    ? `Transformed #${result.ichingCanon.transformed.number}: ${result.ichingCanon.transformed.nameEn} (${result.ichingCanon.transformed.nameZh})`
                    : `变卦（第 ${result.ichingCanon.transformed.number} 卦·${result.ichingCanon.transformed.nameZh}）`}
                </div>
                <p className="text-zinc-700 leading-relaxed">
                  <strong className="text-zinc-900">{isEn ? 'Judgment: ' : '卦辞：'}</strong>
                  <span lang="zh">{result.ichingCanon.transformed.judgmentZh}</span>
                </p>
                <p className="text-zinc-600 leading-relaxed">
                  <strong className="text-zinc-900">{isEn ? 'Great Image: ' : '大象传：'}</strong>
                  <span lang="zh">{result.ichingCanon.transformed.imageZh}</span>
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-zinc-200 text-xs text-zinc-600">
              {result.ichingCanon.movingLineText ? (
                <p>
                  <strong className="text-zinc-900">
                    {isEn
                      ? `Moving Line ${result.ichingCanon.movingLineNumber}: `
                      : `第 ${result.ichingCanon.movingLineNumber} 爻爻辞：`}
                  </strong>
                  <span lang="zh">{result.ichingCanon.movingLineText}</span>
                </p>
              ) : (
                <p className="text-[11px] text-zinc-500">
                  {isEn
                    ? `The local reference does not include the text for moving line ${result.ichingCanon.movingLineNumber}.`
                    : `本地资料暂未收录第 ${result.ichingCanon.movingLineNumber} 爻的爻辞。`}
                </p>
              )}
            </div>
          </section>

        </>
      )}

      {/* 相关推演与内页链接 */}
      <footer
        aria-label={isEn ? 'Related tools' : '关联工具'}
        className="w-full pt-4 border-t border-zinc-200 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-600"
      >
        <Link
          href={`/${lang}/east`}
          className="hover:text-zinc-900 underline underline-offset-4 focus:outline-none focus:ring-1 focus:ring-zinc-900 rounded px-1"
        >
          {isEn ? 'Eastern Metaphysics Hall' : '玄学中台总览'}
        </Link>
        <span aria-hidden="true" className="text-zinc-300">
          •
        </span>
        <Link
          href={`/${lang}/east/meihua/daily-decision`}
          className="hover:text-zinc-900 underline underline-offset-4 focus:outline-none focus:ring-1 focus:ring-zinc-900 rounded px-1"
        >
          {isEn ? 'Daily Decision Alias' : '今日决策通道'}
        </Link>
        <span aria-hidden="true" className="text-zinc-300">
          •
        </span>
        <Link
          href={`/${lang}/east/bazi`}
          className="hover:text-zinc-900 underline underline-offset-4 focus:outline-none focus:ring-1 focus:ring-zinc-900 rounded px-1"
        >
          {isEn ? 'BaZi Analysis' : '八字排盘'}
        </Link>
      </footer>
    </div>
  );
}
