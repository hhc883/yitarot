'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, Clock, Search, Sparkles } from 'lucide-react';
import { BlogPost } from '@/types/blog';
import { BLOG_CATEGORIES } from '@/lib/blog/categories';
import { TarotHandbook } from '@/components/tarot/TarotHandbook';

interface BlogIndexClientProps {
  posts: BlogPost[];
  lang: 'zh' | 'en';
}

function getCategoryLabel(categoryId: string, isEn: boolean): string {
  const categoryMeta = BLOG_CATEGORIES.find((c) => c.id === categoryId);
  return categoryMeta
    ? isEn
      ? categoryMeta.nameEn
      : categoryMeta.nameZh
    : categoryId;
}

export function BlogIndexClient({ posts, lang }: BlogIndexClientProps) {
  const isEn = lang === 'en';
  const [activeTab, setActiveTab] = useState<'articles' | 'handbook'>('articles');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [failedFeaturedSrc, setFailedFeaturedSrc] = useState<string | null>(null);
  const featuredImgRef = useRef<HTMLImageElement | null>(null);

  const featuredCandidate = posts.find(
    (p) => Boolean(p.featured) && Boolean(p.coverImage?.trim())
  );
  const featuredCoverSrc = featuredCandidate?.coverImage?.trim() || '';
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const isDefaultUnfilteredView =
    activeTab === 'articles' &&
    selectedCategory === 'all' &&
    normalizedSearchQuery === '';

  const activeFeaturedPost =
    isDefaultUnfilteredView &&
    featuredCandidate &&
    featuredCoverSrc &&
    failedFeaturedSrc !== featuredCoverSrc
      ? featuredCandidate
      : null;

  useEffect(() => {
    const img = featuredImgRef.current;
    if (!activeFeaturedPost || !featuredCoverSrc || !img) {
      return;
    }
    if (img.complete && img.naturalWidth === 0) {
      const frameId = window.requestAnimationFrame(() => {
        setFailedFeaturedSrc(featuredCoverSrc);
      });
      return () => window.cancelAnimationFrame(frameId);
    }
  }, [activeFeaturedPost, featuredCoverSrc]);

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch =
      normalizedSearchQuery === '' ||
      post.title.toLowerCase().includes(normalizedSearchQuery) ||
      post.description.toLowerCase().includes(normalizedSearchQuery) ||
      post.tags.some((t) => t.toLowerCase().includes(normalizedSearchQuery));

    return matchesCategory && matchesSearch;
  });

  const archivePosts = activeFeaturedPost
    ? filteredPosts.filter((post) => post.id !== activeFeaturedPost.id)
    : filteredPosts;

  return (
    <div className="space-y-10">
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#E4E4E7]">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F4F4F5] text-[#52525B] text-xs font-mono font-medium">
            <Sparkles size={12} className="text-[#171717]" />
            <span>{isEn ? 'YiTatro Knowledge & Practice' : '周易与塔罗研习日志'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-medium text-[#171717] tracking-tight">
            {isEn ? 'Metaphysical Insights & Guides' : '研习洞察与心学指南'}
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] max-w-2xl leading-relaxed">
            {isEn
              ? 'Deep dives into tarot archetypes, BaZi elemental mechanics, Jungian synchronicity, and real-world reflective case studies.'
              : '涵盖78张塔罗原型深度剖析、四柱八字五行生克、荣格共时性心理学与真实推演复盘，将古老数术转化为清醒的自我赋权工具。'}
          </p>
        </div>

        {/* View Mode Switcher (Articles vs Handbook) */}
        <div className="flex items-center gap-1 bg-[#F4F4F5] p-1 rounded-lg self-start sm:self-end border border-[#E4E4E7]">
          <button
            type="button"
            onClick={() => setActiveTab('articles')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'articles'
                ? 'bg-[#FFFFFF] text-[#171717] shadow-xs'
                : 'text-[#71717A] hover:text-[#171717]'
            }`}
          >
            {isEn ? 'Articles' : '精选文章'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('handbook')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'handbook'
                ? 'bg-[#FFFFFF] text-[#171717] shadow-xs'
                : 'text-[#71717A] hover:text-[#171717]'
            }`}
          >
            <BookOpen size={13} />
            <span>{isEn ? 'Beginner Handbook' : '心法手册'}</span>
          </button>
        </div>
      </div>

      {/* Mode A: Articles Mode */}
      {activeTab === 'articles' && (
        <div className="space-y-10">
          {/* Featured Post Hero */}
          {activeFeaturedPost && (
            <article className="pb-10 border-b border-[#E4E4E7] space-y-5">
              <Link
                href={`/${lang}/blog/${activeFeaturedPost.slug}`}
                className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#171717] rounded-xl"
              >
                <figure className="w-full aspect-[16/9] overflow-hidden rounded-xl border border-[#E4E4E7] bg-[#FAFAFA]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={featuredImgRef}
                    src={featuredCoverSrc}
                    alt={activeFeaturedPost.title}
                    className="w-full h-full object-contain"
                    loading="eager"
                    decoding="async"
                    onError={() => setFailedFeaturedSrc(featuredCoverSrc)}
                  />
                </figure>
              </Link>

              <div className="max-w-3xl space-y-3">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#71717A] min-w-0">
                  <span className="bg-[#171717] text-white text-[10px] uppercase font-mono px-2 py-0.5 rounded font-medium">
                    {isEn ? 'Featured' : '头条精选'}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#171717] font-medium bg-[#F4F4F5] px-2 py-0.5 rounded max-w-full truncate">
                    {getCategoryLabel(activeFeaturedPost.category, isEn)}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] whitespace-nowrap">
                    <Calendar size={12} aria-hidden="true" />
                    {activeFeaturedPost.publishedAt}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] whitespace-nowrap">
                    <Clock size={12} aria-hidden="true" />
                    {activeFeaturedPost.readingTime} {isEn ? 'min read' : '分钟阅读'}
                  </span>
                </div>

                <Link
                  href={`/${lang}/blog/${activeFeaturedPost.slug}`}
                  className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#171717]"
                >
                  <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#171717] leading-tight tracking-tight group-hover:underline underline-offset-4 decoration-[#171717]/40 break-words">
                    {activeFeaturedPost.title}
                  </h2>
                </Link>

                {activeFeaturedPost.subtitle && (
                  <p className="text-sm font-serif italic text-[#52525B] break-words">
                    {activeFeaturedPost.subtitle}
                  </p>
                )}

                <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed line-clamp-3 break-words">
                  {activeFeaturedPost.description}
                </p>

                <p className="text-xs text-[#71717A] pt-1">
                  {isEn ? 'By ' : '作者：'}
                  {activeFeaturedPost.author.name}
                </p>
              </div>
            </article>
          )}

          {/* Filter Bar & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                  selectedCategory === 'all'
                    ? 'bg-[#171717] text-white border-[#171717]'
                    : 'bg-[#FFFFFF] text-[#52525B] border-[#E4E4E7] hover:border-[#171717] hover:text-[#171717]'
                }`}
              >
                {isEn ? 'All Topics' : '全部板块'}
              </button>
              {BLOG_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                    selectedCategory === cat.id
                      ? 'bg-[#171717] text-white border-[#171717]'
                      : 'bg-[#FFFFFF] text-[#52525B] border-[#E4E4E7] hover:border-[#171717] hover:text-[#171717]'
                  }`}
                >
                  {isEn ? cat.nameEn : cat.nameZh}
                </button>
              ))}
            </div>

            {/* Keyword Search Input */}
            <div className="relative w-full md:w-64">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]"
              />
              <input
                type="text"
                placeholder={isEn ? 'Search articles or tags...' : '搜索文章、标签或关键词...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FFFFFF] border border-[#E4E4E7] rounded-lg focus:outline-hidden focus:border-[#171717] text-[#171717] placeholder:text-[#A1A1AA]"
              />
            </div>
          </div>

          {/* Archive List */}
          {archivePosts.length > 0 ? (
            <div className="divide-y divide-[#E4E4E7] border-t border-b border-[#E4E4E7]">
              {archivePosts.map((post) => (
                <article key={post.id} className="py-6 sm:py-7">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#71717A] min-w-0">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[#171717] font-medium bg-[#F4F4F5] px-2 py-0.5 rounded max-w-full truncate">
                      {getCategoryLabel(post.category, isEn)}
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] whitespace-nowrap">
                      <Calendar size={12} aria-hidden="true" />
                      {post.publishedAt}
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] whitespace-nowrap">
                      <Clock size={12} aria-hidden="true" />
                      {post.readingTime} {isEn ? 'min' : '分钟'}
                    </span>
                  </div>

                  <Link
                    href={`/${lang}/blog/${post.slug}`}
                    className="group block mt-2.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#171717]"
                  >
                    <h2 className="text-lg sm:text-xl font-serif font-medium text-[#171717] group-hover:underline underline-offset-4 decoration-[#171717]/40 leading-snug tracking-tight break-words">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="mt-2 text-xs sm:text-sm text-[#52525B] leading-relaxed line-clamp-2 sm:line-clamp-3 max-w-3xl break-words">
                    {post.description}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            filteredPosts.length === 0 && (
              <div className="py-16 text-center border border-dashed border-[#E4E4E7] rounded-xl space-y-2">
                <p className="text-sm font-serif text-[#171717]">
                  {isEn ? 'No matching articles found' : '未找到相关研习文章'}
                </p>
                <p className="text-xs text-[#71717A]">
                  {isEn
                    ? 'Try searching with different keywords or switch categories.'
                    : '请尝试更换关键词，或切换至「全部板块」浏览。'}
                </p>
              </div>
            )
          )}
        </div>
      )}

      {/* Mode B: Handbook Mode */}
      {activeTab === 'handbook' && (
        <div className="pt-2">
          <TarotHandbook lang={lang} />
        </div>
      )}
    </div>
  );
}
