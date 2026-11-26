import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, extname, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = fileURLToPath(new URL('../', import.meta.url));
const nativeRequire = createRequire(import.meta.url);

function createLoader(stubs = {}) {
  const cache = new Map();

  return function load(file) {
    const filename = resolve(root, file);
    if (cache.has(filename)) return cache.get(filename).exports;

    const moduleRecord = { exports: {} };
    cache.set(filename, moduleRecord);
    const result = ts.transpileModule(readFileSync(filename, 'utf8'), {
      fileName: filename,
      reportDiagnostics: true,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    });
    assert.deepEqual(result.diagnostics, [], filename);

    const requireForTest = (id) => {
      if (Object.hasOwn(stubs, id)) return stubs[id];
      if (id.startsWith('@/') || id.startsWith('.')) {
        const target = id.startsWith('@/')
          ? resolve(root, 'src', id.slice(2))
          : resolve(dirname(filename), id);
        return load(extname(target) ? target : target + '.ts');
      }
      return nativeRequire(id);
    };
    Function('require', 'module', 'exports', result.outputText)(
      requireForTest, moduleRecord, moduleRecord.exports
    );
    return moduleRecord.exports;
  };
}

test('BaZi reports use evidence from the current chart and reject invented selections', () => {
  const load = createLoader();
  const { calculateBaZi } = load('src/lib/metaphysics/bazi.ts');
  const {
    buildBaziEvidenceBundle, buildBaziSelectionMessages,
    renderLocalBaziFallback, validateBaziEvidenceSelection,
  } = load('src/lib/metaphysics/bazi-evidence.ts');
  const first = calculateBaZi(1996, 8, 18, 12, 0, { gender: 'male', yunSect: 1 });
  const second = calculateBaZi(1989, 11, 4, 5, 30);
  const bundle = buildBaziEvidenceBundle(first);
  const noDayun = buildBaziEvidenceBundle(second);

  assert.notEqual(bundle.byId['day-master'].factZh, noDayun.byId['day-master'].factZh);
  assert.notEqual(renderLocalBaziFallback(first), renderLocalBaziFallback(second));
  assert.equal(noDayun.idSet.has('dayun-steps'), false);
  assert.ok(!buildBaziSelectionMessages(bundle).userPrompt.includes('1996-08-18'));

  for (const invalid of [
    '', 'extra text', '{"refs":[]}', '{"refs":["day-master"',
    '{"refs":["day-master","unverified-source"]}',
    '{"refs":["day-master","day-master"]}',
    '{"refs":["day-master"],"prose":"unverified"}',
  ]) {
    assert.equal(validateBaziEvidenceSelection(invalid, bundle.idSet).ok, false, invalid);
  }
  assert.equal(validateBaziEvidenceSelection('{"refs":["dayun-steps"]}', noDayun.idSet).ok, false);
  assert.equal(validateBaziEvidenceSelection(
    '{"refs":["day-master","pillar-month","ten-gods-distribution"]}', bundle.idSet
  ).ok, true);
});

test('BaZi API validates before checking the spend and never streams unverified model text', async () => {
  let spendChecks = 0;
  let spendApproved = false;
  let modelCalls = 0;
  let modelPieces = [];
  let interrupted = false;
  const load = createLoader({
    './skills/registry': {},
    '@/lib/kb/retriever': {},
    '@/lib/kb/context-builder': {},
    '@/lib/kb/concepts': {},
    '@/lib/kb/cezi': {},
    '@/lib/points/server': {
      verifyReadingSpend: async () => {
        spendChecks++;
        return { ok: spendApproved, status: 402 };
      },
      pointsErrorResponse: (status) => new Response(null, { status }),
    },
    '@/lib/llm/adapter': {
      async *streamLLM() {
        modelCalls++;
        yield* modelPieces;
        if (interrupted) throw new Error('Test stream stopped');
      },
    },
  });
  const { POST } = load('src/app/api/east/bazi/route.ts');
  const input = {
    year: 1996, month: 8, day: 18, hour: 12, gender: 'male',
    yunSect: 1, lang: 'en', points_ref: 'test-ref',
  };
  const send = (body) => POST(new Request('http://localhost/api/east/bazi', {
    method: 'POST',
    body: typeof body === 'string' ? body : JSON.stringify(body),
  }));
  const report = async (response) => {
    assert.equal(response.status, 200);
    const events = (await response.text()).split('\n')
      .filter((line) => line.startsWith('data: ')).map((line) => line.slice(6));
    assert.equal(events.pop(), '[DONE]');
    return events.map((event) => JSON.parse(event).text).join('');
  };

  assert.equal((await send({ ...input, month: 2, day: 30 })).status, 400);
  assert.equal((await send('[')).status, 400);
  assert.equal(spendChecks, 0);
  assert.equal((await send(input)).status, 402);
  assert.equal(modelCalls, 0);

  spendApproved = true;
  modelPieces = ['{"refs":["day-master",', '"pillar-month","ten-gods-distribution"]}'];
  assert.match(await report(await send(input)), /Day Master/);
  modelPieces = ['{"refs":["unverified-source"]}'];
  const fallback = await report(await send(input));
  assert.match(fallback, /local fallback|local evidence/i);
  assert.doesNotMatch(fallback, /unverified-source/);
  modelPieces = ['{"refs":["day-master"'];
  interrupted = true;
  assert.equal(await report(await send(input)), fallback);
});
