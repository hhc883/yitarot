-- ============================================================
-- QiCosmos Auth + Points Phase 1
-- 在 Supabase SQL Editor 中执行（或 supabase db push）
-- 设计要点：
--   * 余额不落字段，余额 = point_ledger.amount 求和
--   * 所有积分写入只经 SECURITY DEFINER 函数（绕过 RLS 但受控），客户端无法伪造加/扣分
--   * 每日领取以「北京时间日期」为唯一键，天然只领一次
--   * 扣分以 (user_id, kind, ref_id) 唯一索引保证幂等，防重复扣
-- ============================================================

-- ---------- profiles ----------
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  email        text,
  display_name text,
  avatar_url   text,
  created_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: select own"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "profiles: update own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ---------- point_ledger ----------
create table if not exists public.point_ledger (
  id            bigint generated always as identity primary key,
  user_id       uuid not null references auth.users (id) on delete cascade,
  kind          text not null check (
    kind in ('signup_bonus', 'daily_claim', 'purchase', 'reading_spend', 'refund', 'expire')
  ),
  amount        integer not null check (amount <> 0),
  balance_after integer not null,
  ref_id        text,
  created_at    timestamptz not null default now()
);

create index if not exists point_ledger_user_time_idx
  on public.point_ledger (user_id, created_at desc);

-- 幂等键：同一用户同一类型同一 ref 只能记一笔
create unique index if not exists point_ledger_unique_ref_idx
  on public.point_ledger (user_id, kind, ref_id)
  where ref_id is not null;

alter table public.point_ledger enable row level security;

create policy "ledger: select own"
  on public.point_ledger for select
  to authenticated
  using (auth.uid() = user_id);
-- 故意不给 insert/update 策略：账本只能由下面的函数写入

-- ---------- daily_claims ----------
create table if not exists public.daily_claims (
  user_id    uuid not null references auth.users (id) on delete cascade,
  claim_date date not null,
  claimed_at timestamptz not null default now(),
  primary key (user_id, claim_date)
);

alter table public.daily_claims enable row level security;

create policy "daily_claims: select own"
  on public.daily_claims for select
  to authenticated
  using (auth.uid() = user_id);

-- ---------- orders（Phase 2 Stripe 接入） ----------
create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users (id) on delete cascade,
  stripe_session_id text,
  amount           numeric not null,
  points           integer not null,
  status           text not null default 'pending',
  created_at       timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "orders: select own"
  on public.orders for select
  to authenticated
  using (auth.uid() = user_id);

-- ---------- readings（测算历史） ----------
create table if not exists public.readings (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  type         text not null,
  points_spent integer not null default 10,
  created_at   timestamptz not null default now()
);

create index if not exists readings_user_time_idx
  on public.readings (user_id, created_at desc);

alter table public.readings enable row level security;

create policy "readings: select own"
  on public.readings for select
  to authenticated
  using (auth.uid() = user_id);

create policy "readings: insert own"
  on public.readings for insert
  to authenticated
  with check (auth.uid() = user_id);

-- ============================================================
-- 函数与触发器
-- ============================================================

-- 新用户注册：建档案 + 发放 10 积分注册奖励
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    ),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture')
  )
  on conflict (id) do nothing;

  insert into public.point_ledger (user_id, kind, amount, balance_after, ref_id)
  values (new.id, 'signup_bonus', 10, 10, 'signup:' || new.id::text);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 存量用户补发注册奖励（仅对没有 signup_bonus 的用户执行一次）
insert into public.point_ledger (user_id, kind, amount, balance_after, ref_id)
select u.id, 'signup_bonus', 10, 10, 'signup:' || u.id::text
from auth.users u
where not exists (
  select 1 from public.point_ledger l
  where l.user_id = u.id and l.kind = 'signup_bonus'
)
and not exists (select 1 from public.point_ledger l2 where l2.user_id = u.id);

-- 存量用户补建档案
insert into public.profiles (id, email, display_name)
select u.id, u.email, split_part(u.email, '@', 1)
from auth.users u
on conflict (id) do nothing;

-- 每日领取（北京时间 00:00 重置）
create or replace function public.claim_daily_points()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user    uuid := auth.uid();
  v_date    date;
  v_balance integer;
begin
  if v_user is null then
    return jsonb_build_object('status', 'unauthenticated');
  end if;

  v_date := (now() at time zone 'Asia/Shanghai')::date;

  -- 自愈：老用户可能没有 profiles 行
  insert into public.profiles (id, email)
  values (v_user, auth.jwt() ->> 'email')
  on conflict (id) do nothing;

  -- 锁定用户档案行，串行化同一用户的并发领取 / 消费
  perform 1 from public.profiles where id = v_user for update;

  insert into public.daily_claims (user_id, claim_date)
  values (v_user, v_date)
  on conflict (user_id, claim_date) do nothing;

  if not found then
    select coalesce(sum(amount), 0) into v_balance
    from public.point_ledger where user_id = v_user;

    return jsonb_build_object('status', 'already_claimed', 'balance', v_balance, 'date', v_date);
  end if;

  select coalesce(sum(amount), 0) into v_balance
  from public.point_ledger where user_id = v_user;

  insert into public.point_ledger (user_id, kind, amount, balance_after, ref_id)
  values (v_user, 'daily_claim', 10, v_balance + 10, 'daily:' || v_date::text);

  return jsonb_build_object('status', 'ok', 'balance', v_balance + 10, 'date', v_date);
end;
$$;

-- 测算扣分（幂等：同 ref 重复调用不重复扣）
create or replace function public.spend_reading_points(p_amount integer, p_ref text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user    uuid := auth.uid();
  v_balance integer;
begin
  if v_user is null then
    return jsonb_build_object('status', 'unauthenticated');
  end if;

  if p_amount is null or p_amount <= 0 or p_amount > 1000 then
    return jsonb_build_object('status', 'invalid_amount');
  end if;

  if p_ref is null or length(trim(p_ref)) = 0 or length(p_ref) > 128 then
    return jsonb_build_object('status', 'invalid_ref');
  end if;

  -- 幂等：这笔 ref 已扣过 → 视为成功，返回当前余额
  if exists (
    select 1 from public.point_ledger
    where user_id = v_user and kind = 'reading_spend' and ref_id = p_ref
  ) then
    select coalesce(sum(amount), 0) into v_balance
    from public.point_ledger where user_id = v_user;

    return jsonb_build_object('status', 'already_spent', 'balance', v_balance);
  end if;

  insert into public.profiles (id, email)
  values (v_user, auth.jwt() ->> 'email')
  on conflict (id) do nothing;

  perform 1 from public.profiles where id = v_user for update;

  -- 拿到锁后再查一次，双保险
  if exists (
    select 1 from public.point_ledger
    where user_id = v_user and kind = 'reading_spend' and ref_id = p_ref
  ) then
    select coalesce(sum(amount), 0) into v_balance
    from public.point_ledger where user_id = v_user;

    return jsonb_build_object('status', 'already_spent', 'balance', v_balance);
  end if;

  select coalesce(sum(amount), 0) into v_balance
  from public.point_ledger where user_id = v_user;

  if v_balance < p_amount then
    return jsonb_build_object('status', 'insufficient', 'balance', v_balance, 'need', p_amount);
  end if;

  insert into public.point_ledger (user_id, kind, amount, balance_after, ref_id)
  values (v_user, 'reading_spend', -p_amount, v_balance - p_amount, p_ref);

  return jsonb_build_object('status', 'ok', 'balance', v_balance - p_amount);
end;
$$;

-- ---------- 执行权限收紧 ----------
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.claim_daily_points() from public, anon;
revoke execute on function public.spend_reading_points(integer, text) from public, anon;

grant execute on function public.claim_daily_points() to authenticated;
grant execute on function public.spend_reading_points(integer, text) to authenticated;
