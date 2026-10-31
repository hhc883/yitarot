import { PillarData } from "@/lib/metaphysics/bazi";
import { Locale } from "@/lib/i18n/dictionaries";

interface Props {
  pillars: {
    year: PillarData;
    month: PillarData;
    day: PillarData;
    hour: PillarData;
  };
  lang: Locale;
}

export default function BaZiCard({ pillars, lang }: Props) {
  const pillarList = [
    { key: "hour", data: pillars.hour },
    { key: "day", data: pillars.day, isCore: true },
    { key: "month", data: pillars.month },
    { key: "year", data: pillars.year },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {pillarList.map(({ key, data, isCore }) => (
        <div
          key={key}
          className={`zen-card p-4 relative flex flex-col items-center text-center transition-all ${
            isCore
              ? "border-[#d4af37]/60 shadow-[0_0_20px_rgba(212,175,55,0.15)] bg-gradient-to-b from-[#141b2b] to-[#0c121e]"
              : "bg-slate-900/60"
          }`}
        >
          {isCore && (
            <div className="absolute -top-2.5 px-2 py-0.5 rounded-full bg-[#d4af37] text-slate-950 text-[10px] font-bold tracking-wider uppercase shadow">
              {lang === "en" ? "Day Master (Core)" : "日主元神"}
            </div>
          )}

          {/* Pillar title */}
          <span className="text-xs font-medium text-slate-400 mt-1">
            {lang === "en" ? data.nameEn : data.nameZh}
          </span>

          {/* Stem & Branch big Chinese characters */}
          <div className="my-3 flex flex-col items-center gap-1">
            {/* Heavenly Stem */}
            <div className="flex items-center gap-2">
              <span className="text-3xl sm:text-4xl font-serif font-bold text-slate-100">
                {data.gan}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded border border-slate-700 bg-slate-800/80 text-slate-300">
                {lang === "en" ? data.ganInfo.nameEn : `${data.ganInfo.polarity === "Yang" ? "阳" : "阴"}${data.ganInfo.element}`}
              </span>
            </div>

            {/* Branch */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-3xl sm:text-4xl font-serif font-bold text-[#d4af37]">
                {data.zhi}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded border border-[#d4af37]/20 bg-[#d4af37]/10 text-[#f5d77f]">
                {lang === "en" ? `${data.zhiInfo.animalEn}` : `${data.zhiInfo.animalZh}`}
              </span>
            </div>
          </div>

          {/* NaYin Sound Element */}
          <div className="text-[11px] text-slate-400 font-mono mb-2">
            <span className="text-slate-500">{lang === "en" ? "Melodic: " : "纳音: "}</span>
            <span className="text-slate-300">{data.naYin}</span>
          </div>

          {/* Life Domain */}
          <div className="mt-auto pt-2 border-t border-slate-800/60 text-[10px] text-slate-400 leading-tight">
            {lang === "en" ? data.lifeDomainEn : data.lifeDomainZh}
          </div>
        </div>
      ))}
    </div>
  );
}
