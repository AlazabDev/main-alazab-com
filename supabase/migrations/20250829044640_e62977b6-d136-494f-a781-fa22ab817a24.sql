-- إضافة الحقول المفقودة لجدول طلبات الصيانة
ALTER TABLE public.maintenance_requests 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS preferred_date DATE,
ADD COLUMN IF NOT EXISTS preferred_time VARCHAR(50),
ADD COLUMN IF NOT EXISTS urgency_level priority_level DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS customer_notes TEXT,
ADD COLUMN IF NOT EXISTS vendor_notes TEXT,
ADD COLUMN IF NOT EXISTS completion_photos TEXT[],
ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 5);

-- إنشاء جدول تتبع حالة الطلبات إذا لم يكن موجود
CREATE TABLE IF NOT EXISTS public.request_status_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES public.maintenance_requests(id) ON DELETE CASCADE,
  old_status request_status,
  new_status request_status NOT NULL,
  changed_by UUID,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT
);

-- إنشاء جدول الإشعارات
CREATE TABLE IF NOT EXISTS public.request_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES public.maintenance_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  type VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- تمكين RLS
ALTER TABLE public.request_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_notifications ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان لتاريخ الحالة
CREATE POLICY "Users can view status history for their requests" 
ON public.request_status_history FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.maintenance_requests 
    WHERE id = request_status_history.request_id 
    AND (requested_by = auth.uid() OR assigned_to = auth.uid())
  )
);

CREATE POLICY "Users can insert status history" 
ON public.request_status_history FOR INSERT 
WITH CHECK (auth.uid() = changed_by);

-- سياسات الأمان للإشعارات
CREATE POLICY "Users can view their notifications" 
ON public.request_notifications FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" 
ON public.request_notifications FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their notifications" 
ON public.request_notifications FOR UPDATE 
USING (auth.uid() = user_id);

-- إنشاء فنكشن لإنشاء الإشعارات تلقائياً
CREATE OR REPLACE FUNCTION public.create_request_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- إشعار للمستخدم الذي طلب الصيانة
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.request_notifications (
      request_id, user_id, type, title, message
    ) VALUES (
      NEW.id,
      NEW.requested_by,
      'request_created',
      'تم إنشاء طلب صيانة جديد',
      'تم إنشاء طلب الصيانة "' || NEW.title || '" بنجاح'
    );
  END IF;
  
  -- إشعار عند تغيير الحالة
  IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    INSERT INTO public.request_notifications (
      request_id, user_id, type, title, message
    ) VALUES (
      NEW.id,
      NEW.requested_by,
      'status_changed',
      'تم تحديث حالة طلب الصيانة',
      'تم تغيير حالة طلب "' || NEW.title || '" إلى: ' || NEW.status::text
    );
    
    -- إشعار للفني المكلف إذا وجد
    IF NEW.assigned_to IS NOT NULL THEN
      INSERT INTO public.request_notifications (
        request_id, user_id, type, title, message
      ) VALUES (
        NEW.id,
        NEW.assigned_to,
        'assignment_update',
        'تحديث في المهمة المكلفة',
        'تم تحديث طلب "' || NEW.title || '" المكلف إليك'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- إنشاء المشغل
DROP TRIGGER IF EXISTS maintenance_request_notifications ON public.maintenance_requests;
CREATE TRIGGER maintenance_request_notifications
  AFTER INSERT OR UPDATE ON public.maintenance_requests
  FOR EACH ROW EXECUTE FUNCTION public.create_request_notification();

-- تمكين Real-time للجداول
ALTER TABLE public.maintenance_requests REPLICA IDENTITY FULL;
ALTER TABLE public.request_notifications REPLICA IDENTITY FULL;
ALTER TABLE public.request_status_history REPLICA IDENTITY FULL;