"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Globe, Menu, X, Sparkles, Compass, HeartHandshake, BookOpen, ShieldCheck } from "lucide-react";
import { getDictionary, Locale } from "@/lib/i18n/dictionaries";

export default function Navbar({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Switch locale path
  const targetLang: Locale = lang === "en" ? "zh" : "en";
  let targetPath = `/${targetLang}`;
  if (pathname) {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length > 0 && (parts[0] === "en" || parts[0] === "zh")) {
      parts[0] = targetLang;
      targetPath = "/" + parts.join("/");
    }
  }

  const navItems = [
    { href: `/${lang}/calculator/bazi`, label: dict.nav.bazi, icon: Sparkles },
    { href: `/${lang}/compatibility`, label: dict.nav.compatibility, icon: HeartHandshake },
    { href: `/${lang}/calculator/iching`, label: dict.nav.iching, icon: Compass },
    { href: `/${lang}/knowledge`, label: dict.nav.knowledge, icon: BookOpen },
    { href: `/${lang}/about`, label: dict.nav.about, icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1e2638]/80 bg-[#080b11]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#d4af37]/20 to-[#d4af37]/40 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.2)] group-hover:scale-105 transition-transform">
            <span className="text-xl leading-none">☯</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold tracking-wider text-slate-100 text-base group-hover:text-[#d4af37] transition-colors">
              QI<span className="text-[#d4af37]">COSMOS</span>
            </span>
            <span className="text-[10px] text-slate-400 -mt-1 tracking-widest uppercase">
              {lang === "en" ? "East × West Metaphysics" : "东西方命理测算"}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#d4af37]/15 text-[#f5d77f] border border-[#d4af37]/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Icon className="w-4 h-4 opacity-75" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side: Language Switcher */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href={targetPath}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1e2638] bg-slate-900/60 hover:bg-slate-800 hover:border-[#d4af37]/40 text-xs font-medium text-slate-200 transition-all"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{dict.nav.switchLang}</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href={targetPath}
            className="p-1.5 rounded-lg border border-[#1e2638] text-xs text-slate-300"
          >
            {dict.nav.switchLang}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white rounded-lg focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#1e2638] bg-[#0c101a] px-4 pt-2 pb-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800/70"
              >
                <Icon className="w-4 h-4 text-[#d4af37]" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
