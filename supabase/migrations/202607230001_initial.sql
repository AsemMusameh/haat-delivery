-- منصة تعميمات الشركة - schema + RLS
create extension if not exists pgcrypto;
create type public.app_role as enum ('employee','supervisor','manager','admin');
create type public.announcement_priority as enum ('normal','important','urgent');
create type public.announcement_status as enum ('draft','scheduled','published','archived');
create type public.target_type as enum ('all','department','user');

create table public.departments (
  id uuid primary key default gen_random_uuid(), name text not null unique,
  description text, color text default '#176b5b', is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  employee_id text not null unique, full_name text not null, email text not null unique,
  avatar_url text, department_id uuid references public.departments(id) on delete set null,
  role public.app_role not null default 'employee', is_active boolean not null default true,
  notification_enabled boolean not null default true, last_sign_in_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.announcements (
  id uuid primary key default gen_random_uuid(), title text not null check(char_length(title)<=140), body text not null,
  author_id uuid not null references public.profiles(id), priority public.announcement_priority not null default 'normal',
  status public.announcement_status not null default 'draft', is_pinned boolean not null default false,
  requires_acknowledgement boolean not null default true, published_at timestamptz, scheduled_at timestamptz,
  expires_at timestamptz, archived_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.announcement_targets (
  id uuid primary key default gen_random_uuid(), announcement_id uuid not null references public.announcements(id) on delete cascade,
  target_type public.target_type not null, department_id uuid references public.departments(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint valid_target check ((target_type='all' and department_id is null and user_id is null) or (target_type='department' and department_id is not null and user_id is null) or (target_type='user' and user_id is not null and department_id is null))
);
create table public.announcement_reads (
  announcement_id uuid not null references public.announcements(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  read_at timestamptz not null default now(), acknowledged boolean not null default true,
  primary key (announcement_id,user_id)
);
create table public.announcement_bookmarks (
  announcement_id uuid not null references public.announcements(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(), primary key(announcement_id,user_id)
);
create table public.attachments (
  id uuid primary key default gen_random_uuid(), announcement_id uuid not null references public.announcements(id) on delete cascade,
  file_name text not null, storage_path text not null unique, file_type text, file_size bigint,
  created_at timestamptz not null default now()
);
create table public.notifications (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  announcement_id uuid references public.announcements(id) on delete cascade, title text not null, body text not null,
  is_read boolean not null default false, read_at timestamptz, created_at timestamptz not null default now()
);
create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  token text not null unique, device_name text, platform text, is_active boolean not null default true,
  last_used_at timestamptz not null default now(), created_at timestamptz not null default now()
);
create table public.push_delivery_logs (
  id uuid primary key default gen_random_uuid(), announcement_id uuid references public.announcements(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null, subscription_id uuid references public.push_subscriptions(id) on delete set null,
  status text not null check(status in ('sent','failed','invalid_token')), error_message text, sent_at timestamptz not null default now()
);
create table public.audit_logs (
  id bigserial primary key, actor_id uuid references public.profiles(id) on delete set null,
  action text not null, entity_type text not null, entity_id text, metadata jsonb not null default '{}',
  ip_address inet, created_at timestamptz not null default now()
);

create index profiles_department_idx on public.profiles(department_id) where is_active;
create index profiles_role_idx on public.profiles(role);
create index announcements_status_published_idx on public.announcements(status,published_at desc);
create index announcements_pinned_idx on public.announcements(is_pinned,published_at desc) where status='published';
create index targets_announcement_idx on public.announcement_targets(announcement_id);
create index targets_department_idx on public.announcement_targets(department_id) where target_type='department';
create index targets_user_idx on public.announcement_targets(user_id) where target_type='user';
create index reads_user_idx on public.announcement_reads(user_id,read_at desc);
create index notifications_user_unread_idx on public.notifications(user_id,created_at desc) where not is_read;
create index audit_created_idx on public.audit_logs(created_at desc);

create or replace function public.current_role() returns public.app_role language sql stable security definer set search_path=public as $$ select role from profiles where id=auth.uid() and is_active=true $$;
create or replace function public.current_department() returns uuid language sql stable security definer set search_path=public as $$ select department_id from profiles where id=auth.uid() and is_active=true $$;
create or replace function public.can_view_announcement(a_id uuid) returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from announcements a where a.id=a_id and a.status='published' and (a.expires_at is null or a.expires_at>now()) and exists(
    select 1 from announcement_targets t where t.announcement_id=a.id and (t.target_type='all' or (t.target_type='user' and t.user_id=auth.uid()) or (t.target_type='department' and t.department_id=public.current_department()))
  )) or public.current_role() in ('manager','admin');
$$;
create or replace function public.resolve_login_email(p_employee_id text) returns text language sql security definer set search_path=public as $$ select email from profiles where employee_id=p_employee_id and is_active=true limit 1 $$;
revoke all on function public.resolve_login_email(text) from public; grant execute on function public.resolve_login_email(text) to anon,authenticated;

create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;
create trigger departments_updated before update on departments for each row execute function set_updated_at();
create trigger profiles_updated before update on profiles for each row execute function set_updated_at();
create trigger announcements_updated before update on announcements for each row execute function set_updated_at();

alter table departments enable row level security; alter table profiles enable row level security; alter table announcements enable row level security;
alter table announcement_targets enable row level security; alter table announcement_reads enable row level security; alter table announcement_bookmarks enable row level security;
alter table attachments enable row level security; alter table notifications enable row level security; alter table push_subscriptions enable row level security;
alter table push_delivery_logs enable row level security; alter table audit_logs enable row level security;

create policy "departments visible to signed users" on departments for select to authenticated using (true);
create policy "admins manage departments" on departments for all to authenticated using (public.current_role()='admin') with check (public.current_role()='admin');
create policy "users view self managers view all supervisors dept" on profiles for select to authenticated using (id=auth.uid() or public.current_role() in ('manager','admin') or (public.current_role()='supervisor' and department_id=current_department()));
create policy "users update own basic profile" on profiles for update to authenticated using (id=auth.uid()) with check (id=auth.uid());
create policy "admins manage profiles" on profiles for all to authenticated using (public.current_role()='admin') with check (public.current_role()='admin');
create policy "targeted announcements only" on announcements for select to authenticated using (can_view_announcement(id));
create policy "managers manage announcements" on announcements for all to authenticated using (public.current_role() in ('manager','admin')) with check (public.current_role() in ('manager','admin'));
create policy "supervisors create own announcements" on announcements for insert to authenticated with check (public.current_role()='supervisor' and author_id=auth.uid());
create policy "supervisors update own announcements" on announcements for update to authenticated using (public.current_role()='supervisor' and author_id=auth.uid()) with check (public.current_role()='supervisor' and author_id=auth.uid());
create policy "view targets for visible announcements" on announcement_targets for select to authenticated using (can_view_announcement(announcement_id) or public.current_role() in ('manager','admin'));
create policy "managers manage targets" on announcement_targets for all to authenticated using (public.current_role() in ('manager','admin')) with check (public.current_role() in ('manager','admin'));
create policy "supervisors target own department" on announcement_targets for insert to authenticated with check (public.current_role()='supervisor' and target_type='department' and department_id=current_department() and exists(select 1 from announcements a where a.id=announcement_id and a.author_id=auth.uid()));
create policy "users read own reads" on announcement_reads for select to authenticated using (user_id=auth.uid() or public.current_role() in ('manager','admin') or (public.current_role()='supervisor' and exists(select 1 from profiles p where p.id=user_id and p.department_id=current_department())));
create policy "users confirm own read" on announcement_reads for insert to authenticated with check (user_id=auth.uid() and can_view_announcement(announcement_id));
create policy "users update own read" on announcement_reads for update to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "own bookmarks" on announcement_bookmarks for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid() and can_view_announcement(announcement_id));
create policy "visible attachments" on attachments for select to authenticated using (can_view_announcement(announcement_id));
create policy "publishers manage attachments" on attachments for all to authenticated using (public.current_role() in ('manager','admin') or exists(select 1 from announcements a where a.id=announcement_id and a.author_id=auth.uid())) with check (public.current_role() in ('manager','admin','supervisor'));
create policy "own notifications" on notifications for select to authenticated using (user_id=auth.uid());
create policy "mark own notifications" on notifications for update to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "own push subscriptions" on push_subscriptions for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "managers view delivery logs" on push_delivery_logs for select to authenticated using (public.current_role() in ('manager','admin'));
create policy "admins view audit" on audit_logs for select to authenticated using (public.current_role()='admin');

-- الموظف يستطيع تعديل الحقول الشخصية فقط؛ يمنع تصعيد الدور أو تغيير القسم من المتصفح.
revoke update on public.profiles from authenticated;
grant update (full_name,avatar_url,notification_enabled,updated_at) on public.profiles to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values ('announcement-attachments','announcement-attachments',false,10485760,array['application/pdf','image/jpeg','image/png','image/webp','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']) on conflict(id) do nothing;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values ('avatars','avatars',false,3145728,array['image/jpeg','image/png','image/webp']) on conflict(id) do nothing;
create policy "authenticated upload announcement files" on storage.objects for insert to authenticated with check (bucket_id='announcement-attachments' and public.current_role() in ('supervisor','manager','admin'));
create policy "targeted users download files" on storage.objects for select to authenticated using (bucket_id='announcement-attachments' and can_view_announcement((storage.foldername(name))[1]::uuid));
create policy "users manage own avatar" on storage.objects for all to authenticated using (bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text) with check (bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text);

create or replace view public.announcement_report with (security_invoker=true) as
select a.id,a.title,count(distinct p.id) recipient_count,count(distinct r.user_id) read_count,
round(100.0*count(distinct r.user_id)/nullif(count(distinct p.id),0),1) read_percentage
from announcements a join profiles p on p.is_active and exists(select 1 from announcement_targets t where t.announcement_id=a.id and (t.target_type='all' or t.user_id=p.id or t.department_id=p.department_id))
left join announcement_reads r on r.announcement_id=a.id and r.user_id=p.id group by a.id,a.title;
