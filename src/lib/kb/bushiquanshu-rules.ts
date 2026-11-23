import type { KBEntry } from './types';

/**
 * 《卜筮全书》（明·姚际隆 辑选删补）35 条核心断易赋论通则
 * 涵盖：生克权舆、避凶而空、动始变终、进退定序、飞伏引拔、
 *       杀生身莫作吉断/用克世勿作凶推、随官入墓、天地合德、助鬼伤身等。
 * status: 'verified', credibility: 5
 */
export const BUSHIQUANSHU_RULES: KBEntry[] = [
  {
    "id": "bsqs.rule.01",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "生克权舆归于日月"
    },
    "when": {
      "note": "月建、日辰入卦或临爻。"
    },
    "text": "月建为万卜之提纲，日辰为一日之主宰。“日伤爻，真罹其祸；爻伤日，徒受其名”。爻之衰弱休囚者，日月能生之扶之；爻之旺相发轫者，日月能克之挫之。日辰能冲起静爻（暗动），能冲散动爻，能冲实空亡，克破墓库。",
    "verdict": "吉",
    "timing": "用爻休囚，以生旺月日断；动爻逢合，以冲开之日断；爻被合住，以冲破克破之日断。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.02",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "无故自空与避凶而空"
    },
    "when": {
      "conditions": [
        "xun-kong"
      ],
      "note": "爻落旬空，分为“无故自空”与“有故而空”。"
    },
    "text": "卦爻无刑冲克害，而用神、世身自落空亡，谓之“无故自空”，大凶之兆，占病必死，谋事终不成；若爻受日月动爻重克刑冲，而恰值空亡，谓之“避凶而空”（避之则吉），待出空之日免祸成事，过旬即用。",
    "verdict": "吉",
    "timing": "假空者出旬逢值逢冲之日应验；真空者到底成空无应期。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.03",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "动为事之始，变为事之终"
    },
    "when": {
      "conditions": [
        "moving"
      ],
      "note": "卦爻发动化出变爻。"
    },
    "text": "动爻为谋事之始基，变爻为归宿之终局。最怕“动变交争”与“化回头克”；动爻虽旺，若变爻化出死、墓、绝、空或回头冲克，始吉终凶；动爻虽困，若化长生、帝旺、回头生，始难终吉。",
    "verdict": "吉",
    "timing": "事应在变爻所值地支之生旺逢值逢冲之期。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.04",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "进神退神之动变定序"
    },
    "when": {
      "conditions": [
        "moving",
        "transform-advance",
        "transform-retreat"
      ],
      "note": "寅化卯、巳化午、申化酉、亥化子、丑化辰、辰化未、未化戌、戌化丑（进神）；反之为退神。"
    },
    "text": "“动变比和，当明进退”。化进神者，其势长驱直前，久远大吉；化退神者，其力渐衰落后，占行人虽发而中途复还，占物日渐退缩。",
    "verdict": "吉",
    "timing": "进神应于逢值逢合之日；退神应于冲退退绝之期。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.05",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "飞神与伏神引拔通微"
    },
    "when": {
      "conditions": [
        "yong-shen-bu-xian"
      ],
      "note": "卦中不见用神，查本宫八纯首卦之飞伏。"
    },
    "text": "“伏无提挈终徒尔，飞不摧开亦枉然”。“伏克飞神为出暴，飞来克伏反伤身；伏去生飞名泄气，飞来生伏得长生”。飞神若逢空、破、休囚，或被日月动爻冲克，伏神易出；飞神坚旺克伏，伏神永难出头。",
    "verdict": "吉",
    "timing": "应在冲开飞神之日，或伏神逢值、逢合、逢长生之月日。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.06",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "独发易取，乱动难寻"
    },
    "when": {
      "conditions": [
        "moving"
      ],
      "note": "一爻独动，或六爻杂乱竞发。"
    },
    "text": "卦爻一二位发动，神机发露，吉凶条理了然；若“内外竞发，事必翻腾”，人情反覆，吉凶靡定，主谋为反复无常，难定归宿。",
    "verdict": "成中有阻",
    "timing": "独发动爻以逢值逢合断；乱动者必看用神世身受制归一之时。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.07",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "杀生身莫将吉断，用克世勿作凶看"
    },
    "when": {
      "conditions": [
        "moving"
      ],
      "note": "忌神动而生合世爻，或用神动来克世。"
    },
    "text": "此乃断易最玄妙之活法。忌神虽生日辰合世，但终是克害用神之元凶，内藏刑害，不可作吉论；主事用爻若动来克世克身，乃“事来赶我，人情就我，物自投怀”，其事必速成易获，切勿作凶推。",
    "verdict": "先难后易",
    "timing": "用克世主应期极速，在用神克世之本日、即时即可应验。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.08",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "随官入墓三法"
    },
    "when": {
      "topic": [
        "疾病",
        "诉讼"
      ],
      "conditions": [
        "ru-mu"
      ],
      "note": "身随鬼入墓、世随鬼入墓、命随鬼入墓。"
    },
    "text": "世爻临鬼入日墓动墓；世身在鬼爻同入墓；本命地支带鬼入墓。逢此三墓，诸占不利；占身防目下大灾；占官事难成；占讼入狱；占病十占九死，主神识昏迷，入黄泉之兆。",
    "verdict": "凶",
    "timing": "唯待日辰动爻冲破克破其墓，或太岁冲开墓库之年方有生机。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.09",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
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
      "note": "占病遇六冲卦，或用爻被日辰动爻冲克。"
    },
    "text": "新暴之疾，邪气在表在腑，逢冲则邪气溃散，故“逢冲即愈”；积年沉疴久病，元神亏蚀，根本俱摇，逢冲则元气消散无余，故“逢冲必死”。",
    "verdict": "凶",
    "timing": "近病应于冲官之日退热；久病应于冲散用神之期归泉。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.10",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "久病逢合必死，近病逢合留连"
    },
    "when": {
      "topic": [
        "疾病"
      ],
      "conditions": [
        "moving",
        "liu-he-gua"
      ],
      "note": "占病遇六合卦，或用爻、病爻动而逢合。"
    },
    "text": "久病之人见合，主邪气入骨，阴灵纠缠，羁留地底，必死之征；近病逢合，主缠绵迁延，服药迟缓，骤难除根。",
    "verdict": "凶",
    "timing": "近病须冲开合爻之日方见轻松；久病合逢合闭之时寿尽。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.11",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "无鬼无气之玄机"
    },
    "when": {
      "relative": [
        "官鬼"
      ],
      "topic": [
        "疾病",
        "事业",
        "家宅"
      ],
      "note": "卦中六爻官鬼不现，且飞伏皆无。"
    },
    "text": "鬼者，无形而有用。占身无鬼，资财聚散无常；占求官无鬼，贵而无位；占家宅无鬼，谓之“无气”，资财破耗不聚；占病无鬼，为无叩告之门，乃天年命尽，医药难疗；唯占产、出行、田蚕，无鬼反是大吉。",
    "verdict": "吉",
    "timing": "待官鬼透出值月之期事体方定。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.12",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "助鬼伤身，大祸难当"
    },
    "when": {
      "relative": [
        "官鬼",
        "妻财"
      ],
      "topic": [
        "疾病",
        "事业",
        "诉讼"
      ],
      "conditions": [
        "moving"
      ],
      "note": "官鬼发动克世克身，同时妻财爻发动生鬼。"
    },
    "text": "官鬼克身世已属非灾，若妻财同动，财动生鬼，则衰鬼化旺鬼，狂澜愈烈，名“助鬼伤身”。主因财致讼、因妇起祸，或病症转危为烈；除非得子孙同动克去官鬼，方能反凶化吉。",
    "verdict": "凶",
    "timing": "灾祸应在财鬼生旺之日月；解难在子孙逢值之期。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.13",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "绝处逢生，寒谷回春"
    },
    "when": {
      "conditions": [
        "moving",
        "hua-jue"
      ],
      "note": "用神绝于日月动爻（如申日占木用爻），而得水爻同动生木。"
    },
    "text": "用神居绝地本为无用，若得动爻相生，如人困绝穷崖而蒙显贵提携，枯木逢春，死里逃生。占官文书有贵人出力主张；占病将死复苏；占婚将解复成。",
    "verdict": "先难后易",
    "timing": "应在生扶之爻长生或逢值之月日。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.14",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "合处逢冲，吉凶反覆"
    },
    "when": {
      "topic": [
        "婚恋"
      ],
      "conditions": [
        "moving",
        "liu-chong-gua",
        "liu-he-gua"
      ],
      "note": "卦爻见六合而日辰动爻冲破之。"
    },
    "text": "“吉神合处不可冲，凶神合处喜逢冲”。占婚谋事，见合处逢冲，必因小人谗谤中阻，将成而破；惟占讼狱与沉疴，大喜合处逢冲，合则事聚，冲则灾散，决然狱散病退。",
    "verdict": "先合后离",
    "timing": "冲开、破合之月日成败见分晓。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.15",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "暗动之吉凶隐蔽"
    },
    "when": {
      "conditions": [
        "moving",
        "dark-move"
      ],
      "note": "六爻安静，用爻旺相，遇日辰相冲。"
    },
    "text": "暗动者，阴私潜伏之兆。“福来而不知，祸来而未觉”。吉神暗动生世，暗中有人解救提携，隐得横财；凶煞暗动克世，背地遭人暗算构陷，病从阴私而生。",
    "verdict": "吉",
    "timing": "暗动极速，多应在当日或冲日。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.16",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "贪生忘克与贪合忘刑"
    },
    "when": {
      "conditions": [
        "moving"
      ],
      "note": "克害之爻遇生爻同动，或遇合神牵绊。"
    },
    "text": "如兄弟动克财，若子孙亦动，兄贪生子，忘克于财，财反借兄生子而得大富；又如爻逢相刑，若有相合之神同见，则贪合忘刑，凶威自敛。",
    "verdict": "吉",
    "timing": "待合神、生神受破受冲之期，忘生之煞方复发威。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.17",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "间爻发动，事多阻隔"
    },
    "when": {
      "topic": [
        "婚恋",
        "出行"
      ],
      "conditions": [
        "moving"
      ],
      "note": "世爻与应爻之间二爻发动。"
    },
    "text": "“世应当中两间爻，发动所求多阻隔”。间爻为媒人、保人、中介、道路之关隘。间兄动，必破财挑唆；间鬼动，官府差役作梗；间爻旺相，须重费唇舌方得通融。",
    "verdict": "成中有阻",
    "timing": "间爻受制、化退、入墓之日阻碍方通。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.18",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "求官仕宦，专看官父与禄马"
    },
    "when": {
      "relative": [
        "父母",
        "官鬼"
      ],
      "topic": [
        "事业",
        "考试"
      ],
      "note": "官鬼持世或生合世，父母旺相持世生世，禄马贵人同临。"
    },
    "text": "官为名位权柄，父为宣敕印绶文书，二者缺一不可。官旺父衰，职冷位高；父旺官衰，虽掌权文无品秩；子孙发动为伤官削职之客，万万不宜见之。",
    "verdict": "吉",
    "timing": "官爻逢值、父母逢生旺合起之月日拜官任职。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.19",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "营生求财，财旺福兴"
    },
    "when": {
      "relative": [
        "妻财",
        "子孙"
      ],
      "topic": [
        "财运"
      ],
      "conditions": [
        "moving"
      ],
      "note": "妻财爻旺相生世、持世、克世，子孙动发。"
    },
    "text": "“将本求财，妻位偏宜旺相；空拳问利，官爻喜遇兴隆”。财为利禄，子为财源。财克世者，财必到手（财来就我）；财动化鬼，利散招非；财爻化兄，折本亏空；兄弟发动，劫夺财物不可行。",
    "verdict": "吉",
    "timing": "财爻逢生旺、逢出空、或入墓入库之日得资。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.20",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "婚娶伉俪，首重财鬼阴阳得位"
    },
    "when": {
      "topic": [
        "婚恋"
      ],
      "note": "男占看财，女占看鬼；世阳应阴，财鬼相生。"
    },
    "text": "“世为婚，应为姻，须要相生相合；鬼为夫，财为妇，最嫌相害相刑”。男占两财，防重婚再娶或一妻一妾；女占两鬼，防再醮重嫁；子孙动发，女嫌伤夫；兄弟交重，男虑丧妇。",
    "verdict": "吉",
    "timing": "财鬼逢生、世应相合之期定盟完婚。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.21",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "产育胎孕，子孙白虎为先"
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
      "note": "子孙爻、胎爻与白虎爻动静。"
    },
    "text": "子孙旺相，临阳象生男，临阴象生女。白虎发动，他事皆凶，惟临产最喜，乃破胎催生坐草无虞之吉神；最忌父母爻发动克子，更嫌子孙动化官鬼，胎中殒命。",
    "verdict": "吉",
    "timing": "胎神冲破之日，或子孙逢长生逢冲逢值之日分娩。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.22",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "词讼诤讼，专论世应官杀"
    },
    "when": {
      "relative": [
        "官鬼"
      ],
      "topic": [
        "事业",
        "诉讼"
      ],
      "note": "世克应或应克世，官鬼生克之象。"
    },
    "text": "世克应我赢，应克世他胜；官鬼克世，官非亏输受责；官鬼克应，彼受责罚；最喜子孙临世发动，官讼私和不到官，消灾免难。一卦两官，事干两司反复不一。",
    "verdict": "吉",
    "timing": "官鬼墓绝、子孙临值之日公事结绝平息。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.23",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "失脱捕贼，以官为盗以财为物"
    },
    "when": {
      "relative": [
        "官鬼",
        "妻财"
      ],
      "topic": [
        "失物"
      ],
      "conditions": [
        "moving"
      ],
      "note": "官鬼与妻财之动静衰旺。"
    },
    "text": "官鬼在初爻为家贼，二三爻为邻里，外卦远处；临玄武加杀为惯盗，临阴为女子，临阳为男子。财化鬼物难寻，鬼化财贼易捕；子孙发动，时下可擒。六爻无鬼，自遗非盗。",
    "verdict": "吉",
    "timing": "官鬼受克受制、财爻逢生之日盗获物回。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.24",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "行旅出行，世安应顺方可登程"
    },
    "when": {
      "relative": [
        "官鬼",
        "子孙"
      ],
      "topic": [
        "出行"
      ],
      "conditions": [
        "moving"
      ],
      "note": "世爻生克应爻，子孙与官鬼之动静。"
    },
    "text": "世克应爻，直到地头无阻；应克世爻，前途阻滞险厄。世爻临鬼或化入合绊，必去不成；世临子孙青龙动，一路坦途获宝珍；五爻逢空，路上凄凉；六爻临鬼，地头不利。",
    "verdict": "吉",
    "timing": "冲开世爻合绊、子孙逢旺之日登程顺利。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.25",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "行人归期，身动足动音书先达"
    },
    "when": {
      "topic": [
        "出行"
      ],
      "conditions": [
        "moving"
      ],
      "note": "用爻旺衰动静及爻位高低。"
    },
    "text": "初爻动足动，二爻动身动，三四爻动临门户，五爻在路，六爻在地头心动身留。应动克世立至，世动克应未归；父临朱雀动，书信先达；用爻动化退神，行至中途复返他方。",
    "verdict": "吉",
    "timing": "动爻逢合之日到，或冲动用爻、用爻逢长生之期抵家。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.26",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "家宅安宁，门庭六神条陈"
    },
    "when": {
      "topic": [
        "家宅"
      ],
      "note": "初井、二灶、三床席、四门、五路、六栋宇。"
    },
    "text": "初爻为井与小口，二爻为灶与妻室，三爻为大门，四爻为户，五爻为父与路，六爻为栋梁祖茔。鬼动二爻灶神兴祸，鬼动三四爻门户破耗口舌，鬼动六爻梁颓墙坍；内克外人不安，外克内人胜宅。",
    "verdict": "吉",
    "timing": "官鬼受克、吉神生旺之月家宅自安。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.27",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "茔元风水，六合风藏气聚"
    },
    "when": {
      "topic": [
        "other"
      ],
      "conditions": [
        "liu-chong-gua",
        "liu-he-gua"
      ],
      "note": "世爻、应爻、间爻与六冲六合。"
    },
    "text": "“六合则风藏气聚，六冲则水走沙飞”。世为坐山之骨，生旺则坐山高厚雄壮；应为朝对案山，须秀丽端正有情；间爻为明堂，旺相主明堂广阔容万马；六爻为水口，宜生合紧锁不通风。",
    "verdict": "吉",
    "timing": "破墓开穴安葬以冲开吉神月日为定。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.28",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "天时雨晴，父财水火参究"
    },
    "when": {
      "relative": [
        "父母",
        "官鬼",
        "妻财",
        "子孙"
      ],
      "topic": [
        "other"
      ],
      "conditions": [
        "moving"
      ],
      "note": "父母爻、妻财爻、子孙爻、官鬼爻之动静旺衰。"
    },
    "text": "“当究父财，勿凭水火”。父母动狂风霖雨，妻财动万里晴明，子孙动红霞霁色，兄弟动风云闭塞，官鬼动雷电霹雳。应为天，世为地；应克世无雨，世克应甘霖倾盆。",
    "verdict": "吉",
    "timing": "占雨逢父爻生旺之日，占晴逢财爻绝处逢生之日。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.29",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "年时吉凶，五爻君位初爻万物"
    },
    "when": {
      "topic": [
        "other"
      ],
      "note": "太岁、月建入卦生克各爻位。"
    },
    "text": "初爻万物，二爻百姓，三爻县府，四爻公卿，五爻天子，六爻昊天。太岁动生世民安物阜，太岁冲克岁多灾异；金鬼动四海干戈，水鬼动江淮泛滥，火鬼动回禄肆虐，土鬼动瘟疫猖獗。",
    "verdict": "吉",
    "timing": "应期以太岁、月建所值之季度月日定之。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.30",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "鬼伏有殃，鬼动成灾"
    },
    "when": {
      "relative": [
        "官鬼"
      ],
      "topic": [
        "疾病"
      ],
      "conditions": [
        "moving"
      ],
      "note": "官鬼爻伏藏在不同六亲之下。"
    },
    "text": "鬼伏父母下：因房宅尊长文书起祸；鬼伏兄弟下：因争财赌博同僚构衅；鬼伏子孙下：为僧道勾连或医巫致疾；鬼伏财爻下：为饮食酒色及阴人暗害。",
    "verdict": "凶",
    "timing": "飞神受冲被制、伏鬼透出之日祸患发作。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.31",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "自空化空，百无一成"
    },
    "when": {
      "conditions": [
        "xun-kong",
        "moving",
        "hua-kong"
      ],
      "note": "动爻本身落空，变出之爻亦落旬空。"
    },
    "text": "“自空化空，必成凶咎”。动值真空，毫无依托，如履深渊绝壁，求事断无成理，问病立见暴亡；唯忌神见之大喜，转凶为福。",
    "verdict": "凶",
    "timing": "无应期，到底成空。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.32",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "六神专司情状，不可妄断吉凶"
    },
    "when": {
      "note": "青龙、朱雀、勾陈、螣蛇、白虎、玄武加临六爻。"
    },
    "text": "“六亲为本，六神为末，神杀又末中之末”。“虎兴而遇吉神，不害其为吉；龙动而逢凶曜，难掩其为凶”。白虎临用爻生世，军威大将之显贵；青龙临忌爻克世，酒色非灾之重挫。",
    "verdict": "吉",
    "timing": "吉凶归于五行生克，六神仅定情性与事物形态。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.33",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "太岁入爻，吉凶关乎朝野"
    },
    "when": {
      "conditions": [
        "moving"
      ],
      "note": "流年太岁地支出现在卦爻中并动发。"
    },
    "text": "太岁乃天子之星，至尊无比，宜静不宜动。动而生合世爻，主朝廷恩诏、封诰加官；动而冲克世身，大祸临门，常人破家，仕宦削籍，一年内大凶难免。",
    "verdict": "吉",
    "timing": "冲克应在太岁逢值、逢冲之月。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.34",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "两鬼两财，反复不常"
    },
    "when": {
      "relative": [
        "官鬼",
        "妻财"
      ],
      "topic": [
        "婚恋",
        "诉讼"
      ],
      "conditions": [
        "moving",
        "yong-shen-liang-xian"
      ],
      "note": "卦中出现两重官鬼或两重妻财同动。"
    },
    "text": "一卦见两官，政令何曾归一，事体翻腾两司，狱讼反复；占婚见两财两官，婚配乖违，重婚续弦。物多则不专，吉不能为纯吉，凶不能为全凶。",
    "verdict": "先合后离",
    "timing": "待一爻受克制入墓、一爻得令逢值之期始定局。",
    "credibility": 5
  },
  {
    "id": "bsqs.rule.35",
    "kind": "rule",
    "status": "verified",
    "source": {
      "book": "卜筮全书",
      "chapter": "断易赋论",
      "note": "动而逢合，必待冲开之期"
    },
    "when": {
      "conditions": [
        "moving",
        "liu-he-gua"
      ],
      "note": "动爻被日辰合住，或动变地支相合。"
    },
    "text": "“爻逢合住，纵动无功”。凡动爻虽生克有力，若被日辰或变爻合住，为贪合牵绊，如人被绊足，无法施展；必须待冲破、克破合神之日，其机栝方能发露而吉凶应验。",
    "verdict": "成中有阻",
    "timing": "断事应在逢冲之日、冲开之月。",
    "credibility": 5
  }
];
