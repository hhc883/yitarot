import React from 'react';
import { BlogAuthor } from '@/types/blog';
import { CheckCircle2 } from 'lucide-react';

interface BlogAuthorCardProps {
  author: BlogAuthor;
  lang: 'zh' | 'en';
}

export function BlogAuthorCard({ author, lang }: BlogAuthorCardProps) {
  const isEn = lang === 'en';
  const role = isEn ? author.roleEn : author.roleZh;
  const bio = isEn ? author.bioEn : author.bioZh;

  return (
    <div className="my-10 p-5 rounded-lg border border-[#E4E4E7] bg-[#FFFFFF] flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-[#171717] text-white flex items-center justify-center font-serif text-lg font-medium shrink-0">
        {author.name.charAt(0)}
      </div>

      <div className="space-y-1 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium text-[#171717]">{author.name}</span>
          <span className="inline-flex items-center gap-1 text-[11px] text-[#71717A] bg-[#F4F4F5] px-2 py-0.5 rounded">
            <CheckCircle2 size={11} className="text-[#171717]" />
            {role}
          </span>
        </div>
        {bio && (
          <p className="text-xs text-[#52525B] leading-relaxed pt-1">
            {bio}
          </p>
        )}
      </div>
    </div>
  );
}
