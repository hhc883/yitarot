import assert from 'node:assert/strict';
import test from 'node:test';
import { LunarUtil } from 'lunar-typescript';

import {
  analyzeZiweiMarriage,
  calculateZiwei,
  getBureauByGanZhi,
} from '../src/lib/metaphysics/ziwei.ts';

test('Full 60 Jiazi NaYin => Five Element Bureau lookup has zero missing entries and no Wood fallback', () => {
  const counts = { 水: 0, 木: 0, 金: 0, 土: 0, 火: 0 };
  assert.equal(LunarUtil.JIA_ZI.length, 60);

  for (const gz of LunarUtil.JIA_ZI) {
    const bureau = getBureauByGanZhi(gz);
    assert.ok([2, 3, 4, 5, 6].includes(bureau.number), `${gz} returned invalid bureau`);
    counts[bureau.elementZh] += 1;
  }

  assert.deepEqual(counts, { 水: 12, 木: 12, 金: 12, 土: 12, 火: 12 });
  assert.equal(getBureauByGanZhi('丙寅').nameZh, '火六局');
  assert.equal(getBureauByGanZhi('丙寅').number, 6);
  assert.throws(() => getBureauByGanZhi('甲丑'), RangeError);
});

test('1984-03-01 00:00 Life Palace is 丙寅 and Bureau is 火六局', () => {
  const chart = calculateZiwei(1984, 3, 1, 0, 'male');
  assert.equal(chart.lifePalaceStem + chart.lifePalaceBranch, '丙寅');
  assert.equal(chart.bureau.nameZh, '火六局');
  assert.equal(chart.bureau.number, 6);
});

test('Tiankui/Tianyue by year stem, Wenchang/Wenqu by hour branch, and Four Transformations include minor stars', () => {
  const expectedKuiYue = {
    甲: ['丑', '未'], 戊: ['丑', '未'], 庚: ['丑', '未'],
    乙: ['子', '申'], 己: ['子', '申'],
    丙: ['亥', '酉'], 丁: ['亥', '酉'],
    壬: ['卯', '巳'], 癸: ['卯', '巳'],
    辛: ['午', '寅'],
  };

  // 1984..1993 cover all 10 Heavenly Stems 甲..癸
  for (let y = 1984; y <= 1993; y += 1) {
    for (const h of [0, 2, 12, 22]) {
      const chart = calculateZiwei(y, 6, 15, h, 'male');
      const yearStem = chart.lunarDate.yearGanZhi[0];

      const findStarPalaces = (starName) =>
        chart.palaces.filter((p) => p.minorStars.some((s) => s.name === starName));

      const kuiPalaces = findStarPalaces('天魁');
      const yuePalaces = findStarPalaces('天钺');
      const changPalaces = findStarPalaces('文昌');
      const quPalaces = findStarPalaces('文曲');
      const fuPalaces = findStarPalaces('左辅');
      const biPalaces = findStarPalaces('右弼');

      assert.equal(kuiPalaces.length, 1, `${y}-${h} 天魁 should appear once`);
      assert.equal(yuePalaces.length, 1, `${y}-${h} 天钺 should appear once`);
      assert.equal(changPalaces.length, 1, `${y}-${h} 文昌 should appear once`);
      assert.equal(quPalaces.length, 1, `${y}-${h} 文曲 should appear once`);
      assert.equal(fuPalaces.length, 1, `${y}-${h} 左辅 should appear once`);
      assert.equal(biPalaces.length, 1, `${y}-${h} 右弼 should appear once`);

      assert.deepEqual(
        [kuiPalaces[0].branch, yuePalaces[0].branch],
        expectedKuiYue[yearStem],
        `Kui/Yue branch mismatch for year stem ${yearStem}`
      );

      // All 4 natal transformations must land in real palaces (including minor star transformations)
      assert.equal(chart.transformationLocations.length, 4, `${y}-${h} must place all 4 transformations`);
      for (const loc of chart.transformationLocations) {
        const palace = chart.palaces[loc.palaceIndex];
        assert.ok(palace.transformations.includes(loc.labelZh));
      }
    }
  }

  // Verify specific minor-star transformation cases: 丙(文昌化科), 戊(右弼化科), 己(文曲化忌), 辛(文曲化科 & 文昌化忌)
  const bing = calculateZiwei(1986, 6, 15, 0, 'male'); // 丙寅, 子时: 文昌在戌, 文曲在辰
  const bingKe = bing.transformationLocations.find((t) => t.key === 'ke');
  assert.equal(bingKe?.starZh, '文昌');
  assert.equal(bingKe?.palaceBranch, '戌');

  const wu = calculateZiwei(1988, 6, 15, 12, 'female'); // 戊辰: 右弼化科
  const wuKe = wu.transformationLocations.find((t) => t.key === 'ke');
  assert.equal(wuKe?.starZh, '右弼');

  const xin = calculateZiwei(1991, 6, 15, 12, 'male'); // 辛未, 午时(6): 文昌在辰, 文曲在戌
  assert.equal(xin.transformationLocations.find((t) => t.key === 'ke')?.starZh, '文曲');
  assert.equal(xin.transformationLocations.find((t) => t.key === 'ke')?.palaceBranch, '戌');
  assert.equal(xin.transformationLocations.find((t) => t.key === 'ji')?.starZh, '文昌');
  assert.equal(xin.transformationLocations.find((t) => t.key === 'ji')?.palaceBranch, '辰');
});

test('Omits hardcoded brightness labels and declares boundary', () => {
  const chart = calculateZiwei(1996, 8, 18, 12, 'male');
  for (const palace of chart.palaces) {
    for (const st of [...palace.majorStars, ...palace.minorStars]) {
      assert.equal(st.brightness, undefined);
    }
  }
  assert.ok(chart.convention.unsupportedZh.length > 0);
  assert.ok(chart.convention.unsupportedEn.length > 0);
});

test('Decadal progression follows year polarity and user gender (阳男阴女顺行, 阴男阳女逆行)', () => {
  // 1984 甲子 (Yang year), 命宫丙寅, 火六局
  const yangMale = calculateZiwei(1984, 3, 1, 0, 'male');
  assert.equal(yangMale.decadalDirection, 'clockwise');
  assert.equal(yangMale.palaces.find((p) => p.branch === '寅')?.decadalRange, '6 - 15');
  assert.equal(yangMale.palaces.find((p) => p.branch === '卯')?.decadalRange, '16 - 25');
  assert.equal(yangMale.palaces.find((p) => p.branch === '丑')?.decadalRange, '116 - 125');

  const yangFemale = calculateZiwei(1984, 3, 1, 0, 'female');
  assert.equal(yangFemale.decadalDirection, 'counterclockwise');
  assert.equal(yangFemale.palaces.find((p) => p.branch === '寅')?.decadalRange, '6 - 15');
  assert.equal(yangFemale.palaces.find((p) => p.branch === '丑')?.decadalRange, '16 - 25');
  assert.equal(yangFemale.palaces.find((p) => p.branch === '卯')?.decadalRange, '116 - 125');

  // 1985 乙丑 (Yin year)
  const yinFemale = calculateZiwei(1985, 6, 15, 12, 'female');
  assert.equal(yinFemale.decadalDirection, 'clockwise');

  const yinMale = calculateZiwei(1985, 6, 15, 12, 'male');
  assert.equal(yinMale.decadalDirection, 'counterclockwise');
});

test('Ziwei synastry lists actual Life/Spouses palaces, empty palaces, and natal transformations without pseudo-score', () => {
  // Find a date with an empty Life Palace or Spouses Palace to verify empty-palace truthfulness
  let emptyChart = null;
  for (let d = 1; d <= 28; d += 1) {
    const c = calculateZiwei(1994, 5, d, 10, 'male');
    const life = c.palaces.find((p) => p.isLifePalace);
    const spouse = c.palaces.find((p) => p.name === '夫妻宫');
    if (life?.isEmpty || spouse?.isEmpty) {
      emptyChart = c;
      break;
    }
  }
  assert.ok(emptyChart, 'Should find at least one chart with an empty Life or Spouses palace');

  const chartB = calculateZiwei(1996, 8, 18, 14, 'female');
  const synastry = analyzeZiweiMarriage(emptyChart, chartB, '甲方', '乙方');

  assert.equal('overallScore' in synastry, false);
  assert.equal(synastry.partnerA.fourTransformations.length, 4);
  assert.equal(synastry.partnerB.fourTransformations.length, 4);

  const emptyPalace = synastry.partnerA.lifePalace.isEmpty
    ? synastry.partnerA.lifePalace
    : synastry.partnerA.spousePalace;
  assert.equal(emptyPalace.isEmpty, true);
  assert.equal(emptyPalace.majorStars.length, 0);
  assert.ok(synastry.schoolBoundaryZh.includes('不支持'));
  assert.ok(synastry.schoolBoundaryEn.includes('excluded'));
});

test('Validates Gregorian calendar dates, year range (1920-2035), and distinguishes midnight 0 from invalid hours', () => {
  // Invalid Gregorian calendar dates (lunar-typescript Solar.fromYmdHms(2026,2,30,12,0,0) must be rejected)
  assert.throws(() => calculateZiwei(2026, 2, 30, 12, 'male'), RangeError);
  assert.throws(() => calculateZiwei(2025, 2, 29, 12, 'male'), RangeError);
  assert.throws(() => calculateZiwei(2026, 4, 31, 12, 'male'), RangeError);
  assert.throws(() => calculateZiwei(2026, 13, 1, 12, 'male'), RangeError);
  assert.throws(() => calculateZiwei(1919, 12, 31, 12, 'male'), RangeError);
  assert.throws(() => calculateZiwei(2036, 1, 1, 12, 'male'), RangeError);

  // Valid leap-year date works
  assert.doesNotThrow(() => calculateZiwei(2024, 2, 29, 12, 'male'));

  // Midnight hour 0 is valid and distinct from invalid/non-integer hours
  const midnight = calculateZiwei(1996, 8, 18, 0, 'male');
  assert.equal(midnight.solarDate.hour, 0);
  assert.equal(midnight.lunarDate.hourBranch, '子时');

  assert.throws(() => calculateZiwei(1996, 8, 18, -1, 'male'), RangeError);
  assert.throws(() => calculateZiwei(1996, 8, 18, 24, 'male'), RangeError);
  assert.throws(() => calculateZiwei(1996, 8, 18, 12.5, 'male'), RangeError);
  assert.throws(() => calculateZiwei(1996, 8, 18, Number.NaN, 'male'), RangeError);
});
