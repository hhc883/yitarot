export type ArcanaType = 'major' | 'minor';
export type TarotSuit = 'wands' | 'cups' | 'swords' | 'pentacles';
export type TarotElement = 'fire' | 'water' | 'air' | 'earth';

export interface TarotCardData {
  id: string;
  slug: string;
  number: number;
  romanNumeral?: string;
  nameZh: string;
  nameEn: string;
  arcana: ArcanaType;
  suit?: TarotSuit;
  element?: TarotElement;
  keywords: string[];
  uprightKeywords: string[];
  reversedKeywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  loveMeaning: string;
  careerMeaning: string;
  advice: string;
  symbolism: string;
  visualTheme: {
    primaryColor: string;
    accentColor: string;
    motif: string;
  };
}

export interface DrawnCard {
  card: TarotCardData;
  isReversed: boolean;
  positionName: string;
  positionDesc: string;
}

export const TAROT_DECK: TarotCardData[] = [
  // ================= 22 大阿卡纳 (Major Arcana) =================
  {
    id: 'major_0',
    slug: 'the-fool',
    number: 0,
    romanNumeral: '0',
    nameZh: '愚人',
    nameEn: 'The Fool',
    arcana: 'major',
    element: 'air',
    keywords: ['新的开始', '自发性', '自由', '纯真', '踏上旅程'],
    uprightKeywords: ['纯真起航', '勇于冒险', '无限潜能', '相信直觉', '不受拘束'],
    reversedKeywords: ['鲁莽行事', '逃避现实', '盲目乐观', '缺乏准备', '畏惧未知'],
    uprightMeaning: '愚人代表着全新的开始与无畏的精神。站在悬崖边缘并不意味着危险，而是象征着跳出固有框架、拥抱未知潜能的勇气。信任内心的直觉，生命正为你展开新的篇章。',
    reversedMeaning: '逆位的愚人提示你是否过于草率或逃避责任。在跃入未知之前，请检查自己是否已经做好了最基础的准备，避免盲目乐观带来的挫折。',
    loveMeaning: '正位预示一段轻松、纯粹而充满新鲜感的恋情；逆位则提醒防范承诺恐惧或冲动行事。',
    careerMeaning: '正位适合开创新项目或尝试跨界转型；逆位警惕缺乏计划导致的资源浪费。',
    advice: '放下过往的包袱，怀着纯真的好奇心迈出第一步。世界正在等待你的探索。',
    symbolism: '白玫瑰象征纯洁愿望，小白狗代表本能与守护，脚下的悬崖象征未知的广阔世界。',
    visualTheme: { primaryColor: '#E6B800', accentColor: '#FFF8E1', motif: 'cliff-sun' }
  },
  {
    id: 'major_1',
    slug: 'the-magician',
    number: 1,
    romanNumeral: 'I',
    nameZh: '魔术师',
    nameEn: 'The Magician',
    arcana: 'major',
    element: 'air',
    keywords: ['显化', '创造力', '意志力', '资源整合', '专注'],
    uprightKeywords: ['主动创造', '掌握技能', '资源齐备', '行动力强', '心想事成'],
    reversedKeywords: ['能力误用', '欺骗推诿', '意志动摇', '准备不足', '纸上谈兵'],
    uprightMeaning: '魔术师掌握了风、水、火、土四要素，象征着将精神愿景显化为物质现实的终极力量。你拥有达成目标所需的一切技能与资源，现在就是将想法付诸行动的最佳时机。',
    reversedMeaning: '逆位的魔术师提示可能存在才华无法施展的窒息感，或是被表象迷惑。警惕过度自信带来的误导，脚踏实地运用你的真实才能。',
    loveMeaning: '正位象征主动而有魅力的表达，能引导感情升温；逆位提醒警惕甜言蜜语背后的不诚实。',
    careerMeaning: '正位意味着项目推动顺利，谈判或展示极具说服力；逆位需要警惕沟通断层。',
    advice: '汇聚你的专注力，调动周围所有的资源，你就是现实的创造者。',
    symbolism: '桌面摆放权杖、圣杯、宝剑与星币；头顶的无限符号象征无限意识与创造力。',
    visualTheme: { primaryColor: '#D9534F', accentColor: '#FDF2E9', motif: 'infinity-wand' }
  },
  {
    id: 'major_2',
    slug: 'the-high-priestess',
    number: 2,
    romanNumeral: 'II',
    nameZh: '女祭司',
    nameEn: 'The High Priestess',
    arcana: 'major',
    element: 'water',
    keywords: ['直觉', '潜意识', '神秘学', '内在平静', '沉静洞察'],
    uprightKeywords: ['直觉敏锐', '倾听内心', '潜意识启示', '守口如瓶', '内在智慧'],
    reversedKeywords: ['忽视直觉', '情绪压抑', '表里不一', '冷漠孤僻', '秘密泄露'],
    uprightMeaning: '女祭司静坐于黑白双柱之间，她是潜意识深海的守护者。此时不宜强行向外寻求答案，答案早已深藏在你的直觉与梦境之中。保持沉静，观察而不妄动。',
    reversedMeaning: '逆位提醒你可能被喧嚣的外部噪音扰乱，切断了与自身潜意识的链接。留出独处时间，不要压抑自己真实的直觉感受。',
    loveMeaning: '正位象征心有灵犀的心灵契合，含蓄而深情；逆位提示可能存在隐藏的心事或沟通壁垒。',
    careerMeaning: '正位适合从事研究、分析、战略规划或艺术创作；逆位提醒避免偏听偏信。',
    advice: '安静下来，听一听内心深处的声音，直觉会为你指出最真实的路径。',
    symbolism: '黑白双柱Boaz与Jachin代表二元平衡，石榴帷幔象征丰盛的潜意识世界。',
    visualTheme: { primaryColor: '#3498DB', accentColor: '#EBF5FB', motif: 'pillars-moon' }
  },
  {
    id: 'major_3',
    slug: 'the-empress',
    number: 3,
    romanNumeral: 'III',
    nameZh: '皇后',
    nameEn: 'The Empress',
    arcana: 'major',
    element: 'earth',
    keywords: ['丰盛', '滋养', '孕育', '母性', '自然之美'],
    uprightKeywords: ['富足充裕', '创造丰收', '温柔关怀', '感官愉悦', '接纳包容'],
    reversedKeywords: ['过度依赖', '创造枯竭', '过度保护', '自我忽视', '物质执念'],
    uprightMeaning: '皇后是自然与生命力的大地母亲，代表着无条件的滋养、创造力的丰收与感官的享受。无论你目前在孕育一个项目、一段感情还是一份愿景，它都将在温暖的呵护下茁壮成长。',
    reversedMeaning: '逆位提示你可能陷入了过度付出却忽视自我的困境，或者因急于求成而破坏了事情自然的生长节律。请先给予自己足够的爱与休息。',
    loveMeaning: '正位象征温馨甜蜜、极具安全感与生育力的深厚情感；逆位警惕溺爱与控制欲。',
    careerMeaning: '正位代表业务成果丰硕，团队合作氛围融洽；逆位需注意理清账目与资源损耗。',
    advice: '拥抱生活的美好与自然的节律，像滋养花园一样滋养你的梦想与灵魂。',
    symbolism: '金黄麦浪象征丰收，十二颗星星的王冠代表宇宙秩序，维纳斯护盾象征爱与美。',
    visualTheme: { primaryColor: '#27AE60', accentColor: '#EAFAF1', motif: 'wheat-crown' }
  },
  {
    id: 'major_4',
    slug: 'the-emperor',
    number: 4,
    romanNumeral: 'IV',
    nameZh: '皇帝',
    nameEn: 'The Emperor',
    arcana: 'major',
    element: 'fire',
    keywords: ['权威', '秩序', '结构', '稳固', '领导力'],
    uprightKeywords: ['坚毅掌控', '建立规则', '理性决策', '稳如泰山', '担当责任'],
    reversedKeywords: ['专制霸道', '死板僵化', '缺乏自制', '权威受挫', '推卸责任'],
    uprightMeaning: '皇帝端坐于刻满公羊头的石质王座上，代表着世俗世界的秩序、纪律与稳固的基石。此时需要你展现清晰的决断力，制定长远规则并坚定执行。',
    reversedMeaning: '逆位提醒你是否过于强势、固执以至于听不进他人意见；或者在面对混乱局面时失去了原则与掌控力。寻求力量与温度的平衡。',
    loveMeaning: '正位提供坚实的避风港与承诺；逆位警惕大男子/大女人主义或缺乏柔情。',
    careerMeaning: '正位象征晋升、领导职务或企业制度化推进；逆位警惕官僚主义阻碍创新。',
    advice: '建立清晰的边界与行动规范，用你的坚韧与理智为自己与他人筑起坚固屏障。',
    symbolism: '公羊头代表白羊座的果断与开拓，安卡十字权杖象征生命与治理之权。',
    visualTheme: { primaryColor: '#C0392B', accentColor: '#FDEDEC', motif: 'throne-ram' }
  },
  {
    id: 'major_5',
    slug: 'the-hierophant',
    number: 5,
    romanNumeral: 'V',
    nameZh: '教皇',
    nameEn: 'The Hierophant',
    arcana: 'major',
    element: 'earth',
    keywords: ['传统', '精神指引', '信仰', '导师', '组织认同'],
    uprightKeywords: ['良师益友', '道德指引', '求知若渴', '获得认同', '遵守契约'],
    reversedKeywords: ['教条束缚', '盲从权威', '价值观冲突', '打破陈规', '反叛叛逆'],
    uprightMeaning: '教皇是传承智慧与灵性法则的宗师。这张牌预示着你将在正统途径中获得支持，或遇到指点迷津的导师。遵循既有的伦理与智慧，融入集体的共识。',
    reversedMeaning: '逆位提示某种传统体制或教条可能已经阻碍了你的个人成长。不必盲从外界权威，寻找真正契合你内心价值的独立真理。',
    loveMeaning: '正位象征传统规范、受到家庭祝福的稳固良缘；逆位提示面对传统观念阻力。',
    careerMeaning: '正位利于求学、考证、体制内发展或行业培训；逆位鼓励跳出教条、寻找新方法。',
    advice: '虚心向有经验的前辈求教，并在古老智慧中找到指引当下困惑的钥匙。',
    symbolism: '三重冠代表身心灵的三重境界，交叉的金色双钥匙象征通往灵性与世俗智慧之门。',
    visualTheme: { primaryColor: '#8E44AD', accentColor: '#F4ECF7', motif: 'keys-cross' }
  },
  {
    id: 'major_6',
    slug: 'the-lovers',
    number: 6,
    romanNumeral: 'VI',
    nameZh: '恋人',
    nameEn: 'The Lovers',
    arcana: 'major',
    element: 'air',
    keywords: ['爱与联结', '和谐', '关键抉择', '价值观共鸣', '真诚'],
    uprightKeywords: ['深情契合', '双向奔赴', '遵从内心', '价值观统一', '美好合作'],
    reversedKeywords: ['感情摩擦', '抉择摇摆', '表里不一', '诱惑妥协', '沟通缺失'],
    uprightMeaning: '恋人牌在大天使拉斐尔的祝福下展开，它不仅代表浪漫爱情的甜蜜盛开，更代表人生中一次忠于灵魂的重大抉择。选择你所深爱的，并承担起这份真诚联结的承诺。',
    reversedMeaning: '逆位提示在关系中出现了不平衡，或者你在两个选项之间犹豫不决、被暂时的诱惑拉扯。回归内心的核心价值观，重新建立共鸣。',
    loveMeaning: '正位是深层灵魂伴侣的象征，互相信任；逆位提醒坦诚沟通以化解潜在误会。',
    careerMeaning: '正位代表极佳的合伙人运势与默契团队；逆位警惕合同争议或利益分配分歧。',
    advice: '倾听心底最真实的爱与渴望，做那个无论何时回首都不会后悔的选择。',
    symbolism: '大天使拉斐尔象征疗愈与恩典，生命之树与善恶知识树代表选择的严肃与崇高。',
    visualTheme: { primaryColor: '#E91E63', accentColor: '#FCE4EC', motif: 'angel-lovers' }
  },
  {
    id: 'major_7',
    slug: 'the-chariot',
    number: 7,
    romanNumeral: 'VII',
    nameZh: '战车',
    nameEn: 'The Chariot',
    arcana: 'major',
    element: 'water',
    keywords: ['胜利', '意志控制', '克服阻碍', '目标清晰', '勇往直前'],
    uprightKeywords: ['战胜困难', '掌控方向', '坚定意志', '凯旋而归', '突破困境'],
    reversedKeywords: ['失控偏航', '蛮干受挫', '内心冲突', '侵略好胜', '半途而废'],
    uprightMeaning: '年轻的战士驾驭黑白两匹斯芬克斯，他不用缰绳而是依靠强大的意志力保持平衡与前行。这预示着只要你目标坚定、协调内心的矛盾力量，胜利必将属于你。',
    reversedMeaning: '逆位提示前进的方向可能已经偏离轨道，或被情绪、好胜心冲昏了头脑。暂时收住脚步，重新校准两股相对的力量。',
    loveMeaning: '正位表明双方克服现实阻碍走到一起；逆位警惕争强好胜导致的关系紧张。',
    careerMeaning: '正位预示项目势如破竹、竞标或考核大获全胜；逆位提醒避免操之过急。',
    advice: '保持坚定的信念，统御你内心的热情与理智，驾驭风暴驶向胜利的彼岸。',
    symbolism: '黑白斯芬克斯象征对立的情绪与欲望，头顶的八芒星冠冕象征超脱尘俗的精神力量。',
    visualTheme: { primaryColor: '#2C3E50', accentColor: '#EAECEE', motif: 'chariot-sphinx' }
  },
  {
    id: 'major_8',
    slug: 'strength',
    number: 8,
    romanNumeral: 'VIII',
    nameZh: '力量',
    nameEn: 'Strength',
    arcana: 'major',
    element: 'fire',
    keywords: ['内在力量', '柔克刚', '勇气', '同理心', '耐心驯服'],
    uprightKeywords: ['以柔克刚', '包容自控', '无所畏惧', '持久韧性', '情绪驯服'],
    reversedKeywords: ['自我怀疑', '暴躁失控', '精疲力竭', '屈服恐惧', '过度妥协'],
    uprightMeaning: '一位头戴无限符号的优雅女子用温柔的手抚摸着雄狮。真正的力量从来不是暴力的对抗，而是内心的从容、包容与坚韧。用爱与理解去化解危机，你将无坚不摧。',
    reversedMeaning: '逆位提示你可能正在被内心的恐惧或狂躁情绪所裹挟，感到无力与疲惫。别苛责自己，重拾对自我的温柔信任。',
    loveMeaning: '正位象征用耐心与关怀打动对方，建立深沉信任；逆位警惕情绪内耗与冷战。',
    careerMeaning: '正位表示擅长处理复杂人际或棘手难题；逆位需注意调节压力，防范职业倦怠。',
    advice: '以温柔对待自己与周围的一切，平静的心态能够平息一切外界的风浪。',
    symbolism: '雄狮代表本能欲望与狂野力量，女子的白袍与花环代表慈悲与纯善的化解力。',
    visualTheme: { primaryColor: '#E67E22', accentColor: '#FBEEE6', motif: 'woman-lion' }
  },
  {
    id: 'major_9',
    slug: 'the-hermit',
    number: 9,
    romanNumeral: 'IX',
    nameZh: '隐士',
    nameEn: 'The Hermit',
    arcana: 'major',
    element: 'earth',
    keywords: ['内省', '沉淀求索', '孤独明悟', '真理寻觅', '灵性觉察'],
    uprightKeywords: ['深思熟虑', '向内探索', '智慧指路', '宁静自处', '追寻本质'],
    reversedKeywords: ['封闭孤立', '逃避现实', '迷失方向', '拒绝沟通', '偏执固步'],
    uprightMeaning: '老者身披灰袍，立于雪山之巅，手提一盏照亮脚下一小步的六芒星明灯。此时适合暂时远离尘世的浮躁，回归安静的心灵深处，在孤独中洞见生命的本质。',
    reversedMeaning: '逆位提示可能陷入了极端的社交孤立或愤世嫉俗，把自己关在心房中拒绝外界的温暖。内省不是逃避，适时重新走入人群。',
    loveMeaning: '正位倾向于保持独立空间或审视情感本质；逆位警惕因过度冷漠推开伴侣。',
    careerMeaning: '正位适合潜心钻研技术、撰写论文或闭门战略思考；逆位提醒注重团队协同。',
    advice: '允许自己慢下来，在安静的独处中点亮你自己的心灯。',
    symbolism: '六芒星灯笼象征所罗门封印与智慧之光，冰雪高峰象征崇高孤独的意识境界。',
    visualTheme: { primaryColor: '#7F8C8D', accentColor: '#F2F4F4', motif: 'lantern-mountain' }
  },
  {
    id: 'major_10',
    slug: 'wheel-of-fortune',
    number: 10,
    romanNumeral: 'X',
    nameZh: '命运之轮',
    nameEn: 'Wheel of Fortune',
    arcana: 'major',
    element: 'fire',
    keywords: ['周期流转', '命运契机', '宿命转折', '顺势而为', '变易规律'],
    uprightKeywords: ['转机降临', '好运眷顾', '生命节律', '把握机遇', '顺风顺水'],
    reversedKeywords: ['运势暂滞', '抗拒变化', '外部干扰', '循环困境', '低潮潜伏'],
    uprightMeaning: '巨大的命运之轮在苍穹中永恒旋转。世事无常，盛衰互转。这张牌象征转机已然到来，低谷即将结束，关键的因缘正悄然汇聚，请张开双臂迎接生命的新篇章。',
    reversedMeaning: '逆位提示事情发展超出了你的直接控制，可能遇到暂时的波折或周期的低谷。不要与大趋势强行对抗，蓄势待发是最好的策略。',
    loveMeaning: '正位代表宿命般的相遇或感情转机；逆位提醒顺应相处节律，不强求答案。',
    careerMeaning: '正位预示行业风口或关键职业跳板；逆位警惕投机心理，稳健防守为上。',
    advice: '顺应宇宙的韵律，在顺境中保持谦卑，在逆境中怀抱希望。轮盘从未停止转动。',
    symbolism: '轮盘上的希伯来字母与炼金符号象征造化之谜，四角的四灵象征宇宙四大元素。',
    visualTheme: { primaryColor: '#F39C12', accentColor: '#FEF9E7', motif: 'celestial-wheel' }
  },
  {
    id: 'major_11',
    slug: 'justice',
    number: 11,
    romanNumeral: 'XI',
    nameZh: '正义',
    nameEn: 'Justice',
    arcana: 'major',
    element: 'air',
    keywords: ['公平正义', '真理', '因果律', '理智裁决', '清晰洞察'],
    uprightKeywords: ['公正严明', '因果报应', '权衡利弊', '客观清晰', '合法合规'],
    reversedKeywords: ['不公待遇', '偏见蒙蔽', '自欺欺人', '逃避后果', '法务纠纷'],
    uprightMeaning: '女神手持天平与利剑，双眼澄澈平视前方。种瓜得瓜，种豆得豆。面对眼前的境遇，需要保持绝对的客观与诚实，用理性的剑斩断借口，用天平权衡利弊。',
    reversedMeaning: '逆位提示可能存在认知偏差、自欺欺人，或是遭遇了不公正的对待。检视自己是否在某些事情上失衡，勇敢承担属于自己的责任。',
    loveMeaning: '正位象征平等互敬、坦诚相待的成熟关系；逆位警惕斤斤计较与情感审判。',
    careerMeaning: '正位利于合同签订、法律维权与考核晋升；逆位需仔细核查条款合规细节。',
    advice: '做你认为道德与良知上正确的事，宇宙的因果天平绝不会偏袒虚伪。',
    symbolism: '利剑直指天空代表严密理智与明辨真伪，天平象征对等因果与心理平衡。',
    visualTheme: { primaryColor: '#16A085', accentColor: '#E8F8F5', motif: 'sword-scales' }
  },
  {
    id: 'major_12',
    slug: 'the-hanged-man',
    number: 12,
    romanNumeral: 'XII',
    nameZh: '倒吊人',
    nameEn: 'The Hanged Man',
    arcana: 'major',
    element: 'water',
    keywords: ['换位思考', '甘愿奉献', '暂停顿悟', '放手臣服', '全新视角'],
    uprightKeywords: ['顺应臣服', '顿悟转念', '换个角度', '灵性觉醒', '自愿放手'],
    reversedKeywords: ['徒劳挣扎', '无谓牺牲', '拖延逃避', '固执己见', '抱怨不满'],
    uprightMeaning: '男子被倒吊在生命之树上，面容却安详宁静，头顶散发着智慧的金光。当生活陷入停滞时，并不意味着失败，而是上苍要求你换一个完全颠倒的角度看待世界。',
    reversedMeaning: '逆位提示你可能陷入了自怜自艾的无意义受害者心态，或是为了取悦他人做出了不必要的牺牲。停止无用的内耗挣扎。',
    loveMeaning: '正位表示学会换位思考并放下执念；逆位提醒停止单方面的盲目妥协。',
    careerMeaning: '正位适合放缓脚步沉淀充电；逆位警惕拖延症耽误关键进度。',
    advice: '放下对结果的偏执控制，顺应这片刻的停顿，新的顿悟将为你解开锁链。',
    symbolism: '金黄光环象征顿悟启迪，倒吊姿态象征打破世俗常规的超脱视角。',
    visualTheme: { primaryColor: '#2980B9', accentColor: '#EAF2F8', motif: 'halo-tree' }
  },
  {
    id: 'major_13',
    slug: 'death',
    number: 13,
    romanNumeral: 'XIII',
    nameZh: '死神',
    nameEn: 'Death',
    arcana: 'major',
    element: 'water',
    keywords: ['蜕变重生', '结束与开端', '告别旧我', '深刻转化', '生命迭代'],
    uprightKeywords: ['旧事终结', '涅槃蜕变', '放下包袱', '迎接新生', '不可逆转'],
    reversedKeywords: ['抗拒改变', '死抱过去', '痛苦拖延', '停滞不前', '恐惧未知'],
    uprightMeaning: '死神骑着白马缓缓走来，朝阳在远方双塔之间升起。这绝非肉体的死亡，而是最彻底的心灵蜕变。旧的模式、枯萎的关系或陈旧的想法必须逝去，新生的嫩芽才能破土而出。',
    reversedMeaning: '逆位提示你依然在死死抓住早已腐朽的事物不放，害怕改变带来的阵痛。然而拖延只会延长痛苦，唯有勇敢告别才能迎来新生。',
    loveMeaning: '正位代表关系模式的彻底蜕变或告别错的人；逆位提示沉溺旧情难以自拔。',
    careerMeaning: '正位预示彻底的行业转型或岗位重塑；逆位提醒别留在没有前景的死胡同。',
    advice: '优雅地向过去告别，每一个不可挽回的结束，都是为更加灿烂的新生腾出空间。',
    symbolism: '黑色铠甲象征不可阻挡的法则，旗帜上的五瓣白玫瑰象征生命与净化，远方朝阳象征重生。',
    visualTheme: { primaryColor: '#17202A', accentColor: '#EAEDED', motif: 'white-horse-rose' }
  },
  {
    id: 'major_14',
    slug: 'temperance',
    number: 14,
    romanNumeral: 'XIV',
    nameZh: '节制',
    nameEn: 'Temperance',
    arcana: 'major',
    element: 'fire',
    keywords: ['平衡调和', '中庸之道', '炼金融合', '内心安宁', '循序渐进'],
    uprightKeywords: ['身心平衡', '化解冲突', '融合创新', '耐心沉淀', '适度自律'],
    reversedKeywords: ['失衡极端', '过度放纵', '急功近利', '沟通不畅', '内耗争执'],
    uprightMeaning: '一位大天使一足踏入清泉，一足立于坚石，两只金杯之间的甘露恒久流淌而不溢出。这是心灵炼金术的最高境界——在极端的矛盾中找到精妙的平衡，让一切从容融合。',
    reversedMeaning: '逆位提示你的生活节奏或情绪状态已经失衡，可能存在熬夜透支、冲动消费或极端偏激的情绪波动。立即按下刹车键，找回内心的平静。',
    loveMeaning: '正位象征细水长流、相濡以沫的温润情感；逆位提醒防范生活习惯磨合不畅。',
    careerMeaning: '正位代表优秀的跨部门协作与方案调和能力；逆位警惕资源配置失调。',
    advice: '不偏不倚，不急不躁，用温和的耐心去调和生活中的各种味道。',
    symbolism: '双足一水一地象征意识与潜意识的连接，倒水的大天使象征更高层面的能量调谐。',
    visualTheme: { primaryColor: '#1ABC9C', accentColor: '#E8F8F5', motif: 'angel-cups' }
  },
  {
    id: 'major_15',
    slug: 'the-devil',
    number: 15,
    romanNumeral: 'XV',
    nameZh: '恶魔',
    nameEn: 'The Devil',
    arcana: 'major',
    element: 'earth',
    keywords: ['物质诱惑', '执念束缚', '影子自我', '成瘾欲望', '看破枷锁'],
    uprightKeywords: ['看清束缚', '欲望觉察', '打破执念', '释放阴影', '自我救赎'],
    reversedKeywords: ['挣脱枷锁', '找回自由', '克服成瘾', '破除心魔', '觉醒重生'],
    uprightMeaning: '半人半兽的恶魔高踞基座，男女颈套锁链，但锁链其实十分宽松，随时可以自行摘下。这张牌揭示了你生活中某些看似无法摆脱的束缚（欲望、毒性关系、金钱焦虑），本质上都源于内心深处的恐惧与依赖。',
    reversedMeaning: '逆位是极佳的觉醒信号！它表明你终于认清了虚妄的枷锁，正下定决心挣脱不良习惯或有毒环境，夺回人生的自主权。',
    loveMeaning: '正位提醒警惕强烈的占有欲与不健康的依赖；逆位预示从内耗的情感深渊中清醒脱身。',
    careerMeaning: '正位警惕被眼前短期利益绑架或陷入职场压榨；逆位象征勇敢离职或重构健康生态。',
    advice: '凝视你内心的深渊与欲望，认清那个锁住你的链条其实从未真正上锁。',
    symbolism: '宽松的锁链代表自愿的被奴役，倒五角星象征灵性屈服于低阶物质本能。',
    visualTheme: { primaryColor: '#5B2C6F', accentColor: '#F4ECF7', motif: 'chains-devil' }
  },
  {
    id: 'major_16',
    slug: 'the-tower',
    number: 16,
    romanNumeral: 'XVI',
    nameZh: '高塔',
    nameEn: 'The Tower',
    arcana: 'major',
    element: 'fire',
    keywords: ['骤然剧变', '幻想破灭', '重塑根基', '破而后立', '真理雷霆'],
    uprightKeywords: ['突围震荡', '击碎虚妄', '破茧重构', '彻底清醒', '命运警钟'],
    reversedKeywords: ['苟延残喘', '害怕改变', '勉强维持', '灾后重建', '暗流涌动'],
    uprightMeaning: '雷霆万钧撕裂了建在悬崖峭壁上的金冠高塔，烈火熊熊燃烧。虽然看似突如其来的剧烈震荡，但坍塌的只是建立在谎言、虚荣与脆弱根基上的虚妄之物。废墟之后，是真正牢固的生命基石。',
    reversedMeaning: '逆位提示你虽然感知到了危机的逼近，却依然在粉饰太平、试图修补那座注定倾覆的高塔。逃避不能免除震荡，不如坦然迎接必然的清盘。',
    loveMeaning: '正位象征隐藏矛盾的骤然爆发促成彻底坦白；逆位提示关系名存实亡仍在苦苦勉强。',
    careerMeaning: '正位预示行业巨变、项目推倒重来或突发变动；逆位提醒提前储备救急方案。',
    advice: '不要为碎裂的假象哀悼，雷电带来的虽然是震荡，洗礼过后的天空将格外晴朗。',
    symbolism: '雷电象征神圣真理的直击，掉落的金冠象征世俗傲慢的破灭，烈火象征彻底的净化。',
    visualTheme: { primaryColor: '#922B21', accentColor: '#FADBD8', motif: 'lightning-tower' }
  },
  {
    id: 'major_17',
    slug: 'the-star',
    number: 17,
    romanNumeral: 'XVII',
    nameZh: '星星',
    nameEn: 'The Star',
    arcana: 'major',
    element: 'air',
    keywords: ['希望', '灵感', '内在疗愈', '星光指引', '宁静信心'],
    uprightKeywords: ['希望升腾', '深度疗愈', '灵感泉涌', '天赐福佑', '纯真希望'],
    reversedKeywords: ['信心缺失', '迷惘沮丧', '期待落空', '怀疑希望', '灵感枯竭'],
    uprightMeaning: '在高塔的废墟之后，是璀璨辽阔的夜空。一位美丽的裸体少女将生命之水倾注于大地与池塘，天穹中八芒星灿烂夺目。这是风暴过后最温柔的慰藉与希望，你的未来充满无限生机。',
    reversedMeaning: '逆位提示你可能暂时被阴云遮蔽了双眼，感到前路渺茫或怀疑自我价值。繁星始终都在那里，请允许自己慢慢被疗愈，不要过早放弃希望。',
    loveMeaning: '正位象征纯洁美好、充满精神共鸣的爱情滋养；逆位提示重拾对爱情的信心。',
    careerMeaning: '正位预示极具创造力的新灵感，前途光明且受人赞赏；逆位需克服自卑与迷惘。',
    advice: '放下防备，敞开心扉接收来自宇宙的温柔星光，最美好的事情正在孕育。',
    symbolism: '八角大星象征天狼星与希望核心，流淌的双瓮象征丰盈的情感与现实滋养。',
    visualTheme: { primaryColor: '#1F618D', accentColor: '#E8F6F3', motif: 'star-maiden' }
  },
  {
    id: 'major_18',
    slug: 'the-moon',
    number: 18,
    romanNumeral: 'XVIII',
    nameZh: '月亮',
    nameEn: 'The Moon',
    arcana: 'major',
    element: 'water',
    keywords: ['幻觉迷雾', '潜意识恐惧', '暗夜试炼', '探索隐秘', '直觉洞悉'],
    uprightKeywords: ['穿越迷雾', '看清真相', '直面恐惧', '潜意识起伏', '警惕欺骗'],
    reversedKeywords: ['迷雾渐散', '走出低谷', '真相大白', '抚平焦虑', '释怀恐惧'],
    uprightMeaning: '在冷冽的月光下，小径曲折通往远方双塔，野狗与狼昂首狂吠，小龙虾从潜意识水潭中浮出。这代表着一段充满不确定性与情绪起伏的时期。事物并不像表面看起来那样简单，跟随直觉慎步前行。',
    reversedMeaning: '逆位预示着笼罩已久的迷雾正在消散，那些曾经困扰你的焦虑与未知正在显露出真相，你正在走出情绪的阴霾期。',
    loveMeaning: '正位提醒警惕多疑、隐瞒或不切实际的幻想；逆位象征误会消除，重归真实。',
    careerMeaning: '正位提示环境存在信息不透明，避免盲目签约；逆位代表隐藏的问题终于水落石出。',
    advice: '当视线受阻时，不要被自己的心魔吓倒，脚踏实地走好当下的每一步。',
    symbolism: '月亮的面孔显出沉思，龙虾代表深层潜意识觉醒，狗与狼代表驯服与野性的双重本能。',
    visualTheme: { primaryColor: '#283747', accentColor: '#EAECEE', motif: 'moon-crayfish' }
  },
  {
    id: 'major_19',
    slug: 'the-sun',
    number: 19,
    romanNumeral: 'XIX',
    nameZh: '太阳',
    nameEn: 'The Sun',
    arcana: 'major',
    element: 'fire',
    keywords: ['光明璀璨', '喜悦生机', '成功显赫', '生命活力', '真相大白'],
    uprightKeywords: ['阳光普照', '喜乐无忧', '成功圆满', '活力充沛', '真诚坦荡'],
    reversedKeywords: ['暂遮微云', '过度张扬', '乐观受挫', '推迟好运', '缺乏活力'],
    uprightMeaning: '巨大的太阳光芒四射，向日葵盛开在石墙之上，天真无邪的孩子骑着白马张开双臂。这是塔罗牌中最具正能量与吉祥寓意的牌面！一切阴霾荡然无存，成功、健康与由衷的快乐正向你涌来。',
    reversedMeaning: '即使逆位，太阳的光芒依然温暖，只是暂时被一朵小云遮挡。或许成功的到来比预期稍慢，或者你需要更加谦逊地享受当下的喜悦。',
    loveMeaning: '正位象征炽热光明、毫无保留且充满欢笑的幸福良缘；逆位提示避免以自我为中心。',
    careerMeaning: '正位预示高光时刻、成果斐然、获得广泛赞赏；逆位仍能保持稳健势头。',
    advice: '敞开胸怀尽情享受生命的馈赠，将你内心的温暖与光芒毫无保留地分享给世界。',
    symbolism: '绽放的向日葵代表生机盎然，骑马的孩童代表最纯粹的灵魂与毫无挂碍的自由。',
    visualTheme: { primaryColor: '#F1C40F', accentColor: '#FEFDE8', motif: 'sun-child-horse' }
  },
  {
    id: 'major_20',
    slug: 'judgement',
    number: 20,
    romanNumeral: 'XX',
    nameZh: '审判',
    nameEn: 'Judgement',
    arcana: 'major',
    element: 'fire',
    keywords: ['灵魂号角', '重大觉醒', '清盘救赎', '天命召唤', '生命进阶'],
    uprightKeywords: ['天命召引', '重大顿悟', '破茧新生', '公正评判', '跃迁升级'],
    reversedKeywords: ['犹豫不决', '逃避召唤', '自我苛责', '执迷不悟', '错失契机'],
    uprightMeaning: '大天使加百列在云端吹响金色的末日号角，棺木中的人们闻声而起，欢欣地张开双臂迎接新生。这是你生命中一个决定性的清算与觉醒时刻。过去的业力已了，回应那声天命的召唤吧！',
    reversedMeaning: '逆位提示你听到了内心的呼唤，却因害怕被评判或安于现状而选择装作听不见。自我苛责无法解决问题，勇敢拥抱升级后的自己。',
    loveMeaning: '正位代表关系迎来脱胎换骨的升华或深层原谅；逆位提示抓着对方过去的错误不放。',
    careerMeaning: '正位预示职业生涯的重大突破、转型或迎来决定性裁决；逆位提醒果断决策莫迟疑。',
    advice: '听从内心最高维度的声音，原谅过去，你已经被赋予了重新开始的崇高权利。',
    symbolism: '金色长号象征神圣启蒙与觉醒音律，红十字旗帜象征净化与救赎之光。',
    visualTheme: { primaryColor: '#6C3483', accentColor: '#F5EEF8', motif: 'angel-trumpet' }
  },
  {
    id: 'major_21',
    slug: 'the-world',
    number: 21,
    romanNumeral: 'XXI',
    nameZh: '世界',
    nameEn: 'The World',
    arcana: 'major',
    element: 'earth',
    keywords: ['圆满达成', '万物和谐', '阶段终章', '全球视野', '丰盛成就'],
    uprightKeywords: ['大获全胜', '圆满闭环', '身心一体', '广阔天地', '步入新境界'],
    reversedKeywords: ['行百里半九十', '未尽事宜', '封闭设限', '缺乏收尾', '延期圆满'],
    uprightMeaning: '胜利的舞者手持双杖在绿色月桂花环中翩翩起舞，宇宙四灵在四角守护。愚人之旅在此达到了终极的完满与升华。一个重要的大周期圆满收官，你已拥有了整个世界的馈赠，并即将开启更高维度的探索。',
    reversedMeaning: '逆位提示你的项目或阶段虽然接近终点，但仍留有一点微小的缺憾未能闭环。不要在最后的几步懈怠，耐心收尾，便能迎接真正的圆满。',
    loveMeaning: '正位代表情投意合修成正果，走向婚姻或灵魂结合；逆位提示在终成眷属前还有微小考验。',
    careerMeaning: '正位预示达成里程碑式重大胜利，甚至走向国际化舞台；逆位提醒稳住阵脚完成最后拼图。',
    advice: '庆祝你所走过的每一寸土地与收获的每份智慧，张开双臂，拥抱属于你的广阔世界。',
    symbolism: '月桂花环象征永恒生命与胜利，两端的红丝带结成无限符号象征循环与永恒。',
    visualTheme: { primaryColor: '#117A65', accentColor: '#E8F8F5', motif: 'wreath-dancer' }
  },

  // ================= 56 小阿卡纳 精选核心与代表牌 (Minor Arcana) =================
  // 权杖 (Wands - 火元素)
  {
    id: 'wands_1',
    slug: 'ace-of-wands',
    number: 1,
    nameZh: '权杖一',
    nameEn: 'Ace of Wands',
    arcana: 'minor',
    suit: 'wands',
    element: 'fire',
    keywords: ['创造火花', '灵感爆发', '崭新契机', '热情驱动'],
    uprightKeywords: ['点燃激情', '全新项目', '冲劲十足', '灵感降临'],
    reversedKeywords: ['动力不足', '创意受阻', '缺乏耐性', '错失良机'],
    uprightMeaning: '云中伸出的神之手握着生机勃勃的权杖，象征着纯粹的创造火花与行动冲动。',
    reversedMeaning: '灵感被压抑或缺乏执行的热情，需要重新找回最初的感动。',
    loveMeaning: '正位象征一见钟情或激情的火热重燃；逆位提示热情退潮。',
    careerMeaning: '正位是开创全新事业的绝佳时机；逆位提醒方案仍需推敲。',
    advice: '跟随那团火苗，毫不犹豫地投入行动。',
    symbolism: '长满绿芽的权杖代表旺盛的生命力与繁殖力。',
    visualTheme: { primaryColor: '#E65100', accentColor: '#FFF3E0', motif: 'flaming-wand' }
  },
  {
    id: 'wands_3',
    slug: 'three-of-wands',
    number: 3,
    nameZh: '权杖三',
    nameEn: 'Three of Wands',
    arcana: 'minor',
    suit: 'wands',
    element: 'fire',
    keywords: ['远见卓识', '拓展版图', '出海远航', '守望收获'],
    uprightKeywords: ['登高望远', '拓展合作', '国际视野', '胸有成竹'],
    reversedKeywords: ['眼光局限', '延误阻滞', '合作落空', '缺乏远见'],
    uprightMeaning: '旅人立于悬崖高处，凝望远方海面上穿梭的商船，象征深远的谋略与版图扩张。',
    reversedMeaning: '计划遇到跨界或长途沟通的延误，需要更加包容和宽广的视野。',
    loveMeaning: '正位预示共同规划长远未来，甚至是跨地/跨国良缘；逆位警惕距离产生的隔阂。',
    careerMeaning: '正位代表业务拓展顺利，迎来海外或跨区域良机；逆位提醒做好应急预案。',
    advice: '放开眼界，你所播种的成果正从大洋彼岸驶来。',
    symbolism: '背影与远洋船只象征着雄心与探索未知的壮志。',
    visualTheme: { primaryColor: '#EF6C00', accentColor: '#FFF3E0', motif: 'ships-horizon' }
  },
  {
    id: 'wands_4',
    slug: 'four-of-wands',
    number: 4,
    nameZh: '权杖四',
    nameEn: 'Four of Wands',
    arcana: 'minor',
    suit: 'wands',
    element: 'fire',
    keywords: ['家园庆典', '稳固喜悦', '归属感', '阶段凯旋'],
    uprightKeywords: ['欢聚一堂', '乔迁新居', '婚礼喜庆', '和谐稳定'],
    reversedKeywords: ['家庭矛盾', '短暂不和', '庆祝推迟', '归属感弱'],
    uprightMeaning: '四根缀满鲜花与果实的长杖搭起拱门，人们在城堡前欢欣起舞。象征着稳固、祥和与欢聚。',
    reversedMeaning: '虽然仍有喜悦，但可能受到一些琐碎的人际磨合或日程延误干扰。',
    loveMeaning: '正位代表步入婚姻、构筑爱巢与深层承诺；逆位提示家庭内部沟通磨合。',
    careerMeaning: '正位象征团队取得重大阶段性战果并共同庆祝；逆位提醒不可过早松懈。',
    advice: '停下来与你所爱的人共同庆祝，这份安全感是你坚强的后盾。',
    symbolism: '花果拱门与四根稳固立柱代表物质与情感的安乐窝。',
    visualTheme: { primaryColor: '#F57C00', accentColor: '#FFF8E1', motif: 'floral-bower' }
  },
  {
    id: 'wands_queen',
    slug: 'queen-of-wands',
    number: 13,
    nameZh: '权杖王后',
    nameEn: 'Queen of Wands',
    arcana: 'minor',
    suit: 'wands',
    element: 'fire',
    keywords: ['自信热情', '独立魅力', '社交达人', '阳光笃定'],
    uprightKeywords: ['光彩照人', '领导魄力', '真挚坦诚', '温暖强大'],
    reversedKeywords: ['嫉妒猜疑', '独断霸道', '情绪暴烈', '自信受挫'],
    uprightMeaning: '王后手持向日葵与权杖，黑猫在脚下守护，代表着无可抵挡的自信与明媚。',
    reversedMeaning: '警惕因虚荣或自卑引发的控制欲与争强好胜。',
    loveMeaning: '正位展现极具魅力的伴侣形象，富有热情；逆位提醒情绪管理。',
    careerMeaning: '正位代表女性高管或极具号召力的团队灵魂人物；逆位警惕职场人际冲突。',
    advice: '相信你的魅力与能力，昂首挺胸成为全场的光芒。',
    symbolism: '向日葵与黑猫代表生命的蓬勃光亮与敏锐直觉的统一。',
    visualTheme: { primaryColor: '#FF9800', accentColor: '#FFFDE7', motif: 'sunflower-cat' }
  },

  // 圣杯 (Cups - 水元素)
  {
    id: 'cups_1',
    slug: 'ace-of-cups',
    number: 1,
    nameZh: '圣杯一',
    nameEn: 'Ace of Cups',
    arcana: 'minor',
    suit: 'cups',
    element: 'water',
    keywords: ['爱之清泉', '情感丰沛', '同理共情', '灵性觉照'],
    uprightKeywords: ['真爱降临', '心灵疗愈', '福杯满溢', '直觉流动'],
    reversedKeywords: ['情感压抑', '伤心失落', '付出无果', '冷漠枯竭'],
    uprightMeaning: '神之手捧出圣杯，五股清泉注入睡莲池塘，象征着宇宙无条件的慈悲与爱的奔涌。',
    reversedMeaning: '情感遭遇阻滞或自我封闭，需要释放过往的积怨。',
    loveMeaning: '正位是深层浪漫与爱意初萌的极致象征；逆位提示需要先学会爱自己。',
    careerMeaning: '正位代表充满热情与人文关怀的事业；逆位警惕感情用事。',
    advice: '敞开心灵容器，接纳并分享这源源不断的情感活水。',
    symbolism: '白鸽衔着圣饼飞入圣杯，象征圣灵与灵性恩赐。',
    visualTheme: { primaryColor: '#0288D1', accentColor: '#E1F5FE', motif: 'dove-fountain' }
  },
  {
    id: 'cups_2',
    slug: 'two-of-cups',
    number: 2,
    nameZh: '圣杯二',
    nameEn: 'Two of Cups',
    arcana: 'minor',
    suit: 'cups',
    element: 'water',
    keywords: ['心心相印', '灵魂契合', '平等互爱', '深度联结'],
    uprightKeywords: ['互相吸引', '默契合作', '和解释嫌', '坦诚互信'],
    reversedKeywords: ['关系失衡', '沟通误会', '信任裂痕', '貌合神离'],
    uprightMeaning: '男女各自手持金杯对饮，双蛇缠绕的商神杖与红狮展翅于空中，象征爱与合作的崇高结合。',
    reversedMeaning: '沟通出现偏差，或者一方付出过多导致天平倾斜。',
    loveMeaning: '正位是灵魂伴侣与互相尊重的代名词；逆位提示坦率沟通以修复信任。',
    careerMeaning: '正位预示绝佳的合伙创业搭档；逆位警惕合作条款不清。',
    advice: '真诚地看着对方的眼睛，在给予与接受之间找到完美平衡。',
    symbolism: '赫尔墨斯商神杖与飞狮代表二元力量的神圣融合。',
    visualTheme: { primaryColor: '#03A9F4', accentColor: '#E1F5FE', motif: 'caduceus-toast' }
  },
  {
    id: 'cups_10',
    slug: 'ten-of-cups',
    number: 10,
    nameZh: '圣杯十',
    nameEn: 'Ten of Cups',
    arcana: 'minor',
    suit: 'cups',
    element: 'water',
    keywords: ['合家欢乐', '天伦之乐', '长久幸福', '内心安详'],
    uprightKeywords: ['其乐融融', '幸福圆满', '情感归宿', '如愿以偿'],
    reversedKeywords: ['家庭矛盾', '假面和谐', '价值观分歧', '幸福落空'],
    uprightMeaning: '彩虹般的十只金杯横跨天际，恩爱夫妻与欢跳的孩子在如画的田园风光中享受天伦。',
    reversedMeaning: '看似完美的表象下隐藏着未被解决的家庭纠纷，需用心化解。',
    loveMeaning: '正位象征婚姻圆满、家庭幸福与一生陪伴；逆位提醒关照家人情绪。',
    careerMeaning: '正位代表工作与生活达到完美平衡；逆位提示平衡职场与家庭投入。',
    advice: '珍惜身边的亲人与平静的生活，这就是世间最大的财富。',
    symbolism: '彩虹圣杯象征神圣盟约与永恒的眷顾。',
    visualTheme: { primaryColor: '#00BCD4', accentColor: '#E0F7FA', motif: 'rainbow-cups' }
  },
  {
    id: 'cups_king',
    slug: 'king-of-cups',
    number: 14,
    nameZh: '圣杯国王',
    nameEn: 'King of Cups',
    arcana: 'minor',
    suit: 'cups',
    element: 'water',
    keywords: ['温厚宽容', '情绪成熟', '智慧导师', '慈悲胸怀'],
    uprightKeywords: ['从容稳重', '善解人意', '情绪稳定', '值得信赖'],
    reversedKeywords: ['情绪操纵', '冷漠喜怒无常', '自私自恋', '逃避责任'],
    uprightMeaning: '国王端坐于汹涌波涛中的王座上，神情波澜不惊。他掌握了深层的情绪智慧，能容纳世间百川。',
    reversedMeaning: '警惕情感上的冷暴力、情绪绑架或缺乏担待。',
    loveMeaning: '正位是一位体贴、有安全感且懂倾听的理想伴侣；逆位提示情绪忽冷忽热。',
    careerMeaning: '正位代表有同理心的明智领导者或心理/医疗行业翘楚；逆位警惕决策优柔寡断。',
    advice: '做自己情绪的主人，用慈悲与智慧去包容身边的波涛。',
    symbolism: '跃出海面的飞鱼象征在情感波浪中保持优雅与敏捷。',
    visualTheme: { primaryColor: '#0097A7', accentColor: '#E0F2F1', motif: 'waves-throne' }
  },

  // 宝剑 (Swords - 风元素)
  {
    id: 'swords_1',
    slug: 'ace-of-swords',
    number: 1,
    nameZh: '宝剑一',
    nameEn: 'Ace of Swords',
    arcana: 'minor',
    suit: 'swords',
    element: 'air',
    keywords: ['理智澄澈', '破开迷雾', '清晰决策', '真理利剑'],
    uprightKeywords: ['灵光一闪', '斩断纠葛', '绝对清晰', '公理正义'],
    reversedKeywords: ['思维混乱', '言语伤人', '残酷真相', '决策失误'],
    uprightMeaning: '神之手握着直插云霄的锋利宝剑，剑顶戴着金色王冠与橄榄枝，象征着明澈思想战胜一切混乱。',
    reversedMeaning: '思路混乱或说话尖酸刻薄，过度理性反而伤人伤己。',
    loveMeaning: '正位代表坦诚把话说开，看清关系的真相；逆位警惕言辞过激造成伤口。',
    careerMeaning: '正位象征突破性的战略洞见或关键决断；逆位需重新梳理逻辑。',
    advice: '用客观与理智作为武器，果断斩断无谓的纠缠。',
    symbolism: '橄榄枝与棕榈叶代表智慧带来的和平与胜利。',
    visualTheme: { primaryColor: '#546E7A', accentColor: '#ECEFF1', motif: 'crown-sword' }
  },
  {
    id: 'swords_6',
    slug: 'six-of-swords',
    number: 6,
    nameZh: '宝剑六',
    nameEn: 'Six of Swords',
    arcana: 'minor',
    suit: 'swords',
    element: 'air',
    keywords: ['渡过难关', '远离风暴', '疗愈过渡', '驶向平静'],
    uprightKeywords: ['渐入佳境', '摆脱困境', '长途旅行', '抚平创伤'],
    reversedKeywords: ['困在原地', '旧伤难愈', '迁延波折', '抗拒前行'],
    uprightMeaning: '船夫撑着木舟载着妇孺驶向风平浪静的彼岸，六把宝剑直立在船头。虽然带着过往的伤痛，但最糟糕的风浪已经过去。',
    reversedMeaning: '心里依然放不下过往的执念，迟迟不肯登上摆脱痛苦的归舟。',
    loveMeaning: '正位象征共同度过危机，走向平静理解；逆位警惕旧账翻篇难。',
    careerMeaning: '正位预示跳出有毒环境、换岗或平稳过渡；逆位提醒积极求变。',
    advice: '把伤痛留在身后的惊涛骇浪里，平稳地驶向属于你的安宁彼岸。',
    symbolism: '右侧平静水面与左侧波澜代表从危机平稳过渡到安宁。',
    visualTheme: { primaryColor: '#607D8B', accentColor: '#ECEFF1', motif: 'boat-swords' }
  },
  {
    id: 'swords_queen',
    slug: 'queen-of-swords',
    number: 13,
    nameZh: '宝剑王后',
    nameEn: 'Queen of Swords',
    arcana: 'minor',
    suit: 'swords',
    element: 'air',
    keywords: ['清醒独立', '明辨是非', '言辞犀利', '边界清晰'],
    uprightKeywords: ['清醒洞察', '直击本质', '成熟理智', '独立自主'],
    reversedKeywords: ['刻薄挑剔', '冷酷无情', '苦涩封闭', '自我防御'],
    uprightMeaning: '王后高坐云端王座，单手执剑指向天空，另一只手伸向前方。她历经风霜，拥有看透一切虚伪的锐利目光与尊严。',
    reversedMeaning: '警惕因受过伤而变得过度防备、尖酸刻薄，将善意的人拒之千里。',
    loveMeaning: '正位保持清晰边界与真诚；逆位提醒放下心防，不要用冷若冰霜包裹自己。',
    careerMeaning: '正位代表极具专业判断力的专家或分析师；逆位需注意沟通的人情味。',
    advice: '坚持你对真理的追求，但记得在理智的宝剑上保留一丝人性的温存。',
    symbolism: '头顶的天使浮雕与晴朗长空象征超拔的智慧与洞察力。',
    visualTheme: { primaryColor: '#455A64', accentColor: '#CFD8DC', motif: 'cloud-throne-sword' }
  },

  // 星币 (Pentacles - 土元素)
  {
    id: 'pentacles_1',
    slug: 'ace-of-pentacles',
    number: 1,
    nameZh: '星币一',
    nameEn: 'Ace of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    element: 'earth',
    keywords: ['物质丰收', '财富机遇', '稳固起点', '脚踏实地'],
    uprightKeywords: ['财运进门', '务实投资', '良好开局', '健康改善'],
    reversedKeywords: ['错失商机', '理财失策', '根基不稳', '过度贪婪'],
    uprightMeaning: '云中伸出的巨手托起金光闪闪的大星币，下方是繁花锦簇的花园与通向雪山的拱门。象征着切实可触摸的繁荣与财富机运。',
    reversedMeaning: '警惕投资风险、预算超支，或忽视了长远的稳固基础。',
    loveMeaning: '正位象征务实稳健、有物质保障的情感承诺；逆位警惕因钱财引发争端。',
    careerMeaning: '正位预示涨薪、获批资金或极具商业价值的新起点；逆位提醒做好风险把控。',
    advice: '抓住眼前实实在在的机会，脚踏实地为未来筑造财富基石。',
    symbolism: '百合与玫瑰的花园象征世俗繁荣与神圣秩序的交汇。',
    visualTheme: { primaryColor: '#388E3C', accentColor: '#E8F5E9', motif: 'coin-garden' }
  },
  {
    id: 'pentacles_3',
    slug: 'three-of-pentacles',
    number: 3,
    nameZh: '星币三',
    nameEn: 'Three of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    element: 'earth',
    keywords: ['匠人精神', '团队协作', '精湛技能', '获得认可'],
    uprightKeywords: ['专业精进', '各司其职', '受到赞誉', '高效合作'],
    reversedKeywords: ['缺乏协作', '粗制滥造', '意见分歧', '缺乏专业'],
    uprightMeaning: '年轻的石匠手持凿子在教堂拱门上精雕细琢，建筑师与修道士拿着图纸认真商议。象征着专业才华与团队协同的完美统一。',
    reversedMeaning: '团队内部分工不明、各自为政，或是专业水平未能达到预期。',
    loveMeaning: '正位代表彼此愿意为共同未来脚踏实地经营；逆位提示需要分工合作解决柴米油盐。',
    careerMeaning: '正位预示项目合作顺畅，个人技艺获得行业权威背书；逆位需强化流程规范。',
    advice: '精益求精打磨你的专业手艺，并虚心与优秀的伙伴并肩作战。',
    symbolism: '教堂雕刻的三枚星币象征肉体、心智与灵性在劳动中的升华。',
    visualTheme: { primaryColor: '#2E7D32', accentColor: '#E8F5E9', motif: 'cathedral-mason' }
  },
  {
    id: 'pentacles_10',
    slug: 'ten-of-pentacles',
    number: 10,
    nameZh: '星币十',
    nameEn: 'Ten of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    element: 'earth',
    keywords: ['基业长青', '家族传承', '长久富足', '世代福泽'],
    uprightKeywords: ['大富大贵', '家族荣光', '遗产馈赠', '衣食无忧'],
    reversedKeywords: ['家族纠纷', '争夺财产', '投资亏损', '名誉受损'],
    uprightMeaning: '在宏伟古老的庄园拱门下，祖孙三代与忠犬其乐融融，十枚星币排列成生命之树的图案。象征着代代相传的财富、安稳与终极圆满。',
    reversedMeaning: '可能面临家庭财务争端、遗产纠葛，或是因为金钱压力动摇了亲情。',
    loveMeaning: '正位象征受到大家庭支持、门当户对且极度安稳的百年好合；逆位提醒金钱与感情分清。',
    careerMeaning: '正位预示企业基业稳固、成熟分红或长远传承；逆位警惕家族化治理弊端。',
    advice: '感恩长辈与岁月的恩泽，着眼于长远的遗产与可持续的稳固。',
    symbolism: '十星币呈生命之树排列象征宇宙繁盛在物质层面的完全显现。',
    visualTheme: { primaryColor: '#1B5E20', accentColor: '#E8F5E9', motif: 'castle-family-tree' }
  },
  {
    id: 'pentacles_king',
    slug: 'king-of-pentacles',
    number: 14,
    nameZh: '星币国王',
    nameEn: 'King of Pentacles',
    arcana: 'minor',
    suit: 'pentacles',
    element: 'earth',
    keywords: ['商业巨擘', '沉稳务实', '富足慷慨', '稳健持家'],
    uprightKeywords: ['点石成金', '信誉卓著', '财富自由', '稳重可靠'],
    reversedKeywords: ['唯利是图', '挥霍无度', '守财奴', '固步自封'],
    uprightMeaning: '国王身披缀满葡萄藤的华服，王座刻满公牛与硕果，脚踩护城河。他是世俗商业成功与务实稳健的极致化身。',
    reversedMeaning: '警惕被拜金主义与物欲吞噬，变成冷血的守财奴或投机失败。',
    loveMeaning: '正位提供坚实的物质保障与终身依靠；逆位警惕用金钱衡量一切感情。',
    careerMeaning: '正位象征杰出的企业家、投资者或顶级资深管理者；逆位提醒重塑商业伦理。',
    advice: '像耕耘土地一样对待你的事业与财富，耐心与诚信是无尽财富的泉源。',
    symbolism: '成熟葡萄藤与公牛代表金牛座的沉稳、丰裕与坚实资产。',
    visualTheme: { primaryColor: '#1B5E20', accentColor: '#E8F5E9', motif: 'vine-bull-throne' }
  }
,
{
  "id": "wands_2",
  "slug": "two-of-wands",
  "number": 2,
  "nameZh": "权杖二",
  "nameEn": "Two of Wands",
  "arcana": "minor",
  "suit": "wands",
  "element": "fire",
  "keywords": [
    "远景规划",
    "踌躇满志",
    "掌控局面",
    "蓄势出征"
  ],
  "uprightKeywords": [
    "登高谋远",
    "决策时刻",
    "胸怀寰宇",
    "拓展野心"
  ],
  "reversedKeywords": [
    "瞻前顾后",
    "惧怕未知",
    "计划滞后",
    "眼高手低"
  ],
  "uprightMeaning": "立于城堡城墙之上的领主手握地球仪，凝望远方海天一色。你已经打下坚实基础，此刻正站在人生的十字路口，筹谋更宏大的出海航程。",
  "reversedMeaning": "面对走出舒适圈的未知感到犹豫不决，或是规划过于脱离实际。需要果断下定决心，脚踏实地迈出第一步。",
  "loveMeaning": "正位预示共同规划长远未来与人生蓝图；逆位提示对异地或未来方向产生分歧。",
  "careerMeaning": "正位是制定战略扩张、跨行业发展的黄金期；逆位提醒谨防眼高手低。",
  "advice": "世界尽在你的掌握之中，相信你的远见并制定缜密的行动方案。",
  "symbolism": "地球仪代表全球视野与远大野心，玫瑰与百合雕刻象征热情与纯正动机。",
  "visualTheme": {
    "primaryColor": "#E65100",
    "accentColor": "#FFF3E0",
    "motif": "globe-battlements"
  }
},
{
  "id": "wands_5",
  "slug": "five-of-wands",
  "number": 5,
  "nameZh": "权杖五",
  "nameEn": "Five of Wands",
  "arcana": "minor",
  "suit": "wands",
  "element": "fire",
  "keywords": [
    "良性竞争",
    "头脑风暴",
    "意见分歧",
    "混战试炼"
  ],
  "uprightKeywords": [
    "竞技切磋",
    "各抒己见",
    "活力碰撞",
    "脱颖而出"
  ],
  "reversedKeywords": [
    "恶性内耗",
    "无端冲突",
    "逃避竞争",
    "疲于应对"
  ],
  "uprightMeaning": "五位青年手持木杖各显身手，相互比试切磋。这并非你死我活的搏杀，而是思想、才智与能力的试金石，是一次充满活力的良性竞争。",
  "reversedMeaning": "警惕团队内部由良性讨论演变为意气之争或毫无意义的内耗。学会倾听并寻找共识。",
  "loveMeaning": "正位提示恋爱关系中的欢喜冤家斗嘴磨合；逆位提醒注意别把玩笑上升为伤害。",
  "careerMeaning": "正位代表职场竞争激烈但充满机遇，头脑风暴激发灵感；逆位警惕部门内卷。",
  "advice": "在竞争中展现你的独门才华，把分歧当作成长的催化剂。",
  "symbolism": "交错的长杖代表各方力量的碰撞与平衡。",
  "visualTheme": {
    "primaryColor": "#D84315",
    "accentColor": "#FBE9E7",
    "motif": "clashing-staves"
  }
},
{
  "id": "wands_6",
  "slug": "six-of-wands",
  "number": 6,
  "nameZh": "权杖六",
  "nameEn": "Six of Wands",
  "arcana": "minor",
  "suit": "wands",
  "element": "fire",
  "keywords": [
    "胜利凯旋",
    "众望所归",
    "公开表彰",
    "荣耀桂冠"
  ],
  "uprightKeywords": [
    "大获全胜",
    "名誉加身",
    "自信昂扬",
    "备受瞩目"
  ],
  "reversedKeywords": [
    "骄兵必败",
    "短暂风光",
    "跌落神坛",
    "缺乏认同"
  ],
  "uprightMeaning": "头戴月桂冠的骑士骑着披挂整齐的白马凯旋而归，随从们手持权杖夹道欢呼。你在经历一番奋斗后赢得了瞩目的成功与公众的认可。",
  "reversedMeaning": "成就未能获得预期赞赏，或因过早自满而忽视潜在隐患。保持谦逊，真正的胜利经得起时间考验。",
  "loveMeaning": "正位预示恋情得到众人祝福，双方相互仰慕；逆位提示一方过于自负导致失衡。",
  "careerMeaning": "正位代表晋升获誉、项目大成、在行业中声名鹊起；逆位警惕过誉后心态失衡。",
  "advice": "享受胜利的荣光，同时感恩一路相伴支持你的伙伴。",
  "symbolism": "月桂冠与白马代表纯洁而崇高的胜利，群众的长杖象征集体力量的支持。",
  "visualTheme": {
    "primaryColor": "#FF6F00",
    "accentColor": "#FFF8E1",
    "motif": "laurel-white-horse"
  }
},
{
  "id": "wands_7",
  "slug": "seven-of-wands",
  "number": 7,
  "nameZh": "权杖七",
  "nameEn": "Seven of Wands",
  "arcana": "minor",
  "suit": "wands",
  "element": "fire",
  "keywords": [
    "据守阵地",
    "孤身坚守",
    "以一敌众",
    "顽强不屈"
  ],
  "uprightKeywords": [
    "居高临下",
    "寸土不让",
    "坚守原则",
    "化解围攻"
  ],
  "reversedKeywords": [
    "孤立无援",
    "被迫退让",
    "精疲力竭",
    "防线崩溃"
  ],
  "uprightMeaning": "青年站在高岗之上，手持权杖顽强抵御下方六根长杖的进攻。尽管面临多方质疑与竞争挑战，但由于占据制高点，只要坚守立场必能笑到最后。",
  "reversedMeaning": "外部压力排山倒海，感到身心俱疲。需要重新评估防守策略，适时寻求盟友支援。",
  "loveMeaning": "正位代表排除万难捍卫真爱；逆位提示外在舆论或家庭反对给感情造成沉重压力。",
  "careerMeaning": "正位是面对同行竞争或团队异见坚守自己方案并成功突围；逆位警惕孤立无援。",
  "advice": "站稳脚跟，你占据着道德或战略的高地，胜利属于坚毅者。",
  "symbolism": "悬崖峭壁代表优势地形，不同鞋子暗示局势的突发与紧迫。",
  "visualTheme": {
    "primaryColor": "#E64A19",
    "accentColor": "#FBE9E7",
    "motif": "ridge-defender"
  }
},
{
  "id": "wands_8",
  "slug": "eight-of-wands",
  "number": 8,
  "nameZh": "权杖八",
  "nameEn": "Eight of Wands",
  "arcana": "minor",
  "suit": "wands",
  "element": "fire",
  "keywords": [
    "急速进展",
    "喜讯传来",
    "势如破竹",
    "空中飞驰"
  ],
  "uprightKeywords": [
    "速战速决",
    "消息通畅",
    "一马平川",
    "迅速成真"
  ],
  "reversedKeywords": [
    "杂乱无章",
    "计划延误",
    "沟通受阻",
    "草率冲动"
  ],
  "uprightMeaning": "八根长杖在澄澈晴空中如箭矢般整齐划一地飞向大地。停滞与阻碍已经烟消云散，所有的构想与愿望正在以难以置信的速度落地生根。",
  "reversedMeaning": "进展受阻出现延迟，或是节奏过快导致细节出错。请深呼吸，理顺事务的轻重缓急。",
  "loveMeaning": "正位象征闪电恋爱、迅速确立关系或远方爱人的飞奔而至；逆位提醒节奏过快缺乏了解。",
  "careerMeaning": "正位预示项目超速推进、重要商务邀约密集降临；逆位警惕信息过载。",
  "advice": "顺应这股飞驰的势头，瞄准目标全力以赴，好消息即将敲门。",
  "symbolism": "飞行的长杖没有任何人物，象征纯粹不受阻碍的动态能量。",
  "visualTheme": {
    "primaryColor": "#F57C00",
    "accentColor": "#FFF3E0",
    "motif": "flying-staves"
  }
},
{
  "id": "wands_9",
  "slug": "nine-of-wands",
  "number": 9,
  "nameZh": "权杖九",
  "nameEn": "Nine of Wands",
  "arcana": "minor",
  "suit": "wands",
  "element": "fire",
  "keywords": [
    "坚韧不拔",
    "最后一役",
    "伤痕警惕",
    "筑牢防线"
  ],
  "uprightKeywords": [
    "咬牙坚持",
    "百折不挠",
    "保持戒备",
    "曙光在望"
  ],
  "reversedKeywords": [
    "心力交瘁",
    "疑神疑鬼",
    "卸下防备",
    "临阵放弃"
  ],
  "uprightMeaning": "额头缠着绷带的战士手握长杖，身后整齐矗立着坚固的八根栅栏。虽然历经征战伤痕累累，但他依然斗志昂扬。再坚持最后一步，胜利终将属于你。",
  "reversedMeaning": "过度防备导致神经衰弱，或者在最后关头萌生退意。允许自己短暂喘息，别把所有人都当成敌人。",
  "loveMeaning": "正位提示过往情伤让你心存戒备，需要时间重新建立信任；逆位建议放下心理包袱。",
  "careerMeaning": "正位代表项目攻坚最后阶段，咬紧牙关即可突围；逆位警惕过劳。",
  "advice": "你已经走过了最艰难的九十九步，稳住防线，终点就在眼前。",
  "symbolism": "绷带代表过往风霜与经验，坚固栅栏象征无懈可击的安全界限。",
  "visualTheme": {
    "primaryColor": "#BF360C",
    "accentColor": "#FBE9E7",
    "motif": "bandaged-sentinel"
  }
},
{
  "id": "wands_10",
  "slug": "ten-of-wands",
  "number": 10,
  "nameZh": "权杖十",
  "nameEn": "Ten of Wands",
  "arcana": "minor",
  "suit": "wands",
  "element": "fire",
  "keywords": [
    "重任在肩",
    "负重前行",
    "压力巅峰",
    "交付在即"
  ],
  "uprightKeywords": [
    "承担责任",
    "坚持不懈",
    "即将抵达",
    "分权减负"
  ],
  "reversedKeywords": [
    "重压垮塌",
    "越俎代庖",
    "不堪重负",
    "学会放手"
  ],
  "uprightMeaning": "农夫吃力地抱着十根沉重的长杖，步履艰难却坚定地走向不远处的城市。你承担了过多的期望与责任，虽然沉重，但目的地已近在咫尺。",
  "reversedMeaning": "压力超出负荷极限，不仅影响健康也拖慢效率。学会合理分工，不必事必躬亲。",
  "loveMeaning": "正位提示一方在感情中承担了过多压力；逆位建议双方坦诚分担生活琐事。",
  "careerMeaning": "正位象征即将交卷的大项目，虽累但成果丰硕；逆位警惕被无关紧要的杂事压垮。",
  "advice": "抬头看一看，城镇就在前方。完成这次冲刺后，务必学会给心灵减负。",
  "symbolism": "被长杖遮挡的视线象征只顾埋头苦干，远方城镇代表即将到来的安宁。",
  "visualTheme": {
    "primaryColor": "#A84300",
    "accentColor": "#FFF3E0",
    "motif": "heavy-burden-town"
  }
},
{
  "id": "wands_page",
  "slug": "page-of-wands",
  "number": 11,
  "nameZh": "权杖侍从",
  "nameEn": "Page of Wands",
  "arcana": "minor",
  "suit": "wands",
  "element": "fire",
  "keywords": [
    "探索信使",
    "好奇热情",
    "新奇创意",
    "跃跃欲试"
  ],
  "uprightKeywords": [
    "灵感萌动",
    "求知若渴",
    "探索精神",
    "乐观无畏"
  ],
  "reversedKeywords": [
    "心浮气躁",
    "眼高手低",
    "三分钟热度",
    "不可靠消息"
  ],
  "uprightMeaning": "年轻的侍从身着缀满火蜥蜴的华服，双手扶着长杖注视着杖顶长出的绿芽。他充满了对未知世界的好奇心与创造欲，带来充满激情的喜讯。",
  "reversedMeaning": "空有热情却缺乏持久的执行力，或是轻信了不切实际的传言。",
  "loveMeaning": "正位预示收到令人心动的表白或开启充满新鲜感的互动；逆位警惕感情中的幼稚不成熟。",
  "careerMeaning": "正位适合尝试新技能、新岗位或开拓新业务线；逆位提醒落实细节。",
  "advice": "保持这颗赤诚好奇的童心，大胆去尝试你想做的事情。",
  "symbolism": "火蜥蜴羽饰象征火元素生生不息的创造活力。",
  "visualTheme": {
    "primaryColor": "#FF6D00",
    "accentColor": "#FFF8E1",
    "motif": "salamander-page"
  }
},
{
  "id": "wands_knight",
  "slug": "knight-of-wands",
  "number": 12,
  "nameZh": "权杖骑士",
  "nameEn": "Knight of Wands",
  "arcana": "minor",
  "suit": "wands",
  "element": "fire",
  "keywords": [
    "披荆斩棘",
    "雷厉风行",
    "热烈冒险",
    "勇往直前"
  ],
  "uprightKeywords": [
    "行动敏捷",
    "魅力四射",
    "敢打敢拼",
    "突破局限"
  ],
  "reversedKeywords": [
    "鲁莽冲动",
    "后劲不足",
    "脾气暴躁",
    "半途而废"
  ],
  "uprightMeaning": "身披战甲与火焰披风的骑士骑着烈马奔腾向前，手持权杖誓要征服前方的一切险阻。行动力与魄力的巅峰代表，凡事绝不拖泥带水。",
  "reversedMeaning": "冲动往往伴随着盲目，因急躁冒进导致失误，或承诺过多却无法兑现。",
  "loveMeaning": "正位象征炙热而猛烈的追求，极具个人魅力；逆位警惕热度来得快去得快。",
  "careerMeaning": "正位是开拓市场、危机公关的先锋大将；逆位提醒谋定而后动。",
  "advice": "展现你的魄力与决断，但请给狂奔的骏马套上一根理性的缰绳。",
  "symbolism": "扬蹄奔腾的战马与飘扬火焰披风象征无可阻挡的意志力。",
  "visualTheme": {
    "primaryColor": "#FF3D00",
    "accentColor": "#FBE9E7",
    "motif": "charging-fire-knight"
  }
},
{
  "id": "wands_king",
  "slug": "king-of-wands",
  "number": 14,
  "nameZh": "权杖国王",
  "nameEn": "King of Wands",
  "arcana": "minor",
  "suit": "wands",
  "element": "fire",
  "keywords": [
    "领袖风范",
    "开创新局",
    "高瞻远瞩",
    "振臂一呼"
  ],
  "uprightKeywords": [
    "卓越领导力",
    "激励人心",
    "宏图大略",
    "果敢担当"
  ],
  "reversedKeywords": [
    "专制独裁",
    "固执己见",
    "刚愎自用",
    "急功近利"
  ],
  "uprightMeaning": "威严的国王坐在饰有狮子与火蜥蜴的宝座上，手持生机盎然的权杖。他兼具远大抱负与卓越执行力，是充满领袖魅力、能够带领团队开疆拓土的核心人物。",
  "reversedMeaning": "过于强硬独断，听不进他人的建议，或是制定了不符合实际的过高指标。",
  "loveMeaning": "正位代表有责任担当、成熟而充满激情的优质伴侣；逆位提示大男子主义倾向。",
  "careerMeaning": "正位象征英明的创始人、高级总监或战略指挥官；逆位提醒重塑团队民主。",
  "advice": "用你的热情与愿景去感染身边的人，真正的领袖是在成就他人中成就自己。",
  "symbolism": "狮子与咬尾火蜥蜴象征完全被驯服与掌控的火之意志。",
  "visualTheme": {
    "primaryColor": "#BF360C",
    "accentColor": "#FFF3E0",
    "motif": "lion-salamander-throne"
  }
},
{
  "id": "cups_3",
  "slug": "three-of-cups",
  "number": 3,
  "nameZh": "圣杯三",
  "nameEn": "Three of Cups",
  "arcana": "minor",
  "suit": "cups",
  "element": "water",
  "keywords": [
    "欢聚庆典",
    "闺蜜知己",
    "丰收分享",
    "举杯同欢"
  ],
  "uprightKeywords": [
    "友谊长青",
    "团队胜利",
    "举杯欢庆",
    "心意相通"
  ],
  "reversedKeywords": [
    "小圈子排挤",
    "流于表面",
    "纵欲过度",
    "聚散匆匆"
  ],
  "uprightMeaning": "三位头戴花环的少女在硕果累累的庄园里高举圣杯，翩翩起舞。象征着真挚的情感共鸣、团队的成功庆祝与深厚的友谊。",
  "reversedMeaning": "社交生活过于频繁导致精力涣散，或者在小圈子中产生微妙的嫉妒与猜疑。",
  "loveMeaning": "正位预示喜结良缘并获得亲友祝福，或是在社交圈中觅得良人；逆位警惕第三者暧昧插足。",
  "careerMeaning": "正位代表团队协作无间、项目圆满收尾并举行业务庆功；逆位提示防范无效社交。",
  "advice": "敞开心扉与你信任的伙伴分享快乐，幸福在分享中成倍增长。",
  "symbolism": "葡萄与南瓜象征大地与心灵的丰收，三位少女代表三位一体的情感连结。",
  "visualTheme": {
    "primaryColor": "#0288D1",
    "accentColor": "#E1F5FE",
    "motif": "dancing-maidens"
  }
},
{
  "id": "cups_4",
  "slug": "four-of-cups",
  "number": 4,
  "nameZh": "圣杯四",
  "nameEn": "Four of Cups",
  "arcana": "minor",
  "suit": "cups",
  "element": "water",
  "keywords": [
    "情绪倦怠",
    "错失机缘",
    "沉溺内省",
    "冷淡拒绝"
  ],
  "uprightKeywords": [
    "暂时厌倦",
    "忽视好意",
    "渴望突破",
    "反思现状"
  ],
  "reversedKeywords": [
    "重拾热情",
    "发现新机",
    "走出封闭",
    "接受好意"
  ],
  "uprightMeaning": "男子双臂抱胸背靠大树，对眼前摆放的三只圣杯视而不见，甚至对云中神手递来的第四只全新圣杯也漠不关心。代表情绪上的倦怠期与对现状的厌倦。",
  "reversedMeaning": "从封闭低迷的情绪中苏醒过来，重新注意到周围一直被忽略的美好与机会。",
  "loveMeaning": "正位提示感情进入平淡期或过于挑剔；逆位意味着重新敞开心扉接受浪漫。",
  "careerMeaning": "正位代表对目前工作失去新鲜感与动力；逆位预示走出迷茫并发现新转机。",
  "advice": "低头沉思虽好，但也别忘了抬头看看——宇宙赠予你的新礼物正悬于空中。",
  "symbolism": "交叉的双臂代表防卫与封闭的心境，云中圣杯象征来自更高维度的礼物。",
  "visualTheme": {
    "primaryColor": "#0097A7",
    "accentColor": "#E0F7FA",
    "motif": "meditating-tree-cups"
  }
},
{
  "id": "cups_5",
  "slug": "five-of-cups",
  "number": 5,
  "nameZh": "圣杯五",
  "nameEn": "Five of Cups",
  "arcana": "minor",
  "suit": "cups",
  "element": "water",
  "keywords": [
    "哀悼失去",
    "执念过往",
    "尚存希望",
    "疗愈转念"
  ],
  "uprightKeywords": [
    "伤感遗憾",
    "聚焦缺憾",
    "忽视转机",
    "接纳悲伤"
  ],
  "reversedKeywords": [
    "走出阴霾",
    "重燃希望",
    "破涕为笑",
    "接纳新生"
  ],
  "uprightMeaning": "身披黑袍的人物低头哀悼倒在地上、美酒流淌的三只圣杯。然而，只要他转过身来，就会发现身后依然直立着两只装满希望的圣杯。",
  "reversedMeaning": "你开始从遗憾中汲取智慧，放下对过去的执念，转身拥抱依然留在身边的美好。",
  "loveMeaning": "正位提示正在经历失恋或感情裂痕的痛楚；逆位预示伤痛痊愈，迎来情感重生。",
  "careerMeaning": "正位代表某个方案受挫引发懊恼；逆位提醒聚焦剩余的核心资源另辟蹊径。",
  "advice": "允许自己悲伤，但不要让悲伤遮蔽双眼。转身看看，生活依然为你留有温存。",
  "symbolism": "倾倒流出的酒水象征情感的宣泄，身后的河流与桥梁代表通往新天地的通路。",
  "visualTheme": {
    "primaryColor": "#37474F",
    "accentColor": "#ECEFF1",
    "motif": "cloak-spilled-cups"
  }
},
{
  "id": "cups_6",
  "slug": "six-of-cups",
  "number": 6,
  "nameZh": "圣杯六",
  "nameEn": "Six of Cups",
  "arcana": "minor",
  "suit": "cups",
  "element": "water",
  "keywords": [
    "童年回忆",
    "纯真温情",
    "故人重逢",
    "温存赠礼"
  ],
  "uprightKeywords": [
    "昔日情怀",
    "无私关怀",
    "美好重现",
    "安全避风港"
  ],
  "reversedKeywords": [
    "沉溺过去",
    "逃避成年",
    "告别旧人",
    "面向未来"
  ],
  "uprightMeaning": "在古朴的城堡庭院中，大男孩将一只盛满白花的圣杯温柔地递给小女孩。象征着纯真无瑕的善意、温暖的回忆、故人重聚以及对初心的回归。",
  "reversedMeaning": "过度怀旧沉湎于旧时光，不愿面对当下的挑战；或是决定告别过去，勇敢走向成熟。",
  "loveMeaning": "正位预示旧爱重燃、青梅竹马或是像孩子般纯粹的相互照拂；逆位提醒别把回忆当成现实。",
  "careerMeaning": "正位代表得到老同事、老导师的提携扶持；逆位提示业务需要与时俱进。",
  "advice": "回忆是力量的源泉，带着那份纯粹的爱与温柔，好好照亮今天的路。",
  "symbolism": "盛开的白色五瓣花象征无染的纯真，巡逻卫兵代表绝对的安心与守护。",
  "visualTheme": {
    "primaryColor": "#0288D1",
    "accentColor": "#E1F5FE",
    "motif": "children-flowered-cups"
  }
},
{
  "id": "cups_7",
  "slug": "seven-of-cups",
  "number": 7,
  "nameZh": "圣杯七",
  "nameEn": "Seven of Cups",
  "arcana": "minor",
  "suit": "cups",
  "element": "water",
  "keywords": [
    "梦幻泡影",
    "选择迷局",
    "欲望诱惑",
    "看清本质"
  ],
  "uprightKeywords": [
    "丰富想象",
    "眼花缭乱",
    "空中楼阁",
    "甄别虚实"
  ],
  "reversedKeywords": [
    "拨云见日",
    "目标明确",
    "脚踏实地",
    "破除幻想"
  ],
  "uprightMeaning": "黑影凝视着云层中漂浮的七只圣杯，每只杯中都装着不同的幻象：城堡、珠宝、桂冠、巨蛇、怪兽、神灵与蒙面人。代表欲望诱惑与眼花缭乱的选择。",
  "reversedMeaning": "看穿泡沫与虚假承诺，收敛散乱的思绪，选择最务实可行的道路前行。",
  "loveMeaning": "正位提示过于理想化伴侣或陷入多个暧昧选择；逆位代表看清内心真正所需。",
  "careerMeaning": "正位警惕画大饼式的商业项目；逆位是去伪存真，聚焦核心商业价值。",
  "advice": "做梦是创造的第一步，但千万不要在幻境里迷路。用理性刺破泡影，选择真正值得追求的宝石。",
  "symbolism": "云中各异的奇景象征人类内心不同层次的潜意识欲望与恐惧。",
  "visualTheme": {
    "primaryColor": "#5C6BC0",
    "accentColor": "#EDE7F6",
    "motif": "cloud-mirage-cups"
  }
},
{
  "id": "cups_8",
  "slug": "eight-of-cups",
  "number": 8,
  "nameZh": "圣杯八",
  "nameEn": "Eight of Cups",
  "arcana": "minor",
  "suit": "cups",
  "element": "water",
  "keywords": [
    "转身离去",
    "精神苦旅",
    "追求更高",
    "舍弃安逸"
  ],
  "uprightKeywords": [
    "告别执念",
    "追寻真理",
    "深层觉悟",
    "踏上新途"
  ],
  "reversedKeywords": [
    "安于现状",
    "惧怕改变",
    "拖延告别",
    "徘徊不前"
  ],
  "uprightMeaning": "在冷峻的月色下，红袍男子手拄长杖，毅然转身离开精心叠放的八只圣杯，踏上通往崇山峻岭的小径。他并非失败，而是领悟到世俗的圆满已无法满足灵魂的渴望。",
  "reversedMeaning": "明明知道某段关系或状态已经毫无滋养，却因惧怕孤独或未知而迟迟无法迈出离别的脚步。",
  "loveMeaning": "正位代表平静地离开一段食之无味弃之可惜的感情；逆位提醒勇敢做出对彼此负责的抉择。",
  "careerMeaning": "正位预示离开舒适圈去追寻更具精神价值的事业；逆位警惕在鸡肋岗位空耗光阴。",
  "advice": "有时候离开才是最勇敢的进取。听从内心的召唤，去寻找能真正点亮灵魂的源泉。",
  "symbolism": "叠放整齐的圣杯代表被主动放弃的世俗成就，残月日食象征心境的深刻蜕变。",
  "visualTheme": {
    "primaryColor": "#283593",
    "accentColor": "#E8EAF6",
    "motif": "departure-moonlit-mountain"
  }
},
{
  "id": "cups_9",
  "slug": "nine-of-cups",
  "number": 9,
  "nameZh": "圣杯九",
  "nameEn": "Nine of Cups",
  "arcana": "minor",
  "suit": "cups",
  "element": "water",
  "keywords": [
    "愿望成真",
    "心满意足",
    "富足安康",
    "神谕许愿"
  ],
  "uprightKeywords": [
    "美梦成真",
    "喜上眉梢",
    "怡然自得",
    "丰盛自足"
  ],
  "reversedKeywords": [
    "贪得无厌",
    "骄奢淫逸",
    "表面风光",
    "虚幻满足"
  ],
  "uprightMeaning": "富态安详的男子双臂抱胸，身后整齐弧形陈列着九只金光闪闪的圣杯。这是塔罗中最著名的“许愿牌”，象征着愿望成真、情感富足与对生活的美好享受。",
  "reversedMeaning": "物质虽然丰厚但精神依然空虚，或是为了虚荣过度消费。",
  "loveMeaning": "正位代表沉浸在极度甜蜜与满足的情感生活；逆位警惕将伴侣当作炫耀工具。",
  "careerMeaning": "正位预示达成了梦寐以求的阶段目标并收获满满；逆位提示戒骄戒躁。",
  "advice": "感恩生活赐予你的丰饶盛宴，你的付出配得上这份从容与满足。",
  "symbolism": "蓝布背景代表宁静祥和的心态，弧形陈列象征圆融无碍的保护圈。",
  "visualTheme": {
    "primaryColor": "#0277BD",
    "accentColor": "#E1F5FE",
    "motif": "satisfied-merchant-cups"
  }
},
{
  "id": "cups_page",
  "slug": "page-of-cups",
  "number": 11,
  "nameZh": "圣杯侍从",
  "nameEn": "Page of Cups",
  "arcana": "minor",
  "suit": "cups",
  "element": "water",
  "keywords": [
    "灵感信使",
    "初尝爱意",
    "创意童真",
    "直觉萌芽"
  ],
  "uprightKeywords": [
    "浪漫心意",
    "艺术天赋",
    "温柔敏感",
    "善意交流"
  ],
  "reversedKeywords": [
    "情绪脆弱",
    "过度敏感",
    "空想幼稚",
    "玻璃心"
  ],
  "uprightMeaning": "清秀的侍从身着印有睡莲的华服站在波光粼粼的岸边，惊奇地注视着从他手中圣杯里探出头来的金色小鱼。象征着浪漫情愫的萌芽、直觉带来的艺术灵感与纯真的善意。",
  "reversedMeaning": "过于玻璃心、容易被无意之言伤害，或沉溺于白日梦无法落实行动。",
  "loveMeaning": "正位预示收到温柔动人的情书或心动信号；逆位警惕不切实际的情感寄托。",
  "careerMeaning": "正位适合从事创意写作、艺术设计或心理咨询；逆位提醒提高抗压能力。",
  "advice": "像那只从杯中探头的鱼儿一样，倾听内心的直觉之声，用柔软去拥抱世界。",
  "symbolism": "从圣杯中探头的鱼象征深层潜意识跃向意识层面的顿悟与惊喜。",
  "visualTheme": {
    "primaryColor": "#00ACC1",
    "accentColor": "#E0F7FA",
    "motif": "fish-in-cup-page"
  }
},
{
  "id": "cups_knight",
  "slug": "knight-of-cups",
  "number": 12,
  "nameZh": "圣杯骑士",
  "nameEn": "Knight of Cups",
  "arcana": "minor",
  "suit": "cups",
  "element": "water",
  "keywords": [
    "浪漫追求",
    "白马王子",
    "倾注真情",
    "理想主义"
  ],
  "uprightKeywords": [
    "深情款款",
    "诚挚邀请",
    "优雅体贴",
    "艺术才华"
  ],
  "reversedKeywords": [
    "心怀不轨",
    "花言巧语",
    "逃避现实",
    "情绪化"
  ],
  "uprightMeaning": "白马骑士手持圣杯，迈着优雅安详的步伐涉水而来。头盔与战靴饰有飞翼，象征着诗意、浪漫与高尚的求索。他是带来爱、美与深情盟约的使者。",
  "reversedMeaning": "警惕用甜言蜜语编织的虚假承诺，或者自身过于理想化导致被现实撞碎。",
  "loveMeaning": "正位象征深情体贴、充满仪式感的追求者或伴侣；逆位提醒提防情感海王。",
  "careerMeaning": "正位代表凭借人格魅力与高情商促成重要合作；逆位警惕感情用事。",
  "advice": "让爱与美成为你行动的向导，以最真诚温柔的姿态去对待每一个灵魂。",
  "symbolism": "赫尔墨斯飞翼代表诗意与神圣讯息，沉静的白马象征驯服的情绪能量。",
  "visualTheme": {
    "primaryColor": "#0288D1",
    "accentColor": "#E1F5FE",
    "motif": "winged-knight-river"
  }
},
{
  "id": "cups_queen",
  "slug": "queen-of-cups",
  "number": 13,
  "nameZh": "圣杯王后",
  "nameEn": "Queen of Cups",
  "arcana": "minor",
  "suit": "cups",
  "element": "water",
  "keywords": [
    "慈悲包容",
    "灵性觉知",
    "心灵疗愈",
    "深情守护"
  ],
  "uprightKeywords": [
    "共情力强",
    "母性光辉",
    "直觉透彻",
    "安抚人心"
  ],
  "reversedKeywords": [
    "情绪内耗",
    "过度溺爱",
    "多愁善感",
    "失去边界"
  ],
  "uprightMeaning": "王后端坐在海边由美人鱼与海贝装饰的宝座上，全神贯注凝视着手中极其华丽且带盖的圣杯。她是十二星座中水象女性特质的完美结合，拥有无与伦比的同理心与通灵直觉。",
  "reversedMeaning": "吸收了过多外界负面情绪导致心力交瘁，或是因过度依赖他人而失去自我界限。",
  "loveMeaning": "正位代表深情专一、能给予灵魂深度慰藉的理想伴侣；逆位提醒保持情感独立。",
  "careerMeaning": "正位适合做咨询师、心理疗愈师或团队润滑剂；逆位警惕情绪波动影响专业决断。",
  "advice": "你的温柔与敏锐是无可替代的天赋，守护好你的心之圣杯，在慈悲中保持清醒边界。",
  "symbolism": "带盖的圣杯代表潜意识深处不可言说的神圣秘密，海边礁石象征情绪与理性的交融。",
  "visualTheme": {
    "primaryColor": "#01579B",
    "accentColor": "#E1F5FE",
    "motif": "mermaids-chalice-throne"
  }
},
{
  "id": "swords_2",
  "slug": "two-of-swords",
  "number": 2,
  "nameZh": "宝剑二",
  "nameEn": "Two of Swords",
  "arcana": "minor",
  "suit": "swords",
  "element": "air",
  "keywords": [
    "两难僵局",
    "蒙眼静思",
    "封闭心门",
    "暂时休战"
  ],
  "uprightKeywords": [
    "内心平衡",
    "暂缓决断",
    "排除干扰",
    "防御姿态"
  ],
  "reversedKeywords": [
    "真相对决",
    "信息曝光",
    "打破僵局",
    "情绪失衡"
  ],
  "uprightMeaning": "身着灰袍的女子双目被白布蒙住，双手交叉持双剑护于胸前，背后是暗礁起伏的宁静大海。象征着面对难以抉择的两难境地时，选择屏蔽外界杂音、求得内心片刻平衡。",
  "reversedMeaning": "逃避无法解决根本矛盾，蒙眼的白布被揭开，必须直面残酷的真相做出抉择。",
  "loveMeaning": "正位提示感情进入冷战或闭门不谈的僵局；逆位建议打破沉默开诚布公。",
  "careerMeaning": "正位代表在两份方案间权衡利弊暂不表态；逆位提醒不可再拖延决策。",
  "advice": "倾听心底最沉静的声音，暂时的休战是为了积蓄看清真相的勇气。",
  "symbolism": "蒙眼白布代表排除视觉偏见，胸前交叉的双剑象征理性的绝对平衡与防御。",
  "visualTheme": {
    "primaryColor": "#455A64",
    "accentColor": "#ECEFF1",
    "motif": "blindfold-crossed-swords"
  }
},
{
  "id": "swords_3",
  "slug": "three-of-swords",
  "number": 3,
  "nameZh": "宝剑三",
  "nameEn": "Three of Swords",
  "arcana": "minor",
  "suit": "swords",
  "element": "air",
  "keywords": [
    "穿心之痛",
    "悲伤释放",
    "失恋离别",
    "痛苦启蒙"
  ],
  "uprightKeywords": [
    "心碎释怀",
    "看清现实",
    "伤口愈合",
    "精神淬炼"
  ],
  "reversedKeywords": [
    "走出痛苦",
    "宽恕释然",
    "否认创伤",
    "愈合新生"
  ],
  "uprightMeaning": "在狂风暴雨的铅灰天空下，三柄锋利的宝剑穿透了一颗鲜红的心脏。虽然痛彻心扉，但这正是看清残忍真相、割裂虚妄幻觉的必经过程。痛苦是灵魂深处的一次烈火洗礼。",
  "reversedMeaning": "最艰难的时刻已经过去，你开始学会宽恕过往的背叛与伤害，内心创口正在逐步结痂愈合。",
  "loveMeaning": "正位提示遭遇分手、背叛或言语中伤带来的剧烈心痛；逆位预示走出失恋阴霾。",
  "careerMeaning": "正位警惕合作破裂或遭遇不公排挤；逆位代表风暴过去重组阵营。",
  "advice": "不要压抑泪水，让悲伤彻底流淌。每一次心碎，都是心灵扩容成长的痕迹。",
  "symbolism": "风暴乌云代表内心的情绪风暴，锋利宝剑代表割裂执念的理性利刃。",
  "visualTheme": {
    "primaryColor": "#37474F",
    "accentColor": "#FFCDD2",
    "motif": "pierced-heart-storm"
  }
},
{
  "id": "swords_4",
  "slug": "four-of-swords",
  "number": 4,
  "nameZh": "宝剑四",
  "nameEn": "Four of Swords",
  "arcana": "minor",
  "suit": "swords",
  "element": "air",
  "keywords": [
    "休养生息",
    "静心退隐",
    "养精蓄锐",
    "疗愈沉淀"
  ],
  "uprightKeywords": [
    "暂时休整",
    "冥想祈祷",
    "远离战场",
    "重整旗鼓"
  ],
  "reversedKeywords": [
    "重返战场",
    "强行复工",
    "焦躁不安",
    "休整结束"
  ],
  "uprightMeaning": "在宁静肃穆的教堂石棺上，骑士雕像双手合十闭目长眠。墙上悬挂三把宝剑，棺身侧面横卧一把宝剑。象征着激战后的停火休整、精神静思与身心疗愈。",
  "reversedMeaning": "休整期即将结束，你正逐步积聚好能量准备重返世俗生活，或者提示不能再消极避世。",
  "loveMeaning": "正位建议给彼此一段冷静喘息的空间；逆位提示冷战结束、重新沟通。",
  "careerMeaning": "正位适合休假调养、闭关深造或暂缓新业务；逆位代表满血复活重新出征。",
  "advice": "疲惫的心灵需要静谧的庇护所。暂停不是放弃，而是为了更强劲的归来。",
  "symbolism": "彩绘玻璃上的圣人象征心灵信仰的滋养，合十的双手代表平静与臣服。",
  "visualTheme": {
    "primaryColor": "#546E7A",
    "accentColor": "#ECEFF1",
    "motif": "tomb-knight-sanctuary"
  }
},
{
  "id": "swords_5",
  "slug": "five-of-swords",
  "number": 5,
  "nameZh": "宝剑五",
  "nameEn": "Five of Swords",
  "arcana": "minor",
  "suit": "swords",
  "element": "air",
  "keywords": [
    "惨胜之局",
    "自私争端",
    "得不偿失",
    "破裂关系"
  ],
  "uprightKeywords": [
    "赢了辩论输了感情",
    "自私行径",
    "认清小人",
    "及时止损"
  ],
  "reversedKeywords": [
    "寻求和解",
    "化干戈为玉帛",
    "反思过错",
    "避免报复"
  ],
  "uprightMeaning": "青年面带讥讽的冷笑收拢战败者的三柄宝剑，另外两把落在脚下，远方失败的对手掩面离去。虽然赢了表面的争端，但却付出了尊严、人际与道义的惨重代价。",
  "reversedMeaning": "意识到执着于胜负毫无意义，愿意放下傲慢寻求各退一步的体面和解。",
  "loveMeaning": "正位警惕吵架中言辞刻薄极度伤人，赢了道理却推开了爱人；逆位提示放下心结。",
  "careerMeaning": "正位警惕职场恶性甩锅与撕破脸皮；逆位提醒修补团队裂痕。",
  "advice": "问问自己：证明自己是对的，真的比维系爱与信任更重要吗？放下无谓的好胜心。",
  "symbolism": "参差不齐的锯齿状乌云象征思维的尖刻与争吵留下的满目疮痍。",
  "visualTheme": {
    "primaryColor": "#263238",
    "accentColor": "#CFD8DC",
    "motif": "smirking-victor-battle"
  }
},
{
  "id": "swords_7",
  "slug": "seven-of-swords",
  "number": 7,
  "nameZh": "宝剑七",
  "nameEn": "Seven of Swords",
  "arcana": "minor",
  "suit": "swords",
  "element": "air",
  "keywords": [
    "暗中行事",
    "机敏策略",
    "孤军潜行",
    "避开锋芒"
  ],
  "uprightKeywords": [
    "以智取胜",
    "独辟蹊径",
    "审慎保密",
    "留有后手"
  ],
  "reversedKeywords": [
    "东窗事发",
    "弄巧成拙",
    "坦诚面对",
    "良心不安"
  ],
  "uprightMeaning": "男子踮起脚尖悄然抱走敌营帐篷外的五把宝剑，回头张望，地上还留着两把。代表在不能正面硬拼的情况下，运用谋略、保密与智慧采取非常规手段突围。",
  "reversedMeaning": "自作聪明或隐瞒真相的行为面临暴露风险，或是从不道德的诱惑中悬崖勒马。",
  "loveMeaning": "正位警惕隐瞒、欺瞒或缺乏坦诚；逆位提示坦白从宽、重建信任。",
  "careerMeaning": "正位适合秘密研发新专利、采用出奇制胜的游击商业策略；逆位警惕合规风险。",
  "advice": "兵不厌诈，但真正的智慧绝不逾越道德底线。聪明要用在解决问题上。",
  "symbolism": "踮起的脚尖象征隐秘与谨慎，留下的两柄剑暗示不可能彻底拿走所有东西。",
  "visualTheme": {
    "primaryColor": "#37474F",
    "accentColor": "#FFE082",
    "motif": "sneaking-camp-swords"
  }
},
{
  "id": "swords_8",
  "slug": "eight-of-swords",
  "number": 8,
  "nameZh": "宝剑八",
  "nameEn": "Eight of Swords",
  "arcana": "minor",
  "suit": "swords",
  "element": "air",
  "keywords": [
    "自我设限",
    "心之牢笼",
    "蒙眼受困",
    "破除幻觉"
  ],
  "uprightKeywords": [
    "思维困境",
    "受害者心态",
    "束手束脚",
    "忽视出口"
  ],
  "reversedKeywords": [
    "冲破枷锁",
    "恍然大悟",
    "重获自由",
    "迈出牢笼"
  ],
  "uprightMeaning": "红衣女子蒙着眼被松散的绳索捆绑，四周插着八柄宝剑如牢笼般将她环绕，脚下是浅浅的泥泞水洼。其实绳索并未系死，身后就是开阔的通道，困住她的并非现实，而是心中的恐惧。",
  "reversedMeaning": "终于意识到所有的限制不过是内心的思维定势，解开蒙眼布，大步走出自我设限的泥潭。",
  "loveMeaning": "正位提示在感情中感到被束缚却不敢离开；逆位代表看清自我价值勇敢重获新生。",
  "careerMeaning": "正位代表觉得自己技能不足或被环境受限；逆位提示发现全新出路。",
  "advice": "环顾四周，只要你迈开脚步，那些看似锋利的利剑根本伤不到你分毫。走出来吧！",
  "symbolism": "松垮的绳索与留有空隙的宝剑象征束缚只是思维上的幻觉。",
  "visualTheme": {
    "primaryColor": "#455A64",
    "accentColor": "#FFCDD2",
    "motif": "bound-woman-swords"
  }
},
{
  "id": "swords_9",
  "slug": "nine-of-swords",
  "number": 9,
  "nameZh": "宝剑九",
  "nameEn": "Nine of Swords",
  "arcana": "minor",
  "suit": "swords",
  "element": "air",
  "keywords": [
    "深夜惊魂",
    "焦虑自责",
    "噩梦心结",
    "破晓将至"
  ],
  "uprightKeywords": [
    "精神内耗",
    "过度担忧",
    "悔不当初",
    "释放恐慌"
  ],
  "reversedKeywords": [
    "走出阴霾",
    "直面恐惧",
    "看清夸大",
    "迎来安眠"
  ],
  "uprightMeaning": "在漆黑深邃的暗夜中，女子从床上惊起双手捂面失声痛哭，墙上整齐横悬着九柄锋利冰冷的宝剑。象征着深夜里无限放大的焦虑、内疚、自责与无法抑制的精神内耗。",
  "reversedMeaning": "意识到那些折磨你的担忧大多是自己吓唬自己，内心的阴霾散去，曙光重临。",
  "loveMeaning": "正位提示因患得患失而夜不能寐，过度解读伴侣举动；逆位建议学会自我安抚。",
  "careerMeaning": "正位代表项目压力引发严重失眠或冒充者综合征；逆位提示认清现实逐步减压。",
  "advice": "黑夜会把最微小的阴影放大十倍。把担忧写在纸上，天亮之后你会发现一切皆有出路。",
  "symbolism": "被单上的星座与玫瑰图案代表世俗欲望与精神秩序，九柄剑象征思维的反噬。",
  "visualTheme": {
    "primaryColor": "#212121",
    "accentColor": "#CFD8DC",
    "motif": "nightmare-bed-swords"
  }
},
{
  "id": "swords_10",
  "slug": "ten-of-swords",
  "number": 10,
  "nameZh": "宝剑十",
  "nameEn": "Ten of Swords",
  "arcana": "minor",
  "suit": "swords",
  "element": "air",
  "keywords": [
    "绝境触底",
    "旧环终结",
    "黎明前夜",
    "彻底重生"
  ],
  "uprightKeywords": [
    "谷底反弹",
    "无可再坏",
    "彻底解脱",
    "金光初现"
  ],
  "reversedKeywords": [
    "死灰复燃",
    "拖延告别",
    "新生萌芽",
    "伤口结痂"
  ],
  "uprightMeaning": "男子俯卧在海边黑地，背上插满了整整十柄长剑，鲜红斗篷铺展身下。看似极其惨烈，但在远方海天交界之处，金色的朝霞已经穿透阴云破晓而生。这是痛苦的终点，也是重生的起点。",
  "reversedMeaning": "已经触及人生最糟糕的低谷，最坏的事情已经发生，接下来的每一步都将是向上的攀登。",
  "loveMeaning": "正位代表一段有毒有害关系的彻底死透与终结；逆位提示彻底放下怨恨迎接新生。",
  "careerMeaning": "正位代表某个彻底失败的项目终于画上句号，解脱反而是好事；逆位代表触底反弹。",
  "advice": "既然已经身处谷底，任何方向都是向上。向死而生，太阳正在为你重新升起。",
  "symbolism": "远方的金色黎明与平静海水是本张牌真正的核心——痛苦到此为止，新生由此开启。",
  "visualTheme": {
    "primaryColor": "#1A237E",
    "accentColor": "#FFF59D",
    "motif": "dawn-horizon-swords"
  }
},
{
  "id": "swords_page",
  "slug": "page-of-swords",
  "number": 11,
  "nameZh": "宝剑侍从",
  "nameEn": "Page of Swords",
  "arcana": "minor",
  "suit": "swords",
  "element": "air",
  "keywords": [
    "敏锐机警",
    "求知探索",
    "言辞犀利",
    "警惕风吹"
  ],
  "uprightKeywords": [
    "明察秋毫",
    "逻辑清晰",
    "渴求真理",
    "机智反应"
  ],
  "reversedKeywords": [
    "口无遮拦",
    "刺探隐私",
    "冷嘲热讽",
    "心浮气躁"
  ],
  "uprightMeaning": "身姿轻盈敏捷的少年伫立在狂风呼啸的绿丘之上，双手横握利剑警惕环顾四周。头顶群鸟翻飞，疾云穿梭。他是真理与信息的机警探求者，拥有绝顶聪明的头脑。",
  "reversedMeaning": "用尖酸刻薄的言语刺伤他人，或是喜欢探听八卦隐私却缺乏真正的建设性行动。",
  "loveMeaning": "正位提示恋爱中机智幽默但稍显戒备；逆位警惕言辞伤人或互相猜忌。",
  "careerMeaning": "正位适合做市场调研、数据分析、公关调查或法务合同审查；逆位注意沟通分寸。",
  "advice": "保持对真相的好奇心与警觉性，但请记住：真正的聪明懂得适时把锋芒收敛。",
  "symbolism": "凌乱的头发与翻飞的鸟群象征思维极速运转的风元素能量。",
  "visualTheme": {
    "primaryColor": "#37474F",
    "accentColor": "#ECEFF1",
    "motif": "windy-hilltop-page"
  }
},
{
  "id": "swords_knight",
  "slug": "knight-of-swords",
  "number": 12,
  "nameZh": "宝剑骑士",
  "nameEn": "Knight of Swords",
  "arcana": "minor",
  "suit": "swords",
  "element": "air",
  "keywords": [
    "风驰电掣",
    "破风出击",
    "直截了当",
    "勇往直前"
  ],
  "uprightKeywords": [
    "锐不可当",
    "决断果敢",
    "逻辑利刃",
    "斩除阻碍"
  ],
  "reversedKeywords": [
    "盲目激进",
    "暴躁伤人",
    "不计后果",
    "树敌过多"
  ],
  "uprightMeaning": "狂风肆虐的天空下，白马嘶鸣如电狂奔，骑士高举利剑毫不退缩地冲锋在前。他的目标明确，意志坚定如钢，誓要用理性的利剑撕碎一切迷障与虚伪。",
  "reversedMeaning": "行动过于急躁莽撞，只顾自己痛快而忽视团队感受，导致得罪他人甚至功败垂成。",
  "loveMeaning": "正位提示直来直往、高效坦荡的相处模式；逆位警惕脾气火爆引发言语冲突。",
  "careerMeaning": "正位是解决技术死结、力排众议推进改革的尖刀力量；逆位提醒多顾及人情世故。",
  "advice": "乘风破浪勇往直前，但请记得在冲锋时系紧马鞍，别让急躁遮蔽了全局判断。",
  "symbolism": "被狂风吹弯的树木与撕裂的白云象征风暴般的思维冲击力。",
  "visualTheme": {
    "primaryColor": "#263238",
    "accentColor": "#ECEFF1",
    "motif": "stormy-charge-knight"
  }
},
{
  "id": "swords_king",
  "slug": "king-of-swords",
  "number": 14,
  "nameZh": "宝剑国王",
  "nameEn": "King of Swords",
  "arcana": "minor",
  "suit": "swords",
  "element": "air",
  "keywords": [
    "理性权威",
    "法度严明",
    "公正审判",
    "清醒决断"
  ],
  "uprightKeywords": [
    "智慧超然",
    "客观公正",
    "逻辑严密",
    "令人信服"
  ],
  "reversedKeywords": [
    "冷血无情",
    "专断残酷",
    "刻薄挑剔",
    "滥用智谋"
  ],
  "uprightMeaning": "沉稳威严的国王正襟危坐于高耸的石座之上，直立手持宝剑指向苍穹。宝座饰以展翅飞蝶与天使，象征着超脱尘世的纯粹理性与无懈可击的公平决断力。",
  "reversedMeaning": "过于冷酷教条，完全忽视人情温度，变成只认死理、难以沟通的暴君。",
  "loveMeaning": "正位象征心智成熟、沟通理性透明的高质量伴侣；逆位提示过于理智缺乏温存。",
  "careerMeaning": "正位是顶尖法官、首席架构师、资深顾问或战略决断者；逆位提醒兼顾人文关怀。",
  "advice": "坚持你心中的正义与法则，用清醒的头脑做出最客观的判断，公道自在人心。",
  "symbolism": "蝴蝶纹样象征灵魂与思想的蜕变，垂直的长剑代表绝对不偏不倚的正义。",
  "visualTheme": {
    "primaryColor": "#1A237E",
    "accentColor": "#E8EAF6",
    "motif": "butterfly-throne-justice"
  }
},
{
  "id": "pentacles_2",
  "slug": "two-of-pentacles",
  "number": 2,
  "nameZh": "星币二",
  "nameEn": "Two of Pentacles",
  "arcana": "minor",
  "suit": "pentacles",
  "element": "earth",
  "keywords": [
    "多核平衡",
    "灵活周转",
    "游刃有余",
    "波浪起伏"
  ],
  "uprightKeywords": [
    "杂耍平衡",
    "适应变迁",
    "资金流动",
    "身兼数职"
  ],
  "reversedKeywords": [
    "失衡崩盘",
    "拆东墙补西墙",
    "心力憔悴",
    "财务危机"
  ],
  "uprightMeaning": "头戴高帽的杂耍艺人双手轻盈地转动着两枚被无限莫比乌斯环相连的星币，身后汹涌波涛中的帆船随着浪花起伏起伏。象征着在多变的环境中游刃有余地协调时间、精力与财务。",
  "reversedMeaning": "兼顾的事情太多超出承载上限，稍有不慎便可能失衡崩盘；财务周转出现严重短缺。",
  "loveMeaning": "正位代表在工作与恋爱间找到平衡点；逆位警惕因琐事过多而冷落爱人。",
  "careerMeaning": "正位是跨界运营、多项目并进且处理得当；逆位提示必须做减法，断舍离。",
  "advice": "保持身段的柔韧与幽默感，生活就像冲浪，随波起伏方能立于不败之地。",
  "symbolism": "绿色无限符号代表宇宙能量与物质的永续循环，起伏海浪象征经济与时运的周期。",
  "visualTheme": {
    "primaryColor": "#2E7D32",
    "accentColor": "#E8F5E9",
    "motif": "infinity-juggler"
  }
},
{
  "id": "pentacles_4",
  "slug": "four-of-pentacles",
  "number": 4,
  "nameZh": "星币四",
  "nameEn": "Four of Pentacles",
  "arcana": "minor",
  "suit": "pentacles",
  "element": "earth",
  "keywords": [
    "保守守财",
    "紧握不放",
    "安全防线",
    "缺乏流动"
  ],
  "uprightKeywords": [
    "巩固资产",
    "财务防御",
    "界限分明",
    "防范风险"
  ],
  "reversedKeywords": [
    "挥霍松绑",
    "过度吝啬",
    "失去控制",
    "学会布施"
  ],
  "uprightMeaning": "男子头顶星币、双手紧紧环抱星币、双脚死死踩着两枚星币，端坐在城市郊外。他建立起了坚不可摧的物质安全壁垒，却也因为过度惧怕失去而把自己变成了金钱的囚徒。",
  "reversedMeaning": "开始意识到钱财生不带来死不带去，愿意适度放手消费或投资；逆位也可能提示防线失守导致财务破损。",
  "loveMeaning": "正位提示情感占有欲过强、控制欲泛滥；逆位建议给予对方自由呼吸的空间。",
  "careerMeaning": "正位代表保守稳健守住现有战果；逆位提示过度保守将错失时代新红利。",
  "advice": "适度的积蓄是底气，但流水不腐，适时地分享与流通才能带来更大的丰盛。",
  "symbolism": "四枚星币全方位包裹身体，阻断了手脚与头脑的活动，象征被资产反向束缚。",
  "visualTheme": {
    "primaryColor": "#1B5E20",
    "accentColor": "#E8F5E9",
    "motif": "clutching-hoarder"
  }
},
{
  "id": "pentacles_5",
  "slug": "five-of-pentacles",
  "number": 5,
  "nameZh": "星币五",
  "nameEn": "Five of Pentacles",
  "arcana": "minor",
  "suit": "pentacles",
  "element": "earth",
  "keywords": [
    "风雪落难",
    "物资匮乏",
    "相濡以沫",
    "避难庇护"
  ],
  "uprightKeywords": [
    "逆境相守",
    "精神迷茫",
    "忽视救助",
    "熬过寒冬"
  ],
  "reversedKeywords": [
    "走出寒冬",
    "迎来援助",
    "重见光明",
    "健康复苏"
  ],
  "uprightMeaning": "漫天暴雪中，两位衣衫褴褛的旅人相互扶持蹒跚而行。然而，就在他们身旁高处，教堂华丽的彩绘玻璃窗正散发着温暖明亮的金光。象征物质或精神上的艰难时刻，以及不要忽视身边的救助通道。",
  "reversedMeaning": "最严酷的寒冬正在过去，你终于注意到了那扇温暖的求助之门，外界的资助与温暖正在涌入。",
  "loveMeaning": "正位提示患难见真情，相濡以沫共度难关；逆位代表经济好转，生活重归安稳。",
  "careerMeaning": "正位预示面临资金链吃紧或被裁员失业；逆位代表找到新出路或获得贵人相助。",
  "advice": "抬头看一看，避风港就在咫尺之遥。放下面子主动求助，宇宙总在暗中照应着你。",
  "symbolism": "教堂彩绘玻璃上的五枚星币象征神圣温暖的庇护，雪地双脚代表现实沉重的考验。",
  "visualTheme": {
    "primaryColor": "#263238",
    "accentColor": "#FFFDE7",
    "motif": "snowstorm-stained-glass"
  }
},
{
  "id": "pentacles_6",
  "slug": "six-of-pentacles",
  "number": 6,
  "nameZh": "星币六",
  "nameEn": "Six of Pentacles",
  "arcana": "minor",
  "suit": "pentacles",
  "element": "earth",
  "keywords": [
    "慷慨布施",
    "公平分配",
    "善意流转",
    "知恩图报"
  ],
  "uprightKeywords": [
    "资助扶持",
    "按劳分配",
    "慈善回馈",
    "受人恩惠"
  ],
  "reversedKeywords": [
    "附带条件",
    "不公施舍",
    "债台高筑",
    "自视甚高"
  ],
  "uprightMeaning": "身着华服的富商一手托着精准的天平，另一手将金币慷慨地分发给跪在脚下的求助者。象征着资源的公平调配、慷慨的慈善回馈以及在财富与感恩中的良性互动循环。",
  "reversedMeaning": "施舍带有高高在上的道德优越感，或是陷入不平等债务关系。警惕表面善意背后的控制欲。",
  "loveMeaning": "正位代表感情中双方付出与回报平衡健康；逆位提示一方在经济或情感上过度依附。",
  "careerMeaning": "正位预示获得奖金加薪、风险投资或遇到慷慨的前辈扶持；逆位注意报酬不公。",
  "advice": "施与受本是一体两面。富足时慷慨给予，匮乏时谦逊受助，财富方能生生不息。",
  "symbolism": "天平代表理性的度量与公正，金币的滑落象征物质财富在社会中的自然流动。",
  "visualTheme": {
    "primaryColor": "#388E3C",
    "accentColor": "#E8F5E9",
    "motif": "merchant-scales-charity"
  }
},
{
  "id": "pentacles_7",
  "slug": "seven-of-pentacles",
  "number": 7,
  "nameZh": "星币七",
  "nameEn": "Seven of Pentacles",
  "arcana": "minor",
  "suit": "pentacles",
  "element": "earth",
  "keywords": [
    "耐心守候",
    "评估成果",
    "长远投资",
    "静待成熟"
  ],
  "uprightKeywords": [
    "耕耘积淀",
    "审视回报",
    "战略停顿",
    "静待花开"
  ],
  "reversedKeywords": [
    "急于求成",
    "半途而废",
    "投资失误",
    "缺乏耐心"
  ],
  "uprightMeaning": "农夫倚着锄头驻足凝望藤蔓上结出的七枚硕大星币。经过漫长的辛勤劳作，果实初具规模。他在反思评估这一阶段的投入产出比，耐心等待最终成熟的最佳收割时机。",
  "reversedMeaning": "因过于急躁在果实尚未成熟时便强行采摘，或是发现长期投入的方向产出甚微。",
  "loveMeaning": "正位提示感情进入深耕期，需要耐心陪伴与经营；逆位警惕因看不到即时结果而抱怨。",
  "careerMeaning": "正位代表中长期战略投资成效初显，进行阶段性复盘；逆位警惕沉没成本过高。",
  "advice": "任何有价值的事物都需要时间的酿造。少一分焦躁，多一分笃定，丰收不会缺席。",
  "symbolism": "茂盛的葡萄藤蔓象征持续成长的财富，脚踏实地的姿态代表耕耘者的从容。",
  "visualTheme": {
    "primaryColor": "#2E7D32",
    "accentColor": "#E8F5E9",
    "motif": "gardener-vine-pentacles"
  }
},
{
  "id": "pentacles_8",
  "slug": "eight-of-pentacles",
  "number": 8,
  "nameZh": "星币八",
  "nameEn": "Eight of Pentacles",
  "arcana": "minor",
  "suit": "pentacles",
  "element": "earth",
  "keywords": [
    "匠人精神",
    "精益求精",
    "沉潜钻研",
    "打磨技艺"
  ],
  "uprightKeywords": [
    "专心致志",
    "熟能生巧",
    "深耕细作",
    "专业进阶"
  ],
  "reversedKeywords": [
    "粗制滥造",
    "急功近利",
    "缺乏工匠心",
    "枯燥重复"
  ],
  "uprightMeaning": "石匠坐在木凳上，心无旁骛地用锤凿精心雕刻每一枚星币。六枚已完成的星币整齐挂在立柱上，一枚在脚边，手头正精雕细琢第八枚。象征纯粹的专注、技能打磨与工匠精神。",
  "reversedMeaning": "工作流于机械重复敷衍了事，缺乏提升的热情，或是盲目求快牺牲了质量。",
  "loveMeaning": "正位代表脚踏实地共同经营生活的点点滴滴；逆位提示将感情视为理所当然缺乏用心。",
  "careerMeaning": "正位是进修专业技能、打造核心竞争力的巅峰阶段；逆位提醒警惕无效努力。",
  "advice": "沉下心来，把一件事做到极致。时间会奖赏那些在无人注视处依然全力以赴的匠人。",
  "symbolism": "远方的城镇被置于身后，象征暂时屏蔽外界纷扰，全神贯注于眼前手艺。",
  "visualTheme": {
    "primaryColor": "#1B5E20",
    "accentColor": "#E8F5E9",
    "motif": "craftsman-carving-bench"
  }
},
{
  "id": "pentacles_9",
  "slug": "nine-of-pentacles",
  "number": 9,
  "nameZh": "星币九",
  "nameEn": "Nine of Pentacles",
  "arcana": "minor",
  "suit": "pentacles",
  "element": "earth",
  "keywords": [
    "优雅富足",
    "独立自强",
    "庄园静谧",
    "自给自足"
  ],
  "uprightKeywords": [
    "财务自由",
    "品位高雅",
    "独享安宁",
    "硕果累累"
  ],
  "reversedKeywords": [
    "表面光鲜",
    "金丝雀牢笼",
    "孤芳自赏",
    "财务依赖"
  ],
  "uprightMeaning": "身穿华丽黄袍的高贵女士漫步在葡萄累累的私人庄园中，左手戴着皮手套架着一只温顺的猎鹰。她凭借自己的智慧与自律实现了财务自由与心灵从容，享受着独立优雅的品质生活。",
  "reversedMeaning": "虽然外表光鲜亮丽但内心深感孤独，或是依赖他人的物质供给而失去了自我主权。",
  "loveMeaning": "正位代表享受自立自强的单身时光或以平等独立之姿相爱；逆位警惕为了物质妥协感情。",
  "careerMeaning": "正位象征成功的女企业家、独立投资者或自由职业大获成功；逆位提醒防范财务漏洞。",
  "advice": "你有足够的能力照顾好自己并过上体面的生活。珍惜这份由内而外的从容与底气。",
  "symbolism": "蒙眼的猎鹰象征被完全驯化与节制的野性欲望，蜗牛代表踏实持久的成长轨迹。",
  "visualTheme": {
    "primaryColor": "#F9A825",
    "accentColor": "#FFFDE7",
    "motif": "falcon-vineyard-lady"
  }
},
{
  "id": "pentacles_page",
  "slug": "page-of-pentacles",
  "number": 11,
  "nameZh": "星币侍从",
  "nameEn": "Page of Pentacles",
  "arcana": "minor",
  "suit": "pentacles",
  "element": "earth",
  "keywords": [
    "笃学求真",
    "踏实起步",
    "专注务实",
    "商业萌芽"
  ],
  "uprightKeywords": [
    "好学深思",
    "立足现实",
    "学业有成",
    "播下种子"
  ],
  "reversedKeywords": [
    "缺乏规划",
    "怠惰散漫",
    "眼高手低",
    "错失商机"
  ],
  "uprightMeaning": "青年伫立在肥沃开阔的草地上，双手托举着一枚金光四射的星币，目光专注而充满敬畏。象征着潜心求学、稳扎稳打的起步阶段，以及即将破土而出的丰盛种子。",
  "reversedMeaning": "沉迷于幻想缺乏行动力，学习或工作态度散漫，无法将想法付诸实际。",
  "loveMeaning": "正位预示一段稳定踏实、奔着长久未来而去的认真感情；逆位提示缺乏实际物质基础。",
  "careerMeaning": "正位代表考取重要职业资格、开启全新学徒/实习阶段；逆位提醒脚踏实地。",
  "advice": "珍惜每一个从零开始的契机。像呵护幼苗一样呵护你的技能，它将长成参天大树。",
  "symbolism": "身后盛开的树林与耕耘好的田埂象征等待知识浇灌的沃土。",
  "visualTheme": {
    "primaryColor": "#2E7D32",
    "accentColor": "#E8F5E9",
    "motif": "gazing-coin-scholar"
  }
},
{
  "id": "pentacles_knight",
  "slug": "knight-of-pentacles",
  "number": 12,
  "nameZh": "星币骑士",
  "nameEn": "Knight of Pentacles",
  "arcana": "minor",
  "suit": "pentacles",
  "element": "earth",
  "keywords": [
    "坚韧执着",
    "责任如山",
    "按部就班",
    "使命必达"
  ],
  "uprightKeywords": [
    "稳健可靠",
    "一丝不苟",
    "持之以恒",
    "值得信赖"
  ],
  "reversedKeywords": [
    "墨守成规",
    "固执死板",
    "枯燥乏味",
    "效率低下"
  ],
  "uprightMeaning": "身披厚重战甲的骑士端坐在一匹沉静矫健的黑马上，手捧金币凝视着眼前辽阔平整的沃野。不同于其他三位飞驰的骑士，他稳如磐石，是最值得信赖、最踏实的守护者与耕耘者。",
  "reversedMeaning": "过于死板教条不知变通，或是工作生活过于单调乏味，缺乏应有的生机与活力。",
  "loveMeaning": "正位代表忠诚如一、务实可靠能托付终身的优质伴侣；逆位提示稍显无趣缺乏情调。",
  "careerMeaning": "正位预示项目稳步推进，是团队中最让人安心的定海神针；逆位提醒提高创新意识。",
  "advice": "天下难事必作于易，天下大事必作于细。以滴水穿石的耐心，稳扎稳打走好每一步。",
  "symbolism": "黑色的重型挽马与翻耕整齐的土地象征深厚的大地力量与无尽的耐力。",
  "visualTheme": {
    "primaryColor": "#1B5E20",
    "accentColor": "#E8F5E9",
    "motif": "steady-knight-plowed-field"
  }
},
{
  "id": "pentacles_queen",
  "slug": "queen-of-pentacles",
  "number": 13,
  "nameZh": "星币王后",
  "nameEn": "Queen of Pentacles",
  "arcana": "minor",
  "suit": "pentacles",
  "element": "earth",
  "keywords": [
    "大地之母",
    "丰盛繁荣",
    "温暖滋养",
    "持家有道"
  ],
  "uprightKeywords": [
    "母爱如海",
    "富足慷慨",
    "热爱生活",
    "现实智者"
  ],
  "reversedKeywords": [
    "焦虑占有",
    "挥霍无度",
    "过度操劳",
    "精神匮乏"
  ],
  "uprightMeaning": "慈爱的王后身穿红白华服，端坐在刻满天使、山羊与果实的繁花宝座上，双膝温柔环抱着一枚巨大的金币。她是世俗生活智慧与母性滋养的巅峰化身，让身边所有生命都如沐春风。",
  "reversedMeaning": "过度操心家人导致心力交瘁，或是因过度追求物质排场而陷入财务失衡。",
  "loveMeaning": "正位代表温暖体贴、能将生活打理得井井有条的理想伴侣；逆位提醒学会先关爱自己。",
  "careerMeaning": "正位适合担任人力资源高管、财务总监或社区领袖；逆位警惕事无巨细的微观管理。",
  "advice": "用你温暖的双手去滋养身边的人与事物。生活的美好不在别处，就在这一茶一饭的温存里。",
  "symbolism": "身旁奔跑的野兔象征充沛的生育力与生机，繁花拱门代表大自然的无私馈赠。",
  "visualTheme": {
    "primaryColor": "#2E7D32",
    "accentColor": "#FFF8E1",
    "motif": "rabbit-cherub-throne"
  }
}
];

// 22 张大阿卡纳 Slug 集合（用于路径计算）
export const MAJOR_ARCANA_SLUGS = new Set([
  'the-fool', 'the-magician', 'the-high-priestess', 'the-empress', 'the-emperor',
  'the-hierophant', 'the-lovers', 'the-chariot', 'strength', 'the-hermit',
  'wheel-of-fortune', 'justice', 'the-hanged-man', 'death', 'temperance',
  'the-devil', 'the-tower', 'the-star', 'the-moon', 'the-sun', 'judgement', 'the-world'
]);

// 获取卡牌的高清真实图片路径 (支持 webp 优化格式与 png 原图格式)
export function getCardImageUrl(cardOrSlug: TarotCardData | string, format: 'webp' | 'png' = 'webp'): string {
  const slug = typeof cardOrSlug === 'string' ? cardOrSlug : cardOrSlug.slug;
  const dir = MAJOR_ARCANA_SLUGS.has(slug) ? 'major-arcana' : 'minor-arcana';
  return '/cards/' + dir + '/' + slug + '.' + format;
}

// 辅助检索方法
export function getCardById(id: string): TarotCardData | undefined {
  return TAROT_DECK.find(c => c.id === id);
}

export function getCardBySlug(slug: string): TarotCardData | undefined {
  return TAROT_DECK.find(c => c.slug === slug);
}

export function getAllCards(): TarotCardData[] {
  return TAROT_DECK;
}

export function getMajorArcana(): TarotCardData[] {
  return TAROT_DECK.filter(c => c.arcana === 'major');
}

export function getMinorArcana(suit?: TarotSuit): TarotCardData[] {
  return TAROT_DECK.filter(c => c.arcana === 'minor' && (!suit || c.suit === suit));
}

// 抽取卡牌逻辑
export function drawRandomCards(count: number, allowReversed = true): { card: TarotCardData; isReversed: boolean }[] {
  const shuffled = [...TAROT_DECK].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);
  return selected.map(card => ({
    card,
    isReversed: allowReversed ? Math.random() < 0.35 : false // 35% 几率逆位
  }));
}
