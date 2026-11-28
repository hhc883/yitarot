'use client';

import { useEffect, useState, type FormEvent } from 'react';
import {
  calculateLiuren,
  getTwelveChangShengForStem,
  TIAN_JIANG_SHORT,
  type LiurenChartResult,
  type LiurenOptions,
} from '@/lib/metaphysics/liuren';
import { parseQimenBeijingTime, QIMEN_TIME_MAX, QIMEN_TIME_MIN } from '@/lib/metaphysics/qimen';
import { EastAiReadingPanel } from './EastAiReadingPanel';

const sectionHeading = 'font-serif text-xl font-semibold sm:text-2xl';
const buttonBase =
  'min-h-11 rounded-md px-4 py-2.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900';

const BRANCHES_12 = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;
const WUXING_COLOR: Record<string, string> = {
  子: '#2563EB', 亥: '#2563EB',
  寅: '#16A34A', 卯: '#16A34A',
  巳: '#DC2626', 午: '#DC2626',
  申: '#64748B', 酉: '#64748B',
  辰: '#CA8A04', 戌: '#CA8A04', 丑: '#CA8A04', 未: '#CA8A04',
  甲: '#16A34A', 乙: '#16A34A',
  丙: '#DC2626', 丁: '#DC2626',
  戊: '#CA8A04', 己: '#CA8A04',
  庚: '#64748B', 辛: '#64748B',
  壬: '#2563EB', 癸: '#2563EB',
};

export function LiurenBoardWidget({ lang = 'zh' }: { lang?: 'zh' | 'en' }) {
  const isEn = lang === 'en';
  const [chart, setChart] = useState<LiurenChartResult | null>(null);
  const [customTime, setCustomTime] = useState('');
  const [castTab, setCastTab] = useState<'time' | 'number'>('time');
  const [numberVal, setNumberVal] = useState<number>(8);
  const [dayMode, setDayMode] = useState<'auto' | 'day' | 'night'>('auto');
  const [guiRenRule, setGuiRenRule] = useState<'jia_wu_geng_niu_yang' | 'jia_yang_wu_geng_niu'>(
    'jia_wu_geng_niu_yang'
  );
  const [sheHaiRule, setSheHaiRule] = useState<'depth' | 'meng_zhong_ji'>('depth');
  const [customYueJiang, setCustomYueJiang] = useState<string>('');
  const [showColor, setShowColor] = useState(true);
  const [hasTimeError, setHasTimeError] = useState(false);
  const [bottomTab, setBottomTab] = useState<'keyi' | 'shensha' | 'changsheng'>('keyi');
  const [changShengStem, setChangShengStem] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const buildOptions = (overrides?: Partial<LiurenOptions> & { tab?: 'time' | 'number' }): LiurenOptions => {
    const activeTab = overrides?.tab ?? castTab;
    return {
      isDayOverride: dayMode === 'auto' ? undefined : dayMode === 'day',
      guiRenRule,
      sheHaiRule,
      customYueJiang: customYueJiang || undefined,
      numberCast: activeTab === 'number' ? numberVal : undefined,
      ...overrides,
    };
  };

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const initial = calculateLiuren();
      setChart((curr) => curr ?? initial);
      setCustomTime((curr) => curr || initial.time);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  function recalculate(targetDate?: Date, overrides?: Partial<LiurenOptions> & { tab?: 'time' | 'number' }) {
    const instant = targetDate ?? parseQimenBeijingTime(customTime) ?? new Date();
    const next = calculateLiuren(instant, buildOptions(overrides));
    setChart(next);
    setCustomTime(next.time);
    setHasTimeError(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const instant = parseQimenBeijingTime(customTime);
    setHasTimeError(!instant);
    if (instant) {
      recalculate(instant);
    }
  }

  const slotAt = (earthBranch: string) =>
    chart?.palaces.find((p) => p.earthBranch === earthBranch);

  // 经典大六壬四边环形天地盘排布：
  // 顶行：巳 午 未 申（遁干与天将在上）
  // 中上：辰 (左) / 酉 (右)（遁干与天将在外侧）
  // 中下：卯 (左) / 戌 (右)（遁干与天将在外侧）
  // 底行：寅 丑 子 亥（遁干与天将在下）
  const renderRingCell = (
    earthBranch: string,
    side: 'top' | 'bottom' | 'left' | 'right' = 'top'
  ) => {
    const slot = slotAt(earthBranch);
    if (!slot || !chart) return null;
    const jiangShort = TIAN_JIANG_SHORT[slot.tianJiang] || slot.tianJiang[0];
    const ganLabel = slot.tianGan ?? '◎';
    const isHighlighted =
      slot.heavenBranch === chart.ganzhi.day[1] || slot.earthBranch === chart.dayStemPalace;

    const branchNode = (
      <span
        className={`inline-flex h-7 w-7 items-center justify-center rounded font-serif text-lg font-semibold ${
          isHighlighted ? 'border border-neutral-800 bg-neutral-50' : ''
        }`}
        style={showColor ? { color: WUXING_COLOR[slot.heavenBranch] } : undefined}
        title={`地盘${slot.earthBranch} · 天盘${slot.heavenBranch}${slot.isKong ? '（旬空）' : ''}`}
      >
        {slot.heavenBranch}
      </span>
    );

    if (side === 'left') {
      return (
        <div key={earthBranch} className="flex items-center justify-center gap-1.5 py-1">
          <span className="w-4 text-center text-xs text-neutral-400">{ganLabel}</span>
          <span className="w-4 text-center text-xs font-medium text-neutral-700">{jiangShort}</span>
          {branchNode}
        </div>
      );
    }
    if (side === 'right') {
      return (
        <div key={earthBranch} className="flex items-center justify-center gap-1.5 py-1">
          {branchNode}
          <span className="w-4 text-center text-xs font-medium text-neutral-700">{jiangShort}</span>
          <span className="w-4 text-center text-xs text-neutral-400">{ganLabel}</span>
        </div>
      );
    }
    if (side === 'bottom') {
      return (
        <div key={earthBranch} className="flex flex-col items-center justify-center gap-0.5 py-1">
          {branchNode}
          <span className="text-xs font-medium text-neutral-700">{jiangShort}</span>
          <span className="text-xs text-neutral-400">{ganLabel}</span>
        </div>
      );
    }
    return (
      <div key={earthBranch} className="flex flex-col items-center justify-center gap-0.5 py-1">
        <span className="text-xs text-neutral-400">{ganLabel}</span>
        <span className="text-xs font-medium text-neutral-700">{jiangShort}</span>
        {branchNode}
      </div>
    );
  };

  return (
    <div className="space-y-8 border-t border-neutral-200 pt-6 sm:space-y-10 sm:pt-8">
      <section aria-labelledby="liuren-cast-heading">
        <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
          <div>
            <h2 id="liuren-cast-heading" className={sectionHeading}>
              {isEn ? 'Cast Settings' : '起课设置'}
            </h2>
            <div className="mt-2 text-sm leading-6 text-neutral-600">
              {chart ? (
                <>
                  <time dateTime={chart.time + '+08:00'} className="tabular-nums">
                    {chart.time.replace('T', ' ')}
                  </time>
                  {' · '}
                  {isEn ? 'Beijing time (UTC+08:00)' : '北京时间（UTC+08:00）'}
                </>
              ) : (
                '正在起课…'
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => recalculate(new Date())}
            className={buttonBase + ' border border-neutral-300 text-neutral-900 hover:bg-neutral-100'}
          >
            {isEn ? 'Cast for current time' : '按当前时间重排'}
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4 rounded-lg border border-neutral-200 p-4 sm:p-5">
          {/* 起课方式：时间 / 报数 */}
          <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 pb-3 text-xs">
            <span className="text-neutral-600">{isEn ? 'Mode:' : '起课方式：'}</span>
            {(
              [
                ['time', isEn ? 'Time' : '时间起课'],
                ['number', isEn ? 'Number' : '报数起课'],
              ] as const
            ).map(([t, label]) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setCastTab(t);
                  recalculate(undefined, { tab: t });
                }}
                className={`rounded-md border px-3 py-1 font-medium ${
                  castTab === t
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {label}
              </button>
            ))}

            {castTab === 'number' && (
              <div className="ml-2 flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={numberVal}
                  onChange={(e) => setNumberVal(Math.max(1, Number(e.target.value)))}
                  className="w-20 rounded border border-neutral-300 px-2 py-1 text-xs tabular-nums"
                />
                <button
                  type="button"
                  onClick={() => {
                    const rand = Math.floor(Math.random() * 99) + 1;
                    setNumberVal(rand);
                    recalculate(undefined, { tab: 'number', numberCast: rand });
                  }}
                  className="rounded border border-neutral-300 px-2 py-1 text-xs hover:bg-neutral-100"
                >
                  随机
                </button>
              </div>
            )}
          </div>

          {/* 涉害 / 贵人 / 取法 / 月将 */}
          <div className="grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-neutral-600">涉害：</span>
              {(
                [
                  ['depth', '涉害深度法'],
                  ['meng_zhong_ji', '直取孟仲季'],
                ] as const
              ).map(([v, l]) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => {
                    setSheHaiRule(v);
                    recalculate(undefined, { sheHaiRule: v });
                  }}
                  className={`rounded border px-2 py-1 ${
                    sheHaiRule === v ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300 bg-white text-neutral-700'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-neutral-600">贵人：</span>
              {(
                [
                  ['jia_wu_geng_niu_yang', '甲戊庚牛羊'],
                  ['jia_yang_wu_geng_niu', '甲羊戊庚牛'],
                ] as const
              ).map(([v, l]) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => {
                    setGuiRenRule(v);
                    recalculate(undefined, { guiRenRule: v });
                  }}
                  className={`rounded border px-2 py-1 ${
                    guiRenRule === v ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300 bg-white text-neutral-700'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-neutral-600">取法：</span>
              {(
                [
                  ['auto', '自动'],
                  ['day', '昼贵'],
                  ['night', '夜贵'],
                ] as const
              ).map(([v, l]) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => {
                    setDayMode(v);
                    recalculate(undefined, { isDayOverride: v === 'auto' ? undefined : v === 'day' });
                  }}
                  className={`rounded border px-2 py-1 ${
                    dayMode === v ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300 bg-white text-neutral-700'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-neutral-600">月将：</span>
              <select
                value={customYueJiang}
                onChange={(e) => {
                  setCustomYueJiang(e.target.value);
                  recalculate(undefined, { customYueJiang: e.target.value || undefined });
                }}
                className="rounded border border-neutral-300 bg-white px-2 py-1 text-xs"
              >
                <option value="">自动（{chart?.yueJiang ?? '按中气'}）</option>
                {BRANCHES_12.map((b) => (
                  <option key={b} value={b}>
                    {b}将
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <input
              id="liuren-custom-time"
              name="time"
              type="datetime-local"
              required
              min={QIMEN_TIME_MIN}
              max={QIMEN_TIME_MAX}
              step={1}
              value={customTime}
              onChange={(e) => {
                setCustomTime(e.target.value);
                setHasTimeError(false);
              }}
              className="min-h-11 w-full min-w-0 rounded-md border border-neutral-300 bg-white px-3 py-2 text-base tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 sm:w-auto"
            />
            <button type="submit" className={buttonBase + ' bg-neutral-900 text-white hover:bg-neutral-700'}>
              {isEn ? 'Cast Chart' : '排盘'}
            </button>
          </div>
          {hasTimeError && (
            <p role="alert" className="border-l-2 border-neutral-900 pl-3 text-sm leading-6">
              请输入 1900—2100 年内有效的北京时间。
            </p>
          )}
        </form>
      </section>

      {chart && (
        <>
          {/* 顶部时间 + 四柱（含旬空纳音）+ 月将 + 12神煞 + 操作按钮 */}
          <section className="rounded-lg border border-neutral-200 p-4 sm:p-5 space-y-4">
            <div className="text-sm font-medium text-neutral-800 tabular-nums">
              {chart.time.replace('T', ' ').slice(0, 16)}（{chart.lunarDateText}）
            </div>

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                {(['year', 'month', 'day', 'hour'] as const).map((key) => {
                  const gz = chart.ganzhi[key];
                  const detail = chart.pillarDetails?.[key];
                  return (
                    <div key={key} className="flex items-center gap-1.5">
                      <div className="flex flex-col items-center leading-tight">
                        <span
                          className="font-serif text-lg font-semibold"
                          style={showColor ? { color: WUXING_COLOR[gz[0]] } : undefined}
                        >
                          {gz[0]}
                        </span>
                        <span
                          className="font-serif text-lg font-semibold"
                          style={showColor ? { color: WUXING_COLOR[gz[1]] } : undefined}
                        >
                          {gz[1]}
                        </span>
                      </div>
                      {detail && (
                        <div className="text-[10px] leading-tight text-neutral-500">
                          <div>{detail.xunKong}空</div>
                          <div>{detail.naYin}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="text-sm leading-relaxed text-neutral-700">
                <div>
                  月将{' '}
                  <strong
                    className="font-serif text-base"
                    style={showColor ? { color: WUXING_COLOR[chart.yueJiang] } : undefined}
                  >
                    {chart.yueJiang}
                  </strong>
                  <span className="ml-1 text-xs text-neutral-500">({chart.yueJiangName})</span>
                </div>
                <div className="text-xs text-neutral-500">
                  {castTab === 'number' ? '报数起课' : '时间起课'} · {chart.isDay ? '昼贵' : '夜贵'}
                  {chart.guiRenBranch}
                </div>
              </div>
            </div>

            {/* 12 神煞速览 */}
            {chart.shenSha && (
              <div className="grid grid-cols-3 gap-x-3 gap-y-1.5 border-t border-neutral-100 pt-3 text-xs sm:grid-cols-6">
                {chart.shenSha.map((s) => (
                  <div key={s.name} className="flex items-center gap-1 whitespace-nowrap">
                    <span className="text-neutral-600">{s.name}-</span>
                    <span
                      className="font-medium"
                      style={showColor ? { color: WUXING_COLOR[s.branch] } : undefined}
                    >
                      {s.branch}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* 快捷按钮：课义/神煞/长生、颜色、复制 */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() =>
                  setBottomTab((prev) =>
                    prev === 'keyi' ? 'shensha' : prev === 'shensha' ? 'changsheng' : 'keyi'
                  )
                }
                className="rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-50 cursor-pointer"
              >
                课义/神煞/长生
              </button>
              <button
                type="button"
                onClick={() => setShowColor((v) => !v)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  showColor
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-300 bg-white text-neutral-600'
                }`}
              >
                颜色
              </button>
              <button
                type="button"
                onClick={() => {
                  const text = [
                    `${chart.time.replace('T', ' ')}（${chart.lunarDateText}）`,
                    `四柱：${chart.ganzhi.year} ${chart.ganzhi.month} ${chart.ganzhi.day} ${chart.ganzhi.hour} | 月将：${chart.yueJiang} | 课体：${chart.keTi}`,
                    `三传：${chart.sanChuan.map((c) => `${c.liuQin.slice(0, 1)} ${c.tianGan ?? '◎'} ${c.branch} ${TIAN_JIANG_SHORT[c.tianJiang] || c.tianJiang}`).join(' / ')}`,
                    `四课：${[...chart.siKe].reverse().map((k) => `${k.tianGan ?? '◎'}${TIAN_JIANG_SHORT[k.tianJiang] || k.tianJiang}${k.top}${k.bottom}`).join(' | ')}`,
                  ].join('\n');
                  navigator.clipboard?.writeText(text);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1800);
                }}
                className="rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-50 cursor-pointer"
              >
                {copied ? '已复制' : '复制'}
              </button>
            </div>
          </section>

          {/* 经典大六壬盘面：左四边环形天地盘 + 右上三传 + 右下四课 */}
          <section className="rounded-lg border border-neutral-200 p-4 sm:p-6 space-y-4">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-center">
              {/* 左：经典四边环形天地盘（外圈遁干+天将，内圈天盘地支） */}
              <div className="mx-auto w-full max-w-sm">
                {/* 顶行：巳 午 未 申 */}
                <div className="grid grid-cols-6 gap-1">
                  <div />
                  {renderRingCell('巳', 'top')}
                  {renderRingCell('午', 'top')}
                  {renderRingCell('未', 'top')}
                  {renderRingCell('申', 'top')}
                  <div />
                </div>
                {/* 中间两行：左 辰卯 / 右 酉戌 */}
                <div className="grid grid-cols-6 gap-1 my-1 items-center">
                  <div className="col-span-2 flex flex-col gap-1">
                    {renderRingCell('辰', 'left')}
                    {renderRingCell('卯', 'left')}
                  </div>
                  <div className="col-span-2" />
                  <div className="col-span-2 flex flex-col gap-1">
                    {renderRingCell('酉', 'right')}
                    {renderRingCell('戌', 'right')}
                  </div>
                </div>
                {/* 底行：寅 丑 子 亥 */}
                <div className="grid grid-cols-6 gap-1">
                  <div />
                  {renderRingCell('寅', 'bottom')}
                  {renderRingCell('丑', 'bottom')}
                  {renderRingCell('子', 'bottom')}
                  {renderRingCell('亥', 'bottom')}
                  <div />
                </div>
              </div>

              {/* 右：上三传 + 下四课 */}
              <div className="space-y-6 flex flex-col items-center lg:items-start">
                {/* 三传（六亲 遁干 地支 天将） */}
                <div className="w-full max-w-xs space-y-2">
                  {chart.sanChuan.map((c) => (
                    <div
                      key={c.stage}
                      className="grid grid-cols-4 items-center text-center text-base font-serif"
                    >
                      <span className="text-sm text-neutral-600">{c.liuQin.slice(0, 1)}</span>
                      <span className="text-sm text-neutral-500">{c.tianGan ?? '◎'}</span>
                      <span
                        className="text-xl font-semibold"
                        style={showColor ? { color: WUXING_COLOR[c.branch] } : undefined}
                      >
                        {c.branch}
                        {c.isKong ? <sup className="ml-0.5 text-[10px] text-neutral-500">空</sup> : null}
                      </span>
                      <span className="text-sm font-medium text-neutral-800">
                        {TIAN_JIANG_SHORT[c.tianJiang] || c.tianJiang}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 四课（右至左 1→4 课：遁干 / 天将 / 上神 / 下神） */}
                <div className="w-full max-w-xs grid grid-cols-4 gap-2 text-center">
                  {[...chart.siKe].reverse().map((ke) => (
                    <div key={ke.index} className="space-y-1">
                      <div className="text-xs text-neutral-400">{ke.tianGan ?? '◎'}</div>
                      <div className="text-sm font-medium text-neutral-700">
                        {TIAN_JIANG_SHORT[ke.tianJiang] || ke.tianJiang}
                      </div>
                      <div
                        className="font-serif text-xl font-semibold"
                        style={showColor ? { color: WUXING_COLOR[ke.top] } : undefined}
                      >
                        {ke.top}
                      </div>
                      <div
                        className="font-serif text-xl font-semibold"
                        style={showColor ? { color: WUXING_COLOR[ke.bottom] } : undefined}
                      >
                        {ke.bottom}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-100 pt-3 text-xs text-neutral-600">
              课体：<span className="font-medium text-neutral-900">{chart.keTi}</span>
              <span className="ml-3">日干寄宫：{chart.dayStemPalace}</span>
              <span className="ml-3">旬空：{chart.xunKong.join('')}</span>
            </div>
          </section>

          {/* 下方三标签切换卡片：课义 / 神煞 / 长生 */}
          <section className="rounded-lg border border-neutral-200 p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-3 rounded-lg bg-neutral-100 p-1 text-xs sm:text-sm">
              {(
                [
                  ['keyi', '课义'],
                  ['shensha', '神煞'],
                  ['changsheng', '长生'],
                ] as const
              ).map(([tabKey, tabLabel]) => (
                <button
                  key={tabKey}
                  type="button"
                  onClick={() => setBottomTab(tabKey)}
                  className={`rounded-md py-1.5 font-medium transition-colors cursor-pointer ${
                    bottomTab === tabKey
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {tabLabel}
                </button>
              ))}
            </div>

            {bottomTab === 'keyi' && (
              <div className="space-y-2 text-sm text-neutral-700 leading-relaxed">
                <p>
                  <strong>九宗门课体：</strong>
                  {chart.keTi}（主类：{chart.zongMen}）
                </p>
                <p>
                  <strong>三传发用：</strong>
                  {chart.sanChuan
                    .map(
                      (c) =>
                        `${c.stage}临${c.tianGan ?? ''}${c.branch}（${c.liuQin} · ${c.tianJiang}${
                          c.isKong ? ' · 旬空' : ''
                        }）`
                    )
                    .join(' → ')}
                </p>
                <p>
                  <strong>四课布局：</strong>
                  {[...chart.siKe]
                    .reverse()
                    .map((k) => `${k.labelZh}${k.top}临${k.bottom}（${k.tianJiang}）`)
                    .join('；')}
                </p>
              </div>
            )}

            {bottomTab === 'shensha' && chart.shenSha && (
              <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
                {chart.shenSha.map((s) => (
                  <div key={s.name} className="rounded border border-neutral-200 p-2.5">
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-neutral-900">{s.name}</span>
                      <span
                        className="font-serif text-sm font-semibold"
                        style={showColor ? { color: WUXING_COLOR[s.branch] } : undefined}
                      >
                        {s.branch}
                      </span>
                    </div>
                    <p className="mt-1 text-neutral-500">{s.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {bottomTab === 'changsheng' && (
              <div className="space-y-4">
                {(() => {
                  const activeStem = changShengStem || chart.ganzhi.day[0];
                  const stages = getTwelveChangShengForStem(activeStem);
                  return (
                    <>
                      <div className="grid grid-cols-3 gap-3 text-sm sm:grid-cols-6">
                        {stages.map((st) => (
                          <div key={st.label} className="text-center rounded border border-neutral-100 bg-neutral-50/60 py-2">
                            <span className="text-neutral-600">{st.label}-</span>
                            <span
                              className="font-serif font-semibold"
                              style={showColor ? { color: WUXING_COLOR[st.branch] } : undefined}
                            >
                              {st.branch}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                        {(['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const).map((st) => {
                          const isSelected = st === activeStem;
                          return (
                            <button
                              key={st}
                              type="button"
                              onClick={() => setChangShengStem(st)}
                              className={`rounded-full border px-3 py-0.5 text-xs font-medium cursor-pointer ${
                                isSelected
                                  ? 'border-neutral-900 bg-neutral-900 text-white'
                                  : 'border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-50'
                              }`}
                            >
                              {st}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </section>

          <EastAiReadingPanel
            kind="liuren"
            titleZh="让 AI 深度解盘"
            titleEn="AI Deep Reading"
            chartSummary={[
              `干支：${chart.ganzhi.year}年 ${chart.ganzhi.month}月 ${chart.ganzhi.day}日 ${chart.ganzhi.hour}时（${chart.hourBranch}时）`,
              `月将：${chart.yueJiang}（${chart.yueJiangName}），贵人：${chart.isDay ? '昼贵' : '夜贵'} ${chart.guiRenBranch}，旬空：${chart.xunKong.join('')}，课体：${chart.keTi}`,
              `日干寄宫：${chart.dayStemPalace}`,
              `四课：${chart.siKe.map((k) => `第${k.index}课[${k.tianJiang}:${k.top}/${k.bottom}]`).join('，')}`,
              `三传：${chart.sanChuan.map((c) => `${c.stage}:${c.liuQin}${c.tianGan ?? ''}${c.branch}(${c.tianJiang}${c.isKong ? '·空' : ''})`).join(' -> ')}`,
            ].join('\n')}
            spendType="liuyao"
            lang={lang}
            resetKey={`${chart.ganzhi.year}-${chart.ganzhi.month}-${chart.ganzhi.day}-${chart.ganzhi.hour}-${chart.yueJiang}-${chart.keTi}`}
          />
        </>
      )}
    </div>
  );
}
