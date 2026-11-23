import type { PrincipleEntry } from './types';

/**
 * 《京氏易传》（西汉·京房 撰）
 * 文献体裁模式：【模式 C·宇宙原理型】
 * 核心范畴：五行机理与亢害承制、干支冲合会刑根本成因、四时旺相与长生墓绝界定
 * 地位：汉代象数纳甲与天道物理模型鼻祖元典
 */

export const JINGSHI_WUXING_CHENGZHI: PrincipleEntry[] = [
  {
    id: 'jsyc.wuxing.01',
    title: '纯阳用九与阳极阴生之天道消息',
    category: 'wuxing-chengzhi',
    categoryNameZh: '五行机理与亢害承制',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "乾为天，纯阳用事，象配天而属金。纯阳之体，至健不息，然“阳极则阴来，阴消则阳长，衰则退，盛则战”。“建子起潜龙，建巳至极”，四月阳极于巳，亢龙有悔，龙战于野，阴气萌发而内潜，降为姤卦。天道不许纯极，亢极必变，造化循环。",
    practicalGuidance: "在推断卦爻旺衰时，逢纯阳、极旺之爻（如临官、帝旺至极），不可作纯吉推，必防其物极必反、阴煞潜伏之祸；凡事过满则溢，吉凶转化在极亢之处。",
    keywords: ["纯阳", "用九", "阳极阴生", "亢龙有悔", "帝旺至极"]
  },
  {
    id: 'jsyc.wuxing.02',
    title: '天地水火互为性命承制',
    category: 'wuxing-chengzhi',
    categoryNameZh: '五行机理与亢害承制',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "“乾坤者，阴阳之根本；坎离者，阴阳之性命”。“乾分甲壬，坤分乙癸”，乾坤定位以立天地骨架；坎水润下而性阴，离火炎上而命阳，二气相交，水火互济，万物生生不息。坎离不交则天地闭塞，水火既济则阴阳配适。",
    practicalGuidance: "凡立盘推演生克，以天地父母为根基，以水火财官为运动枢机；水遇火则蒸腾成气，火遇水则敛威归正，五行亢阳必假水柔，纯阴枯滞必赖火照。",
    keywords: ["天地水火", "坎离", "乾坤", "水火既济", "性命承制"]
  },
  {
    id: 'jsyc.wuxing.03',
    title: '水木相资与雷风相薄生机',
    category: 'wuxing-chengzhi',
    categoryNameZh: '五行机理与亢害承制',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "“帝出乎震，动之主，生之本”。“水居泽上，泽能积水；木遇风行，阴阳相得”。震巽二木得坎水之润而条达，受离火之炎而显荣。“风雷交作，万物甲坼”，气机鼓动方能冲破沉阴死寂。",
    practicalGuidance: "在卦象生克中，木气受困非水不生，然水多则泛滥木浮；木遇金虽受伐，得火反铸金为器，谓之木赖水生、金因火克而解木厄。",
    keywords: ["水木相资", "雷风相薄", "震巽", "相资"]
  },
  {
    id: 'jsyc.wuxing.04',
    title: '土居中央并兼四序之调停',
    category: 'wuxing-chengzhi',
    categoryNameZh: '五行机理与亢害承制',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "“辰戌丑未，土兼于中”。金木水火分列四正，唯土不主专令而分旺于四季之末各十八日。“土入金为缓，积阳为天，积阴为地”。土为万物之母，承载阴阳，阳亢则土焦，水盛则土泥，阴阳调和则土肥而物茂。",
    practicalGuidance: "四季月令土爻用事，需细辨辰戌丑未寒湿燥热。湿土（辰丑）能润金晦火，燥土（戌未）能制水脆金，不可浑言“土必生金、土必克水”。",
    keywords: ["土居中央", "辰戌丑未", "四季土", "湿土", "燥土"]
  },
  {
    id: 'jsyc.wuxing.05',
    title: '金入木乡居宝，火来相敌为官',
    category: 'wuxing-chengzhi',
    categoryNameZh: '五行机理与亢害承制',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "京房以乾宫金体为例：“水配位为福德，木入金乡居宝贝，土临内象为父母，火来四上嫌相敌，金入金乡木渐微”。金克木，木为财帛（宝贝）；火克金，火为刑官（相敌）；土生金，土为父母文书；金生水，水为子孙福德。",
    practicalGuidance: "此乃纳甲六亲生克之哲学始祖原型。克我者官鬼，受官鬼克伐必内耗其体；我克者妻财，财非自得，乃元气克制所获；生我者护身，我生者泄秀。",
    keywords: ["六亲原型", "妻财", "官鬼", "父母", "子孙", "金入木乡", "火来相敌"]
  },
  {
    id: 'jsyc.wuxing.06',
    title: '游魂大过反本归魂之变易',
    category: 'wuxing-chengzhi',
    categoryNameZh: '五行机理与亢害承制',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "“精气为物，游魂为变，是故知鬼神之情状”。“至极则反，与巽为终，退复于本。故曰游魂，反归于本，曰归魂”。阳荡阴至五世卦，阴气已剥尽阳气，然“天地之道不可终穷”，遂于第四爻折返变化，为游魂；至归魂内象复见本宫，死而不亡，归根复命。",
    practicalGuidance: "凡卦逢游魂，气运游荡未定，人神不安，事多迁徙翻覆；逢归魂，气机内聚，复归本根，事得结局，流散必聚。",
    keywords: ["游魂", "归魂", "八宫卦变", "反本归根", "神魂不安"]
  },
  {
    id: 'jsyc.wuxing.07',
    title: '阴阳消铄与剥极复来之承制',
    category: 'wuxing-chengzhi',
    categoryNameZh: '五行机理与亢害承制',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "“山附于地，剥。柔长刚减，天地盈虚”。“七日来复，天行也。六阳涉六阴反下，七爻在初”。剥卦上九孤阳在上，硕果不食；一入坤纯阴，阴极则阳战，初爻一阳旋即自地底潜生，此即天地“剥极必复”之生机承制，无一刻断绝。",
    practicalGuidance: "在判断绝境与凶运时，若逢剥复消长之交，虽满盘沉阴，初爻一阳已动，断不可言必死，乃“绝处逢生、否极泰来”之先兆。",
    keywords: ["剥极必复", "消长", "一阳来复", "绝处逢生"]
  },
  {
    id: 'jsyc.wuxing.08',
    title: '重刚履险与习坎之克柔',
    category: 'wuxing-chengzhi',
    categoryNameZh: '五行机理与亢害承制',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "“坎，陷也。积阴以阳处中，柔顺不能履重刚之险，故以刚克柔而履险”。坎卦二阴夹一阳，阳陷于阴溺之中，唯阳刚中正能克其险难，故君子以砥砺德行，习坎履险。",
    practicalGuidance: "险难之中必赖骨力刚健，若爻逢阴柔居中，必受困沦溺；得刚爻居二五之位，虽在险难，终能以智刚拔险而出。",
    keywords: ["重刚履险", "习坎", "险难", "刚中正"]
  },
  {
    id: 'jsyc.wuxing.09',
    title: '离明内虚与中女成物之道',
    category: 'wuxing-chengzhi',
    categoryNameZh: '五行机理与亢害承制',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "“离，丽也。本于纯阳，阴气贯中，禀于刚健，见乎文明”。“纯以阴不能干于物，纯以阳又暴于物，故取阴柔于中女，能成于物也”。火之体燥烈，若无中虚阴柔调节，则焚灭万物；阴气内涵，方成光明烛照之德。",
    practicalGuidance: "火行之用重在“文明中正”，火过盛则燥裂，需水以济之；火太弱则熄灭，需木以生之。推命论卦逢火，喜其文彩照耀，忌其焦躁暴烈。",
    keywords: ["离明内虚", "离火", "明察", "成物"]
  },
  {
    id: 'jsyc.wuxing.10',
    title: '艮止少男阳极而静之天道',
    category: 'wuxing-chengzhi',
    categoryNameZh: '五行机理与亢害承制',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "“乾分三阳为长中少，至艮为少男。本体属阳，阳极则止，反生阴象”。“艮，止也。时止则止，时行则行，动静不失其时，其道光明”。少男处三阳卦之末，阳道行至极处而止，止而后能生静，静而后能复起。",
    practicalGuidance: "艮土之性非不动也，乃知止之动。遇艮卦爻象，宜守静安分，不可妄进；凡急躁进取者遇之，反遭坚石阻断。",
    keywords: ["艮止", "阳极而静", "止其所", "安止"]
  },
  {
    id: 'jsyc.wuxing.11',
    title: '兑金悦怿与毁折相兼之机',
    category: 'wuxing-chengzhi',
    categoryNameZh: '五行机理与亢害承制',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "“积阴为泽，纯金用体，畜水凝霜，阴道同也”。兑为少女，内刚外柔，外见喜悦，内藏坚金杀气；受秋肃之气，金主裁断毁折，悦而见伤。",
    practicalGuidance: "兑卦之象，不可专作欢悦论。若逢生旺得地，为宴乐喜庆；若逢刑克冲害，即化为金刃毁折、口舌是非、谗毁剥削之兆。",
    keywords: ["兑金", "悦怿", "毁折", "口舌是非", "秋肃"]
  },
  {
    id: 'jsyc.wuxing.12',
    title: '阴阳相荡而六虚周流',
    category: 'wuxing-chengzhi',
    categoryNameZh: '五行机理与亢害承制',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "“变动不居，周流六虚，上下无常，刚柔相易，不可以为典要，唯变所适”。六爻之位虚而待变，阳居阴位则危，阴履阳位则进；吉凶不在定死之卦爻，全在二气运行之适变。",
    practicalGuidance: "断卦不可拘泥静态爻辞，必观其动静变迁；阳动入阴为化柔，阴动入阳为刚进，随四时消息以求其真位。",
    keywords: ["六虚周流", "阴阳相荡", "变动不居", "刚柔相易"]
  },
  {
    id: 'jsyc.wuxing.13',
    title: '死于位而生于时，死于时而生于位',
    category: 'wuxing-chengzhi',
    categoryNameZh: '五行机理与亢害承制',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "“阴阳死于位，生于时；死于时，生于位。进退不可诘，正盛则衰来，正衰则盛来”。爻位或居墓绝之地（死于位），若得月令节气生旺（生于时），衰而不死；爻位纵居生旺官禄（生于位），若时值休囚死废之令（死于时），旺而难发。",
    practicalGuidance: "此乃旺衰真伪辨别之最上乘心法。看盘断事，先查“时令（月建）之盛衰”，再看“位次（爻辰生克）之得失”，不可倒置。",
    keywords: ["死于位而生于时", "死于时而生于位", "时令", "位次", "月建盛衰"]
  },
  {
    id: 'jsyc.wuxing.14',
    title: '阳主贵而阴主贱之正位律',
    category: 'wuxing-chengzhi',
    categoryNameZh: '五行机理与亢害承制',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "“一三五七九阳之数，二四六八十阴之数。阳主贵，阴主贱”。“初为阳，二为阴，三为阳，四为阴，五为阳，六为阴”。奇位为阳，偶位为阴；阳居阳位、阴居阴位为得正，反之则为乘非其位、失位生灾。",
    practicalGuidance: "九五居天子尊位、六二处大夫中位，皆得正得中大吉；若九三过刚、六四乘刚，进退失据，吉凶由此而分。",
    keywords: ["阳主贵", "阴主贱", "九五", "得正", "正位律"]
  },
  {
    id: 'jsyc.wuxing.15',
    title: '子左行阳生与午右行阴起',
    category: 'wuxing-chengzhi',
    categoryNameZh: '五行机理与亢害承制',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "“阴从午，阳从子，子午分行。子左行，午右行，左右凶吉。吉凶之道，子午分时”。“建子阳生，建午阴生，二气相冲，吉凶明矣”。自子至巳六阳辰顺行左旋，万物发生；自午至亥六阴辰逆行右转，万物肃杀收敛。",
    practicalGuidance: "推运排盘，阳世阴世之顺逆、贵人生克之左转右旋，皆本于子午二分。阳生之期利于进取营谋，阴生之期宜于敛藏休养。",
    keywords: ["子左行", "午右行", "阳生", "阴起", "顺逆"]
  },
  {
    id: 'jsyc.wuxing.16',
    title: '太岁君德至尊不可犯',
    category: 'wuxing-chengzhi',
    categoryNameZh: '五行机理与亢害承制',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "“五位为天子，太岁为地杀之主宰，诸神不敢当”。流年太岁乃岁星天行所寄，执一年万国之大权，六位升降，太岁临之则威不可当。",
    practicalGuidance: "太岁动生世爻主朝廷恩诏，动克世爻主灭顶之灾；流年吉凶，必先校对卦爻与流年太岁地支之生克冲合。",
    keywords: ["太岁", "岁星", "至尊", "君德", "流年"]
  },
  {
    id: 'jsyc.wuxing.17',
    title: '五星配卦与天体交感律',
    category: 'wuxing-chengzhi',
    categoryNameZh: '五行机理与亢害承制',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "京房以木星（岁星）、火星（荧惑）、土星（镇星）、金星（太白）、水星（太阴）轮布八宫六十四卦。如乾起镇星、姤起太白、遁起太阴、否起岁星、观起荧惑。天体五星运行与地支五行同气相求，气合则吉，气争则乱。",
    practicalGuidance: "六爻并非孤立地表符号，乃上应天星五纬之经天光伏；断卦值星度之吉凶，主发微于国家政治大运与天灾人祸。",
    keywords: ["五星配卦", "镇星", "太白", "太阴", "岁星", "荧惑"]
  },
  {
    id: 'jsyc.wuxing.18',
    title: '二十八宿度数降爻之分野',
    category: 'wuxing-chengzhi',
    categoryNameZh: '五行机理与亢害承制',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "二十八宿星宿自角至轸配入卦中爻位（如乾宫参宿入壬戌、姤卦井宿入辛丑、剥卦张宿入丙子）。星度降入六虚，划分地土分野与人神官贵之司。",
    practicalGuidance: "占地理邦国与天下异象，以宿度分野为定；星宿值日临爻逢刑破克害，其对应分野城邑必见兵戈旱涝之警。",
    keywords: ["二十八宿", "宿度降爻", "分野", "城邑"]
  },
  {
    id: 'jsyc.wuxing.19',
    title: '阳退阴伏与物候三十六、二十八之奇偶数',
    category: 'wuxing-chengzhi',
    categoryNameZh: '五行机理与亢害承制',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "京房每卦之下必注“气候分数三十六”或“分气候二十八”。三十六为四九老阳之数，二十八为四七少阳之数；纯阳老阳气盛进退敏锐，少阳少阴之气守中柔缓。",
    practicalGuidance: "数之奇偶盈缩决定事体成败之迟速。三十六数者事急如烈火，二十八数者事缓如流水，以数定刻期之远近。",
    keywords: ["物候分数", "三十六", "二十八", "老阳", "少阳"]
  },
  {
    id: 'jsyc.wuxing.20',
    title: '生生之谓易与终则有始',
    category: 'wuxing-chengzhi',
    categoryNameZh: '五行机理与亢害承制',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "“新新不停，生生相续，淡泊不失其所，确然示人。易穷则变，变则通，通则久”。六十四卦始于乾坤而终于未济，归魂复起，八宫周回，天地永无灭绝归空之理。",
    practicalGuidance: "人事断易，无永固之吉，亦无不解之凶。处于亢极必教其知退让，陷于死绝必导其觅微阳，乃汉代易学辅翼天道人伦之极致哲学。",
    keywords: ["生生之谓易", "终则有始", "周流", "极则思变"]
  },
];

export const JINGSHI_GANZHI_MECHANICS: PrincipleEntry[] = [
  {
    id: 'jsyc.ganzhi.01',
    title: '十天干分纳乾坤六子本原（纳甲成因）',
    category: 'ganzhi-mechanics',
    categoryNameZh: '干支冲合会刑根本成因',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "“分天地乾坤之象，益之以甲乙壬癸；震巽之象配庚辛；坎离之象配戊己；艮兑之象配丙丁”。乾纯阳纳甲壬（始于甲而终于壬），坤纯阴纳乙癸（始于乙而终于癸）；震长男受甲木余气配庚金，巽长女受乙木余气配辛金；坎中男得水配戊土，离中女得火配己土；艮少男配丙火，兑少女配丁火。天干配卦源于月相朔望晦弦之纳甲天文学原理。",
    practicalGuidance: "干为天元，纳干定六爻五行之清浊；干支合德者谋事顺遂，干支交战者表里相残。",
    keywords: ["纳甲", "十天干", "甲壬", "乙癸", "庚辛", "戊己", "丙丁", "月相朔望"]
  },
  {
    id: 'jsyc.ganzhi.02',
    title: '十二地支六位升降本原（纳支成因）',
    category: 'ganzhi-mechanics',
    categoryNameZh: '干支冲合会刑根本成因',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "乾阳顺轮隔位纳“子寅辰午申戌”，坤阴逆转隔位纳“未巳卯丑亥酉”。阳生于子而顺行，阴生于午（未）而逆布；坎顺纳“寅辰午申戌子”，震顺同乾，艮顺纳“辰午申戌子寅”；巽逆纳“丑亥酉未巳卯”，离逆纳“卯丑亥酉未巳”，兑逆纳“巳卯丑亥酉未”。",
    practicalGuidance: "阳顺阴逆体现天道阳刚左旋、地道阴柔右转，定一卦六位之本命中和。",
    keywords: ["纳支", "十二地支", "阳顺阴逆", "子寅辰午申戌", "未巳卯丑亥酉"]
  },
  {
    id: 'jsyc.ganzhi.03',
    title: '地支六冲本原（对宫二气交争）',
    category: 'ganzhi-mechanics',
    categoryNameZh: '干支冲合会刑根本成因',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "子午、丑未、寅申、卯酉、辰戌、巳亥六冲，源于圆周十二辰相对一百八十度之正对冲位。“二气相激，水火相敌，金木交刑”；极北寒子与极南炎午不相容，极东震木与极西兑金必交斩，此阴阳极致对立之克荡。",
    practicalGuidance: "六冲主散、主战、主破乱。测战事为刀兵交锋，测病患为元气动摇，测人事为反目绝交；唯久困忧患逢冲主灾散。",
    keywords: ["六冲", "相冲", "对冲", "子午冲", "丑未冲", "寅申冲", "卯酉冲", "辰戌冲", "巳亥冲"]
  },
  {
    id: 'jsyc.ganzhi.04',
    title: '地支六合本原（日月会次与阴阳配偶）',
    category: 'ganzhi-mechanics',
    categoryNameZh: '干支冲合会刑根本成因',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "子与丑合、寅与亥合、卯与戌合、辰与酉合、巳与申合、午与未合。源于北斗斗柄所指与太阳缠次之黄道赤道交会，亦阴阳男女各得其匹之象（一阳配一阴，子阳水配丑阴土，寅阳木配亥阴水等）。",
    practicalGuidance: "六合主聚、主成、主留连。测婚配为百年偕老，测交易为立契成交；然久病逢合主沉疴难除，行路逢合主羁绊中途。",
    keywords: ["六合", "相合", "子丑合", "寅亥合", "卯戌合", "辰酉合", "巳申合", "午未合"]
  },
  {
    id: 'jsyc.ganzhi.05',
    title: '地支三合局本原（五行长生帝旺墓库会聚）',
    category: 'ganzhi-mechanics',
    categoryNameZh: '干支冲合会刑根本成因',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "申子辰合水局、亥卯未合木局、寅午戌合火局、巳酉丑合金局。“寅中有生火，戌中有死火；申中有生水，辰中有死水”。长生（始发）、帝旺（极盛）、墓库（收藏）三者鼎足而立，气机循环周流，汇聚为一气真纯大局。",
    practicalGuidance: "三合局成，气势磅礴，众力齐归；占功名群贤辅翼，占诉讼合伙罗织，占病患则重煞结聚难散。",
    keywords: ["三合局", "申子辰", "亥卯未", "寅午戌", "巳酉丑", "长生帝旺墓库"]
  },
  {
    id: 'jsyc.ganzhi.06',
    title: '寅巳申三刑之生杀反噬（无恩之刑）',
    category: 'ganzhi-mechanics',
    categoryNameZh: '干支冲合会刑根本成因',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "寅中有长生之火，巳中有长生之金，申中有长生之水。寅木恃生火之盛而刑巳，巳火恃长生之金而刑申，申金恃长生之水而反刑寅木；各恃己能，反恩为仇，故名无恩之刑。",
    practicalGuidance: "主骨肉相残、以怨报德、官讼刑宪、流血破相；临世应必防心腹知交翻面下石。",
    keywords: ["三刑", "相刑", "寅巳申", "无恩之刑", "生杀反噬"]
  },
  {
    id: 'jsyc.ganzhi.07',
    title: '丑戌未三刑之重土相亢（恃势之刑）',
    category: 'ganzhi-mechanics',
    categoryNameZh: '干支冲合会刑根本成因',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "丑中有辛金墓气，戌中有丁火墓气，未中有乙木墓气。丑恃旺水之余威而刑戌中之火，戌恃燥火之强而刑未中之木，未恃旺木之势而刑丑中之金；三土重叠亢极，土实必崩，故名恃势之刑。",
    practicalGuidance: "主田土争竞、文书欺诈、尊卑失序、脾胃脓血之疾；多因争权夺利起衅。",
    keywords: ["三刑", "相刑", "丑戌未", "恃势之刑", "重土相亢"]
  },
  {
    id: 'jsyc.ganzhi.08',
    title: '子卯相刑之水木反伦（无礼之刑）',
    category: 'ganzhi-mechanics',
    categoryNameZh: '干支冲合会刑根本成因',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "子为玄阴之纯水，卯为震春之生木。水本生木，子水以母自居，而卯木贪春盛反不纳水，子水旺多浸寒其木，母子失和，男女宣淫无度，故称无礼之刑。",
    practicalGuidance: "主人伦不睦、色情风波、婚变暖昧、上凌下逼；占妇人见之尤为不贞。",
    keywords: ["相刑", "子卯相刑", "子卯刑", "无礼之刑", "水木反伦"]
  },
  {
    id: 'jsyc.ganzhi.09',
    title: '辰午酉亥自刑之各专自戕',
    category: 'ganzhi-mechanics',
    categoryNameZh: '干支冲合会刑根本成因',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "辰者土之渊，午者火之极，酉者金之锐，亥者水之宗。四支各居本气专旺极盛之所，极则不逊，物盛必自蠹，非外力加之，乃自身精气亢盈导致的自戕自绝。",
    practicalGuidance: "主自寻烦恼、自作自受、服毒自缢、抑郁成狂；临官鬼动克自身者必因己过招刑。",
    keywords: ["自刑", "辰辰", "午午", "酉酉", "亥亥", "辰午酉亥"]
  },
  {
    id: 'jsyc.ganzhi.10',
    title: '六害（穿害）之冲合相争本原',
    category: 'ganzhi-mechanics',
    categoryNameZh: '干支冲合会刑根本成因',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "子未相害、丑午相害、寅巳相害、卯辰相害、申亥相害、酉戌相害。害生于合处被冲；如子与丑合，未冲丑则害及子水；午与未合，丑冲未则害及午火。嫉妬其合而横插一脚，暗下穿心之刀，故名为害。",
    practicalGuidance: "“六害见之，骨肉情疏，夫妻反目，亲眷成仇”。主暗中构陷、潜伏暗疾、中途坏事，最难防范。",
    keywords: ["六害", "穿害", "子未害", "丑午害", "寅巳害", "卯辰害", "申亥害", "酉戌害"]
  },
  {
    id: 'jsyc.ganzhi.11',
    title: '世应立盘与君臣位次',
    category: 'ganzhi-mechanics',
    categoryNameZh: '干支冲合会刑根本成因',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "“八卦之首世六当，以下初爻轮上扬；游魂八卦四爻立，归魂八卦三爻详”。“为一卦之主者谓之世，奇偶相与据一以起二为主之相者谓之应”。世为自己、为国君；应为他人、为敌国、为臣僚。",
    practicalGuidance: "世应生合则宾主欢洽，世应相克则敌意深重；世克应我胜，应克世彼赢。",
    keywords: ["世应", "世爻", "应爻", "立盘", "君臣"]
  },
  {
    id: 'jsyc.ganzhi.12',
    title: '飞伏相生相克之幽明互备',
    category: 'ganzhi-mechanics',
    categoryNameZh: '干支冲合会刑根本成因',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "“世之所位而阴阳之肆者谓之飞，阴阳肇乎所配终不脱乎本谓之伏”。飞为卦上所现六爻（显于阳），伏为本宫卦底所潜之爻（隐于阴）。“伏克飞神为出暴，飞来克伏反伤身；伏去生飞名泄气，飞来生伏得长生”。",
    practicalGuidance: "飞凶得伏吉可救，飞吉逢伏凶暗藏危机；测隐事、盗贼、潜伏之疾专察伏神。",
    keywords: ["飞伏", "飞神", "伏神", "幽明", "伏克飞", "飞生伏"]
  },
  {
    id: 'jsyc.ganzhi.13',
    title: '建月积算起宫法则',
    category: 'ganzhi-mechanics',
    categoryNameZh: '干支冲合会刑根本成因',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "“起乎世而周乎内外，参乎本数以纪月者谓之建；终之始之，极乎数而不可穷以纪日者谓之积”。每卦各分建月与积算日度，如乾起己巳火至戊辰土，周而复始。干支在时空流转中分配六位。",
    practicalGuidance: "以建日积算定发祸应期之月日時辰，毫厘不爽。",
    keywords: ["建月", "积算", "起宫", "应期"]
  },
  {
    id: 'jsyc.ganzhi.14',
    title: '本宫与他宫内外界定',
    category: 'ganzhi-mechanics',
    categoryNameZh: '干支冲合会刑根本成因',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "每宫首卦为纯宫，其余变卦为旁宫。卦之内外两象，内为我、为近、为国内；外为他、为远、为夷狄。",
    practicalGuidance: "内克外进取大成，外克内防外侮破国；本宫旺相国家强盛，本宫休囚宗社衰落。",
    keywords: ["本宫", "他宫", "内外卦", "内外界定"]
  },
  {
    id: 'jsyc.ganzhi.15',
    title: '暗动之日辰相激',
    category: 'ganzhi-mechanics',
    categoryNameZh: '干支冲合会刑根本成因',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "“爻虽安静，见冲则为暗动；动爻遇冲则散，空亡遇冲则不空”。静爻若得月令日辰旺相之气，逢日辰对冲，如沉钟受撞，发响动发，谓之暗动。",
    practicalGuidance: "暗动者其发隐秘，人不知其由；吉则暗受横财庇佑，凶则背地遭人毒算。",
    keywords: ["暗动", "日辰相激", "冲起静爻"]
  },
  {
    id: 'jsyc.ganzhi.16',
    title: '旬空假真空亡之气绝',
    category: 'ganzhi-mechanics',
    categoryNameZh: '干支冲合会刑根本成因',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "十天干配十二地支，六十甲子每一旬必余两地支无天干相配，名曰旬空。虚无之位，天道气脱。",
    practicalGuidance: "休囚无气而空为真空，到底成空；有气逢动逢冲为假空，出空即有用。避凶者入空获吉，求名求财者落空一事无成。",
    keywords: ["旬空", "空亡", "真空", "假空", "避凶而空"]
  },
  {
    id: 'jsyc.ganzhi.17',
    title: '动变交争之终局归宿',
    category: 'ganzhi-mechanics',
    categoryNameZh: '干支冲合会刑根本成因',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "“静为悔，发为贞；贞为本，悔为末”。“动爻为事之始基，变爻为归宿之终局”。一爻发动，其化出之支只能回头生克冲合本位，不可他涉。",
    practicalGuidance: "动生变克始吉终凶，动克变化始难终吉；回头克最为险恶，回头生最为宽舒。",
    keywords: ["动变", "变爻", "回头生", "回头克"]
  },
  {
    id: 'jsyc.ganzhi.18',
    title: '五行生克次序源流（水火木金土）',
    category: 'ganzhi-mechanics',
    categoryNameZh: '干支冲合会刑根本成因',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "“水一、火二、木三、金四、土五”。天一生水地六成之，地二生火天七成之，天三生木地八成之，地四生金天九成之，天五生土地十成之。数成而气定。",
    practicalGuidance: "五行生成数为测物数量、钱财多寡、应期远近之根本源流。",
    keywords: ["五行生成数", "天一生水", "生克次序"]
  },
  {
    id: 'jsyc.ganzhi.19',
    title: '纳音五行与正五行交参',
    category: 'ganzhi-mechanics',
    categoryNameZh: '干支冲合会刑根本成因',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "六十甲子海中金、炉中火等，为六十律吕旋宫相生之气象，以干支之数合大衍之数推求其音，主天地万物形色声气之表相。",
    practicalGuidance: "正五行定本质之生克骨架，纳音五行辅定器物之质地贵贱与音声情态。",
    keywords: ["纳音", "正五行", "六十甲子", "律吕"]
  },
  {
    id: 'jsyc.ganzhi.20',
    title: '反吟伏吟之天地不交',
    category: 'ganzhi-mechanics',
    categoryNameZh: '干支冲合会刑根本成因',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "反吟者动化对冲地支，内外两卦皆反；伏吟者动化相同地支，原地呻吟。天道失序，气机错乱倒流。",
    practicalGuidance: "反吟主事多翻腾变迁、反复无常、家业荡然；伏吟主进退维谷、忧戚郁结、如坐愁城。",
    keywords: ["反吟", "伏吟", "天地不交", "反复无常"]
  },
];

export const JINGSHI_TWELVE_STAGES: PrincipleEntry[] = [
  {
    id: 'jsyc.stages.01',
    title: '四时五行旺相休囚死界定',
    category: 'twelve-stages',
    categoryNameZh: '四时旺相与长生墓绝',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "“当令者旺，令生者相，生令者休，克令者囚，令克者死”。“春木旺而夏火炎，秋金坚而冬水盛。木火兼用于春天，火土用事于夏月，金水专三秋之令，水木主一冬之权”。",
    practicalGuidance: "四时节候代迁，得令当权者其势方盛，为万物之主司；退气者退居林下，受克者深陷囚牢；五行气运从不并盛，唯时适主宰。",
    keywords: ["旺相休囚死", "四时五行", "当令者旺", "退气"]
  },
  {
    id: 'jsyc.stages.02',
    title: '十二宫长生（发生发育之始）',
    category: 'twelve-stages',
    categoryNameZh: '四时旺相与长生墓绝',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "水长生在申、木长生在亥、火长生在寅、金长生在巳（土寄长生于寅或申）。喻如婴儿初出母腹，禀气赋形，生机微弱而渐露头角。",
    practicalGuidance: "占事为起萌发轫之兆；占人为主聪明好学（学堂）；虽带微弱，然潜力无限，大吉之神。",
    keywords: ["长生", "长生宫", "水长生申", "木长生亥", "火长生寅", "金长生巳"]
  },
  {
    id: 'jsyc.stages.03',
    title: '十二宫沐浴（败地·裸形受污）',
    category: 'twelve-stages',
    categoryNameZh: '四时旺相与长生墓绝',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "水沐浴在酉、木沐浴在子、火沐浴在卯、金沐浴在午。喻人初生之后，沐浴于水，形体裸露，极易受寒沾污，故一名“败地”。",
    practicalGuidance: "主酒色荒淫、行事多败、败家破产、任性无依；吉事临之成而复破。",
    keywords: ["沐浴", "败地", "沐浴宫"]
  },
  {
    id: 'jsyc.stages.04',
    title: '十二宫冠带（长成束发冠带）',
    category: 'twelve-stages',
    categoryNameZh: '四时旺相与长生墓绝',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "水木火金土随各行冠带之位（长生后第三位）。喻童子长成，束发加冠，始涉人事。",
    practicalGuidance: "主事业渐上正轨，渐有体面，得官得禄之资基逐渐成就。",
    keywords: ["冠带", "冠带位"]
  },
  {
    id: 'jsyc.stages.05',
    title: '十二宫临官（食禄立功名之位）',
    category: 'twelve-stages',
    categoryNameZh: '四时旺相与长生墓绝',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "甲禄在寅、乙禄在卯、丙戊禄在巳、丁己禄在午、庚禄在申、辛禄在酉、壬禄在亥、癸禄在子。喻人壮年入仕，登朝受俸。",
    practicalGuidance: "主官禄显达、薪奉丰足、权威在手、诸事亨通无碍，为至吉之位。",
    keywords: ["临官", "禄位", "官禄", "甲禄寅"]
  },
  {
    id: 'jsyc.stages.06',
    title: '十二宫帝旺（极盛鼎盛之极）',
    category: 'twelve-stages',
    categoryNameZh: '四时旺相与长生墓绝',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "水旺在子、木旺在卯、火旺在午、金旺在酉。喻人血气方刚，进锐力全，雄视天下。",
    practicalGuidance: "主速成大吉，谋无不遂；然帝旺过极必转为衰退，需防亢龙之悔。",
    keywords: ["帝旺", "极盛", "帝旺位"]
  },
  {
    id: 'jsyc.stages.07',
    title: '十二宫衰（盛极而退之始）',
    category: 'twelve-stages',
    categoryNameZh: '四时旺相与长生墓绝',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "紧接帝旺之后。喻人气运已届暮年，精神智力渐减，日薄西山。",
    practicalGuidance: "主谋事力不从心、渐趋疲软、颓势初现，宜退守以全晚节。",
    keywords: ["衰", "衰地", "盛极而衰"]
  },
  {
    id: 'jsyc.stages.08',
    title: '十二宫病（阴阳失和受疾）',
    category: 'twelve-stages',
    categoryNameZh: '四时旺相与长生墓绝',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "各行衰后入病地。喻人气血衰耗，受风寒湿邪所侵，四体不宁。",
    practicalGuidance: "主患病在身、多生疮痍、行事迟延、文书带瑕，万事不得爽利。",
    keywords: ["病", "病地", "疾病"]
  },
  {
    id: 'jsyc.stages.09',
    title: '十二宫死（气尽形枯）',
    category: 'twelve-stages',
    categoryNameZh: '四时旺相与长生墓绝',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "各行病后入死地。喻生气已尽，形骸僵卧，生机全无。",
    practicalGuidance: "主彻底败亡、不可挽回；问病大凶；唯恶煞凶鬼临死地反不为祸。",
    keywords: ["死", "死地", "气尽形枯"]
  },
  {
    id: 'jsyc.stages.10',
    title: '十二宫墓（收藏归库·入地藏匿）',
    category: 'twelve-stages',
    categoryNameZh: '四时旺相与长生墓绝',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "“金墓于丑，火墓于戌，木墓于未，水土墓于辰”。“墓多暗昧，五墓临世临身，问病一生九死”。万物生气终结，入土归藏。",
    practicalGuidance: "凶爻入墓主吉（恶煞藏敛），吉爻入墓主凶（生机被锁）；测人主如痴如醉、昏迷下狱、入土归泉。",
    keywords: ["墓", "墓库", "入墓", "金墓丑", "火墓戌", "木墓未", "水土墓辰"]
  },
  {
    id: 'jsyc.stages.11',
    title: '十二宫绝（气化归空无迹）',
    category: 'twelve-stages',
    categoryNameZh: '四时旺相与长生墓绝',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "金绝在寅，木绝在申，火绝在亥，水土绝在巳。前气已绝，后气未萌，天地混沌空荡无踪。",
    practicalGuidance: "主绝情断念、根断蒂落；然逢动爻、日辰生扶，则成“绝处逢生”，反得大起。",
    keywords: ["绝", "绝地", "化绝", "绝处逢生"]
  },
  {
    id: 'jsyc.stages.12',
    title: '十二宫胎（受气萌芽受胎）',
    category: 'twelve-stages',
    categoryNameZh: '四时旺相与长生墓绝',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "绝后复苏，阴阳初媾，受气成胎。喻天地之气复萌于窈冥之中。",
    practicalGuidance: "主事端暗生、胎孕有象、隐谋萌发；力尚微弱，不可轻动。",
    keywords: ["胎", "受气", "成胎"]
  },
  {
    id: 'jsyc.stages.13',
    title: '十二宫养（涵养胚胎成形）',
    category: 'twelve-stages',
    categoryNameZh: '四时旺相与长生墓绝',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "“养主狐疑。金养于辰，木养于戌，火养于丑，水土养于未”。在母腹涵养气血，成形未出。",
    practicalGuidance: "主谋事犹豫不决、狐疑不定、隐忍待时，虽生机渐具而未至发轫。",
    keywords: ["养", "养地", "涵养"]
  },
  {
    id: 'jsyc.stages.14',
    title: '墓库开闭之冲破机理',
    category: 'twelve-stages',
    categoryNameZh: '四时旺相与长生墓绝',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "“墓逢冲则开，破则破网而出；闭则幽暗深沉”。辰戌丑未四库，静则为锁闭之牢笼，遇冲（如辰见戌、丑见未）则库门开锁。",
    practicalGuidance: "财爻入库待冲开以发财；世爻入墓得冲开以出狱；真空真破逢冲则坍塌彻底败北。",
    keywords: ["墓库开闭", "冲开墓库", "开库", "闭库"]
  },
  {
    id: 'jsyc.stages.15',
    title: '二十四气节中二分二至之卦气盛衰律',
    category: 'twelve-stages',
    categoryNameZh: '四时旺相与长生墓绝',
    source: {
      book: '京氏易传',
      author: '京房',
      era: '西汉'
    },
    originTheory: "“冬至一阳生配坎卦初九，夏至一阴生配离卦初九；春分二分，秋分二至，四正卦分统二十四气七十二候”。“运机布度，其气转易，王者亦当则天而行，与时消息”。",
    practicalGuidance: "一年之阴阳消长全在二至二分律吕转关；断卦必严察交节日辰，交节前为前气用事，交节后为新气当权，差之毫厘，旺衰尽失矣。",
    keywords: ["二分二至", "冬至一阳生", "夏至一阴生", "卦气盛衰", "交节"]
  },
];

/** 《京氏易传》全量五十五条天道易理与干支生克元典 */
export const JINGSHI_PRINCIPLES: PrincipleEntry[] = [
  ...JINGSHI_WUXING_CHENGZHI,
  ...JINGSHI_GANZHI_MECHANICS,
  ...JINGSHI_TWELVE_STAGES
];
