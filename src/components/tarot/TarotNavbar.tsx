'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SubNavItem {
  titleZh: string;
  titleEn: string;
  descZh: string;
  descEn: string;
  href: string;
}

interface NavSection {
  key: string;
  titleZh: string;
  titleEn: string;
  href: string;
  subItems: SubNavItem[];
}

export function TarotNavbar({ lang = 'zh' }: { lang?: string }) {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 极简线性导航结构 (去标语、去次要标签、内容直达)
  const navSections: NavSection[] = [
    {
      key: 'home',
      titleZh: '首页',
      titleEn: 'Home',
      href: `/${lang}`,
      subItems: []
    },
    {
      key: 'eastern',
      titleZh: '东方周易',
      titleEn: 'I Ching',
      href: `/${lang}/fatemaster`,
      subItems: [
        {
          titleZh: '命理总厅',
          titleEn: 'Overview',
          descZh: '周易象数与命理系统概览',
          descEn: 'Eastern metaphysics overview',
          href: `/${lang}/fatemaster`
        },
        {
          titleZh: '四柱八字',
          titleEn: 'BaZi Chart',
          descZh: '节气换柱与五行生克',
          descEn: 'Solar terms & four pillars',
          href: `/${lang}/fatemaster/bazi`
        },
        {
          titleZh: '六爻神谕',
          titleEn: 'Six Lines',
          descZh: '3D 铜钱起卦与变爻推演',
          descEn: '3D coin toss & hexagram lines',
          href: `/${lang}/fatemaster/liuyao`
        },
        {
          titleZh: '生肖合盘',
          titleEn: 'Compatibility',
          descZh: '144 组干支六合与三合',
          descEn: 'Pairwise balance & resonance',
          href: `/${lang}/fatemaster/compatibility`
        }
      ]
    },
    {
      key: 'tarot',
      titleZh: '西方塔罗',
      titleEn: 'Tarot',
      href: `/${lang}/reading`,
      subItems: [
        {
          titleZh: '深度占卜',
          titleEn: 'AI Reading',
          descZh: '潜意识投射与多牌阵解答',
          descEn: 'Subconscious archetypes & inquiry',
          href: `/${lang}/reading`
        },
        {
          titleZh: '每日一签',
          titleEn: 'Daily Draw',
          descZh: '今日专属能量卡牌',
          descEn: 'Daily archetype & clarity',
          href: `/${lang}/fortune/daily`
        },
        {
          titleZh: '是否神谕',
          titleEn: 'Yes / No',
          descZh: '清晰决断的快速指引',
          descEn: 'Single card direct clarity',
          href: `/${lang}/yes-no`
        },
        {
          titleZh: '爱情关系',
          titleEn: 'Love & Bond',
          descZh: '双人能量场与情感羁绊',
          descEn: 'Relationship resonance mirror',
          href: `/${lang}/love`
        }
      ]
    },
    {
      key: 'cards',
      titleZh: '牌义典藏',
      titleEn: 'Codex',
      href: `/${lang}/cards`,
      subItems: [
        {
          titleZh: '78 牌全集',
          titleEn: '78 Deck',
          descZh: '大阿卡纳与小阿卡纳详解',
          descEn: 'Complete Rider-Waite cards',
          href: `/${lang}/cards`
        },
        {
          titleZh: '核心大牌',
          titleEn: 'Major Arcana',
          descZh: '22 张原型历程详解',
          descEn: '22 archetype journeys',
          href: `/${lang}/cards/the-fool`
        },
        {
          titleZh: '经典牌阵',
          titleEn: 'Spreads',
          descZh: '时间流、圣三角与凯尔特十字',
          descEn: 'Classic spread layouts',
          href: `/${lang}/spreads`
        }
      ]
    },
    {
      key: 'pricing',
      titleZh: '会员知命',
      titleEn: 'Pricing',
      href: `/${lang}/pricing`,
      subItems: [
        {
          titleZh: '会员权益',
          titleEn: 'Plans',
          descZh: '无限推演与命盘存档',
          descEn: 'Unlimited reading & archive',
          href: `/${lang}/pricing`
        },
        {
          titleZh: '常见问题',
          titleEn: 'FAQ',
          descZh: '占卜原理与隐私保障',
          descEn: 'Philosophy & privacy',
          href: `/${lang}/pricing#faq`
        }
      ]
    }
  ];

  const handleMouseEnter = (key: string) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setActiveDropdown(key);
  };

  const handleMouseLeave = () => {
    leaveTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 120);
  };

  const isCurrentActive = (section: NavSection) => {
    if (section.key === 'home') {
      return pathname === `/${lang}` || pathname === `/${lang}/` || pathname === '/';
    }
    return pathname.startsWith(section.href);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F7F3EF]/95 backdrop-blur-md border-b border-[#111111]/8 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* 左侧品牌区：纯净自然字标，去多余标语 */}
        <Link href={`/${lang}`} className="flex items-center gap-2 group">
          <span className="font-serif font-black text-xl tracking-tight text-[#111111] group-hover:opacity-80 transition-opacity">
            QiCosmos
          </span>
        </Link>

        {/* 中间桌面导航：极简文人排版，纯文字律动 */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {navSections.map(section => {
            const isActive = isCurrentActive(section);
            const hasSubItems = section.subItems && section.subItems.length > 0;
            const isOpen = hasSubItems && activeDropdown === section.key;

            return (
              <div
                key={section.key}
                className="relative py-4"
                onMouseEnter={hasSubItems ? () => handleMouseEnter(section.key) : undefined}
                onMouseLeave={hasSubItems ? handleMouseLeave : undefined}
              >
                <Link
                  href={section.href}
                  className={`relative py-1 text-xs lg:text-sm font-serif tracking-wider transition-all duration-200 select-none ${
                    isActive
                      ? 'text-[#111111] font-bold after:content-[""] after:absolute after:-bottom-2.5 after:left-1/2 after:-translate-x-1/2 after:w-3.5 after:h-[1.5px] after:bg-[#8C6D23]'
                      : 'text-[#6E675B] hover:text-[#111111]'
                  }`}
                >
                  {lang === 'en' ? section.titleEn : section.titleZh}
                </Link>

                {/* 悬停自动弹出极简子菜单 (去标语、去计数，纯粹高效) */}
                {isOpen && (
                  <div className="absolute top-[48px] left-1/2 -translate-x-1/2 w-[260px] pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="rounded-xl bg-[#FFFDF9] border border-[#111111]/10 shadow-lg shadow-[#111111]/4 p-2 backdrop-blur-md">
                      <div className="flex flex-col gap-0.5">
                        {section.subItems.map((subItem, idx) => (
                          <Link
                            key={idx}
                            href={subItem.href}
                            onClick={() => setActiveDropdown(null)}
                            className="group/item flex flex-col px-3 py-2 rounded-lg hover:bg-[#F7F3EF] transition-colors duration-150 text-left"
                          >
                            <span className="font-serif font-semibold text-xs text-[#111111] group-hover/item:text-[#8C6D23] transition-colors">
                              {lang === 'en' ? subItem.titleEn : subItem.titleZh}
                            </span>
                            <span className="text-[11px] text-[#7D7466] leading-snug mt-0.5">
                              {lang === 'en' ? subItem.descEn : subItem.descZh}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* 右侧操作区：极简双语与纯文字按钮 */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href={lang === 'zh' ? '/en' : '/zh'}
            className="text-[11px] font-serif tracking-widest text-[#7D7466] hover:text-[#111111] transition-colors uppercase px-1.5 py-1"
          >
            {lang === 'zh' ? 'EN' : '中文'}
          </Link>

          <Link
            href={`/${lang}/reading`}
            className="px-4 py-1.5 rounded-full border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#FFFDF9] text-xs font-serif tracking-wider transition-all duration-200"
          >
            {lang === 'en' ? 'Oracle' : '起卦'}
          </Link>
        </div>

        {/* 移动端菜单按钮 */}
        <div className="md:hidden flex items-center gap-3">
          <Link
            href={`/${lang}/reading`}
            className="px-3 py-1 rounded-full border border-[#111111] text-[11px] font-serif text-[#111111]"
          >
            {lang === 'en' ? 'Oracle' : '起卦'}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 text-xs font-serif tracking-widest text-[#111111] select-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? 'CLOSE' : 'MENU'}
          </button>
        </div>
      </div>

      {/* 移动端菜单抽屉 */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFFDF9] border-b border-[#111111]/10 px-6 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 max-h-[80vh] overflow-y-auto">
          {navSections.map(section => {
            const isExpanded = mobileExpandedSection === section.key;

            return (
              <div key={section.key} className="border-b border-[#111111]/6 pb-2">
                <div className="flex items-center justify-between py-2">
                  <Link
                    href={section.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-serif font-bold text-[#111111]"
                  >
                    {lang === 'en' ? section.titleEn : section.titleZh}
                  </Link>
                  {section.subItems && section.subItems.length > 0 && (
                    <button
                      onClick={() => setMobileExpandedSection(isExpanded ? null : section.key)}
                      className="text-xs text-[#8C6D23] px-2 py-1 font-serif"
                      aria-label="Toggle submenu"
                    >
                      {isExpanded ? '收起' : '展开'}
                    </button>
                  )}
                </div>

                {isExpanded && section.subItems && section.subItems.length > 0 && (
                  <div className="pl-3 pr-1 py-1 space-y-2 bg-[#F7F3EF]/60 rounded-lg my-1 border-l border-[#8C6D23]">
                    {section.subItems.map((sub, sIdx) => (
                      <Link
                        key={sIdx}
                        href={sub.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-1 text-xs font-serif text-[#524B40] hover:text-[#111111]"
                      >
                        <span className="font-semibold block text-[#111111]">
                          {lang === 'en' ? sub.titleEn : sub.titleZh}
                        </span>
                        <span className="text-[10px] text-[#7D7466]">
                          {lang === 'en' ? sub.descEn : sub.descZh}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-3 flex justify-between items-center text-xs font-serif text-[#7D7466]">
            <span>语言</span>
            <Link
              href={lang === 'zh' ? '/en' : '/zh'}
              className="text-[#111111] font-semibold underline underline-offset-4"
            >
              {lang === 'zh' ? 'English' : '中文'}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
