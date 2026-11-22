'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { CONTAINER } from './constants';
import { useUser } from '@/lib/auth/use-user';
import { UserAvatar } from './UserAvatar';

interface NavItem {
  key: string;
  href: string;
  labelZh: string;
  labelEn: string;
}

/**
 * 统一导航（A1 静态骨架）：
 * - 品牌：YiTatro
 * - 中英三栏：易经与八字 / 塔罗 / 指南（I Ching & BaZi / Tarot / Learn）
 * - 首页滑至入口区显示，内页直达显示
 * - 保留登录、账户、积分（◆ {balance}）、多语言切换
 */
export function SiteNavbar({ lang = 'zh' }: { lang?: string }) {
  const isEn = lang === 'en';
  const pathname = usePathname() || '';
  const homePath = `/${lang}`;
  const isHome = pathname === homePath || pathname === `${homePath}/`;

  const [pastHero, setPastHero] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { loading: userLoading, user, balance } = useUser();

  // 首页：滑至入口区或锚点跳转后显示导航；非首页由 !isHome 派生直接显示
  useEffect(() => {
    if (!isHome) return;

    let raf = 0;
    const checkScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const portalsEl = document.getElementById('portals');
        if (portalsEl) {
          const rect = portalsEl.getBoundingClientRect();
          // 当双入口区顶部接近视口上边缘时显示导航
          setPastHero(rect.top <= 120);
        } else {
          setPastHero(window.scrollY > window.innerHeight * 0.7);
        }
      });
    };

    checkScroll();
    window.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll, { passive: true });
    window.addEventListener('hashchange', checkScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
      window.removeEventListener('hashchange', checkScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [isHome]);

  // 移动端菜单展开时锁定背景滚动并监听 Esc 键关闭（焦点归还给触发按钮）
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const visible = !isHome || pastHero || menuOpen;

  const items: NavItem[] = [
    {
      key: 'east',
      href: `/${lang}/east`,
      labelZh: '易经与八字',
      labelEn: 'I Ching & BaZi'
    },
    {
      key: 'west',
      href: `/${lang}/west`,
      labelZh: '塔罗',
      labelEn: 'Tarot'
    },
    {
      key: 'blog',
      href: `/${lang}/blog`,
      labelZh: '指南',
      labelEn: 'Learn'
    }
  ];

  const normalizedPath = pathname.replace(/\/+$/, '') || '/';

  const isSectionActive = (key: string, href: string) => {
    // 1. 直达栏目落地页或其子路径
    if (normalizedPath === href || normalizedPath.startsWith(`${href}/`)) {
      return true;
    }
    // 2. 深度工具路由映射（东：/east；西：/draw, /reading, /cards, /spreads, /fortune, /yes-no, /love；指南：/blog）
    if (key === 'east') {
      const eastPrefix = `/${lang}/east`;
      return normalizedPath === eastPrefix || normalizedPath.startsWith(`${eastPrefix}/`);
    }
    if (key === 'west') {
      const westRoutes = ['draw', 'reading', 'cards', 'spreads', 'fortune', 'yes-no', 'love'];
      return westRoutes.some((route) => {
        const prefix = `/${lang}/${route}`;
        return normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`);
      });
    }
    if (key === 'blog') {
      const blogPrefix = `/${lang}/blog`;
      return normalizedPath === blogPrefix || normalizedPath.startsWith(`${blogPrefix}/`);
    }
    return false;
  };

  return (
    <>
      <header
        className={`${
          isHome ? 'fixed inset-x-0' : 'sticky'
        } top-0 z-[100] border-b border-[#E4E4E7] bg-white/95 backdrop-blur-md transition-transform duration-300 ease-out ${
          visible ? 'translate-y-0' : '-translate-y-full pointer-events-none'
        }`}
        inert={!visible ? true : undefined}
      >
        <div className={`${CONTAINER} flex h-16 items-center justify-between gap-6 lg:h-[72px]`}>
          {/* 左侧品牌 */}
          <Link
            href={homePath}
            className="shrink-0 font-serif text-[19px] sm:text-[20px] font-bold tracking-tight text-[#171717] transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
          >
            YiTatro
          </Link>

          {/* 中间桌面导航：「易经与八字 / 塔罗 / 指南」 */}
          <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex lg:gap-10" aria-label={isEn ? 'Main navigation' : '主导航'}>
            {items.map((item) => {
              const active = isSectionActive(item.key, item.href);
              const label = isEn ? item.labelEn : item.labelZh;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={active ? (normalizedPath === item.href ? 'page' : 'location') : undefined}
                  className={`group relative py-2 text-[13.5px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] ${
                    active ? 'font-medium text-[#171717]' : 'text-[#52525B] hover:text-[#171717]'
                  }`}
                >
                  <span>{label}</span>
                  <span
                    className={`pointer-events-none absolute inset-x-0 -bottom-0.5 h-px origin-left bg-[#171717] transition-transform duration-200 ${
                      active ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* 右侧：语言 + 登录 / 账户 */}
          <div className="hidden shrink-0 items-center gap-6 lg:flex">
            {/* 语言切换 */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen((open) => !open)}
                className="inline-flex min-h-[44px] items-center gap-1 text-[13px] text-[#52525B] transition-colors hover:text-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
                aria-expanded={langMenuOpen}
                aria-label={isEn ? 'Switch language' : '切换语言'}
              >
                <span>{isEn ? 'English' : '简体中文'}</span>
                <span className="text-[10px] leading-none" aria-hidden="true">▾</span>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-28 rounded border border-[#E4E4E7] bg-white py-1 shadow-xs z-[105]">
                  <Suspense fallback={<DesktopLangMenuLinksFallback pathname={pathname} isEn={isEn} onSelect={() => setLangMenuOpen(false)} />}>
                    <DesktopLangMenuLinks pathname={pathname} isEn={isEn} onSelect={() => setLangMenuOpen(false)} />
                  </Suspense>
                </div>
              )}
            </div>

            {/* 用户状态 */}
            {user ? (
              <Link
                href={`/${lang}/account`}
                className="flex min-h-[44px] items-center gap-2.5 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
                title={user.email}
              >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] px-3 py-1.5 text-[12.5px] text-[#171717] tabular-nums">
                  <span className="text-[10px] leading-none" aria-hidden="true">◆</span>
                  <span>{balance}</span>
                </span>
                <UserAvatar user={user} />
              </Link>
            ) : userLoading ? (
              <span className="inline-flex h-8 w-[64px] items-center justify-center rounded-sm bg-[#171717]/10" aria-hidden="true" />
            ) : (
              <Link
                href={`/${lang}/login`}
                className="inline-flex min-h-[44px] items-center justify-center rounded-sm bg-[#171717] px-4 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-[#333333] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
              >
                <span>{isEn ? 'Log in' : '登录'}</span>
              </Link>
            )}
          </div>

          {/* 移动端：余额胶囊（登录后显示） */}
          {user ? (
            <Link
              href={`/${lang}/account`}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-[#E4E4E7] px-3 py-1 text-[12px] text-[#171717] tabular-nums lg:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
            >
              <span className="text-[9px] leading-none" aria-hidden="true">◆</span>
              <span>{balance}</span>
            </Link>
          ) : null}

          {/* 移动端菜单按钮：Menu ☰ */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? (isEn ? 'Close menu' : '关闭菜单') : (isEn ? 'Open menu' : '打开菜单')}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-drawer"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded text-[13px] font-medium text-[#171717] transition-colors hover:text-[#52525B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] lg:hidden"
          >
            <span>{menuOpen ? (isEn ? 'Close' : '关闭') : (isEn ? 'Menu' : '菜单')}</span>
            <span className="text-base leading-none" aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </header>

      {/* 移动端抽屉 */}
      <div
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={isEn ? 'Mobile navigation' : '移动端导航'}
        className={`fixed inset-x-0 top-16 bottom-0 z-[110] overflow-y-auto bg-white px-6 pb-12 pt-6 lg:hidden ${
          menuOpen ? 'block' : 'hidden'
        }`}
      >
        <nav className="flex flex-col" aria-label={isEn ? 'Mobile navigation links' : '移动端导航链接'}>
          {items.map((item) => {
            const active = isSectionActive(item.key, item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                aria-current={active ? (normalizedPath === item.href ? 'page' : 'location') : undefined}
                className="flex min-h-[44px] items-center justify-between border-b border-[#E4E4E7] py-3.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
              >
                <span className={`text-[16px] ${active ? 'font-medium text-[#171717]' : 'text-[#52525B]'}`}>
                  {isEn ? item.labelEn : item.labelZh}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* 语言切换：English / 简体中文 */}
        <div className="mt-8 flex items-center justify-between border-b border-[#E4E4E7] pb-6">
          <span className="text-[13px] text-[#52525B]">{isEn ? 'Language' : '语言'}</span>
          <Suspense fallback={<MobileLangLinksFallback pathname={pathname} isEn={isEn} onSelect={() => setMenuOpen(false)} />}>
            <MobileLangLinks pathname={pathname} isEn={isEn} onSelect={() => setMenuOpen(false)} />
          </Suspense>
        </div>

        {/* 用户登录 / 账户 */}
        <div className="mt-6">
          {user ? (
            <Link
              href={`/${lang}/account`}
              onClick={() => setMenuOpen(false)}
              className="flex min-h-[44px] items-center justify-between py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
            >
              <div className="flex items-center gap-2.5">
                <UserAvatar user={user} size={32} />
                <span className="flex flex-col leading-tight">
                  <span className="text-[13px] font-medium text-[#171717]">{user.email}</span>
                  <span className="text-[12px] text-[#52525B]">◆ {balance}</span>
                </span>
              </div>
              <span className="text-[12px] text-[#52525B]" aria-hidden="true">→</span>
            </Link>
          ) : (
            <Link
              href={`/${lang}/login`}
              onClick={() => setMenuOpen(false)}
              className="flex min-h-[44px] w-full items-center justify-center rounded-sm bg-[#171717] py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#333333] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
            >
              <span>{isEn ? 'Log in' : '登录'}</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

function buildTargetHref(pathname: string, targetLang: 'zh' | 'en', search: string): string {
  const segments = (pathname || '').split('/').filter(Boolean);
  if (segments.length === 0) {
    const base = `/${targetLang}`;
    return search ? `${base}?${search}` : base;
  }

  if (segments[0] === 'zh' || segments[0] === 'en') {
    segments[0] = targetLang;
  } else {
    segments.unshift(targetLang);
  }

  const base = `/${segments.join('/')}`;
  return search ? `${base}?${search}` : base;
}

interface LangLinksProps {
  pathname: string;
  isEn: boolean;
  onSelect: () => void;
  search?: string;
}

function DesktopLangMenuLinksContent({ pathname, isEn, onSelect, search = '' }: LangLinksProps) {
  const zhHref = buildTargetHref(pathname, 'zh', search);
  const enHref = buildTargetHref(pathname, 'en', search);

  return (
    <>
      <Link
        href={zhHref}
        onClick={onSelect}
        className={`block px-3 py-1.5 text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] ${
          !isEn ? 'font-medium text-[#171717]' : 'text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#171717]'
        }`}
      >
        简体中文
      </Link>
      <Link
        href={enHref}
        onClick={onSelect}
        className={`block px-3 py-1.5 text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] ${
          isEn ? 'font-medium text-[#171717]' : 'text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#171717]'
        }`}
      >
        English
      </Link>
    </>
  );
}

function DesktopLangMenuLinksFallback({ pathname, isEn, onSelect }: Omit<LangLinksProps, 'search'>) {
  return <DesktopLangMenuLinksContent pathname={pathname} isEn={isEn} onSelect={onSelect} search="" />;
}

function DesktopLangMenuLinks({ pathname, isEn, onSelect }: Omit<LangLinksProps, 'search'>) {
  const searchParams = useSearchParams();
  const search = searchParams?.toString() || '';
  return <DesktopLangMenuLinksContent pathname={pathname} isEn={isEn} onSelect={onSelect} search={search} />;
}

function MobileLangLinksContent({ pathname, isEn, onSelect, search = '' }: LangLinksProps) {
  const zhHref = buildTargetHref(pathname, 'zh', search);
  const enHref = buildTargetHref(pathname, 'en', search);

  return (
    <div className="flex items-center gap-3 text-[14px]">
      <Link
        href={zhHref}
        onClick={onSelect}
        className={`min-h-[44px] inline-flex items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] ${
          !isEn ? 'font-medium text-[#171717]' : 'text-[#52525B]'
        }`}
      >
        简体中文
      </Link>
      <span className="text-[#E4E4E7]" aria-hidden="true">|</span>
      <Link
        href={enHref}
        onClick={onSelect}
        className={`min-h-[44px] inline-flex items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] ${
          isEn ? 'font-medium text-[#171717]' : 'text-[#52525B]'
        }`}
      >
        English
      </Link>
    </div>
  );
}

function MobileLangLinksFallback({ pathname, isEn, onSelect }: Omit<LangLinksProps, 'search'>) {
  return <MobileLangLinksContent pathname={pathname} isEn={isEn} onSelect={onSelect} search="" />;
}

function MobileLangLinks({ pathname, isEn, onSelect }: Omit<LangLinksProps, 'search'>) {
  const searchParams = useSearchParams();
  const search = searchParams?.toString() || '';
  return <MobileLangLinksContent pathname={pathname} isEn={isEn} onSelect={onSelect} search={search} />;
}
