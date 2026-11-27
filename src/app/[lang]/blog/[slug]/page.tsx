import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, Sparkles } from 'lucide-react';
import { BLOG_POSTS, getPostBySlug, getAllPosts, BLOG_CATEGORIES } from '@/lib/blog/posts';
import { renderMarkdownToHtml, extractHeadings } from '@/lib/blog/markdown';
import { JsonLd } from '@/components/seo/JsonLd';
import { BlogReadingProgress } from '@/components/blog/BlogReadingProgress';
import { BlogToc } from '@/components/blog/BlogToc';
import { BlogToolCtaBanner } from '@/components/blog/BlogToolCta';
import { BlogAuthorCard } from '@/components/blog/BlogAuthorCard';
import { BlogCard } from '@/components/blog/BlogCard';

export const instant = false;

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    lang: post.lang,
    slug: post.slug
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yitarot.net';
  const post = getPostBySlug(slug, lang);

  if (!post) {
    return {
      title: lang === 'en' ? 'Article Not Found | YiTatro' : '文章未找到 - YiTatro'
    };
  }

  const title = `${post.title} | YiTatro`;
  const description = post.description;

  return {
    title,
    description,
    keywords: post.tags.concat(['YiTatro', post.category, lang === 'en' ? 'Article' : '研习文章']),
    alternates: {
      canonical: `${siteUrl}/${lang}/blog/${post.slug}`,
      languages: {
        zh: `${siteUrl}/zh/blog/${post.slug}`,
        en: `${siteUrl}/en/blog/${post.slug}`,
        'x-default': `${siteUrl}/zh/blog/${post.slug}`
      }
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${lang}/blog/${post.slug}`,
      siteName: 'YiTatro',
      locale: lang === 'en' ? 'en_US' : 'zh_CN',
      type: 'article',
      images: post.coverImage ? [{ url: post.coverImage, alt: post.title }] : undefined,
      publishedTime: post.publishedAt,
      modifiedTime: post.modifiedAt || post.publishedAt,
      authors: [post.author.name],
      tags: post.tags
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined
    }
  };
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: rawLang, slug } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yitarot.net';
  const post = getPostBySlug(slug, lang);

  if (!post) {
    notFound();
  }

  const categoryMeta = BLOG_CATEGORIES.find((c) => c.id === post.category);
  const categoryLabel = categoryMeta
    ? (lang === 'en' ? categoryMeta.nameEn : categoryMeta.nameZh)
    : post.category;

  const tocItems = extractHeadings(post.content);
  const htmlContent = renderMarkdownToHtml(post.content);

  // Related posts (excluding current post)
  const allPosts = getAllPosts(lang);
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: lang === 'en' ? 'Home' : '首页',
          item: `${siteUrl}/${lang}`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: lang === 'en' ? 'Blog' : '心法指南',
          item: `${siteUrl}/${lang}/blog`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.title,
          item: `${siteUrl}/${lang}/blog/${post.slug}`
        }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      image: post.coverImage || undefined,
      datePublished: post.publishedAt,
      dateModified: post.modifiedAt || post.publishedAt,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${siteUrl}/${lang}/blog/${post.slug}`
      },
      author: {
        '@type': 'Person',
        name: post.author.name,
        jobTitle: lang === 'en' ? post.author.roleEn : post.author.roleZh
      },
      publisher: {
        '@type': 'Organization',
        name: 'YiTatro',
        url: siteUrl
      },
      keywords: post.tags.join(', ')
    }
  ];

  return (
    <>
      <BlogReadingProgress />
      <JsonLd data={structuredData} />

      <main className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Breadcrumb / Back Link */}
        <div className="mb-8">
          <Link
            href={`/${lang}/blog`}
            className="inline-flex items-center gap-1.5 text-xs text-[#71717A] hover:text-[#171717] transition-colors font-medium"
          >
            <ArrowLeft size={13} />
            <span>{lang === 'en' ? 'Back to all articles' : '返回所有研习文章'}</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="max-w-3xl space-y-4 pb-8 border-b border-[#E4E4E7]">
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#71717A]">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#171717] font-medium bg-[#F4F4F5] px-2.5 py-0.5 rounded">
              {categoryLabel}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 font-mono text-[11px]">
              <Calendar size={12} />
              {post.publishedAt}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 font-mono text-[11px]">
              <Clock size={12} />
              {post.readingTime} {lang === 'en' ? 'min read' : '分钟阅读'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-medium text-[#171717] leading-tight tracking-tight">
            {post.title}
          </h1>

          {post.subtitle && (
            <p className="text-base sm:text-lg font-serif italic text-[#52525B] leading-relaxed">
              {post.subtitle}
            </p>
          )}

          <div className="pt-2 flex items-center gap-3 text-xs text-[#52525B]">
            <span className="font-medium text-[#171717]">{post.author.name}</span>
            <span>/</span>
            <span>{lang === 'en' ? post.author.roleEn : post.author.roleZh}</span>
          </div>
        </header>

        {/* Content Section: 2 Columns on Desktop */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Article Text */}
          <div className="lg:col-span-8 max-w-none">
            {post.coverImage && (
              <div className="mb-8 overflow-hidden rounded-xl border border-[#E4E4E7] bg-[#FAFAFA]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full aspect-[16/9] object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>
            )}

            {/* Lead description quote */}
            <div className="mb-8 p-4 sm:p-5 rounded-lg bg-[#FAFAFA] border-l-2 border-[#171717] text-xs sm:text-sm text-[#52525B] leading-relaxed italic">
              {post.description}
            </div>

            {/* Rendered HTML Content */}
            <article
              className="prose-container"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* In-content Deep-Link Tool CTA */}
            {post.relatedTool && (
              <BlogToolCtaBanner tool={post.relatedTool} lang={lang} />
            )}

            {/* Author Box */}
            <BlogAuthorCard author={post.author} lang={lang} />

            {/* Tags list */}
            <div className="pt-6 border-t border-[#E4E4E7] flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#71717A] mr-1">
                {lang === 'en' ? 'Tags:' : '关键词标签：'}
              </span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-[#52525B] bg-[#F4F4F5] px-2.5 py-1 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Sticky Table of Contents (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4">
            <BlogToc items={tocItems} lang={lang} />
          </aside>
        </div>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-[#E4E4E7] space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#171717]" />
              <h3 className="text-xl font-serif font-medium text-[#171717] tracking-tight">
                {lang === 'en' ? 'Related In-Depth Articles' : '延伸研习推荐'}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((rPost) => (
                <BlogCard key={rPost.id} post={rPost} lang={lang} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
