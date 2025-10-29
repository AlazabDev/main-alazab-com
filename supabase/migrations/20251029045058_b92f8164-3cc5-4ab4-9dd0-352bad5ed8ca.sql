-- إضافة أعمدة latitude و longitude لجدول properties
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- إضافة تعليق توضيحي
COMMENT ON COLUMN properties.latitude IS 'Latitude coordinate for property location';
COMMENT ON COLUMN properties.longitude IS 'Longitude coordinate for property location';

-- تحديث سياسات RLS لجدول vendors لتسمح للمستخدمين بإضافة vendors
DROP POLICY IF EXISTS vendors_insert_policy ON vendors;
DROP POLICY IF EXISTS vendors_update_policy ON vendors;
DROP POLICY IF EXISTS vendors_delete_policy ON vendors;

CREATE POLICY vendors_insert_staff ON vendors
FOR INSERT
TO public
WITH CHECK (is_staff(auth.uid()));

CREATE POLICY vendors_update_staff ON vendors
FOR UPDATE
TO public
USING (is_staff(auth.uid()));

CREATE POLICY vendors_delete_staff ON vendors
FOR DELETE
TO public
USING (is_staff(auth.uid()));