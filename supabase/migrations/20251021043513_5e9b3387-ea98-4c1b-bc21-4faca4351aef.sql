-- حذف الجداول القديمة وغير المستخدمة لتنظيف قاعدة البيانات

-- 1. حذف جداول نظام المدونة القديم (غير مستخدم)
DROP TABLE IF EXISTS posts CASCADE;

-- 2. حذف جداول نظام العمل القديم (مكرر مع maintenance_requests)
DROP TABLE IF EXISTS work_orders CASCADE;
DROP TABLE IF EXISTS wo_media CASCADE;

-- 3. حذف جداول نظام الاشتراكات (غير مستخدم)
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS subscription_invoices CASCADE;

-- 4. حذف جداول الاتصالات القديمة (غير مستخدمة)
DROP TABLE IF EXISTS vendor_communications CASCADE;

-- 5. حذف جداول التخطيط (غير مستخدمة)
DROP TABLE IF EXISTS user_vendor_map CASCADE;

-- 6. حذف جداول الإشعارات المجدولة (غير مستخدمة)
DROP TABLE IF EXISTS scheduled_notifications CASCADE;

-- 7. حذف جدول الموافقات القديم (لدينا request_approvals)
DROP TABLE IF EXISTS approvals CASCADE;

-- 8. حذف جداول الملخصات القديمة (يمكن إعادة بنائها من البيانات)
DROP TABLE IF EXISTS appointments_summary_secure CASCADE;
DROP TABLE IF EXISTS maintenance_requests_summary_secure CASCADE;

-- 9. تنظيف Views القديمة أو غير المستخدمة
DROP VIEW IF EXISTS appointments_secure CASCADE;
DROP VIEW IF EXISTS vendor_appointments CASCADE;
DROP VIEW IF EXISTS table_row_counts CASCADE;

-- 10. إعادة إنشاء view مفيد للمواعيد (بشكل محسّن)
CREATE OR REPLACE VIEW appointments_staff_secure AS
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
  CASE 
    WHEN has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager') 
    THEN a.customer_name
    ELSE left(a.customer_name, 3) || '***'
  END as customer_name,
  CASE 
    WHEN has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager') 
    THEN a.customer_phone
    ELSE NULL
  END as customer_phone,
  CASE 
    WHEN has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager') 
    THEN a.customer_email
    ELSE NULL
  END as customer_email
FROM appointments a
WHERE 
  a.created_by = auth.uid() 
  OR a.vendor_id = auth.uid()
  OR has_role(auth.uid(), 'admin')
  OR has_role(auth.uid(), 'manager')
  OR has_role(auth.uid(), 'staff');

COMMENT ON VIEW appointments_staff_secure IS 'عرض آمن للمواعيد مع إخفاء البيانات الحساسة بناءً على صلاحيات المستخدم';