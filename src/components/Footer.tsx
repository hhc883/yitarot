import Link from "next/link";
import { getDictionary, Locale } from "@/lib/i18n/dictionaries";

export default function Footer({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);

  return (
    <footer className="w-full border-t border-[#1e2638] bg-[#06080e] pt-14 pb-12 mt-20 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
                <span>☯</span>
              </div>
              <span className="font-semibold tracking-wider text-slate-100 text-base">
                QI<span className="text-[#d4af37]">COSMOS</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              {dict.footer.brandDesc}
            </p>
            <div className="pt-2 text-xs text-slate-500">
              {lang === "en" ? (
                <span>Astronomical calculation powered by verified 24-solar-term planetary algorithms.</span>
              ) : (
                <span>采用严谨二十四节气古法干支排盘与天文真太阳时历法计算。</span>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              {dict.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/${lang}/calculator/bazi`} className="hover:text-[#d4af37] transition-colors">
                  {dict.nav.bazi}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/compatibility`} className="hover:text-[#d4af37] transition-colors">
                  {dict.nav.compatibility}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/calculator/iching`} className="hover:text-[#d4af37] transition-colors">
                  {dict.nav.iching}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/knowledge`} className="hover:text-[#d4af37] transition-colors">
                  {dict.nav.knowledge}
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & E-E-A-T */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              {dict.footer.legal}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/${lang}/about`} className="hover:text-[#d4af37] transition-colors">
                  {dict.nav.about}
                </Link>
              </li>
              <li>
                <span className="text-slate-500">{dict.footer.privacy}</span>
              </li>
              <li>
                <span className="text-slate-500">{dict.footer.terms}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Ethical Disclaimer Banner */}
        <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 mb-8">
          <p className="text-[11px] leading-relaxed text-slate-400">
            {dict.footer.disclaimer}
          </p>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>{dict.footer.copyright}</div>
          <div className="flex gap-4">
            <Link href="/en" className={`hover:text-slate-300 ${lang === "en" ? "text-[#d4af37]" : ""}`}>English</Link>
            <span>•</span>
            <Link href="/zh" className={`hover:text-slate-300 ${lang === "zh" ? "text-[#d4af37]" : ""}`}>简体中文</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
