-- إصلاح مشاكل الأمان الحرجة بدون تعقيد العملاء

-- 1. إصلاح مشكلة maintenance_requests - إزالة الوصول العام وحماية بيانات العملاء
DROP POLICY IF EXISTS "جميع المستخدمين يمكنهم رؤية طلبات" ON public.maintenance_requests;

-- السماح للعملاء برؤية طلباتهم فقط + الموظفين والفنيين المختصين
CREATE POLICY "العملاء والموظفون يمكنهم رؤية الطلبات المناسبة" 
ON public.maintenance_requests 
FOR SELECT 
USING (
  auth.uid() = requested_by OR  -- صاحب الطلب
  (EXISTS ( 
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = ANY (ARRAY['admin', 'manager', 'technician'])
  )) OR  -- الموظفين
  (assigned_vendor_id IS NOT NULL AND EXISTS ( 
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.vendor_id = maintenance_requests.assigned_vendor_id
  ))  -- الفني المعين
);

-- 2. حماية جدول vendor_locations من الوصول العام
DROP POLICY IF EXISTS "جميع المستخدمين يمكنهم رؤية مواقع" ON public.vendor_locations;

-- 3. حماية جدول notes من الوصول العام (إذا كان يحتوي على ملاحظات داخلية)
DROP POLICY IF EXISTS "public can read countries" ON public.notes;

-- السماح للموظفين فقط برؤية الملاحظات الداخلية
CREATE POLICY "الموظفون يمكنهم رؤية الملاحظات" 
ON public.notes 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = ANY (ARRAY['admin', 'manager', 'technician'])
  )
);

-- 4. تفعيل RLS على الجداول المفقودة (إن وجدت)
-- فحص وتفعيل RLS على جميع الجداول التي تحتاج حماية
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT IN ('categories', 'subcategories', 'services', 'branches')  -- الجداول المرجعية العامة
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.tablename);
    END LOOP;
END
$$;