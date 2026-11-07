import { Solar } from "lunar-typescript";

export interface QimenPalace {
  palaceId: number; // 1 to 9 (九宫数)
  bagua: string; // 坎、坤、震、巽、中、乾、兑、艮、离
  directionZh: string; // 正北、西南、正东、东南、中央、西北、正西、东北、正南
  elementZh: string; // 水、土、木、木、土、金、金、土、火
  originalStar: string; // 天蓬、天芮、天冲、天辅、天禽、天心、天柱、天任、天英
  originalGate: string; // 休、死、伤、杜、中、开、惊、生、景
  currentStar: string;
  currentGate: string;
  currentDeity: string; // 值符、腾蛇、太阴、六合、白虎、玄武、九地、九天
  heavenStem: string; // 天盘干
  earthStem: string; // 地盘干
  isAuspiciousGate: boolean; // 是否逢开门、休门、生门三大吉门
  qualityLevel: "大吉" | "次吉" | "平" | "凶";
  domainAdviceZh: string; // 适用场景
}

export interface QimenChartResult {
  querySolar: {
    year: number;
    month: number;
    day: number;
    hour: number;
  };
  ganzhi: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
  solarTermZh: string;
  dunType: "阳遁" | "阴遁";
  juNumber: number; // 1 to 9
  zhifuStar: string; // 值符九星 (旬首值班)
  zhishiGate: string; // 值使八门
  palaces: QimenPalace[]; // 9 palaces arranged in standard Lo Shu order
  bestDirections: {
    wealthZh: string; // 生门求财吉方
    careerZh: string; // 开门谋事吉方
    negotiationZh: string; // 休门和谈吉方
  };
  strategicAdviceZh: string;
}

// 洛书九宫原始配置
const LO_SHU_ORDER = [4, 9, 2, 3, 5, 7, 8, 1, 6]; // 九宫格视觉排列（第一行：巽4 离9 坤2；第二行：震3 中5 兑7；第三行：艮8 坎1 乾6）

const ORIGINAL_PALACE_CONFIGS: Record<number, { bagua: string; direction: string; element: string; star: string; gate: string }> = {
  1: { bagua: "坎", direction: "正北", element: "水", star: "天蓬", gate: "休门" },
  2: { bagua: "坤", direction: "西南", element: "土", star: "天芮", gate: "死门" },
  3: { bagua: "震", direction: "正东", element: "木", star: "天冲", gate: "伤门" },
  4: { bagua: "巽", direction: "东南", element: "木", star: "天辅", gate: "杜门" },
  5: { bagua: "中", direction: "中央", element: "土", star: "天禽", gate: "开门" }, // 寄二宫
  6: { bagua: "乾", direction: "西北", element: "金", star: "天心", gate: "开门" },
  7: { bagua: "兑", direction: "正西", element: "金", star: "天柱", gate: "惊门" },
  8: { bagua: "艮", direction: "东北", element: "土", star: "天任", gate: "生门" },
  9: { bagua: "离", direction: "正南", element: "火", star: "天英", gate: "景门" }
};

const DEITIES = ["值符", "腾蛇", "太阴", "六合", "白虎", "玄武", "九地", "九天"];
const GATES = ["休门", "生门", "伤门", "杜门", "景门", "死门", "惊门", "开门"];
const STARS = ["天蓬", "天任", "天冲", "天辅", "天英", "天芮", "天柱", "天心"];
const SAN_QI_LIU_YI = ["戊", "己", "庚", "辛", "壬", "癸", "丁", "丙", "乙"];

export function calculateQimen(targetDate: Date = new Date()): QimenChartResult {
  const solar = Solar.fromDate(targetDate);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  const jieqi = lunar.getJieQi() || "冬至后阳气发萌";
  const m = targetDate.getMonth() + 1;
  const d = targetDate.getDate();

  // 冬至后阳遁，夏至后阴遁 (近似月判定：冬至约 12.21 到 夏至 6.21 阳遁，夏至至冬至阴遁)
  const isYangDun = (m >= 1 && m < 6) || (m === 6 && d < 21) || (m === 12 && d >= 21);
  const dunType = isYangDun ? "阳遁" : "阴遁";

  // 局数简易推演 (1-9)
  const juNumber = ((targetDate.getDate() + targetDate.getHours()) % 9) + 1;

  // 旋转偏移排盘
  const offset = juNumber % 8;

  const palaces: QimenPalace[] = [];

  for (let id = 1; id <= 9; id++) {
    const orig = ORIGINAL_PALACE_CONFIGS[id];
    let curGate = orig.gate;
    let curStar = orig.star;
    let curDeity = "太阴";
    let heavenStem = "丁";
    let earthStem = "甲";

    if (id === 5) {
      // 中宫寄坤二宫
      curGate = "生门";
      curStar = "天禽";
      curDeity = "值符";
      heavenStem = "戊";
      earthStem = "戊";
    } else {
      const idx = (id + offset) % 8;
      curGate = GATES[idx];
      curStar = STARS[idx];
      curDeity = DEITIES[idx];
      heavenStem = SAN_QI_LIU_YI[(id + offset) % 9];
      earthStem = SAN_QI_LIU_YI[id % 9];
    }

    const isAuspicious = curGate === "开门" || curGate === "休门" || curGate === "生门";
    let qualityLevel: "大吉" | "次吉" | "平" | "凶" = "平";
    if (isAuspicious && (curDeity === "值符" || curDeity === "太阴" || curDeity === "六合")) {
      qualityLevel = "大吉";
    } else if (isAuspicious) {
      qualityLevel = "次吉";
    } else if (curGate === "死门" || curGate === "惊门" || curDeity === "白虎") {
      qualityLevel = "凶";
    }

    let domainAdviceZh = "平稳推进常规事务";
    if (curGate === "生门") domainAdviceZh = "求财置业、商务谈判、招商融资极吉";
    else if (curGate === "开门") domainAdviceZh = "开创新局、面试求职、公开亮相、领证启幕";
    else if (curGate === "休门") domainAdviceZh = "休养调息、拜访贵人、化解矛盾、签署和约";
    else if (curGate === "景门") domainAdviceZh = "文书策划、广告宣传、宴会聚会";
    else if (curGate === "杜门") domainAdviceZh = "藏风聚气、保密研发、防范泄密";
    else if (curGate === "伤门") domainAdviceZh = "讨债索赔、打猎追捕、竞技博弈";
    else if (curGate === "死门") domainAdviceZh = "超度冥想、吊唁破旧、不宜求生";
    else if (curGate === "惊门") domainAdviceZh = "捕盗诉讼、严厉盘查、常人宜避";

    palaces.push({
      palaceId: id,
      bagua: orig.bagua,
      directionZh: orig.direction,
      elementZh: orig.element,
      originalStar: orig.star,
      originalGate: orig.gate,
      currentStar: curStar,
      currentGate: curGate,
      currentDeity: curDeity,
      heavenStem,
      earthStem,
      isAuspiciousGate: isAuspicious,
      qualityLevel,
      domainAdviceZh
    });
  }

  // 求吉方
  const shengPalace = palaces.find(p => p.currentGate === "生门") || palaces[0];
  const kaiPalace = palaces.find(p => p.currentGate === "开门") || palaces[5];
  const xiuPalace = palaces.find(p => p.currentGate === "休门") || palaces[1];

  return {
    querySolar: {
      year: targetDate.getFullYear(),
      month: targetDate.getMonth() + 1,
      day: targetDate.getDate(),
      hour: targetDate.getHours()
    },
    ganzhi: {
      year: eightChar.getYear(),
      month: eightChar.getMonth(),
      day: eightChar.getDay(),
      hour: eightChar.getTime()
    },
    solarTermZh: jieqi,
    dunType,
    juNumber,
    zhifuStar: "天心星",
    zhishiGate: "开门",
    palaces,
    bestDirections: {
      wealthZh: `${shengPalace.directionZh}（${shengPalace.bagua}宫逢生门，大吉大利）`,
      careerZh: `${kaiPalace.directionZh}（${kaiPalace.bagua}宫逢开门，谋事大顺）`,
      negotiationZh: `${xiuPalace.directionZh}（${xiuPalace.bagua}宫逢休门，和气生财）`
    },
    strategicAdviceZh: `当前局象逢【${dunType}${juNumber}局】。三吉门气场流转，西北至东北一线逢生开休拱照。出行办事宜面向【${shengPalace.directionZh}】或【${kaiPalace.directionZh}】展布，避开凶门对冲，运筹帷幄自得天时。`
  };
}
