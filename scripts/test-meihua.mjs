import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

const ROOT = process.cwd();
let outDir;
let meihuaMod;

function transpileInto(tempDir, srcRelative) {
  const fullPath = path.resolve(ROOT, srcRelative);
  let code = fs.readFileSync(fullPath, 'utf8');

  code = code.replace(/from\s+['"]@\/lib\/([^'"]+)['"]/g, (_match, p1) => {
    const candidateDir = path.resolve(ROOT, 'src/lib', p1);
    if (fs.existsSync(candidateDir) && fs.statSync(candidateDir).isDirectory()) {
      return `from '${pathToFileURL(path.join(tempDir, p1, 'index.js')).href}'`;
    }
    return `from '${pathToFileURL(path.join(tempDir, p1 + '.js')).href}'`;
  });

  code = code.replace(/from\s+['"](\.[^'"]+)['"]/g, (_match, p1) => {
    return `from '${p1}.js'`;
  });

  const transpiled = ts.transpileModule(code, {
    fileName: fullPath,
    reportDiagnostics: true,
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });
  const errors = transpiled.diagnostics.filter(diagnostic => diagnostic.category === ts.DiagnosticCategory.Error);
  assert.equal(errors.length, 0, errors.map(error => ts.flattenDiagnosticMessageText(error.messageText, '\n')).join('\n'));

  const sub = path.relative(path.resolve(ROOT, 'src/lib'), fullPath);
  const outPath = path.join(tempDir, sub.replace(/\.tsx?$/, '.js'));
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, transpiled.outputText);
  return outPath;
}

before(async () => {
  outDir = fs.mkdtempSync(path.join(ROOT, 'node_modules', '.meihua-test-'));
  const files = [
    'src/lib/metaphysics/hexagrams64.ts',
    'src/lib/kb/canon.ts',
    'src/lib/kb/meihua/rules.ts',
    'src/lib/kb/meihua/cases.ts',
    'src/lib/kb/meihua/concepts.ts',
    'src/lib/kb/meihua/index.ts',
    'src/lib/metaphysics/meihua.ts',
  ];
  for (const f of files) {
    transpileInto(outDir, f);
  }
  meihuaMod = await import(pathToFileURL(path.join(outDir, 'metaphysics/meihua.js')).href);
});

after(() => {
  if (outDir) {
    fs.rmSync(outDir, { recursive: true, force: true });
  }
});

test('Beijing time 2026-11-25 12:00 casts Zetian Guai, moving line 5, transforming to Leitian Dazhuang', () => {
  const { divineMeihua, parseMeihuaBeijingTime } = meihuaMod;
  const instant = parseMeihuaBeijingTime('2026-11-25T12:00');
  assert.ok(instant, '2026-11-25T12:00 should parse as valid Beijing time');
  assert.equal(instant.toISOString(), '2026-11-25T04:00:00.000Z');

  const result = divineMeihua('回归校验', 'time', undefined, instant);
  assert.equal(result.primaryHexagram.fullNameZh, '泽天夬');
  assert.equal(result.primaryHexagram.symbol, '䷪');
  assert.equal(result.movingLine, 5);
  assert.equal(result.transformedHexagram.fullNameZh, '雷天大壮');
  assert.equal(result.transformedHexagram.symbol, '䷡');

  assert.equal(result.basis.mode, 'time');
  assert.equal(result.basis.yearBranch, '午');
  assert.equal(result.basis.yearBranchNum, 7);
  assert.equal(result.basis.lunarMonth, 10);
  assert.equal(result.basis.lunarDay, 17);
  assert.equal(result.basis.hourBranch, '午');
  assert.equal(result.basis.hourBranchNum, 7);
  assert.equal(result.basis.sumUpper, 34);
  assert.equal(result.basis.sumLower, 41);
  assert.deepEqual(result.basis.remainders, {
    upper: 2,
    lower: 1,
    moving: 5,
    upperRawMod: 2,
    lowerRawMod: 1,
    movingRawMod: 5,
  });

  // Injected UTC instant matching Beijing 2026-11-25 12:00 must be host-timezone independent
  const fromUtc = divineMeihua('UTC校验', 'time', undefined, new Date('2026-11-25T04:00:00.000Z'));
  assert.equal(fromUtc.primaryHexagram.fullNameZh, '泽天夬');
  assert.equal(fromUtc.movingLine, 5);
  assert.equal(fromUtc.transformedHexagram.fullNameZh, '雷天大壮');
});

test('Zero remainder resolves to 8 for trigrams and 6 for moving line, and symbol follows hexagram', () => {
  const { divineMeihua, parseMeihuaBeijingTime } = meihuaMod;

  // 2026-11-23 is Lunar 丙午(7)年 十(10)月 十五(15)日 => sumUpper = 32 (mod 8 === 0 -> 8 坤)
  // 13:00 is 未时(8) => sumLower = 40 (mod 8 === 0 -> 8 坤, mod 6 === 4 -> line 4)
  const kunTime = parseMeihuaBeijingTime('2026-11-23T13:00');
  assert.ok(kunTime);
  const kunRes = divineMeihua('余0取8测试', 'time', undefined, kunTime);
  assert.equal(kunRes.primaryHexagram.fullNameZh, '坤为地');
  assert.equal(kunRes.primaryHexagram.symbol, '䷁');
  assert.equal(kunRes.movingLine, 4);
  assert.equal(kunRes.basis.remainders.upperRawMod, 0);
  assert.equal(kunRes.basis.remainders.upper, 8);
  assert.equal(kunRes.basis.remainders.lowerRawMod, 0);
  assert.equal(kunRes.basis.remainders.lower, 8);

  // 2026-11-23 17:00 is 酉时(10) => sumLower = 42 (mod 6 === 0 -> line 6)
  const line6Time = parseMeihuaBeijingTime('2026-11-23T17:00');
  assert.ok(line6Time);
  const line6Res = divineMeihua('余0取6测试', 'time', undefined, line6Time);
  assert.equal(line6Res.primaryHexagram.fullNameZh, '地泽临');
  assert.equal(line6Res.primaryHexagram.symbol, '䷒');
  assert.equal(line6Res.movingLine, 6);
  assert.equal(line6Res.basis.remainders.movingRawMod, 0);
  assert.equal(line6Res.basis.remainders.moving, 6);

  // Site three-number rule continues to work and reports distinct hexagram symbol
  const numRes = divineMeihua('三数规则', 'numbers', [8, 16, 12]);
  assert.equal(numRes.primaryHexagram.fullNameZh, '坤为地');
  assert.equal(numRes.primaryHexagram.symbol, '䷁');
  assert.equal(numRes.movingLine, 6);
  assert.equal(numRes.basis.mode, 'numbers');
  assert.deepEqual(numRes.basis.inputNumbers, [8, 16, 12]);

  const plumCase = divineMeihua('观梅占', 'numbers', [2, 3, 1]);
  assert.equal(plumCase.primaryHexagram.fullNameZh, '泽火革');
  assert.equal(plumCase.primaryHexagram.symbol, '䷰');
  assert.equal(plumCase.transformedHexagram.fullNameZh, '泽山咸');
  assert.equal(plumCase.transformedHexagram.symbol, '䷞');
});

test('Rejects invalid Beijing time strings and invalid three-number inputs', () => {
  const { divineMeihua, parseMeihuaBeijingTime } = meihuaMod;
  for (const bad of ['', '2026-02-30T12:00', '2026-11-25T24:00', '2026-11-25T12:00Z']) {
    assert.equal(parseMeihuaBeijingTime(bad), null, bad);
  }
  assert.throws(() => divineMeihua('invalid', 'numbers', [0, 1, 1]), RangeError);
  assert.throws(() => divineMeihua('invalid', 'numbers', [1.5, 2, 3]), RangeError);
});

test('Same primary Ti-Yong produces distinct nuclear/transformed comparisons and mixed signals', () => {
  const { divineMeihua } = meihuaMod;

  // Cast A: [1, 3, 1] -> 天火同人, line 1 moving -> Body=乾(Metal), PrimaryUse=离(Fire)
  // Mutual: Upper=乾(Metal, same), Lower=巽(Wood, body_overcomes_target)
  // Transformed: 艮(Earth, target_generates_body)
  const castA = divineMeihua('同体用对比A', 'numbers', [1, 3, 1]);
  assert.equal(castA.primaryHexagram.fullNameZh, '天火同人');
  assert.equal(castA.bodyTrigram.trigram.nameZh, '乾');
  assert.equal(castA.applicationTrigram.trigram.nameZh, '离');
  assert.equal(castA.synthesis.comparisons.length, 4);

  const [aPrimary, aMutUp, aMutLow, aTrans] = castA.synthesis.comparisons;
  assert.equal(aPrimary.stage, 'primary_use');
  assert.equal(aPrimary.direction, 'target_overcomes_body');
  assert.equal(aMutUp.stage, 'mutual_upper');
  assert.equal(aMutUp.target.nameZh, '乾');
  assert.equal(aMutUp.direction, 'same');
  assert.equal(aMutLow.stage, 'mutual_lower');
  assert.equal(aMutLow.target.nameZh, '巽');
  assert.equal(aMutLow.direction, 'body_overcomes_target');
  assert.equal(aTrans.stage, 'transformed_use');
  assert.equal(aTrans.target.nameZh, '艮');
  assert.equal(aTrans.direction, 'target_generates_body');
  assert.equal(castA.synthesis.hasMixedSignals, true);
  assert.equal(castA.mutualHexagram.basis, 'primary');

  // Cast B: [3, 1, 4] -> 火天大有, line 4 moving -> Body=乾(Metal), PrimaryUse=离(Fire) (SAME primary Ti-Yong!)
  // Mutual: Upper=兑(Metal, same), Lower=乾(Metal, same) -> distinct from Cast A's 巽(Wood) & 乾(Metal)!
  // Transformed: 艮(Earth, target_generates_body)
  const castB = divineMeihua('同体用对比B', 'numbers', [3, 1, 4]);
  assert.equal(castB.primaryHexagram.fullNameZh, '火天大有');
  assert.equal(castB.bodyTrigram.trigram.nameZh, '乾');
  assert.equal(castB.applicationTrigram.trigram.nameZh, '离');
  assert.equal(castB.synthesis.comparisons[0].direction, 'target_overcomes_body');
  assert.equal(castB.synthesis.comparisons[1].target.nameZh, '兑');
  assert.equal(castB.synthesis.comparisons[2].target.nameZh, '乾');
  assert.notEqual(
    castA.synthesis.comparisons[2].direction,
    castB.synthesis.comparisons[2].direction
  );

  // Cast C: [1, 3, 3] -> 天火同人, line 3 moving -> Body=乾(Metal), PrimaryUse=离(Fire)
  // Transformed: 震(Wood, body_overcomes_target) -> distinct transformed application from Cast A (艮 Earth)!
  const castC = divineMeihua('同体用对比C', 'numbers', [1, 3, 3]);
  assert.equal(castC.synthesis.comparisons[3].target.nameZh, '震');
  assert.equal(castC.synthesis.comparisons[3].direction, 'body_overcomes_target');
  assert.notEqual(
    castA.synthesis.comparisons[3].direction,
    castC.synthesis.comparisons[3].direction
  );
});

test('Pure Qian and Kun take their nuclear trigrams from the transformed lines', () => {
  const { divineMeihua } = meihuaMod;
  const qian = divineMeihua('', 'numbers', [1, 1, 2]);
  assert.equal(qian.primaryHexagram.fullNameZh, '乾为天');
  assert.equal(qian.mutualHexagram.basis, 'transformed');
  assert.equal(qian.mutualHexagram.upper.nameZh, '乾');
  assert.equal(qian.mutualHexagram.lower.nameZh, '巽');
  assert.equal(qian.transformedHexagram.lower.nameZh, '离');

  const kun = divineMeihua('', 'numbers', [8, 8, 5]);
  assert.equal(kun.primaryHexagram.fullNameZh, '坤为地');
  assert.equal(kun.mutualHexagram.basis, 'transformed');
  assert.equal(kun.mutualHexagram.upper.nameZh, '艮');
  assert.equal(kun.mutualHexagram.lower.nameZh, '坤');
  assert.equal(kun.transformedHexagram.upper.nameZh, '坎');
});

test('Flags unassessed seasonal/omen evidence honestly and separates I Ching canon without canned verdicts', () => {
  const { divineMeihua, parseMeihuaBeijingTime } = meihuaMod;

  const numCast = divineMeihua('缺时令测试', 'numbers', [8, 16, 12]);
  assert.equal(numCast.assessments.seasonal.status, 'not_assessed');
  assert.equal(numCast.assessments.seasonal.hasDateContext, false);
  assert.equal(numCast.assessments.externalOmens.status, 'not_assessed');
  assert.equal(numCast.synthesis.comparisons[0].direction, 'same');
  assert.equal(numCast.ichingCanon.primary.nameZh, '坤为地');
  assert.equal(numCast.ichingCanon.primary.judgmentZh, '元亨，利牝马之贞。');
  assert.equal(numCast.ichingCanon.movingLineText, null);
  assert.equal('decisionActionZh' in numCast, false);
  assert.equal('decisionActionEn' in numCast, false);
  assert.equal('wuxingRelation' in numCast, false);

  const timeInstant = parseMeihuaBeijingTime('2026-11-25T12:00');
  assert.ok(timeInstant);
  const timeCast = divineMeihua('时间起卦未评估时令测试', 'time', undefined, timeInstant);
  assert.equal(timeCast.assessments.seasonal.status, 'not_assessed');
  assert.equal(timeCast.assessments.seasonal.hasDateContext, true);
  assert.equal(timeCast.assessments.externalOmens.status, 'not_assessed');
  assert.equal(timeCast.ichingCanon.primary.nameZh, '泽天夬');
  assert.equal(timeCast.ichingCanon.transformed.nameZh, '雷天大壮');
  assert.ok(timeCast.synthesis.sources.every(s => {
    const source = new URL(s.url);
    return source.hostname === 'zh.wikisource.org' && source.hash.length > 1;
  }));
});
