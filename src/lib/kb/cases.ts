import type { KBEntry } from './types';
import { BUSHIQUANSHU_CASES } from './bushiquanshu-cases';

export { BUSHIQUANSHU_CASES };

/**
 * 《增删卜易》42 经典实战占验卦例库
 * 全部为野鹤老人亲断亲历之真实卦案，经后世名家推崇
 * status: 'verified', credibility: 5
 */
export const ZENGSHAN_CASES: KBEntry[] = [
  {
    "id": "zsy.case.01",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占父近病（午火动化合，待冲开日愈）"
    },
    "when": {
      "hexagram": [
        1,
        9
      ],
      "lineIndex": [
        4
      ],
      "relative": [
        "父母",
        "官鬼"
      ],
      "conditions": [
        "dark-move"
      ],
      "topic": [
        "疾病"
      ],
      "note": "乾为天变天小畜 · 辰月 戊申日（旬空：寅卯）"
    },
    "text": "【占父近病（午火动化合，待冲开日愈）】占问：“占父近病”。卦中辰、未、戌三重父母爻，辰土父母临月建旺相，取辰土为用神。日辰申金冲动二爻寅木暗动克辰土，故目下病重。四爻午火官鬼虽发动能生辰土，但动化未土相合（午与未合），贪合忘生，导致辰土单受寅木之克。断须待丑日冲去未土使午火脱绊相生，其病立退。",
    "timing": "果于丑日起床痊愈。",
    "credibility": 5
  },
  {
    "id": "zsy.case.02",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "自占病（用神破散无根，接续相生亦难救）"
    },
    "when": {
      "hexagram": [
        28,
        50
      ],
      "lineIndex": [
        5,
        6
      ],
      "conditions": [
        "month-break"
      ],
      "topic": [
        "疾病"
      ],
      "note": "泽风大过变火风鼎 · 巳月 乙未日（旬空：辰巳）"
    },
    "text": "【自占病（用神破散无根，接续相生亦难救）】占问：“自占病”。自占病以世爻亥水为用神。上爻未土忌神动而克水，喜得五爻酉金元神亦动，忌神未土反生元神酉金，酉金再生世爻亥水，本为连续相生化凶为吉之象。怎奈世爻亥水逢巳月月破，又受未日之克，月破日克衰绝无根，如树无根逢生不起。",
    "timing": "果卒于癸卯日（卯日冲去元神酉金之期）。",
    "credibility": 5
  },
  {
    "id": "zsy.case.03",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "弟占兄得重罪（动化回头生逢恩免死）"
    },
    "when": {
      "hexagram": [
        24,
        51
      ],
      "lineIndex": [
        4
      ],
      "relative": [
        "父母",
        "兄弟"
      ],
      "topic": [
        "寻人"
      ],
      "note": "地雷复变震为雷 · 卯月 己卯日（旬空：申酉）"
    },
    "text": "【弟占兄得重罪（动化回头生逢恩免死）】占问：“弟占兄已得重罪，叩问能救否”。以兄弟爻为用神。丑土兄动，逢日月卯木齐来刑克，本是大罪难脱之象；幸四爻丑土兄弟动化午火父母回头相生，得父化兄生，断速行援救，凶中有救。",
    "timing": "后蒙恩留免死。",
    "credibility": 5
  },
  {
    "id": "zsy.case.04",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占父官事重刑（三合木局专克父母）"
    },
    "when": {
      "hexagram": [
        45,
        13
      ],
      "lineIndex": [
        1,
        3,
        6
      ],
      "relative": [
        "父母"
      ],
      "topic": [
        "诉讼"
      ],
      "note": "泽地萃变天火同人 · 卯月 戊寅日（旬空：申酉）"
    },
    "text": "【占父官事重刑（三合木局专克父母）】占问：“占父官事已拟重罪”。以外卦未土父母为用神。未土受月建卯木克制，且内卦初爻未土、三爻卯木与动爻亥水合成亥卯未木局齐来克伐未土父母，月克日刑，卦中全无解救生扶。",
    "timing": "果至重刑。",
    "credibility": 5
  },
  {
    "id": "zsy.case.05",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "妹占兄官事（父母暗动，克处逢生）"
    },
    "when": {
      "hexagram": [
        12,
        6
      ],
      "lineIndex": [
        1,
        2
      ],
      "relative": [
        "父母",
        "兄弟",
        "官鬼"
      ],
      "conditions": [
        "dark-move"
      ],
      "topic": [
        "诉讼"
      ],
      "note": "天地否变天水讼 · 卯月 戊寅日（旬空：申酉）"
    },
    "text": "【妹占兄官事（父母暗动，克处逢生）】占问：“妹占兄官事同案拟重罪”。以申金兄弟爻为用神。二爻巳火官鬼发动刑克申金，重罪已定；所喜者日辰冲动五爻戌土父母暗动生助申金兄爻，乃“克处逢生”，断有父母尊长可以挽救。",
    "timing": "后因其父年届八十，援例恩留免死。",
    "credibility": 5
  },
  {
    "id": "zsy.case.06",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占弟癌症临危（克处逢生有救）"
    },
    "when": {
      "hexagram": [
        63,
        49
      ],
      "lineIndex": [
        5,
        6
      ],
      "relative": [
        "父母",
        "兄弟"
      ],
      "topic": [
        "疾病"
      ],
      "note": "水火既济变泽火革 · 辰月 丙申日（旬空：辰巳）"
    },
    "text": "【占弟癌症临危（克处逢生有救）】占问：“占弟癌症已临危”。以兄弟亥水为用神。月建辰土虽克亥水，赖申金日建生之，且五爻申金父母动来生世爻亥水，得日辰动爻生扶，克少生多，临危有救。",
    "timing": "果于本日酉时遇名医救活，至巳亥日完全脱险平复。",
    "credibility": 5
  },
  {
    "id": "zsy.case.07",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "火天大有占求财（静空待出空得财）"
    },
    "when": {
      "relative": [
        "父母",
        "妻财"
      ],
      "conditions": [
        "xun-kong"
      ],
      "topic": [
        "财运"
      ],
      "note": "火天大有（静卦） · 寅月 庚戌日（旬空：寅卯）"
    },
    "text": "【火天大有占求财（静空待出空得财）】占问：“占求财”。以寅木妻财爻为用神。财爻克世（大有世在辰土父母），用神克世主财必得；但寅木财爻在旬内值旬空，非真空，逢空出旬则实。",
    "timing": "果于甲寅日出空之日如期得财。",
    "credibility": 5
  },
  {
    "id": "zsy.case.08",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占谒贵（午火克世，逢伤待冲克神）"
    },
    "when": {
      "hexagram": [
        18,
        4
      ],
      "lineIndex": [
        3
      ],
      "relative": [
        "子孙",
        "官鬼"
      ],
      "topic": [
        "事业"
      ],
      "note": "山风蛊变山水蒙 · 酉月 丙寅日（旬空：戌亥）"
    },
    "text": "【占谒贵（午火克世，逢伤待冲克神）】占问：“占谒见贵人”。世临月建官鬼酉金，定得面见；但世爻酉金动化午火子孙回头相克，谓之“逢伤”，须待子日冲去午火克神方得拜谒。",
    "timing": "果于丙子日冲去午火之日得以面见贵人。",
    "credibility": 5
  },
  {
    "id": "zsy.case.09",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占升迁（艮变颐，三合水局生官）"
    },
    "when": {
      "hexagram": [
        52,
        27
      ],
      "lineIndex": [
        1,
        3
      ],
      "relative": [
        "子孙",
        "官鬼"
      ],
      "topic": [
        "事业"
      ],
      "note": "艮为山变山雷颐 · 寅月 丙申日（旬空：辰巳）"
    },
    "text": "【占升迁（艮变颐，三合水局生官）】占问：“占官职升迁”。寅木官星持世，临月建而旺相，虽被申金日辰冲克，所喜初爻辰土动化子水、三爻申金动化辰土，合成申子辰水局生扶寅木官星，官得生助，定然高迁。",
    "timing": "果于三月（辰土出空之月）升任云南太守。",
    "credibility": 5
  },
  {
    "id": "zsy.case.10",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占弟被讼（月建入卦克兄，申年逢刑）"
    },
    "when": {
      "hexagram": [
        47,
        32
      ],
      "lineIndex": [
        2,
        5
      ],
      "relative": [
        "兄弟"
      ],
      "conditions": [
        "transform-retreat"
      ],
      "topic": [
        "诉讼"
      ],
      "note": "泽水困变雷风恒 · 午月 丁未日（旬空：寅卯）"
    },
    "text": "【占弟被讼（月建入卦克兄，申年逢刑）】占问：“占弟被讼吉凶”。以兄弟酉金为用神。午月克之，未日生之，本可敌衡；不宜午火月建入卦发动克酉，且酉金兄爻动化申金退神；辰年太岁相合尚无妨，退至申年无路可走。",
    "timing": "果于本年下狱，至申年受重刑。",
    "credibility": 5
  },
  {
    "id": "zsy.case.11",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占开铺面（六冲变克，过时有害）"
    },
    "when": {
      "hexagram": [
        52,
        36
      ],
      "lineIndex": [
        1,
        6
      ],
      "relative": [
        "官鬼"
      ],
      "conditions": [
        "liu-chong-gua",
        "hui-tou-ke"
      ],
      "topic": [
        "财运"
      ],
      "note": "艮为山变地火明夷 · 寅月 丁酉日（旬空：辰巳）"
    },
    "text": "【占开铺面（六冲变克，过时有害）】占问：“占开商铺”。世临寅木得月令，目下开张虽见热闹，独嫌日辰酉金克世，且世爻动化酉金回头克，六冲变六冲大凶。世化鬼克自身防病，应爻申金克世主伙计变心。",
    "timing": "果于六月（木墓于未）染病，八月（申酉金旺）伙计盗尽财物卷逃。",
    "credibility": 5
  },
  {
    "id": "zsy.case.12",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占妹临产（日合逢冲即产）"
    },
    "when": {
      "relative": [
        "兄弟"
      ],
      "topic": [
        "疾病"
      ],
      "note": "火地晋（静卦） · 午月 戊辰日（旬空：戌亥）"
    },
    "text": "【占妹临产（日合逢冲即产）】占问：“占妹临产吉凶”。以兄弟酉金为用神。午月克酉，辰日生合酉金，月克日生无碍；酉金与辰日相合，合住必待冲开之期方生。",
    "timing": "果于次日卯时（卯冲酉冲开合神）顺产，母子平安。",
    "credibility": 5
  },
  {
    "id": "zsy.case.13",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "自占病（动化回头克，卒于亥月）"
    },
    "when": {
      "hexagram": [
        33,
        44
      ],
      "lineIndex": [
        2
      ],
      "relative": [
        "子孙"
      ],
      "conditions": [
        "hui-tou-ke"
      ],
      "topic": [
        "疾病"
      ],
      "note": "天山遁变天风姤 · 申月 戊午日（旬空：子丑）"
    },
    "text": "【自占病（动化回头克，卒于亥月）】占问：“自占病”。世爻午火为用神。虽临日辰旺相，不宜二爻午火发动化出亥水子孙回头克世，申金月建又生助亥水，克制太甚。",
    "timing": "果卒于亥月（水旺逢值克世之月）。",
    "credibility": 5
  },
  {
    "id": "zsy.case.14",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占仆何日回（叠叠土克破水，中途遇害）"
    },
    "when": {
      "hexagram": [
        43,
        10
      ],
      "lineIndex": [
        3,
        6
      ],
      "relative": [
        "妻财"
      ],
      "conditions": [
        "month-break"
      ],
      "topic": [
        "寻人"
      ],
      "note": "泽天夬变天泽履 · 巳月 亥日（旬空：寅卯）"
    },
    "text": "【占仆何日回（叠叠土克破水，中途遇害）】占问：“占仆人何日回”。以妻财亥水为用神。亥水逢巳月月破，虽临日建，但卦中辰土、未土重叠发动狂克亥水，寡不敌众，难望归期且防不测。",
    "timing": "果于午月卯日接信，仆人中途已被贼害。",
    "credibility": 5
  },
  {
    "id": "zsy.case.15",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占生产吉凶（青龙子孙化绝变鬼）"
    },
    "when": {
      "hexagram": [
        23,
        20
      ],
      "lineIndex": [
        5
      ],
      "relative": [
        "子孙",
        "官鬼"
      ],
      "conditions": [
        "hua-jue"
      ],
      "topic": [
        "疾病"
      ],
      "note": "山地剥变风地观 · 戊子日（旬空：午未）"
    },
    "text": "【占生产吉凶（青龙子孙化绝变鬼）】占问：“占产妇生产吉凶”。以子孙爻为用神。五爻子水子孙虽临日辰且带青龙吉神，但动而化绝、变出巳火官鬼（子孙化绝变鬼），非吉兆。",
    "timing": "婴儿本日落草即亡。",
    "credibility": 5
  },
  {
    "id": "zsy.case.16",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占兄病（忌神生元神，元神生用神）"
    },
    "when": {
      "hexagram": [
        3,
        51
      ],
      "lineIndex": [
        4,
        5
      ],
      "relative": [
        "兄弟",
        "子孙"
      ],
      "topic": [
        "疾病"
      ],
      "note": "水雷屯变震为雷 · 申月 甲辰日（旬空：寅卯）"
    },
    "text": "【占兄病（忌神生元神，元神生用神）】占问：“占兄病”。以兄弟子水为用神。五爻戌土忌神动生四爻申金元神，申金元神动生子水用神，形成接续相生，且月建申金又生扶子水。",
    "timing": "果于戊申日（元神当值之日）沉疴复起痊愈。",
    "credibility": 5
  },
  {
    "id": "zsy.case.17",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占出门（动而逢合绊住，子孙化鬼伤女）"
    },
    "when": {
      "hexagram": [
        36,
        62
      ],
      "lineIndex": [
        1,
        4
      ],
      "relative": [
        "子孙",
        "官鬼"
      ],
      "topic": [
        "出行"
      ],
      "note": "地火明夷变雷山小过 · 申月 丙子日（旬空：申酉）"
    },
    "text": "【占出门（动而逢合绊住，子孙化鬼伤女）】占问：“占出门远行”。世爻丑土动化午火回头相合，动逢合而绊住，必有事阻不行；初爻卯木子孙在申月绝、子日刑，且动化辰土官鬼，防儿女不安。",
    "timing": "因小女病重未去，女果死于辰日（卯木变辰土之期）。",
    "credibility": 5
  },
  {
    "id": "zsy.case.18",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占悔婚还成否（六冲变六合，散而复聚）"
    },
    "when": {
      "hexagram": [
        30,
        56
      ],
      "lineIndex": [
        1
      ],
      "conditions": [
        "liu-chong-gua",
        "liu-he-gua"
      ],
      "topic": [
        "婚恋"
      ],
      "note": "离为火变火山旅 · 未月 丁巳日（旬空：子丑）"
    },
    "text": "【占悔婚还成否（六冲变六合，散而复聚）】占问：“占女方已悔之婚还可成否”。离为火为六冲卦，变火山旅为六合卦。六冲变六合主散而复聚、离而必合，不拘用神，竟以吉断。",
    "timing": "果于次年三月（辰月）重新成婚。",
    "credibility": 5
  },
  {
    "id": "zsy.case.19",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "两村争水（衰金不克旺木，六冲变冲劝散）"
    },
    "when": {
      "hexagram": [
        30,
        2
      ],
      "lineIndex": [
        1,
        3,
        4,
        6
      ],
      "conditions": [
        "liu-chong-gua"
      ],
      "topic": [
        "诉讼"
      ],
      "note": "离为火变坤为地 · 卯月 丁巳日（旬空：子丑）"
    },
    "text": "【两村争水（衰金不克旺木，六冲变冲劝散）】占问：“两村因争田水厮打，占会否成讼”。内卦为我村（亥卯未三合成木局），外卦为人村（巳酉丑三合成金局）。时值卯月，木旺金衰，衰金难克旺木；加之离变坤为六冲变六冲，争斗逢冲必散。",
    "timing": "后果有中间人解劝分散，不成公讼。",
    "credibility": 5
  },
  {
    "id": "zsy.case.20",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占经商贸易（反复之卦，冲中逢合发财）"
    },
    "when": {
      "hexagram": [
        32,
        16
      ],
      "lineIndex": [
        2,
        3
      ],
      "relative": [
        "妻财"
      ],
      "conditions": [
        "dark-move"
      ],
      "topic": [
        "财运"
      ],
      "note": "雷风恒变雷地豫 · 午月 丙辰日（旬空：子丑）"
    },
    "text": "【占经商贸易（反复之卦，冲中逢合发财）】占问：“占出外经商贸易财运”。世爻酉金动化卯木回头冲，主反复不常；幸辰日合酉金，冲中逢合，又得辰日冲动五爻戌土财爻暗动生世，化冲而不克世。",
    "timing": "其人去而复返者三次，中途大获财利。",
    "credibility": 5
  },
  {
    "id": "zsy.case.21",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占子久出不归（坤卦六冲，旺子逢冲必归）"
    },
    "when": {
      "relative": [
        "子孙"
      ],
      "conditions": [
        "liu-chong-gua"
      ],
      "topic": [
        "寻人"
      ],
      "note": "坤为地（静卦） · 酉月 乙未日（旬空：辰巳）"
    },
    "text": "【占子久出不归（坤卦六冲，旺子逢冲必归）】占问：“占子久出不归生死”。世持酉金子孙，临月建旺极，又得未日生扶；坤虽为六冲卦，但用神旺极冲之不散，此子必归。",
    "timing": "果于子年建功、卯年得意而归（应于静而逢冲逢值之年）。",
    "credibility": 5
  },
  {
    "id": "zsy.case.22",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占严师训子（六合变六冲，不久且伤子）"
    },
    "when": {
      "hexagram": [
        12,
        1
      ],
      "lineIndex": [
        1,
        2,
        3
      ],
      "relative": [
        "父母",
        "子孙"
      ],
      "conditions": [
        "xun-kong",
        "liu-chong-gua",
        "liu-he-gua"
      ],
      "topic": [
        "考试"
      ],
      "note": "天地否变乾为天 · 巳月 甲寅日（旬空：子丑）"
    },
    "text": "【占严师训子（六合变六冲，不久且伤子）】占问：“占严师训子如何”。以应爻戌土父母为用神。天地否本为六合，内卦三爻齐动变乾为六冲，合变冲主不久；子水子孙旬空，初爻未土父动克子。",
    "timing": "仅过两月其子病重辞师，未久其子夭折。",
    "credibility": 5
  },
  {
    "id": "zsy.case.23",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占子痘症（独犯寅巳申三刑之验）"
    },
    "when": {
      "hexagram": [
        37,
        30
      ],
      "lineIndex": [
        2,
        5
      ],
      "relative": [
        "子孙"
      ],
      "topic": [
        "疾病"
      ],
      "note": "风火家人变离为火 · 寅月 庚申日（旬空：子丑）"
    },
    "text": "【占子痘症（独犯寅巳申三刑之验）】占问：“占子痘症吉凶”。巳火子孙当春令本属旺相，原许易治；但月建在寅、日建在申，与五爻巳火子孙共作“寅巳申三刑”，独犯三刑无他爻救助。",
    "timing": "果死于寅日寅时。",
    "credibility": 5
  },
  {
    "id": "zsy.case.24",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占女痘（暗动相生，神速解救）"
    },
    "when": {
      "hexagram": [
        2,
        7
      ],
      "lineIndex": [
        2
      ],
      "relative": [
        "兄弟",
        "子孙"
      ],
      "conditions": [
        "dark-move"
      ],
      "topic": [
        "疾病"
      ],
      "note": "坤为地变地水师 · 寅月 己未日（旬空：子丑）"
    },
    "text": "【占女痘（暗动相生，神速解救）】占问：“占女痘症吉凶”。酉金子孙虽休囚，得未日生之；二爻巳火动来克金，喜未日冲动四爻丑土兄弟暗动，形成巳火生丑土、丑土生酉金，转克为生。",
    "timing": "果于本日未申时遇名医救治而全愈。",
    "credibility": 5
  },
  {
    "id": "zsy.case.25",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占父出外一载无音（旺动冲不散，交春必归）"
    },
    "when": {
      "hexagram": [
        59,
        29
      ],
      "lineIndex": [
        6
      ],
      "relative": [
        "父母",
        "子孙"
      ],
      "conditions": [
        "xun-kong",
        "hui-tou-sheng"
      ],
      "topic": [
        "寻人"
      ],
      "note": "风水涣变坎为水 · 丑月 丁酉日（旬空：辰巳）"
    },
    "text": "【占父出外一载无音（旺动冲不散，交春必归）】占问：“占父出外一年无音信”。上爻卯木父母发动生世，又化子水回头生；酉日虽冲卯木动爻，神兆机于动，旺动之爻冲之不散；世爻巳火空亡，交春出空即归。",
    "timing": "果于二月（卯月出空当令）得意而回。",
    "credibility": 5
  },
  {
    "id": "zsy.case.26",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "代占长辈功名（卦化回头克绝，削职夭寿）"
    },
    "when": {
      "hexagram": [
        57,
        1
      ],
      "lineIndex": [
        1,
        2,
        3,
        4,
        5,
        6
      ],
      "conditions": [
        "hui-tou-ke",
        "hua-jue"
      ],
      "topic": [
        "事业"
      ],
      "note": "巽为风变乾为天 · 卯月 辛巳日（旬空：申酉）"
    },
    "text": "【代占长辈功名（卦化回头克绝，削职夭寿）】占问：“代卜长辈功名”。巽木化乾金为卦化绝、卦化回头克。野鹤断曰凡遇卦化回头克者，不论用神衰旺皆以凶推，不必问名，寿命难长。",
    "timing": "长辈果于削职后七月身故。",
    "credibility": 5
  },
  {
    "id": "zsy.case.27",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占随官上任（内卦反吟化绝克，城破遭害）"
    },
    "when": {
      "hexagram": [
        8,
        48
      ],
      "lineIndex": [
        1,
        2,
        3
      ],
      "relative": [
        "官鬼"
      ],
      "conditions": [
        "fan-yin",
        "hua-jue"
      ],
      "topic": [
        "事业"
      ],
      "note": "水地比变水风井 · 卯月 壬申日（旬空：戌亥）"
    },
    "text": "【占随官上任（内卦反吟化绝克，城破遭害）】占问：“占随官府上任吉凶”。世临卯木官星值月建虽旺，但内卦坤变巽为反吟，且世爻绝于申日又动化酉金回头冲克，大凶之象，断不可随去。",
    "timing": "其人初辞不去，后忽又随去；七月城破与官府一同被害。",
    "credibility": 5
  },
  {
    "id": "zsy.case.28",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占升迁（外卦反吟，去而复反）"
    },
    "when": {
      "hexagram": [
        19,
        61
      ],
      "lineIndex": [
        4,
        5,
        6
      ],
      "relative": [
        "官鬼"
      ],
      "conditions": [
        "fan-yin"
      ],
      "topic": [
        "事业"
      ],
      "note": "地泽临变风泽中孚 · 卯月 己亥日（旬空：辰巳）"
    },
    "text": "【占升迁（外卦反吟，去而复反）】占问：“占官员升迁”。世临卯木月建之官，又长生于亥日，官星得地即升；外卦反吟主去而复反。",
    "timing": "果于本月由江西升任山东，未及一年复任江西。",
    "credibility": 5
  },
  {
    "id": "zsy.case.29",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占将来有官否（官破动生世，巳年袭职）"
    },
    "when": {
      "hexagram": [
        58
      ],
      "lineIndex": [
        1,
        6
      ],
      "relative": [
        "官鬼"
      ],
      "conditions": [
        "month-break",
        "transform-advance"
      ],
      "topic": [
        "事业"
      ],
      "note": "兑为泽变天水讼（再占得水地比） · 亥月 己丑日（旬空：午未）"
    },
    "text": "【占将来有官否（官破动生世，巳年袭职）】占问：“占将来能否得官”。初爻巳火官动生世，世动化进神；巳官虽遭亥月月破，但神兆机于动，破而生世；再占得水地比官星持世，断定食禄，应于实破之年。",
    "timing": "果于巳年（巳火实破之年）承袭长房世职。",
    "credibility": 5
  },
  {
    "id": "zsy.case.30",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占父何日归（父破化空，退神归家）"
    },
    "when": {
      "hexagram": [
        1,
        43
      ],
      "lineIndex": [
        6
      ],
      "relative": [
        "父母"
      ],
      "conditions": [
        "month-break",
        "xun-kong",
        "transform-retreat"
      ],
      "topic": [
        "other"
      ],
      "note": "乾为天变泽天夬 · 辰月 戊子日（旬空：午未）"
    },
    "text": "【占父何日归（父破化空，退神归家）】占问：“占父何日归”。戌土父母持世逢辰月月破，动化未土退神且旬空；朱雀临父持世动，卯日破而逢合有信，未日出空退归到家。",
    "timing": "果于卯日得信，乙未日其父平安抵家。",
    "credibility": 5
  },
  {
    "id": "zsy.case.31",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占后运功名（子水破空相生，子年起用）"
    },
    "when": {
      "hexagram": [
        52
      ],
      "lineIndex": [
        3,
        4,
        5
      ],
      "relative": [
        "子孙",
        "官鬼"
      ],
      "conditions": [
        "month-break"
      ],
      "topic": [
        "事业"
      ],
      "note": "艮为山变风地观（后又占地泽临） · 午月 癸卯日（旬空：辰巳）"
    },
    "text": "【占后运功名（子水破空相生，子年起用）】占问：“占后运功名吉凶”。寅木官星持世被申金动爻克，七月必有仇家之祸；所喜五爻子水动爻虽月破化空，仍能接续相生，免削职而降级；遇子年太岁当权实破必起用。",
    "timing": "果于七月见讼，冬至月事结降调；甲子年仍以原品起用，后至卯年开督府。",
    "credibility": 5
  },
  {
    "id": "zsy.case.32",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占候文书（空下伏神易引拔）"
    },
    "when": {
      "relative": [
        "父母"
      ],
      "conditions": [
        "xun-kong"
      ],
      "topic": [
        "考试"
      ],
      "note": "山火贲（静卦） · 卯月 壬辰日（旬空：午未）"
    },
    "text": "【占候文书（空下伏神易引拔）】占问：“占领候文书何日可得”。午火父母文书为用神，旬空伏于二爻丑土之下；丑土飞神旬空易于引拔，午火文书出空即现。",
    "timing": "果于甲午日出空之日领得文书。",
    "credibility": 5
  },
  {
    "id": "zsy.case.33",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占子病（伏神空下逢值即愈）"
    },
    "when": {
      "relative": [
        "子孙"
      ],
      "conditions": [
        "xun-kong"
      ],
      "topic": [
        "疾病"
      ],
      "note": "地风升（静卦） · 酉月 丙辰日（旬空：子丑）"
    },
    "text": "【占子病（伏神空下逢值即愈）】占问：“占子病”。午火子孙为用神，伏于三爻丑土之下；丑土旬空，空下伏神易出，许午日子孙逢值出现即愈。",
    "timing": "果于午日起床痊愈。",
    "credibility": 5
  },
  {
    "id": "zsy.case.34",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占乡试（官化进神，联捷登科）"
    },
    "when": {
      "hexagram": [
        32,
        28
      ],
      "lineIndex": [
        5
      ],
      "relative": [
        "官鬼"
      ],
      "conditions": [
        "dark-move",
        "transform-advance"
      ],
      "topic": [
        "事业"
      ],
      "note": "雷风恒变泽风大过 · 申月 癸卯日（旬空：辰巳）"
    },
    "text": "【占乡试（官化进神，联捷登科）】占问：“占乡试功名”。酉金官星持世旺相，卯日冲之暗动；九五爻申金官鬼动化酉金进神相扶，主今秋折桂、来春夺魁。",
    "timing": "今秋中举，来春会试连捷。",
    "credibility": 5
  },
  {
    "id": "zsy.case.35",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占求婚（财化进神，午日冲克成婚）"
    },
    "when": {
      "hexagram": [
        11,
        39
      ],
      "lineIndex": [
        1,
        2,
        3,
        4,
        5
      ],
      "relative": [
        "子孙",
        "妻财",
        "官鬼"
      ],
      "conditions": [
        "transform-advance",
        "transform-retreat",
        "hui-tou-ke"
      ],
      "topic": [
        "财运"
      ],
      "note": "地天泰变水山蹇 / 泰之蹇 · 卯月 乙丑日（旬空：戌亥）"
    },
    "text": "【占求婚（财化进神，午日冲克成婚）】占问：“占求婚成否”。未土财爻持世动化戌土进神；巳火子动生世，虽化子水回头克，待午日冲去子水克神且合起世爻其婚必成；间爻酉鬼动化退神无力阻隔。",
    "timing": "果于午日允婚。",
    "credibility": 5
  },
  {
    "id": "zsy.case.36",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "迎父起程（父化退世化进，未日相逢）"
    },
    "when": {
      "hexagram": [
        1,
        43
      ],
      "lineIndex": [
        1,
        4,
        5,
        6
      ],
      "relative": [
        "父母"
      ],
      "conditions": [
        "transform-advance",
        "transform-retreat"
      ],
      "topic": [
        "出行"
      ],
      "note": "乾为天变泽天夬 · 丑月 丙戌日（旬空：午未）"
    },
    "text": "【迎父起程（父化退世化进，未日相逢）】占问：“占父已起程迎之能否相遇”。戌土父母动化未土退神，父已归家；世爻申金化酉金进神，我欲前去；父爻生世定相逢，戌父化未破化空，至未日实空实破必会。",
    "timing": "果于未日与父途中相遇。",
    "credibility": 5
  },
  {
    "id": "zsy.case.37",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占冬令关差（官化进神，丑日得差）"
    },
    "when": {
      "hexagram": [
        60,
        5
      ],
      "lineIndex": [
        3
      ],
      "relative": [
        "官鬼"
      ],
      "conditions": [
        "xun-kong",
        "transform-advance"
      ],
      "topic": [
        "事业"
      ],
      "note": "水泽节变水天需 · 戌月 癸亥日（旬空：子丑）"
    },
    "text": "【占冬令关差（官化进神，丑日得差）】占问：“占本年冬令得关差否”。丑土官鬼动化辰土进神，虽化辰土旬空，但动不为空，待丑日逢值进神有力必得。",
    "timing": "果于丑日得关差。",
    "credibility": 5
  },
  {
    "id": "zsy.case.38",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占仕途出仕（子孙动化退神，辰年得选）"
    },
    "when": {
      "hexagram": [
        49
      ],
      "lineIndex": [
        6
      ],
      "relative": [
        "子孙",
        "官鬼"
      ],
      "conditions": [
        "transform-retreat"
      ],
      "topic": [
        "事业"
      ],
      "note": "火天同人变泽火革 · 未月 丁卯日（旬空：戌亥）"
    },
    "text": "【占仕途出仕（子孙动化退神，辰年得选）】占问：“占功名始得出仕否”。戌土子孙虽动克官，幸动化未土退神，退而不克官星亥水；待辰年冲去戌土克神，官星得用。",
    "timing": "果于辰年得选中进士出仕。",
    "credibility": 5
  },
  {
    "id": "zsy.case.39",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占重病遇医（秋金子孙化退不作退，辰日针愈）"
    },
    "when": {
      "hexagram": [
        43,
        34
      ],
      "lineIndex": [
        5
      ],
      "relative": [
        "子孙"
      ],
      "conditions": [
        "transform-retreat"
      ],
      "topic": [
        "疾病"
      ],
      "note": "泽天夬变雷天大壮 · 申月 辛卯日（旬空：午未）"
    },
    "text": "【占重病遇医（秋金子孙化退不作退，辰日针愈）】占问：“占危重病服药可愈否”。酉金子孙持世化申金，动变皆属秋金当令，占近事不作退神论；子孙持世明日辰日必遇良医。",
    "timing": "果于次日（辰日，辰酉相合）针灸而愈。",
    "credibility": 5
  },
  {
    "id": "zsy.case.40",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "妻占夫病（夫星入墓，冲空己巳日大愈）"
    },
    "when": {
      "hexagram": [
        44,
        10
      ],
      "lineIndex": [
        5
      ],
      "relative": [
        "官鬼"
      ],
      "topic": [
        "疾病"
      ],
      "note": "天风姤变天泽履 / 姤之履 · 申月 戊辰日（旬空：戌亥）"
    },
    "text": "【妻占夫病（夫星入墓，冲空己巳日大愈）】占问：“妻占夫病（夫癸亥命）”。亥水官星为夫，看似夫星夫命皆入日墓；然辰日冲动戌土生申金，申金动生亥水，明日己巳日冲起亥水出空受生，病必霍然。",
    "timing": "果于次日己巳日大愈。",
    "credibility": 5
  },
  {
    "id": "zsy.case.41",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占会试连登（随官入三墓，辰年辰月大魁天下）"
    },
    "when": {
      "hexagram": [
        24,
        19
      ],
      "lineIndex": [
        3,
        6
      ],
      "relative": [
        "官鬼"
      ],
      "topic": [
        "事业"
      ],
      "note": "地雷复变地泽临 / 需 · 戌月 甲寅日（旬空：子丑）"
    },
    "text": "【占会试连登（随官入三墓，辰年辰月大魁天下）】占问：“占会试能否联捷”。午火官星持世动化戌墓、入月建之墓，看似随官入三墓；然寅午戌三合官局旺相当时，明岁辰年冲开戌墓，辰月发榜冲墓，定中状元。",
    "timing": "次年辰年辰月冲开墓库，果连捷高中状元。",
    "credibility": 5
  },
  {
    "id": "zsy.case.42",
    "kind": "case",
    "status": "verified",
    "source": {
      "book": "增删卜易",
      "chapter": "实战占验",
      "note": "占重罪可赦免否（墓神月破如破网，次年辰月蒙赦）"
    },
    "when": {
      "hexagram": [
        47,
        32
      ],
      "lineIndex": [
        1,
        3
      ],
      "relative": [
        "官鬼"
      ],
      "conditions": [
        "month-break",
        "ru-mu"
      ],
      "topic": [
        "诉讼"
      ],
      "note": "泽水困变雷风恒 / 蛊变损 · 未月 戊辰日（旬空：戌亥）"
    },
    "text": "【占重罪可赦免否（墓神月破如破网，次年辰月蒙赦）】占问：“占已定重罪可蒙赦免否”。世爻酉金随鬼入动墓化墓，但日月生扶世爻，丑墓逢未月月破，破网容易得出；明岁酉年值太岁必蒙赦免。",
    "timing": "果于次年辰月蒙朝廷赦免出狱。",
    "credibility": 5
  }
];

export const CASES_DB: KBEntry[] = [...ZENGSHAN_CASES, ...BUSHIQUANSHU_CASES];
