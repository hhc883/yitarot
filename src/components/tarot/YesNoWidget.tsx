'use client';

import { useEffect, useRef, useState } from 'react';
import { drawRandomCards, DrawnCard } from '@/lib/tarot/deck';
import { TarotCardView } from './TarotCardView';
import { TarotEvidence, extractSourceTheme } from './TarotEvidence';
import { RotateCcw } from 'lucide-react';
import { getDictionary } from '@/lib/i18n/dict';
import { getTarotEvidence } from '@/lib/tarot/waite-basis';

export function YesNoWidget({ lang = 'zh' }: { lang?: 'zh' | 'en' }) {
  const isEn = lang === 'en';
  const t = getDictionary(lang).yesNo;

  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<DrawnCard | null>(null);
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
    setResult(drawn);
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

  const drawn = result;
  const cardName = isEn ? drawn.card.nameEn : drawn.card.nameZh;
  const orientation = isEn
    ? (drawn.isReversed ? 'Reversed' : 'Upright')
    : (drawn.isReversed ? '逆位' : '正位');
  const evidence = getTarotEvidence(drawn.card.slug, drawn.isReversed, lang);
  const sourceTheme = evidence?.basisText ? extractSourceTheme(evidence.basisText, lang) : '';

  const breakdown = evidence
    ? [
        {
          label: isEn ? 'What the card supports / points to' : '牌面典籍指向',
          detail: isEn
            ? `Based on the historical source below, this card orientation points to "${sourceTheme}" rather than a binary Yes/No verdict.`
            : `依据下方原始文献，该牌面此朝向指向「${sourceTheme}」，而非直接给出「是」或「否」的二元定论。`
        },
        {
          label: isEn ? 'Reflection check' : '现实核验问题',
          detail: isEn
            ? `What concrete facts in your situation support or challenge acting on "${sourceTheme}"${question.trim() ? ` regarding "${question.trim()}"` : ''}?`
            : `${question.trim() ? `针对「${question.trim()}」，` : ''}现实中有哪些具体事实支持或限制你按「${sourceTheme}」这一方向行动？`
        }
      ]
    : [
        {
          label: isEn ? 'Outcome inconclusive' : '结果待定（缺乏典籍依据）',
          detail: isEn
            ? 'No historical source basis is available for this card orientation, so no directional support can be derived.'
            : '当前未收录该牌面此朝向的原始文献依据，无法基于典籍提供倾向性参考。'
        }
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
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 sm:p-5 space-y-1.5">
            <p className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">
              {isEn ? 'Inconclusive · Reflection Support' : '结论待定 · 反思辅助'}
            </p>
            <h3 className="font-serif text-xl font-semibold">
              {isEn
                ? 'A single historical card does not decide Yes or No'
                : '单张历史塔罗牌不代替现实「是／否」决断'}
            </h3>
            <p className="text-sm leading-relaxed text-neutral-600">
              {isEn
                ? 'Historical tarot texts describe symbolic themes rather than scientific predictions or binary outcomes. Use the card source below to reflect on your decision.'
                : '历史塔罗文献记录的是象征主题，而非科学预测或二元定论。请结合下方牌面原始依据与现实条件自行权衡。'}
            </p>
          </div>

          <TarotEvidence
            slug={drawn.card.slug}
            isReversed={drawn.isReversed}
            lang={lang}
          />

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
