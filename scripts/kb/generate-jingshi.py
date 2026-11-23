import re
import json

with open(r'c:\Users\Administrator\Documents\Antigravity\yitarot\data\kb\principles\jingshi-extracted.md', 'r', encoding='utf-8') as f:
    text = f.read()

m1_text = text.split('### 【模块一：五行机理与亢害承制法则（精选 20 条）】')[1].split('### 【模块二：干支冲合会刑根本成因（精选 20 条）】')[0]
items1 = re.findall(r'#### 条目 (\d+)：([^\n]+)\n- \*\*【天道哲学机理】\*\*：([^\n]+)\n- \*\*【推演指导价值】\*\*：([^\n]+)', m1_text)

m2_text = text.split('### 【模块二：干支冲合会刑根本成因（精选 20 条）】')[1].split('### 【模块三：四时旺相与长生墓绝界定（精选 15 条）】')[0]
items2 = re.findall(r'#### 条目 (\d+)：([^\n]+)\n- \*\*【生成与气机机理】\*\*：([^\n]+)\n- \*\*【吉凶倾向总结】\*\*：([^\n]+)', m2_text)

m3_text = text.split('### 【模块三：四时旺相与长生墓绝界定（精选 15 条）】')[1]
items3 = re.findall(r'#### 条目 (\d+)：([^\n]+)\n- \*\*【([^】]+)】\*\*：([^\n]+)\n- \*\*【([^】]+)】\*\*：([^\n]+)', m3_text)

m1_kw = [
    ['纯阳', '用九', '阳极阴生', '亢龙有悔', '帝旺至极'],
    ['天地水火', '坎离', '乾坤', '水火既济', '性命承制'],
    ['水木相资', '雷风相薄', '震巽', '相资'],
    ['土居中央', '辰戌丑未', '四季土', '湿土', '燥土'],
    ['六亲原型', '妻财', '官鬼', '父母', '子孙', '金入木乡', '火来相敌'],
    ['游魂', '归魂', '八宫卦变', '反本归根', '神魂不安'],
    ['剥极必复', '消长', '一阳来复', '绝处逢生'],
    ['重刚履险', '习坎', '险难', '刚中正'],
    ['离明内虚', '离火', '明察', '成物'],
    ['艮止', '阳极而静', '止其所', '安止'],
    ['兑金', '悦怿', '毁折', '口舌是非', '秋肃'],
    ['六虚周流', '阴阳相荡', '变动不居', '刚柔相易'],
    ['死于位而生于时', '死于时而生于位', '时令', '位次', '月建盛衰'],
    ['阳主贵', '阴主贱', '九五', '得正', '正位律'],
    ['子左行', '午右行', '阳生', '阴起', '顺逆'],
    ['太岁', '岁星', '至尊', '君德', '流年'],
    ['五星配卦', '镇星', '太白', '太阴', '岁星', '荧惑'],
    ['二十八宿', '宿度降爻', '分野', '城邑'],
    ['物候分数', '三十六', '二十八', '老阳', '少阳'],
    ['生生之谓易', '终则有始', '周流', '极则思变']
]

m2_kw = [
    ['纳甲', '十天干', '甲壬', '乙癸', '庚辛', '戊己', '丙丁', '月相朔望'],
    ['纳支', '十二地支', '阳顺阴逆', '子寅辰午申戌', '未巳卯丑亥酉'],
    ['六冲', '相冲', '对冲', '子午冲', '丑未冲', '寅申冲', '卯酉冲', '辰戌冲', '巳亥冲'],
    ['六合', '相合', '子丑合', '寅亥合', '卯戌合', '辰酉合', '巳申合', '午未合'],
    ['三合局', '申子辰', '亥卯未', '寅午戌', '巳酉丑', '长生帝旺墓库'],
    ['三刑', '相刑', '寅巳申', '无恩之刑', '生杀反噬'],
    ['三刑', '相刑', '丑戌未', '恃势之刑', '重土相亢'],
    ['相刑', '子卯相刑', '子卯刑', '无礼之刑', '水木反伦'],
    ['自刑', '辰辰', '午午', '酉酉', '亥亥', '辰午酉亥'],
    ['六害', '穿害', '子未害', '丑午害', '寅巳害', '卯辰害', '申亥害', '酉戌害'],
    ['世应', '世爻', '应爻', '立盘', '君臣'],
    ['飞伏', '飞神', '伏神', '幽明', '伏克飞', '飞生伏'],
    ['建月', '积算', '起宫', '应期'],
    ['本宫', '他宫', '内外卦', '内外界定'],
    ['暗动', '日辰相激', '冲起静爻'],
    ['旬空', '空亡', '真空', '假空', '避凶而空'],
    ['动变', '变爻', '回头生', '回头克'],
    ['五行生成数', '天一生水', '生克次序'],
    ['纳音', '正五行', '六十甲子', '律吕'],
    ['反吟', '伏吟', '天地不交', '反复无常']
]

m3_kw = [
    ['旺相休囚死', '四时五行', '当令者旺', '退气'],
    ['长生', '长生宫', '水长生申', '木长生亥', '火长生寅', '金长生巳'],
    ['沐浴', '败地', '沐浴宫'],
    ['冠带', '冠带位'],
    ['临官', '禄位', '官禄', '甲禄寅'],
    ['帝旺', '极盛', '帝旺位'],
    ['衰', '衰地', '盛极而衰'],
    ['病', '病地', '疾病'],
    ['死', '死地', '气尽形枯'],
    ['墓', '墓库', '入墓', '金墓丑', '火墓戌', '木墓未', '水土墓辰'],
    ['绝', '绝地', '化绝', '绝处逢生'],
    ['胎', '受气', '成胎'],
    ['养', '养地', '涵养'],
    ['墓库开闭', '冲开墓库', '开库', '闭库'],
    ['二分二至', '冬至一阳生', '夏至一阴生', '卦气盛衰', '交节']
]

lines = [
    "import type { PrincipleEntry } from './types';",
    "",
    "/**",
    " * 《京氏易传》（西汉·京房 撰）",
    " * 文献体裁模式：【模式 C·宇宙原理型】",
    " * 核心范畴：五行机理与亢害承制、干支冲合会刑根本成因、四时旺相与长生墓绝界定",
    " * 地位：汉代象数纳甲与天道物理模型鼻祖元典",
    " */",
    "",
    "export const JINGSHI_WUXING_CHENGZHI: PrincipleEntry[] = ["
]

for idx, (num, title, mech, val) in enumerate(items1):
    pid = f'jsyc.wuxing.{num}'
    kw = m1_kw[idx] if idx < len(m1_kw) else ['五行']
    lines.append("  {")
    lines.append(f"    id: '{pid}',")
    lines.append(f"    title: '{title}',")
    lines.append("    category: 'wuxing-chengzhi',")
    lines.append("    categoryNameZh: '五行机理与亢害承制',")
    lines.append("    source: {")
    lines.append("      book: '京氏易传',")
    lines.append("      author: '京房',")
    lines.append("      era: '西汉'")
    lines.append("    },")
    lines.append(f"    originTheory: {json.dumps(mech, ensure_ascii=False)},")
    lines.append(f"    practicalGuidance: {json.dumps(val, ensure_ascii=False)},")
    lines.append(f"    keywords: {json.dumps(kw, ensure_ascii=False)}")
    lines.append("  },")

lines.append("];")
lines.append("")
lines.append("export const JINGSHI_GANZHI_MECHANICS: PrincipleEntry[] = [")

for idx, (num, title, mech, val) in enumerate(items2):
    pid = f'jsyc.ganzhi.{num}'
    kw = m2_kw[idx] if idx < len(m2_kw) else ['干支']
    lines.append("  {")
    lines.append(f"    id: '{pid}',")
    lines.append(f"    title: '{title}',")
    lines.append("    category: 'ganzhi-mechanics',")
    lines.append("    categoryNameZh: '干支冲合会刑根本成因',")
    lines.append("    source: {")
    lines.append("      book: '京氏易传',")
    lines.append("      author: '京房',")
    lines.append("      era: '西汉'")
    lines.append("    },")
    lines.append(f"    originTheory: {json.dumps(mech, ensure_ascii=False)},")
    lines.append(f"    practicalGuidance: {json.dumps(val, ensure_ascii=False)},")
    lines.append(f"    keywords: {json.dumps(kw, ensure_ascii=False)}")
    lines.append("  },")

lines.append("];")
lines.append("")
lines.append("export const JINGSHI_TWELVE_STAGES: PrincipleEntry[] = [")

for idx, (num, title, l1, v1, l2, v2) in enumerate(items3):
    pid = f'jsyc.stages.{num}'
    kw = m3_kw[idx] if idx < len(m3_kw) else ['长生十二宫']
    lines.append("  {")
    lines.append(f"    id: '{pid}',")
    lines.append(f"    title: '{title}',")
    lines.append("    category: 'twelve-stages',")
    lines.append("    categoryNameZh: '四时旺相与长生墓绝',")
    lines.append("    source: {")
    lines.append("      book: '京氏易传',")
    lines.append("      author: '京房',")
    lines.append("      era: '西汉'")
    lines.append("    },")
    lines.append(f"    originTheory: {json.dumps(v1, ensure_ascii=False)},")
    lines.append(f"    practicalGuidance: {json.dumps(v2, ensure_ascii=False)},")
    lines.append(f"    keywords: {json.dumps(kw, ensure_ascii=False)}")
    lines.append("  },")

lines.append("];")
lines.append("")
lines.append("/** 《京氏易传》全量五十五条天道易理与干支生克元典 */")
lines.append("export const JINGSHI_PRINCIPLES: PrincipleEntry[] = [")
lines.append("  ...JINGSHI_WUXING_CHENGZHI,")
lines.append("  ...JINGSHI_GANZHI_MECHANICS,")
lines.append("  ...JINGSHI_TWELVE_STAGES")
lines.append("];")
lines.append("")

with open(r'c:\Users\Administrator\Documents\Antigravity\yitarot\src\lib\kb\principles\jingshi.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print('Generated src/lib/kb/principles/jingshi.ts successfully! Total lines:', len(lines))
