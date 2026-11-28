import { retrieveEastCanon, type EastCanonBundle, type EastCanonEntry } from '../east-canon';

export const QIMEN_CANON_ENTRIES: EastCanonEntry[] = [
  {
    id: 'ybdsg.zonggang.01',
    source: { book: '烟波钓叟歌', chapter: '总诀' },
    keywords: ['值符', '值使', '阳遁', '阴遁'],
    isGeneral: true,
    text: '甲为天福、乙丙丁为三奇，值符为十神之首，值使为八门之司。凡看局先审值符、值使落宫旺衰及与用神宫生克。',
    timing: '以值使门落宫数或冲合填实之日时为应期。',
    credibility: 5,
  },
  {
    id: 'qmdj.sanji.01',
    source: { book: '奇门遁甲统宗', chapter: '八门吉凶' },
    keywords: ['开门', '休门', '生门'],
    text: '开、休、生为三吉门：开门宜远行求官见贵，休门宜休养谒贵和合，生门宜求财营建兴业。吉门得奇，诸事大吉。',
    timing: '三吉门逢旺相之月日或填实之时见功。',
    credibility: 5,
  },
  {
    id: 'qmdj.xiongmen.01',
    source: { book: '奇门遁甲统宗', chapter: '八门吉凶' },
    keywords: ['死门', '惊门', '伤门', '杜门', '景门'],
    text: '伤门主变动争执，杜门主闭塞阻隔宜潜藏，景门主文书虚诈防口舌，死门主停滞终结，惊门主惊恐疑虑诉讼。凶门克宫须防阻滞。',
    timing: '凶门受制或逢冲破之日时方解。',
    credibility: 5,
  },
  {
    id: 'qmdj.jiuxing.01',
    source: { book: '奇门遁甲统宗', chapter: '九星象意' },
    keywords: ['天心', '天辅', '天任', '天冲', '天蓬', '天芮', '天柱', '天英'],
    text: '天心、天辅、天任、天禽为吉星，天冲次吉；天蓬主大盗破耗，天芮主病痛纠葛，天柱主破坏口舌，天英主血光虚火。星得月令旺气则力大。',
    timing: '吉星乘旺、凶星休囚之时事易转安。',
    credibility: 5,
  },
  {
    id: 'qmdj.bashen.01',
    source: { book: '御定奇门宝鉴', chapter: '八神主应' },
    keywords: ['腾蛇', '太阴', '六合', '白虎', '玄武', '九地', '九天'],
    text: '值符护佑，腾蛇主惊怪缠绕，太阴主阴私密谋，六合主婚姻交易和合，白虎主凶伤刚猛，玄武主欺瞒暗昧，九地宜静守屯藏，九天宜扬威远行。',
    timing: '九天宜速动，九地宜久待。',
    credibility: 5,
  },
  {
    id: 'qmdj.kongma.01',
    source: { book: '奇门遁甲统宗', chapter: '空亡马星' },
    keywords: ['旬空', '空', '马星'],
    isGeneral: true,
    text: '旬空之宫吉凶减半，静中待填实或冲空而应；驿马动则事机急促，远行迁移多在马星逢冲之日应验。',
    timing: '出空、填实、冲马星之日时为应期。',
    credibility: 5,
  },
];

export function retrieveQimenKnowledge(chartSummary: string, question?: string): EastCanonBundle {
  return retrieveEastCanon('QM', QIMEN_CANON_ENTRIES, `${chartSummary} ${question || ''}`, 6);
}
