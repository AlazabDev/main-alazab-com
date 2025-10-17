# 📦 دليل المكونات - نظام إدارة الصيانة

**الغرض**: شرح تفصيلي لكل مكون وكيفية استخدامه وترابطه مع المكونات الأخرى.

---

## 📁 هيكل المكونات

```
src/components/
├── admin/                    # مكونات المسؤولين
│   └── ErrorMonitoringDashboard.tsx
├── auth/                     # المصادقة
│   ├── AuthWrapper.tsx
│   └── LoginForm.tsx
├── chatbot/                  # الشات بوت
│   └── ChatBot.tsx
├── dashboard/                # لوحة التحكم
│   ├── MaintenanceChart.tsx
│   ├── MaintenanceStats.tsx
│   ├── QuickActions.tsx
│   ├── RecentRequests.tsx
│   └── StatsCard.tsx
├── forms/                    # النماذج
│   ├── ImageUpload.tsx
│   ├── LocationPicker.tsx
│   ├── NewAppointmentForm.tsx
│   ├── NewInvoiceForm.tsx
│   ├── NewPropertyForm.tsx
│   ├── NewRequestForm.tsx      ✨ الأهم
│   ├── NewRequestFormDialog.tsx
│   ├── NewVendorForm.tsx
│   └── PropertyForm.tsx
├── landing/                  # الصفحة الترحيبية
│   ├── FeaturesSection.tsx
│   ├── Footer.tsx
│   ├── HeroSection.tsx
│   ├── LandingHeader.tsx
│   ├── LandingPage.tsx
│   ├── RotatingText.tsx
│   ├── ServicesSection.tsx
│   ├── StatsSection.tsx
│   ├── StorySection.tsx
│   └── TestimonialsSection.tsx
├── layout/                   # التخطيط العام
│   ├── AppLayout.tsx          ✨ الأساسي
│   ├── AppSidebar.tsx
│   ├── Header.tsx
│   └── Sidebar.tsx
├── maintenance/              # إدارة الصيانة
│   ├── EmptyRequestsState.tsx
│   ├── MaintenanceExport.tsx
│   ├── MaintenanceFilters.tsx
│   ├── MaintenanceRequestActions.tsx
│   ├── MaintenanceRequestDetails.tsx
│   ├── MaintenanceRequestsList.tsx   ✨ الأهم
│   ├── MobileMaintenanceCard.tsx
│   ├── MobileMaintenanceList.tsx
│   ├── RequestErrorState.tsx
│   ├── RequestLifecycleTracker.tsx   ✨ جديد
│   ├── RequestLoadingState.tsx
│   ├── RequestPriorityBadge.tsx
│   ├── RequestReviewForm.tsx
│   ├── RequestStatusBadge.tsx
│   ├── RequestStatusTimeline.tsx
│   ├── RequestWorkflowControls.tsx   ✨ جديد
│   ├── SLAIndicator.tsx
│   └── WorkTaskManager.tsx
├── maps/                     # الخرائط
│   └── GoogleMap.tsx
├── notifications/            # الإشعارات
│   └── NotificationsList.tsx
├── projects/                 # المشاريع
│   ├── NewProjectDialog.tsx
│   ├── ProjectCard.tsx
│   └── ProjectFilters.tsx
├── properties/               # العقارات
│   ├── PropertyActionsDialog.tsx
│   └── PropertyQRCode.tsx
├── reports/                  # التقارير
│   ├── ExpenseReport.tsx
│   └── MaintenanceReportDashboard.tsx  ✨ محسّن
├── service-request/          # طلبات الخدمة
│   ├── RequestDetailsStep.tsx
│   ├── ServiceCategoriesStep.tsx
│   └── ServiceSelectionStep.tsx
├── settings/                 # الإعدادات
│   ├── AccountSettings.tsx
│   ├── PasswordSettings.tsx
│   ├── PlatformSettings.tsx
│   └── SubscriptionSettings.tsx
├── ui/                       # مكونات shadcn/ui
│   └── [47 مكون]
├── vendors/                  # الموردين
│   └── VendorCard.tsx
└── workflow/                 # سير العمل
    ├── ApprovalManager.tsx
    ├── MaterialRequestForm.tsx
    ├── ReportGenerator.tsx
    └── WorkflowDiagram.tsx
```

---

## 🎯 المكونات الرئيسية

### 1. **AppLayout.tsx** - التخطيط الرئيسي

**الموقع**: `src/components/layout/AppLayout.tsx`

**الغرض**: الغلاف الرئيسي للتطبيق يحتوي على:
- Sidebar (القائمة الجانبية)
- Header (الهيدر)
- Main Content (المحتوى الرئيسي)
- ChatBot (الشات بوت)

**الاستخدام**:
```tsx
import AppLayout from "@/components/layout/AppLayout";

function MyApp() {
  return (
    <AppLayout>
      {/* محتوى التطبيق */}
    </AppLayout>
  );
}
```

**الـ Props**:
- `children`: React.ReactNode - المحتوى الذي سيتم عرضه

**البيانات**:
- يجلب معلومات المستخدم من `profiles` table
- يعرض الصورة الرمزية والاسم والدور

**الأحداث**:
- `handleLogout()` - تسجيل الخروج

---

### 2. **NewRequestForm.tsx** - نموذج طلب الصيانة

**الموقع**: `src/components/forms/NewRequestForm.tsx`

**الغرض**: النموذج الرئيسي لإنشاء طلب صيانة جديد

**الاستخدام**:
```tsx
import { NewRequestForm } from "@/components/forms/NewRequestForm";

<Dialog>
  <DialogContent>
    <NewRequestForm 
      onSuccess={() => {
        // عند نجاح الإنشاء
        setDialogOpen(false);
      }} 
    />
  </DialogContent>
</Dialog>
```

**الـ Props**:
- `onSuccess?: () => void` - Callback عند نجاح الإنشاء

**الحقول**:
```typescript
{
  title: string;              // عنوان الطلب
  description?: string;       // الوصف
  client_name: string;        // اسم العميل
  client_phone?: string;      // رقم الهاتف
  client_email?: string;      // البريد
  location: string;           // الموقع (نص)
  latitude?: number;          // خط العرض
  longitude?: number;         // خط الطول
  service_type: string;       // نوع الخدمة
  priority: string;           // الأولوية
  preferred_date?: string;    // التاريخ المفضل
  preferred_time?: string;    // الوقت المفضل
  customer_notes?: string;    // ملاحظات العميل
  property_id?: string;       // معرف العقار
}
```

**المكونات الفرعية**:
- `LocationPicker` - اختيار الموقع
- `ImageUpload` - رفع الصور

**سير العمل**:
1. المستخدم يملأ النموذج
2. يختار الموقع (اختياري) → `LocationPicker`
3. يرفع صور (اختياري) → `ImageUpload`
4. عند الإرسال:
   - إنشاء سجل في `maintenance_requests`
   - إنشاء سجل في `request_lifecycle`
   - إرسال إشعار للمستخدم
   - البحث عن أقرب فني (إذا تم تحديد الموقع)
   - التوجيه لصفحة التفاصيل

**⚠️ ملاحظة مهمة**:
- بعد الإنشاء الناجح، يتم التوجيه تلقائياً لصفحة `/requests/{id}`
- يتم إغلاق النموذج قبل التوجيه

---

### 3. **MaintenanceRequestsList.tsx** - قائمة الطلبات

**الموقع**: `src/components/maintenance/MaintenanceRequestsList.tsx`

**الغرض**: عرض جميع طلبات الصيانة في جدول

**الاستخدام**:
```tsx
import { MaintenanceRequestsList } from "@/components/maintenance/MaintenanceRequestsList";

<MaintenanceRequestsList 
  onNewRequestClick={() => setDialogOpen(true)} 
/>
```

**الـ Props**:
- `onNewRequestClick?: () => void` - عند النقر على "طلب جديد"

**المميزات**:
- تصفية حسب الحالة، الأولوية، نوع الخدمة
- البحث النصي
- عرض البيانات في جدول
- إجراءات على كل طلب (عرض، تعديل، حذف)

**الهوكات المستخدمة**:
- `useMaintenanceRequests()` - جلب الطلبات
- `useRequestFilters()` - التصفية

**المكونات الفرعية**:
- `MaintenanceFilters` - أدوات التصفية
- `RequestStatusBadge` - شارة الحالة
- `RequestPriorityBadge` - شارة الأولوية
- `SLAIndicator` - مؤشر SLA

---

### 4. **RequestWorkflowControls.tsx** - التحكم في سير العمل

**الموقع**: `src/components/maintenance/RequestWorkflowControls.tsx`

**الغرض**: التحكم في مراحل تنفيذ طلب الصيانة

**الاستخدام**:
```tsx
import { RequestWorkflowControls } from "@/components/maintenance/RequestWorkflowControls";

<RequestWorkflowControls 
  request={request}
  onUpdate={() => refetch()}
/>
```

**الـ Props**:
```typescript
{
  request: MaintenanceRequest;  // الطلب
  onUpdate?: () => void;        // عند التحديث
}
```

**المراحل المتاحة**:
1. `submitted` - تم الإرسال
2. `acknowledged` - تم الاستلام
3. `assigned` - تم التعيين
4. `scheduled` - تم الجدولة
5. `in_progress` - قيد التنفيذ
6. `inspection` - قيد الفحص
7. `completed` - مكتمل
8. `billed` - تم الفوترة
9. `closed` - مغلق
10. `cancelled` - ملغي
11. `on_hold` - معلق

**الإجراءات السريعة**:
- بدء العمل (عندما يكون scheduled/assigned)
- إكمال (عندما يكون in_progress/inspection)
- إغلاق (عندما يكون completed/billed)
- تعليق (عندما يكون in_progress/scheduled)

**التحديثات التلقائية**:
- عند تغيير المرحلة، يتم تحديث `status` أيضاً
- عند الإكمال، يتم تعيين `actual_completion`

---

### 5. **RequestLifecycleTracker.tsx** - تتبع دورة الحياة

**الموقع**: `src/components/maintenance/RequestLifecycleTracker.tsx`

**الغرض**: عرض تاريخ جميع التغييرات على الطلب

**الاستخدام**:
```tsx
import { RequestLifecycleTracker } from "@/components/maintenance/RequestLifecycleTracker";

<RequestLifecycleTracker 
  requestId={request.id}
  requestStatus={request.workflow_stage}
  requestTitle={request.title}
/>
```

**الـ Props**:
```typescript
{
  requestId: string;       // معرف الطلب
  requestStatus: string;   // الحالة الحالية
  requestTitle: string;    // عنوان الطلب
}
```

**البيانات المعروضة**:
- تاريخ كل تحديث
- نوع التحديث (status_change, assignment, etc.)
- من قام بالتحديث
- ملاحظات التحديث
- البيانات الوصفية (metadata)

**الجدول المستخدم**: `request_lifecycle`

---

### 6. **MaintenanceReportDashboard.tsx** - داشبورد التقارير

**الموقع**: `src/components/reports/MaintenanceReportDashboard.tsx`

**الغرض**: عرض تقارير شاملة لطلبات الصيانة المكتملة

**الاستخدام**:
```tsx
import { MaintenanceReportDashboard } from "@/components/reports/MaintenanceReportDashboard";

<MaintenanceReportDashboard />
```

**المميزات**:
- إحصائيات عامة (عدد الطلبات، التكلفة، المتوسط)
- رسوم بيانية:
  - توزيع حسب نوع الخدمة (Pie Chart)
  - التكلفة حسب نوع الخدمة (Bar Chart)
  - التايم لاين الشهري (Line Chart)
- جداول تفصيلية:
  - الطلبات الحالية المكتملة
  - الطلبات المؤرشفة

**البيانات**:
- يجمع من `maintenance_requests` (status = 'completed')
- يجمع من `maintenance_requests_archive`

**المكتبات المستخدمة**:
- `recharts` - الرسوم البيانية
- `date-fns` - معالجة التواريخ

---

### 7. **LocationPicker.tsx** - اختيار الموقع

**الموقع**: `src/components/forms/LocationPicker.tsx`

**الغرض**: اختيار موقع جغرافي باستخدام Google Maps

**الاستخدام**:
```tsx
import { LocationPicker } from "@/components/forms/LocationPicker";

<LocationPicker
  onLocationSelect={(lat, lng, address) => {
    setLatitude(lat);
    setLongitude(lng);
    setLocation(address);
  }}
  initialLatitude={latitude}
  initialLongitude={longitude}
/>
```

**الـ Props**:
```typescript
{
  onLocationSelect: (lat: number, lng: number, address?: string) => void;
  initialLatitude?: number;
  initialLongitude?: number;
}
```

**المميزات**:
- عرض خريطة Google Maps
- السماح بالنقر لاختيار موقع
- الحصول على العنوان من الإحداثيات (Geocoding)
- دعم الموقع الحالي (Current Location)

**⚠️ مشكلة أمنية**:
- Google Maps API Key يتم جلبه من Edge Function `get-maps-key`
- يجب تفعيل JWT verification

---

### 8. **WorkflowDiagram.tsx** - مخطط سير العمل

**الموقع**: `src/components/workflow/WorkflowDiagram.tsx`

**الغرض**: عرض مخطط بصري لمراحل الطلب

**الاستخدام**:
```tsx
import { WorkflowDiagram } from "@/components/workflow/WorkflowDiagram";

<WorkflowDiagram 
  currentStage={request.workflow_stage}
  requestData={request}
/>
```

**الـ Props**:
```typescript
{
  currentStage: string;      // المرحلة الحالية
  requestData: any;          // بيانات الطلب
}
```

**العرض**:
- خط زمني بصري
- تمييز المرحلة الحالية
- عرض المراحل المكتملة والقادمة

---

### 9. **MaterialRequestForm.tsx** - طلب المواد

**الموقع**: `src/components/workflow/MaterialRequestForm.tsx`

**الغرض**: إنشاء طلب لمواد إضافية للصيانة

**الاستخدام**:
```tsx
import { MaterialRequestForm } from "@/components/workflow/MaterialRequestForm";

<MaterialRequestForm 
  requestId={request.id}
  onSuccess={() => toast.success('تم إضافة طلب المواد')}
/>
```

**الـ Props**:
```typescript
{
  requestId: string;         // معرف الطلب
  onSuccess?: () => void;    // عند النجاح
}
```

**الحقول**:
```typescript
{
  material_name: string;     // اسم المادة
  quantity: number;          // الكمية
  unit: string;              // الوحدة
  estimated_cost?: number;   // التكلفة المتوقعة
  notes?: string;            // ملاحظات
}
```

**الجدول**: `material_requests`

---

### 10. **ApprovalManager.tsx** - إدارة الموافقات

**الموقع**: `src/components/workflow/ApprovalManager.tsx`

**الغرض**: إدارة موافقات مختلف مراحل الطلب

**الاستخدام**:
```tsx
import { ApprovalManager } from "@/components/workflow/ApprovalManager";

<ApprovalManager 
  requestId={request.id}
  approvalType="completion"
/>
```

**الـ Props**:
```typescript
{
  requestId: string;
  approvalType: 'request' | 'materials' | 'completion' | 'billing';
}
```

**أنواع الموافقات**:
1. `request` - الموافقة على الطلب نفسه
2. `materials` - الموافقة على طلبات المواد
3. `completion` - الموافقة على الإنجاز
4. `billing` - الموافقة على الفاتورة

---

## 🎨 مكونات UI (shadcn/ui)

جميع المكونات في `src/components/ui/` هي من مكتبة shadcn/ui:

**الأكثر استخداماً**:
- `Button` - الأزرار
- `Card` - البطاقات
- `Dialog` - النوافذ المنبثقة
- `Form` - النماذج
- `Input` - حقول الإدخال
- `Select` - القوائم المنسدلة
- `Table` - الجداول
- `Toast` - التنبيهات
- `Badge` - الشارات

**مثال**:
```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>عنوان البطاقة</CardTitle>
  </CardHeader>
  <CardContent>
    <Button>انقر هنا</Button>
  </CardContent>
</Card>
```

---

## 🪝 الهوكات المخصصة

### `useMaintenanceRequests`

**الموقع**: `src/hooks/useMaintenanceRequests.ts`

**الاستخدام**:
```tsx
import { useMaintenanceRequests } from "@/hooks/useMaintenanceRequests";

const { requests, loading, error, createRequest, updateRequest, deleteRequest, refetch } = useMaintenanceRequests();
```

**القيم المُرجعة**:
```typescript
{
  requests: MaintenanceRequest[];       // قائمة الطلبات
  loading: boolean;                     // حالة التحميل
  error: Error | null;                  // الخطأ إن وجد
  createRequest: (data) => Promise;     // إنشاء طلب
  updateRequest: (id, updates) => Promise;  // تحديث طلب
  deleteRequest: (id) => Promise;       // حذف طلب
  refetch: () => Promise;               // إعادة الجلب
}
```

### `useProperties`

**الموقع**: `src/hooks/useProperties.ts`

**الاستخدام**:
```tsx
import { useProperties } from "@/hooks/useProperties";

const { properties, loading, error, refetch } = useProperties();
```

### `useAppointments`

**الموقع**: `src/hooks/useAppointments.ts`

**الاستخدام**:
```tsx
import { useAppointments } from "@/hooks/useAppointments";

const { appointments, loading, createAppointment, updateAppointment } = useAppointments();
```

### `useVendors`

**الموقع**: `src/hooks/useVendors.ts`

**الاستخدام**:
```tsx
import { useVendors } from "@/hooks/useVendors";

const { vendors, loading, error } = useVendors();
```

### `useRequestFilters`

**الموقع**: `src/hooks/useRequestFilters.ts`

**الغرض**: تصفية طلبات الصيانة

**الاستخدام**:
```tsx
import { useRequestFilters } from "@/hooks/useRequestFilters";

const { 
  filteredRequests, 
  filters, 
  setFilters, 
  clearFilters 
} = useRequestFilters(requests);
```

---

## 🔄 سير عمل نموذجي

### إنشاء طلب صيانة كامل:

1. **المستخدم يفتح النموذج**:
   ```tsx
   <Requests /> → يعرض MaintenanceRequestsList
   → النقر على "طلب جديد" → يفتح Dialog مع NewRequestForm
   ```

2. **ملء النموذج**:
   - إدخال العنوان والوصف
   - اختيار نوع الخدمة والأولوية
   - اختيار الموقع (LocationPicker)
   - رفع الصور (ImageUpload)

3. **إرسال الطلب**:
   ```tsx
   NewRequestForm → handleSubmit()
   → useMaintenanceRequests.createRequest()
   → supabase.from('maintenance_requests').insert()
   → إنشاء lifecycle event
   → إرسال إشعار
   → البحث عن أقرب فني
   → التوجيه لصفحة التفاصيل
   ```

4. **عرض التفاصيل**:
   ```tsx
   /requests/:id → RequestDetails
   → MaintenanceRequestDetails (التفاصيل)
   → RequestLifecycleTracker (التاريخ)
   → RequestWorkflowControls (التحكم)
   ```

5. **إدارة الطلب (Admin)**:
   - تعيين فني
   - تغيير الحالة
   - جدولة موعد
   - طلب مواد
   - الموافقة على الإنجاز

6. **إكمال وإغلاق**:
   - الفني يحدث الحالة إلى "مكتمل"
   - Admin يراجع ويوافق
   - إنشاء فاتورة
   - إغلاق الطلب
   - أرشفة (اختياري)

---

## 📝 ملاحظات للمطورين

### 1. **التصميم المتجاوب**:
```tsx
import { useMediaQuery } from "@/hooks/use-mobile";

const isMobile = useMediaQuery("(max-width: 768px)");

{isMobile ? (
  <MobileComponent />
) : (
  <DesktopComponent />
)}
```

### 2. **إظهار التنبيهات**:
```tsx
import { useToast } from "@/hooks/use-toast";

const { toast } = useToast();

toast({
  title: "نجح",
  description: "تمت العملية بنجاح",
});

// للأخطاء
toast({
  title: "خطأ",
  description: "حدث خطأ",
  variant: "destructive",
});
```

### 3. **معالجة الأخطاء**:
```tsx
import { errorTracker } from "@/lib/errorTracking";

try {
  // عملية
} catch (error) {
  errorTracker.track(error, {
    level: 'error',
    metadata: { context: 'operation_name' }
  });
  toast({ title: "خطأ", variant: "destructive" });
}
```

### 4. **الصلاحيات**:
```tsx
// في الهوك
const { data: { user } } = await supabase.auth.getUser();

// في الكومبوننت
const checkPermission = async () => {
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  
  return data?.role === 'admin';
};
```

---

## 🎯 الخلاصة

- **الهيكل واضح ومنظم** - كل مكون له غرض محدد
- **الهوكات المخصصة** - تسهل إدارة البيانات
- **مكونات قابلة لإعادة الاستخدام** - DRY principle
- **التوثيق الجيد** - كل مكون موثق
- **التصميم المتجاوب** - يعمل على جميع الأجهزة

**🚀 النظام جاهز للاستخدام والتطوير!**
