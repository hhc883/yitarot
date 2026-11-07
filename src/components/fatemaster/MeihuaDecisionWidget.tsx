'use client';

import React, { useState } from 'react';
import { divineMeihua, MeihuaDivinationResult } from '@/lib/metaphysics/meihua';
import { ArrowRight, RotateCcw } from 'lucide-react';

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

  const [question, setQuestion] = useState(
    isEn
      ? 'Should I aggressively push forward with this key commercial deal?'
      : '当前这笔重要的商业合作，是否应当果断推进？'
  );
  const [mode, setMode] = useState<'time' | 'numbers'>('time');
  const [numA, setNumA] = useState(3);
  const [numB, setNumB] = useState(7);
  const [numMoving, setNumMoving] = useState(2);

  const [result, setResult] = useState<MeihuaDivinationResult>(() =>
    divineMeihua(
      isEn
        ? 'Should I aggressively push forward with this key commercial deal?'
        : '当前这笔重要的商业合作，是否应当果断推进？',
      'time'
    )
  );

  const handleCast = (e: React.FormEvent) => {
    e.preventDefault();
    const res = divineMeihua(
      question,
      mode,
      mode === 'numbers' ? [numA, numB, numMoving] : undefined
    );
    setResult(res);
  };

  const action = isEn && result.decisionActionEn ? result.decisionActionEn : result.decisionActionZh;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* 标题 */}
      <div className="w-full text-center mb-6">
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#111111] tracking-tight">
          {isEn ? 'Meihua Yishu · Daily Strategic Decision' : '梅花易数 · 每日决策'}
        </h1>
        <p className="text-xs sm:text-sm font-serif text-[#736B5E] mt-1.5 max-w-md mx-auto">
          {isEn
            ? 'Shao Yong Classic Oracle · Body vs Application Interactions · Strategic Timing'
            : '邵康节心易神数 · 体用生克断吉凶 · 时空动静定先机'}
        </p>
      </div>

      {/* 提问与起卦方式输入 */}
      <div className="w-full rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-5 sm:p-6 shadow-2xs mb-8">
        <form onSubmit={handleCast} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-serif font-bold text-[#111111] mb-2">
              {isEn ? 'Inquire on Core Decision' : '叩问心中关键决策'}
            </label>
            <input
              type="text"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder={isEn ? 'Enter your pending decision, contract, or strategy...' : '输入你当前面临的抉择、合作或动向...'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6ED] border border-[#111111]/10 text-xs sm:text-sm text-[#111111] focus:outline-hidden focus:border-[#111111]"
            />
          </div>

          {/* 常见预设决策速选 */}
          <div className="flex flex-wrap gap-1.5">
            {presetList.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setQuestion(p)}
                className="text-left text-xs px-2.5 py-1 rounded-lg bg-[#FAF6ED] hover:bg-[#F2ECE1] text-[#5C5549] transition-colors border border-[#111111]/5 cursor-pointer font-serif"
              >
                {p}
              </button>
            ))}
          </div>

          {/* 起卦模式切换 */}
          <div className="flex items-center justify-between pt-3 border-t border-[#111111]/6 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMode('time')}
                className={`px-3 py-1.5 rounded-lg text-xs font-serif transition-colors cursor-pointer ${
                  mode === 'time'
                    ? 'bg-[#111111] text-[#FFFDF9]'
                    : 'bg-[#FAF6ED] text-[#736B5E]'
                }`}
              >
                {isEn ? 'Present Time Sync' : '时空即刻感应'}
              </button>
              <button
                type="button"
                onClick={() => setMode('numbers')}
                className={`px-3 py-1.5 rounded-lg text-xs font-serif transition-colors cursor-pointer ${
                  mode === 'numbers'
                    ? 'bg-[#111111] text-[#FFFDF9]'
                    : 'bg-[#FAF6ED] text-[#736B5E]'
                }`}
              >
                {isEn ? '3 Random Numbers' : '随机心易灵数'}
              </button>
            </div>

            {mode === 'numbers' && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={numA}
                  onChange={e => setNumA(Number(e.target.value))}
                  placeholder={isEn ? 'Upper' : '上卦数'}
                  className="w-16 px-2 py-1 rounded-md bg-[#FAF6ED] border border-[#111111]/10 text-xs text-center"
                />
                <input
                  type="number"
                  value={numB}
                  onChange={e => setNumB(Number(e.target.value))}
                  placeholder={isEn ? 'Lower' : '下卦数'}
                  className="w-16 px-2 py-1 rounded-md bg-[#FAF6ED] border border-[#111111]/10 text-xs text-center"
                />
                <input
                  type="number"
                  value={numMoving}
                  onChange={e => setNumMoving(Number(e.target.value))}
                  placeholder={isEn ? 'Line' : '动爻数'}
                  className="w-16 px-2 py-1 rounded-md bg-[#FAF6ED] border border-[#111111]/10 text-xs text-center"
                />
              </div>
            )}

            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#111111] hover:bg-[#333333] text-[#FFFDF9] text-xs font-serif tracking-wider transition-all cursor-pointer shadow-xs"
            >
              {isEn ? 'Cast Hexagram' : '起卦断事'}
            </button>
          </div>
        </form>
      </div>

      {/* 卦象推演三位一体卡片 (本卦 · 互卦 · 变卦) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* 本卦 (起因与当下现状) */}
        <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-[#111111]/6 pb-2">
              <span className="text-xs font-serif font-bold text-[#111111]">
                {isEn ? 'Primary · Present' : '本卦 · 现状'}
              </span>
              <span className="text-[11px] font-serif text-[#8C6D23]">
                {isEn ? `Moving Line ${result.movingLine}` : `动在第 ${result.movingLine} 爻`}
              </span>
            </div>

            <div className="text-center my-4">
              <div className="font-serif font-black text-2xl text-[#111111] mb-1">
                {isEn ? (result.primaryHexagram.fullNameEn || result.primaryHexagram.fullNameZh) : result.primaryHexagram.fullNameZh}
              </div>
              <span className="text-xs font-serif text-[#736B5E]">
                {isEn
                  ? `Upper [${result.primaryHexagram.upper.natureEn}] / Lower [${result.primaryHexagram.lower.natureEn}]`
                  : `上【${result.primaryHexagram.upper.nameZh}（${result.primaryHexagram.upper.natureZh}）】 / 下【${result.primaryHexagram.lower.nameZh}（${result.primaryHexagram.lower.natureZh}）】`}
              </span>
            </div>

            {/* 体用标注 */}
            <div className="space-y-2 pt-2 border-t border-[#111111]/6 text-xs font-serif">
              <div className="flex justify-between items-center p-2 rounded-lg bg-[#FAF6ED]">
                <span className="font-bold text-[#111111]">
                  {isEn ? 'Body (Self / Core Issue)' : '体卦 (我方/事核)'}
                </span>
                <span className="text-[#8C6D23]">
                  {isEn ? `${result.bodyTrigram.trigram.nameEn} (${result.bodyTrigram.trigram.element})` : `${result.bodyTrigram.trigram.nameZh} (${result.bodyTrigram.trigram.elementZh})`}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-[#FAF6ED]">
                <span className="font-bold text-[#111111]">
                  {isEn ? 'Application (External / Allies)' : '用卦 (外部/事态)'}
                </span>
                <span className="text-[#8C6D23]">
                  {isEn ? `${result.applicationTrigram.trigram.nameEn} (${result.applicationTrigram.trigram.element})` : `${result.applicationTrigram.trigram.nameZh} (${result.applicationTrigram.trigram.elementZh})`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 互卦 (发展与过程机巧) */}
        <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-[#111111]/6 pb-2">
              <span className="text-xs font-serif font-bold text-[#111111]">
                {isEn ? 'Nuclear · Progression' : '互卦 · 过程'}
              </span>
              <span className="text-[11px] font-serif text-[#736B5E]">
                {isEn ? 'Lines 2, 3, 4, 5 Interlock' : '二三四五爻交织'}
              </span>
            </div>

            <div className="text-center my-4">
              <div className="font-serif font-black text-2xl text-[#111111] mb-1">
                {isEn ? (result.mutualHexagram.fullNameEn || result.mutualHexagram.fullNameZh) : result.mutualHexagram.fullNameZh}
              </div>
              <span className="text-xs font-serif text-[#736B5E]">
                {isEn
                  ? `Upper [${result.mutualHexagram.upper.natureEn}] / Lower [${result.mutualHexagram.lower.natureEn}]`
                  : `上【${result.mutualHexagram.upper.nameZh}】 / 下【${result.mutualHexagram.lower.nameZh}】`}
              </span>
            </div>

            <p className="text-xs font-serif text-[#524B40] leading-relaxed pt-2 border-t border-[#111111]/6">
              {isEn ? (result.mutualHexagram.summaryEn || result.mutualHexagram.summaryZh) : result.mutualHexagram.summaryZh}
            </p>
          </div>
        </div>

        {/* 变卦 (归宿与终局结果) */}
        <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-[#111111]/6 pb-2">
              <span className="text-xs font-serif font-bold text-[#111111]">
                {isEn ? 'Transformed · Resolution' : '变卦 · 终局'}
              </span>
              <span className="text-[11px] font-serif text-[#8C6D23]">
                {isEn ? 'Shift on Moving Line' : '动极生变'}
              </span>
            </div>

            <div className="text-center my-4">
              <div className="font-serif font-black text-2xl text-[#111111] mb-1">
                {isEn ? (result.transformedHexagram.fullNameEn || result.transformedHexagram.fullNameZh) : result.transformedHexagram.fullNameZh}
              </div>
              <span className="text-xs font-serif text-[#736B5E]">
                {isEn
                  ? `New Application: ${result.transformedHexagram.changedApplication.nameEn} (${result.transformedHexagram.changedApplication.element})`
                  : `新用卦：${result.transformedHexagram.changedApplication.nameZh} (${result.transformedHexagram.changedApplication.elementZh})`}
              </span>
            </div>

            <p className="text-xs font-serif text-[#524B40] leading-relaxed pt-2 border-t border-[#111111]/6">
              {isEn ? (result.transformedHexagram.summaryEn || result.transformedHexagram.summaryZh) : result.transformedHexagram.summaryZh}
            </p>
          </div>
        </div>
      </div>

      {/* 体用生克大判决与行动指南 */}
      <div className="w-full rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#111111]/6 pb-4 mb-5">
          <div>
            <span className="text-[11px] font-serif text-[#736B5E] block">
              {isEn ? 'Elements Interaction' : '体用五行气场'}
            </span>
            <h3 className="font-serif font-black text-2xl text-[#111111] mt-0.5">
              {isEn ? (result.wuxingRelation.headlineEn || result.wuxingRelation.headlineZh) : result.wuxingRelation.headlineZh}
            </h3>
            <p className="text-xs font-serif text-[#524B40] mt-1">
              {isEn ? (result.wuxingRelation.analysisEn || result.wuxingRelation.analysisZh) : result.wuxingRelation.analysisZh}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] font-serif text-[#736B5E] block">
              {isEn ? 'Oracle Grade' : '易断气运'}
            </span>
            <div className="font-serif font-black text-3xl text-[#8C6D23]">
              {isEn ? (result.wuxingRelation.levelEn || result.wuxingRelation.levelZh) : result.wuxingRelation.levelZh}
            </div>
          </div>
        </div>

        {/* 决断断语 */}
        <div className="p-4 rounded-xl bg-[#FAF6ED] border border-[#111111]/6 mb-5">
          <span className="text-[11px] font-serif font-bold text-[#111111] block mb-1">
            {isEn ? 'Direct Verdict' : '直决断语'}
          </span>
          <p className="text-xs font-serif text-[#111111] leading-relaxed font-semibold">
            {action.verdict}
          </p>
          <p className="text-xs font-serif text-[#524B40] mt-2 leading-relaxed">
            {isEn ? 'Tactical Strategy: ' : '战术策略：'}{action.tacticalAdvice}
          </p>
        </div>

        {/* 宜忌清单 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-serif">
          <div>
            <span className="font-bold text-emerald-800 block mb-1.5">
              {isEn ? '【FAVORED ACTIONS】' : '【当行之宜】'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {action.suitable.map((s, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="font-bold text-rose-800 block mb-1.5">
              {isEn ? '【AVOID ACTIONS】' : '【当避之戒】'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {action.unsuitable.map((u, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-100">
                  {u}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}