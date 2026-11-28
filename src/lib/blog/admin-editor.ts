export type BlogLang = 'zh' | 'en';

export const MAX_MARKDOWN_BYTES = 256 * 1024; // 256 KiB
export const MAX_COVER_BYTES = 512 * 1024; // 512 KiB
export const RECOMMENDED_COVER_WIDTH = 1600;
export const RECOMMENDED_COVER_HEIGHT = 900;
export const RECOMMENDED_COVER_KB = 200;

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Normalizes CRLF line endings to LF for deterministic hashing and GitHub storage.
 */
export function normalizeLineEndings(raw: string): string {
  return raw.replace(/\r\n/g, '\n');
}

/**
 * Validates that a string is a real YYYY-MM-DD calendar date.
 */
export function isRealCalendarDate(value: string): boolean {
  const match = DATE_RE.exec(value.trim());
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const dt = new Date(Date.UTC(year, month - 1, day));
  return (
    dt.getUTCFullYear() === year &&
    dt.getUTCMonth() === month - 1 &&
    dt.getUTCDate() === day
  );
}

/**
 * Generates a starter Markdown + frontmatter template for a new localized blog post.
 */
export function buildNewPostTemplate(lang: BlogLang, todayIso?: string): string {
  const dateStr = todayIso && isRealCalendarDate(todayIso)
    ? todayIso
    : new Date().toISOString().slice(0, 10);

  if (lang === 'en') {
    return `---
id: new-article-slug
slug: new-article-slug
lang: en
title: "Untitled Reflective Guide"
subtitle: "A concise subtitle framing the archetype or method"
description: "A clear 1–2 sentence summary for search engines and article cards."
publishedAt: "${dateStr}"
readingTime: 6
category: tarot
tags:
  - Tarot
  - Self-Reflection
coverImage: ""
featured: false
authorId: research-en
toolId: tool-tarot-reading
---

## Opening Context

Write the opening section here. Keep paragraphs focused and clear.

## Key Perspectives

- First grounded observation
- Second grounded observation

> A concise reflective takeaway for the reader.
`;
  }

  return `---
id: new-article-slug
slug: new-article-slug
lang: zh
title: "新研习文章标题"
subtitle: "一句话点明本文探讨的符号、卦理或心理视角"
description: "用于搜索引擎与文章列表展示的 1–2 句核心摘要。"
publishedAt: "${dateStr}"
readingTime: 6
category: tarot
tags:
  - 塔罗研习
  - 自我认知
coverImage: ""
featured: false
authorId: research-zh
toolId: tool-tarot-reading
---

## 缘起与视角

在这里撰写开篇正文，保持克制、清晰的思考脉络。

## 核心脉络

- 第一条观察与推演要点
- 第二条观察与推演要点

> 一句凝练的心法结语，供读者在阅读后自我对照。
`;
}

/**
 * Inserts or updates the `coverImage:` line in YAML frontmatter without altering other lines.
 */
export function upsertCoverImageInFrontmatter(rawMarkdown: string, coverUrl: string): string {
  const normalized = normalizeLineEndings(rawMarkdown);
  if (!normalized.startsWith('---\n')) return normalized;
  const endIdx = normalized.indexOf('\n---\n', 4);
  if (endIdx === -1) return normalized;

  const frontmatter = normalized.slice(4, endIdx);
  const rest = normalized.slice(endIdx);
  const lines = frontmatter.split('\n');
  const quoted = JSON.stringify(coverUrl);

  let updated = false;
  const nextLines = lines.map((line) => {
    if (/^\s*coverImage\s*:/.test(line)) {
      updated = true;
      return `coverImage: ${quoted}`;
    }
    return line;
  });

  if (!updated) {
    nextLines.push(`coverImage: ${quoted}`);
  }

  return `---\n${nextLines.join('\n')}${rest}`;
}
