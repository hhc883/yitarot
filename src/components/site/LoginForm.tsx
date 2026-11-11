'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Google 品牌四色 G 标 */
function GoogleMark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export function LoginForm({ lang = 'zh' }: { lang?: string }) {
  const isEn = lang === 'en';
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const redirectingRef = useRef(false);

  // 已登录用户直接进入账号页；展示回调失败标记
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'auth') {
      const timer = window.setTimeout(() => {
        setError(isEn ? 'Sign-in failed, please try again.' : '登录失败，请重试。');
      }, 0);
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user && !redirectingRef.current) {
          if (timer) window.clearTimeout(timer);
          redirectingRef.current = true;
          router.replace(`/${lang}/account`);
        }
      });
      return () => window.clearTimeout(timer);
    }
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && !redirectingRef.current) {
        redirectingRef.current = true;
        router.replace(`/${lang}/account`);
      }
    });
  }, [supabase, router, lang, isEn]);

  const accountPath = `/${lang}/account`;

  const handleGoogle = async () => {
    setError('');
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(accountPath)}`
      }
    });
    if (oauthError) {
      setError(isEn ? 'Could not start Google sign-in.' : '无法发起 Google 登录。');
    }
  };

  const handleSendCode = async () => {
    if (!EMAIL_RE.test(email.trim())) {
      setError(isEn ? 'Please enter a valid email address.' : '请输入有效的邮箱地址。');
      return;
    }
    setError('');
    setSending(true);
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(accountPath)}`
      }
    });
    setSending(false);
    if (otpError) {
      setError(isEn ? 'Could not send the code. Please try again.' : '验证码发送失败，请稍后再试。');
      return;
    }
    setCodeSent(true);
  };

  const handleVerify = async () => {
    if (!code.trim()) {
      setError(isEn ? 'Please enter the verification code.' : '请输入验证码。');
      return;
    }
    setError('');
    setVerifying(true);
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: 'email'
    });
    setVerifying(false);
    if (verifyError) {
      setError(isEn ? 'The code is incorrect or has expired.' : '验证码不正确或已过期。');
      return;
    }
    router.refresh();
    router.push(accountPath);
  };

  const inputClass =
    'h-11 w-full rounded-[10px] border border-line bg-white px-4 text-[14px] text-ink placeholder:text-whisper outline-none transition-[border-color,box-shadow] duration-200 focus:border-ink/40 focus:shadow-[0_0_0_3px_rgba(10,10,10,0.05)]';

  return (
    <div className="w-full max-w-[420px]">
      <div className="rounded-[16px] border border-line bg-white p-8 sm:p-10">
        <h1 className="text-center font-serif text-[26px] font-normal tracking-[-0.01em] text-ink">
          {isEn ? 'Welcome back' : '欢迎回来'}
        </h1>
        <p className="mt-2 text-center text-[13px] text-soft">
          {isEn ? 'Sign in to continue your readings.' : '登录后继续你的测算与积分。'}
        </p>

        {/* Google 登录 */}
        <button
          type="button"
          onClick={handleGoogle}
          className="mt-8 flex h-11 w-full items-center justify-center gap-3 rounded-full border border-line bg-white text-[14px] font-medium text-ink transition-[border-color,box-shadow] duration-200 hover:border-ink/25 hover:shadow-[0_10px_26px_-18px_rgba(10,10,10,0.35)]"
        >
          <GoogleMark />
          <span>{isEn ? 'Sign in with Google' : '使用 Google 登录'}</span>
        </button>

        {/* 分割线 */}
        <div className="my-7 flex items-center gap-4">
          <span className="h-px flex-1 bg-line" />
          <span className="text-[12px] text-whisper">{isEn ? 'or continue with email' : '或用邮箱登录'}</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        {/* 邮箱 + 验证码 */}
        <div className="flex gap-2">
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !codeSent) handleSendCode();
            }}
            placeholder={isEn ? 'Email address' : '邮箱地址'}
            className={inputClass}
            aria-label={isEn ? 'Email address' : '邮箱地址'}
          />
          <button
            type="button"
            onClick={handleSendCode}
            disabled={sending}
            className="h-11 shrink-0 rounded-[10px] border border-ink px-4 text-[13px] text-ink transition-colors duration-200 hover:bg-mist disabled:opacity-50"
          >
            {sending ? (isEn ? 'Sending…' : '发送中…') : isEn ? 'Send code' : '发送验证码'}
          </button>
        </div>

        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleVerify();
          }}
          placeholder={isEn ? '6-digit code' : '6 位验证码'}
          className={`${inputClass} mt-3 tracking-[0.3em] ${codeSent ? '' : 'opacity-60'}`}
          aria-label={isEn ? 'Verification code' : '验证码'}
          maxLength={6}
        />

        <button
          type="button"
          onClick={handleVerify}
          disabled={verifying}
          className="mt-6 h-12 w-full rounded-full bg-ink text-[14px] text-white transition-opacity duration-200 hover:opacity-80 disabled:opacity-50"
        >
          {verifying ? (isEn ? 'Signing in…' : '登录中…') : isEn ? 'Sign in' : '登录'}
        </button>

        {error ? (
          <p className="mt-4 text-center text-[12.5px] text-[#B84034]" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <p className="mt-6 text-center text-[12px] leading-relaxed text-whisper">
        {isEn
          ? 'By signing in you agree to the Terms of Service and Privacy Policy.'
          : '登录即代表同意服务条款与隐私政策。'}
      </p>
    </div>
  );
}
