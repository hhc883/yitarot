import type { IChingReading } from '@/lib/metaphysics/iching';
import { normalizeIChingReading } from '@/lib/metaphysics/iching';
import type { ElementName, SixBeastName, SixRelativeName, PalaceName } from '@/lib/metaphysics/najia';
import {
  sheng,
  ke,
  isChong,
  isHe,
  monthState,
  isTomb,
  isJue,
  isAdvance,
  isRetreat,
  BRANCH_ELEMENT,
  type SeasonState
} from './wuxing';
import type { ConditionKey, TopicKey } from './types';

export interface LineFact {
  lineIndex: number;
  lineNameZh: string;
  relative: SixRelativeName;
  branch: string;
  element: ElementName;
  sixBeast: SixBeastName;
  isYang: boolean;
  isShi: boolean;
  isYing: boolean;
  isMoving: boolean;
  monthState: SeasonState;
  dayRelation: '生' | '克' | '比' | '冲' | '合' | '无';
  isMonthBreak: boolean;   // 月支冲本爻
  isDayBreak: boolean;     // 日支冲 + 月令休囚死
  isDarkMove: boolean;     // 静爻 + 月令旺相 + 日支冲
  isXunKong: boolean;      // branch ∈ xunKong
  isTombInDay: boolean;    // element 墓于日支
  transform?: {
    branch: string;
    element: ElementName;
    relative: SixRelativeName;
    kind: '回头生' | '回头克' | '化进神' | '化退神' | '化墓' | '化绝' | '化空' | '化冲' | '比和';
  };
}

export interface ChartFacts {
  monthZhi: string;
  dayZhi: string;
  xunKongList: string[];
  palace: PalaceName;
  palaceElement: ElementName;
  generationName: string;
  isSixChong: boolean;   // 六爻初四/二五/三上三对全冲
  isSixHe: boolean;      // 三对全合
  isFanYin: boolean;     // 内外卦反吟
  isFuYin: boolean;      // 变卦与本卦对应爻地支全同
  lines: LineFact[];
  byRelative: Record<SixRelativeName, LineFact[]>;  // 多现即多条
  conditions: Set<ConditionKey>;
}

/**
 * 用神判定（根据问事关键词与语境自动推导主用神、次用神及原因）
 */
export function resolveYongShen(
  question: string,
  opts?: { gender?: 'male' | 'female'; facts?: ChartFacts }
): {
  primary: SixRelativeName[];
  secondary: SixRelativeName[];
  topic: TopicKey;
  reason: string;
} {
  const q = question.toLowerCase();

  // 1. 财运
  if (/[财钱钞银利]|生意|买卖|投资|收入|工资|回款|合同款|欠款|利润|理财|求财/.test(q)) {
    return {
      topic: '财运',
      primary: ['妻财'],
      secondary: ['子孙'],
      reason: '求财谋利，用神取妻财为养命之源；子孙能生助妻财，列为次用神。'
    };
  }

  // 2. 考试/升学/学业
  if (/考|考研|考公|证书|录取|试卷|学业|答辩|高考|中考|学位/.test(q)) {
    return {
      topic: '考试',
      primary: ['父母'],
      secondary: ['官鬼'],
      reason: '问学业考卷文凭，用神取父母为文章契约；官鬼为功名名次，列为次用神。'
    };
  }

  // 3. 事业/求职/职务
  if (/工作|求职|升职|提拔|岗位|面试|跳槽|领导|体制|编制|创业|职务|官运/.test(q)) {
    return {
      topic: '事业',
      primary: ['官鬼'],
      secondary: ['父母'],
      reason: '问功名仕途事业，用神取官鬼为官阶印绶；父母为文书任命，列为次用神。'
    };
  }

  // 4. 婚恋/情感
  if (/婚|感情|对象|男友|女友|老公|老婆|情|恋爱|复合|分手|相亲|追求|结婚|桃花/.test(q)) {
    if (opts?.gender === 'male' || /男友|老婆|追女生|追她|娶/.test(q)) {
      return {
        topic: '婚恋',
        primary: ['妻财'],
        secondary: ['官鬼'],
        reason: '男占婚姻感情，用神取妻财为妻位正宿；兼察世应生合相向。'
      };
    }
    if (opts?.gender === 'female' || /女友|老公|嫁|追男生|追他/.test(q)) {
      return {
        topic: '婚恋',
        primary: ['官鬼'],
        secondary: ['妻财'],
        reason: '女占婚姻情感，用神取官鬼为夫位正宿；兼察世应生合相向。'
      };
    }
    return {
      topic: '婚恋',
      primary: ['妻财', '官鬼'],
      secondary: [],
      reason: '问婚恋感情，求测者性别未定，财官并看；世应参断彼此和合相向。'
    };
  }

  // 5. 疾病/安危
  if (/病|手术|康复|住院|医生|体检|医药|痊愈|痛|恙|恙痛/.test(q)) {
    return {
      topic: '疾病',
      primary: ['官鬼', '子孙'],
      secondary: ['父母'],
      reason: '问疾病安危，官鬼为病灶邪祟，子孙为良医妙药，两者衰旺并参。'
    };
  }

  // 6. 诉讼/官非
  if (/官司|诉讼|牢|刑|判|仲裁|纠纷|打官司|报警|被诉|立案/.test(q)) {
    return {
      topic: '诉讼',
      primary: ['官鬼'],
      secondary: ['父母'],
      reason: '问官非讼事，官鬼为堂上官府法官，父母为案卷诉状，世应分原告被告。'
    };
  }

  // 7. 出行/移徙
  if (/出行|出差|旅游|移民|航班|签证|上路|出远门|出国/.test(q)) {
    return {
      topic: '出行',
      primary: ['父母'],
      secondary: ['子孙'],
      reason: '问出行旅途，父母为行期舟车路引，子孙为平安福神，世爻为己身安泰。'
    };
  }

  // 8. 家宅/风水
  if (/房子|搬家|装修|租房|买房|购房|宅|建房|祖坟|邻里/.test(q)) {
    return {
      topic: '家宅',
      primary: ['父母'],
      secondary: ['妻财'],
      reason: '问家宅迁居，父母为屋宇栋梁庇佑，妻财为宅内资财聚散。'
    };
  }

  // 9. 寻人
  if (/找人|失联|走失|失踪|归期|何时回|几时来/.test(q)) {
    return {
      topic: '寻人',
      primary: ['兄弟'],
      secondary: [],
      reason: '问寻人去向，依所寻之人定六亲，语境未定暂以同辈兄弟定标。'
    };
  }

  // 10. 失物
  if (/丢|遗失|失落|找不到|被盗|被偷|丢失/.test(q)) {
    return {
      topic: '失物',
      primary: ['妻财'],
      secondary: ['官鬼'],
      reason: '问失物去向，妻财为所失财物原身，官鬼为盗贼潜匿或失落之处。'
    };
  }

  // other 兜底
  return {
    topic: 'other',
    primary: ['官鬼'],
    secondary: ['父母'],
    reason: '未识别明确主题，暂以官鬼为主轴，需在输出结论中明确声明用神取舍。'
  };
}

/**
 * 从 IChingReading 严格推导 ChartFacts（全量盘面事实与条件枚举）
 */
export function deriveChartFacts(rawReading: IChingReading): ChartFacts {
  const reading = normalizeIChingReading(rawReading);
  const najia = reading.najia;
  if (!najia) {
    throw new Error('Reading missing najia chart details.');
  }

  const { timeInfo, lines: rawLines, transformedChart } = najia;
  const monthZhi = timeInfo.monthZhi;
  const dayZhi = timeInfo.dayZhi;
  const dayEl = BRANCH_ELEMENT[dayZhi];
  const xunKongList = (timeInfo.xunKong || '').split('').filter(Boolean);

  const lines: LineFact[] = [];
  const byRelative: Record<SixRelativeName, LineFact[]> = {
    父母: [],
    兄弟: [],
    子孙: [],
    妻财: [],
    官鬼: []
  };
  const conditions = new Set<ConditionKey>();

  // 1. 推导每一爻的盘面事实
  for (const l of rawLines) {
    const isMoving = Boolean(l.isChanging);
    const mState = monthState(monthZhi, l.element);
    const isMBrk = isChong(l.branch, monthZhi);
    const isDChong = isChong(l.branch, dayZhi);
    const isDHe = isHe(l.branch, dayZhi);
    const isXKong = xunKongList.includes(l.branch);
    const isTDay = isTomb(l.element, dayZhi);

    // 日辰与本爻关系
    let dayRelation: LineFact['dayRelation'] = '无';
    if (isDChong) {
      dayRelation = '冲';
    } else if (isDHe) {
      dayRelation = '合';
    } else if (sheng(dayEl, l.element)) {
      dayRelation = '生';
    } else if (ke(dayEl, l.element)) {
      dayRelation = '克';
    } else if (dayEl === l.element) {
      dayRelation = '比';
    }

    // 日破：日辰相冲 且 在月令处于休、囚、死
    const isDayBreak = isDChong && (mState === '休' || mState === '囚' || mState === '死');

    // 暗动：静爻 + 月令旺相 + 被日辰相冲
    const isDarkMove = !isMoving && (mState === '旺' || mState === '相') && isDChong;

    // 变爻分析
    let transform: LineFact['transform'] = undefined;
    if (isMoving && l.transformed) {
      const transBranch = l.transformed.branch;
      const transEl = l.transformed.element;
      const transRel = l.transformed.relative;

      let kind: NonNullable<LineFact['transform']>['kind'] = '比和';
      if (isAdvance(l.branch, transBranch)) {
        kind = '化进神';
        conditions.add('transform-advance');
      } else if (isRetreat(l.branch, transBranch)) {
        kind = '化退神';
        conditions.add('transform-retreat');
      } else if (sheng(transEl, l.element)) {
        kind = '回头生';
        conditions.add('hui-tou-sheng');
      } else if (ke(transEl, l.element)) {
        kind = '回头克';
        conditions.add('hui-tou-ke');
      } else if (isTomb(l.element, transBranch)) {
        kind = '化墓';
        conditions.add('hua-mu');
      } else if (isJue(l.element, transBranch)) {
        kind = '化绝';
        conditions.add('hua-jue');
      } else if (xunKongList.includes(transBranch)) {
        kind = '化空';
        conditions.add('hua-kong');
      } else if (isChong(l.branch, transBranch)) {
        kind = '化冲';
      }

      transform = {
        branch: transBranch,
        element: transEl,
        relative: transRel,
        kind
      };
    }

    if (isMBrk) conditions.add('month-break');
    if (isDayBreak) conditions.add('day-break');
    if (isDarkMove) conditions.add('dark-move');
    if (isXKong) conditions.add('xun-kong');
    if (isTDay) conditions.add('ru-mu');
    if (isMoving) conditions.add('moving');

    const fact: LineFact = {
      lineIndex: l.lineIndex,
      lineNameZh: l.lineNameZh,
      relative: l.relative,
      branch: l.branch,
      element: l.element,
      sixBeast: l.sixBeast,
      isYang: l.isYang,
      isShi: l.isShi,
      isYing: l.isYing,
      isMoving,
      monthState: mState,
      dayRelation,
      isMonthBreak: isMBrk,
      isDayBreak,
      isDarkMove,
      isXunKong: isXKong,
      isTombInDay: isTDay,
      transform
    };

    lines.push(fact);
    byRelative[l.relative].push(fact);
  }

  // 静动条件
  if (!lines.some((l) => l.isMoving)) {
    conditions.add('all-quiet');
  }

  // 2. 六冲卦与六合卦判定（初四、二五、三上三对全冲/全合）
  const b1 = lines[0].branch;
  const b2 = lines[1].branch;
  const b3 = lines[2].branch;
  const b4 = lines[3].branch;
  const b5 = lines[4].branch;
  const b6 = lines[5].branch;

  const isSixChong = isChong(b1, b4) && isChong(b2, b5) && isChong(b3, b6);
  const isSixHe = isHe(b1, b4) && isHe(b2, b5) && isHe(b3, b6);

  if (isSixChong) conditions.add('liu-chong-gua');
  if (isSixHe) conditions.add('liu-he-gua');

  // 3. 世应关系
  const shiLine = lines.find((l) => l.isShi);
  const yingLine = lines.find((l) => l.isYing);
  if (shiLine && yingLine) {
    if (isChong(shiLine.branch, yingLine.branch)) {
      conditions.add('shi-ying-chong');
    } else if (isHe(shiLine.branch, yingLine.branch)) {
      conditions.add('shi-ying-he');
    }
  }

  // 4. 反吟与伏吟（有动爻时判定变卦全盘）
  let isFanYin = false;
  let isFuYin = false;

  if (transformedChart && reading.changingLineIndices.length > 0) {
    const tLines = transformedChart.lines;
    const allChong = lines.every((orig, idx) => isChong(orig.branch, tLines[idx].branch));
    const allSame = lines.every((orig, idx) => orig.branch === tLines[idx].branch);

    if (allChong) {
      isFanYin = true;
      conditions.add('fan-yin');
    }
    if (allSame) {
      isFuYin = true;
      conditions.add('fu-yin');
    }
  }

  return {
    monthZhi,
    dayZhi,
    xunKongList,
    palace: najia.palace,
    palaceElement: najia.palaceElement,
    generationName: najia.generationName,
    isSixChong,
    isSixHe,
    isFanYin,
    isFuYin,
    lines,
    byRelative,
    conditions
  };
}
