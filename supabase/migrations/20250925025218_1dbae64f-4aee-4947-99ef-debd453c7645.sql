-- إصلاح التحذيرات الأمنية للفنكشنات الجديدة

-- إصلاح log_request_lifecycle function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- إصلاح calculate_sla_due_date function
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
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- إصلاح set_sla_due_date function
CREATE OR REPLACE FUNCTION set_sla_due_date()
RETURNS TRIGGER AS $$
BEGIN
  NEW.sla_due_date := calculate_sla_due_date(NEW.priority, NEW.service_type, NEW.created_at);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;