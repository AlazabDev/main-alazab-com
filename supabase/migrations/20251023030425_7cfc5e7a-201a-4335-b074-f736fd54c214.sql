-- إضافة البيانات بدون latitude/longitude (غير موجودة في الجدول)
INSERT INTO public.properties (name, type, address, area, rooms, status, manager_id, region_id)
VALUES 
  ('مول سيتي سنتر', 'commercial', 'القاهرة - مدينة نصر - عباس العقاد', 5000, 150, 'active', 
   (SELECT id FROM profiles LIMIT 1), NULL),
  ('فرع المعادي', 'retail', 'القاهرة - المعادي - شارع 9', 800, 25, 'active',
   (SELECT id FROM profiles LIMIT 1), NULL),
  ('مقر الإدارة الرئيسي', 'office', 'الجيزة - الدقي - شارع التحرير', 1200, 40, 'active',
   (SELECT id FROM profiles LIMIT 1), NULL)
ON CONFLICT DO NOTHING;

-- إضافة مهام عمل تجريبية (بعد التحقق من وجود بيانات)
DO $$
DECLARE
  v_request_id uuid;
  v_staff_id uuid;
BEGIN
  -- الحصول على أول طلب
  SELECT id INTO v_request_id FROM maintenance_requests LIMIT 1;
  
  -- الحصول على أول موظف
  SELECT id INTO v_staff_id FROM profiles WHERE role IN ('staff', 'technician') LIMIT 1;
  
  -- إذا لم يوجد موظف، استخدم أي مستخدم
  IF v_staff_id IS NULL THEN
    SELECT id INTO v_staff_id FROM profiles LIMIT 1;
  END IF;
  
  IF v_request_id IS NOT NULL AND v_staff_id IS NOT NULL THEN
    INSERT INTO public.work_tasks (request_id, task_type, description, assigned_to, status, priority, estimated_hours, actual_hours)
    VALUES 
      (v_request_id, 'inspection', 'فحص نظام التكييف', v_staff_id, 'pending', 'high', 2, NULL)
    ON CONFLICT DO NOTHING;
    
    -- إضافة مهمة ثانية إن وجد طلب ثاني
    SELECT id INTO v_request_id FROM maintenance_requests LIMIT 1 OFFSET 1;
    IF v_request_id IS NOT NULL THEN
      INSERT INTO public.work_tasks (request_id, task_type, description, assigned_to, status, priority, estimated_hours, actual_hours)
      VALUES 
        (v_request_id, 'repair', 'إصلاح التسريب', v_staff_id, 'in_progress', 'medium', 4, 2)
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- إضافة مهمة ثالثة إن وجد طلب ثالث
    SELECT id INTO v_request_id FROM maintenance_requests LIMIT 1 OFFSET 2;
    IF v_request_id IS NOT NULL THEN
      INSERT INTO public.work_tasks (request_id, task_type, description, assigned_to, status, priority, estimated_hours, actual_hours)
      VALUES 
        (v_request_id, 'maintenance', 'صيانة دورية', v_staff_id, 'completed', 'low', 1, 1)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
END $$;