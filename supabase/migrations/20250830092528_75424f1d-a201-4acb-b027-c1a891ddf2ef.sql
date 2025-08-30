-- إنشاء جدول للإشعارات
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info', -- info, warning, error, success
  recipient_id UUID NOT NULL,
  sender_id UUID,
  entity_type TEXT, -- maintenance_request, appointment, etc
  entity_id UUID,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول لمواقع الفنيين
CREATE TABLE public.vendor_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إضافة أعمدة الموقع لجدول maintenance_requests
ALTER TABLE public.maintenance_requests 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- تفعيل RLS على الجداول الجديدة
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_locations ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات RLS للإشعارات
CREATE POLICY "المستخدمون يمكنهم رؤية إشعاراتهم"
ON public.notifications 
FOR SELECT 
USING (auth.uid() = recipient_id);

CREATE POLICY "المستخدمون يمكنهم تحديث إشعاراتهم"
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = recipient_id);

CREATE POLICY "الموظفون يمكنهم إنشاء إشعارات"
ON public.notifications 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'technician')
  )
);

-- إنشاء سياسات RLS لمواقع الفنيين
CREATE POLICY "جميع المستخدمين يمكنهم رؤية مواقع الفنيين"
ON public.vendor_locations 
FOR SELECT 
USING (true);

CREATE POLICY "الموظفون والفنيون يمكنهم إدارة المواقع"
ON public.vendor_locations 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND (role IN ('admin', 'manager', 'technician') OR vendor_id IS NOT NULL)
  )
);

-- إنشاء فهارس للأداء
CREATE INDEX idx_notifications_recipient ON public.notifications(recipient_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);
CREATE INDEX idx_vendor_locations_vendor ON public.vendor_locations(vendor_id);
CREATE INDEX idx_vendor_locations_coordinates ON public.vendor_locations(latitude, longitude);
CREATE INDEX idx_maintenance_requests_coordinates ON public.maintenance_requests(latitude, longitude);

-- إنشاء trigger لتحديث updated_at
CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- إنشاء دالة لحساب المسافة بين نقطتين
CREATE OR REPLACE FUNCTION public.calculate_distance(
  lat1 DECIMAL, lon1 DECIMAL, 
  lat2 DECIMAL, lon2 DECIMAL
) RETURNS DECIMAL AS $$
BEGIN
  RETURN (
    6371 * acos(
      cos(radians(lat1)) * cos(radians(lat2)) * 
      cos(radians(lon2) - radians(lon1)) + 
      sin(radians(lat1)) * sin(radians(lat2))
    )
  );
END;
$$ LANGUAGE plpgsql;

-- إنشاء دالة للعثور على أقرب فني
CREATE OR REPLACE FUNCTION public.find_nearest_vendor(
  request_latitude DECIMAL, 
  request_longitude DECIMAL,
  service_specialization TEXT DEFAULT NULL
) RETURNS TABLE (
  vendor_id UUID,
  vendor_name TEXT,
  distance DECIMAL,
  phone TEXT,
  email TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v.id,
    v.name,
    calculate_distance(request_latitude, request_longitude, vl.latitude, vl.longitude) as dist,
    v.phone,
    v.email
  FROM vendors v
  JOIN vendor_locations vl ON v.id = vl.vendor_id
  WHERE v.status = 'active' 
    AND vl.is_active = true
    AND (service_specialization IS NULL OR service_specialization = ANY(v.specialization))
  ORDER BY dist ASC
  LIMIT 5;
END;
$$ LANGUAGE plpgsql;