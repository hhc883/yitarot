'use client';

import { useEffect, useState } from 'react';
import { calculateQimen, type QimenChartResult, type QimenPalace } from '@/lib/metaphysics/qimen';

const PALACE_ORDER = [4, 9, 2, 3, 5, 7, 8, 1, 6];
const DIRECTION_SHORT: Record<number, string> = { 1: 'N', 2: 'SW', 3: 'E', 4: 'SE', 5: 'Center', 6: 'NW', 7: 'W', 8: 'NE', 9: 'S' };
type Cast = { chart: QimenChartResult; time: string };
const sectionHeading = 'font-serif text-xl font-semibold sm:text-2xl';

function castForLocalTime(): Cast {
  const date = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  return { chart: calculateQimen(date), time: `${day}T${time}` };
}

export function QimenBoardWidget({ lang = 'zh' }: { lang?: 'zh' | 'en' }) {
  const isEn = lang === 'en';
  const [cast, setCast] = useState<Cast | null>(null);
  const [selectedId, setSelectedId] = useState(8);

  useEffect(() => {
    // Use the visitor's current local clock, not the pre-rendering machine's clock.
    const frame = requestAnimationFrame(() => {
      const initialCast = castForLocalTime();
      setCast((current) => current ?? initialCast);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const chart = cast?.chart;
  const selected = chart?.palaces.find((palace) => palace.palaceId === selectedId);
  const pillars = [
    [isEn ? 'Year' : '年', chart?.ganzhi.year],
    [isEn ? 'Month' : '月', chart?.ganzhi.month],
    [isEn ? 'Day' : '日', chart?.ganzhi.day],
    [isEn ? 'Hour' : '时', chart?.ganzhi.hour]
  ];

  return (
    <div className="space-y-8 border-t border-neutral-200 pt-6 sm:space-y-10 sm:pt-8">
      <section aria-labelledby="qimen-cast-heading">
        <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
          <div>
            <h2 id="qimen-cast-heading" className={sectionHeading}>{isEn ? 'Current chart' : '当前排盘'}</h2>
            <div id="qimen-chart-time" role="status" className="mt-2 text-sm leading-6 text-neutral-600">
              {cast ? (
                <>
                  {isEn ? 'Local time' : '本地时间'} · <time dateTime={cast.time} className="tabular-nums">{cast.time.replace('T', ' ')}</time>
                </>
              ) : (isEn ? 'Preparing the current chart…' : '正在排出当前盘面…')}
            </div>
          </div>
          <button type="button" onClick={() => setCast(castForLocalTime())} disabled={!cast} className="min-h-11 rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 disabled:opacity-50">
            {isEn ? 'Cast for current time' : '按当前时间重排'}
          </button>
        </div>
        {chart && (
          <div className="mt-4 flex flex-wrap items-start gap-x-8 gap-y-3 rounded-lg border border-neutral-200 p-4 sm:p-5">
            <div>
              <p className="text-sm text-neutral-600">{isEn ? 'Configuration' : '局式'}</p>
              <p className="mt-1 font-medium">{isEn ? `${chart.dunTypeEn} · Ju ${chart.juNumber}` : `${chart.dunType} · 第 ${chart.juNumber} 局`}</p>
            </div>
            {chart.solarTermZh !== '冬至后阳气发萌' && (
              <div>
                <p className="text-sm text-neutral-600">{isEn ? 'Solar term' : '节气'}</p>
                <p className="mt-1 font-medium" lang={isEn ? 'zh' : undefined}>{chart.solarTermZh}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-neutral-600">{isEn ? 'Four Pillars' : '时辰四柱'}</p>
              <dl className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm">
                {pillars.map(([label, value]) => (
                  <div key={label} className="flex gap-1">
                    <dt className="text-neutral-600">{label}</dt>
                    <dd className="font-medium" lang={isEn ? 'zh' : undefined}>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}
      </section>

      <section aria-labelledby="qimen-board-title">
        <h2 id="qimen-board-title" className={sectionHeading}>{isEn ? 'Nine palaces' : '九宫盘'}</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-600">{isEn ? 'Select a palace to see its full details.' : '选择任意宫位，查看完整配置。'}</p>
        <div className="mt-4 grid min-w-0 items-start gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <div id="qimen-board" role="group" aria-labelledby="qimen-board-title" className="grid min-w-0 grid-cols-3 gap-2 sm:gap-3">
            {PALACE_ORDER.map((id) => {
              const palace = chart?.palaces.find((entry) => entry.palaceId === id);
              const pressed = !!palace && selectedId === id;
              const gate = palace && (isEn ? palace.currentGateEn : palace.currentGate);
              const direction = palace && (isEn ? palace.directionEn : palace.directionZh);
              return (
                <button
                  key={id}
                  type="button"
                  data-palace-id={id}
                  disabled={!palace}
                  aria-pressed={pressed}
                  aria-controls="qimen-palace-detail"
                  aria-label={palace ? `${direction} · ${id} · ${gate}` : undefined}
                  onClick={() => setSelectedId(id)}
                  className={`min-h-21 min-w-0 rounded-md border p-2 text-left leading-tight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 sm:min-h-24 sm:p-3 ${pressed ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300 bg-white text-neutral-900 enabled:hover:border-neutral-600 enabled:hover:bg-neutral-50'}`}
                >
                  <span className="flex flex-wrap items-center justify-between gap-1">
                    <span className="font-mono text-xs tabular-nums">{id}</span>
                    <span className={`text-xs ${pressed ? 'text-neutral-300' : 'text-neutral-600'}`}>
                      {isEn ? <><span className="sm:hidden">{DIRECTION_SHORT[id]}</span><span className="hidden sm:inline">{direction || DIRECTION_SHORT[id]}</span></> : (direction || '—')}
                    </span>
                  </span>
                  <span className="mt-1.5 block break-words text-sm font-semibold">{gate || '—'}</span>
                  {palace?.isAuspiciousGate && (
                    <span className={`mt-1 block text-xs ${pressed ? 'text-neutral-300' : 'text-neutral-600'}`}>{isEn ? 'Favorable' : '吉门'}</span>
                  )}
                </button>
              );
            })}
          </div>

          <div id="qimen-palace-detail" className="min-w-0 rounded-lg border border-neutral-200 p-4 sm:p-5">
            <p className="text-sm text-neutral-600">{isEn ? 'Selected palace' : '选中的宫位'}</p>
            {selected && <PalaceDetail palace={selected} isEn={isEn} />}
          </div>
        </div>
      </section>

      {chart && (
        <section aria-labelledby="qimen-directions" className="border-t border-neutral-200 pt-6 sm:pt-8">
          <h2 id="qimen-directions" className={sectionHeading}>{isEn ? 'Three favorable gates' : '三吉门与方位'}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {([
              {
                title: isEn ? 'Life Gate' : '生门',
                direction: isEn ? chart.bestDirections.wealthEn : chart.bestDirections.wealthZh,
                focus: isEn ? 'Trade and enterprise' : '商贸与事业'
              },
              {
                title: isEn ? 'Open Gate' : '开门',
                direction: isEn ? chart.bestDirections.careerEn : chart.bestDirections.careerZh,
                focus: isEn ? 'Projects and new starts' : '立项与新起点'
              },
              {
                title: isEn ? 'Rest Gate' : '休门',
                direction: isEn ? chart.bestDirections.negotiationEn : chart.bestDirections.negotiationZh,
                focus: isEn ? 'Dialogue and rest' : '协商与休整'
              }
            ]).map(({ title, direction, focus }) => (
              <div key={title} className="rounded-md border border-neutral-200 p-4">
                <h3 className="font-medium">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-neutral-700">{direction}</p>
                <p className="mt-1 text-sm text-neutral-600">{focus}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-neutral-600">
            {isEn ? 'Traditional maxim: in urgent situations, consult the deities; when there is time, consult the gates.' : '传统口诀：急则从神，缓则从门。'}
          </p>
        </section>
      )}
    </div>
  );
}

function PalaceDetail({ palace, isEn }: { palace: QimenPalace; isEn: boolean }) {
  const direction = isEn ? palace.directionEn : palace.directionZh;
  const attributes = [
    { label: isEn ? 'Gate' : '八门', value: isEn ? palace.currentGateEn : palace.currentGate },
    { label: isEn ? 'Star' : '九星', value: isEn ? palace.currentStarEn : palace.currentStar },
    { label: isEn ? 'Deity' : '八神', value: isEn ? palace.currentDeityEn : palace.currentDeity },
    { label: isEn ? 'Element' : '五行', value: isEn ? palace.elementEn : palace.elementZh },
    { label: isEn ? 'Heaven stem' : '天盘干', value: palace.heavenStem, isChinese: true },
    { label: isEn ? 'Earth stem' : '地盘干', value: palace.earthStem, isChinese: true }
  ];
  return (
    <>
      <h3 className="mt-1 font-serif text-xl font-semibold" aria-live="polite">
        {direction} · <span lang={isEn ? 'zh' : undefined}>{palace.bagua}</span>{' '}{isEn ? `Palace ${palace.palaceId}` : `${palace.palaceId} 宫`}
      </h3>
      <p className="mt-2 inline-flex rounded-sm border border-neutral-300 bg-neutral-50 px-2 py-1 text-sm font-medium">{isEn ? palace.qualityLevelEn : palace.qualityLevel}</p>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-neutral-200 py-4 text-sm">
        {attributes.map(({ label, value, isChinese }) => (
          <div key={label} className="min-w-0">
            <dt className="text-neutral-600">{label}</dt>
            <dd className="mt-1 font-medium" lang={isEn && isChinese ? 'zh' : undefined}>{value}</dd>
          </div>
        ))}
      </dl>
      <h4 className="mt-4 text-sm font-semibold">{isEn ? 'Traditional interpretation' : '传统解读'}</h4>
      <p className="mt-1 text-sm leading-6 text-neutral-700">{isEn ? palace.domainAdviceEn : palace.domainAdviceZh}</p>
    </>
  );
}
