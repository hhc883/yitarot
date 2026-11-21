export type BlogCategory = 'tarot' | 'metaphysics' | 'mind' | 'cases';

export interface BlogAuthor {
  name: string;
  roleZh: string;
  roleEn: string;
  avatar?: string;
  bioZh?: string;
  bioEn?: string;
}

export interface BlogToolCta {
  id: string;
  nameZh: string;
  nameEn: string;
  descZh: string;
  descEn: string;
  ctaZh: string;
  ctaEn: string;
  href: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  lang: 'zh' | 'en';
  title: string;
  subtitle?: string;
  description: string;
  publishedAt: string;
  modifiedAt?: string;
  readingTime: number; // in minutes
  category: BlogCategory;
  tags: string[];
  coverImage?: string;
  featured?: boolean;
  author: BlogAuthor;
  relatedTool: BlogToolCta;
  relatedSlugs?: string[];
  content: string; // Markdown formatted string
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}
