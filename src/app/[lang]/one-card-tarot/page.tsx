import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FreeTarotDrawWidget } from '@/components/tarot/FreeTarotDrawWidget';
import { getSiteUrl } from '@/lib/seo/site-url';

const PAGE_PATH = '/en/one-card-tarot';

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

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}${PAGE_PATH}`;
  const title = 'Free One Card Tarot Reading — Daily Reflection & Focus';
  const ogTitle = `${title} | YiTatro`;
  const description =
    'Draw one free Rider-Waite tarot card for focused daily reflection. Set an optional question, reveal upright or reversed meaning, and explore thoughtful reflection prompts.';

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

export default async function OneCardTarotPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== 'en') {
    notFound();
  }

  return (
    <div lang="en" className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-12 text-[#171717]">
      <header className="mb-6 sm:mb-8 text-center max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#171717] mb-2.5">
          One Card Tarot Reading
        </h1>
        <p className="text-sm text-[#52525B] leading-relaxed">
          Think of a question, then draw one card to explore its meaning and find a prompt for reflection.
        </p>
      </header>

      <FreeTarotDrawWidget mode="one-card" />

      <section
        aria-labelledby="one-card-how-heading"
        className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="rounded-xl border border-[#E4E4E7] bg-white p-5 sm:p-6 space-y-3">
          <h2
            id="one-card-how-heading"
            className="font-serif text-xl font-normal text-[#171717]"
          >
            Why Draw One Card?
          </h2>
          <p className="text-sm leading-relaxed text-[#52525B]">
            A one-card tarot reading distills a situation down to a single symbol. It does not predict the future or force a Yes/No answer—it offers a clear mirror for your mindset, blind spot, or next step.
          </p>
          <p className="text-sm leading-relaxed text-[#52525B]">
            If you want to trace how an issue evolved over time, try a{' '}
            <Link
              href="/en/spreads/three-card"
              className="text-[#171717] underline underline-offset-4 hover:text-[#52525B]"
            >
              3 Card Tarot Reading
            </Link>
            . For binary decisions, visit{' '}
            <Link
              href="/en/yes-no"
              className="text-[#171717] underline underline-offset-4 hover:text-[#52525B]"
            >
              Yes / No Tarot
            </Link>
            .
          </p>
        </div>

        <div className="rounded-xl border border-[#E4E4E7] bg-[#F5F5F6]/50 p-5 sm:p-6 space-y-3">
          <h2 className="font-serif text-xl font-normal text-[#171717]">
            Example Reflection
          </h2>
          <p className="text-xs font-mono uppercase tracking-wider text-[#52525B]">
            Question: &ldquo;What am I overlooking in this situation?&rdquo;
          </p>
          <p className="text-sm leading-relaxed text-[#171717]">
            <strong>Drawn Card: The Hermit (Upright)</strong>
          </p>
          <p className="text-sm leading-relaxed text-[#52525B]">
            Instead of chasing an immediate answer, The Hermit invites you to pause and step back from outside noise. Its reflection prompt asks what you already know beneath the rush, helping you act with clarity instead of pressure.
          </p>
        </div>
      </section>

      <nav
        aria-label="Related tarot tools and guides"
        className="mt-10 rounded-xl border border-[#E4E4E7] bg-white p-5 sm:p-6"
      >
        <h2 className="font-serif text-lg font-normal text-[#171717] mb-3">
          Explore More Tarot Tools &amp; Guides
        </h2>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link
            href="/en/spreads/three-card"
            className="inline-flex min-h-[44px] items-center rounded-md border border-[#E4E4E7] px-4 py-2 text-[#171717] hover:border-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2"
          >
            3 Card Tarot Reading
          </Link>
          <Link
            href="/en/spreads/celtic-cross"
            className="inline-flex min-h-[44px] items-center rounded-md border border-[#E4E4E7] px-4 py-2 text-[#171717] hover:border-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2"
          >
            Celtic Cross Spread Guide
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
