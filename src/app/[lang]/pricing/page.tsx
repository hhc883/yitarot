'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Sparkles, Check, ArrowRight, ShieldCheck, Zap, Heart } from 'lucide-react';
import { IconCrownVip } from '@/components/icons/QiIcons';

export default function PricingPage() {
  const params = useParams();
  const lang = (params?.lang as string) || 'zh';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 sm:py-20 flex flex-col items-center">
      {/* 头部标题 */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C29026]/10 text-[#8C6D23] border border-[#C29026]/20 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5" /> 纯净透明的订阅体系
        </span>
        <h1 className="font-serif font-black text-3xl sm:text-5xl text-[#1E1B18] tracking-tight">
          解锁更深邃的心灵洞察
        </h1>
        <p className="text-xs sm:text-sm text-[#736B5E] mt-3 leading-relaxed">
          普通用户始终可免费体验日常抽牌与基础牌阵。升级 Plus 会员，畅享无限次追问、全套高级全景大阵与多位 AI 导师深度陪伴。
        </p>
      </div>

      {/* 双价格卡片对比 */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        {/* 基础免费版 */}
        <div className="rounded-3xl bg-[#FFFDF9] border border-[#1E1B18]/10 p-8 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#736B5E]">
                免费日常版
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#FAF6ED] text-[#736B5E]">
                永久免费
              </span>
            </div>

            <div className="flex items-baseline gap-1 mb-6">
              <span className="font-serif font-black text-4xl text-[#1E1B18]">¥0</span>
              <span className="text-xs text-[#736B5E]">/ 免费使用</span>
            </div>

            <p className="text-xs text-[#5C5549] mb-6 leading-relaxed">
              适合塔罗初学者或偶尔需要快速灵感点拨的朋友，覆盖日常基础占卜需求。
            </p>

            <ul className="space-y-3 text-xs text-[#1E1B18] pt-4 border-t border-[#1E1B18]/8">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>每日免费 3 次 AI 塔罗占卜</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>支持单张神谕、是否塔罗与经典圣三角</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>免费查阅完整 78 张经典韦特牌义百科</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>抽取每日专属运势日签</span>
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <Link
              href={`/${lang}/reading`}
              className="w-full py-3.5 rounded-2xl bg-[#FAF6ED] hover:bg-[#F2ECE1] text-[#1E1B18] font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors border border-[#1E1B18]/10"
            >
              直接开始免费使用
            </Link>
          </div>
        </div>

        {/* Plus 会员版 */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#FFFDF9] to-[#FAF5EC] border-2 border-[#D4AF37] p-8 shadow-lg flex flex-col justify-between overflow-hidden">
          {/* 热门角标 */}
          <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#1E1B18] text-[10px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">
            Most Popular
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D23] flex items-center gap-1.5">
                <IconCrownVip size={16} /> Tarotip Plus 会员
              </span>
            </div>

            <div className="flex items-baseline gap-1 mb-6">
              <span className="font-serif font-black text-4xl text-[#1E1B18]">¥39</span>
              <span className="text-xs text-[#736B5E]">/ 月（或 ¥298/年 享 6 折）</span>
            </div>

            <p className="text-xs text-[#5C5549] mb-6 leading-relaxed">
              为追求深层自我觉察与高频解惑的探索者打造，解锁无限制 AI 导师深度对话与全景大牌阵。
            </p>

            <ul className="space-y-3 text-xs text-[#1E1B18] pt-4 border-t border-[#1E1B18]/10">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#8C6D23] shrink-0" />
                <strong className="text-[#1E1B18]">无限次 AI 塔罗占卜与多轮追问对话</strong>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#8C6D23] shrink-0" />
                <span>解锁 10 牌凯尔特十字、二选一分叉与爱意三维全景大阵</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#8C6D23] shrink-0" />
                <span>节气限定四季牌阵 & 13 牌流年大运全景排盘</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#8C6D23] shrink-0" />
                <span>三大 AI 塔罗导师（露娜/索菲亚/埃尔登）任意自由切换</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#8C6D23] shrink-0" />
                <span>高清高颜值结缘卡片无水印一键导出</span>
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <button
              onClick={() => {
                alert('演示模式：已为您开启 Tarotip Plus 尊享体验！您可以随时无限次占卜与追问。');
              }}
              className="w-full py-3.5 rounded-2xl bg-[#1E1B18] hover:bg-[#38332D] text-[#FFFDF9] font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>开启 Plus 尊享体验</span>
            </button>
            <p className="text-[10px] text-center text-[#736B5E] mt-2">
              随时可取消 · 7 天无理由退款保障
            </p>
          </div>
        </div>
      </div>

      {/* 常见问题解答 */}
      <div className="w-full max-w-3xl mt-16 pt-12 border-t border-[#1E1B18]/10">
        <h3 className="font-serif font-bold text-xl text-[#1E1B18] text-center mb-8">
          常见疑问解答
        </h3>
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#1E1B18]/8">
            <h4 className="font-bold text-xs text-[#1E1B18] mb-1">
              Q: 为什么 AI 塔罗占卜依然具有深度与准确性？
            </h4>
            <p className="text-xs text-[#5C5549] leading-relaxed">
              A: 塔罗占卜的本质是荣格心理学中的“共时性（Synchronicity）”与潜意识投射。AI 依托庞大的经典象征学知识图谱，能比单一解牌人更加客观、严谨且全面地将牌面站位、花色与元素逻辑同你的具体疑问编织在一起，提供不带主观偏见的清醒镜像。
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#1E1B18]/8">
            <h4 className="font-bold text-xs text-[#1E1B18] mb-1">
              Q: 如果我不满意，可以随时取消订阅吗？
            </h4>
            <p className="text-xs text-[#5C5549] leading-relaxed">
              A: 当然可以。你可以随时在个人中心一键取消自动续费，且购买后 7 天内如果不满意可申请全额退款。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
