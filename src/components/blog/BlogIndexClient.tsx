'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Sparkles, Search } from 'lucide-react';
import { BlogPost } from '@/types/blog';
import { BLOG_CATEGORIES } from '@/lib/blog/posts';
import { BlogCard } from './BlogCard';
import { TarotHandbook } from '@/components/tarot/TarotHandbook';

interface BlogIndexClientProps {
  posts: BlogPost[];
  lang: 'zh' | 'en';
}

export function BlogIndexClient({ posts, lang }: BlogIndexClientProps) {
  const isEn = lang === 'en';
  const [activeTab, setActiveTab] = useState<'articles' | 'handbook'>('articles');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const featuredPost = posts.find((p) => p.featured) || posts[0];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

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
          {featuredPost && selectedCategory === 'all' && searchQuery.trim() === '' && (
            <div className="p-6 sm:p-10 rounded-2xl border border-[#E4E4E7] bg-radial from-[#FAFAFA] to-[#FFFFFF] relative overflow-hidden shadow-xs hover:border-[#171717] transition-colors">
              <div className="max-w-3xl space-y-4">
                <div className="flex items-center gap-2 text-xs text-[#71717A]">
                  <span className="bg-[#171717] text-white text-[10px] uppercase font-mono px-2 py-0.5 rounded font-medium">
                    {isEn ? 'Featured' : '头条精选'}
                  </span>
                  <span>•</span>
                  <span className="font-mono text-[11px]">{featuredPost.publishedAt}</span>
                  <span>•</span>
                  <span className="font-mono text-[11px]">{featuredPost.readingTime} {isEn ? 'min read' : '分钟阅读'}</span>
                </div>

                <Link href={`/${lang}/blog/${featuredPost.slug}`}>
                  <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#171717] leading-tight tracking-tight hover:text-black">
                    {featuredPost.title}
                  </h2>
                </Link>

                {featuredPost.subtitle && (
                  <p className="text-sm font-serif italic text-[#52525B]">
                    {featuredPost.subtitle}
                  </p>
                )}

                <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed line-clamp-3">
                  {featuredPost.description}
                </p>

                <div className="pt-2 flex items-center gap-4">
                  <Link
                    href={`/${lang}/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#171717] text-white text-xs sm:text-sm font-medium hover:bg-black transition-colors"
                  >
                    <span>{isEn ? 'Read Article' : '阅读完整解析'}</span>
                    <ArrowRight size={14} />
                  </Link>
                  <span className="text-xs text-[#71717A]">
                    {isEn ? 'By' : '作者：'}{featuredPost.author.name}
                  </span>
                </div>
              </div>
            </div>
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

          {/* Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} lang={lang} />
              ))}
            </div>
          ) : (
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
