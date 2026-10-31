export interface HexagramData {
  number: number;
  binary: string; // 6 bits from bottom to top, 1=yang, 0=yin (e.g. 111111 for Qian)
  symbol: string;
  nameZh: string;
  pinyin: string;
  nameEn: string;
  upperTrigram: string;
  lowerTrigram: string;
  judgmentEn: string;
  judgmentZh: string;
  imageEn: string;
  imageZh: string;
  careerAdviceEn: string;
  careerAdviceZh: string;
  relationshipAdviceEn: string;
  relationshipAdviceZh: string;
}

export interface CoinTossLine {
  lineIndex: number; // 1 to 6 (1 is bottom)
  coins: [number, number, number]; // e.g. [2, 3, 3]
  sum: number; // 6, 7, 8, 9
  isYang: boolean; // primary line: 7, 9 are Yang (true), 6, 8 are Yin (false)
  isChanging: boolean; // 6 or 9
  changedYang: boolean; // after change: 6 becomes Yang, 9 becomes Yin
}

export interface IChingReading {
  lines: CoinTossLine[];
  primaryHexagram: HexagramData;
  transformedHexagram: HexagramData | null;
  changingLineIndices: number[];
}

export const HEXAGRAMS_DB: Record<number, HexagramData> = {
  1: {
    number: 1,
    binary: "111111",
    symbol: "䷀",
    nameZh: "乾为天",
    pinyin: "Qián",
    nameEn: "The Creative (Heaven)",
    upperTrigram: "Heaven (乾)",
    lowerTrigram: "Heaven (乾)",
    judgmentEn: "Sublime success through perseverance. Pure creative vitality is surging. Lead with integrity, vision, and unwavering resolve.",
    judgmentZh: "元亨利贞。天行健，君子以自强不息。纯阳之正气，盛大亨通，利于以坚毅立身破局。",
    imageEn: "Heaven moves with ceaseless power; the noble soul strengthens themselves without pause.",
    imageZh: "天行健，君子以自强不息。",
    careerAdviceEn: "A golden window for launching bold ventures, taking decisive command, and inspiring through high ethical standards.",
    careerAdviceZh: "大展宏图的巅峰机遇期，宜积极开拓、确立权威，凡事依道而行必获大成。",
    relationshipAdviceEn: "Honesty, mutual respect, and inspiring leadership. Avoid dominating; let your warmth uplift your partner.",
    relationshipAdviceZh: "坦荡相待，以正道感化对方。忌刚愎自用，多给伴侣尊重与支持。"
  },
  2: {
    number: 2,
    binary: "000000",
    symbol: "䷁",
    nameZh: "坤为地",
    pinyin: "Kūn",
    nameEn: "The Receptive (Earth)",
    upperTrigram: "Earth (坤)",
    lowerTrigram: "Earth (坤)",
    judgmentEn: "Sublime receptivity. Success comes not from pushing, but from yielding, listening, nurturing, and following natural timing.",
    judgmentZh: "地势坤，君子以厚德载物。柔顺包容，利于后发制人，顺承天意而润泽万物。",
    imageEn: "The earth's capacity is vast; the noble soul sustains all beings with boundless generosity.",
    imageZh: "地势坤，君子以厚德载物。",
    careerAdviceEn: "Focus on support, strategic collaboration, groundwork, and listening. Don't force outcomes; let opportunities ripen.",
    careerAdviceZh: "宜退守蓄力，厚积薄发。做好幕后支撑与团队协作，顺势而为胜过锋芒毕露。",
    relationshipAdviceEn: "Unconditional acceptance, gentle patience, and deep listening heal conflicts and nurture lasting devotion.",
    relationshipAdviceZh: "以柔克刚，以温润体贴化解分歧，包容与长情是牢固关系的基石。"
  },
  3: {
    number: 3,
    binary: "100010",
    symbol: "䷂",
    nameZh: "水雷屯",
    pinyin: "Zhūn",
    nameEn: "Difficulty at the Beginning",
    upperTrigram: "Water (坎)",
    lowerTrigram: "Thunder (震)",
    judgmentEn: "A sprout pushing through frozen earth. Chaos precedes great order. Do not advance blindly; seek wise helpers.",
    judgmentZh: "屯。元亨利贞，勿用有攸往，利建侯。万物初生萌芽，虽逢艰难险阻，利于奠定基石、寻访贵人。",
    imageEn: "Clouds and thunder generate raw energy; the noble soul weaves chaos into disciplined structure.",
    imageZh: "云雷屯，君子以经纶。",
    careerAdviceEn: "A new venture is fledgling. Persevere through initial growing pains. Seek mentors and establish solid roots.",
    careerAdviceZh: "创业初期的试炼阶段，莫急于贪大求快，宜夯实基础、广结善缘寻求外力支持。",
    relationshipAdviceEn: "Early awkwardness or miscommunications require gentle patience and clarity. Don't rush commitments.",
    relationshipAdviceZh: "相处初期难免磨合磕绊，少说气话，多给彼此适应空间方能渐入佳境。"
  },
  4: {
    number: 4,
    binary: "010001",
    symbol: "䷃",
    nameZh: "山水蒙",
    pinyin: "Méng",
    nameEn: "Youthful Folly",
    upperTrigram: "Mountain (艮)",
    lowerTrigram: "Water (坎)",
    judgmentEn: "Inexperience seeks illumination. Success arrives through humble learning and respecting disciplined guidance.",
    judgmentZh: "蒙。亨。匪我求童蒙，童蒙求我。初噬告，再三渎，渎则不告。利贞。启蒙解惑，贵在尊师重道、持敬求学。",
    imageEn: "A spring issues from the foot of the mountain; the noble soul fosters virtue through thoughtful action.",
    imageZh: "山下出泉，蒙。君子以果行育德。",
    careerAdviceEn: "Recognize what you do not know. Put aside pride, enroll in training, and consult verified experts.",
    careerAdviceZh: "切忌不懂装懂盲目做重大决策，向有经验的前辈谦逊请教是当前最佳突破口。",
    relationshipAdviceEn: "Approach misunderstandings with childlike curiosity rather than stubborn accusations.",
    relationshipAdviceZh: "放下偏执与预设，倾听伴侣真实心声，在共同成长中消除误解。"
  },
  5: {
    number: 5,
    binary: "111010",
    symbol: "䷄",
    nameZh: "水天需",
    pinyin: "Xū",
    nameEn: "Waiting (Nourishment)",
    upperTrigram: "Water (坎)",
    lowerTrigram: "Heaven (乾)",
    judgmentEn: "Patient anticipation filled with inner faith. Clouded skies promise rain. Nourish body and soul while waiting for the right tide.",
    judgmentZh: "需。有孚，光亨，贞吉。利涉大川。养精蓄锐，顺时而动，在等待中保持坚定信念必迎转机。",
    imageEn: "Clouds rise high into heaven; the noble soul feasts and rests in tranquil joy.",
    imageZh: "云上于天，需。君子以饮食宴乐。",
    careerAdviceEn: "Timing is everything. Do not push against closed doors right now. Hone your skills and maintain inner calm.",
    careerAdviceZh: "当前非硬冲之期，稍安勿躁。做好案头准备与能量蓄水，时机成熟时自有一跃而起的东风。",
    relationshipAdviceEn: "Allow romantic bonds to mature organically without demanding premature ultimatums.",
    relationshipAdviceZh: "感情需慢火细炖，切莫逼迫对方表态，顺其自然更有利于感情升温。"
  },
  6: {
    number: 6,
    binary: "010111",
    symbol: "䷅",
    nameZh: "天水讼",
    pinyin: "Sòng",
    nameEn: "Conflict",
    upperTrigram: "Heaven (乾)",
    lowerTrigram: "Water (坎)",
    judgmentEn: "Opposing desires breed friction. Seek compromise early; an unyielding battle brings only mutual loss. Consult a neutral mediator.",
    judgmentZh: "讼。有孚，窒惕，中吉，终凶。利见大人，不利涉大川。止争息讼，退步海阔天空，不可斗争到底。",
    imageEn: "Heaven and water move in divergent paths; the noble soul weighs actions carefully before engaging.",
    imageZh: "天与水违行，讼。君子以作事谋始。",
    careerAdviceEn: "Avoid lawsuits or cutthroat political battles. Look for win-win resolutions or gracefully step back.",
    careerAdviceZh: "工作中慎防合同漏洞与口舌之非，与其据理力争玉石俱焚，不如各退一步求得双赢。",
    relationshipAdviceEn: "Drop the urge to 'win' the argument. Winning the argument often means losing the heart.",
    relationshipAdviceZh: "在亲密关系中争论输赢毫无意义，给彼此台阶下才能修复裂痕。"
  },
  7: {
    number: 7,
    binary: "010000",
    symbol: "䷆",
    nameZh: "地水师",
    pinyin: "Shī",
    nameEn: "The Army (Discipline)",
    upperTrigram: "Earth (坤)",
    lowerTrigram: "Water (坎)",
    judgmentEn: "Mobilization under disciplined leadership. Collective focus and moral integrity conquer insurmountable obstacles.",
    judgmentZh: "师。贞，丈人吉，无咎。兴师动众需持正道，严明纪律，择良将统率方能制胜。",
    imageEn: "Water hidden beneath the earth; the noble soul gathers and nourishes the people with open generosity.",
    imageZh: "地中有水，师。君子以容民畜众。",
    careerAdviceEn: "Structure your workflows, eliminate distractions, and unite your team behind a clear, noble mission.",
    careerAdviceZh: "团队管理需赏罚分明、行动一致。以清晰的战略与严格的执行力攻坚克难。",
    relationshipAdviceEn: "Establish clear shared boundaries and respect commitments to keep the relationship stable.",
    relationshipAdviceZh: "彼此需明确原则底线与责任分工，言出必行方能建立深层安全感。"
  },
  8: {
    number: 8,
    binary: "000010",
    symbol: "䷇",
    nameZh: "水地比",
    pinyin: "Bǐ",
    nameEn: "Union (Alliance)",
    upperTrigram: "Water (坎)",
    lowerTrigram: "Earth (坤)",
    judgmentEn: "Auspicious closeness and mutual affinity. Like water nourishing earth, true partnership brings enduring prosperity.",
    judgmentZh: "比。吉。原筮，元永贞，无咎。不宁方来，后夫凶。亲和依附，相辅相成，利于结盟与同心协力。",
    imageEn: "Water rests peacefully upon the earth; the noble rulers cultivate enduring friendship with neighboring states.",
    imageZh: "地上有水，比。先王以建万国，亲诸侯。",
    careerAdviceEn: "Form strategic partnerships. Network with genuine goodwill and share credit generously.",
    careerAdviceZh: "合伙合作大吉之兆。寻找志同道合的盟友，携手借力共赢大于单打独斗。",
    relationshipAdviceEn: "Deep emotional bonding, mutual devotion, and unconditional camaraderie blossom naturally.",
    relationshipAdviceZh: "彼此灵魂呼应，亲密无间。真心以待，将迎来甜蜜且长久的相守时光。"
  },
  11: {
    number: 11,
    binary: "111000",
    symbol: "䷊",
    nameZh: "地天泰",
    pinyin: "Tài",
    nameEn: "Peace (Harmony)",
    upperTrigram: "Earth (坤)",
    lowerTrigram: "Heaven (乾)",
    judgmentEn: "Heaven descends and Earth rises in sublime union. The small departs and the great arrives. Golden era of harmony and growth.",
    judgmentZh: "泰。小往大来，吉亨。天地交而万物通也，上下交而其志同也。阴阳调和，百事亨通顺遂。",
    imageEn: "Heaven and Earth unite in creative communion; the noble sovereign crafts abundance for all beings.",
    imageZh: "天地交，泰。后以财成天地之道，辅相天地之宜，以左右民。",
    careerAdviceEn: "Outstanding prosperity. Capitalize on favorable winds to launch, invest, and build lasting legacy.",
    careerAdviceZh: "事业运势步入上升黄金期，各方阻力消融，大胆执行规划必有丰厚回报。",
    relationshipAdviceEn: "Effortless communication, deep mutual adoration, and joyous emotional communion.",
    relationshipAdviceZh: "情感和谐甜蜜，心意相通，彼此滋养，是步入更高承诺层级的理想时机。"
  },
  12: {
    number: 12,
    binary: "000111",
    symbol: "䷋",
    nameZh: "天地否",
    pinyin: "Pǐ",
    nameEn: "Standstill (Stagnation)",
    upperTrigram: "Heaven (乾)",
    lowerTrigram: "Earth (坤)",
    judgmentEn: "Heaven ascends and Earth sinks away. Communication is blocked. Withdraw outward ambition and preserve inner integrity.",
    judgmentZh: "否之匪人，不利君子贞，大往小来。天地不交，闭塞不通。君子宜韬光养晦，退守自保以待时机。",
    imageEn: "Heaven and Earth disconnect; the noble soul retreats to virtue and avoids corrupt honors.",
    imageZh: "天地不交，否。君子以俭德辟难，不可荣以禄。",
    careerAdviceEn: "Obstacles arise from outside forces. Do not force expansion. Protect your assets, refine your inner craft, and wait.",
    careerAdviceZh: "外部大环境或人际阻隔重重，切勿贸然大举投资或硬拼，守住底线耐心蛰伏。",
    relationshipAdviceEn: "Emotional coldness or distance. Step back from petty arguments; give space for calm reflection.",
    relationshipAdviceZh: "沟通出现隔阂与冷淡，此时强求追问只会加剧对立，给彼此冷静思考的空间。"
  },
  64: {
    number: 64,
    binary: "010101",
    symbol: "䷿",
    nameZh: "火水未济",
    pinyin: "Wèi Jì",
    nameEn: "Before Completion",
    upperTrigram: "Fire (离)",
    lowerTrigram: "Water (坎)",
    judgmentEn: "Fire above water — poised on the edge of renewal. The journey is almost finished, but requires the utmost vigilance at the final step.",
    judgmentZh: "未济。亨。小狐汔济，濡其尾，无攸利。事未完结，生机无限。临近成功的最后一步尤须谨慎行事。",
    imageEn: "Fire rests above water; the noble soul carefully distinguishes things and places each in its proper home.",
    imageZh: "火在水上，未济。君子以慎辨物居方。",
    careerAdviceEn: "You are on the threshold of victory. Avoid premature celebration; double-check contracts, code, and details.",
    careerAdviceZh: "胜利曙光已现，但行百里者半九十，细节把控至关重要，稳健收尾方可圆满。",
    relationshipAdviceEn: "A new chapter is opening. Approach each other with renewed respect and unhurried tenderness.",
    relationshipAdviceZh: "旧的纠葛将散，新的默契正在酝酿，多些包容与细致关怀将开启美好新阶段。"
  }
};

// Fallback for hexagrams not explicitly mapped in lite DB
export function getHexagramByBinary(binary: string): HexagramData {
  const found = Object.values(HEXAGRAMS_DB).find(h => h.binary === binary);
  if (found) return found;

  // General fallback synthesized dynamically
  const isYangDom = (binary.match(/1/g) || []).length >= 3;
  return {
    number: 1,
    binary,
    symbol: "䷀",
    nameZh: isYangDom ? "乾健生生卦" : "坤厚柔化卦",
    pinyin: "Guà",
    nameEn: isYangDom ? "Dynamic Resurgence" : "Quiet Nurturance",
    upperTrigram: isYangDom ? "Heaven" : "Earth",
    lowerTrigram: isYangDom ? "Thunder" : "Water",
    judgmentEn: "A moment of transformation. Align your mind with natural cycles and maintain steadfast virtue.",
    judgmentZh: "变动不居，顺天应时。保持中正之心，随顺因缘即可逢凶化吉。",
    imageEn: "Cosmic forces shift in harmonic resonance; the wise navigate the stream with balance.",
    imageZh: "四时变通，与时偕行。",
    careerAdviceEn: "Adapt to changing tides. Stay observant, keep promises, and pace your investments.",
    careerAdviceZh: "顺势调整策略，稳扎稳打，重视契约与长线信誉。",
    relationshipAdviceEn: "Seek sincere dialogue and honor each other's evolutionary journey.",
    relationshipAdviceZh: "坦诚沟通，彼此赋能，在互动中体察彼此的成长与心意。"
  };
}

/**
 * Simulates throwing 3 coins (2 for Yin, 3 for Yang)
 */
export function tossCoins(): CoinTossLine["coins"] {
  const flip = () => (Math.random() >= 0.5 ? 3 : 2);
  return [flip(), flip(), flip()];
}

/**
 * Casts a full 6-line I Ching reading
 */
export function castIChingReading(): IChingReading {
  const lines: CoinTossLine[] = [];
  let primaryBinary = "";
  let transformedBinary = "";
  const changingLineIndices: number[] = [];

  for (let i = 1; i <= 6; i++) {
    const coins = tossCoins();
    const sum = coins[0] + coins[1] + coins[2];
    const isYang = sum === 7 || sum === 9;
    const isChanging = sum === 6 || sum === 9;
    const changedYang = sum === 6 ? true : sum === 9 ? false : isYang;

    primaryBinary += isYang ? "1" : "0";
    transformedBinary += changedYang ? "1" : "0";

    if (isChanging) {
      changingLineIndices.push(i);
    }

    lines.push({
      lineIndex: i,
      coins,
      sum,
      isYang,
      isChanging,
      changedYang
    });
  }

  const primaryHexagram = getHexagramByBinary(primaryBinary);
  const transformedHexagram =
    changingLineIndices.length > 0 ? getHexagramByBinary(transformedBinary) : null;

  return {
    lines,
    primaryHexagram,
    transformedHexagram,
    changingLineIndices
  };
}
