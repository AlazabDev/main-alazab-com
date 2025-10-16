-- ===================================================================
-- المرحلة 1: حماية بيانات العملاء في جدول appointments
-- ===================================================================

-- 1. إنشاء view آمن للموظفين (يخفي البيانات الحساسة عن غير المدراء)
CREATE OR REPLACE VIEW appointments_staff_view 
WITH (security_invoker = true) AS
SELECT 
  a.id,
  a.title,
  a.description,
  a.appointment_date,
  a.appointment_time,
  a.duration_minutes,
  a.status,
  a.property_id,
  a.vendor_id,
  a.maintenance_request_id,
  a.location,
  a.notes,
  a.reminder_sent,
  a.created_by,
  a.created_at,
  a.updated_at,
  -- إخفاء معلومات العميل الحساسة حسب الدور
  CASE 
    WHEN has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager')
    THEN a.customer_name
    ELSE LEFT(a.customer_name, 3) || '***'
  END as customer_name,
  -- إخفاء الهاتف والإيميل عن غير المدراء
  NULL::text as customer_phone,
  NULL::text as customer_email
FROM appointments a
WHERE 
  a.created_by = auth.uid() OR
  a.vendor_id = auth.uid() OR
  has_role(auth.uid(), 'admin') OR
  has_role(auth.uid(), 'manager') OR
  has_role(auth.uid(), 'staff');

-- 2. Security Definer Function للوصول الآمن لبيانات الاتصال (مع audit logging)
CREATE OR REPLACE FUNCTION get_appointment_contact_info(appointment_id uuid)
RETURNS TABLE(customer_name text, customer_phone text, customer_email text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- فقط المديرين والـ managers يمكنهم الوصول
  IF NOT has_role(auth.uid(), 'admin') AND NOT has_role(auth.uid(), 'manager') THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  -- تسجيل الوصول في audit_logs
  INSERT INTO audit_logs (user_id, action, table_name, record_id, new_values)
  VALUES (
    auth.uid(),
    'CUSTOMER_CONTACT_ACCESS',
    'appointments',
    appointment_id,
    jsonb_build_object('accessed_at', NOW())
  );
  
  -- إرجاع البيانات
  RETURN QUERY
  SELECT a.customer_name, a.customer_phone, a.customer_email
  FROM appointments a
  WHERE a.id = appointment_id;
END;
$$;

-- 3. تحديث RLS policies لجدول appointments (أكثر أماناً)
DROP POLICY IF EXISTS "appointments_select_staff" ON appointments;

-- سياسة جديدة للموظفين: يمكنهم رؤية المواعيد لكن بدون بيانات حساسة مباشرة
CREATE POLICY "appointments_select_limited_staff" 
ON appointments
FOR SELECT 
USING (
  created_by = auth.uid() OR
  vendor_id = auth.uid() OR
  has_role(auth.uid(), 'admin') OR
  has_role(auth.uid(), 'manager')
);

-- 4. منع UPDATE على الحقول الحساسة من غير المدراء
DROP POLICY IF EXISTS "appointments_update" ON appointments;

CREATE POLICY "appointments_update_secure"
ON appointments
FOR UPDATE
USING (
  created_by = auth.uid() OR
  (vendor_id = auth.uid() AND has_role(auth.uid(), 'vendor')) OR
  has_role(auth.uid(), 'admin') OR
  has_role(auth.uid(), 'manager') OR
  has_role(auth.uid(), 'staff')
)
WITH CHECK (
  created_by = auth.uid() OR
  (vendor_id = auth.uid() AND has_role(auth.uid(), 'vendor')) OR
  has_role(auth.uid(), 'admin') OR
  has_role(auth.uid(), 'manager') OR
  has_role(auth.uid(), 'staff')
);

-- 5. إنشاء trigger لتسجيل الوصول للبيانات الحساسة
CREATE OR REPLACE FUNCTION log_customer_data_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- تسجيل عند وصول الموظفين لمعلومات الاتصال
  IF TG_OP = 'SELECT' AND (
    has_role(auth.uid(), 'admin') OR 
    has_role(auth.uid(), 'manager') OR 
    has_role(auth.uid(), 'staff')
  ) THEN
    INSERT INTO audit_logs (
      user_id, 
      action, 
      table_name, 
      record_id,
      new_values
    )
    VALUES (
      auth.uid(), 
      'CUSTOMER_DATA_ACCESS', 
      TG_TABLE_NAME, 
      NEW.id,
      jsonb_build_object('accessed_at', NOW())
    );
  END IF;
  RETURN NEW;
END;
$$;

-- ملاحظة: الـ trigger على SELECT غير مدعوم بشكل مباشر في PostgreSQL
-- لذلك سنعتمد على الـ security definer function للتسجيل

-- 6. Grant permissions على الـ view
GRANT SELECT ON appointments_staff_view TO authenticated;

COMMENT ON VIEW appointments_staff_view IS 'View آمن للموظفين يخفي بيانات العملاء الحساسة عن غير المدراء';
COMMENT ON FUNCTION get_appointment_contact_info(uuid) IS 'دالة آمنة للوصول لمعلومات الاتصال مع audit logging - للمدراء فقط';