"use client";

import { ElementBalance } from "@/lib/metaphysics/bazi";
import { Locale } from "@/lib/i18n/dictionaries";

interface Props {
  elements: ElementBalance[];
  lang: Locale;
}

export default function FiveElementsChart({ elements, lang }: Props) {
  // SVG Radar points
  // 5 vertices for Pentagon: top (Wood), top-right (Fire), bottom-right (Earth), bottom-left (Metal), top-left (Water)
  const size = 260;
  const center = size / 2;
  const radius = 95;

  const angles = [
    -Math.PI / 2, // Top: Wood
    -Math.PI / 2 + (2 * Math.PI) / 5, // Top-right: Fire
    -Math.PI / 2 + (4 * Math.PI) / 5, // Bottom-right: Earth
    -Math.PI / 2 + (6 * Math.PI) / 5, // Bottom-left: Metal
    -Math.PI / 2 + (8 * Math.PI) / 5, // Top-left: Water
  ];

  // Map elements order
  const order = ["Wood", "Fire", "Earth", "Metal", "Water"];
  const orderedElements = order.map(name => elements.find(e => e.element === name) || elements[0]);

  // Max percentage scale (e.g. 50% max)
  const maxVal = 50;
  const points = orderedElements.map((el, i) => {
    const val = Math.min(el.percentage, maxVal);
    const r = (val / maxVal) * radius;
    const x = center + r * Math.cos(angles[i]);
    const y = center + r * Math.sin(angles[i]);
    return `${x},${y}`;
  }).join(" ");

  // Grid background polygons (at 25%, 50%, 75%, 100%)
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      {/* Pentagon Radar Chart */}
      <div className="flex flex-col items-center justify-center p-4">
        <svg width={size} height={size} className="overflow-visible">
          {/* Background grid rings */}
          {gridLevels.map((lvl, idx) => {
            const gridPoints = angles.map(ang => {
              const r = radius * lvl;
              const x = center + r * Math.cos(ang);
              const y = center + r * Math.sin(ang);
              return `${x},${y}`;
            }).join(" ");
            return (
              <polygon
                key={idx}
                points={gridPoints}
                fill="none"
                stroke="rgba(212, 175, 55, 0.12)"
                strokeWidth="1"
              />
            );
          })}

          {/* Axis lines */}
          {angles.map((ang, i) => {
            const x = center + radius * Math.cos(ang);
            const y = center + radius * Math.sin(ang);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="rgba(212, 175, 55, 0.15)"
                strokeDasharray="2,2"
              />
            );
          })}

          {/* Value Polygon */}
          <polygon
            points={points}
            fill="rgba(212, 175, 55, 0.25)"
            stroke="#d4af37"
            strokeWidth="2.5"
            className="filter drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]"
          />

          {/* Vertex labels */}
          {orderedElements.map((el, i) => {
            const labelRadius = radius + 22;
            const x = center + labelRadius * Math.cos(angles[i]);
            const y = center + labelRadius * Math.sin(angles[i]);
            return (
              <g key={i} transform={`translate(${x}, ${y})`}>
                <circle r="4" fill={el.colorHex} />
                <text
                  textAnchor="middle"
                  dy="0.3em"
                  y={angles[i] > 0 ? 12 : -10}
                  fill="#e2e8f0"
                  fontSize="11"
                  fontWeight="600"
                >
                  {lang === "en" ? el.element : el.elementZh} ({el.percentage}%)
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Five Elements Bars and Status */}
      <div className="space-y-3.5">
        {orderedElements.map(el => (
          <div key={el.element} className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium flex items-center gap-1.5" style={{ color: el.colorHex }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: el.colorHex }} />
                {lang === "en" ? el.element : `${el.elementZh}行`}
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  el.status === "Dominant"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : el.status === "Lacking"
                    ? "bg-slate-700/50 text-slate-400"
                    : "bg-emerald-500/20 text-emerald-300"
                }`}>
                  {lang === "en" ? el.status : el.statusZh}
                </span>
                <span className="font-mono text-slate-300 font-semibold">{el.percentage}%</span>
              </div>
            </div>
            <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-slate-700/30">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(el.percentage, 100)}%`,
                  backgroundColor: el.colorHex
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
