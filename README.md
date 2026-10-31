# QiCosmos (天仪灵图) — 东西合璧算命预测出海平台

> **东方玄学智慧 × 现代自我探索**  
> Ancient Eastern Metaphysics Meets Western Astrology & Self-Discovery

---

## 🌟 核心理念与定位 (Core Philosophy)

* **东魂西桥**：以东方八字四柱、五行生克、周易六十四卦与生肖合婚为**核心壁垒**；以海外高普及度的西方占星（太阳/月亮/上升、星座特质）为 **SEO 流量桥梁**。
* **去迷信化，心理学与能量化包装**：将传统八字算命包装为 **"The Chinese Birth Chart" / "Eastern MBTI"** 与 **"Cosmic Energy Blueprint"**，深受海外年轻一代与现代高净值受众信赖。
* **双语国际化 (i18n)**：全站原生采用 Google 官方推荐的 `/en`（主站）与 `/zh`（中文镜像）子路径，配以完整的 `hreflang` 互联与 `sitemap.xml`。

---

## 🚀 三大核心交互工具 (Interactive Tool Suite)

1. **旗舰工具：双盘合一命理蓝图 (Dual Celestial Blueprint)**
   * **路由**：`/[lang]/calculator/bazi`
   * **功能**：基于 `lunar-typescript` 严谨二十四节气换月柱，公历精确推算四柱八字（年/月/日/时）；西方太阳星座与东方日主（Day Master）元神双重对比；五行能量雷达图（Radar Chart）与后天补木火土金水实操指引。
2. **流量磁石：144 组生肖五行合盘矩阵 (Compatibility Matrix)**
   * **路由**：`/[lang]/compatibility` & 批量静态生成的 `/[lang]/compatibility/[slug]`
   * **功能**：支持十二生肖两两配对（144 组全覆盖），计算综合分数、恋爱婚姻指数、友情信任度与事业合作指数，解析天作六合、三合吉局与六冲磨砺。
3. **即时决策：易经三铜钱神谕 (I Ching 3-Coin Oracle)**
   * **路由**：`/[lang]/calculator/iching`
   * **功能**：真实模拟古铜钱抛掷动画（乾隆通宝古币），推演六爻初爻至上爻、本卦、动爻与变卦，融入荣格心理学共时性理论，为当下困惑提供哲学行动指南。

---

## 🛠️ 技术栈与架构 (Tech Stack)

* **核心框架**：Next.js 16 (App Router, React 19, TypeScript)
* **样式与设计系统**：Tailwind CSS v4 + 东方新极简/空灵禅意暗夜风格（深邃墨黑 `#080B11` + 流光金 `#D4AF37`）
* **历法与天文学核心**：`lunar-typescript`（严格按 24 节气换柱、真太阳时支持、六十甲子干支与纳音计算）
* **SEO 与结构化数据**：
  * 自动动态生成 `sitemap.xml`（300+ 静态/动态预渲染 URL）
  * 搜索引擎爬虫规范 `robots.txt`
  * 符合 Schema.org 标准的 `Article` / `Organization` / `BreadcrumbList` JSON-LD 结构化标签
  * Google `hreflang` 多语言互联

---

## 💻 本地运行与开发 (Local Development)

```bash
# 1. 安装依赖
npm install

# 2. 启动本地开发服务 (默认端口 3000)
npm run dev

# 3. 运行 SEO 预检脚本
npm run seo:verify

# 4. 生产环境构建测试
npm run build

# 5. 预览生产环境
npm run start
```

访问 `http://localhost:3000` 将自动重定向至 `http://localhost:3000/en`。点击导航右上角一键切换为中文。

---

## 🌐 Vercel 一键上线部署 (Deployment)

本项目完全针对 Vercel 全球 Edge 网络进行了 SSG / ISR 优化：

1. 将本项目推送到你的 GitHub 仓库：
   ```bash
   git init
   git add .
   git commit -m "feat: initial release of QiCosmos platform"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
2. 登录 [Vercel](https://vercel.com/)，点击 **"Add New Project"** 并导入该 GitHub 仓库。
3. Framework Preset 选择 **Next.js**，所有构建命令默认（`npm run build`），点击 **Deploy**。
4. 几秒内即可全球极速上线，自动获得免费全球 CDN 与 HTTPS 证书。
5. 在 Vercel 后台绑定自定义域名（如 `qicosmos.com`），并将生成的 `https://yourdomain.com/sitemap.xml` 提交至 **Google Search Console** 与 **Bing Webmaster Tools**。

---

## 📈 SEO 与内容更新指南 (Content & SEO Growth)

1. **撰写新专栏文章**：
   * 在 `src/lib/i18n/dictionaries.ts` 中维护中英双语文章列表与元数据。
   * 在 `src/app/[lang]/knowledge/page.tsx` 中自动渲染最新专栏。
2. **扩展 Programmatic SEO 页面**：
   * 在 `src/lib/metaphysics/compatibility.ts` 中可继续扩充星座与八字的交叉配对（如 "Aries Metal Rat" 等交叉词）。
3. **监测收录情况**：
   * 运行 `npm run seo:verify` 确保每次发布前 300+ 路由均健康索引。
