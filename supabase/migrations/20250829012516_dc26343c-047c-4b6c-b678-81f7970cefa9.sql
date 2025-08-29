-- إنشاء جدول الملفات الشخصية للمستخدمين
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تفعيل Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- إنشاء السياسات
CREATE POLICY "المستخدمون يمكنهم رؤية ملفاتهم الشخصية" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "المستخدمون يمكنهم تحديث ملفاتهم الشخصية" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "المستخدمون يمكنهم إنشاء ملفاتهم الشخصية" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- إنشاء جدول الفنيين والموردين
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company_name TEXT,
  specialization TEXT[] DEFAULT '{}',
  phone TEXT,
  email TEXT,
  address TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  total_jobs INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  profile_image TEXT,
  experience_years INTEGER DEFAULT 0,
  hourly_rate DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "جميع المستخدمين يمكنهم رؤية الموردين" 
ON public.vendors 
FOR SELECT 
USING (true);

CREATE POLICY "المديرون يمكنهم إدارة الموردين" 
ON public.vendors 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role IN ('admin', 'manager')
));

-- إنشاء جدول طلبات الصيانة
CREATE TABLE public.maintenance_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT,
  client_email TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  service_type TEXT NOT NULL,
  estimated_cost DECIMAL(10,2),
  actual_cost DECIMAL(10,2),
  assigned_vendor_id UUID REFERENCES public.vendors(id),
  requested_by UUID REFERENCES auth.users(id),
  estimated_completion DATE,
  actual_completion TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "جميع المستخدمين يمكنهم رؤية طلبات الصيانة" 
ON public.maintenance_requests 
FOR SELECT 
USING (true);

CREATE POLICY "المستخدمون يمكنهم إنشاء طلبات الصيانة" 
ON public.maintenance_requests 
FOR INSERT 
WITH CHECK (auth.uid() = requested_by);

CREATE POLICY "المديرون والمختصون يمكنهم تحديث الطلبات" 
ON public.maintenance_requests 
FOR UPDATE 
USING (
  auth.uid() = requested_by OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('admin', 'manager', 'technician')
  )
);

-- إنشاء جدول المشاريع
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  client_name TEXT NOT NULL,
  location TEXT NOT NULL,
  budget DECIMAL(12,2),
  actual_cost DECIMAL(12,2) DEFAULT 0,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'completed', 'on_hold', 'cancelled')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  start_date DATE,
  end_date DATE,
  actual_end_date DATE,
  manager_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "جميع المستخدمين يمكنهم رؤية المشاريع" 
ON public.projects 
FOR SELECT 
USING (true);

CREATE POLICY "المديرون يمكنهم إدارة المشاريع" 
ON public.projects 
FOR ALL 
USING (
  auth.uid() = manager_id OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('admin', 'manager')
  )
);

-- إنشاء جدول التعليقات والملاحظات
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('maintenance_request', 'project')),
  entity_id UUID NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "جميع المستخدمين يمكنهم رؤية التعليقات" 
ON public.comments 
FOR SELECT 
USING (true);

CREATE POLICY "المستخدمون يمكنهم إضافة تعليقات" 
ON public.comments 
FOR INSERT 
WITH CHECK (auth.uid() = author_id);

-- إنشاء trigger لتحديث updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إضافة triggers للجداول
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at
    BEFORE UPDATE ON public.vendors
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_maintenance_requests_updated_at
    BEFORE UPDATE ON public.maintenance_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON public.comments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- إدراج بيانات تجريبية للموردين
INSERT INTO public.vendors (name, company_name, specialization, phone, email, address, rating, total_jobs, hourly_rate, experience_years) VALUES
('أحمد محمد علي', 'شركة الأمان للصيانة', ARRAY['سباكة', 'كهرباء'], '01234567890', 'ahmed@alamanmaintenance.com', '123 شارع الحرية، القاهرة', 4.8, 150, 75.00, 8),
('فاطمة أحمد', 'مؤسسة النور للديكور', ARRAY['دهانات', 'ديكور'], '01098765432', 'fatima@alnoor.com', '456 شارع النهضة، الجيزة', 4.6, 89, 65.00, 5),
('محمد حسن', 'شركة البناء المتطور', ARRAY['تبليط', 'سيراميك'], '01155443322', 'mohammed@albinaa.com', '789 شارع السلام، الإسكندرية', 4.9, 200, 80.00, 12),
('مريم سالم', 'ورشة الإتقان', ARRAY['نجارة', 'أثاث'], '01566778899', 'maryam@alitqan.com', '321 شارع الوحدة، المنصورة', 4.7, 75, 70.00, 6),
('عبدالله أحمد', 'مؤسسة الخبرة للتكييف', ARRAY['تكييف', 'تبريد'], '01677889900', 'abdullah@alkhibra.com', '654 شارع الجمهورية، طنطا', 4.5, 95, 85.00, 9);

-- إدراج بيانات تجريبية لطلبات الصيانة
INSERT INTO public.maintenance_requests (title, description, location, client_name, client_phone, priority, status, service_type, estimated_cost, assigned_vendor_id) VALUES
('إصلاح تسريب المياه', 'يوجد تسريب في مواسير المياه بالحمام الرئيسي', 'مول سيتي ستارز، التجمع الخامس', 'إدارة مول سيتي ستارز', '0223456789', 'high', 'pending', 'سباكة', 350.00, (SELECT id FROM public.vendors WHERE name = 'أحمد محمد علي' LIMIT 1)),
('صيانة نظام التكييف', 'تنظيف وصيانة دورية لوحدات التكييف المركزي', 'مجمع المحلات التجارية، مدينة نصر', 'شركة الأندلس التجارية', '0212345678', 'medium', 'in_progress', 'تكييف', 1200.00, (SELECT id FROM public.vendors WHERE name = 'عبدالله أحمد' LIMIT 1)),
('تجديد طلاء المحل', 'إعادة طلاء جدران المحل وإصلاح بعض العيوب', 'شارع التسعين، التجمع الأول', 'محل الأناقة للأزياء', '0101234567', 'low', 'pending', 'دهانات', 800.00, NULL);

-- إدراج بيانات تجريبية للمشاريع
INSERT INTO public.projects (name, description, client_name, location, budget, status, progress, start_date, end_date) VALUES
('تجديد مجمع تجاري', 'تجديد شامل لمجمع تجاري يضم 50 محل', 'شركة العقارات المتحدة', 'شارع العروبة، مدينة نصر', 150000.00, 'in_progress', 65, '2024-01-15', '2024-04-15'),
('صيانة مركز تسوق', 'صيانة دورية شاملة لجميع أنظمة المركز', 'إدارة مركز كايرو فيستيفال', 'التجمع الخامس، القاهرة الجديدة', 75000.00, 'planning', 10, '2024-03-01', '2024-05-30');