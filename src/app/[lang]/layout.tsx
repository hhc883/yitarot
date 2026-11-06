import type { Metadata } from 'next';
import { TarotNavbar } from '@/components/tarot/TarotNavbar';
import { TarotFooter } from '@/components/tarot/TarotFooter';

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export const metadata: Metadata = {
  title: {
    default: 'QiCosmos｜周易·八字·塔罗 AI 命理 - 在线占卜与自我认知镜像',
    template: '%s | QiCosmos'
  },
  description:
    'QiCosmos（天仪灵图）汇聚东方周易（八字排盘、六爻铜钱神谕、生肖纳音）与西方经典韦特塔罗，结合现代深度心理学，为你提供清澈、深邃的即时命理解读。',
  alternates: {
    canonical: 'https://qicosmos.com/zh',
    languages: {
      en: 'https://qicosmos.com/en',
      zh: 'https://qicosmos.com/zh'
    }
  }
};

export default async function LangLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1E1B18] selection:bg-[#F2ECE1] selection:text-[#1E1B18]">
      <TarotNavbar lang={lang} />
      <main className="flex-1">{children}</main>
      <TarotFooter lang={lang} />
    </div>
  );
}
