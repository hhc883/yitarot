import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { HeartHandshake, Sparkles, Flame, ArrowLeft, Compass, ShieldAlert } from "lucide-react";
import {
  ZODIAC_SIGNS,
  getZodiacCompatibility,
  getAll144CompatibilitySlugs
} from "@/lib/metaphysics/compatibility";
import { Locale } from "@/lib/i18n/dictionaries";

export async function generateStaticParams() {
  const topSlugs = [
    "dragon-and-rooster",
    "rat-and-ox",
    "tiger-and-pig",
    "rabbit-and-dog",
    "snake-and-monkey",
    "horse-and-goat",
    "monkey-and-dragon",
    "pig-and-rabbit",
    "tiger-and-horse",
    "snake-and-rooster",
    "rat-and-horse",
    "ox-and-goat"
  ];

  const params: { lang: string; slug: string }[] = [];
  for (const s of topSlugs) {
    params.push({ lang: "en", slug: s });
    params.push({ lang: "zh", slug: s });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  const lang: Locale = rawLang === "zh" ? "zh" : "en";
  const parts = slug.split("-and-");
  if (parts.length !== 2) return { title: "Compatibility | QiCosmos" };

  const signA = ZODIAC_SIGNS.find(s => s.id === parts[0]);
  const signB = ZODIAC_SIGNS.find(s => s.id === parts[1]);
  if (!signA || !signB) return { title: "Compatibility | QiCosmos" };

  const result = getZodiacCompatibility(signA.id, signB.id);

  if (lang === "zh") {
    return {
      title: `${signA.nameZh}与${signB.nameZh}生肖配对查询 - 婚姻、爱情与事业合盘分析 | QiCosmos`,
      description: `详细解析生肖${signA.nameZh}与${signB.nameZh}的契合度（${result.overallScore}分）。涵盖天作六合、五行生克、感情磨合点与后天调和之道。`,
      alternates: {
        canonical: `https://qicosmos.com/zh/compatibility/${slug}`,
        languages: {
          en: `https://qicosmos.com/en/compatibility/${slug}`,
          zh: `https://qicosmos.com/zh/compatibility/${slug}`,
        }
      }
    };
  }

  return {
    title: `${signA.nameEn} and ${signB.nameEn} Compatibility: Chinese Zodiac Love & Soulmate Analysis | QiCosmos`,
    description: `Deep astrological analysis of ${signA.nameEn} and ${signB.nameEn} compatibility (Score: ${result.overallScore}/100). Discover romance, friendship, work dynamics, and ancient harmonization secrets.`,
    alternates: {
      canonical: `https://qicosmos.com/en/compatibility/${slug}`,
      languages: {
        en: `https://qicosmos.com/en/compatibility/${slug}`,
        zh: `https://qicosmos.com/zh/compatibility/${slug}`,
      }
    }
  };
}

export default async function CompatibilitySlugPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: rawLang, slug } = await params;
  const lang: Locale = rawLang === "zh" ? "zh" : "en";
  const parts = slug.split("-and-");
  if (parts.length !== 2) notFound();

  const signA = ZODIAC_SIGNS.find(s => s.id === parts[0]);
  const signB = ZODIAC_SIGNS.find(s => s.id === parts[1]);
  if (!signA || !signB) notFound();

  const result = getZodiacCompatibility(signA.id, signB.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${result.signA.nameEn} and ${result.signB.nameEn} Compatibility Analysis`,
    description: result.dynamicEn,
    author: {
      "@type": "Organization",
      name: "QiCosmos Editorial Metaphysics Council",
    },
    publisher: {
      "@type": "Organization",
      name: "QiCosmos",
      logo: {
        "@type": "ImageObject",
        url: "https://qicosmos.com/favicon.ico",
      },
    },
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href={`/${lang}/compatibility`}
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#d4af37] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{lang === "en" ? "Back to Compatibility Matrix" : "返回生肖配对总览"}</span>
      </Link>

      <header className="space-y-4">
        <div className="zen-badge">
          <HeartHandshake className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>{lang === "en" ? result.verdictEn : result.verdictZh}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-100 leading-tight">
          {lang === "en" ? (
            <>
              {result.signA.nameEn} & {result.signB.nameEn} <span className="gold-gradient-text">Compatibility</span>
            </>
          ) : (
            <>
              {result.signA.nameZh} 与 {result.signB.nameZh} <span className="gold-gradient-text">命理合盘详析</span>
            </>
          )}
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          {lang === "en"
            ? `An exhaustive cosmological examination of ${result.signA.nameEn} (${result.signA.element}) and ${result.signB.nameEn} (${result.signB.element}) in romance, long-term marriage, business, and spiritual evolution.`
            : `系统剖析${result.signA.nameZh}（${result.signA.elementZh}行）与${result.signB.nameZh}（${result.signB.elementZh}行）在婚恋姻缘、友情相惜与合伙经营中的阴阳流转与相处真谛。`}
        </p>
      </header>

      <div className="zen-card p-6 sm:p-8 border-[#d4af37]/40 bg-gradient-to-b from-[#141b2b] to-[#0c101a] space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-5">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-3xl mb-1">
                {result.signA.emoji}
              </div>
              <span className="text-xs font-semibold text-slate-200">
                {lang === "en" ? result.signA.nameEn : result.signA.nameZh}
              </span>
            </div>

            <span className="text-2xl text-[#d4af37] font-light">♥</span>

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-3xl mb-1">
                {result.signB.emoji}
              </div>
              <span className="text-xs font-semibold text-slate-200">
                {lang === "en" ? result.signB.nameEn : result.signB.nameZh}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-400 block uppercase">
                {lang === "en" ? "Cosmic Synergy" : "综合契合度"}
              </span>
              <span className="text-xs text-[#d4af37] font-semibold">
                {lang === "en" ? result.verdictEn : result.verdictZh}
              </span>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-[#d4af37] bg-slate-950 flex items-center justify-center font-mono font-bold text-xl text-[#f5d77f]">
              {result.overallScore}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-rose-400 font-medium">{lang === "en" ? "Romance" : "恋爱姻缘"}</span>
              <span className="font-mono text-slate-200 font-bold">{result.romanceScore}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: `${result.romanceScore}%` }} />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-amber-400 font-medium">{lang === "en" ? "Friendship" : "知己友情"}</span>
              <span className="font-mono text-slate-200 font-bold">{result.friendshipScore}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${result.friendshipScore}%` }} />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-cyan-400 font-medium">{lang === "en" ? "Career" : "合伙事业"}</span>
              <span className="font-mono text-slate-200 font-bold">{result.workScore}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${result.workScore}%` }} />
            </div>
          </div>
        </div>
      </div>

      <section className="prose prose-invert prose-slate max-w-none space-y-6 text-sm text-slate-300 leading-relaxed">
        <h2 className="text-xl font-serif font-bold text-slate-100">
          {lang === "en"
            ? `1. The Elemental Dynamics: ${result.signA.element} & ${result.signB.element}`
            : `一、 五行气场交互：${result.signA.elementZh}行与${result.signB.elementZh}行`}
        </h2>
        <p>{lang === "en" ? result.dynamicEn : result.dynamicZh}</p>

        <h2 className="text-xl font-serif font-bold text-slate-100">
          {lang === "en" ? "2. Core Relationship Strengths" : "二、 命局相合的天然优势"}
        </h2>
        <ul className="space-y-1.5">
          {(lang === "en" ? result.strengthsEn : result.strengthsZh).map((s, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-emerald-400 mt-1">✔</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>

        <h2 className="text-xl font-serif font-bold text-slate-100">
          {lang === "en" ? "3. Karmic Pitfalls & Growth Edges" : "三、 潜在相处磨合与盲点"}
        </h2>
        <ul className="space-y-1.5">
          {(lang === "en" ? result.challengesEn : result.challengesZh).map((c, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-amber-400 mt-1">⚠</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>

        <h2 className="text-xl font-serif font-bold text-slate-100">
          {lang === "en" ? "4. Harmonization & Feng Shui Secret" : "四、 大师化解锦囊与风水增益"}
        </h2>
        <div className="p-4 rounded-xl bg-[#d4af37]/10 border-l-4 border-[#d4af37] text-xs text-[#f5d77f]">
          {lang === "en" ? result.harmonizationTipsEn : result.harmonizationTipsZh}
        </div>
      </section>

      <div className="zen-card p-6 text-center space-y-3 bg-gradient-to-r from-slate-900 to-[#12192a]">
        <h3 className="text-base font-serif font-bold text-slate-100">
          {lang === "en" ? "Want a More Exact Match Based on Exact Birth Hours?" : "想基于双方精确生辰八字进行深度合婚？"}
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          {lang === "en"
            ? "Chinese astrology goes far beyond the birth year animal. Calculate both of your Day Masters and 8-Character charts for 100% precision."
            : "生肖属相仅占八字四柱其一，测算双方出生时辰日主元神可获知百分百精准之命盘契合度。"}
        </p>
        <Link
          href={`/${lang}/calculator/bazi`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#d4af37] text-slate-950 text-xs font-semibold hover:brightness-110 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === "en" ? "Launch BaZi Dual Calculator" : "开启双人八字排盘"}</span>
        </Link>
      </div>
    </article>
  );
}
