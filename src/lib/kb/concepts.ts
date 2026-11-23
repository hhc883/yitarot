import type { SixRelativeName, SixBeastName } from '@/lib/metaphysics/najia';
import type { IChingReading } from '@/lib/metaphysics/iching';
import { getPrincipleById, getSanXingTheory } from '@/lib/kb/principles';

export interface RelativeImagery {
  name: SixRelativeName;
  symbolicMeaning: string;
  people: string;
  things: string;
  insight: string;
}

export interface BeastImagery {
  name: SixBeastName;
  character: string;
  positive: string;
  negative: string;
}

export interface LinePositionImagery {
  index: number;
  name: string;
  domain: string;
  weatherHome: string;
  peopleBody: string;
  socialRank: string;
  bodyPart: string;
}

/**
 * 六亲实战功能取象（《增删卜易》与《卜筮全书》通贯）
 */
export const SIX_RELATIVES_IMAGERY: Record<SixRelativeName, RelativeImagery> = {
  父母: {
    name: '父母',
    symbolicMeaning: '庇护与凭证之象',
    people: '父母、尊长、师保、公婆、老者、城主',
    things: '房屋、宅舍、衙门、城池、车舟、衣服、雨具、章奏、公文、契约、照会、敕命、书信、试卷',
    insight: '占功名为官印文书，占出行舟车城池，占疾病克子孙，占财帛耗财力。'
  },
  官鬼: {
    name: '官鬼',
    symbolicMeaning: '名位与祸患两歧之象',
    people: '官长、上司、主事、夫君（婚占）、盗贼、奸细',
    things: '名位、功名、升迁、职役、官司、讼牒、牢狱、邪祟、灾祸、雷霆、火患、毒瘤病灶',
    insight: '功名占视之如麟角宝玉，占病患防灾视之如虎狼鸩毒。随鬼入墓是其最险恶之凶格。'
  },
  兄弟: {
    name: '兄弟',
    symbolicMeaning: '劫财与阻隔之象',
    people: '兄弟、姐妹、同袍、朋友、同事、伴侣、情敌',
    things: '阻隔、分争、耗散、侵蚀、讹诈、门户、隔墙、假借、虚耗',
    insight: '凡占财帛见兄为劫盗克财之神；凡占争端讼事见兄为挑唆之闲人；占婚见兄在间爻必中阻不就。'
  },
  妻财: {
    name: '妻财',
    symbolicMeaning: '财赋与役使之象',
    people: '妻子、妾侍、婢仆、雇工、下人、财主',
    things: '金银、钱帛、货殖、仓廪、粮食、器具、酒食、珍宝',
    insight: '财动克父母，功名占最忌财动伤印文书；占身命见财克世主得财成器，非为凶害。'
  },
  子孙: {
    name: '子孙',
    symbolicMeaning: '福德与销灾之象',
    people: '子孙、儿女、晚辈、僧道、医士、良将',
    things: '医药、饮食、符咒、福禄、宽心、宁息、解药、家畜、生发源泉',
    insight: '名“福神制鬼星”，虽专克官鬼不利占官求名，然解难、御盗、疗病、防祸、谋财之圣神。世持子孙，逢凶化吉。'
  }
};

/**
 * 六神（六兽）情状辅象
 * 核心原旨：“吉凶全由生克，六神唯断情状”
 */
export const SIX_BEASTS_IMAGERY: Record<SixBeastName, BeastImagery> = {
  青龙: {
    name: '青龙',
    character: '主亨通、喜庆、仁慈、宴乐、喜容、贵人提拔',
    positive: '逢生主得贵人扶掖、喜事临门、酒食欢愉',
    negative: '受克克世则主酒色沉沦、喜中致疾、因乐生悲'
  },
  朱雀: {
    name: '朱雀',
    character: '主文书、言语、音信、口舌、论辩、号令、火烛灾祥',
    positive: '生世生用主文书捷报、名声显赫、佳音速达',
    negative: '克世克用主飞短流长、谤毁官非、口舌争竞'
  },
  勾陈: {
    name: '勾陈',
    character: '主留连、迟滞、勾连、牵缠、田土、起造、争端、旧事重提',
    positive: '生世主基业稳固、田土丰厚、有旧友相助',
    negative: '克世主公事牵绊、文书阻滞、旧讼复发、拖延难决'
  },
  螣蛇: {
    name: '螣蛇',
    character: '主惊怪、怪异、虚惊、噩梦、疑虑、羁绊、恍惚不安、潜伏诡诈',
    positive: '生世生官主变通神速、机敏出奇',
    negative: '克世克用主惊疑缠身、怪病虚惊、夜梦不宁、小人暗算'
  },
  白虎: {
    name: '白虎',
    character: '主伤亡、血光、暴疾、孝服、凶丧、兵刃、刚烈、果决',
    positive: '生世生官主军权大将之显赫、威权震慑、决断凌厉',
    negative: '克世克用主暴疾突发、丧服哭泣、骨肉摧折、血光之灾'
  },
  玄武: {
    name: '玄武',
    character: '主暗昧、暧昧、盗窃、私情、阴谋、奸诈、隐遁、水患、难言隐疾',
    positive: '生世主深谋远虑、潜谋获利、玄机独握',
    negative: '克世克用主失盗受欺、暗室亏心、奸伪受骗、阴湿难言'
  }
};

/**
 * 爻位万事立体时空定位（《卜筮全书》浑天甲子爻位法）
 */
export const LINE_POSITIONS_IMAGERY: Record<number, LinePositionImagery> = {
  1: {
    index: 1,
    name: '初爻',
    domain: '基层、平民、子弟、幼苗、步卒、门户、潜伏之地',
    weatherHome: '云、井泉、地基、乡村、左邻后邻',
    peopleBody: '小口、婴儿、贱民、奴仆、足部、鞋袜',
    socialRank: '百姓、下役、庶民',
    bodyPart: '足部、脚踝、趾'
  },
  2: {
    index: 2,
    name: '二爻',
    domain: '家室、母腹、私室、吏员、庭院、厨房、乡党',
    weatherHome: '电、灶堂、厨房、母腹、私室、州县市镇',
    peopleBody: '妻妾、妇人、胎儿、胫骨、膝盖、猫犬',
    socialRank: '县丞僚佐、万民百姓、乡村里正',
    bodyPart: '小腿、胫膝、生殖'
  },
  3: {
    index: 3,
    name: '三爻',
    domain: '门闾、官署门首、中层、同列、腹部、阻隔之所',
    weatherHome: '风、大门、床席、市井、门庭、神祠',
    peopleBody: '兄弟、叔伯、同僚、中层、腰腹、猪豕',
    socialRank: '本县知县、府县主官、关口阻隔',
    bodyPart: '腰腹、臀胯'
  },
  4: {
    index: 4,
    name: '四爻',
    domain: '门户、府门、近臣、佐贰、诸侯、进阶之所',
    weatherHome: '雷、中门、门户、坊镇、右邻前邻',
    peopleBody: '母位、近侍、佐贰、大夫、心胸乳膈、羊畜',
    socialRank: '巡抚都宪、朝廷宰执大臣、省部道台',
    bodyPart: '胸背、心肺'
  },
  5: {
    index: 5,
    name: '五爻',
    domain: '君王、至尊、主将、宰辅、路途、主宰、纲领之位',
    weatherHome: '雨、道路、街衢、京师城邑、正堂',
    peopleBody: '父位、天子、国君、主帅、面貌五官、牛马',
    socialRank: '当今天子、中央政令、朝廷恩命、一把手',
    bodyPart: '颈项、心脑、面部'
  },
  6: {
    index: 6,
    name: '上爻',
    domain: '宗庙、祖茔、郊野、退休、极顶、头颅、穷极绝响',
    weatherHome: '天、栋梁、墙垣、宗庙、祖茔、山林',
    peopleBody: '祖先、太上、郊野隐士、极老之人、头颅头发',
    socialRank: '太上、元老、遗老、世外宗师',
    bodyPart: '发顶、天灵'
  }
};

/**
 * 关键格位与特殊格局（《增删卜易》与《卜筮全书》）
 */
export const SPECIAL_PATTERNS = {
  飞伏神出入: '飞神逢空、月破、休囚，伏神如脱网之鸟，易出易就；飞神得生旺克伏，伏神死死沉沦，此“飞伏辨虚实”之法门。',
  退神不退辩: '动爻化退，占近事逢日月当令（如秋占申化酉、酉化申）者，不作退神论，应期在逢值之时；占久远事方受退神剥夺，不可一概而论。',
  避凶而空: '爻受日月动爻重克刑冲，而恰值旬空，避其锐气；待出空之日免祸成事，因祸得福。',
  六冲变六合: '始遭溃散，终得圆聚；破镜重圆，官讼私和，失物自还。',
  六合变六冲: '结盟反目，成事化虚，买卖先盈后折，临产难生。',
  两鬼两财: '一卦见两官，政令不一，事干两头，反复不常；占婚见两财两官，婚配乖违，重婚续弦。'
};

/**
 * 根据卦象盘面与用神提取精准象意摘要，供 System Instruction 注入
 */
export function buildImagerySnapshot(
  reading: IChingReading,
  yongShenRelatives?: SixRelativeName[]
): string {
  const parts: string[] = [];
  const n = reading.najia;

  // 1. 用神象意（若有明确用神）
  if (yongShenRelatives && yongShenRelatives.length > 0) {
    for (const rel of yongShenRelatives) {
      const info = SIX_RELATIVES_IMAGERY[rel];
      if (info) {
        parts.push(`- 【用神取象·${info.name}】（${info.symbolicMeaning}）：人事主${info.people}；物事主${info.things}。野鹤指归：${info.insight}`);
      }
    }
  }

  // 2. 动爻情态与爻位取象（若有动爻）
  if (n && reading.changingLineIndices && reading.changingLineIndices.length > 0) {
    const movingDesc = reading.changingLineIndices.map(idx => {
      const line = n.lines.find(l => l.lineIndex === idx);
      const pos = LINE_POSITIONS_IMAGERY[idx];
      const beast = line?.sixBeast ? SIX_BEASTS_IMAGERY[line.sixBeast] : undefined;
      let lineText = `第${idx}爻`;
      if (pos) {
        lineText += `（${pos.name}·${pos.domain.split('、').slice(0, 3).join('、')}位）`;
      }
      if (line) {
        lineText += `持${line.relative}${line.branch}${line.element}`;
      }
      if (beast) {
        lineText += `临${beast.name}（${beast.character}）`;
      }
      return lineText;
    });
    parts.push(`- 【动爻时空与情状】：${movingDesc.join('；')}`);
  }

  // 3. 特殊格局判定（《卜筮全书》辨格）
  if (n) {
    const p = reading.primaryHexagram;
    const t = reading.transformedHexagram;
    if (t) {
      // 检查六冲变六合 / 六合变六冲
      const chongHexNums = [1, 2, 51, 52, 53, 54, 29, 30, 25, 33];
      const heHexNums = [11, 12, 31, 32, 17, 18, 45, 46];
      if (chongHexNums.includes(p.number) && heHexNums.includes(t.number)) {
        parts.push(`- 【特殊格局·六冲变六合】：${SPECIAL_PATTERNS.六冲变六合}`);
      } else if (heHexNums.includes(p.number) && chongHexNums.includes(t.number)) {
        parts.push(`- 【特殊格局·六合变六冲】：${SPECIAL_PATTERNS.六合变六冲}`);
      }
    }

    // 检查用神避凶而空
    if (yongShenRelatives && yongShenRelatives.length > 0) {
      const kongLines = n.lines.filter(l => yongShenRelatives.includes(l.relative) && n.timeInfo.xunKong.includes(l.branch));
      if (kongLines.length > 0) {
        parts.push(`- 【特殊格局·避凶而空】：用神落${n.timeInfo.xunKong}旬空，若受克制则得空避凶，出空逢值逢冲之期见吉凶。`);
      }
    }

    // 4. 底层天道与干支机理渊薮（《京氏易传》元典溯源）
    if (n.generationName === '游魂' || n.generationName === '归魂') {
      const p = getPrincipleById('jsyc.wuxing.06');
      if (p) {
        parts.push(`- 【天道消息·${n.generationName}卦】（《京氏易传》元典）：${p.practicalGuidance}`);
      }
    }

    // 检查卦爻与月日地支是否触发三刑（寅巳申、丑戌未、子卯、辰午酉亥）
    const allBranches = new Set<string>([
      n.timeInfo.monthZhi,
      n.timeInfo.dayZhi,
      ...n.lines.map(l => l.branch),
      ...n.lines.filter(l => l.transformed).map(l => l.transformed!.branch)
    ]);

    const hasYinSiShen = allBranches.has('寅') && allBranches.has('巳') && allBranches.has('申');
    const hasChouXuWei = allBranches.has('丑') && allBranches.has('戌') && allBranches.has('未');
    const hasZiMao = allBranches.has('子') && allBranches.has('卯');
    const hasZiXing = ['辰', '午', '酉', '亥'].some(b => {
      const count = [
        n.timeInfo.monthZhi,
        n.timeInfo.dayZhi,
        ...n.lines.map(l => l.branch),
        ...n.lines.filter(l => l.transformed).map(l => l.transformed!.branch)
      ].filter(x => x === b).length;
      return count >= 2;
    });

    if (hasYinSiShen) {
      const p = getSanXingTheory('无恩之刑');
      if (p) parts.push(`- 【干支机理·三刑（无恩之刑）】（《京氏易传》）：${p.originTheory} 指归：${p.practicalGuidance}`);
    } else if (hasChouXuWei) {
      const p = getSanXingTheory('恃势之刑');
      if (p) parts.push(`- 【干支机理·三刑（恃势之刑）】（《京氏易传》）：${p.originTheory} 指归：${p.practicalGuidance}`);
    } else if (hasZiMao) {
      const p = getSanXingTheory('无礼之刑');
      if (p) parts.push(`- 【干支机理·相刑（无礼之刑）】（《京氏易传》）：${p.originTheory} 指归：${p.practicalGuidance}`);
    } else if (hasZiXing) {
      const p = getSanXingTheory('自刑');
      if (p) parts.push(`- 【干支机理·自刑（专旺自戕）】（《京氏易传》）：${p.originTheory} 指归：${p.practicalGuidance}`);
    }
  }

  if (parts.length === 0) {
    return '';
  }

  return `【易理象意与天道指归（增删卜易·卜筮全书·京氏易传会通）】\n${parts.join('\n')}`;
}
