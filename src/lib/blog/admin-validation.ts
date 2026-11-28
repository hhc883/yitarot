import 'server-only';
import crypto from 'node:crypto';
import path from 'node:path';
import {
  type BlogLang,
  isRealCalendarDate,
  MAX_COVER_BYTES,
  MAX_MARKDOWN_BYTES,
  normalizeLineEndings
} from './admin-editor';
import { BLOG_CATEGORIES } from './categories';
import { parseMarkdownFrontmatter } from './frontmatter';
import { BlogCategory } from '@/types/blog';

export {
  type BlogLang,
  buildNewPostTemplate,
  isRealCalendarDate,
  MAX_COVER_BYTES,
  MAX_MARKDOWN_BYTES,
  normalizeLineEndings,
  RECOMMENDED_COVER_HEIGHT,
  RECOMMENDED_COVER_KB,
  RECOMMENDED_COVER_WIDTH,
  upsertCoverImageInFrontmatter
} from './admin-editor';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const VALID_CATEGORIES = new Set<string>(BLOG_CATEGORIES.map((c) => c.id));

/**
 * Computes SHA-256 hex digest over CRLF-normalized UTF-8 Markdown content.
 */
export function computeContentRevisionHash(raw: string): string {
  return crypto
    .createHash('sha256')
    .update(normalizeLineEndings(raw), 'utf8')
    .digest('hex');
}

/**
 * Validates a blog slug (lowercase ASCII kebab-case, 2..100 chars, no path separators).
 */
export function isValidSlug(slug: string): boolean {
  return slug.length >= 2 && slug.length <= 100 && SLUG_RE.test(slug);
}

/**
 * Builds and verifies the repository-relative path `src/content/blog/<lang>/<slug>.md`.
 */
export function buildSafeBlogContentPath(lang: BlogLang, slug: string): string | null {
  if (lang !== 'zh' && lang !== 'en') return null;
  if (!isValidSlug(slug)) return null;
  const rel = `src/content/blog/${lang}/${slug}.md`;
  const normalized = path.posix.normalize(rel);
  if (normalized !== rel || normalized.includes('..')) return null;
  return rel;
}

export interface ValidatedBlogDocument {
  normalizedRaw: string;
  revisionHash: string;
  byteLength: number;
  lang: BlogLang;
  slug: string;
  repoPath: string;
  category: BlogCategory;
  title: string;
  subtitle?: string;
  description: string;
  publishedAt: string;
  modifiedAt?: string;
  coverImage?: string;
  featured: boolean;
  tags: string[];
  body: string;
}

export type BlogDocumentValidationResult =
  | { ok: true; data: ValidatedBlogDocument }
  | { ok: false; errors: string[] };

export interface ValidateBlogDocumentOptions {
  rawMarkdown: string;
  expectedLang: BlogLang;
  mode: 'create' | 'edit';
  originalLang?: BlogLang;
  originalSlug?: string;
}

/**
 * Validates raw Markdown with frontmatter using parseMarkdownFrontmatter.
 */
export function validateBlogDocument({
  rawMarkdown,
  expectedLang,
  mode,
  originalLang,
  originalSlug
}: ValidateBlogDocumentOptions): BlogDocumentValidationResult {
  const errors: string[] = [];
  const isEn = expectedLang === 'en';

  if (typeof rawMarkdown !== 'string' || !rawMarkdown.trim()) {
    return {
      ok: false,
      errors: [isEn ? 'Markdown source cannot be empty.' : 'Markdown 源码不能为空。']
    };
  }

  const normalizedRaw = normalizeLineEndings(rawMarkdown);
  const byteLength = Buffer.byteLength(normalizedRaw, 'utf8');
  if (byteLength > MAX_MARKDOWN_BYTES) {
    errors.push(
      isEn
        ? `Markdown exceeds maximum size (${byteLength} / ${MAX_MARKDOWN_BYTES} bytes).`
        : `Markdown 体积超出上限（${byteLength} / ${MAX_MARKDOWN_BYTES} 字节）。`
    );
  }

  if (!normalizedRaw.startsWith('---\n') || normalizedRaw.indexOf('\n---\n', 4) === -1) {
    errors.push(
      isEn
        ? 'Missing valid YAML frontmatter block delimited by ---.'
        : '缺少有效的 --- YAML Frontmatter 区块。'
    );
  }

  const { data, content } = parseMarkdownFrontmatter(normalizedRaw);

  const fmLang = typeof data.lang === 'string' ? data.lang.trim() : '';
  if (fmLang !== 'zh' && fmLang !== 'en') {
    errors.push(
      isEn ? 'Frontmatter "lang" must be "zh" or "en".' : 'Frontmatter 中的 lang 必须为 zh 或 en。'
    );
  } else if (fmLang !== expectedLang) {
    errors.push(
      isEn
        ? `Frontmatter "lang" (${fmLang}) must match current admin locale (${expectedLang}).`
        : `Frontmatter 中的 lang（${fmLang}）必须与当前后台语言（${expectedLang}）一致。`
    );
  }

  const slug = typeof data.slug === 'string' ? data.slug.trim() : '';
  if (!isValidSlug(slug)) {
    errors.push(
      isEn
        ? 'Frontmatter "slug" must be 2–100 lowercase ASCII letters, digits, and single hyphens.'
        : 'Frontmatter 中的 slug 必须为 2–100 位小写字母、数字与单连字符组合。'
    );
  }

  if (mode === 'edit') {
    if (!originalLang || !originalSlug) {
      errors.push(
        isEn ? 'Original article identity is missing.' : '缺少原文章语言与 slug 标识。'
      );
    } else {
      if (fmLang !== originalLang) {
        errors.push(
          isEn
            ? `Existing article "lang" cannot be changed (expected "${originalLang}").`
            : `已有文章不可修改 lang（应为 ${originalLang}）。`
        );
      }
      if (slug !== originalSlug) {
        errors.push(
          isEn
            ? `Existing article "slug" cannot be changed (expected "${originalSlug}").`
            : `已有文章不可修改 slug（应为 ${originalSlug}）。`
        );
      }
    }
  }

  const repoPath =
    fmLang === 'zh' || fmLang === 'en' ? buildSafeBlogContentPath(fmLang, slug) : null;
  if (!repoPath && slug && (fmLang === 'zh' || fmLang === 'en')) {
    errors.push(isEn ? 'Invalid target file path.' : '目标文件路径不合法。');
  }

  const category = typeof data.category === 'string' ? data.category.trim() : '';
  if (!VALID_CATEGORIES.has(category)) {
    errors.push(
      isEn
        ? 'Frontmatter "category" must be one of: tarot, metaphysics, mind, cases.'
        : 'Frontmatter 中的 category 必须为 tarot、metaphysics、mind 或 cases 之一。'
    );
  }

  const publishedAt = typeof data.publishedAt === 'string' ? data.publishedAt.trim() : '';
  if (!isRealCalendarDate(publishedAt)) {
    errors.push(
      isEn
        ? 'Frontmatter "publishedAt" must be a real YYYY-MM-DD date.'
        : 'Frontmatter 中的 publishedAt 必须为真实有效的 YYYY-MM-DD 日期。'
    );
  }

  const modifiedAt = typeof data.modifiedAt === 'string' ? data.modifiedAt.trim() : '';
  if (modifiedAt && !isRealCalendarDate(modifiedAt)) {
    errors.push(
      isEn
        ? 'Frontmatter "modifiedAt" must be a real YYYY-MM-DD date.'
        : 'Frontmatter 中的 modifiedAt 必须为真实有效的 YYYY-MM-DD 日期。'
    );
  }

  const title = typeof data.title === 'string' ? data.title.trim() : '';
  if (!title || title.length > 200) {
    errors.push(
      isEn
        ? 'Frontmatter "title" is required and must be at most 200 characters.'
        : 'Frontmatter 中的 title 为必填项，且不超过 200 字符。'
    );
  }

  const description = typeof data.description === 'string' ? data.description.trim() : '';
  if (!description || description.length > 500) {
    errors.push(
      isEn
        ? 'Frontmatter "description" is required and must be at most 500 characters.'
        : 'Frontmatter 中的 description 为必填项，且不超过 500 字符。'
    );
  }

  const coverImage = typeof data.coverImage === 'string' ? data.coverImage.trim() : '';
  if (coverImage) {
    let validCover = false;
    try {
      const parsed = new URL(coverImage);
      validCover = parsed.protocol === 'https:';
    } catch {
      validCover = coverImage.startsWith('/') && !coverImage.startsWith('//');
    }
    if (!validCover) {
      errors.push(
        isEn
          ? 'Frontmatter "coverImage" must be an https:// URL, a root-relative path, or empty.'
          : 'Frontmatter 中的 coverImage 必须为 https:// 链接、站内相对路径或留空。'
      );
    }
  }

  const body = content.trim();
  if (!body) {
    errors.push(
      isEn ? 'Markdown article body cannot be empty.' : 'Markdown 正文内容不能为空。'
    );
  }

  if (errors.length > 0 || !repoPath) {
    return { ok: false, errors };
  }

  const subtitle = typeof data.subtitle === 'string' ? data.subtitle.trim() : undefined;
  const tags = Array.isArray(data.tags) ? data.tags.map(String).filter(Boolean) : [];

  return {
    ok: true,
    data: {
      normalizedRaw,
      revisionHash: computeContentRevisionHash(normalizedRaw),
      byteLength,
      lang: fmLang as BlogLang,
      slug,
      repoPath,
      category: category as BlogCategory,
      title,
      subtitle: subtitle || undefined,
      description,
      publishedAt,
      modifiedAt: modifiedAt || undefined,
      coverImage: coverImage || undefined,
      featured: Boolean(data.featured),
      tags,
      body
    }
  };
}

export type WebpValidationResult =
  | { ok: true; width: number; height: number }
  | { ok: false; error: string };

/**
 * Validates a RIFF WebP binary buffer (VP8, VP8L, or VP8X) and checks 16:9 landscape dimensions.
 */
export function validateWebpCoverBuffer(buffer: Buffer, lang: BlogLang): WebpValidationResult {
  const isEn = lang === 'en';
  if (buffer.byteLength < 30) {
    return {
      ok: false,
      error: isEn ? 'File is too small to be a valid WebP image.' : '文件过小，不是有效的 WebP 图片。'
    };
  }
  if (buffer.byteLength > MAX_COVER_BYTES) {
    return {
      ok: false,
      error: isEn
        ? `WebP cover exceeds 512 KiB limit (${Math.ceil(buffer.byteLength / 1024)} KiB).`
        : `WebP 封面体积超过 512 KiB 上限（当前 ${Math.ceil(buffer.byteLength / 1024)} KiB）。`
    };
  }

  if (
    buffer.toString('ascii', 0, 4) !== 'RIFF' ||
    buffer.toString('ascii', 8, 12) !== 'WEBP'
  ) {
    return {
      ok: false,
      error: isEn
        ? 'Invalid image format: only RIFF WebP (.webp) files are accepted.'
        : '图片格式无效：仅支持标准 RIFF WebP（.webp）文件。'
    };
  }

  const chunkType = buffer.toString('ascii', 12, 16);
  let width = 0;
  let height = 0;

  if (chunkType === 'VP8X') {
    if (buffer.byteLength < 30) {
      return {
        ok: false,
        error: isEn ? 'Corrupted VP8X WebP header.' : 'WebP VP8X 文件头损坏。'
      };
    }
    width = 1 + (buffer[24] | (buffer[25] << 8) | (buffer[26] << 16));
    height = 1 + (buffer[27] | (buffer[28] << 8) | (buffer[29] << 16));
  } else if (chunkType === 'VP8 ') {
    if (
      buffer.byteLength < 30 ||
      buffer[23] !== 0x9d ||
      buffer[24] !== 0x01 ||
      buffer[25] !== 0x2a
    ) {
      return {
        ok: false,
        error: isEn ? 'Corrupted VP8 WebP keyframe header.' : 'WebP VP8 关键帧头损坏。'
      };
    }
    width = buffer.readUInt16LE(26) & 0x3fff;
    height = buffer.readUInt16LE(28) & 0x3fff;
  } else if (chunkType === 'VP8L') {
    if (buffer.byteLength < 25 || buffer[20] !== 0x2f) {
      return {
        ok: false,
        error: isEn ? 'Corrupted VP8L WebP header.' : 'WebP VP8L 文件头损坏。'
      };
    }
    const packed = buffer.readUInt32LE(21);
    width = (packed & 0x3fff) + 1;
    height = ((packed >> 14) & 0x3fff) + 1;
  } else {
    return {
      ok: false,
      error: isEn ? 'Unsupported WebP chunk encoding.' : '不支持的 WebP 编码块类型。'
    };
  }

  if (width < 320 || height < 180 || width > 4096 || height > 2304) {
    return {
      ok: false,
      error: isEn
        ? `WebP dimensions (${width}×${height}) must be between 320×180 and 4096×2304.`
        : `WebP 尺寸（${width}×${height}）需在 320×180 至 4096×2304 之间。`
    };
  }

  // Enforce 16:9 landscape aspect ratio with 1% tolerance for integer rounding
  const ratioDiff = Math.abs(width * 9 - height * 16);
  const tolerance = Math.max(16, Math.round(width * 0.01));
  if (width <= height || ratioDiff > tolerance) {
    return {
      ok: false,
      error: isEn
        ? `Cover must have a 16:9 landscape aspect ratio (got ${width}×${height}; recommended 1600×900).`
        : `封面必须为 16:9 横版比例（当前为 ${width}×${height}，推荐 1600×900）。`
    };
  }

  return { ok: true, width, height };
}
