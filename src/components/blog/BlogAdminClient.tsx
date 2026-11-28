'use client';

import React, { useMemo, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FilePlus2,
  FileText,
  GitPullRequest,
  ImagePlus,
  Loader2,
  Lock
} from 'lucide-react';
import { CONTAINER, NAV_OFFSET } from '@/components/site/constants';
import type { AdminBlogPostSummary } from '@/lib/blog/admin-posts';
import {
  BlogLang,
  buildNewPostTemplate,
  MAX_MARKDOWN_BYTES,
  normalizeLineEndings,
  RECOMMENDED_COVER_HEIGHT,
  RECOMMENDED_COVER_KB,
  RECOMMENDED_COVER_WIDTH,
  upsertCoverImageInFrontmatter
} from '@/lib/blog/admin-editor';
import {
  publishBlogPrAction,
  renderBlogPreviewAction,
  type RenderPreviewResult,
  uploadBlogCoverAction
} from '@/app/[lang]/admin/blog/actions';

interface BlogAdminClientProps {
  lang: BlogLang;
  adminEmail?: string;
  posts: AdminBlogPostSummary[];
  githubConfigured: boolean;
}

function extractSlugFromRaw(raw: string): string {
  const match = raw.match(/^\s*slug\s*:\s*["']?([a-z0-9-]+)["']?\s*$/m);
  return match ? match[1] : 'draft';
}

export function BlogAdminClient({
  lang,
  adminEmail,
  posts,
  githubConfigured
}: BlogAdminClientProps) {
  const isEn = lang === 'en';
  const initialPost = posts[0] ?? null;

  const [mode, setMode] = useState<'create' | 'edit'>(initialPost ? 'edit' : 'create');
  const [originalLang, setOriginalLang] = useState<BlogLang>(lang);
  const [originalSlug, setOriginalSlug] = useState<string>(initialPost?.slug ?? '');
  const [originalRevisionHash, setOriginalRevisionHash] = useState<string>(
    initialPost?.revisionHash ?? ''
  );
  const [rawMarkdown, setRawMarkdown] = useState<string>(
    initialPost?.rawMarkdown ?? buildNewPostTemplate(lang)
  );
  const [listFilter, setListFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const [previewState, setPreviewState] = useState<RenderPreviewResult | null>(null);
  const [prStatus, setPrStatus] = useState<{
    type: 'success' | 'error';
    message: string;
    prUrl?: string;
    branchName?: string;
  } | null>(null);
  const [coverStatus, setCoverStatus] = useState<{
    type: 'success' | 'error';
    message: string;
    url?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isPreviewPending, startPreviewTransition] = useTransition();
  const [isUploadPending, startUploadTransition] = useTransition();
  const [isPublishPending, startPublishTransition] = useTransition();
  const isBusy = isPreviewPending || isUploadPending || isPublishPending;

  const byteCount = useMemo(
    () => new TextEncoder().encode(normalizeLineEndings(rawMarkdown)).length,
    [rawMarkdown]
  );

  const filteredPosts = useMemo(() => {
    const q = listFilter.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [posts, listFilter]);

  const handleSelectPost = (post: AdminBlogPostSummary) => {
    if (isBusy) return;
    setMode('edit');
    setOriginalLang(post.lang);
    setOriginalSlug(post.slug);
    setOriginalRevisionHash(post.revisionHash);
    setRawMarkdown(post.rawMarkdown);
    setPreviewState(null);
    setPrStatus(null);
    setCoverStatus(null);
    setActiveTab('editor');
  };

  const handleNewTemplate = () => {
    if (isBusy) return;
    setMode('create');
    setOriginalLang(lang);
    setOriginalSlug('');
    setOriginalRevisionHash('');
    setRawMarkdown(buildNewPostTemplate(lang));
    setPreviewState(null);
    setPrStatus(null);
    setCoverStatus(null);
    setActiveTab('editor');
  };

  const handlePreview = () => {
    setPrStatus(null);
    startPreviewTransition(async () => {
      const res = await renderBlogPreviewAction({
        lang,
        mode,
        rawMarkdown,
        originalLang: mode === 'edit' ? originalLang : undefined,
        originalSlug: mode === 'edit' ? originalSlug : undefined
      });
      setPreviewState(res);
      if (res.ok) {
        setActiveTab('preview');
      }
    });
  };

  const handleUploadCover = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setCoverStatus({
        type: 'error',
        message: isEn ? 'Choose a .webp file first.' : '请先选择一张 .webp 封面图片。'
      });
      return;
    }

    const formData = new FormData();
    formData.set('lang', lang);
    formData.set('slug', mode === 'edit' ? originalSlug : extractSlugFromRaw(rawMarkdown));
    formData.set('file', file);

    setCoverStatus(null);
    startUploadTransition(async () => {
      const res = await uploadBlogCoverAction(formData);
      if (!res.ok || !res.url) {
        setCoverStatus({
          type: 'error',
          message: res.error || (isEn ? 'Cover upload failed.' : '封面上传失败。')
        });
        return;
      }

      setRawMarkdown((prev) => upsertCoverImageInFrontmatter(prev, res.url!));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setCoverStatus({
        type: 'success',
        url: res.url,
        message: isEn
          ? `Uploaded ${res.width}×${res.height} WebP (${Math.ceil((res.sizeBytes ?? 0) / 1024)} KiB) and updated coverImage.`
          : `已上传 ${res.width}×${res.height} WebP（${Math.ceil((res.sizeBytes ?? 0) / 1024)} KiB）并写入 coverImage。`
      });
    });
  };

  const handlePublishPr = () => {
    setPrStatus(null);
    startPublishTransition(async () => {
      const res = await publishBlogPrAction({
        lang,
        mode,
        rawMarkdown,
        originalLang: mode === 'edit' ? originalLang : undefined,
        originalSlug: mode === 'edit' ? originalSlug : undefined,
        originalRevisionHash: mode === 'edit' ? originalRevisionHash : undefined
      });

      if (res.ok) {
        setPrStatus({
          type: 'success',
          prUrl: res.prUrl,
          branchName: res.branchName,
          message: res.reusedExistingPr
            ? isEn
              ? `Existing review PR #${res.prNumber} is ready on branch ${res.branchName}.`
              : `已复用分支 ${res.branchName} 上的审稿 PR #${res.prNumber}。`
            : isEn
              ? `Opened review PR #${res.prNumber} against main.`
              : `已针对 main 分支创建审稿 PR #${res.prNumber}。`
        });
      } else {
        setPrStatus({
          type: 'error',
          message: res.message
        });
      }
    });
  };

  const handleDownloadMarkdown = () => {
    const slug = mode === 'edit' ? originalSlug : extractSlugFromRaw(rawMarkdown);
    const filename = `${slug || 'article'}.md`;
    const normalized = normalizeLineEndings(rawMarkdown);
    const blob = new Blob([normalized], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(normalizeLineEndings(rawMarkdown));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback ignored if clipboard permission denied
    }
  };

  const otherLang = lang === 'en' ? 'zh' : 'en';
  const focusRing =
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]';

  return (
    <div className={`${NAV_OFFSET} min-h-screen bg-white text-[#171717]`}>
      <div className={`${CONTAINER} py-8 sm:py-12 space-y-8`}>
        {/* Header */}
        <header className="flex flex-col gap-4 border-b border-[#E4E4E7] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E4E4E7] bg-[#F5F5F6] px-3 py-1 text-xs font-mono text-[#52525B]">
              <span>{isEn ? 'ADMIN / BLOG' : '后台 / 博客管理'}</span>
              {adminEmail ? <span>· {adminEmail}</span> : null}
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#171717]">
              {isEn ? 'Bilingual Blog Studio' : '双语博客审稿工作台'}
            </h1>
            <p className="text-sm text-[#52525B] max-w-2xl">
              {isEn
                ? 'Edit raw Markdown with frontmatter, upload 16:9 WebP covers, preview output, and open a GitHub PR against main.'
                : '编辑含 Frontmatter 的原生 Markdown、上传 16:9 WebP 封面、实时服务端预览，并向 main 分支发起审稿 PR。'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/${otherLang}/admin/blog`}
              className={`inline-flex min-h-[44px] items-center justify-center rounded-lg border border-[#E4E4E7] bg-white px-4 text-xs font-medium text-[#171717] transition-colors hover:border-[#171717] ${focusRing}`}
            >
              {isEn ? 'Switch to 中文后台' : 'Switch to English Admin'}
            </Link>
            <Link
              href={`/${lang}/blog`}
              className={`inline-flex min-h-[44px] items-center justify-center rounded-lg border border-[#E4E4E7] bg-white px-4 text-xs font-medium text-[#52525B] transition-colors hover:text-[#171717] ${focusRing}`}
            >
              {isEn ? 'Public Blog' : '公开博客'}
            </Link>
            <button
              type="button"
              onClick={handleNewTemplate}
              disabled={isBusy}
              className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#171717] px-4 text-xs font-medium text-white transition-opacity hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed ${focusRing}`}
            >
              <FilePlus2 size={15} />
              <span>{isEn ? 'New Post Template' : '新建文章模板'}</span>
            </button>
          </div>
        </header>

        {!githubConfigured && (
          <div
            role="status"
            className="rounded-xl border border-[#E4E4E7] bg-[#F5F5F6] p-4 text-xs sm:text-sm text-[#52525B]"
          >
            {isEn
              ? 'GitHub PR publishing is currently unconfigured on this server (YITATRO_BLOG_GITHUB_TOKEN missing). You can still edit, preview, upload covers, and export .md files.'
              : '当前服务端未配置 GitHub 审稿发布令牌（缺少 YITATRO_BLOG_GITHUB_TOKEN）。你仍可编辑、预览、上传封面并导出 .md 文件。'}
          </div>
        )}

        {/* Main 2-column grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          {/* Sidebar: Localized post list */}
          <aside className="lg:col-span-4 space-y-4 rounded-xl border border-[#E4E4E7] bg-white p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-serif text-base font-medium text-[#171717]">
                {isEn ? `Published (${lang.toUpperCase()})` : `已发布文章（${lang.toUpperCase()}）`}
              </h2>
              <span className="font-mono text-xs text-[#52525B]">{posts.length}</span>
            </div>

            <div>
              <label htmlFor="admin-post-filter" className="sr-only">
                {isEn ? 'Filter posts' : '筛选文章'}
              </label>
              <input
                id="admin-post-filter"
                type="search"
                value={listFilter}
                onChange={(e) => setListFilter(e.target.value)}
                placeholder={isEn ? 'Filter by title, slug, category…' : '按标题、slug 或分类筛选…'}
                className={`min-h-[44px] w-full rounded-lg border border-[#8A8A91] bg-white px-3 text-sm text-[#171717] placeholder:text-[#8A8A91] ${focusRing}`}
              />
            </div>

            <ul className="divide-y divide-[#E4E4E7] max-h-[420px] overflow-y-auto" aria-label={isEn ? 'Localized blog posts' : '当前语言博客列表'}>
              {filteredPosts.length === 0 ? (
                <li className="py-6 text-center text-xs text-[#52525B]">
                  {isEn ? 'No matching posts.' : '暂无匹配文章。'}
                </li>
              ) : (
                filteredPosts.map((post) => {
                  const isSelected = mode === 'edit' && originalSlug === post.slug;
                  return (
                    <li key={post.slug} className="py-1.5">
                      <button
                        type="button"
                        onClick={() => handleSelectPost(post)}
                        disabled={isBusy}
                        className={`w-full min-h-[44px] rounded-lg px-3 py-2.5 text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          isSelected
                            ? 'bg-[#F5F5F6] border border-[#171717]'
                            : 'hover:bg-[#F5F5F6] border border-transparent'
                        } ${focusRing}`}
                      >
                        <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-[#52525B]">
                          <span>{post.category}</span>
                          <span>{post.publishedAt || '—'}</span>
                        </div>
                        <p className="mt-1 text-sm font-medium text-[#171717] line-clamp-2">
                          {post.title}
                        </p>
                        <p className="mt-0.5 font-mono text-[11px] text-[#52525B] truncate">
                          {post.slug}.md
                        </p>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>

            {/* Cover Upload Panel */}
            <form
              onSubmit={handleUploadCover}
              className="border-t border-[#E4E4E7] pt-4 space-y-3"
            >
              <div className="flex items-center gap-2">
                <ImagePlus size={16} className="text-[#171717]" />
                <h3 className="font-serif text-sm font-medium text-[#171717]">
                  {isEn ? 'WebP Cover Upload' : 'WebP 封面上传'}
                </h3>
              </div>
              <p className="text-xs leading-relaxed text-[#52525B]">
                {isEn
                  ? `Recommended: ${RECOMMENDED_COVER_WIDTH}×${RECOMMENDED_COVER_HEIGHT} (16:9), ~${RECOMMENDED_COVER_KB} KB (max 512 KiB). Missing cover is valid.`
                  : `推荐规格：${RECOMMENDED_COVER_WIDTH}×${RECOMMENDED_COVER_HEIGHT}（16:9 横版），约 ${RECOMMENDED_COVER_KB} KB（上限 512 KiB）。无封面亦可发布。`}
              </p>

              <div>
                <label htmlFor="cover-webp-input" className="sr-only">
                  {isEn ? 'Select WebP cover image' : '选择 WebP 封面图片'}
                </label>
                <input
                  ref={fileInputRef}
                  id="cover-webp-input"
                  type="file"
                  accept="image/webp,.webp"
                  className={`block w-full text-xs text-[#52525B] file:mr-3 file:min-h-[40px] file:rounded-lg file:border file:border-[#E4E4E7] file:bg-[#F5F5F6] file:px-3 file:text-xs file:font-medium file:text-[#171717] hover:file:border-[#171717] ${focusRing}`}
                />
              </div>

              <button
                type="submit"
                disabled={isUploadPending}
                className={`inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-[#171717] bg-white px-4 text-xs font-medium text-[#171717] transition-colors hover:bg-[#F5F5F6] disabled:opacity-50 ${focusRing}`}
              >
                {isUploadPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <ImagePlus size={14} />
                )}
                <span>{isEn ? 'Upload WebP & Set coverImage' : '上传 WebP 并填入 coverImage'}</span>
              </button>

              {coverStatus && (
                <p
                  role={coverStatus.type === 'error' ? 'alert' : 'status'}
                  className={`text-xs leading-relaxed break-all ${
                    coverStatus.type === 'error' ? 'text-[#B84034]' : 'text-[#171717]'
                  }`}
                >
                  {coverStatus.message}
                </p>
              )}
            </form>
          </aside>

          {/* Main Editor + Preview Workspace */}
          <section className="lg:col-span-8 space-y-4">
            {/* Status & Mode Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E4E4E7] bg-[#F5F5F6] px-4 py-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {mode === 'edit' ? (
                  <>
                    <span className="inline-flex items-center gap-1 rounded bg-[#171717] px-2 py-0.5 font-mono text-[11px] text-white">
                      <Lock size={11} />
                      {isEn ? 'EDIT' : '编辑'}
                    </span>
                    <span className="font-mono text-[#171717]">
                      src/content/blog/{originalLang}/{originalSlug}.md
                    </span>
                  </>
                ) : (
                  <>
                    <span className="inline-flex items-center gap-1 rounded border border-[#171717] bg-white px-2 py-0.5 font-mono text-[11px] text-[#171717]">
                      {isEn ? 'CREATE' : '新建'}
                    </span>
                    <span className="text-[#52525B]">
                      {isEn
                        ? `Target: src/content/blog/${lang}/<slug>.md`
                        : `目标路径：src/content/blog/${lang}/<slug>.md`}
                    </span>
                  </>
                )}
              </div>

              <span className="font-mono text-xs text-[#52525B]">
                {byteCount.toLocaleString()} / {MAX_MARKDOWN_BYTES.toLocaleString()} B
              </span>
            </div>

            {/* Editor / Preview Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div
                role="tablist"
                aria-label={isEn ? 'Workspace view' : '工作区视图'}
                className="inline-flex rounded-lg border border-[#E4E4E7] bg-[#F5F5F6] p-1"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'editor'}
                  onClick={() => setActiveTab('editor')}
                  className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-md px-4 text-xs font-medium transition-colors ${
                    activeTab === 'editor'
                      ? 'bg-[#171717] text-white'
                      : 'text-[#52525B] hover:text-[#171717]'
                  } ${focusRing}`}
                >
                  <FileText size={14} />
                  <span>{isEn ? 'Raw Markdown' : 'Markdown 源码'}</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'preview'}
                  onClick={handlePreview}
                  disabled={isPreviewPending}
                  className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-md px-4 text-xs font-medium transition-colors ${
                    activeTab === 'preview'
                      ? 'bg-[#171717] text-white'
                      : 'text-[#52525B] hover:text-[#171717]'
                  } ${focusRing}`}
                >
                  {isPreviewPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Eye size={14} />
                  )}
                  <span>{isEn ? 'Server Preview' : '服务端预览'}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyMarkdown}
                  className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-[#E4E4E7] bg-white px-3.5 text-xs font-medium text-[#171717] transition-colors hover:border-[#171717] ${focusRing}`}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? (isEn ? 'Copied' : '已复制') : isEn ? 'Copy' : '复制'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadMarkdown}
                  className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-[#E4E4E7] bg-white px-3.5 text-xs font-medium text-[#171717] transition-colors hover:border-[#171717] ${focusRing}`}
                >
                  <Download size={14} />
                  <span>{isEn ? 'Export .md' : '导出 .md'}</span>
                </button>
                <button
                  type="button"
                  onClick={handlePublishPr}
                  disabled={isPublishPending}
                  className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-[#171717] px-4 text-xs font-medium text-white transition-opacity hover:opacity-85 disabled:opacity-50 ${focusRing}`}
                >
                  {isPublishPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <GitPullRequest size={14} />
                  )}
                  <span>{isEn ? 'Open Review PR' : '提交审稿 PR'}</span>
                </button>
              </div>
            </div>

            {/* Validation Errors */}
            {previewState && !previewState.ok && previewState.errors && (
              <div
                role="alert"
                className="rounded-xl border border-[#B84034] bg-white p-4 space-y-1.5"
              >
                <p className="text-xs font-semibold text-[#B84034]">
                  {isEn ? 'Validation Issues' : '校验未通过'}
                </p>
                <ul className="list-disc pl-5 text-xs text-[#B84034] space-y-1">
                  {previewState.errors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* PR Result Banner */}
            {prStatus && (
              <div
                role={prStatus.type === 'error' ? 'alert' : 'status'}
                className={`rounded-xl border p-4 text-xs sm:text-sm space-y-2 ${
                  prStatus.type === 'error'
                    ? 'border-[#B84034] bg-white text-[#B84034]'
                    : 'border-[#171717] bg-[#F5F5F6] text-[#171717]'
                }`}
              >
                <p>{prStatus.message}</p>
                {prStatus.prUrl && (
                  <a
                    href={prStatus.prUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 font-mono text-xs underline underline-offset-4 hover:opacity-80 ${focusRing}`}
                  >
                    <span>{prStatus.prUrl}</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            )}

            {/* Editor or Preview Panel */}
            {activeTab === 'editor' ? (
              <div className="space-y-2">
                <label htmlFor="blog-raw-markdown" className="sr-only">
                  {isEn ? 'Raw Markdown with Frontmatter' : '含 Frontmatter 的 Markdown 源码'}
                </label>
                <textarea
                  id="blog-raw-markdown"
                  value={rawMarkdown}
                  onChange={(e) => setRawMarkdown(e.target.value)}
                  spellCheck={false}
                  rows={26}
                  className={`w-full rounded-xl border border-[#8A8A91] bg-white p-4 font-mono text-xs sm:text-[13px] leading-relaxed text-[#171717] ${focusRing}`}
                />
              </div>
            ) : (
              <div className="rounded-xl border border-[#E4E4E7] bg-white p-6 sm:p-8 space-y-6">
                {previewState?.ok && previewState.preview ? (
                  <>
                    <div className="border-b border-[#E4E4E7] pb-5 space-y-2">
                      <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#52525B]">
                        <span>{previewState.preview.category}</span>
                        <span>·</span>
                        <span>{previewState.preview.publishedAt}</span>
                        <span>·</span>
                        <span>{previewState.preview.slug}</span>
                      </div>
                      <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#171717]">
                        {previewState.preview.title}
                      </h2>
                      {previewState.preview.subtitle && (
                        <p className="font-serif italic text-base text-[#52525B]">
                          {previewState.preview.subtitle}
                        </p>
                      )}
                      <p className="text-sm text-[#52525B] pt-1">
                        {previewState.preview.description}
                      </p>
                    </div>

                    {previewState.preview.coverImage && (
                      <div className="overflow-hidden rounded-xl border border-[#E4E4E7] bg-[#F5F5F6]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={previewState.preview.coverImage}
                          alt={previewState.preview.title}
                          className="aspect-[16/9] w-full object-contain"
                        />
                      </div>
                    )}

                    <article
                      className="prose-container"
                      dangerouslySetInnerHTML={{ __html: previewState.preview.html }}
                    />
                  </>
                ) : (
                  <p className="text-sm text-[#52525B]">
                    {isEn
                      ? 'Click "Server Preview" to validate and render the current Markdown.'
                      : '点击「服务端预览」以校验并渲染当前 Markdown。'}
                  </p>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
