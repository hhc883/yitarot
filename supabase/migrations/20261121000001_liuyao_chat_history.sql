-- ============================================================
-- YiTatro 六爻问答会话与 7 天自动保留策略
-- 在 Supabase SQL Editor 中执行（或通过 supabase db push）
-- 功能要点：
--   * 普通用户对话记录默认 7 天过期（expires_at = now() + 7 days）
--   * 会员用户永久保存（expires_at 为 NULL）
--   * 级联删除：会话过期删除时，下属所有追问消息自动物理删除
-- ============================================================

-- ---------- 1. 六爻会话主表 ----------
create table if not exists public.liuyao_sessions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users (id) on delete cascade,
  question         text not null,
  reading_snapshot jsonb not null,
  is_vip           boolean not null default false,
  expires_at       timestamptz default (now() + interval '7 days'),
  created_at       timestamptz not null default now()
);

create index if not exists liuyao_sessions_user_idx
  on public.liuyao_sessions (user_id, created_at desc);

create index if not exists liuyao_sessions_expires_idx
  on public.liuyao_sessions (expires_at)
  where expires_at is not null;

alter table public.liuyao_sessions enable row level security;

create policy "liuyao_sessions: select own"
  on public.liuyao_sessions for select
  to authenticated
  using (auth.uid() = user_id and (expires_at is null or expires_at > now()));

create policy "liuyao_sessions: insert own"
  on public.liuyao_sessions for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "liuyao_sessions: delete own"
  on public.liuyao_sessions for delete
  to authenticated
  using (auth.uid() = user_id);


-- ---------- 2. 会话追问消息明细表 ----------
create table if not exists public.liuyao_messages (
  id           bigint generated always as identity primary key,
  session_id   uuid not null references public.liuyao_sessions (id) on delete cascade,
  user_id      uuid not null references auth.users (id) on delete cascade,
  role         text not null check (role in ('user', 'assistant')),
  content      text not null,
  points_spent integer not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists liuyao_messages_session_idx
  on public.liuyao_messages (session_id, created_at asc);

alter table public.liuyao_messages enable row level security;

create policy "liuyao_messages: select own"
  on public.liuyao_messages for select
  to authenticated
  using (auth.uid() = user_id);

create policy "liuyao_messages: insert own"
  on public.liuyao_messages for insert
  to authenticated
  with check (auth.uid() = user_id);


-- ---------- 3. 过期会话自动清理存储过程 ----------
create or replace function public.cleanup_expired_liuyao_sessions()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count integer;
begin
  delete from public.liuyao_sessions
  where expires_at is not null
    and expires_at < now();

  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;
