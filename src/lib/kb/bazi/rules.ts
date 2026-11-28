import type { BaZiCalculationResult } from '@/lib/metaphysics/bazi';
import { retrieveEastCanon, type EastCanonBundle, type EastCanonEntry } from '../east-canon';

export const BAZI_CANON_ENTRIES: EastCanonEntry[] = [
  {
    id: 'zpzq.yueling.01',
    source: { book: '子平真栓', chapter: '论用神' },
    keywords: ['正官', '七杀', '正印', '偏印', '正财', '偏财', '食神', '伤官'],
    isGeneral: true,
    text: '八字用神，专求月令，以日干配月令地支而生克不同，格局分焉。财官印食，此四吉神，顺用之；杀伤枭刃，此四凶神，逆用之。',
    timing: '大运流年逢喜用透干会支之岁发福，逢忌神冲克月令用神之年防变。',
    credibility: 5,
  },
  {
    id: 'dts.shuaiwang.01',
    source: { book: '滴天髓', chapter: '体用精神' },
    keywords: ['日主', '身强', '身弱', '平衡', '中和'],
    isGeneral: true,
    text: '道有体用，不可以一端论也，要在扶之抑之得其宜。日主旺者宜泄宜克，日主衰者宜生宜扶，五行流通生化有情为贵。',
    timing: '运途补偏救弊之时最为得力，过旺反遇生扶或衰弱再逢克泄为忌。',
    credibility: 5,
  },
  {
    id: 'qtbj.jia.01',
    source: { book: '穷通宝鉴', chapter: '论甲木' },
    keywords: ['甲木', '甲'],
    text: '甲木参天，脱胎要火，春不容金，秋不容土，火炽乘龙，水宕骑虎，地润天和，植立千古。甲木喜丁火泄秀、庚金劈甲引丁，癸水滋润。',
    timing: '逢丙丁泄秀或庚申劈甲之岁主显达。',
    credibility: 5,
  },
  {
    id: 'qtbj.yi.01',
    source: { book: '穷通宝鉴', chapter: '论乙木' },
    keywords: ['乙木', '乙'],
    text: '乙木虽柔，刲羊解牛，怀丁抱丙，跨凤乘猴，虚湿之地，骑马亦忧，藤萝系甲，可春可秋。乙木最重丙火暖局与癸水润泽。',
    timing: '遇丙丁照暖或甲木藤萝相依之岁运通达。',
    credibility: 5,
  },
  {
    id: 'qtbj.bing.01',
    source: { book: '穷通宝鉴', chapter: '论丙火' },
    keywords: ['丙火', '丙'],
    text: '丙火猛烈，欺霜侮雪，能煅庚金，逢辛反怯，土众成慈，水猖显节。丙火以壬水辅映为上，甲木生发为辅，忌戊土重重晦光。',
    timing: '水火既济之运主声名远播。',
    credibility: 5,
  },
  {
    id: 'qtbj.ding.01',
    source: { book: '穷通宝鉴', chapter: '论丁火' },
    keywords: ['丁火', '丁'],
    text: '丁火柔中，内性昭融，抱乙而孝，合壬而忠，旺而不烈，衰而不穷。丁火最喜甲木引燃、庚金劈甲，不离甲庚二字。',
    timing: '行运逢甲木生扶或庚金成器之年最利功名。',
    credibility: 5,
  },
  {
    id: 'qtbj.wu.01',
    source: { book: '穷通宝鉴', chapter: '论戊土' },
    keywords: ['戊土', '戊'],
    text: '戊土固重，既中且正，静翕动辟，万物司命。水润物生，土燥物病，若在艮坤，怕冲宜静。戊土不离甲木疏劈、癸水润泽与丙火照暖。',
    timing: '甲疏癸润之岁运主根基厚实、事业有成。',
    credibility: 5,
  },
  {
    id: 'qtbj.ji.01',
    source: { book: '穷通宝鉴', chapter: '论己土' },
    keywords: ['己土', '己'],
    text: '己土卑湿，中正蓄藏，不愁木盛，不畏水狂，火少火晦，金多金光。己土喜丙火去湿暖土、癸水滋培万物、甲木合化有情。',
    timing: '逢丙火照耀、癸水滋润之运主名利双收。',
    credibility: 5,
  },
  {
    id: 'qtbj.geng.01',
    source: { book: '穷通宝鉴', chapter: '论庚金' },
    keywords: ['庚金', '庚'],
    text: '庚金带煞，刚健为最，得水而清，得火而锐，土润则生，土燥则脆。庚金喜丁火锻炼成器、壬水淘洗发辉、甲木引丁。',
    timing: '丁壬相济之岁运主权柄与才华齐发。',
    credibility: 5,
  },
  {
    id: 'qtbj.xin.01',
    source: { book: '穷通宝鉴', chapter: '论辛金' },
    keywords: ['辛金', '辛'],
    text: '辛金软弱，温润而清，畏土之叠，乐水之盈，能扶社稷，能救生灵。辛金最喜壬水淘洗珠玉、己土生金不埋、忌丙火合煞或丁火销熔。',
    timing: '见壬水淘洗清澈之岁主贵气显露。',
    credibility: 5,
  },
  {
    id: 'qtbj.ren.01',
    source: { book: '穷通宝鉴', chapter: '论壬水' },
    keywords: ['壬水', '壬'],
    text: '壬水通河，能泄金气，刚中之德，周流不滞。通根透癸，冲天奔地，化则有情，从则相济。壬水喜戊土堤防、庚金发源、丁火合化。',
    timing: '水旺有戊土筑堤或火土相济之运主大展宏图。',
    credibility: 5,
  },
  {
    id: 'qtbj.gui.01',
    source: { book: '穷通宝鉴', chapter: '论癸水' },
    keywords: ['癸水', '癸'],
    text: '癸水至弱，达于天津，得龙而运，功化斯神。不愁火土，不论庚辛，合戊见火，化象斯真。癸水喜辛金发源、丙火暖融、忌戊土合克太过。',
    timing: '辛金生发或火水相济之岁运主灵思通达。',
    credibility: 5,
  },
  {
    id: 'yhzp.shishen.01',
    source: { book: '渊海子平', chapter: '论官杀财印' },
    keywords: ['正官', '七杀', '官杀', '印星', '食神', '伤官'],
    text: '官星要纯，七杀要制；印绶护身，食神制杀，伤官见官需配印以救。财能生官，亦能破印，全在位置配合与先后清浊。',
    timing: '杀印相生或食神制杀成格之运主升迁得权。',
    credibility: 5,
  },
  {
    id: 'zpzq.dayun.01',
    source: { book: '子平真栓', chapter: '论行运' },
    keywords: ['大运', '流年', '岁运'],
    isGeneral: true,
    text: '大运重地支，流年重天干；原局有病，大运得药则发；岁运并临或冲提纲，须防变动与反复。',
    timing: '以十年大运定气候，以逐年流年定应期。',
    credibility: 5,
  },
];

export function retrieveBaziKnowledge(
  data: BaZiCalculationResult,
  question?: string
): EastCanonBundle {
  const summaryParts = [
    data.dayMaster.nameZh,
    data.dayMaster.archetypeZh,
    data.pillars.year.gan + data.pillars.year.zhi,
    data.pillars.month.gan + data.pillars.month.zhi,
    data.pillars.day.gan + data.pillars.day.zhi,
    data.pillars.hour.gan + data.pillars.hour.zhi,
    data.pillars.year.shiShen || '',
    data.pillars.month.shiShen || '',
    data.pillars.hour.shiShen || '',
    question || '',
  ].join(' ');
  return retrieveEastCanon('BZ', BAZI_CANON_ENTRIES, summaryParts, 6);
}
