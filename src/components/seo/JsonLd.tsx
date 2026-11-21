import React from 'react';

interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

/**
 * 搜索引擎结构化数据组件 (Schema.org JSON-LD)
 * 安全注入规范的 JSON-LD 数据，辅助 Google/百度等搜索引擎生成富媒体摘要 (Rich Snippets)
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c')
      }}
    />
  );
}
