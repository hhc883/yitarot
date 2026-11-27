export type FrontmatterValue = string | number | boolean | string[];

export interface ParsedMarkdownFile {
  data: Record<string, FrontmatterValue>;
  content: string;
}

function unquote(raw: string): string {
  const trimmed = raw.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed
      .slice(1, -1)
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\n/g, '\n');
  }
  return trimmed;
}

function parseInlineArray(raw: string): string[] {
  const inner = raw.trim().slice(1, -1).trim();
  if (!inner) return [];
  const items: string[] = [];
  let current = '';
  let quote: '"' | "'" | null = null;

  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i];
    if (quote) {
      if (ch === quote && inner[i - 1] !== '\\') {
        quote = null;
      } else {
        current += ch;
      }
    } else if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === ',') {
      const val = unquote(current);
      if (val) items.push(val);
      current = '';
    } else {
      current += ch;
    }
  }

  const last = unquote(current);
  if (last) items.push(last);
  return items;
}

function parseScalar(raw: string): FrontmatterValue {
  const trimmed = raw.trim();
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return parseInlineArray(trimmed);
  }
  return unquote(trimmed);
}

/**
 * Zero-dependency YAML-subset frontmatter parser for blog Markdown files.
 */
export function parseMarkdownFrontmatter(source: string): ParsedMarkdownFile {
  const normalized = source.replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) {
    return { data: {}, content: normalized.trim() };
  }

  const endIndex = normalized.indexOf('\n---\n', 4);
  if (endIndex === -1) {
    return { data: {}, content: normalized.trim() };
  }

  const yamlBlock = normalized.slice(4, endIndex);
  const content = normalized.slice(endIndex + 5).trim();
  const data: Record<string, FrontmatterValue> = {};

  let activeListKey: string | null = null;
  for (const line of yamlBlock.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    if (activeListKey && trimmed.startsWith('- ')) {
      const existing = data[activeListKey];
      const list = Array.isArray(existing) ? existing : [];
      list.push(unquote(trimmed.slice(2)));
      data[activeListKey] = list;
      continue;
    }

    const colonIndex = trimmed.indexOf(':');
    if (colonIndex <= 0) continue;

    const key = trimmed.slice(0, colonIndex).trim();
    const rawVal = trimmed.slice(colonIndex + 1).trim();

    if (rawVal === '') {
      activeListKey = key;
      data[key] = [];
    } else {
      activeListKey = null;
      data[key] = parseScalar(rawVal);
    }
  }

  return { data, content };
}
