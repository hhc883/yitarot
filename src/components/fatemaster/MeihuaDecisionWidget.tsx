'use client';

import React, { useState } from 'react';
import { divineMeihua, MeihuaDivinationResult } from '@/lib/metaphysics/meihua';
import { ArrowRight, RotateCcw } from 'lucide-react';

const PRESET_DECISIONS = [
  '当前这笔重要的商业合作，是否应当果断推进？',
  '近期考虑跳槽或更换工作赛道，时机成熟吗？',
  '针对眼下这个投资项目，当下该跟进还是观望？',
  '我和他在相处上有阻滞，主动破冰沟通能否化解？',
  '接下来去异地出差或签署合同，能否一切顺利？'
];

export function MeihuaDecisionWidget({ lang = 'zh' }: { lang?: string }) {
  const [question, setQuestion] = useState('当前这笔重要的商业合作，是否应当果断推进？');
  const [mode, setMode] = useState<'time' | 'numbers'>('time');
  const [numA, setNumA] = useState(3);
  const [numB, setNumB] = useState(7);
  const [numMoving, setNumMoving] = useState(2);

  const [result, setResult] = useState<MeihuaDivinationResult>(() =>
    divineMeihua('当前这笔重要的商业合作，是否应当果断推进？', 'time')
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

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* 标题 */}
      <div className="w-full text-center mb-6">
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#111111] tracking-tight">
          {lang === 'en' ? 'Meihua Yishu · Daily Decision' : '梅花易数 · 每日决策'}
        </h1>
        <p className="text-xs sm:text-sm font-serif text-[#736B5E] mt-1.5 max-w-md mx-auto">
          邵康节心易神数 · 体用生克断吉凶 · 时空动静定先机
        </p>
      </div>

      {/* 提问与起卦方式输入 */}
      <div className="w-full rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-5 sm:p-6 shadow-2xs mb-8">
        <form onSubmit={handleCast} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-serif font-bold text-[#111111] mb-2">
              叩问心中关键决策
            </label>
            <input
              type="text"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="输入你当前面临的抉择、合作或动向..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6ED] border border-[#111111]/10 text-xs sm:text-sm text-[#111111] focus:outline-hidden focus:border-[#111111]"
            />
          </div>

          {/* 常见预设决策速选 */}
          <div className="flex flex-wrap gap-1.5">
            {PRESET_DECISIONS.map((p, idx) => (
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
                时空即刻感应
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
                随机心易灵数
              </button>
            </div>

            {mode === 'numbers' && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={numA}
                  onChange={e => setNumA(Number(e.target.value))}
                  placeholder="上卦数"
                  className="w-16 px-2 py-1 rounded-md bg-[#FAF6ED] border border-[#111111]/10 text-xs text-center"
                />
                <input
                  type="number"
                  value={numB}
                  onChange={e => setNumB(Number(e.target.value))}
                  placeholder="下卦数"
                  className="w-16 px-2 py-1 rounded-md bg-[#FAF6ED] border border-[#111111]/10 text-xs text-center"
                />
                <input
                  type="number"
                  value={numMoving}
                  onChange={e => setNumMoving(Number(e.target.value))}
                  placeholder="动爻数"
                  className="w-16 px-2 py-1 rounded-md bg-[#FAF6ED] border border-[#111111]/10 text-xs text-center"
                />
              </div>
            )}

            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#111111] hover:bg-[#333333] text-[#FFFDF9] text-xs font-serif tracking-wider transition-all cursor-pointer shadow-xs"
            >
              起卦断事
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
              <span className="text-xs font-serif font-bold text-[#111111]">本卦 · 现状</span>
              <span className="text-[11px] font-serif text-[#8C6D23]">动在第 {result.movingLine} 爻</span>
            </div>

            <div className="text-center my-4">
              <div className="font-serif font-black text-2xl text-[#111111] mb-1">
                {result.primaryHexagram.fullNameZh}
              </div>
              <span className="text-xs font-serif text-[#736B5E]">
                上【{result.primaryHexagram.upper.nameZh}（{result.primaryHexagram.upper.natureZh}）】 / 下【{result.primaryHexagram.lower.nameZh}（{result.primaryHexagram.lower.natureZh}）】
              </span>
            </div>

            {/* 体用标注 */}
            <div className="space-y-2 pt-2 border-t border-[#111111]/6 text-xs font-serif">
              <div className="flex justify-between items-center p-2 rounded-lg bg-[#FAF6ED]">
                <span className="font-bold text-[#111111]">体卦 (我方/事核)</span>
                <span className="text-[#8C6D23]">
                  {result.bodyTrigram.trigram.nameZh} ({result.bodyTrigram.trigram.elementZh})
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-[#FAF6ED]">
                <span className="font-bold text-[#111111]">用卦 (外部/事态)</span>
                <span className="text-[#8C6D23]">
                  {result.applicationTrigram.trigram.nameZh} ({result.applicationTrigram.trigram.elementZh})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 互卦 (发展与过程机巧) */}
        <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-[#111111]/6 pb-2">
              <span className="text-xs font-serif font-bold text-[#111111]">互卦 · 过程</span>
              <span className="text-[11px] font-serif text-[#736B5E]">二三四五爻交织</span>
            </div>

            <div className="text-center my-4">
              <div className="font-serif font-black text-2xl text-[#111111] mb-1">
                {result.mutualHexagram.fullNameZh}
              </div>
              <span className="text-xs font-serif text-[#736B5E]">
                上【{result.mutualHexagram.upper.nameZh}】 / 下【{result.mutualHexagram.lower.nameZh}】
              </span>
            </div>

            <p className="text-xs font-serif text-[#524B40] leading-relaxed pt-2 border-t border-[#111111]/6">
              {result.mutualHexagram.summaryZh}
            </p>
          </div>
        </div>

        {/* 变卦 (归宿与终局结果) */}
        <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-[#111111]/6 pb-2">
              <span className="text-xs font-serif font-bold text-[#111111]">变卦 · 终局</span>
              <span className="text-[11px] font-serif text-[#8C6D23]">动极生变</span>
            </div>

            <div className="text-center my-4">
              <div className="font-serif font-black text-2xl text-[#111111] mb-1">
                {result.transformedHexagram.fullNameZh}
              </div>
              <span className="text-xs font-serif text-[#736B5E]">
                新用卦：{result.transformedHexagram.changedApplication.nameZh} ({result.transformedHexagram.changedApplication.elementZh})
              </span>
            </div>

            <p className="text-xs font-serif text-[#524B40] leading-relaxed pt-2 border-t border-[#111111]/6">
              {result.transformedHexagram.summaryZh}
            </p>
          </div>
        </div>
      </div>

      {/* 体用生克大判决与行动指南 */}
      <div className="w-full rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#111111]/6 pb-4 mb-5">
          <div>
            <span className="text-[11px] font-serif text-[#736B5E] block">体用五行气场</span>
            <h3 className="font-serif font-black text-2xl text-[#111111] mt-0.5">
              {result.wuxingRelation.headlineZh}
            </h3>
            <p className="text-xs font-serif text-[#524B40] mt-1">
              {result.wuxingRelation.analysisZh}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] font-serif text-[#736B5E] block">易断气运</span>
            <div className="font-serif font-black text-3xl text-[#8C6D23]">
              {result.wuxingRelation.levelZh}
            </div>
          </div>
        </div>

        {/* 决断断语 */}
        <div className="p-4 rounded-xl bg-[#FAF6ED] border border-[#111111]/6 mb-5">
          <span className="text-[11px] font-serif font-bold text-[#111111] block mb-1">直决断语</span>
          <p className="text-xs font-serif text-[#111111] leading-relaxed font-semibold">
            {result.decisionActionZh.verdict}
          </p>
          <p className="text-xs font-serif text-[#524B40] mt-2 leading-relaxed">
            战术策略：{result.decisionActionZh.tacticalAdvice}
          </p>
        </div>

        {/* 宜忌清单 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-serif">
          <div>
            <span className="font-bold text-emerald-800 block mb-1.5">【当行之宜】</span>
            <div className="flex flex-wrap gap-1.5">
              {result.decisionActionZh.suitable.map((s, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="font-bold text-rose-800 block mb-1.5">【当避之戒】</span>
            <div className="flex flex-wrap gap-1.5">
              {result.decisionActionZh.unsuitable.map((u, idx) => (
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
