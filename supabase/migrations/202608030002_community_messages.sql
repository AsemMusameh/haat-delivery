-- HAAT social feed, reactions, comments and direct employee messaging.
create table if not exists public.company_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 5000),
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.post_reactions (
  post_id uuid not null references public.company_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  emoji text not null check (emoji in ('❤️','👏','🎉','🔥')),
  created_at timestamptz not null default now(),
  primary key (post_id,user_id)
);

create table if not exists public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.company_posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create table if not exists public.direct_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  is_read boolean not null default false,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  check (sender_id <> recipient_id)
);

create index if not exists company_posts_created_idx on public.company_posts(created_at desc);
create index if not exists post_comments_post_idx on public.post_comments(post_id,created_at);
create index if not exists direct_messages_sender_idx on public.direct_messages(sender_id,recipient_id,created_at);
create index if not exists direct_messages_recipient_idx on public.direct_messages(recipient_id,is_read,created_at desc);

alter table public.company_posts enable row level security;
alter table public.post_reactions enable row level security;
alter table public.post_comments enable row level security;
alter table public.direct_messages enable row level security;

create policy "employees view posts" on public.company_posts for select to authenticated using (true);
create policy "employees create posts" on public.company_posts for insert to authenticated with check (author_id=auth.uid());
create policy "authors manage posts" on public.company_posts for update to authenticated using (author_id=auth.uid() or public.current_role() in ('manager','admin')) with check (author_id=auth.uid() or public.current_role() in ('manager','admin'));
create policy "authors delete posts" on public.company_posts for delete to authenticated using (author_id=auth.uid() or public.current_role() in ('manager','admin'));
create policy "employees view reactions" on public.post_reactions for select to authenticated using (true);
create policy "employees react" on public.post_reactions for insert to authenticated with check (user_id=auth.uid());
create policy "employees update reaction" on public.post_reactions for update to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "employees remove reaction" on public.post_reactions for delete to authenticated using (user_id=auth.uid());
create policy "employees view comments" on public.post_comments for select to authenticated using (true);
create policy "employees comment" on public.post_comments for insert to authenticated with check (author_id=auth.uid());
create policy "authors manage comments" on public.post_comments for delete to authenticated using (author_id=auth.uid() or public.current_role() in ('manager','admin'));
create policy "participants view messages" on public.direct_messages for select to authenticated using (sender_id=auth.uid() or recipient_id=auth.uid());
create policy "employees send messages" on public.direct_messages for insert to authenticated with check (sender_id=auth.uid());
create policy "recipients mark messages read" on public.direct_messages for update to authenticated using (recipient_id=auth.uid()) with check (recipient_id=auth.uid());

-- Allow colleagues to find each other for direct messages without exposing private fields.
create or replace view public.employee_directory with (security_invoker=true) as
select id,employee_id,full_name,avatar_url,department_id,role,is_active from public.profiles where is_active=true;

grant select,insert,update,delete on public.company_posts,public.post_reactions,public.post_comments,public.direct_messages to authenticated;
grant select on public.employee_directory to authenticated;
