export interface TrigramInfo {
  number: number; // 1 to 8
  nameZh: string; // 乾、兑、离、震、巽、坎、艮、坤
  symbol: string; // ☰, ☱, ☲, ☳, ☴, ☵, ☶, ☷
  natureZh: string; // 天、泽、火、雷、风、水、山、地
  element: "Metal" | "Wood" | "Water" | "Fire" | "Earth";
  elementZh: string;
  lines: [boolean, boolean, boolean]; // bottom to top: true=yang, false=yin
}

export const TRIGRAMS: Record<number, TrigramInfo> = {
  1: { number: 1, nameZh: "乾", symbol: "☰", natureZh: "天", element: "Metal", elementZh: "金", lines: [true, true, true] },
  2: { number: 2, nameZh: "兑", symbol: "☱", natureZh: "泽", element: "Metal", elementZh: "金", lines: [true, true, false] },
  3: { number: 3, nameZh: "离", symbol: "☲", natureZh: "火", element: "Fire", elementZh: "火", lines: [true, false, true] },
  4: { number: 4, nameZh: "震", symbol: "☳", natureZh: "雷", element: "Wood", elementZh: "木", lines: [true, false, false] },
  5: { number: 5, nameZh: "巽", symbol: "☴", natureZh: "风", element: "Wood", elementZh: "木", lines: [false, true, true] },
  6: { number: 6, nameZh: "坎", symbol: "☵", natureZh: "水", element: "Water", elementZh: "水", lines: [false, true, false] },
  7: { number: 7, nameZh: "艮", symbol: "☶", natureZh: "山", element: "Earth", elementZh: "土", lines: [false, false, true] },
  8: { number: 8, nameZh: "坤", symbol: "☷", natureZh: "地", element: "Earth", elementZh: "土", lines: [false, false, false] }
};

export interface MeihuaDivinationResult {
  question: string;
  castMode: "time" | "numbers";
  numbers: [number, number, number];
  primaryHexagram: {
    upper: TrigramInfo;
    lower: TrigramInfo;
    fullNameZh: string;
    symbol: string;
    lines: boolean[]; // 6 lines from 1 (bottom) to 6 (top)
  };
  movingLine: number; // 1 to 6
  bodyTrigram: {
    trigram: TrigramInfo;
    position: "upper" | "lower";
    role: "体卦 (我方/所占之事)";
  };
  applicationTrigram: {
    trigram: TrigramInfo;
    position: "upper" | "lower";
    role: "用卦 (事态/对方境遇)";
  };
  mutualHexagram: {
    upper: TrigramInfo;
    lower: TrigramInfo;
    fullNameZh: string;
    summaryZh: string;
  };
  transformedHexagram: {
    upper: TrigramInfo;
    lower: TrigramInfo;
    fullNameZh: string;
    changedApplication: TrigramInfo;
    summaryZh: string;
  };
  wuxingRelation: {
    type: "use_generates_body" | "body_overcomes_use" | "same" | "body_generates_use" | "use_overcomes_body";
    levelZh: "大吉" | "中吉" | "平顺" | "耗神" | "遇阻";
    headlineZh: string;
    analysisZh: string;
  };
  decisionActionZh: {
    verdict: string; // 直决断语
    suitable: string[]; // 宜
    unsuitable: string[]; // 忌
    tacticalAdvice: string; // 战术策略
  };
}

const HEXAGRAM_NAMES: Record<string, string> = {
  "1_1": "乾为天", "1_2": "天泽履", "1_3": "天火同人", "1_4": "天雷无妄", "1_5": "天风姤", "1_6": "天水讼", "1_7": "天山遁", "1_8": "天地否",
  "2_1": "泽天夬", "2_2": "兑为泽", "2_3": "泽火革", "2_4": "泽雷随", "2_5": "泽风大过", "2_6": "泽水困", "2_7": "泽山咸", "2_8": "泽地萃",
  "3_1": "火天大有", "3_2": "火泽睽", "3_3": "离为火", "3_4": "火雷噬嗑", "3_5": "火风鼎", "3_6": "火水未济", "3_7": "火山旅", "3_8": "火地晋",
  "4_1": "雷天大壮", "4_2": "雷泽归妹", "4_3": "雷火丰", "4_4": "震为雷", "4_5": "雷风恒", "4_6": "雷水解", "4_7": "雷山小过", "4_8": "雷地豫",
  "5_1": "风天小畜", "5_2": "风泽中孚", "5_3": "风火家人", "5_4": "风雷益", "5_5": "巽为风", "5_6": "风水涣", "5_7": "风山渐", "5_8": "风地观",
  "6_1": "水天需", "6_2": "水泽节", "6_3": "水火既济", "6_4": "水雷屯", "6_5": "水风井", "6_6": "坎为水", "6_7": "水山蹇", "6_8": "水地比",
  "7_1": "山天大畜", "7_2": "山泽损", "7_3": "山火贲", "7_4": "山雷颐", "7_5": "山风蛊", "7_6": "山水蒙", "7_7": "艮为山", "7_8": "山地剥",
  "8_1": "地天泰", "8_2": "地泽临", "8_3": "地火明夷", "8_4": "地雷复", "8_5": "地风升", "8_6": "地水师", "8_7": "地山谦", "8_8": "坤为地"
};

function trigramFromLines(lines: [boolean, boolean, boolean]): TrigramInfo {
  for (let i = 1; i <= 8; i++) {
    const t = TRIGRAMS[i];
    if (t.lines[0] === lines[0] && t.lines[1] === lines[1] && t.lines[2] === lines[2]) {
      return t;
    }
  }
  return TRIGRAMS[1];
}

const ELEMENT_GENERATION: Record<string, string> = {
  Wood: "Fire", Fire: "Earth", Earth: "Metal", Metal: "Water", Water: "Wood"
};

const ELEMENT_OVERCOMING: Record<string, string> = {
  Wood: "Earth", Earth: "Water", Water: "Fire", Fire: "Metal", Metal: "Wood"
};

/**
 * 梅花易数核心推演函数
 */
export function divineMeihua(
  question: string,
  mode: "time" | "numbers" = "time",
  customNumbers?: [number, number, number]
): MeihuaDivinationResult {
  let numUpper = 1;
  let numLower = 1;
  let numMoving = 1;

  if (mode === "numbers" && customNumbers) {
    numUpper = customNumbers[0];
    numLower = customNumbers[1];
    numMoving = customNumbers[2];
  } else {
    // 依据当下时空年月日时起卦
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const d = now.getDate();
    const h = now.getHours();

    const sumA = y + m + d;
    const sumB = sumA + h;

    numUpper = (sumA % 8) || 8;
    numLower = (sumB % 8) || 8;
    numMoving = (sumB % 6) || 6;
  }

  const upperIndex = ((numUpper - 1) % 8) + 1;
  const lowerIndex = ((numLower - 1) % 8) + 1;
  const movingLine = ((numMoving - 1) % 6) + 1; // 1 to 6

  const upperTri = TRIGRAMS[upperIndex];
  const lowerTri = TRIGRAMS[lowerIndex];
  const primaryName = HEXAGRAM_NAMES[`${upperIndex}_${lowerIndex}`] || `${upperTri.nameZh}${lowerTri.natureZh}`;

  // 6 爻组合：初爻到六爻 (从下至上)
  const allLines = [...lowerTri.lines, ...upperTri.lines];

  // 体用判定：动爻所在为用卦，不动者为体卦
  const isMovingInLower = movingLine <= 3;
  const bodyTri = isMovingInLower ? upperTri : lowerTri;
  const useTri = isMovingInLower ? lowerTri : upperTri;

  // 互卦：二三四爻为下互，三四五爻为上互
  const mutualLower = trigramFromLines([allLines[1], allLines[2], allLines[3]]);
  const mutualUpper = trigramFromLines([allLines[2], allLines[3], allLines[4]]);
  const mutualName = HEXAGRAM_NAMES[`${mutualUpper.number}_${mutualLower.number}`] || "互卦成形";

  // 变卦：动爻阴阳翻转
  const changedLines = [...allLines];
  changedLines[movingLine - 1] = !changedLines[movingLine - 1];

  const changedLower = trigramFromLines([changedLines[0], changedLines[1], changedLines[2]]);
  const changedUpper = trigramFromLines([changedLines[3], changedLines[4], changedLines[5]]);
  const changedName = HEXAGRAM_NAMES[`${changedUpper.number}_${changedLower.number}`] || "变卦显化";
  const changedUseTri = isMovingInLower ? changedLower : changedUpper;

  // 五行体用生克分析
  const bEl = bodyTri.element;
  const uEl = useTri.element;

  let relationType: "use_generates_body" | "body_overcomes_use" | "same" | "body_generates_use" | "use_overcomes_body" = "same";
  let levelZh: "大吉" | "中吉" | "平顺" | "耗神" | "遇阻" = "平顺";
  let headlineZh = "体用比和 · 和合共赢";
  let analysisZh = `体卦【${bodyTri.nameZh}】与用卦【${useTri.nameZh}】同属【${bodyTri.elementZh}】，双方气场同频，利于合作商议，无外界克制。`;
  let verdict = "事态平稳顺畅，顺理成章推进即可。";
  let suitable = ["商议协作", "按部就班推进既定方案", "稳健决策"];
  let unsuitable = ["盲目激进拓展", "与合伙人内耗互疑"];
  let tacticalAdvice = "保持沉着公允，尊重共识原则。此卦利于合作共赢，切莫贪功冒进。";

  if (ELEMENT_GENERATION[uEl] === bEl) {
    relationType = "use_generates_body";
    levelZh = "大吉";
    headlineZh = "用生体卦 · 顺水推舟";
    analysisZh = `用卦【${useTri.nameZh}（${useTri.elementZh}）】生助体卦【${bodyTri.nameZh}（${bodyTri.elementZh}）】。外部环境与合作方主动助力，水到渠成！`;
    verdict = "大吉大利！所问之事逢外界贵人或时势生助，宜大胆决断。";
    suitable = ["主动出击", "提交重要申请/签约", "推动核心谈判", "开启新项目"];
    unsuitable = ["优柔寡断错失窗口期", "过分谦退推卸责任"];
    tacticalAdvice = "乘势而上，迅速敲定关键条款，借外力成就自身目标。";
  } else if (ELEMENT_OVERCOMING[bEl] === uEl) {
    relationType = "body_overcomes_use";
    levelZh = "中吉";
    headlineZh = "体克用卦 · 劳而有成";
    analysisZh = `体卦【${bodyTri.nameZh}（${bodyTri.elementZh}）】克制用卦【${useTri.nameZh}（${useTri.elementZh}）】。主导权在我方手中，需付出一份努力方克全功。`;
    verdict = "中吉。事情掌握在你手中，虽然前期需多费心血调和，终能得偿所愿。";
    suitable = ["攻坚克难", "主动确立规矩", "严格把控验收标准", "强化执行落地"];
    unsuitable = ["躺平被动等待", "轻易向不合理要求妥协"];
    tacticalAdvice = "保持清晰底线，事必躬亲抓牢关键环节。";
  } else if (ELEMENT_GENERATION[bEl] === uEl) {
    relationType = "body_generates_use";
    levelZh = "耗神";
    headlineZh = "体生用卦 · 泄气多耗";
    analysisZh = `体卦【${bodyTri.nameZh}（${bodyTri.elementZh}）】生泄用卦【${useTri.nameZh}（${useTri.elementZh}）】。付出远大于回馈，需谨防精力或资金被动消耗。`;
    verdict = "耗神劳心。当下推进此事成本偏高、周期较长，不宜孤注一掷。";
    suitable = ["设好止损线", "复盘精简流程", "休养生息蓄力"];
    unsuitable = ["无底线追加投入", "大包大揽替人兜底"];
    tacticalAdvice = "适当收缩防线，只做核心最小可行性尝试，避免战线拉得太长。";
  } else if (ELEMENT_OVERCOMING[uEl] === bEl) {
    relationType = "use_overcomes_body";
    levelZh = "遇阻";
    headlineZh = "用克体卦 · 逆风需守";
    analysisZh = `用卦【${useTri.nameZh}（${useTri.elementZh}）】克制体卦【${bodyTri.nameZh}（${bodyTri.elementZh}）】。外部环境或对方带来较强压制阻力，不宜硬碰。`;
    verdict = "需谨慎避险。当下阻力较强，宜避其锋芒、以守为攻。";
    suitable = ["静观其变", "补全漏洞资质", "咨询资深智囊", "推迟重大拍板"];
    unsuitable = ["情绪化正面交锋", "仓促签订重大法律/金钱协议"];
    tacticalAdvice = "遇克当求通关，暂勿急于求成。静待时移世易，修整内在实力。";
  }

  return {
    question: question || "当前关键决策与事态走向",
    castMode: mode,
    numbers: [numUpper, numLower, numMoving],
    primaryHexagram: {
      upper: upperTri,
      lower: lowerTri,
      fullNameZh: primaryName,
      symbol: `䷀`,
      lines: allLines
    },
    movingLine,
    bodyTrigram: {
      trigram: bodyTri,
      position: isMovingInLower ? "upper" : "lower",
      role: "体卦 (我方/所占之事)"
    },
    applicationTrigram: {
      trigram: useTri,
      position: isMovingInLower ? "lower" : "upper",
      role: "用卦 (事态/对方境遇)"
    },
    mutualHexagram: {
      upper: mutualUpper,
      lower: mutualLower,
      fullNameZh: mutualName,
      summaryZh: `互卦见【${mutualName}】，反映事态中间阶段的暗流隐动与转折关口。`
    },
    transformedHexagram: {
      upper: changedUpper,
      lower: changedLower,
      fullNameZh: changedName,
      changedApplication: changedUseTri,
      summaryZh: `动爻引动显化为变卦【${changedName}】，预示后续最终归宿与定局气象。`
    },
    wuxingRelation: {
      type: relationType,
      levelZh,
      headlineZh,
      analysisZh
    },
    decisionActionZh: {
      verdict,
      suitable,
      unsuitable,
      tacticalAdvice
    }
  };
}
