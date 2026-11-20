'use client';

import { useEffect, useRef, useState } from 'react';
import { drawRandomCards, DrawnCard } from '@/lib/tarot/deck';
import { TarotCardView } from './TarotCardView';
import { RotateCcw } from 'lucide-react';
import { getDictionary } from '@/lib/i18n/dict';
import { CARD_DETAIL_EN } from '@/lib/tarot/card-detail-en';

function calculateLoveHarmony(cards: DrawnCard[], isEn: boolean): {
  score: number;
  level: string;
  dynamicSummary: string;
} {
  let score = 65;

  cards.forEach(c => {
    const name = c.card.nameEn.toLowerCase();
    const isRev = c.isReversed;

    if (c.card.suit === 'cups' || name.includes('lovers') || name.includes('empress') || name.includes('star') || name.includes('sun')) {
      score += isRev ? 2 : 10;
    }
    if (c.card.suit === 'swords' || name.includes('tower') || name.includes('devil')) {
      score -= isRev ? 5 : 10;
    }
    if (c.card.suit === 'wands') {
      score += isRev ? -3 : 6;
    }
    if (c.card.suit === 'pentacles') {
      score += isRev ? 0 : 5;
    }
  });

  score = Math.max(35, Math.min(98, score));

  let level = isEn ? 'Harmonious Flow' : '良性共振';
  let dynamicSummary = '';

  if (isEn) {
    if (score >= 85) {
      level = 'Profound Soul Resonance';
      dynamicSummary = 'Both parties share high resonance in emotional values and spiritual pacing, providing genuine psychological safety and mutual empowerment.';
    } else if (score >= 70) {
      level = 'Gentle & Constructive Flow';
      dynamicSummary = 'The overarching dynamic is warm and flowing. Occasional differences in viewpoints are healthy growth opportunities easily bridged by open dialogue.';
    } else if (score >= 50) {
      level = 'Expectation vs Reality Friction';
      dynamicSummary = 'You may currently be moving at different paces or constrained by external variables (work, distance). Patience and clear expectations are advised.';
    } else {
      level = 'Needs Reconciliation & Renewal';
      dynamicSummary = 'Defensive postures are elevated. Release the impulse to win arguments, step back, and re-examine the core authentic needs of the relationship.';
    }
  } else {
    if (score >= 85) {
      level = '深层心智共振';
      dynamicSummary = '双方在情感需求与灵魂步调上高度契合，彼此能提供充分的安全感与滋养，是一段能够共同成长的双向关系。';
    } else if (score >= 70) {
      level = '温润和谐相长';
      dynamicSummary = '总体基调温和顺畅，存在真实的情感流动。偶有的观念分歧属于良性磨合，坦诚沟通即可消除隔阂。';
    } else if (score >= 50) {
      level = '现实与期待博弈';
      dynamicSummary = '双方目前可能处于不同步调，或受到外界现实因素（工作、距离、家庭）的牵制，内心期待与实际行动存在微弱落差。';
    } else {
      level = '亟待破冰与重构';
      dynamicSummary = '彼此防御心较强，可能存在未表达的委屈或误解。当前最需要的是放下输赢执念，退一步审视关系的本质需求。';
    }
  }

  return { score, level, dynamicSummary };
}

export function LoveTarotWidget({ lang = 'zh' }: { lang?: 'zh' | 'en' }) {
  const isEn = lang === 'en';
  const t = getDictionary(lang).love;
  const [selectedScenario, setSelectedScenario] = useState('ambiguous');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[] | null>(null);
  const [faceDown, setFaceDown] = useState<Record<number, boolean>>({});
  const focusAfterAction = useRef(false);
  const scenarioRef = useRef<HTMLInputElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!focusAfterAction.current) return;
    focusAfterAction.current = false;
    (drawnCards ? resultHeadingRef.current : scenarioRef.current)?.focus();
  }, [drawnCards]);

  const handleDraw = () => {
    focusAfterAction.current = true;
    setFaceDown({});
    setDrawnCards(drawRandomCards(3));
  };

  const handleReset = () => {
    focusAfterAction.current = true;
    setDrawnCards(null);
  };

  if (!drawnCards) {
    return (
      <form onSubmit={(event) => {
        event.preventDefault();
        handleDraw();
      }} className="space-y-5 border-t border-neutral-200 pt-6 sm:pt-8">
        <fieldset>
          <legend className="mb-4 font-medium">{isEn ? 'What is your relationship situation?' : '你目前处于哪种情境？'}</legend>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {t.scenarios.map((scenario) => (
              <label key={scenario.id} className="flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border border-neutral-200 p-3 leading-snug hover:border-neutral-400 has-[:checked]:border-neutral-900 has-[:checked]:bg-neutral-50 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-neutral-900 sm:p-4">
                <input
                  ref={selectedScenario === scenario.id ? scenarioRef : undefined}
                  type="radio"
                  name="relationship-situation"
                  value={scenario.id}
                  checked={selectedScenario === scenario.id}
                  onChange={() => setSelectedScenario(scenario.id)}
                  className="mt-0.5 size-4 shrink-0 accent-neutral-900"
                />
                <span>
                  <span className="block font-medium">{scenario.label}</span>
                  <span className="mt-1 block text-sm text-neutral-600">{scenario.desc}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <button type="submit" className="min-h-12 w-full rounded-md bg-neutral-900 px-6 py-3 text-base font-medium text-white hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 sm:w-auto">
          {isEn ? 'Draw three cards' : '抽三张牌'}
        </button>
      </form>
    );
  }

  const scenario = t.scenarios.find((item) => item.id === selectedScenario) ?? t.scenarios[0];
  const harmony = calculateLoveHarmony(drawnCards, isEn);

  return (
    <section aria-labelledby="love-result" className="space-y-7 border-t border-neutral-200 pt-6 sm:space-y-8 sm:pt-8">
      <div>
        <h2 id="love-result" ref={resultHeadingRef} tabIndex={-1} className="scroll-mt-24 font-serif text-2xl font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 sm:text-3xl">
          {isEn ? 'Your three-card spread' : '你的三张牌'}
        </h2>
        <p className="mt-2 text-neutral-600">{isEn ? 'Situation' : '当前情境'} · {scenario.label}</p>
      </div>

      <ol className="grid gap-3 md:grid-cols-3">
        {drawnCards.map((drawn, index) => {
          const position = t.positions[index];
          const cardName = isEn ? drawn.card.nameEn : drawn.card.nameZh;
          const orientation = isEn
            ? (drawn.isReversed ? 'Reversed' : 'Upright')
            : (drawn.isReversed ? '逆位' : '正位');
          const translated = isEn ? CARD_DETAIL_EN[drawn.card.slug]?.loveMeaning : undefined;
          const meaning = isEn
            ? (translated ?? drawn.card.loveMeaning)
            : (drawn.isReversed ? drawn.card.reversedMeaning : drawn.card.uprightMeaning);

          return (
            <li key={drawn.card.id} className="min-w-0 rounded-lg border border-neutral-200 p-4 sm:p-5">
              <p aria-hidden="true" className="font-mono text-sm leading-6 text-neutral-500">0{index + 1}</p>
              <h3 className="font-serif text-xl font-semibold leading-tight">{position.title}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{position.role}</p>

              <figure className="mt-4 flex flex-wrap items-start gap-4 md:block">
                <div className="relative w-fit">
                  <div aria-hidden="true">
                    <TarotCardView card={drawn.card} isReversed={drawn.isReversed} isFlipped={!faceDown[index]} size="sm" showDetails={false} lang={lang} className="motion-reduce:[&_*]:transition-none motion-reduce:[&_*]:animate-none" />
                  </div>
                  <button
                    type="button"
                    aria-label={faceDown[index] ? (isEn ? 'Show card face' : '查看牌面') : (isEn ? 'Show card back' : '查看牌背')}
                    onClick={() => setFaceDown((previous) => ({ ...previous, [index]: !previous[index] }))}
                    className="absolute inset-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
                  />
                </div>
                <figcaption className="min-w-0 flex-1 md:mt-3">
                  <span className="block break-words font-medium">{cardName}</span>
                  <span className="text-sm text-neutral-600">{orientation}</span>
                </figcaption>
              </figure>

              {isEn && !translated ? (
                <details className="mt-4 text-sm text-neutral-600">
                  <summary className="min-h-11 cursor-pointer py-2 leading-6 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-neutral-900">Card notes (Chinese only)</summary>
                  <p lang="zh-CN" className="leading-relaxed">{meaning}</p>
                </details>
              ) : (
                <p className="mt-4 text-base leading-relaxed text-neutral-700">{meaning}</p>
              )}
            </li>
          );
        })}
      </ol>

      <section aria-labelledby="love-reflection" className="rounded-lg border border-neutral-200 bg-neutral-50 p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2">
          <h3 id="love-reflection" className="font-serif text-xl font-semibold">{t.harmonyLabel}</h3>
          <span className="font-mono tabular-nums text-neutral-700">{harmony.score}%</span>
        </div>
        <p className="mt-1 font-medium">{harmony.level}</p>
        <div aria-hidden="true" className="my-4 h-1.5 overflow-hidden rounded-full bg-neutral-200">
          <div className="h-full bg-neutral-800" style={{ width: `${harmony.score}%` }} />
        </div>
        <p className="text-base leading-relaxed text-neutral-700">{harmony.dynamicSummary}</p>
        <h4 className="mt-4 font-semibold">{isEn ? 'A next step' : '可以尝试的下一步'}</h4>
        <p className="mt-1 text-base leading-relaxed text-neutral-700">{t.bridgeText}</p>
      </section>

      <button type="button" onClick={handleReset} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium hover:border-neutral-800 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900">
        <RotateCcw aria-hidden="true" className="size-4" />
        {isEn ? t.switchScenario : '重新选择情境'}
      </button>
    </section>
  );
}
