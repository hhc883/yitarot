import fs from 'fs';
import path from 'path';

const content = fs.readFileSync(path.resolve(process.cwd(), 'data/kb/meihua/meihuayishu-extracted.md'), 'utf8');

// ==========================================
// 1. Rules (15 rules)
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

  ruleEntries.push({
    id: `mhys.rule.${num}`,
    title: title,
    topic: rawTopic,
    condition: rawCond,
    text: text,
    timing: timing,
    credibility: 5
  });
});

const rulesTs = `export interface MeihuaRuleEntry {
  id: string;
  title: string;
  topic: string;
  condition: string;
  text: string;
  timing: string;
  credibility: 5;
}

/**
 * 《梅花易数》（托名 宋·邵雍 著）15 条核心体用断法通则
 * 涵盖：先天后天界定、体用分属、体用生克总决、动变本末互卦通变、
 *       四时卦气衰旺、克体党类、病占/谋占/财占/婚占/产占/出行/官讼专诀、三要玄机与十应奥论。
 */
export const MEIHUA_RULES: MeihuaRuleEntry[] = ${JSON.stringify(ruleEntries, null, 2)};
`;

const targetDir = path.resolve(process.cwd(), 'src/lib/kb/meihua');
fs.mkdirSync(targetDir, { recursive: true });
fs.writeFileSync(path.join(targetDir, 'rules.ts'), rulesTs, 'utf8');
console.log(`Generated src/lib/kb/meihua/rules.ts with ${ruleEntries.length} rules.`);

// ==========================================
// 2. Cases (10 cases)
// ==========================================
const caseBlocks = content.match(/#### Case \d+：[\s\S]+?(?=(#### Case \d+：|### 【模块三))/g);
if (!caseBlocks) {
  console.error('No case blocks found');
  process.exit(1);
}

const HEX_MAP = {
  '泽火革': 49, '革': 49,
  '泽山咸': 31, '咸': 31,
  '天风姤': 44, '姤': 44,
  '火风鼎': 50, '鼎': 50,
  '巽为风': 53, '巽': 53,
  '离为火': 30, '离': 30,
  '泽风大过': 28, '大过': 28,
  '山火贲': 22, '贲': 22,
  '山雷颐': 27, '颐': 27,
  '地泽临': 19, '临': 19,
  '地天泰': 11, '泰': 11,
  '风天小畜': 9, '小畜': 9,
  '乾为天': 1, '乾': 1,
  '风火家人': 37, '家人': 37,
  '风山渐': 53, '渐': 53,
  '山地剥': 23, '剥': 23,
  '风地观': 20, '观': 20
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

  let primaryHex = null;
  let transformedHex = null;

  if (panLine.includes('变')) {
    const [pText, tText] = panLine.split('变');
    primaryHex = matchHex(pText);
    transformedHex = matchHex(tText);
  } else {
    primaryHex = matchHex(panLine);
  }

  const lines = [];
  if (panLine.includes('初九') || panLine.includes('初爻')) lines.push(1);
  if (panLine.includes('九二') || panLine.includes('六二') || panLine.includes('二爻')) lines.push(2);
  if (panLine.includes('九三') || panLine.includes('六三') || panLine.includes('三爻')) lines.push(3);
  if (panLine.includes('九四') || panLine.includes('六四') || panLine.includes('四爻')) lines.push(4);
  if (panLine.includes('九五') || panLine.includes('六五') || panLine.includes('五爻')) lines.push(5);
  if (panLine.includes('上九') || panLine.includes('上六') || panLine.includes('上爻')) lines.push(6);

  caseEntries.push({
    id: `mhys.case.${num}`,
    title: title,
    pan: {
      primaryHex: primaryHex || 0,
      transformedHex: transformedHex || undefined,
      movingLines: lines,
      note: panLine
    },
    query: queryLine,
    analysis: analysisLine,
    result: resultLine,
    credibility: 5
  });
});

const casesTs = `export interface MeihuaCaseEntry {
  id: string;
  title: string;
  pan: {
    primaryHex: number;
    transformedHex?: number;
    movingLines: number[];
    note: string;
  };
  query: string;
  analysis: string;
  result: string;
  credibility: 5;
}

/**
 * 《梅花易数》（托名 宋·邵雍 著）10 经典实战占验案例
 * 汇聚观梅占、牡丹占、邻人借物占、今日动静占、老人有忧色占、少年有喜色占、牛哀鸣占、鸡悲鸣占、枯枝坠地占、西林寺额占。
 */
export const MEIHUA_CASES: MeihuaCaseEntry[] = ${JSON.stringify(caseEntries, null, 2)};
`;

fs.writeFileSync(path.join(targetDir, 'cases.ts'), casesTs, 'utf8');
console.log(`Generated src/lib/kb/meihua/cases.ts with ${caseEntries.length} cases.`);
