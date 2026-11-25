'use client';

import { useEffect, useState, type FormEvent } from 'react';
import {
  calculateQimen,
  parseQimenBeijingTime,
  QIMEN_TIME_MAX,
  QIMEN_TIME_MIN,
  type QimenChartResult,
  type QimenPalace,
  type QimenYimaInfo,
} from '@/lib/metaphysics/qimen';

const PALACE_ORDER = [4, 9, 2, 3, 5, 7, 8, 1, 6];
const DIRECTION_SHORT: Record<number, string> = { 1: 'N', 2: 'SW', 3: 'E', 4: 'SE', 5: 'Center', 6: 'NW', 7: 'W', 8: 'NE', 9: 'S' };
const sectionHeading = 'font-serif text-xl font-semibold sm:text-2xl';
const buttonBase = 'min-h-11 rounded-md px-4 py-2.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900';

export function QimenBoardWidget({ lang = 'zh' }: { lang?: 'zh' | 'en' }) {
  const isEn = lang === 'en';
  const [chart, setChart] = useState<QimenChartResult | null>(null);
  const [customTime, setCustomTime] = useState('');
  const [selectedId, setSelectedId] = useState(8);
  const [hasTimeError, setHasTimeError] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const initialChart = calculateQimen();
      setChart((current) => current ?? initialChart);
      setCustomTime((current) => current || initialChart.time);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  function castForCurrentTime() {
    const next = calculateQimen();
    setChart(next);
    setCustomTime(next.time);
    setHasTimeError(false);
  }

  function castForCustomTime(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const instant = parseQimenBeijingTime(customTime);
    setHasTimeError(!instant);
    if (instant) setChart(calculateQimen(instant));
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
          <button type="button" onClick={castForCurrentTime} className={buttonBase + ' border border-neutral-300 text-neutral-900 hover:bg-neutral-100'}>
            {isEn ? 'Cast for current time' : '按当前时间重排'}
          </button>
        </div>

        <form onSubmit={castForCustomTime} noValidate className="mt-5 rounded-lg border border-neutral-200 p-4 sm:p-5">
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
                  aria-label={palace ? [direction, id, gate].filter(Boolean).join(' · ') : undefined}
                  onClick={() => setSelectedId(id)}
                  className={`min-h-21 min-w-0 rounded-md border p-2 text-left leading-tight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 sm:min-h-24 sm:p-3 ${pressed ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300 bg-white text-neutral-900 enabled:hover:border-neutral-600 enabled:hover:bg-neutral-50'}`}
                >
                  <span className="flex flex-wrap items-center justify-between gap-1">
                    <span className="font-mono text-xs tabular-nums">{id}</span>
                    <span className={`text-xs ${pressed ? 'text-neutral-300' : 'text-neutral-600'}`}>
                      {isEn ? <><span className="sm:hidden">{DIRECTION_SHORT[id]}</span><span className="hidden sm:inline">{direction || DIRECTION_SHORT[id]}</span></> : (direction || '—')}
                    </span>
                  </span>
                  <span className="mt-1.5 block break-words text-sm font-semibold">{gate || (palace && id === 5 ? palace.earthStem : '—')}</span>
                  {palace?.isAuspiciousGate && (
                    <span className={`mt-1 block text-xs ${pressed ? 'text-neutral-300' : 'text-neutral-600'}`}>{isEn ? 'Traditional favorable gate' : '传统吉门'}</span>
                  )}
                  {palace && (palace.xunkongBranches.length > 0 || palace.yimaBranch) && (
                    <span className={`mt-1 flex flex-wrap gap-1 text-[11px] ${pressed ? 'text-neutral-200' : 'text-neutral-700'}`}>
                      {palace.xunkongBranches.length > 0 && (
                        <span className="rounded border border-current/25 px-1 py-0.5">
                          {isEn ? `Void ${palace.xunkongBranchesEn.join(', ')}` : `旬空 ${palace.xunkongBranches.join('、')}`}
                        </span>
                      )}
                      {palace.yimaBranch && (
                        <span className="rounded border border-current/25 px-1 py-0.5">
                          {isEn ? `Yima ${palace.yimaBranchEn}` : `驿马 ${palace.yimaBranch}`}
                        </span>
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div id="qimen-palace-detail" className="min-w-0 rounded-lg border border-neutral-200 p-4 sm:p-5">
            <p className="text-sm text-neutral-600">{isEn ? 'Selected palace' : '选中的宫位'}</p>
            {selected && <PalaceDetail palace={selected} yima={chart?.yima} isEn={isEn} />}
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
          <dt className="text-neutral-600">{isEn ? 'Hour cycle head' : '时旬首'}</dt>
          <dd className="font-medium" lang={isEn ? 'zh' : undefined}>{chart.hourCycleHead}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="text-neutral-600">{isEn ? 'Hour Xunkong' : '时旬空'}</dt>
          <dd className="font-medium">{isEn ? chart.hourXunkongEn.join(', ') : chart.hourXunkong.join('、')}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="text-neutral-600">{isEn ? 'Day cycle head (epoch)' : '日旬首（定三元）'}</dt>
          <dd className="font-medium" lang={isEn ? 'zh' : undefined}>{chart.dayCycleHead}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="text-neutral-600">{isEn ? 'Day Xunkong (ref.)' : '日旬空（参考）'}</dt>
          <dd className="font-medium">{isEn ? chart.dayXunkongEn.join(', ') : chart.dayXunkong.join('、')}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="text-neutral-600">{isEn ? 'Hour Yima' : '时支驿马'}</dt>
          <dd className="font-medium">
            {isEn
              ? `${chart.yima.branchEn} · Palace ${chart.yima.palace} (${chart.yima.hourBranchEn}, ${chart.yima.sanheGroupEn} → ${chart.yima.branchEn})`
              : `${chart.yima.branch} · ${chart.yima.palace} 宫（时支${chart.yima.hourBranch}，${chart.yima.sanheGroup}→${chart.yima.branch}）`}
          </dd>
        </div>
      </dl>
      <p className="mt-4 text-sm leading-6 text-neutral-600">
        {isEn
          ? 'Hourly rotating chart, using Chaibu (solar terms and five-day cycles) with day rollover at 23:00 and center hosted by Kun (palace 2). Xunkong and Post Horse (Yima) on the palaces follow the hour pillar; the day pillar and day cycle head are used only for the five-day epoch. Other conventions may give different results.'
          : '口径：时家转盘拆补，按实际交节定节气，23:00 换日，中五寄坤二。本盘旬空与驿马均按时柱（时旬空、时支三合安马）入宫；日柱及其旬首仅用于拆补定三元符头。其他排盘法的结果可能不同。'}
      </p>
    </div>
  );
}

function PalaceDetail({ palace, yima, isEn }: { palace: QimenPalace; yima?: QimenYimaInfo; isEn: boolean }) {
  const direction = isEn ? palace.directionEn : palace.directionZh;
  const xunkongValue = palace.xunkongBranches.length
    ? (isEn ? palace.xunkongBranchesEn.join(', ') : palace.xunkongBranches.join('、'))
    : '—';
  const yimaValue = palace.yimaBranch
    ? (yima
        ? (isEn ? `${palace.yimaBranchEn} (${yima.sanheGroupEn} → ${yima.branchEn})` : `${palace.yimaBranch}（${yima.sanheGroup}→${yima.branch}）`)
        : (isEn ? palace.yimaBranchEn : palace.yimaBranch))
    : '—';
  const attributes = [
    { label: isEn ? 'Gate' : '八门', value: isEn ? palace.currentGateEn : palace.currentGate },
    { label: isEn ? 'Star' : '九星', value: isEn ? palace.currentStarEn : palace.currentStar },
    { label: isEn ? 'Deity' : '八神', value: isEn ? palace.currentDeityEn : palace.currentDeity },
    { label: isEn ? 'Element' : '五行', value: isEn ? palace.elementEn : palace.elementZh },
    { label: isEn ? 'Heaven stem' : '天盘干', value: palace.heavenStem, isChinese: true },
    { label: isEn ? 'Earth stem' : '地盘干', value: palace.earthStem, isChinese: true },
    { label: isEn ? 'Hour Xunkong' : '时旬空', value: xunkongValue },
    { label: isEn ? 'Hour Yima' : '时支驿马', value: yimaValue },
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
