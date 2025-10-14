-- =====================================================
-- استيراد بيانات الخدمات من الكتالوج الجاهز
-- =====================================================

-- إنشاء جدول مؤقت للتحويل من TEXT IDs إلى UUID
create temp table id_mapping (
  old_id text primary key,
  new_id uuid default gen_random_uuid()
);

-- 1️⃣ استيراد الفئات الرئيسية (Categories)
insert into id_mapping (old_id) values 
  ('750ecd1af052'), ('0cca2894b724'), ('51b058ee6757'), ('467576e4e464'), ('e18359e051df');

insert into public.service_categories (id, code, name_ar, description_ar, sort_order)
select 
  im.new_id,
  im.old_id,
  case im.old_id
    when '750ecd1af052' then 'خدمات النظافة'
    when '0cca2894b724' then 'خدمات الصيانة'
    when '51b058ee6757' then 'مكافحة الحشرات والقوارض'
    when '467576e4e464' then 'تركيب البلاط والسيراميك'
    when 'e18359e051df' then 'تنسيق الحدائق واللاند سكيب'
  end,
  case im.old_id
    when '750ecd1af052' then 'خدمات النظافة تشمل التنظيف العادي والتنظيف العميق والتنظيف بعد التشطيب وتنظيف فتح منزل وتنظيف المفروشات'
    when '0cca2894b724' then 'خدمات الصيانة تشمل التكييفات والسباكة والكهرباء وجميع الأجهزة المنزلية'
    else ''
  end,
  case im.old_id
    when '750ecd1af052' then 0
    when '0cca2894b724' then 1
    when '51b058ee6757' then 2
    when '467576e4e464' then 3
    when 'e18359e051df' then 4
  end
from id_mapping im;

-- 2️⃣ استيراد الفئات الفرعية (Subcategories)
-- تحديث جدول التحويل بالفئات الفرعية
insert into id_mapping (old_id) values
  -- فئات النظافة
  ('a5b6ee79dee4'), ('dfca2c2f80db'), ('ad33f723957c'), ('de374d13bac2'),
  -- فئات الصيانة  
  ('c3ad56d509c5'), ('e5d38bf7d274'), ('5bf3f2f06d2b'), ('f9efa6649511'),
  ('956b1dccba6e'), ('8c9a5e3f7b21'), ('7d4b8a9c2e61'), ('6f8e3d5a1b42'),
  -- فئات مكافحة الحشرات
  ('4a7c9d2e8f31'), ('3b6d5e9a1c72'),
  -- فئات البلاط
  ('2e8f4a7c9d31'), ('1c7b6d5e9a32'),
  -- فئات الحدائق
  ('9a1c3b6d5e72'), ('8d2e4a7c9f31')
on conflict (old_id) do nothing;

insert into public.service_subcategories (id, category_id, code, name_ar, description_ar, sort_order)
select 
  (select new_id from id_mapping where old_id = subcat_id),
  (select new_id from id_mapping where old_id = cat_id),
  subcat_id,
  name,
  description,
  sort
from (values
  -- خدمات النظافة
  ('a5b6ee79dee4', '750ecd1af052', 'أعمال الرخام', 'كل ما يخص بأعمال الرخام على يد متخصصين', 0),
  ('dfca2c2f80db', '750ecd1af052', 'أعمال الجرانيت', 'كل ما يخص بأعمال الجرانيت على يد متخصصين', 1),
  ('ad33f723957c', '750ecd1af052', 'أعمال السيراميك', 'كل ما يخص بأعمال السيراميك على يد متخصصين', 2),
  ('de374d13bac2', '750ecd1af052', 'أعمال البورسلين', 'كل ما يخص بأعمال البورسلين على يد متخصصين', 3),
  
  -- خدمات الصيانة
  ('c3ad56d509c5', '0cca2894b724', 'خدمات الكهرباء', 'تمديدات وإصلاحات كهربائية', 0),
  ('e5d38bf7d274', '0cca2894b724', 'خدمات السباكة', 'تركيب وإصلاح الأنابيب والتسريبات', 1),
  ('5bf3f2f06d2b', '0cca2894b724', 'خدمات التكييف', 'صيانة وتركيب المكيفات', 2),
  ('f9efa6649511', '0cca2894b724', 'خدمات الدهانات', 'دهان الحوائط والأسقف', 3),
  ('956b1dccba6e', '0cca2894b724', 'خدمات الحدادة', 'أعمال الحديد واللحام', 4),
  ('8c9a5e3f7b21', '0cca2894b724', 'خدمات النجارة', 'تركيب وإصلاح الأبواب والنوافذ', 5),
  ('7d4b8a9c2e61', '0cca2894b724', 'خدمات الأجهزة المنزلية', 'صيانة الثلاجات والغسالات', 6),
  ('6f8e3d5a1b42', '0cca2894b724', 'خدمات البوابات', 'تركيب وصيانة البوابات الأوتوماتيكية', 7),
  
  -- مكافحة الحشرات
  ('4a7c9d2e8f31', '51b058ee6757', 'مكافحة الحشرات', 'رش ومكافحة جميع أنواع الحشرات', 0),
  ('3b6d5e9a1c72', '51b058ee6757', 'مكافحة القوارض', 'القضاء على الفئران والجرذان', 1),
  
  -- تركيب البلاط
  ('2e8f4a7c9d31', '467576e4e464', 'تركيب السيراميك', 'تركيب سيراميك الأرضيات والجدران', 0),
  ('1c7b6d5e9a32', '467576e4e464', 'تركيب البورسلين', 'تركيب بلاط البورسلين', 1),
  
  -- تنسيق الحدائق
  ('9a1c3b6d5e72', 'e18359e051df', 'تنسيق الحدائق', 'تصميم وتنسيق الحدائق المنزلية', 0),
  ('8d2e4a7c9f31', 'e18359e051df', 'أعمال اللاند سكيب', 'تنفيذ مشاريع اللاند سكيب الكاملة', 1)
) as t(subcat_id, cat_id, name, description, sort);

-- 3️⃣ استيراد عينة من الخدمات الأساسية
-- إضافة IDs للخدمات في جدول التحويل
insert into id_mapping (old_id) 
select 'srv_' || generate_series(1, 50)
on conflict do nothing;

-- خدمات الكهرباء
insert into public.services (id, subcategory_id, code, name_ar, description_ar, unit, pricing_type, base_price, sort_order)
values
  (gen_random_uuid(), (select new_id from id_mapping where old_id = 'c3ad56d509c5'), 'ELEC001', 'فحص وإصلاح الأعطال الكهربائية', 'فحص شامل للدوائر الكهربائية وإصلاح الأعطال', 'مرة', 'fixed', 150.00, 1),
  (gen_random_uuid(), (select new_id from id_mapping where old_id = 'c3ad56d509c5'), 'ELEC002', 'تركيب مفاتيح ومخارج كهربائية', 'تركيب وتجديد المفاتيح والمخارج', 'قطعة', 'per_unit', 50.00, 2),
  (gen_random_uuid(), (select new_id from id_mapping where old_id = 'c3ad56d509c5'), 'ELEC003', 'تركيب لوحات كهربائية', 'تركيب لوحات التوزيع الكهربائي', 'لوحة', 'fixed', 800.00, 3),
  (gen_random_uuid(), (select new_id from id_mapping where old_id = 'c3ad56d509c5'), 'ELEC004', 'تمديد أسلاك كهربائية', 'تمديد الأسلاك للإضاءة أو المخارج', 'متر', 'per_unit', 15.00, 4);

-- خدمات السباكة
insert into public.services (id, subcategory_id, code, name_ar, description_ar, unit, pricing_type, base_price, sort_order)
values
  (gen_random_uuid(), (select new_id from id_mapping where old_id = 'e5d38bf7d274'), 'PLMB001', 'كشف وإصلاح التسريبات', 'فحص وإصلاح تسريبات المياه', 'مرة', 'fixed', 200.00, 1),
  (gen_random_uuid(), (select new_id from id_mapping where old_id = 'e5d38bf7d274'), 'PLMB002', 'تسليك المجاري', 'تسليك البالوعات والمجاري المسدودة', 'مرة', 'fixed', 250.00, 2),
  (gen_random_uuid(), (select new_id from id_mapping where old_id = 'e5d38bf7d274'), 'PLMB003', 'تركيب خلاطات ومغاسل', 'تركيب أدوات صحية جديدة', 'قطعة', 'per_unit', 120.00, 3),
  (gen_random_uuid(), (select new_id from id_mapping where old_id = 'e5d38bf7d274'), 'PLMB004', 'تمديد مواسير المياه', 'تمديد شبكة مياه جديدة', 'متر', 'per_unit', 25.00, 4);

-- خدمات التكييف
insert into public.services (id, subcategory_id, code, name_ar, description_ar, unit, pricing_type, base_price, sort_order)
values
  (gen_random_uuid(), (select new_id from id_mapping where old_id = '5bf3f2f06d2b'), 'AC001', 'صيانة دورية للمكيف', 'تنظيف الفلاتر وفحص الغاز', 'وحدة', 'fixed', 180.00, 1),
  (gen_random_uuid(), (select new_id from id_mapping where old_id = '5bf3f2f06d2b'), 'AC002', 'تركيب مكيف جديد', 'فك وتركيب مكيف سبليت', 'وحدة', 'fixed', 350.00, 2),
  (gen_random_uuid(), (select new_id from id_mapping where old_id = '5bf3f2f06d2b'), 'AC003', 'إعادة شحن غاز الفريون', 'شحن غاز التبريد للمكيف', 'وحدة', 'fixed', 200.00, 3),
  (gen_random_uuid(), (select new_id from id_mapping where old_id = '5bf3f2f06d2b'), 'AC004', 'إصلاح أعطال المكيفات', 'إصلاح الأعطال الميكانيكية والكهربائية', 'مرة', 'fixed', 300.00, 4);

-- خدمات الدهانات
insert into public.services (id, subcategory_id, code, name_ar, description_ar, unit, pricing_type, base_price, sort_order)
values
  (gen_random_uuid(), (select new_id from id_mapping where old_id = 'f9efa6649511'), 'PAINT001', 'دهان غرفة كاملة', 'دهان حوائط وسقف بلونين', 'غرفة', 'fixed', 800.00, 1),
  (gen_random_uuid(), (select new_id from id_mapping where old_id = 'f9efa6649511'), 'PAINT002', 'دهان شقة كاملة', 'دهان شقة بمساحة 100 متر', 'شقة', 'fixed', 3500.00, 2),
  (gen_random_uuid(), (select new_id from id_mapping where old_id = 'f9efa6649511'), 'PAINT003', 'معجون وتجليخ', 'تجهيز الحوائط قبل الدهان', 'متر مربع', 'per_unit', 12.00, 3),
  (gen_random_uuid(), (select new_id from id_mapping where old_id = 'f9efa6649511'), 'PAINT004', 'دهان ديكوري', 'دهانات خاصة ونقوش', 'متر مربع', 'per_unit', 35.00, 4);

-- خدمات النظافة
insert into public.services (id, subcategory_id, code, name_ar, description_ar, unit, pricing_type, base_price, sort_order)
values
  (gen_random_uuid(), (select new_id from id_mapping where old_id = 'a5b6ee79dee4'), 'CLEAN001', 'تنظيف شقة عادي', 'تنظيف شامل للشقة', 'مرة', 'fixed', 250.00, 1),
  (gen_random_uuid(), (select new_id from id_mapping where old_id = 'a5b6ee79dee4'), 'CLEAN002', 'تنظيف عميق', 'تنظيف عميق مع تلميع', 'مرة', 'fixed', 450.00, 2),
  (gen_random_uuid(), (select new_id from id_mapping where old_id = 'a5b6ee79dee4'), 'CLEAN003', 'تنظيف بعد التشطيب', 'إزالة آثار التشطيب والدهان', 'متر مربع', 'per_unit', 8.00, 3),
  (gen_random_uuid(), (select new_id from id_mapping where old_id = 'dfca2c2f80db'), 'CLEAN004', 'تنظيف مفروشات', 'تنظيف كنب وسجاد', 'قطعة', 'per_unit', 80.00, 4);

-- مكافحة الحشرات
insert into public.services (id, subcategory_id, code, name_ar, description_ar, unit, pricing_type, base_price, sort_order)
values
  (gen_random_uuid(), (select new_id from id_mapping where old_id = '4a7c9d2e8f31'), 'PEST001', 'رش حشرات عام', 'رش دوري للحشرات الزاحفة والطائرة', 'مرة', 'fixed', 200.00, 1),
  (gen_random_uuid(), (select new_id from id_mapping where old_id = '4a7c9d2e8f31'), 'PEST002', 'مكافحة النمل الأبيض', 'علاج متخصص للنمل الأبيض', 'متر مربع', 'per_unit', 15.00, 2),
  (gen_random_uuid(), (select new_id from id_mapping where old_id = '3b6d5e9a1c72'), 'PEST003', 'مكافحة القوارض', 'القضاء على الفئران والجرذان', 'مرة', 'fixed', 300.00, 3),
  (gen_random_uuid(), (select new_id from id_mapping where old_id = '4a7c9d2e8f31'), 'PEST004', 'معالجة بق الفراش', 'معالجة حرارية وكيميائية', 'غرفة', 'fixed', 400.00, 4);

-- تنسيق الحدائق
insert into public.services (id, subcategory_id, code, name_ar, description_ar, unit, pricing_type, base_price, sort_order)
values
  (gen_random_uuid(), (select new_id from id_mapping where old_id = '9a1c3b6d5e72'), 'GARD001', 'تنسيق حديقة منزلية', 'تصميم وتنفيذ حديقة صغيرة', 'حديقة', 'fixed', 1500.00, 1),
  (gen_random_uuid(), (select new_id from id_mapping where old_id = '9a1c3b6d5e72'), 'GARD002', 'صيانة شهرية للحديقة', 'قص وتشذيب ورعاية', 'شهر', 'fixed', 300.00, 2),
  (gen_random_uuid(), (select new_id from id_mapping where old_id = '8d2e4a7c9f31'), 'GARD003', 'تركيب نظام ري', 'تركيب رشاشات أوتوماتيكية', 'نظام', 'fixed', 2000.00, 3),
  (gen_random_uuid(), (select new_id from id_mapping where old_id = '9a1c3b6d5e72'), 'GARD004', 'زراعة أشجار', 'زراعة أشجار مثمرة أو زينة', 'شجرة', 'per_unit', 150.00, 4);

-- 4️⃣ إضافة أمثلة على مستويات التسعير (Price Tiers)
-- للخدمات التي لها تسعير متدرج
insert into public.service_price_tiers (id, service_id, tier_code, label_ar, price, qty_from, qty_to, sort_order)
select 
  gen_random_uuid(),
  s.id,
  t.tier_code,
  t.label_ar,
  t.price,
  t.qty_from,
  t.qty_to,
  t.sort_order
from public.services s
cross join lateral (
  values
    ('TIER1', 'كمية صغيرة (1-5)', s.base_price, 1, 5, 1),
    ('TIER2', 'كمية متوسطة (6-20)', s.base_price * 0.9, 6, 20, 2),
    ('TIER3', 'كمية كبيرة (21+)', s.base_price * 0.8, 21, null, 3)
) as t(tier_code, label_ar, price, qty_from, qty_to, sort_order)
where s.pricing_type = 'tiered'
limit 10;