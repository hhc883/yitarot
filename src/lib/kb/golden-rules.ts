import type { KBEntry } from './types';

/**
 * 《增删卜易》30 条核心黄金断法通则（权威精炼·定式准则）
 * 涵盖：生克主权、真假月破、真假旬空、动变机理、进退神、反伏吟、
 *       疾病逢冲逢合、随鬼入墓、绝处逢生、回头克、间爻、飞伏、连环接续等。
 * status: 'verified', credibility: 5
 */
export const ZENGSHAN_CORE_RULES: KBEntry[] = [
  {
    "id": "zsy.core.01",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "核心断法通则",
      "note": "生克之权在日月"
    },
    "when": {
      "note": "月建、日辰对卦中六爻之生克作用。"
    },
    "text": "月建、日辰为卦之纲领，司三秋之令，操万物之权。凡爻得月建生扶、日辰生扶，乃真旺相；虽遇动爻克制，亦能敌衡。爻若休囚而遭月克日刑，虽动而逢生亦如风中之烛。日月能生旺动之爻，亦能克衰绝之爻。",
    "verdict": "吉",
    "timing": "无特定义规，视生克双方之逢值、逢冲日定。",
    "credibility": 5
  },
  {
    "id": "zsy.core.02",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "核心断法通则",
      "note": "月破之真假与用神实破"
    },
    "when": {
      "conditions": [
        "month-break"
      ],
      "note": "爻支与月建相冲（如子月见午火爻）。"
    },
    "text": "与月相冲为月破。动爻逢破，其破不深；静爻休囚逢破，乃真破也。动而逢破者，得日辰动爻生扶，逢实破、逢合之日月仍能有用；伏神逢破，出伏亦难成事。爻破而静、更值休囚受克者，谓之百无一用。",
    "verdict": "吉",
    "timing": "动爻月破，多应在出月、实破（值该爻之日月）或逢合之日；真空真破者无应期。",
    "credibility": 5
  },
  {
    "id": "zsy.core.03",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "核心断法通则",
      "note": "旬空之真空与假空"
    },
    "when": {
      "conditions": [
        "xun-kong"
      ],
      "note": "爻临旬空。"
    },
    "text": "野鹤定空亡有三：动不为空，旺不为空，受日辰动爻生扶者不为空；唯有休囚无气、受克受刑、安静不动者，乃为真空。真空者到底成空，假空者出旬、逢冲之日即发。",
    "verdict": "吉",
    "timing": "旺相旬空者，应在出空之日（逢值）或冲空之日。",
    "credibility": 5
  },
  {
    "id": "zsy.core.04",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "核心断法通则",
      "note": "神兆机于动，动必有因"
    },
    "when": {
      "conditions": [
        "moving"
      ],
      "note": "卦有爻动。"
    },
    "text": "静者以静而待，动者机括发露。一卦吉凶，全系于发卦之动爻。动爻有力，能生克他爻；动爻变出之爻，只能回头生克冲合本位动爻，不得跨越生克他爻。动化回头生者大吉，动化回头克者大凶。",
    "verdict": "吉",
    "timing": "动而逢合，应在冲开之期；动而逢冲，应在逢合逢值之期。",
    "credibility": 5
  },
  {
    "id": "zsy.core.05",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "核心断法通则",
      "note": "进神退神之动变生克"
    },
    "when": {
      "conditions": [
        "moving",
        "transform-advance",
        "transform-retreat"
      ],
      "note": "亥化子、寅化卯、巳化午、申化酉、丑化辰、辰化未、未化戌、戌化丑（进神）；反之为退神。"
    },
    "text": "化进神者，如春苗得雨，其势愈增，久远吉凶不可限量；化退神者，如蚕老作茧，其势渐减，旺者退慢，衰者退速。用神化进，诸事亨通；忌神化进，大祸立至。动而化退，逢生不生，逢克减力。",
    "verdict": "成中有阻",
    "timing": "进神应在逢值、逢合之期；退神应在实退、退绝之期。",
    "credibility": 5
  },
  {
    "id": "zsy.core.06",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "核心断法通则",
      "note": "反吟伏吟之祸福深浅"
    },
    "when": {
      "topic": [
        "事业",
        "诉讼"
      ],
      "conditions": [
        "fan-yin",
        "fu-yin"
      ],
      "note": "卦见地支相冲相克之卦变（反吟）；卦爻地支不变且伏见同支（伏吟）。"
    },
    "text": "反吟主事体反复颠倒，去而复返，成而复败；内卦反吟内不安，外卦反吟外不安，内外俱反吟，家业荡然。伏吟主事体忧郁呻吟，进退维谷，如坐愁城。然反吟若用神旺相逢生，仅主反复周折，终归克定。",
    "verdict": "成中有阻",
    "timing": "冲破逢合或逢冲开墓库之月日为定。",
    "credibility": 5
  },
  {
    "id": "zsy.core.07",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "核心断法通则",
      "note": "合处逢冲与冲中逢合"
    },
    "when": {
      "topic": [
        "疾病",
        "婚恋",
        "出行"
      ],
      "conditions": [
        "moving",
        "liu-chong-gua",
        "liu-he-gua"
      ],
      "note": "六合卦变六冲卦，或动爻作合而日辰冲之；反之六冲变六合。"
    },
    "text": "六冲主散，六合主聚。六合变六冲，先合后离，始吉终凶，结盟反目，成事化虚；六冲变六合，散而复聚，破镜重圆，官事解散，婚姻失而复得。",
    "verdict": "先合后离",
    "timing": "合变冲者应在冲日；冲变合者应在合日。",
    "credibility": 5
  },
  {
    "id": "zsy.core.08",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "核心断法通则",
      "note": "近病逢冲即愈，久病逢冲必死"
    },
    "when": {
      "topic": [
        "疾病"
      ],
      "conditions": [
        "moving",
        "liu-chong-gua"
      ],
      "note": "占病遇六冲卦，或用神受日辰、动爻相冲。"
    },
    "text": "近病（暴病、新病），邪气客于体，逢冲则邪气溃散，不药而愈；久病（宿疾、重病），元气亏虚，逢冲则根本动摇，神脱魄散必死。",
    "verdict": "凶",
    "timing": "近病应于冲用、冲官之日退；久病应于冲散用神、逢墓之期绝。",
    "credibility": 5
  },
  {
    "id": "zsy.core.09",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "核心断法通则",
      "note": "久病逢合必死，近病逢合绵延"
    },
    "when": {
      "topic": [
        "疾病"
      ],
      "conditions": [
        "moving",
        "liu-he-gua"
      ],
      "note": "占病遇六合卦，或用神化合、动逢合。"
    },
    "text": "久病逢合，沉疴难拔，羁绊入地，生机闭塞必死；近病逢合，疾情牵缠，骤难除根，拖延迁延。",
    "verdict": "凶",
    "timing": "久病应于合绝受克之期；近病待冲开合神之日见轻。",
    "credibility": 5
  },
  {
    "id": "zsy.core.10",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "核心断法通则",
      "note": "随鬼入墓之真伪辨"
    },
    "when": {
      "relative": [
        "官鬼"
      ],
      "conditions": [
        "moving",
        "ru-mu"
      ],
      "note": "用神或世爻随官鬼同入日墓、动墓、变墓。"
    },
    "text": "古法重随鬼入墓，野鹤明辨：世爻或用神旺相逢生者，非真入墓，乃暂时藏匿或困顿；唯用神休囚无气，又见官鬼化墓、动爻入墓、日辰墓之，方作真凶，主受困深狱或病入黄泉。",
    "verdict": "凶",
    "timing": "真墓者逢冲墓之期难救；假墓者冲开墓库之日月脱困。",
    "credibility": 5
  },
  {
    "id": "zsy.core.11",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "核心断法通则",
      "note": "绝处逢生之复起"
    },
    "when": {
      "topic": [
        "疾病"
      ],
      "conditions": [
        "moving",
        "hua-jue"
      ],
      "note": "用神绝于月建、日辰或动爻，而得他爻生扶；或用爻化绝而变爻回头相生。"
    },
    "text": "用神处于绝地，得动爻相生，或得日辰生扶，谓之“绝处逢生”。如木绝在申，遇亥水发动生木；金绝在寅，遇辰戌丑未动而生金。凡逢此象，凶中见吉，绝处逢生，事已垂尽而复起。",
    "verdict": "先难后易",
    "timing": "应在生扶之神临值、生旺之月日。",
    "credibility": 5
  },
  {
    "id": "zsy.core.12",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "核心断法通则",
      "note": "忌神发动化回头克，反克为生"
    },
    "when": {
      "conditions": [
        "moving",
        "hui-tou-ke"
      ],
      "note": "克害用神之忌神发动，但忌神本身动化回头克。"
    },
    "text": "忌神虽凶，发动克用本主灾殃；若忌神动化回头之克（如土为忌神化寅卯木克土），则忌神自顾不暇，受变爻制伏，不能克害用神，名为“贪克忘克，身受其害”，吉兆也。",
    "verdict": "先难后易",
    "timing": "应在变爻克去忌神之日月成事。",
    "credibility": 5
  },
  {
    "id": "zsy.core.13",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "核心断法通则",
      "note": "间爻动发，阻隔必生"
    },
    "when": {
      "topic": [
        "婚恋",
        "诉讼"
      ],
      "conditions": [
        "moving"
      ],
      "note": "世爻与应爻之间二爻发动。"
    },
    "text": "世为我，应为彼，间爻为中人、媒妁、伴侣或地头阻隔。间爻发动，事多阻滞变卦。间爻临兄，主破财中阻、小人挑唆；间爻临官鬼，防官府勒索阻挠；间爻逢空化退，阻而不力，终能穿度。",
    "verdict": "成中有阻",
    "timing": "阻隔之化解，应在间爻受克、入墓或化绝之时。",
    "credibility": 5
  },
  {
    "id": "zsy.core.14",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "核心断法通则",
      "note": "飞伏引拔之法"
    },
    "when": {
      "conditions": [
        "yong-shen-bu-xian"
      ],
      "note": "卦中不见用神，寻本宫首卦（八纯卦）伏神。"
    },
    "text": "伏无提拔终徒尔，飞不推开难出头。飞神生伏神者为长生，伏神生飞神为泄气；伏神克飞神为出暴，飞神克伏神为受制。飞神逢空、破、休囚，或受日辰动爻冲克，则伏神易出；飞神旺相克伏，伏神到底难出。",
    "verdict": "吉",
    "timing": "应在冲去飞神、或伏神逢值透出之日月。",
    "credibility": 5
  },
  {
    "id": "zsy.core.15",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "核心断法通则",
      "note": "原神生用神，连环接续之吉"
    },
    "when": {
      "topic": [
        "疾病"
      ],
      "conditions": [
        "moving"
      ],
      "note": "忌神动生原神，原神动生用神。"
    },
    "text": "卦见凶煞，若遇动爻辗转相生，反化为大吉。如忌神未土动克子水用神，得申金原神亦动，则未土反生申金，申金再生子水，连环相生，贪生忘克，不仅无凶，反得横福。",
    "verdict": "吉",
    "timing": "应在原神临值或逢长生之日月。",
    "credibility": 5
  },
  {
    "id": "zsy.core.16",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "核心断法通则",
      "note": "占官求职，重在官文两旺"
    },
    "when": {
      "relative": [
        "父母",
        "官鬼"
      ],
      "topic": [
        "事业"
      ],
      "note": "以官鬼为官位，以父母为印绶文书。"
    },
    "text": "官鬼持世或生世，文书旺相，必得美职；子孙发动克官，削职夺权；兄弟持世发动，阻隔费耗；财爻动生官鬼，必资财力打点方成。官星化进神，高迁万里；官星化退神，左迁降调。",
    "verdict": "吉",
    "timing": "官星实破、逢合，或父母文书逢值逢生之日。",
    "credibility": 5
  },
  {
    "id": "zsy.core.17",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "核心断法通则",
      "note": "求财占利，子旺财兴"
    },
    "when": {
      "relative": [
        "妻财",
        "子孙"
      ],
      "topic": [
        "财运"
      ],
      "note": "以妻财爻为用神，以子孙爻为财源。"
    },
    "text": "财爻持世旺相，或财动生世、克世（用神克世主财必得），大发其财；子孙持世发财源滚滚；兄弟持世或兄爻发动，破耗耗散、防人侵夺。财爻伏于鬼下，谨防官盗；财爻伏于兄下，利为人分。",
    "verdict": "吉",
    "timing": "财爻逢生、逢值、逢出空之期得财。",
    "credibility": 5
  },
  {
    "id": "zsy.core.18",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "核心断法通则",
      "note": "防患避凶，子孙持世万事宁"
    },
    "when": {
      "relative": [
        "子孙"
      ],
      "conditions": [
        "moving"
      ],
      "note": "子孙爻持世或子孙发动。"
    },
    "text": "子孙乃克制官鬼之神，为解难之神、福德之星。世持子孙，或子孙大旺发动，虽遇盗贼官非、风波险阻，皆能逢凶化吉，化险为夷，百灾不侵。",
    "verdict": "吉",
    "timing": "子孙临值之日，忧患尽散。",
    "credibility": 5
  },
  {
    "id": "zsy.core.19",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "核心断法通则",
      "note": "占胎产，以子孙为胎儿，胎爻为胞衣"
    },
    "when": {
      "relative": [
        "子孙"
      ],
      "topic": [
        "other"
      ],
      "conditions": [
        "moving"
      ],
      "note": "子孙爻旺衰动静与胎爻临绝。"
    },
    "text": "子孙旺相，临青龙，母子平安；子孙化鬼、化绝、临白虎受克，防胎殒子亡。临产喜见六冲，冲则立下；若六合卦则生产迟滞。",
    "verdict": "吉",
    "timing": "逢冲之日即生；若子孙伏藏，冲出逢值之日落草。",
    "credibility": 5
  },
  {
    "id": "zsy.core.20",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "核心断法通则",
      "note": "占讼狱，世旺官衰必能免"
    },
    "when": {
      "relative": [
        "官鬼"
      ],
      "topic": [
        "事业",
        "诉讼"
      ],
      "note": "世爻、应爻与官鬼爻之生克对比。"
    },
    "text": "世克应者我赢，应克世者彼胜；世爻休囚受官鬼之克者，重罪难逃；世临子孙克去官鬼者，事散官休。若世爻动化回头生，逢凶化吉；官鬼化退，讼事将歇。",
    "verdict": "吉",
    "timing": "官鬼受克之日结案；官星旺相之日用刑。",
    "credibility": 5
  },
  {
    "id": "zsy.core.21",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "核心断法通则",
      "note": "动变两头卦，重在终局"
    },
    "when": {
      "conditions": [
        "moving"
      ],
      "note": "主卦吉而变卦凶，或主卦凶而变卦吉。"
    },
    "text": "凡爻动必有变，动爻为始，变爻为终。主卦虽吉，若动化回头克、动化绝、化退，始吉终凶；主卦虽困，若动化回头生、化进、化长生，始凶终吉。断事不可仅凭前卦，终局全在变象。",
    "verdict": "先难后易",
    "timing": "应期多在变爻地支逢值、逢冲之日月。",
    "credibility": 5
  },
  {
    "id": "zsy.core.22",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "核心断法通则",
      "note": "合起与冲起之机"
    },
    "when": {
      "conditions": [
        "moving",
        "dark-move"
      ],
      "note": "静爻遇日辰相冲为暗动（冲起）；静爻遇日辰相合为合起。"
    },
    "text": "静爻旺相，日辰冲之，为暗动，不声不响中成事或败事；休囚受冲，则为日破。静爻遇日辰相合，为合起，衰弱得生，提拔得力。",
    "verdict": "吉",
    "timing": "暗动之爻应期迅速，多在当日或冲日应验。",
    "credibility": 5
  },
  {
    "id": "zsy.core.23",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "核心断法通则",
      "note": "六兽断情不论吉凶主调"
    },
    "when": {
      "note": "青龙、朱雀、勾陈、腾蛇、白虎、玄武配六爻。"
    },
    "text": "野鹤力破古法诸神煞六兽定吉凶之谬，定论：“吉凶全由生克，六兽唯断情状”。白虎动虽主丧服风波，若生世仍为吉庆；青龙动虽主喜庆，若克世反招酒色之祸。",
    "verdict": "吉",
    "timing": "无特定义规，全依五行生克。",
    "credibility": 5
  },
  {
    "id": "zsy.core.24",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "核心断法通则",
      "note": "出行安危，世应生克与水陆之别"
    },
    "when": {
      "topic": [
        "出行"
      ],
      "note": "以世爻为自身，应爻为目的地。"
    },
    "text": "世旺得生，利于出行；世爻被克、化回头克，切莫登程。应爻生世，到彼获利；应爻克世，到彼遇祸。世爻动化合绊，身被绊住，难于起程。",
    "verdict": "吉",
    "timing": "冲开世爻合绊之日登程；用神生旺之期达地。",
    "credibility": 5
  },
  {
    "id": "zsy.core.25",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "核心断法通则",
      "note": "占家宅，以父母为舍宇，妻财为财粮"
    },
    "when": {
      "relative": [
        "父母",
        "官鬼",
        "妻财"
      ],
      "topic": [
        "家宅"
      ],
      "conditions": [
        "moving"
      ],
      "note": "父母爻、妻财爻、官鬼爻之旺衰动静。"
    },
    "text": "父母旺相，屋宇宽宏；财爻旺相，家资富足。最忌鬼动宅中，官鬼临玄武防盗，临朱雀防口舌火灾，临白虎防疾病哭泣。二爻动克世，宅不安；世动生宅，迁改获福。",
    "verdict": "吉",
    "timing": "鬼煞受制之月家道渐平。",
    "credibility": 5
  },
  {
    "id": "zsy.core.26",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "核心断法通则",
      "note": "长生十二宫，唯重生旺墓绝"
    },
    "when": {
      "note": "用神逢长生、沐浴、冠带、临官、帝旺、衰、病、死、墓、绝、胎、养。"
    },
    "text": "野鹤力削古法十二长生之琐碎，专重长生、帝旺、墓、绝四者。得长生帝旺者百事兴发，遇墓绝者动定多滞。沐浴胎养等，概不深究。",
    "verdict": "吉",
    "timing": "生旺应于长生帝旺日月，困绝应于墓绝日月。",
    "credibility": 5
  },
  {
    "id": "zsy.core.27",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "核心断法通则",
      "note": "鬼伏发祸，鬼动见灾"
    },
    "when": {
      "relative": [
        "官鬼"
      ],
      "topic": [
        "疾病"
      ],
      "conditions": [
        "moving",
        "dark-move"
      ],
      "note": "官鬼爻伏藏或暗动。"
    },
    "text": "官鬼为祸殃、疾厄、讼非之主。卦中鬼爻安静，诸事安泰；鬼爻暗动，祸生不测；鬼爻伏于世下，心怀大患；鬼爻伏于财下，必因财生非。",
    "verdict": "凶",
    "timing": "鬼爻透出、冲出逢值之日灾祸显现。",
    "credibility": 5
  },
  {
    "id": "zsy.core.28",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "核心断法通则",
      "note": "动爻化破、化空，力减三分"
    },
    "when": {
      "conditions": [
        "month-break",
        "xun-kong",
        "moving",
        "hua-kong"
      ],
      "note": "动爻变出之爻临旬空或月破。"
    },
    "text": "动爻虽有力，若变出月破之爻、旬空之爻，其生克回头之势暂时悬滞。变爻出空、实破之后，祸福方见真力。",
    "verdict": "吉",
    "timing": "变爻出空实破之期为最终生克应期。",
    "credibility": 5
  },
  {
    "id": "zsy.core.29",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "核心断法通则",
      "note": "用神多现，舍休囚而取生旺"
    },
    "when": {
      "conditions": [
        "yong-shen-liang-xian"
      ],
      "note": "卦中同一六亲用神重见两重以上。"
    },
    "text": "卦有两重用神，取动者不用静者；若俱静，取临月建日辰者；若俱不临，取旺相有气或临世应者，舍休囚受克者。",
    "verdict": "吉",
    "timing": "以所选定之真用神论生克断应期。",
    "credibility": 5
  },
  {
    "id": "zsy.core.30",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "核心断法通则",
      "note": "占行人归期，归魂不出疆，游魂行千里"
    },
    "when": {
      "topic": [
        "出行"
      ],
      "note": "遇八宫游魂卦（如火地晋）或归魂卦（如火天大有）。"
    },
    "text": "游魂卦主人心无定向，游移四方，难以即归；归魂卦主人倦鸟思归，行人在路，速归之兆。用神动化归魂，其人必归；用神动化游魂，复又飘荡。",
    "verdict": "吉",
    "timing": "归魂卦逢冲逢值之期即见；游魂卦待变归魂逢生方有信。",
    "credibility": 5
  }
];
