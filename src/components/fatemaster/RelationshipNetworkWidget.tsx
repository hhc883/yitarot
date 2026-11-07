'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, UserCheck } from 'lucide-react';

interface NetworkNode {
  id: string;
  name: string;
  roleZh: string;
  type: string;
  element: string;
  elementColor: string;
  score: number;
  relationNatureZh: string;
  x: number;
  y: number;
}

export function RelationshipNetworkWidget({ lang = 'zh' }: { lang?: string }) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('spouse');

  const nodes: NetworkNode[] = [
    {
      id: 'spouse',
      name: '伴侣',
      roleZh: '夫妻配偶 / 正财正官',
      type: 'marriage',
      element: '水',
      elementColor: '#06B6D4',
      score: 91,
      relationNatureZh: '夫妻内宫六合，天作之合，长久依恋',
      x: 180,
      y: 90
    },
    {
      id: 'mother',
      name: '母亲',
      roleZh: '正印庇佑 / 慈爱源泉',
      type: 'mother-child',
      element: '金',
      elementColor: '#94A3B8',
      score: 88,
      relationNatureZh: '金水相生，印星生身，深厚包容',
      x: 320,
      y: 90
    },
    {
      id: 'father',
      name: '父亲',
      roleZh: '偏财父权 / 人生指引',
      type: 'parent-child',
      element: '木',
      elementColor: '#10B981',
      score: 82,
      relationNatureZh: '偏财制衡，刚柔并济，精神传承',
      x: 390,
      y: 220
    },
    {
      id: 'child',
      name: '子女',
      roleZh: '食伤显秀 / 未来归宿',
      type: 'mother-child',
      element: '木',
      elementColor: '#10B981',
      score: 94,
      relationNatureZh: '我生食伤，秀气流行，温情反哺',
      x: 340,
      y: 350
    },
    {
      id: 'partner',
      name: '合伙人',
      roleZh: '财官协同 / 事业盟友',
      type: 'business',
      element: '火',
      elementColor: '#EF4444',
      score: 85,
      relationNatureZh: '优势互补，契约分明，求财拓荒',
      x: 160,
      y: 350
    },
    {
      id: 'friend',
      name: '密友',
      roleZh: '比肩同气 / 灵魂树洞',
      type: 'best-friends',
      element: '水',
      elementColor: '#06B6D4',
      score: 89,
      relationNatureZh: '同舟共济，情绪托底，君子之交',
      x: 100,
      y: 220
    }
  ];

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
      <div className="w-full text-center mb-6">
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#111111] tracking-tight">
          {lang === 'en' ? 'BaZi Relationship Network' : '八字关系图谱'}
        </h1>
        <p className="text-xs sm:text-sm font-serif text-[#736B5E] mt-1.5 max-w-lg mx-auto">
          以你为天心原点，全景映射夫妻、父母、子女、合伙人与密友的多维命盘气场网络。
        </p>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* 左侧：可视化 SVG 拓扑图谱 */}
        <div className="md:col-span-7 rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-6 shadow-2xs flex flex-col items-center justify-center relative min-h-[440px]">
          <svg className="w-full max-w-[480px] h-[400px] overflow-visible" viewBox="0 0 500 440">
            {/* 中心到各节点的连线 */}
            {nodes.map(n => {
              const isSelected = n.id === selectedNodeId;
              return (
                <g key={n.id}>
                  <line
                    x1="250"
                    y1="220"
                    x2={n.x}
                    y2={n.y}
                    stroke={isSelected ? '#8C6D23' : '#111111'}
                    strokeWidth={isSelected ? '2.5' : '1'}
                    strokeOpacity={isSelected ? '0.85' : '0.15'}
                    strokeDasharray={isSelected ? 'none' : '3 3'}
                    className="transition-all duration-300"
                  />
                  {isSelected && (
                    <circle
                      cx={(250 + n.x) / 2}
                      cy={(220 + n.y) / 2}
                      r="4"
                      fill="#8C6D23"
                      className="animate-pulse"
                    />
                  )}
                </g>
              );
            })}

            {/* 中心核心：我 (日主元神) */}
            <circle
              cx="250"
              cy="220"
              r="34"
              fill="#111111"
              stroke="#E8CF86"
              strokeWidth="2"
              className="filter drop-shadow-md cursor-default"
            />
            <text
              x="250"
              y="216"
              textAnchor="middle"
              className="text-xs font-serif font-black fill-[#FFFDF9] select-none"
            >
              本命元神
            </text>
            <text
              x="250"
              y="232"
              textAnchor="middle"
              className="text-[9px] font-serif fill-[#E8CF86] select-none"
            >
              我 (日主)
            </text>

            {/* 周围各关系节点 */}
            {nodes.map(n => {
              const isSelected = n.id === selectedNodeId;
              return (
                <g
                  key={n.id}
                  onClick={() => setSelectedNodeId(n.id)}
                  className="cursor-pointer group"
                >
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={isSelected ? '28' : '24'}
                    fill={isSelected ? '#FFFDF9' : '#FAF6ED'}
                    stroke={isSelected ? '#8C6D23' : '#111111'}
                    strokeWidth={isSelected ? '2.5' : '1'}
                    strokeOpacity={isSelected ? '1' : '0.2'}
                    className="transition-all duration-300 group-hover:scale-105"
                  />
                  <text
                    x={n.x}
                    y={n.y - 2}
                    textAnchor="middle"
                    className={`text-xs font-serif font-bold select-none ${
                      isSelected ? 'fill-[#111111]' : 'fill-[#524B40]'
                    }`}
                  >
                    {n.name}
                  </text>
                  <text
                    x={n.x}
                    y={n.y + 12}
                    textAnchor="middle"
                    className="text-[9px] font-serif font-semibold fill-[#8C6D23] select-none"
                  >
                    {n.score}分
                  </text>
                </g>
              );
            })}
          </svg>

          <span className="text-[11px] font-serif text-[#736B5E] mt-2">
            点击任意节点，查看该关系的能量流动与详细契合指标
          </span>
        </div>

        {/* 右侧：选中关系的深度解析面板 */}
        <div className="md:col-span-5 rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-6 shadow-2xs flex flex-col justify-between min-h-[440px]">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-[#111111]/6 pb-3">
              <div>
                <span className="text-[11px] font-serif text-[#736B5E]">当前选中关系</span>
                <h3 className="font-serif font-black text-xl text-[#111111] mt-0.5">
                  {selectedNode.name} · {selectedNode.roleZh}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-serif text-[#736B5E]">契合指数</span>
                <div className="font-serif font-black text-3xl text-[#8C6D23]">
                  {selectedNode.score} <span className="text-xs text-[#736B5E] font-normal">分</span>
                </div>
              </div>
            </div>

            <div className="space-y-3.5 text-xs font-serif text-[#524B40] mb-6">
              <div className="p-3.5 rounded-xl bg-[#FAF6ED] border border-[#111111]/6">
                <span className="font-bold text-[#111111] block mb-1">能量流动机制</span>
                <p className="leading-relaxed">{selectedNode.relationNatureZh}</p>
              </div>

              <div>
                <span className="text-[11px] text-[#736B5E] block mb-1">五行交互属性</span>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-[#FAF6ED] border border-[#111111]/10 text-xs font-bold text-[#111111]">
                    对方主气：{selectedNode.element}
                  </span>
                  <span className="text-[11px] text-[#736B5E]">与我方气场循环呼应</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#111111]/8">
            <Link
              href={`/${lang}/fatemaster/relationship/${selectedNode.type}`}
              className="w-full py-3 rounded-xl bg-[#111111] hover:bg-[#333333] text-[#FFFDF9] text-xs font-serif tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <span>进入【{selectedNode.name}合盘】专属排盘推演</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E8CF86]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
