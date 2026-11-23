/**
 * 《测字秘牒》（清·程省 著）独门象意概念字典
 * 涵盖：偏旁部首全息取格类象、字画骨骼散格系统（头心身足）、笔形五行与六神体用、相字至理八法神机。
 */

export interface RadicalImageryItem {
  radical: string;
  name: string;
  element: string;
  auspiciousItems: { char: string; meaning: string }[];
  inauspiciousItems: { char: string; meaning: string }[];
  overview: string;
}

export interface BodyPartAnatomy {
  part: '头' | '心' | '身' | '足';
  correspondences: string;
  guidance: string;
  examples: string[];
}

export interface StrokeElementItem {
  element: string;
  strokeShape: string;
  character: string;
  positive: string;
  negative: string;
}

/**
 * 1. 偏旁部首全息取格类象（卷三《测字取格大法》）
 */
export const RADICAL_IMAGERY_MAP: Record<string, RadicalImageryItem> = {
  水: {
    radical: '氵/水',
    name: '水部取格',
    element: '水',
    auspiciousItems: [
      { char: '江', meaning: '功名源远流长，出类拔萃' },
      { char: '沆', meaning: '龙归沧海，水天一色' },
      { char: '沛', meaning: '雨露沾濡，生机勃发' },
      { char: '涵', meaning: '包容大度，涵养深沉' },
      { char: '海', meaning: '海纳百川，官居极品' }
    ],
    inauspiciousItems: [
      { char: '沐', meaning: '一木浮沉，飘零无定' },
      { char: '沈', meaning: '泪沾绣枕，沉溺不振' },
      { char: '汉', meaning: '临河兴叹，望洋而止' },
      { char: '池', meaning: '平地兴波，坎坷波折' },
      { char: '漏', meaning: '云泥之隔，资财渗漏' }
    ],
    overview: '水主流通润下，秋冬坎水得令大旺，春夏休囚绝败。'
  },
  火: {
    radical: '火/灬',
    name: '火部取格',
    element: '火',
    auspiciousItems: [
      { char: '耿', meaning: '所取最美，光明磊落' },
      { char: '烹', meaning: '调和鼎鼐，位列宰辅' },
      { char: '焦', meaning: '佳人燕喜，成木生火' },
      { char: '熙', meaning: '景星庆云，太平盛世' }
    ],
    inauspiciousItems: [
      { char: '烦', meaning: '焦头烂额，心绪杂乱' },
      { char: '煤', meaning: '谋救燃眉，急难逼身' },
      { char: '烟', meaning: '风吹星散，虚无缥缈' },
      { char: '黑', meaning: '墨突不黔，晦暗蒙尘' }
    ],
    overview: '火主文明光明，得位调和万物，失位焦头烂额；旺在巳午夏令，冬水制之熄灭。'
  },
  金: {
    radical: '金/钅',
    name: '金部取格',
    element: '金',
    auspiciousItems: [
      { char: '钟', meaning: '名重金瓯，钟鸣鼎食' },
      { char: '钰', meaning: '堆金积玉，宝藏坚实' },
      { char: '锐', meaning: '囊锥脱颖，才华毕露' },
      { char: '铸', meaning: '千金上寿，大器晚成' }
    ],
    inauspiciousItems: [
      { char: '钱', meaning: '金气摧残，杀伐逼身' },
      { char: '银', meaning: '钱粮不足，艮止阻滞' },
      { char: '钗', meaning: '破镜分钗，骨肉分离' },
      { char: '钞', meaning: '披沙拣金，微薄难求' }
    ],
    overview: '金主坚刚裁断，秋令生旺大吉，夏火熔金受损；遇凶格破镜分钗。'
  },
  木: {
    radical: '木',
    name: '木部取格',
    element: '木',
    auspiciousItems: [
      { char: '橙', meaning: '登科夺标，吉庆呈祥' },
      { char: '桂', meaning: '蟾宫折桂，科场连捷' },
      { char: '槐', meaning: '榜上经魁，位登三公' },
      { char: '栋', meaning: '东风拂柳，国家栋梁' }
    ],
    inauspiciousItems: [
      { char: '枷', meaning: '跌倒架子，枷锁加身' },
      { char: '枯', meaning: '故旧相弃，生意索然' },
      { char: '朽', meaning: '巧尽成空，根基糜烂' },
      { char: '村', meaning: '求荣反辱，村居沉沦' }
    ],
    overview: '木主条达发生，春令敷荣，秋金摧折；得运登科折桂，失运枯木朽株。'
  },
  土: {
    radical: '土/阝',
    name: '土部取格',
    element: '土',
    auspiciousItems: [
      { char: '境', meaning: '宝镜重磨，光景再新' },
      { char: '坐', meaning: '有人有土，位分安稳' },
      { char: '坤', meaning: '安贞厚德，地载万物' },
      { char: '域', meaning: '跨海封疆，声名远扬' }
    ],
    inauspiciousItems: [
      { char: '至', meaning: '高台既倾，颠沛流离' },
      { char: '埋', meaning: '理上有亏，入土归藏' },
      { char: '垣', meaning: '萱堂有损，断壁残垣' },
      { char: '坊', meaning: '半途崩折，无所依傍' }
    ],
    overview: '土为万物之母，镇静持重；辰戌丑未四季分旺，过亢则焦，陷水则泥。'
  }
};

/**
 * 2. 字画骨骼散格系统（卷五《测字散格法》）
 */
export const CHARACTER_BODY_ANATOMY: Record<'头' | '心' | '身' | '足', BodyPartAnatomy> = {
  头: {
    part: '头',
    correspondences: '冠冕、上司、尊长、父母、天道、太极起手',
    guidance: '头正心公，头欹案斜；断头者凡事半途，无顶冠者功名不达，加冠带者登科进爵。',
    examples: ['先（牛头）', '美（羊头）', '家（守头）', '善（喜头）', '帛（皇头）']
  },
  心: {
    part: '心',
    correspondences: '神明、主宰、腹臆、正中、妻室、根本意念',
    guidance: '心中端正则万事和顺；若心中受穿刺（穿心测法），必罹萧墙内乱、心神不宁、暗疾缠身。',
    examples: ['思（良心）', '忠（正心）', '文穿心为吏', '昌穿心为量', '月穿心为用']
  },
  身: {
    part: '身',
    correspondences: '自身、骨骼、骨架、家业、事业中流、居室',
    guidance: '体段停匀厚实者基业雄厚，歪斜偏倚者行藏诡诈；被框笼包裹者陷牢狱或财入瓮。',
    examples: ['身似皂隶', '用如闭门', '贝包为遗', '玉包为宝', '由包为遭']
  },
  足: {
    part: '足',
    correspondences: '步履、行动、子息、下人、根基、归宿结局',
    guidance: '足健有力则步履稳健、根基坚固；足虚悬空浮萍无依；足折断者中途夭蹶、行人不归。',
    examples: ['先（虎足）', '善（喜足）', '立（接脚为产）', '帛（帝足）', '里（童足）']
  }
};

/**
 * 3. 笔形五行与六神体用
 */
export const STROKE_ELEMENTS: StrokeElementItem[] = [
  {
    element: '木',
    strokeShape: '直画长秀',
    character: '仁和生发，秀拔清奇',
    positive: '主文章科名、家道荣昌',
    negative: '若折断带刺主筋骨受损、中途摧折'
  },
  {
    element: '火',
    strokeShape: '撇捺尖挑',
    character: '光芒明烈，性烈急躁',
    positive: '主文彩显赫、速成显达',
    negative: '重见双挑主口舌官非、火烛焚身'
  },
  {
    element: '土',
    strokeShape: '横画厚重',
    character: '厚重镇静，安稳持重',
    positive: '主田宅资财丰隆、根基扎实',
    negative: '断绝悬空主家宅倾颓、迟滞不进'
  },
  {
    element: '金',
    strokeShape: '方正圆转',
    character: '刚硬裁决，肃杀之气',
    positive: '主权威果决、位居要津',
    negative: '尖锐露锋加戈戟主刀兵刑戮、流血破相'
  },
  {
    element: '水',
    strokeShape: '波浪点滴',
    character: '流通无碍，聪明活泼',
    positive: '主智谋渊深、商贾获利',
    negative: '点滴拖泥如泪痕主流离失所、啼哭丧事'
  }
];

/**
 * 六神在测字中的体用化现
 */
export const SIX_BEASTS_CEZI: Record<string, string> = {
  青龙: '笔画蜿蜒挺秀，字含喜气春意，主喜庆临门、加官进禄。',
  朱雀: '字脚轻浮飞扬，撇捺开叉，主口舌争端、官非文书扰攘。',
  勾陈: '横直相纠，结聚不开，主田土争竞、迟滞难解、办事迟延。',
  螣蛇: '字势盘旋曲折，如绳索纠缠，主虚惊怪异、梦寐不安、羁绊暗昧。',
  白虎: '笔尖露芒，戈戟交加，刀刃逼身，主血光刑网、大辟凶危。',
  玄武: '墨色浓晦，点水浸染，暗藏隐笔，主阴私暧昧、盗贼欺瞒。'
};

/**
 * 4. 相字至理八法神机（程省相字心法）
 */
export const EIGHT_DIVINATION_METHODS = [
  { name: '以字象物', desc: '口如方匣，乙如鱼钩，亚如纱窗，身如皂隶，见字如见形。' },
  { name: '借字谐声', desc: '耳通造化，同音借意。闻鹿断禄，闻梨断离，闻桃断逃。' },
  { name: '动静克应', desc: '行测速到，坐问迟来；东风拂面断急行，落叶辞柯断衰歇。' },
  { name: '字同事不同', desc: '来者身份不同、问事不同，同一字吉凶迥异；商贾问火为盛，病者问火焚身。' },
  { name: '字形相法', desc: '字好人俗不可断吉，字丑人清当知发越；察墨之浓淡、观纸之厚薄。' },
  { name: '损益添减', desc: '当添亦添，当减亦减；补其不足为生，削其繁芜为化。' },
  { name: '阴阳奇偶', desc: '奇笔为阳生男利进，偶笔为阴生女利退；数度合天机。' },
  { name: '正论勿好奇', desc: '依经入史，恪守儒门五行正易；切忌矜奇弄巧、流于怪诞。' }
];
