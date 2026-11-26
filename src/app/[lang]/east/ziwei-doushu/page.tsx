export { default } from '../ziwei/page';

import type { Metadata } from 'next';
import { buildLocalizedMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';
  return buildLocalizedMetadata({
    lang,
    routePath: '/east/ziwei',
    title: isEn ? 'Ziwei Dou Shu Natal Chart' : '紫微斗数排盘｜十二命宫与十四主星',
    description: isEn ? 'Traditional Ziwei Dou Shu star chart mapping 12 life palaces.' : '排定传统紫微斗数十二宫命盘与十四主星格局。'
  });
}

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}
