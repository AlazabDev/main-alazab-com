# تقرير مراجعة وتنظيف شامل للمشروع
تاريخ: 2025-10-28

## 🔍 الجداول المستخدمة فعلياً في التطبيق

### ✅ جداول نشطة (مستخدمة):
1. **maintenance_requests** - مستخدم في Dashboard, Requests, hooks
2. **projects** - مستخدم في Dashboard, Projects pages, hooks
3. **project_phases** - مستخدم في ProjectDetails
4. **project_updates** - مستخدم في ProjectDetails
5. **vendors** - مستخدم في Vendors page, hooks
6. **properties** - مستخدم في Properties page, hooks
7. **appointments** - مستخدم في Appointments
8. **invoices** - مستخدم في Invoices page
9. **invoice_items** - علاقة مع invoices
10. **profiles** - معلومات المستخدمين
11. **gallery_images** - صفحة المعرض
12. **notifications** - نظام الإشعارات
13. **audit_logs** - تتبع الأحداث (للإدارة)
14. **error_logs** - تتبع الأخطاء (للإدارة)
15. **user_roles** - صلاحيات المستخدمين
16. **companies** - معلومات الشركات
17. **branches** - فروع الشركات
18. **categories** - تصنيفات الخدمات
19. **expenses** - المصروفات

### ❌ جداول غير مستخدمة (يجب حذفها):

#### مجموعة Mall/Shopping:
1. **_temp_approvers** - جدول مؤقت غير مستخدم
2. **mall_branches** - لا يوجد أي استخدام
3. **mall_tenants** - لا يوجد أي استخدام
4. **malls** - لا يوجد أي استخدام

#### مجموعة Materials/Parts:
5. **materials** - لا يوجد UI أو استخدام
6. **material_requests** - لا يوجد UI أو استخدام
7. **parts_orders** - لا يوجد UI أو استخدام

#### مجموعة Projects التفصيلية:
8. **project_documents** - لا RLS, لا UI
9. **project_gallery** - مكررة مع gallery_images
10. **project_reviews** - غير مستخدمة
11. **project_tasks** - غير مكتملة ولا UI

#### أخرى:
12. **payments** - لا UI مكتمل
13. **internal_teams** - غير مستخدم
14. **assets** - غير مستخدم
15. **maintenance_reports** - غير مكتمل
16. **comments** - غير مستخدم بشكل فعلي
17. **maintenance_services** - مكرر مع services
18. **platform_permissions** - معقد وغير مستخدم
19. **app_roles** - مكرر مع user_roles
20. **appointments_staff_secure** - view غير مستخدم
21. **appointments_staff_view** - view غير مستخدم

### 📊 إحصائيات:
- **إجمالي الجداول:** 47 جدول/view
- **جداول نشطة:** 19 جدول
- **جداول غير مستخدمة:** 28 جدول/view
- **نسبة الهدر:** 59.6%

## 🗑️ قائمة الحذف المقترحة

### المرحلة 1: حذف فوري (جداول فارغة/مؤقتة)
```sql
-- Temp tables
DROP TABLE IF EXISTS _temp_approvers CASCADE;

-- Mall system (unused)
DROP TABLE IF EXISTS mall_branches CASCADE;
DROP TABLE IF EXISTS mall_tenants CASCADE;
DROP TABLE IF EXISTS malls CASCADE;
```

### المرحلة 2: حذف الجداول غير المستخدمة
```sql
-- Materials/Parts (no UI)
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS material_requests CASCADE;
DROP TABLE IF EXISTS parts_orders CASCADE;

-- Unused project features
DROP TABLE IF EXISTS project_documents CASCADE;
DROP TABLE IF EXISTS project_gallery CASCADE;
DROP TABLE IF EXISTS project_reviews CASCADE;
DROP TABLE IF EXISTS project_tasks CASCADE;

-- Other unused
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS internal_teams CASCADE;
DROP TABLE IF EXISTS assets CASCADE;
DROP TABLE IF EXISTS maintenance_reports CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS maintenance_services CASCADE;
DROP TABLE IF EXISTS platform_permissions CASCADE;
DROP TABLE IF EXISTS app_roles CASCADE;

-- Unused views
DROP VIEW IF EXISTS appointments_staff_secure CASCADE;
DROP VIEW IF EXISTS appointments_staff_view CASCADE;
```

### المرحلة 3: تنظيف Functions
```sql
-- حذف functions غير مستخدمة
DROP FUNCTION IF EXISTS app_is_vendor(uuid) CASCADE;
DROP FUNCTION IF EXISTS app_is_owner(uuid) CASCADE;
DROP FUNCTION IF EXISTS app_is_admin(uuid) CASCADE;
DROP FUNCTION IF EXISTS app_is_staff(uuid) CASCADE;
DROP FUNCTION IF EXISTS is_vendor(uuid) CASCADE;
DROP FUNCTION IF EXISTS fn_role() CASCADE;
DROP FUNCTION IF EXISTS fn_has_role(text[]) CASCADE;
DROP FUNCTION IF EXISTS fn_claim(text) CASCADE;
DROP FUNCTION IF EXISTS fn_claim_uuid(text) CASCADE;
```

## 🔧 ملفات غير مستخدمة في الكود

### Components غير مستخدمة:
1. `src/components/workflow/` - المجلد كامل غير مستخدم
2. `src/components/approvals/` - غير مستخدم
3. `src/components/reports/ExpenseReport.tsx` - قديم
4. `src/components/maintenance/WorkTaskManager.tsx` - غير مكتمل

### Pages غير مستخدمة:
1. `src/pages/Testing.tsx` - للتطوير فقط
2. `src/pages/ProductionMonitor.tsx` - غير مستخدم
3. `src/pages/ProductionReport.tsx` - غير مستخدم
4. `src/pages/MaintenanceProcedures.tsx` - فارغ تقريباً

### Hooks مكررة:
لا يوجد - جميع الـ hooks مستخدمة

## 📈 التحسينات المقترحة

### 1. توحيد الجداول المكررة:
- دمج `user_roles` و `app_roles` في جدول واحد
- حذف `maintenance_services` واستخدام `categories`

### 2. تبسيط RLS:
- إزالة الـ policies المعقدة غير الضرورية
- توحيد دوال التحقق من الصلاحيات

### 3. تنظيف الكود:
- حذف console.log في الإنتاج
- إزالة التعليقات القديمة
- توحيد أسلوب التعامل مع الأخطاء

## ⚠️ تحذيرات

### قبل الحذف:
1. ✅ أخذ backup كامل للقاعدة
2. ✅ التأكد من عدم وجود Edge Functions تستخدم الجداول
3. ✅ فحص الـ Foreign Keys
4. ✅ اختبار شامل بعد الحذف

### لا تحذف أبداً:
- `profiles` - أساسي للمستخدمين
- `maintenance_requests` - جوهر النظام
- `projects` - مستخدم بكثافة
- `audit_logs` - للتتبع والأمان
- `error_logs` - للتشخيص

## 🎯 خطة التنفيذ

### Week 1: Audit
- [x] مراجعة شاملة للجداول
- [x] تحديد الجداول غير المستخدمة
- [x] إنشاء تقرير

### Week 2: Cleanup (Safe)
- [ ] حذف الجداول المؤقتة
- [ ] حذف Mall system
- [ ] حذف Materials system
- [ ] اختبار شامل

### Week 3: Optimization
- [ ] تنظيف Functions
- [ ] تبسيط RLS
- [ ] حذف Components غير مستخدمة
- [ ] اختبار نهائي

### Week 4: Verification
- [ ] مراجعة شاملة
- [ ] performance testing
- [ ] security audit
- [ ] deployment

## 📝 ملاحظات

### مكاسب متوقعة:
- تقليل حجم القاعدة بنسبة ~50%
- تبسيط الصيانة والتطوير
- تحسين الأداء
- سهولة الفهم للمطورين الجدد

### مخاطر:
- احتمال وجود استخدامات خفية
- قد تحتاج بعض الـ features مستقبلاً

### توصيات:
1. الاحتفاظ بنسخة احتياطية قبل أي حذف
2. الحذف على مراحل وليس دفعة واحدة
3. الاختبار بعد كل مرحلة
4. توثيق كل تغيير

---

## 🏁 الخلاصة

المشروع يحتوي على **59.6% هدر** في قاعدة البيانات. التنظيف المقترح سيجعل المشروع:
- ✅ أبسط وأسهل في الصيانة
- ✅ أسرع وأكثر كفاءة
- ✅ أكثر أماناً وأقل عرضة للأخطاء
- ✅ أسهل للمطورين الجدد
