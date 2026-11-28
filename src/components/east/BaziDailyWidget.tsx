'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { calculateDailyBaziFortune, type DailyBaziFortuneResult } from '@/lib/metaphysics/daily-bazi';
import { ELEMENT_COLORS, STEMS_MAP, BRANCHES_MAP } from '@/lib/metaphysics/bazi';
import { DateTimePickerPopover } from './DateTimePickerPopover';

const EXAMPLE = { year: '1996', month: '8', day: '18', hour: '12' };
type BirthInput = typeof EXAMPLE;
type BirthField = keyof BirthInput;
type ValidationError = { field: BirthField; message: string };
type Reading = { fortune: DailyBaziFortuneResult; birth: BirthInput; isExample: boolean };

const FIELDS = [
  { key: 'year', en: 'Birth year', zh: '出生年', min: 1920, max: 2035 },
  { key: 'month', en: 'Birth month', zh: '出生月', min: 1, max: 12 },
  { key: 'day', en: 'Birth day', zh: '出生日', min: 1, max: 31 },
  { key: 'hour', en: 'Birth hour (0–23)', zh: '出生小时（0–23）', min: 0, max: 23 }
] as const;

const ZH_ELEMENT_KEY: Record<string, keyof typeof ELEMENT_COLORS> = {
  木: 'Wood',
  火: 'Fire',
  土: 'Earth',
  金: 'Metal',
  水: 'Water',
};

function renderGanZhiColored(ganzhi: string) {
  return (
    <span className="inline-flex items-center font-serif font-semibold">
      {Array.from(ganzhi).map((ch, idx) => {
        const el = STEMS_MAP[ch]?.element || BRANCHES_MAP[ch]?.element || ZH_ELEMENT_KEY[ch];
        return (
          <span key={`${ch}-${idx}`} style={el ? { color: ELEMENT_COLORS[el] } : undefined}>
            {ch}
          </span>
        );
      })}
    </span>
  );
}

function getScoreColorClass(score: number) {
  if (score >= 82) return 'text-emerald-600';
  if (score >= 74) return 'text-amber-600';
  return 'text-rose-600';
}

const headingClass = 'font-serif text-xl font-semibold text-neutral-900 sm:text-2xl';

function localDate(year: string | number, month: string | number, day: string | number) {
  return [year, String(month).padStart(2, '0'), String(day).padStart(2, '0')].join('-');
}

function getReading(birth: BirthInput, isExample: boolean): Reading {
  return {
    fortune: calculateDailyBaziFortune(Number(birth.year), Number(birth.month), Number(birth.day), Number(birth.hour)),
    birth,
    isExample
  };
}

function validateBirth(birth: BirthInput, isEn: boolean): ValidationError | null {
  for (const { key, en, zh, min, max } of FIELDS) {
    const value = Number(birth[key]);
    if (!/^\d+$/.test(birth[key]) || !Number.isInteger(value) || value < min || value > max) {
      return {
        field: key,
        message: isEn ? `${en}: enter a whole number from ${min} to ${max}.` : `${zh}请输入 ${min} 至 ${max} 之间的整数。`
      };
    }
  }
  const year = Number(birth.year);
  const month = Number(birth.month);
  const day = Number(birth.day);
  const calendar = new Date(Date.UTC(year, month - 1, day));
  if (calendar.getUTCMonth() !== month - 1 || calendar.getUTCDate() !== day) {
    return {
      field: 'day',
      message: isEn ? 'That birth date is not valid. Check the day for this month and year.' : '这个出生日期不存在，请核对该年月对应的日期。'
    };
  }
  return null;
}

export function BaziDailyWidget({ lang = 'zh' }: { lang?: 'zh' | 'en' }) {
  const isEn = lang === 'en';
  const [birth, setBirth] = useState<BirthInput>(EXAMPLE);
  const [reading, setReading] = useState<Reading | null>(null);
  const [error, setError] = useState<ValidationError | null>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const focusResult = useRef(false);

  useEffect(() => {
    // Determine the calendar day on the device, never while pre-rendering the route.
    const frame = requestAnimationFrame(() => {
      const example = getReading(EXAMPLE, true);
      setReading((current) => current ?? example);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!focusResult.current) return;
    focusResult.current = false;
    resultHeading.current?.focus();
  }, [reading]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateBirth(birth, isEn);
    if (validation) {
      setError(validation);
      return;
    }
    setError(null);
    focusResult.current = true;
    setReading(getReading(birth, false));
  }

  return (
    <div className="space-y-9 border-t border-neutral-200 pt-6 sm:space-y-12 sm:pt-8">
      <form noValidate onSubmit={handleSubmit} aria-labelledby="daily-bazi-birth" className="max-w-4xl">
        <h2 id="daily-bazi-birth" className={headingClass}>{isEn ? 'Birth details' : '出生信息'}</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-600">
          {isEn ? 'The form starts with an example. Pick your birth date and hour to get a reading for today.' : '表单预填的是示例。点击下方按钮弹窗选择出生日期与时辰，即可查看今日解读。'}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <DateTimePickerPopover
            year={Number(birth.year) || 1996}
            month={Number(birth.month) || 8}
            day={Number(birth.day) || 18}
            hour={Number(birth.hour) || 12}
            isEn={isEn}
            onChange={(y, m, d, h) => {
              const nextBirth: BirthInput = {
                year: String(y),
                month: String(m),
                day: String(d),
                hour: String(h),
              };
              setBirth(nextBirth);
              setError(null);
              setReading(getReading(nextBirth, false));
            }}
          />
          <button type="submit" className="min-h-10 rounded-lg bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 cursor-pointer">
            {isEn ? 'Show my daily reading' : '查看我的今日运势'}
          </button>
        </div>
        {error && <p id="daily-bazi-error" role="alert" className="mt-4 border-l-2 border-neutral-900 pl-3 text-sm font-medium leading-6">{error.message}</p>}
      </form>

      <section id="daily-bazi-result" aria-labelledby="daily-bazi-result-heading" className="border-t border-neutral-200 pt-6 sm:pt-8">
        <h2 id="daily-bazi-result-heading" ref={resultHeading} tabIndex={-1} className={`scroll-mt-24 ${headingClass}`}>
          {reading?.isExample ? (isEn ? 'Example reading' : '示例解读') : (isEn ? 'Today’s reading' : '今日解读')}
        </h2>
        {reading ? <BaziReading reading={reading} isEn={isEn} /> : (
          <p role="status" className="mt-3 min-h-24 text-sm leading-6 text-neutral-600">{isEn ? 'Preparing the example reading…' : '正在准备示例解读…'}</p>
        )}
      </section>
    </div>
  );
}

function BaziReading({ reading, isEn }: { reading: Reading; isEn: boolean }) {
  const { fortune, birth } = reading;
  const { queryDate, scores, dailyTenGod, userDayMaster, todayGanZhi, elementSynergy, dosAndDonts, luckyGuides } = fortune;
  const day = localDate(queryDate.year, queryDate.month, queryDate.day);
  const birthDate = localDate(birth.year, birth.month, birth.day);
  const birthTime = `${String(birth.hour).padStart(2, '0')}:00`;
  const measures = [
    [isEn ? 'Career' : '事业', scores.career],
    [isEn ? 'Wealth' : '财富', scores.wealth],
    [isEn ? 'Relationships' : '情感', scores.romance],
    [isEn ? 'Well-being' : '身心', scores.wellness]
  ] as const;
  const pointers = [
    [isEn ? 'Supportive direction' : '贵人方位', isEn ? luckyGuides.directionEn : luckyGuides.directionZh],
    [isEn ? 'Suggested colors' : '参考色系', isEn ? luckyGuides.colorEn : luckyGuides.colorZh],
    [isEn ? 'Favorable hours' : '参考时段', isEn ? luckyGuides.timeWindowEn : luckyGuides.timeWindowZh],
    [isEn ? 'Mindset' : '心态提示', isEn ? luckyGuides.mindsetEn : luckyGuides.mindsetZh]
  ] as const;

  return (
    <>
      <div className="mt-2 space-y-1 text-sm leading-6 text-neutral-600">
        <p><time dateTime={day}>{day}</time> · {isEn ? queryDate.dayOfWeekEn : queryDate.dayOfWeekZh} · {isEn ? 'Local date' : '本地日期'}</p>
        <p>{isEn ? 'Birth details' : '出生信息'} · <time dateTime={`${birthDate}T${birthTime}`}>{birthDate} {birthTime}</time></p>
        <p>
          {isEn ? 'Day Pillar' : '今日干支'} · <span lang={isEn ? 'zh' : undefined}>{renderGanZhiColored(todayGanZhi.day)}</span>
          {' · '}{isEn ? 'Solar term' : '节气'} · {
            isEn && queryDate.solarTermsEn === queryDate.solarTerms
              ? <span lang="zh">{queryDate.solarTerms}</span>
              : (isEn ? queryDate.solarTermsEn : queryDate.solarTerms)
          }
        </p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="min-w-0 rounded-lg border border-neutral-200 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm text-neutral-600">{isEn ? 'Daily influence (Ten Gods)' : '流日十神'}</p>
              <h3 className="mt-1 font-serif text-xl font-semibold text-neutral-900">{isEn ? dailyTenGod.nameEn : dailyTenGod.nameZh}</h3>
              <p className="mt-1 text-sm text-neutral-600">{isEn ? dailyTenGod.cosmicThemeEn : dailyTenGod.cosmicThemeZh}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600">{isEn ? 'Overall score' : '综合评分'}</p>
              <p className={`mt-1 font-serif text-xl font-semibold tabular-nums ${getScoreColorClass(scores.overall)}`}>{scores.overall} <span className="text-sm text-neutral-600">/ 100</span></p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-neutral-700">{isEn ? dailyTenGod.descEn : dailyTenGod.descZh}</p>
          <div className="mt-4 border-t border-neutral-200 pt-4 text-sm leading-6">
            <p>{isEn ? 'Day Master' : '日主'} · <span className="font-medium">{isEn ? userDayMaster.nameEn : renderGanZhiColored(userDayMaster.nameZh)}</span></p>
            <p className="font-medium text-neutral-900">{isEn ? elementSynergy.labelEn : elementSynergy.labelZh}</p>
            <p className="text-neutral-700">{isEn ? elementSynergy.descEn : elementSynergy.descZh}</p>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-neutral-200 pt-4 text-sm sm:grid-cols-4">
            {measures.map(([label, score]) => (
              <div key={label}>
                <dt className="text-neutral-600">{label}</dt>
                <dd className={`mt-1 font-medium tabular-nums ${getScoreColorClass(score)}`}>{score} / 100</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="min-w-0 rounded-lg border border-neutral-200 p-4 sm:p-5">
          <h3 className="font-serif text-xl font-semibold">{isEn ? 'Today’s pointers' : '今日参考'}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[
              [isEn ? 'Consider' : '宜', isEn ? dosAndDonts.dosEn : dosAndDonts.dos, 'text-emerald-700'],
              [isEn ? 'Avoid' : '忌', isEn ? dosAndDonts.dontsEn : dosAndDonts.donts, 'text-rose-700']
            ].map(([label, items, labelColor]) => (
              <div key={String(label)}>
                <h4 className={`text-sm font-semibold ${labelColor}`}>{label}</h4>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-sm leading-5 text-neutral-700">
                  {Array.isArray(items) && items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-neutral-200 pt-4 text-sm">
            {pointers.map(([label, value]) => (
              <div key={label}>
                <dt className="font-medium">{label}</dt>
                <dd className="mt-1 text-neutral-700">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <section className="mt-6" aria-labelledby="daily-bazi-periods">
        <h3 id="daily-bazi-periods" className={headingClass}>{isEn ? 'Twelve time periods' : '十二时辰'}</h3>
        <ol id="daily-bazi-timeline" className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {fortune.hourlyTimeline.map((period) => {
            const branchChar = period.branchName.charAt(0);
            const branchEl = BRANCHES_MAP[branchChar]?.element;
            return (
              <li key={period.hourIndex} className={`min-w-0 rounded-md border p-3 text-sm leading-5 ${period.isFavorable ? 'border-neutral-300 bg-neutral-50' : 'border-neutral-200'}`}>
                <span className="block tabular-nums text-neutral-600">{period.timeRange}</span>
                <span className="mt-1 block font-serif font-semibold">
                  {isEn ? period.branchNameEn : (
                    <>
                      <span style={branchEl ? { color: ELEMENT_COLORS[branchEl] } : undefined}>{branchChar}</span>
                      <span>{period.branchName.slice(1)}</span>
                    </>
                  )}
                </span>
                <span className={`block font-medium tabular-nums ${getScoreColorClass(period.score)}`}>{period.score} / 100</span>
                <span className={`mt-1 block text-xs ${period.isFavorable ? 'text-emerald-700' : 'text-neutral-600'}`}>{isEn ? period.verdictEn : period.verdict}</span>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}
