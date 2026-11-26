import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { TAROT_SPREADS } from '@/lib/tarot/spreads';
import { buildLocalizedMetadata } from '@/lib/seo/metadata';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';

  return buildLocalizedMetadata({
    lang,
    routePath: '/spreads',
    title: isEn
      ? 'Classic Tarot Spreads Guide - Celtic Cross, Three-Card & Love Layouts'
      : '经典塔罗牌阵大全｜圣三角·凯尔特十字·二选一牌阵解析',
    description: isEn
      ? 'Master classic tarot spreads including Single Card, Three-Card Progression, Love Mirror, Two-Choice Decision, and the 10-card Celtic Cross.'
      : '系统讲解圣三角、爱情三牌、二选一、四元素与十张凯尔特十字等经典塔罗牌阵结构、适用问题与牌位含义。',
    keywords: isEn
      ? ['Tarot spreads', 'Celtic Cross spread', 'Three card tarot', 'Love tarot spread']
      : ['塔罗牌阵', '凯尔特十字', '圣三角牌阵', '二选一牌阵']
  });
}

interface SpreadEnglishContent {
  summary: string;
  idealFor: string;
  positions: readonly {
    readonly name: string;
    readonly description: string;
  }[];
}

const SPREAD_LOCALIZED_EN: Record<string, SpreadEnglishContent> = {
  single: {
    summary: 'A direct and focused message for daily mindfulness, swift intuition, and core energetic clarity.',
    idealFor: '"What requires my attention today?" or "What is the core energy surrounding this matter?"',
    positions: [
      {
        name: 'Core Insight',
        description: 'Reveals the essential theme, underlying truth, or primary guidance for this moment.'
      }
    ]
  },
  yes_no: {
    summary: 'A focused evaluation providing a clear directional tendency (Yes, No, or Neutral) and the root cause behind it.',
    idealFor: '"Should I make this transition now?" or "Will this meeting unfold smoothly?"',
    positions: [
      {
        name: 'Verdict & Key Dynamic',
        description: 'Indicates the directional trend and points to the decisive variable shaping the outcome.'
      }
    ]
  },
  three_cards: {
    summary: 'The classic three-card layout tracing chronological progression from origin to current reality and natural culmination.',
    idealFor: 'Tracing cause and effect in complex situations or surveying an emerging trajectory.',
    positions: [
      {
        name: 'Past Foundation',
        description: 'Past roots, foundational experiences, or subconscious origins shaping the present.'
      },
      {
        name: 'Present Reality',
        description: 'Current circumstances, active tensions, and the immediate landscape you face.'
      },
      {
        name: 'Future Trajectory',
        description: 'The natural outcome and turning point if events continue along their current course.'
      }
    ]
  },
  love_three: {
    summary: 'A relational mirror spread examining inner subconscious motivations, interpersonal dynamics, and mutual evolution.',
    idealFor: 'Navigating romantic uncertainty, mutual alignment, cooling phases, or reconciliation potential.',
    positions: [
      {
        name: 'Your Inner Heart',
        description: 'Your authentic desires, hidden fears, and emotional projections within this bond.'
      },
      {
        name: "Partner's Perception",
        description: "Your partner's authentic emotional state, view of the bond, and immediate pressures."
      },
      {
        name: 'Path Forward',
        description: 'The evolving energetic trajectory and the primary key to mutual understanding.'
      }
    ]
  },
  two_choices: {
    summary: 'A structured comparative spread weighing trade-offs, experiential journeys, and ultimate outcomes across two diverging paths.',
    idealFor: '"Option A or Option B?" or "Should I embark on this venture or continue on my current path?"',
    positions: [
      {
        name: 'Dilemma Origin',
        description: 'The root tension and core inner motive prompting this decision.'
      },
      {
        name: 'Path A Journey',
        description: 'The lived experience, tests, and required effort along the first option.'
      },
      {
        name: 'Path A Outcome',
        description: 'The ultimate return, lasting impact, and long-term culmination of choosing Option A.'
      },
      {
        name: 'Path B Journey',
        description: 'The lived experience, tests, and required effort along the second option.'
      },
      {
        name: 'Path B Outcome',
        description: 'The ultimate return, lasting impact, and long-term culmination of choosing Option B.'
      }
    ]
  },
  celtic_cross: {
    summary: 'The venerable comprehensive panorama layout exploring conscious aims, subconscious roots, obstacles, and long-term fruition.',
    idealFor: 'Major life milestones, panoramic inquiries, and deep structural self-examination.',
    positions: [
      {
        name: 'The Present Heart',
        description: 'The core state, primary atmosphere, and central focal point of your inquiry.'
      },
      {
        name: 'The Cross / Obstacle',
        description: 'The immediate friction, unexpected challenge, or catalyst directly engaging the core.'
      },
      {
        name: 'The Foundation',
        description: 'Subconscious foundations, deep motivations, and historical seeds of the matter.'
      },
      {
        name: 'The Recent Past',
        description: 'Events that recently transpired whose ripples still influence the present.'
      },
      {
        name: 'Higher Consciousness',
        description: 'Your conscious goals, aspirations, and the ideal outcome envisioned in your mind.'
      },
      {
        name: 'Near Future',
        description: 'The next phase of developments and energies entering your path.'
      },
      {
        name: 'Self-Perception',
        description: 'How you perceive yourself and your agency within this unfolding situation.'
      },
      {
        name: 'External Environment',
        description: 'Influences from surrounding people, workplace, family, or societal conditions.'
      },
      {
        name: 'Hopes & Fears',
        description: 'Deepest inner longings, subtle anxieties, and vulnerable expectations.'
      },
      {
        name: 'Final Culmination',
        description: 'The comprehensive culmination and enduring resolution as all energies align.'
      }
    ]
  }
} as const;

const CATEGORY_LABELS: Record<string, { en: string; zh: string }> = {
  general: { en: 'General', zh: '综合洞察' },
  decision: { en: 'Decision', zh: '决断选择' },
  love: { en: 'Love', zh: '情感关系' },
  career: { en: 'Career', zh: '事业学业' },
  advanced: { en: 'Advanced', zh: '全景进阶' }
};

export default async function SpreadsPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-14 text-black">
      {/* 头部标题与简介 */}
      <header className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
        <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2 font-mono">
          {isEn ? 'Spread Catalog' : '牌阵目录'}
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight text-neutral-900 mb-3">
          {isEn ? 'Tarot Spreads' : '经典塔罗牌阵'}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
          {isEn
            ? 'Structured layouts for clarity and focus. Select a spread tailored to your inquiry.'
            : '以严谨的站位结构映射思绪与因果。选择契合当前问题的牌阵开启解读。'}
        </p>
      </header>

      {/* 牌阵列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {TAROT_SPREADS.map(spread => {
          const enContent = SPREAD_LOCALIZED_EN[spread.id];
          const summary = isEn && enContent ? enContent.summary : spread.summary;
          const idealFor = isEn && enContent ? enContent.idealFor : spread.idealFor;
          const categoryLabel = CATEGORY_LABELS[spread.category]
            ? (isEn ? CATEGORY_LABELS[spread.category].en : CATEGORY_LABELS[spread.category].zh)
            : spread.category;

          const cardCountBadge = isEn
            ? (spread.cardCount === 1 ? '1 Card' : `${spread.cardCount} Cards`)
            : `${spread.cardCount} 张牌`;

          return (
            <section
              key={spread.id}
              aria-labelledby={`spread-heading-${spread.id}`}
              className="rounded-lg border border-neutral-200 bg-white p-5 sm:p-6 flex flex-col justify-between transition-colors hover:border-neutral-400"
            >
              <div>
                {/* 卡片头部信息 */}
                <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-neutral-100">
                  <span className="text-xs font-mono font-medium px-2 py-0.5 rounded border border-neutral-200 bg-neutral-50 text-neutral-800">
                    {cardCountBadge}
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                    {categoryLabel}
                  </span>
                </div>

                {/* 标题 */}
                <h2
                  id={`spread-heading-${spread.id}`}
                  className="font-serif text-lg sm:text-xl font-normal text-neutral-900 tracking-tight mb-3"
                >
                  {isEn ? spread.nameEn : spread.nameZh}
                </h2>

                {/* 简介与适用场景 */}
                <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                  {summary}
                </p>

                <div className="mb-4 rounded border border-neutral-200 bg-neutral-50/60 p-2.5 text-xs text-neutral-700 leading-relaxed">
                  <span className="font-medium text-neutral-900">
                    {isEn ? 'Best for: ' : '适合场景：'}
                  </span>
                  <span>{idealFor}</span>
                </div>

                {/* 简易站位预览与说明 */}
                <div className="mt-4">
                  <h3 className="text-xs font-medium text-neutral-900 mb-2">
                    {isEn ? 'Card Positions' : '牌位与含义'}
                  </h3>
                  <ol className="space-y-1.5 list-none p-0 m-0">
                    {spread.positions.map((pos, idx) => {
                      const localizedPos = isEn && enContent?.positions[idx]
                        ? enContent.positions[idx]
                        : null;
                      const posName = localizedPos
                        ? localizedPos.name
                        : (isEn ? pos.enName : pos.name);
                      const posDesc = localizedPos
                        ? localizedPos.description
                        : pos.description;

                      return (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-xs text-neutral-600 rounded border border-neutral-100 bg-neutral-50/40 px-2.5 py-1.5"
                        >
                          <span className="inline-flex items-center justify-center w-4 h-4 rounded text-[10px] font-mono font-semibold bg-neutral-200/80 text-neutral-800 shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <div className="leading-snug">
                            <strong className="font-medium text-neutral-900">
                              {posName}
                            </strong>
                            <span className="text-neutral-400 mx-1">·</span>
                            <span>{posDesc}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>

              {/* 底部按钮 */}
              <div className="mt-6 pt-4 border-t border-neutral-100">
                <Link
                  href={`/${lang}/reading?spread=${spread.id}`}
                  className="inline-flex min-h-[44px] w-full items-center justify-center py-2.5 px-4 rounded text-xs font-medium bg-[#171717] text-white hover:bg-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 transition-colors"
                >
                  {isEn ? 'Select Spread' : '以此牌阵开启解读'}
                </Link>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
