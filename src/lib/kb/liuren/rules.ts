import { retrieveEastCanon, type EastCanonBundle, type EastCanonEntry } from '../east-canon';

export const LIUREN_CANON_ENTRIES: EastCanonEntry[] = [
  {
    id: 'dlrzn.zonggang.01',
    source: { book: '大六壬指南', chapter: '九宗门总论' },
    keywords: ['贼克', '比用', '涉害', '遥克', '昴星', '别责', '八专', '伏吟', '反吟'],
    isGeneral: true,
    text: '大六壬以四课定端倪，以三传决始终。初传为事之发端，中传为事之枢纽，末传为事之归宿；干为人，支为宅为事。',
    timing: '三传逢旬空则待出空填实之日，逢合逢冲则按神煞动静定应期。',
    credibility: 5,
  },
  {
    id: 'dlr.zeike_biyong.01',
    source: { book: '壬归', chapter: '贼克比用' },
    keywords: ['贼克', '重审', '元首', '比用', '知一'],
    text: '下贼上为重审，事多由内起而先困后舒；上克下为元首，事从上发而顺理成章；比用知一则取阴阳比合者为用，事关选择与专一。',
    timing: '初传旺相无破，传至末传生旺则吉。',
    credibility: 5,
  },
  {
    id: 'dlr.shehai_yaoke.01',
    source: { book: '大六壬指南', chapter: '涉害遥克' },
    keywords: ['涉害', '见机', '察微', '遥克', '蒿矢', '弹射'],
    text: '涉害主历尽艰辛、反复折腾而后成；遥克如蒿矢弹射，远而难及，虚声多而实惠少，需近取生合。',
    timing: '涉害深者历时较久，待末传救神临日时方解。',
    credibility: 5,
  },
  {
    id: 'dlr.fuyin_fanyin.01',
    source: { book: '毕法赋', chapter: '伏吟反吟' },
    keywords: ['伏吟', '反吟', '八专', '别责', '昴星'],
    text: '伏吟主迟滞不动、呻吟难进，宜静守不宜妄动；反吟主反复无常、来去不定，事多翻覆；别责不备主事有欠缺，八专主干支同位、近亲或私情纠葛。',
    timing: '伏吟待冲发之时动，反吟防中途生变。',
    credibility: 5,
  },
  {
    id: 'dlr.tianjiang.01',
    source: { book: '大六壬指南', chapter: '十二天将' },
    keywords: ['贵人', '青龙', '六合', '太常', '太阴', '天后', '白虎', '玄武', '腾蛇', '朱雀', '勾陈', '天空'],
    isGeneral: true,
    text: '贵人、青龙、六合、太常、太阴、天后为六吉将，主助力、财帛、和合、喜庆；腾蛇主惊疑、朱雀主口舌文书、勾陈主争讼迟滞、白虎主凶伤刚猛、玄武主欺盗暗昧、天空主虚诈空耗。',
    timing: '吉将生合日干则事成，凶将克害日干或发用须防阻折。',
    credibility: 5,
  },
  {
    id: 'dlr.xunkong.01',
    source: { book: '毕法赋', chapter: '空亡论' },
    keywords: ['空', '旬空', '驿马'],
    text: '吉神落空则吉减，凶神落空则凶消；初传空亡主事端虚浮难起，末传空亡主虎头蛇尾、难有实果。',
    timing: '以出空填实或冲实之日时为应验之期。',
    credibility: 5,
  },
];

export function retrieveLiurenKnowledge(chartSummary: string, question?: string): EastCanonBundle {
  return retrieveEastCanon('LR', LIUREN_CANON_ENTRIES, `${chartSummary} ${question || ''}`, 6);
}
