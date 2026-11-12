'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CONTAINER } from './constants';
import { useUser } from '@/lib/auth/use-user';
import { UserAvatar } from './UserAvatar';

interface NavItem {
  key: string;
  href: string;
  label: string;
  latin?: string;
}

/**
 * 首页 / 东·西 Landing 专用导航：
 * QiCosmos｜东 EAST / 西 WEST / Blog / 会员 Membership｜ZH / EN｜登录（黑色按钮）
 * 首页首屏不出现导航，上滑进入入口区后滑入并固定顶部。
 */
export function SiteNavbar({ lang = 'zh' }: { lang?: string }) {
  const pathname = usePathname() || '';
  const homePath = `/${lang}`;
  const isHome = pathname === homePath || pathname === `${homePath}/`;

  const [pastHero, setPastHero] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { loading: userLoading, user, balance } = useUser();

  // 首屏（100svh）之内不显示导航；非首页由 !isHome 直接可见，无需监听
  useEffect(() => {
    if (!isHome) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        setPastHero(window.scrollY > window.innerHeight * 0.9);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [isHome]);

  // 移动端菜单展开时锁定背景滚动
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  const visible = !isHome || pastHero || menuOpen;

  const items: NavItem[] = [
    { key: 'east', href: `/${lang}/east`, label: '东', latin: 'EAST' },
    { key: 'west', href: `/${lang}/west`, label: '西', latin: 'WEST' },
    { key: 'blog', href: `/${lang}/blog`, label: 'Blog' },
    { key: 'member', href: `/${lang}/pricing`, label: '会员', latin: 'MEMBERSHIP' }
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const switchHref = (target: 'zh' | 'en') => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return `/${target}`;
    if (segments[0] === 'zh' || segments[0] === 'en') {
      segments[0] = target;
    } else {
      segments.unshift(target);
    }
    return `/${segments.join('/')}`;
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-line bg-white/85 backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          visible ? 'translate-y-0' : '-translate-y-full pointer-events-none'
        }`}
        inert={!visible}
      >
      <div className={`${CONTAINER} flex h-16 items-center justify-between gap-6 lg:h-[72px]`}>
        {/* 品牌 */}
        <Link
          href={homePath}
          className="shrink-0 font-serif text-[19px] font-semibold tracking-[-0.015em] text-ink transition-opacity hover:opacity-60"
        >
          QiCosmos
        </Link>

        {/* 桌面导航 */}
        <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex lg:gap-10" aria-label="主导航">
          {items.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`group relative inline-flex items-baseline gap-1.5 py-2 text-[13.5px] transition-colors ${
                  active ? 'text-ink' : 'text-soft hover:text-ink'
                }`}
              >
                <span className={active ? 'font-semibold' : ''}>{item.label}</span>
                {item.latin ? (
                  <span className="font-display text-[10px] tracking-[0.18em] text-[#8C8C8C]">{item.latin}</span>
                ) : null}
                <span
                  className={`pointer-events-none absolute inset-x-0 -bottom-0.5 h-px origin-left bg-ink transition-transform duration-300 ${
                    active ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* 语言 + 登录 */}
        <div className="hidden shrink-0 items-center gap-5 lg:flex">
          <Link
            href={`/${lang}/privacy`}
            className="font-display text-[11px] tracking-[0.14em] text-whisper transition-colors hover:text-ink"
          >
            {lang === 'en' ? 'Privacy' : '隐私'}
          </Link>
          <div className="flex items-center gap-1.5 font-display text-[11px] tracking-[0.14em]">
            <Link
              href={switchHref('zh')}
              className={lang === 'zh' ? 'text-ink' : 'text-whisper transition-colors hover:text-ink'}
              hrefLang="zh"
            >
              ZH
            </Link>
            <span className="text-line">/</span>
            <Link
              href={switchHref('en')}
              className={lang === 'en' ? 'text-ink' : 'text-whisper transition-colors hover:text-ink'}
              hrefLang="en"
            >
              EN
            </Link>
          </div>

          {user ? (
            <Link
              href={`/${lang}/account`}
              className="flex items-center gap-2.5 rounded-full transition-opacity hover:opacity-80"
              title={user.email}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[12.5px] text-ink tabular-nums">
                <span className="text-[10px] leading-none">◆</span>
                <span>{balance}</span>
              </span>
              <UserAvatar user={user} />
            </Link>
          ) : userLoading ? (
            <span className="inline-flex h-9 w-[84px] items-center justify-center rounded-full bg-ink/80" aria-hidden="true" />
          ) : (
            <Link
              href={`/${lang}/login`}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[12.5px] text-white transition-opacity hover:opacity-80"
            >
              <span>登录</span>
              <span className="text-[11px] text-white/60">Log in</span>
            </Link>
          )}
        </div>

        {/* 移动端：余额胶囊（登录后显示） */}
        {user ? (
          <Link
            href={`/${lang}/account`}
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[12px] text-ink tabular-nums lg:hidden"
          >
            <span className="text-[9px] leading-none">◆</span>
            <span>{balance}</span>
          </Link>
        ) : null}

        {/* 移动端菜单按钮 */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
          aria-expanded={menuOpen}
          className="relative z-50 flex h-10 w-10 items-center justify-center lg:hidden"
        >
          <span className="relative block h-3 w-5">
            <span
              className={`absolute left-0 h-px w-full bg-ink transition-transform duration-300 ${
                menuOpen ? 'top-1/2 rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute left-0 h-px w-full bg-ink transition-transform duration-300 ${
                menuOpen ? 'top-1/2 -rotate-45' : 'bottom-0'
              }`}
            />
          </span>
        </button>
        </div>
      </header>

      {/* 移动端抽屉（置于 header 之外，避免 backdrop-filter 影响 fixed 定位） */}
      <div
        className={`fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-white px-6 pb-12 pt-6 lg:hidden ${
          menuOpen ? 'block' : 'hidden'
        }`}
      >
        <nav className="flex flex-col" aria-label="移动端导航">
          {items.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-baseline justify-between border-b border-line py-5"
            >
              <span className={`font-serif text-[22px] ${isActive(item.href) ? 'text-ink' : 'text-soft'}`}>
                {item.label}
              </span>
              {item.latin ? (
                <span className="font-display text-[10px] tracking-[0.2em] text-whisper">{item.latin}</span>
              ) : null}
            </Link>
          ))}
        </nav>

        <Link
          href={`/${lang}/privacy`}
          onClick={() => setMenuOpen(false)}
          className="mt-8 inline-flex items-baseline gap-2 text-[12.5px] text-soft transition-colors hover:text-ink"
        >
          <span>{lang === 'en' ? 'Privacy Policy' : '隐私政策'}</span>
          <span className="font-display text-[10px] tracking-[0.18em] text-whisper">
            {lang === 'en' ? '隐私政策' : 'PRIVACY POLICY'}
          </span>
        </Link>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display text-[12px] tracking-[0.14em]">
            <Link
              href={switchHref('zh')}
              onClick={() => setMenuOpen(false)}
              className={lang === 'zh' ? 'text-ink' : 'text-whisper'}
            >
              ZH
            </Link>
            <span className="text-line">/</span>
            <Link
              href={switchHref('en')}
              onClick={() => setMenuOpen(false)}
              className={lang === 'en' ? 'text-ink' : 'text-whisper'}
            >
              EN
            </Link>
          </div>

          {user ? (
            <Link
              href={`/${lang}/account`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5"
            >
              <UserAvatar user={user} size={30} />
              <span className="flex flex-col leading-tight">
                <span className="text-[12px] text-ink tabular-nums">◆ {balance}</span>
                <span className="max-w-[180px] truncate text-[11px] text-whisper">{user.email}</span>
              </span>
            </Link>
          ) : (
            <Link
              href={`/${lang}/login`}
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-[13px] text-white"
            >
              <span>登录</span>
              <span className="text-[11px] text-white/60">Log in</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
