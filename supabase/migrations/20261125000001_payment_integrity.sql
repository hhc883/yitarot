-- Apply before enabling the checkout endpoints. Existing provider columns/ledger refs are preserved.
alter table public.orders add column if not exists payment_provider text;
alter table public.orders add column if not exists currency text;
alter table public.orders add column if not exists provider_transaction_id text;
create unique index if not exists orders_provider_payment_unique
  on public.orders (payment_provider, provider_transaction_id)
  where provider_transaction_id is not null;
create index if not exists point_ledger_kind_reference_idx
  on public.point_ledger (kind, ref_id) where ref_id is not null;

-- A signed provider event has already been checked by the app. This transaction binds it
-- to the server-created order and serializes credit against spending and daily claims.
create or replace function public.settle_checkout_order(
  p_order_id uuid, p_provider text, p_currency text, p_minor integer, p_transaction text
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  o public.orders%rowtype;
  p_ref text;
  balance integer;
begin
  if p_order_id is null or p_provider is null or p_provider not in ('domestic', 'stripe')
     or p_minor is null or p_minor <= 0 or p_transaction is null
     or length(p_transaction) not between 1 and 120 then
    return jsonb_build_object('status', 'invalid_payment');
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_provider || ':' || p_transaction, 0));
  select * into o from public.orders where id = p_order_id for update;
  if not found then return jsonb_build_object('status', 'order_not_found'); end if;

  if o.amount * 100 <> p_minor or o.points not in (100, 500, 2000)
     or (o.provider_transaction_id is not null and o.provider_transaction_id <> p_transaction)
     or (p_provider = 'domestic' and (o.payment_provider is distinct from 'domestic' or o.currency is distinct from 'CNY' or p_currency is distinct from 'CNY'))
     or (p_provider = 'stripe' and (o.stripe_session_id is distinct from p_transaction or p_currency is distinct from 'USD'
         or coalesce(o.payment_provider, 'stripe') <> 'stripe' or coalesce(o.currency, 'USD') <> 'USD')) then
    return jsonb_build_object('status', 'invalid_payment');
  end if;
  if exists (select 1 from public.orders
             where payment_provider = p_provider and provider_transaction_id = p_transaction and id <> o.id) then
    return jsonb_build_object('status', 'invalid_payment');
  end if;
  if o.status not in ('pending', 'completed') then return jsonb_build_object('status', 'invalid_payment'); end if;

  p_ref := case when p_provider = 'domestic' then 'domestic:' || o.id::text else 'stripe:' || p_transaction end;
  perform 1 from public.profiles where id = o.user_id for update;
  if not found then return jsonb_build_object('status', 'profile_missing'); end if;
  select coalesce(sum(amount), 0) into balance from public.point_ledger where user_id = o.user_id;
  if exists(select 1 from public.point_ledger where user_id = o.user_id and kind = 'purchase' and ref_id = p_ref) then
    update public.orders set status = 'completed', payment_provider = p_provider, currency = p_currency,
      provider_transaction_id = p_transaction where id = o.id;
    return jsonb_build_object('status', 'already_credited', 'balance', balance, 'points', o.points);
  end if;
  insert into public.point_ledger (user_id, kind, amount, balance_after, ref_id)
    values (o.user_id, 'purchase', o.points, balance + o.points, p_ref);
  update public.orders set status = 'completed', payment_provider = p_provider, currency = p_currency,
    provider_transaction_id = p_transaction where id = o.id;
  return jsonb_build_object('status', 'ok', 'balance', balance + o.points, 'points', o.points);
end;
$$;

create or replace function public.redeem_payment_code(p_user_id uuid, p_points integer, p_ref text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  balance integer;
begin
  if p_user_id is null or p_points is null or p_points not in (100,500,2000)
     or p_ref is null or length(p_ref) > 112 or p_ref not like 'redeem:%' then
    return jsonb_build_object('status', 'invalid_args');
  end if;
  perform pg_advisory_xact_lock(hashtextextended(p_ref, 0));
  if exists (select 1 from public.point_ledger where kind = 'purchase' and ref_id = p_ref) then
    return jsonb_build_object('status', 'used');
  end if;
  perform 1 from public.profiles where id = p_user_id for update;
  if not found then return jsonb_build_object('status', 'profile_missing'); end if;
  select coalesce(sum(amount), 0) into balance from public.point_ledger where user_id = p_user_id;
  insert into public.point_ledger(user_id, kind, amount, balance_after, ref_id)
    values (p_user_id,'purchase',p_points,balance + p_points,p_ref);
  return jsonb_build_object('status','ok','balance',balance + p_points);
end;
$$;

create or replace function public.settle_payhip_credit(
  p_user_id uuid, p_transaction text, p_points integer, p_minor integer, p_refund boolean
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  o public.orders%rowtype;
  credited_user uuid;
  prior_points integer;
  balance integer;
  credit_ref text := 'payhip:' || p_transaction;
  refund_ref text := 'payhip-refund:' || p_transaction;
begin
  if p_transaction is null or length(p_transaction) not between 1 and 96
     or p_points is null or p_points not in (100,500,2000) or p_minor is null or p_minor <= 0 or p_refund is null then
    return jsonb_build_object('status','invalid_payment');
  end if;
  perform pg_advisory_xact_lock(hashtextextended(credit_ref, 0));
  select * into o from public.orders where payhip_transaction_id = p_transaction for update;

  -- Preserve historical ledger entries even if the old callback failed to write an order.
  if not found then
    select user_id, amount into credited_user, prior_points from public.point_ledger
      where kind = 'purchase' and ref_id = credit_ref order by id limit 1;
    if credited_user is not null and prior_points <> p_points then
      return jsonb_build_object('status','invalid_payment');
    end if;
    if p_refund and credited_user is null then return jsonb_build_object('status','order_not_found'); end if;
    credited_user := coalesce(credited_user, p_user_id);
    if credited_user is null then return jsonb_build_object('status','profile_missing'); end if;
    insert into public.orders(user_id, amount, points, status, payhip_transaction_id, payment_provider, currency)
      values (credited_user, p_minor::numeric / 100, p_points, 'paid', p_transaction, 'payhip', 'USD')
      returning * into o;
  end if;
  if o.amount * 100 <> p_minor or o.points <> p_points then
    return jsonb_build_object('status','invalid_payment');
  end if;
  if o.status = 'refunded' then return jsonb_build_object('status','already_credited'); end if;
  perform 1 from public.profiles where id = o.user_id for update;
  if not found then return jsonb_build_object('status','profile_missing'); end if;
  select coalesce(sum(amount),0) into balance from public.point_ledger where user_id = o.user_id;
  if p_refund then
    if not exists (select 1 from public.point_ledger where user_id = o.user_id and kind = 'purchase' and ref_id = credit_ref) then
      return jsonb_build_object('status','order_not_found');
    end if;
    if not exists (select 1 from public.point_ledger where user_id = o.user_id and kind = 'refund' and ref_id = refund_ref) then
      insert into public.point_ledger(user_id,kind,amount,balance_after,ref_id)
        values (o.user_id,'refund',-p_points,balance-p_points,refund_ref);
      balance := balance - p_points;
    end if;
    update public.orders set status = 'refunded', payment_provider = 'payhip', currency = 'USD' where id = o.id;
  else
    if exists (select 1 from public.point_ledger where user_id = o.user_id and kind = 'purchase' and ref_id = credit_ref) then
      return jsonb_build_object('status','already_credited','balance',balance);
    end if;
    insert into public.point_ledger(user_id,kind,amount,balance_after,ref_id)
      values (o.user_id,'purchase',p_points,balance+p_points,credit_ref);
    balance := balance + p_points;
  end if;
  return jsonb_build_object('status','ok','balance',balance);
end;
$$;

revoke execute on function public.settle_checkout_order(uuid,text,text,integer,text),
  public.redeem_payment_code(uuid,integer,text), public.settle_payhip_credit(uuid,text,integer,integer,boolean)
  from public, anon, authenticated;
grant execute on function public.settle_checkout_order(uuid,text,text,integer,text),
  public.redeem_payment_code(uuid,integer,text), public.settle_payhip_credit(uuid,text,integer,integer,boolean)
  to service_role;


-- Profile fields can be edited by the account holder. Match Payhip purchases only
-- against a confirmed, unique address in the auth directory.
create or replace function public.find_verified_payment_user(p_email text)
returns uuid language sql stable security definer set search_path = public as $$
  select (array_agg(u.id))[1] from auth.users u
  where u.email_confirmed_at is not null and lower(u.email) = lower(trim(p_email))
  having count(*) = 1;
$$;
revoke execute on function public.find_verified_payment_user(text) from public, anon, authenticated;
grant execute on function public.find_verified_payment_user(text) to service_role;
