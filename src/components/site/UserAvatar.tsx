import React from 'react';

interface UserAvatarProps {
  user: {
    avatar_url?: string;
    display_name?: string;
    email?: string;
  };
  size?: number;
  className?: string;
}

/** 用户头像：优先 avatar_url（Google 头像），否则首字母黑底圆形 */
export function UserAvatar({ user, size = 28, className = '' }: UserAvatarProps) {
  const initial = (user.display_name || user.email || '?').trim().charAt(0).toUpperCase() || '?';

  if (user.avatar_url) {
    return (
      // Google 头像域名不固定，统一走原生 img（避免 next/image 远端白名单耦合）
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.avatar_url}
        alt=""
        referrerPolicy="no-referrer"
        width={size}
        height={size}
        className={`rounded-full border border-line object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-ink font-medium text-white ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}
