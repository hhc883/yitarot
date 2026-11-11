# QiCosmos Auth + Points Phase 1 部署清单

## 1. 执行数据库迁移

在 Supabase Dashboard → SQL Editor 中，完整执行
`supabase/migrations/20261111000001_auth_points_phase1.sql`。

它会创建 `profiles` / `point_ledger` / `daily_claims` / `orders` / `readings`
五张表、RLS 策略、注册奖励触发器，以及两个只授权给 `authenticated`
的 SECURITY DEFINER 函数（每日领取 / 测算扣分）。

## 2. 开启 Google 登录

Dashboard → Authentication → Providers → Google → Enable：

- 需要先在 Google Cloud Console 创建 OAuth Client，拿到 Client ID / Secret 填入；
- 未开启时登录页的 Google 按钮会报错（当前项目尚未开启，邮箱验证码已可用）。

## 3. 配置回调地址

Dashboard → Authentication → URL Configuration：

- **Site URL**：本地 `http://localhost:3000`，线上换成 Vercel 域名
- **Redirect URLs**（至少包含）：
  - `http://localhost:3000/api/auth/callback`
  - `https://<你的-vercel-域名>/api/auth/callback`

## 4. 环境变量

本地 `.env.local`（不入库）与 Vercel → Settings → Environment Variables：

```
NEXT_PUBLIC_SUPABASE_URL=https://uzypprkaomjvmilftuww.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable key>
SUPABASE_SERVICE_ROLE_KEY=<service role key，只放服务端>
```

## 5. 业务规则速查

- 余额不落库：余额 = `point_ledger.amount` 求和
- 新注册自动 +10（数据库触发器，含存量用户补发）
- 每日领取 +10，北京时间 00:00 重置，一天一次
- 每次 AI 测算 -10：客户端先调 `/api/readings/consume`（幂等 key 防重复扣），
  测算 API 服务端再校验一次扣分记录，余额不足返回 402 且不生成测算
- 购买积分（Stripe）Phase 2 接入，定价页按钮当前为占位
