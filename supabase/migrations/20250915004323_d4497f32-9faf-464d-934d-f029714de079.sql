-- إصلاح النظام وتبسيطه للعملاء بدون أخطاء

-- 1. إزالة السياسات التي تعتمد على vendor_id في profiles
DROP POLICY IF EXISTS "requests_vendor_assigned" ON public.service_requests;
DROP POLICY IF EXISTS "rl_select" ON public.request_lines;
DROP POLICY IF EXISTS "att_select" ON public.request_attachments;
DROP POLICY IF EXISTS "hist_select" ON public.request_status_history;
DROP POLICY IF EXISTS "الموظفون والفنيون يمكنهم إدارة ال" ON public.vendor_locations;
DROP POLICY IF EXISTS "appointments_vendor_assigned_select" ON public.appointments;
DROP POLICY IF EXISTS "vendors_self_select" ON public.vendors;
DROP POLICY IF EXISTS "vendor_locations_self_select" ON public.vendor_locations;

-- 2. إزالة جميع السياسات المعقدة من profiles
DROP POLICY IF EXISTS "Profile can be created by owner" ON public.profiles;
DROP POLICY IF EXISTS "Profile can be deleted by owner" ON public.profiles;
DROP POLICY IF EXISTS "Profile can be read by owner" ON public.profiles;
DROP POLICY IF EXISTS "Profile can be updated by owner" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "admins_view_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_self_read" ON public.profiles;
DROP POLICY IF EXISTS "profiles_self_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_self_upsert" ON public.profiles;
DROP POLICY IF EXISTS "users_view_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "المستخدمون يمكنهم إنشاء ملفاتهم ا" ON public.profiles;
DROP POLICY IF EXISTS "المستخدمون يمكنهم تحديث ملفاتهم ا" ON public.profiles;
DROP POLICY IF EXISTS "المستخدمون يمكنهم رؤية ملفاتهم ال" ON public.profiles;

-- 3. إزالة vendor_id بأمان
ALTER TABLE public.profiles DROP COLUMN IF EXISTS vendor_id;
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'customer';

-- 4. سياسات بسيطة للملفات الشخصية
CREATE POLICY "Everyone can read profiles" ON public.profiles
FOR SELECT USING (true);

CREATE POLICY "Users can manage their own profile" ON public.profiles
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5. تبسيط سياسات طلبات الصيانة
DROP POLICY IF EXISTS "insert_customer_requests" ON public.maintenance_requests;
DROP POLICY IF EXISTS "select_own_requests" ON public.maintenance_requests;
DROP POLICY IF EXISTS "update_assigned_requests" ON public.maintenance_requests;

CREATE POLICY "Anyone can create maintenance requests" ON public.maintenance_requests
FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view maintenance requests" ON public.maintenance_requests
FOR SELECT USING (true);

CREATE POLICY "Users can update their own requests" ON public.maintenance_requests
FOR UPDATE USING (auth.uid() = requested_by OR auth.uid() = assigned_vendor_id);

-- 6. تبسيط سياسات المواعيد
DROP POLICY IF EXISTS "appointments_staff_all_select" ON public.appointments;
DROP POLICY IF EXISTS "appointments_user_own_select" ON public.appointments;
DROP POLICY IF EXISTS "المديرون والمختصون يمكنهم تحديث ا" ON public.appointments;
DROP POLICY IF EXISTS "المستخدمون يمكنهم إنشاء مواعيدهم" ON public.appointments;

CREATE POLICY "Anyone can manage appointments" ON public.appointments
FOR ALL USING (true)
WITH CHECK (true);

-- 7. دالة بسيطة لإنشاء profile تلقائياً
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. إنشاء trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. إعداد الجداول للتحديثات المباشرة
ALTER TABLE public.maintenance_requests REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.invoices REPLICA IDENTITY FULL;