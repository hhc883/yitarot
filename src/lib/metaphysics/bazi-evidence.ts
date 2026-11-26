import type { BaZiCalculationResult, PillarData } from './bazi';

export type BaziFocusArea = 'general' | 'career' | 'wealth' | 'love' | 'health';
export type BaziLang = 'zh' | 'en';
export type BaziReportMode = 'ai-selected' | 'local-fallback';

export const BAZI_MIN_REFS = 1;
export const BAZI_MAX_REFS = 6;

const VALID_FOCUS_AREAS: readonly BaziFocusArea[] = [
  'general',
  'career',
  'wealth',
  'love',
  'health',
];

const FOCUS_LABELS: Record<BaziFocusArea, { zh: string; en: string }> = {
  general: { zh: '综合盘面结构', en: 'General Chart Structure' },
  career: { zh: '事业与官星/月令线索', en: 'Career & Officer/Month-Pillar Cues' },
  wealth: { zh: '财星与食伤线索', en: 'Wealth & Output Cues' },
  love: { zh: '日支与配偶宫线索', en: 'Day Branch & Spouse-Palace Cues' },
  health: { zh: '表层五行与日主基础', en: 'Surface Elements & Day-Master Baseline' },
};

const TEN_GOD_GROUPS: Array<{
  key: string;
  zh: string;
  en: string;
  godsZh: readonly string[];
}> = [
  { key: 'companion', zh: '比劫（比肩/劫财）', en: 'Companion (Friend / Rob Wealth)', godsZh: ['比肩', '劫财'] },
  { key: 'output', zh: '食伤（食神/伤官）', en: 'Output (Eating God / Hurting Officer)', godsZh: ['食神', '伤官'] },
  { key: 'wealth', zh: '财星（正财/偏财）', en: 'Wealth (Direct / Indirect Wealth)', godsZh: ['正财', '偏财'] },
  { key: 'officer', zh: '官杀（正官/七杀）', en: 'Officer / Killings (Direct Officer / Seven Killings)', godsZh: ['正官', '七杀'] },
  { key: 'resource', zh: '印枭（正印/偏印）', en: 'Resource (Direct / Indirect Resource)', godsZh: ['正印', '偏印'] },
];

export interface BaziEvidenceItem {
  id: string;
  category: 'caliber' | 'day_master' | 'pillar' | 'ten_gods' | 'surface_elements' | 'dayun';
  titleZh: string;
  titleEn: string;
  factZh: string;
  factEn: string;
  sourceLabelZh: string;
  sourceLabelEn: string;
  focusTags: BaziFocusArea[];
}

export interface BaziEvidenceBundle {
  items: BaziEvidenceItem[];
  byId: Record<string, BaziEvidenceItem>;
  idSet: Set<string>;
}

export interface BaziSelectionValidationResult {
  ok: boolean;
  refs: string[];
  reason?: string;
}

export function normalizeBaziFocus(focus?: unknown): BaziFocusArea {
  if (typeof focus !== 'string') return 'general';
  const normalized = focus.trim().toLowerCase() as BaziFocusArea;
  return (VALID_FOCUS_AREAS as readonly string[]).includes(normalized)
    ? normalized
    : 'general';
}

export function normalizeBaziLang(lang?: unknown): BaziLang {
  return lang === 'en' ? 'en' : 'zh';
}

function formatPillarEvidence(
  id: string,
  pillarKey: 'year' | 'month' | 'day' | 'hour',
  p: PillarData,
  focusTags: BaziFocusArea[]
): BaziEvidenceItem {
  const hiddenZh = p.hiddenStems.map((h) => `${h.gan}（${h.shiShenZh}）`).join('、');
  const hiddenEn = p.hiddenStems.map((h) => `${h.gan} (${h.shiShenEn})`).join(', ');
  const stemGodZh = pillarKey === 'day' ? '日主元神' : p.ganShiShenZh;
  const stemGodEn = pillarKey === 'day' ? 'Day Master' : p.ganShiShenEn;

  const extraZh =
    pillarKey === 'month'
      ? `；月令提纲地支为「${p.zhi}」（${p.zhiInfo.element}），仅作季节门户标示，未计算旺衰。`
      : pillarKey === 'day'
        ? `；日支「${p.zhi}」为婚姻宫位标示，未计算地支刑冲合害。`
        : '';
  const extraEn =
    pillarKey === 'month'
      ? `; Month Branch "${p.zhi}" (${p.zhiInfo.element}) marks the seasonal gate only (strength not computed).`
      : pillarKey === 'day'
        ? `; Day Branch "${p.zhi}" marks the intimate palace position only (branch interactions not computed).`
        : '';

  return {
    id,
    category: 'pillar',
    titleZh: `${p.nameZh}：${p.gan}${p.zhi}（${p.naYin}）`,
    titleEn: `${p.nameEn}: ${p.gan}${p.zhi} (${p.naYin})`,
    factZh: `干支 ${p.gan}${p.zhi}，纳音「${p.naYin}」，天干十神「${stemGodZh}」，地支藏干「${hiddenZh}」，十二长生「${p.diShi}」，旬空「${p.xunKong}」，传统宫位「${p.lifeDomainZh}」${extraZh}`,
    factEn: `Stem-Branch ${p.gan}${p.zhi}, NaYin "${p.naYin}", Stem Ten God "${stemGodEn}", Hidden Stems [${hiddenEn}], 12-Stage "${p.diShi}", XunKong "${p.xunKong}", traditional domain "${p.lifeDomainEn}"${extraEn}`,
    sourceLabelZh: 'lunar-typescript EightChar 排盘与 src/lib/metaphysics/bazi.ts 干支/十神映射表',
    sourceLabelEn: 'lunar-typescript EightChar & src/lib/metaphysics/bazi.ts pillar/Ten-God lookup',
    focusTags,
  };
}

function buildTenGodsDistributionItem(data: BaZiCalculationResult): BaziEvidenceItem {
  const pillars: Array<{ key: 'year' | 'month' | 'day' | 'hour'; zh: string; en: string; p: PillarData }> = [
    { key: 'year', zh: '年柱', en: 'Year', p: data.pillars.year },
    { key: 'month', zh: '月柱', en: 'Month', p: data.pillars.month },
    { key: 'day', zh: '日柱', en: 'Day', p: data.pillars.day },
    { key: 'hour', zh: '时柱', en: 'Hour', p: data.pillars.hour },
  ];

  const presentZh: string[] = [];
  const presentEn: string[] = [];
  const absentZh: string[] = [];
  const absentEn: string[] = [];

  for (const group of TEN_GOD_GROUPS) {
    const hitsZh: string[] = [];
    const hitsEn: string[] = [];
    for (const item of pillars) {
      if (item.key !== 'day' && group.godsZh.includes(item.p.ganShiShenZh)) {
        hitsZh.push(`${item.zh}天干(${item.p.ganShiShenZh})`);
        hitsEn.push(`${item.en} stem (${item.p.ganShiShenEn})`);
      }
      for (const hs of item.p.hiddenStems) {
        if (group.godsZh.includes(hs.shiShenZh)) {
          hitsZh.push(`${item.zh}藏干${hs.gan}(${hs.shiShenZh})`);
          hitsEn.push(`${item.en} hidden ${hs.gan} (${hs.shiShenEn})`);
        }
      }
    }
    if (hitsZh.length > 0) {
      presentZh.push(`${group.zh}见于${hitsZh.join('、')}`);
      presentEn.push(`${group.en} in ${hitsEn.join(', ')}`);
    } else {
      absentZh.push(group.zh);
      absentEn.push(group.en);
    }
  }

  const absentNoteZh = absentZh.length > 0 ? `；四柱天干及藏干未见：${absentZh.join('、')}` : '';
  const absentNoteEn = absentEn.length > 0 ? `; absent from stems and hidden stems: ${absentEn.join(', ')}` : '';

  return {
    id: 'ten-gods-distribution',
    category: 'ten_gods',
    titleZh: '十神落位分布（基于四柱天干与藏干）',
    titleEn: 'Ten Gods Placement (Stems & Hidden Stems)',
    factZh: `${presentZh.join('；')}${absentNoteZh}。以上仅记录实际十神落位，不作职业、财运或婚恋吉凶定论。`,
    factEn: `${presentEn.join('; ')}${absentNoteEn}. Records exact chart placements only; does not predict job, wealth, or relationship outcomes.`,
    sourceLabelZh: '基于 BaZiCalculationResult 四柱天干与藏干十神汇总',
    sourceLabelEn: 'Derived from BaZiCalculationResult stem & hidden-stem Ten Gods',
    focusTags: ['general', 'career', 'wealth', 'love'],
  };
}

export function buildBaziEvidenceBundle(data: BaZiCalculationResult): BaziEvidenceBundle {
  const dm = data.dayMaster;
  const surfaceZh = data.fiveElements.map((e) => `${e.elementZh} ${e.count}/8 (${e.percentage}%)`).join('、');
  const surfaceEn = data.fiveElements.map((e) => `${e.element} ${e.count}/8 (${e.percentage}%)`).join(', ');

  const elementDistributionFactZh = `仅统计四柱天干与地支共 8 个表层字：${surfaceZh}。${data.surfaceElementsNoteZh}`;
  const elementDistributionFactEn = `Counts only the 8 surface stems and branches: ${surfaceEn}. ${data.surfaceElementsNoteEn}`;

  const items: BaziEvidenceItem[] = [
    {
      id: 'chart-caliber',
      category: 'caliber',
      titleZh: '排盘口径与流派规则',
      titleEn: 'Calculation Engine & Calendar Caliber',
      factZh: `采用 lunar-typescript EightChar 流派 ${data.eightCharSect}。${data.ziHourRuleZh}`,
      factEn: `Computed via lunar-typescript EightChar sect=${data.eightCharSect}. ${data.ziHourRuleEn}`,
      sourceLabelZh: 'src/lib/metaphysics/bazi.ts calculateBaZi',
      sourceLabelEn: 'src/lib/metaphysics/bazi.ts calculateBaZi',
      focusTags: ['general'],
    },
    {
      id: 'day-master',
      category: 'day_master',
      titleZh: `日主天干：${dm.nameZh}`,
      titleEn: `Day Master: ${dm.nameEn}`,
      factZh: `日柱天干（日主）为「${dm.stem}」（${dm.nameZh}，五行属${dm.elementZh}，${dm.polarity === 'Yang' ? '阳' : '阴'}干）；程序内置象征标签为「${dm.archetypeZh}」。`,
      factEn: `Day Stem (Day Master) is "${dm.stem}" (${dm.nameEn}, ${dm.element}, ${dm.polarity}); local archetype label is "${dm.archetypeEn}".`,
      sourceLabelZh: 'src/lib/metaphysics/bazi.ts DAY_MASTER_DETAILS 本地规则表（非古籍引文）',
      sourceLabelEn: 'src/lib/metaphysics/bazi.ts DAY_MASTER_DETAILS local lookup (not a classical citation)',
      focusTags: ['general', 'career', 'wealth', 'love', 'health'],
    },
    formatPillarEvidence('pillar-year', 'year', data.pillars.year, ['general', 'career']),
    formatPillarEvidence('pillar-month', 'month', data.pillars.month, ['general', 'career', 'wealth', 'health']),
    formatPillarEvidence('pillar-day', 'day', data.pillars.day, ['general', 'love', 'health']),
    formatPillarEvidence('pillar-hour', 'hour', data.pillars.hour, ['general', 'wealth']),
    buildTenGodsDistributionItem(data),
    {
      id: 'surface-elements-count',
      category: 'surface_elements',
      titleZh: '表层八字五行字数统计（仅计字数）',
      titleEn: 'Surface Five Elements Count (Counts Only)',
      factZh: elementDistributionFactZh,
      factEn: elementDistributionFactEn,
      sourceLabelZh: 'src/lib/metaphysics/bazi.ts fiveElements 表层 8 字计数（非旺衰/喜用神）',
      sourceLabelEn: 'src/lib/metaphysics/bazi.ts fiveElements 8-char surface count (not strength/YongShen)',
      focusTags: ['general', 'health', 'wealth'],
    },
  ];

  if (data.yun) {
    const stepsPreview = data.yun.steps.slice(0, 3);
    const stepsZh = stepsPreview
      .map((s) => `第${s.index}步 ${s.ganZhi}（${s.ganShiShenZh}，${s.startAge}–${s.endAge}岁 / ${s.startYear}–${s.endYear}）`)
      .join('；');
    const stepsEn = stepsPreview
      .map((s) => `Step ${s.index} ${s.ganZhi} (${s.ganShiShenEn}, ages ${s.startAge}-${s.endAge} / ${s.startYear}-${s.endYear})`)
      .join('; ');

    items.push({
      id: 'dayun-caliber',
      category: 'dayun',
      titleZh: `大运起运口径（${data.yun.directionZh}）`,
      titleEn: `DaYun Caliber (${data.yun.directionEn})`,
      factZh: `排盘方向为「${data.yun.directionZh}」，起运公历 ${data.yun.startSolarYmd}。${data.yun.sectNoteZh} ${data.yun.ageCaliberZh}`,
      factEn: `Direction is ${data.yun.directionEn}, starting solar ${data.yun.startSolarYmd}. ${data.yun.sectNoteEn} ${data.yun.ageCaliberEn}`,
      sourceLabelZh: `lunar-typescript EightChar.getYun(gender, ${data.yun.sect})`,
      sourceLabelEn: `lunar-typescript EightChar.getYun(gender, ${data.yun.sect})`,
      focusTags: ['general', 'career', 'wealth', 'love'],
    });

    items.push({
      id: 'dayun-steps',
      category: 'dayun',
      titleZh: '大运前段干支与十神节律',
      titleEn: 'Early DaYun Steps & Stem Ten Gods',
      factZh: `前三步大运为：${stepsZh}。大运干支仅作阶段坐标参考，不推演具体流年应期或确定性吉凶。`,
      factEn: `First 3 DaYun steps: ${stepsEn}. Luck cycles serve as structural phase coordinates only; no deterministic event timing is claimed.`,
      sourceLabelZh: `lunar-typescript EightChar.getYun(gender, ${data.yun.sect}) 大运步序`,
      sourceLabelEn: `lunar-typescript EightChar.getYun(gender, ${data.yun.sect}) DaYun steps`,
      focusTags: ['general', 'career', 'wealth', 'love'],
    });
  }

  const byId: Record<string, BaziEvidenceItem> = {};
  const idSet = new Set<string>();
  for (const item of items) {
    byId[item.id] = item;
    idSet.add(item.id);
  }

  return { items, byId, idSet };
}

const DEFAULT_FOCUS_ORDER: Record<BaziFocusArea, readonly string[]> = {
  general: ['day-master', 'pillar-month', 'pillar-day', 'ten-gods-distribution', 'surface-elements-count', 'dayun-steps'],
  career: ['pillar-month', 'ten-gods-distribution', 'day-master', 'dayun-steps', 'pillar-year', 'surface-elements-count'],
  wealth: ['ten-gods-distribution', 'pillar-month', 'day-master', 'dayun-steps', 'pillar-hour', 'surface-elements-count'],
  love: ['pillar-day', 'ten-gods-distribution', 'day-master', 'dayun-steps', 'pillar-month', 'surface-elements-count'],
  health: ['surface-elements-count', 'day-master', 'pillar-month', 'pillar-day', 'ten-gods-distribution', 'chart-caliber'],
};

export function selectDefaultBaziEvidenceIds(
  bundle: BaziEvidenceBundle,
  focusArea?: unknown,
  maxRefs: number = BAZI_MAX_REFS
): string[] {
  const focus = normalizeBaziFocus(focusArea);
  const preferred = DEFAULT_FOCUS_ORDER[focus];
  const selected: string[] = [];

  for (const id of preferred) {
    if (bundle.idSet.has(id) && !selected.includes(id)) {
      selected.push(id);
    }
    if (selected.length >= maxRefs) return selected;
  }

  for (const item of bundle.items) {
    if (!selected.includes(item.id)) {
      selected.push(item.id);
    }
    if (selected.length >= maxRefs) break;
  }

  return selected;
}

export function validateBaziEvidenceSelection(
  rawText: string,
  validIds: Set<string>,
  options?: { minRefs?: number; maxRefs?: number }
): BaziSelectionValidationResult {
  if (typeof rawText !== 'string' || rawText.trim().length === 0) {
    return { ok: false, refs: [], reason: 'empty_response' };
  }

  const trimmed = rawText.trim();
  if (trimmed.includes('```') || !trimmed.startsWith('{') || !trimmed.endsWith('}')) {
    return { ok: false, refs: [], reason: 'fenced_or_malformed_envelope' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return { ok: false, refs: [], reason: 'invalid_json' };
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { ok: false, refs: [], reason: 'non_object_json' };
  }

  const obj = parsed as Record<string, unknown>;
  const keys = Object.keys(obj);
  if (keys.length !== 1 || keys[0] !== 'refs') {
    return { ok: false, refs: [], reason: 'unexpected_fields' };
  }

  if (!Array.isArray(obj.refs)) {
    return { ok: false, refs: [], reason: 'refs_not_array' };
  }

  const minRefs = options?.minRefs ?? BAZI_MIN_REFS;
  const maxRefs = Math.min(options?.maxRefs ?? BAZI_MAX_REFS, validIds.size);

  if (obj.refs.length < minRefs || obj.refs.length > maxRefs) {
    return { ok: false, refs: [], reason: 'refs_out_of_bounds' };
  }

  const seen = new Set<string>();
  const refs: string[] = [];

  for (const entry of obj.refs) {
    if (typeof entry !== 'string' || entry.length === 0) {
      return { ok: false, refs: [], reason: 'invalid_ref_type' };
    }
    if (seen.has(entry)) {
      return { ok: false, refs: [], reason: 'duplicate_ref' };
    }
    if (!validIds.has(entry)) {
      return { ok: false, refs: [], reason: 'unknown_or_unavailable_ref' };
    }
    seen.add(entry);
    refs.push(entry);
  }

  return { ok: true, refs };
}

export function buildBaziSelectionMessages(
  bundle: BaziEvidenceBundle,
  focusArea?: unknown,
  lang?: unknown
): { systemInstruction: string; userPrompt: string } {
  const focus = normalizeBaziFocus(focusArea);
  const resolvedLang = normalizeBaziLang(lang);
  const maxSelectable = Math.min(BAZI_MAX_REFS, bundle.items.length);

  const listText = bundle.items
    .map((item) =>
      resolvedLang === 'en'
        ? `- ${item.id}: ${item.titleEn} — ${item.factEn}`
        : `- ${item.id}: ${item.titleZh} — ${item.factZh}`
    )
    .join('\n');

  const systemInstruction =
    `You are a strict BaZi evidence-ID selector.
Rules:
1. Select and order between ${BAZI_MIN_REFS} and ${maxSelectable} relevant evidence IDs from the supplied list for the requested focus key.
2. Output ONLY raw JSON matching {"refs":["id-1","id-2"]} with NO markdown fences, NO prose, NO extra fields, NO duplicate IDs, and NO IDs outside the supplied list.`;

  const userPrompt = `focus_key: "${focus}"
allowed_evidence_ids:
${listText}

Return ONLY {"refs":[...]} selecting ${BAZI_MIN_REFS}..${maxSelectable} IDs from allowed_evidence_ids.`;

  return { systemInstruction, userPrompt };
}

export function renderBaziEvidenceReport(
  data: BaZiCalculationResult,
  options: {
    lang?: unknown;
    focusArea?: unknown;
    selectedRefs: string[];
    mode: BaziReportMode;
    bundle?: BaziEvidenceBundle;
  }
): string {
  const lang = normalizeBaziLang(options.lang);
  const focus = normalizeBaziFocus(options.focusArea);
  const bundle = options.bundle ?? buildBaziEvidenceBundle(data);
  const focusLabel = FOCUS_LABELS[focus];

  const validSelected = options.selectedRefs
    .map((id) => bundle.byId[id])
    .filter((item): item is BaziEvidenceItem => Boolean(item));

  const itemsToRender =
    validSelected.length > 0
      ? validSelected
      : selectDefaultBaziEvidenceIds(bundle, focus).map((id) => bundle.byId[id]);

  if (lang === 'en') {
    const modeLabel =
      options.mode === 'ai-selected'
        ? 'Validated AI evidence-ID selection (rendered strictly from server chart facts)'
        : 'Deterministic local evidence fallback (offline / unverified-output safeguard)';

    const evidenceLines = itemsToRender
      .map(
        (item) =>
          `- **${item.titleEn}** (\`${item.id}\`)\n  - Fact: ${item.factEn}\n  - Source: ${item.sourceLabelEn}`
      )
      .join('\n');

    const yunStatusEn = data.yun
      ? `- **DaYun Computed**: ${data.yun.directionEn}, starts ${data.yun.startSolarYmd} (${data.yun.sectNoteEn}).`
      : '- **DaYun Omitted**: Gender/DaYun parameters were not provided in this chart calculation, so luck-cycle timing is omitted.';

    return `### 1. Calculation Origin & Scope
- **Mode**: ${modeLabel}
- **Focus Key**: ${focusLabel.en} (\`${focus}\`)
- **Engine**: \`lunar-typescript\` (\`EightChar\` sect=${data.eightCharSect}) + local lookup tables in \`src/lib/metaphysics/bazi.ts\` (\`STEMS_MAP\`, \`BRANCHES_MAP\`, \`TEN_GOD_EN_MAP\`, \`DAY_MASTER_DETAILS\`).
- **Calendar Caliber**: ${data.ziHourRuleEn}

---

### 2. Grounded Chart Evidence
${evidenceLines}

---

### 3. DaYun Status
${yunStatusEn}

---

### 4. Evidence Boundaries & Abstention
- **No Literary Citations Claimed**: No verified classical BaZi corpus is wired to this module, so no classical texts or quotations are cited.
- **Counts vs. Strength**: Surface Five Elements count only the 8 visible stems and branches and never determine Day Master strength (旺衰) or YongShen/XiShen.
- **Abstention on Uncomputed Claims**: Day Master strength, YongShen/XiShen, branch clashes/combinations/harms, and seasonal climate adjustment are not computed. Accordingly, this report abstains from deterministic claims about job outcomes, marriage/relationship outcomes, health/medical verdicts, or precise future timing.`;
  }

  const modeLabelZh =
    options.mode === 'ai-selected'
      ? '已核验 AI 证据编号筛选（全文严格由服务端盘面事实渲染）'
      : '本地确定性循证降级报告（离线或未通过核验时启用）';

  const evidenceLinesZh = itemsToRender
    .map(
      (item) =>
        `- **${item.titleZh}**（\`${item.id}\`）\n  - 盘面事实：${item.factZh}\n  - 计算来源：${item.sourceLabelZh}`
    )
    .join('\n');

  const yunStatusZh = data.yun
    ? `- **大运已排盘**：${data.yun.directionZh}，起运公历 ${data.yun.startSolarYmd}（${data.yun.sectNoteZh}）。`
    : '- **大运未排盘**：本次排盘未提供性别/大运参数，故大运与流年时序从缺，不作推演。';

  return `### 一、排盘来源与口径说明
- **输出模式**：${modeLabelZh}
- **关注维度**：${focusLabel.zh}（\`${focus}\`）
- **计算来源**：由 \`lunar-typescript\`（\`EightChar\` 流派 ${data.eightCharSect}）与 \`src/lib/metaphysics/bazi.ts\` 本地规则查表（\`STEMS_MAP\`、\`BRANCHES_MAP\`、\`TEN_GOD_EN_MAP\`、\`DAY_MASTER_DETAILS\`）生成。
- **历法与子时口径**：${data.ziHourRuleZh}

---

### 二、已核验盘面证据
${evidenceLinesZh}

---

### 三、大运状态说明
${yunStatusZh}

---

### 四、证据边界与存疑声明
- **典籍引用边界**：当前八字模块未挂载经核验的古籍语料库，因此不宣称、不伪造任何古籍引文或原典出处。
- **字数与旺衰边界**：表层五行仅统计四柱八个表层字的出现次数，不能推导日主旺衰或喜用神。
- **存疑不妄断**：本模块未计算日主旺衰、喜用神、地支刑冲合害与月令调候，因此在缺少依据之处不对具体工作结果、婚恋结果、健康医疗判断或精确应期作确定性断语。`;
}

export function renderLocalBaziFallback(
  data: BaZiCalculationResult,
  options?: { lang?: unknown; focusArea?: unknown }
): string {
  const bundle = buildBaziEvidenceBundle(data);
  const selectedRefs = selectDefaultBaziEvidenceIds(bundle, options?.focusArea);
  return renderBaziEvidenceReport(data, {
    lang: options?.lang,
    focusArea: options?.focusArea,
    selectedRefs,
    mode: 'local-fallback',
    bundle,
  });
}
