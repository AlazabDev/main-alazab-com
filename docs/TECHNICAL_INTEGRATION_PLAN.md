# 📘 خطة التكامل التقني - نظام إدارة الصيانة

**آخر تحديث**: 17 أكتوبر 2025  
**الحالة**: جاهز للمرحلة النهائية ✨

---

## 🎯 نظرة عامة

هذا المستند يوضح كيفية ترابط جميع مديولات النظام مع بعضها البعض لتكوين منظومة متكاملة.

---

## 🏗️ البنية المعمارية

```
┌─────────────────────────────────────────────────────────────┐
│                         المستخدم                             │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    طبقة الواجهة (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Dashboard│  │ Requests │  │Properties│  │ Reports  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
└───────┼─────────────┼─────────────┼─────────────┼──────────┘
        │             │             │             │
        └─────────────┼─────────────┼─────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   طبقة الأعمال (Hooks)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  useMaintenanceRequests | useProperties | useVendors│  │
│  └──────────────────┬───────────────────────────────────┘  │
└─────────────────────┼──────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                 طبقة البيانات (Supabase)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │    DB    │  │   Auth   │  │ Storage  │  │  Edge Fn │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 دورة حياة طلب الصيانة (Complete Workflow)

### المراحل الأساسية:

1. **إنشاء الطلب** (Customer)
   - الصفحة: `Requests.tsx` أو `QuickRequest.tsx`
   - النموذج: `NewRequestForm.tsx`
   - Hook: `useMaintenanceRequests.ts` → `createRequest()`
   - الجدول: `maintenance_requests`
   - الحالة الأولية: `workflow_stage = 'submitted'`, `status = 'pending'`

2. **استلام الطلب** (Staff/Admin)
   - الصفحة: `Dashboard.tsx`
   - المكون: `RecentRequests.tsx`
   - Hook: `useMaintenanceRequests.ts` → `fetchRequests()`
   - التحديث: `workflow_stage = 'acknowledged'`

3. **تعيين فني** (Admin/Manager)
   - الصفحة: `RequestDetails.tsx`
   - المكون: `MaintenanceRequestActions.tsx`
   - Hook: `useMaintenanceRequests.ts` → `updateRequest()`
   - التحديث: `assigned_vendor_id`, `workflow_stage = 'assigned'`
   - إنشاء: سجل في `appointments` table

4. **جدولة الموعد** (Admin)
   - الصفحة: `Appointments.tsx`
   - النموذج: `NewAppointmentForm.tsx`
   - Hook: `useAppointments.ts`
   - الجدول: `appointments`
   - التحديث: `workflow_stage = 'scheduled'`

5. **بدء العمل** (Technician)
   - الصفحة: `RequestDetails.tsx`
   - المكون: `WorkTaskManager.tsx`
   - التحديث: `workflow_stage = 'in_progress'`, `status = 'in_progress'`

6. **طلب مواد** (إن لزم) (Technician)
   - المكون: `MaterialRequestForm.tsx`
   - الجدول: `material_requests`
   - التحديث: `workflow_stage = 'waiting_parts'`

7. **إكمال العمل** (Technician)
   - رفع صور الإنجاز: `ImageUpload.tsx`
   - التحديث: `completion_photos`, `actual_cost`
   - التحديث: `workflow_stage = 'inspection'`

8. **الموافقة والإغلاق** (Admin)
   - المكون: `ApprovalManager.tsx`
   - التحديث: `workflow_stage = 'completed'`, `status = 'completed'`
   - التحديث: `actual_completion`, `quality_score`

9. **الفوترة** (Admin)
   - الصفحة: `Invoices.tsx`
   - النموذج: `NewInvoiceForm.tsx`
   - الجدول: `invoices`, `invoice_items`
   - التحديث: `workflow_stage = 'billed'`

10. **الدفع والإغلاق النهائي** (Admin)
    - التحديث: `workflow_stage = 'paid'` → `'closed'`
    - الأرشفة: نقل إلى `maintenance_requests_archive`

---

## 📊 ترابط الجداول (Database Relations)

### الجداول الرئيسية وعلاقاتها:

```sql
-- 1. طلبات الصيانة (المركز الرئيسي)
maintenance_requests
  ├── requested_by → profiles (id)           -- من أنشأ الطلب
  ├── assigned_vendor_id → vendors (id)      -- الفني المعين
  └── property_id → properties (id)          -- العقار المرتبط (إن وجد)

-- 2. المواعيد
appointments
  ├── created_by → profiles (id)
  ├── vendor_id → vendors (id)
  ├── maintenance_request_id → maintenance_requests (id)
  └── property_id → properties (id)

-- 3. طلبات المواد
material_requests
  ├── request_id → maintenance_requests (id)
  ├── issued_by → profiles (id)
  └── approved_by → profiles (id)

-- 4. التقارير
maintenance_reports
  ├── request_id → maintenance_requests (id)
  ├── prepared_by → profiles (id)
  └── approved_by → profiles (id)

-- 5. الفواتير
invoices
  ├── created_by → profiles (id)
  └── (ربط غير مباشر مع maintenance_requests)

invoice_items
  └── invoice_id → invoices (id)

-- 6. الإشعارات
notifications
  ├── recipient_id → profiles (id)
  ├── sender_id → profiles (id)
  └── entity_id → (يمكن أن يكون maintenance_request_id)

-- 7. التعليقات
comments
  ├── author_id → profiles (id)
  └── entity_id → (يمكن أن يكون maintenance_request_id)

-- 8. سجل المراجعة
audit_logs
  ├── user_id → profiles (id)
  └── record_id → (أي جدول)
```

---

## 🎨 مسار المستخدم (User Journey)

### 👤 **العميل (Customer)**

1. **الدخول**:
   - `Login.tsx` → Authentication
   - التوجيه إلى `Dashboard.tsx`

2. **إنشاء طلب جديد**:
   - `Dashboard` → زر "طلب صيانة"
   - أو `QuickRequest.tsx` للطلب السريع
   - `NewRequestForm.tsx` → ملء البيانات
   - اختيار الموقع: `LocationPicker.tsx` (Google Maps)
   - رفع الصور: `ImageUpload.tsx`
   - الإرسال → `useMaintenanceRequests.createRequest()`

3. **متابعة الطلبات**:
   - `Requests.tsx` → عرض قائمة الطلبات
   - النقر على طلب → `RequestDetails.tsx`
   - عرض التفاصيل: `MaintenanceRequestDetails.tsx`
   - التايم لاين: `RequestStatusTimeline.tsx`
   - تتبع دورة الحياة: `RequestLifecycleTracker.tsx`

4. **التقييم**:
   - بعد الإكمال → `RequestReviewForm.tsx`
   - تقديم التقييم والتعليقات

### 👨‍💼 **المدير (Admin/Manager)**

1. **لوحة التحكم**:
   - `Dashboard.tsx`
   - `MaintenanceStats.tsx` → إحصائيات
   - `MaintenanceChart.tsx` → رسوم بيانية
   - `RecentRequests.tsx` → آخر الطلبات

2. **إدارة الطلبات**:
   - `Requests.tsx` → جميع الطلبات
   - `MaintenanceFilters.tsx` → تصفية
   - النقر → `RequestDetails.tsx`
   - `MaintenanceRequestActions.tsx` → الإجراءات:
     - تعيين فني
     - تغيير الحالة
     - تحديد الأولوية

3. **الجدولة**:
   - `Appointments.tsx`
   - `NewAppointmentForm.tsx` → إنشاء موعد
   - ربط الموعد بطلب الصيانة

4. **المتابعة والموافقات**:
   - `ApprovalManager.tsx` → موافقات
   - `WorkTaskManager.tsx` → متابعة المهام
   - `MaterialRequestForm.tsx` → طلبات المواد

5. **التقارير**:
   - `Reports.tsx` → التقارير العامة
   - `MaintenanceReports.tsx` → تقارير الصيانة
   - `MaintenanceReportDashboard.tsx` → داشبورد مخصص
   - `ExpenseReports.tsx` → تقارير المصروفات

6. **الفوترة**:
   - `Invoices.tsx`
   - `NewInvoiceForm.tsx` → إنشاء فاتورة

### 👨‍🔧 **الفني (Technician/Vendor)**

1. **المواعيد المعينة**:
   - `Appointments.tsx` → مواعيدي
   - تصفية حسب `vendor_id = current_user`

2. **تنفيذ المهمة**:
   - `RequestDetails.tsx`
   - تحديث الحالة إلى "قيد التنفيذ"
   - `MaterialRequestForm.tsx` → طلب مواد
   - `ImageUpload.tsx` → رفع صور الإنجاز

3. **إنهاء المهمة**:
   - تحديث `actual_cost`
   - رفع `completion_photos`
   - تغيير الحالة إلى "مكتمل"

---

## 🔐 الصلاحيات والأمان (RLS Policies)

### الجدول: `maintenance_requests`

```sql
-- القراءة: الكل يمكنهم رؤية طلباتهم + الموظفين يرون الكل
SELECT:
  - (requested_by = current_user) OR
  - (assigned_vendor_id = current_user) OR
  - is_staff(current_user)

-- الإنشاء: المصادق عليهم فقط
INSERT:
  - authenticated

-- التحديث: صاحب الطلب أو الفني المعين أو الموظفين
UPDATE:
  - (requested_by = current_user AND status IN ['pending', 'scheduled']) OR
  - (assigned_vendor_id = current_user) OR
  - is_staff(current_user)
```

### الجدول: `appointments`

```sql
SELECT:
  - (created_by = current_user) OR
  - (vendor_id = current_user) OR
  - has_role('admin', 'manager')

INSERT:
  - created_by = current_user

UPDATE:
  - (created_by = current_user) OR
  - (vendor_id = current_user AND has_role('vendor')) OR
  - has_role('admin', 'manager', 'staff')
```

---

## 🔔 نظام الإشعارات

### متى يتم إرسال الإشعارات؟

1. **إنشاء طلب جديد**:
   - إشعار للمديرين والموظفين
   - Edge Function: `send-notification`

2. **تعيين فني**:
   - إشعار للفني المعين

3. **تحديث الحالة**:
   - إشعار لصاحب الطلب

4. **اقتراب موعد SLA**:
   - إشعار للمسؤولين (escalation)

5. **إكمال المهمة**:
   - إشعار لصاحب الطلب للتقييم

### التنفيذ:

```typescript
// في useMaintenanceRequests.ts
const createRequest = async (requestData) => {
  // 1. إنشاء الطلب
  const request = await supabase
    .from('maintenance_requests')
    .insert({...})
    .select()
    .single();

  // 2. إرسال إشعار
  await supabase.functions.invoke('send-notification', {
    body: {
      type: 'new_request',
      requestId: request.id,
      title: 'طلب صيانة جديد',
      message: `تم إنشاء طلب: ${request.title}`
    }
  });

  return request;
};
```

---

## 📱 الواجهات الرئيسية والمكونات

### 1. **Dashboard** (`Dashboard.tsx`)

- **المكونات**:
  - `MaintenanceStats` → عرض الإحصائيات
  - `MaintenanceChart` → الرسوم البيانية
  - `RecentRequests` → آخر الطلبات
  - `QuickActions` → إجراءات سريعة
- **الهوكات**:
  - `useMaintenanceRequests` → جلب الطلبات
  - `useProjects` → جلب المشاريع
  - `useSupabaseData` → إحصائيات عامة

### 2. **Requests** (`Requests.tsx`)

- **المكونات**:
  - `MaintenanceRequestsList` (Desktop)
  - `MobileMaintenanceList` (Mobile)
  - `MaintenanceFilters` → تصفية
  - `NewRequestFormDialog` → حوار الطلب الجديد
- **الهوكات**:
  - `useMaintenanceRequests`
  - `useRequestFilters`

### 3. **RequestDetails** (`RequestDetails.tsx`)

- **المكونات**:
  - `MaintenanceRequestDetails` → التفاصيل
  - `RequestStatusTimeline` → الخط الزمني
  - `RequestLifecycleTracker` → تتبع دورة الحياة
  - `MaintenanceRequestActions` → الإجراءات
  - `RequestWorkflowControls` → ⚠️ مفقود - يحتاج إنشاء
- **الهوكات**:
  - `useMaintenanceRequests`
  - `useRequestLifecycle`

### 4. **Properties** (`Properties.tsx`)

- **المكونات**:
  - `PropertyCard` → بطاقة عقار
  - `PropertyActionsDialog` → إجراءات
  - `PropertyQRCode` → QR Code
- **الهوكات**:
  - `useProperties`

### 5. **Appointments** (`Appointments.tsx`)

- **النماذج**:
  - `NewAppointmentForm`
- **الهوكات**:
  - `useAppointments`

### 6. **Reports** (`MaintenanceReports.tsx`)

- **المكونات**:
  - `MaintenanceReportDashboard` → داشبورد شامل
  - Charts → Recharts
- **البيانات**:
  - `maintenance_requests` (completed)
  - `maintenance_requests_archive`

---

## 🛠️ Edge Functions

### 1. **chatbot** (`chatbot/index.ts`)

- **الغرض**: الدردشة الذكية
- **API**: OpenAI / DeepSeek
- **الاستخدام**: `ChatBot.tsx`

### 2. **send-notification** (`send-notification/index.ts`)

- **الغرض**: إرسال إشعارات
- **المدخلات**: `{ type, requestId, title, message }`
- **الإخراج**: إنشاء سجل في `notifications`

### 3. **get-maps-key** (`get-maps-key/index.ts`)

- **الغرض**: تأمين Google Maps API Key
- **⚠️ مشكلة أمنية**: يحتاج تفعيل JWT verification

### 4. **error-tracking** (`error-tracking/index.ts`)

- **الغرض**: تتبع الأخطاء
- **⚠️ مشكلة**: يستخدم `profiles.role` المهمل
- **الحل**: استخدام `user_roles` table

### 5. **send-invoice-email** (`send-invoice-email/index.ts`)

- **الغرض**: إرسال الفواتير عبر البريد
- **API**: Resend

---

## 🔄 Real-time Updates (المطلوب)

### التنفيذ المقترح:

```typescript
// في useMaintenanceRequests.ts
useEffect(() => {
  const channel = supabase
    .channel('maintenance_requests_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'maintenance_requests'
      },
      (payload) => {
        console.log('Request updated:', payload);
        fetchRequests(); // إعادة جلب البيانات
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

---

## 🎯 المهام المتبقية (Remaining Tasks)

### ✅ ما تم إنجازه:

- [x] بنية تحتية قوية (React + Supabase)
- [x] نظام المصادقة والصلاحيات
- [x] CRUD كامل لطلبات الصيانة
- [x] إدارة العقارات والموردين
- [x] معرض الصور
- [x] التقارير والداشبوردات
- [x] جداول الأرشيف

### ⚠️ يحتاج إصلاح:

- [ ] **RequestWorkflowControls** - مكون مفقود (عالي)
- [ ] **Navigation** - التوجيه بعد إنشاء طلب (عالي)
- [ ] **Google Maps API Key** - مشكلة أمنية (حرج)
- [ ] **Real-time updates** - تحديثات لحظية (متوسط)
- [ ] **Notifications** - تحسين نظام الإشعارات (متوسط)
- [ ] **Settings Page** - صفحة الإعدادات (منخفض)

### 🚀 تحسينات مقترحة:

- [ ] تحسين SLA tracking
- [ ] نظام التصعيد التلقائي
- [ ] تقارير متقدمة
- [ ] تكامل مع أنظمة خارجية
- [ ] Mobile App (Android/iOS)

---

## 📖 مراجع التوثيق

- `docs/ARCHITECTURE.md` → البنية المعمارية
- `docs/DEPLOYMENT.md` → نشر التطبيق
- `docs/PROJECT_STATUS.md` → حالة المشروع
- `docs/FINAL_REPORT.md` → التقرير النهائي
- `docs/MAINTENANCE_REQUESTS_MODULE.md` → وحدة الصيانة

---

## 💡 ملاحظات للمطورين

1. **دائماً استخدم الهوكات المخصصة**:
   - `useMaintenanceRequests` للطلبات
   - `useProperties` للعقارات
   - `useAppointments` للمواعيد

2. **RLS مفعّل على جميع الجداول**:
   - تأكد من الصلاحيات قبل العمليات

3. **التوستات للمستخدم**:
   - استخدم `useToast` لإظهار الرسائل

4. **التحقق من الأخطاء**:
   - دائماً استخدم try/catch
   - استخدم `errorTracker` للتسجيل

5. **التصميم المتجاوب**:
   - استخدم `useMediaQuery` للكشف عن الشاشة
   - كومبوننتات منفصلة للموبايل والديسكتوب

---

**🎉 النظام جاهز للمرحلة النهائية من التطوير!**

يمكن الآن العمل على ربط الأجزاء المتبقية وتحسين تجربة المستخدم.
