/**
 * Historical divinatory basis for the 78 Rider-Waite-Smith Tarot cards,
 * traced directly to A. E. Waite, *The Pictorial Key to the Tarot*, Part III
 * (§2 Lesser Arcana, §3 Greater Arcana, §4 Additional Meanings for Two of Cups reversed).
 *
 * All entries are concise original paraphrases of selected historical themes
 * from the verified Wikisource edition, never personal inferences.
 */

export const WAITE_SOURCE_URL =
  'https://en.wikisource.org/w/index.php?title=The_Pictorial_Key_to_the_Tarot/Part_3&oldid=15274510';

export type WaitePartSection = 'Part III §2' | 'Part III §3' | 'Part III §4';

export interface WaiteOrientationBasis {
  en: string;
  zh: string;
  section?: WaitePartSection;
  sectionCode?: 2 | 3 | 4;
}

export interface WaiteCardBasisEntry {
  cardNameEn: string;
  cardNameZh: string;
  section: WaitePartSection;
  sectionCode: 2 | 3 | 4;
  upright: WaiteOrientationBasis;
  reversed: WaiteOrientationBasis;
}

export interface TarotEvidence {
  basisText: string;
  sourceName: string;
  sourceUrl: string;
  sourceRef: string;
}

export const WAITE_CARD_BASIS: Record<string, WaiteCardBasisEntry> = {
  // ================= Major Arcana (22) — Part III §3 =================
  'the-fool': {
    cardNameEn: 'The Fool',
    cardNameZh: '愚人',
    section: 'Part III §3',
    sectionCode: 3,
    upright: {
      en: 'Folly, mania, extravagance, intoxication, frenzy, and unguarded exposure.',
      zh: '愚行执迷、铺张失度、沉醉狂乱以及毫无防备的显露。',
    },
    reversed: {
      en: 'Negligence, absence of mind, carelessness, apathy, nullity, and vanity.',
      zh: '疏忽大意、心不在焉、漫不经心、冷漠虚无与徒劳虚荣。',
    },
  },
  'the-magician': {
    cardNameEn: 'The Magician',
    cardNameZh: '魔术师',
    section: 'Part III §3',
    sectionCode: 3,
    upright: {
      en: 'Skill, diplomacy, subtlety, self-confidence, and will, alongside vulnerability to loss or snares.',
      zh: '机巧、外交手腕、敏锐、自信与意志力，亦含病痛损耗或受陷之虞。',
    },
    reversed: {
      en: 'Healer or adept, yet also mental distress, disgrace, and inner disquiet.',
      zh: '医者与智士之象，亦指心神失调、蒙羞受辱与内心不安。',
    },
  },
  'the-high-priestess': {
    cardNameEn: 'The High Priestess',
    cardNameZh: '女祭司',
    section: 'Part III §3',
    sectionCode: 3,
    upright: {
      en: 'Secrets, mystery, an unrevealed future, silence, tenacity, wisdom, and knowledge.',
      zh: '隐秘奥义、尚未显露的前路、缄默坚毅、智慧与深奥学识。',
    },
    reversed: {
      en: 'Unchecked passion or ardour, conceit, and superficial knowledge.',
      zh: '躁动的热情、身心情欲炽盛、自负骄矜以及浮于表面的认知。',
    },
  },
  'the-empress': {
    cardNameEn: 'The Empress',
    cardNameZh: '皇后',
    section: 'Part III §3',
    sectionCode: 3,
    upright: {
      en: 'Fruitfulness, action, initiative, and longevity, alongside hidden matters, doubt, or difficulty.',
      zh: '丰饶多产、主动行动力与长久生机，亦兼及隐秘未知、疑虑与阻滞。',
    },
    reversed: {
      en: 'Light, truth, unravelling of tangled matters, and public joy, or alternatively vacillation.',
      zh: '光明真相、复杂纠葛得以理清与众人欢庆，别解亦指摇摆不定。',
    },
  },
  'the-emperor': {
    cardNameEn: 'The Emperor',
    cardNameZh: '皇帝',
    section: 'Part III §3',
    sectionCode: 3,
    upright: {
      en: 'Stability, power, protection, realization, reason, conviction, authority, and will.',
      zh: '稳固根基、权力庇护、落实成真、理性信念以及权威意志。',
    },
    reversed: {
      en: 'Benevolence, compassion, and credit, alongside obstruction, immaturity, or confounded rivals.',
      zh: '仁厚慈悯与信誉，亦指阻碍掣肘、心智未熟或令对手陷入混乱。',
    },
  },
  'the-hierophant': {
    cardNameEn: 'The Hierophant',
    cardNameZh: '教皇',
    section: 'Part III §3',
    sectionCode: 3,
    upright: {
      en: 'Alliance, marriage, or binding obligation; alternatively mercy, goodness, inspiration, and counsel.',
      zh: '联结盟约、羁绊从属，另一说亦指慈悲良善、灵性启迪与求教之师。',
    },
    reversed: {
      en: 'Fellowship, good understanding, and concord, alongside excessive leniency or weakness.',
      zh: '社群融洽、彼此体谅与和谐，亦含过度宽纵与软弱之弊。',
    },
  },
  'the-lovers': {
    cardNameEn: 'The Lovers',
    cardNameZh: '恋人',
    section: 'Part III §3',
    sectionCode: 3,
    upright: {
      en: 'Attraction, love, beauty, and trials successfully overcome.',
      zh: '相互吸引、爱意、美好和谐以及历经考验后的圆满克服。',
    },
    reversed: {
      en: 'Failure, foolish designs, frustrated union, and various contrarieties.',
      zh: '计划挫败、愚妄构想、良缘受阻以及种种事与愿违的波折。',
    },
  },
  'the-chariot': {
    cardNameEn: 'The Chariot',
    cardNameZh: '战车',
    section: 'Part III §3',
    sectionCode: 3,
    upright: {
      en: 'Timely succour and providence, alongside conflict, triumph, presumption, and trouble.',
      zh: '及时援手与天意庇佑，亦兼及争战、凯旋、傲慢自负与纷扰。',
    },
    reversed: {
      en: 'Disorder, quarrel, dispute, litigation, and defeat.',
      zh: '喧嚣失序、口角争端、诉讼纠纷以及受挫失利。',
    },
  },
  'strength': {
    cardNameEn: 'Strength',
    cardNameZh: '力量',
    section: 'Part III §3',
    sectionCode: 3,
    upright: {
      en: 'Power, energy, action, courage, magnanimity, and full success with honour.',
      zh: '力量、沛然精力、果敢行动、宽宏气度以及圆满成功与尊荣。',
    },
    reversed: {
      en: 'Despotism, abuse of power, weakness, discord, and potential disgrace.',
      zh: '专横跋扈、滥用权柄、怯懦失和，乃至蒙受羞辱。',
    },
  },
  'the-hermit': {
    cardNameEn: 'The Hermit',
    cardNameZh: '隐士',
    section: 'Part III §3',
    sectionCode: 3,
    upright: {
      en: 'Prudence and circumspection, yet in older divinatory lore also dissimulation, roguery, or betrayal.',
      zh: '审慎周全与深思熟虑，然古占卜义亦特指隐匿伪装、欺诈或背叛。',
    },
    reversed: {
      en: 'Concealment, disguise, calculated policy, fear, and unreasoned caution.',
      zh: '遮掩伪装、权宜算计、心怀畏惧以及过度的无端戒备。',
    },
  },
  'wheel-of-fortune': {
    cardNameEn: 'Wheel of Fortune',
    cardNameZh: '命运之轮',
    section: 'Part III §3',
    sectionCode: 3,
    upright: {
      en: 'Destiny, turning fortune, success, elevation, luck, and felicity.',
      zh: '命运流转、时运顺遂、成功晋升、幸运与喜乐。',
    },
    reversed: {
      en: 'Increase, abundance, and even superfluity.',
      zh: '增益扩充、丰饶充盈乃至盈余过剩。',
    },
  },
  'justice': {
    cardNameEn: 'Justice',
    cardNameZh: '正义',
    section: 'Part III §3',
    sectionCode: 3,
    upright: {
      en: 'Equity, rightness, probity, decisive execution, and fair vindication.',
      zh: '公平正义、正直诚笃、果断执行以及理直一方的公正胜出。',
    },
    reversed: {
      en: 'Legal entanglement, procedural complications, bigotry, bias, and excessive severity.',
      zh: '繁复的法律纠葛、程序缠绕、偏见狭隘以及失之严苛。',
    },
  },
  'the-hanged-man': {
    cardNameEn: 'The Hanged Man',
    cardNameZh: '倒吊人',
    section: 'Part III §3',
    sectionCode: 3,
    upright: {
      en: 'Wisdom, circumspection, discernment, trials, willing sacrifice, and deep intuition.',
      zh: '智慧审慎、明辨洞察、历经试炼、奉献舍得以及深层直觉。',
    },
    reversed: {
      en: 'Selfishness and absorption in the crowd or worldly collective.',
      zh: '私心计较、随波逐流于众人以及世俗群体的牵绊。',
    },
  },
  'death': {
    cardNameEn: 'Death',
    cardNameZh: '死神',
    section: 'Part III §3',
    sectionCode: 3,
    upright: {
      en: 'Endings, mortality, dissolution, loss of support, and thwarted plans or contrarieties.',
      zh: '终结谢幕、消逝瓦解、失去庇护助力以及计划受阻与波折。',
    },
    reversed: {
      en: 'Inertia, deep lethargy, stagnation, sleepwalking through life, and dashed hope.',
      zh: '惰性停滞、昏沉麻木、僵化停步以及希望落空。',
    },
  },
  'temperance': {
    cardNameEn: 'Temperance',
    cardNameZh: '节制',
    section: 'Part III §3',
    sectionCode: 3,
    upright: {
      en: 'Economy, moderation, frugality, steady management, and harmonious accommodation.',
      zh: '节制有度、中庸节俭、妥善调理以及彼此体谅融通。',
    },
    reversed: {
      en: 'Institutional or religious ties, alongside disunion, awkward combinations, and competing interests.',
      zh: '宗教礼制相关事务，亦指失和分裂、错位组合以及利益冲突。',
    },
  },
  'the-devil': {
    cardNameEn: 'The Devil',
    cardNameZh: '恶魔',
    section: 'Part III §3',
    sectionCode: 3,
    upright: {
      en: 'Vehemence, extraordinary effort, forceful drive, and weighty necessity not inherently evil.',
      zh: '猛烈冲击、激烈躁动、非常之努力与强大驱力（原文特指未必为恶）。',
    },
    reversed: {
      en: 'Unfortunate compulsion, weakness, pettiness, and spiritual blindness.',
      zh: '厄运牵制、软弱无力、气量狭小以及盲目迷失。',
    },
  },
  'the-tower': {
    cardNameEn: 'The Tower',
    cardNameZh: '高塔',
    section: 'Part III §3',
    sectionCode: 3,
    upright: {
      en: 'Distress, adversity, disgrace, deception, and sudden, unforeseen upheaval.',
      zh: '困厄窘迫、逆境倾覆、蒙羞欺瞒以及始料未及的骤然剧变。',
    },
    reversed: {
      en: 'Similar upheaval in lesser degree, alongside oppression, confinement, and tyranny.',
      zh: '程度较轻的同类剧变，亦指压迫禁锢与专断高压。',
    },
  },
  'the-star': {
    cardNameEn: 'The Star',
    cardNameZh: '星星',
    section: 'Part III §3',
    sectionCode: 3,
    upright: {
      en: 'Privation, loss, and abandonment in older lore, yet another reading affirms hope and bright prospects.',
      zh: '古义含匮乏、失落与遭弃之感，另一释义则指向希望与光明前景。',
    },
    reversed: {
      en: 'Arrogance, haughtiness, and a sense of powerlessness.',
      zh: '傲慢自大、盛气凌人以及力不从心的无力感。',
    },
  },
  'the-moon': {
    cardNameEn: 'The Moon',
    cardNameZh: '月亮',
    section: 'Part III §3',
    sectionCode: 3,
    upright: {
      en: 'Hidden opposition, danger, calumny, darkness, deception, and error.',
      zh: '暗处敌意、险阻诽谤、幽暗惊惧、欺瞒幻象与迷误。',
    },
    reversed: {
      en: 'Instability, inconstancy, silence, and milder degrees of deception or error.',
      zh: '动荡不稳、反复无常、缄默不语以及程度较轻的欺瞒与失误。',
    },
  },
  'the-sun': {
    cardNameEn: 'The Sun',
    cardNameZh: '太阳',
    section: 'Part III §3',
    sectionCode: 3,
    upright: {
      en: 'Material happiness, fortunate union, and heartfelt contentment.',
      zh: '物质层面的喜乐、美满良缘以及由衷的满足安泰。',
    },
    reversed: {
      en: 'The same happiness, union, and contentment experienced in a lesser degree.',
      zh: '同正位之喜乐、良缘与满足，惟程度稍减。',
    },
  },
  'judgement': {
    cardNameEn: 'Judgement',
    cardNameZh: '审判',
    section: 'Part III §3',
    sectionCode: 3,
    upright: {
      en: 'Change of position, renewal, and decisive outcome, though an alternate note warns of legal loss.',
      zh: '处境转变、焕然更新与终局结果，别解亦警示诉讼败损之虞。',
    },
    reversed: {
      en: 'Weakness, timidity, and naivety, alongside deliberation, decision, and formal judgment.',
      zh: '怯懦软弱与天真轻信，亦指审慎斟酌、决断与裁决。',
    },
  },
  'the-world': {
    cardNameEn: 'The World',
    cardNameZh: '世界',
    section: 'Part III §3',
    sectionCode: 3,
    upright: {
      en: 'Assured success, recompense, voyage, relocation, and change of place.',
      zh: '笃定的成功、应得回报、远航迁徙与所处之地的转变。',
    },
    reversed: {
      en: 'Inertia, fixity, stagnation, and unchanging permanence.',
      zh: '惰性凝滞、固守不变、停滞不前以及持久的僵局。',
    },
  },

  // ================= Minor Arcana: Wands (14) — Part III §2 =================
  'ace-of-wands': {
    cardNameEn: 'Ace of Wands',
    cardNameZh: '权杖一',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Creation, invention, enterprise, and the vital origin or starting point of new undertakings.',
      zh: '创造、发明与开创事业之源头，亦含本源、生机与财富传承。',
    },
    reversed: {
      en: 'Decline, decay, ruin, or a joy overshadowed by cloud.',
      zh: '衰落、颓败与倾覆之象，亦或是一种蒙上阴影的喜悦。',
    },
  },
  'two-of-wands': {
    cardNameEn: 'Two of Wands',
    cardNameZh: '权杖二',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'A sharp contrast between worldly grandeur and fortune on one side, and chagrin or inner mortification on the other.',
      zh: '一面是财富与显赫气度，另一面则是懊恼、忧郁与身心煎熬。',
    },
    reversed: {
      en: 'Sudden surprise, wonder, heightened emotion, trouble, or fear.',
      zh: '惊奇震撼、心神摇曳、情绪起伏以及随之而来的困扰与畏惧。',
    },
  },
  'three-of-wands': {
    cardNameEn: 'Three of Wands',
    cardNameZh: '权杖三',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Established strength, enterprise, commerce, discovery, and capable business cooperation.',
      zh: '稳固的实力、开拓进取、商贸探索以及得力的商业协作。',
    },
    reversed: {
      en: 'The easing of troubles and cessation of prior adversity, toil, and disappointment.',
      zh: '困顿终结，过往的逆境、辛劳与失望得以暂歇或平息。',
    },
  },
  'four-of-wands': {
    cardNameEn: 'Four of Wands',
    cardNameZh: '权杖四',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'A haven of refuge, domestic harvest, repose, concord, harmony, and peaceful prosperity.',
      zh: '宁静的避风港、家宅欢庆丰收、安歇融洽、和谐与安泰繁荣。',
    },
    reversed: {
      en: 'Meaning remains favourable—prosperity, increase, felicity, and beauty.',
      zh: '牌义依然保持顺遂，象征繁荣增长、喜乐美好与锦上添花。',
    },
  },
  'five-of-wands': {
    cardNameEn: 'Five of Wands',
    cardNameZh: '权杖五',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Mimic strife and strenuous competition in the pursuit of fortune and gain.',
      zh: '演练式的较量，亦指追逐财富与机遇过程中的激烈竞争。',
    },
    reversed: {
      en: 'Litigation, sharp disputes, trickery, and contradiction.',
      zh: '诉讼纠纷、争执分歧、耍弄手段与彼此抵牾。',
    },
  },
  'six-of-wands': {
    cardNameEn: 'Six of Wands',
    cardNameZh: '权杖六',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Triumph and great news, where expectation is crowned with its hoped-for fulfilment.',
      zh: '凯旋胜利与重大喜讯，期盼已久的希望终获加冕。',
    },
    reversed: {
      en: 'Apprehension and fear of a rival’s advance, disloyalty, and indefinite delay.',
      zh: '忧惧对手逼近的不安、背信不忠以及无限期的拖延。',
    },
  },
  'seven-of-wands': {
    cardNameEn: 'Seven of Wands',
    cardNameZh: '权杖七',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Valour from a vantage point, intellectual debate, trade competition, and hard-won success.',
      zh: '居高临下的勇气、言辞交锋与商业竞争谈判，终获优势与成功。',
    },
    reversed: {
      en: 'Perplexity, embarrassment, anxiety, and a caution against indecision.',
      zh: '困惑窘迫、焦虑不安，并警示切忌优柔寡断。',
    },
  },
  'eight-of-wands': {
    cardNameEn: 'Eight of Wands',
    cardNameZh: '权杖八',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Swift activity, great haste and hope moving rapidly toward a favourable end, or arrows of love.',
      zh: '事务迅速推进，满怀希望地疾速奔向圆满之境，亦指爱意之箭。',
    },
    reversed: {
      en: 'Jealousy, internal disputes, pangs of conscience, and household quarrels.',
      zh: '嫉妒猜疑、内部争执、良心上的刺痛以及家庭口角纷争。',
    },
  },
  'nine-of-wands': {
    cardNameEn: 'Nine of Wands',
    cardNameZh: '权杖九',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Steadfast strength in opposition, meeting challenges boldly amidst delay or suspension.',
      zh: '在对抗中展现的坚韧力量，无畏迎击挑战，亦含延迟与暂缓。',
    },
    reversed: {
      en: 'Obstacles, adversity, and severe hardship.',
      zh: '重重阻碍、逆境困顿与严峻的艰难局面。',
    },
  },
  'ten-of-wands': {
    cardNameEn: 'Ten of Wands',
    cardNameZh: '权杖十',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Heavy oppression, including the burden of success or gain, alongside themes of disguise or bad faith.',
      zh: '单纯的沉重压迫，亦指财富成功带来的重负，或掩饰与失信。',
    },
    reversed: {
      en: 'Contrarieties, tangled difficulties, and underhanded intrigues.',
      zh: '事与愿违的波折、重重阻滞以及暗中的算计纠葛。',
    },
  },
  'page-of-wands': {
    cardNameEn: 'Page of Wands',
    cardNameZh: '权杖侍从',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'A faithful envoy or messenger bearing favourable testimony and family news.',
      zh: '忠实的信使或传递消息之人，带来正面的证言与家书近况。',
    },
    reversed: {
      en: 'Rumours, unwelcome announcements, and the instability that accompanies indecision.',
      zh: '传闻轶事与令人不安的消息，以及优柔寡断带来的动荡。',
    },
  },
  'knight-of-wands': {
    cardNameEn: 'Knight of Wands',
    cardNameZh: '权杖骑士',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Departure, absence, relocation, or setting out on a swift journey.',
      zh: '动身离去、缺席远行、迁居或迅速开启一段旅程。',
    },
    reversed: {
      en: 'Rupture, division, sudden interruption, and discord.',
      zh: '决裂、分离、进程被打断以及关系或局势上的失和。',
    },
  },
  'queen-of-wands': {
    cardNameEn: 'Queen of Wands',
    cardNameZh: '权杖王后',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Friendly, honourable, and loving disposition, alongside practical success in business.',
      zh: '友善、忠贞且重情义的品格，亦带有务实与事业有成之意。',
    },
    reversed: {
      en: 'Economical and serviceable at best, yet in strained contexts hinting at opposition, jealousy, or deceit.',
      zh: '节俭而乐于助人，但在特定处境下亦暗含对立、嫉妒或欺瞒。',
    },
  },
  'king-of-wands': {
    cardNameEn: 'King of Wands',
    cardNameZh: '权杖国王',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Friendly, conscientious integrity, honesty, and possible news of an unexpected inheritance.',
      zh: '友善而尽责的正直品格，诚实守信，或有意外传承的消息。',
    },
    reversed: {
      en: 'Well-intentioned yet severe; austere in manner while remaining tolerant.',
      zh: '本意良善但严厉，态度严肃却仍保有一份宽容。',
    },
  },

  // ================= Minor Arcana: Cups (14) — Part III §2 =================
  'ace-of-cups': {
    cardNameEn: 'Ace of Cups',
    cardNameZh: '圣杯一',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'House of the true heart, joy, contentment, nourishment, abundance, and deep felicity.',
      zh: '真心之所归，喜悦、满足、滋养、丰盈与深切的幸福感。',
    },
    reversed: {
      en: 'House of the false heart, sudden change, instability, and upheaval.',
      zh: '虚伪之心、变动不居、情绪或处境的不稳与剧变。',
    },
  },
  'two-of-cups': {
    cardNameEn: 'Two of Cups',
    cardNameZh: '圣杯二',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Love, friendship, affinity, union, concord, and mutual sympathy.',
      zh: '爱意、热忱、友谊与契合，象征彼此结合、和谐与深层共情。',
    },
    reversed: {
      en: 'An emphasis on strong passion or ardour.',
      zh: '以强烈的热情为主题。',
      section: 'Part III §4',
      sectionCode: 4,
    },
  },
  'three-of-cups': {
    cardNameEn: 'Three of Cups',
    cardNameZh: '圣杯三',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'A matter concluding in plenty, merriment, happy issue, fulfilment, solace, and healing.',
      zh: '事态在丰盛、欢愉与圆满中落幕，象征顺遂结局、慰藉与疗愈。',
    },
    reversed: {
      en: 'Swift dispatch and completion, alongside the risk of excess in sensory pleasures.',
      zh: '迅速推进与达成收尾，亦暗含感官享乐过度之象。',
    },
  },
  'four-of-cups': {
    cardNameEn: 'Four of Cups',
    cardNameZh: '圣杯四',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Weariness, satiety, and imagined vexations that obscure a newly offered consolation.',
      zh: '倦怠厌烦与庸人自扰，对既有之物感到腻味而忽略了新近递来的慰藉。',
    },
    reversed: {
      en: 'Novelty, fresh omens, new instruction, and emerging relations.',
      zh: '新鲜气象、新兆头、新的指引以及新的人际连结。',
    },
  },
  'five-of-cups': {
    cardNameEn: 'Five of Cups',
    cardNameZh: '圣杯五',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'A sense of loss where something still remains; transmission or partnership tempered by unmet expectations.',
      zh: '虽有失落但仍有留存，传承或结合之中伴随未尽如人意的苦涩。',
    },
    reversed: {
      en: 'News, alliances, kinship ties, return, or misguided projects.',
      zh: '消息往来、结盟联结、亲缘归来，亦或是不切实际的计划。',
    },
  },
  'six-of-cups': {
    cardNameEn: 'Six of Cups',
    cardNameZh: '圣杯六',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Memories and happiness rooted in the past, though an alternate reading points to new relations and environments.',
      zh: '回望过往与童年记忆中的欢愉，另一说亦指新的人际、新知与新环境。',
    },
    reversed: {
      en: 'Orientation toward the future, renewal, and what is soon to unfold.',
      zh: '面向未来、事物更新以及即将到来之事。',
    },
  },
  'seven-of-cups': {
    cardNameEn: 'Seven of Cups',
    cardNameZh: '圣杯七',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Imaginative reflection and contemplative visions, offering fleeting attainment without lasting substance.',
      zh: '沉思中的幻象、情思与想象，虽有片段所得，却非持久稳固之物。',
    },
    reversed: {
      en: 'Focused desire, will, determination, and a concrete project.',
      zh: '明确的欲望、意志力、坚定决心以及具体成形的计划。',
    },
  },
  'eight-of-cups': {
    cardNameEn: 'Eight of Cups',
    cardNameZh: '圣杯八',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'In practice, the decline of a concern or realizing its slightness; other readings note mildness and modesty.',
      zh: '实务中多指事物渐趋式微或原以为重要之事其实无关紧要，亦含温和谦逊。',
    },
    reversed: {
      en: 'Great joy, happiness, and celebration.',
      zh: '极大的欢愉、喜悦之心以及宴饮庆贺。',
    },
  },
  'nine-of-cups': {
    cardNameEn: 'Nine of Cups',
    cardNameZh: '圣杯九',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Concord, contentment, physical well-being, victory, advantage, and satisfaction.',
      zh: '融洽顺遂、身心安适与富足，亦代表胜利、优势与如愿满足。',
    },
    reversed: {
      en: 'Truth, loyalty, and liberty, though other readings note mistakes and imperfections.',
      zh: '真实、忠诚与自由，但诸家解读亦提及疏漏与未尽完善之处。',
    },
  },
  'ten-of-cups': {
    cardNameEn: 'Ten of Cups',
    cardNameZh: '圣杯十',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Deep contentment and repose of heart, with fulfilled human love, friendship, and community.',
      zh: '发自全心的满足与安宁，圆满的挚爱与友谊，以及所居之地的归属。',
    },
    reversed: {
      en: 'A false sense of peace, underlying indignation, and harsh conflict.',
      zh: '虚伪的心安假象，其下潜藏着愤懑与激烈冲突。',
    },
  },
  'page-of-cups': {
    cardNameEn: 'Page of Cups',
    cardNameZh: '圣杯侍从',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Studious application, reflection, meditation, and a willingness to serve or bring messages.',
      zh: '勤学静思、沉潜内省，并怀着服务之心传递消息或投入实务。',
    },
    reversed: {
      en: 'Personal inclination and attachment, or seduction, deception, and artifice.',
      zh: '偏好依恋之情，亦可能涉及诱惑、欺瞒与矫饰。',
    },
  },
  'knight-of-cups': {
    cardNameEn: 'Knight of Cups',
    cardNameZh: '圣杯骑士',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Arrival or approach of a messenger, bringing advances, propositions, or invitations.',
      zh: '信使临近或到来，带来示好、提议、邀请与鼓舞。',
    },
    reversed: {
      en: 'Trickery, artifice, subtle deception, duplicity, and fraud.',
      zh: '诡计权谋、巧言伪饰、表里不一与欺诈行为。',
    },
  },
  'queen-of-cups': {
    cardNameEn: 'Queen of Cups',
    cardNameZh: '圣杯王后',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Honest devotion, loving intelligence with a gift of vision, wisdom, virtue, and happiness.',
      zh: '诚挚奉献、充满爱意的敏锐洞察力，兼备智慧、美德与愉悦。',
    },
    reversed: {
      en: 'Varying accounts—either capable goodness, or someone distinguished yet untrustworthy and wayward.',
      zh: '诸说不一，或指贤良之态，亦或指表面出众却不可信赖与失德。',
    },
  },
  'king-of-cups': {
    cardNameEn: 'King of Cups',
    cardNameZh: '圣杯国王',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Responsible, obliging temperament grounded in equity, art, science, and creative intelligence.',
      zh: '有担当且乐于助人，兼具公正之心、人文科学素养与创造性智慧。',
    },
    reversed: {
      en: 'Double-dealing, injustice, exaction, scandal, and significant loss.',
      zh: '虚伪两面、索取不公、失德丑闻以及严重的损耗。',
    },
  },

  // ================= Minor Arcana: Swords (14) — Part III §2 =================
  'ace-of-swords': {
    cardNameEn: 'Ace of Swords',
    cardNameZh: '宝剑一',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Conquest and triumph of force, carrying intensity to an extreme in love or in conflict.',
      zh: '征服与力量之凯旋，无论在爱或冲突中皆呈极致强烈之势。',
    },
    reversed: {
      en: 'Similar intense force with disastrous outcomes; an alternate reading notes conception and increase.',
      zh: '同样强烈的力量却引致灾祸结局；别解亦指孕育、诞生与增殖。',
    },
  },
  'two-of-swords': {
    cardNameEn: 'Two of Swords',
    cardNameZh: '宝剑二',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Equipoise, conformity, courage, and concord in an armed truce; qualified readings also note affection.',
      zh: '对峙中的平衡、顺应、勇气与克制下的和谐，别解亦含温情。',
    },
    reversed: {
      en: 'Imposture, falsehood, duplicity, and disloyalty.',
      zh: '冒充作伪、虚假不实、两面三刀以及背信不忠。',
    },
  },
  'three-of-swords': {
    cardNameEn: 'Three of Swords',
    cardNameZh: '宝剑三',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Removal, absence, delay, division, rupture, and dispersion.',
      zh: '移离、缺席、延误、分裂、决裂与离散。',
    },
    reversed: {
      en: 'Mental alienation, error, loss, distraction, disorder, and confusion.',
      zh: '心神疏离、迷误失落、分心失序以及混乱不安。',
    },
  },
  'four-of-swords': {
    cardNameEn: 'Four of Swords',
    cardNameZh: '宝剑四',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Vigilance, retreat, solitude, quiet repose, and seclusion.',
      zh: '警醒静守、退隐独处、隐士般的歇息以及幽闭静谧。',
    },
    reversed: {
      en: 'Wise administration, circumspection, economy, precaution, or avarice.',
      zh: '审慎治理、周全考量、节俭理财、未雨绸缪或吝啬。',
    },
  },
  'five-of-swords': {
    cardNameEn: 'Five of Swords',
    cardNameZh: '宝剑五',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Degradation, destruction, revocation, dishonour, and loss.',
      zh: '贬损、破坏、撤销、蒙羞失誉以及切实的损失。',
    },
    reversed: {
      en: 'Similar themes of loss and dishonour, alongside funerary rites and closure.',
      zh: '同正位之失落与毁损，并及丧葬仪式与终结送别之象。',
    },
  },
  'six-of-swords': {
    cardNameEn: 'Six of Swords',
    cardNameZh: '宝剑六',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Journey by water, a route or passage, an envoy, and a practical expedient.',
      zh: '水上旅程、行进之路、受托使者以及权宜过渡之策。',
    },
    reversed: {
      en: 'Declaration, confession, and publicity; one reading notes a proposal of love.',
      zh: '公开宣告、坦白吐露与广为人知，一说亦指表达爱意。',
    },
  },
  'seven-of-swords': {
    cardNameEn: 'Seven of Swords',
    cardNameZh: '宝剑七',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Design, attempt, wish, and confidence, tempered by quarrelling or a plan that may fail.',
      zh: '谋划尝试、愿望与自信，亦伴随争执、受挫之策与烦扰。',
    },
    reversed: {
      en: 'Good advice, counsel, and instruction, or conversely slander and idle talk.',
      zh: '良言建言、劝导指点，或反指流言蜚语与闲言碎语。',
    },
  },
  'eight-of-swords': {
    cardNameEn: 'Eight of Swords',
    cardNameZh: '宝剑八',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Bad news, sharp chagrin, crisis, censure, constrained power, conflict, and calumny.',
      zh: '噩耗与强烈懊恼、危机谴责、力量受缚、冲突及诽谤困扰。',
    },
    reversed: {
      en: 'Disquiet, difficulty, opposition, treachery, and unforeseen misfortune.',
      zh: '心神不宁、阻碍对立、变故背叛以及始料未及的逆缘。',
    },
  },
  'nine-of-swords': {
    cardNameEn: 'Nine of Swords',
    cardNameZh: '宝剑九',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Severe failure, delay, deception, disappointment, despair, and ending.',
      zh: '挫败、落空、延误、欺瞒、失望与深切的绝望。',
    },
    reversed: {
      en: 'Confinement, suspicion, doubt, reasonable fear, and shame.',
      zh: '受困羁绊、猜疑犹疑、有据可依的恐惧以及羞愧感。',
    },
  },
  'ten-of-swords': {
    cardNameEn: 'Ten of Swords',
    cardNameZh: '宝剑十',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Pain, affliction, tears, sadness, and desolation (not specifically violent death).',
      zh: '痛苦折磨、泪水、悲伤与荒凉孤绝（原文特指并非暴毙之牌）。',
    },
    reversed: {
      en: 'Temporary advantage, profit, success, and favour, alongside power and authority.',
      zh: '一时的优势、获利、成功与青睐（皆非长久），亦含权力与威信。',
    },
  },
  'page-of-swords': {
    cardNameEn: 'Page of Swords',
    cardNameZh: '宝剑侍从',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Vigilance, oversight, discreet inquiry, and keen examination.',
      zh: '警觉戒备、监督审视、暗中察访以及敏锐的检视能力。',
    },
    reversed: {
      en: 'The harsher side of vigilance—unforeseen events, unpreparedness, and possible indisposition.',
      zh: '警觉之阴暗面，突如其来的变故、毫无防备或身心不适。',
    },
  },
  'knight-of-swords': {
    cardNameEn: 'Knight of Swords',
    cardNameZh: '宝剑骑士',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Skill, bravery, defence, and address, alongside fierce wrath, opposition, and ruin.',
      zh: '技艺、勇武与应变防卫，亦含怒意、敌对、抗衡与破坏之力。',
    },
    reversed: {
      en: 'Imprudence, lack of capacity, and reckless extravagance.',
      zh: '轻率鲁莽、力有未逮以及铺张失度。',
    },
  },
  'queen-of-swords': {
    cardNameEn: 'Queen of Swords',
    cardNameZh: '宝剑王后',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Sorrow, absence, privation, mourning, and separation.',
      zh: '哀伤、缺席与别离、匮乏困顿以及孤寂悲怀之象。',
    },
    reversed: {
      en: 'Malice, bigotry, artifice, rigid prudery, and deceit.',
      zh: '恶意偏执、矫饰作态、严苛拘泥以及欺瞒算计。',
    },
  },
  'king-of-swords': {
    cardNameEn: 'King of Swords',
    cardNameZh: '宝剑国王',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Judgment, authority, command, militant intelligence, law, and public office.',
      zh: '裁断与公正之念，涵盖权力、统御、权威、锐利智识、法度与公职。',
    },
    reversed: {
      en: 'Cruelty, perversity, harshness, perfidy, and ill intent.',
      zh: '冷酷严苛、乖僻失道、背信弃义以及不良意图。',
    },
  },

  // ================= Minor Arcana: Pentacles (14) — Part III §2 =================
  'ace-of-pentacles': {
    cardNameEn: 'Ace of Pentacles',
    cardNameZh: '星币一',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Perfect contentment, felicity, ecstasy, swift news, and material gold.',
      zh: '圆满知足、深切喜乐与欢欣，亦指迅捷佳音与丰厚财富。',
    },
    reversed: {
      en: 'The troubled side of wealth and unwelcome news, even amidst great riches.',
      zh: '财富的负面面向与不利讯息，虽仍有巨富却未必带来安宁。',
    },
  },
  'two-of-pentacles': {
    cardNameEn: 'Two of Pentacles',
    cardNameZh: '星币二',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Gaiety and recreation, yet also read as written messages, agitation, and tangled trouble.',
      zh: '欢愉消遣之象，亦被解读为书面讯息、心绪波动与琐碎纠葛。',
    },
    reversed: {
      en: 'Forced or simulated gaiety, alongside literal writing, composition, and financial notes.',
      zh: '强颜欢笑与假意作乐，亦指字面文书、写作及票据往来。',
    },
  },
  'three-of-pentacles': {
    cardNameEn: 'Three of Pentacles',
    cardNameZh: '星币三',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Trade and skilled labour, traditionally also associated with renown, distinction, and honour.',
      zh: '专门技艺与娴熟劳作，传统上亦被视为声望、尊荣与卓越之象。',
    },
    reversed: {
      en: 'Mediocrity in craft or conduct, puerility, pettiness, and weakness.',
      zh: '技艺或行事流于平庸、幼稚浅薄、格局狭隘与软弱。',
    },
  },
  'four-of-pentacles': {
    cardNameEn: 'Four of Pentacles',
    cardNameZh: '星币四',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Surety of possessions, holding fast to what one has, alongside gift or inheritance.',
      zh: '资产稳固、紧守既有之物，亦含馈赠、遗产与传承之意。',
    },
    reversed: {
      en: 'Suspense, delay, and opposition.',
      zh: '悬而未决、进程拖延以及面临阻力对立。',
    },
  },
  'five-of-pentacles': {
    cardNameEn: 'Five of Pentacles',
    cardNameZh: '星币五',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Material hardship and deprivation above all, though another tradition reads it as love and loyal affinity.',
      zh: '首指物质匮乏与现实困境，然另一传统亦释为伴侣挚友间的契合。',
    },
    reversed: {
      en: 'Disorder, chaos, ruin, discord, and profligacy.',
      zh: '失序混乱、败落失和以及放纵无度。',
    },
  },
  'six-of-pentacles': {
    cardNameEn: 'Six of Pentacles',
    cardNameZh: '星币六',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Presents, gifts, and present prosperity, or an alternate call for attention and vigilance.',
      zh: '赠予馈赠与当下繁荣顺遂，另一说亦提醒保持专注与警觉。',
    },
    reversed: {
      en: 'Unchecked desire, cupidity, envy, jealousy, and illusion.',
      zh: '贪念欲望、艳羡嫉妒以及不切实际的幻象。',
    },
  },
  'seven-of-pentacles': {
    cardNameEn: 'Seven of Pentacles',
    cardNameZh: '星币七',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Primarily money, business, and barter, though other readings cite altercation or conversely innocence.',
      zh: '主指金钱、商贸与交换，然诸说分歧，或言口角争执，或言纯真坦诚。',
    },
    reversed: {
      en: 'Anxiety concerning money that one may be asked to lend.',
      zh: '因拟议借出钱财而引发的忧虑与不安。',
    },
  },
  'eight-of-pentacles': {
    cardNameEn: 'Eight of Pentacles',
    cardNameZh: '星币八',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Work, employment, craftsmanship, and skill in craft or business, often in preparation.',
      zh: '劳作受雇、委托事务、精湛手艺与商业技能（或尚在筹备阶段）。',
    },
    reversed: {
      en: 'Voided ambition, vanity, cupidity, and usury, or skill turned toward cunning intrigue.',
      zh: '野心落空、虚荣贪婪与盘剥，或指才智转用于狡黠算计。',
    },
  },
  'nine-of-pentacles': {
    cardNameEn: 'Nine of Pentacles',
    cardNameZh: '星币九',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Prudence, safety, success, accomplishment, certitude, and discernment.',
      zh: '审慎稳妥、安然无虞、成就功成、笃定自信与明辨力。',
    },
    reversed: {
      en: 'Roguery, deception, a voided project, and bad faith.',
      zh: '狡诈欺瞒、计划落空以及背信弃义之举。',
    },
  },
  'ten-of-pentacles': {
    cardNameEn: 'Ten of Pentacles',
    cardNameZh: '星币十',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Gain, riches, family affairs, heritage archives, and the family abode.',
      zh: '收获富足、家族事务、宗族谱系与家宅安居之所。',
    },
    reversed: {
      en: 'Chance, hazard, loss, or theft; occasionally a gift, dowry, or pension.',
      zh: '机运无常、投机博弈、损失窃夺，间或亦指赠礼、嫁妆或抚恤。',
    },
  },
  'page-of-pentacles': {
    cardNameEn: 'Page of Pentacles',
    cardNameZh: '星币侍从',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Application, study, scholarship, and reflection, or messages and practical management.',
      zh: '专注钻研、治学沉思，别解亦指讯息传递者及秩序管理。',
    },
    reversed: {
      en: 'Prodigality, dissipation, excess luxury, and unfavourable news.',
      zh: '挥霍无度、放纵奢靡以及令人不适的坏消息。',
    },
  },
  'knight-of-pentacles': {
    cardNameEn: 'Knight of Pentacles',
    cardNameZh: '星币骑士',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Utility, serviceableness, interest, responsibility, and rectitude in practical affairs.',
      zh: '实用价值、乐于效劳、尽责担当与现实层面的端方正直。',
    },
    reversed: {
      en: 'Inertia, idleness, and stagnation, alongside placidity, discouragement, or carelessness.',
      zh: '惰性懒散与停滞不前，亦指安逸松懈、灰心或疏忽大意。',
    },
  },
  'queen-of-pentacles': {
    cardNameEn: 'Queen of Pentacles',
    cardNameZh: '星币王后',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Opulence, generosity, magnificence, security, and liberty.',
      zh: '丰裕富足、慷慨大度、华美气度、安稳保障与自在自由。',
    },
    reversed: {
      en: 'Ill will, suspicion, anxious suspense, fear, and mistrust.',
      zh: '恶意猜忌、悬而未决的不安、畏惧以及彼此不信任。',
    },
  },
  'king-of-pentacles': {
    cardNameEn: 'King of Pentacles',
    cardNameZh: '星币国王',
    section: 'Part III §2',
    sectionCode: 2,
    upright: {
      en: 'Valour, practical intelligence, business and analytical aptitude, and success along those lines.',
      zh: '果敢笃行、务实才智、商业与数理禀赋，以及在此道上的成就。',
    },
    reversed: {
      en: 'Vice, weakness, perversity, corruption, and peril.',
      zh: '恶习、怯懦、乖僻、腐化堕落以及潜藏的危险。',
    },
  },
};

export function getTarotEvidence(
  slug: string,
  isReversed: boolean,
  lang: string
): TarotEvidence | undefined {
  if (!Object.prototype.hasOwnProperty.call(WAITE_CARD_BASIS, slug)) {
    return undefined;
  }
  const entry = WAITE_CARD_BASIS[slug];

  const isZh = lang.toLowerCase().startsWith('zh');
  const orientation = isReversed ? 'reversed' : 'upright';
  const orientationData = entry[orientation];
  const basisText = (isZh ? orientationData.zh : orientationData.en).trim();
  if (!basisText) return undefined;

  const section = orientationData.section ?? entry.section;
  const sectionCode = orientationData.sectionCode ?? entry.sectionCode;
  const orientationLabel = isZh
    ? isReversed
      ? '逆位'
      : '正位'
    : isReversed
      ? 'Reversed'
      : 'Upright';
  const cardLabel = isZh ? entry.cardNameZh : entry.cardNameEn;

  return {
    basisText,
    sourceName: `A. E. Waite, The Pictorial Key to the Tarot, ${section} (${cardLabel} · ${orientationLabel})`,
    sourceUrl: WAITE_SOURCE_URL,
    sourceRef: `WAITE-III-${sectionCode}-${slug}-${orientation}`,
  };
}
