-- Threaded employee comments and likes on each comment.
alter table public.post_comments
  add column if not exists parent_comment_id uuid references public.post_comments(id) on delete cascade;

create index if not exists post_comments_parent_idx
  on public.post_comments(parent_comment_id,created_at);

create table if not exists public.comment_reactions (
  comment_id uuid not null references public.post_comments(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (comment_id,user_id)
);

alter table public.comment_reactions enable row level security;

create policy "employees view comment reactions"
  on public.comment_reactions for select to authenticated using (true);
create policy "employees like comments"
  on public.comment_reactions for insert to authenticated with check (user_id=auth.uid());
create policy "employees remove comment likes"
  on public.comment_reactions for delete to authenticated using (user_id=auth.uid());

grant select,insert,delete on public.comment_reactions to authenticated;
