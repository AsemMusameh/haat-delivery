alter table public.profiles add column if not exists phone text;
grant update (phone) on public.profiles to authenticated;
