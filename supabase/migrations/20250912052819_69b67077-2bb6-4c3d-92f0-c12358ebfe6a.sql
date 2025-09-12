-- إصلاح شامل لقاعدة البيانات لتكون بسيطة ومرنة للعملاء

-- 1. إزالة جميع السياسات المعقدة وإعادة إنشائها بشكل بسيط
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

-- 2. تبسيط جدول profiles
ALTER TABLE public.profiles DROP COLUMN IF EXISTS vendor_id;
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'customer';

-- 3. إنشاء سياسات بسيطة للملفات الشخصية
CREATE POLICY "Everyone can read profiles" ON public.profiles
FOR SELECT USING (true);

CREATE POLICY "Users can manage their own profile" ON public.profiles
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. تبسيط سياسات طلبات الصيانة
DROP POLICY IF EXISTS "insert_customer_requests" ON public.maintenance_requests;
DROP POLICY IF EXISTS "select_own_requests" ON public.maintenance_requests;
DROP POLICY IF EXISTS "update_assigned_requests" ON public.maintenance_requests;

-- سياسات بسيطة لطلبات الصيانة
CREATE POLICY "Anyone can create maintenance requests" ON public.maintenance_requests
FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view maintenance requests" ON public.maintenance_requests
FOR SELECT USING (true);

CREATE POLICY "Users can update their own requests" ON public.maintenance_requests
FOR UPDATE USING (auth.uid() = requested_by OR auth.uid() = assigned_vendor_id);

-- 5. تبسيط سياسات المواعيد
DROP POLICY IF EXISTS "appointments_staff_all_select" ON public.appointments;
DROP POLICY IF EXISTS "appointments_user_own_select" ON public.appointments;
DROP POLICY IF EXISTS "appointments_vendor_assigned_select" ON public.appointments;
DROP POLICY IF EXISTS "المديرون والمختصون يمكنهم تحديث ا" ON public.appointments;
DROP POLICY IF EXISTS "المستخدمون يمكنهم إنشاء مواعيدهم" ON public.appointments;

CREATE POLICY "Anyone can manage appointments" ON public.appointments
FOR ALL USING (true)
WITH CHECK (true);

-- 6. تبسيط سياسات الفواتير
CREATE POLICY "Anyone can manage invoices" ON public.invoices
FOR ALL USING (true)
WITH CHECK (true);

CREATE POLICY "Anyone can manage invoice items" ON public.invoice_items
FOR ALL USING (true)
WITH CHECK (true);

-- 7. إنشاء دالة لإنشاء profile تلقائياً عند التسجيل
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
    RETURN NEW; -- تجاهل الأخطاء للتأكد من عدم منع التسجيل
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. إنشاء trigger لإنشاء profile تلقائياً
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. تبسيط سياسات الإشعارات
DROP POLICY IF EXISTS "المستخدمون يمكنهم تحديث إشعاراتهم" ON public.notifications;
DROP POLICY IF EXISTS "المستخدمون يمكنهم رؤية إشعاراتهم" ON public.notifications;
DROP POLICY IF EXISTS "الموظفون يمكنهم إنشاء إشعارات" ON public.notifications;

CREATE POLICY "Users see their notifications" ON public.notifications
FOR SELECT USING (auth.uid() = recipient_id);

CREATE POLICY "Users update their notifications" ON public.notifications
FOR UPDATE USING (auth.uid() = recipient_id);

CREATE POLICY "Anyone can create notifications" ON public.notifications
FOR INSERT WITH CHECK (true);

-- 10. إعداد الجداول للتحديثات المباشرة
ALTER TABLE public.maintenance_requests REPLICA IDENTITY FULL;
ALTER TABLE public.appointments REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.invoices REPLICA IDENTITY FULL;

-- إضافة الجداول للنشر المباشر
ALTER PUBLICATION supabase_realtime ADD TABLE public.maintenance_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.invoices;

-- 11. إضافة بيانات تجريبية للاختبار
INSERT INTO public.profiles (user_id, role, first_name, last_name, phone) 
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'customer', 'أحمد', 'محمد', '01234567890'),
  ('00000000-0000-0000-0000-000000000002', 'vendor', 'محمد', 'أحمد', '01234567891')
ON CONFLICT (user_id) DO NOTHING;