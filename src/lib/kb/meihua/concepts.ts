export interface TrigramWanwuDetail {
  number: number;
  name: string;
  nature: string;
  element: string;
  weather: string;
  people: string;
  objects: string;
  body: string;
}

/**
 * 《梅花易数》八卦万物类象字典（邵康节伏羲先天象数体系）
 */
export const BAGUA_WANWU_IMAGERY: Record<string, TrigramWanwuDetail> = {
  乾: {
    number: 1,
    name: '乾',
    nature: '天',
    element: '金',
    weather: '天、冰、雹、晴明、烈日、雪暴',
    people: '父、君主、官长、显贵、老者、名流、主事',
    objects: '金银、珠宝、圆物、冠冕、钟表、铁器、坚硬骨甲、马、狮',
    body: '头颅、面首、骨骼、大肠、右臂、精血'
  },
  兑: {
    number: 2,
    name: '兑',
    nature: '泽',
    element: '金',
    weather: '雨泽、露水、晴霁之霞、新月、湿泥',
    people: '少女、妾妾、婢女、伶人、巫师、乐工、侍女',
    objects: '刀刃、剪刀、金石乐器、破损之器、缺口杯盏、羊、禽鸟',
    body: '口齿、咽喉、舌头、唾液、气管、胸膈肺腑'
  },
  离: {
    number: 3,
    name: '离',
    nature: '火',
    element: '火',
    weather: '烈日、日晕、闪电、虹霓、炎暑、红霞',
    people: '中女、文人、书吏、甲胄之士、明目之人',
    objects: '灯烛、火把、文凭、图画、章奏、书籍、干戈甲胄、雉、孔雀',
    body: '眼目、心脏、小肠、脑神经、血脉'
  },
  震: {
    number: 4,
    name: '震',
    nature: '雷',
    element: '木',
    weather: '雷霆、地震、疾风、霹雳',
    people: '长男、大将、帅佐、捕役、使臣、狂妄奔腾之人',
    objects: '车轴、钟鼓、木乐器、竿栋、树木杂竹、龙、蛇、芦苇',
    body: '足胫、肝胆、发须、神经经络、左胁'
  },
  巽: {
    number: 5,
    name: '巽',
    nature: '风',
    element: '木',
    weather: '疾风、回风、云霞飘忽、长空顺风',
    people: '长女、秀士、寡妇、僧尼、工匠、商贾、进退未决之人',
    objects: '木索、绳纆、线轴、竹苇、直木、工巧羽毛、鸡、百禽',
    body: '大腿股部、呼吸气管、胆经、神经抽搐、白带'
  },
  坎: {
    number: 6,
    name: '坎',
    nature: '水',
    element: '水',
    weather: '霖雨、大雪、严霜、渊泉、冰雹、黑云',
    people: '中男、险诈之人、盗寇、江湖游民、水手、行客',
    objects: '带水之器、瓦器、酒樽、水具、鱼钩、盐池、豕猪、水中之族',
    body: '耳道、肾脏、膀胱、泌尿系统、精液、骨髓'
  },
  艮: {
    number: 7,
    name: '艮',
    nature: '山',
    element: '土',
    weather: '山岳、丘陵、浓雾、重云、飞沙',
    people: '少男、童子、山林隐者、阍寺、狱吏、阻隔顽固之人',
    objects: '门阙、台阶、石灰、土石器皿、几案、床榻、犬、狐狼、虎豹',
    body: '手指、脚趾、鼻子、脊骨、背部、皮肉脾胃'
  },
  坤: {
    number: 8,
    name: '坤',
    nature: '地',
    element: '土',
    weather: '大地、厚土、阴霾、风云蔽日',
    people: '母亲、老母、后妃、万民农人、厚德寡言之人',
    objects: '釜甑瓦器、土布方帕、五谷、仓廪、车厢、牛犊、牝马',
    body: '脾胃、腹部、肌肉、右肩、子宫腹胞'
  }
};

/**
 * 字画起卦与拆字心易秘旨
 */
export const CHAR_DIVINATION_GUIDE = {
  平仄笔画分阴阳: '字有单字、二字、多字之别。单字按左阳右阴、上阳下阴或偏旁笔画析分；字画少者为乾兑，字画多者为坤艮；结合读音五行（角徵宫商羽）定卦。',
  字形象意: '见折笔直下为木，见横平竖直为土，有弯钩浮沉为水，有撇捺尖锐为火，有方圆端整为金。见穿心字防破败，见带勾字主牵连，见断头字主夭折。'
};

/**
 * 三要十应心易外应准则
 */
export const OUTER_RESPONSE_GUIDE = {
  三要玄机: '神无不在，感而遂通。耳闻吉语，虽卦凶减半；耳闻悲泣哀号，虽卦吉亦带滞；目见喜庆花果，增吉助喜；目见毁折破器，主凶主破。天理感应，易数玄微，卦象与外应两相参合，百发百中。',
  十应奥论: '天时日色、风雷飞鸟、走兽鳞介，皆暗藏五行。金逢刀铁成器，木遇斧斤遭伤，水见火烹煎消，火遇水灭熄。若外应生体卦，锦上添花；外应克体卦，祸生肘腋。'
};
