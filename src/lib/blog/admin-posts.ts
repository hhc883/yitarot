import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import { requireBlogAdmin } from './admin-auth';
import {
  BlogLang,
  computeContentRevisionHash,
  isValidSlug,
  normalizeLineEndings
} from './admin-validation';
import { parseMarkdownFrontmatter } from './frontmatter';

export interface AdminBlogPostSummary {
  lang: BlogLang;
  slug: string;
  title: string;
  category: string;
  publishedAt: string;
  featured: boolean;
  coverImage?: string;
  rawMarkdown: string;
  revisionHash: string;
}

const CONTENT_ROOT = path.join(process.cwd(), 'src', 'content', 'blog');

/**
 * Server-only guarded loader that returns localized blog posts with exact raw Markdown source
 * and normalized revision hash for optimistic conflict detection.
 */
export async function loadAdminBlogPosts(lang: BlogLang): Promise<{
  ok: true;
  posts: AdminBlogPostSummary[];
} | {
  ok: false;
  reason: 'unauthenticated' | 'forbidden';
}> {
  const auth = await requireBlogAdmin();
  if (!auth.ok) {
    return auth;
  }

  const langDir = path.join(CONTENT_ROOT, lang);
  if (!fs.existsSync(langDir)) {
    return { ok: true, posts: [] };
  }

  const entries = fs.readdirSync(langDir, { withFileTypes: true });
  const posts: AdminBlogPostSummary[] = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    const fileSlug = entry.name.slice(0, -3);
    if (!isValidSlug(fileSlug)) continue;

    const fullPath = path.join(langDir, entry.name);
    const rawMarkdown = fs.readFileSync(fullPath, 'utf8');
    const normalized = normalizeLineEndings(rawMarkdown);
    const { data } = parseMarkdownFrontmatter(normalized);

    const slug = typeof data.slug === 'string' && isValidSlug(data.slug.trim())
      ? data.slug.trim()
      : fileSlug;

    posts.push({
      lang,
      slug,
      title: typeof data.title === 'string' && data.title.trim() ? data.title.trim() : slug,
      category: typeof data.category === 'string' ? data.category.trim() : 'tarot',
      publishedAt: typeof data.publishedAt === 'string' ? data.publishedAt.trim() : '',
      featured: Boolean(data.featured),
      coverImage: typeof data.coverImage === 'string' && data.coverImage.trim()
        ? data.coverImage.trim()
        : undefined,
      rawMarkdown: normalized,
      revisionHash: computeContentRevisionHash(normalized)
    });
  }

  posts.sort((a, b) => {
    const timeA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const timeB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return timeB - timeA;
  });

  return { ok: true, posts };
}
