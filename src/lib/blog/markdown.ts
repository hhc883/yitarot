import { TocItem } from '@/types/blog';

/**
 * Generates a URL-safe, clean anchor ID from heading text.
 */
export function slugifyHeading(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5\-_ ]/g, '')
    .replace(/\s+/g, '-');
}

/**
 * Extracts Table of Contents (h2 and h3) from markdown content.
 */
export function extractHeadings(markdown: string): TocItem[] {
  const lines = markdown.split('\n');
  const items: TocItem[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) {
      const text = trimmed.replace(/^##\s+/, '').replace(/[*_`]/g, '').trim();
      items.push({
        id: slugifyHeading(text),
        text,
        level: 2
      });
    } else if (trimmed.startsWith('### ')) {
      const text = trimmed.replace(/^###\s+/, '').replace(/[*_`]/g, '').trim();
      items.push({
        id: slugifyHeading(text),
        text,
        level: 3
      });
    }
  }

  return items;
}

/**
 * Escapes HTML attribute characters (including single and double quotes).
 */
function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Validates and sanitizes Markdown link hrefs.
 * Allows absolute http/https URLs and safe relative links/anchors; rejects unsafe schemes.
 */
function sanitizeMarkdownHref(escapedRawHref: string): string | null {
  const decoded = escapedRawHref
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();

  if (!decoded) return null;
  // Reject ASCII control characters that can obfuscate schemes
  if (/[\u0000-\u001F\u007F]/.test(decoded)) return null;
  // Reject protocol-relative URLs (e.g. //evil.com)
  if (decoded.startsWith('//')) return null;

  // Allow fragment-only anchors (#section) and root/dot-relative paths (/path, ./path, ../path, ?query)
  if (
    decoded.startsWith('#') ||
    decoded.startsWith('/') ||
    decoded.startsWith('./') ||
    decoded.startsWith('../') ||
    decoded.startsWith('?')
  ) {
    return escapeHtmlAttr(decoded);
  }

  // Check for explicit scheme (RFC 3986)
  const schemeMatch = decoded.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):/);
  if (schemeMatch) {
    const scheme = schemeMatch[1].toLowerCase();
    if (scheme !== 'http' && scheme !== 'https') {
      return null;
    }
    try {
      const parsed = new URL(decoded);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return null;
      }
      return escapeHtmlAttr(decoded);
    } catch {
      return null;
    }
  }

  // Relative path without leading slash or scheme
  return escapeHtmlAttr(decoded);
}

/**
 * Converts inline markdown tokens (bold, italic, code, link) to HTML.
 */
function parseInline(text: string): string {
  let html = text
    // Escape standard HTML chars first for safety
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Inline code: `code`
  html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 mx-0.5 rounded text-xs font-mono bg-[#F5F5F6] text-[#171717] border border-[#E4E4E7]">$1</code>');

  // Bold: **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-[#171717]">$1</strong>');

  // Italic: *text*
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic text-[#27272A]">$1</em>');

  // Links: [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label: string, rawHref: string) => {
    const safeHref = sanitizeMarkdownHref(rawHref);
    if (!safeHref) {
      return label;
    }
    return `<a href="${safeHref}" class="underline underline-offset-4 decoration-[#71717A] text-[#171717] hover:text-black hover:decoration-black transition-colors">${label}</a>`;
  });

  return html;
}

/**
 * Splits a Markdown table row into trimmed cell strings.
 */
function splitTableRow(row: string): string[] {
  const cleaned = row.trim().replace(/^\|/, '').replace(/\|$/, '');
  return cleaned.split('|').map((cell) => cell.trim());
}

/**
 * Checks whether a trimmed line is a GFM table separator row (e.g. | :--- | :---: |).
 */
function isTableSeparatorRow(line: string): boolean {
  if (!line.includes('|')) return false;
  const cells = splitTableRow(line);
  return cells.length > 0 && cells.every((cell) => /^:?-{2,}:?$/.test(cell));
}

/**
 * Maps a GFM separator cell to a CSS text-align value.
 */
function parseTableAlignment(cell: string): 'left' | 'center' | 'right' {
  const startsColon = cell.startsWith(':');
  const endsColon = cell.endsWith(':');
  if (startsColon && endsColon) return 'center';
  if (endsColon) return 'right';
  return 'left';
}

/**
 * Renders structured markdown content into beautiful, high-readability semantic HTML.
 */
export function renderMarkdownToHtml(markdown: string): string {
  const lines = markdown.split('\n');
  const output: string[] = [];
  let inList: 'ul' | 'ol' | null = null;
  let inBlockquote = false;
  let blockquoteBuffer: string[] = [];

  const flushBlockquote = () => {
    if (inBlockquote && blockquoteBuffer.length > 0) {
      output.push(
        `<blockquote class="my-6 pl-5 border-l-2 border-[#171717] italic text-[#52525B] text-base leading-relaxed bg-[#FAFAFA] py-3 pr-4 rounded-r-md">\n${blockquoteBuffer.join('<br />\n')}\n</blockquote>`
      );
      blockquoteBuffer = [];
      inBlockquote = false;
    }
  };

  const flushList = () => {
    if (inList === 'ul') {
      output.push('</ul>');
      inList = null;
    } else if (inList === 'ol') {
      output.push('</ol>');
      inList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Empty lines trigger flushing
    if (!trimmed) {
      flushBlockquote();
      flushList();
      continue;
    }

    // Horizontal Rule: ---
    if (/^---$/.test(trimmed) || /^\*\*\*$/.test(trimmed)) {
      flushBlockquote();
      flushList();
      output.push('<hr class="my-10 border-[#E4E4E7]" />');
      continue;
    }

    // Headings
    if (trimmed.startsWith('# ')) {
      flushBlockquote();
      flushList();
      const text = trimmed.replace(/^#\s+/, '').trim();
      const id = slugifyHeading(text);
      output.push(`<h1 id="${id}" class="text-2xl sm:text-3xl font-serif font-medium text-[#171717] tracking-tight mt-10 mb-6 scroll-mt-24">${parseInline(text)}</h1>`);
      continue;
    }

    if (trimmed.startsWith('## ')) {
      flushBlockquote();
      flushList();
      const text = trimmed.replace(/^##\s+/, '').trim();
      const id = slugifyHeading(text);
      output.push(`<h2 id="${id}" class="text-xl sm:text-2xl font-serif font-medium text-[#171717] tracking-tight mt-10 mb-4 pb-2 border-b border-[#F4F4F5] scroll-mt-24">${parseInline(text)}</h2>`);
      continue;
    }

    if (trimmed.startsWith('### ')) {
      flushBlockquote();
      flushList();
      const text = trimmed.replace(/^###\s+/, '').trim();
      const id = slugifyHeading(text);
      output.push(`<h3 id="${id}" class="text-lg sm:text-xl font-medium text-[#171717] tracking-tight mt-8 mb-3 scroll-mt-24">${parseInline(text)}</h3>`);
      continue;
    }

    // Blockquote: > text
    if (trimmed.startsWith('> ')) {
      flushList();
      inBlockquote = true;
      blockquoteBuffer.push(parseInline(trimmed.replace(/^>\s+/, '')));
      continue;
    } else if (inBlockquote) {
      flushBlockquote();
    }

    // Bullet list: - text or * text
    if (/^[-*]\s+/.test(trimmed)) {
      flushBlockquote();
      if (inList !== 'ul') {
        flushList();
        output.push('<ul class="my-4 space-y-2 pl-6 list-disc marker:text-[#71717A] text-[#27272A] leading-relaxed">');
        inList = 'ul';
      }
      const itemContent = trimmed.replace(/^[-*]\s+/, '');
      output.push(`<li class="text-base">${parseInline(itemContent)}</li>`);
      continue;
    }

    // Ordered list: 1. text
    if (/^\d+\.\s+/.test(trimmed)) {
      flushBlockquote();
      if (inList !== 'ol') {
        flushList();
        output.push('<ol class="my-4 space-y-2 pl-6 list-decimal marker:text-[#71717A] text-[#27272A] leading-relaxed">');
        inList = 'ol';
      }
      const itemContent = trimmed.replace(/^\d+\.\s+/, '');
      output.push(`<li class="text-base">${parseInline(itemContent)}</li>`);
      continue;
    }

    // Markdown Table: header row followed by | :--- | ... | separator row
    if (trimmed.startsWith('|') && i + 1 < lines.length && isTableSeparatorRow(lines[i + 1].trim())) {
      flushBlockquote();
      flushList();

      const headers = splitTableRow(trimmed);
      const alignments = splitTableRow(lines[i + 1].trim()).map(parseTableAlignment);

      const headerHtml = headers
        .map((cell, idx) => {
          const align = alignments[idx] || 'left';
          return `<th class="px-4 py-3 font-semibold text-[#171717] whitespace-nowrap" style="text-align:${align}">${parseInline(cell)}</th>`;
        })
        .join('');

      const rowsHtml: string[] = [];
      let j = i + 2;
      while (j < lines.length && lines[j].trim().startsWith('|')) {
        const rowCells = splitTableRow(lines[j].trim());
        const cellsHtml = headers
          .map((_, idx) => {
            const align = alignments[idx] || 'left';
            const content = rowCells[idx] ?? '';
            return `<td class="px-4 py-3 text-[#27272A] leading-relaxed align-top" style="text-align:${align}">${parseInline(content)}</td>`;
          })
          .join('');
        rowsHtml.push(`<tr class="hover:bg-[#FAFAFA]/60 transition-colors">${cellsHtml}</tr>`);
        j++;
      }

      output.push(
        `<div class="my-6 overflow-x-auto rounded-lg border border-[#E4E4E7]">\n` +
        `<table class="w-full border-collapse text-left text-sm sm:text-[15px]">\n` +
        `<thead class="bg-[#FAFAFA] border-b border-[#E4E4E7]"><tr>${headerHtml}</tr></thead>\n` +
        `<tbody class="divide-y divide-[#E4E4E7] bg-white">${rowsHtml.join('')}</tbody>\n` +
        `</table>\n` +
        `</div>`
      );

      i = j - 1;
      continue;
    }

    // Otherwise standard paragraph
    flushBlockquote();
    flushList();
    output.push(`<p class="my-5 text-base sm:text-[17px] leading-[1.8] text-[#27272A] font-sans antialiased">${parseInline(trimmed)}</p>`);
  }

  flushBlockquote();
  flushList();

  return output.join('\n');
}
