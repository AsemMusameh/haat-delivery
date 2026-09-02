-- Employee suite: identity, duties, permissions, records, reviews and analytics
create table if not exists public.employee_jobs (
 id uuid primary key default gen_random_uuid(), employee_id uuid not null references public.profiles(id) on delete cascade,
 job_name text not null, is_primary boolean not null default false, starts_at date not null default current_date,
 ends_at date, description text, created_at timestamptz not null default now()
);
create table if not exists public.employee_permissions (
 employee_id uuid not null references public.profiles(id) on delete cascade, permission text not null,
 granted_by uuid references public.profiles(id), granted_at timestamptz not null default now(), primary key(employee_id,permission)
);
create table if not exists public.trusted_devices (
 id uuid primary key default gen_random_uuid(), employee_id uuid not null references public.profiles(id) on delete cascade,
 device_hash text not null, device_name text, trusted_until timestamptz not null, last_used_at timestamptz not null default now(), unique(employee_id,device_hash)
);
create table if not exists public.login_attempts (
 id bigserial primary key, employee_id uuid references public.profiles(id) on delete set null, email text,
 success boolean not null, failure_reason text, ip_address inet, user_agent text, created_at timestamptz not null default now()
);
create table if not exists public.employee_verifications (
 id uuid primary key default gen_random_uuid(), employee_id uuid not null references public.profiles(id) on delete cascade,
 channel text not null check(channel in ('email','sms')), destination_masked text not null, verified_at timestamptz,
 expires_at timestamptz, attempt_count int not null default 0, created_at timestamptz not null default now()
);
create table if not exists public.employee_records (
 id uuid primary key default gen_random_uuid(), employee_id uuid not null references public.profiles(id) on delete cascade,
 record_type text not null check(record_type in ('complaint','verbal_warning','written_warning','final_warning','appreciation','administrative_note','policy_violation')),
 title text not null, description text not null, occurred_at timestamptz not null, department_id uuid references public.departments(id),
 created_by uuid not null references public.profiles(id), severity text not null check(severity in ('low','medium','high','critical')),
 status text not null default 'open' check(status in ('open','under_review','resolved','cancelled')), action_taken text,
 employee_response text, visible_to_employee boolean not null default true, acknowledged_at timestamptz, closed_at timestamptz,
 archived_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.employee_reviews (
 id uuid primary key default gen_random_uuid(), employee_id uuid not null references public.profiles(id) on delete cascade,
 reviewer_id uuid not null references public.profiles(id), work_type text not null, reviewed_at date not null,
 period_start date not null, period_end date not null, overall_score numeric(5,2) not null,
 quality_score numeric(5,2), productivity_score numeric(5,2), communication_score numeric(5,2),
 compliance_score numeric(5,2), attendance_score numeric(5,2), reviewed_cases int not null default 0,
 error_count int not null default 0, notes text, strengths text, improvements text, development_plan text,
 next_review_at date, acknowledged_at timestamptz, employee_comment text, objection_status text,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.employee_goals (
 id uuid primary key default gen_random_uuid(), review_id uuid references public.employee_reviews(id) on delete cascade,
 employee_id uuid not null references public.profiles(id) on delete cascade, title text not null, target_value numeric,
 current_value numeric default 0, due_at date, status text not null default 'open', created_at timestamptz not null default now()
);
create table if not exists public.coupon_errors (
 id uuid primary key default gen_random_uuid(), employee_id uuid not null references public.profiles(id) on delete cascade,
 order_number text not null, coupon_code text, error_value numeric(12,2) not null default 0, reason text not null,
 occurred_at timestamptz not null, reviewed_by uuid references public.profiles(id), dispute_status text,
 score_impact numeric(6,2) default 0, created_at timestamptz not null default now()
);
create table if not exists public.employee_performance_metrics (
 id uuid primary key default gen_random_uuid(), employee_id uuid not null references public.profiles(id) on delete cascade,
 period_start date not null, period_end date not null, quality numeric(5,2), productivity numeric(5,2), attendance numeric(5,2),
 reviews numeric(5,2), compliance numeric(5,2), customer_satisfaction numeric(5,2), overall_score numeric(5,2),
 source text default 'manual', created_at timestamptz not null default now(), unique(employee_id,period_start,period_end)
);
create table if not exists public.ranking_weights (
 id boolean primary key default true check(id), quality numeric(5,2) not null default 35, productivity numeric(5,2) not null default 25,
 attendance numeric(5,2) not null default 15, reviews numeric(5,2) not null default 15, compliance numeric(5,2) not null default 10,
 enabled boolean not null default true, check(quality+productivity+attendance+reviews+compliance=100)
);
insert into public.ranking_weights(id) values(true) on conflict(id) do nothing;

create index if not exists employee_jobs_employee_idx on public.employee_jobs(employee_id);
create index if not exists employee_records_employee_idx on public.employee_records(employee_id,occurred_at desc);
create index if not exists employee_reviews_employee_idx on public.employee_reviews(employee_id,reviewed_at desc);
create index if not exists performance_employee_period_idx on public.employee_performance_metrics(employee_id,period_start desc);
create index if not exists login_attempts_email_idx on public.login_attempts(email,created_at desc);

alter table public.employee_jobs enable row level security; alter table public.employee_permissions enable row level security;
alter table public.trusted_devices enable row level security; alter table public.login_attempts enable row level security;
alter table public.employee_verifications enable row level security; alter table public.employee_records enable row level security;
alter table public.employee_reviews enable row level security; alter table public.employee_goals enable row level security;
alter table public.coupon_errors enable row level security; alter table public.employee_performance_metrics enable row level security;
alter table public.ranking_weights enable row level security;

create policy "employee sees own jobs" on public.employee_jobs for select to authenticated using (employee_id=auth.uid() or public.current_role() in ('manager','admin'));
create policy "employee sees own permissions" on public.employee_permissions for select to authenticated using (employee_id=auth.uid() or public.current_role()='admin');
create policy "own trusted devices" on public.trusted_devices for all to authenticated using (employee_id=auth.uid()) with check (employee_id=auth.uid());
create policy "admin sees login attempts" on public.login_attempts for select to authenticated using (public.current_role()='admin');
create policy "own verifications" on public.employee_verifications for select to authenticated using (employee_id=auth.uid() or public.current_role()='admin');
create policy "private employee records" on public.employee_records for select to authenticated using ((employee_id=auth.uid() and visible_to_employee) or public.current_role() in ('manager','admin'));
create policy "managers manage records" on public.employee_records for all to authenticated using (public.current_role() in ('manager','admin')) with check (public.current_role() in ('manager','admin'));
create policy "private employee reviews" on public.employee_reviews for select to authenticated using (employee_id=auth.uid() or public.current_role() in ('manager','admin'));
create policy "managers manage reviews" on public.employee_reviews for all to authenticated using (public.current_role() in ('manager','admin')) with check (public.current_role() in ('manager','admin'));
create policy "own employee goals" on public.employee_goals for select to authenticated using (employee_id=auth.uid() or public.current_role() in ('manager','admin'));
create policy "own coupon errors" on public.coupon_errors for select to authenticated using (employee_id=auth.uid() or public.current_role() in ('manager','admin'));
create policy "own performance" on public.employee_performance_metrics for select to authenticated using (employee_id=auth.uid() or public.current_role() in ('manager','admin'));
create policy "weights visible" on public.ranking_weights for select to authenticated using (true);
create policy "admins manage weights" on public.ranking_weights for all to authenticated using (public.current_role()='admin') with check (public.current_role()='admin');
