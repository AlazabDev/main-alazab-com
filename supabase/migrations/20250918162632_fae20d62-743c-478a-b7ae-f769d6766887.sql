-- إصلاح الأمان بحذر وتجنب التضارب

-- 1. إزالة Views الخطيرة أولاً
DROP VIEW IF EXISTS public.safe_maintenance_requests;
DROP FUNCTION IF EXISTS public.get_safe_maintenance_requests();
DROP VIEW IF EXISTS public.request_list_vw;

-- 2. إصلاح appointments_public view ليكون security_invoker
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

-- 3. إنشاء view آمن للملفات الشخصية بدون معلومات حساسة
CREATE OR REPLACE VIEW public.profiles_safe 
WITH (security_invoker=on) AS
SELECT 
  id,
  user_id,
  first_name,
  last_name,
  role,
  created_at
FROM public.profiles;

-- 4. إزالة الدوال الخطيرة
DROP FUNCTION IF EXISTS public.mask_sensitive_data(text, text);
DROP FUNCTION IF EXISTS public.should_mask_data();