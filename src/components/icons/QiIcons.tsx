import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

/**
 * 东方周易：八字四柱排盘 · 古法卷轴印章
 * 灵感源自阿里巴巴 Iconfont 东方传统文化古卷轴与竹简元素
 */
export function IconScrollBaZi({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* 卷轴顶部卷轴筒与两端轴头 */}
      <rect x="4" y="2.5" width="16" height="3" rx="1.5" fill="currentColor" fillOpacity={0.12} />
      {/* 卷轴底部卷轴筒与两端轴头 */}
      <rect x="4" y="18.5" width="16" height="3" rx="1.5" fill="currentColor" fillOpacity={0.12} />
      {/* 展开的宣纸主体 */}
      <path d="M6 5.5v13h12v-13H6z" />
      {/* 宣纸内四柱命理干支文脉 */}
      <path d="M9 9h6M9 12h6M9 15h3.5" strokeWidth={1.4} strokeLinecap="round" />
      {/* 卷轴绑带流苏 */}
      <path d="M12 2.5v3M12 18.5v3" strokeWidth={1.2} />
      <circle cx="12" cy="22" r="0.75" fill="currentColor" />
    </svg>
  );
}

/**
 * 东方周易：六爻金钱课 · 乾隆通宝外圆内方古铜钱
 * 灵感源自古币天圆地方、四方纳吉的矢量拓印
 */
export function IconCoinLiuYao({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* 外圈天圆 */}
      <circle cx="12" cy="12" r="9.5" fill="currentColor" fillOpacity={0.08} />
      {/* 内缘凸起压边圈 */}
      <circle cx="12" cy="12" r="7.8" strokeDasharray="1.5 2" strokeWidth={0.8} />
      {/* 核心地方：方孔 */}
      <rect x="9.2" y="9.2" width="5.6" height="5.6" rx="0.8" fill="currentColor" fillOpacity={0.15} />
      {/* 四向古篆钱文点标（乾、隆、通、宝方位） */}
      <path d="M12 3.8v1.8M12 18.4v1.8M3.8 12h1.8M18.4 12h1.8" strokeWidth={1.5} />
    </svg>
  );
}

/**
 * 东方周易：生肖合盘 · 东方华夏神龙/祥云龙纹
 * 灵感源自故宫九龙壁与 Iconfont 祥云灵龙图腾
 */
export function IconZodiacDragon({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* 龙角与首额 */}
      <path d="M16 3c.5 1.5 1.5 2.5 3 3M19 4l-2 3" />
      {/* 龙头颚部与飘逸龙须 */}
      <path d="M15 7c-1-1.5-3-2-5-1.5-2.5.6-3.5 2.5-3.5 4 0 2 1.5 3 3.5 3.5h3.5" />
      <path d="M7 11C4.5 11 3 13 3 15c0 2 2 3 4 3 2.5 0 4-1.5 5-3.5" />
      {/* 矫健龙身与祥云流转 */}
      <path d="M12 14.5c1.5 1.5 3.5 2.5 5.5 2 2-.5 3-2.5 2.5-4.5s-2-3-4-2.5" />
      {/* 龙目凝神 */}
      <circle cx="11.5" cy="8.5" r="1" fill="currentColor" />
      {/* 腾云龙珠火焰 */}
      <path d="M19.5 18c1 .5 1.5 1.5 1 2.5s-1.5 1-2.5.5-1-1.5-.5-2.5" />
    </svg>
  );
}

/**
 * 西方塔罗：双牌交叠与八芒星
 * 经典韦特塔罗大阿卡纳象征
 */
export function IconTarotCards({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* 底层略微倾斜的卡牌 */}
      <rect
        x="3"
        y="5"
        width="10"
        height="15"
        rx="2"
        transform="rotate(-12 3 5)"
        strokeDasharray="28"
        strokeOpacity={0.65}
      />
      {/* 顶层主位正向卡牌 */}
      <rect x="8.5" y="4" width="11" height="16.5" rx="2" fill="currentColor" fillOpacity={0.08} />
      {/* 牌面内边缘精细烫金金线 */}
      <rect x="10.2" y="5.8" width="7.6" height="12.9" rx="1" strokeWidth={0.9} strokeOpacity={0.5} />
      {/* 牌心八芒神秘星宿 */}
      <path d="M14 8.5v7.5M10.2 12.25h7.6" strokeWidth={1.3} />
      <path d="M11.5 9.75l5 5M16.5 9.75l-5 5" strokeWidth={1} strokeOpacity={0.8} />
    </svg>
  );
}

/**
 * 西方神秘学：占卜水晶球与基座
 * 灵感源自古典神秘学透镜
 */
export function IconCrystalBall({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* 水晶球体 */}
      <circle cx="12" cy="10" r="7.5" fill="currentColor" fillOpacity={0.08} />
      {/* 内部星芒反光 */}
      <path d="M12 6.5v3M10.5 8h3" strokeWidth={1.2} />
      {/* 弧形晶体高光 */}
      <path d="M8.5 7.5a4.5 4.5 0 0 1 5-2" strokeWidth={1.2} strokeOpacity={0.7} />
      {/* 三脚青铜雕花支架 */}
      <path d="M7 17.5c1.5-1 3-1.5 5-1.5s3.5.5 5 1.5" />
      <path d="M5.5 21.5c1.5-1 2.5-2.5 3-4" />
      <path d="M18.5 21.5c-1.5-1-2.5-2.5-3-4" />
      <path d="M12 16v5.5" strokeWidth={1.4} />
      <path d="M10 21.5h4" />
    </svg>
  );
}

/**
 * 潜意识神谕：灵性全视之眼 (Eye of Providence / Mystic Insight)
 */
export function IconOracleEye({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* 杏仁状眼眶 */}
      <path d="M2.5 12c2.5-5 5.5-7.5 9.5-7.5s7 2.5 9.5 7.5c-2.5 5-5.5 7.5-9.5 7.5s-7-2.5-9.5-7.5z" />
      {/* 灵性虹膜 */}
      <circle cx="12" cy="12" r="3.8" fill="currentColor" fillOpacity={0.12} />
      {/* 瞳孔星芒 */}
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      {/* 顶部灵感天线光芒 */}
      <path d="M12 2v1.5M7 3.5l1 1.2M17 3.5l-1 1.2" strokeWidth={1.2} />
    </svg>
  );
}

/**
 * 78 张经典牌义全书圣典
 */
export function IconBook78({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* 翻开的书本左右页 */}
      <path d="M3.5 19.5c2.5-1.5 5.5-1.5 8.5 0 3-1.5 6-1.5 8.5 0v-14c-2.5-1.5-5.5-1.5-8.5 0-3-1.5-6-1.5-8.5 0v14z" />
      {/* 书脊中缝 */}
      <path d="M12 5.5v14" />
      {/* 左侧书页文脉 */}
      <path d="M6 9.5h3.5M6 12.5h3" strokeWidth={1.2} />
      {/* 右侧书页星宿徽记 */}
      <path d="M16 9v4M14 11h4" strokeWidth={1.2} />
    </svg>
  );
}

/**
 * 会员订阅：尊贵星光王冠 (Crown / VIP)
 */
export function IconCrownVip({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* 五峰王冠主体 */}
      <path d="M3.5 18l1.8-11 4.5 5 2.2-6 2.2 6 4.5-5 1.8 11H3.5z" fill="currentColor" fillOpacity={0.1} />
      {/* 底座宝石环箍 */}
      <path d="M3.5 18h17v2.5h-17z" rx="1" fill="currentColor" fillOpacity={0.18} />
      {/* 峰顶珍珠 */}
      <circle cx="5.3" cy="7" r="1" fill="currentColor" />
      <circle cx="9.8" cy="12" r="0.8" fill="currentColor" />
      <circle cx="12" cy="6" r="1.2" fill="currentColor" />
      <circle cx="14.2" cy="12" r="0.8" fill="currentColor" />
      <circle cx="18.7" cy="7" r="1" fill="currentColor" />
    </svg>
  );
}

/**
 * 抽牌召唤：四芒神谕星光 (Sparkles / Divination Calling)
 */
export function IconSparklesDraw({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* 中心主四芒星 */}
      <path d="M10 2c0 4.5-2 6.5-6.5 6.5 4.5 0 6.5 2 6.5 6.5 0-4.5 2-6.5 6.5-6.5-4.5 0-6.5-2-6.5-6.5z" fill="currentColor" fillOpacity={0.15} />
      {/* 右上方伴星 */}
      <path d="M17.5 13.5c0 2.5-1 3.5-3.5 3.5 2.5 0 3.5 1 3.5 3.5 0-2.5 1-3.5 3.5-3.5-2.5 0-3.5-1-3.5-3.5z" fill="currentColor" fillOpacity={0.2} />
      {/* 左下方微光 */}
      <circle cx="5" cy="18" r="1" fill="currentColor" />
      <circle cx="19" cy="5" r="1.2" fill="currentColor" />
    </svg>
  );
}

/**
 * 乾坤双门首页：双柱拱门与日月天元
 */
export function IconHomeGate({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* 门楣飞檐横梁 */}
      <path d="M2.5 7h19M4 4h16" />
      {/* 左右门柱 */}
      <path d="M6 7v13.5M18 7v13.5" strokeWidth={1.8} />
      {/* 双扉对开虚实门线 */}
      <path d="M6 10h5.5v10.5H6z" fill="currentColor" fillOpacity={0.06} />
      <path d="M12.5 10H18v10.5h-5.5z" fill="currentColor" fillOpacity={0.06} />
      {/* 门环 */}
      <circle cx="10" cy="15" r="1" fill="currentColor" />
      <circle cx="14" cy="15" r="1" fill="currentColor" />
    </svg>
  );
}

/**
 * 占卜分类：爱情感情 (Love & Relationship)
 * 纯正优雅的同心连理双心与星辉印记
 */
export function IconLove({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* 主爱心 */}
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="currentColor"
        fillOpacity={0.12}
      />
      {/* 心内缠绕藤蔓弧线 */}
      <path d="M12 8.5c-1.5-1.5-3.5-1-4 .5s.5 3 4 5.5" strokeWidth={1.2} strokeOpacity={0.65} />
      <circle cx="15.5" cy="7.5" r="1" fill="currentColor" />
    </svg>
  );
}

/**
 * 占卜分类：事业发展 (Career & Ambition)
 * 事业权杖与公文徽记，兼具稳重与上升通道
 */
export function IconCareer({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* 公文包主体 */}
      <rect x="3" y="7" width="18" height="13.5" rx="2.5" fill="currentColor" fillOpacity={0.08} />
      {/* 提手 */}
      <path d="M8.5 7V4.5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2V7" />
      {/* 包扣与隔层线 */}
      <path d="M3 12.5h18" strokeWidth={1.2} />
      {/* 向上突围的阶梯箭头 */}
      <path d="M12 10.5v4.5M10.2 12.3L12 10.5l1.8 1.8" strokeWidth={1.4} />
      <circle cx="12" cy="13.5" r="1.5" fill="currentColor" fillOpacity={0.2} />
    </svg>
  );
}

/**
 * 占卜分类：重大抉择 (Decision & Crossroads)
 * 正义女神天平与抉择枢轴
 */
export function IconDecision({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* 中心天平柱与底座 */}
      <path d="M12 3v17M8.5 20h7" />
      <circle cx="12" cy="4" r="1.5" fill="currentColor" />
      {/* 左右平衡横梁 */}
      <path d="M4.5 7h15" strokeWidth={1.8} />
      {/* 左托盘 */}
      <path d="M4.5 7l2 5h-4l2-5z" />
      <path d="M2.5 12c0 2 1.8 3 4 3s4-1 4-3" />
      {/* 右托盘 */}
      <path d="M19.5 7l2 5h-4l2-5z" />
      <path d="M17.5 12c0 2 1.8 3 4 3s4-1 4-3" />
    </svg>
  );
}

/**
 * 占卜分类：运势启示 (Fortune & Cosmos)
 * 命运之轮与星轨转动
 */
export function IconFortune({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* 命运外轮 */}
      <circle cx="12" cy="12" r="8.5" fill="currentColor" fillOpacity={0.08} />
      {/* 内部八轴金轮 */}
      <circle cx="12" cy="12" r="3.2" fill="currentColor" fillOpacity={0.18} />
      <path d="M12 3.5v5M12 15.5v5M3.5 12h5M15.5 12h5" />
      <path d="M6 6l3.5 3.5M14.5 14.5l3.5 3.5M18 6l-3.5 3.5M9.5 14.5L6 18" strokeWidth={1.2} />
    </svg>
  );
}

/**
 * 占卜分类：情绪心境 (Emotion & Healing)
 * 灵性疗愈水滴与舒缓波纹
 */
export function IconEmotion({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* 纯净甘露水滴 */}
      <path
        d="M12 3c-4.5 6-7 9.5-7 13 0 3.87 3.13 7 7 7s7-3.13 7-7c0-3.5-2.5-7-7-13z"
        fill="currentColor"
        fillOpacity={0.12}
      />
      {/* 水中抚平心绪的安宁波纹 */}
      <path d="M9 16c1-1 2-1 3 0 1 1 2 1 3 0" strokeWidth={1.4} />
      {/* 露珠内清澈高光 */}
      <path d="M9 10a3 3 0 0 1 3-3" strokeWidth={1.2} strokeOpacity={0.7} />
    </svg>
  );
}

/**
 * 占卜分类：个人成长 (Growth & Potential)
 * 潜能破土灵性幼芽
 */
export function IconGrowth({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* 孕育大地萌芽弧线 */}
      <path d="M3.5 21h17" strokeWidth={1.8} />
      {/* 向上生长的生命主茎 */}
      <path d="M12 21v-8" strokeWidth={1.8} />
      {/* 左侧萌发的第一片嫩叶 */}
      <path
        d="M12 13c-3.5 0-6.5-1.5-6.5-5.5 3.5 0 6.5 1.5 6.5 5.5z"
        fill="currentColor"
        fillOpacity={0.18}
      />
      {/* 右侧破茧成长的向上嫩叶 */}
      <path
        d="M12 15c3.5 0 6.5-1.5 6.5-6-3.5 0-6.5 1.5-6.5 6z"
        fill="currentColor"
        fillOpacity={0.18}
      />
      {/* 顶部向上散发的能量小星 */}
      <circle cx="12" cy="4" r="1" fill="currentColor" />
    </svg>
  );
}

/**
 * 导师头像：月影魔女 · 露娜 (Luna - 温情疗愈)
 * 优雅新月怀抱晨曦星辰与柔光面纱
 */
export function IconReaderLuna({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* 抱拥姿态的新月 */}
      <path
        d="M12 2.5a9.5 9.5 0 0 0 9.5 9.5 9.4 9.4 0 0 0 2-.2A9.5 9.5 0 1 1 11.8 2.5c.2.6.2 1.3.2 2z"
        fill="currentColor"
        fillOpacity={0.15}
      />
      {/* 月弯中闪烁的知己疗愈金星 */}
      <path d="M16.5 7.5v5M14 10h5" strokeWidth={1.4} />
      {/* 月光清辉粒子 */}
      <circle cx="18.5" cy="5.5" r="0.75" fill="currentColor" />
      <circle cx="19.5" cy="14.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

/**
 * 导师头像：明镜学者 · 索菲亚 (Sophia - 理性策略)
 * 雅典娜智慧猫头鹰与认知透镜
 */
export function IconReaderSophia({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* 智慧猫头鹰轮廓与羽冠 */}
      <path d="M4 6.5c1-1.5 3-2.5 5-2 1.5.3 2.5 1.5 3 2.5.5-1 1.5-2.2 3-2.5 2-.5 4 .5 5 2v10c-1 2-3 3-5 3h-6c-2 0-4-1-5-3V6.5z" fill="currentColor" fillOpacity={0.08} />
      {/* 左侧敏锐明镜之眼 */}
      <circle cx="8.5" cy="11" r="2.5" strokeWidth={1.4} fill="currentColor" fillOpacity={0.18} />
      <circle cx="8.5" cy="11" r="1" fill="currentColor" />
      {/* 右侧逻辑洞察之眼 */}
      <circle cx="15.5" cy="11" r="2.5" strokeWidth={1.4} fill="currentColor" fillOpacity={0.18} />
      <circle cx="15.5" cy="11" r="1" fill="currentColor" />
      {/* 喙部 */}
      <path d="M12 11.5l-1 2h2l-1-2z" fill="currentColor" />
      {/* 前胸理性羽纹折线 */}
      <path d="M10 16.5l2 1.5 2-1.5" strokeWidth={1.2} />
    </svg>
  );
}

/**
 * 导师头像：林间行者 · 埃尔登 (Elden - 灵性直觉)
 * 禅宗橡木圣叶与自然之泉
 */
export function IconReaderElden({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* 橡树/菩提灵性叶片弧形 */}
      <path
        d="M12 2.5C7 5 4 9 4 14c0 4 3 7.5 8 7.5s8-3.5 8-7.5c0-5-3-9-8-11.5z"
        fill="currentColor"
        fillOpacity={0.12}
      />
      {/* 叶脉贯通天地 */}
      <path d="M12 4v16" strokeWidth={1.6} />
      {/* 侧向自然延伸的脉络 */}
      <path d="M12 9l-4-2M12 13l-4.5-1.5M12 17l-3.5-1" strokeWidth={1.2} />
      <path d="M12 9l4-2M12 13l4.5-1.5M12 17l3.5-1" strokeWidth={1.2} />
      {/* 滴落的灵性晨露 */}
      <circle cx="12" cy="20.5" r="1" fill="currentColor" />
    </svg>
  );
}

/**
 * 分类 ID 到图标的映射组件
 */
export function CategoryIcon({
  id,
  size = 18,
  className = ''
}: {
  id: string;
  size?: number;
  className?: string;
}) {
  switch (id) {
    case 'love':
      return <IconLove size={size} className={className} />;
    case 'career':
      return <IconCareer size={size} className={className} />;
    case 'decision':
      return <IconDecision size={size} className={className} />;
    case 'fortune':
      return <IconFortune size={size} className={className} />;
    case 'emotion':
      return <IconEmotion size={size} className={className} />;
    case 'growth':
      return <IconGrowth size={size} className={className} />;
    default:
      return <IconTarotCards size={size} className={className} />;
  }
}

/**
 * 导师 ID 到导师图标的映射组件
 */
export function ReaderAvatarIcon({
  id,
  size = 24,
  className = ''
}: {
  id: string;
  size?: number;
  className?: string;
}) {
  switch (id) {
    case 'luna':
      return <IconReaderLuna size={size} className={className} />;
    case 'sophia':
      return <IconReaderSophia size={size} className={className} />;
    case 'elden':
      return <IconReaderElden size={size} className={className} />;
    default:
      return <IconCrystalBall size={size} className={className} />;
  }
}
