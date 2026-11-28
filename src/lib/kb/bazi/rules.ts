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
  {
    id: 'smth.chong.01',
    source: { book: '三命通会', chapter: '论冲合' },
    keywords: ['冲月令', '冲提纲', '冲日支', '天克地冲', '岁运并临'],
    isGeneral: true,
    text: '岁运冲提纲（月令），主门户、学业、职业或居住环境剧变；冲日支（夫妻宫），主婚恋情感、伴侣关系或贴身合作波动；天克地冲或岁运并临，主当年多有重大抉择、迁动或破耗。',
    timing: '逢冲之年即应其动，尤以四季交节及冲月为甚。',
    credibility: 5,
  },
  {
    id: 'dts.suiyun.01',
    source: { book: '滴天髓', chapter: '岁运论' },
    keywords: ['正官', '七杀', '偏财', '正财', '食神', '伤官', '正印', '偏印'],
    text: '岁运逢财官印食透清且无刑冲破害，主升迁、学业得名、置产进财或良缘成就；若逢枭神夺食、伤官见官或比劫夺财，则主口舌是非、计划受阻、破财或身心劳顿。',
    timing: '以流年干支十神与原局喜忌定当年吉凶事象。',
    credibility: 5,
  },
];

const CHONG_MAP: Record<string, string> = {
  子: '午', 午: '子', 丑: '未', 未: '丑',
  寅: '申', 申: '寅', 卯: '酉', 酉: '卯',
  辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳',
};

const KE_MAP: Record<string, string> = {
  Wood: 'Earth',
  Earth: 'Water',
  Water: 'Fire',
  Fire: 'Metal',
  Metal: 'Wood',
};

const STEM_EL: Record<string, string> = {
  甲: 'Wood', 乙: 'Wood', 丙: 'Fire', 丁: 'Fire', 戊: 'Earth',
  己: 'Earth', 庚: 'Metal', 辛: 'Metal', 壬: 'Water', 癸: 'Water',
};

const STEM_POLARITY: Record<string, number> = {
  甲: 1, 丙: 1, 戊: 1, 庚: 1, 壬: 1,
  乙: 0, 丁: 0, 己: 0, 辛: 0, 癸: 0,
};

export function getTenGod(dayStem: string, targetStem: string): string {
  const dEl = STEM_EL[dayStem];
  const tEl = STEM_EL[targetStem];
  if (!dEl || !tEl) return '';
  const samePol = STEM_POLARITY[dayStem] === STEM_POLARITY[targetStem];
  if (dEl === tEl) return samePol ? '比肩' : '劫财';
  if (KE_MAP[dEl] === tEl) return samePol ? '偏财' : '正财';
  if (KE_MAP[tEl] === dEl) return samePol ? '七杀' : '正官';
  // dEl generates tEl
  const genMap: Record<string, string> = { Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood' };
  if (genMap[dEl] === tEl) return samePol ? '食神' : '伤官';
  return samePol ? '偏印' : '正印';
}

export interface BaziPastEventNode {
  year: number;
  age: number;
  liuNianGanZhi: string;
  daYunGanZhi: string;
  tenGod: string;
  triggers: string[];
  eventHintZh: string;
  eventHintEn: string;
  weight: number;
}

export function analyzeBaziPastEvents(
  data: BaZiCalculationResult,
  referenceYear = new Date().getFullYear()
): {
  currentAge: number;
  pastDaYunSummary: string[];
  keyPastEvents: BaziPastEventNode[];
} {
  const currentAge = Math.max(1, referenceYear - data.birthSolar.year + 1);
  const dm = data.dayMaster.stem;
  const { year: yp, month: mp, day: dp, hour: hp } = data.pillars;

  const daYunSteps = data.yun?.daYun || [];
  const pastDaYunSummary = daYunSteps
    .filter((d) => !d.isXiaoYun && d.startYear <= referenceYear)
    .map((d) => {
      const tg = getTenGod(dm, d.ganZhi[0]);
      const status = d.endYear >= referenceYear ? '（当前大运）' : '';
      return `${d.startYear}~${d.endYear}年（${d.startAge}~${d.endAge}岁）：${d.ganZhi}大运（${tg}）${status}`;
    });

  const candidates: BaziPastEventNode[] = [];
  for (const dy of daYunSteps) {
    if (dy.isXiaoYun) continue;
    for (const ln of dy.liuNian || []) {
      if (ln.year < data.birthSolar.year + 7 || ln.year > referenceYear) continue;
      const lnGan = ln.ganZhi[0];
      const lnZhi = ln.ganZhi[1];
      const tenGod = getTenGod(dm, lnGan);
      const triggers: string[] = [];
      const hintsZh: string[] = [];
      const hintsEn: string[] = [];
      let weight = 0;

      if (ln.ganZhi === dy.ganZhi) {
        triggers.push('岁运并临');
        hintsZh.push('岁运并临，当年容易出现人生大跨度转折、环境迁移或家宅重大变动');
        hintsEn.push('Sui-Yun overlap: major life turning point, relocation, or family shift');
        weight += 5;
      }
      if (CHONG_MAP[lnZhi] === mp.zhi) {
        triggers.push('冲月令提纲');
        if (ln.age <= 22) {
          hintsZh.push('月令受冲，多应升学、离开原生家庭外出求学或家境变动');
          hintsEn.push('Month pillar clashed: school transition, leaving home, or family change');
        } else {
          hintsZh.push('月令提纲受冲，多应换工作、岗位调整、行业赛道切换或搬迁');
          hintsEn.push('Month pillar clashed: job change, career pivot, or relocation');
        }
        weight += 4;
      }
      if (CHONG_MAP[lnZhi] === dp.zhi) {
        triggers.push('冲日支夫妻宫');
        if (ln.age >= 18) {
          hintsZh.push('日支夫妻宫受冲，主感情分合、婚恋定局或重要合作关系变动');
          hintsEn.push('Day branch (spouse palace) clashed: relationship milestone or breakup');
        } else {
          hintsZh.push('日支受冲，主内心波动较大、生活作息或居住环境变化');
          hintsEn.push('Day branch clashed: emotional turbulence or living environment shift');
        }
        weight += 4;
      }
      if (CHONG_MAP[lnZhi] === yp.zhi) {
        triggers.push('冲年支祖上宫');
        hintsZh.push('年支受冲，易有远行、长辈健康波动或家庭事务操心');
        hintsEn.push('Year branch clashed: long travel or elder family concerns');
        weight += 2;
      }
      if (CHONG_MAP[lnZhi] === hp.zhi) {
        triggers.push('冲时支');
        hintsZh.push('时支受冲，主项目落地波折、奔波外出或晚辈/下属事务变化');
        hintsEn.push('Hour branch clashed: project changes, travel, or junior/subordinate matters');
        weight += 2;
      }
      if (
        (KE_MAP[STEM_EL[lnGan]] === STEM_EL[mp.gan] && CHONG_MAP[lnZhi] === mp.zhi) ||
        (KE_MAP[STEM_EL[lnGan]] === STEM_EL[dp.gan] && CHONG_MAP[lnZhi] === dp.zhi)
      ) {
        triggers.push('天克地冲');
        hintsZh.push('构成天克地冲，当年压力感明显、需防破耗或突发重大抉择');
        hintsEn.push('Heavenly-Earthly clash: heightened pressure, expense, or abrupt decision');
        weight += 3;
      }

      if (triggers.length > 0) {
        if (tenGod === '正官' || tenGod === '七杀') {
          hintsZh.push(`流年透${tenGod}，多伴随职场压力、考核晋升或责任加重`);
        } else if (tenGod === '正财' || tenGod === '偏财') {
          hintsZh.push(`流年透${tenGod}，财务收支波动或置产/投资动作明显`);
        } else if (tenGod === '食神' || tenGod === '伤官') {
          hintsZh.push(`流年透${tenGod}，想法增多、不甘现状、主动寻求突破或口舌是非`);
        } else if (tenGod === '正印' || tenGod === '偏印') {
          hintsZh.push(`流年透${tenGod}，进修考证、贵人/长辈介入或心态内敛调整`);
        }

        candidates.push({
          year: ln.year,
          age: ln.age,
          liuNianGanZhi: ln.ganZhi,
          daYunGanZhi: dy.ganZhi,
          tenGod,
          triggers,
          eventHintZh: hintsZh.join('；'),
          eventHintEn: hintsEn.join('; '),
          weight,
        });
      }
    }
  }

  // 按权重与时间跨度挑选最多 5 个代表性过往年份（兼顾早年/青年/近五年）
  candidates.sort((a, b) => b.weight - a.weight || b.year - a.year);
  const selected: BaziPastEventNode[] = [];
  for (const c of candidates) {
    if (selected.length >= 5) break;
    if (selected.some((s) => Math.abs(s.year - c.year) <= 1)) continue;
    selected.push(c);
  }
  selected.sort((a, b) => a.year - b.year);

  return { currentAge, pastDaYunSummary, keyPastEvents: selected };
}

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
    '冲月令',
    '冲日支',
    '大运',
    question || '',
  ].join(' ');
  return retrieveEastCanon('BZ', BAZI_CANON_ENTRIES, summaryParts, 8);
}
