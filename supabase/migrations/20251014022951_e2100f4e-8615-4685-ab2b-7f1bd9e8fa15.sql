-- =====================================================
-- تطوير شامل لجداول الخدمات (Service Catalog System) - إصدار محسّن
-- استخدام UUID بدلاً من TEXT للـ IDs
-- =====================================================

-- 1️⃣ إنشاء جدول الفئات الرئيسية (Service Categories)
drop table if exists public.service_categories cascade;
create table public.service_categories (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name_ar text not null,
  name_en text,
  description_ar text,
  description_en text,
  icon_url text,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2️⃣ إنشاء جدول الفئات الفرعية (Service Subcategories)
drop table if exists public.service_subcategories cascade;
create table public.service_subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.service_categories(id) on delete cascade,
  code text not null,
  name_ar text not null,
  name_en text,
  description_ar text,
  description_en text,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (category_id, code)
);

-- 3️⃣ تحديث جدول الخدمات (Services) بالبنية الجديدة - UUID
drop table if exists public.services cascade;
create table public.services (
  id uuid primary key default gen_random_uuid(),
  subcategory_id uuid not null references public.service_subcategories(id) on delete cascade,
  code text not null,
  name_ar text not null,
  name_en text,
  description_ar text,
  description_en text,
  unit text,
  pricing_type text not null default 'fixed',
  base_price numeric(12,2) default 0,
  min_qty numeric(12,3) default 1,
  max_qty numeric(12,3),
  is_active boolean default true,
  sort_order int default 0,
  icon_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (subcategory_id, code)
);

-- 4️⃣ إنشاء جدول مستويات التسعير (Service Price Tiers)
drop table if exists public.service_price_tiers cascade;
create table public.service_price_tiers (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  tier_code text not null,
  label_ar text not null,
  label_en text,
  price numeric(12,2) not null,
  qty_from numeric(12,3) default 1,
  qty_to numeric(12,3),
  note text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (service_id, tier_code)
);

-- 5️⃣ تحديث جدول service_requests ليستخدم خدمات من الكتالوج
alter table public.service_requests 
  add column if not exists service_id uuid references public.services(id) on delete set null;

-- 6️⃣ تحديث جدول request_lines ليستخدم الخدمات من الكتالوج
-- حذف العمود القديم إذا كان موجوداً وإعادة إنشائه بنوع صحيح
alter table public.request_lines
  drop constraint if exists request_lines_service_id_fkey;

-- التأكد من وجود عمود service_id بنوع uuid
do $$
begin
  -- حذف العمود إذا كان موجوداً بنوع خاطئ
  if exists (
    select 1 from information_schema.columns 
    where table_name = 'request_lines' 
    and column_name = 'service_id'
    and data_type != 'uuid'
  ) then
    alter table public.request_lines drop column service_id;
  end if;
  
  -- إضافة العمود بنوع uuid إذا لم يكن موجوداً
  if not exists (
    select 1 from information_schema.columns 
    where table_name = 'request_lines' 
    and column_name = 'service_id'
  ) then
    alter table public.request_lines add column service_id uuid;
  end if;
end $$;

-- إضافة القيد الخارجي
alter table public.request_lines
  add constraint request_lines_service_id_fkey 
    foreign key (service_id) references public.services(id) on delete restrict;

-- 7️⃣ إنشاء Indexes للأداء
create index if not exists idx_service_categories_active on public.service_categories(is_active, sort_order);
create index if not exists idx_service_subcategories_category on public.service_subcategories(category_id, is_active, sort_order);
create index if not exists idx_services_subcategory on public.services(subcategory_id, is_active, sort_order);
create index if not exists idx_services_active on public.services(is_active);
create index if not exists idx_service_price_tiers_service on public.service_price_tiers(service_id, sort_order);

-- 8️⃣ Triggers لتحديث updated_at (استخدام الدالة الموجودة)
create trigger trg_service_categories_updated_at
  before update on public.service_categories
  for each row execute function public.update_updated_at_column();

create trigger trg_service_subcategories_updated_at
  before update on public.service_subcategories
  for each row execute function public.update_updated_at_column();

create trigger trg_services_updated_at
  before update on public.services
  for each row execute function public.update_updated_at_column();

create trigger trg_service_price_tiers_updated_at
  before update on public.service_price_tiers
  for each row execute function public.update_updated_at_column();

-- 9️⃣ تفعيل RLS على الجداول
alter table public.service_categories enable row level security;
alter table public.service_subcategories enable row level security;
alter table public.services enable row level security;
alter table public.service_price_tiers enable row level security;

-- 🔟 إنشاء سياسات RLS
-- Service Categories
create policy "service_categories_read"
  on public.service_categories for select
  using (is_active = true);

create policy "service_categories_manage"
  on public.service_categories for all
  using (is_staff(auth.uid()))
  with check (is_staff(auth.uid()));

-- Service Subcategories
create policy "service_subcategories_read"
  on public.service_subcategories for select
  using (is_active = true);

create policy "service_subcategories_manage"
  on public.service_subcategories for all
  using (is_staff(auth.uid()))
  with check (is_staff(auth.uid()));

-- Services
create policy "services_read"
  on public.services for select
  using (is_active = true);

create policy "services_manage"
  on public.services for all
  using (is_staff(auth.uid()))
  with check (is_staff(auth.uid()));

-- Service Price Tiers
create policy "service_price_tiers_read"
  on public.service_price_tiers for select
  using (exists (
    select 1 from public.services s 
    where s.id = service_price_tiers.service_id 
    and s.is_active = true
  ));

create policy "service_price_tiers_manage"
  on public.service_price_tiers for all
  using (is_staff(auth.uid()))
  with check (is_staff(auth.uid()));

-- 1️⃣1️⃣ قيود البيانات
alter table public.services 
  add constraint chk_pricing_type 
  check (pricing_type in ('fixed', 'tiered', 'custom', 'per_unit'));

alter table public.services
  add constraint chk_base_price_positive
  check (base_price >= 0);

alter table public.service_price_tiers
  add constraint chk_price_positive
  check (price >= 0);

alter table public.service_price_tiers
  add constraint chk_qty_range
  check (qty_from is null or qty_to is null or qty_from < qty_to);

-- 1️⃣2️⃣ تعليقات توضيحية
comment on table public.service_categories is 'الفئات الرئيسية للخدمات (نظافة، صيانة، إلخ)';
comment on table public.service_subcategories is 'الفئات الفرعية تحت كل فئة رئيسية';
comment on table public.services is 'جدول الخدمات التفصيلية مع التسعير';
comment on table public.service_price_tiers is 'مستويات تسعير الخدمات حسب الكمية أو النوع';