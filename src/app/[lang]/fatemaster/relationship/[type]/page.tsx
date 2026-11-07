import React from 'react';
import { notFound } from 'next/navigation';
import { RELATIONSHIP_CONFIGS, RelationshipType } from '@/lib/metaphysics/relationship';
import { RelationshipSynastryWidget } from '@/components/fatemaster/RelationshipSynastryWidget';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const instant = false;

export async function generateStaticParams() {
  const types = Object.keys(RELATIONSHIP_CONFIGS);
  const params: { lang: string; type: string }[] = [];
  ['zh', 'en'].forEach(lang => {
    types.forEach(t => {
      params.push({ lang, type: t });
    });
  });
  return params;
}

export default async function SpecificRelationshipPage({
  params
}: {
  params: Promise<{ lang: string; type: string }>;
}) {
  const { lang: rawLang, type: rawType } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const type = rawType as RelationshipType;

  if (!RELATIONSHIP_CONFIGS[type]) {
    notFound();
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* 返回全系中心导航 */}
      <div className="mb-6">
        <Link
          href={`/${lang}/fatemaster/relationship`}
          className="inline-flex items-center gap-1.5 text-xs font-serif text-[#736B5E] hover:text-[#111111] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'en' ? 'All Relationships' : '返回关系合盘中心'}</span>
        </Link>
      </div>

      <RelationshipSynastryWidget initialType={type} lang={lang} />
    </div>
  );
}
