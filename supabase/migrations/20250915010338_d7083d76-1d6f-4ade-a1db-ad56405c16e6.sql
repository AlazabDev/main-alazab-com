-- إصلاح الأمان بخطوات آمنة لتجنب deadlock

-- 1. إصلاح مشكلة الوصول العام لجدول profiles أولاً
DROP POLICY IF EXISTS "Everyone can read profiles" ON public.profiles;

-- إنشاء سياسة آمنة للملفات الشخصية
CREATE POLICY "Users can view own profile only" ON public.profiles
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- 2. إزالة Views الخطيرة
DROP VIEW IF EXISTS public.safe_maintenance_requests;
DROP FUNCTION IF EXISTS public.get_safe_maintenance_requests();

-- 3. إصلاح appointments_public view
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