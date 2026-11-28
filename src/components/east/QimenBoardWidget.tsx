'use client';

import { useEffect, useState, type FormEvent } from 'react';
import {
  calculateQimen,
  parseQimenBeijingTime,
  QIMEN_TIME_MAX,
  QIMEN_TIME_MIN,
  type QimenChartResult,
  type QimenMethod,
  type QimenPalace,
} from '@/lib/metaphysics/qimen';
import { EastAiReadingPanel } from './EastAiReadingPanel';

const PALACE_ORDER = [4, 9, 2, 3, 5, 7, 8, 1, 6];
const DIRECTION_SHORT: Record<number, string> = { 1: 'N', 2: 'SW', 3: 'E', 4: 'SE', 5: 'Center', 6: 'NW', 7: 'W', 8: 'NE', 9: 'S' };
const STEM_COLOR: Record<string, string> = {
  甲: '#16A34A', 乙: '#16A34A',
  丙: '#DC2626', 丁: '#DC2626',
  戊: '#CA8A04', 己: '#CA8A04',
  庚: '#64748B', 辛: '#64748B',
  壬: '#2563EB', 癸: '#2563EB',
};
const sectionHeading = 'font-serif text-xl font-semibold sm:text-2xl';
const buttonBase = 'min-h-11 rounded-md px-4 py-2.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900';

export function QimenBoardWidget({ lang = 'zh' }: { lang?: 'zh' | 'en' }) {
  const isEn = lang === 'en';
  const [chart, setChart] = useState<QimenChartResult | null>(null);
  const [customTime, setCustomTime] = useState('');
  const [selectedId, setSelectedId] = useState(8);
  const [hasTimeError, setHasTimeError] = useState(false);
  const [method, setMethod] = useState<QimenMethod>('zhuanpan');
  const [centerHost, setCenterHost] = useState<2 | 8 | 'auto'>(2);
  const [showColor, setShowColor] = useState(true);
  const [showHiddenStem, setShowHiddenStem] = useState(true);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const initialChart = calculateQimen(new Date(), { method: 'zhuanpan', centerHost: 2 });
      setChart((current) => current ?? initialChart);
      setCustomTime((current) => current || initialChart.time);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  function castForCurrentTime(nextMethod: QimenMethod = method, nextHost: 2 | 8 | 'auto' = centerHost) {
    const next = calculateQimen(new Date(), { method: nextMethod, centerHost: nextHost });
    setChart(next);
    setCustomTime(next.time);
    setHasTimeError(false);
  }

  function castForCustomTime(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const instant = parseQimenBeijingTime(customTime);
    setHasTimeError(!instant);
    if (instant) setChart(calculateQimen(instant, { method, centerHost }));
  }

  function handleOptionChange(nextMethod: QimenMethod, nextHost: 2 | 8 | 'auto') {
    setMethod(nextMethod);
    setCenterHost(nextHost);
    const instant = parseQimenBeijingTime(customTime);
    if (instant) {
      setChart(calculateQimen(instant, { method: nextMethod, centerHost: nextHost }));
    } else {
      castForCurrentTime(nextMethod, nextHost);
    }
  }

  const selected = chart?.palaces.find((palace) => palace.palaceId === selectedId);

  return (
    <div className="space-y-8 border-t border-neutral-200 pt-6 sm:space-y-10 sm:pt-8">
      <section aria-labelledby="qimen-cast-heading">
        <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
          <div>
            <h2 id="qimen-cast-heading" className={sectionHeading}>{isEn ? 'Chart time' : '排盘时间'}</h2>
            <div id="qimen-chart-time" role="status" className="mt-2 text-sm leading-6 text-neutral-600">
              {chart ? (
                <>
                  <time dateTime={chart.time + '+08:00'} className="tabular-nums">{chart.time.replace('T', ' ')}</time>
                  {' · '}{isEn ? 'Beijing time (UTC+08:00)' : '北京时间（UTC+08:00）'}
                </>
              ) : (isEn ? 'Preparing the chart…' : '正在排盘…')}
            </div>
          </div>
          <button type="button" onClick={() => castForCurrentTime()} className={buttonBase + ' border border-neutral-300 text-neutral-900 hover:bg-neutral-100'}>
            {isEn ? 'Cast for current time' : '按当前时间重排'}
          </button>
        </div>

        <form onSubmit={castForCustomTime} noValidate className="mt-5 rounded-lg border border-neutral-200 p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-neutral-600">{isEn ? 'Plate:' : '排盘制式：'}</span>
              {([
                ['zhuanpan', isEn ? 'Rotating (Zhuanpan)' : '转盘'],
                ['feipan', isEn ? 'Flying (Feipan)' : '飞盘（阳顺阴逆）'],
              ] as const).map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleOptionChange(val, centerHost)}
                  aria-pressed={method === val}
                  className={`rounded-md border px-2.5 py-1 font-medium transition-colors ${
                    method === val
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-neutral-600">{isEn ? 'Center Host:' : '中宫寄宫：'}</span>
              {([
                [2, isEn ? 'Kun 2' : '坤二'],
                [8, isEn ? 'Gen 8' : '艮八'],
                ['auto', isEn ? 'Auto (Yang8/Yin2)' : '阳艮阴坤'],
              ] as const).map(([val, label]) => (
                <button
                  key={String(val)}
                  type="button"
                  onClick={() => handleOptionChange(method, val)}
                  aria-pressed={centerHost === val}
                  className={`rounded-md border px-2.5 py-1 font-medium transition-colors ${
                    centerHost === val
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <label htmlFor="qimen-custom-time" className="text-sm font-medium">{isEn ? 'Choose a Beijing date and time' : '选择北京时间'}</label>
          <p id="qimen-time-help" className="mt-1 text-sm leading-6 text-neutral-600">
            {isEn ? 'Use UTC+08:00, without daylight saving time. Supported years: 1900–2100.' : '固定使用 UTC+08:00，不作夏令时换算。支持 1900—2100 年。'}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <input
              id="qimen-custom-time"
              name="time"
              type="datetime-local"
              required
              min={QIMEN_TIME_MIN}
              max={QIMEN_TIME_MAX}
              step={1}
              value={customTime}
              onChange={(event) => { setCustomTime(event.target.value); setHasTimeError(false); }}
              aria-invalid={hasTimeError || undefined}
              aria-describedby={hasTimeError ? 'qimen-time-help qimen-time-error' : 'qimen-time-help'}
              className="min-h-11 w-full min-w-0 rounded-md border border-neutral-300 bg-white px-3 py-2 text-base tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 sm:w-auto"
            />
            <button type="submit" className={buttonBase + ' bg-neutral-900 text-white hover:bg-neutral-700'}>
              {isEn ? 'Cast selected time' : '排指定时间'}
            </button>
          </div>
          {hasTimeError && (
            <p id="qimen-time-error" role="alert" className="mt-3 border-l-2 border-neutral-900 pl-3 text-sm leading-6">
              {isEn ? 'Enter a valid Beijing date and time between 1900 and 2100. The previous chart is unchanged.' : '请输入 1900—2100 年内有效的北京时间。原盘已保留。'}
            </p>
          )}
        </form>

        {chart && <ChartConfiguration chart={chart} isEn={isEn} />}
      </section>

      <section aria-labelledby="qimen-board-title">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="qimen-board-title" className={sectionHeading}>{isEn ? 'Nine palaces' : '九宫盘'}</h2>
            <p className="mt-1 text-sm leading-6 text-neutral-600">{isEn ? 'Select a palace to see its full details.' : '选择任意宫位，查看完整配置。'}</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setShowColor(v => !v)}
              className={`rounded-full border px-3 py-1 transition-colors cursor-pointer ${showColor ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300 bg-white text-neutral-500'}`}
            >
              {isEn ? 'Colors' : '颜色'}
            </button>
            <button
              type="button"
              onClick={() => setShowHiddenStem(v => !v)}
              className={`rounded-full border px-3 py-1 transition-colors cursor-pointer ${showHiddenStem ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300 bg-white text-neutral-500'}`}
            >
              {isEn ? 'Hidden Stem' : '暗干'}
            </button>
          </div>
        </div>
        <div className="mt-4 grid min-w-0 items-start gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <div id="qimen-board" role="group" aria-labelledby="qimen-board-title" className="grid min-w-0 grid-cols-3 gap-2 sm:gap-3">
            {PALACE_ORDER.map((id) => {
              const palace = chart?.palaces.find((entry) => entry.palaceId === id);
              const pressed = !!palace && selectedId === id;
              const gate = palace && (isEn ? palace.currentGateEn : palace.currentGate);
              const star = palace && (isEn ? palace.currentStarEn : palace.currentStar);
              const deity = palace && (isEn ? palace.currentDeityEn : palace.currentDeity);
              const direction = palace && (isEn ? palace.directionEn : palace.directionZh);
              return (
                <button
                  key={id}
                  type="button"
                  data-palace-id={id}
                  disabled={!palace}
                  aria-pressed={pressed}
                  aria-controls="qimen-palace-detail"
                  aria-label={palace ? [direction, id, gate].filter(Boolean).join(' · ') : undefined}
                  onClick={() => setSelectedId(id)}
                  className={`min-h-24 min-w-0 rounded-md border p-2 text-left leading-tight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 sm:min-h-28 sm:p-3 ${pressed ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300 bg-white text-neutral-900 enabled:hover:border-neutral-600 enabled:hover:bg-neutral-50'}`}
                >
                  <span className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                    <span className={pressed ? 'text-neutral-300' : 'text-neutral-500'}>{deity || `${id}宫`}</span>
                    <span className="flex items-center gap-1">
                      {palace?.isKong && <span className={`rounded px-1 text-[10px] border ${pressed ? 'border-neutral-500 text-neutral-200' : 'border-neutral-300 text-neutral-600'}`}>空</span>}
                      {palace?.isMa && <span className={`rounded px-1 text-[10px] border ${pressed ? 'border-neutral-500 text-neutral-200' : 'border-neutral-300 text-neutral-600'}`}>马</span>}
                      <span className="font-mono text-[10px] opacity-60">{palace?.bagua}</span>
                    </span>
                  </span>
                  <div className="mt-1.5 flex items-baseline justify-between gap-1 text-xs">
                    <span className={pressed ? 'text-neutral-200' : 'text-neutral-700'}>{star || (id === 5 ? '中五' : '—')}</span>
                    <span
                      className="font-serif text-base font-semibold"
                      style={!pressed && showColor && palace?.heavenStem ? { color: STEM_COLOR[palace.heavenStem] } : undefined}
                    >
                      {palace?.heavenStem || (showHiddenStem ? palace?.hiddenStem : '') || ''}
                    </span>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between gap-1 text-xs">
                    <span className="font-semibold text-sm">{gate || '—'}</span>
                    <span
                      className="font-serif text-base font-semibold"
                      style={!pressed && showColor && palace?.earthStem ? { color: STEM_COLOR[palace.earthStem] } : undefined}
                    >
                      {palace?.earthStem || '—'}
                    </span>
                  </div>
                  {showHiddenStem && palace?.hiddenStem && id !== 5 && (
                    <span className={`mt-1 block text-[10px] ${pressed ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      暗干：{palace.hiddenStem}
                    </span>
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
          <h2 id="qimen-directions" className={sectionHeading}>{isEn ? 'Three traditional favorable gates' : '传统三吉门方位'}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {['生门', '开门', '休门'].map((gate) => {
              const palace = chart.palaces.find((entry) => entry.currentGate === gate);
              if (!palace) return null;
              return (
                <div key={gate} className="rounded-md border border-neutral-200 p-4">
                  <h3 className="font-medium">{isEn ? palace.currentGateEn : palace.currentGate}</h3>
                  <p className="mt-1 text-sm leading-6 text-neutral-700">
                    {isEn ? palace.directionEn : palace.directionZh}{' · '}{isEn ? `Palace ${palace.palaceId}` : `${palace.palaceId} 宫`}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-sm leading-6 text-neutral-600">
            {isEn ? 'These are traditional labels for positions in the chart; they do not predict outcomes.' : '吉门是传统排盘中的名称，仅标示门在本盘的位置，不预测现实结果。'}
          </p>
        </section>
      )}

      {chart && (
        <EastAiReadingPanel
          kind="qimen"
          titleZh="让 AI 深度解盘"
          titleEn="AI Deep Reading"
          chartSummary={[
            `排盘时间：${chart.time}（${chart.method || 'zhuanpan'}）`,
            `节气定局：${chart.solarTermZh}（${chart.epoch}）· ${chart.dunType}${chart.juNumber}局`,
            `四柱：${chart.ganzhi.year} ${chart.ganzhi.month} ${chart.ganzhi.day} ${chart.ganzhi.hour}`,
            `值符：${chart.zhifuStar}（落${chart.zhifuPalace}宫），值使：${chart.zhishiGate}（落${chart.zhishiPalace}宫）`,
            `旬空：${(chart.xunKong || []).join('、')}，马星：${chart.maXing || ''}`,
            `九宫：${chart.palaces
              .filter((p) => p.palaceId !== 5)
              .map((p) => `${p.palaceId}宫${p.bagua}[${p.currentDeity || ''}/${p.currentStar || ''}/${p.currentGate || ''}/天${p.heavenStem || ''}地${p.earthStem}]`)
              .join('；')}`,
          ].join('\n')}
          spendType="liuyao"
          lang={lang}
          resetKey={`${chart.time}-${chart.method || 'zhuanpan'}-${chart.dunType}-${chart.juNumber}`}
        />
      )}
    </div>
  );
}

function ChartConfiguration({ chart, isEn }: { chart: QimenChartResult; isEn: boolean }) {
  const pillars = [
    [isEn ? 'Year' : '年', chart.ganzhi.year],
    [isEn ? 'Month' : '月', chart.ganzhi.month],
    [isEn ? 'Day' : '日', chart.ganzhi.day],
    [isEn ? 'Hour' : '时', chart.ganzhi.hour],
  ];
  return (
    <div id="qimen-configuration" className="mt-4 rounded-lg border border-neutral-200 p-4 sm:p-5">
      <dl className="grid grid-cols-1 gap-x-7 gap-y-4 text-sm min-[360px]:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-neutral-600">{isEn ? 'Configuration' : '局式'}</dt>
          <dd className="mt-1 font-medium">{isEn ? `${chart.dunTypeEn} · Ju ${chart.juNumber} · ${chart.epochEn}` : `${chart.dunType} · 第 ${chart.juNumber} 局 · ${chart.epoch}`}</dd>
        </div>
        <div>
          <dt className="text-neutral-600">{isEn ? 'Solar term' : '当令节气'}</dt>
          <dd className="mt-1 font-medium">{isEn ? chart.solarTermEn : chart.solarTermZh}</dd>
          <dd className="mt-1 text-xs tabular-nums text-neutral-600">
            <time dateTime={chart.solarTermStart + '+08:00'}>{chart.solarTermStart.replace('T', ' ')}</time>
          </dd>
        </div>
        <div>
          <dt className="text-neutral-600">{isEn ? 'Duty star (Zhifu)' : '值符'}</dt>
          <dd className="mt-1 font-medium">{isEn ? chart.zhifuStarEn : chart.zhifuStar} · {isEn ? `Palace ${chart.zhifuPalace}` : `${chart.zhifuPalace} 宫`}</dd>
        </div>
        <div>
          <dt className="text-neutral-600">{isEn ? 'Duty gate (Zhishi)' : '值使'}</dt>
          <dd className="mt-1 font-medium">{isEn ? chart.zhishiGateEn : chart.zhishiGate} · {isEn ? `Palace ${chart.zhishiPalace}` : `${chart.zhishiPalace} 宫`}</dd>
        </div>
      </dl>
      <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-neutral-200 pt-4 text-sm">
        {pillars.map(([label, value]) => (
          <div key={label} className="flex gap-1">
            <dt className="text-neutral-600">{label}</dt>
            <dd className="font-medium" lang={isEn ? 'zh' : undefined}>{value}</dd>
          </div>
        ))}
        <div className="flex gap-1">
          <dt className="text-neutral-600">{isEn ? 'Cycle head' : '旬首'}</dt>
          <dd className="font-medium" lang={isEn ? 'zh' : undefined}>{chart.cycleHead}</dd>
        </div>
      </dl>
      <p className="mt-4 text-sm leading-6 text-neutral-600">
        {isEn
          ? `Hourly ${chart.method === 'feipan' ? 'flying' : 'rotating'} chart, using Chaibu (solar terms and five-day cycles) with day rollover at 23:00. The central palace is hosted by palace ${chart.centerHostPalace ?? 2}.`
          : `口径：时家${chart.method === 'feipan' ? '飞盘（星门阳顺阴逆）' : '转盘'}拆补，按实际交节定节气，23:00 换日，中五寄${chart.centerHostPalace === 8 ? '艮八' : '坤二'}。`}
      </p>
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
    { label: isEn ? 'Heaven stem' : '天盘干', value: palace.heavenStem ? `${palace.heavenStem}${palace.heavenStemState ? ` (${palace.heavenStemState})` : ''}` : null, isChinese: true },
    { label: isEn ? 'Earth stem' : '地盘干', value: `${palace.earthStem}${palace.earthStemState ? ` (${palace.earthStemState})` : ''}`, isChinese: true },
    { label: isEn ? 'Hidden stem' : '暗干', value: palace.hiddenStem ?? null, isChinese: true },
  ];
  return (
    <>
      <h3 className="mt-1 font-serif text-xl font-semibold" aria-live="polite">
        {direction} · <span lang={isEn ? 'zh' : undefined}>{palace.bagua}</span>{' '}{isEn ? `Palace ${palace.palaceId}` : `${palace.palaceId} 宫`}
      </h3>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-neutral-200 py-4 text-sm">
        {attributes.map(({ label, value, isChinese }) => (
          <div key={label} className="min-w-0">
            <dt className="text-neutral-600">{label}</dt>
            <dd className="mt-1 font-medium" lang={value && isEn && isChinese ? 'zh' : undefined}>{value ?? '—'}</dd>
          </div>
        ))}
      </dl>
      {palace.companionStar && (
        <p className="mt-4 text-sm leading-6 text-neutral-700">
          {isEn ? 'Hosted center star: Tianqin' : `寄星：${palace.companionStar}`}{' · '}{isEn ? 'Stem: ' : '寄干：'}<span lang={isEn ? 'zh' : undefined}>{palace.companionStem}</span>
        </p>
      )}
      {palace.palaceId === 5 && (
        <p className="mt-4 text-sm leading-6 text-neutral-700">
          {isEn ? 'The center keeps its earth stem. Tianqin travels with Tianrui from palace 2; the center has no separate gate or deity.' : '中宫保留地盘干。天禽从坤二随天芮转动，中宫不单独排门、神。'}
        </p>
      )}
    </>
  );
}
