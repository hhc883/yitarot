'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface BlogCardThumbnailProps {
  href: string;
  src: string;
  alt: string;
}

export function BlogCardThumbnail({ href, src, alt }: BlogCardThumbnailProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    return null;
  }

  return (
    <Link
      href={href}
      tabIndex={-1}
      aria-hidden="true"
      className="shrink-0 block w-20 h-20 sm:w-28 sm:h-24 overflow-hidden rounded-lg border border-[#E4E4E7] bg-[#FAFAFA]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
        onError={() => setFailedSrc(src)}
      />
    </Link>
  );
}
