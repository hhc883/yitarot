/**
 * Standalone LiuYao (六爻) regression test script.
 * Verifies:
 * 1. Bottom-to-top 6-line ordering
 * 2. 6/9 moving line yin/yang transformation
 * 3. URL ?lines= compatibility (both 0/1 and 6/7/8/9)
 * 4. Strict rejection of invalid inputs (never normalized into usable results)
 * 5. Local date/time strict validation (rejecting non-existent calendar dates)
 * 6. BRANCH_ELEMENT lookup, Xun Kong (旬空), and Month Clash (月破) factual flags
 * 7. CoinTossGsap.tsx static audit (no hardcoded 水/火 on monthZhi/dayZhi)
 *
 * Run: node scripts/test-liuyao-regression.mjs
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'yitatro-liuyao-reg-'));
const lunarTypescriptUrl = import.meta.resolve('lunar-typescript');

function transpileToTmp(srcRelative) {
  const fullPath = path.resolve(process.cwd(), srcRelative);
  let code = fs.readFileSync(fullPath, 'utf8');

  code = code.replace(/from\s+['"](\.[^'"]+)['"]/g, (_m, p1) => {
    return `from '${p1}.js'`;
  });
  code = code.replace(/from\s+['"]lunar-typescript['"]/g, () => {
    return `from '${lunarTypescriptUrl}'`;
  });

  const transpiled = ts.transpileModule(code, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022
    }
  });

  const sub = path.relative(path.resolve(process.cwd(), 'src/lib/metaphysics'), fullPath);
  const outPath = path.join(tmpDir, sub.replace(/\.tsx?$/, '.js'));
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, transpiled.outputText, 'utf8');
  return outPath;
}

async function run() {
  try {
    transpileToTmp('src/lib/metaphysics/hexagrams64.ts');
    const najiaJs = transpileToTmp('src/lib/metaphysics/najia.ts');
    const ichingJs = transpileToTmp('src/lib/metaphysics/iching.ts');

    const najia = await import(pathToFileURL(najiaJs).href);
    const iching = await import(pathToFileURL(ichingJs).href);

    console.log('--- YiTatro LiuYao Regression Suite ---');

    // 1. 六爻自初爻至上爻顺序 & 6/9 动爻变阴阳
    // 978678 => L1:9(Yang->Yin), L2:7(Yang), L3:8(Yin), L4:6(Yin->Yang), L5:7(Yang), L6:8(Yin)
    // Primary bits (bottom->top): 110010 => lower 110 (兑), upper 010 (坎) => 水泽节 (#60)
    // Transformed bits (bottom->top): 010110 => lower 010 (坎), upper 110 (兑) => 泽水困 (#47)
    const manualLines = iching.parseCoinTossLinesInput('978678', { allowBinary: false });
    assert.equal(manualLines.length, 6);
    assert.deepEqual(
      manualLines.map((l) => l.lineIndex),
      [1, 2, 3, 4, 5, 6],
      'Line indices must be ordered 1..6 from bottom to top'
    );

    assert.equal(manualLines[0].sum, 9);
    assert.equal(manualLines[0].isYang, true);
    assert.equal(manualLines[0].isChanging, true);
    assert.equal(manualLines[0].changedYang, false, 'Old Yang (9) must change to Yin');

    assert.equal(manualLines[3].sum, 6);
    assert.equal(manualLines[3].isYang, false);
    assert.equal(manualLines[3].isChanging, true);
    assert.equal(manualLines[3].changedYang, true, 'Old Yin (6) must change to Yang');

    const reading978678 = iching.buildReadingFromLines(manualLines);
    assert.equal(reading978678.primaryHexagram.number, 60, '978678 primary must be #60 水泽节');
    assert.equal(reading978678.transformedHexagram?.number, 47, '978678 transformed must be #47 泽水困');
    assert.deepEqual(reading978678.changingLineIndices, [1, 4]);

    // Reversed order must produce a different hexagram (order sensitivity check)
    // 876879 => Primary bits: 010011 => lower 010 (坎), upper 011 (巽) => 风水涣 (#59)
    const reversedLines = iching.parseCoinTossLinesInput('876879', { allowBinary: false });
    const reversedReading = iching.buildReadingFromLines(reversedLines);
    assert.equal(reversedReading.primaryHexagram.number, 59, '876879 primary must be #59 风水涣');
    assert.notEqual(reversedReading.primaryHexagram.number, reading978678.primaryHexagram.number);
    console.log('✓ 1. 6-line bottom-to-top order & 6/9 moving transformations passed');

    // 2. URL 0/1 & 6/7/8/9 compatibility + delimiter support
    const urlBinLines = iching.parseCoinTossLinesInput('101011', { allowBinary: true });
    const manualEquiv = iching.parseCoinTossLinesInput('7, 8, 7, 8, 7, 7', { allowBinary: false });
    assert.deepEqual(urlBinLines, manualEquiv, 'URL 0/1 must map equivalently to 8/7');
    const staticReading = iching.buildReadingFromLines(urlBinLines);
    assert.equal(staticReading.transformedHexagram, null, 'Static lines must produce null transformedHexagram');
    assert.deepEqual(staticReading.changingLineIndices, []);
    // 101011 => lower 101 (离), upper 011 (巽) => 风火家人 (#37)
    assert.equal(staticReading.primaryHexagram.number, 37);

    const urlCodeLines = iching.parseCoinTossLinesInput('978678', { allowBinary: true });
    assert.deepEqual(urlCodeLines, manualLines);
    console.log('✓ 2. URL 0/1 & 6/7/8/9 compatibility passed');

    // 3. Invalid inputs must throw and NEVER normalize into a usable reading
    const invalidInputs = [
      ['', true],
      ['97867', true],
      ['9786789', true],
      ['1234567890', true], // must NOT strip 2,3,4,5 into 167890
      ['97867a', true],
      ['106789', true], // must NOT mix 0/1 and 6/7/8/9
      ['101011', false], // 0/1 rejected in manual 6/7/8/9 mode
      ['6,7,8,9,7,', false],
      ['555555', true]
    ];
    for (const [raw, allowBinary] of invalidInputs) {
      assert.throws(
        () => iching.parseCoinTossLinesInput(raw, { allowBinary }),
        `Invalid input "${raw}" (allowBinary=${allowBinary}) must throw`
      );
    }

    assert.throws(() => iching.buildReadingFromLines(manualLines.slice(0, 5)), '5 lines must throw');
    assert.throws(
      () => iching.buildReadingFromLines([...manualLines, manualLines[0]]),
      '7 lines must throw'
    );
    assert.throws(
      () =>
        iching.buildReadingFromLines(
          manualLines.map((l, idx) => (idx === 0 ? { ...l, lineIndex: 2 } : l))
        ),
      'Duplicate lineIndex must throw'
    );
    assert.throws(
      () =>
        iching.buildReadingFromLines(
          manualLines.map((l, idx) => (idx === 0 ? { ...l, sum: 5 } : l))
        ),
      'Invalid sum=5 must throw'
    );
    assert.throws(
      () =>
        iching.buildReadingFromLines(
          manualLines.map((l, idx) => (idx === 0 ? { ...l, isYang: false } : l))
        ),
      'Mismatched isYang for sum=9 must throw'
    );
    assert.throws(
      () =>
        iching.normalizeIChingReading({
          ...reading978678,
          lines: manualLines.map((l, idx) => (idx === 0 ? { ...l, changedYang: true } : l))
        }),
      'normalizeIChingReading must reject inconsistent line flags instead of silently fixing'
    );
    console.log('✓ 3. Invalid inputs rejected without normalizing into usable readings');

    // 4. Date & local timezone validation
    const invalidDates = [
      ['2026-02-29', '12:00'],
      ['2026-02-30', '12:00'],
      ['2026-04-31', '12:00'],
      ['2026-13-01', '12:00'],
      ['2026-11-25', '25:00'],
      ['2026-11-25', '12:60'],
      ['', '12:00']
    ];
    for (const [dStr, tStr] of invalidDates) {
      assert.throws(
        () => najia.parseLocalDateTimeInput(dStr, tStr),
        `Invalid date/time "${dStr} ${tStr}" must throw`
      );
    }
    assert.throws(
      () => najia.getCurrentLiuYaoTimeInfo(new Date('invalid')),
      'Invalid Date object must throw'
    );

    const validLeapDate = najia.parseLocalDateTimeInput('2024-02-29', '14:30');
    const leapTimeInfo = najia.getCurrentLiuYaoTimeInfo(validLeapDate);
    assert.equal(leapTimeInfo.solarDate, '2024-02-29 14:30');
    assert.ok(leapTimeInfo.monthZhi.length === 1 && najia.BRANCH_ELEMENT[leapTimeInfo.monthZhi]);
    assert.ok(leapTimeInfo.dayZhi.length === 1 && najia.BRANCH_ELEMENT[leapTimeInfo.dayZhi]);
    console.log('✓ 4. Strict calendar date validation & getCurrentLiuYaoTimeInfo reuse passed');

    // 5. BRANCH_ELEMENT, BRANCH_CLASH (月破), and Xun Kong (旬空) factual accuracy
    assert.equal(najia.BRANCH_ELEMENT['申'], '金');
    assert.equal(najia.BRANCH_ELEMENT['寅'], '木');
    assert.equal(najia.BRANCH_ELEMENT['亥'], '水');
    assert.equal(najia.BRANCH_ELEMENT['巳'], '火');
    assert.equal(najia.BRANCH_ELEMENT['辰'], '土');

    const branches = Object.keys(najia.BRANCH_ELEMENT);
    assert.equal(branches.length, 12);
    for (const b of branches) {
      const opp = najia.BRANCH_CLASH[b];
      assert.ok(opp && opp !== b && najia.BRANCH_CLASH[opp] === b, `Clash symmetry failed for ${b}`);
    }

    // Check factual per-line isXunKong / isYuePo on deterministic LiuYaoTimeInfo
    // 978678 => 水泽节 (兑宫): 纳甲地支初至上为 巳、卯、丑、申、戌、子
    const deterministicTime = {
      solarDate: '2026-11-25 17:30',
      lunarDate: '丙午年 十月十六',
      yearGanzhi: '丙午',
      monthGanzhi: '己亥',
      dayGanzhi: '甲午',
      timeGanzhi: '癸酉',
      monthZhi: '亥', // 亥冲巳 => 巳爻月破
      dayZhi: '午',
      dayGan: '甲',
      xunKong: '辰巳' // 巳爻旬空
    };
    const chartReading = iching.buildReadingFromLines(manualLines, deterministicTime);
    const chartLines = chartReading.najia.lines;
    assert.equal(chartLines[0].branch, '巳');
    assert.equal(chartLines[0].isYuePo, true, 'Line 1 (巳) must be YuePo in 亥 month');
    assert.equal(chartLines[0].isXunKong, true, 'Line 1 (巳) must be XunKong in 辰巳 void');
    for (let i = 1; i < 6; i++) {
      assert.equal(chartLines[i].isYuePo, false);
      assert.equal(chartLines[i].isXunKong, false);
    }
    console.log('✓ 5. BRANCH_ELEMENT, Month Clash (月破), and Day Void (旬空) facts passed');

    // 6. Static check on CoinTossGsap.tsx
    const componentPath = path.resolve(process.cwd(), 'src/components/east/CoinTossGsap.tsx');
    const componentSource = fs.readFileSync(componentPath, 'utf8');
    assert.ok(!componentSource.includes('monthZhi}水'), 'Hardcoded 水 on monthZhi must be removed');
    assert.ok(!componentSource.includes('dayZhi}火'), 'Hardcoded 火 on dayZhi must be removed');
    assert.ok(componentSource.includes('BRANCH_ELEMENT['), 'CoinTossGsap.tsx must use BRANCH_ELEMENT lookup');
    assert.ok(
      componentSource.includes('parseCoinTossLinesInput'),
      'CoinTossGsap.tsx must reuse parseCoinTossLinesInput'
    );
    console.log('✓ 6. CoinTossGsap.tsx static audit passed');

    console.log('\n[OK] All LiuYao regression checks passed!');
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

run().catch((err) => {
  console.error('\n[FAIL] LiuYao regression failed:', err);
  process.exit(1);
});
