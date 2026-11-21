'use client';

import React, { useEffect, useState } from 'react';
import { TocItem } from '@/types/blog';

interface BlogTocProps {
  items: TocItem[];
  lang: 'zh' | 'en';
}

export function BlogToc({ items, lang }: BlogTocProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (items.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140; // Offset for header
      let currentId = items[0].id;

      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= scrollPosition) {
          currentId = item.id;
        }
      }

      setActiveId(currentId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="sticky top-28 bg-[#FFFFFF] border border-[#E4E4E7] rounded-lg p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#F4F4F5]">
        <h4 className="text-xs font-serif font-medium uppercase tracking-widest text-[#171717]">
          {lang === 'en' ? 'Table of Contents' : '文章目录'}
        </h4>
        <span className="text-[10px] text-[#71717A] font-mono">
          {items.length} {lang === 'en' ? 'sections' : '小节'}
        </span>
      </div>

      <ul className="space-y-2 text-xs leading-normal">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li
              key={item.id}
              className={`${item.level === 3 ? 'pl-3' : 'pl-0'}`}
            >
              <a
                href={`#${item.id}`}
                className={`block py-1 transition-colors duration-150 line-clamp-1 ${
                  isActive
                    ? 'font-medium text-[#171717] border-l-2 border-[#171717] -ml-2 pl-2'
                    : 'text-[#71717A] hover:text-[#171717]'
                }`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
