import React from 'react';
import type { Metadata } from 'next';
import { RelationshipNetworkWidget } from '@/components/east/RelationshipNetworkWidget';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  buildBreadcrumbJsonLd,
  buildLocalizedMetadata,
  buildWebAppJsonLd
} from '@/lib/seo/metadata';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

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
    routePath: '/east/relationship-network',
    title: isEn
      ? 'Multi-Person BaZi Relationship Network - Family & Team Synastry'
      : '多人关系图谱｜家族与团队八字五行共振网络',
    description: isEn
      ? 'Map Five Elements interactions and Earthly Branch harmonies across multiple people in a family, partnership, or team.'
      : '支持多人同时合盘，直观绘制家族成员、创业团队或社交圈之间的五行互补与干支合冲关系网络。',
    keywords: isEn
      ? ['BaZi relationship network', 'Team synastry', 'Family astrology chart']
      : ['多人合盘', '团队八字匹配', '家族命理图谱']
  });
}

export default async function RelationshipNetworkPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';

  const structuredData = [
    buildBreadcrumbJsonLd(lang, [
      { name: isEn ? 'I Ching & BaZi' : '东方专厅', path: '/east' },
      { name: isEn ? 'Relationship Network' : '多人关系图谱', path: '/east/relationship-network' }
    ]),
    buildWebAppJsonLd({
      lang,
      routePath: '/east/relationship-network',
      name: isEn ? 'Multi-Person BaZi Relationship Network' : 'YiTatro 多人关系图谱',
      description: isEn ? 'Multi-person BaZi synastry network.' : '多人八字五行关系网络分析工具。'
    })
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 sm:py-16">
      <JsonLd data={structuredData} />
      <RelationshipNetworkWidget lang={lang} />
    </div>
  );
}
