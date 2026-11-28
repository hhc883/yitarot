'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { divineMeihua, MeihuaDivinationResult, type MeihuaCastMode } from '@/lib/metaphysics/meihua';
import { EastAiReadingPanel } from './EastAiReadingPanel';

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
  const [mode, setMode] = useState<MeihuaCastMode>('time');
  const [numA, setNumA] = useState(3);
  const [numB, setNumB] = useState(7);
  const [numMoving, setNumMoving] = useState(2);
  const [numCount, setNumCount] = useState<2 | 3>(2);
  const [addHour, setAddHour] = useState(false);
  const [threeNumMethod, setThreeNumMethod] = useState<1 | 2>(1);
  const [hourMinuteMethod, setHourMinuteMethod] = useState<1 | 2>(1);
  const [sixLines, setSixLines] = useState<[boolean, boolean, boolean, boolean, boolean, boolean]>([
    true, true, true, true, true, true,
  ]);
  const [sixMoving, setSixMoving] = useState(1);
  const [castText, setCastText] = useState('');
  const [showColor, setShowColor] = useState(true);
  const [showCuoZong, setShowCuoZong] = useState(false);
  const [showCanGua, setShowCanGua] = useState(true);
  const [showPalace, setShowPalace] = useState(true);
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
      (mode === 'numbers' || mode === 'hexagram') &&
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
        mode === 'numbers'
          ? (numCount === 2 ? [numA, numB] : [numA, numB, numMoving])
          : undefined,
        {
          text: mode === 'text' ? (castText.trim() || trimmedQuestion) : undefined,
          addHour,
          threeNumMethod,
          hourMinuteMethod,
          sixLines: mode === 'six_lines' ? { lines: sixLines, movingLine: sixMoving } : undefined,
          hexagram:
            mode === 'hexagram'
              ? { upper: numA, lower: numB, movingLine: numMoving }
              : undefined
        }
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

          {/* 起卦模式切换与提交（固定顶行 Tab + 独立参数区，切换不跳动） */}
          <div className="pt-3 border-t border-zinc-200 flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-zinc-600 mr-1">
                  {isEn ? 'Method:' : '起卦方式：'}
                </span>
                {(
                  [
                    ['time', isEn ? 'Time' : '时间'],
                    ['hour_minute', isEn ? 'Hour:Min' : '时分'],
                    ['numbers', isEn ? 'Numbers' : '报数'],
                    ['six_lines', isEn ? 'Self-Select' : '自选'],
                    ['random', isEn ? 'Random' : '随机'],
                    ['text', isEn ? 'Text' : '文字'],
                  ] as const
                ).map(([m, label]) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    aria-pressed={mode === m}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-zinc-900 ${
                      mode === m
                        ? 'bg-zinc-900 text-white border-zinc-900'
                        : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium tracking-wide transition-colors cursor-pointer border border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1"
              >
                {isEn ? 'Cast Hexagram' : '排卦推演'}
              </button>
            </div>

            {mode === 'hour_minute' && (
              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-700">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" checked={hourMinuteMethod === 1} onChange={() => setHourMinuteMethod(1)} />
                  <span>{isEn ? 'Method 1 (H=Upper, M=Lower)' : '方法一（时求上，分求下，时+分求动爻）'}</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" checked={hourMinuteMethod === 2} onChange={() => setHourMinuteMethod(2)} />
                  <span>{isEn ? 'Method 2 (Digit sum)' : '方法二（时十位+个位，分十位+个位）'}</span>
                </label>
              </div>
            )}

            {mode === 'six_lines' && (
              <div className="w-full rounded-lg border border-zinc-200 bg-zinc-50/70 p-3 space-y-2">
                <div className="text-[11px] text-zinc-500">{isEn ? 'Click line to toggle Yin/Yang, click "动" for moving line:' : '点击爻线切换阴阳，点击「动」指定动爻：'}</div>
                {[5, 4, 3, 2, 1, 0].map((idx) => {
                  const isYang = sixLines[idx];
                  const isMov = sixMoving === idx + 1;
                  const labels = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="w-10 text-xs text-zinc-600">{labels[idx]}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = [...sixLines] as typeof sixLines;
                          next[idx] = !next[idx];
                          setSixLines(next);
                        }}
                        className="flex-1 max-w-48 h-4 flex items-center justify-between cursor-pointer"
                      >
                        {isYang ? (
                          <span className="w-full h-2.5 bg-zinc-900 rounded-xs" />
                        ) : (
                          <>
                            <span className="w-[44%] h-2.5 bg-zinc-900 rounded-xs" />
                            <span className="w-[44%] h-2.5 bg-zinc-900 rounded-xs" />
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSixMoving(idx + 1)}
                        className={`px-2 py-0.5 text-[11px] rounded border cursor-pointer ${
                          isMov ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-600 border-zinc-300'
                        }`}
                      >
                        动
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {mode === 'text' && (
              <input
                type="text"
                value={castText}
                onChange={e => setCastText(e.target.value)}
                placeholder={isEn ? 'Optional text for casting (defaults to question)' : '输入起卦文字（留空则按问题起卦）'}
                className="w-full sm:w-56 px-2.5 py-1.5 rounded-md bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            )}

            {mode === 'numbers' && (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setNumCount(numCount === 2 ? 3 : 2)}
                  className="px-2 py-1 rounded border border-zinc-300 text-xs text-zinc-700 bg-zinc-50 cursor-pointer"
                >
                  {numCount === 2 ? '两数' : '三数'}
                </button>
                <label className="flex items-center gap-1 text-xs text-zinc-600">
                  <span>{isEn ? '1st' : '一'}</span>
                  <input type="number" min="1" value={numA} onChange={e => setNumA(Number(e.target.value))} className="w-14 px-2 py-1 rounded-md bg-zinc-50 border border-zinc-300 text-xs text-center text-zinc-900" />
                </label>
                <label className="flex items-center gap-1 text-xs text-zinc-600">
                  <span>{isEn ? '2nd' : '二'}</span>
                  <input type="number" min="1" value={numB} onChange={e => setNumB(Number(e.target.value))} className="w-14 px-2 py-1 rounded-md bg-zinc-50 border border-zinc-300 text-xs text-center text-zinc-900" />
                </label>
                {numCount === 3 && (
                  <label className="flex items-center gap-1 text-xs text-zinc-600">
                    <span>{isEn ? '3rd' : '三'}</span>
                    <input type="number" min="1" value={numMoving} onChange={e => setNumMoving(Number(e.target.value))} className="w-14 px-2 py-1 rounded-md bg-zinc-50 border border-zinc-300 text-xs text-center text-zinc-900" />
                  </label>
                )}
                <label className="flex items-center gap-1 text-xs text-zinc-600 cursor-pointer ml-1">
                  <input type="checkbox" checked={addHour} onChange={e => setAddHour(e.target.checked)} />
                  <span>{isEn ? '+Hour' : '加时辰'}</span>
                </label>
                {numCount === 3 && (
                  <button
                    type="button"
                    onClick={() => setThreeNumMethod(threeNumMethod === 1 ? 2 : 1)}
                    className="px-2 py-1 rounded border border-zinc-300 text-[11px] text-zinc-600 bg-white cursor-pointer"
                  >
                    {threeNumMethod === 1 ? '法一(一上二下三动)' : '法二(一上二三下总动)'}
                  </button>
                )}
              </div>
            )}

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
          {/* 四柱干支 + 旬空 + 纳音 + 五联卦象（[主] [互] [变] [参I错] [参II综]） */}
          {result.ganZhiInfo && (
            <section className="w-full rounded-xl bg-white border border-zinc-200 p-4 sm:p-5 mb-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="grid grid-cols-4 gap-4 text-center">
                  {[
                    [result.ganZhiInfo.year, result.ganZhiInfo.yearKong, result.ganZhiInfo.yearNaYin],
                    [result.ganZhiInfo.month, result.ganZhiInfo.monthKong, result.ganZhiInfo.monthNaYin],
                    [result.ganZhiInfo.day, result.ganZhiInfo.dayKong, result.ganZhiInfo.dayNaYin],
                    [result.ganZhiInfo.hour, result.ganZhiInfo.hourKong, result.ganZhiInfo.hourNaYin],
                  ].map(([gz, kong, ny], i) => (
                    <div key={i} className="flex flex-col items-center">
                      <span className="font-serif text-base font-semibold text-zinc-900">{gz}</span>
                      <span className="text-[10px] text-zinc-500">{ny} · {kong}空</span>
                    </div>
                  ))}
                </div>
                {result.lunarTimeInfo && (
                  <span className="text-xs text-zinc-600">{result.lunarTimeInfo.lunarDateText}</span>
                )}
              </div>
            </section>
          )}

          {/* 五联卦象横排（爻线图 + 宫位 + 卦名 + 开关胶囊） */}
          <section className="w-full rounded-xl bg-white border border-zinc-200 p-4 sm:p-6 mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-4 pb-3 border-b border-zinc-100">
              {[
                { label: '颜色', active: showColor, toggle: () => setShowColor(v => !v) },
                { label: '错综', active: showCuoZong, toggle: () => setShowCuoZong(v => !v) },
                { label: '参卦', active: showCanGua, toggle: () => setShowCanGua(v => !v) },
                { label: '宫位', active: showPalace, toggle: () => setShowPalace(v => !v) },
              ].map((t) => (
                <button
                  key={t.label}
                  type="button"
                  onClick={t.toggle}
                  className={`px-3 py-0.5 rounded-full text-xs border transition-colors cursor-pointer ${
                    t.active
                      ? 'border-zinc-900 text-white bg-zinc-900'
                      : 'border-zinc-200 text-zinc-500 bg-white hover:border-zinc-400'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
              {[
                { tag: '[主]', palace: `${result.primaryHexagram.upper.nameZh}宫`, name: result.primaryHexagram.fullNameZh, upperEl: result.primaryHexagram.upper.element, lowerEl: result.primaryHexagram.lower.element, lines: result.primaryHexagram.lines, moving: result.movingLine },
                { tag: '[互]', palace: `${result.mutualHexagram.upper.nameZh}宫`, name: result.mutualHexagram.fullNameZh, upperEl: result.mutualHexagram.upper.element, lowerEl: result.mutualHexagram.lower.element, lines: [...result.mutualHexagram.lower.lines, ...result.mutualHexagram.upper.lines], moving: 0 },
                { tag: '[变]', palace: `${result.transformedHexagram.upper.nameZh}宫`, name: result.transformedHexagram.fullNameZh, upperEl: result.transformedHexagram.upper.element, lowerEl: result.transformedHexagram.lower.element, lines: [...result.transformedHexagram.lower.lines, ...result.transformedHexagram.upper.lines], moving: 0 },
                ...(showCanGua && result.cuoGua ? [{ tag: showCuoZong ? '[错]' : '[参I]', palace: `${result.cuoGua.upper.nameZh}宫`, name: result.cuoGua.fullNameZh, upperEl: result.cuoGua.upper.element, lowerEl: result.cuoGua.lower.element, lines: result.cuoGua.lines, moving: 0 }] : []),
                ...(showCanGua && result.zongGua ? [{ tag: showCuoZong ? '[综]' : '[参II]', palace: `${result.zongGua.upper.nameZh}宫`, name: result.zongGua.fullNameZh, upperEl: result.zongGua.upper.element, lowerEl: result.zongGua.lower.element, lines: result.zongGua.lines, moving: 0 }] : []),
              ].map((g) => {
                const EL_COLOR: Record<string, string> = {
                  Wood: '#16A34A',
                  Fire: '#DC2626',
                  Earth: '#CA8A04',
                  Metal: '#64748B',
                  Water: '#2563EB',
                };
                return (
                <div key={g.tag} className="flex flex-col items-center rounded-lg border border-zinc-100 bg-zinc-50/40 p-3">
                  <span className="text-xs font-medium text-zinc-500">{g.tag}</span>
                  {showPalace && <span className="text-[11px] text-zinc-500 mb-2">「{g.palace}」</span>}
                  <div className="w-20 space-y-1.5 my-1">
                    {[5, 4, 3, 2, 1, 0].map((li) => {
                      const isYang = g.lines[li];
                      const isMov = g.moving === li + 1;
                      const barColor = showColor ? EL_COLOR[li >= 3 ? g.upperEl : g.lowerEl] : '#18181B';
                      return (
                        <div key={li} className="relative flex items-center justify-between h-2.5">
                          {isYang ? (
                            <span className="w-full h-2 rounded-xs" style={{ backgroundColor: barColor }} />
                          ) : (
                            <>
                              <span className="w-[43%] h-2 rounded-xs" style={{ backgroundColor: barColor }} />
                              <span className="w-[43%] h-2 rounded-xs" style={{ backgroundColor: barColor }} />
                            </>
                          )}
                          {isMov && (
                            <span className="absolute -right-3.5 text-[10px] font-bold text-red-600">×</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <span className="mt-2 font-serif text-sm font-semibold text-zinc-900">{g.name}</span>
                </div>
                );
              })}
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

          {/* 邵康节宗师同卦实战占验（若命中） */}
          {result.classicCase && (
            <section
              aria-labelledby="meihua-classic-case-heading"
              className="w-full mb-8 p-5 rounded-xl border border-zinc-200 bg-zinc-50"
            >
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-200">
                <h3
                  id="meihua-classic-case-heading"
                  className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5"
                >
                  <span className="font-mono text-xs">📖</span>
                  <span>
                    {isEn
                      ? `Master Shao Precedent · ${result.classicCase.title}`
                      : `邵雍宗师经典卦案 · ${result.classicCase.title}`}
                  </span>
                </h3>
                <span className="text-[11px] font-mono text-zinc-500">
                  {isEn ? 'Meihua Yishu Canon' : '《梅花易数》占验'}
                </span>
              </div>
              <div className="space-y-2 text-xs text-zinc-700 leading-relaxed">
                <p>
                  <strong className="text-zinc-900 font-medium">
                    {isEn ? 'Historical Query: ' : '实占起因：'}
                  </strong>
                  {result.classicCase.query}
                </p>
                <p>
                  <strong className="text-zinc-900 font-medium">
                    {isEn ? 'Analysis: ' : '机理推演：'}
                  </strong>
                  {result.classicCase.analysis}
                </p>
                <p className="pt-2 border-t border-zinc-200 text-zinc-600">
                  <strong className="text-zinc-900 font-medium">
                    {isEn ? 'Historical Outcome: ' : '实际应验：'}
                  </strong>
                  {result.classicCase.result}
                </p>
              </div>
            </section>
          )}

          <EastAiReadingPanel
            kind="meihua"
            titleZh="让 AI 深度解盘"
            titleEn="AI Deep Reading"
            question={result.question}
            chartSummary={[
              `本卦：${result.primaryHexagram.fullNameZh}（上${result.primaryHexagram.upper.nameZh}下${result.primaryHexagram.lower.nameZh}）`,
              `互卦：${result.mutualHexagram.fullNameZh}，变卦：${result.transformedHexagram.fullNameZh}`,
              result.cuoGua && result.zongGua
                ? `错卦：${result.cuoGua.fullNameZh}，综卦：${result.zongGua.fullNameZh}`
                : '',
              `体卦：${result.bodyTrigram.trigram.nameZh}（${result.bodyTrigram.trigram.elementZh}），用卦：${result.applicationTrigram.trigram.nameZh}（${result.applicationTrigram.trigram.elementZh}）`,
              `第 ${result.movingLine} 爻动，体用生克：${result.wuxingRelation}`,
              result.lunarTimeInfo ? `起卦农历：${result.lunarTimeInfo.lunarDateText}` : '',
            ]
              .filter(Boolean)
              .join('；')}
            localFallback={action?.verdict}
            spendType="liuyao"
            lang={lang}
            resetKey={`${result.primaryHexagram.fullNameZh}-${result.movingLine}-${result.transformedHexagram.fullNameZh}-${result.question || ''}`}
          />
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
          href={`/${lang}/east/daily-decision`}
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
