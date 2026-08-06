-- Automatic birthday and work-anniversary celebrations.
alter table public.profiles add column if not exists birth_date date;
alter table public.profiles add column if not exists hire_date date;

update public.profiles
set hire_date = created_at::date
where hire_date is null;

create or replace function public.get_company_celebrations(p_days_ahead integer default 14)
returns table (
  id uuid,
  full_name text,
  avatar_url text,
  event_type text,
  event_date date,
  years integer,
  days_until integer
)
language sql
stable
security definer
set search_path = public
as $$
  with days as (
    select generate_series(0, least(greatest(p_days_ahead, 0), 31))::integer as offset_days
  ), events as (
    select p.id, p.full_name, p.avatar_url, 'birthday'::text as event_type,
      (current_date + d.offset_days)::date as event_date, null::integer as years, d.offset_days as days_until
    from public.profiles p cross join days d
    where p.is_active and p.birth_date is not null
      and to_char(p.birth_date, 'MM-DD') = to_char(current_date + d.offset_days, 'MM-DD')
    union all
    select p.id, p.full_name, p.avatar_url, 'anniversary'::text as event_type,
      (current_date + d.offset_days)::date as event_date,
      extract(year from age(current_date + d.offset_days, p.hire_date))::integer as years,
      d.offset_days as days_until
    from public.profiles p cross join days d
    where p.is_active and p.hire_date is not null
      and current_date + d.offset_days >= p.hire_date + interval '1 year'
      and to_char(p.hire_date, 'MM-DD') = to_char(current_date + d.offset_days, 'MM-DD')
  )
  select * from events order by days_until, event_type, full_name;
$$;

revoke all on function public.get_company_celebrations(integer) from public;
grant execute on function public.get_company_celebrations(integer) to authenticated;
