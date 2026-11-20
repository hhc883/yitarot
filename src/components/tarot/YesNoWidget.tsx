'use client';

import { useEffect, useRef, useState } from 'react';
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

export function YesNoWidget({ lang = 'zh' }: { lang?: 'zh' | 'en' }) {
  const isEn = lang === 'en';
  const t = getDictionary(lang).yesNo;

  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<{ drawn: DrawnCard; analysis: YesNoAnalysis } | null>(null);
  const [isFaceUp, setIsFaceUp] = useState(true);
  const focusAfterAction = useRef(false);
  const questionRef = useRef<HTMLInputElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!focusAfterAction.current) return;
    focusAfterAction.current = false;
    (result ? resultHeadingRef.current : questionRef.current)?.focus();
  }, [result]);

  const handleDraw = () => {
    const drawn = drawRandomCards(1)[0];
    focusAfterAction.current = true;
    setIsFaceUp(true);
    setResult({ drawn, analysis: evaluateYesNo(drawn, isEn) });
  };

  const handleReset = () => {
    focusAfterAction.current = true;
    setResult(null);
  };

  if (!result) {
    return (
      <form
        className="max-w-3xl space-y-6 border-t border-neutral-200 pt-6 sm:pt-8"
        onSubmit={(event) => {
          event.preventDefault();
          handleDraw();
        }}
      >
        <div>
          <label className="block text-base font-medium" htmlFor="yes-no-question">
            {isEn ? 'Your question (optional)' : '你的问题（选填）'}
          </label>
          <input
            ref={questionRef}
            id="yes-no-question"
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={t.inputPlaceholder}
            className="mt-2 min-h-12 w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base placeholder:text-neutral-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          />
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-neutral-600">
            {isEn ? 'Try an example' : '试试这些问题'}
          </legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {t.presets.map((preset) => (
              <button key={preset} type="button" onClick={() => setQuestion(preset)} className="min-h-11 rounded-lg border border-neutral-200 px-3 py-2 text-left text-sm leading-6 hover:border-neutral-400 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">
                {preset}
              </button>
            ))}
          </div>
        </fieldset>

        <button type="submit" className="min-h-12 w-full rounded-md bg-neutral-900 px-6 py-3 text-base font-medium text-white hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 sm:w-auto">
          {isEn ? 'Draw one card' : '抽一张牌'}
        </button>
      </form>
    );
  }

  const { drawn, analysis } = result;
  const cardName = isEn ? drawn.card.nameEn : drawn.card.nameZh;
  const orientation = isEn
    ? (drawn.isReversed ? 'Reversed' : 'Upright')
    : (drawn.isReversed ? '逆位' : '正位');
  const breakdown = [
    { label: isEn ? 'What the card suggests' : '牌面提示', detail: analysis.energy },
    { label: isEn ? 'What could get in the way' : '可能的阻碍', detail: analysis.blockage },
    { label: isEn ? 'A next step' : '可以尝试的下一步', detail: analysis.guidance }
  ];

  return (
    <section aria-labelledby="yes-no-result" className="max-w-4xl space-y-7 border-t border-neutral-200 pt-6 sm:space-y-8 sm:pt-8">
      <div>
        <h2 id="yes-no-result" ref={resultHeadingRef} tabIndex={-1} className="scroll-mt-24 font-serif text-2xl font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 sm:text-3xl">
          {isEn ? 'Your result' : '抽牌结果'}
        </h2>
        {question.trim() && (
          <p className="mt-2 [overflow-wrap:anywhere] text-base leading-relaxed text-neutral-600">
            {t.questionEcho} · “{question}”
          </p>
        )}
      </div>

      <div className="grid items-start gap-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-8">
        <figure className="mx-auto text-center">
          <div className="relative w-fit">
            <div aria-hidden="true">
              <TarotCardView card={drawn.card} isReversed={drawn.isReversed} isFlipped={isFaceUp} size="md" showDetails={false} lang={lang} className="motion-reduce:[&_*]:transition-none motion-reduce:[&_*]:animate-none" />
            </div>
            <button type="button" onClick={() => setIsFaceUp(!isFaceUp)} aria-label={isFaceUp ? (isEn ? 'Show card back' : '查看牌背') : (isEn ? 'Show card face' : '查看牌面')} className="absolute inset-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900" />
          </div>
          <figcaption className="mt-3 max-w-36 text-sm leading-6">
            <span className="block font-medium">{cardName}</span>
            <span className="text-neutral-600">{orientation}</span>
          </figcaption>
        </figure>

        <div className="min-w-0 space-y-5">
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
              <h3 className="font-serif text-xl font-semibold">{analysis.title}</h3>
              <span className="font-mono text-sm tabular-nums text-neutral-700">{analysis.score}%</span>
            </div>
            <div aria-hidden="true" className="mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-200">
              <div className="h-full bg-neutral-800" style={{ width: `${analysis.score}%` }} />
            </div>
          </div>
          <dl className="divide-y divide-neutral-200">
            {breakdown.map(({ label, detail }) => (
              <div key={label} className="py-3 first:pt-0 last:pb-0">
                <dt className="text-base font-semibold">{label}</dt>
                <dd className="mt-1 text-base leading-relaxed text-neutral-600">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <button type="button" onClick={handleReset} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium hover:border-neutral-800 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900">
        <RotateCcw aria-hidden="true" className="size-4" />
        {isEn ? t.resetBtn : '重新提问'}
      </button>
    </section>
  );
}
