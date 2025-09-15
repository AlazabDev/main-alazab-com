-- إصلاح مشكلة أمنية خطيرة: حماية البيانات الشخصية للعملاء في جدول المواعيد

-- 1. إزالة السياسة الخطيرة التي تسمح بالوصول العام
DROP POLICY IF EXISTS "Anyone can manage appointments" ON public.appointments;

-- 2. إنشاء سياسات آمنة ومحدودة للمواعيد
-- السياسة الأولى: المستخدمون المصرح لهم فقط يمكنهم رؤية المواعيد
CREATE POLICY "Authenticated users can view relevant appointments" ON public.appointments
FOR SELECT TO authenticated
USING (
  -- المستخدم الذي أنشأ الموعد
  auth.uid() = created_by 
  OR 
  -- الفني المكلف بالموعد
  auth.uid() = vendor_id
  OR
  -- الموظفون والإداريون (من خلال جدول profiles)
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'technician', 'staff')
  )
);

-- السياسة الثانية: إنشاء المواعيد للمستخدمين المصرح لهم فقط
CREATE POLICY "Authenticated users can create appointments" ON public.appointments
FOR INSERT TO authenticated
WITH CHECK (
  -- المستخدم يمكنه إنشاء موعد لنفسه فقط
  auth.uid() = created_by
  OR
  -- الموظفون يمكنهم إنشاء مواعيد للآخرين
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'technician', 'staff')
  )
);

-- السياسة الثالثة: تحديث المواعيد محدود للمخولين
CREATE POLICY "Authorized users can update appointments" ON public.appointments
FOR UPDATE TO authenticated
USING (
  -- صاحب الموعد
  auth.uid() = created_by 
  OR 
  -- الفني المكلف
  auth.uid() = vendor_id
  OR
  -- الموظفون والإداريون
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'technician', 'staff')
  )
)
WITH CHECK (
  -- نفس شروط الرؤية للتحديث
  auth.uid() = created_by 
  OR 
  auth.uid() = vendor_id
  OR
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'technician', 'staff')
  )
);

-- السياسة الرابعة: حذف المواعيد للإداريين وأصحاب المواعيد فقط
CREATE POLICY "Authorized users can delete appointments" ON public.appointments
FOR DELETE TO authenticated
USING (
  -- صاحب الموعد
  auth.uid() = created_by 
  OR
  -- الإداريون فقط
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- 3. إصلاح سياسات طلبات الصيانة أيضاً لحماية البيانات الشخصية
DROP POLICY IF EXISTS "Anyone can create maintenance requests" ON public.maintenance_requests;
DROP POLICY IF EXISTS "Anyone can view maintenance requests" ON public.maintenance_requests;

-- سياسات آمنة لطلبات الصيانة
CREATE POLICY "Authenticated users can create maintenance requests" ON public.maintenance_requests
FOR INSERT TO authenticated
WITH CHECK (
  -- المستخدم ينشئ طلب لنفسه
  auth.uid() = requested_by
  OR
  -- الموظفون يمكنهم إنشاء طلبات للآخرين
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'technician', 'staff')
  )
);

CREATE POLICY "Authorized users can view maintenance requests" ON public.maintenance_requests
FOR SELECT TO authenticated
USING (
  -- صاحب الطلب
  auth.uid() = requested_by 
  OR 
  -- الفني المكلف
  auth.uid() = assigned_vendor_id
  OR
  -- الموظفون والإداريون
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'technician', 'staff')
  )
);

-- 4. إنشاء view آمن للبيانات العامة بدون معلومات شخصية حساسة
CREATE OR REPLACE VIEW public.appointments_public AS
SELECT 
  id,
  title,
  appointment_date,
  appointment_time,
  duration_minutes,
  status,
  location,
  created_at,
  property_id,
  maintenance_request_id
FROM public.appointments;

-- منح إذن القراءة للـ view العام للمستخدمين المصرح لهم فقط
GRANT SELECT ON public.appointments_public TO authenticated;

-- 5. إزالة أي أذونات عامة خطيرة
REVOKE ALL ON public.appointments FROM anon;
REVOKE ALL ON public.appointments FROM public;
REVOKE ALL ON public.maintenance_requests FROM anon;
REVOKE ALL ON public.maintenance_requests FROM public;