import { retrieveEastCanon, type EastCanonBundle, type EastCanonEntry } from '../east-canon';

export const ZIWEI_CANON_ENTRIES: EastCanonEntry[] = [
  {
    id: 'zwds.zonggang.01',
    source: { book: '紫微斗数全书', chapter: '骨髓赋' },
    keywords: ['命宫', '身宫', '五行局', '命主', '身主'],
    isGeneral: true,
    text: '看命先定命身两宫，次察三方四正（命宫、迁移、官禄、财帛）之星曜庙旺利陷及煞星吉化。身宫主后天执着与中年归宿，命宫主先天格局与性情底色。',
    timing: '以十年大限定大势，以小限与流年四化引动吉凶。',
    credibility: 5,
  },
  {
    id: 'zwds.sihua.01',
    source: { book: '紫微斗数全书', chapter: '论四化' },
    keywords: ['化禄', '化权', '化科', '化忌', '禄', '权', '科', '忌'],
    isGeneral: true,
    text: '禄主财源情缘与丰足，权主决断掌权与开拓，科主名声文书与贵人解厄，忌主执念阻碍、是非损耗。生年四化定先天之象，运限四化主后天应期。',
    timing: '忌星冲照之大限流年宜保守，禄权科会照之年主得机缘。',
    credibility: 5,
  },
  {
    id: 'zwds.ziwei_tianfu.01',
    source: { book: '紫微斗数全书', chapter: '诸星问答论' },
    keywords: ['紫微', '天府', '天相'],
    text: '紫微为北斗帝星，喜百官朝拱（辅弼昌曲魁钺），孤君则独断难成；天府为南斗令星，主库藏稳健、化厄延寿；天相为印星，主辅佐公正与契约。',
    timing: '逢左右辅弼或禄存会照之限运最显贵气。',
    credibility: 5,
  },
  {
    id: 'zwds.jishajuzhu.01',
    source: { book: '紫微斗数全书', chapter: '诸星问答论' },
    keywords: ['天机', '太阴', '天同', '天梁'],
    text: '机月同梁作吏人，天机主谋略变动，太阴主财富田宅与柔情，天同主福泽享乐，天梁主荫庇清贵与逢凶化吉，四星会聚宜公职、企划、顾问或专业技术。',
    timing: '动静有序之岁运最利发挥智谋与名望。',
    credibility: 5,
  },
  {
    id: 'zwds.shapolang.01',
    source: { book: '紫微斗数全书', chapter: '诸星问答论' },
    keywords: ['七杀', '破军', '贪狼', '武曲', '廉贞'],
    text: '杀破狼竹萝三限为人生开创与剧变之枢机：七杀主刚断攻坚，破军主先破后立、革新变动，贪狼主欲望交际与多才艺；武曲主财帛刚毅，廉贞主囚煞交际与是非转化。',
    timing: '行至杀破狼大限多有环境、职业或重大方向转换。',
    credibility: 5,
  },
  {
    id: 'zwds.ri_ju.01',
    source: { book: '紫微斗数全书', chapter: '诸星问答论' },
    keywords: ['太阳', '巨门', '空宫'],
    text: '太阳喜居旺宫照耀，失陷则劳碌奔波；巨门主口才是非与暗昧疑虑，最喜化禄权解其暗；命宫无正曜（空宫）则借对宫迁移星曜参看，重环境与贵人牵引。',
    timing: '太阳得地或巨门化禄权之年主言论生财、名声渐起。',
    credibility: 5,
  },
];

export function retrieveZiweiKnowledge(chartSummary: string, question?: string): EastCanonBundle {
  return retrieveEastCanon('ZW', ZIWEI_CANON_ENTRIES, `${chartSummary} ${question || ''}`, 6);
}
