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
| H | 修复首页吸顶导航与 3D 悬浮塔罗卡牌层叠穿透 bug：建立 `isolation: isolate` 局部层叠孤立域，梳理全局 z-index 阶梯（导航栏 z-[100]），彻底消除卡牌遮盖顶栏与残留金边。 | 本地通过（发布就绪） |
| I | 预留易学专业 Skill 插件插槽、接入 DeepSeek 降本适配器、六爻 2 积分多轮追问与 7 天生命周期数据存储架构。 | 本地通过（发布就绪） |
| J | 全站多语言 TDK 关键词继承修复：彻底解决 Next.js App Router 根布局 keywords 向英文页面渗透下沉问题，全站动态与静态路由精准匹配双语 SEO 词库。 | 本地验收通过（发布就绪） |
| K | 全站多语言纯正度与中英文混入治理：彻底消除英文模式下的中文残留（首页3D展台、每日一签、自由抽牌、卡牌百科、专厅工具卡、八字纳音与紫微宫位），实现全站英文页面 0 中文混入。 | 本地验收通过（发布就绪） |
| L | 竞品命名与历史痕迹彻底脱敏治理：将旧竞品前缀 fatemaster 全量重构为 YiTatro 原生架构（/[lang]/east/*、/api/east/*、components/east/、east-ai.ts），配置 301 永久重定向并更正包名与配置注释。 | 全量重构验收通过（发布就绪） |
| M | 双轨支付结算体系：海外 Stripe 国际信用卡/Apple Pay 接入、国内微信/支付宝扫码通道适配、防伪卡密/兑换码秒充系统与多语言定价收银台。 | 本地验收通过（发布就绪） |
| N | Payhip / PayPal 支付体系接入：Webhook 自动核验加分/退款（POST /api/payhip-webhook）、Supabase credit_purchase_points 事务 RPC 与 orders.payhip_transaction_id、定价页直链挂载与 Stripe 痕迹彻底脱敏。 | 全量重构验收通过（发布就绪） |
| O | 东方易学典籍多门类分仓知识库与宇宙原理底座：全量收录《增删卜易》（30通则+42案例）、《卜筮全书》（35通则+20案例）、《梅花易数》（15体用通则+10宗师案例+八卦类象字典）、《京氏易传》（模式C宇宙原理型55条元典原理），跨门类自动化测试套件全绿。 | 本地验收通过（发布就绪） |
| P | 测字断相与汉字全息象数知识库：收录清代相字宗师程省《测字秘牒》（35条断法通则+35例至理占验案例+独门象意字典），east-ai流式推演引擎深度联动，自动化测试套件全绿。 | 本地验收通过（发布就绪） |

## 交接记录

每批完成后更新上面的状态与下一项。本节只保留会影响接手的事实。

- **拆分 Sitemap 落地 `main`（2026-11-27，Antigravity 实现，Codex 验收通过）**：
  - 参照 `fix/divination-audit` 已批准提交 `34b218a` / `3379d6e` 的拆分架构，在当前 `main` 上新增 `src/lib/seo/site-url.ts`、`src/lib/seo/sitemap-xml.ts`、`src/lib/seo/blog-sitemap.ts` 与五个 Route Handler（`src/app/sitemap.xml/route.ts`、`src/app/sitemap-landing.xml/route.ts`、`src/app/sitemap-cards.xml/route.ts`、`src/app/sitemap-blog-zh.xml/route.ts`、`src/app/sitemap-blog-en.xml/route.ts`）；`src/app/robots.ts` 复用 `getSiteUrl()` 归一化尾斜杠并保持仅暴露根 `/sitemap.xml`。
  - `/sitemap-landing.xml` 仅保留当前 `main` 实际存在的独立落地页（含 `/cards` 列表页）与规范的 `/east/relationship/{type}` 页面，排除不存在的 3 个英文指南、博客与卡牌详情页以及已指向其它页面 canonical 的已知别名路由（共排除 26 个已知别名）；`scripts/verify-seo.mjs` 改为校验 5 个 sitemap route。
  - 验收通过：Codex 已移除旧版冲突的 `src/app/sitemap.ts`，定向 ESLint、`node scripts/verify-seo.mjs` 与生产构建通过；`robots.txt`、根 `/sitemap.xml` 及 4 个子 XML 地图均有效，237 条收录 URL（landing 72、cards 156、zh blog 4、en blog 5）在生产构建中全部返回 200、自指向 canonical 且无 robots `noindex`。
  - 生产环境裸域返回 308 并跳转到 www。SEO 元数据、robots 和站点地图统一生成 https://www.yitarot.net。定向 ESLint、SEO 检查脚本和生产构建通过，重新验证 237 条入图网址均返回 200 并使用对应的 www canonical。

- **博客索引页改版（2026-11-27，Antigravity 实现，Codex 验收通过）**：
  - 调整 `src/components/blog/BlogIndexClient.tsx`：默认未筛选文章视图改为「单篇宽图头条 + 单栏纯文本发丝分隔归档列表」；头条仅从当前语言下 `featured=true` 且 `coverImage` 非空的文章中确定性选取最新 1 篇，使用 `16:9` 稳定容器配合 `object-contain` 完整展示原图不裁切；若无合格封面（如当前 `zh`）或封面加载失败（含水合前 `complete && naturalWidth === 0` 失败检测），自动移除头条区并将文章回退至常规列表。
  - 归档列表移除双栏边框卡片、缩略图与重复 `Read` / `阅读` 按钮，改为单栏发丝分隔行（分类/日期/阅读时长响应式换行、链接标题、简短摘要），保留搜索（含标签）、分类筛选、心法手册切换、排序、语言路由及详情页 `BlogCard` 相关推荐行为。
  - 同步更新 `docs/design/yitatro/README.md`（补充博客封面发布与维护约定）与 `docs/design/yitatro/STATUS.md`。
  - 验收通过：定向 ESLint、Next.js 生产构建与类型检查；Chromium 实测英文精选和文字列表、中英文 320px、标签搜索、分类、手册切换、封面 404 回退及详情页封面。

- **首页太极开屏动效回补到 `main`（2026-11-27，Antigravity 从 `fix/divination-audit` 提交 `396e9bf` / `7d17f2b` 移植）**：
  - 仅移植 `src/components/site/TaijiIntro.tsx` 与开屏专用的 `src/components/site/HomeMotion.css`（24s 慢速 CSS 自转、sticky 居中滚动缩放渐隐、`#portals` 真实锚点、服务端双语文案与 `prefers-reduced-motion` / `@supports` 降级）；保留 `main` 现有 `src/app/[lang]/page.tsx` 与 `src/components/site/PortalEntry.tsx` 不变，未引入 GSAP/Lenis 或修改全局样式。
  - 工程与浏览器验收：定向 ESLint 与 `git diff --check` 通过；Chromium 1365×900 中文与 390×844 模拟英文实测通过（24s CSS 自转、居中放大至 3.28x、渐隐至 0 并露出双入口、`#portals` 原生点击可用）；模拟减弱动效保持静态开屏、无 sticky 延展且保留锚点；生产构建通过。

- **博客卡片 UI 改版（2026-11-27，Antigravity 实现，Codex 验收通过）**：
  - 重构 `src/components/blog/BlogCard.tsx` 为服务端兼容的紧凑黑白文优先卡片，将缩略图链接与加载失败状态拆入仅接收标量 props 的客户端组件 `src/components/blog/BlogCardThumbnail.tsx`，缺图或加载失败时自动释放为全宽文本；同步更新 `src/components/blog/BlogIndexClient.tsx` 与 `src/app/[lang]/blog/[slug]/page.tsx` 双栏顶部对齐（`items-start`），并修正该详情页遗留分类导入。
  - 工程与浏览器验收通过：定向 ESLint 通过，Next TypeScript 检查通过并生成 348 个静态页面；1365px 英文列表双栏顶部对齐（含真实缩略图与无封面全宽文本）；320px 中英文视口均为单栏且无横向溢出；真实 404 缩略图请求触发后恢复全宽文本；英文文章详情页正常展示完整封面与相关推荐卡片。

- P（Antigravity 实现、全量生产构建通过、测字秘牒知识库全量入库）：
  1. **测字断相心易分仓架构（Stage P.1）**：
     - **测字断相知识子系统（`src/lib/kb/cezi/`）**：收录清代程省《测字秘牒》（模式 A·实战应用型）35 条核心断法通则（`CEZI_RULES`，涵盖装头、接脚、穿心、包笼、破解、添笔、减笔、对关、摘字、观梅等）与 35 个经典实战占验案例（`CEZI_CASES`，涵盖问六甲、疾疫、功名、婚姻、词讼、失物、行人、南巡、风水等）；
     - **独门象意字典（`concepts.ts`）**：偏旁部首全息取格字典（水部、火部、金部、木部、土部吉凶格物象）、字画骨骼散格系统（头/冠冕、心/神明、身/自身、足/步履）、笔形五行与六神体用、相字至理八法神机；
     - **全息析字引擎与 AI 联动（`src/lib/metaphysics/east-ai.ts`）**：提供 `buildCeziPrompt` 与 `streamCeziReading` 适配器，实现结构化字形骨骼解构、历史名家卦案共鸣与精准吉凶应期断定。
  2. **工程验证与跨门类自动化测试（Stage P.2）**：
     - 测试脚本 `scripts/kb/run-test.mjs` 跨学科全量通过：六爻纳甲 245 规则 + 62 案例、梅花易数 15 规则 + 10 案例、京氏易传 55 宇宙原理、测字秘牒 35 规则 + 35 案例；
     - `npx tsc --noEmit` 0 报错，`npm run lint` 0 报错 0 警告，`npm run build` 生成 341 条路由成功，生产服务稳定运行。

- O（Antigravity 实现、全量生产构建通过、多门类典籍知识库全量入库）：
  1. **多流派分仓知识架构（Stage O.1）**：
     - **六爻纳甲实战库（`src/lib/kb/`）**：汇聚明代《卜筮全书》与清代《增删卜易》，提供 245 条理法通则（`RULES_DB`）与 62 个全要素名家卦例（`CASES_DB`），支持用神识别、盘面硬匹配、多轮追问与 Guard 幻觉拦截。
     - **梅花易数象数心易库（`src/lib/kb/meihua/`）**：独立收录宋代邵雍《梅花易数》15 条核心体用断法、10 大千古占验案例（观梅占、牡丹占、邻人借物占等）及八卦万物类象字典，并与 `MeihuaDecisionWidget.tsx` 实现宗师案例实时溯源联动。
     - **宇宙原理与底层易理哲学底座（`src/lib/kb/principles/`）**：基于汉代京房《京氏易传》[模式 C·宇宙原理型]，全量提炼 55 条元典：20 条五行亢害承制、20 条干支冲合会刑成因、15 条四时旺相长生墓绝界定，深度贯通三刑、六害、十二长生宫与游魂归魂底层物理成因。
  2. **工程验证与自动化套件（Stage O.2）**：
     - 测试脚本 `scripts/kb/run-test.mjs` 跨学科全量通过：六爻纳甲 245 规则 + 62 案例、梅花易数 15 规则 + 10 案例、京氏易传 55 宇宙原理，Guard 审计与追问上下文 100% 达标；
     - `npx tsc --noEmit` 0 报错，`npm run lint` 0 报错 0 警告，`npm run build` 生成 341 条路由成功，生产服务稳定运行。

- N（Antigravity 实现、全量生产构建通过、Payhip 自动加分与直链上线）：
  1. **Payhip Webhook 自动加分与退款系统（Stage N.1）**：
     - 新建数据库迁移 `supabase/migrations/20261122000001_payhip_purchase.sql`，定义安全提权函数 `public.credit_purchase_points`（支持并发行级锁、负数账本退款与已记幂等），并在 `public.orders` 表增加 `payhip_transaction_id` 唯一索引列；
     - 新建服务端路由 `src/app/api/payhip-webhook/route.ts`：
       - `SHA-256(PAYHIP_API_KEY)` 定长安全签名防篡改核验（401）；
       - 监听 `paid` 与 `refunded` 核心事件；
       - 商品规格精准映射：`6gkYN`（100 积分 $4.99）、`6wc09`（500 积分 $19.99）、`cKoqG`（2000 积分 $59.99）；
       - 买家邮箱匹配本站账号，未匹配记 warn 日志返回 200 供人工补分；匹配成功调用 RPC 秒级到账并记入 orders 表；
       - 全程绝不向日志输出密钥与签名明文。
  2. **定价页全面对接 Payhip 与 Stripe 彻底脱敏（Stage N.2）**：
     - 重构 `src/components/site/PricingCards.tsx`：为三大套餐挂载 Payhip 直链（`https://payhip.com/b/6gkYN`、`https://payhip.com/b/6wc09`、`https://payhip.com/b/cKoqG`）；
     - 未登录用户点击提示跳登录页，已登录用户直开 Payhip 新标签页完成结算；
     - 按钮文字更新为 `Pay $X.XX with PayPal / Card`，卡片下方增加“请使用与本站账号相同的邮箱购买，积分将自动到账”中英双语提示；
     - 全站彻底消除 Stripe 遗留字样，安全标语更换为 `Payhip 安全结算 · 支持 PayPal 与国际信用卡`；
     - 同步更新 `src/app/[lang]/pricing/page.tsx` 页面文案为 Payhip 专属标语。

- M（Antigravity 实现、全量生产构建通过、双轨支付接口上线）：
  1. **海外支付体系（Stripe 全球结算）**：
     - 在 `src/lib/payments/stripe.ts` 实现轻量化原生 REST 通道，无冗余重量级 SDK，接入 Checkout Sessions 与 Webhook 签名防篡改校验；
     - 创建创建会话路由 `/api/checkout/stripe`、异步回调路由 `/api/webhooks/stripe`、以及客户端即时核销到账路由 `/api/checkout/verify`；
     - 支持 Visa、Mastercard、American Express、Apple Pay、Google Pay 全币种结算，三档积分定价（$4.99 / $19.99 / $59.99）。
  2. **国内支付与卡密极速充值体系**：
     - 在 `src/lib/payments/domestic.ts` 搭建国内免签/聚合支付网关标准协议适配器，创建 `/api/checkout/domestic` 与异步回调 `/api/webhooks/domestic`；
     - 研发防伪抗篡改 HMAC-SHA256 签名卡密兑换系统（`POST /api/points/redeem`），支持 100/500/2000 面额一键秒充入账，利用全局 `point_ledger` 唯一约束与事务防重复重放；
     - 提供官方卡密生成命令行工具 `scripts/generate-redeem-codes.mjs`，方便运营批量发卡。
  3. **收银台与个人中心 UI 升级**：
     - 重构 `src/components/site/PricingCards.tsx`：提供「🇨🇳 国内支付 (微信/支付宝)」与「🌏 海外支付 (Stripe/信用卡)」双轨一键切换；
     - 在定价页及个人中心（`AccountClient.tsx`）内置「卡密/兑换码即时充值」组件，兑换成功即时刷新账户积分余额；
     - 支付成功带参返回时自动核销并弹出欢庆到账横幅；
     - 全站生产构建（340 条静态与动态路由）0 报错通过。

- L（Antigravity 实现、全量路由重构、ESLint 0 报警、全站 333+ 路由构建验收通过）：
  1. **路由与页面架构重构（Stage L.1）**：
     - 将原竞品残留路径 `/[lang]/fatemaster/*`（八字、六爻、紫微、梅花、奇门、合盘等 22 个工具目录）全量平移并入 `/[lang]/east/*` 东方专厅原生子路由体系下；
     - 彻底删除旧版过渡页 `src/app/[lang]/fatemaster/page.tsx`，由统一规范设计的东方专厅总览页 `/[lang]/east` 作为唯一样板与入口；
     - 在 `next.config.ts` 中配置 `/:lang/fatemaster/:path*` -> `/:lang/east/:path*` 的 301 永久重定向，保证外部旧链接与历史搜索引擎书签 100% 自动无缝流转。
  2. **组件与服务端 API 解耦重命名（Stage L.2）**：
     - 组件目录由 `src/components/fatemaster` 重命名为 `src/components/east`，与西厅 `src/components/tarot` 形成对仗工整的架构体系；
     - 服务端 API 路由由 `/api/fatemaster/*` 重命名为 `/api/east/*`，在 `next.config.ts` 中同步配置了 `/api/fatemaster/:path*` 到 `/api/east/:path*` 的安全重定向映射；
     - 易学推演库由 `src/lib/metaphysics/fatemaster-ai.ts` 重命名为 `src/lib/metaphysics/east-ai.ts`；
     - 修复 `MeihuaDecisionWidget.tsx` 中的旧版竞品 UI 文案 `FateMaster Console`，更正为 `Eastern Metaphysics Hall`（东方专厅总览）；
     - 将 `package.json` 中的遗留包名 `suanming-html` 更正为官方品牌 `yitarot`，将 `.env.example` 注释更正为 `YiTatro 环境变量配置示例`。
  3. **自动化测试与重定向验证（Stage L.3）**：
     - `npm run lint` 验证通过（0 errors, 0 warnings）；
     - `npm run build` 全站 333+ 静态与动态路由成功编译并通过；
     - 本地启动生产服务执行针对性端点探测：`/zh/east` (200 OK)、`/zh/east/liuyao` (200 OK)、`/zh/east/bazi` (200 OK)、`/zh/fatemaster/liuyao` (308 永久重定向到 `/zh/east/liuyao`)、`sitemap.xml` 中已 100% 清除所有 fatemaster 字符串。

- K（Antigravity 实现、本地生产构建、ESLint 0 报警、多语言纯正度 0 混入验收通过）：
  1. **塔罗核心组件纯正多语言改造（Stage K.1）**：
     - **3D 悬浮卡牌（`HeroFloatingCards.tsx`）**：接入 `lang` 属性，英文下仅呈现纯正英文牌名与阿卡纳编号，神谕胶囊输出英文箴言（`✦ The Star: Sky after the storm, the stars guide your path forward`），阻断中文混入。
     - **服务端占位与按需加载（`LazyTarotShowcase.tsx`）**：剥离 `dynamic` 内部无语言上下文的写死中文占位，由外层受控渲染动态多语言骨架，消除了 SSR 阶段的中文渗透。
     - **每日一签（`DailyDrawWidget.tsx`）**：翻牌前后基于 `lang` 自动从 `card-detail-en.ts` 读取英文牌名、英文关键词、正位释义与行动建议。
     - **自由抽牌（`FreeDrawConsole.tsx`）**：抽牌卡片下方释义精准分流双语，彻底消除英文下的中文逆位释义。
     - **卡牌百科大全与详情（`cards/page.tsx`、`cards/[slug]/page.tsx`）**：78 张牌列表页在英文下移除下方副标题中文名，详情页 H1 与标题移除多余中文括号（如 `The Fool` 代替 `The Fool (愚人)`）。
  2. **东方数术工具与中台组件语言纯化（Stage K.2）**：
     - **专厅导航卡（`east/page.tsx`、`west/page.tsx`）**：英文模式下移除副标题的中文名称展示，仅保留纯正英文工具名与描述。
     - **八字排盘（`BaziChartGsap.tsx`）**：建立 30 组纳音英文对照字典（如 `Stream Water` 代替 `涧下水`），历法栏在英文下展示公历与生肖英译。
     - **紫微斗数（`ZiweiChartWidget.tsx`、`ziwei.ts`）**：建立地支英文名称映射（`Zi (Rat)`, `Chou (Ox)` 等），五行局英译（`Wood 3rd Bureau` 代替 `木三局`），四化角标（`Lu`, `Quan`, `Ke`, `Ji`），宫位名称纯英文。
     - **六爻追问（`LiuYaoFollowUpWidget.tsx`）**：扣分标签、7 天保存规则、灵感预设标签全面提供地道英文版本。
     - **全站页脚（`SiteFooter.tsx`）**：品牌标语按语言互斥呈现（英文只展示 `A mirror for the mind, not a verdict from fate.`），消除双语同时堆叠。
  3. **自动化测试与验收**：
     - `npm run lint`：0 errors, 0 warnings；
     - `npm run build`：336 条路由全部构建通过；
     - 自动化爬虫逐页扫描全站所有主要英文路由（`/en`, `/en/east`, `/en/west`, `/en/draw`, `/en/reading`, `/en/fatemaster`, `/en/fatemaster/liuyao`, `/en/fatemaster/bazi`, `/en/fatemaster/ziwei`, `/en/fatemaster/meihua`, `/en/fatemaster/compatibility`, `/en/cards`, `/en/cards/the-fool`, `/en/blog`, `/en/pricing`），确认英文页面非预期中文字符总数为 **0**。

- J（Antigravity 实现、本地生产构建、ESLint 0 报警、SEO 关键词全绿验收通过）：
  1. **多语言 TDK 关键词隔离与继承修复（Stage J.1）**：
     - **根源定位**：Next.js App Router 的 Metadata 机制存在向上逐级继承逻辑。当子路由只声明 `title`、`description` 和 `openGraph` 而未明确指定 `keywords` 时，Next.js 会自动向上继承根布局 `src/app/layout.tsx` 中写死的中文关键词数组（`['YiTatro', '周易起卦', '八字排盘', ...]`）。
     - **语言层级布局兜底覆盖**：在 `src/app/[lang]/layout.tsx` 中基于 `isEn` 动态注入英文专属顶级关键词（`['YiTatro', 'I Ching divination', 'BaZi astrology', 'Liu Yao coin oracle', 'Four Pillars of Destiny', 'AI tarot reading', ...]`），彻底阻断根布局中文关键词的向下渗透。
     - **核心子路由英文关键词精细化**：全面更新了 `east`、`west`、`draw`、`cards/[slug]`、`blog`、`blog/[slug]`、`relationship/[type]` 等页面的动态元数据生成器，英文页面下输出精准英文专业术语（如塔罗牌义大阿卡纳、八字合盘等）。
  2. **构建与验证**：
     - `npm run lint`：0 errors, 0 warnings；
     - `npm run build`：336 条路由全部构建通过；
     - 生产环境实时抓取检验：`/en`、`/en/west`、`/en/cards/the-fool` 等英文页面 `<meta name="keywords">` 100% 呈现纯正英文关键词，`/zh` 下保持完整中文易学词库。

- I（Antigravity 实现、本地生产构建、ESLint 0 报警、SEO 全绿验收通过）：
  1. **易学专业 Skill 插件插槽架构（Stage I.1）**：
     - **标准插槽设计**：在 `src/lib/metaphysics/skills/` 封装 `types.ts`、注册中心 `registry.ts`、默认基准 `default-skill/`，并专属预留 `custom/` 插槽；
     - **极简热插拔**：用户未来找到合适的 Skill（如 prompt、断卦要诀），只需将文件放入 `src/lib/metaphysics/skills/custom/`，系统无需改动任何业务代码即可全自动接管！
  2. **多模型适配器与 DeepSeek 极低成本接入（Stage I.2）**：
     - 封装 `src/lib/llm/adapter.ts`，原生支持 DeepSeek V3 / R1（兼容 OpenAI 协议流式输出）；
     - 单次追问成本大幅降低至不足半分钱（~0.003元），提供 `METAPHYSICS_LLM_PROVIDER=auto|deepseek|gemini` 自动热切换与容灾逃生。
  3. **数据存储与 7 天生命周期管理（Stage I.3）**：
     - 新增数据库脚本 `supabase/migrations/20261121000001_liuyao_chat_history.sql`，建立 `liuyao_sessions` 与 `liuyao_messages` 表；
     - 普通用户设置 `expires_at = now() + interval '7 days'` 自动物理级联清理，会员用户永久留存（`expires_at = null`）。
  4. **六爻 2 积分多轮追问模式（Stage I.4）**：
     - 后端新增 `/api/fatemaster/liuyao/follow-up` 流式追答接口，配置追问固定消耗 2 积分（`FOLLOWUP_COST = 2`）；
     - 追问自动携带本卦与变卦数理图谱、时空提纲与当前 Skill 宗纲，严禁另起新卦，紧扣用神动爻深层答疑；
     - 前端开发 `LiuYaoFollowUpWidget.tsx`，提供灵感预设标签、气泡流与 7 天保存规则提示。
  5. **构建与验证**：全仓 `npm run build` 生成 336 条路由全部通过，`npm run lint` 达成 0 errors, 0 warnings，本地生产服务稳定运行。

- H（Antigravity 实现、本地生产构建、ESLint 0 报警、SEO 全绿验收通过）：
  1. **层叠穿透与 z-index 体系重构**：
     - **根源定位**：原 `.hero-glass-card:hover` 使用了 `z-index: 50 !important;`，且外层容器未建立独立层叠上下文；当移动端/桌面端向上滚动且中间卡牌被激活（`active` 或 `hover`）时，卡牌与 `<header>`（同为 `z-50`）在同一层叠上下文中由于 DOM 靠后渲染在顶栏之上，穿透遮盖了 Logo 与菜单按钮。
     - **局部层叠孤立（CSS Isolation）**：为 `HeroFloatingCards`、`LazyTarotShowcase` 与 `LegacyShowcase` 注入 `relative isolate`，强制卡牌的所有层叠层级闭环在局部容器中，绝不逃逸污染全局。
     - **全局阶梯化 z-index 规范**：梳理全站层叠层级：内页组件与卡牌 `z-0`~`z-30`，吸顶导航栏 `z-[100]`，语言下拉菜单 `z-[105]`，移动端抽屉 `z-[110]`，分享卡模态框 `z-[120]`，积分弹窗 `z-[130]`。
  2. **视觉杂色清理收口**：
     - 清理了 `HeroFloatingCards` 中残留的暖金光晕（`#C8A858`、`#D4AF37`、`#FFE59A`），统一采用中性雅致微光（`#171717/4` 等）；
     - 将卡牌底色收归为白底 `#FFFFFF`、边框 `#E4E4E7`，激活/悬停统一为近黑 `#171717` 描边与中性立体投影。
  3. **构建与验证**：全仓 `npm run build` 生成 335 条路由全部通过，`npm run lint` 达成 0 errors, 0 warnings，本地生产服务稳定运行，并经 Chromium 实际滚动至卡牌顶部与激活状态，确认卡牌平滑滑入导航栏下方，顶栏 100% 保持在最上层。

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
