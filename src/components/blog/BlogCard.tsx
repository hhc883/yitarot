import React from 'react';
import Link from 'next/link';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import { BlogPost } from '@/types/blog';
import { BLOG_CATEGORIES } from '@/lib/blog/posts';

interface BlogCardProps {
  post: BlogPost;
  lang: 'zh' | 'en';
}

export function BlogCard({ post, lang }: BlogCardProps) {
  const isEn = lang === 'en';
  const categoryMeta = BLOG_CATEGORIES.find((c) => c.id === post.category);
  const categoryLabel = categoryMeta ? (isEn ? categoryMeta.nameEn : categoryMeta.nameZh) : post.category;

  return (
    <article className="group flex flex-col justify-between p-6 rounded-xl border border-[#E4E4E7] bg-[#FFFFFF] hover:border-[#171717] transition-all duration-200 shadow-xs hover:shadow-sm">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[#71717A]">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#171717] font-medium bg-[#F4F4F5] px-2.5 py-0.5 rounded">
            {categoryLabel}
          </span>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 font-mono text-[11px]">
              <Calendar size={12} />
              {post.publishedAt}
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-[11px]">
              <Clock size={12} />
              {post.readingTime} {isEn ? 'min' : '分钟'}
            </span>
          </div>
        </div>

        <div>
          <Link href={`/${lang}/blog/${post.slug}`}>
            <h3 className="text-lg sm:text-xl font-serif font-medium text-[#171717] group-hover:text-black leading-snug tracking-tight">
              {post.title}
            </h3>
          </Link>
          <p className="mt-2 text-xs sm:text-sm text-[#52525B] leading-relaxed line-clamp-3">
            {post.description}
          </p>
        </div>
      </div>

      <div className="pt-6 mt-4 border-t border-[#F4F4F5] flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5 max-w-[70%]">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] text-[#71717A] bg-[#FAFAFA] border border-[#E4E4E7] px-2 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>

        <Link
          href={`/${lang}/blog/${post.slug}`}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#171717] hover:underline underline-offset-4 group-hover:translate-x-0.5 transition-transform"
        >
          <span>{isEn ? 'Read' : '阅读'}</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </article>
  );
}
