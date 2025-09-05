-- إصلاح مشكلة الأمان: إزالة الوصول العام لجدول طلبات الصيانة
-- هذا الإصلاح يحمي البيانات الشخصية للعملاء من الوصول غير المصرح به

-- حذف السياسة التي تسمح بالوصول العام لجميع المستخدمين
DROP POLICY IF EXISTS "جميع المستخدمين يمكنهم رؤية طلبات" ON maintenance_requests;

-- التأكد من وجود السياسات الآمنة فقط للوصول المصرح به:
-- 1. المستخدمون يمكنهم رؤية طلباتهم فقط
-- 2. الموظفون يمكنهم رؤية جميع الطلبات
-- 3. الفنيون المُعينون يمكنهم رؤية الطلبات المُكلفين بها

-- إنشاء سياسة محدثة للوصول الآمن (إذا لم تكن موجودة)
DO $$
BEGIN
    -- التحقق من وجود السياسة الآمنة للعملاء والموظفين
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'maintenance_requests' 
        AND policyname = 'العملاء والموظفون يمكنهم رؤية الط'
    ) THEN
        CREATE POLICY "العملاء والموظفون يمكنهم رؤية الط" 
        ON maintenance_requests 
        FOR SELECT 
        USING (
            (auth.uid() = requested_by) OR 
            (EXISTS (
                SELECT 1 FROM profiles 
                WHERE user_id = auth.uid() 
                AND role = ANY(ARRAY['admin', 'manager', 'technician'])
            )) OR 
            (assigned_vendor_id IS NOT NULL AND EXISTS (
                SELECT 1 FROM profiles 
                WHERE user_id = auth.uid() 
                AND vendor_id = maintenance_requests.assigned_vendor_id
            ))
        );
    END IF;
END $$;