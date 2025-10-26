# دليل الخطوات اليدوية النهائية
## Manual Steps Guide for Production Deployment

**التاريخ:** 26 أكتوبر 2025  
**الحالة:** خطوات إلزامية قبل النشر في الإنتاج

---

## 🔒 الخطوة 1: تفعيل حماية كلمات المرور المسربة
### Leaked Password Protection

**الوقت المتوقع:** 5 دقائق  
**الأهمية:** متوسطة - عالية  
**الحالة الحالية:** ❌ غير مفعل

### الخطوات التفصيلية:

1. **افتح Supabase Dashboard**
   ```
   🔗 https://supabase.com/dashboard/project/YOUR_PROJECT_ID
   ```

2. **انتقل إلى Authentication Settings**
   ```
   Navigation Path:
   Dashboard → Authentication → Settings
   ```

3. **ابحث عن Security Section**
   - انزل إلى قسم "Security"
   - ابحث عن خيار "Leaked Password Protection"

4. **تفعيل الحماية**
   - ✅ قم بتفعيل "Enable Leaked Password Protection"
   - هذا الخيار يمنع المستخدمين من استخدام كلمات مرور مسربة سابقاً

5. **حفظ التغييرات**
   - اضغط على "Save" أو "Update"

### ماذا يفعل هذا الإعداد؟
- يفحص كلمات المرور ضد قاعدة بيانات HaveIBeenPwned
- يمنع المستخدمين من استخدام كلمات مرور تم تسريبها في خروقات سابقة
- يحسن الأمان العام للتطبيق

### التحقق من التفعيل:
```bash
# حاول التسجيل بكلمة مرور ضعيفة مثل "password123"
# يجب أن تحصل على رسالة خطأ
```

---

## 🗄️ الخطوة 2: ترقية PostgreSQL
### PostgreSQL Version Upgrade

**الوقت المتوقع:** 10-15 دقيقة  
**الأهمية:** عالية جداً  
**الإصدار الحالي:** 15.6  
**الإصدار المطلوب:** أحدث إصدار مستقر (15.x أو 16.x)

### الخطوات التفصيلية:

#### 1. التحضير (5 دقائق):

**أ. عمل نسخة احتياطية**
```sql
-- في Supabase Dashboard → Database → Backups
1. انتقل إلى Database → Backups
2. انقر على "Create Backup"
3. أضف وصف: "Pre-PostgreSQL Upgrade Backup"
4. انتظر حتى اكتمال النسخ الاحتياطي
```

**ب. التحقق من الاتصالات النشطة**
```sql
-- في SQL Editor
SELECT count(*) as active_connections
FROM pg_stat_activity
WHERE datname = current_database();

-- إذا كانت الاتصالات > 10، انتظر وقت هادئ
```

#### 2. الترقية (5 دقائق):

**أ. افتح Database Settings**
```
Navigation Path:
Dashboard → Database → Settings
```

**ب. ابحث عن PostgreSQL Version**
- في قسم "Configuration"
- ابحث عن "Postgres Version"

**ج. بدء الترقية**
```
1. انقر على "Upgrade" أو "Manage"
2. اختر أحدث إصدار مستقر متاح
3. اقرأ التحذيرات بعناية
4. أكد الترقية
```

**د. انتظر اكتمال الترقية**
- قد تستغرق 5-10 دقائق
- **لا تغلق** نافذة المتصفح
- سيتم إعادة تشغيل قاعدة البيانات تلقائياً

#### 3. التحقق بعد الترقية (5 دقائق):

**أ. التحقق من الإصدار**
```sql
-- في SQL Editor
SELECT version();
-- يجب أن يظهر الإصدار الجديد
```

**ب. التحقق من صحة البيانات**
```sql
-- فحص عدد الجداول
SELECT count(*) FROM information_schema.tables 
WHERE table_schema = 'public';
-- يجب أن يكون 45 جدول

-- فحص عدد الطلبات
SELECT count(*) FROM maintenance_requests;
-- تأكد من أن البيانات موجودة
```

**ج. التحقق من الدوال (Functions)**
```sql
-- فحص الدوال
SELECT count(*) FROM pg_proc 
WHERE pronamespace = 'public'::regnamespace;
-- يجب أن تكون جميع الدوال موجودة
```

**د. التحقق من RLS Policies**
```sql
-- فحص السياسات
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename;
-- يجب أن تكون جميع السياسات موجودة
```

**هـ. اختبار التطبيق**
```
1. افتح التطبيق
2. سجل الدخول
3. أنشئ طلب صيانة جديد
4. تحقق من عرض البيانات
5. تحقق من Edge Functions
```

### في حالة حدوث مشاكل:

**إذا فشلت الترقية:**
```
1. لا تقلق - البيانات آمنة
2. انتقل إلى Database → Backups
3. استعد آخر نسخة احتياطية
4. اتصل بدعم Supabase
```

**إذا ظهرت أخطاء بعد الترقية:**
```sql
-- فحص سجل الأخطاء
SELECT * FROM error_logs 
ORDER BY created_at DESC 
LIMIT 20;

-- فحص audit logs
SELECT * FROM audit_logs 
ORDER BY created_at DESC 
LIMIT 20;
```

---

## 📋 الخطوة 3: الاختبار الشامل النهائي

### اختبار دورة الحياة الكاملة:

#### 1. تقديم طلب صيانة (Customer)
```
✓ انتقل إلى /requests
✓ انقر على "طلب جديد"
✓ املأ جميع الحقول المطلوبة
✓ أرفق صورة
✓ اختر الموقع على الخريطة
✓ أرسل الطلب
```

#### 2. فرز الطلب (Dispatcher/Admin)
```
✓ انتقل إلى /requests
✓ افتح الطلب الجديد
✓ تحقق من التفاصيل
✓ حدد الأولوية
✓ اختر التصنيف
✓ انقل إلى "TRIAGED"
```

#### 3. تعيين فني (Admin/Manager)
```
✓ اختر فني من القائمة
✓ أو استخدم "Find Nearest Vendor"
✓ عين الفني
✓ انقل إلى "ASSIGNED"
```

#### 4. جدولة موعد (Vendor)
```
✓ سجل دخول كـ Vendor
✓ انتقل إلى /appointments
✓ أنشئ موعد للطلب
✓ حدد التاريخ والوقت
✓ انقل الطلب إلى "SCHEDULED"
```

#### 5. المعاينة والتقدير (Technician)
```
✓ سجل دخول كـ Technician
✓ افتح الطلب
✓ أدخل التقدير المالي
✓ أضف ملاحظات المعاينة
✓ انقل إلى "INSPECTION"
```

#### 6. موافقة العميل (Customer)
```
✓ سجل دخول كـ Customer
✓ راجع التقدير
✓ وافق أو ارفض
✓ إذا وافقت: ينتقل إلى "IN_PROGRESS"
```

#### 7. تنفيذ العمل (Technician)
```
✓ سجل دخول كـ Technician
✓ ابدأ العمل
✓ سجل التقدم
✓ عند الانتهاء: انقل إلى "COMPLETED"
```

#### 8. مراجعة العميل (Customer)
```
✓ سجل دخول كـ Customer
✓ افتح الطلب المكتمل
✓ قدم تقييم (1-5 نجوم)
✓ أضف تعليق
✓ أرسل التقييم
```

### اختبار الأمان:

```sql
-- 1. التحقق من RLS
-- سجل دخول كـ Customer
SELECT * FROM maintenance_requests;
-- يجب أن ترى طلباتك فقط

-- 2. التحقق من عزل البيانات
-- سجل دخول بشركة مختلفة
SELECT * FROM invoices;
-- يجب أن ترى فواتير شركتك فقط

-- 3. التحقق من حماية البيانات الحساسة
SELECT * FROM appointments_staff_secure;
-- الموظفون يجب ألا يروا بيانات الاتصال الكاملة
```

### اختبار الأداء:

```javascript
// في Console المتصفح
console.time('Load Requests');
// انتقل إلى صفحة الطلبات
// يجب أن يكتمل التحميل في أقل من 2 ثانية
console.timeEnd('Load Requests');
```

---

## ✅ قائمة التحقق النهائية

### قبل النشر:
- [ ] تفعيل Leaked Password Protection
- [ ] ترقية PostgreSQL
- [ ] نسخة احتياطية حديثة
- [ ] اختبار دورة الحياة الكاملة
- [ ] اختبار الأمان
- [ ] اختبار الأداء
- [ ] مراجعة Secrets والـ Environment Variables
- [ ] التحقق من CORS Settings
- [ ] اختبار Edge Functions
- [ ] اختبار الإشعارات والبريد الإلكتروني

### بعد النشر:
- [ ] مراقبة Error Logs لمدة 24 ساعة
- [ ] التحقق من Audit Logs
- [ ] مراقبة الأداء
- [ ] جمع feedback من المستخدمين الأوائل
- [ ] تحديث التوثيق بناءً على الملاحظات

---

## 🚨 جهات الاتصال في حالة الطوارئ

### دعم Supabase:
- 📧 support@supabase.com
- 🔗 https://supabase.com/docs
- 💬 Discord Community

### الموارد المفيدة:
- 📖 [Supabase Migration Guide](https://supabase.com/docs/guides/platform/migrating-and-upgrading-projects)
- 📖 [PostgreSQL Upgrade Guide](https://www.postgresql.org/docs/current/upgrading.html)
- 📖 [Security Best Practices](https://supabase.com/docs/guides/auth/auth-helpers/security)

---

## 📝 ملاحظات مهمة

1. **توقيت الترقية:**
   - اختر وقت هادئ (مساءً أو عطلة نهاية الأسبوع)
   - تأكد من عدم وجود مستخدمين نشطين
   - قد يستغرق 10-15 دقيقة من downtime

2. **النسخ الاحتياطي:**
   - دائماً قم بعمل نسخة احتياطية قبل أي تغيير كبير
   - احتفظ بنسخ احتياطية متعددة
   - اختبر استعادة النسخة الاحتياطية

3. **الاختبار:**
   - اختبر في بيئة staging أولاً إن أمكن
   - اختبر جميع الميزات الرئيسية
   - اختبر مع مستخدمين حقيقيين

4. **المراقبة:**
   - راقب الأداء بعد الترقية
   - راقب Error Logs
   - كن مستعداً للرجوع للنسخة السابقة إذا لزم الأمر

---

**آخر تحديث:** 26 أكتوبر 2025  
**الحالة:** جاهز للتنفيذ  
**الوقت الإجمالي المتوقع:** 20-30 دقيقة
