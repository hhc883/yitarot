'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { divineMeihua, MeihuaDivinationResult } from '@/lib/metaphysics/meihua';

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
  const [numA, setNumA] = useState(3);
  const [numB, setNumB] = useState(7);
  const [numMoving, setNumMoving] = useState(2);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [result, setResult] = useState<MeihuaDivinationResult | null>(null);

  const handleCast = (e: React.FormEvent) => {
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

    if (
      mode === 'numbers' &&
      (Number.isNaN(numA) ||
        Number.isNaN(numB) ||
        Number.isNaN(numMoving) ||
        numA <= 0 ||
        numB <= 0 ||
        numMoving <= 0)
    ) {
      setErrorMessage(
        isEn
          ? 'Please enter positive integers for all three numbers.'
          : '请为上卦、下卦和动爻输入有效的正整数。'
      );
      return;
    }

    try {
      setErrorMessage(null);
      const res = divineMeihua(
        trimmedQuestion,
        mode,
        mode === 'numbers' ? [numA, numB, numMoving] : undefined
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

  const action =
    result &&
    (isEn && result.decisionActionEn
      ? result.decisionActionEn
      : result.decisionActionZh);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-zinc-900 px-2 sm:px-0">
      {/* 标题与简介 */}
      <header className="w-full text-center mb-8">
        <h1 className="font-serif font-semibold text-2xl sm:text-3xl text-zinc-900 tracking-tight">
          {isEn ? 'Meihua Decision' : '梅花易数决策'}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 mt-2 max-w-lg mx-auto leading-relaxed">
          {isEn
            ? 'Structured classic I Ching timing and body-application analysis for practical clarity.'
            : '依邵雍梅花易数体用生克法，推演事态动静、过程机巧与决策宜忌。'}
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
                onClick={() => setMode('time')}
                aria-pressed={mode === 'time'}
                className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-zinc-900 ${
                  mode === 'time'
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                {isEn ? 'Present Time' : '时辰起卦'}
              </button>
              <button
                type="button"
                onClick={() => setMode('numbers')}
                aria-pressed={mode === 'numbers'}
                className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-zinc-900 ${
                  mode === 'numbers'
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                {isEn ? 'Custom Numbers' : '数字起卦'}
              </button>
            </div>

            {mode === 'numbers' && (
              <div className="flex items-center gap-2 flex-wrap">
                <label className="flex items-center gap-1 text-xs text-zinc-600">
                  <span>{isEn ? 'Upper' : '上'}</span>
                  <input
                    type="number"
                    min="1"
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
                      {isEn ? 'Transformed · Outcome' : '变卦 · 终局'}
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      {isEn ? 'Line Shift' : '动爻生变'}
                    </span>
                  </div>

                  <div className="text-center my-4">
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
          </section>

          {/* 体用生克断语与行动建议 */}
          {action && (
            <section
              aria-labelledby="verdict-heading"
              className="w-full rounded-xl bg-white border border-zinc-200 p-5 sm:p-6 mb-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-4 mb-4">
                <div>
                  <span className="text-[11px] text-zinc-500 uppercase tracking-wide block">
                    {isEn ? 'Interaction Analysis' : '生克格局'}
                  </span>
                  <h3
                    id="verdict-heading"
                    className="font-serif font-bold text-xl text-zinc-900 mt-0.5"
                  >
                    {isEn
                      ? result.wuxingRelation.headlineEn ||
                        result.wuxingRelation.headlineZh
                      : result.wuxingRelation.headlineZh}
                  </h3>
                  <p className="text-xs text-zinc-600 mt-1">
                    {isEn
                      ? result.wuxingRelation.analysisEn ||
                        result.wuxingRelation.analysisZh
                      : result.wuxingRelation.analysisZh}
                  </p>
                </div>

                <div className="text-left sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                  <span className="text-[11px] text-zinc-500 block">
                    {isEn ? 'Judgment Level' : '断语定性'}
                  </span>
                  <div className="font-serif font-bold text-2xl text-zinc-900">
                    {isEn
                      ? result.wuxingRelation.levelEn ||
                        result.wuxingRelation.levelZh
                      : result.wuxingRelation.levelZh}
                  </div>
                </div>
              </div>

              {/* 决断断语 */}
              <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 mb-5">
                <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-wide block mb-1">
                  {isEn ? 'Verdict & Strategy' : '直决与策略'}
                </span>
                <p className="text-xs sm:text-sm font-semibold text-zinc-900 leading-relaxed">
                  {action.verdict}
                </p>
                <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                  <strong className="text-zinc-800 font-semibold">
                    {isEn ? 'Tactical Advice: ' : '策略指引：'}
                  </strong>
                  {action.tacticalAdvice}
                </p>
              </div>

              {/* 宜忌清单 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-lg border border-zinc-200 bg-white">
                  <span className="font-semibold text-zinc-900 block mb-2">
                    {isEn ? 'Suitable' : '宜行之策'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {action.suitable.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded bg-zinc-100 text-zinc-800 border border-zinc-200"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-lg border border-zinc-200 bg-white">
                  <span className="font-semibold text-zinc-900 block mb-2">
                    {isEn ? 'Unsuitable' : '当戒之举'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {action.unsuitable.map((u, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded bg-zinc-100 text-zinc-800 border border-zinc-200"
                      >
                        {u}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* 相关推演与内页链接 */}
      <footer
        aria-label={isEn ? 'Related tools' : '关联工具'}
        className="w-full pt-4 border-t border-zinc-200 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-600"
      >
        <Link
          href={`/${lang}/fatemaster`}
          className="hover:text-zinc-900 underline underline-offset-4 focus:outline-none focus:ring-1 focus:ring-zinc-900 rounded px-1"
        >
          {isEn ? 'FateMaster Console' : '玄学中台总览'}
        </Link>
        <span aria-hidden="true" className="text-zinc-300">
          •
        </span>
        <Link
          href={`/${lang}/fatemaster/daily-decision`}
          className="hover:text-zinc-900 underline underline-offset-4 focus:outline-none focus:ring-1 focus:ring-zinc-900 rounded px-1"
        >
          {isEn ? 'Daily Decision Alias' : '今日决策通道'}
        </Link>
        <span aria-hidden="true" className="text-zinc-300">
          •
        </span>
        <Link
          href={`/${lang}/bazi`}
          className="hover:text-zinc-900 underline underline-offset-4 focus:outline-none focus:ring-1 focus:ring-zinc-900 rounded px-1"
        >
          {isEn ? 'BaZi Analysis' : '八字排盘'}
        </Link>
      </footer>
    </div>
  );
}
