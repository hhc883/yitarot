import fs from 'fs';
import path from 'path';

const markdown = fs.readFileSync(path.resolve(process.cwd(), 'data/kb/cases-42.md'), 'utf8');

const HEX_MAP = {
  '乾为天': 1, '乾': 1,
  '坤为地': 2, '坤': 2,
  '水雷屯': 3, '屯': 3,
  '山水蒙': 4, '蒙': 4,
  '水天需': 5, '需': 5,
  '天水讼': 6, '讼': 6,
  '地水师': 7, '师': 7,
  '水地比': 8, '比': 8,
  '风天小畜': 9, '天小畜': 9, '小畜': 9,
  '天泽履': 10, '履': 10,
  '地天泰': 11, '泰': 11,
  '天地否': 12, '否': 12,
  '天火同人': 13, '同人': 13,
  '火天大有': 14, '大有': 14,
  '地山谦': 15, '谦': 15,
  '雷地豫': 16, '豫': 16,
  '泽雷随': 17, '随': 17,
  '山风蛊': 18, '蛊': 18,
  '地泽临': 19, '临': 19,
  '风地观': 20, '观': 20,
  '火雷噬嗑': 21, '噬嗑': 21,
  '山火贲': 22, '贲': 22,
  '山地剥': 23, '剥': 23,
  '地雷复': 24, '复': 24,
  '天雷无妄': 25, '无妄': 25,
  '山天大畜': 26, '大畜': 26,
  '山雷颐': 27, '颐': 27,
  '泽风大过': 28, '大过': 28,
  '坎为水': 29, '坎': 29,
  '离为火': 30, '离': 30,
  '泽山咸': 31, '咸': 31,
  '雷风恒': 32, '恒': 32,
  '天山遁': 33, '遁': 33,
  '雷天大壮': 34, '大壮': 34,
  '火地晋': 35, '晋': 35,
  '地火明夷': 36, '明夷': 36,
  '风火家人': 37, '家人': 37,
  '火泽睽': 38, '睽': 38,
  '水山蹇': 39, '蹇': 39,
  '雷水解': 40, '解': 40,
  '山泽损': 41, '损': 41,
  '风雷益': 42, '益': 42,
  '泽天夬': 43, '夬': 43,
  '天风姤': 44, '姤': 44,
  '泽地萃': 45, '萃': 45,
  '地风升': 46, '升': 46,
  '泽水困': 47, '困': 47,
  '水风井': 48, '井': 48,
  '泽火革': 49, '革': 49,
  '火风鼎': 50, '鼎': 50,
  '震为雷': 51, '震': 51,
  '艮为山': 52, '艮': 52,
  '风山渐': 53, '渐': 53,
  '雷泽归妹': 54, '归妹': 54,
  '雷火丰': 55, '丰': 55,
  '火山旅': 56, '旅': 56,
  '巽为风': 57, '巽': 57,
  '兑为泽': 58, '兑': 58,
  '风水涣': 59, '涣': 59,
  '水泽节': 60, '节': 60,
  '风泽中孚': 61, '中孚': 61,
  '雷山小过': 62, '小过': 62,
  '水火既济': 63, '既济': 63,
  '火水未济': 64, '未济': 64
};

function parseHexagrams(str) {
  const parts = str.split(/变|之/);
  const priName = parts[0].trim();
  const transName = parts[1] ? parts[1].split('/')[0].trim() : null;

  const hexs = [];
  if (HEX_MAP[priName]) hexs.push(HEX_MAP[priName]);
  if (transName && HEX_MAP[transName]) hexs.push(HEX_MAP[transName]);
  return hexs;
}

function parseLines(str) {
  if (str.includes('六爻全动')) return [1, 2, 3, 4, 5, 6];
  if (str.includes('安静') || str.includes('无变')) return [];
  const lines = [];
  if (/初[九六]/.test(str)) lines.push(1);
  if (/[九六]二/.test(str)) lines.push(2);
  if (/[九六]三/.test(str)) lines.push(3);
  if (/[九六]四/.test(str)) lines.push(4);
  if (/[九六]五/.test(str)) lines.push(5);
  if (/上[九六]/.test(str)) lines.push(6);
  return lines;
}

function parseTopic(title, question) {
  const t = title + ' ' + question;
  if (/病|危|痈|痘|医|产|癌症/.test(t)) return '疾病';
  if (/财|商|贸易|铺|买卖/.test(t)) return '财运';
  if (/官事|刑|讼|狱|赦|厮打|争水/.test(t)) return '诉讼';
  if (/升迁|谒贵|官|出仕|关差|功名/.test(t)) return '事业';
  if (/乡试|会试|文书|训子/.test(t)) return '考试';
  if (/婚/.test(t)) return '婚恋';
  if (/出门|起程|随官/.test(t)) return '出行';
  if (/回|不归|无音|相遇/.test(t)) return '寻人';
  return 'other';
}

function parseRelatives(text) {
  const rels = [];
  if (/父母|父|母|文书/.test(text)) rels.push('父母');
  if (/兄弟|兄|弟|妹/.test(text)) rels.push('兄弟');
  if (/子孙|子|女|福德/.test(text)) rels.push('子孙');
  if (/妻财|财/.test(text)) rels.push('妻财');
  if (/官鬼|官星|鬼/.test(text)) rels.push('官鬼');
  return rels.length > 0 ? Array.from(new Set(rels)) : undefined;
}

function parseConditions(text) {
  const conds = [];
  if (/月破/.test(text)) conds.push('month-break');
  if (/旬空|空亡|真空|逢空/.test(text)) conds.push('xun-kong');
  if (/暗动/.test(text)) conds.push('dark-move');
  if (/六冲/.test(text)) conds.push('liu-chong-gua');
  if (/六合/.test(text)) conds.push('liu-he-gua');
  if (/反吟/.test(text)) conds.push('fan-yin');
  if (/伏吟/.test(text)) conds.push('fu-yin');
  if (/化进神|进神/.test(text)) conds.push('transform-advance');
  if (/化退神|退神/.test(text)) conds.push('transform-retreat');
  if (/回头生/.test(text)) conds.push('hui-tou-sheng');
  if (/回头克/.test(text)) conds.push('hui-tou-ke');
  if (/化绝|绝于/.test(text)) conds.push('hua-jue');
  if (/入墓|化墓|墓于/.test(text)) conds.push('ru-mu');
  if (/六爻安静/.test(text)) conds.push('all-quiet');
  return Array.from(new Set(conds));
}

// Split into case blocks
const blocks = markdown.split(/### 卦例\s*/).filter(b => b.trim().length > 0);
const entries = [];

for (const block of blocks) {
  const lines = block.split('\n');
  const titleLine = lines[0].trim();
  const idMatch = titleLine.match(/^(\d+)[:：]\s*(.*)/);
  if (!idMatch) continue;

  const num = parseInt(idMatch[1], 10);
  const caseTitle = idMatch[2].trim();

  let hexStr = '';
  let lineStr = '';
  let timeStr = '';
  let questionStr = '';
  let analysisStr = '';
  let outcomeStr = '';

  for (const line of lines) {
    if (line.includes('**卦名与变卦：**')) hexStr = line.split('**卦名与变卦：**')[1].trim();
    if (line.includes('**动爻位：**')) lineStr = line.split('**动爻位：**')[1].trim();
    if (line.includes('**月建日辰：**')) timeStr = line.split('**月建日辰：**')[1].trim();
    if (line.includes('**占问事项与主题：**')) questionStr = line.split('**占问事项与主题：**')[1].trim();
    if (line.includes('**核心用神与盘面断语：**')) analysisStr = line.split('**核心用神与盘面断语：**')[1].trim();
    if (line.includes('**应验结果与应期：**')) outcomeStr = line.split('**应验结果与应期：**')[1].trim();
  }

  const hexs = parseHexagrams(hexStr);
  const changingLines = parseLines(lineStr);
  const topic = parseTopic(caseTitle, questionStr);
  const relatives = parseRelatives(analysisStr);
  const conditions = parseConditions(analysisStr);

  const entry = {
    id: `zsy.case.${String(num).padStart(2, '0')}`,
    kind: 'case',
    status: 'verified',
    source: {
      book: '增删卜易',
      chapter: '实战占验',
      note: caseTitle
    },
    when: {
      hexagram: hexs.length > 0 ? hexs : undefined,
      lineIndex: changingLines.length > 0 ? changingLines : undefined,
      relative: relatives && relatives.length > 0 ? relatives : undefined,
      conditions: conditions.length > 0 ? conditions : undefined,
      topic: [topic],
      note: `${hexStr} · ${timeStr}`
    },
    text: `【${caseTitle}】占问：“${questionStr}”。${analysisStr}`,
    timing: outcomeStr || undefined,
    credibility: 5
  };

  entries.push(entry);
}

const outContent = `import type { KBEntry } from './types';

/**
 * 《增删卜易》42 经典实战占验卦例库
 * 全部为野鹤老人亲断亲历之真实卦案，经后世名家推崇
 * status: 'verified', credibility: 5
 */
export const CASES_DB: KBEntry[] = ${JSON.stringify(entries, null, 2)};
`;

fs.writeFileSync(path.resolve(process.cwd(), 'src/lib/kb/cases.ts'), outContent);
console.log(`成功生成 src/lib/kb/cases.ts，共写入 ${entries.length} 个经典卦例！`);
