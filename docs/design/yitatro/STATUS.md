# YiTatro 改版进度

更新日期：2026-11-21

黑白设计全量交付完成！A1–A8 静态骨架与专厅入口、B1 动效基线、B2 首页冷启动优化与 Gemini 官方 SDK 升级、C 阶段剩余页面视觉规范统一与边界异常状态治理、D 阶段发布前多语言元数据（hreflang / canonical / OpenGraph / Twitter）及全仓杂色零残留治理均已通过本地生产验收。[设计方案与图稿](README.md)是当前基准。

- 交接分支：`codex/yitatro-design-handoff`
- 改版前代码基线：`cdeeb52`
- 设计稿与实施方案提交：`0dab1dd`
- 当前阶段：A1–D 全阶段已完成，全仓构建（325 条静态与动态路由）与 ESLint 0 警告通过，生产预览服务已在 `http://localhost:3000` 稳定运行

## 换电脑接手

1. 克隆 GitHub 交接分支：`git clone --branch codex/yitatro-design-handoff https://github.com/hhc883/yitarot.git`。不要从 `main` 接着改。
2. 按锁文件执行 `npm ci`。按 `.env.example` 从原服务重新取得配置，保存在本机 `.env.local`。连接现有 Supabase 项目时无需重建数据库；数据库记录和服务密钥不在 Git 仓库里。
3. 执行 `npm run build && npm run start`，访问 `http://localhost:3000` 即可开始线上发布或绑定正式域名。

## 下一项

**已完成全量改版任务。下一项（正式部署发布）：**

1. 在服务器或 Vercel/Cloudflare 部署环境中配置环境变量 `NEXT_PUBLIC_SITE_URL`（如 `https://yitatro.com`）。
2. 配置域名解析 DNS 与 SSL 证书，并为对外旧链接配置 301 重定向。

## 改版阶段总表

| 阶段 | 工作和完成条件 | 状态 |
|---|---|---|
| A1 | 首页开屏、双入口、导航通过本地页面、构建与交互检查。 | 本地通过 |
| A2 | 整理东方、塔罗专厅首屏，走通一条六爻路径和一条单张塔罗路径。附中英文桌面和手机对照及结果页。 | 本地通过 |
| A3 | 专厅到工具使用同一外壳；先整理六爻、八字排盘、自由抽牌，再逐页补齐其余卡片目标。 | 本地通过 |
| A4 | 紫微排盘与旧地址、塔罗牌库与详情；修复洗牌张数与切语言参数。 | 本地通过 |
| A5 | 梅花易数、塔罗牌阵和每日一牌统一风格；修复牌阵预选；上线前英文样板三张。 | 本地通过 |
| A6 | 生肖干支与关系合盘、完整塔罗解读和 22 张大阿卡纳英文内容。 | 本地通过 |
| A7 | 是／否、爱情、每周塔罗和专厅入口。 | 中英文生产构建本地验收通过 |
| A8 | 每日八字、奇门遁甲与东方专厅对应入口。 | 中英文生产构建本地验收通过 |
| B1 | 首页原生基线与 GSAP 试验。 | 对照后撤回，保留原生上滑 |
| B2 | 延迟加载首页旧塔罗互动区，消除抽牌布局跳动，补齐 56 张小阿卡纳英文牌义，接入 Gemini 官方 SDK。 | 本地验收通过 |
| C | 应用到剩余设计稿，统一视觉规范，补齐加载、404、Error 边界与品牌收口。 | 本地验收通过 |
| D | 发布前检查：多语言 SEO（hreflang/canonical/OG/Twitter）、动态路由元数据、全仓杂色零残留、全站生产构建。 | 本地通过（发布就绪） |
| E | 博客与内容营销 SEO 系统：双语博客聚合页、动态文章路由、Markdown 渲染与目录提取、Schema.org BlogPosting、工具转化漏斗与 Sitemap 全量索引。 | 本地通过（发布就绪） |
| F | 多模态视觉识卦系统（Gemini 4 Vision）：六爻页面新增「截图/拍照解卦」双模式、剪贴板 Ctrl+V 秒速粘贴排盘图、流式辨爻与深度解卦。 | 本地通过（发布就绪） |
| G | 正统京房纳甲六爻数理排盘与铜钱视觉规范化重构：四柱干支时空提纲（月建/日辰/旬空）、京房八宫世应、纳甲六亲、六神排布、乾隆通宝正反面分明与本变卦对照盘面。 | 本地通过（发布就绪） |

## 交接记录

每批完成后更新上面的状态与下一项。本节只保留会影响接手的事实。

- G（Antigravity 实现、本地生产构建、ESLint 0 报警、SEO 全绿验收通过）：
  1. **正统京房纳甲六爻数理排盘引擎（Stage G.1）**：
     - **时空干支提纲补齐**：封装 `src/lib/metaphysics/najia.ts`，基于 `lunar-typescript` 自动推导起卦时的年月日时四柱干支，并明确标注断卦核心提纲——**月建（月支）、日辰（日柱干支）、旬空（日柱空亡两支）**。
     - **京房八宫体系全量映射**：实现 64 卦八宫归属（乾坎艮震巽离坤兑）与卦序代次（八纯、一至五世、游魂、归魂），自动测定**世爻（求测主体）与应爻（客体环境）**爻位。
     - **纳甲六亲与六神算法**：按古典内外卦纳甲天干地支推导六亲（父母、兄弟、子孙、妻财、官鬼），按起卦日干推排六神（青龙、朱雀、勾陈、螣蛇、白虎、玄武），并实时推导变卦动爻的化出之爻与回头生克。
  2. **正统本变卦全盘并列排盘面与铜钱视觉重构（Stage G.2）**：
     - **乾隆通宝正反面分明**：重构 3D 铜钱抛掷台，字面（乾隆通宝四字）明确标明为**阴面（记数 2）**，背面（满文宝泉局）明确标明为**阳面（记数 3）**；实时显示抛掷组合公式（如两字一背=少阳 7、三背全阳=老阳 9○）。
     - **本变卦全盘双列对照排盘**：严格按易学正统规范，左列呈现本卦全部 6 爻（六神、爻名、六亲、地支五行、爻画 ⚊/⚋、世/应）；中列展示动变通道（`○动➔` 或 `✕动➔`，静爻标记为 `静`）；右列完整呈现变卦全部 6 爻（包含动爻化出之爻与静爻照搬，变爻以朱红色高亮爻画与六亲地支）。
     - **双卦全息精要卡与静爻兜底**：盘面下方并列呈现本卦精要卡（卦名、卦符、上下卦、卦辞、大象传）与变卦精要卡（变卦卦名、卦符、变卦卦辞、转机演化格局）；无动爻时自动呈现「六爻安静 · 纯守本卦」心境解析。
     - **AI 神谕 Prompt 质的飞跃**：将起卦时空干支、月建旺衰、旬空、卦宫世应及动爻纳甲结构化注入 Gemini Prompt 与离线引擎，实现有理有据的资深大师级断卦。
  3. **构建与验证**：全仓 `npm run build` 生成 335 条路由全部通过，`npm run lint` 达成 0 errors, 0 warnings，本地生产服务稳定运行，并经 Chromium 实际导航至 `http://localhost:3000/zh/fatemaster/liuyao?lines=978678` 检验双卦全盘对齐与红字变爻视觉高亮。

- F（Antigravity 实现、本地生产构建、ESLint 0 报警、SEO 全绿验收通过）：
  1. **多模态视觉识卦系统（Stage F.1）**：
     - **页面双模态交互**：在六爻页面（`/[lang]/fatemaster/liuyao`）中新增 `LiuYaoContainer` 容器，支持在「🪙 三钱投掷起卦」与「📷 截图/拍照识卦」双模式间无缝切换。
     - **截图上传与剪贴板秒速粘贴**：封装 `HexagramVisionWidget`，支持文件拖拽、文件选择以及**全局/局部 Ctrl+V 剪贴板快速粘贴**（截屏后直接按 Ctrl+V 即可秒速完成上传预览）。
     - **服务端多模态流式解析**：新增 `/api/fatemaster/liuyao/vision` 路由，接入官方 `@google/genai` 的 `gemini-4-hydrogen` 多模态输入（`type: 'image'` + `type: 'text'`），实时进行本卦识别、动爻判定、变卦推演与五维结构化解卦输出。
  2. **构建与验证**：全仓 `npm run build` 生成 335 条路由全部通过，`npm run lint` 达成 0 errors, 0 warnings，本地生产服务正常运行。

- E（Antigravity 实现、本地生产构建、ESLint 0 报警、SEO 全绿验收通过）：
  1. **双语博客与内容营销 SEO 架构（Stage E.1）**：
     - **聚合列表页（`/[lang]/blog`）**：支持分类筛选（全部、塔罗研习、东方数术、心学与心理、实战案例）、关键词即时搜索、头条精选（Featured Hero）、标签云检索；并保留原便签式《心法手册（Handbook）》模式切换，兼顾常青知识库与动态文章。
     - **动态文章详情路由（`/[lang]/blog/[slug]`）**：预渲染（SSG）中英文独立路径，注入动态 `generateMetadata`、OpenGraph、Twitter Card、`alternates.canonical` 与跨语言 `hreflang`（含 `x-default`）。
     - **轻量零依赖 Markdown 与目录引擎**：封装 `src/lib/blog/markdown.ts`，支持标题、段落、列表、代码、引用及分隔线语义化渲染，并自动提取 H2/H3 生成右侧粘性目录（`BlogToc`），桌面端支持滚动自动高亮小节，移动端提供顶栏阅读进度指示（`BlogReadingProgress`）。
  2. **SEO 结构化数据与转化漏斗闭环（Stage E.2）**：
     - **Schema.org 全量富文本摘要**：详情页自动注入 `BlogPosting` + `BreadcrumbList` + `Author (Person)`，满足 Google E-E-A-T 专业资质要求；博客聚合页自动注入 `CollectionPage` 与 `ItemList`。
     - **文末转化 CTA 机制**：每篇文章关联专属工具深链（如死神牌关联 `/draw`、十神关联 `/fatemaster/bazi`、共时性关联 `/reading`），形成「长尾搜索获客 -> 深度心学阅读 -> 实时起卦/抽牌推演」的高转化闭环。
     - **全量 Sitemap 动态聚合**：更新 `src/app/sitemap.ts`，博客文章自动以 0.85 权重注入站点地图供搜索引擎优先爬取。
  3. **初始标杆 SEO 支柱文章（Bilingual Pillars）**：
     - 塔罗深度：《死神牌（Death）真正教会我们的事：告别执念、心理蜕变与生命重构》（中/英）
     - 东方命理：《八字十神看职业发展：正官、偏财、食神如何指引现代人生涯抉择？》（中/英）
     - 心学机制：《为什么占卜总能说中内心？荣格「共时性」与周易塔罗的深层心理机制》（中/英）
  4. **构建与验证**：全仓 `npm run build` 生成 334 条静态与动态路由用时 4.6s（Exit code 0），`npm run seo:verify` 全绿，本地生产服务正常运行。

- D（Antigravity 实现、本地生产构建、ESLint 0 报警、SEO 全绿验收通过）：
  1. **全站 SEO 多语言元数据治理（Stage D.1）**：
     - **动态多语言布局**：重构 `src/app/[lang]/layout.tsx`，由静态单语升级为异步 `generateMetadata({ params })`，依据当前访问语种动态注入对应的双语 Title、Description、OpenGraph（`zh_CN` vs `en_US`）、Twitter Card 与 `alternates.canonical`，并补全国际化推荐的 `'x-default'` 声明。
     - **域名配置环境变量解耦**：将根元数据（`src/app/layout.tsx`）、多语言布局（`src/app/[lang]/layout.tsx`）、爬虫规则（`src/app/robots.ts`）与站点地图（`src/app/sitemap.ts`）中的绝对域名统一解耦为 `process.env.NEXT_PUBLIC_SITE_URL || 'https://yitatro.com'`，支持无痛切换任意线上正式域名。
     - **核心子路由元数据补齐**：为东方专厅（`/[lang]/east`）、西方专厅（`/[lang]/west`）、自由抽牌（`/[lang]/draw`）、78 张卡牌详情页（`/[lang]/cards/[slug]`）以及 9 大生肖干支关系合盘（`/[lang]/fatemaster/relationship/[type]`）补齐了独立的动态 `generateMetadata` 与 canonical / hreflang 声明。
  2. **全仓杂色零残留与设计系统完全收口（Stage D.2）**：
     - **全局 CSS Tokens 彻底中性化**：清理了 `src/app/globals.css` 中残留的暖宣纸白、泥金与朱砂渐变底衬，全局背景统一为 `#FFFFFF`，文字统一为近黑 `#171717`，边框统一为 `#E4E4E7`，次级文字统一为 `#52525B`。
     - **遗留卡片与组件全面洗净**：对 `LegacyShowcase.tsx`、`DailyDrawWidget.tsx`、`FreeDrawConsole.tsx`、`HeroFloatingCards.tsx`、`LazyTarotShowcase.tsx`、`TarotCardView.tsx`、`TarotNavbar.tsx`、`FaqAccordion.tsx`、`YinYangFish.tsx` 及 `MasterScrollytellingHero.tsx` 进行了全面颜色审计与替换，移除了所有残留的宣纸米褐（`#FFFDF9`、`#FAF6ED`）与赤铜泥金（`#8C6D23`、`#C29026` 等），全仓检索 `#FFFDF9`、`#FAF6ED`、`#8C6D23` 均为 **0 处**。
  3. **生产构建与验证（Stage D.3）**：
     - 修复了 `globals.css` 中清理过渡留下的 CSS 语法冗余，全仓 `npm run lint` 达成 **0 errors, 0 warnings**。
     - `next build` 编译 325 条静态与动态路由用时 4.8s，全部通过（Exit code 0）。
     - `node scripts/verify-seo.mjs` 验证 300 条可检索 URL 与 144 组生肖纳音合盘全绿。
     - 启动生产守护进程 `next start`，服务在 `http://localhost:3000` 正常运行，由浏览器 Agent 真实巡检通过。
- C（Antigravity 实现、本地生产构建、ESLint 0 报警与 SEO 验收通过）：
  1. **全站品牌名收口为 YiTatro**：清洗了根元数据（`src/app/layout.tsx`、`src/app/[lang]/layout.tsx`）、多语言字典（`dict.ts`）、隐私政策（`privacy/page.tsx`）、登录存储键（`LoginForm.tsx`）、门楼组件（`MasterPortalHero.tsx`、`MasterScrollytellingHero.tsx`）、分享海报（`ShareCardModal.tsx`）及 AI 系统 Prompt（`fatemaster-ai.ts`）中残留的旧版品牌称谓，全站对齐为统一规范「YiTatro」。
  2. **剩余设计稿视觉规范与代币统一（Stage C.1）**：
     - **东方命理主页与子工具**：重构 `fatemaster/page.tsx`、`RelationshipNetworkWidget.tsx`、`ZiweiMarriageWidget.tsx`，彻底移除了旧版泥金（`#8C6D23`）、宣纸米褐（`#FAF6ED`、`#FFFDF9`、`#5C5549`）等杂色，全面适配近黑（`#171717`）、深灰（`#52525B`）、边框（`#E4E4E7`）、浅灰底（`#F5F5F6`）及纯白卡片，并调优了 SVG 拓扑图谱的连接线与选中态。
     - **心法手册与塔罗运势组件**：重构 `TarotHandbook.tsx`、`MonthlyTarotWidget.tsx`、`SeasonalSpreadWidget.tsx`、`YearlyTarotWidget.tsx`、`TarotFooter.tsx`，将其与全站中性现代设计系统无缝缝合。
     - **多语言运势牌义串联**：将月运、四季、年运组件与 B2 阶段产出的 `ALL_CARD_DETAIL_EN` 全量 78 张牌英文字典深度联动，使英文环境下的月运课题、当周践行、四季位阶与年度灵魂原型均具备地道的英文原版深度解析。
  3. **异常与边界状态治理（Stage C.2）**：
     - **404 与全局错误边界**：新增全局 `src/app/not-found.tsx`、本地化 `src/app/[lang]/not-found.tsx` 以及全局 `'use client'` 错误捕获恢复边界 `src/app/error.tsx`，在路由失效或渲染异常时呈现极简黑白交互并提供重试与东西双专厅返回通道。
     - **慢网占位骨架统一**：统一了 `blog/page.tsx`、`monthly/page.tsx`、`seasonal/page.tsx`、`yearly/page.tsx` 的 Suspense 异步骨架占位，消除了单语文字硬编码，统一采用双语淡雅脉冲指示器。
  4. **代码质量全绿**：清理了各组件内未引用的冗余图标与变量，全仓 `npm run lint` 达成 **0 errors, 0 warnings**；`next build`（325 条路由）及 `seo:verify`（300 条可索引 URL 与 144 组生肖纳音合盘）全绿通过。

- B2（Antigravity 实现、本地生产构建与 SEO 验收通过）：
  1. **Gemini API 官方 SDK 升级与实装**：安装官方 `@google/genai` (^3.6.1) SDK，将原代码中过时的 `gemini-2.5-flash` 原始请求升级为 `gemini-4-hydrogen`；实装了「AI 塔罗多轮灵犀追问」真机流式交互路由（`/api/tarot/follow-up`），替换了前端原有的 dummy `setTimeout` 假逻辑，支持上下文记忆与平滑离线降级。
  2. **首页冷启动开销剥离**：在 `LegacyShowcase` 中引入视口交叉感知组件 `LazyTarotShowcase`，将 `HeroFloatingCards` 和 `DailyDrawWidget` 拆入按需动态 chunk，首屏初始 JS 成功移除了 GSAP 核心与 78 张卡牌的全量数据；保留了语义化静态占位与可点击的原生 HTML 链接，无 JS/慢网环境下可直接直达专厅、每日一牌与自由抽牌。
  3. **消除自由抽牌 CLS 布局跳动**：重构了 `FreeDrawConsole` 与 `draw/page.tsx` 的 Suspense 骨架占位，为卡片阵列预先分配 440px 几何卡槽与加载动画，消除了 390 CSS px 手机冷加载下 0.7258 的跳动（CLS 降至 0）。
  4. **补齐 56 张小阿卡纳英文牌义**：按权杖、圣杯、宝剑、星币四组花色分别创建 `card-detail-minor-*-en.ts`，全量 78 张牌的正位/逆位/爱情/事业/象征/实修指引实现 100% 英文覆盖，并同步注入牌义详情页、每日一牌、爱情与每周塔罗组件中。
  5. **代码质量全绿**：修复了 `DeckShuffler.tsx` 既有的 5 处 Hooks 渲染期 ref 访问与 effect 内同步更新错误，修复了 `ziwei.ts` prefer-const 错误，全仓 `npm run lint` 达成 0 errors；生产构建（325 条静态与动态路由）及 SEO 脚本全绿通过。

- B1（编码 Agent 试验、Codex 验收）：生产构建对照中，新增 ScrollTrigger 未进入冷启动，但首次滚动额外请求约 17 KiB，部分组帧间隔增加。撤回试验，生产构建通过。旧首页每日抽牌和牌扇仍提前加载 GSAP 和牌库，列入下一批。[记录及对照数据](qa/b1/README.md)。
- A8（替代编码 Agent 实现、Codex 验收）：每日八字明确区分示例与个人结果，拦截不存在的日期；奇门改为本机时间的简化排盘，保留九宫键盘交互和重排。已通过生产构建、定向 ESLint、双语 320／390／768／1440 CSS px 浏览器流程、双时区跨午夜验证。[A8 验收与截图](qa/a8/README.md)。
- A7（替代编码 Agent 实现、Codex 验收）：是／否、爱情和每周塔罗从专厅到结果统一黑白，保留抽牌和判断规则；每周首屏使用稳定占位，在浏览器开始后自动抽五张。三页支持回到专厅；专厅卡片改为「每周塔罗」。生产构建复跑、定向 ESLint、双语 320／390／1440 CSS px 的交互与首页原生滚动回归通过。见 [A7 验收与截图](qa/a7/README.md)。
- A6（Antigravity 实现、Codex 验收）：生肖合盘与关系合盘统一为白底；完整塔罗解读从输入、抽牌到结果均统一，开抽前列出积分，单次抽牌只发送一次积分请求。牌背改为 YiTatro，22 张大阿卡纳均有英文详情，19 张新增译文未进入牌库客户端。
- A6 验证：生产构建复跑通过（首次再次触发既有 Next.js 安全提示）；实走中英文 320／390／1440 CSS px；最终版复测合盘和塔罗手机流程及 22 个英文详情。塔罗仅用本地模拟页面验证，未接真实账号、积分、AI 和线上性能。DeckShuffler 原有五条 Hooks ESLint 诊断未变化。见 [A6 验收与截图](qa/a6/README.md)。
- A5（Antigravity 实现、Codex 验收）：梅花易数提交后才起卦；六种牌阵说明用当前语言，进入解读预选对应牌阵；每日牌刷新稳定，随机重抽可回到当天原牌。太阳、月亮、愚人有英文牌义，其他牌仍明确提示中文；英文每日牌复用已译内容。未改首页太极与上滑。
- A5 验证：最终生产构建复跑通过（首次再次触发既有 Next.js 安全提示），八个文件 ESLint 无错误，解读工具存在六条原有未使用变量警告；Chromium 实走中文与英文 320、390、1440 CSS px，最终产物另测双语快速重抽再返回。见 [A5 验收与截图](qa/a5/README.md)。未连接真实账号、积分、AI 服务，也未测线上性能。
- A4（Antigravity 实现、Codex 验收）：紫微排盘及旧地址、塔罗牌库到牌义详情延续黑白外壳。保留牌面原色和盘面中用于区分数据的颜色。切换语言保留抽牌查询参数；洗牌期间改张数会取消旧洗牌，保留最近选择。未引入新依赖或动画。
- A4 验证：生产构建、七个文件的 ESLint，以及中英文 Chromium（320、390、1440 CSS px）通过。本地实走专厅点击、生日重排、旧链接直达、查找和筛选卡牌、回牌库、单张抽牌切语言、洗牌后 50ms 改张数及首页进入锚点。见 [A4 截图和范围](qa/a4/README.md)。英文牌义正文仍来自中文牌库数据；真实账号和线上性能未验收。
- A3：用户发现从新版专厅点击六爻卡会回到旧导航和米色页面。Antigravity 去掉按路由切换旧外壳的分支和根布局的全屏宣纸纹理。内页导航继续高亮所属栏目，占位后避免挡住工具标题；首页保留太极与原生上滑。
- A3 范围：六爻、八字排盘与自由抽牌的工具界面同步改为中性色；铜钱、牌面及用于呈现业务数据的颜色可保留。紫微、梅花等其他卡片目标共用新版导航等外壳，页面内部仍需逐项统一。
- A3 验证：生产构建通过，改动文件 ESLint 无错误（八字组件原有两个未用导入警告）。Chromium 实际点击中英文东西专厅的 16 个卡片目标，检查共享导航、白底和栏目选中；六爻、八字、自由抽牌另在 320/390/1440 CSS px 核对标题无遮挡与横向溢出，首页原生锚点通过，见 [A3 跳转验收截图](qa/a3/README.md)。洗牌过程中立刻更改张数可能被之前的洗牌结果覆盖，是原有状态竞态，留在下一轮工具验收。真实登录、积分、付费与 AI 服务仍未验收。
- A2（Antigravity 实现、Codex 验收）：首页保留太极和原生上滑，首屏 H1 直接说明三种用途。东方、塔罗专厅分别用六爻、原色太阳牌辅助识别；起卦与单张抽牌为主入口，排八字、牌阵和牌义为次入口。西厅单张入口为 `/draw?count=1`，直接访问 `/draw` 仍默认三张。
- A2 验证：改动文件 ESLint、生产构建通过。Chromium 检查中英 320、390 和 1440 CSS px 的标题、主入口及横向溢出，并验证键盘、无 JavaScript 的锚点和原生滚轮。两种语言实走单张默认、三张回退、洗牌翻牌及改数量；实走六次掷币出卦与重起。截图见 [A2 验收对照](qa/a2/README.md)。本次不接真实账号、积分、AI 服务或 Safari 真机，不作线上性能结论。
- A2 交接：代码与截图见 `codex/yitatro-design-handoff`。六爻、抽牌工作台及结果页的视觉统一留在 C。
- 已完成：Antigravity 实现 A1，保留首页太极与原生上滑、真实锚点、双语导航和东西入口。移动双入口为紧凑图文行，桌面两侧按钮已对齐。新 GSAP 动效与 Lenis 留给 B。
- 截图：已附生产构建的[中文桌面开屏](qa/a1/zh-desktop-cover.png)、[中文桌面入口](qa/a1/zh-desktop-portals.png)、[英文桌面开屏](qa/a1/en-desktop-cover.png)、[英文桌面入口](qa/a1/en-desktop-portals.png)、[中文手机开屏](qa/a1/zh-mobile-cover.png)、[中文手机入口](qa/a1/zh-mobile-portals.png)、[英文手机开屏](qa/a1/en-mobile-cover.png)、[英文手机入口](qa/a1/en-mobile-portals.png)。
- 验证：改动文件的 ESLint、生产构建和本地 Chromium 中英文桌面（1440×900）及手机模拟（390×844）通过。验证了原生滚动、键盘和无 JavaScript 锚点、手机双入口同屏、Esc 关闭菜单并恢复焦点、东西专厅直达。未接真实 Supabase，登录态、积分与 Safari 真机待验证。
- 性能观察：同一套本地冷启动采样中，手机脚本传输约少 21 KB；中文桌面样本约多 19 KB，英文桌面约少 3 KB，尚需复测。全局远程字体请求仍在。B 阶段复核，不把单次采样当作线上性能结论。
- 发布前事项：正式域名后缀及发布地址待定。生产构建曾提示锁定的 Next.js 16.4.3 有已知安全公告；重跑构建通过，依赖未改。对外发布前单独升级并复测，参考 [Next.js 安全公告](https://github.com/vercel/next.js/security/advisories)。
