import type { KBEntry } from './types';
import { ZENGSHAN_CORE_RULES } from './golden-rules';

export { ZENGSHAN_CORE_RULES };

/**
 * 六爻实战断法草稿条目库（正统《增删卜易》典籍条目）
 * 当前共 180 条，全量 status: 'draft'
 */
const DRAFT_RULES: KBEntry[] = [
  {
    "id": "zsy.yong.01",
    "kind": "rule",
    "status": "draft",
    "source": {
      "book": "增删卜易",
      "chapter": "用神章第八"
    },
    "when": {
      "topic": [
        "财运"
      ],
      "relative": [
        "妻财"
      ]
    },
    "text": "求财买卖，以妻财为用神。妻财旺相，得日月动爻生扶，不论官贵常人，皆获厚利。",
    "verdict": "吉",
    "timing": "生旺月日、值财之日。",
    "credibility": 5
  },
  {
    "id": "zsy.yong.02",
    "kind": "rule",
    "status": "draft",
    "source": {
      "book": "增删卜易",
      "chapter": "用神章第八"
    },
    "when": {
      "topic": [
        "财运"
      ],
      "relative": [
        "子孙"
      ]
    },
    "text": "子孙为财之元神，亦名福德。子孙发动生妻财者，财源绵绵不绝；若子孙休囚被克，虽有微财不能长久。",
    "verdict": "吉",
    "timing": "子孙值日、财爻当令之时。",
    "credibility": 5
  },
  {
    "id": "zsy.yong.03",
    "kind": "rule",
    "status": "draft",
    "source": {
      "book": "增删卜易",
      "chapter": "用神章第八"
    },
    "when": {
      "topic": [
        "事业"
      ],
      "relative": [
        "官鬼"
      ]
    },
    "text": "求官求名谋职，以官鬼为用神。官鬼旺相，得日月生助，必得重用迁升；若克害休囚，难登仕途。",
    "verdict": "吉",
    "timing": "逢官星值日、冲官出空之期。",
    "credibility": 5
  },
  {
    "id": "zsy.yong.04",
    "kind": "rule",
    "status": "draft",
    "source": {
      "book": "增删卜易",
      "chapter": "用神章第八"
    },
    "when": {
      "topic": [
        "考试"
      ],
      "relative": [
        "父母"
      ]
    },
    "text": "问考试升学、文书印信，以父母为用神。父母旺相，文采高迈，必中甲榜；若受刑冲克害，名落孙山。",
    "verdict": "吉",
    "timing": "父母值日、文书填实之期。",
    "credibility": 5
  },
  {
    "id": "zsy.yong.05",
    "kind": "rule",
    "status": "draft",
    "source": {
      "book": "增删卜易",
      "chapter": "用神章第八"
    },
    "when": {
      "topic": [
        "婚恋"
      ],
      "relative": [
        "妻财"
      ]
    },
    "text": "男占婚姻以妻财为用神。财旺生世，妇德贤淑而益夫家；财衰受克，坎坷难谐或损内助。",
    "verdict": "成",
    "timing": "财爻逢合、逢值之日。",
    "credibility": 5
  },
  {
    "id": "zsy.yong.06",
    "kind": "rule",
    "status": "draft",
    "source": {
      "book": "增删卜易",
      "chapter": "用神章第八"
    },
    "when": {
      "topic": [
        "婚恋"
      ],
      "relative": [
        "官鬼"
      ]
    },
    "text": "女占婚姻以官鬼为用神。官旺生世相合，夫荣妻贵，白头偕老；官星受克入墓，刑伤难免。",
    "verdict": "成",
    "timing": "官星临值、世应相生合之期。",
    "credibility": 5
  },
  {
    "id": "zsy.yong.07",
    "kind": "rule",
    "status": "draft",
    "source": {
      "book": "增删卜易",
      "chapter": "用神章第八"
    },
    "when": {
      "topic": [
        "疾病"
      ],
      "relative": [
        "官鬼"
      ]
    },
    "text": "问病以官鬼为病症。官鬼衰弱休囚，病体易愈；官鬼炽盛发动逢生，病势沉重难控。",
    "verdict": "吉",
    "timing": "官鬼绝墓之日，克鬼制鬼之期。",
    "credibility": 5
  },
  {
    "id": "zsy.yong.08",
    "kind": "rule",
    "status": "draft",
    "source": {
      "book": "增删卜易",
      "chapter": "用神章第八"
    },
    "when": {
      "topic": [
        "疾病"
      ],
      "relative": [
        "子孙"
      ]
    },
    "text": "问病以子孙为良医妙药。子孙旺相发动，良医拔毒，沉疴立愈；子孙休囚受制，药石无灵。",
    "verdict": "吉",
    "timing": "子孙当令、逢值之日。",
    "credibility": 5
  },
  {
    "id": "zsy.yong.09",
    "kind": "rule",
    "status": "draft",
    "source": {
      "book": "增删卜易",
      "chapter": "用神章第八"
    },
    "when": {
      "topic": [
        "诉讼"
      ],
      "relative": [
        "官鬼"
      ]
    },
    "text": "词讼以官鬼为官厅公堂。世克官鬼，难得官心；官生世爻，断得公平偏向；官星发动冲克世爻，必见责罚。",
    "verdict": "凶",
    "timing": "官星休囚落空之日息事。",
    "credibility": 5
  },
  {
    "id": "zsy.yong.10",
    "kind": "rule",
    "status": "draft",
    "source": {
      "book": "增删卜易",
      "chapter": "用神章第八"
    },
    "when": {
      "topic": [
        "出行"
      ],
      "relative": [
        "父母"
      ]
    },
    "text": "出行以父母为车马舟桥行李，世爻为己身。父母旺相，旅程通泰；父母受克，途中有阻滞之忧。",
    "verdict": "吉",
    "timing": "父母临值生世之日出发。",
    "credibility": 5
  },
  {
    "id": "zsy.yong.11",
    "kind": "rule",
    "status": "draft",
    "source": {
      "book": "增删卜易",
      "chapter": "用神章第八"
    },
    "when": {
      "topic": [
        "家宅"
      ],
      "relative": [
        "父母"
      ]
    },
    "text": "占家宅以父母为堂宇屋基。父母旺相生世，宅运昌隆，人口安泰；父母受克空破，屋宇不宁或有动迁。",
    "verdict": "成",
    "timing": "父母填实逢生之期安居。",
    "credibility": 5
  },
  {
    "id": "zsy.yong.12",
    "kind": "rule",
    "status": "draft",
    "source": {
      "book": "增删卜易",
      "chapter": "用神章第八"
    },
    "when": {
      "topic": [
        "失物"
      ],
      "relative": [
        "妻财"
      ]
    },
    "text": "失物以妻财为用神。财爻旺相不落空亡，失物仍在家中或近处；财爻受克入墓化空，难寻回。",
    "verdict": "成中有阻",
    "timing": "冲开财库之日，财星填实之方。",
    "credibility": 5
  },
  {
    "id": "zsy.yong.13",
    "kind": "rule",
    "status": "draft",
    "source": {
      "book": "增删卜易",
      "chapter": "用神章第八"
    },
    "when": {
      "conditions": [
        "yong-shen-bu-xian"
      ]
    },
    "text": "用神不上卦，当寻伏神。伏神受飞神生助为吉，受飞神克制则难露峥嵘，须待冲克飞神之日月方得出透。",
    "verdict": "成中有阻",
    "timing": "冲去飞神、伏神当值之月日。",
    "credibility": 5
  },
  {
    "id": "zsy.yong.14",
    "kind": "rule",
    "status": "draft",
    "source": {
      "book": "增删卜易",
      "chapter": "用神章第八"
    },
    "when": {
      "conditions": [
        "yong-shen-liang-xian"
      ]
    },
    "text": "用神两现者，舍其休囚而用旺相，舍其静爻而用动爻，舍其破空而用完全。若一动一静，取发动者为机兆。",
    "verdict": "成",
    "timing": "以发动或旺相之用爻定应期。",
    "credibility": 5
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yuanshen.01",
    "source": {
      "book": "增删卜易",
      "chapter": "用神元神、忌神、仇神章第九"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "元神发动生用神，此谋大吉；纵用神失令，得元神动而生助，如旱苗得甘霖，后必勃发。",
    "verdict": "吉",
    "timing": "元神临值、生合用神之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yuanshen.02",
    "source": {
      "book": "增删卜易",
      "chapter": "元神忌神衰旺章第十"
    },
    "when": {
      "conditions": [
        "hui-tou-sheng"
      ]
    },
    "text": "元神发动化回头之生，长久获福，其力绵绵；用神虽受日辰之克，亦因元神得化生而不能伤。",
    "verdict": "吉",
    "timing": "变爻逢生逢值之时。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yuanshen.03",
    "source": {
      "book": "增删卜易",
      "chapter": "元神忌神衰旺章第十"
    },
    "when": {
      "conditions": [
        "hui-tou-ke"
      ]
    },
    "text": "元神动而化回头之克，虽欲生用而先自顾不暇，如抱病救人，终归无补于事。",
    "verdict": "不成",
    "timing": "变爻克绝元神之时。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yuanshen.04",
    "source": {
      "book": "增删卜易",
      "chapter": "元神忌神衰旺章第十"
    },
    "when": {
      "conditions": [
        "transform-advance"
      ]
    },
    "text": "元神动化进神，生扶之力愈进愈勇；测功名求财，始见艰难，后大获全胜。",
    "verdict": "先难后易",
    "timing": "进神当权填实之月日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yuanshen.05",
    "source": {
      "book": "增删卜易",
      "chapter": "元神忌神衰旺章第十"
    },
    "when": {
      "conditions": [
        "transform-retreat"
      ]
    },
    "text": "元神动化退神，初起势大力沉，随而精力疲惫；凡事虎头蛇尾，终归废弛。",
    "verdict": "不成",
    "timing": "退神衰落之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yuanshen.06",
    "source": {
      "book": "增删卜易",
      "chapter": "元神忌神衰旺章第十"
    },
    "when": {
      "conditions": [
        "hua-mu"
      ]
    },
    "text": "元神动而化墓，犹如明珠投暗，虽动而入库难施其巧，必待冲开墓库之日方生用神。",
    "verdict": "成中有阻",
    "timing": "冲墓破库之月日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yuanshen.07",
    "source": {
      "book": "增删卜易",
      "chapter": "元神忌神衰旺章第十"
    },
    "when": {
      "conditions": [
        "hua-jue"
      ]
    },
    "text": "元神化绝，生机断绝；虽有动爻救助用神，势成泡影，凶灾立现。",
    "verdict": "凶",
    "timing": "临绝逢绝之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yuanshen.08",
    "source": {
      "book": "增删卜易",
      "chapter": "元神忌神衰旺章第十"
    },
    "when": {
      "conditions": [
        "hua-kong"
      ]
    },
    "text": "元神动而化空，目下虽难得力，出空填实之后依然能生用神，此谓动不为空。",
    "verdict": "先难后易",
    "timing": "出空填实冲空之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yuanshen.09",
    "source": {
      "book": "增删卜易",
      "chapter": "用神元神、忌神、仇神章第九"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "忌神发动克害用神，祸患难免；若用神休囚无助，大凶之兆；有日月动爻生助用神者，尚可救解。",
    "verdict": "凶",
    "timing": "忌神临值乘旺之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yuanshen.10",
    "source": {
      "book": "增删卜易",
      "chapter": "克处逢生章第十三"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "忌神发动克用，而卦中又有动爻生用克忌神者，此谓克处逢生，转祸为祥，反凶为吉。",
    "verdict": "吉",
    "timing": "克制忌神之动爻临值之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yuanshen.11",
    "source": {
      "book": "增删卜易",
      "chapter": "元神忌神衰旺章第十"
    },
    "when": {
      "conditions": [
        "hui-tou-ke"
      ]
    },
    "text": "忌神发动化回头之克，吉凶互见；恶人自有恶人磨，忌神受制，祸端自消，于用神无损。",
    "verdict": "吉",
    "timing": "制忌变爻逢旺之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yuanshen.12",
    "source": {
      "book": "增删卜易",
      "chapter": "元神忌神衰旺章第十"
    },
    "when": {
      "conditions": [
        "transform-retreat"
      ]
    },
    "text": "忌神动化退神，祸患虽来，后劲不足；其势渐微，逢退而解，不足深忧。",
    "verdict": "先难后易",
    "timing": "忌神退化衰败之时。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yuanshen.13",
    "source": {
      "book": "增删卜易",
      "chapter": "元神忌神衰旺章第十"
    },
    "when": {
      "conditions": [
        "month-break"
      ]
    },
    "text": "忌神临月破，虽发动而无伤人之力；若用神乘旺，则如破矢无力穿鲁缟，何惧之有。",
    "verdict": "吉",
    "timing": "出月前安稳，出月后仍当防患。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yuanshen.14",
    "source": {
      "book": "增删卜易",
      "chapter": "元神忌神衰旺章第十"
    },
    "when": {
      "conditions": [
        "xun-kong"
      ]
    },
    "text": "忌神落旬空，动而避实，目下无伤；防出空填实之日，卷土重来。",
    "verdict": "成中有阻",
    "timing": "出空填实冲空之日防灾。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yuanshen.15",
    "source": {
      "book": "增删卜易",
      "chapter": "用神元神、忌神、仇神章第九"
    },
    "when": {
      "conditions": [
        "all-quiet"
      ]
    },
    "text": "卦中六爻安静，忌神伏而不发，用神当权自安；凡事循规蹈矩，安常处顺为上。",
    "verdict": "吉",
    "timing": "守常待日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yuanshen.16",
    "source": {
      "book": "增删卜易",
      "chapter": "元神忌神衰旺章第十"
    },
    "when": {
      "conditions": [
        "hua-jue"
      ]
    },
    "text": "忌神化绝，如釜底抽薪；任其凶威滔天，俄顷化为乌有，百祸消亡。",
    "verdict": "吉",
    "timing": "绝令绝日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yuanshen.17",
    "source": {
      "book": "增删卜易",
      "chapter": "用神元神、忌神、仇神章第九"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "仇神生忌神而克元神。仇神忌神同动，重峦叠嶂，雪上加霜，极凶之局。",
    "verdict": "凶",
    "timing": "仇忌相逢受制之日方解。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yuanshen.18",
    "source": {
      "book": "增删卜易",
      "chapter": "克处逢生章第十三"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "贪生忘克：忌神动欲克用，卦中见生忌神之动爻，水生木、木生火连环相生，贪生忘克反助其势。",
    "verdict": "凶",
    "timing": "生克交加之时。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.shengke.01",
    "source": {
      "book": "增删卜易",
      "chapter": "五行相生章第十一"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "五行相生，金生水、水生木、木生火、火生土、土生金。用爻受生，得助获益；贪生忘克，相生为吉。",
    "verdict": "吉",
    "timing": "逢生生旺之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.shengke.02",
    "source": {
      "book": "增删卜易",
      "chapter": "五行相克章第十二"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "五行相克，金克木、木克土、土克水、水克火、火克金。旺克衰，有力克无力；凡受克而无救者，终见凋零。",
    "verdict": "凶",
    "timing": "受克当值之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.shengke.03",
    "source": {
      "book": "增删卜易",
      "chapter": "动静生克章第十四"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "动静生克：发动之爻能生克静爻，静爻不能生克动爻。神机兆于动，动者操生杀之权。",
    "verdict": "成",
    "timing": "动爻值日之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.shengke.04",
    "source": {
      "book": "增删卜易",
      "chapter": "动变生克冲合章第十五"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "动变生克：变爻专一生克本爻，不能飞越生克他爻。本爻动而受变爻回头之生，此爻极吉。",
    "verdict": "吉",
    "timing": "变爻值日之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.shengke.05",
    "source": {
      "book": "增删卜易",
      "chapter": "动变生克冲合章第十五"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "动变回头克：动爻化出变爻回头相克，本位自溃，动不遂意，反受其害。",
    "verdict": "凶",
    "timing": "变爻冲克之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.shengke.06",
    "source": {
      "book": "增删卜易",
      "chapter": "动静生克章第十四"
    },
    "when": {
      "conditions": [
        "all-quiet"
      ]
    },
    "text": "两静爻不能相生克，唯看日月临卦之旺相休囚。旺者自旺，衰者自衰。",
    "verdict": "成中有阻",
    "timing": "当令得月之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.shengke.07",
    "source": {
      "book": "增删卜易",
      "chapter": "克处逢生章第十三"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "木衰金克，得水爻发动化生，金生水而水生木，克处逢生，转危为安。",
    "verdict": "吉",
    "timing": "水旺当值之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.shengke.08",
    "source": {
      "book": "增删卜易",
      "chapter": "克处逢生章第十三"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "火衰水克，得木爻发动相生，水生木而木生火，死地复生，谋事反得贵人借力。",
    "verdict": "吉",
    "timing": "木爻当值之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.shengke.09",
    "source": {
      "book": "增删卜易",
      "chapter": "克处逢生章第十三"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "土衰木克，得火爻发动相生，木生火而火生土，化煞为权，逢凶化吉。",
    "verdict": "吉",
    "timing": "火令火日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.shengke.10",
    "source": {
      "book": "增删卜易",
      "chapter": "克处逢生章第十三"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "金衰火克，得土爻发动相生，火生土而土生金，印绶生身，灾退福临。",
    "verdict": "吉",
    "timing": "土旺之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.shengke.11",
    "source": {
      "book": "增删卜易",
      "chapter": "克处逢生章第十三"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "水衰土克，得金爻发动相生，土生金而金生水，水源滔滔，功业成就。",
    "verdict": "吉",
    "timing": "金水当权之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.shengke.12",
    "source": {
      "book": "增删卜易",
      "chapter": "动静生克章第十四"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "生多为害：用神虽喜生助，生之太重则泛滥无依，如同慈母害子，亦须制化方妙。",
    "verdict": "成中有阻",
    "timing": "克制生神之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.wangshuai.01",
    "source": {
      "book": "增删卜易",
      "chapter": "月将章第十六"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "月建司三旬之提纲，操旺相休囚之柄。爻临月建，不论动静，皆如山峙岳立，百祸不侵。",
    "verdict": "吉",
    "timing": "在当月之内俱验。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.wangshuai.02",
    "source": {
      "book": "增删卜易",
      "chapter": "日辰章第十七"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "日辰主一日之生杀，终四时之吉凶。爻临日建，亦同月建，为万古不灭之纲，日生则吉，日克则凶。",
    "verdict": "吉",
    "timing": "即日或逢值之时。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.wangshuai.03",
    "source": {
      "book": "增删卜易",
      "chapter": "月将章第十六"
    },
    "when": {
      "conditions": [
        "month-break"
      ]
    },
    "text": "月建冲克之爻为月破。破爻不论发动与否，本月气绝难施；动者尚待出月，静者终身莫救。",
    "verdict": "凶",
    "timing": "出月方许望生。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.wangshuai.04",
    "source": {
      "book": "增删卜易",
      "chapter": "日辰章第十七"
    },
    "when": {
      "conditions": [
        "day-break"
      ]
    },
    "text": "日辰冲克休囚之静爻为日破。既休且被冲，形销骨散，毫无气机，百占百凶。",
    "verdict": "凶",
    "timing": "破而不复。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.wangshuai.05",
    "source": {
      "book": "增删卜易",
      "chapter": "暗动章第二十二"
    },
    "when": {
      "conditions": [
        "dark-move"
      ]
    },
    "text": "日辰冲旺相之静爻为暗动。暗动者，福来而人不知，祸至而人不觉；其力同于明动，潜发神机。",
    "verdict": "吉",
    "timing": "暗动逢值逢合之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.wangshuai.06",
    "source": {
      "book": "增删卜易",
      "chapter": "日辰章第十七"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "日辰能冲散发狂之动爻。动爻休囚而被日辰冲之者，动散失力，无力生克他爻。",
    "verdict": "不成",
    "timing": "散而不成。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.wangshuai.07",
    "source": {
      "book": "增删卜易",
      "chapter": "日辰章第十七"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "日辰克动爻，虽克而动爻乘旺者，不能全灭其势，仍留发作之机。",
    "verdict": "成中有阻",
    "timing": "逢克之日受挫，出克之时复起。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.wangshuai.08",
    "source": {
      "book": "增删卜易",
      "chapter": "四时旺相章第十五"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "春令木旺火相，金囚水休土死。爻得旺相，顺水推舟；爻值休囚，逆风行棹。",
    "verdict": "吉",
    "timing": "旺相乘时之节。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.wangshuai.09",
    "source": {
      "book": "增删卜易",
      "chapter": "四时旺相章第十五"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "夏令火旺土相，水死金囚木休。用神临火土，官禄聚发；用逢金水，如汤泼雪。",
    "verdict": "成",
    "timing": "盛夏当令之时。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.wangshuai.10",
    "source": {
      "book": "增删卜易",
      "chapter": "四时旺相章第十五"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "秋令金旺水相，木死火囚土休。用逢金水，如金城汤池，凡占顺遂。",
    "verdict": "吉",
    "timing": "金水当权之秋。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.wangshuai.11",
    "source": {
      "book": "增删卜易",
      "chapter": "四时旺相章第十五"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "冬令水旺木相，土囚火死金休。用神值水木，万事吉昌；临火土者，待春转阳。",
    "verdict": "先难后易",
    "timing": "水旺得力之冬。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.wangshuai.12",
    "source": {
      "book": "增删卜易",
      "chapter": "四时旺相章第十五"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "四季土旺金相，土能生金，财库宏开；惟木临死地，火处于休囚。未月火尚有余气，丑月水亦存余寒。",
    "verdict": "成",
    "timing": "季月辰戌丑未当值之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.wangshuai.13",
    "source": {
      "book": "增删卜易",
      "chapter": "月将章第十六"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "月生用神，日克用神，此谓旺相相敌，成中有阻，谋事尚可支撑。",
    "verdict": "成中有阻",
    "timing": "逢生日克退之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.wangshuai.14",
    "source": {
      "book": "增删卜易",
      "chapter": "月将章第十六"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "月克用神，日生用神，虽有困顿，日辰得力仍能拨云见日，不致倾覆。",
    "verdict": "先难后易",
    "timing": "日辰生助填实之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.wangshuai.15",
    "source": {
      "book": "增删卜易",
      "chapter": "月将章第十六"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "日月俱生用神，千祥云集，万祸不加，凡占无不亨通获吉。",
    "verdict": "吉",
    "timing": "吉庆立见，近应月日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.wangshuai.16",
    "source": {
      "book": "增删卜易",
      "chapter": "月将章第十六"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "日月俱克用神，孤立无援，穷途末路，凡谋必败，急宜退避。",
    "verdict": "凶",
    "timing": "大祸防在克期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.wangshuai.17",
    "source": {
      "book": "增删卜易",
      "chapter": "日辰章第十七"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "日建合爻：静爻遇合为合起，动爻遇合为合住。合住者动而不能变，须待冲合之日方行。",
    "verdict": "成中有阻",
    "timing": "逢冲开日辰合住之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.wangshuai.18",
    "source": {
      "book": "增删卜易",
      "chapter": "月将章第十六"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "月建合爻：爻遇月合，此谓旺而相扶，凡事牢固；若动而逢月合，亦名贪合忘动。",
    "verdict": "吉",
    "timing": "出月或冲开之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.wangshuai.19",
    "source": {
      "book": "增删卜易",
      "chapter": "月将章第十六"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "月将合爻化扶：若月建生合用神，此大贵之兆，君臣相合，凡求无阻。",
    "verdict": "吉",
    "timing": "当月内大庆。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.wangshuai.20",
    "source": {
      "book": "增删卜易",
      "chapter": "日辰章第十七"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "日建扶持用神，虽逢凶星动克，如得中流砥柱，凶灾自解，保合无恙。",
    "verdict": "吉",
    "timing": "逢日建当值之时。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.wangshuai.21",
    "source": {
      "book": "增删卜易",
      "chapter": "日辰章第十七"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "日辰临兄弟发动占财，破财立见；临子孙占财，财利翻倍；临官鬼占讼，祸起萧墙。",
    "verdict": "成中有阻",
    "timing": "日辰定乾坤。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.wangshuai.22",
    "source": {
      "book": "增删卜易",
      "chapter": "四时旺相章第十五"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "旺相能敌克，休囚任受制。用神若在月令得长生帝旺，任是仇忌齐动，不能动摇根本。",
    "verdict": "吉",
    "timing": "长生帝旺之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.month_break.01",
    "source": {
      "book": "增删卜易",
      "chapter": "月破章第二十七"
    },
    "when": {
      "conditions": [
        "month-break"
      ]
    },
    "text": "用神临月破，静而不动，又无日辰动爻生助者，到底而破；虽有日辰之生，亦不能生。",
    "verdict": "不成",
    "timing": "目下虽破，出月则不破；实破之日、合之日亦不破。近应日，远应年月。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.month_break.02",
    "source": {
      "book": "增删卜易",
      "chapter": "月破章第二十七"
    },
    "when": {
      "conditions": [
        "month-break",
        "moving"
      ]
    },
    "text": "月破之爻动则能伤于爻，作变爻则能伤于动爻。神兆机于动，既动则有祸福之基。",
    "verdict": "凶",
    "timing": "出月不破；实破之日、合日不破。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.month_break.03",
    "source": {
      "book": "增删卜易",
      "chapter": "月破章第二十七"
    },
    "when": {
      "conditions": [
        "month-break",
        "hui-tou-sheng"
      ]
    },
    "text": "用神月破而动化回头生，若得变爻旺相，目下虽困顿破败，出月逢生必脱颖而出。",
    "verdict": "先难后易",
    "timing": "出月逢生之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.month_break.04",
    "source": {
      "book": "增删卜易",
      "chapter": "月破章第二十七"
    },
    "when": {
      "conditions": [
        "month-break",
        "transform-advance"
      ]
    },
    "text": "月破之爻动化进神，虽破而有奋进之机；待实破出月之期，大显身手。",
    "verdict": "先难后易",
    "timing": "出月进神当值之月日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.month_break.05",
    "source": {
      "book": "增删卜易",
      "chapter": "月破章第二十七"
    },
    "when": {
      "conditions": [
        "month-break",
        "hua-mu"
      ]
    },
    "text": "用神既临月破，又复动而化墓，此谓破墓相寻，万事难成，大凶之象。",
    "verdict": "凶",
    "timing": "破墓相随，无可救解。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.month_break.06",
    "source": {
      "book": "增删卜易",
      "chapter": "月破章第二十七"
    },
    "when": {
      "conditions": [
        "month-break"
      ]
    },
    "text": "忌神临月破，此吉兆也；忌神自顾不暇，安能伤及用神？吉庆可期。",
    "verdict": "吉",
    "timing": "当月无虞。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.xunkong.01",
    "source": {
      "book": "增删卜易",
      "chapter": "旬空章第二十六"
    },
    "when": {
      "conditions": [
        "xun-kong"
      ]
    },
    "text": "旺不为空，动不为空，有日建动爻生扶者不为空；动而化空、伏而旺相皆不为空。真空者，春土、夏金、秋木、三冬逢火。",
    "verdict": "成中有阻",
    "timing": "应于填实之日、冲空之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.xunkong.02",
    "source": {
      "book": "增删卜易",
      "chapter": "旬空章第二十六"
    },
    "when": {
      "conditions": [
        "xun-kong"
      ]
    },
    "text": "真空无救：用神休囚受克，再落旬空，犹如枯木逢霜，此为真空，万无一成。",
    "verdict": "不成",
    "timing": "空无所归。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.xunkong.03",
    "source": {
      "book": "增删卜易",
      "chapter": "旬空章第二十六"
    },
    "when": {
      "conditions": [
        "xun-kong",
        "moving"
      ]
    },
    "text": "动不为空：动爻落旬空，非真真空也。神动不虚，待出空冲空之日，大展威神。",
    "verdict": "先难后易",
    "timing": "出空填实之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.xunkong.04",
    "source": {
      "book": "增删卜易",
      "chapter": "xun-kong"
    },
    "when": {
      "conditions": [
        "hua-kong"
      ]
    },
    "text": "动而化空：动爻发动变出空亡之爻，行事如履浮冰，眼前得势，后无着落。",
    "verdict": "成中有阻",
    "timing": "变爻出空填实之日方见定数。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.xunkong.05",
    "source": {
      "book": "增删卜易",
      "chapter": "旬空章第二十六"
    },
    "when": {
      "conditions": [
        "xun-kong"
      ]
    },
    "text": "世爻落旬空：自心多疑不定，凡谋不实，怠惰迟疑，进退两难。",
    "verdict": "成中有阻",
    "timing": "冲空之日意志方定。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.xunkong.06",
    "source": {
      "book": "增删卜易",
      "chapter": "旬空章第二十六"
    },
    "when": {
      "conditions": [
        "xun-kong"
      ]
    },
    "text": "应爻落旬空：对方不实，虚情假意，托人不可靠，合作多变诈。",
    "verdict": "不成",
    "timing": "实空之日见真伪。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.xunkong.07",
    "source": {
      "book": "增删卜易",
      "chapter": "旬空章第二十六"
    },
    "when": {
      "conditions": [
        "xun-kong"
      ]
    },
    "text": "忌神旬空：大吉之征兆。忌神避空，祸端潜伏不发；唯须防出空反噬。",
    "verdict": "吉",
    "timing": "防出空逢值之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.xunkong.08",
    "source": {
      "book": "增删卜易",
      "chapter": "旬空章第二十六"
    },
    "when": {
      "conditions": [
        "xun-kong"
      ]
    },
    "text": "避凶化空：凶事逢空则散，问病逢官鬼空则易愈，问讼逢官鬼空则不了了之。",
    "verdict": "吉",
    "timing": "当空即安。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.mu.01",
    "source": {
      "book": "增删卜易",
      "chapter": "生旺墓绝章第二十六"
    },
    "when": {
      "conditions": [
        "ru-mu"
      ]
    },
    "text": "水土长生在申、旺在子、墓在辰、绝在巳。金长生在巳、旺在酉、墓在丑、绝在寅。木长生在亥、旺在卯、墓在未、绝在申。火长生在寅、旺在午、墓在戌、绝在亥。",
    "verdict": "成",
    "timing": "随五行生旺墓绝之支定应期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.mu.02",
    "source": {
      "book": "增删卜易",
      "chapter": "随鬼入墓章第三十"
    },
    "when": {
      "conditions": [
        "ru-mu"
      ]
    },
    "text": "世爻入墓，或随鬼入墓，心智昏蒙，举步维艰；若非日辰动爻冲开墓库，动弹不得。",
    "verdict": "凶",
    "timing": "冲开墓库之月日方得解脱。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.mu.03",
    "source": {
      "book": "增删卜易",
      "chapter": "生旺墓绝章第二十六"
    },
    "when": {
      "conditions": [
        "hua-mu"
      ]
    },
    "text": "用神动而化墓，此谓自投罗网；凡求谋百无一成，进退受困，入牢入阱。",
    "verdict": "不成",
    "timing": "冲开变爻之墓库日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.mu.04",
    "source": {
      "book": "增删卜易",
      "chapter": "生旺墓绝章第二十六"
    },
    "when": {
      "conditions": [
        "hua-jue"
      ]
    },
    "text": "用神化绝，生机断绝；如万木逢秋，气运衰绝；唯得月建生扶者，绝处逢生。",
    "verdict": "凶",
    "timing": "逢绝无救，逢生有望。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.mu.05",
    "source": {
      "book": "增删卜易",
      "chapter": "生旺墓绝章第二十六"
    },
    "when": {
      "conditions": [
        "hua-jue",
        "hui-tou-sheng"
      ]
    },
    "text": "绝处逢生：绝爻若得月日动爻相生，凶中转泰；如死灰复燃，险象环生而终见生机。",
    "verdict": "先难后易",
    "timing": "生生之日大吉。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.mu.06",
    "source": {
      "book": "增删卜易",
      "chapter": "生旺墓绝章第二十六"
    },
    "when": {
      "conditions": [
        "ru-mu"
      ]
    },
    "text": "财爻入墓，求财难得，资金积压冻结，催讨无门；须待冲墓之期方能解冻。",
    "verdict": "成中有阻",
    "timing": "冲财库之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.mu.07",
    "source": {
      "book": "增删卜易",
      "chapter": "生旺墓绝章第二十六"
    },
    "when": {
      "conditions": [
        "ru-mu"
      ]
    },
    "text": "官鬼入墓，问官难升，问讼难结；若问病官鬼入墓，病气潜藏难根治。",
    "verdict": "成中有阻",
    "timing": "冲开官墓之时。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.mu.08",
    "source": {
      "book": "增删卜易",
      "chapter": "随鬼入墓章第三十"
    },
    "when": {
      "conditions": [
        "ru-mu"
      ]
    },
    "text": "助鬼伤身：世爻随鬼入墓，又逢忌神发动，大祸临头；急须祈福避匿，不可造次。",
    "verdict": "凶",
    "timing": "避凶免难于克日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.mu.09",
    "source": {
      "book": "增删卜易",
      "chapter": "生旺墓绝章第二十六"
    },
    "when": {
      "conditions": [
        "ru-mu"
      ]
    },
    "text": "破墓为开：爻虽入墓，若墓库之支逢月破日冲，此破墓开库，反而脱网而出，不以为忌。",
    "verdict": "吉",
    "timing": "破库冲开之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.mu.10",
    "source": {
      "book": "增删卜易",
      "chapter": "生旺墓绝章第二十六"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "长生之爻，如人初生，渐向繁荣；长生之位主吉，谋事百顺，发源之地。",
    "verdict": "吉",
    "timing": "逢长生月日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.mu.11",
    "source": {
      "book": "增删卜易",
      "chapter": "生旺墓绝章第二十六"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "帝旺之爻，如日中天，极盛而防衰；盛极必反，吉事早成，迟则生变。",
    "verdict": "成",
    "timing": "速应帝旺之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.mu.12",
    "source": {
      "book": "增删卜易",
      "chapter": "生旺墓绝章第二十六"
    },
    "when": {
      "conditions": [
        "hua-mu"
      ]
    },
    "text": "忌神入墓化墓，万幸之至；恶犬锁笼，祸胎禁锢，用神得以安享荣华。",
    "verdict": "吉",
    "timing": "入墓当期安享。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.dongbian.01",
    "source": {
      "book": "增删卜易",
      "chapter": "进神退神章第二十九"
    },
    "when": {
      "conditions": [
        "transform-advance"
      ]
    },
    "text": "化进神：亥化子、寅化卯、巳化午、申化酉、丑化辰、辰化未、未化戌。如春木抽条，由微至著，步步高升。",
    "verdict": "吉",
    "timing": "逢进神填实之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.dongbian.02",
    "source": {
      "book": "增删卜易",
      "chapter": "进神退神章第二十九"
    },
    "when": {
      "conditions": [
        "transform-retreat"
      ]
    },
    "text": "化退神：子化亥、卯化寅、午化巳、酉化申、辰化丑、未化辰、戌化未。如秋叶凋零，退缩废弛，终归减损。",
    "verdict": "不成",
    "timing": "退后之月日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.dongbian.03",
    "source": {
      "book": "增删卜易",
      "chapter": "进神退神章第二十九"
    },
    "when": {
      "conditions": [
        "transform-advance",
        "month-break"
      ]
    },
    "text": "动值月破而化进神，目下虽困于破，出月进气依然得用；此为大器晚成之象。",
    "verdict": "先难后易",
    "timing": "出月逢进神当权之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.dongbian.04",
    "source": {
      "book": "增删卜易",
      "chapter": "进神退神章第二十九"
    },
    "when": {
      "conditions": [
        "transform-retreat",
        "xun-kong"
      ]
    },
    "text": "动化退神而落旬空，避退不前；若占防灾息讼，其祸自退，不战自屈。",
    "verdict": "吉",
    "timing": "退空之时平安。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.dongbian.05",
    "source": {
      "book": "增删卜易",
      "chapter": "动变生克冲合章第十五"
    },
    "when": {
      "conditions": [
        "hui-tou-sheng"
      ]
    },
    "text": "动化回头生，生力无穷。变爻源源不绝资助本爻，测财财旺，测功名登科，诸占皆吉。",
    "verdict": "吉",
    "timing": "生神值日之时。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.dongbian.06",
    "source": {
      "book": "增删卜易",
      "chapter": "动变生克冲合章第十五"
    },
    "when": {
      "conditions": [
        "hui-tou-ke"
      ]
    },
    "text": "动化回头克，克本自身。生变自戕，自讨苦吃；谋事必因内部倒戈或己身失着而遭崩沮。",
    "verdict": "凶",
    "timing": "克爻值日之时。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.dongbian.07",
    "source": {
      "book": "增删卜易",
      "chapter": "动变章第七"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "动动相连：动爻发而变爻生之，如顺风扬帆；动爻发而变爻克之，如逆水触礁。",
    "verdict": "成中有阻",
    "timing": "动变较量衰旺之时。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.dongbian.08",
    "source": {
      "book": "增删卜易",
      "chapter": "动变章第七"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "变爻不克他爻：变爻专一生克本位动爻，不能跨越宫分侵陵他爻，此纳甲之大法。",
    "verdict": "成",
    "timing": "本爻受报之时。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.dongbian.09",
    "source": {
      "book": "增删卜易",
      "chapter": "动变章第七"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "动化比和：本变同支同五行，兄弟并力，声势扩大，唯须防争夺分润。",
    "verdict": "成中有阻",
    "timing": "比和当令之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.dongbian.10",
    "source": {
      "book": "增删卜易",
      "chapter": "动变章第七"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "阳动变阴，阴动变阳。动为事物之始，变为事物之终；始吉终凶者动生变克，始凶终吉者动克变生。",
    "verdict": "先难后易",
    "timing": "视变爻定归宿。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.dongbian.11",
    "source": {
      "book": "增删卜易",
      "chapter": "进神退神章第二十九"
    },
    "when": {
      "conditions": [
        "transform-advance"
      ]
    },
    "text": "吉神化进神，吉而愈吉；凶神化进神，凶上加凶，其灾大烈。",
    "verdict": "凶",
    "timing": "进神当令之月。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.dongbian.12",
    "source": {
      "book": "增删卜易",
      "chapter": "进神退神章第二十九"
    },
    "when": {
      "conditions": [
        "transform-retreat"
      ]
    },
    "text": "吉神化退神，福分消耗；凶神化退神，灾咎渐释，转危为平。",
    "verdict": "成中有阻",
    "timing": "退神衰落之月。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.dongbian.13",
    "source": {
      "book": "增删卜易",
      "chapter": "动变生克冲合章第十五"
    },
    "when": {
      "conditions": [
        "hua-kong"
      ]
    },
    "text": "化空难恃：用爻动而化入空亡，虚花难结实；纵百般努力，行至变位化作泡影。",
    "verdict": "不成",
    "timing": "空无所凭。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.dongbian.14",
    "source": {
      "book": "增删卜易",
      "chapter": "动变生克冲合章第十五"
    },
    "when": {
      "conditions": [
        "hua-jue"
      ]
    },
    "text": "化绝无路：用爻化绝于变爻，如入穷巷断桥，后退无路，前行无归。",
    "verdict": "凶",
    "timing": "绝期立凶。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.dongbian.15",
    "source": {
      "book": "增删卜易",
      "chapter": "动变生克冲合章第十五"
    },
    "when": {
      "conditions": [
        "hua-mu"
      ]
    },
    "text": "化墓闭塞：动爻化入变爻之墓库，智囊封闭，光明入晦，诸事蒙蔽受压。",
    "verdict": "不成",
    "timing": "破墓冲库之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.dongbian.16",
    "source": {
      "book": "增删卜易",
      "chapter": "动变生克冲合章第十五"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "动变相冲：动爻与变爻地支正冲，名为化冲。自相矛盾，内外反乱，事必反复波折。",
    "verdict": "成中有阻",
    "timing": "冲动冲变之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.dongbian.17",
    "source": {
      "book": "增删卜易",
      "chapter": "动变生克冲合章第十五"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "动变相合：动爻与变爻地支六合，名为化合。羁绊缠绵，事有留连，吉事愈坚，凶事难解。",
    "verdict": "成",
    "timing": "逢冲开解缚之时。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.dongbian.18",
    "source": {
      "book": "增删卜易",
      "chapter": "动变章第七"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "连环动变：多爻齐动，审其动爻生克用神与世爻之次第，首观用神，次视世应。",
    "verdict": "成中有阻",
    "timing": "逐爻当值之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.dongbian.19",
    "source": {
      "book": "增删卜易",
      "chapter": "动变章第七"
    },
    "when": {
      "conditions": [
        "all-quiet"
      ]
    },
    "text": "六爻安静守常：六爻全无发动，卦体镇静，人事无突变之机，当待岁月巡回当令。",
    "verdict": "吉",
    "timing": "当令逢值之月。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.dongbian.20",
    "source": {
      "book": "增删卜易",
      "chapter": "动变章第七"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "动多则乱：卦中动爻过多（四五爻动），事机纷扰，心意难专，谋事多生支节变端。",
    "verdict": "成中有阻",
    "timing": "动极思静之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.chonghe.01",
    "source": {
      "book": "增删卜易",
      "chapter": "六冲章第二十"
    },
    "when": {
      "conditions": [
        "liu-chong-gua"
      ]
    },
    "text": "六冲卦占事：诸占谋事不久，散多成少。婚必难和，求财不聚，词讼必散，官非自消。",
    "verdict": "不成",
    "timing": "散于冲决之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.chonghe.02",
    "source": {
      "book": "增删卜易",
      "chapter": "六冲章第二十"
    },
    "when": {
      "conditions": [
        "liu-chong-gua"
      ],
      "topic": [
        "疾病"
      ]
    },
    "text": "问病逢六冲卦：近病逢冲即愈，久病逢冲必死。神气因冲而荡散也。",
    "verdict": "先难后易",
    "timing": "冲动之日近病除。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.chonghe.03",
    "source": {
      "book": "增删卜易",
      "chapter": "六合章第十九"
    },
    "when": {
      "conditions": [
        "liu-he-gua"
      ]
    },
    "text": "六合卦占事：凡占百事谐和，长久稳固。结缡大吉，求财聚积，谋业荣隆；唯占词讼忧疑不解。",
    "verdict": "成",
    "timing": "合期合日必显。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.chonghe.04",
    "source": {
      "book": "增删卜易",
      "chapter": "六合章第十九"
    },
    "when": {
      "conditions": [
        "liu-he-gua"
      ],
      "topic": [
        "诉讼"
      ]
    },
    "text": "问讼事逢六合卦：讼事羁缠难解，牢狱羁留难出；忧疑长抱，难以速结。",
    "verdict": "凶",
    "timing": "逢冲开六合之日方脱。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.chonghe.05",
    "source": {
      "book": "增删卜易",
      "chapter": "六冲章第二十"
    },
    "when": {
      "conditions": [
        "liu-chong-gua",
        "moving"
      ]
    },
    "text": "冲中逢合：本卦六冲而变卦六合，先散后聚，先离后合，先难后易，终归和好。",
    "verdict": "先离后合",
    "timing": "逢变卦相合之月日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.chonghe.06",
    "source": {
      "book": "增删卜易",
      "chapter": "六合章第十九"
    },
    "when": {
      "conditions": [
        "liu-he-gua",
        "moving"
      ]
    },
    "text": "合处逢冲：本卦六合而变卦六冲，始合终离，先好后乖，交游难持久，婚姻生翻覆。",
    "verdict": "先合后离",
    "timing": "逢变卦相冲之月日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.chonghe.07",
    "source": {
      "book": "增删卜易",
      "chapter": "六冲章第二十"
    },
    "when": {
      "conditions": [
        "liu-chong-gua",
        "moving"
      ]
    },
    "text": "六冲变六冲：始乱终乱，波澜不息；反复冲荡，谋事全无着落，徒劳心力。",
    "verdict": "不成",
    "timing": "破荡无归期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.chonghe.08",
    "source": {
      "book": "增删卜易",
      "chapter": "六合章第十九"
    },
    "when": {
      "conditions": [
        "liu-he-gua",
        "moving"
      ]
    },
    "text": "六合变六合：锦上添花，固若金汤；百计皆全，世代相守，世出世间大吉之象。",
    "verdict": "吉",
    "timing": "常青不衰。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.chonghe.09",
    "source": {
      "book": "增删卜易",
      "chapter": "六冲章第二十"
    },
    "when": {
      "conditions": [
        "shi-ying-chong"
      ]
    },
    "text": "世应相冲：彼此相左，彼我交攻；客客气气难交心，求谋互设防范，难成大事。",
    "verdict": "不成",
    "timing": "冲决相背之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.chonghe.10",
    "source": {
      "book": "增删卜易",
      "chapter": "六合章第十九"
    },
    "when": {
      "conditions": [
        "shi-ying-he"
      ]
    },
    "text": "世应相合：宾主欢畅，情投意合；求官得贵人青睐，问婚得良缘，求财得合伙得力。",
    "verdict": "吉",
    "timing": "生旺相合之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.chonghe.11",
    "source": {
      "book": "增删卜易",
      "chapter": "六冲章第二十"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "爻逢冲克：爻见对冲为冲破，动而遇冲为冲散；唯旺动之爻逢冲，反为激发生威。",
    "verdict": "成中有阻",
    "timing": "冲动冲旺之时。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.chonghe.12",
    "source": {
      "book": "增删卜易",
      "chapter": "六合章第十九"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "爻逢六合：子丑合土、寅亥合木、卯戌合火、辰酉合金、巳申合水、午未合土。得合者牢固，失合者解体。",
    "verdict": "成",
    "timing": "合期合化之令。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.chonghe.13",
    "source": {
      "book": "增删卜易",
      "chapter": "六合章第十九"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "合起与合住：静爻被日合谓之合起，吉凶立发；动爻被日合谓之合住，羁绊难动。",
    "verdict": "成中有阻",
    "timing": "逢冲日开解。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.chonghe.14",
    "source": {
      "book": "增删卜易",
      "chapter": "六冲章第二十"
    },
    "when": {
      "conditions": [
        "liu-chong-gua"
      ]
    },
    "text": "八纯卦皆六冲：乾坎艮震巽离坤兑八纯卦，初四二五三上爻爻相冲，根基虚浮，凡事须防中道变卦。",
    "verdict": "不成",
    "timing": "冲散之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.fanyin.01",
    "source": {
      "book": "增删卜易",
      "chapter": "反伏章第二十五"
    },
    "when": {
      "conditions": [
        "fan-yin"
      ]
    },
    "text": "反吟之卦，内反外反。天翻地覆，去而复来，成而复败；事多波折翻覆，人心不安。",
    "verdict": "成中有阻",
    "timing": "冲反平息之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.fanyin.02",
    "source": {
      "book": "增删卜易",
      "chapter": "反伏章第二十五"
    },
    "when": {
      "conditions": [
        "fan-yin"
      ]
    },
    "text": "内卦反吟：家庭内部争执翻腾，宅舍不安，内院起火，亲朋反目。",
    "verdict": "凶",
    "timing": "内卦平定之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.fanyin.03",
    "source": {
      "book": "增删卜易",
      "chapter": "反伏章第二十五"
    },
    "when": {
      "conditions": [
        "fan-yin"
      ]
    },
    "text": "外卦反吟：外部环境风云突变，交游翻脸，外出遇阻，迁徙无定。",
    "verdict": "成中有阻",
    "timing": "外卦相合之月日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.fanyin.04",
    "source": {
      "book": "增删卜易",
      "chapter": "反伏章第二十五"
    },
    "when": {
      "conditions": [
        "fu-yin"
      ]
    },
    "text": "伏吟之卦，呻吟忧郁。地支全同不变，如困兽犹斗，动弹不得；事无进展，愁肠百转。",
    "verdict": "不成",
    "timing": "冲开伏吟之年月。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.fanyin.05",
    "source": {
      "book": "增删卜易",
      "chapter": "反伏章第二十五"
    },
    "when": {
      "conditions": [
        "fu-yin"
      ]
    },
    "text": "内卦伏吟：忧在闺门，内顾多忧，沉疴绵惙，压抑沉闷。",
    "verdict": "凶",
    "timing": "内爻逢冲破伏之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.fanyin.06",
    "source": {
      "book": "增删卜易",
      "chapter": "反伏章第二十五"
    },
    "when": {
      "conditions": [
        "fu-yin"
      ]
    },
    "text": "外卦伏吟：忧在外境，外事羁绊迟滞，行止难决，裹足不前。",
    "verdict": "成中有阻",
    "timing": "外爻逢冲之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.fanyin.07",
    "source": {
      "book": "增删卜易",
      "chapter": "反伏章第二十五"
    },
    "when": {
      "conditions": [
        "fan-yin",
        "moving"
      ]
    },
    "text": "爻相冲而卦不反吟：唯局部爻线相战，小风波耳，大局无碍，勿慌勿躁。",
    "verdict": "成中有阻",
    "timing": "局部冲破之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.fanyin.08",
    "source": {
      "book": "增删卜易",
      "chapter": "反伏章第二十五"
    },
    "when": {
      "conditions": [
        "fan-yin"
      ]
    },
    "text": "反吟若用神乘旺得生：虽有反复惊涛骇浪，终能乘风破浪归帆，先惊后喜。",
    "verdict": "先难后易",
    "timing": "生旺之月日克定。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.feifu.01",
    "source": {
      "book": "增删卜易",
      "chapter": "飞伏神章第二十八"
    },
    "when": {
      "conditions": [
        "yong-shen-bu-xian"
      ]
    },
    "text": "伏神有用者有五：得日月生者一也；得飞神生者二也；得动爻生者三也；得日月动爻冲克飞神者四也；飞神空破休囚休绝者五也。",
    "verdict": "先难后易",
    "timing": "伏神出透值日之时。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.feifu.02",
    "source": {
      "book": "增删卜易",
      "chapter": "飞伏神章第二十八"
    },
    "when": {
      "conditions": [
        "yong-shen-bu-xian"
      ]
    },
    "text": "伏神终不能出者有五：休囚无气一也；受日月刑克二也；受飞神旺克三也；遇墓绝于日月飞爻四也；伏逢旬空月破休囚五也。",
    "verdict": "不成",
    "timing": "难出无期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.feifu.03",
    "source": {
      "book": "增删卜易",
      "chapter": "飞伏神章第二十八"
    },
    "when": {
      "conditions": [
        "yong-shen-bu-xian"
      ]
    },
    "text": "飞来生伏得长生：飞神生地支伏神，若飞神旺相，伏神如婴儿得乳，大吉之兆。",
    "verdict": "吉",
    "timing": "生伏之期见效。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.feifu.04",
    "source": {
      "book": "增删卜易",
      "chapter": "飞伏神章第二十八"
    },
    "when": {
      "conditions": [
        "yong-shen-bu-xian"
      ]
    },
    "text": "飞来克伏为压制：飞神克制伏神，泰山压顶，暗无天日；须待日辰冲破飞神，伏神方见天日。",
    "verdict": "成中有阻",
    "timing": "冲克飞神之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.feifu.05",
    "source": {
      "book": "增删卜易",
      "chapter": "飞伏神章第二十八"
    },
    "when": {
      "conditions": [
        "yong-shen-bu-xian"
      ]
    },
    "text": "伏克飞神为出暴：伏神克飞神，能破土而出；虽费心机搏击，终能破茧成蝶。",
    "verdict": "先难后易",
    "timing": "伏神当权克制飞神之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.feifu.06",
    "source": {
      "book": "增删卜易",
      "chapter": "飞伏神章第二十八"
    },
    "when": {
      "conditions": [
        "yong-shen-bu-xian"
      ]
    },
    "text": "伏生飞神为泄气：伏神去生飞神，自耗元真，为人作嫁衣，自身匮乏难济。",
    "verdict": "成中有阻",
    "timing": "泄气无益之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.feifu.07",
    "source": {
      "book": "增删卜易",
      "chapter": "飞伏神章第二十八"
    },
    "when": {
      "conditions": [
        "yong-shen-bu-xian"
      ]
    },
    "text": "伏神空亡，若得日辰冲空，亦为有用；若逢真空，则深伏九泉无复出之日。",
    "verdict": "成中有阻",
    "timing": "冲空填实之时。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.feifu.08",
    "source": {
      "book": "增删卜易",
      "chapter": "飞伏神章第二十八"
    },
    "when": {
      "conditions": [
        "yong-shen-bu-xian"
      ]
    },
    "text": "飞神空亡，伏神易出：飞神既落空亡，门户洞开，伏神毫无遮拦，脱颖即出。",
    "verdict": "吉",
    "timing": "飞神空虚即出。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yingqi.01",
    "source": {
      "book": "增删卜易",
      "chapter": "各门类应期总注章第又二十六"
    },
    "when": {
      "conditions": [
        "all-quiet"
      ]
    },
    "text": "静爻逢值逢冲：六爻安静无动爻者，吉凶之应，应于用神临值之日，或冲用神之月日。",
    "verdict": "成",
    "timing": "用爻值日或逢冲之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yingqi.02",
    "source": {
      "book": "增删卜易",
      "chapter": "各门类应期总注章第又二十六"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "动爻逢值逢合：一爻独发者，应在动爻当值之日，或动爻逢合之日（子动应在子丑日）。",
    "verdict": "成",
    "timing": "动爻临值或逢合之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yingqi.03",
    "source": {
      "book": "增删卜易",
      "chapter": "各门类应期总注章第又二十六"
    },
    "when": {
      "conditions": [
        "xun-kong"
      ]
    },
    "text": "旬空应期：爻落旬空，应于出空填实之日，或冲空之日（甲子旬空戌亥，应在戌亥日或辰巳日）。",
    "verdict": "成",
    "timing": "出空填实冲空之月日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yingqi.04",
    "source": {
      "book": "增删卜易",
      "chapter": "各门类应期总注章第又二十六"
    },
    "when": {
      "conditions": [
        "month-break"
      ]
    },
    "text": "月破应期：爻临月破，当月难应；必应于出月当令之月，或实破之日、合破之日。",
    "verdict": "先难后易",
    "timing": "出月、实破、合破之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yingqi.05",
    "source": {
      "book": "增删卜易",
      "chapter": "各门类应期总注章第又二十六"
    },
    "when": {
      "conditions": [
        "ru-mu"
      ]
    },
    "text": "入墓应期：爻入墓库者，应于冲开墓库之月日（金入丑墓，应在未日冲丑）。",
    "verdict": "成中有阻",
    "timing": "冲破墓库之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yingqi.06",
    "source": {
      "book": "增删卜易",
      "chapter": "各门类应期总注章第又二十六"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "爻逢合住：爻得日辰动爻合住者，其动受阻，必应于逢冲之日破合见功。",
    "verdict": "成",
    "timing": "冲开六合之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yingqi.07",
    "source": {
      "book": "增删卜易",
      "chapter": "各门类应期总注章第又二十六"
    },
    "when": {
      "conditions": [
        "transform-advance"
      ]
    },
    "text": "进神应期：动化进神者，应于进神当值之月日，或进神逢合逢生之日。",
    "verdict": "吉",
    "timing": "变出进神之月日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yingqi.08",
    "source": {
      "book": "增删卜易",
      "chapter": "各门类应期总注章第又二十六"
    },
    "when": {
      "conditions": [
        "transform-retreat"
      ]
    },
    "text": "退神应期：动化退神者，事败应于退神当值受克之期，如由盛转衰之节。",
    "verdict": "不成",
    "timing": "退后临衰之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yingqi.09",
    "source": {
      "book": "增删卜易",
      "chapter": "各门类应期总注章第又二十六"
    },
    "when": {
      "conditions": [
        "yong-shen-bu-xian"
      ]
    },
    "text": "伏神应期：伏神有用者，应于伏神出透之日，或冲克飞神之日。",
    "verdict": "成",
    "timing": "伏神值日或破飞之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yingqi.10",
    "source": {
      "book": "增删卜易",
      "chapter": "各门类应期总注章第又二十六"
    },
    "when": {
      "conditions": [
        "liu-chong-gua"
      ]
    },
    "text": "六冲应期：冲散之期，近应于即日冲动，远应于逢冲之月。",
    "verdict": "不成",
    "timing": "冲克立见。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yingqi.11",
    "source": {
      "book": "增删卜易",
      "chapter": "各门类应期总注章第又二十六"
    },
    "when": {
      "conditions": [
        "liu-he-gua"
      ]
    },
    "text": "六合应期：和顺之期，应于相合当值之月日，凡事长久。",
    "verdict": "成",
    "timing": "合期合日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yingqi.12",
    "source": {
      "book": "增删卜易",
      "chapter": "各门类应期总注章第又二十六"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "休囚应期：用神休囚无力者，待至生旺之月日方得发祥。",
    "verdict": "先难后易",
    "timing": "四季生旺之月。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yingqi.13",
    "source": {
      "book": "增删卜易",
      "chapter": "各门类应期总注章第又二十六"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "旺极应期：用神乘旺极盛者，吉事当防衰歇，凶事应于盛极而毙之期。",
    "verdict": "成中有阻",
    "timing": "极盛转休之交。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yingqi.14",
    "source": {
      "book": "增删卜易",
      "chapter": "各门类应期总注章第又二十六"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "远应年月，近应日时：事体大者以年月论，事体小者以日时断。",
    "verdict": "成",
    "timing": "因事体宏纤定断。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yingqi.15",
    "source": {
      "book": "增删卜易",
      "chapter": "各门类应期总注章第又二十六"
    },
    "when": {
      "conditions": [
        "hui-tou-sheng"
      ]
    },
    "text": "回头生应期：应在变爻回头生旺之月日，得水得土顺行。",
    "verdict": "吉",
    "timing": "变爻逢生逢值之时。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yingqi.16",
    "source": {
      "book": "增删卜易",
      "chapter": "各门类应期总注章第又二十六"
    },
    "when": {
      "conditions": [
        "hui-tou-ke"
      ]
    },
    "text": "回头克应期：大祸应在变爻临值克煞之月日。",
    "verdict": "凶",
    "timing": "变爻克煞当值之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yingqi.17",
    "source": {
      "book": "增删卜易",
      "chapter": "各门类应期总注章第又二十六"
    },
    "when": {
      "conditions": [
        "hua-jue"
      ]
    },
    "text": "化绝应期：绝处待生，应在逢长生之月日，绝境逢救。",
    "verdict": "先难后易",
    "timing": "长生临值之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yingqi.18",
    "source": {
      "book": "增删卜易",
      "chapter": "各门类应期总注章第又二十六"
    },
    "when": {
      "conditions": [
        "hua-kong"
      ]
    },
    "text": "化空应期：变入空亡，待变爻出空实冲之日见吉凶。",
    "verdict": "成中有阻",
    "timing": "变爻出空填实之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yingqi.19",
    "source": {
      "book": "增删卜易",
      "chapter": "各门类应期总注章第又二十六"
    },
    "when": {
      "conditions": [
        "fan-yin"
      ]
    },
    "text": "反吟应期：应在冲反平定、支神相合之月日。",
    "verdict": "成中有阻",
    "timing": "相合平定之时。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yingqi.20",
    "source": {
      "book": "增删卜易",
      "chapter": "各门类应期总注章第又二十六"
    },
    "when": {
      "conditions": [
        "fu-yin"
      ]
    },
    "text": "伏吟应期：应在冲开伏吟地支之年、月、日。",
    "verdict": "先难后易",
    "timing": "冲破伏吟之时。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yingqi.21",
    "source": {
      "book": "增删卜易",
      "chapter": "各门类应期总注章第又二十六"
    },
    "when": {
      "conditions": [
        "dark-move"
      ]
    },
    "text": "暗动应期：暗动应速，多在即日，或冲动之日辰相合之期。",
    "verdict": "吉",
    "timing": "暗动逢合之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.yingqi.22",
    "source": {
      "book": "增删卜易",
      "chapter": "各门类应期总注章第又二十六"
    },
    "when": {
      "conditions": [
        "day-break"
      ]
    },
    "text": "日破应期：既破且休，无有复起之期；典籍未载定期之法。",
    "verdict": "凶",
    "timing": "典籍未载定期之法。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.misc.01",
    "source": {
      "book": "增删卜易",
      "chapter": "独发章第三十一"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "一爻独发：五爻安静，一爻独发，此神兆机之枢纽，万事吉凶全系于此一爻。独发逢生则吉，独发变克则凶。",
    "verdict": "成中有阻",
    "timing": "独发之爻当值之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.misc.02",
    "source": {
      "book": "增删卜易",
      "chapter": "独发章第三十一"
    },
    "when": {
      "conditions": [
        "all-quiet"
      ]
    },
    "text": "独静：众爻皆动，一爻独静，此所谓乱中独醒，其神机藏于独静之爻，当观其是生是用。",
    "verdict": "成中有阻",
    "timing": "独静之爻值日之时。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.misc.03",
    "source": {
      "book": "增删卜易",
      "chapter": "两现章第三十二"
    },
    "when": {
      "conditions": [
        "yong-shen-liang-xian"
      ]
    },
    "text": "用神两现，取动爻为用；两爻皆动，取旺相为用；两爻皆静，取不破不空者为用。",
    "verdict": "成",
    "timing": "所选用神值日之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.misc.04",
    "source": {
      "book": "增删卜易",
      "chapter": "归魂游魂章第又二十六"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "游魂卦主心神不宁，谋事无常，游荡不定，行止漂泊。",
    "verdict": "成中有阻",
    "timing": "心意安定之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.misc.05",
    "source": {
      "book": "增删卜易",
      "chapter": "归魂游魂章第又二十六"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "归魂卦主思归还乡，事归本位，心意渐转，倦鸟思林。",
    "verdict": "吉",
    "timing": "归本逢合之时。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.misc.06",
    "source": {
      "book": "增删卜易",
      "chapter": "六神章第十八"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "青龙临爻发动：主喜庆、宴乐、仁德、财喜临门，凡占吉利。",
    "verdict": "吉",
    "timing": "青龙值旺之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.misc.07",
    "source": {
      "book": "增删卜易",
      "chapter": "六神章第十八"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "朱雀临爻发动：主文书、印信、声誉；若受克则生口舌、非议、争辩之忧。",
    "verdict": "成中有阻",
    "timing": "朱雀临值之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.misc.08",
    "source": {
      "book": "增删卜易",
      "chapter": "六神章第十八"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "勾陈临爻发动：主田土、迟滞、勾连、留难，凡事迁延日久，不可速图。",
    "verdict": "成中有阻",
    "timing": "勾陈受制冲开之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.misc.09",
    "source": {
      "book": "增删卜易",
      "chapter": "六神章第十八"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "螣蛇临爻发动：主虚惊、怪异、噩梦、疑神疑鬼，事多虚惊无实祸。",
    "verdict": "成中有阻",
    "timing": "虚惊平复之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.misc.10",
    "source": {
      "book": "增删卜易",
      "chapter": "六神章第十八"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "白虎临爻发动：主风波、孝服、凶丧、血光、威权；占讼病大忌，唯武职大吉。",
    "verdict": "凶",
    "timing": "白虎逢制之时。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.misc.11",
    "source": {
      "book": "增删卜易",
      "chapter": "六神章第十八"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "玄武临爻发动：主阴私、盗贼、暧昧、欺瞒隐匿，须防暗算小人。",
    "verdict": "成中有阻",
    "timing": "玄武现形之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.misc.12",
    "source": {
      "book": "增删卜易",
      "chapter": "三刑章第二十一"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "三刑互见：寅巳申三刑、丑戌未三刑、子卯相刑、辰午酉亥自刑。刑主折磨、官非、创伤，凡占多阻滞。",
    "verdict": "凶",
    "timing": "三刑逢合逢破之时。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.misc.13",
    "source": {
      "book": "增删卜易",
      "chapter": "《星煞章》第三十三"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "星煞附和旺衰：贵人禄马天喜诸星煞，必须附丽于用神旺相，方能乘云借力；若用神休囚落空，星煞不能独操祸福。",
    "verdict": "吉",
    "timing": "随五行用神定期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.misc.14",
    "source": {
      "book": "增删卜易",
      "chapter": "《星煞章》第三十三"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "驿马临爻：主奔波、出差、调动、远行。马星受克则足伤难行，马星逢冲出空则行期迅捷。",
    "verdict": "成",
    "timing": "驿马逢冲逢值之期。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.misc.15",
    "source": {
      "book": "增删卜易",
      "chapter": "《星煞章》第三十三"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "天医临爻：占病最喜天医发动，得遇明医拔毒回春；天医休囚，名医难遇。",
    "verdict": "吉",
    "timing": "天医当值之日。"
  },
  {
    "kind": "rule",
    "status": "draft",
    "credibility": 5,
    "id": "zsy.misc.16",
    "source": {
      "book": "增删卜易",
      "chapter": "《星煞章》第三十三"
    },
    "when": {
      "conditions": [
        "moving"
      ]
    },
    "text": "禄神临身：禄为食禄衣禄俸禄，禄爻生世持世，衣食丰足，求名利皆吉。",
    "verdict": "吉",
    "timing": "禄神逢生当权之月。"
  }
];

export const RULES_DB: KBEntry[] = [...ZENGSHAN_CORE_RULES, ...DRAFT_RULES];
