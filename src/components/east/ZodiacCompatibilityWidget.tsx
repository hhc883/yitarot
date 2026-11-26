'use client';

import React, { useState } from 'react';
import { ZODIAC_SIGNS, getZodiacBranchRuleMatch } from '@/lib/metaphysics/compatibility';

export function ZodiacCompatibilityWidget({ lang = 'zh' }: { lang?: string }) {
  const isEn = lang === 'en';
  const [signAId, setSignAId] = useState<string>('dragon');
  const [signBId, setSignBId] = useState<string>('rooster');

  const match = getZodiacBranchRuleMatch(signAId, signBId);
  const { signA, signB, branchA, branchB, ruleType, citation, sixHarmonyElement, triadInfo } = match;

  // Quick swap for mobile thumb-friendly workflow
  const handleSwap = () => {
    setSignAId(signBId);
    setSignBId(signAId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-zinc-900">
      {/* Short localized H1 and concrete intro */}
      <header className="w-full text-center mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-zinc-900">
          {isEn ? 'Zodiac Compatibility' : '生肖配对'}
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-zinc-600 max-w-md mx-auto leading-relaxed">
          {isEn
            ? 'Map two Chinese zodiac signs to their Earthly Branches and look up Six Harmonies, Three Harmonies triads, and Six Clashes in Sanming Tonghui Vol. 2.'
            : '将双方生肖映射为对应地支，依据《三命通會》卷二核对地支六合、三合与六冲条目。'}
        </p>
      </header>

      {/* Input setup card: thumb-friendly fields and mode selectors */}
      <section
        aria-labelledby="zodiac-select-heading"
        className="w-full rounded-sm bg-white border border-zinc-200 p-5 sm:p-6 mb-8 shadow-xs"
      >
        <h2 id="zodiac-select-heading" className="sr-only">
          {isEn ? 'Select Zodiac Signs' : '选择生肖'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-end">
          <div>
            <label
              htmlFor="first-zodiac-select"
              className="block text-xs font-semibold text-zinc-800 mb-1.5"
            >
              {isEn ? 'First Zodiac' : '一方生肖'}
            </label>
            <select
              id="first-zodiac-select"
              value={signAId}
              onChange={e => setSignAId(e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-sm bg-zinc-50 border border-zinc-300 text-sm text-zinc-900 transition-colors focus:bg-white focus:border-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            >
              {ZODIAC_SIGNS.map(s => (
                <option key={s.id} value={s.id}>
                  {s.emoji} {isEn ? `${s.nameEn} (${s.element})` : `${s.nameZh}（五行属${s.elementZh}）`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="second-zodiac-select"
              className="block text-xs font-semibold text-zinc-800 mb-1.5"
            >
              {isEn ? 'Second Zodiac' : '另一方生肖'}
            </label>
            <select
              id="second-zodiac-select"
              value={signBId}
              onChange={e => setSignBId(e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-sm bg-zinc-50 border border-zinc-300 text-sm text-zinc-900 transition-colors focus:bg-white focus:border-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            >
              {ZODIAC_SIGNS.map(s => (
                <option key={s.id} value={s.id}>
                  {s.emoji} {isEn ? `${s.nameEn} (${s.element})` : `${s.nameZh}（五行属${s.elementZh}）`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick pair switcher / primary button */}
        <div className="mt-5 pt-4 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            type="button"
            onClick={handleSwap}
            className="inline-flex items-center justify-center min-h-[40px] px-3 py-2 rounded-sm bg-zinc-100 hover:bg-zinc-200 text-xs font-medium text-zinc-700 transition-colors cursor-pointer border border-zinc-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          >
            {isEn ? '⇄ Swap Positions' : '⇄ 对调双方生肖'}
          </button>

          <button
            type="button"
            className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-sm bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 text-white text-sm font-medium tracking-wide transition-colors cursor-pointer text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            onClick={() => {
              // Ensure accessibility focus jump / confirmation in mobile view
              const resultEl = document.getElementById('zodiac-compatibility-result');
              if (resultEl) {
                resultEl.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            {isEn ? 'View Analysis' : '查看合盘分析'}
          </button>
        </div>
      </section>

      {/* Result showcase */}
      <section
        id="zodiac-compatibility-result"
        aria-labelledby="zodiac-result-heading"
        className="w-full rounded-sm bg-white border border-zinc-200 p-5 sm:p-6 mb-8 shadow-xs"
      >
        <h2 id="zodiac-result-heading" className="sr-only">
          {isEn ? 'Compatibility Result' : '配对结果'}
        </h2>

        {/* Animal -> Earthly Branch Mapping */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-5 mb-5 border-b border-zinc-200">
          <div className="p-3.5 rounded-sm bg-zinc-50 border border-zinc-200">
            <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 block">
              {isEn ? 'First Sign → Earthly Branch' : '一方生肖 → 对应地支'}
            </span>
            <p className="mt-1 font-serif text-lg text-zinc-900">
              {signA.emoji} {isEn ? signA.nameEn : signA.nameZh} → {branchA.char} ({branchA.pinyin})
            </p>
            <p className="mt-0.5 text-xs text-zinc-600">
              {isEn ? `Branch element: ${signA.element}` : `地支五行：${signA.elementZh}`}
            </p>
          </div>
          <div className="p-3.5 rounded-sm bg-zinc-50 border border-zinc-200">
            <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 block">
              {isEn ? 'Second Sign → Earthly Branch' : '另一方生肖 → 对应地支'}
            </span>
            <p className="mt-1 font-serif text-lg text-zinc-900">
              {signB.emoji} {isEn ? signB.nameEn : signB.nameZh} → {branchB.char} ({branchB.pinyin})
            </p>
            <p className="mt-0.5 text-xs text-zinc-600">
              {isEn ? `Branch element: ${signB.element}` : `地支五行：${signB.elementZh}`}
            </p>
          </div>
        </div>

        {/* Matched Rule & Classical Citation */}
        <div className="border-b border-zinc-200 pb-5 mb-5 space-y-2.5">
          <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 block">
            {isEn ? 'Matched Earthly Branch Rule' : '地支规则匹配结果'}
          </span>

          {ruleType === 'six_harmony' && (
            <>
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-zinc-900">
                {isEn
                  ? `Six Harmonies: ${branchA.char} + ${branchB.char}`
                  : `地支六合：${branchA.char}${branchB.char}`}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
                {isEn
                  ? `${signA.nameEn} (${branchA.char}) and ${signB.nameEn} (${branchB.char}) form a Six Harmonies pair${sixHarmonyElement ? ` (${sixHarmonyElement.en})` : ''} in the classical Earthly Branch six-harmony table.`
                  : `${signA.nameZh}（${branchA.char}）与${signB.nameZh}（${branchB.char}）属于地支六合配对${sixHarmonyElement ? `（传统归类：合${sixHarmonyElement.zh}）` : ''}。`}
              </p>
            </>
          )}

          {ruleType === 'three_harmony_pair' && triadInfo && (
            <>
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-zinc-900">
                {isEn
                  ? `Two Signs from the Same Three Harmonies Triad: ${branchA.char} + ${branchB.char}`
                  : `三合局同组两支：${branchA.char}、${branchB.char}`}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
                {isEn
                  ? `${signA.nameEn} (${branchA.char}) and ${signB.nameEn} (${branchB.char}) are two of the three signs in the ${triadInfo.branches.join('')} (${triadInfo.elementEn}) Three Harmonies triad. The third sign in this triad is ${triadInfo.missingSign.emoji} ${triadInfo.missingSign.nameEn} (${triadInfo.missingBranch}). Two signs alone do not constitute a complete three-branch formation.`
                  : `${signA.nameZh}（${branchA.char}）与${signB.nameZh}（${branchB.char}）同属「${triadInfo.branches.join('')}」三合${triadInfo.elementZh}局中的两支；该三合局的第三支为 ${triadInfo.missingSign.emoji} ${triadInfo.missingSign.nameZh}（${triadInfo.missingBranch}）。仅有两支时不构成完整的三支全合。`}
              </p>
            </>
          )}

          {ruleType === 'six_clash' && (
            <>
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-zinc-900">
                {isEn
                  ? `Six Clashes: ${branchA.char} vs. ${branchB.char}`
                  : `地支六冲：${branchA.char}${branchB.char}相冲`}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
                {isEn
                  ? `${signA.nameEn} (${branchA.char}) and ${signB.nameEn} (${branchB.char}) form a direct Six Clash pair in the classical Earthly Branch clash table.`
                  : `${signA.nameZh}（${branchA.char}）与${signB.nameZh}（${branchB.char}）属于地支六冲对冲关系。`}
              </p>
            </>
          )}

          {ruleType === 'same_sign' && (
            <>
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-zinc-900">
                {isEn
                  ? `Same Sign (Identical Branch: ${branchA.char} & ${branchB.char})`
                  : `相同生肖（同地支：${branchA.char}）`}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
                {isEn
                  ? `Both selections map to ${signA.nameEn} (${branchA.char}). Six Harmonies (§論支元六合), Three Harmonies (§論支元三合), and Six Clashes (§論衝擊) are defined between distinct branches, so none of these three pair rules apply here.`
                  : `双方均对应${signA.nameZh}（${branchA.char}）。《三命通會》卷二〈論支元六合〉、〈論支元三合〉与〈論衝擊〉均针对不同地支之间的关系，同支不命中上述三条合冲规则。`}
              </p>
            </>
          )}

          {ruleType === 'none' && (
            <>
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-zinc-900">
                {isEn
                  ? `No Match in Six Harmonies, Three Harmonies, or Six Clashes (${branchA.char} & ${branchB.char})`
                  : `未命中六合、三合或六冲（${branchA.char} 与 ${branchB.char}）`}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
                {isEn
                  ? `${signA.nameEn} (${branchA.char}) and ${signB.nameEn} (${branchB.char}) do not appear together in Six Harmonies (§論支元六合), Three Harmonies (§論支元三合), or Six Clashes (§論衝擊). Because none of those rules match, no compatibility score or relationship verdict is assigned.`
                  : `${signA.nameZh}（${branchA.char}）与${signB.nameZh}（${branchB.char}）在《三命通會》卷二〈論支元六合〉、〈論支元三合〉与〈論衝擊〉中均无直接对应条目。因缺乏上述规则依据，本工具不给出评分或吉凶定语。`}
              </p>
            </>
          )}

          {citation && (
            <p className="text-xs text-zinc-600 pt-1">
              {isEn ? 'Source: ' : '典籍出处：'}
              <a
                href={citation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 text-zinc-800 hover:text-zinc-950"
              >
                {isEn
                  ? `${citation.bookEn} · ${citation.chapterEn}`
                  : `${citation.bookZh} · ${citation.chapterZh}`}
              </a>
            </p>
          )}
        </div>

        {/* Rule Scope */}
        <div className="p-4 rounded-sm bg-zinc-50 border border-zinc-200 space-y-1.5">
          <h4 className="text-xs font-semibold text-zinc-800">
            {isEn ? 'Rule Scope & Limitations' : '规则范围与局限说明'}
          </h4>
          <p className="text-xs text-zinc-600 leading-relaxed">
            {isEn
              ? 'This lookup checks only the Year Branch (zodiac animal) against three classical branch-pair rules (Six Harmonies, Three Harmonies, and Six Clashes). It does not inspect Month, Day, or Hour pillars, branch penalties/harms, or full natal charts, and therefore does not produce numerical compatibility scores or relationship predictions.'
              : '本查询仅将双方年支（生肖）对照传统地支六合、三合与六冲三条规则，未纳入月柱、日柱、时柱、刑害及全盘生克，故不生成契合度分数或恋爱、婚姻、事业等泛化运势断语。'}
          </p>
        </div>
      </section>
    </div>
  );
}
