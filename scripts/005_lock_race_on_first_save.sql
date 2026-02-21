-- Migration: Lock users to a single race after first configuration save
-- This changes the warrior_configurations table to support only ONE configuration per user

-- Drop the old unique index on (user_id, race)
drop index if exists idx_warrior_configurations_user_race;

-- Add unique constraint on user_id only (one config per user)
create unique index if not exists idx_warrior_configurations_user_id_unique 
  on public.warrior_configurations(user_id);

-- Add RLS policy to prevent race changes after first save
create or replace function public.check_race_locked()
returns trigger
language plpgsql
security definer
as $$
declare
  existing_race text;
begin
  -- Check if user already has a configuration
  select race into existing_race
  from public.warrior_configurations
  where user_id = new.user_id;
  
  -- If configuration exists and race is different, reject the change
  if existing_race is not null and existing_race != new.race then
    raise exception 'Cannot change race after initial configuration is saved. You are locked to % warrior.', existing_race;
  end if;
  
  return new;
end;
$$;

-- Create trigger to enforce race locking
drop trigger if exists enforce_race_lock on public.warrior_configurations;
create trigger enforce_race_lock
  before insert or update on public.warrior_configurations
  for each row
  execute function public.check_race_locked();

-- Update RLS policies to enforce single configuration per user
drop policy if exists "configurations_insert_own" on public.warrior_configurations;
drop policy if exists "configurations_update_own" on public.warrior_configurations;

create policy "configurations_insert_own" 
  on public.warrior_configurations 
  for insert 
  with check (
    auth.uid() = user_id 
    and not exists (
      select 1 from public.warrior_configurations 
      where user_id = auth.uid()
    )
  );

create policy "configurations_update_own" 
  on public.warrior_configurations 
  for update 
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id and race = (
    select race from public.warrior_configurations 
    where user_id = auth.uid()
  ));
