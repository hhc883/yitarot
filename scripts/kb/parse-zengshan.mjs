/**
 * 解析《增删卜易》纯文本为结构化章节库。
 *
 * 输入：data/kb/raw/zengshan-buyi.txt（UTF-16 LE，带 BOM）
 * 输出：data/kb/zengshan-chapters.json
 *
 * 设计原则：解析只做「切分与标注」，不改动一个字。任何清洗都会引入不可追溯的改动，
 * 因此原文一律保留，元数据另存字段。
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const SRC = resolve(root, 'data/kb/raw/zengshan-buyi.txt');
const OUT = resolve(root, 'data/kb/zengshan-chapters.json');

const raw = readFileSync(SRC);
const text = raw.toString('utf16le').replace(/^\uFEFF/, '');
const lines = text.split(/\r?\n/);

const JUAN_RE = /^增删卜易卷之([一二三四五六])$/;
// 正文标题存在两种写法：「用神章第八」与「《星煞章》第三十三」，书名号与前置修饰词都要容纳
const HEAD_RE = /^[\u4e00-\u9fa5、，,.《》]{2,30}第[一二三四五六七八九十百又—\-]+$/;

const bodyStart = lines.findIndex((l) => l.trim() === '增删卜易卷之一');
if (bodyStart < 0) throw new Error('未找到正文起点「增删卜易卷之一」');

/** 卷之一至卷之二为断法总纲，卷之三起为分门占断 */
const CORE_JUAN = new Set(['一', '二']);

const chapters = [];
let juan = null;
let cur = null;
let preface = [];

for (let i = 0; i < bodyStart; i += 1) {
  const s = lines[i].trim();
  if (s && !/^目\s*录$/.test(s)) preface.push(s);
}

for (let i = bodyStart; i < lines.length; i += 1) {
  const s = lines[i].trim();
  if (!s) continue;

  const jm = s.match(JUAN_RE);
  if (jm) {
    if (cur) chapters.push(cur);
    cur = null;
    juan = jm[1];
    continue;
  }

  if (HEAD_RE.test(s)) {
    if (cur) chapters.push(cur);
    cur = { juan, title: s, line: i + 1, lines: [] };
    continue;
  }

  if (cur) cur.lines.push(s);
}
if (cur) chapters.push(cur);

const out = chapters.map((c, idx) => {
  const body = c.lines.join('\n');
  return {
    id: `zsy.j${c.juan ?? '?'}.${String(idx + 1).padStart(3, '0')}`,
    book: '增删卜易',
    author: '清·野鹤老人',
    juan: c.juan,
    order: idx + 1,
    title: c.title,
    chapterKind: CORE_JUAN.has(c.juan ?? '') ? 'doctrine' : 'topic',
    chars: body.length,
    paragraphs: c.lines.length,
    text: body
  };
});

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(
  OUT,
  JSON.stringify(
    {
      book: '增删卜易',
      author: '清·野鹤老人',
      sourceFile: 'data/kb/raw/zengshan-buyi.txt',
      preface: preface.join('\n'),
      stats: {
        chapters: out.length,
        chars: out.reduce((n, c) => n + c.chars, 0),
        doctrine: out.filter((c) => c.chapterKind === 'doctrine').length,
        topic: out.filter((c) => c.chapterKind === 'topic').length
      },
      chapters: out
    },
    null,
    2
  ),
  'utf8'
);

console.log(`章节 ${out.length}，字数 ${out.reduce((n, c) => n + c.chars, 0)}`);
console.log(`断法总纲 ${out.filter((c) => c.chapterKind === 'doctrine').length} 章，分门占断 ${out.filter((c) => c.chapterKind === 'topic').length} 章`);
for (const c of out.filter((c) => c.chapterKind === 'doctrine')) {
  console.log(`  [卷${c.juan}] ${c.title}  ${c.chars}字`);
}
