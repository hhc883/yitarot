import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://tarotip.com'),
  title: {
    default: 'Tarotip｜免费 AI 塔罗占卜 - 在线塔罗牌占卜、爱情塔罗、每日运势',
    template: '%s | Tarotip'
  },
  description:
    'Tarotip 提供温暖治愈的在线 AI 塔罗占卜：爱情关系、是否决断、每日运势与 78 张经典韦特塔罗牌义全解。凭直觉抽牌，多位专属 AI 塔罗师为你即时流式解读。',
  keywords: [
    'AI塔罗',
    'AI塔罗占卜',
    '在线塔罗牌',
    '爱情塔罗',
    '是否塔罗',
    '每日运势塔罗',
    '78张牌义',
    '塔罗牌阵',
    '凯尔特十字',
    '荣格心理学塔罗',
    'Tarot reading',
    'Free tarot'
  ],
  authors: [{ name: 'Tarotip 团队' }],
  creator: 'Tarotip',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    alternateLocale: ['en_US', 'zh_TW'],
    url: 'https://tarotip.com/zh',
    siteName: 'Tarotip',
    title: 'Tarotip｜免费 AI 塔罗占卜 - 在线塔罗牌占卜、每日运势',
    description:
      'Tarotip 提供温暖治愈的在线 AI 塔罗占卜：爱情关系、是否决断、每日运势与 78 张经典韦特塔罗牌义全解。'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tarotip｜免费 AI 塔罗占卜',
    description: '心里有件事，问问牌吧。你的口袋 AI 塔罗师。'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#FAF7F2] text-[#1E1B18] selection:bg-[#F2ECE1] selection:text-[#1E1B18]">
        {children}
      </body>
    </html>
  );
}
