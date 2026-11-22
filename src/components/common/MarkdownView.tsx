'use client';

import React, { useMemo } from 'react';

interface MarkdownViewProps {
  content: string;
  className?: string;
}

/**
 * 针对流式打字与 AI 解读设计的纯净 Markdown 渲染器。
 * 1. 彻底消除裸露的 ###、**、*、> 等原生字符，转化为符合 YiTarot 黑白艺术调性的精美排版；
 * 2. 自动容错流式传输中的未闭合标签（如打字机中途截断的 **加粗文本）；
 * 3. 严格转义 HTML 原生标签，防止 XSS 注入。
 */
export function MarkdownView({ content, className = '' }: MarkdownViewProps) {
  const html = useMemo(() => {
    if (!content) return '';

    // 容错处理：若流式输出末尾包含单个未闭合的 **，自动补齐闭合以呈现平滑打字效果
    let safeContent = content;
    const asterisks = (safeContent.match(/\*\*/g) || []).length;
    if (asterisks % 2 !== 0) {
      safeContent += '**';
    }

    const lines = safeContent.split('\n');
    const res: string[] = [];
    let inUl = false;
    let inOl = false;

    const closeLists = () => {
      if (inUl) {
        res.push('</ul>');
        inUl = false;
      }
      if (inOl) {
        res.push('</ol>');
        inOl = false;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // 空行：重置列表并添加段落呼吸间隙
      if (!trimmed) {
        closeLists();
        continue;
      }

      // 分割线：--- 或 ***
      if (/^---$|^\*\*\*$/.test(trimmed)) {
        closeLists();
        res.push('<hr class="my-5 border-[#E4E4E7]" />');
        continue;
      }

      // H3 标题：### 标题 或 #### 标题
      if (/^###+\s+/.test(trimmed)) {
        closeLists();
        const text = trimmed.replace(/^###+\s+/, '');
        res.push(
          `<h4 class="font-serif font-bold text-[15px] sm:text-[16px] text-[#171717] mt-5 mb-2 tracking-tight">${formatInline(
            text
          )}</h4>`
        );
        continue;
      }

      // H2 标题：## 标题
      if (/^##\s+/.test(trimmed)) {
        closeLists();
        const text = trimmed.replace(/^##\s+/, '');
        res.push(
          `<h3 class="font-serif font-bold text-[17px] sm:text-[18px] text-[#171717] mt-6 mb-2.5 pb-1 border-b border-[#F4F4F5] tracking-tight">${formatInline(
            text
          )}</h3>`
        );
        continue;
      }

      // H1 标题：# 标题
      if (/^#\s+/.test(trimmed)) {
        closeLists();
        const text = trimmed.replace(/^#\s+/, '');
        res.push(
          `<h2 class="font-serif font-bold text-[19px] sm:text-[21px] text-[#171717] mt-7 mb-3 tracking-tight">${formatInline(
            text
          )}</h2>`
        );
        continue;
      }

      // 无序列表：- 项 或 * 项
      if (/^[-*]\s+/.test(trimmed)) {
        if (inOl) {
          res.push('</ol>');
          inOl = false;
        }
        if (!inUl) {
          res.push('<ul class="space-y-1.5 my-2.5 pl-4 list-disc marker:text-[#71717A]">');
          inUl = true;
        }
        const item = trimmed.replace(/^[-*]\s+/, '');
        res.push(`<li class="leading-relaxed text-[#171717]">${formatInline(item)}</li>`);
        continue;
      }

      // 有序列表：1. 项
      if (/^\d+\.\s+/.test(trimmed)) {
        if (inUl) {
          res.push('</ul>');
          inUl = false;
        }
        if (!inOl) {
          res.push('<ol class="space-y-1.5 my-2.5 pl-4 list-decimal marker:text-[#71717A]">');
          inOl = true;
        }
        const item = trimmed.replace(/^\d+\.\s+/, '');
        res.push(`<li class="leading-relaxed text-[#171717]">${formatInline(item)}</li>`);
        continue;
      }

      // 引用块：> 文本
      if (/^>\s+/.test(trimmed)) {
        closeLists();
        const quote = trimmed.replace(/^>\s+/, '');
        res.push(
          `<blockquote class="border-l-2 border-[#171717] pl-3.5 py-1.5 my-3 text-[#52525B] bg-[#F5F5F6]/70 rounded-r text-xs sm:text-[13px] leading-relaxed italic">${formatInline(
            quote
          )}</blockquote>`
        );
        continue;
      }

      // 普通段落
      closeLists();
      res.push(`<p class="leading-relaxed my-2.5 text-[#171717]">${formatInline(trimmed)}</p>`);
    }

    closeLists();
    return res.join('\n');
  }, [content]);

  return (
    <div
      className={`prose-reader ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/** 格式化行内元素：加粗、斜体、行内代码、转义 */
function formatInline(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-[#171717]">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em class="italic text-[#52525B]">$1</em>')
    .replace(
      /`([^`]+)`/g,
      '<code class="px-1.5 py-0.5 rounded text-[11.5px] font-mono bg-[#F5F5F6] text-[#171717] border border-[#E4E4E7]">$1</code>'
    );
}
