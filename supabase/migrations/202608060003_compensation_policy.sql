-- Structured HAAT compensation policy and manager-controlled rules.
create table if not exists public.compensation_rules (
  id text primary key,
  situation text not null,
  delay_min integer,
  delay_max integer,
  delivery_available text not null check (delivery_available in ('yes','no','na')),
  remake_accepted text not null check (remake_accepted in ('yes','no','na')),
  profile_condition text not null default 'na' check (profile_condition in ('na','refund_ratio')),
  compensation_min text not null,
  compensation_max text not null,
  required_from_customer text not null default 'nothing' check (required_from_customer in ('nothing','photo','return_order')),
  notes text not null default '',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (delay_min is null or delay_min >= 0),
  check (delay_max is null or delay_max >= delay_min)
);

create index if not exists compensation_rules_situation_idx on public.compensation_rules(situation,sort_order) where is_active;
drop trigger if exists compensation_rules_updated on public.compensation_rules;
create trigger compensation_rules_updated before update on public.compensation_rules for each row execute function public.set_updated_at();

alter table public.compensation_rules enable row level security;
drop policy if exists "employees view compensation policy" on public.compensation_rules;
create policy "employees view compensation policy" on public.compensation_rules for select to authenticated using (true);
drop policy if exists "managers manage compensation policy" on public.compensation_rules;
create policy "managers manage compensation policy" on public.compensation_rules for all to authenticated
  using (public.current_role() in ('manager','admin')) with check (public.current_role() in ('manager','admin'));
grant select on public.compensation_rules to authenticated;
grant insert,update,delete on public.compensation_rules to authenticated;

insert into public.compensation_rules
  (id,situation,delay_min,delay_max,delivery_available,remake_accepted,profile_condition,compensation_min,compensation_max,required_from_customer,notes,is_active,sort_order)
values
  ('late-1','late_order',1,10,'na','na','na','zero','zero','nothing','',true,10),
  ('late-2','late_order',11,20,'na','na','na','df','df','nothing','',true,20),
  ('late-3','late_order',21,30,'na','na','na','df150','df150','nothing','',true,30),
  ('late-4','late_order',31,null,'na','na','na','df200','df200','nothing','',true,40),
  ('cancel-1','cancel_due_delay',1,10,'na','na','na','zero','zero','nothing','',true,50),
  ('cancel-2','cancel_due_delay',11,20,'na','na','na','df','df','nothing','',true,60),
  ('cancel-3','cancel_due_delay',21,30,'na','na','na','fixed50','fixed50','nothing','',true,70),
  ('cancel-4','cancel_due_delay',31,null,'na','na','na','fixed70','fixed100','nothing','',true,80),
  ('cold-no-1','cold_no_delay',null,null,'yes','yes','refund_ratio','remake','remake','return_order','إعادة الطلب البارد للمندوب عند تنفيذ إعادة التحضير.',true,90),
  ('cold-no-2','cold_no_delay',null,null,'yes','no','refund_ratio','df','df','nothing','',true,100),
  ('cold-no-3','cold_no_delay',null,null,'no','na','refund_ratio','order30','order40','nothing','',true,110),
  ('cold-1a','cold_with_delay',1,10,'yes','yes','na','remake','remake','return_order','',true,120),
  ('cold-1b','cold_with_delay',1,10,'yes','no','refund_ratio','df','df','nothing','',true,130),
  ('cold-1c','cold_with_delay',1,10,'no','na','refund_ratio','order30','order40','nothing','',true,140),
  ('cold-2a','cold_with_delay',11,20,'yes','yes','na','remake','remake_df','nothing','',true,150),
  ('cold-2b','cold_with_delay',11,20,'yes','no','na','order30','order40','nothing','',true,160),
  ('cold-2c','cold_with_delay',11,20,'no','yes','na','order40','order50','nothing','',true,170),
  ('cold-3a','cold_with_delay',21,30,'yes','yes','na','remake_df150','remake_df150','nothing','',true,180),
  ('cold-3b','cold_with_delay',21,30,'yes','no','na','order40','order50','nothing','',true,190),
  ('cold-3c','cold_with_delay',21,30,'no','yes','na','order80','order100','nothing','',true,200),
  ('cold-4a','cold_with_delay',31,null,'yes','yes','na','remake_40','remake_80','nothing','',true,210),
  ('cold-4b','cold_with_delay',31,null,'yes','no','na','order100','order100','nothing','',true,220),
  ('cold-4c','cold_with_delay',31,null,'no','yes','na','order100','order100','nothing','',true,230),
  ('missing-main-1','missing_main',null,null,'yes','yes','refund_ratio','remake','remake_df','nothing','',true,240),
  ('missing-main-2','missing_main',null,null,'yes','no','refund_ratio','item_df','item_df','nothing','',true,250),
  ('missing-main-3','missing_main',null,null,'no','na','refund_ratio','item_50','item_50','nothing','',true,260),
  ('missing-side-1','missing_side',null,null,'yes','yes','refund_ratio','remake','remake','nothing','',true,270),
  ('missing-side-2','missing_side',null,null,'yes','no','refund_ratio','item','item','nothing','',true,280),
  ('missing-side-3','missing_side',null,null,'no','na','refund_ratio','item_df','item_df','nothing','',true,290),
  ('damaged-main-1','damaged_main',null,null,'yes','yes','na','remake','remake_df','photo','',true,300),
  ('damaged-main-2','damaged_main',null,null,'yes','no','na','item_df','item_df','photo','',true,310),
  ('damaged-main-3','damaged_main',null,null,'no','yes','na','item_50','item_50','photo','',true,320),
  ('damaged-side-1','damaged_side',null,null,'yes','yes','na','remake','remake','photo','',true,330),
  ('damaged-side-2','damaged_side',null,null,'yes','no','na','item','item','photo','',true,340),
  ('damaged-side-3','damaged_side',null,null,'no','yes','na','item_df','item_df','photo','',true,350),
  ('mix-1','mix_up',null,null,'yes','yes','na','remake_df','remake_df','photo','',true,360),
  ('mix-2','mix_up',null,null,'yes','no','na','total_df','total_df','photo','',true,370),
  ('mix-3','mix_up',null,null,'no','yes','na','total_50','total_50','photo','',true,380),
  ('wrong-main-1','wrong_main',null,null,'yes','yes','na','remake_df','remake_df','photo','',true,390),
  ('wrong-main-2','wrong_main',null,null,'yes','no','na','item','item','photo','',true,400),
  ('wrong-main-3','wrong_main',null,null,'no','yes','na','item_df','item_df','photo','',true,410),
  ('wrong-side-1','wrong_side',null,null,'yes','yes','na','remake','remake','photo','',true,420),
  ('wrong-side-2','wrong_side',null,null,'yes','no','na','item','item','photo','',true,430),
  ('wrong-side-3','wrong_side',null,null,'no','yes','na','item_df','item_df','photo','',true,440)
on conflict (id) do nothing;
