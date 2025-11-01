-- إضافة RLS policies لجدول properties

-- تفعيل RLS على جدول properties
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- السماح للجميع بقراءة العقارات النشطة
CREATE POLICY "السماح بقراءة العقارات النشطة"
ON public.properties
FOR SELECT
USING (status = 'active');

-- السماح للمستخدمين المسجلين بإنشاء عقاراتهم
CREATE POLICY "السماح بإنشاء العقارات للمستخدمين"
ON public.properties
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- السماح للمديرين بتحديث العقارات الخاصة بهم
CREATE POLICY "السماح بتحديث العقارات لمديريها"
ON public.properties
FOR UPDATE
USING (manager_id = auth.uid());

-- السماح للمديرين بحذف العقارات الخاصة بهم
CREATE POLICY "السماح بحذف العقارات لمديريها"
ON public.properties
FOR DELETE
USING (manager_id = auth.uid());