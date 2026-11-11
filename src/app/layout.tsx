import type { Metadata } from 'next';
import './globals.css';
import { PointsGateProvider } from '@/components/site/PointsGateProvider';

export const metadata: Metadata = {
  metadataBase: new URL('https://qicosmos.com'),
  title: {
    default: 'QiCosmos｜周易·八字·塔罗 AI 命理 - 在线占卜与自我认知镜像',
    template: '%s | QiCosmos'
  },
  description:
    'QiCosmos（天仪灵图）汇聚东方周易（八字排盘、六爻铜钱神谕、生肖纳音）与西方经典韦特塔罗，结合现代深度心理学，为你提供清澈、深邃的即时命理解读。',
  keywords: [
    'QiCosmos',
    '周易起卦',
    '八字排盘',
    '六爻占卜',
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
  authors: [{ name: 'QiCosmos 团队' }],
  creator: 'QiCosmos',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    alternateLocale: ['en_US', 'zh_TW'],
    url: 'https://qicosmos.com/zh',
    siteName: 'QiCosmos',
    title: 'QiCosmos｜周易·八字·塔罗 AI 命理 - 在线占卜与自我认知镜像',
    description:
      'QiCosmos（天仪灵图）汇聚东方周易与西方经典韦特塔罗，为你提供温润治愈的心灵指引与决策参考。'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QiCosmos｜东方周易与西方塔罗 AI 命理',
    description: '心里有件事，问问卦或牌吧。你的全天候 AI 命理与潜意识导师。'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col paper-grain bg-[#F7F3EF] text-[#2B261F] selection:bg-[#EAE4D9] selection:text-[#111111]">
        <PointsGateProvider>{children}</PointsGateProvider>
      </body>
    </html>
  );
}
