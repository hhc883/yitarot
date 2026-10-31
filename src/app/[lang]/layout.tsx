import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Locale } from "@/lib/i18n/dictionaries";

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "zh" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang: Locale = rawLang === "zh" ? "zh" : "en";

  if (lang === "zh") {
    return {
      title: "QiCosmos 天仪灵图 - 东西方命理测算与自我探索平台",
      description: "融合西方占星太阳星座与东方生辰八字四柱、五行能量平衡雷达图、144生肖配对与周易铜钱神谕的现代玄学测算平台。",
      alternates: {
        canonical: "https://qicosmos.com/zh",
        languages: {
          en: "https://qicosmos.com/en",
          zh: "https://qicosmos.com/zh",
        },
      },
    };
  }

  return {
    title: "QiCosmos - Ancient Eastern Metaphysics × Western Astrology Blueprint",
    description: "Decode your celestial blueprint by uniting Western Sun signs with Eastern Four Pillars (BaZi), Day Master archetypes, 144 Zodiac compatibility, and I Ching 3-coin divination.",
    alternates: {
      canonical: "https://qicosmos.com/en",
      languages: {
        en: "https://qicosmos.com/en",
        zh: "https://qicosmos.com/zh",
      },
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang: Locale = rawLang === "zh" ? "zh" : "en";

  return (
    <div className="min-h-screen flex flex-col bg-[#080b11] text-slate-100 selection:bg-[#d4af37]/30 selection:text-[#fef3c7]">
      <Navbar lang={lang} />
      <main className="flex-1">{children}</main>
      <Footer lang={lang} />
    </div>
  );
}
