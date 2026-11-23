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
    const candidateDir = path.resolve(process.cwd(), 'src/lib', p1);
    if (fs.existsSync(candidateDir) && fs.statSync(candidateDir).isDirectory()) {
      return `from '${pathToFileURL(path.join(OUT_DIR, p1, 'index.js')).href}'`;
    }
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
  'src/lib/kb/principles/types.ts',
  'src/lib/kb/principles/jingshi.ts',
  'src/lib/kb/principles/index.ts',
  'src/lib/kb/types.ts',
  'src/lib/kb/wuxing.ts',
  'src/lib/kb/pan.ts',
  'src/lib/kb/canon.ts',
  'src/lib/kb/golden-rules.ts',
  'src/lib/kb/bushiquanshu-rules.ts',
  'src/lib/kb/bushiquanshu-cases.ts',
  'src/lib/kb/rules.ts',
  'src/lib/kb/cases.ts',
  'src/lib/kb/concepts.ts',
  'src/lib/kb/retriever.ts',
  'src/lib/kb/context-builder.ts',
  'src/lib/kb/guard.ts',
  'src/lib/llm/conversation.ts',
  'src/lib/kb/meihua/rules.ts',
  'src/lib/kb/meihua/cases.ts',
  'src/lib/kb/meihua/concepts.ts',
  'src/lib/kb/meihua/index.ts',
  'src/lib/metaphysics/meihua.ts'
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
  const { BUSHIQUANSHU_RULES } = await import(pathToFileURL(path.join(OUT_DIR, 'kb/bushiquanshu-rules.js')).href);
  const { CASES_DB, BUSHIQUANSHU_CASES, ZENGSHAN_CASES } = await import(pathToFileURL(path.join(OUT_DIR, 'kb/cases.js')).href);
  const { RULES_DB } = await import(pathToFileURL(path.join(OUT_DIR, 'kb/rules.js')).href);
  const { buildImagerySnapshot, SIX_RELATIVES_IMAGERY } = await import(pathToFileURL(path.join(OUT_DIR, 'kb/concepts.js')).href);

  // 0. 验证多书知识库整合：《增删卜易》30条 + 《卜筮全书》35条 + 62案例
  console.log('增删卜易黄金通则总数:', ZENGSHAN_CORE_RULES.length);
  console.log('卜筮全书通则总数:', BUSHIQUANSHU_RULES.length);
  console.log('规则库 RULES_DB 总数:', RULES_DB.length);
  console.log('案例库 CASES_DB 总数:', CASES_DB.length);
  if (ZENGSHAN_CORE_RULES.length !== 30) throw new Error('黄金通则数量应为 30 条');
  if (ZENGSHAN_CASES.length !== 42) throw new Error('增删卜易案例数量应为 42 条');
  if (BUSHIQUANSHU_RULES.length !== 35) throw new Error('卜筮全书通则数量应为 35 条');
  if (BUSHIQUANSHU_CASES.length !== 20) throw new Error('卜筮全书案例数量应为 20 个');
  if (CASES_DB.length !== 62) throw new Error('CASES_DB 总数应为 62 (42 + 20)');
  if (RULES_DB.length !== 245) throw new Error('RULES_DB 总数应为 245 (30 + 35 + 180)');
  if (ZENGSHAN_CORE_RULES[0].status !== 'verified') throw new Error('黄金通则首条应为 verified 状态');
  if (!SIX_RELATIVES_IMAGERY['妻财']) throw new Error('象意字典缺少妻财定义');

  // 0b. 验证《梅花易数》知识库（15条通则 + 10经典案例 + 八卦万物类象）
  const { MEIHUA_RULES } = await import(pathToFileURL(path.join(OUT_DIR, 'kb/meihua/rules.js')).href);
  const { MEIHUA_CASES } = await import(pathToFileURL(path.join(OUT_DIR, 'kb/meihua/cases.js')).href);
  const { BAGUA_WANWU_IMAGERY } = await import(pathToFileURL(path.join(OUT_DIR, 'kb/meihua/concepts.js')).href);
  const { divineMeihua } = await import(pathToFileURL(path.join(OUT_DIR, 'metaphysics/meihua.js')).href);

  console.log('梅花易数通则总数:', MEIHUA_RULES.length);
  console.log('梅花易数经典案例总数:', MEIHUA_CASES.length);
  if (MEIHUA_RULES.length !== 15) throw new Error('梅花易数通则应为 15 条');
  if (MEIHUA_CASES.length !== 10) throw new Error('梅花易数经典案例应为 10 个');
  if (!BAGUA_WANWU_IMAGERY['乾']) throw new Error('八卦万物类象缺少乾卦');

  // 0c. 验证《京氏易传》宇宙原理库（模式 C：55条元典：20条五行亢害承制 + 20条干支冲合会刑 + 15条四时旺相长生）
  const {
    JINGSHI_PRINCIPLES,
    JINGSHI_WUXING_CHENGZHI,
    JINGSHI_GANZHI_MECHANICS,
    JINGSHI_TWELVE_STAGES,
    getSanXingTheory,
    getTwelveStageTheory,
    getPrincipleById,
    buildCosmologicalSnapshot
  } = await import(pathToFileURL(path.join(OUT_DIR, 'kb/principles/index.js')).href);

  console.log('京氏易传五行亢害承制条数:', JINGSHI_WUXING_CHENGZHI.length);
  console.log('京氏易传干支冲合会刑条数:', JINGSHI_GANZHI_MECHANICS.length);
  console.log('京氏易传四时旺相长生条数:', JINGSHI_TWELVE_STAGES.length);
  console.log('京氏易传全量宇宙原理总数:', JINGSHI_PRINCIPLES.length);

  if (JINGSHI_WUXING_CHENGZHI.length !== 20) throw new Error('五行亢害承制应为 20 条');
  if (JINGSHI_GANZHI_MECHANICS.length !== 20) throw new Error('干支冲合会刑应为 20 条');
  if (JINGSHI_TWELVE_STAGES.length !== 15) throw new Error('四时旺相长生应为 15 条');
  if (JINGSHI_PRINCIPLES.length !== 55) throw new Error('京氏易传总数应为 55 条');

  const wuen = getSanXingTheory('无恩之刑');
  if (!wuen || !wuen.originTheory.includes('寅中有长生之火')) throw new Error('未正确检索到无恩之刑生成机理');

  const changsheng = getTwelveStageTheory('长生');
  if (!changsheng || !changsheng.originTheory.includes('水长生在申')) throw new Error('未正确检索到水长生在申机理');

  const youhun = getPrincipleById('jsyc.wuxing.06');
  if (!youhun || !youhun.practicalGuidance.includes('游魂')) throw new Error('未正确检索到游魂卦机理');

  const cosmoSnapshot = buildCosmologicalSnapshot(['无恩之刑', '长生']);
  if (!cosmoSnapshot.includes('无恩之刑')) throw new Error('宇宙原理快照生成失败');

  // 测试梅花起卦自动关联邵康节经典案例（观梅占：上兑2，下离3，动爻1 -> 泽火革变泽山咸）
  const meihuaTest = divineMeihua('二雀争梅花枝', 'numbers', [2, 3, 1]);
  console.log('梅花测算本卦:', meihuaTest.primaryHexagram.fullNameZh);
  console.log('梅花测算变卦:', meihuaTest.transformedHexagram.fullNameZh);
  console.log('梅花命中宗师卦案:', meihuaTest.classicCase?.title);
  if (meihuaTest.primaryHexagram.fullNameZh !== '泽火革') throw new Error('本卦应为泽火革');
  if (meihuaTest.transformedHexagram.fullNameZh !== '泽山咸') throw new Error('变卦应为泽山咸');
  if (!meihuaTest.classicCase?.title.includes('观梅占')) throw new Error('应命中观梅占经典案例');

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
