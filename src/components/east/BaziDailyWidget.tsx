'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { calculateDailyBaziFortune, type DailyBaziFortuneResult } from '@/lib/metaphysics/daily-bazi';

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

const inputClass = 'mt-2 min-h-11 w-full min-w-0 rounded-md border border-neutral-300 bg-white px-3 py-2 text-base tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';
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
          {isEn ? 'The form starts with an example. Enter your own date and hour to get a reading for today.' : '表单预填的是示例。输入自己的出生日期和小时，即可查看今日解读。'}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-[repeat(4,minmax(0,1fr))]">
          {FIELDS.map(({ key, en, zh, min, max }) => (
            <div key={key} className="min-w-0">
              <label htmlFor={`daily-bazi-${key}`} className="block text-sm font-medium">{isEn ? en : zh}</label>
              <input
                id={`daily-bazi-${key}`}
                name={key}
                type="number"
                inputMode="numeric"
                required
                min={min}
                max={max}
                step={1}
                value={birth[key]}
                aria-invalid={error?.field === key || undefined}
                aria-describedby={error?.field === key ? 'daily-bazi-error' : undefined}
                onChange={(event) => {
                  const value = event.target.value;
                  setBirth((current) => ({ ...current, [key]: value }));
                  if (error) setError(null);
                }}
                className={`${inputClass} ${error?.field === key ? 'border-neutral-900' : ''}`}
              />
            </div>
          ))}
        </div>
        {error && <p id="daily-bazi-error" role="alert" className="mt-4 border-l-2 border-neutral-900 pl-3 text-sm font-medium leading-6">{error.message}</p>}
        <button type="submit" className="mt-5 min-h-11 w-full rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 sm:w-auto">
          {isEn ? 'Show my daily reading' : '查看我的今日运势'}
        </button>
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
  const { queryDate, dailyTenGod, userDayMaster, todayGanZhi, elementSynergy } = fortune;
  const day = localDate(queryDate.year, queryDate.month, queryDate.day);
  const birthDate = localDate(birth.year, birth.month, birth.day);
  const birthTime = `${String(birth.hour).padStart(2, '0')}:00`;

  return (
    <>
      <div className="mt-2 space-y-1 text-sm leading-6 text-neutral-600">
        <p><time dateTime={day}>{day}</time> · {isEn ? queryDate.dayOfWeekEn : queryDate.dayOfWeekZh} · {isEn ? 'Local date' : '本地日期'}</p>
        <p>{isEn ? 'Birth details' : '出生信息'} · <time dateTime={`${birthDate}T${birthTime}`}>{birthDate} {birthTime}</time></p>
        <p>
          {isEn ? 'Calendar Pillars' : '今日干支'} · <span lang={isEn ? 'zh' : undefined}>{todayGanZhi.year}年 {todayGanZhi.month}月 {todayGanZhi.day}日</span>
          {' · '}{isEn ? 'Solar term' : '节气'} · {
            isEn && queryDate.solarTermsEn === queryDate.solarTerms
              ? <span lang="zh">{queryDate.solarTerms}</span>
              : (isEn ? queryDate.solarTermsEn : queryDate.solarTerms)
          }
        </p>
        {fortune.isLateZiHour && (
          <p className="font-medium text-neutral-900">
            {isEn
              ? `Post-23:00 Late-Zi Hour: ${fortune.currentTimeGanZhi} (${fortune.currentTimeTenGodEn}) · Next day's stem sequence active`
              : `当前处于 23:00 后晚子时：${fortune.currentTimeGanZhi}时（时干十神：${fortune.currentTimeTenGodZh}），时柱已按次日日干起推`}
          </p>
        )}
      </div>

      <div className="mt-4 rounded-md border border-neutral-200 bg-neutral-50 p-3.5 text-xs leading-5 text-neutral-700 space-y-1.5">
        <p>{isEn ? fortune.ziHourRuleEn : fortune.ziHourRuleZh}</p>
        <p>
          {isEn
            ? 'Source & scope: Calendar pillars, solar terms, and 12/13 hour pillars are computed by lunar-typescript (EightChar sect 2). Day and hour Ten Gods and Five-Element relationships are derived from the local Ten God & Five-Element lookup comparing your Day Master against the target day and hour stems. Daily scores, auspiciousness grades, dos/don’ts, lucky colors, directions, and favorable-hour rankings are omitted because they lack primary-source backing without full-chart strength and YongShen analysis.'
            : '口径与依据说明：流日干支、节气与十二/十三时辰柱由 lunar-typescript（EightChar sect 2）推算；流日与各时辰十神及五行生克关系由本地十神与五行对照表，将出生日主与目标日干及各时干逐一比对得出。本页不提供综合/分项运势打分、吉凶等级、宜忌清单或颜色/方位/吉时建议，因该类断语缺乏原典依据且未结合原局旺衰与喜用神分析。'}
        </p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="min-w-0 rounded-lg border border-neutral-200 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm text-neutral-600">{isEn ? 'Daily Ten God (Local Lookup)' : '流日十神（本地词条对照）'}</p>
              <h3 className="mt-1 font-serif text-xl font-semibold">{isEn ? dailyTenGod.nameEn : dailyTenGod.nameZh}</h3>
              <p className="mt-1 text-xs text-neutral-600">
                {isEn ? `Local Ten God lookup · ${dailyTenGod.cosmicThemeEn}` : `本地对照主题 · ${dailyTenGod.cosmicThemeZh}`}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs text-neutral-600">{isEn ? 'Target Day Pillar' : '目标流日干支'}</p>
              <p className="mt-1 font-serif text-lg font-semibold text-neutral-900" lang={isEn ? 'zh' : undefined}>
                {todayGanZhi.day}
              </p>
              <p className="text-xs text-neutral-600">
                {isEn ? `NaYin: ${todayGanZhi.naYin}` : `纳音：${todayGanZhi.naYin}`}
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-neutral-700">
            <span className="font-medium text-neutral-900">
              {isEn ? 'Local Ten God note: ' : '本地十神释义：'}
            </span>
            {isEn ? dailyTenGod.descEn : dailyTenGod.descZh}
          </p>

          <div className="mt-4 border-t border-neutral-200 pt-4 text-sm leading-6 space-y-1.5">
            <p className="font-medium text-neutral-900">
              {isEn ? 'Element Relationship Inputs' : '五行生克比对输入'}
            </p>
            <p className="text-neutral-700">
              {isEn
                ? `Your Day Master: ${userDayMaster.nameEn} (${userDayMaster.stem}, ${userDayMaster.element}) vs. Target Day Stem: ${todayGanZhi.dayStem} (${todayGanZhi.dayElement}) · Branch: ${todayGanZhi.dayBranch}`
                : `出生日主：${userDayMaster.nameZh}（${userDayMaster.stem}，五行属${userDayMaster.elementZh}）对照流日天干：${todayGanZhi.dayStem}（五行属${todayGanZhi.dayElementZh}）· 日支：${todayGanZhi.dayBranch}`}
            </p>
            <p className="font-medium text-neutral-900">{isEn ? elementSynergy.labelEn : elementSynergy.labelZh}</p>
            <p className="text-neutral-700">{isEn ? elementSynergy.descEn : elementSynergy.descZh}</p>
          </div>
        </div>

        <div className="min-w-0 rounded-lg border border-neutral-200 p-4 sm:p-5">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-serif text-xl font-semibold">{isEn ? 'Calculation Basis' : '排盘依据与口径'}</h3>
            <span className="text-xs text-neutral-600">{isEn ? 'Dated facts' : '可核验事实'}</span>
          </div>
          <dl className="mt-4 space-y-3 text-sm leading-6">
            <div>
              <dt className="font-medium text-neutral-900">{isEn ? 'Calendar Engine' : '历法与排盘引擎'}</dt>
              <dd className="text-neutral-700">
                {isEn
                  ? 'lunar-typescript (EightChar sect 2: daily pillar changes at 00:00; hour stem advances at 23:00).'
                  : 'lunar-typescript（EightChar sect 2：公历 00:00 换日柱，23:00 晚子时起次日五鼠遁时干）。'}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-neutral-900">{isEn ? 'Ten God & Element Lookup' : '十神与五行对照'}</dt>
              <dd className="text-neutral-700">
                {isEn
                  ? `Local Ten God lookup (TEN_GOD_MAP / LunarUtil.SHI_SHEN) mapping Day Master ${userDayMaster.stem} (${userDayMaster.element}) to day stem ${todayGanZhi.dayStem} (${todayGanZhi.dayElement}) and each hour stem.`
                  : `本地十神对照表（TEN_GOD_MAP / LunarUtil.SHI_SHEN），以日主 ${userDayMaster.stem}（${userDayMaster.elementZh}）对照流日天干 ${todayGanZhi.dayStem}（${todayGanZhi.dayElementZh}）及各时辰天干。`}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-neutral-900">{isEn ? 'Scope Boundary' : '推断边界'}</dt>
              <dd className="text-neutral-700">
                {isEn
                  ? 'Does not evaluate natal month-branch seasonal strength or YongShen (favorable element); therefore no fortune grades, dos/don’ts, lucky colors, or directions are claimed.'
                  : '未结合原局月令旺衰与喜用神，因此不生成运势评分、宜忌、幸运色、方位或吉凶等级。'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <section className="mt-6" aria-labelledby="daily-bazi-periods">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 id="daily-bazi-periods" className={headingClass}>{isEn ? 'Twelve time periods' : '十二时辰'}</h3>
          <span className="text-xs text-neutral-600">
            {isEn
              ? 'Daily and hourly pillars with Ten Gods relative to the Day Master (lunar-typescript EightChar sect 2 and the local Ten Gods lookup)'
              : '目标日真实时柱干支 + 相对日主十神（lunar-typescript EightChar sect 2 与本地十神对照）'}
          </span>
        </div>
        <ol id="daily-bazi-timeline" className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {fortune.hourlyTimeline.map((period) => (
            <li key={period.hourIndex} className="min-w-0 rounded-md border border-neutral-200 p-3 text-sm leading-5">
              <span className="block tabular-nums text-xs text-neutral-600">{period.timeRange}</span>
              <span className="mt-1 block font-medium text-neutral-900">
                {isEn
                  ? `${period.ganZhi} · ${period.branchNameEn}`
                  : `${period.stemName}${period.branchName}`}
              </span>
              <span className="mt-0.5 block text-xs text-neutral-700">
                {isEn ? `Ten God: ${period.tenGodEn}` : `十神：${period.tenGodZh}`}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-3 rounded-md border border-neutral-200 bg-neutral-50 p-3 text-xs leading-5 text-neutral-700">
          <span className="font-medium text-neutral-900">
            {isEn ? '23:00–23:59 Late-Zi Boundary: ' : '23:00–23:59 晚子时跨日边界：'}
          </span>
          <span>
            {isEn
              ? `${fortune.lateZiHour.ganZhi} (${fortune.lateZiHour.branchNameEn}) · Ten God: ${fortune.lateZiHour.tenGodEn} — uses next day's (${fortune.nextDayGanZhi}) stem sequence while the daily pillar remains ${todayGanZhi.day}.`
              : `${fortune.lateZiHour.stemName}${fortune.lateZiHour.branchName}（十神：${fortune.lateZiHour.tenGodZh}）—— 过 23:00 时干切换为次日【${fortune.nextDayGanZhi}】五鼠遁序列，本日日柱仍按公历 00:00 计为【${todayGanZhi.day}】。`}
          </span>
        </div>
      </section>
    </>
  );
}
