import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const OUT_DIR = path.resolve(process.cwd(), 'scratch/kb-test');
fs.mkdirSync(OUT_DIR, { recursive: true });

function transpileFile(srcRelative) {
  const fullPath = path.resolve(process.cwd(), srcRelative);
  let code = fs.readFileSync(fullPath, 'utf8');

  // Convert alias @/ to absolute path to file in OUT_DIR
  code = code.replace(/from\s+['"]@\/lib\/([^'"]+)['"]/g, (match, p1) => {
    return `from '${pathToFileURL(path.join(OUT_DIR, p1 + '.js')).href}'`;
  });

  // Convert relative imports from './xxx' to './xxx.js'
  code = code.replace(/from\s+['"](\.[^'"]+)['"]/g, (match, p1) => {
    return `from '${p1}.js'`;
  });

  const transpiled = ts.transpileModule(code, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022
    }
  });

  // Determine output path matching structure
  const sub = path.relative(path.resolve(process.cwd(), 'src/lib'), fullPath);
  const outPath = path.join(OUT_DIR, sub.replace(/\.tsx?$/, '.js'));
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, transpiled.outputText);
  return outPath;
}

const files = [
  'src/lib/metaphysics/hexagrams64.ts',
  'src/lib/metaphysics/najia.ts',
  'src/lib/metaphysics/iching.ts',
  'src/lib/kb/types.ts',
  'src/lib/kb/wuxing.ts',
  'src/lib/kb/pan.ts',
  'src/lib/kb/canon.ts',
  'src/lib/kb/golden-rules.ts',
  'src/lib/kb/rules.ts',
  'src/lib/kb/cases.ts',
  'src/lib/kb/concepts.ts',
  'src/lib/kb/retriever.ts',
  'src/lib/kb/context-builder.ts',
  'src/lib/kb/guard.ts',
  'src/lib/llm/conversation.ts'
];

for (const f of files) {
  transpileFile(f);
}

async function run() {
  console.log('--- 正在启动六爻知识库与上下文测试 ---');

  const { buildReadingFromLines } = await import(pathToFileURL(path.join(OUT_DIR, 'metaphysics/iching.js')).href);
  const { deriveChartFacts } = await import(pathToFileURL(path.join(OUT_DIR, 'kb/pan.js')).href);
  const { retrieveKnowledge } = await import(pathToFileURL(path.join(OUT_DIR, 'kb/retriever.js')).href);
  const { buildKnowledgeBlock } = await import(pathToFileURL(path.join(OUT_DIR, 'kb/context-builder.js')).href);
  const { auditLiuYaoReport } = await import(pathToFileURL(path.join(OUT_DIR, 'kb/guard.js')).href);
  const { buildFollowUpMessages } = await import(pathToFileURL(path.join(OUT_DIR, 'llm/conversation.js')).href);
  const { ZENGSHAN_CORE_RULES } = await import(pathToFileURL(path.join(OUT_DIR, 'kb/golden-rules.js')).href);
  const { buildImagerySnapshot, SIX_RELATIVES_IMAGERY } = await import(pathToFileURL(path.join(OUT_DIR, 'kb/concepts.js')).href);

  // 0. 验证《增删卜易》30条黄金通则与象意字典
  console.log('增删卜易黄金通则总数:', ZENGSHAN_CORE_RULES.length);
  if (ZENGSHAN_CORE_RULES.length !== 30) throw new Error('黄金通则数量应为 30 条');
  if (ZENGSHAN_CORE_RULES[0].status !== 'verified') throw new Error('黄金通则首条应为 verified 状态');
  if (!SIX_RELATIVES_IMAGERY['妻财']) throw new Error('象意字典缺少妻财定义');

  // 1. 测试盘面：乾为天（无变爻，六爻安静，纯阳六冲）
  const qianLines = [
    { lineIndex: 1, coins: [2, 2, 3], sum: 7, isYang: true, isChanging: false, changedYang: true },
    { lineIndex: 2, coins: [2, 2, 3], sum: 7, isYang: true, isChanging: false, changedYang: true },
    { lineIndex: 3, coins: [2, 2, 3], sum: 7, isYang: true, isChanging: false, changedYang: true },
    { lineIndex: 4, coins: [2, 2, 3], sum: 7, isYang: true, isChanging: false, changedYang: true },
    { lineIndex: 5, coins: [2, 2, 3], sum: 7, isYang: true, isChanging: false, changedYang: true },
    { lineIndex: 6, coins: [2, 2, 3], sum: 7, isYang: true, isChanging: false, changedYang: true }
  ];
  const qianReading = buildReadingFromLines(qianLines);
  const qianFacts = deriveChartFacts(qianReading);

  console.log('乾为天 conditions:', Array.from(qianFacts.conditions));
  if (!qianFacts.conditions.has('all-quiet')) throw new Error('乾为天应有 all-quiet 条件');
  if (!qianFacts.conditions.has('liu-chong-gua')) throw new Error('乾为天应有 liu-chong-gua 条件');

  // 2. 测试三路检索
  const bundle = retrieveKnowledge({
    question: '今年求财投资如何？',
    reading: qianReading,
    lang: 'zh'
  });

  console.log('检索命中条目数:', bundle.hits.length);
  console.log('用神识别:', bundle.yongShen);
  if (bundle.yongShen.topic !== '财运') throw new Error('未能识别财运主题');
  if (!bundle.yongShen.primary.includes('妻财')) throw new Error('财运主用神应为妻财');

  console.log('Hits 清单:');
  for (const h of bundle.hits) {
    console.log(`  ${h.ref}: [${h.entry.source.book}·${h.entry.source.chapter}] (分值: ${h.score}) - ${h.reason}`);
  }

  // 2b. 测试象意提取 (concepts)
  const imagery = buildImagerySnapshot(qianReading, bundle.yongShen.primary);
  console.log('\n象意生成结果:\n', imagery);
  if (!imagery.includes('用神取象·妻财')) throw new Error('象意生成应包含妻财取象');

  // 3. 测试 KB 块组装与预算控制
  const { block, usedRefs, droppedRefs } = buildKnowledgeBlock(bundle, { maxChars: 2500 });
  console.log('KB 块生成长度:', block.length);
  console.log('已保留编号:', usedRefs);
  console.log('已丢弃编号:', droppedRefs);
  if (!block.startsWith('<knowledge_base>') || !block.endsWith('</knowledge_base>')) {
    throw new Error('KB 块必须用 <knowledge_base> 标签包裹');
  }

  // 4. 测试审计守卫 (guard)
  console.log('\n--- 测试 Guard 审计 ---');

  // 4a. 包含未知引用
  const badCitationReport = `
## 一、结论
**成**。求财大吉 [KB-99]。
## 二、依据
妻财旺相 → 断语（[KB-01]）
## 三、应期
出空之日。
## 四、风险信号
若出酉金。
## 五、若…则…
若用神旺，则吉。
`;
  const audit1 = auditLiuYaoReport(badCitationReport, {
    allowedRefs: usedRefs,
    reading: qianReading
  });
  console.log('未知引用测试结果 (期待 fail):', audit1.ok, audit1.issues);
  if (audit1.ok || !audit1.issues.some(i => i.type === 'unknown_citation')) {
    throw new Error('Guard 未拦截未知引用编号');
  }

  // 4b. 包含禁用词汇
  const bannedReport = `
## 一、结论
**成而有阻**。依妻财断 [KB-01]。
## 二、依据
顺其自然，保持平和 → 顺应变化（[KB-01]）
## 三、应期
辰月。
## 四、风险信号
无。
## 五、若…则…
若逢冲，则散。
`;
  const audit2 = auditLiuYaoReport(bannedReport, {
    allowedRefs: usedRefs,
    reading: qianReading
  });
  console.log('禁用词测试结果 (期待 fail):', audit2.ok, audit2.issues);
  if (audit2.ok || !audit2.issues.some(i => i.type === 'banned_phrase')) {
    throw new Error('Guard 未拦截禁用词');
  }

  // 4c. 自造爻辞
  const fabricatedLineReport = `
## 一、结论
**成** [KB-01]。
## 二、依据
初九：飞龙在天，利见大人 → 吉（[KB-01]）
## 三、应期
明日。
## 四、风险信号
无。
## 五、若…则…
若变，则应。
`;
  const audit3 = auditLiuYaoReport(fabricatedLineReport, {
    allowedRefs: usedRefs,
    reading: qianReading
  });
  console.log('自造爻辞测试结果 (期待 fail):', audit3.ok, audit3.issues);
  if (audit3.ok || !audit3.issues.some(i => i.type === 'fabricated_line_text')) {
    throw new Error('Guard 未拦截自造爻辞');
  }

  // 4d. 合规报告测试
  const goodReport = `
## 一、结论
**成**。求财得妻财生旺，时机已至 [KB-01]。
## 二、依据
用神临旺 → 财源广进（[KB-01]）
六冲主散，后合主成 → 逢值成事（[KB-02]）
## 三、应期
应在子月出空之日。
## 四、风险信号
若卦中再动官鬼克世。
## 五、若…则…
若财爻旺，则必得；若日辰克，则有阻。
`;
  const audit4 = auditLiuYaoReport(goodReport, {
    allowedRefs: usedRefs,
    reading: qianReading
  });
  console.log('合规报告测试结果 (期待 pass):', audit4.ok, audit4.issues);
  if (!audit4.ok) {
    throw new Error('合规报告不应被拦截: ' + JSON.stringify(audit4.issues));
  }

  // 5. 测试上下文管理 (conversation)
  console.log('\n--- 测试上下文管理 Conversation ---');
  const history = [
    { role: 'user', content: '第一问：关于合伙人靠谱吗？' },
    { role: 'assistant', content: '合伙人看应爻，应爻临官鬼旺相。' },
    { role: 'user', content: '第二问：那资金什么时候到位？' },
    { role: 'assistant', content: '资金看妻财，妻财逢合，需待冲开之日。' }
  ];
  const convResult = buildFollowUpMessages({
    history,
    question: '第三问：具体的月份是哪个月？',
    budgetChars: 50 // 故意给 50 字符预算（已存在 77 字符）测试压缩
  });
  console.log('上下文结果: messages count =', convResult.messages.length);
  console.log('Dropped turns:', convResult.droppedTurns);
  console.log('Final user content:\n', convResult.messages[convResult.messages.length - 1].content);

  if (convResult.droppedTurns <= 0) {
    throw new Error('超预算时应丢弃并生成前缀摘要');
  }

  console.log('\n=== 全部六爻知识库与上下文测试全部通过！ ===');
}

run().catch(err => {
  console.error('测试失败:', err);
  process.exit(1);
});
