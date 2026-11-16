/**
 * 周易标准查表：八卦 → 六十四卦（文王卦序）
 *
 * 爻线编码：6 位字符串，自初爻至上爻，阳=1、阴=0。
 * 前三位为下卦，后三位为上卦；先查八卦，再以上下卦组合查 64 卦。
 * 卦名、卦符、卦辞、大象传全部来自本表，禁止任何运行时「按阴阳多寡」推演或由 AI 生成。
 */

export interface TrigramInfo {
  /** 3 位，自下而上，阳=1 */
  bits: string;
  symbol: string;
  nameZh: string;
  natureZh: string;
  nameEn: string;
  natureEn: string;
}

/** 八卦查表：key 为 3 位爻线（初爻→三爻） */
export const TRIGRAMS_BY_BITS: Record<string, TrigramInfo> = {
  '111': { bits: '111', symbol: '☰', nameZh: '乾', natureZh: '天', nameEn: 'Qian', natureEn: 'Heaven' },
  '110': { bits: '110', symbol: '☱', nameZh: '兑', natureZh: '泽', nameEn: 'Dui', natureEn: 'Lake' },
  '101': { bits: '101', symbol: '☲', nameZh: '离', natureZh: '火', nameEn: 'Li', natureEn: 'Fire' },
  '100': { bits: '100', symbol: '☳', nameZh: '震', natureZh: '雷', nameEn: 'Zhen', natureEn: 'Thunder' },
  '011': { bits: '011', symbol: '☴', nameZh: '巽', natureZh: '风', nameEn: 'Xun', natureEn: 'Wind' },
  '010': { bits: '010', symbol: '☵', nameZh: '坎', natureZh: '水', nameEn: 'Kan', natureEn: 'Water' },
  '001': { bits: '001', symbol: '☶', nameZh: '艮', natureZh: '山', nameEn: 'Gen', natureEn: 'Mountain' },
  '000': { bits: '000', symbol: '☷', nameZh: '坤', natureZh: '地', nameEn: 'Kun', natureEn: 'Earth' }
};

export interface HexagramEntry {
  number: number; // 文王卦序 1-64
  upper: string; // 上卦 3 位
  lower: string; // 下卦 3 位
  nameZh: string;
  pinyin: string;
  nameEn: string;
  judgmentZh: string; // 卦辞
  imageZh: string; // 大象传
}

/** [卦序, 上卦, 下卦, 中文卦名, 拼音, 英文名, 卦辞, 大象传] */
type Row = [number, string, string, string, string, string, string, string];

const KING_WEN_ROWS: Row[] = [
  [1, '111', '111', '乾为天', 'Qián', 'The Creative', '元亨利贞。', '天行健，君子以自强不息。'],
  [2, '000', '000', '坤为地', 'Kūn', 'The Receptive', '元亨，利牝马之贞。', '地势坤，君子以厚德载物。'],
  [3, '010', '100', '水雷屯', 'Zhūn', 'Difficulty at the Beginning', '元亨利贞，勿用有攸往，利建侯。', '云雷屯，君子以经纶。'],
  [4, '001', '010', '山水蒙', 'Méng', 'Youthful Folly', '亨。匪我求童蒙，童蒙求我。', '山下出泉，蒙；君子以果行育德。'],
  [5, '010', '111', '水天需', 'Xū', 'Waiting', '有孚，光亨，贞吉，利涉大川。', '云上于天，需；君子以饮食宴乐。'],
  [6, '111', '010', '天水讼', 'Sòng', 'Conflict', '有孚，窒惕，中吉，终凶。', '天与水违行，讼；君子以作事谋始。'],
  [7, '000', '010', '地水师', 'Shī', 'The Army', '贞，丈人吉，无咎。', '地中有水，师；君子以容民畜众。'],
  [8, '010', '000', '水地比', 'Bǐ', 'Holding Together', '吉。原筮，元永贞，无咎。', '地上有水，比；先王以建万国，亲诸侯。'],
  [9, '011', '111', '风天小畜', 'Xiǎo Chù', 'The Taming Power of the Small', '亨。密云不雨，自我西郊。', '风行天上，小畜；君子以懿文德。'],
  [10, '111', '110', '天泽履', 'Lǚ', 'Treading', '履虎尾，不咥人，亨。', '上天下泽，履；君子以辨上下，定民志。'],
  [11, '000', '111', '地天泰', 'Tài', 'Peace', '小往大来，吉亨。', '天地交，泰；后以财成天地之道。'],
  [12, '111', '000', '天地否', 'Pǐ', 'Standstill', '否之匪人，不利君子贞，大往小来。', '天地不交，否；君子以俭德辟难。'],
  [13, '111', '101', '天火同人', 'Tóng Rén', 'Fellowship with Men', '同人于野，亨。利涉大川，利君子贞。', '天与火，同人；君子以类族辨物。'],
  [14, '101', '111', '火天大有', 'Dà Yǒu', 'Great Possession', '元亨。', '火在天上，大有；君子以遏恶扬善。'],
  [15, '000', '001', '地山谦', 'Qiān', 'Modesty', '亨，君子有终。', '地中有山，谦；君子以裒多益寡。'],
  [16, '100', '000', '雷地豫', 'Yù', 'Enthusiasm', '利建侯行师。', '雷出地奋，豫；先王以作乐崇德。'],
  [17, '110', '100', '泽雷随', 'Suí', 'Following', '元亨利贞，无咎。', '泽中有雷，随；君子以向晦入宴息。'],
  [18, '001', '011', '山风蛊', 'Gǔ', 'Work on the Decayed', '元亨，利涉大川。先甲三日，后甲三日。', '山下有风，蛊；君子以振民育德。'],
  [19, '000', '110', '地泽临', 'Lín', 'Approach', '元亨利贞，至于八月有凶。', '泽上有地，临；君子以教思无穷。'],
  [20, '011', '000', '风地观', 'Guān', 'Contemplation', '盥而不荐，有孚颙若。', '风行地上，观；先王以省方观民设教。'],
  [21, '101', '100', '火雷噬嗑', 'Shì Kè', 'Biting Through', '亨。利用狱。', '雷电噬嗑；先王以明罚敕法。'],
  [22, '001', '101', '山火贲', 'Bì', 'Grace', '亨。小利有攸往。', '山下有火，贲；君子以明庶政。'],
  [23, '001', '000', '山地剥', 'Bō', 'Splitting Apart', '不利有攸往。', '山附于地，剥；上以厚下安宅。'],
  [24, '000', '100', '地雷复', 'Fù', 'Return', '亨。出入无疾，朋来无咎。反复其道，七日来复，利有攸往。', '雷在地中，复；先王以至日闭关。'],
  [25, '111', '100', '天雷无妄', 'Wú Wàng', 'Innocence', '元亨利贞。其匪正有眚，不利有攸往。', '天下雷行，无妄；先王以茂对时育万物。'],
  [26, '001', '111', '山天大畜', 'Dà Chù', 'The Taming Power of the Great', '利贞，不家食吉，利涉大川。', '天在山中，大畜；君子以多识前言往行。'],
  [27, '001', '100', '山雷颐', 'Yí', 'Nourishment', '贞吉。观颐，自求口实。', '山下有雷，颐；君子以慎言语，节饮食。'],
  [28, '110', '011', '泽风大过', 'Dà Guò', 'Great Preponderance', '栋桡，利有攸往，亨。', '泽灭木，大过；君子以独立不惧。'],
  [29, '010', '010', '坎为水', 'Kǎn', 'The Abysmal (Water)', '习坎，有孚，维心亨，行有尚。', '水洊至，习坎；君子以常德行。'],
  [30, '101', '101', '离为火', 'Lí', 'The Clinging (Fire)', '利贞，亨。畜牝牛，吉。', '明两作，离；大人以继明照四方。'],
  [31, '110', '001', '泽山咸', 'Xián', 'Influence', '亨，利贞，取女吉。', '山上有泽，咸；君子以虚受人。'],
  [32, '100', '011', '雷风恒', 'Héng', 'Duration', '亨，无咎，利贞，利有攸往。', '雷风，恒；君子以立不易方。'],
  [33, '111', '001', '天山遁', 'Dùn', 'Retreat', '亨，小利贞。', '天下有山，遁；君子以远小人。'],
  [34, '100', '111', '雷天大壮', 'Dà Zhuàng', 'Great Power', '利贞。', '雷在天上，大壮；君子以非礼弗履。'],
  [35, '101', '000', '火地晋', 'Jìn', 'Progress', '康侯用锡马蕃庶，昼日三接。', '明出地上，晋；君子以自昭明德。'],
  [36, '000', '101', '地火明夷', 'Míng Yí', 'Darkening of the Light', '利艰贞。', '明入地中，明夷；君子以莅众用晦而明。'],
  [37, '011', '101', '风火家人', 'Jiā Rén', 'The Family', '家人。利女贞。', '风自火出，家人；君子以言有物而行有恒。'],
  [38, '101', '110', '火泽睽', 'Kuí', 'Opposition', '小事吉。', '上火下泽，睽；君子以同而异。'],
  [39, '010', '001', '水山蹇', 'Jiǎn', 'Obstruction', '利西南，不利东北；利见大人，贞吉。', '山上有水，蹇；君子以反身修德。'],
  [40, '100', '010', '雷水解', 'Xiè', 'Deliverance', '利西南，无所往，其来复吉。有攸往，夙吉。', '雷雨作，解；君子以赦过宥罪。'],
  [41, '001', '110', '山泽损', 'Sǔn', 'Decrease', '有孚，元吉，无咎，可贞，利有攸往。', '山下有泽，损；君子以惩忿窒欲。'],
  [42, '011', '100', '风雷益', 'Yì', 'Increase', '利有攸往，利涉大川。', '风雷，益；君子以见善则迁。'],
  [43, '110', '111', '泽天夬', 'Guài', 'Breakthrough', '扬于王庭，孚号有厉。不利即戎，利有攸往。', '泽上于天，夬；君子以施禄及下。'],
  [44, '111', '011', '天风姤', 'Gòu', 'Coming to Meet', '女壮，勿用取女。', '天下有风，姤；后以施命诰四方。'],
  [45, '110', '000', '泽地萃', 'Cuì', 'Gathering Together', '亨。王假有庙，利见大人，亨，利贞。', '泽上于地，萃；君子以除戎器。'],
  [46, '000', '011', '地风升', 'Shēng', 'Pushing Upward', '元亨，用见大人，勿恤，南征吉。', '地中生木，升；君子以顺德。'],
  [47, '110', '010', '泽水困', 'Kùn', 'Oppression', '亨，贞，大人吉，无咎。有言不信。', '泽无水，困；君子以致命遂志。'],
  [48, '010', '011', '水风井', 'Jǐng', 'The Well', '改邑不改井，无丧无得。往来井井。', '木上有水，井；君子以劳民劝相。'],
  [49, '110', '101', '泽火革', 'Gé', 'Revolution', '巳日乃孚，元亨利贞，悔亡。', '泽中有火，革；君子以治历明时。'],
  [50, '101', '011', '火风鼎', 'Dǐng', 'The Cauldron', '元吉，亨。', '木上有火，鼎；君子以正位凝命。'],
  [51, '100', '100', '震为雷', 'Zhèn', 'The Arousing (Thunder)', '亨。震来虩虩，笑言哑哑。震惊百里，不丧匕鬯。', '洊雷，震；君子以恐惧修省。'],
  [52, '001', '001', '艮为山', 'Gèn', 'Keeping Still (Mountain)', '艮其背，不获其身；行其庭，不见其人，无咎。', '兼山，艮；君子以思不出其位。'],
  [53, '011', '001', '风山渐', 'Jiàn', 'Gradual Progress', '女归吉，利贞。', '山上有木，渐；君子以居贤德善俗。'],
  [54, '100', '110', '雷泽归妹', 'Guī Mèi', 'The Marrying Maiden', '征凶，无攸利。', '泽上有雷，归妹；君子以永终知敝。'],
  [55, '100', '101', '雷火丰', 'Fēng', 'Abundance', '亨。王假之，勿忧，宜日中。', '雷电皆至，丰；君子以折狱致刑。'],
  [56, '101', '001', '火山旅', 'Lǚ', 'The Wanderer', '小亨，旅贞吉。', '山上有火，旅；君子以明慎用刑。'],
  [57, '011', '011', '巽为风', 'Xùn', 'The Gentle (Wind)', '小亨，利有攸往，利见大人。', '随风，巽；君子以申命行事。'],
  [58, '110', '110', '兑为泽', 'Duì', 'The Joyous (Lake)', '亨，利贞。', '丽泽，兑；君子以朋友讲习。'],
  [59, '011', '010', '风水涣', 'Huàn', 'Dispersion', '亨。王假有庙，利涉大川，利贞。', '风行水上，涣；先王以享于帝立庙。'],
  [60, '010', '110', '水泽节', 'Jié', 'Limitation', '亨。苦节不可贞。', '泽上有水，节；君子以制数度。'],
  [61, '011', '110', '风泽中孚', 'Zhōng Fú', 'Inner Truth', '豚鱼吉，利涉大川，利贞。', '泽上有风，中孚；君子以议狱缓死。'],
  [62, '100', '001', '雷山小过', 'Xiǎo Guò', 'Small Preponderance', '亨，利贞。可小事，不可大事。', '山上有雷，小过；君子以行过乎恭。'],
  [63, '010', '101', '水火既济', 'Jì Jì', 'After Completion', '亨小，利贞，初吉终乱。', '水在火上，既济；君子以思患而豫防之。'],
  [64, '101', '010', '火水未济', 'Wèi Jì', 'Before Completion', '亨。小狐汔济，濡其尾，无攸利。', '火在水上，未济；君子以慎辨物居方。']
];

export const KING_WEN_64: HexagramEntry[] = KING_WEN_ROWS.map(
  ([number, upper, lower, nameZh, pinyin, nameEn, judgmentZh, imageZh]) => ({
    number,
    upper,
    lower,
    nameZh,
    pinyin,
    nameEn,
    judgmentZh,
    imageZh
  })
);

/** Unicode 易经六十四卦符号，U+4DC0 起按文王卦序连续排列 */
export function hexagramSymbol(number: number): string {
  return String.fromCodePoint(0x4dc0 + number - 1);
}

/** 6 位爻线 → 下卦 / 上卦 → 64 卦查表条目 */
export function lookupEntryByBinary(binary: string): HexagramEntry {
  const lower = TRIGRAMS_BY_BITS[binary.slice(0, 3)];
  const upper = TRIGRAMS_BY_BITS[binary.slice(3, 6)];
  if (!lower || !upper) {
    throw new Error(`非法爻线：${binary}`);
  }
  const entry = KING_WEN_64.find((h) => h.upper === upper.bits && h.lower === lower.bits);
  if (!entry) {
    throw new Error(`查表未命中：下${lower.nameZh}上${upper.nameZh}（${binary}）`);
  }
  return entry;
}

/** 查表条目 → 完整卦象数据（所有字段均由本表生成） */
export interface HexagramSeed {
  number: number;
  binary: string;
  symbol: string;
  nameZh: string;
  pinyin: string;
  nameEn: string;
  upperTrigram: string;
  lowerTrigram: string;
  upperTrigramEn: string;
  lowerTrigramEn: string;
  judgmentZh: string;
  judgmentEn: string;
  imageZh: string;
  imageEn: string;
  careerAdviceZh: string;
  careerAdviceEn: string;
  relationshipAdviceZh: string;
  relationshipAdviceEn: string;
}

export function buildHexagramSeed(entry: HexagramEntry): HexagramSeed {
  const upper = TRIGRAMS_BY_BITS[entry.upper];
  const lower = TRIGRAMS_BY_BITS[entry.lower];
  const structureEn = `${upper.natureEn} above, ${lower.natureEn} below`;

  return {
    number: entry.number,
    binary: entry.lower + entry.upper,
    symbol: hexagramSymbol(entry.number),
    nameZh: entry.nameZh,
    pinyin: entry.pinyin,
    nameEn: entry.nameEn,
    upperTrigram: upper.nameZh,
    lowerTrigram: lower.nameZh,
    upperTrigramEn: upper.nameEn,
    lowerTrigramEn: lower.nameEn,
    judgmentZh: entry.judgmentZh,
    judgmentEn: `King Wen No. ${entry.number} · ${entry.nameEn} (${structureEn}). Consult the canonical Chinese judgment above.`,
    imageZh: entry.imageZh,
    imageEn: `${upper.symbol} over ${lower.symbol} — ${structureEn}.`,
    careerAdviceZh: `依《${entry.nameZh}》卦辞：${entry.judgmentZh}`,
    careerAdviceEn: `Act in line with ${entry.nameEn} (${structureEn}).`,
    relationshipAdviceZh: `依《${entry.nameZh}》大象传：${entry.imageZh}`,
    relationshipAdviceEn: `Reflect on ${entry.nameEn}: ${upper.natureEn} over ${lower.natureEn}.`
  };
}

/** 表里出现过的全部标准卦名（用于校验 AI 输出 / 外部传入） */
export const STANDARD_HEXAGRAM_NAMES: ReadonlySet<string> = new Set(
  KING_WEN_64.map((h) => h.nameZh)
);
