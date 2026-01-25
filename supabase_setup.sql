-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  first_name text,
  last_name text,
  phone text,
  avatar_url text,
  streak_count int default 0,
  last_active_date timestamptz,
  credits int default 0,
  is_admin boolean default false,
  last_free_draw_at timestamptz,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

drop policy if exists "Users can insert their own profile." on public.profiles;
create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile." on public.profiles;
create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. TRANSACTIONS TABLE
create table if not exists public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  amount decimal(10,2) not null,
  credits_added int not null,
  status text default 'pending', -- pending, approved, rejected
  slip_url text,
  created_at timestamptz default now()
);

alter table public.transactions enable row level security;

-- Policies
drop policy if exists "Users can view own transactions." on public.transactions;
create policy "Users can view own transactions." on public.transactions
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert pending transactions." on public.transactions;
create policy "Users can insert pending transactions." on public.transactions
  for insert with check (auth.uid() = user_id);

drop policy if exists "Admins can view all transactions" on public.transactions;
create policy "Admins can view all transactions"
  on public.transactions
  for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

drop policy if exists "Admins can update transactions" on public.transactions;
create policy "Admins can update transactions"
  on public.transactions
  for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

-- 3. STORAGE (SLIPS & AVATARS) - Policies
insert into storage.buckets (id, name, public) 
values ('slips', 'slips', true), ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "Authenticated users can upload slips" on storage.objects;
create policy "Authenticated users can upload slips"
on storage.objects for insert
with check (
  bucket_id = 'slips' and 
  auth.role() = 'authenticated'
);

drop policy if exists "Users can view slips" on storage.objects;
create policy "Users can view slips"
on storage.objects for select
using ( bucket_id = 'slips' );

-- Avatars Policies
drop policy if exists "Authenticated users can upload avatars" on storage.objects;
create policy "Authenticated users can upload avatars"
on storage.objects for insert
with check (
  bucket_id = 'avatars' and 
  auth.role() = 'authenticated'
);

drop policy if exists "Users can update own avatar" on storage.objects;
create policy "Users can update own avatar"
on storage.objects for update
using (
  bucket_id = 'avatars' and
  auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Public can view avatars" on storage.objects;
create policy "Public can view avatars"
on storage.objects for select
using ( bucket_id = 'avatars' );

-- 4. STORED PROCEDURES (RPCs)

-- Submit Top Up (Called by User)
create or replace function submit_topup(amount_paid decimal, credit_amount int, slip_path text)
returns uuid as $$
declare
  new_id uuid;
begin
  insert into public.transactions (user_id, amount, credits_added, status, slip_url)
  values (auth.uid(), amount_paid, credit_amount, 'pending', slip_path)
  returning id into new_id;
  return new_id;
end;
$$ language plpgsql security definer;

-- Approve Transaction (Called by Admin)
create or replace function approve_transaction(transaction_id uuid)
returns boolean as $$
declare
  trx public.transactions%rowtype;
  requesting_user_is_admin boolean;
begin
  -- Check if caller is admin
  select is_admin into requesting_user_is_admin from public.profiles where id = auth.uid();
  
  if requesting_user_is_admin is not true then
    return false; -- Not authorized
  end if;

  -- Get transaction
  select * into trx from public.transactions where id = transaction_id;
  
  if trx.status = 'approved' then
    return true; -- Already done
  end if;

  -- Update transaction status
  update public.transactions 
  set status = 'approved' 
  where id = transaction_id;

  -- Add credits to user
  update public.profiles 
  set credits = credits + trx.credits_added
  where id = trx.user_id;

  return true;
end;
$$ language plpgsql security definer;

-- Reject Transaction (Called by Admin)
create or replace function reject_transaction(transaction_id uuid)
returns boolean as $$
declare
  requesting_user_is_admin boolean;
begin
  -- Check if caller is admin
  select is_admin into requesting_user_is_admin from public.profiles where id = auth.uid();
  
  if requesting_user_is_admin is not true then
    return false; -- Not authorized
  end if;

  -- Update transaction status
  update public.transactions 
  set status = 'rejected' 
  where id = transaction_id;

  return true;
end;
$$ language plpgsql security definer;

-- Robust Admin Transaction Fetcher
create or replace function get_admin_view_transactions()
returns table (
  id uuid,
  amount decimal,
  credits_added int,
  slip_url text,
  created_at timestamptz,
  status text,
  email text
) as $$
begin
  if not exists (
      select 1 from public.profiles p
      where p.id = auth.uid() 
      and p.is_admin = true
  ) then
     return; 
  end if;

  return query
  select 
    t.id, 
    t.amount, 
    t.credits_added, 
    t.slip_url, 
    t.created_at, 
    t.status,
    coalesce(p.email, 'Unknown User') as email
  from public.transactions t
  left join public.profiles p on t.user_id = p.id
  where t.status = 'pending'
  order by t.created_at desc;
end;
$$ language plpgsql security definer;

-- Deduct Credit (Variable Cost + Daily Limit)
create or replace function deduct_credit(cost int, check_daily_limit boolean)
returns json as $$
declare
  current_credits int;
  last_draw timestamptz;
  now_time timestamptz := now();
begin
  -- Get current state
  select credits, last_free_draw_at
  into current_credits, last_draw
  from public.profiles
  where id = auth.uid();

  -- 1. Check Daily Limit (if requested)
  if check_daily_limit then
    if last_draw is not null and
       date(last_draw at time zone 'Asia/Bangkok') = date(now_time at time zone 'Asia/Bangkok') then
       -- Already played today
       return json_build_object('success', false, 'message', 'Daily reading allowed once per day');
    end if;
  end if;

  -- 2. Check Balance
  if current_credits < cost then
     return json_build_object('success', false, 'message', 'Insufficient credits');
  end if;

  -- 3. Deduct
  update public.profiles
  set
    credits = credits - cost,
    -- Update timestamp only if it's the daily reading
    last_free_draw_at = case when check_daily_limit then now_time else last_free_draw_at end
  where id = auth.uid();

  return json_build_object('success', true, 'new_balance', current_credits - cost);
end;
$$ language plpgsql security definer;

-- 1. Function to GET status (Read-only)
CREATE OR REPLACE FUNCTION get_daily_checkin_status()
RETURNS json AS $$
DECLARE
  u_id uuid := auth.uid();
  p_streak int;
  p_last_active timestamptz;
  bangkok_time timestamptz := now() AT TIME ZONE 'Asia/Bangkok';
  last_active_bangkok date;
  today_bangkok date := date(bangkok_time);
  
  -- Variables for logic
  current_cycle_streak int;
  checked_in_today boolean := false;
  is_streak_broken boolean := false;
BEGIN
  SELECT streak_count, last_active_date INTO p_streak, p_last_active
  FROM public.profiles WHERE id = u_id;
  
  p_streak := COALESCE(p_streak, 0);
  
  IF p_last_active IS NULL THEN
    is_streak_broken := true;
    current_cycle_streak := 0;
  ELSE
    last_active_bangkok := date(p_last_active AT TIME ZONE 'Asia/Bangkok');
    
    IF last_active_bangkok = today_bangkok THEN
      checked_in_today := true;
      current_cycle_streak := p_streak;
    ELSIF last_active_bangkok = (today_bangkok - interval '1 day') THEN
      checked_in_today := false;
      current_cycle_streak := p_streak;
    ELSE
      checked_in_today := false;
      is_streak_broken := true;
      current_cycle_streak := 0;
    END IF;
  END IF;

  RETURN json_build_object(
    'streak', current_cycle_streak,
    'checked_in_today', checked_in_today,
    'is_streak_broken', is_streak_broken
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Function to CLAIM (Write)
CREATE OR REPLACE FUNCTION claim_daily_checkin()
RETURNS json AS $$
DECLARE
  u_id uuid := auth.uid();
  p_streak int;
  p_last_active timestamptz;
  
  now_time timestamptz := now();
  bangkok_time timestamptz := now() AT TIME ZONE 'Asia/Bangkok';
  last_active_bangkok date;
  today_bangkok date := date(bangkok_time);
  
  new_streak int;
  reward_amount int := 0;
BEGIN
  -- Re-check logic inside transaction to be safe
  SELECT streak_count, last_active_date INTO p_streak, p_last_active
  FROM public.profiles WHERE id = u_id FOR UPDATE; -- Add locking
  
  p_streak := COALESCE(p_streak, 0);
  
  IF p_last_active IS NOT NULL THEN
     last_active_bangkok := date(p_last_active AT TIME ZONE 'Asia/Bangkok');
     IF last_active_bangkok = today_bangkok THEN
        -- Already checked in
        RETURN json_build_object('success', false, 'message', 'Already checked in today');
     END IF;
     
     IF last_active_bangkok = (today_bangkok - interval '1 day') THEN
        new_streak := p_streak + 1;
     ELSE
        new_streak := 1;
     END IF;
  ELSE
     new_streak := 1;
  END IF;

  -- 7-Day Cycle Logic
  IF (new_streak % 7) = 0 THEN
     reward_amount := 20;
  END IF;

  UPDATE public.profiles
  SET streak_count = new_streak, last_active_date = now(), credits = credits + reward_amount
  WHERE id = u_id;

  RETURN json_build_object(
    'success', true,
    'streak', new_streak,
    'reward', reward_amount
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get My Credits
create or replace function get_my_credits()
returns int as $$
declare
  credit_count int;
begin
  select credits into credit_count from public.profiles where id = auth.uid();
  return coalesce(credit_count, 0);
end;
$$ language plpgsql security definer;

-- 5. READING HISTORY TABLE
create table if not exists public.reading_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  topic text not null,
  reading_type text not null,
  cards jsonb not null, -- Stores array of card objects or IDs
  created_at timestamptz default now()
);

alter table public.reading_history enable row level security;

-- Policies for Reading History
drop policy if exists "Users can view own reading history." on public.reading_history;
create policy "Users can view own reading history." on public.reading_history
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own reading history." on public.reading_history;
create policy "Users can insert own reading history." on public.reading_history
  for insert with check (auth.uid() = user_id);
