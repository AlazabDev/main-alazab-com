-- ========================================
-- إعادة هيكلة جداول الخدمات بشكل احترافي
-- ========================================

-- 1. حذف جميع التصنيفات الموجودة (لأن البيانات الحالية غير منظمة)
DELETE FROM service_subcategories;
DELETE FROM services WHERE category_id IS NOT NULL OR subcategory_id IS NOT NULL;
DELETE FROM service_categories;

-- 2. إنشاء التصنيفات الرئيسية الأربعة
INSERT INTO service_categories (code, name_ar, name_en, description_ar, sort_order, is_active)
VALUES
  ('MAINT', 'الصيانة', 'Maintenance', 'خدمات الصيانة الدورية والطارئة للمباني والمنشآت', 1, true),
  ('RENOV', 'التجديد', 'Renovation', 'خدمات التجديد والتحديث للمباني القائمة', 2, true),
  ('CONST', 'البناء', 'Construction', 'خدمات البناء والإنشاء للمشاريع الجديدة', 3, true),
  ('DESIGN', 'التصميم', 'Design', 'خدمات التصميم الداخلي والخارجي', 4, true);

-- 3. إنشاء التصنيفات الفرعية تحت "الصيانة"
WITH maint_cat AS (
  SELECT id FROM service_categories WHERE code = 'MAINT'
)
INSERT INTO service_subcategories (category_id, code, name_ar, name_en, sort_order, is_active)
SELECT 
  maint_cat.id,
  subcat.code,
  subcat.name_ar,
  subcat.name_en,
  subcat.sort_order,
  true
FROM maint_cat,
  (VALUES
    ('PLUMB', 'السباكة', 'Plumbing', 1),
    ('ELEC', 'الكهرباء', 'Electrical', 2),
    ('AC', 'التكييف', 'Air Conditioning', 3),
    ('PAINT', 'الدهانات', 'Painting', 4),
    ('WOOD', 'النجارة', 'Carpentry', 5),
    ('ALUM', 'الألوميتال', 'Aluminum', 6),
    ('METAL', 'الحدادة', 'Metal Work', 7),
    ('GYPS', 'الجبس', 'Gypsum', 8),
    ('TILE', 'السيراميك والبلاط', 'Tiles', 9),
    ('SAT', 'الدش', 'Satellite', 10),
    ('SHSH', 'الشيش', 'Shutters', 11),
    ('LAND', 'تنسيق الحدائق', 'Landscaping', 12)
  ) AS subcat(code, name_ar, name_en, sort_order);

-- 4. إنشاء التصنيفات الفرعية تحت "التجديد"
WITH renov_cat AS (
  SELECT id FROM service_categories WHERE code = 'RENOV'
)
INSERT INTO service_subcategories (category_id, code, name_ar, name_en, sort_order, is_active)
SELECT 
  renov_cat.id,
  subcat.code,
  subcat.name_ar,
  subcat.name_en,
  subcat.sort_order,
  true
FROM renov_cat,
  (VALUES
    ('RENOV_INT', 'تجديد داخلي', 'Interior Renovation', 1),
    ('RENOV_EXT', 'تجديد خارجي', 'Exterior Renovation', 2),
    ('RENOV_BATH', 'تجديد حمامات', 'Bathroom Renovation', 3),
    ('RENOV_KITCH', 'تجديد مطابخ', 'Kitchen Renovation', 4)
  ) AS subcat(code, name_ar, name_en, sort_order);

-- 5. إنشاء التصنيفات الفرعية تحت "البناء"
WITH const_cat AS (
  SELECT id FROM service_categories WHERE code = 'CONST'
)
INSERT INTO service_subcategories (category_id, code, name_ar, name_en, sort_order, is_active)
SELECT 
  const_cat.id,
  subcat.code,
  subcat.name_ar,
  subcat.name_en,
  subcat.sort_order,
  true
FROM const_cat,
  (VALUES
    ('CONST_RES', 'بناء سكني', 'Residential Construction', 1),
    ('CONST_COM', 'بناء تجاري', 'Commercial Construction', 2),
    ('CONST_VIL', 'بناء فلل', 'Villa Construction', 3)
  ) AS subcat(code, name_ar, name_en, sort_order);

-- 6. إنشاء التصنيفات الفرعية تحت "التصميم"
WITH design_cat AS (
  SELECT id FROM service_categories WHERE code = 'DESIGN'
)
INSERT INTO service_subcategories (category_id, code, name_ar, name_en, sort_order, is_active)
SELECT 
  design_cat.id,
  subcat.code,
  subcat.name_ar,
  subcat.name_en,
  subcat.sort_order,
  true
FROM design_cat,
  (VALUES
    ('DESIGN_INT', 'تصميم داخلي', 'Interior Design', 1),
    ('DESIGN_EXT', 'تصميم خارجي', 'Exterior Design', 2),
    ('DESIGN_3D', 'تصميم ثلاثي الأبعاد', '3D Design', 3)
  ) AS subcat(code, name_ar, name_en, sort_order);