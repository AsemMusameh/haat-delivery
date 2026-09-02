-- Community media, scheduling, mentions and employee notifications.
alter table public.company_posts add column if not exists media_url text;
alter table public.company_posts add column if not exists media_type text check (media_type in ('image','video'));
alter table public.company_posts add column if not exists scheduled_for timestamptz not null default now();
alter table public.company_posts add column if not exists mentions jsonb not null default '[]'::jsonb;
create index if not exists company_posts_scheduled_idx on public.company_posts(scheduled_for desc);

alter table public.notifications add column if not exists link text;
alter table public.notifications add column if not exists kind text not null default 'announcement';

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('company-media','company-media',true,26214400,array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime'])
on conflict(id) do update set public=true,file_size_limit=26214400,allowed_mime_types=excluded.allowed_mime_types;
create policy "employees view community media" on storage.objects for select to authenticated using(bucket_id='company-media');
create policy "employees upload own community media" on storage.objects for insert to authenticated with check(bucket_id='company-media' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "employees manage own community media" on storage.objects for update to authenticated using(bucket_id='company-media' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "employees delete own community media" on storage.objects for delete to authenticated using(bucket_id='company-media' and (storage.foldername(name))[1]=auth.uid()::text);

create or replace function public.notify_company_post() returns trigger
language plpgsql security definer set search_path=public as $$
begin
  insert into notifications(user_id,title,body,link,kind)
  select p.id,'منشور جديد في مجتمع الشركة',left(new.body,160),'/community','community_post'
  from profiles p where p.is_active and p.id<>new.author_id;
  insert into notifications(user_id,title,body,link,kind)
  select p.id,'تمت الإشارة إليك في منشور',left(new.body,160),'/community','mention'
  from profiles p where p.is_active and exists (
    select 1 from jsonb_array_elements_text(new.mentions) mention where mention=p.full_name
  );
  return new;
end $$;
drop trigger if exists company_post_notifications on public.company_posts;
create trigger company_post_notifications after insert on public.company_posts for each row execute function public.notify_company_post();
