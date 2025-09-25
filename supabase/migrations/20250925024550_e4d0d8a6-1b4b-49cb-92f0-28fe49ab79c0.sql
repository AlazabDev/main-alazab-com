-- تحديث نظام دورة حياة طلبات الصيانة المتكاملة

-- إنشاء enum للحالات المحدثة مع دورة حياة كاملة
CREATE TYPE maintenance_status AS ENUM (
  'draft',           -- مسودة
  'submitted',       -- مقدم  
  'acknowledged',    -- مستلم ومؤكد
  'assigned',        -- مخصص لفني
  'scheduled',       -- مجدول
  'in_progress',     -- قيد التنفيذ
  'inspection',      -- فحص وتقييم
  'waiting_parts',   -- انتظار قطع غيار
  'completed',       -- مكتمل
  'billed',          -- تم الفوترة
  'paid',            -- مدفوع
  'closed',          -- مغلق
  'cancelled',       -- ملغي
  'on_hold'          -- متوقف مؤقتاً
);

-- إنشاء enum لأنواع التحديثات
CREATE TYPE update_type AS ENUM (
  'status_change',
  'assignment',
  'scheduling',
  'cost_estimate',
  'completion',
  'feedback',
  'payment',
  'note'
);

-- إنشاء جدول تتبع دورة الحياة
CREATE TABLE IF NOT EXISTS public.request_lifecycle (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL,
  status maintenance_status NOT NULL,
  update_type update_type NOT NULL,
  updated_by UUID,
  update_notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول مهام العمل التفصيلية
CREATE TABLE IF NOT EXISTS public.work_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL,
  task_name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  assigned_to UUID,
  estimated_duration INTEGER, -- بالدقائق
  actual_duration INTEGER,
  materials_needed TEXT[],
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول التقييمات والمتابعة
CREATE TABLE IF NOT EXISTS public.request_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL,
  reviewer_id UUID,
  reviewer_type TEXT DEFAULT 'customer', -- customer, technician, supervisor
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  service_quality INTEGER CHECK (service_quality >= 1 AND service_quality <= 5),
  timeliness INTEGER CHECK (timeliness >= 1 AND timeliness <= 5),
  professionalism INTEGER CHECK (professionalism >= 1 AND professionalism <= 5),
  feedback_text TEXT,
  photos TEXT[],
  would_recommend BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول التنبيهات والإشعارات المجدولة
CREATE TABLE IF NOT EXISTS public.scheduled_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL,
  notification_type TEXT NOT NULL, -- reminder, follow_up, escalation
  recipient_id UUID NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  message_template TEXT NOT NULL,
  variables JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending', -- pending, sent, failed
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تحديث جدول maintenance_requests لدعم دورة الحياة المحسنة
ALTER TABLE public.maintenance_requests 
ADD COLUMN IF NOT EXISTS workflow_stage maintenance_status DEFAULT 'submitted',
ADD COLUMN IF NOT EXISTS sla_due_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS escalation_level INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS quality_score NUMERIC(3,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS follow_up_required BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS follow_up_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE;

-- تمكين RLS على الجداول الجديدة
ALTER TABLE public.request_lifecycle ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_notifications ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان لجدول دورة الحياة
CREATE POLICY "Users can view request lifecycle" ON public.request_lifecycle
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM maintenance_requests mr 
    WHERE mr.id = request_lifecycle.request_id 
    AND (mr.requested_by = auth.uid() OR mr.assigned_vendor_id = auth.uid())
  ) OR 
  get_current_user_role() = ANY(ARRAY['admin', 'manager', 'staff'])
);

CREATE POLICY "Staff can manage request lifecycle" ON public.request_lifecycle
FOR ALL USING (
  get_current_user_role() = ANY(ARRAY['admin', 'manager', 'staff'])
);

-- سياسات الأمان لجدول مهام العمل
CREATE POLICY "Users can view work tasks" ON public.work_tasks
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM maintenance_requests mr 
    WHERE mr.id = work_tasks.request_id 
    AND (mr.requested_by = auth.uid() OR mr.assigned_vendor_id = auth.uid())
  ) OR 
  get_current_user_role() = ANY(ARRAY['admin', 'manager', 'staff'])
);

CREATE POLICY "Assigned users can update work tasks" ON public.work_tasks
FOR UPDATE USING (
  assigned_to = auth.uid() OR 
  get_current_user_role() = ANY(ARRAY['admin', 'manager', 'staff'])
);

CREATE POLICY "Staff can manage work tasks" ON public.work_tasks
FOR ALL USING (
  get_current_user_role() = ANY(ARRAY['admin', 'manager', 'staff'])
);

-- سياسات الأمان للتقييمات
CREATE POLICY "Users can create their reviews" ON public.request_reviews
FOR INSERT WITH CHECK (
  reviewer_id = auth.uid()
);

CREATE POLICY "Users can view relevant reviews" ON public.request_reviews
FOR SELECT USING (
  reviewer_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM maintenance_requests mr 
    WHERE mr.id = request_reviews.request_id 
    AND (mr.requested_by = auth.uid() OR mr.assigned_vendor_id = auth.uid())
  ) OR 
  get_current_user_role() = ANY(ARRAY['admin', 'manager', 'staff'])
);

-- سياسات الأمان للإشعارات المجدولة
CREATE POLICY "Users can view their notifications" ON public.scheduled_notifications
FOR SELECT USING (
  recipient_id = auth.uid() OR
  get_current_user_role() = ANY(ARRAY['admin', 'manager', 'staff'])
);

CREATE POLICY "Staff can manage notifications" ON public.scheduled_notifications
FOR ALL USING (
  get_current_user_role() = ANY(ARRAY['admin', 'manager', 'staff'])
);

-- إنشاء فنكشن لتسجيل تحديثات دورة الحياة تلقائياً
CREATE OR REPLACE FUNCTION log_request_lifecycle()
RETURNS TRIGGER AS $$
BEGIN
  -- تسجيل تغيير الحالة
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.request_lifecycle (
      request_id, 
      status, 
      update_type, 
      updated_by, 
      update_notes,
      metadata
    ) VALUES (
      NEW.id,
      NEW.workflow_stage,
      'status_change',
      auth.uid(),
      CONCAT('Status changed from ', OLD.status, ' to ', NEW.status),
      jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status)
    );
  END IF;

  -- تسجيل تخصيص فني
  IF TG_OP = 'UPDATE' AND OLD.assigned_vendor_id IS DISTINCT FROM NEW.assigned_vendor_id THEN
    INSERT INTO public.request_lifecycle (
      request_id, 
      status, 
      update_type, 
      updated_by, 
      update_notes,
      metadata
    ) VALUES (
      NEW.id,
      NEW.workflow_stage,
      'assignment',
      auth.uid(),
      'Vendor assignment updated',
      jsonb_build_object('old_vendor', OLD.assigned_vendor_id, 'new_vendor', NEW.assigned_vendor_id)
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- إنشاء trigger لتسجيل دورة الحياة
CREATE TRIGGER maintenance_request_lifecycle_trigger
  AFTER UPDATE ON public.maintenance_requests
  FOR EACH ROW EXECUTE FUNCTION log_request_lifecycle();

-- إنشاء فنكشن لحساب SLA
CREATE OR REPLACE FUNCTION calculate_sla_due_date(
  priority_level TEXT,
  service_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) RETURNS TIMESTAMP WITH TIME ZONE AS $$
DECLARE
  hours_to_add INTEGER;
BEGIN
  -- تحديد ساعات SLA حسب الأولوية ونوع الخدمة
  CASE priority_level
    WHEN 'high' THEN 
      CASE service_type
        WHEN 'emergency' THEN hours_to_add := 4;
        WHEN 'urgent' THEN hours_to_add := 8;
        ELSE hours_to_add := 24;
      END CASE;
    WHEN 'medium' THEN hours_to_add := 48;
    WHEN 'low' THEN hours_to_add := 72;
    ELSE hours_to_add := 48;
  END CASE;

  RETURN created_at + (hours_to_add || ' hours')::INTERVAL;
END;
$$ LANGUAGE plpgsql;

-- تحديث الطلبات الموجودة لحساب SLA
UPDATE public.maintenance_requests 
SET sla_due_date = calculate_sla_due_date(priority, service_type, created_at::TIMESTAMP WITH TIME ZONE)
WHERE sla_due_date IS NULL;

-- إنشاء trigger لحساب SLA للطلبات الجديدة
CREATE OR REPLACE FUNCTION set_sla_due_date()
RETURNS TRIGGER AS $$
BEGIN
  NEW.sla_due_date := calculate_sla_due_date(NEW.priority, NEW.service_type, NEW.created_at);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_sla_trigger
  BEFORE INSERT ON public.maintenance_requests
  FOR EACH ROW EXECUTE FUNCTION set_sla_due_date();