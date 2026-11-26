import type { Metadata } from 'next';
import { buildPageAlternates } from '@/lib/seo/metadata';

export { default } from '../ziwei/page';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    alternates: buildPageAlternates(lang, '/east/ziwei'),
  };
}
