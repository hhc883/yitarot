import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { buildPageAlternates } from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    alternates: buildPageAlternates(lang, '/cards'),
  };
}

export default function CardsLayout({ children }: { children: ReactNode }) {
  return children;
}
