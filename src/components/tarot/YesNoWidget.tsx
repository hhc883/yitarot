'use client';

import React, { useState } from 'react';
import { drawRandomCards, DrawnCard } from '@/lib/tarot/deck';
import { TarotCardView } from './TarotCardView';
import { RotateCcw } from 'lucide-react';
import { getDictionary } from '@/lib/i18n/dict';

interface YesNoAnalysis {
  verdict: 'YES' | 'NO' | 'MAYBE';
  score: number; // 0 - 100
  title: string;
  energy: string;
  blockage: string;
  guidance: string;
}

function evaluateYesNo(drawn: DrawnCard, isEn: boolean): YesNoAnalysis {
  const { card, isReversed } = drawn;
  const name = card.nameEn.toLowerCase();

  const strongYesNames = [
    'the sun', 'the star', 'the world', 'the empress', 'the magician',
    'wheel of fortune', 'ace of cups', 'two of cups', 'three of cups',
    'nine of cups', 'ten of cups', 'ace of pentacles', 'three of pentacles',
    'nine of pentacles', 'ten of pentacles', 'ace of wands', 'four of wands',
    'six of wands', 'the lovers', 'the chariot', 'the hierophant'
  ];

  const strongNoNames = [
    'the tower', 'death', 'three of swords', 'nine of swords', 'ten of swords',
    'five of pentacles', 'five of cups', 'the devil', 'seven of swords',
    'eight of swords', 'five of wands', 'ten of wands'
  ];

  const maybeNames = [
    'the high priestess', 'the hanged man', 'two of swords', 'four of swords',
    'seven of cups', 'the hermit', 'the moon', 'justice'
  ];

  let verdict: 'YES' | 'NO' | 'MAYBE' = 'MAYBE';
  let score = 50;

  if (strongYesNames.some(k => name.includes(k))) {
    if (!isReversed) {
      verdict = 'YES';
      score = 85 + Math.floor(Math.random() * 12);
    } else {
      verdict = 'MAYBE';
      score = 45 + Math.floor(Math.random() * 10);
    }
  } else if (strongNoNames.some(k => name.includes(k))) {
    if (!isReversed) {
      verdict = 'NO';
      score = 15 + Math.floor(Math.random() * 15);
    } else {
      verdict = 'MAYBE';
      score = 40 + Math.floor(Math.random() * 15);
    }
  } else if (maybeNames.some(k => name.includes(k))) {
    verdict = 'MAYBE';
    score = 50 + (isReversed ? -8 : 8);
  } else {
    if (!isReversed) {
      verdict = 'YES';
      score = 65 + Math.floor(Math.random() * 15);
    } else {
      verdict = 'NO';
      score = 30 + Math.floor(Math.random() * 15);
    }
  }

  const orientationStr = isEn
    ? (isReversed ? 'Reversed' : 'Upright')
    : (isReversed ? '逆位' : '正位');
  const cardName = isEn ? card.nameEn : card.nameZh;
  const meaning = isReversed ? card.reversedMeaning : card.uprightMeaning;

  let title = '';
  let energy = '';
  let blockage = '';
  let guidance = '';

  if (isEn) {
    if (verdict === 'YES') {
      title = 'Verdict: YES · Positive Forward Momentum';
      energy = `${cardName} (${orientationStr}) reveals favorable expansion. Your conscious intent resonates harmoniously with outer circumstances.`;
      blockage = isReversed
        ? 'Beware of dragging momentum, fatigue, or overlooking operational details.'
        : 'External friction is minimal; main resistance stems from unnecessary internal doubt.';
      guidance = 'Seize the present window with clarity. Act with grounded confidence.';
    } else if (verdict === 'NO') {
      title = 'Verdict: NO · Restraint & Caution Advised';
      energy = `${cardName} (${orientationStr}) signals structural friction or timing misalignment. Forcing an outcome will likely cause counterproductive friction.`;
      blockage = isReversed
        ? 'Root conflicts have not fully surfaced; hasty decisions risk unnecessary complications.'
        : 'Conditions remain unripened. Hidden costs and risks warrant careful reassessment.';
      guidance = 'Hold back on irreversible commitments. Verify core facts and protect your resources.';
    } else {
      title = 'Verdict: MAYBE · Dynamic Waiting Period';
      energy = `${cardName} (${orientationStr}) signifies gestation and shifting variables. The situation remains in flux.`;
      blockage = 'Key blind spots or unexpressed intentions remain between involved parties.';
      guidance = 'Avoid rushing into premature conclusions. Gather missing data and let the landscape clarify naturally.';
    }
  } else {
    if (verdict === 'YES') {
      title = '决断倾向：是（YES） · 赞同推进';
      energy = `${cardName}（${orientationStr}）显现顺遂与丰盈之势。当前心识与外界客体处于正向共振期，阻力较小。${meaning}`;
      blockage = isReversed
        ? '虽有成事之机，但需警惕节奏拖沓或细节疏忽。'
        : '外在阻碍轻微，主要的变数来自于内心的犹豫与过度保守。';
      guidance = '果断把握当下时机，保持清晰的目标感，顺势而为即可见成效。';
    } else if (verdict === 'NO') {
      title = '决断倾向：否（NO） · 建议暂缓或规避';
      energy = `${cardName}（${orientationStr}）揭示潜在的能量摩擦或结构性限制。强行推动容易事与愿违。${meaning}`;
      blockage = isReversed
        ? '深层矛盾尚未见底，仓促决策容易引发连锁反应。'
        : '客观条件尚未成熟，或存在未曾察觉的隐形成本与风险。';
      guidance = '暂缓采取不可逆的行动，重新核验底层事实，保护好现有资源与精力。';
    } else {
      title = '决断倾向：静观（MAYBE） · 机缘未显';
      energy = `${cardName}（${orientationStr}）呈现出潜伏、沉淀或多方拉扯的态势。事物的发展仍在动态演变中。${meaning}`;
      blockage = '信息存在盲区，或是双方/多方的意图尚未完全明朗。';
      guidance = '避免急躁求成，先探明未公开的关键信息，等待更明确的征兆浮现。';
    }
  }

  return { verdict, score, title, energy, blockage, guidance };
}

export function YesNoWidget({ lang = 'zh' }: { lang?: string }) {
  const isEn = lang === 'en';
  const d = getDictionary(lang);
  const t = d.yesNo;

  const [question, setQuestion] = useState('');
  const [drawn, setDrawn] = useState<DrawnCard | null>(null);
  const [analysis, setAnalysis] = useState<YesNoAnalysis | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleDraw = () => {
    const card = drawRandomCards(1)[0];
    const evaluated = evaluateYesNo(card, isEn);
    setDrawn(card);
    setAnalysis(evaluated);
    setIsFlipped(false);
    setTimeout(() => {
      setIsFlipped(true);
    }, 200);
  };

  const handleReset = () => {
    setDrawn(null);
    setAnalysis(null);
    setIsFlipped(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* 极简标题 */}
      <div className="text-center mb-8">
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#111111] tracking-tight">
          {t.title}
        </h1>
        <p className="text-xs sm:text-sm font-serif text-[#736B5E] mt-2">
          {t.subtitle}
        </p>
      </div>

      {/* 核心卡片容器 */}
      <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-6 sm:p-8 shadow-2xs">
        {!drawn ? (
          <div className="space-y-6">
            {/* 提问输入框 */}
            <div>
              <label className="block text-xs font-serif text-[#736B5E] mb-2">
                {t.inputLabel}
              </label>
              <input
                type="text"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder={t.inputPlaceholder}
                className="w-full px-4 py-3 rounded-xl bg-[#FAF6ED] border border-[#111111]/10 text-sm font-serif text-[#111111] placeholder-[#736B5E]/50 focus:outline-none focus:border-[#111111]/30 transition-colors"
              />
            </div>

            {/* 预设灵感 */}
            <div>
              <span className="text-[11px] font-serif text-[#736B5E] block mb-2">
                {t.quickLabel}
              </span>
              <div className="flex flex-wrap gap-2">
                {t.presets.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setQuestion(q)}
                    className="text-xs font-serif px-3 py-1.5 rounded-lg bg-[#FAF6ED] hover:bg-[#F2ECE1] text-[#111111]/80 border border-[#111111]/8 transition-colors cursor-pointer text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* 抽牌操作按钮 */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleDraw}
                className="w-full py-3.5 rounded-xl bg-[#111111] hover:bg-[#2A2A2A] text-xs font-serif tracking-widest text-[#FFFDF9] transition-all cursor-pointer shadow-xs active:scale-[0.99]"
              >
                {t.drawBtn}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* 问题回显 */}
            {question && (
              <div className="text-center pb-4 border-b border-[#111111]/8">
                <span className="text-[11px] font-serif text-[#736B5E] block">{t.questionEcho}</span>
                <p className="text-sm font-serif font-bold text-[#111111] mt-1">“{question}”</p>
              </div>
            )}

            {/* 卡牌与结论展示 */}
            <div className="flex flex-col sm:flex-row items-center gap-8">
              {/* 卡牌 */}
              <div className="shrink-0 flex justify-center">
                <TarotCardView
                  card={drawn.card}
                  isReversed={drawn.isReversed}
                  isFlipped={isFlipped}
                  size="md"
                  onFlip={() => setIsFlipped(!isFlipped)}
                />
              </div>

              {/* 决断分析结果 */}
              {analysis && (
                <div className="flex-1 space-y-4">
                  {/* 核心结论横幅 */}
                  <div className="p-4 rounded-xl bg-[#FAF6ED] border border-[#111111]/10">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-serif font-bold tracking-wide text-[#111111]">
                        {analysis.title}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#111111]/70">
                        {analysis.score}%
                      </span>
                    </div>

                    {/* 进度条 */}
                    <div className="w-full h-1.5 rounded-full bg-[#111111]/10 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-700 ${
                          analysis.verdict === 'YES'
                            ? 'bg-emerald-600'
                            : analysis.verdict === 'NO'
                            ? 'bg-stone-700'
                            : 'bg-amber-600'
                        }`}
                        style={{ width: `${analysis.score}%` }}
                      />
                    </div>
                  </div>

                  {/* 关键解析三要素 */}
                  <div className="space-y-3 text-xs font-serif leading-relaxed text-[#111111]">
                    <div>
                      <span className="font-bold text-[#736B5E] block mb-0.5">{t.dynamics}</span>
                      <p className="text-[#333333]">{analysis.energy}</p>
                    </div>

                    <div>
                      <span className="font-bold text-[#736B5E] block mb-0.5">{t.blockage}</span>
                      <p className="text-[#333333]">{analysis.blockage}</p>
                    </div>

                    <div>
                      <span className="font-bold text-[#736B5E] block mb-0.5">{t.guidance}</span>
                      <p className="text-[#333333]">{analysis.guidance}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 底部重置按钮 */}
            <div className="pt-4 border-t border-[#111111]/8 flex justify-center">
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl bg-[#FAF6ED] hover:bg-[#F2ECE1] text-xs font-serif text-[#111111] border border-[#111111]/10 transition-colors cursor-pointer flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#736B5E]" />
                <span>{t.resetBtn}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
