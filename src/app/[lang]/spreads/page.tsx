import React from 'react';
import Link from 'next/link';
import { TAROT_SPREADS } from '@/lib/tarot/spreads';
import { Layers, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default async function SpreadsPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10 sm:py-16">
      {/* 头部标题 */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C29026]/10 text-[#8C6D23] border border-[#C29026]/20 text-xs font-medium mb-3">
          <Layers className="w-3.5 h-3.5" /> {lang === 'en' ? 'Structured Sacred Geometry' : '结构化的能量几何'}
        </span>
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#1E1B18] tracking-tight">
          {lang === 'en' ? 'Classic Tarot Spread Library' : '经典塔罗牌阵全景图解'}
        </h1>
        <p className="text-xs sm:text-sm text-[#736B5E] mt-2 leading-relaxed">
          {lang === 'en'
            ? 'Spreads form the structural backbone of tarot interpretation, mapping disordered questions into clear, multi-dimensional causality.'
            : '牌阵是塔罗解读的骨架。不同的站位将混乱的心事投射为严密的时空因果。挑选最契合你当前疑虑的阵法。'}
        </p>
      </div>

      {/* 牌阵列表卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TAROT_SPREADS.map(spread => (
          <div
            key={spread.id}
            className="rounded-3xl bg-[#FFFDF9] border border-[#1E1B18]/10 p-6 sm:p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#C29026]/10 text-[#8C6D23] border border-[#C29026]/20">
                  {lang === 'en' ? `${spread.cardCount} Cards` : `共需 ${spread.cardCount} 张牌`}
                </span>
                <span className="text-[11px] font-sans uppercase tracking-wider text-[#736B5E]">
                  {spread.category}
                </span>
              </div>

              <h3 className="font-serif font-bold text-xl text-[#1E1B18]">
                {lang === 'en' ? spread.nameEn : spread.nameZh}
              </h3>
              <p className="text-xs font-serif italic text-[#736B5E] mb-3">
                {lang === 'en' ? spread.nameZh : spread.nameEn}
              </p>

              <p className="text-xs text-[#5C5549] leading-relaxed mb-4">
                {spread.summary}
              </p>

              <div className="p-3 rounded-xl bg-[#FAF6ED] border border-[#1E1B18]/5 text-xs text-[#1E1B18] mb-5">
                <span className="font-semibold text-[#8C6D23]">{lang === 'en' ? 'Ideal For: ' : '适合场景：'}</span>
                <span className="text-[#5C5549]">{spread.idealFor}</span>
              </div>

              {/* 站位列举 */}
              <div>
                <span className="text-[11px] font-bold text-[#1E1B18] mb-2 block">
                  {lang === 'en' ? 'Placements & Energy Geometry:' : '站位与能量流向：'}
                </span>
                <div className="space-y-1.5">
                  {spread.positions.map((pos, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs text-[#5C5549] bg-white p-2 rounded-lg border border-[#1E1B18]/5"
                    >
                      <span className="w-4 h-4 rounded-full bg-[#1E1B18]/5 text-[#8C6D23] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <strong className="text-[#1E1B18]">{lang === 'en' ? pos.enName : pos.name}</strong>：{pos.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#1E1B18]/10">
              <Link
                href={`/${lang}/reading?spread=${spread.id}`}
                className="w-full py-3 rounded-2xl bg-[#1E1B18] hover:bg-[#38332D] text-[#FFFDF9] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{lang === 'en' ? 'Consult with this Spread' : '以此牌阵开启占卜'}</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
