import assert from 'node:assert/strict';
import test from 'node:test';

import { getAlmanacDayHours, searchAlmanacDates } from '../src/lib/metaphysics/almanac.ts';
import { Solar } from 'lunar-typescript';

function dates(purpose, start, end = start) {
  const result = searchAlmanacDates(purpose, start, end);
  assert.equal(result.ok, true);
  return result.days;
}

test('includes both boundary days and steps over a leap day in chronological order', () => {
  const found = dates('moving', '2024-02-28', '2024-03-01');
  assert.deepEqual(found.map((day) => day.date), ['2024-02-28', '2024-02-29', '2024-03-01']);
  assert.equal(dates('opening', '2026-12-01', '2026-12-31').length, 31);
  assert.equal(dates('moving', '1900-01-01')[0].date, '1900-01-01');
  assert.equal(dates('moving', '2100-12-31')[0].date, '2100-12-31');
});

test('rejects impossible or malformed civil dates, reversed ranges and ranges over 31 days', () => {
  for (const start of ['', '2026-2-01', '2025-02-29', '2024-04-31', '2100-02-29', '1899-12-31', '2101-01-01']) {
    assert.deepEqual(searchAlmanacDates('moving', start, '2026-12-01'), { ok: false, error: 'start' });
  }
  for (const end of ['', '2026-13-01', '2026-12-00']) {
    assert.deepEqual(searchAlmanacDates('moving', '2026-12-01', end), { ok: false, error: 'end' });
  }
  assert.deepEqual(searchAlmanacDates('moving', '2026-12-02', '2026-12-01'), { ok: false, error: 'reversed' });
  assert.deepEqual(searchAlmanacDates('moving', '2026-12-01', '2027-01-01'), { ok: false, error: 'span' });
});

test('classifies the same day differently by activity and leaves unlisted dates neutral', () => {
  const moving = dates('moving', '2026-12-01', '2026-12-07');
  assert.equal(moving[0].status, 'caution');
  assert.deepEqual(moving[0].unfavorable, ['入宅', '移徙']);
  assert.deepEqual(moving[3].favorable, ['入宅', '移徙']);
  assert.equal(moving[3].status, 'candidate');
  assert.equal(moving[5].status, 'candidate');
  assert.deepEqual([moving[6].status, moving[6].favorable, moving[6].unfavorable], ['unlisted', [], []]);
  const opening = dates('opening', '2026-12-01', '2026-12-06');
  assert.equal(opening[0].status, 'candidate');
  assert.deepEqual(opening[0].favorable, ['开市']);
  assert.equal(opening[2].status, 'caution');
  assert.equal(opening[3].status, 'caution');
  assert.equal(opening[5].status, 'candidate');
  assert.deepEqual(
    [moving[0].dayPillar, moving[0].dayOfficer, moving[0].conflictingZodiac],
    [opening[0].dayPillar, '开', '兔'],
  );
});

test('shows both indications when an actual date contains conflicting matches', () => {
  const [mixed] = dates('moving', '2026-04-23');
  assert.deepEqual([mixed.status, mixed.favorable, mixed.unfavorable], ['conditional', ['移徙'], ['入宅']]);
});

test('contract uses only the traditional trade and agreement entries as its proxy', () => {
  const found = dates('contract', '2026-12-06', '2026-12-13');
  assert.deepEqual([found[0].status, found[0].favorable], ['candidate', ['立券', '交易']]);
  assert.deepEqual([found[7].status, found[7].unfavorable], ['caution', ['交易']]);
});

test('getAlmanacDayHours computes 12 hours on demand, filters only selected activity, and keeps unlisted neutral', () => {
  const [day] = dates('moving', '2026-12-04');
  assert.equal('hours' in day, false);

  const result = getAlmanacDayHours('moving', '2026-12-04');
  assert.equal(result.ok, true);
  assert.equal(result.hours.length, 12);
  assert.deepEqual(
    result.hours.map((h) => h.branch),
    ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
  );
  assert.equal(result.hours[0].minHm, '00:00');
  assert.equal(result.hours[0].maxHm, '00:59');
  assert.equal(result.hours[11].minHm, '21:00');
  assert.equal(result.hours[11].maxHm, '22:59');

  const allowed = new Set(['入宅', '移徙']);
  const lunar = Solar.fromYmd(2026, 12, 4).getLunar();
  const rawTimes = lunar.getTimes().slice(0, 12);
  for (let i = 0; i < 12; i += 1) {
    const h = result.hours[i];
    const expectedYi = rawTimes[i].getYi().filter((item) => allowed.has(item));
    const expectedJi = rawTimes[i].getJi().filter((item) => allowed.has(item));
    assert.deepEqual([...h.favorable].sort(), [...expectedYi].sort());
    assert.deepEqual([...h.unfavorable].sort(), [...expectedJi].sort());
    if (!h.favorable.length && !h.unfavorable.length) {
      assert.equal(h.status, 'unlisted');
    }
  }

  // Zi-hour convention: 23:00-23:59 on 2026-12-04 rolls over to 2026-12-05's early Zi (00:00-00:59).
  const lateZi = lunar.getTimes()[12];
  const nextDayEarlyZi = getAlmanacDayHours('moving', '2026-12-05');
  assert.equal(nextDayEarlyZi.ok, true);
  assert.equal(nextDayEarlyZi.hours[0].pillar, lateZi.getGanZhi());

  assert.deepEqual(getAlmanacDayHours('moving', '2026-02-29'), { ok: false, error: 'date' });
});
