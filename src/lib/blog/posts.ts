import fs from 'node:fs';
import path from 'node:path';
import { BlogCategory, BlogPost } from '@/types/blog';
import { BLOG_AUTHORS } from './authors';
import { BLOG_TOOLS } from './tools';
import { FrontmatterValue, parseMarkdownFrontmatter } from './frontmatter';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

function collectMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

function asString(val: FrontmatterValue | undefined, fallback = ''): string {
  return typeof val === 'string' ? val : fallback;
}

function asStringArray(val: FrontmatterValue | undefined): string[] {
  return Array.isArray(val) ? val.map(String) : [];
}

function parsePostFile(filePath: string): BlogPost {
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = parseMarkdownFrontmatter(raw);

  const lang = data.lang === 'en' ? 'en' : 'zh';
  const defaultAuthorKey = lang === 'en' ? 'research-en' : 'research-zh';
  const authorKey = asString(data.authorId, defaultAuthorKey);
  const toolKey = asString(data.toolId, 'tool-tarot-reading');

  const author = BLOG_AUTHORS[authorKey] || BLOG_AUTHORS[defaultAuthorKey];
  const relatedTool = BLOG_TOOLS[toolKey] || BLOG_TOOLS['tool-tarot-reading'];

  return {
    id: asString(data.id, path.basename(filePath, '.md')),
    slug: asString(data.slug, path.basename(filePath, '.md')),
    lang,
    title: asString(data.title),
    subtitle: asString(data.subtitle) || undefined,
    description: asString(data.description),
    publishedAt: asString(data.publishedAt),
    modifiedAt: asString(data.modifiedAt) || undefined,
    readingTime: typeof data.readingTime === 'number' ? data.readingTime : 6,
    category: (asString(data.category, 'tarot') as BlogCategory),
    tags: asStringArray(data.tags),
    coverImage: asString(data.coverImage) || undefined,
    featured: Boolean(data.featured),
    author,
    relatedTool,
    relatedSlugs: asStringArray(data.relatedSlugs),
    content
  };
}

function loadAllBlogPosts(): BlogPost[] {
  return collectMarkdownFiles(CONTENT_DIR)
    .map(parsePostFile)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export const BLOG_POSTS: BlogPost[] = loadAllBlogPosts();

export function getAllPosts(lang: 'zh' | 'en'): BlogPost[] {
  const posts = process.env.NODE_ENV === 'development' ? loadAllBlogPosts() : BLOG_POSTS;
  return posts.filter((post) => post.lang === lang);
}

export function getPostBySlug(slug: string, lang: 'zh' | 'en'): BlogPost | undefined {
  const posts = process.env.NODE_ENV === 'development' ? loadAllBlogPosts() : BLOG_POSTS;
  return posts.find((post) => post.slug === slug && post.lang === lang);
}

export function getPostsByCategory(category: BlogCategory, lang: 'zh' | 'en'): BlogPost[] {
  return getAllPosts(lang).filter((post) => post.category === category);
}

export function getFeaturedPosts(lang: 'zh' | 'en'): BlogPost[] {
  return getAllPosts(lang).filter((post) => post.featured);
}
