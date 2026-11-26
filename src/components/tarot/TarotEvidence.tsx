'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { getTarotEvidence } from '@/lib/tarot/waite-basis';

export interface TarotEvidenceProps {
  slug: string;
  isReversed: boolean;
  lang?: 'zh' | 'en' | string;
  compact?: boolean;
  className?: string;
}

/**
 * Extracts a concise, verbatim leading clause from historical basis text
 * so reflection prompts can reference an explicit source theme without inventing meaning.
 */
export function extractSourceTheme(basisText: string, lang: 'zh' | 'en' = 'en'): string {
  const normalized = basisText.trim();
  if (!normalized) return '';

  const firstClause = normalized
    .split(/[.;。；—–,]/)
    .map((part) => part.trim())
    .find(Boolean) ?? normalized;

  if (lang === 'zh') {
    return firstClause.length > 28 ? `${firstClause.slice(0, 28).trim()}…` : firstClause;
  }

  const words = firstClause.split(/\s+/);
  if (words.length > 10) {
    return `${words.slice(0, 10).join(' ')}…`;
  }
  return firstClause;
}

export function TarotEvidence({
  slug,
  isReversed,
  lang = 'en',
  compact = false,
  className = '',
}: TarotEvidenceProps) {
  const isEn = lang === 'en';
  const normalizedLang: 'zh' | 'en' = isEn ? 'en' : 'zh';
  const evidence = getTarotEvidence(slug, isReversed, normalizedLang);
  const orientationLabel = isEn
    ? isReversed
      ? 'Reversed'
      : 'Upright'
    : isReversed
      ? '逆位'
      : '正位';

  const containerPadding = compact ? 'p-2.5 sm:p-3' : 'p-3.5 sm:p-4';

  if (!evidence || !evidence.basisText?.trim()) {
    return (
      <div
        className={`rounded-lg border border-[#E4E4E7] bg-[#F5F5F6]/70 ${containerPadding} text-left ${className}`}
      >
        <p className="font-mono text-[11px] uppercase tracking-wider text-[#52525B]">
          {isEn
            ? `Historical Card Source (${orientationLabel})`
            : `典籍牌义依据（${orientationLabel}）`}
        </p>
        <p className={`mt-1.5 leading-relaxed text-[#52525B] ${compact ? 'text-xs' : 'text-sm'}`}>
          {isEn
            ? 'No verified historical source text is available for this card orientation.'
            : '当前本地典籍库暂无该牌面此朝向的原始文献依据。'}
        </p>
      </div>
    );
  }

  const sourceLabel = evidence.sourceName?.trim() || 'A. E. Waite, The Pictorial Key to the Tarot';

  return (
    <div
      data-evidence-ref={evidence.sourceRef?.trim() || undefined}
      className={`rounded-lg border border-[#E4E4E7] bg-white ${containerPadding} text-left ${className}`}
    >
      <p className="font-mono text-[11px] uppercase tracking-wider text-[#52525B]">
        {isEn
          ? `Historical card theme (${orientationLabel} · Paraphrase)`
          : `典籍牌义主题（${orientationLabel} · 意译）`}
      </p>
      <p
        className={`mt-1.5 leading-relaxed text-[#171717] ${
          compact ? 'text-xs' : 'text-sm'
        }`}
      >
        {evidence.basisText}
      </p>
      <div className="mt-2 pt-2 border-t border-[#E4E4E7]/80">
        {evidence.sourceUrl ? (
          <a
            href={evidence.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-[#171717] underline underline-offset-4 hover:text-[#52525B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2"
          >
            <span>{sourceLabel}</span>
            <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
          </a>
        ) : (
          <span className="text-xs text-[#52525B]">{sourceLabel}</span>
        )}
      </div>
    </div>
  );
}
