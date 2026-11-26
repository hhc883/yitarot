'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { drawRandomCards, DrawnCard } from '@/lib/tarot/deck';
import { getTarotEvidence } from '@/lib/tarot/waite-basis';
import { TarotCardView } from './TarotCardView';
import { RotateCcw } from 'lucide-react';

interface WeeklyAspect {
  titleZh: string;
  titleEn: string;
  focusZh: string;
  focusEn: string;
}

const ASPECTS: WeeklyAspect[] = [
  { titleZh: '本周核心基调', titleEn: 'Theme & Anchor', focusZh: '全周能量底色与心境主线', focusEn: 'Core energetic baseline & mind' },
  { titleZh: '职场与专注', titleEn: 'Work & Mind', focusZh: '工作进度、专注力与攻坚方向', focusEn: 'Professional execution & clarity' },
  { titleZh: '情感与人际', titleEn: 'Heart & Bonds', focusZh: '亲密关系、社交互动与沟通', focusEn: 'Interpersonal warmth & connection' },
  { titleZh: '财务与物质', titleEn: 'Wealth & Stability', focusZh: '开支理财、资源调度与稳态', focusEn: 'Financial security & resources' },
  { titleZh: '破局突破口', titleEn: 'Breakthrough', focusZh: '化解阻滞的最优行动切入点', focusEn: 'Strategic pivot & action leverage' }
];

function getOrientation(isEn: boolean, isReversed: boolean) {
  return isEn ? (isReversed ? 'Reversed' : 'Upright') : (isReversed ? '逆位' : '正位');
}

export function WeeklyTarotWidget({ lang = 'zh' }: { lang?: 'zh' | 'en' }) {
  const isEn = lang === 'en';
  const [cards, setCards] = useState<DrawnCard[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    // Both server and browser start with the same five empty slots.
    const frame = requestAnimationFrame(() => setCards(drawRandomCards(5)));
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleShuffle = () => {
    setCards(drawRandomCards(5));
    setSelectedIndex(0);
  };

  const selected = cards[selectedIndex];
  const aspect = ASPECTS[selectedIndex];
  const aspectTitle = isEn ? aspect.titleEn : aspect.titleZh;
  const evidence = selected
    ? getTarotEvidence(selected.card.slug, selected.isReversed, isEn ? 'en' : 'zh')
    : undefined;
  const sourceBase = evidence
    ? (evidence.sourceName.includes('Waite') ? evidence.sourceName : `A. E. Waite · ${evidence.sourceName}`)
    : '';
  const sourceLabel = evidence
    ? (evidence.sourceRef ? `${sourceBase} · ${evidence.sourceRef}` : sourceBase)
    : '';
  const selectedName = selected ? (isEn ? selected.card.nameEn : selected.card.nameZh) : '';
  const selectedOrientation = selected ? getOrientation(isEn, selected.isReversed) : '';

  return (
    <section aria-labelledby="weekly-aspects" className="space-y-6 border-t border-neutral-200 pt-6 sm:pt-8">
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2">
        <h2 id="weekly-aspects" className="font-serif text-2xl font-semibold">{isEn ? 'Five themes' : '本周五个主题'}</h2>
        <button
          type="button"
          onClick={handleShuffle}
          disabled={!selected}
          className="inline-flex min-h-11 items-center gap-2 rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium hover:border-neutral-800 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 disabled:cursor-wait disabled:text-neutral-500"
        >
          <RotateCcw aria-hidden="true" className="size-4" />
          {isEn ? 'Redraw weekly spread' : '重抽本周牌阵'}
        </button>
      </div>

      <p className="sr-only" role="status">
        {selected
          ? `${aspectTitle}: ${selectedName} (${selectedOrientation})`
          : (isEn ? 'Preparing your five cards…' : '正在准备五张牌…')}
      </p>

      <div role="group" aria-labelledby="weekly-aspects" className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3">
        {ASPECTS.map((item, index) => {
          const drawn = cards[index];
          const title = isEn ? item.titleEn : item.titleZh;
          const name = drawn ? (isEn ? drawn.card.nameEn : drawn.card.nameZh) : '';
          const isSelected = Boolean(drawn) && selectedIndex === index;
          return (
            <button
              key={item.titleEn}
              type="button"
              disabled={!drawn}
              aria-pressed={isSelected}
              aria-controls="weekly-detail"
              onClick={() => setSelectedIndex(index)}
              className={`flex min-h-[5.5rem] min-w-0 flex-col items-start gap-1 rounded-lg border p-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 sm:min-h-[16rem] sm:items-center sm:px-2 sm:py-3 sm:text-center ${isSelected ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 bg-white text-neutral-900 hover:border-neutral-400 hover:bg-neutral-50'}`}
            >
              <span className="text-sm font-semibold leading-5">{title}</span>
              <span aria-hidden="true" className="my-1 hidden sm:block">
                {drawn ? (
                  <TarotCardView key={drawn.card.id} card={drawn.card} isReversed={drawn.isReversed} size="sm" showDetails={false} lang={lang} className="motion-reduce:[&_*]:transition-none motion-reduce:[&_*]:animate-none" />
                ) : (
                  <span className="block h-38 w-24 rounded-xl border border-neutral-200 bg-neutral-100" />
                )}
              </span>
              <span className={`[overflow-wrap:anywhere] text-xs leading-5 ${isSelected ? 'text-neutral-200' : 'text-neutral-600'}`}>
                {drawn ? name : <span aria-hidden="true" className="mt-1 block h-3 w-14 rounded bg-neutral-200" />}
              </span>
              {drawn && (
                <span className={`text-xs leading-4 ${isSelected ? 'text-neutral-200' : 'text-neutral-600'}`}>
                  {getOrientation(isEn, drawn.isReversed)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <section aria-labelledby="weekly-detail-heading" id="weekly-detail" aria-busy={!selected} className="grid items-start gap-5 rounded-lg border border-neutral-200 p-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-7 sm:p-6">
        <div className="mx-auto" aria-hidden="true">
          {selected ? (
            <TarotCardView key={selected.card.id} card={selected.card} isReversed={selected.isReversed} size="md" showDetails={false} lang={lang} className="motion-reduce:[&_*]:transition-none motion-reduce:[&_*]:animate-none" />
          ) : (
            <div className="h-58 w-36 rounded-xl border border-neutral-200 bg-neutral-100" />
          )}
        </div>
        <div className="min-w-0 space-y-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block">
              {isEn ? 'Site spread slot' : '本站牌阵位阶说明'}
            </span>
            <h3 id="weekly-detail-heading" className="font-serif text-2xl font-semibold">{aspectTitle}</h3>
            <p className="mt-1 text-sm text-neutral-600">{isEn ? aspect.focusEn : aspect.focusZh}</p>
          </div>
          {selected ? (
            <>
              <p className="font-medium">{selectedName} <span className="text-sm font-normal text-neutral-600">· {selectedOrientation}</span></p>
              <div>
                <h4 className="font-semibold">{isEn ? 'Verified card meaning' : '核验牌义'}</h4>
                {evidence ? (
                  <>
                    <p className="mt-1 text-base leading-relaxed text-neutral-700">
                      {evidence.basisText}
                    </p>
                    <p className="mt-2 text-xs text-neutral-600">
                      {isEn ? 'Original source: ' : '原始文献依据：'}
                      <a
                        href={evidence.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-900 underline underline-offset-4 hover:text-neutral-600 focus-visible:outline-2 focus-visible:outline-neutral-900"
                      >
                        {sourceLabel}
                      </a>
                    </p>
                  </>
                ) : (
                  <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                    {isEn
                      ? `No verified A. E. Waite source excerpt is currently available for ${selectedName} (${selectedOrientation}).`
                      : `暂无「${selectedName}（${selectedOrientation}）」对应的 A. E. Waite 原始文献核验释义。`}
                  </p>
                )}
                <Link
                  href={`/${isEn ? 'en' : 'zh'}/cards/${selected.card.slug}`}
                  className="mt-2 inline-flex min-h-[36px] items-center text-sm font-medium text-neutral-900 underline underline-offset-4 hover:text-neutral-600 focus-visible:outline-2 focus-visible:outline-neutral-900"
                >
                  {isEn ? `Explore ${selectedName} full meaning →` : `查看「${selectedName}」完整牌义 →`}
                </Link>
              </div>
            </>
          ) : (
            <p className="text-neutral-600">{isEn ? 'Preparing your five cards…' : '正在准备五张牌…'}</p>
          )}
        </div>
      </section>
    </section>
  );
}
