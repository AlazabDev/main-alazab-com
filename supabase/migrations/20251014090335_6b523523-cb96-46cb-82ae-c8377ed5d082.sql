-- حذف تصنيف النظافة
DELETE FROM service_categories WHERE code = 'CLEAN';

-- حذف جميع التصنيفات الفرعية الحالية
DELETE FROM service_subcategories;

-- إضافة التصنيفات الفرعية للصيانة (MAINT)
WITH maint_cat AS (SELECT id FROM service_categories WHERE code = 'MAINT')
INSERT INTO service_subcategories (category_id, code, name_ar, name_en, sort_order, is_active)
SELECT id, 'SHISH', 'شيش', 'Shutters', 1, true FROM maint_cat
UNION ALL SELECT id, 'ALUMETAL', 'ألوميتال', 'Aluminum', 2, true FROM maint_cat
UNION ALL SELECT id, 'AC_CHILLER', 'تكييف شيلر', 'Chiller AC', 3, true FROM maint_cat
UNION ALL SELECT id, 'SHOWER', 'دش', 'Shower', 4, true FROM maint_cat
UNION ALL SELECT id, 'PAINT', 'دهانات', 'Painting', 5, true FROM maint_cat
UNION ALL SELECT id, 'PLUMB', 'السباكة', 'Plumbing', 6, true FROM maint_cat
UNION ALL SELECT id, 'ELECTRIC', 'كهرباء', 'Electrical', 7, true FROM maint_cat
UNION ALL SELECT id, 'AC', 'تكييف', 'Air Conditioning', 8, true FROM maint_cat
UNION ALL SELECT id, 'CARP', 'نجارة', 'Carpentry', 9, true FROM maint_cat
UNION ALL SELECT id, 'GYPSUM', 'أعمال الجبس', 'Gypsum Works', 10, true FROM maint_cat
UNION ALL SELECT id, 'IRON', 'أعمال الحدادة', 'Ironworks', 11, true FROM maint_cat
UNION ALL SELECT id, 'GLASS', 'أعمال زجاج', 'Glass Works', 12, true FROM maint_cat
UNION ALL SELECT id, 'EQUIP_REPAIR', 'إصلاح معدات', 'Equipment Repair', 13, true FROM maint_cat
UNION ALL SELECT id, 'GREASE_TRAP', 'تركيب جريس تراب', 'Grease Trap Installation', 14, true FROM maint_cat;

-- إضافة تصنيفات فرعية للتجديد (RENOV)
WITH renov_cat AS (SELECT id FROM service_categories WHERE code = 'RENOV')
INSERT INTO service_subcategories (category_id, code, name_ar, name_en, sort_order, is_active)
SELECT id, 'RENOV_PAINT', 'دهان تجديد', 'Renovation Painting', 1, true FROM renov_cat
UNION ALL SELECT id, 'RENOV_FLOOR', 'تجديد أرضيات', 'Floor Renovation', 2, true FROM renov_cat
UNION ALL SELECT id, 'RENOV_WALLS', 'تجديد جدران', 'Wall Renovation', 3, true FROM renov_cat;

-- إضافة تصنيفات فرعية للإنشاءات (CONST)
WITH const_cat AS (SELECT id FROM service_categories WHERE code = 'CONST')
INSERT INTO service_subcategories (category_id, code, name_ar, name_en, sort_order, is_active)
SELECT id, 'CONST_STRUCT', 'إنشاءات هيكلية', 'Structural Construction', 1, true FROM const_cat
UNION ALL SELECT id, 'CONST_FINISH', 'تشطيبات', 'Finishing Works', 2, true FROM const_cat
UNION ALL SELECT id, 'CONST_CIVIL', 'أعمال مدنية', 'Civil Works', 3, true FROM const_cat;

-- إضافة تصنيفات فرعية للتصميم (DESIGN)
WITH design_cat AS (SELECT id FROM service_categories WHERE code = 'DESIGN')
INSERT INTO service_subcategories (category_id, code, name_ar, name_en, sort_order, is_active)
SELECT id, 'DESIGN_INT', 'تصميم داخلي', 'Interior Design', 1, true FROM design_cat
UNION ALL SELECT id, 'DESIGN_EXT', 'تصميم خارجي', 'Exterior Design', 2, true FROM design_cat
UNION ALL SELECT id, 'DESIGN_LAND', 'تصميم مناظر طبيعية', 'Landscape Design', 3, true FROM design_cat;