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
  tagZh: string;
  tagEn: string;
  subItems: SubNavItem[];
}

export function TarotNavbar({ lang = 'zh' }: { lang?: string }) {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 导航结构与对应子菜单映射 (无任何 Icon，全纯正文人古籍质感)
  const navSections: NavSection[] = [
    {
      key: 'home',
      titleZh: '双门首页',
      titleEn: 'Origins',
      href: `/${lang}`,
      tagZh: '✦ 东西合璧 · 天人之镜 ✦',
      tagEn: 'DUAL PORTALS',
      subItems: [
        {
          titleZh: '全景长卷开幕',
          titleEn: 'Celestial Continuum',
          descZh: '太极两仪、铜钱与塔罗牌破空而起',
          descEn: 'Ancient origins and synchronicity journey',
          href: `/${lang}#portal-content`
        },
        {
          titleZh: '周易命理专厅',
          titleEn: 'Eastern Hub',
          descZh: '天干地支、周易神谕与五行全息',
          descEn: 'Authentic 24 solar terms metaphysics',
          href: `/${lang}/fatemaster`
        },
        {
          titleZh: '西方秘境塔罗',
          titleEn: 'Western Hub',
          descZh: '78 张经典韦特塔罗全解与 AI 占卜',
          descEn: '78 Rider-Waite cards & AI oracle',
          href: `/${lang}/reading`
        }
      ]
    },
    {
      key: 'eastern',
      titleZh: '东方周易',
      titleEn: 'I Ching',
      href: `/${lang}/fatemaster`,
      tagZh: '✦ 东方命理 · 象数相生 ✦',
      tagEn: 'EASTERN METAPHYSICS',
      subItems: [
        {
          titleZh: '东方命理总厅',
          titleEn: 'I Ching Portal',
          descZh: '易经天地之机，东方象数系统全貌',
          descEn: 'The universe of Eastern divination',
          href: `/${lang}/fatemaster`
        },
        {
          titleZh: '四柱八字排盘',
          titleEn: 'Four Pillars BaZi',
          descZh: '节气换柱 · 日主元神 · 十神五行全息',
          descEn: 'Precision solar terms & destiny chart',
          href: `/${lang}/fatemaster/bazi`
        },
        {
          titleZh: '周易六爻神谕',
          titleEn: 'Six Lines Hexagrams',
          descZh: '乾隆通宝 3D 物理掷币 · 动爻定乾坤',
          descEn: '3D coin toss oracle & changing lines',
          href: `/${lang}/fatemaster/liuyao`
        },
        {
          titleZh: '生肖五行合盘',
          titleEn: 'Zodiac Compatibility',
          descZh: '144 组干支配对 · 天作六合与三合',
          descEn: '144 pairwise synergy & balance',
          href: `/${lang}/fatemaster/compatibility`
        }
      ]
    },
    {
      key: 'tarot',
      titleZh: '西方塔罗',
      titleEn: 'Tarot Archetypes',
      href: `/${lang}/reading`,
      tagZh: '✦ 潜意识原型 · 荣格共时 ✦',
      tagEn: 'WESTERN TAROT',
      subItems: [
        {
          titleZh: 'AI 综合深度占卜',
          titleEn: 'Comprehensive Reading',
          descZh: '潜意识同频投射，全景多牌阵解答',
          descEn: 'Multi-spread deep subconscious inquiry',
          href: `/${lang}/reading`
        },
        {
          titleZh: '每日能量运势签',
          titleEn: 'Daily Draw Oracle',
          descZh: '晨起一抽 · 今日时空与心念指引',
          descEn: 'Align your morning frequency',
          href: `/${lang}/fortune/daily`
        },
        {
          titleZh: '是否神谕 (Yes or No)',
          titleEn: 'Yes / No Quick Oracle',
          descZh: '单张神谕 · 迷茫时刻的关键行动契机',
          descEn: 'Direct guidance for clear decisions',
          href: `/${lang}/yes-no`
        },
        {
          titleZh: '爱情与关系解读',
          titleEn: 'Love & Relationships',
          descZh: '双人能量共振场 · 深度情感羁绊透视',
          descEn: 'Subconscious mirrors of bonding',
          href: `/${lang}/love`
        }
      ]
    },
    {
      key: 'cards',
      titleZh: '牌义典藏',
      titleEn: 'Card Codex',
      href: `/${lang}/cards`,
      tagZh: '✦ 78 张经典韦特全解 ✦',
      tagEn: 'TAROT ENCYCLOPEDIA',
      subItems: [
        {
          titleZh: '78 张全牌典藏库',
          titleEn: '78 Deck Codex',
          descZh: '大阿卡纳 22 张 + 小阿卡纳 56 张完整图谱',
          descEn: '22 Major & 56 Minor Arcana library',
          href: `/${lang}/cards`
        },
        {
          titleZh: '大阿卡纳核心原形',
          titleEn: 'Major Arcana Spotlight',
          descZh: '愚人、魔术师、命运之轮等灵魂篇章',
          descEn: 'The Fool to The World deep dive',
          href: `/${lang}/cards/the-fool`
        },
        {
          titleZh: '经典牌阵布局详解',
          titleEn: 'Classic Spreads Guide',
          descZh: '单张、时间流、圣三角、凯尔特十字',
          descEn: 'Timeflow, Triangle, Celtic Cross',
          href: `/${lang}/spreads`
        }
      ]
    },
    {
      key: 'pricing',
      titleZh: '会员知命',
      titleEn: 'Membership',
      href: `/${lang}/pricing`,
      tagZh: '✦ 洞见天机 · 智者自省 ✦',
      tagEn: 'MEMBERSHIP & WISDOM',
      subItems: [
        {
          titleZh: '知命会员权益',
          titleEn: 'Membership Plans',
          descZh: '无限制 AI 深度长解 · 高清命盘终身存档',
          descEn: 'Unlimited AI divination & chart archive',
          href: `/${lang}/pricing`
        },
        {
          titleZh: '命理学科学观 FAQ',
          titleEn: 'Wisdom FAQ',
          descZh: '荣格共时性原理与拒绝宿命论承诺',
          descEn: 'Jungian synchronicity & ethical oracle',
          href: `/${lang}/pricing#faq`
        }
      ]
    }
  ];

  // 鼠标悬停管理（带防抖缓冲，避免鼠标微移时下拉框意外关闭）
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
    }, 160);
  };

  const isCurrentActive = (section: NavSection) => {
    if (section.key === 'home') {
      return pathname === `/${lang}` || pathname === `/${lang}/` || pathname === '/';
    }
    return pathname.startsWith(section.href);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F7F3EF]/95 backdrop-blur-md border-b border-[#111111]/8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between">
        
        {/* 左侧品牌区：朱砂赤印 + 典雅字标 */}
        <Link href={`/${lang}`} className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-[3px] border border-[#B84034] text-[#B84034] bg-[rgba(184,64,52,0.06)] flex items-center justify-center font-serif font-black text-sm select-none shadow-2xs group-hover:scale-105 transition-transform duration-300">
            象
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-black text-lg sm:text-xl tracking-tight text-[#111111]">
              QiCosmos
            </span>
            <span className="text-[9px] tracking-[0.22em] text-[#8C8375] uppercase -mt-0.5 font-serif font-medium">
              {lang === 'en' ? 'Cosmic Continuum' : '天仪灵图 · 易境塔罗'}
            </span>
          </div>
        </Link>

        {/* 中间桌面导航：悬停自动展现精美子菜单 */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-10">
          {navSections.map(section => {
            const isActive = isCurrentActive(section);
            const isOpen = activeDropdown === section.key;

            return (
              <div
                key={section.key}
                className="relative py-5"
                onMouseEnter={() => handleMouseEnter(section.key)}
                onMouseLeave={handleMouseLeave}
              >
                {/* 顶层主链接 */}
                <Link
                  href={section.href}
                  className={`relative py-1.5 text-xs lg:text-sm font-serif tracking-wider transition-all duration-200 select-none ${
                    isActive
                      ? 'text-[#111111] font-bold after:content-[""] after:absolute after:-bottom-2.5 after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-[1.5px] after:bg-[#8C6D23]'
                      : 'text-[#6E675B] hover:text-[#111111]'
                  }`}
                >
                  {lang === 'en' ? section.titleEn : section.titleZh}
                </Link>

                {/* 悬停自动弹出子菜单浮层 (带空气垫 bridge 避免鼠标滑脱) */}
                {isOpen && (
                  <div className="absolute top-[52px] left-1/2 -translate-x-1/2 w-[320px] pt-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="rounded-2xl bg-[#FFFDF9] border border-[rgba(200,168,88,0.28)] shadow-xl shadow-[#111111]/8 p-4 backdrop-blur-md">
                      
                      {/* 分类古籍角标 */}
                      <div className="pb-2.5 mb-2.5 border-b border-[#111111]/8 flex items-center justify-between">
                        <span className="text-[10px] font-serif tracking-widest text-[#8C6D23] uppercase font-bold">
                          {lang === 'en' ? section.tagEn : section.tagZh}
                        </span>
                        <span className="text-[9px] font-mono text-[#AAA192]">
                          {section.subItems.length} ITEMS
                        </span>
                      </div>

                      {/* 子菜单列表 */}
                      <div className="flex flex-col gap-1">
                        {section.subItems.map((subItem, idx) => (
                          <Link
                            key={idx}
                            href={subItem.href}
                            onClick={() => setActiveDropdown(null)}
                            className="group/item flex flex-col p-2.5 rounded-xl hover:bg-[#F7F3EF] transition-all duration-200 text-left"
                          >
                            <span className="font-serif font-bold text-xs text-[#111111] group-hover/item:text-[#8C6D23] transition-colors flex items-center justify-between">
                              <span>{lang === 'en' ? subItem.titleEn : subItem.titleZh}</span>
                              <span className="opacity-0 group-hover/item:opacity-100 transition-opacity text-[10px] text-[#8C6D23] font-mono">
                                ↗
                              </span>
                            </span>
                            <span className="text-[11px] text-[#7D7466] mt-0.5 leading-relaxed font-normal">
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

        {/* 右侧操作区：极简双语切换 + 纯字排版仪式感按钮 */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href={lang === 'zh' ? '/en' : '/zh'}
            className="text-[11px] font-serif tracking-widest text-[#7D7466] hover:text-[#111111] transition-colors uppercase px-2 py-1"
          >
            {lang === 'zh' ? 'EN' : '中文'}
          </Link>

          <span className="w-px h-3 bg-[#111111]/15" />

          <Link
            href={`/${lang}/reading`}
            className="px-5 py-2 rounded-full border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#FFFDF9] text-xs font-serif tracking-widest transition-all duration-300 shadow-2xs hover:shadow-sm"
          >
            {lang === 'en' ? 'Consult Oracle' : '凝神起卦'}
          </Link>
        </div>

        {/* 移动端菜单按钮：极简文字设计 */}
        <div className="md:hidden flex items-center gap-3">
          <Link
            href={`/${lang}/reading`}
            className="px-3.5 py-1.5 rounded-full border border-[#111111] text-[11px] font-serif text-[#111111]"
          >
            {lang === 'en' ? 'Oracle' : '起卦'}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-xs font-serif tracking-widest text-[#111111] select-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? 'CLOSE' : 'MENU'}
          </button>
        </div>
      </div>

      {/* 移动端菜单抽屉：支持折叠展开所有子菜单 */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFFDF9] border-b border-[#111111]/10 px-6 pt-3 pb-8 space-y-2 shadow-lg animate-in slide-in-from-top-2 max-h-[80vh] overflow-y-auto">
          {navSections.map(section => {
            const isExpanded = mobileExpandedSection === section.key;

            return (
              <div key={section.key} className="border-b border-[#111111]/6 pb-2">
                <div className="flex items-center justify-between py-2.5">
                  <Link
                    href={section.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-serif font-bold text-[#111111]"
                  >
                    {lang === 'en' ? section.titleEn : section.titleZh}
                  </Link>
                  <button
                    onClick={() => setMobileExpandedSection(isExpanded ? null : section.key)}
                    className="text-xs text-[#8C6D23] px-2 py-1 font-serif"
                    aria-label="Toggle submenu"
                  >
                    {isExpanded ? '收起 ▲' : '详情 ▼'}
                  </button>
                </div>

                {/* 移动端展开的子菜单 */}
                {isExpanded && (
                  <div className="pl-3 pr-1 py-1 space-y-2 bg-[#F7F3EF]/60 rounded-xl my-1 border-l-2 border-[#8C6D23]">
                    {section.subItems.map((sub, sIdx) => (
                      <Link
                        key={sIdx}
                        href={sub.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-1.5 text-xs font-serif text-[#524B40] hover:text-[#111111]"
                      >
                        <span className="font-bold block text-[#111111]">
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

          <div className="pt-4 flex justify-between items-center text-xs font-serif text-[#7D7466]">
            <span>语言选择 / Language</span>
            <Link
              href={lang === 'zh' ? '/en' : '/zh'}
              className="text-[#111111] font-semibold underline underline-offset-4"
            >
              {lang === 'zh' ? 'English' : '中文版'}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
