-- Create warrior_configurations table
create table if not exists public.warrior_configurations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  race text not null check (race in ('human', 'goblin')),
  helmet_id text not null,
  armor_id text not null,
  weapon_id text not null,
  facial_hair_id text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.warrior_configurations enable row level security;

-- RLS Policies
create policy "configurations_select_own" 
  on public.warrior_configurations 
  for select 
  using (auth.uid() = user_id);

create policy "configurations_insert_own" 
  on public.warrior_configurations 
  for insert 
  with check (auth.uid() = user_id);

create policy "configurations_update_own" 
  on public.warrior_configurations 
  for update 
  using (auth.uid() = user_id);

create policy "configurations_delete_own" 
  on public.warrior_configurations 
  for delete 
  using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists idx_warrior_configurations_user_id 
  on public.warrior_configurations(user_id);

-- Create function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Create trigger to auto-update updated_at
drop trigger if exists update_warrior_configurations_updated_at on public.warrior_configurations;
create trigger update_warrior_configurations_updated_at
  before update on public.warrior_configurations
  for each row
  execute function public.update_updated_at_column();
