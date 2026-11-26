import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSpreadById } from '@/lib/tarot/spreads';
import { READING_COST } from '@/lib/points/constants';
import {
  CelticCrossDiagram,
  CelticCrossPositionItem
} from '@/components/tarot/CelticCrossDiagram';

const PAGE_PATH = '/en/spreads/celtic-cross';

const CELTIC_CROSS_EN_DETAILS: Array<{
  name: string;
  description: string;
}> = [
  {
    name: 'The Present Heart',
    description:
      'The core state, primary atmosphere, and central focal point of your inquiry right now.'
  },
  {
    name: 'The Cross / Obstacle',
    description:
      'The immediate friction, unexpected challenge, or catalyst directly crossing the center.'
  },
  {
    name: 'The Foundation',
    description:
      'Subconscious roots, deep motivations, and historical seeds beneath the current situation.'
  },
  {
    name: 'The Recent Past',
    description:
      'Events that recently transpired whose ripples still shape what is unfolding today.'
  },
  {
    name: 'Higher Consciousness',
    description:
      'Your conscious aims, aspirations, and the best outcome you are actively envisioning.'
  },
  {
    name: 'Near Future',
    description:
      'The next phase of developments and emerging themes entering your path.'
  },
  {
    name: 'Self-Perception',
    description:
      'How you see your own role, attitude, and agency within this unfolding situation.'
  },
  {
    name: 'External Environment',
    description:
      'Influences from surrounding people, workplace dynamics, family, or broader conditions.'
  },
  {
    name: 'Hopes & Fears',
    description:
      'Deepest inner longings, subtle anxieties, and unspoken expectations shaping your perspective.'
  },
  {
    name: 'Final Culmination',
    description:
      'The comprehensive synthesis and longer-term resolution as all ten influences converge.'
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
  const title = 'Celtic Cross Tarot Spread — 10-Position Diagram & Guide';
  const ogTitle = `${title} | YiTatro`;
  const description =
    'Explore the classic 10-card Celtic Cross tarot spread with an interactive Cross and Staff diagram, full position-by-position meanings, and an example reading.';

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

export default async function CelticCrossSpreadPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== 'en') {
    notFound();
  }

  const spread = getSpreadById('celtic_cross');
  const positions: CelticCrossPositionItem[] = (spread?.positions || []).map((pos, idx) => ({
    number: idx + 1,
    name: CELTIC_CROSS_EN_DETAILS[idx]?.name || pos.enName,
    group: idx < 6 ? 'Cross' : 'Staff',
    description: CELTIC_CROSS_EN_DETAILS[idx]?.description || ''
  }));

  return (
    <div lang="en" className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12 text-[#171717]">
      <header className="mb-6 sm:mb-8 text-center max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#171717] mb-2.5">
          Celtic Cross Tarot Spread
        </h1>
        <p className="text-sm text-[#52525B] leading-relaxed">
          Select a position to see what each of the ten cards represents in the Celtic Cross.
        </p>
      </header>

      <CelticCrossDiagram positions={positions} />

      {/* Server-rendered indexable list of all 10 positions */}
      <section
        aria-labelledby="celtic-positions-heading"
        className="mt-10 rounded-xl border border-[#E4E4E7] bg-white p-5 sm:p-6"
      >
        <h2
          id="celtic-positions-heading"
          className="font-serif text-xl sm:text-2xl font-normal text-[#171717] mb-4"
        >
          All 10 Celtic Cross Positions Explained
        </h2>
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-3 list-none p-0 m-0">
          {positions.map((pos) => (
            <li
              key={pos.number}
              className="rounded-lg border border-[#E4E4E7] bg-[#F5F5F6]/40 p-3.5 text-sm"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-medium text-[#171717]">
                  {pos.number}. {pos.name}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#52525B]">
                  {pos.group}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-[#52525B]">
                {pos.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="celtic-example-heading"
        className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="rounded-xl border border-[#E4E4E7] bg-white p-5 sm:p-6 space-y-3">
          <h2 className="font-serif text-xl font-normal text-[#171717]">
            How to Read the Cross &amp; Staff
          </h2>
          <p className="text-sm leading-relaxed text-[#52525B]">
            Start with the <strong>Cross (Positions 1–6)</strong> to understand the immediate tension between what sits at the heart of the matter (1) and what crosses it (2), anchored by subconscious roots (3), recent past (4), conscious aim (5), and near-term movement (6).
          </p>
          <p className="text-sm leading-relaxed text-[#52525B]">
            Then read the <strong>Staff (Positions 7–10)</strong> from bottom to top: your inner stance (7), external conditions (8), hopes and fears (9), and the overall synthesis (10).
          </p>
        </div>

        <div className="rounded-xl border border-[#E4E4E7] bg-[#F5F5F6]/50 p-5 sm:p-6 space-y-3">
          <h2
            id="celtic-example-heading"
            className="font-serif text-xl font-normal text-[#171717]"
          >
            Example: A Career Change
          </h2>
          <p className="text-sm leading-relaxed text-[#52525B]">
            Suppose <strong>Position 1 (Present Heart)</strong> holds the <em>Eight of Cups</em> and <strong>Position 2 (Obstacle)</strong> holds the <em>Four of Pentacles</em>: you feel ready to outgrow a familiar role, yet fear of losing financial predictability holds you back.
          </p>
          <p className="text-sm leading-relaxed text-[#52525B]">
            If <strong>Position 7 (Self-Perception)</strong> shows <em>The Chariot</em> and <strong>Position 10 (Final Culmination)</strong> shows the <em>Three of Wands</em>, the spread highlights that disciplined preparation—not impulsive leaping—turns restlessness into sustainable expansion.
          </p>
        </div>
      </section>

      {/* AI Reading CTA */}
      <section
        aria-labelledby="celtic-ai-heading"
        className="mt-8 rounded-xl border border-[#171717]/20 bg-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="space-y-1 max-w-xl">
          <h2
            id="celtic-ai-heading"
            className="font-serif text-lg font-normal text-[#171717]"
          >
            Run a Full 10-Card AI Celtic Cross Reading
          </h2>
          <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed">
            Start a guided 10-card Celtic Cross AI interpretation tailored to your question. Requires sign-in and {READING_COST} points per reading.
          </p>
        </div>
        <Link
          href="/en/reading?spread=celtic_cross"
          className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-md bg-[#171717] px-5 py-2.5 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2"
        >
          Start Celtic Cross Reading →
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
            href="/en/spreads"
            className="inline-flex min-h-[44px] items-center rounded-md border border-[#E4E4E7] px-4 py-2 text-[#171717] hover:border-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2"
          >
            Spread Library
          </Link>
          <Link
            href="/en/one-card-tarot"
            className="inline-flex min-h-[44px] items-center rounded-md border border-[#E4E4E7] px-4 py-2 text-[#171717] hover:border-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2"
          >
            One Card Tarot
          </Link>
          <Link
            href="/en/spreads/three-card"
            className="inline-flex min-h-[44px] items-center rounded-md border border-[#E4E4E7] px-4 py-2 text-[#171717] hover:border-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2"
          >
            3 Card Tarot Reading
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
