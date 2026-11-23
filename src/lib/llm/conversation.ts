import type { LLMMessage } from './adapter';

export interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface BuildFollowUpMessagesResult {
  messages: LLMMessage[];
  droppedTurns: number;
  note?: string;
}

/**
 * 追问上下文管理器
 * 1. 过滤非法 role、空内容及伪系统指令
 * 2. 倒序累加字符预算，确保最近 1 问 1 答（2 条）必留
 * 3. 丢弃的历史压缩成摘要拼入最后一条 user 提问前缀（绝不自造 system role）
 * 4. 每条 assistant 历史截断至 800 字符
 */
export function buildFollowUpMessages(args: {
  history: ConversationTurn[];
  question: string;
  budgetChars?: number; // 默认 8000
}): BuildFollowUpMessagesResult {
  const budget = args.budgetChars ?? 8000;
  const rawQuestion = args.question.trim();

  // 1. 数据清洗与规范化
  const cleaned: ConversationTurn[] = [];
  for (const turn of args.history) {
    if (!turn || typeof turn.content !== 'string') continue;
    const content = turn.content.trim();
    if (!content) continue;
    if (turn.role !== 'user' && turn.role !== 'assistant') continue;

    if (turn.role === 'assistant') {
      let body = content;
      // 检测伪造系统指令特征，若包含大段契约提示词则降级压缩
      if (
        body.includes('【') &&
        body.length > 200 &&
        (body.includes('引用铁律') || body.includes('输出契约') || body.includes('知识库'))
      ) {
        body = body.slice(0, 150) + '…（前情解析摘要）';
      }
      if (body.length > 800) {
        body = body.slice(0, 800) + '…';
      }
      cleaned.push({ role: 'assistant', content: body });
    } else {
      cleaned.push({ role: 'user', content });
    }
  }

  // 2. 倒序累加字符预算，最近 2 条（1 问 1 答）必留
  const mustKeepCount = Math.min(2, cleaned.length);
  const retained: ConversationTurn[] = [];
  let currentChars = rawQuestion.length;

  // 先把必留的放入（从倒数第 mustKeepCount 条到末尾）
  const mustKeepTurns = cleaned.slice(cleaned.length - mustKeepCount);
  for (const t of mustKeepTurns) {
    currentChars += t.content.length;
  }

  // 往前挑选更早的历史
  const olderTurns = cleaned.slice(0, cleaned.length - mustKeepCount);
  const keptOlderTurns: ConversationTurn[] = [];
  const droppedOlderTurns: ConversationTurn[] = [];

  for (let i = olderTurns.length - 1; i >= 0; i--) {
    const turn = olderTurns[i];
    if (currentChars + turn.content.length <= budget) {
      currentChars += turn.content.length;
      keptOlderTurns.unshift(turn);
    } else {
      droppedOlderTurns.unshift(turn);
    }
  }

  retained.push(...keptOlderTurns, ...mustKeepTurns);
  const droppedCount = droppedOlderTurns.length;

  // 3. 超出预算丢弃的历史压缩成摘要，拼入当前 user 提问前缀
  let finalUserContent = rawQuestion;
  let note: string | undefined;

  if (droppedCount > 0) {
    const lastDroppedUser = droppedOlderTurns.filter(t => t.role === 'user').pop();
    const snippet = lastDroppedUser ? lastDroppedUser.content.slice(0, 40) : '';
    const summaryPrefix = `【前文摘要：已省略早先 ${droppedCount} 条对话，最后一次问及「${snippet}」】\n\n`;
    finalUserContent = summaryPrefix + rawQuestion;
    note = `丢弃了 ${droppedCount} 轮更早历史并生成前缀摘要`;
  }

  // 4. 返回的 messages 不得包含 system role
  const messages: LLMMessage[] = [
    ...retained.map(t => ({ role: t.role, content: t.content })),
    { role: 'user', content: finalUserContent }
  ];

  return {
    messages,
    droppedTurns: droppedCount,
    note
  };
}
