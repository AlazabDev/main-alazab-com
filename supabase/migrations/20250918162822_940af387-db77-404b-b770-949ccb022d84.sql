-- إكمال إعدادات الإنتاج وإصلاح التحذيرات الأمنية

-- 1. إصلاح مسار البحث في الدوال لتكون آمنة
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
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- إصلاح الدوال الأخرى
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS text AS $$
DECLARE
  year_month TEXT;
  sequence_num INTEGER;
BEGIN
  year_month := to_char(CURRENT_DATE, 'YYYYMM');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 8) AS INTEGER)), 0) + 1
  INTO sequence_num
  FROM public.invoices
  WHERE invoice_number LIKE 'INV-' || year_month || '-%';
  
  RETURN 'INV-' || year_month || '-' || LPAD(sequence_num::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.set_invoice_number()
RETURNS trigger AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := generate_invoice_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.calculate_item_total()
RETURNS trigger AS $$
BEGIN
  NEW.total_price = NEW.quantity * NEW.unit_price;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_vendor(uid uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.user_id = uid AND p.role = 'vendor'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_staff(uid uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.user_id = uid AND p.role IN ('admin','staff','manager','technician')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- 2. إنشاء فهارس للأداء الأمثل
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

-- 3. إضافة triggers للجداول المهمة
CREATE TRIGGER update_maintenance_requests_updated_at
    BEFORE UPDATE ON public.maintenance_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON public.invoices
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at
    BEFORE UPDATE ON public.notifications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 4. تحسين إعدادات الأداء
-- تحديث إحصائيات الجداول
ANALYZE public.maintenance_requests;
ANALYZE public.appointments;
ANALYZE public.profiles;
ANALYZE public.invoices;
ANALYZE public.notifications;

-- 5. إنشاء views مُحسنة للتقارير
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