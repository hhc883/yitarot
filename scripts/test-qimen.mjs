import assert from 'node:assert/strict';
import test from 'node:test';

import { calculateQimen, parseQimenBeijingTime } from '../src/lib/metaphysics/qimen.ts';

function cast(beijingTime) {
  const instant = parseQimenBeijingTime(beijingTime);
  assert.ok(instant, beijingTime);
  return calculateQimen(instant);
}

test('Beijing time parsing has a fixed UTC offset and rejects normalized invalid dates', () => {
  assert.equal(parseQimenBeijingTime('2024-02-29T00:00')?.toISOString(), '2024-02-28T16:00:00.000Z');
  for (const invalid of ['', '2023-02-29T12:00', '2024-04-31T12:00', '2024-06-15T24:00', '2024-06-15T14:30Z', '1899-12-31T23:59', '2101-01-01T00:00']) {
    assert.equal(parseQimenBeijingTime(invalid), null, invalid);
  }
});

test('Grain in Ear / upper epoch has the expected earth, heaven, gate and deity plates', () => {
  // Black-box reference case: Brhiza/mingyu tests/qimen-chart.test.ts, 2024-06-15 14:30 Beijing time.
  // This verifies results for one shared convention, not equivalence of all variants or engines.
  const result = cast('2024-06-15T14:30');
  assert.deepEqual(
    [result.ganzhi.day, result.ganzhi.hour, result.solarTermZh, result.epoch, result.dunType, result.juNumber],
    ['庚戌', '癸未', '芒种', '上元', '阳遁', 6],
  );
  assert.deepEqual(
    [result.zhifuStar, result.zhifuPalace, result.zhishiGate, result.zhishiPalace],
    ['天柱', 2, '惊门', 7],
  );
  assert.deepEqual(result.palaces.map((p) => p.earthStem), ['壬', '癸', '丁', '丙', '乙', '戊', '己', '庚', '辛']);
  assert.deepEqual(result.palaces.map((p) => p.currentStar), ['天任', '天柱', '天辅', '天英', null, '天蓬', '天心', '天冲', '天芮']);
  assert.deepEqual(result.palaces.map((p) => p.currentGate), ['休门', '死门', '伤门', '杜门', null, '开门', '惊门', '生门', '景门']);
  assert.deepEqual(result.palaces.map((p) => p.currentDeity), ['六合', '值符', '玄武', '九地', null, '太阴', '螣蛇', '白虎', '九天']);
  assert.deepEqual([result.palaces[8].companionStar, result.palaces[8].companionStem], ['天禽', '乙']);
});

test('23:00 Beijing time changes day and hour pillars, rather than using host midnight', () => {
  const before = cast('2024-06-15T22:59:59');
  const after = cast('2024-06-15T23:00');
  assert.deepEqual([before.ganzhi.day, before.ganzhi.hour], ['庚戌', '丁亥']);
  assert.deepEqual([after.ganzhi.day, after.ganzhi.hour], ['辛亥', '戊子']);
  assert.equal(calculateQimen(new Date('2024-06-15T15:00:00.000Z')).time, after.time);
});

test('summer solstice flips dun at the library term instant rather than the date boundary', () => {
  const before = cast('2024-06-21T04:50:59');
  const after = cast('2024-06-21T04:51:00');
  assert.deepEqual([before.solarTermZh, before.dunType], ['芒种', '阳遁']);
  assert.deepEqual([after.solarTermZh, after.dunType, after.solarTermStart], ['夏至', '阴遁', '2024-06-21T04:51:00']);
  const deityPalaces = [1, 8, 3, 4, 9, 2, 7, 6];
  const chiefIndex = deityPalaces.indexOf(after.zhifuPalace);
  const neighbor = deityPalaces[(chiefIndex + 7) % 8];
  assert.equal(after.palaces[neighbor - 1].currentDeity, '螣蛇');
});

test('every sampled chart has unique gates, rotating stars and deities, without a second center plate', () => {
  for (const day of ['2024-02-04', '2024-06-21', '2024-12-21']) {
    for (let hour = 0; hour < 24; hour += 1) {
      const chart = cast(day + 'T' + String(hour).padStart(2, '0') + ':30');
      const center = chart.palaces.find((p) => p.palaceId === 5);
      assert.equal(center.currentGate, null);
      assert.equal(center.currentStar, null);
      assert.equal(center.currentDeity, null);
      const outer = chart.palaces.filter((p) => p.palaceId !== 5);
      for (const field of ['currentGate', 'currentStar', 'currentDeity']) {
        assert.equal(outer.every((p) => p[field] !== null), true);
        assert.equal(new Set(outer.map((p) => p[field])).size, 8);
      }
      const centerCompanions = outer.filter((p) => p.companionStar);
      assert.deepEqual(centerCompanions.map((p) => [p.currentStar, p.companionStar, p.companionStem]), [['天芮', '天禽', center.earthStem]]);
      assert.equal(chart.palaces[chart.zhishiPalace - 1].currentGate, chart.zhishiGate);
      const duty = chart.palaces[chart.zhifuPalace - 1];
      assert.equal([duty.currentStar, duty.companionStar].includes(chart.zhifuStar), true);
    }
  }
});
