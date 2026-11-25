'use client';

import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type { AlmanacDay, AlmanacHour, AlmanacPurpose, AlmanacSearch, AlmanacStatus } from '@/lib/metaphysics/almanac';

const COPY = {
  zh: {
    formTitle: '选择事项与日期范围',
    purpose: '事项',
    purposes: { moving: '入宅搬家', opening: '开业', contract: '签约' },
    start: '开始日期',
    end: '结束日期',
    range: '选择 1900—2100 年的公历日期，一次最多查 31 天，含起止日。',
    find: '查看候选日期',
    loading: '正在查询黄历…',
    errors: {
      start: '请输入有效的开始日期。',
      end: '请输入有效的结束日期。',
      reversed: '结束日期不能早于开始日期。',
      span: '一次最多查询 31 天（含起止日）。',
      failed: '暂时无法加载黄历。请重试。',
    },
    results: '黄历查询结果',
    status: { candidate: '可考虑', conditional: '需看条件', caution: '慎用', unlisted: '未列明' },
    statusHelp: {
      candidate: '黄历列有相符宜项，未列相符忌项。',
      conditional: '黄历同时列有相符宜项和忌项，两者均保留。',
      caution: '黄历列有相符忌项，未列相符宜项。',
      unlisted: '未找到与此事项相符的宜忌，不能据此判断适合。',
    },
    favorable: '宜',
    unfavorable: '忌',
    count: (n: number) => `共 ${n} 天`,
    overview: (n: number) => `已查 ${n} 天，结果仅供传统文化参考。`,
    disclaimer: '结果依据传统黄历条目，不保证现实结果，也未结合个人生辰。实际安排请以安全、可用时间和现实条件为准。',
    info: '干支、建除和冲生肖仅展示黄历资料，不参与候选分类。「签约」参考传统的「立券」和「交易」，不等同于对现代合同的判断。',
    pillar: '日干支',
    officer: '建除值日',
    zodiac: '冲生肖',
    expandHours: '展开 12 时辰宜忌',
    collapseHours: '收起时辰宜忌',
    hoursHeading: '当日 12 时辰传统宜忌',
    hoursUnlisted: '未列所选事项（不作吉论）',
    ziConvention: '子时口径：按 lunar-typescript 传统历法，00:00–00:59（早子时）随当日日柱，丑至亥为 01:00–22:59；23:00–23:59（晚子时）按 23:00 换日计入次日日柱，可在次日早子时查看。',
    hourSuffix: '时',
    hourLoadFailed: '暂时无法加载时辰宜忌。',
  },
  en: {
    formTitle: 'Choose an activity and date range',
    purpose: 'Activity',
    purposes: { moving: 'Moving into a home', opening: 'Opening a business', contract: 'Signing a contract' },
    start: 'Start date',
    end: 'End date',
    range: 'Use Gregorian dates from 1900 to 2100. Each search covers up to 31 days, including both dates.',
    find: 'Find dates',
    loading: 'Checking the almanac…',
    errors: {
      start: 'Enter a valid start date.',
      end: 'Enter a valid end date.',
      reversed: 'The end date cannot be earlier than the start date.',
      span: 'Search up to 31 days, including both dates.',
      failed: 'The almanac could not load. Please try again.',
    },
    results: 'Almanac results',
    status: { candidate: 'Worth considering', conditional: 'Mixed indications', caution: 'Use caution', unlisted: 'Not listed' },
    statusHelp: {
      candidate: 'The almanac favors a matching activity and lists no matching caution.',
      conditional: 'The almanac both favors and cautions against matching activities. Both entries are shown.',
      caution: 'The almanac cautions against a matching activity and lists no matching favorable entry.',
      unlisted: 'The almanac has no matching entry. This does not mean the day is suitable.',
    },
    favorable: 'Favors',
    unfavorable: 'Cautions against',
    count: (n: number) => `${n} ${n === 1 ? 'day' : 'days'}`,
    overview: (n: number) => `${n} ${n === 1 ? 'day checked' : 'days checked'} for cultural reference.`,
    disclaimer: 'This tool compares traditional almanac entries without using birth details. It does not predict real outcomes. Plan around safety, availability, and practical needs.',
    info: 'The day pillar, day officer, and zodiac clash are shown for reference only; they do not affect the grouping. For contract signing, the tool uses the traditional entries for making an agreement and conducting trade as approximate matches.',
    pillar: 'Day pillar',
    officer: 'Day officer',
    zodiac: 'Zodiac clash',
    expandHours: 'Show 12-hour details',
    collapseHours: 'Hide 12-hour details',
    hoursHeading: '12 traditional hours',
    hoursUnlisted: 'Selected activity not listed (not treated as favorable)',
    ziConvention: 'Zi-hour convention: following lunar-typescript, 00:00–00:59 (early Zi) uses this date’s day pillar and Chou–Hai cover 01:00–22:59. 23:00–23:59 (late Zi) rolls over to the next day’s pillar and appears under the next date’s Zi hour.',
    hourSuffix: '',
    hourLoadFailed: 'Could not load hourly indications.',
  },
};

const EN_EVIDENCE = { 入宅: 'Moving into a home', 移徙: 'Relocating', 开市: 'Opening a business', 立券: 'Making an agreement', 交易: 'Conducting trade' };
const EN_OFFICER: Record<string, string> = { 建: 'Establish', 除: 'Remove', 满: 'Full', 平: 'Balance', 定: 'Settle', 执: 'Hold', 破: 'Break', 危: 'Danger', 成: 'Success', 收: 'Receive', 开: 'Open', 闭: 'Close' };
const EN_ZODIAC: Record<string, string> = { 鼠: 'Rat', 牛: 'Ox', 虎: 'Tiger', 兔: 'Rabbit', 龙: 'Dragon', 蛇: 'Snake', 马: 'Horse', 羊: 'Goat', 猴: 'Monkey', 鸡: 'Rooster', 狗: 'Dog', 猪: 'Pig' };
const STEMS: Record<string, string> = { 甲: 'Jia', 乙: 'Yi', 丙: 'Bing', 丁: 'Ding', 戊: 'Wu', 己: 'Ji', 庚: 'Geng', 辛: 'Xin', 壬: 'Ren', 癸: 'Gui' };
const BRANCHES: Record<string, string> = { 子: 'Zi', 丑: 'Chou', 寅: 'Yin', 卯: 'Mao', 辰: 'Chen', 巳: 'Si', 午: 'Wu', 未: 'Wei', 申: 'Shen', 酉: 'You', 戌: 'Xu', 亥: 'Hai' };
const GROUPS: AlmanacStatus[] = ['candidate', 'conditional', 'caution', 'unlisted'];
const FIELD = 'mt-2 min-h-11 w-full min-w-0 rounded-md border border-neutral-300 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 aria-invalid:border-neutral-900';
const DATE_MIN = '1900-01-01';
const DATE_MAX = '2100-12-31';

type SearchError = Extract<AlmanacSearch, { ok: false }>['error'] | 'failed';
type Results = { purpose: AlmanacPurpose; start: string; end: string; days: AlmanacDay[] };

export function AlmanacWidget({ lang }: { lang: 'zh' | 'en' }) {
  const isEn = lang === 'en';
  const copy = COPY[lang];
  const [purpose, setPurpose] = useState<AlmanacPurpose>('moving');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [results, setResults] = useState<Results | null>(null);
  const [error, setError] = useState<SearchError | null>(null);
  const [pending, setPending] = useState(false);
  const [expandedHours, setExpandedHours] = useState<Record<string, AlmanacHour[]>>({});
  const [openDates, setOpenDates] = useState<Record<string, boolean>>({});
  const [hourErrorDate, setHourErrorDate] = useState<string | null>(null);
  const inFlight = useRef(false);
  const invalidStart = error === 'start';
  const invalidEnd = error === 'end' || error === 'reversed' || error === 'span';

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    if (!start || !end) {
      setError(!start ? 'start' : 'end');
      return;
    }

    inFlight.current = true;
    setError(null);
    setPending(true);
    try {
      const { searchAlmanacDates } = await import('@/lib/metaphysics/almanac');
      const found = searchAlmanacDates(purpose, start, end);
      if (found.ok) {
        setResults({ purpose, start, end, days: found.days });
        setExpandedHours({});
        setOpenDates({});
        setHourErrorDate(null);
      } else {
        setError(found.error);
      }
    } catch {
      setError('failed');
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  async function toggleHours(dateStr: string) {
    if (!results) return;
    if (openDates[dateStr]) {
      setOpenDates((prev) => ({ ...prev, [dateStr]: false }));
      return;
    }
    setHourErrorDate(null);
    if (!expandedHours[dateStr]) {
      try {
        const { getAlmanacDayHours } = await import('@/lib/metaphysics/almanac');
        const found = getAlmanacDayHours(results.purpose, dateStr);
        if (!found.ok) {
          setHourErrorDate(dateStr);
          return;
        }
        setExpandedHours((prev) => ({ ...prev, [dateStr]: found.hours }));
      } catch {
        setHourErrorDate(dateStr);
        return;
      }
    }
    setOpenDates((prev) => ({ ...prev, [dateStr]: true }));
  }

  return (
    <div className="space-y-7 border-t border-neutral-200 pt-6 sm:pt-8">
      <form id="almanac-form" aria-labelledby="almanac-form-title" noValidate onSubmit={submit}>
        <fieldset disabled={pending} className="min-w-0 rounded-lg border border-neutral-200 p-4 sm:p-6">
          <legend id="almanac-form-title" className="px-2 font-serif text-xl font-semibold sm:text-2xl">{copy.formTitle}</legend>
          <div className="grid min-w-0 gap-4 sm:grid-cols-3">
            <label htmlFor="almanac-purpose" className="block min-w-0 text-sm font-medium">
              {copy.purpose}
              <select id="almanac-purpose" value={purpose} onChange={(event) => setPurpose(event.target.value as AlmanacPurpose)} className={FIELD}>
                {Object.entries(copy.purposes).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <label htmlFor="almanac-start" className="block min-w-0 text-sm font-medium">
              {copy.start}
              <input
                id="almanac-start"
                type="date"
                min={DATE_MIN}
                max={DATE_MAX}
                required
                value={start}
                aria-invalid={invalidStart || undefined}
                aria-describedby={invalidStart ? 'almanac-range almanac-error' : 'almanac-range'}
                onChange={(event) => { setStart(event.target.value); setError(null); }}
                className={FIELD}
              />
            </label>
            <label htmlFor="almanac-end" className="block min-w-0 text-sm font-medium">
              {copy.end}
              <input
                id="almanac-end"
                type="date"
                min={DATE_MIN}
                max={DATE_MAX}
                required
                value={end}
                aria-invalid={invalidEnd || undefined}
                aria-describedby={invalidEnd ? 'almanac-range almanac-error' : 'almanac-range'}
                onChange={(event) => { setEnd(event.target.value); setError(null); }}
                className={FIELD}
              />
            </label>
          </div>
          <p id="almanac-range" className="mt-3 text-sm leading-6 text-neutral-600">{copy.range}</p>
          {error && (
            <p id="almanac-error" role="alert" className="mt-3 border-l-2 border-neutral-900 bg-neutral-50 px-3 py-2 text-sm leading-6 text-neutral-900">{copy.errors[error]}</p>
          )}
          <button type="submit" className="mt-4 min-h-11 w-full rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 disabled:opacity-60 sm:w-auto">
            {copy.find}
          </button>
        </fieldset>
      </form>

      <p role="status" className="sr-only">{pending ? copy.loading : results ? copy.overview(results.days.length) : ''}</p>
      {pending && <p aria-hidden="true" className="text-sm text-neutral-600">{copy.loading}</p>}
      {results && (
        <section id="almanac-results" aria-labelledby="almanac-results-title" className="space-y-5">
          <div className="border-b border-neutral-200 pb-4">
            <h2 id="almanac-results-title" className="font-serif text-2xl font-semibold">{copy.results}</h2>
            <p className="mt-1 text-sm leading-6 text-neutral-600">
              {copy.purposes[results.purpose]} · <time dateTime={results.start}>{results.start}</time>
              {results.start !== results.end && <> – <time dateTime={results.end}>{results.end}</time></>}
              {' · '}{copy.count(results.days.length)}
            </p>
          </div>
          {GROUPS.map((status) => {
            const group = results.days.filter((day) => day.status === status);
            if (!group.length) return null;
            return (
              <section key={status} aria-labelledby={`almanac-group-${status}`}>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 id={`almanac-group-${status}`} className="font-serif text-xl font-semibold">{copy.status[status]}</h3>
                  <span className="text-sm text-neutral-600">{copy.count(group.length)}</span>
                </div>
                <p className="mt-1 text-sm leading-6 text-neutral-600">{copy.statusHelp[status]}</p>
                <ul className="mt-3 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.map((day) => {
                    const isOpen = !!openDates[day.date];
                    const hours = expandedHours[day.date];
                    const hoursId = `almanac-hours-${day.date}`;
                    return (
                      <li key={day.date} data-almanac-date={day.date} data-almanac-status={day.status} className="min-w-0 rounded-lg border border-neutral-200 p-4">
                        <time dateTime={day.date} className="font-semibold tabular-nums">{day.date}</time>
                        {!!(day.favorable.length || day.unfavorable.length) && (
                          <ul className="mt-2 space-y-1 text-sm leading-6">
                            {!!day.favorable.length && <li><strong>{copy.favorable}:</strong> {day.favorable.map((entry) => isEn ? EN_EVIDENCE[entry] : entry).join(isEn ? '; ' : '、')}</li>}
                            {!!day.unfavorable.length && <li><strong>{copy.unfavorable}:</strong> {day.unfavorable.map((entry) => isEn ? EN_EVIDENCE[entry] : entry).join(isEn ? '; ' : '、')}</li>}
                          </ul>
                        )}
                        <dl className="mt-3 grid gap-1 border-t border-neutral-200 pt-3 text-sm leading-6 text-neutral-600">
                          <div className="flex flex-wrap gap-x-2">
                            <dt>{copy.pillar}</dt>
                            <dd>{isEn ? `${STEMS[day.dayPillar[0]]} ${BRANCHES[day.dayPillar[1]]}` : day.dayPillar}</dd>
                          </div>
                          <div className="flex flex-wrap gap-x-2">
                            <dt>{copy.officer}</dt><dd>{isEn ? EN_OFFICER[day.dayOfficer] : day.dayOfficer}</dd>
                          </div>
                          <div className="flex flex-wrap gap-x-2">
                            <dt>{copy.zodiac}</dt><dd>{isEn ? EN_ZODIAC[day.conflictingZodiac] : day.conflictingZodiac}</dd>
                          </div>
                        </dl>
                        <div className="mt-3 border-t border-neutral-200 pt-3">
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            aria-controls={hoursId}
                            onClick={() => toggleHours(day.date)}
                            className="min-h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-left text-xs font-medium text-neutral-900 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                          >
                            {isOpen ? copy.collapseHours : copy.expandHours}
                          </button>
                          {hourErrorDate === day.date && (
                            <p role="alert" className="mt-2 text-xs text-neutral-900">{copy.hourLoadFailed}</p>
                          )}
                          {isOpen && hours && (
                            <div id={hoursId} className="mt-3 space-y-2 border-t border-neutral-200 pt-3">
                              <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-700">{copy.hoursHeading}</h4>
                              <ul className="space-y-2 text-xs leading-5">
                                {hours.map((hour) => (
                                  <li key={hour.branch + hour.minHm} className="rounded border border-neutral-200 p-2">
                                    <div className="flex flex-wrap items-center justify-between gap-1 font-medium text-neutral-900">
                                      <span>
                                        {isEn ? BRANCHES[hour.branch] : `${hour.branch}${copy.hourSuffix}`}
                                        {' · '}
                                        <span className="tabular-nums text-neutral-600">{hour.minHm}–{hour.maxHm}</span>
                                        {' · '}
                                        {isEn ? `${STEMS[hour.pillar[0]]} ${BRANCHES[hour.pillar[1]]}` : hour.pillar}
                                      </span>
                                      <span className="rounded border border-neutral-300 px-1.5 py-0.5 text-[11px] text-neutral-800">
                                        {copy.status[hour.status]}
                                      </span>
                                    </div>
                                    {hour.favorable.length || hour.unfavorable.length ? (
                                      <div className="mt-1 space-y-0.5 text-neutral-700">
                                        {!!hour.favorable.length && (
                                          <p><strong>{copy.favorable}:</strong> {hour.favorable.map((entry) => isEn ? EN_EVIDENCE[entry] : entry).join(isEn ? '; ' : '、')}</p>
                                        )}
                                        {!!hour.unfavorable.length && (
                                          <p><strong>{copy.unfavorable}:</strong> {hour.unfavorable.map((entry) => isEn ? EN_EVIDENCE[entry] : entry).join(isEn ? '; ' : '、')}</p>
                                        )}
                                      </div>
                                    ) : (
                                      <p className="mt-1 text-neutral-600">{copy.hoursUnlisted}</p>
                                    )}
                                  </li>
                                ))}
                              </ul>
                              <p className="text-xs leading-5 text-neutral-600">{copy.ziConvention}</p>
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </section>
      )}

      <div className="space-y-2 border-t border-neutral-200 pt-4 text-sm leading-6 text-neutral-600">
        <p>{copy.disclaimer}</p>
        <p>{copy.info}</p>
      </div>
    </div>
  );
}
