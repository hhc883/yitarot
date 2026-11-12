import React from 'react';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

type Section = {
  heading: string;
  body?: string;
  items?: { term: string; note?: string }[];
  email?: boolean;
};

type PrivacyContent = {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  sections: Section[];
};

const CONTENT: Record<'zh' | 'en', PrivacyContent> = {
  zh: {
    eyebrow: 'PRIVACY',
    title: '隐私政策',
    updated: '最后更新日期：2026-11-12',
    intro: '本页说明 QiCosmos 收集哪些信息、如何使用，以及你拥有哪些权利。',
    sections: [
      {
        heading: '我们收集什么信息',
        body: '我们只收集提供服务所必需的信息：',
        items: [
          { term: '邮箱地址' },
          { term: 'Google 账号基本信息（头像、名字）' },
          { term: '积分和测算记录' }
        ]
      },
      {
        heading: '信息怎么用',
        body: '只用于登录、发积分、保存测算记录。我们不会把你的信息出售给第三方。'
      },
      {
        heading: '第三方服务',
        items: [
          { term: 'Supabase', note: '存账号和积分' },
          { term: 'Google 登录', note: '用于账号登录' },
          { term: 'Vercel', note: '网站托管' }
        ]
      },
      {
        heading: 'Cookie',
        body: '只用于保持登录状态。'
      },
      {
        heading: '你的权利',
        body: '你可以随时在账号页申请删除账号和数据。'
      },
      {
        heading: '联系方式',
        body: '如有任何问题，请发送邮件至',
        email: true
      }
    ]
  },
  en: {
    eyebrow: 'PRIVACY',
    title: 'Privacy Policy',
    updated: 'Last updated: 2026-11-12',
    intro: 'This page explains what QiCosmos collects, how it is used, and the rights you have.',
    sections: [
      {
        heading: 'What we collect',
        body: 'We collect only what is needed to provide the service:',
        items: [
          { term: 'Email address' },
          { term: 'Basic Google account info (avatar, name)' },
          { term: 'Points and reading records' }
        ]
      },
      {
        heading: 'How we use it',
        body: 'Only to sign you in, grant points, and save your reading records. We never sell your information to third parties.'
      },
      {
        heading: 'Third-party services',
        items: [
          { term: 'Supabase', note: 'stores accounts and points' },
          { term: 'Google Sign-In', note: 'authentication' },
          { term: 'Vercel', note: 'hosting' }
        ]
      },
      {
        heading: 'Cookies',
        body: 'Cookies are used only to keep you signed in.'
      },
      {
        heading: 'Your rights',
        body: 'You can request deletion of your account and data at any time from your account page.'
      },
      {
        heading: 'Contact',
        body: 'For any questions, please email',
        email: true
      }
    ]
  }
};

const CONTACT_EMAIL = 'hhc2062512675@gmail.com';

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const content = CONTENT[lang];

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-[840px] px-6 sm:px-8">
        <header className="pt-16 sm:pt-24 lg:pt-[132px]">
          <p className="font-display text-[11px] tracking-[0.32em] text-whisper sm:text-[12px]">
            {content.eyebrow}
          </p>
          <h1 className="mt-4 font-serif text-[clamp(30px,4vw,52px)] font-normal leading-[1.1] tracking-[-0.01em] text-ink">
            {content.title}
          </h1>
          <p className="mt-5 text-[12.5px] text-whisper">{content.updated}</p>
          <p className="mt-8 text-[15px] leading-[1.95] text-soft">{content.intro}</p>
        </header>

        <div className="mt-14 space-y-12 pb-24 lg:mt-20 lg:space-y-14 lg:pb-[120px]">
          {content.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-serif text-[20px] font-semibold leading-[1.3] tracking-[-0.01em] text-ink sm:text-[22px]">
                {section.heading}
              </h2>

              {section.body ? (
                <p className="mt-4 text-[15px] leading-[1.95] text-soft">
                  {section.body}{' '}
                  {section.email ? (
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-ink"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  ) : null}
                </p>
              ) : null}

              {section.items ? (
                <ul className="mt-5 space-y-3">
                  {section.items.map((item) => (
                    <li key={item.term} className="flex gap-3 text-[15px] leading-[1.85] text-soft">
                      <span
                        className="mt-[0.78em] h-px w-3 shrink-0 bg-ink/25"
                        aria-hidden="true"
                      />
                      <span>
                        <span className="text-ink">{item.term}</span>
                        {item.note ? <span className="text-whisper"> — {item.note}</span> : null}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
