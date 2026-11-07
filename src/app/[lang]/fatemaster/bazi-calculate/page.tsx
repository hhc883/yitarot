import React from 'react';
import { BaziChartGsap } from '@/components/fatemaster/BaziChartGsap';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export default async function BaziCalculatePage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 sm:py-16">
      <BaziChartGsap />
    </div>
  );
}
