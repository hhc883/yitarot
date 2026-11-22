-- Payhip 购买加分 / 退款扣分：SECURITY DEFINER 函数（webhook 用 service_role 调用）。
-- 遵循现有设计：账本只经 SECURITY DEFINER 函数写入；幂等键 (user_id, kind, ref_id)。

create or replace function public.credit_purchase_points(
  p_user_id uuid,
  p_kind text,
  p_amount integer,
  p_ref text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance integer;
begin
  if p_user_id is null then
    return jsonb_build_object('status', 'invalid_args');
  end if;
  if p_kind not in ('purchase', 'refund') then
    return jsonb_build_object('status', 'invalid_args');
  end if;
  if (p_kind = 'purchase' and p_amount <= 0)
     or (p_kind = 'refund' and p_amount >= 0)
     or abs(p_amount) > 100000 then
    return jsonb_build_object('status', 'invalid_args');
  end if;
  if p_ref is null or length(trim(p_ref)) = 0 or length(p_ref) > 128 then
    return jsonb_build_object('status', 'invalid_ref');
  end if;

  -- 幂等：同一 (user, kind, ref) 已记过 → 直接返回当前余额
  if exists (
    select 1 from public.point_ledger
    where user_id = p_user_id and kind = p_kind and ref_id = p_ref
  ) then
    select coalesce(sum(amount), 0) into v_balance
    from public.point_ledger where user_id = p_user_id;
    return jsonb_build_object('status', 'already_credited', 'balance', v_balance);
  end if;

  -- 锁住用户档案行，串行化同一用户的并发加分 / 扣分
  perform 1 from public.profiles where id = p_user_id for update;

  select coalesce(sum(amount), 0) into v_balance
  from public.point_ledger where user_id = p_user_id;

  insert into public.point_ledger (user_id, kind, amount, balance_after, ref_id)
  values (p_user_id, p_kind, p_amount, v_balance + p_amount, p_ref);

  return jsonb_build_object('status', 'ok', 'balance', v_balance + p_amount);
exception
  when unique_violation then
    select coalesce(sum(amount), 0) into v_balance
    from public.point_ledger where user_id = p_user_id;
    return jsonb_build_object('status', 'already_credited', 'balance', v_balance);
end;
$$;

-- 只允许 service_role 调用（不要授给 anon / authenticated）
revoke execute on function public.credit_purchase_points(uuid, text, integer, text)
  from public, anon, authenticated;
grant execute on function public.credit_purchase_points(uuid, text, integer, text)
  to service_role;

-- orders 表加 Payhip 交易号（原表是 Stripe 结构：stripe_session_id）
alter table public.orders
  add column if not exists payhip_transaction_id text;
create unique index if not exists orders_payhip_tx_idx
  on public.orders (payhip_transaction_id)
  where payhip_transaction_id is not null;
