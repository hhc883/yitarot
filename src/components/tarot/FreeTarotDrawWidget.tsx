'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { RotateCcw, Sparkles } from 'lucide-react';
import { DrawnCard, drawRandomCards } from '@/lib/tarot/deck';
import { getLocalizedCardDetailEn } from '@/lib/tarot/card-detail-en';
import { getTarotEvidence } from '@/lib/tarot/waite-basis';
import { TarotCardView } from '@/components/tarot/TarotCardView';
import { TarotEvidence, extractSourceTheme } from '@/components/tarot/TarotEvidence';

export interface SpreadSlotMeta {
  index: number;
  name: string;
  framing: string;
  description: string;
}

interface FreeTarotDrawWidgetProps {
  mode: 'one-card' | 'three-card';
  slots?: SpreadSlotMeta[];
}

const ONE_CARD_EXAMPLES = [
  'What energy deserves my attention today?',
  'What am I overlooking in this situation?',
  'How can I approach this decision with clarity?'
];

const DEFAULT_THREE_CARD_SLOTS: SpreadSlotMeta[] = [
  {
    index: 0,
    name: 'Past Foundation',
    framing: 'In the Past position, this card highlights the background influences, habits, or prior choices that shaped where you stand now.',
    description: 'Past roots, foundational experiences, or prior influences shaping the present.'
  },
  {
    index: 1,
    name: 'Present Situation',
    framing: 'In the Present position, this card mirrors the active tension, immediate focus, and energy available to you right now.',
    description: 'Current circumstances, active dynamics, and the immediate landscape you face.'
  },
  {
    index: 2,
    name: 'Future Trajectory',
    framing: 'In the Future position, this card points to a likely direction or theme to watch if current momentum continues—not a fixed outcome.',
    description: 'The emerging direction and next theme to consider as things unfold.'
  }
];

type PendingFocusTarget =
  | { type: 'one-card-result' }
  | { type: 'one-card-input' }
  | { type: 'three-card-result'; index: number }
  | { type: 'three-card-button'; index: number }
  | null;

const SHORT_THREE_CARD_LABELS = ['Past', 'Present', 'Future'] as const;

function FaceDownCardButton({
  label,
  sublabel,
  onClick,
  compact = false,
  buttonRef
}: {
  label: string;
  sublabel?: string;
  onClick: () => void;
  compact?: boolean;
  buttonRef?: React.Ref<HTMLButtonElement>;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`group relative flex flex-col items-center justify-between rounded-2xl border border-[#171717]/20 bg-[#171717] text-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2 ${
        compact
          ? 'w-full max-w-[9rem] aspect-[36/58] min-h-[44px] min-w-[44px] p-1.5 sm:p-2.5'
          : 'w-44 h-72 p-3 sm:w-48 sm:h-76'
      }`}
    >
      <div
        className={`flex h-full w-full flex-col items-center rounded-xl border border-white/20 text-center ${
          compact ? 'p-1.5 sm:p-2.5' : 'p-2.5'
        }`}
      >
        <span
          className={`font-mono uppercase text-white/60 ${
            compact
              ? 'text-[7px] tracking-[0.16em] sm:text-[9px] sm:tracking-[0.22em]'
              : 'text-[9px] tracking-[0.22em]'
          }`}
        >
          YiTatro
        </span>
        <div className="flex flex-1 flex-col items-center justify-center gap-1.5 sm:gap-2">
          <span
            aria-hidden="true"
            className={`flex items-center justify-center rounded-full border border-white/30 bg-white/5 transition-transform duration-200 group-hover:scale-105 ${
              compact ? 'h-8 w-8 text-sm sm:h-12 sm:w-12 sm:text-lg' : 'h-12 w-12 text-lg'
            }`}
          >
            ✦
          </span>
          <span
            className={`font-serif font-medium tracking-wide text-white leading-tight ${
              compact ? 'text-[10px] sm:text-sm' : 'text-xs sm:text-sm'
            }`}
          >
            {sublabel || 'Tap to Reveal'}
          </span>
        </div>
      </div>
    </button>
  );
}

export function FreeTarotDrawWidget({ mode, slots }: FreeTarotDrawWidgetProps) {
  const inputId = useId();
  const isOneCard = mode === 'one-card';
  const activeSlots = slots && slots.length === 3 ? slots : DEFAULT_THREE_CARD_SLOTS;

  const [question, setQuestion] = useState('');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>(
    isOneCard ? [false] : [false, false, false]
  );
  const [announcement, setAnnouncement] = useState('');

  const pendingFocusRef = useRef<PendingFocusTarget>(null);
  const questionInputRef = useRef<HTMLInputElement>(null);
  const oneCardHeadingRef = useRef<HTMLHeadingElement>(null);
  const slotHeadingRefs = useRef<Array<HTMLHeadingElement | null>>([]);
  const slotButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const target = pendingFocusRef.current;
    if (!target) return;
    pendingFocusRef.current = null;

    if (target.type === 'one-card-result') {
      oneCardHeadingRef.current?.focus({ preventScroll: true });
    } else if (target.type === 'one-card-input') {
      questionInputRef.current?.focus({ preventScroll: true });
    } else if (target.type === 'three-card-result') {
      slotHeadingRefs.current[target.index]?.focus({ preventScroll: true });
    } else if (target.type === 'three-card-button') {
      slotButtonRefs.current[target.index]?.focus({ preventScroll: true });
    }
  }, [revealed, drawnCards]);

  const handleOneCardDraw = () => {
    const next = drawRandomCards(1, true);
    pendingFocusRef.current = { type: 'one-card-result' };
    setDrawnCards(next);
    setRevealed([true]);
    setAnnouncement(
      `Drew ${next[0].card.nameEn} (${next[0].isReversed ? 'Reversed' : 'Upright'}).`
    );
  };

  const handleThreeCardFlip = (slotIndex: number) => {
    if (revealed[slotIndex]) return;
    const nextCards = drawnCards.length === 3 ? drawnCards : drawRandomCards(3, true);
    if (drawnCards.length !== 3) {
      setDrawnCards(nextCards);
    }
    pendingFocusRef.current = { type: 'three-card-result', index: slotIndex };
    setRevealed((prev) => prev.map((val, idx) => (idx === slotIndex ? true : val)));
    const card = nextCards[slotIndex];
    if (card) {
      setAnnouncement(
        `Revealed ${activeSlots[slotIndex].name}: ${card.card.nameEn} (${card.isReversed ? 'Reversed' : 'Upright'}).`
      );
    }
  };

  const handleRevealAllThree = () => {
    const firstUnrevealedIdx = revealed.findIndex((val) => !val);
    if (drawnCards.length !== 3) {
      setDrawnCards(drawRandomCards(3, true));
    }
    pendingFocusRef.current = {
      type: 'three-card-result',
      index: firstUnrevealedIdx >= 0 ? firstUnrevealedIdx : 0
    };
    setRevealed([true, true, true]);
    setAnnouncement('All 3 cards revealed.');
  };

  const handleReset = () => {
    if (isOneCard) {
      setQuestion('');
      pendingFocusRef.current = { type: 'one-card-input' };
      setAnnouncement('Draw reset. Ready to draw a new card.');
    } else {
      pendingFocusRef.current = { type: 'three-card-button', index: 0 };
      setAnnouncement('Three-card draw reset.');
    }
    setDrawnCards([]);
    setRevealed(isOneCard ? [false] : [false, false, false]);
  };

  if (isOneCard) {
    const drawn = drawnCards[0];
    const isRevealed = Boolean(revealed[0] && drawn);
    const detailEn = drawn ? getLocalizedCardDetailEn(drawn.card.slug) : undefined;
    const keywords = detailEn
      ? drawn.isReversed
        ? detailEn.reversedKeywords
        : detailEn.uprightKeywords
      : [];
    const evidence = drawn ? getTarotEvidence(drawn.card.slug, drawn.isReversed, 'en') : undefined;
    const sourceTheme = evidence?.basisText ? extractSourceTheme(evidence.basisText, 'en') : '';

    return (
      <section
        aria-label="Free One Card Tarot Draw"
        className="rounded-xl border border-[#E4E4E7] bg-white p-5 sm:p-8"
      >
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {announcement}
        </div>
        {!isRevealed ? (
          <div className="flex flex-col items-center gap-6">
            <div className="w-full max-w-xl space-y-3">
              <label
                htmlFor={inputId}
                className="block text-xs font-medium uppercase tracking-wider text-[#52525B]"
              >
                Optional Reflection Question
              </label>
              <input
                ref={questionInputRef}
                id={inputId}
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                maxLength={140}
                placeholder="e.g. What energy deserves my attention today?"
                className="w-full min-h-[44px] rounded-md border border-[#E4E4E7] bg-white px-3.5 py-2 text-sm text-[#171717] placeholder:text-[#71717A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2"
              />
              <div className="flex flex-wrap gap-2" aria-label="Example reflection questions">
                {ONE_CARD_EXAMPLES.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => setQuestion(example)}
                    className="inline-flex min-h-[44px] items-center rounded-full border border-[#E4E4E7] bg-[#F5F5F6] px-3.5 py-2 text-left text-xs text-[#171717] transition-colors hover:border-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 pt-1">
              <FaceDownCardButton
                label="Draw one tarot card"
                sublabel="Draw Your Card"
                onClick={handleOneCardDraw}
              />
              <p className="text-xs text-[#52525B]">
                Local shuffle · 78-card Rider-Waite deck · No sign-in required
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {question.trim() && (
              <div className="rounded-lg border border-[#E4E4E7] bg-[#F5F5F6] px-4 py-3 text-xs sm:text-sm text-[#171717]">
                <p className="font-medium">
                  Your reflection focus: &ldquo;{question.trim()}&rdquo;
                </p>
                <p className="mt-1 text-xs text-[#52525B]">
                  This free draw offers symbolic reflection on your focus rather than a custom AI synthesis.
                </p>
              </div>
            )}

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
              <div className="shrink-0 flex flex-col items-center gap-3">
                <TarotCardView
                  card={drawn.card}
                  isReversed={drawn.isReversed}
                  isFlipped={true}
                  size="lg"
                  lang="en"
                  showDetails={false}
                />
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-md border border-[#E4E4E7] bg-white px-4 py-2 text-xs font-medium text-[#171717] transition-colors hover:border-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Reset &amp; Draw Again</span>
                </button>
              </div>

              <div className="flex-1 space-y-4 text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded border border-[#E4E4E7] bg-[#F5F5F6] px-2.5 py-0.5 font-mono text-xs text-[#171717]">
                    {drawn.isReversed ? 'Reversed' : 'Upright'}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#52525B]">
                    {drawn.card.arcana === 'major' ? 'Major Arcana' : `Minor Arcana · ${drawn.card.suit}`}
                  </span>
                </div>

                <h2
                  ref={oneCardHeadingRef}
                  tabIndex={-1}
                  className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-[#171717] focus:outline-none"
                >
                  {drawn.card.nameEn}
                </h2>

                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {keywords.slice(0, 4).map((kw) => (
                      <span
                        key={kw}
                        className="rounded-full border border-[#E4E4E7] px-2.5 py-0.5 text-xs text-[#52525B]"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}

                <TarotEvidence
                  slug={drawn.card.slug}
                  isReversed={drawn.isReversed}
                  lang="en"
                />

                <div className="rounded-lg border border-[#E4E4E7] bg-[#F5F5F6]/70 p-4 space-y-2">
                  <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#171717]">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Site Reflection Prompts (Educational)</span>
                  </h3>
                  {sourceTheme ? (
                    <ul className="list-disc pl-4 space-y-1.5 text-sm text-[#171717]">
                      <li>
                        What part of &ldquo;{sourceTheme}&rdquo; can you observe in your current situation?
                      </li>
                      {question.trim() ? (
                        <li>
                          How does this historical theme relate to your focus: &ldquo;{question.trim()}&rdquo;?
                        </li>
                      ) : (
                        <li>
                          Which concrete detail in your day aligns with or contrasts against this theme?
                        </li>
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-[#52525B]">
                      No verified historical source text is available for {drawn.card.nameEn} ({drawn.isReversed ? 'Reversed' : 'Upright'}), so no source-based prompt is generated.
                    </p>
                  )}
                </div>

                <div className="pt-1">
                  <Link
                    href={`/en/cards/${drawn.card.slug}`}
                    className="inline-flex min-h-[44px] items-center text-sm font-medium text-[#171717] underline underline-offset-4 hover:text-[#52525B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2"
                  >
                    Explore full {drawn.card.nameEn} card meaning →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }

  // Three-Card Mode (Past / Present / Future)
  const revealedCount = revealed.filter(Boolean).length;
  const allRevealed = revealedCount === 3;

  return (
    <section
      aria-label="Free 3 Card Tarot Reading"
      className="rounded-xl border border-[#E4E4E7] bg-white p-3.5 sm:p-8 space-y-5 sm:space-y-6"
    >
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E4E4E7] pb-4">
        <p className="text-xs sm:text-sm text-[#52525B]">
          {allRevealed
            ? 'All three cards revealed. Read how each position frames its card below.'
            : `Select each face-down card to reveal it (${revealedCount}/3 revealed).`}
        </p>
        <div className="flex items-center gap-2">
          {!allRevealed && (
            <button
              type="button"
              onClick={handleRevealAllThree}
              className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-[#171717] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2"
            >
              Reveal All 3 Cards
            </button>
          )}
          {revealedCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-md border border-[#E4E4E7] bg-white px-4 py-2 text-xs font-medium text-[#171717] transition-colors hover:border-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Reset Draw</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
        {activeSlots.map((slot, idx) => {
          const isSlotRevealed = Boolean(revealed[idx] && drawnCards[idx]);
          const drawn = drawnCards[idx];
          const shortLabel = SHORT_THREE_CARD_LABELS[idx] ?? slot.name;

          return (
            <div
              key={slot.name}
              className="min-w-0 flex flex-col items-center rounded-lg border border-[#E4E4E7] bg-[#F5F5F6]/40 p-2 sm:p-4 text-center"
            >
              <div className="mb-2 sm:mb-3 w-full">
                <span className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#52525B]">
                  Position {idx + 1}
                </span>
                <h2 className="font-serif text-sm sm:text-lg font-medium text-[#171717] truncate">
                  {shortLabel}
                </h2>
              </div>

              <div className="flex w-full justify-center">
                {!isSlotRevealed ? (
                  <FaceDownCardButton
                    compact
                    buttonRef={(el) => {
                      slotButtonRefs.current[idx] = el;
                    }}
                    label={`Reveal ${slot.name} card`}
                    sublabel="Flip Card"
                    onClick={() => handleThreeCardFlip(idx)}
                  />
                ) : (
                  <TarotCardView
                    card={drawn.card}
                    isReversed={drawn.isReversed}
                    isFlipped={true}
                    size="md"
                    lang="en"
                    showDetails={false}
                    className="!w-full !h-auto max-w-[9rem] aspect-[36/58]"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {revealedCount > 0 && (
        <div
          aria-label="Revealed card meanings"
          className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-[#E4E4E7] pt-5"
        >
          {activeSlots.map((slot, idx) => {
            const isSlotRevealed = Boolean(revealed[idx] && drawnCards[idx]);
            if (!isSlotRevealed) return null;

            const drawn = drawnCards[idx];
            const evidence = getTarotEvidence(drawn.card.slug, drawn.isReversed, 'en');
            const sourceTheme = evidence?.basisText
              ? extractSourceTheme(evidence.basisText, 'en')
              : '';

            return (
              <div
                key={slot.name}
                className="flex flex-col justify-between gap-2.5 rounded-lg border border-[#E4E4E7] bg-[#F5F5F6]/40 p-4 text-left"
              >
                <div className="space-y-2">
                  <span className="block font-mono text-[11px] uppercase tracking-wider text-[#52525B]">
                    Position {idx + 1} · {slot.name}
                  </span>

                  <div className="flex items-center justify-between gap-2">
                    <h3
                      ref={(el) => {
                        slotHeadingRefs.current[idx] = el;
                      }}
                      tabIndex={-1}
                      className="font-serif text-base font-medium text-[#171717] focus:outline-none"
                    >
                      {drawn.card.nameEn}
                    </h3>
                    <span className="shrink-0 rounded border border-[#E4E4E7] bg-white px-2 py-0.5 font-mono text-[11px] text-[#171717]">
                      {drawn.isReversed ? 'Reversed' : 'Upright'}
                    </span>
                  </div>

                  <TarotEvidence
                    slug={drawn.card.slug}
                    isReversed={drawn.isReversed}
                    lang="en"
                    compact
                  />

                  <p className="rounded border border-[#E4E4E7] bg-white p-2.5 text-xs leading-relaxed text-[#52525B]">
                    <span className="font-medium text-[#171717]">Position lens: </span>
                    {slot.framing}
                  </p>

                  <p className="rounded border border-[#E4E4E7] bg-white p-2.5 text-xs leading-relaxed text-[#171717]">
                    <span className="font-medium text-[#52525B]">Site prompt: </span>
                    {sourceTheme
                      ? `What part of "${sourceTheme}" can you observe in ${slot.name}?`
                      : `Observe what stands out to you in ${slot.name} without relying on unverified card text.`}
                  </p>
                </div>

                <Link
                  href={`/en/cards/${drawn.card.slug}`}
                  className="inline-flex min-h-[44px] items-center text-xs font-medium text-[#171717] underline underline-offset-4 hover:text-[#52525B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2"
                >
                  Full {drawn.card.nameEn} meaning →
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
