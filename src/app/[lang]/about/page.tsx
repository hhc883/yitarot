import { use } from "react";
import Link from "next/link";
import { ShieldCheck, Compass, Sparkles, HeartHandshake, Lock, ArrowRight } from "lucide-react";
import { Locale } from "@/lib/i18n/dictionaries";

export default function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = use(params);
  const lang: Locale = rawLang === "zh" ? "zh" : "en";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="zen-badge">
          <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>{lang === "en" ? "Trust, Lineage & Methodology" : "传承、算法与学术伦理"}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-100">
          {lang === "en" ? (
            <>
              About <span className="gold-gradient-text">QiCosmos</span>
            </>
          ) : (
            <>
              关于 <span className="gold-gradient-text">天仪灵图 (QiCosmos)</span>
            </>
          )}
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          {lang === "en"
            ? "Bridging three millennia of Eastern cosmology with contemporary analytical psychology. Our mission, mathematical rigor, and ethical commitment."
            : "连接三千年东方宇宙观与现代深度心理学。我们的创立初心、天文算法体系与学术伦理宣言。"}
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="zen-card p-6 sm:p-8 space-y-4">
        <h2 className="text-xl font-serif font-bold text-slate-100">
          {lang === "en" ? "Our Core Philosophy" : "我们的核心愿景"}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {lang === "en"
            ? "For centuries, Eastern metaphysics (BaZi, Five Elements, and the I Ching) remained shrouded in archaic terminology and fatalistic superstitions. Meanwhile, Western astrology captured global curiosity but lacked the deep, seasonal elemental balance mapped by Chinese sages. QiCosmos was founded to bridge these worlds — providing modern, empowering, and mathematically precise self-knowledge for global seekers."
            : "数千年来，以八字、五行与周易为代表的东方命理学，常被晦涩古文与宿命论遮蔽；而在海外，西方占星学虽深入人心，却往往缺少东方关于四时节气与五行气场生克制化的深层调和。天仪灵图（QiCosmos）的诞生，旨在打破文化隔阂与宿命迷信，以现代心理学与系统化天文历法，为全球探索者呈现真实、清澈、赋能的自我认知蓝图。"}
        </p>
      </div>

      {/* 3 Pillars of Trust (E-E-A-T) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="zen-card p-6 space-y-2 border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] mb-2">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-serif font-bold text-slate-100">
            {lang === "en" ? "1. Astronomical Rigor" : "1. 严谨天文历法"}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {lang === "en"
              ? "All BaZi pillars are computed using precise 24-solar-term boundaries (节气) rather than crude lunar months, ensuring authentic celestial alignment."
              : "所有八字排盘严格按照公历真太阳时与二十四节气严格换柱，绝不套用简陋模版，确保天文干支数据百分百精准。"}
          </p>
        </div>

        <div className="zen-card p-6 space-y-2 border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-2">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-serif font-bold text-slate-100">
            {lang === "en" ? "2. Psychological Empowerment" : "2. 心理学与去迷信"}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {lang === "en"
              ? "We reject fear-based fortune telling. We treat birth charts not as an inescapable cage, but as an energetic weather map guiding conscious growth."
              : "我们坚决摈弃恐吓式算命与宿命宿论。命盘不是枷锁，而是一幅内在能量气候图，重在唤醒个人觉知与后天修行。"}
          </p>
        </div>

        <div className="zen-card p-6 space-y-2 border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-2">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-serif font-bold text-slate-100">
            {lang === "en" ? "3. Privacy & Integrity" : "3. 隐私与数据安全"}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {lang === "en"
              ? "Your birth data is calculated securely and never sold, shared, or mined for external ad tracking. Your inner cosmic blueprint belongs solely to you."
              : "您的生辰八字仅在排盘计算中即时处理，绝不会被出售给任何第三方营销机构，彻底守护您的个人隐私。"}
          </p>
        </div>
      </div>

      {/* Ethical Disclaimer */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
        <span className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider block">
          {lang === "en" ? "✦ Ethical & Legal Statement" : "✦ 学术伦理与法律声明"}
        </span>
        <p className="text-xs text-slate-400 leading-relaxed">
          {lang === "en"
            ? "The astrological, BaZi, and I Ching analyses provided by QiCosmos are created for philosophical exploration, self-inquiry, cultural education, and mindful entertainment. They are not substitutes for professional clinical therapy, financial investment advisement, or certified medical diagnostics. Users are encouraged to exercise personal sovereignty, free will, and rational judgment in all life decisions."
            : "天仪灵图（QiCosmos）所呈现的占星、八字排盘与周易解读，均立足于东方哲学研究、个人心性探索、文化交流与心灵娱乐。本站内容不能替代且不构成任何执业心理咨询、医疗诊断、法律诉讼或金融投资建议。我们鼓励每位用户保持独立思辨、自由意志与积极生活的理性态度。"}
        </p>
      </div>
    </div>
  );
}
