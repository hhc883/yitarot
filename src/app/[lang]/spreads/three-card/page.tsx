import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSpreadById } from '@/lib/tarot/spreads';
import { READING_COST } from '@/lib/points/constants';
import { FreeTarotDrawWidget, SpreadSlotMeta } from '@/components/tarot/FreeTarotDrawWidget';

const PAGE_PATH = '/en/spreads/three-card';

const THREE_CARD_FRAMING: Array<{
  name: string;
  framing: string;
  description: string;
}> = [
  {
    name: 'Past Foundation',
    framing:
      'In the Past position, this card highlights the background influences, habits, or prior choices that shaped where you stand now.',
    description: 'Past roots, foundational experiences, or prior influences shaping the present.'
  },
  {
    name: 'Present Situation',
    framing:
      'In the Present position, this card mirrors the active tension, immediate focus, and energy available to you right now.',
    description: 'Current circumstances, active dynamics, and the immediate landscape you face.'
  },
  {
    name: 'Future Trajectory',
    framing:
      'In the Future position, this card points to a likely direction or theme to watch if current momentum continues—not a fixed outcome.',
    description: 'The emerging direction and next theme to consider as things unfold.'
  }
];

export async function generateStaticParams() {
  return [{ lang: 'en' }];
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (lang !== 'en') {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yitarot.net';
  const pageUrl = `${siteUrl}${PAGE_PATH}`;
  const title = 'Free 3 Card Tarot Reading — Past, Present & Future';
  const ogTitle = `${title} | YiTatro`;
  const description =
    'Draw three free tarot cards in the classic Past, Present, and Future layout. Flip each card at your own pace, read upright or reversed meanings, and see how each position frames the story.';

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: {
        en: pageUrl
      }
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      alternateLocale: [],
      url: pageUrl,
      siteName: 'YiTatro',
      title: ogTitle,
      description
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description
    }
  };
}

export default async function ThreeCardSpreadPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== 'en') {
    notFound();
  }

  const spread = getSpreadById('three_cards');
  const slots: SpreadSlotMeta[] = (spread?.positions || []).map((pos, idx) => ({
    index: pos.index,
    name: THREE_CARD_FRAMING[idx]?.name || pos.enName,
    framing: THREE_CARD_FRAMING[idx]?.framing || '',
    description: THREE_CARD_FRAMING[idx]?.description || pos.enName
  }));

  return (
    <div lang="en" className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12 text-[#171717]">
      <header className="mb-6 sm:mb-8 text-center max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#171717] mb-2.5">
          3 Card Tarot Reading: Past, Present &amp; Future
        </h1>
        <p className="text-sm text-[#52525B] leading-relaxed">
          Flip three cards to explore what shaped your situation, where you stand, and what to consider next.
        </p>
      </header>

      <FreeTarotDrawWidget mode="three-card" slots={slots} />

      <section
        aria-labelledby="three-card-guide-heading"
        className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="rounded-xl border border-[#E4E4E7] bg-white p-5 sm:p-6 space-y-4">
          <h2
            id="three-card-guide-heading"
            className="font-serif text-xl font-normal text-[#171717]"
          >
            How the Three Positions Work
          </h2>
          <ol className="space-y-3 list-none p-0 m-0">
            {slots.map((slot, idx) => (
              <li
                key={slot.name}
                className="rounded-lg border border-[#E4E4E7] bg-[#F5F5F6]/50 p-3 text-sm"
              >
                <div className="font-medium text-[#171717]">
                  {idx + 1}. {slot.name}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-[#52525B]">
                  {slot.framing}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-xl border border-[#E4E4E7] bg-[#F5F5F6]/50 p-5 sm:p-6 space-y-3">
          <h2 className="font-serif text-xl font-normal text-[#171717]">
            Example Reading
          </h2>
          <p className="text-xs text-[#52525B]">
            A three-card spread maps momentum for reflection—not a fixed prediction of fate.
          </p>
          <ul className="space-y-2 text-sm text-[#171717] list-none p-0 m-0">
            <li>
              <strong>Past — Eight of Pentacles (Upright):</strong> Steady skill-building and quiet repetition laid your current groundwork.
            </li>
            <li>
              <strong>Present — Two of Swords (Reversed):</strong> Hesitation is lifting; a decision you postponed now asks for honest clarity.
            </li>
            <li>
              <strong>Future — Ace of Wands (Upright):</strong> If you commit to a clear choice, fresh creative momentum is ready to open up.
            </li>
          </ul>
        </div>
      </section>

      {/* Optional & separate AI reading CTA */}
      <section
        aria-labelledby="three-card-ai-heading"
        className="mt-8 rounded-xl border border-[#171717]/20 bg-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="space-y-1 max-w-xl">
          <h2
            id="three-card-ai-heading"
            className="font-serif text-lg font-normal text-[#171717]"
          >
            Personalized AI Reading
          </h2>
          <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed">
            Start an AI-assisted Past, Present, Future session. Requires sign-in and {READING_COST} points, and begins a separate draw (cards from this free pull cannot be carried over).
          </p>
        </div>
        <Link
          href="/en/reading?spread=three_cards"
          className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-md bg-[#171717] px-5 py-2.5 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2"
        >
          Open AI 3-Card Reading →
        </Link>
      </section>

      <nav
        aria-label="Related tarot tools and guides"
        className="mt-8 rounded-xl border border-[#E4E4E7] bg-white p-5 sm:p-6"
      >
        <h2 className="font-serif text-lg font-normal text-[#171717] mb-3">
          Explore More Tarot Tools &amp; Guides
        </h2>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link
            href="/en/one-card-tarot"
            className="inline-flex min-h-[44px] items-center rounded-md border border-[#E4E4E7] px-4 py-2 text-[#171717] hover:border-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2"
          >
            One Card Tarot
          </Link>
          <Link
            href="/en/spreads/celtic-cross"
            className="inline-flex min-h-[44px] items-center rounded-md border border-[#E4E4E7] px-4 py-2 text-[#171717] hover:border-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2"
          >
            Celtic Cross Spread
          </Link>
          <Link
            href="/en/spreads"
            className="inline-flex min-h-[44px] items-center rounded-md border border-[#E4E4E7] px-4 py-2 text-[#171717] hover:border-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2"
          >
            Spread Library
          </Link>
          <Link
            href="/en/cards"
            className="inline-flex min-h-[44px] items-center rounded-md border border-[#E4E4E7] px-4 py-2 text-[#171717] hover:border-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2"
          >
            78 Tarot Card Meanings
          </Link>
          <Link
            href="/en/west"
            className="inline-flex min-h-[44px] items-center rounded-md border border-[#E4E4E7] px-4 py-2 text-[#171717] hover:border-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2"
          >
            Tarot Hub
          </Link>
        </div>
      </nav>
    </div>
  );
}
