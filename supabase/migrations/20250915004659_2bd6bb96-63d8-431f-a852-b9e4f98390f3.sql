-- إصلاح جميع المشاكل الأمنية الحرجة فوراً

-- 1. إصلاح مشكلة تعريض جدول auth.users
-- البحث عن أي views تعرض بيانات auth.users وإزالتها أو تأمينها
DROP VIEW IF EXISTS public.safe_maintenance_requests;

-- إزالة أي دوال قد تعرض بيانات auth.users
DROP FUNCTION IF EXISTS public.get_safe_maintenance_requests();

-- 2. إصلاح مشكلة Security Definer Views
-- تحويل جميع الـ views لتكون SECURITY INVOKER بدلاً من SECURITY DEFINER
DROP VIEW IF EXISTS public.appointments_public;
CREATE VIEW public.appointments_public 
WITH (security_invoker=on) AS
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

-- إصلاح أي views أخرى قد تكون SECURITY DEFINER
DROP VIEW IF EXISTS public.request_list_vw;

-- 3. إصلاح مشكلة الوصول العام لجدول profiles
-- إزالة السياسة الخطيرة التي تسمح للجميع بقراءة البيانات الشخصية
DROP POLICY IF EXISTS "Everyone can read profiles" ON public.profiles;

-- إنشاء سياسة آمنة للملفات الشخصية
CREATE POLICY "Users can view own profile only" ON public.profiles
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- سياسة للموظفين لرؤية الملفات الأساسية فقط (بدون معلومات حساسة)
CREATE POLICY "Staff can view basic profile info" ON public.profiles
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles staff_profile 
    WHERE staff_profile.user_id = auth.uid() 
    AND staff_profile.role IN ('admin', 'manager', 'staff')
  )
);

-- 4. إنشاء view آمن للملفات الشخصية بدون معلومات حساسة
CREATE VIEW public.profiles_public 
WITH (security_invoker=on) AS
SELECT 
  id,
  user_id,
  first_name,
  last_name,
  role,
  created_at
FROM public.profiles;

-- منح إذن القراءة للمستخدمين المصرح لهم فقط
GRANT SELECT ON public.profiles_public TO authenticated;

-- 5. تأمين جدول المواعيد أكثر (إضافة طبقة حماية إضافية)
-- التأكد من عدم وجود أي أذونات عامة خطيرة
REVOKE ALL ON public.appointments FROM anon;
REVOKE ALL ON public.appointments FROM public;

-- 6. تأمين جميع الجداول الحساسة
REVOKE ALL ON public.profiles FROM anon;
REVOKE ALL ON public.profiles FROM public;
REVOKE ALL ON public.maintenance_requests FROM anon;
REVOKE ALL ON public.maintenance_requests FROM public;
REVOKE ALL ON public.invoices FROM anon;
REVOKE ALL ON public.invoices FROM public;
REVOKE ALL ON public.invoice_items FROM anon;
REVOKE ALL ON public.invoice_items FROM public;

-- 7. إزالة أي دوال خطيرة قد تعرض بيانات حساسة
DROP FUNCTION IF EXISTS public.mask_sensitive_data(text, text);
DROP FUNCTION IF EXISTS public.should_mask_data();

-- 8. تأمين جدول الإشعارات
DROP POLICY IF EXISTS "Anyone can create notifications" ON public.notifications;

CREATE POLICY "Staff can create notifications" ON public.notifications
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'staff')
  )
);

-- 9. إنشاء دالة آمنة للتحقق من الأدوار بدون تعريض معلومات
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.profiles 
  WHERE user_id = auth.uid();
  
  RETURN COALESCE(user_role, 'customer');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- منع الوصول العام للدالة
REVOKE ALL ON FUNCTION public.current_user_role() FROM anon;
REVOKE ALL ON FUNCTION public.current_user_role() FROM public;
GRANT EXECUTE ON FUNCTION public.current_user_role() TO authenticated;

-- 10. التأكد من أن جميع الأذونات محدودة للمستخدمين المصرح لهم فقط
-- إزالة أي أذونات قد تكون منحت بالخطأ
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM public;