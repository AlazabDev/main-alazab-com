-- إصلاح triggers والإعدادات بدون تعارض

-- 1. إصلاح الدوال الأمنية مع مسار البحث الصحيح
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, role, first_name, last_name, phone)
  VALUES (
    NEW.id,
    'customer',
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. إنشاء فهارس الأداء
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_status ON public.maintenance_requests (status);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_created_at ON public.maintenance_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_assigned_vendor ON public.maintenance_requests (assigned_vendor_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_requested_by ON public.maintenance_requests (requested_by);

CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments (appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments (status);
CREATE INDEX IF NOT EXISTS idx_appointments_created_by ON public.appointments (created_by);
CREATE INDEX IF NOT EXISTS idx_appointments_vendor_id ON public.appointments (vendor_id);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (role);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles (user_id);

CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices (status);
CREATE INDEX IF NOT EXISTS idx_invoices_created_by ON public.invoices (created_by);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON public.invoices (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications (recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON public.notifications (read_at);

-- 3. إنشاء views للتقارير
CREATE OR REPLACE VIEW public.maintenance_requests_summary 
WITH (security_invoker=on) AS
SELECT 
  DATE_TRUNC('month', created_at) as month,
  status,
  COUNT(*) as request_count,
  AVG(estimated_cost) as avg_estimated_cost,
  AVG(actual_cost) as avg_actual_cost
FROM public.maintenance_requests
GROUP BY DATE_TRUNC('month', created_at), status;

CREATE OR REPLACE VIEW public.appointments_summary 
WITH (security_invoker=on) AS
SELECT 
  DATE_TRUNC('month', created_at) as month,
  status,
  COUNT(*) as appointment_count
FROM public.appointments
GROUP BY DATE_TRUNC('month', created_at), status;

-- 4. تحديث إحصائيات الجداول
ANALYZE public.maintenance_requests;
ANALYZE public.appointments;
ANALYZE public.profiles;
ANALYZE public.invoices;
ANALYZE public.notifications;