'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { drawRandomCards, DrawnCard } from '@/lib/tarot/deck';
import { TarotCardView } from './TarotCardView';
import { TarotEvidence, extractSourceTheme } from './TarotEvidence';
import { RotateCcw } from 'lucide-react';
import { getDictionary } from '@/lib/i18n/dict';
import { getTarotEvidence } from '@/lib/tarot/waite-basis';

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
          const evidence = getTarotEvidence(drawn.card.slug, drawn.isReversed, lang);
          const sourceTheme = evidence?.basisText
            ? extractSourceTheme(evidence.basisText, lang)
            : '';

          let observationPrompt = '';
          if (index === 0) {
            observationPrompt = sourceTheme
              ? isEn
                ? `Self-reflection: Where in your own expectations or actions do you notice "${sourceTheme}"?`
                : `自我觉察：在你的期待或实际行动中，哪些地方呼应了「${sourceTheme}」？`
              : isEn
                ? 'Self-reflection: Observe what you are bringing to this situation in your own words.'
                : '自我觉察：结合自身真实感受，梳理你在这段关系中的期待与立场。';
          } else if (index === 1) {
            observationPrompt = sourceTheme
              ? isEn
                ? `Observable check (no mind-reading): Rather than assuming their inner thoughts, what concrete words or actions can you observe or ask about regarding "${sourceTheme}"?`
                : `可验证观察（非读心揣测）：牌面不能代替对方真实想法。围绕「${sourceTheme}」，你可以从对方哪些具体言行中核实，或通过坦诚沟通直接确认？`
              : isEn
                ? 'Observable check (no mind-reading): Cards cannot reveal another person’s private thoughts. Verify through direct, respectful communication.'
                : '可验证观察（非读心揣测）：牌面无法窥探他人内心，请以实际互动中的言行与坦诚沟通为准。';
          } else {
            observationPrompt = sourceTheme
              ? isEn
                ? `Next-step reflection: What practical communication or boundary would help you test "${sourceTheme}" in reality?`
                : `互动观察：在接下来的相处中，什么样的具体沟通或边界能帮你核验「${sourceTheme}」？`
              : isEn
                ? 'Next-step reflection: Focus on clear communication and observable behavior as the relationship unfolds.'
                : '互动观察：在接下来的相处中，以清晰的沟通与实际行动作为判断依据。';
          }

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

              <TarotEvidence
                slug={drawn.card.slug}
                isReversed={drawn.isReversed}
                lang={lang}
                compact
                className="mt-4"
              />

              <p className="mt-3 rounded-md border border-neutral-200 bg-neutral-50 p-2.5 text-xs leading-relaxed text-neutral-700">
                {observationPrompt}
              </p>

              <Link
                href={`/${lang}/cards/${drawn.card.slug}`}
                className="mt-3 inline-flex min-h-[36px] items-center text-sm font-medium text-neutral-900 underline underline-offset-4 hover:text-neutral-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
              >
                {isEn ? `Read ${cardName} meaning →` : `查看「${cardName}」牌义 →`}
              </Link>
            </li>
          );
        })}
      </ol>

      <section aria-labelledby="love-reflection" className="rounded-lg border border-neutral-200 bg-neutral-50 p-5 sm:p-6 space-y-2">
        <p className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">
          {isEn ? 'Site Reflection Prompt' : '站点反思提示'}
        </p>
        <h3 id="love-reflection" className="font-serif text-xl font-semibold">
          {isEn ? 'Compare Positions & Verify by Communication' : '对照牌位并通过沟通核实'}
        </h3>
        <p className="text-base leading-relaxed text-neutral-700">
          {isEn
            ? `Compare Position 1 (${drawnCards[0].card.nameEn}) with Position 3 (${drawnCards[2].card.nameEn}) to reflect on how your own stance relates to the direction you are considering. Treat Position 2 (${drawnCards[1].card.nameEn}) as an open question to verify through direct, respectful communication rather than an assumption.`
            : `对照第一张牌「${drawnCards[0].card.nameZh}」（你的立场）与第三张牌「${drawnCards[2].card.nameZh}」（关系走向），梳理自身期待与现实互动的落差。对于第二张牌「${drawnCards[1].card.nameZh}」，请将其视为待沟通确认的问题，通过坦诚对话核实，而非单方面揣测。`}
        </p>
      </section>

      <div className="flex flex-wrap items-center gap-4">
        <button type="button" onClick={handleReset} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium hover:border-neutral-800 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900">
          <RotateCcw aria-hidden="true" className="size-4" />
          {isEn ? t.switchScenario : '重新选择情境'}
        </button>
        <Link
          href={`/${lang}/reading?spread=love_three`}
          className="inline-flex min-h-11 items-center text-sm font-medium text-neutral-900 underline underline-offset-4 hover:text-neutral-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
        >
          {isEn ? 'Try AI Love Spread (10 pts) →' : '进入 AI 爱情深度牌阵（10 积分）→'}
        </Link>
        <Link
          href={`/${lang}/yes-no`}
          className="inline-flex min-h-11 items-center text-sm text-neutral-600 underline underline-offset-4 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
        >
          {isEn ? 'Yes or No Tarot' : '是／否塔罗'}
        </Link>
      </div>
    </section>
  );
}
