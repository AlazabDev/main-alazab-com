-- ========================================
-- إصلاح أمني: تقييد الوصول لمعلومات اتصال الموردين
-- ========================================

-- 1. إنشاء view لعرض الموردين مع إخفاء معلومات الاتصال عن غير المصرح لهم
CREATE OR REPLACE VIEW vendors_safe AS
SELECT 
  v.id,
  v.name,
  v.company_name,
  v.specialization,
  v.rating,
  v.status,
  v.hourly_rate,
  v.experience_years,
  v.profile_image,
  v.total_jobs,
  v.created_at,
  v.updated_at,
  -- إخفاء معلومات الاتصال عن غير المصرح لهم
  CASE 
    WHEN has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager') 
    THEN v.phone
    WHEN has_role(auth.uid(), 'staff')
    THEN '***' || RIGHT(v.phone, 4)
    WHEN EXISTS (
      -- السماح برؤية معلومات الاتصال للموردين المخصصين لطلبات المستخدم النشطة
      SELECT 1 FROM maintenance_requests mr
      WHERE mr.assigned_vendor_id = v.id
      AND mr.requested_by = auth.uid()
      AND mr.status IN ('pending', 'in_progress', 'scheduled')
    ) THEN v.phone
    ELSE NULL
  END as phone,
  CASE 
    WHEN has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager')
    THEN v.email
    WHEN EXISTS (
      SELECT 1 FROM maintenance_requests mr
      WHERE mr.assigned_vendor_id = v.id
      AND mr.requested_by = auth.uid()
      AND mr.status IN ('pending', 'in_progress', 'scheduled')
    ) THEN v.email
    ELSE NULL
  END as email,
  CASE 
    WHEN has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager')
    THEN v.address
    ELSE NULL
  END as address
FROM vendors v;

-- 2. منح صلاحيات القراءة للـ view
GRANT SELECT ON vendors_safe TO authenticated;

-- 3. تحديث سياسات RLS لجدول vendors الأصلي لتقييد الوصول المباشر
DROP POLICY IF EXISTS "vendors_select" ON vendors;

-- سياسة للمديرين: وصول كامل
CREATE POLICY "vendors_admin_full_access"
ON vendors
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin') OR 
  has_role(auth.uid(), 'manager')
);

-- سياسة للموظفين: عرض محدود (بدون معلومات اتصال حساسة)
CREATE POLICY "vendors_staff_limited"
ON vendors
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'staff')
);

-- سياسة للعملاء: فقط الموردين المخصصين لطلباتهم النشطة
CREATE POLICY "vendors_customer_assigned"
ON vendors
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM maintenance_requests mr
    WHERE mr.assigned_vendor_id = vendors.id
    AND mr.requested_by = auth.uid()
  )
);

-- سياسة للموردين: يمكنهم رؤية معلومات الموردين الآخرين (بدون تفاصيل حساسة)
CREATE POLICY "vendors_vendor_view"
ON vendors
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'vendor')
);

-- 4. تسجيل ملاحظة أمنية
COMMENT ON VIEW vendors_safe IS 'View آمن لعرض بيانات الموردين مع إخفاء معلومات الاتصال الحساسة حسب صلاحيات المستخدم. يُنصح باستخدام هذا الـ view بدلاً من الاستعلام المباشر من جدول vendors.';