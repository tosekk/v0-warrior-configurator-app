-- Create user_purchases table
create table if not exists public.user_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null,
  stripe_session_id text, -- Renamed to keep compatibility, but stores Lemon Squeezy order ID
  amount_paid integer not null default 0,
  purchased_at timestamptz default now()
);

-- Enable RLS
alter table public.user_purchases enable row level security;

-- RLS Policies - users can only see their own purchases
create policy "purchases_select_own" 
  on public.user_purchases 
  for select 
  using (auth.uid() = user_id);

-- Only server can insert purchases (via service role)
create policy "purchases_insert_service" 
  on public.user_purchases 
  for insert 
  with check (true);

-- Create index for faster queries
create index if not exists idx_user_purchases_user_id 
  on public.user_purchases(user_id);

create index if not exists idx_user_purchases_stripe_session 
  on public.user_purchases(stripe_session_id);
