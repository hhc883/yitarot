import fs from 'fs';
import path from 'path';

const content = fs.readFileSync(path.resolve(process.cwd(), 'data/kb/liuyao/bushiquanshu-extracted.md'), 'utf8');

// ==========================================
// 1. Parse Rules (35 Rules)
// ==========================================
const ruleBlocks = content.match(/#### Rule \d+：[\s\S]+?(?=(#### Rule \d+：|### 【模块二))/g);
if (!ruleBlocks) {
  console.error('No rule blocks found');
  process.exit(1);
}

const ruleEntries = [];

ruleBlocks.forEach((block, idx) => {
  const num = String(idx + 1).padStart(2, '0');
  const titleMatch = block.match(/#### Rule \d+：(.+)/);
  const title = titleMatch ? titleMatch[1].trim() : '';

  const topicMatch = block.match(/- \*\*【适用门类】\*\*：(.+)/);
  const rawTopic = topicMatch ? topicMatch[1].trim() : '';

  const condMatch = block.match(/- \*\*【触发盘面条件】\*\*：(.+)/);
  const rawCond = condMatch ? condMatch[1].trim() : '';

  const textMatch = block.match(/- \*\*【核心断语与易理】\*\*：(.+)/);
  const text = textMatch ? textMatch[1].trim() : '';

  const timingMatch = block.match(/- \*\*【应期推法】\*\*：(.+)/);
  const timing = timingMatch ? timingMatch[1].trim() : '';

  // Relatives
  const relatives = [];
  ['父母', '官鬼', '兄弟', '妻财', '子孙'].forEach(r => {
    if (title.includes(r) || rawTopic.includes(r) || rawCond.includes(r)) {
      relatives.push(r);
    }
  });

  // Topics
  const topics = [];
  if (rawTopic.includes('疾病') || rawTopic.includes('疾厄')) topics.push('疾病');
  if (rawTopic.includes('求财') || rawTopic.includes('贸易')) topics.push('财运');
  if (rawTopic.includes('婚姻') || rawTopic.includes('婚配') || rawTopic.includes('婚娶')) topics.push('婚恋');
  if (rawTopic.includes('官') || rawTopic.includes('仕宦')) topics.push('事业');
  if (rawTopic.includes('科举')) topics.push('考试');
  if (rawTopic.includes('讼') || rawTopic.includes('词讼') || rawTopic.includes('诤讼')) topics.push('诉讼');
  if (rawTopic.includes('出行') || rawTopic.includes('行旅') || rawTopic.includes('行人')) topics.push('出行');
  if (rawTopic.includes('家宅')) topics.push('家宅');
  if (rawTopic.includes('失脱') || rawTopic.includes('捕盗')) topics.push('失物');
  if (rawTopic.includes('胎产') || rawTopic.includes('天时') || rawTopic.includes('年时') || rawTopic.includes('风水')) topics.push('other');

  // Conditions
  const conditions = new Set();
  if (title.includes('月破') || rawCond.includes('月破')) conditions.add('month-break');
  if (title.includes('自空') || title.includes('旬空') || rawCond.includes('旬空') || title.includes('避凶而空')) conditions.add('xun-kong');
  if (title.includes('动') || rawCond.includes('动') || title.includes('独发') || title.includes('乱动')) conditions.add('moving');
  if (title.includes('暗动') || rawCond.includes('冲起') || rawCond.includes('相冲')) conditions.add('dark-move');
  if (title.includes('进神') || title.includes('退神')) { conditions.add('transform-advance'); conditions.add('transform-retreat'); }
  if (title.includes('反吟')) conditions.add('fan-yin');
  if (title.includes('伏吟')) conditions.add('fu-yin');
  if (title.includes('逢冲') || rawCond.includes('六冲')) conditions.add('liu-chong-gua');
  if (title.includes('逢合') || rawCond.includes('六合') || title.includes('天地合德')) conditions.add('liu-he-gua');
  if (title.includes('入墓') || rawCond.includes('入墓')) conditions.add('ru-mu');
  if (title.includes('回头克') || rawCond.includes('回头克')) conditions.add('hui-tou-ke');
  if (title.includes('回头生')) conditions.add('hui-tou-sheng');
  if (title.includes('绝处逢生')) conditions.add('hua-jue');
  if (title.includes('飞神') || title.includes('伏神') || rawCond.includes('用神不现')) conditions.add('yong-shen-bu-xian');
  if (title.includes('两鬼') || title.includes('两财') || rawCond.includes('两重')) conditions.add('yong-shen-liang-xian');
  if (title.includes('化空')) conditions.add('hua-kong');

  let verdict = '吉';
  if (title.includes('必死') || title.includes('大祸') || title.includes('百无一成') || title.includes('随官入墓') || title.includes('成灾') || title.includes('鬼动')) {
    verdict = '凶';
  } else if (title.includes('合处逢冲') || title.includes('两鬼两财')) {
    verdict = '先合后离';
  } else if (title.includes('绝处逢生') || title.includes('用克世勿作凶看') || title.includes('始难终吉')) {
    verdict = '先难后易';
  } else if (title.includes('阻隔') || title.includes('乱动') || title.includes('反复') || title.includes('间爻') || title.includes('逢合')) {
    verdict = '成中有阻';
  }

  ruleEntries.push({
    id: `bsqs.rule.${num}`,
    kind: 'rule',
    status: 'verified',
    source: {
      book: '卜筮全书',
      chapter: '断易赋论',
      note: title
    },
    when: {
      relative: relatives.length > 0 ? relatives : undefined,
      topic: topics.length > 0 ? topics : undefined,
      conditions: conditions.size > 0 ? Array.from(conditions) : undefined,
      note: rawCond
    },
    text: text,
    verdict: verdict,
    timing: timing,
    credibility: 5
  });
});

const rulesTs = `import type { KBEntry } from './types';

/**
 * 《卜筮全书》（明·姚际隆 辑选删补）35 条核心断易赋论通则
 * 涵盖：生克权舆、避凶而空、动始变终、进退定序、飞伏引拔、
 *       杀生身莫作吉断/用克世勿作凶推、随官入墓、天地合德、助鬼伤身等。
 * status: 'verified', credibility: 5
 */
export const BUSHIQUANSHU_RULES: KBEntry[] = ${JSON.stringify(ruleEntries, null, 2)};
`;

fs.writeFileSync(path.resolve(process.cwd(), 'src/lib/kb/bushiquanshu-rules.ts'), rulesTs, 'utf8');
console.log(`Generated src/lib/kb/bushiquanshu-rules.ts with ${ruleEntries.length} rules.`);

// ==========================================
// 2. Parse Cases (20 Cases)
// ==========================================
const caseBlocks = content.match(/#### Case \d+：[\s\S]+?(?=(#### Case \d+：|### 【模块三))/g);
if (!caseBlocks) {
  console.error('No case blocks found');
  process.exit(1);
}

const HEX_MAP = {
  '风天小畜': 9, '天小畜': 9, '小畜': 9,
  '火水未济': 64, '未济': 64,
  '水火既济': 59, '既济': 59,
  '风泽中孚': 57, '中孚': 57,
  '泽风大过': 28, '大过': 28,
  '山天大畜': 26, '大畜': 26,
  '天雷无妄': 25, '无妄': 25,
  '雷天大壮': 34, '大壮': 34,
  '风火家人': 37, '家人': 37,
  '火雷噬嗑': 21, '噬嗑': 21,
  '天火同人': 13, '同人': 13,
  '火天大有': 14, '大有': 14,
  '雷山小过': 58, '小过': 58,
  '山泽损': 41, '损': 41,
  '水泽节': 60, '节': 60,
  '地天泰': 11, '泰': 11,
  '山水蒙': 4, '蒙': 4,
  '天山遁': 33, '遁': 33,
  '雷风恒': 32, '恒': 32,
  '天风姤': 44, '姤': 44,
  '泽水困': 47, '困': 47,
  '火风鼎': 50, '鼎': 50,
  '水雷屯': 3, '屯': 3,
  '地泽临': 19, '临': 19,
  '山火贲': 22, '贲': 22,
  '山风蛊': 18, '蛊': 18,
  '风地观': 20, '观': 20,
  '震为雷': 51, '震': 51,
  '离为火': 30, '离': 30,
  '兑为泽': 54, '兑': 54,
  '乾为天': 1, '乾': 1,
  '坤为地': 2, '坤': 2
};

function matchHex(text) {
  for (const [name, num] of Object.entries(HEX_MAP)) {
    if (text.includes(name)) {
      return num;
    }
  }
  return null;
}

const caseEntries = [];

caseBlocks.forEach((block, idx) => {
  const num = String(idx + 1).padStart(2, '0');
  const titleMatch = block.match(/#### Case \d+：(.+)/);
  const title = titleMatch ? titleMatch[1].trim() : '';

  const panLine = (block.match(/- \*\*【时空与盘面数据】\*\*：(.+)/) || [])[1] || '';
  const queryLine = (block.match(/- \*\*【占问事项与主体】\*\*：(.+)/) || [])[1] || '';
  const analysisLine = (block.match(/- \*\*【核心用神与推演分析】\*\*：(.+)/) || [])[1] || '';
  const resultLine = (block.match(/- \*\*【实际应验结果与时间】\*\*：(.+)/) || [])[1] || '';

  // Hexagrams
  const hexagrams = [];
  if (panLine.includes('变')) {
    const [pText, tText] = panLine.split('变');
    const p = matchHex(pText);
    const t = matchHex(tText);
    if (p) hexagrams.push(p);
    if (t && t !== p) hexagrams.push(t);
  } else {
    // Check multiple or single
    for (const [name, hNum] of Object.entries(HEX_MAP)) {
      if (name.length >= 2 && panLine.includes(name) && !hexagrams.includes(hNum)) {
        hexagrams.push(hNum);
      }
    }
  }

  // Lines
  const lines = [];
  if (panLine.includes('初九') || panLine.includes('初六') || panLine.includes('初爻')) lines.push(1);
  if (panLine.includes('九二') || panLine.includes('六二') || panLine.includes('二爻')) lines.push(2);
  if (panLine.includes('九三') || panLine.includes('六三') || panLine.includes('三爻')) lines.push(3);
  if (panLine.includes('九四') || panLine.includes('六四') || panLine.includes('四爻')) lines.push(4);
  if (panLine.includes('九五') || panLine.includes('六五') || panLine.includes('五爻')) lines.push(5);
  if (panLine.includes('上九') || panLine.includes('上六') || panLine.includes('上爻')) lines.push(6);

  // Relatives
  const relatives = [];
  ['父母', '官鬼', '兄弟', '妻财', '子孙'].forEach(r => {
    if (analysisLine.includes(r) || title.includes(r)) {
      relatives.push(r);
    }
  });

  // Topic
  const topics = [];
  if (title.includes('病') || queryLine.includes('病') || queryLine.includes('腹') || queryLine.includes('泄泻')) topics.push('疾病');
  if (title.includes('财') || queryLine.includes('财') || queryLine.includes('营运')) topics.push('财运');
  if (title.includes('讼') || queryLine.includes('讼') || queryLine.includes('官司')) topics.push('诉讼');
  if (title.includes('役') || queryLine.includes('役') || queryLine.includes('差事') || queryLine.includes('供膳')) topics.push('事业');
  if (title.includes('文书') || queryLine.includes('文书') || queryLine.includes('官凭')) topics.push('考试');
  if (title.includes('舟') || queryLine.includes('归舟') || queryLine.includes('返乡')) topics.push('出行');
  if (title.includes('倭') || title.includes('晴') || title.includes('年时') || title.includes('身运') || title.includes('中秋')) topics.push('other');

  // Conditions
  const conditions = new Set();
  if (panLine.includes('空') || analysisLine.includes('空亡') || analysisLine.includes('旬空')) conditions.add('xun-kong');
  if (lines.length > 0) conditions.add('moving');
  if (panLine.includes('静卦') || lines.length === 0) conditions.add('all-quiet');
  if (analysisLine.includes('暗动') || panLine.includes('冲动')) conditions.add('dark-move');
  if (analysisLine.includes('回头克') || analysisLine.includes('克世')) conditions.add('hui-tou-ke');
  if (analysisLine.includes('合') || panLine.includes('合德')) conditions.add('liu-he-gua');
  if (analysisLine.includes('六冲') || analysisLine.includes('逢冲')) conditions.add('liu-chong-gua');
  if (analysisLine.includes('入墓') || analysisLine.includes('破墓')) conditions.add('ru-mu');

  let verdict = '吉';
  if (resultLine.includes('难免') || resultLine.includes('治罪') || resultLine.includes('苦') || resultLine.includes('杀戮') || resultLine.includes('大饥') || resultLine.includes('不成') || resultLine.includes('无望') || resultLine.includes('未能') || resultLine.includes('再起') || resultLine.includes('重刑') || resultLine.includes('受责')) {
    verdict = '凶';
  } else if (resultLine.includes('中阻') || resultLine.includes('迟缓') || resultLine.includes('和释')) {
    verdict = '成中有阻';
  }

  caseEntries.push({
    id: `bsqs.case.${num}`,
    kind: 'case',
    status: 'verified',
    source: {
      book: '卜筮全书',
      chapter: '占验指南',
      note: title
    },
    when: {
      hexagram: hexagrams.length > 0 ? hexagrams : undefined,
      lineIndex: lines.length > 0 ? lines : undefined,
      relative: relatives.length > 0 ? relatives : undefined,
      topic: topics.length > 0 ? topics : undefined,
      conditions: conditions.size > 0 ? Array.from(conditions) : undefined,
      note: `${panLine} ${queryLine}`
    },
    text: `【${title}】${queryLine}。${analysisLine}`,
    verdict: verdict,
    timing: resultLine,
    credibility: 5
  });
});

const casesTs = `import type { KBEntry } from './types';

/**
 * 《卜筮全书》（明·姚际隆 辑选）20 经典实战占验案例
 * 汇聚袁柳庄、周焚松、谈朝辅、刘伯温等明代高人术士亲断实战案例
 * status: 'verified', credibility: 5
 */
export const BUSHIQUANSHU_CASES: KBEntry[] = ${JSON.stringify(caseEntries, null, 2)};
`;

fs.writeFileSync(path.resolve(process.cwd(), 'src/lib/kb/bushiquanshu-cases.ts'), casesTs, 'utf8');
console.log(`Generated src/lib/kb/bushiquanshu-cases.ts with ${caseEntries.length} cases.`);
