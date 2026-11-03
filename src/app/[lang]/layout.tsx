import type { Metadata } from 'next';
import { TarotNavbar } from '@/components/tarot/TarotNavbar';
import { TarotFooter } from '@/components/tarot/TarotFooter';

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

  if (lang === 'zh') {
    return {
      title: 'Tarotip｜免费在线 AI 塔罗占卜 - 爱情、决策与每日运势',
      description: 'Tarotip 提供温暖治愈的在线 AI 塔罗占卜：爱情关系、是否决断、每日运势与 78 张经典韦特塔罗牌义全解。凭直觉抽牌，AI 塔罗师为你即时流式解读。',
      alternates: {
        canonical: 'https://tarotip.com/zh',
        languages: {
          en: 'https://tarotip.com/en',
          zh: 'https://tarotip.com/zh'
        }
      }
    };
  }

  return {
    title: 'Tarotip | Free AI Tarot Reading - Love, Decisions & Daily Horoscopes',
    description: 'Instant, empathetic AI Tarot readings with intuitive 3D card drawing, 78 Rider-Waite cards, and tailored insights.',
    alternates: {
      canonical: 'https://tarotip.com/en',
      languages: {
        en: 'https://tarotip.com/en',
        zh: 'https://tarotip.com/zh'
      }
    }
  };
}

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
