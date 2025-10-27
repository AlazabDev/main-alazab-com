-- تعديل عمود hourly_rate إلى unit_rate في جدول vendors
ALTER TABLE vendors 
RENAME COLUMN hourly_rate TO unit_rate;

-- تحديث التعليقات
COMMENT ON COLUMN vendors.unit_rate IS 'سعر الوحدة للخدمة (بدلاً من السعر بالساعة)';