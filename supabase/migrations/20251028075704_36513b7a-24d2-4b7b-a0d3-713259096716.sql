-- ========================================
-- تنظيف قاعدة البيانات - المرحلة 1
-- حذف الجداول والـ Views غير المستخدمة
-- تاريخ: 2025-10-28
-- ========================================

-- المرحلة 1: حذف الجداول المؤقتة وغير المستخدمة بشكل واضح
-- =====================================================================

-- 1. Temp Tables
DROP TABLE IF EXISTS _temp_approvers CASCADE;

-- 2. Mall System (unused - no UI)
DROP TABLE IF EXISTS mall_branches CASCADE;
DROP TABLE IF EXISTS mall_tenants CASCADE;
DROP TABLE IF EXISTS malls CASCADE;

-- 3. Materials/Parts System (no UI implementation)
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS material_requests CASCADE;
DROP TABLE IF EXISTS parts_orders CASCADE;

-- 4. Unused Project Features
DROP TABLE IF EXISTS project_documents CASCADE;
DROP TABLE IF EXISTS project_gallery CASCADE;
DROP TABLE IF EXISTS project_reviews CASCADE;

-- 5. Other Unused Tables
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS internal_teams CASCADE;
DROP TABLE IF EXISTS assets CASCADE;
DROP TABLE IF EXISTS maintenance_reports CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS maintenance_services CASCADE;
DROP TABLE IF EXISTS platform_permissions CASCADE;

-- 6. Duplicate/Unused Role System
DROP TABLE IF EXISTS app_roles CASCADE;

-- 7. Unused Views
DROP VIEW IF EXISTS appointments_staff_secure CASCADE;
DROP VIEW IF EXISTS appointments_staff_view CASCADE;

-- ========================================
-- تنظيف الـ Functions غير المستخدمة
-- ========================================

-- حذف دوال التحقق المكررة/غير المستخدمة
DROP FUNCTION IF EXISTS app_is_vendor(uuid) CASCADE;
DROP FUNCTION IF EXISTS app_is_owner(uuid) CASCADE;
DROP FUNCTION IF EXISTS app_is_admin(uuid) CASCADE;
DROP FUNCTION IF EXISTS app_is_staff(uuid) CASCADE;
DROP FUNCTION IF EXISTS is_vendor(uuid) CASCADE;
DROP FUNCTION IF EXISTS fn_role() CASCADE;
DROP FUNCTION IF EXISTS fn_has_role(text[]) CASCADE;
DROP FUNCTION IF EXISTS fn_claim(text) CASCADE;
DROP FUNCTION IF EXISTS fn_claim_uuid(text) CASCADE;
DROP FUNCTION IF EXISTS log_customer_data_access() CASCADE;
DROP FUNCTION IF EXISTS mask_customer_phone(text, text) CASCADE;
DROP FUNCTION IF EXISTS vendor_appointments_func() CASCADE;
DROP FUNCTION IF EXISTS update_summary_tables() CASCADE;
DROP FUNCTION IF EXISTS update_summary_data() CASCADE;
DROP FUNCTION IF EXISTS update_project_progress_trigger() CASCADE;

-- ========================================
-- تنظيف الـ Types غير المستخدمة
-- ========================================

-- حذف enum types غير مستخدمة إن وجدت
DROP TYPE IF EXISTS payment_status_t CASCADE;
DROP TYPE IF EXISTS currency_t CASCADE;

-- ========================================
-- ملاحظات مهمة
-- ========================================

-- تم الاحتفاظ بالجداول التالية لأنها مستخدمة:
-- ✅ maintenance_requests - جوهر النظام
-- ✅ projects, project_phases, project_updates - نظام المشاريع
-- ✅ vendors - نظام الموردين
-- ✅ properties - نظام العقارات
-- ✅ appointments - نظام المواعيد
-- ✅ invoices, invoice_items - نظام الفواتير
-- ✅ profiles - معلومات المستخدمين
-- ✅ user_roles - صلاحيات المستخدمين
-- ✅ gallery_images - معرض الصور
-- ✅ notifications - الإشعارات
-- ✅ audit_logs - تتبع الأحداث
-- ✅ error_logs - تتبع الأخطاء
-- ✅ companies, branches - معلومات الشركات
-- ✅ categories - التصنيفات
-- ✅ expenses - المصروفات

COMMENT ON SCHEMA public IS 'Cleaned up database - removed 28 unused tables and views - 2025-10-28';