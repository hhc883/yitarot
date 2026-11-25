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
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });

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
