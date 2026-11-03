import React from 'react';
import { ReadingConsole } from '@/components/tarot/ReadingConsole';
import { HelpCircle, Sparkles, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function YesNoPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* 头部介绍 */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-medium mb-3">
          <HelpCircle className="w-3.5 h-3.5" /> 快速倾向决断
        </span>
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#1E1B18]">
          是否塔罗（Yes or No）
        </h1>
        <p className="text-xs sm:text-sm text-[#736B5E] mt-2 max-w-lg mx-auto">
          面临二选一或举棋不定？单张神谕快速揭示事情的吉凶倾向、主要阻碍与破局转折。
        </p>

        {/* 规则三态小贴士 */}
        <div className="mt-5 flex flex-wrap justify-center gap-4 text-xs">
          <span className="flex items-center gap-1 text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> 正位阳性能量（Yes / 积极可为）
          </span>
          <span className="flex items-center gap-1 text-rose-800 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" /> 逆位或警示牌（No / 暂缓避险）
          </span>
          <span className="flex items-center gap-1 text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> 中性水象/变牌（Maybe / 需待机缘）
          </span>
        </div>
      </div>

      <ReadingConsole defaultCategory="decision" />
    </div>
  );
}
