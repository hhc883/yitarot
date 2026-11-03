import React, { Suspense } from 'react';
import { ReadingConsole } from '@/components/tarot/ReadingConsole';

function ReadingContent() {
  return <ReadingConsole defaultCategory="love" />;
}

export default function ReadingPage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <Suspense
        fallback={
          <div className="py-20 text-center text-xs text-[#736B5E] animate-pulse">
            正在载入神谕牌阵...
          </div>
        }
      >
        <ReadingContent />
      </Suspense>
    </div>
  );
}
