import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://qicosmos.com"),
  title: {
    default: "QiCosmos | Ancient Eastern Metaphysics × Western Astrology Blueprint",
    template: "%s | QiCosmos",
  },
  description:
    "Decode your cosmic blueprint through Western Astrology, Eastern Four Pillars (BaZi), Day Master soul analysis, 144 Chinese Zodiac compatibility, and I Ching 3-coin divination.",
  keywords: [
    "bazi calculator",
    "four pillars of destiny",
    "chinese astrology",
    "chinese zodiac compatibility",
    "day master",
    "five elements wu xing",
    "i ching oracle",
    "eastern mbTI",
    "western astrology vs chinese astrology",
    "八字排盘",
    "生肖配对",
    "周易起卦"
  ],
  authors: [{ name: "QiCosmos Metaphysics Council" }],
  creator: "QiCosmos",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["zh_CN"],
    url: "https://qicosmos.com",
    siteName: "QiCosmos",
    title: "QiCosmos | Ancient Eastern Metaphysics × Western Astrology Blueprint",
    description:
      "Decode your cosmic blueprint through Western Astrology, Eastern Four Pillars (BaZi), Day Master soul analysis, 144 Chinese Zodiac compatibility, and I Ching 3-coin divination.",
  },
  twitter: {
    card: "summary_large_image",
    title: "QiCosmos | Ancient Eastern Metaphysics × Western Astrology",
    description: "Decode your cosmic blueprint through BaZi, Wu Xing, and Western Astrology.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#080b11] text-slate-100">{children}</body>
    </html>
  );
}
