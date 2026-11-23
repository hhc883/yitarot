import fs from 'fs';
import path from 'path';

const content = fs.readFileSync(path.resolve(process.cwd(), 'data/kb/liuyao/zengshan-extracted.md'), 'utf8');

// Match Rule 01 to Rule 30
const ruleBlocks = content.match(/#### Rule \d+：[\s\S]+?(?=(#### Rule \d+：|### 【模块二))/g);

if (!ruleBlocks) {
  console.error('No rule blocks found');
  process.exit(1);
}

const entries = [];

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

  // Extract relative
  const relatives = [];
  ['父母', '官鬼', '兄弟', '妻财', '子孙'].forEach(r => {
    if (title.includes(r) || rawTopic.includes(r) || rawCond.includes(r)) {
      relatives.push(r);
    }
  });

  // Extract topic
  const topics = [];
  if (rawTopic.includes('疾病')) topics.push('疾病');
  if (rawTopic.includes('求财') || rawTopic.includes('商业')) topics.push('财运');
  if (rawTopic.includes('婚恋') || rawTopic.includes('求婚')) topics.push('婚恋');
  if (rawTopic.includes('官') || rawTopic.includes('升迁')) topics.push('事业');
  if (rawTopic.includes('考试')) topics.push('考试');
  if (rawTopic.includes('讼') || rawTopic.includes('官非')) topics.push('诉讼');
  if (rawTopic.includes('出行') || rawTopic.includes('行人')) topics.push('出行');
  if (rawTopic.includes('家宅')) topics.push('家宅');
  if (rawTopic.includes('胎产')) topics.push('other');

  // Extract conditions
  const conditions = new Set();
  if (title.includes('月破') || rawCond.includes('月破')) conditions.add('month-break');
  if (title.includes('旬空') || rawCond.includes('旬空')) conditions.add('xun-kong');
  if (title.includes('动') || rawCond.includes('动')) conditions.add('moving');
  if (title.includes('暗动') || rawCond.includes('暗动') || title.includes('冲起')) conditions.add('dark-move');
  if (title.includes('进神') || title.includes('退神')) { conditions.add('transform-advance'); conditions.add('transform-retreat'); }
  if (title.includes('反吟')) conditions.add('fan-yin');
  if (title.includes('伏吟')) conditions.add('fu-yin');
  if (title.includes('逢冲') || rawCond.includes('六冲')) conditions.add('liu-chong-gua');
  if (title.includes('逢合') || rawCond.includes('六合')) conditions.add('liu-he-gua');
  if (title.includes('入墓') || rawCond.includes('入墓')) conditions.add('ru-mu');
  if (title.includes('回头克') || rawCond.includes('回头克')) conditions.add('hui-tou-ke');
  if (title.includes('回头生')) conditions.add('hui-tou-sheng');
  if (title.includes('绝处逢生')) conditions.add('hua-jue');
  if (title.includes('飞伏') || rawCond.includes('用神不现')) conditions.add('yong-shen-bu-xian');
  if (title.includes('用神多现') || rawCond.includes('两重')) conditions.add('yong-shen-liang-xian');
  if (title.includes('化破') || title.includes('化空')) conditions.add('hua-kong');

  let verdict = '吉';
  if (title.includes('久病逢冲必死') || title.includes('久病逢合必死') || title.includes('随鬼入墓') || title.includes('鬼动见灾')) {
    verdict = '凶';
  } else if (title.includes('合处逢冲')) {
    verdict = '先合后离';
  } else if (title.includes('绝处逢生') || title.includes('反克为生') || title.includes('动变两头卦')) {
    verdict = '先难后易';
  } else if (title.includes('阻隔') || title.includes('阻') || title.includes('反吟') || title.includes('减力') || title.includes('退神')) {
    verdict = '成中有阻';
  }

  entries.push({
    id: `zsy.core.${num}`,
    kind: 'rule',
    status: 'verified',
    source: {
      book: '增删卜易',
      chapter: '核心断法通则',
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

const tsContent = `import type { KBEntry } from './types';

/**
 * 《增删卜易》30 条核心黄金断法通则（权威精炼·定式准则）
 * 涵盖：生克主权、真假月破、真假旬空、动变机理、进退神、反伏吟、
 *       疾病逢冲逢合、随鬼入墓、绝处逢生、回头克、间爻、飞伏、连环接续等。
 * status: 'verified', credibility: 5
 */
export const ZENGSHAN_CORE_RULES: KBEntry[] = ${JSON.stringify(entries, null, 2)};
`;

fs.writeFileSync(path.resolve(process.cwd(), 'src/lib/kb/golden-rules.ts'), tsContent, 'utf8');
console.log(`Successfully generated src/lib/kb/golden-rules.ts with ${entries.length} rules.`);
