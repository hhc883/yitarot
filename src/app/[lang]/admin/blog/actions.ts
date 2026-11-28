'use server';

import crypto from 'node:crypto';
import { requireBlogAdmin } from '@/lib/blog/admin-auth';
import {
  BlogLang,
  isValidSlug,
  MAX_COVER_BYTES,
  validateBlogDocument,
  validateWebpCoverBuffer
} from '@/lib/blog/admin-validation';
import { publishBlogReviewPr, PublishBlogPrResult } from '@/lib/blog/github-publisher';
import { renderMarkdownToHtml } from '@/lib/blog/markdown';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';

function normalizeLang(raw: unknown): BlogLang {
  return raw === 'en' ? 'en' : 'zh';
}

export interface RenderPreviewResult {
  ok: boolean;
  errors?: string[];
  preview?: {
    title: string;
    subtitle?: string;
    description: string;
    category: string;
    publishedAt: string;
    coverImage?: string;
    tags: string[];
    slug: string;
    byteLength: number;
    html: string;
  };
}

export async function renderBlogPreviewAction(input: {
  lang: string;
  mode: 'create' | 'edit';
  rawMarkdown: string;
  originalLang?: string;
  originalSlug?: string;
}): Promise<RenderPreviewResult> {
  const lang = normalizeLang(input.lang);
  const isEn = lang === 'en';
  const auth = await requireBlogAdmin();
  if (!auth.ok) {
    return {
      ok: false,
      errors: [
        auth.reason === 'unauthenticated'
          ? isEn
            ? 'Authentication required.'
            : '请先登录后再操作。'
          : isEn
            ? 'You are not authorized to access blog admin.'
            : '当前账号无权访问博客后台。'
      ]
    };
  }

  const mode = input.mode === 'edit' ? 'edit' : 'create';
  const validation = validateBlogDocument({
    rawMarkdown: input.rawMarkdown,
    expectedLang: lang,
    mode,
    originalLang: input.originalLang ? normalizeLang(input.originalLang) : undefined,
    originalSlug: input.originalSlug
  });

  if (!validation.ok) {
    return { ok: false, errors: validation.errors };
  }

  const { data } = validation;
  const html = renderMarkdownToHtml(data.body);

  return {
    ok: true,
    preview: {
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      category: data.category,
      publishedAt: data.publishedAt,
      coverImage: data.coverImage,
      tags: data.tags,
      slug: data.slug,
      byteLength: data.byteLength,
      html
    }
  };
}

export interface UploadCoverResult {
  ok: boolean;
  url?: string;
  width?: number;
  height?: number;
  sizeBytes?: number;
  error?: string;
}

export async function uploadBlogCoverAction(formData: FormData): Promise<UploadCoverResult> {
  const lang = normalizeLang(formData.get('lang'));
  const isEn = lang === 'en';

  const auth = await requireBlogAdmin();
  if (!auth.ok) {
    return {
      ok: false,
      error:
        auth.reason === 'unauthenticated'
          ? isEn
            ? 'Authentication required.'
            : '请先登录后再上传封面。'
          : isEn
            ? 'You are not authorized to upload blog covers.'
            : '当前账号无权上传博客封面。'
    };
  }

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return {
      ok: false,
      error: isEn ? 'Please select a non-empty .webp file.' : '请选择有效的 .webp 封面图片。'
    };
  }

  if (file.size > MAX_COVER_BYTES) {
    return {
      ok: false,
      error: isEn
        ? `File exceeds 512 KiB limit (${Math.ceil(file.size / 1024)} KiB).`
        : `文件体积超出 512 KiB 上限（当前 ${Math.ceil(file.size / 1024)} KiB）。`
    };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const webpCheck = validateWebpCoverBuffer(buffer, lang);
  if (!webpCheck.ok) {
    return { ok: false, error: webpCheck.error };
  }

  const adminClient = getSupabaseAdminClient();
  if (!adminClient) {
    return {
      ok: false,
      error: isEn
        ? 'Supabase server storage client is not configured.'
        : '服务端 Supabase 存储客户端未配置。'
    };
  }

  const rawSlug = typeof formData.get('slug') === 'string' ? String(formData.get('slug')).trim() : '';
  const safeSlugPrefix = isValidSlug(rawSlug) ? rawSlug : 'draft';
  const objectPath = `covers/${lang}/${safeSlugPrefix}/${Date.now()}-${crypto.randomUUID()}.webp`;

  const { data: publicData } = adminClient.storage
    .from('blog-covers')
    .getPublicUrl(objectPath);

  const publicUrl = publicData?.publicUrl;
  let hasValidHttpsPublicUrl = false;
  if (publicUrl) {
    try {
      hasValidHttpsPublicUrl = new URL(publicUrl).protocol === 'https:';
    } catch {
      hasValidHttpsPublicUrl = false;
    }
  }

  if (!publicUrl || !hasValidHttpsPublicUrl) {
    return {
      ok: false,
      error: isEn
        ? 'Storage configuration could not derive a valid https:// public URL.'
        : '当前存储配置无法生成有效的 https:// 公开访问链接，已中止上传。'
    };
  }

  const { error: uploadError } = await adminClient.storage
    .from('blog-covers')
    .upload(objectPath, buffer, {
      contentType: 'image/webp',
      cacheControl: '31536000',
      upsert: false
    });

  if (uploadError) {
    return {
      ok: false,
      error: isEn
        ? 'Failed to upload cover to Supabase blog-covers bucket.'
        : '上传封面至 Supabase blog-covers 存储桶失败，请检查存储桶配置。'
    };
  }

  return {
    ok: true,
    url: publicUrl,
    width: webpCheck.width,
    height: webpCheck.height,
    sizeBytes: buffer.byteLength
  };
}

export async function publishBlogPrAction(input: {
  lang: string;
  mode: 'create' | 'edit';
  rawMarkdown: string;
  originalLang?: string;
  originalSlug?: string;
  originalRevisionHash?: string;
}): Promise<PublishBlogPrResult> {
  const lang = normalizeLang(input.lang);
  const isEn = lang === 'en';
  const auth = await requireBlogAdmin();
  if (!auth.ok) {
    return {
      ok: false,
      code: 'GITHUB_ERROR',
      message:
        auth.reason === 'unauthenticated'
          ? isEn
            ? 'Authentication required.'
            : '请先登录后再提交审稿 PR。'
          : isEn
            ? 'You are not authorized to publish blog PRs.'
            : '当前账号无权提交博客审稿 PR。'
    };
  }

  const mode = input.mode === 'edit' ? 'edit' : 'create';
  const validation = validateBlogDocument({
    rawMarkdown: input.rawMarkdown,
    expectedLang: lang,
    mode,
    originalLang: input.originalLang ? normalizeLang(input.originalLang) : undefined,
    originalSlug: input.originalSlug
  });

  if (!validation.ok) {
    return {
      ok: false,
      code: 'INVALID_CONFIG',
      message: validation.errors.join(' ')
    };
  }

  const { data } = validation;
  return publishBlogReviewPr({
    mode,
    lang: data.lang,
    slug: data.slug,
    title: data.title,
    normalizedMarkdown: data.normalizedRaw,
    revisionHash: data.revisionHash,
    originalRevisionHash: input.originalRevisionHash
  });
}
