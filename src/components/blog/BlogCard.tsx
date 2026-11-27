import React from 'react';
import Link from 'next/link';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import { BlogPost } from '@/types/blog';
import { BLOG_CATEGORIES } from '@/lib/blog/categories';
import { BlogCardThumbnail } from './BlogCardThumbnail';

interface BlogCardProps {
  post: BlogPost;
  lang: 'zh' | 'en';
}

export function BlogCard({ post, lang }: BlogCardProps) {
  const isEn = lang === 'en';
  const categoryMeta = BLOG_CATEGORIES.find((c) => c.id === post.category);
  const categoryLabel = categoryMeta ? (isEn ? categoryMeta.nameEn : categoryMeta.nameZh) : post.category;
  const coverSrc = post.coverImage?.trim() || '';

  return (
    <article className="group rounded-xl border border-[#E4E4E7] bg-[#FFFFFF] p-4 sm:p-5 hover:border-[#171717] transition-colors">
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#71717A]">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#171717] font-medium bg-[#F4F4F5] px-2.5 py-0.5 rounded">
          {categoryLabel}
        </span>
        <span className="inline-flex items-center gap-1 font-mono text-[11px]">
          <Calendar size={12} />
          {post.publishedAt}
        </span>
        <span className="inline-flex items-center gap-1 font-mono text-[11px]">
          <Clock size={12} />
          {post.readingTime} {isEn ? 'min' : '分钟'}
        </span>
      </div>

      <div className="mt-2.5 flex items-start gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <Link href={`/${lang}/blog/${post.slug}`} className="block">
            <h3 className="text-base sm:text-lg font-serif font-medium text-[#171717] group-hover:text-black leading-snug tracking-tight break-words">
              {post.title}
            </h3>
          </Link>
          <p className="mt-1.5 text-xs sm:text-sm text-[#52525B] leading-relaxed line-clamp-3 break-words">
            {post.description}
          </p>

          <div className="mt-2.5">
            <Link
              href={`/${lang}/blog/${post.slug}`}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#171717] hover:underline underline-offset-4"
            >
              <span>{isEn ? 'Read' : '阅读'}</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {coverSrc && (
          <BlogCardThumbnail
            href={`/${lang}/blog/${post.slug}`}
            src={coverSrc}
            alt={post.title}
          />
        )}
      </div>

      {post.tags.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-[#F4F4F5] flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] text-[#71717A] bg-[#FAFAFA] border border-[#E4E4E7] px-2 py-0.5 rounded max-w-full truncate"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
