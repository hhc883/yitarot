import assert from 'node:assert/strict';
import test from 'node:test';

import {
  drawRandomCards,
  getDaysInMonth,
  getMonthlyPhases,
  getOrCreateYearSpread,
  redrawYearSpread,
  shuffleArray,
  TAROT_DECK,
} from '../src/lib/tarot/deck.ts';

test('Tarot deck contains 78 unique cards', () => {
  assert.equal(TAROT_DECK.length, 78);
  assert.equal(new Set(TAROT_DECK.map((c) => c.id)).size, 78);
  assert.equal(new Set(TAROT_DECK.map((c) => c.slug)).size, 78);
});

test('Fisher-Yates shuffleArray and drawRandomCards never produce duplicates in a draw', () => {
  const sample = [1, 2, 3, 4, 5, 6, 7, 8];
  const shuffled = shuffleArray(sample);
  assert.deepEqual([...shuffled].sort((a, b) => a - b), sample);

  for (let i = 0; i < 300; i += 1) {
    const five = drawRandomCards(5);
    assert.equal(five.length, 5);
    assert.equal(new Set(five.map((d) => d.card.id)).size, 5);
  }

  const full = drawRandomCards(78);
  assert.equal(full.length, 78);
  assert.equal(new Set(full.map((d) => d.card.id)).size, 78);

  assert.equal(drawRandomCards(0).length, 0);
  assert.equal(drawRandomCards(-3).length, 0);
  assert.equal(drawRandomCards(100).length, 78);
});

test('drawRandomCards preserves 35% reversal threshold and allowReversed flag', () => {
  const uprightOnly = drawRandomCards(10, false, () => 0.1);
  assert.equal(uprightOnly.every((d) => d.isReversed === false), true);

  const reversedDraw = drawRandomCards(5, true, () => 0.34);
  assert.equal(reversedDraw.every((d) => d.isReversed === true), true);

  const boundaryUpright = drawRandomCards(5, true, () => 0.35);
  assert.equal(boundaryUpright.every((d) => d.isReversed === false), true);
});

test('Yearly Tarot preserves each year spread independently and redraw only affects selected year', () => {
  let seq = 0;
  const fakeDraw = (count) => {
    const start = seq * 5;
    seq += 1;
    return TAROT_DECK.slice(start, start + count).map((card) => ({ card, isReversed: false }));
  };

  let state = getOrCreateYearSpread({}, 2026, fakeDraw);
  const spread2026Initial = state[2026];
  assert.equal(spread2026Initial.length, 5);

  state = getOrCreateYearSpread(state, 2027, fakeDraw);
  const spread2027Initial = state[2027];
  assert.equal(spread2027Initial.length, 5);
  assert.notDeepEqual(spread2026Initial.map((d) => d.card.id), spread2027Initial.map((d) => d.card.id));

  // Switching back to 2026 restores exact 2026 spread
  state = getOrCreateYearSpread(state, 2026, fakeDraw);
  assert.strictEqual(state[2026], spread2026Initial);

  // Redrawing 2027 only changes 2027 and preserves 2026
  state = redrawYearSpread(state, 2027, fakeDraw);
  assert.strictEqual(state[2026], spread2026Initial);
  assert.notDeepEqual(state[2027].map((d) => d.card.id), spread2027Initial.map((d) => d.card.id));
});

test('Monthly Tarot last segment matches actual month end for Feb (28/29), 30-day, and 31-day months', () => {
  assert.equal(getDaysInMonth(2026, 2), 28);
  assert.equal(getDaysInMonth(2024, 2), 29);
  assert.equal(getDaysInMonth(2026, 4), 30);
  assert.equal(getDaysInMonth(2026, 12), 31);

  const febCommon = getMonthlyPhases(2026, 2)[3];
  assert.equal(febCommon.timingZh, '第 22 - 28 天');
  assert.equal(febCommon.timingEn, 'Days 22 - 28');

  const febLeap = getMonthlyPhases(2024, 2)[3];
  assert.equal(febLeap.timingZh, '第 22 - 29 天');
  assert.equal(febLeap.timingEn, 'Days 22 - 29');

  const apr = getMonthlyPhases(2026, 4)[3];
  assert.equal(apr.timingZh, '第 22 - 30 天');
  assert.equal(apr.timingEn, 'Days 22 - 30');

  const dec = getMonthlyPhases(2026, 12)[3];
  assert.equal(dec.timingZh, '第 22 - 31 天');
  assert.equal(dec.timingEn, 'Days 22 - 31');
});
