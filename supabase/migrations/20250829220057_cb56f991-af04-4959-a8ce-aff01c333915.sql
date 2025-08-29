-- إنشاء جدول العقارات
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('residential', 'commercial', 'industrial', 'mixed_use')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive', 'sold')),
  address TEXT NOT NULL,
  area NUMERIC,
  value NUMERIC,
  manager_id UUID,
  region_id UUID,
  floors INTEGER,
  rooms INTEGER,
  bathrooms INTEGER,
  parking_spaces INTEGER,
  description TEXT,
  amenities TEXT[],
  maintenance_schedule TEXT,
  last_inspection_date DATE,
  next_inspection_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول المواعيد
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rescheduled')),
  property_id UUID REFERENCES public.properties(id),
  vendor_id UUID REFERENCES public.vendors(id),
  maintenance_request_id UUID,
  location TEXT,
  notes TEXT,
  reminder_sent BOOLEAN NOT NULL DEFAULT false,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تفعيل RLS للعقارات
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- سياسات العقارات
CREATE POLICY "جميع المستخدمين يمكنهم رؤية العقارات" 
ON public.properties 
FOR SELECT 
USING (true);

CREATE POLICY "المديرون يمكنهم إدارة العقارات" 
ON public.properties 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- تفعيل RLS للمواعيد
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- سياسات المواعيد
CREATE POLICY "جميع المستخدمين يمكنهم رؤية المواعيد" 
ON public.appointments 
FOR SELECT 
USING (true);

CREATE POLICY "المستخدمون يمكنهم إنشاء مواعيدهم" 
ON public.appointments 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "المديرون والمختصون يمكنهم تحديث المواعيد" 
ON public.appointments 
FOR UPDATE 
USING (
  auth.uid() = created_by OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'technician')
  )
);

-- إنشاء تريجر لتحديث updated_at للعقارات
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- إنشاء تريجر لتحديث updated_at للمواعيد
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- تفعيل realtime للجداول الجديدة
ALTER PUBLICATION supabase_realtime ADD TABLE public.properties;
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;

-- إضافة REPLICA IDENTITY للجداول الجديدة
ALTER TABLE public.properties REPLICA IDENTITY FULL;
ALTER TABLE public.appointments REPLICA IDENTITY FULL;