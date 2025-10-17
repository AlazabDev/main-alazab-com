-- ==========================================
-- نظام دورة حياة طلبات الصيانة الشامل
-- مع العزل متعدد المستأجرين والتحكم الكامل
-- ==========================================

-- 1) دوال مساعدة للـ JWT
create or replace function fn_claim(key text)
returns text
language sql stable as $$
  select coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb->>key, null);
$$;

create or replace function fn_claim_uuid(key text)
returns uuid
language sql stable as $$
  select (fn_claim(key))::uuid;
$$;

create or replace function fn_role()
returns text
language sql stable as $$
  select coalesce(fn_claim('role'), '');
$$;

create or replace function fn_has_role(roles text[])
returns boolean
language sql stable as $$
  select fn_role() = any(roles);
$$;

-- 2) إنشاء enum للحالات
create type maintenance_status_v2 as enum (
  'submitted', 'triaged', 'needs_info', 'scheduled', 
  'in_progress', 'paused', 'escalated', 'completed',
  'qa_review', 'closed', 'reopened', 
  'canceled', 'rejected'
);

-- 3) الجداول الأساسية

-- جدول الطلبات المحدث بـ org_id
create table if not exists maintenance_requests_v2 (
  id                uuid primary key default gen_random_uuid(),
  org_id            uuid not null,
  customer_id       uuid not null,
  property_id       uuid,
  title             text not null,
  description       text,
  category_id       uuid,
  subcategory_id    uuid,
  priority          text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  status            maintenance_status_v2 not null default 'submitted',
  source            text default 'app' check (source in ('app', 'web', 'whatsapp', 'ms_forms')),
  location          jsonb,
  preferred_start   timestamptz,
  preferred_end     timestamptz,
  created_by        uuid not null default auth.uid(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- تدقيق الانتقالات
create table if not exists request_status_audit (
  id          uuid primary key default gen_random_uuid(),
  request_id  uuid not null references maintenance_requests_v2(id) on delete cascade,
  from_status text not null,
  to_status   text not null,
  changed_by  uuid not null default auth.uid(),
  note        text default '',
  changed_at  timestamptz not null default now()
);

-- تعليقات (عام/داخلي)
create table if not exists request_comments_v2 (
  id          uuid primary key default gen_random_uuid(),
  request_id  uuid not null references maintenance_requests_v2(id) on delete cascade,
  author_id   uuid not null default auth.uid(),
  visibility  text not null default 'public' check (visibility in ('public', 'internal')),
  body        text not null,
  created_at  timestamptz not null default now()
);

-- مرفقات
create table if not exists request_attachments_v2 (
  id          uuid primary key default gen_random_uuid(),
  request_id  uuid not null references maintenance_requests_v2(id) on delete cascade,
  path        text not null,
  file_type   text,
  uploaded_by uuid not null default auth.uid(),
  created_at  timestamptz not null default now()
);

-- تعيين فنيين
create table if not exists request_assignments_v2 (
  id            uuid primary key default gen_random_uuid(),
  request_id    uuid not null references maintenance_requests_v2(id) on delete cascade,
  technician_id uuid not null,
  assigned_by   uuid not null default auth.uid(),
  status        text not null default 'active' check (status in ('active', 'released')),
  created_at    timestamptz not null default now()
);

-- مواعيد
create table if not exists request_appointments_v2 (
  id            uuid primary key default gen_random_uuid(),
  request_id    uuid not null references maintenance_requests_v2(id) on delete cascade,
  technician_id uuid,
  start_at      timestamptz not null,
  end_at        timestamptz not null,
  status        text not null default 'scheduled' check (status in ('scheduled', 'completed', 'no_show', 'canceled')),
  created_by    uuid not null default auth.uid(),
  created_at    timestamptz not null default now()
);

-- تعريفات الحالات
create table if not exists status_defs (
  status text primary key,
  sort   int not null,
  label_ar text,
  label_en text
);

-- الانتقالات المسموحة
create table if not exists status_transitions (
  from_status   text not null,
  to_status     text not null,
  roles_allowed text[] not null,
  primary key (from_status, to_status)
);

-- 4) تهيئة الحالات والانتقالات

insert into status_defs(status, sort, label_ar, label_en) values
('submitted', 10, 'مُقدم', 'Submitted'),
('triaged', 20, 'تم الفرز', 'Triaged'),
('needs_info', 30, 'يحتاج معلومات', 'Needs Info'),
('scheduled', 40, 'مجدول', 'Scheduled'),
('in_progress', 50, 'قيد التنفيذ', 'In Progress'),
('paused', 60, 'متوقف', 'Paused'),
('escalated', 70, 'مُصعّد', 'Escalated'),
('completed', 80, 'مكتمل', 'Completed'),
('qa_review', 90, 'مراجعة الجودة', 'QA Review'),
('closed', 100, 'مغلق', 'Closed'),
('reopened', 110, 'مُعاد فتحه', 'Reopened'),
('canceled', 120, 'ملغي', 'Canceled'),
('rejected', 130, 'مرفوض', 'Rejected')
on conflict (status) do update set
  label_ar = excluded.label_ar,
  label_en = excluded.label_en,
  sort = excluded.sort;

-- الانتقالات المسموحة
insert into status_transitions(from_status, to_status, roles_allowed) values
('submitted', 'triaged', '{admin,dispatcher}'),
('submitted', 'rejected', '{admin,dispatcher}'),
('triaged', 'scheduled', '{admin,dispatcher}'),
('triaged', 'needs_info', '{admin,dispatcher}'),
('triaged', 'rejected', '{admin,dispatcher}'),
('needs_info', 'triaged', '{admin,dispatcher,customer}'),
('scheduled', 'in_progress', '{technician,admin,dispatcher}'),
('scheduled', 'canceled', '{admin,dispatcher}'),
('in_progress', 'paused', '{technician,admin,dispatcher}'),
('in_progress', 'completed', '{technician,admin,dispatcher}'),
('in_progress', 'escalated', '{technician,admin,dispatcher}'),
('paused', 'in_progress', '{technician,admin,dispatcher}'),
('paused', 'escalated', '{admin,dispatcher}'),
('paused', 'canceled', '{admin,dispatcher}'),
('completed', 'qa_review', '{admin,dispatcher}'),
('qa_review', 'closed', '{admin,dispatcher}'),
('qa_review', 'reopened', '{admin,dispatcher,customer}'),
('reopened', 'triaged', '{admin,dispatcher}')
on conflict do nothing;

-- 5) المحدثات (Triggers)

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_mr_updated_at on maintenance_requests_v2;
create trigger trg_mr_updated_at
before update on maintenance_requests_v2
for each row execute function set_updated_at();

-- ضمان org_id و created_by
create or replace function set_request_org_and_creator()
returns trigger language plpgsql as $$
begin
  if new.org_id is null then
    new.org_id := fn_claim_uuid('org_id');
  end if;
  if new.created_by is null then
    new.created_by := auth.uid();
  end if;
  if new.customer_id is null then
    new.customer_id := auth.uid();
  end if;
  return new;
end;
$$;

drop trigger if exists trg_mr_defaulting on maintenance_requests_v2;
create trigger trg_mr_defaulting
before insert on maintenance_requests_v2
for each row execute function set_request_org_and_creator();

-- 6) دالة انتقال الحالة المأمونة

create or replace function transition_request(
  p_request_id uuid,
  p_new_status text,
  p_note text default ''
)
returns maintenance_requests_v2
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text := fn_role();
  v_org  uuid := fn_claim_uuid('org_id');
  v_row  maintenance_requests_v2;
  v_from text;
begin
  select * into v_row from maintenance_requests_v2 where id = p_request_id for update;
  
  if v_row is null then
    raise exception 'Request not found';
  end if;

  if v_row.org_id <> v_org then
    raise exception 'Cross-tenant access denied';
  end if;

  v_from := v_row.status::text;

  if not exists (
    select 1 from status_transitions
    where from_status = v_from 
      and to_status = p_new_status
      and v_role = any(roles_allowed)
  ) then
    raise exception 'Invalid transition: % -> % for role %', v_from, p_new_status, v_role;
  end if;

  update maintenance_requests_v2
     set status = p_new_status::maintenance_status_v2,
         updated_at = now()
   where id = p_request_id
   returning * into v_row;

  insert into request_status_audit(request_id, from_status, to_status, changed_by, note)
  values (p_request_id, v_from, p_new_status, auth.uid(), coalesce(p_note, ''));

  return v_row;
end;
$$;

-- 7) تفعيل RLS على كل الجداول

alter table maintenance_requests_v2 enable row level security;
alter table request_status_audit enable row level security;
alter table request_comments_v2 enable row level security;
alter table request_attachments_v2 enable row level security;
alter table request_assignments_v2 enable row level security;
alter table request_appointments_v2 enable row level security;
alter table status_defs enable row level security;
alter table status_transitions enable row level security;

-- 8) سياسات RLS

-- طلبات الصيانة: القراءة داخل المستأجر فقط
create policy mr_v2_tenant_read on maintenance_requests_v2
for select using (org_id = fn_claim_uuid('org_id'));

create policy mr_v2_tenant_insert on maintenance_requests_v2
for insert with check (
  org_id = fn_claim_uuid('org_id')
  and fn_has_role(ARRAY['customer', 'dispatcher', 'admin'])
  and (customer_id = auth.uid() or fn_has_role(ARRAY['dispatcher', 'admin']))
);

create policy mr_v2_tenant_update on maintenance_requests_v2
for update using (
  org_id = fn_claim_uuid('org_id')
  and fn_has_role(ARRAY['dispatcher', 'admin', 'technician'])
)
with check (
  org_id = fn_claim_uuid('org_id')
  and fn_has_role(ARRAY['dispatcher', 'admin', 'technician'])
);

-- تدقيق: عرض داخل المستأجر
create policy audit_read on request_status_audit
for select using (
  exists (
    select 1 from maintenance_requests_v2 r 
    where r.id = request_id 
      and r.org_id = fn_claim_uuid('org_id')
  )
);

-- التعليقات: العام للجميع، الداخلي للطاقم فقط
create policy comments_v2_read on request_comments_v2
for select using (
  exists (
    select 1 from maintenance_requests_v2 r
    where r.id = request_id 
      and r.org_id = fn_claim_uuid('org_id')
  )
  and (
    visibility = 'public'
    or fn_has_role(ARRAY['technician', 'dispatcher', 'admin'])
  )
);

create policy comments_v2_insert on request_comments_v2
for insert with check (
  exists (
    select 1 from maintenance_requests_v2 r
    where r.id = request_id 
      and r.org_id = fn_claim_uuid('org_id')
  )
  and (
    visibility = 'public'
    or fn_has_role(ARRAY['technician', 'dispatcher', 'admin'])
  )
);

-- المرفقات
create policy attachments_v2_read on request_attachments_v2
for select using (
  exists (
    select 1 from maintenance_requests_v2 r 
    where r.id = request_id 
      and r.org_id = fn_claim_uuid('org_id')
  )
);

create policy attachments_v2_insert on request_attachments_v2
for insert with check (
  exists (
    select 1 from maintenance_requests_v2 r 
    where r.id = request_id 
      and r.org_id = fn_claim_uuid('org_id')
  )
);

-- التعيينات
create policy assign_v2_read on request_assignments_v2
for select using (
  exists (
    select 1 from maintenance_requests_v2 r 
    where r.id = request_id 
      and r.org_id = fn_claim_uuid('org_id')
  )
);

create policy assign_v2_insert on request_assignments_v2
for insert with check (
  fn_has_role(ARRAY['dispatcher', 'admin'])
  and exists (
    select 1 from maintenance_requests_v2 r 
    where r.id = request_id 
      and r.org_id = fn_claim_uuid('org_id')
  )
);

-- المواعيد
create policy appt_v2_read on request_appointments_v2
for select using (
  exists (
    select 1 from maintenance_requests_v2 r 
    where r.id = request_id 
      and r.org_id = fn_claim_uuid('org_id')
  )
);

create policy appt_v2_cud on request_appointments_v2
for all using (
  fn_has_role(ARRAY['dispatcher', 'admin']) 
  and exists (
    select 1 from maintenance_requests_v2 r 
    where r.id = request_id 
      and r.org_id = fn_claim_uuid('org_id')
  )
)
with check (
  fn_has_role(ARRAY['dispatcher', 'admin'])
  and exists (
    select 1 from maintenance_requests_v2 r 
    where r.id = request_id 
      and r.org_id = fn_claim_uuid('org_id')
  )
);

-- جداول الميتا: قراءة للجميع
create policy status_defs_read on status_defs 
for select using (true);

create policy status_transitions_read on status_transitions 
for select using (true);

-- 9) إنشاء indexes للأداء

create index idx_mr_v2_org_id on maintenance_requests_v2(org_id);
create index idx_mr_v2_customer_id on maintenance_requests_v2(customer_id);
create index idx_mr_v2_status on maintenance_requests_v2(status);
create index idx_mr_v2_created_at on maintenance_requests_v2(created_at desc);

create index idx_audit_request_id on request_status_audit(request_id);
create index idx_comments_v2_request_id on request_comments_v2(request_id);
create index idx_attachments_v2_request_id on request_attachments_v2(request_id);
create index idx_assignments_v2_request_id on request_assignments_v2(request_id);
create index idx_appointments_v2_request_id on request_appointments_v2(request_id);