# 🏗️ معمارية النظام

دليل تفصيلي لمعمارية نظام إدارة الصيانة.

## 📋 جدول المحتويات

1. [نظرة عامة](#overview)
2. [البنية التقنية](#tech-stack)
3. [معمارية قاعدة البيانات](#database)
4. [دورة حياة طلب الصيانة](#lifecycle)
5. [نظام الصلاحيات](#permissions)
6. [Edge Functions](#edge-functions)
7. [Real-time Updates](#realtime)
8. [الأمان](#security)

---

## 🎯 نظرة عامة {#overview}

النظام عبارة عن **Full-stack TypeScript application** يستخدم:
- **Frontend**: React SPA
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Architecture Pattern**: JAMstack

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │           React Application (SPA)                 │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────┐ │  │
│  │  │  Components │  │  Hooks/State │  │  Router  │ │  │
│  │  └─────────────┘  └──────────────┘  └──────────┘ │  │
│  └───────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS/WebSocket
                       ▼
┌─────────────────────────────────────────────────────────┐
│                   Supabase Platform                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL  │  │ Edge Functions│  │   Storage    │  │
│  │   Database   │  │   (Deno)     │  │   (S3-like)  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │     Auth     │  │   Realtime   │  │   Analytics  │  │
│  │   (JWT)      │  │  (WebSocket) │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              External Services                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Google Maps  │  │   OpenAI     │  │   Resend     │  │
│  │     API      │  │     API      │  │    Email     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 البنية التقنية {#tech-stack}

### Frontend Stack

```typescript
// Core
- React 18          // UI Library
- TypeScript 5      // Type Safety
- Vite 5            // Build Tool & Dev Server

// Routing & State
- React Router 6    // Client-side Routing
- React Query       // Server State & Caching
- Zustand          // (if needed) Client State

// UI Framework
- Tailwind CSS     // Utility-first CSS
- shadcn/ui        // React Components
- Radix UI         // Unstyled Primitives
- Lucide React     // Icons

// Forms & Validation
- React Hook Form  // Form Management
- Zod              // Schema Validation

// Date & Time
- date-fns         // Date Utilities

// Maps
- Google Maps API  // Maps & Geocoding
```

### Backend Stack

```typescript
// Database
- PostgreSQL 15+   // Relational Database
- PostGIS          // Geo Extensions

// BaaS Platform
- Supabase
  ├── Auth         // Authentication (JWT)
  ├── Database     // PostgreSQL with RLS
  ├── Storage      // S3-compatible storage
  ├── Functions    // Edge Functions (Deno)
  └── Realtime     // WebSocket subscriptions

// Edge Runtime
- Deno             // TypeScript runtime
```

---

## 💾 معمارية قاعدة البيانات {#database}

### ERD (Entity Relationship Diagram)

```
┌─────────────────┐
│     users       │ (Supabase Auth)
│  (auth schema)  │
└────────┬────────┘
         │ 1
         │
         │ 1:1
         ▼
┌─────────────────┐         ┌──────────────────┐
│    profiles     │────────▶│   user_roles     │
│                 │ 1:N     │                  │
│  - user_id (FK) │         │  - user_id (FK)  │
│  - first_name   │         │  - role (enum)   │
│  - last_name    │         └──────────────────┘
│  - phone        │
│  - avatar_url   │
└────────┬────────┘
         │ 1
         │
         │ 1:N
         ▼
┌─────────────────────────────────────┐
│     maintenance_requests            │
│                                     │
│  - id (PK)                          │
│  - requested_by (FK → profiles)     │
│  - assigned_vendor_id (FK → vendors)│
│  - property_id (FK → properties)    │
│  - status                           │
│  - workflow_stage (enum)            │
│  - priority                         │
│  - service_type                     │
│  - latitude, longitude              │
│  - sla_due_date                     │
│  - ...                              │
└──────┬──────────────┬───────────────┘
       │ 1            │ 1
       │              │
       │ 1:N          │ 1:N
       ▼              ▼
┌──────────────┐  ┌─────────────────┐
│request_      │  │  work_tasks     │
│lifecycle     │  │                 │
│              │  │  - request_id   │
│ - request_id │  │  - title        │
│ - status     │  │  - assigned_to  │
│ - update_type│  │  - status       │
│ - updated_by │  │  - ...          │
│ - metadata   │  └─────────────────┘
└──────────────┘
       │ 1
       │
       │ 1:N
       ▼
┌──────────────────┐
│ request_reviews  │
│                  │
│  - request_id    │
│  - reviewer_id   │
│  - overall_rating│
│  - ...           │
└──────────────────┘
```

### الجداول الرئيسية

#### 1. **profiles** - ملفات المستخدمين
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id),
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### 2. **user_roles** - أدوار المستخدمين
```sql
CREATE TYPE app_role AS ENUM (
  'customer', 'vendor', 'staff', 'manager', 'admin'
);

CREATE TABLE user_roles (
  user_id UUID REFERENCES auth.users(id),
  role app_role NOT NULL,
  PRIMARY KEY (user_id, role)
);
```

#### 3. **maintenance_requests** - طلبات الصيانة
```sql
CREATE TYPE maintenance_status AS ENUM (
  'draft', 'submitted', 'acknowledged', 'assigned',
  'scheduled', 'in_progress', 'inspection', 'waiting_parts',
  'completed', 'billed', 'paid', 'closed', 'cancelled', 'on_hold'
);

CREATE TABLE maintenance_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Client Info
  client_name TEXT NOT NULL,
  client_phone TEXT,
  client_email TEXT,
  location TEXT NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  
  -- Request Details
  title TEXT NOT NULL,
  description TEXT,
  service_type TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  
  -- Assignment
  requested_by UUID REFERENCES auth.users(id),
  assigned_vendor_id UUID REFERENCES vendors(id),
  property_id UUID REFERENCES properties(id),
  
  -- Status & Workflow
  status TEXT DEFAULT 'pending',
  workflow_stage maintenance_status DEFAULT 'submitted',
  
  -- SLA & Quality
  sla_due_date TIMESTAMPTZ,
  escalation_level INTEGER DEFAULT 0,
  quality_score NUMERIC(3,2) DEFAULT 0.00,
  
  -- Dates
  preferred_date DATE,
  preferred_time VARCHAR,
  estimated_completion DATE,
  actual_completion TIMESTAMPTZ,
  
  -- Costs
  estimated_cost NUMERIC,
  actual_cost NUMERIC,
  
  -- Feedback
  rating INTEGER,
  customer_notes TEXT,
  vendor_notes TEXT,
  completion_photos TEXT[],
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  archived_at TIMESTAMPTZ,
  
  -- Follow-up
  follow_up_required BOOLEAN DEFAULT true,
  follow_up_date TIMESTAMPTZ
);
```

#### 4. **request_lifecycle** - تتبع دورة الحياة
```sql
CREATE TYPE lifecycle_update_type AS ENUM (
  'status_change', 'assignment', 'note', 'escalation', 'milestone'
);

CREATE TABLE request_lifecycle (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES maintenance_requests(id),
  status maintenance_status NOT NULL,
  update_type lifecycle_update_type NOT NULL,
  updated_by UUID REFERENCES auth.users(id),
  update_notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Indexes للأداء

```sql
-- Maintenance Requests
CREATE INDEX idx_maintenance_requests_requested_by 
  ON maintenance_requests(requested_by);
CREATE INDEX idx_maintenance_requests_assigned_vendor 
  ON maintenance_requests(assigned_vendor_id);
CREATE INDEX idx_maintenance_requests_status 
  ON maintenance_requests(status);
CREATE INDEX idx_maintenance_requests_workflow_stage 
  ON maintenance_requests(workflow_stage);
CREATE INDEX idx_maintenance_requests_location 
  ON maintenance_requests USING GIST(
    ll_to_earth(latitude::float, longitude::float)
  );

-- Request Lifecycle
CREATE INDEX idx_request_lifecycle_request_id 
  ON request_lifecycle(request_id);
CREATE INDEX idx_request_lifecycle_created_at 
  ON request_lifecycle(created_at DESC);
```

---

## 🔄 دورة حياة طلب الصيانة {#lifecycle}

### المراحل (13 مرحلة)

```
1. draft           → مسودة (اختياري)
2. submitted       → تم الإرسال ✓ (نقطة البداية)
3. acknowledged    → تم الاستلام
4. assigned        → تم التعيين ✓ (تعيين فني)
5. scheduled       → تم الجدولة
6. in_progress     → قيد التنفيذ ✓
7. inspection      → فحص الجودة
8. waiting_parts   → انتظار قطع غيار
9. completed       → مكتمل ✓
10. billed         → تم إصدار فاتورة
11. paid           → تم الدفع
12. closed         → مغلق ✓
13. cancelled      → ملغي
14. on_hold        → معلق
```

### Flow Diagram

```
                    ┌─────────┐
                    │  draft  │ (اختياري)
                    └────┬────┘
                         │
                         ▼
                   ┌──────────┐
           ┌──────▶│submitted │◀──────┐
           │       └────┬─────┘       │
           │            │             │
        cancel      acknowledge    cancel
           │            │             │
           │            ▼             │
           │      ┌──────────┐        │
           │      │acknowledged       │
           │      └────┬─────┘        │
           │           │              │
           │        assign            │
           │           │              │
           │           ▼              │
           │      ┌──────────┐        │
           │ ┌───▶│ assigned │◀───┐   │
           │ │    └────┬─────┘    │   │
           │ │         │          │   │
           │reassign schedule  reassign │
           │ │         │          │   │
           │ │         ▼          │   │
           │ │    ┌──────────┐    │   │
           │ │    │scheduled │────┘   │
           │ │    └────┬─────┘        │
           │ │         │              │
           │ │       start            │
           │ │         │              │
           │ │         ▼              │
           │ │    ┌──────────┐        │
           │ └───▶│in_progress├───────┤
           │      └────┬─────┘        │
           │           │              │
           │         done             │
           │           │              │
           │           ▼              │
           │      ┌──────────┐        │
           │      │inspection│        │
           │      └────┬─────┘        │
           │           │              │
           │      ┌────┴────┐         │
           │      │         │         │
           │    pass      fail        │
           │      │         │         │
           │      │         └─────────┘
           │      ▼
           │ ┌──────────┐
           │ │completed │
           │ └────┬─────┘
           │      │
           │    bill
           │      │
           │      ▼
           │ ┌──────────┐
           │ │ billed   │
           │ └────┬─────┘
           │      │
           │    pay
           │      │
           │      ▼
           │ ┌──────────┐
           │ │  paid    │
           │ └────┬─────┘
           │      │
           │   close
           │      │
           │      ▼
           │ ┌──────────┐
           └▶│ cancelled│
             └──────────┘
             ┌──────────┐
             │  closed  │
             └──────────┘
```

### Workflow Transitions (Allowed)

```typescript
const workflowTransitions: Record<WorkflowStage, WorkflowStage[]> = {
  draft: ['submitted', 'cancelled'],
  submitted: ['acknowledged', 'cancelled'],
  acknowledged: ['assigned', 'cancelled'],
  assigned: ['scheduled', 'in_progress', 'cancelled'],
  scheduled: ['in_progress', 'assigned', 'cancelled'],
  in_progress: ['inspection', 'waiting_parts', 'completed', 'on_hold'],
  inspection: ['completed', 'in_progress'],
  waiting_parts: ['in_progress'],
  completed: ['billed', 'closed'],
  billed: ['paid'],
  paid: ['closed'],
  closed: [],
  cancelled: [],
  on_hold: ['in_progress', 'cancelled']
};
```

### Trigger للـ Logging التلقائي

```sql
CREATE OR REPLACE FUNCTION log_request_lifecycle()
RETURNS TRIGGER AS $$
BEGIN
  -- تسجيل تغيير الحالة
  IF TG_OP = 'UPDATE' AND OLD.workflow_stage IS DISTINCT FROM NEW.workflow_stage THEN
    INSERT INTO request_lifecycle (
      request_id, 
      status, 
      update_type, 
      updated_by, 
      update_notes,
      metadata
    ) VALUES (
      NEW.id,
      NEW.workflow_stage,
      'status_change',
      auth.uid(),
      CONCAT('Status changed from ', OLD.workflow_stage, ' to ', NEW.workflow_stage),
      jsonb_build_object(
        'old_status', OLD.workflow_stage, 
        'new_status', NEW.workflow_stage
      )
    );
  END IF;

  -- تسجيل تعيين فني
  IF TG_OP = 'UPDATE' AND OLD.assigned_vendor_id IS DISTINCT FROM NEW.assigned_vendor_id THEN
    INSERT INTO request_lifecycle (
      request_id, 
      status, 
      update_type, 
      updated_by, 
      update_notes,
      metadata
    ) VALUES (
      NEW.id,
      NEW.workflow_stage,
      'assignment',
      auth.uid(),
      'Vendor assignment updated',
      jsonb_build_object(
        'old_vendor', OLD.assigned_vendor_id, 
        'new_vendor', NEW.assigned_vendor_id
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER log_request_lifecycle_trigger
  AFTER UPDATE ON maintenance_requests
  FOR EACH ROW
  EXECUTE FUNCTION log_request_lifecycle();
```

---

## 🔐 نظام الصلاحيات {#permissions}

### الأدوار (Roles)

```typescript
enum AppRole {
  CUSTOMER = 'customer',    // عميل عادي
  VENDOR = 'vendor',        // فني صيانة
  STAFF = 'staff',          // موظف
  MANAGER = 'manager',      // مدير
  ADMIN = 'admin'           // مدير النظام
}
```

### صلاحيات كل دور

| الدور | الصلاحيات |
|-------|-----------|
| **customer** | - إنشاء طلبات صيانة<br>- عرض طلباته فقط<br>- تحديث طلباته في حالات معينة<br>- تقييم الخدمة |
| **vendor** | - عرض الطلبات المعينة له<br>- تحديث حالة الطلب<br>- إضافة ملاحظات وصور<br>- إدارة مهام العمل |
| **staff** | - عرض جميع الطلبات<br>- تعيين الفنيين<br>- تحديث الطلبات<br>- إدارة العمليات |
| **manager** | - جميع صلاحيات staff<br>- الموافقة على الطلبات<br>- عرض التقارير<br>- إدارة الفنيين |
| **admin** | - صلاحيات كاملة<br>- إدارة المستخدمين<br>- إدارة الأدوار<br>- إعدادات النظام |

### RLS Policies Example

```sql
-- Maintenance Requests Policies

-- SELECT: Users see own requests OR assigned requests OR staff see all
CREATE POLICY "maintenance_requests_select" 
ON maintenance_requests FOR SELECT
USING (
  auth.uid() = requested_by OR
  (auth.uid() = assigned_vendor_id AND has_role(auth.uid(), 'vendor')) OR
  has_role(auth.uid(), 'admin') OR
  has_role(auth.uid(), 'manager') OR
  has_role(auth.uid(), 'staff')
);

-- INSERT: Users create their own requests OR staff
CREATE POLICY "maintenance_requests_insert" 
ON maintenance_requests FOR INSERT
WITH CHECK (
  auth.uid() = requested_by OR
  has_role(auth.uid(), 'admin') OR
  has_role(auth.uid(), 'manager') OR
  has_role(auth.uid(), 'staff')
);

-- UPDATE: Owner, assigned vendor, or staff
CREATE POLICY "maintenance_requests_update" 
ON maintenance_requests FOR UPDATE
USING (
  (auth.uid() = requested_by AND status IN ('pending', 'scheduled')) OR
  (auth.uid() = assigned_vendor_id AND has_role(auth.uid(), 'vendor')) OR
  has_role(auth.uid(), 'admin') OR
  has_role(auth.uid(), 'manager') OR
  has_role(auth.uid(), 'staff')
);

-- DELETE: Only admin/manager
CREATE POLICY "maintenance_requests_delete" 
ON maintenance_requests FOR DELETE
USING (
  has_role(auth.uid(), 'admin') OR
  has_role(auth.uid(), 'manager')
);
```

### Helper Function

```sql
CREATE OR REPLACE FUNCTION has_role(user_id UUID, role_name app_role)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = $1 AND role = $2
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;
```

---

## ⚡ Edge Functions {#edge-functions}

### قائمة الـ Functions

1. **send-notification** - إرسال إشعارات وتعيين فني
2. **get-maps-key** - جلب Google Maps API Key
3. **chatbot** - AI Chatbot
4. **error-tracking** - تتبع الأخطاء

### Architecture Pattern

```typescript
// supabase/functions/send-notification/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Parse request
    const request = await req.json();
    
    // Validation
    if (!request.maintenanceRequestId) {
      throw new Error('Missing required fields');
    }
    
    // Business logic
    const result = await processNotification(supabase, request);
    
    // Return response
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

### Deployment

```bash
# Deploy single function
supabase functions deploy send-notification

# Deploy all functions
supabase functions deploy
```

---

## 🔴 Real-time Updates {#realtime}

### Supabase Realtime Subscription

```typescript
// في React Component
useEffect(() => {
  const channel = supabase
    .channel('maintenance-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'maintenance_requests'
      },
      (payload) => {
        console.log('Change received!', payload);
        // تحديث الـ state
        refetch();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

### Enable Realtime على الجداول

```sql
ALTER TABLE maintenance_requests REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE maintenance_requests;

ALTER TABLE notifications REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
```

---

## 🛡️ الأمان {#security}

### Security Layers

```
1. Authentication (Supabase Auth + JWT)
   ↓
2. Authorization (RLS Policies)
   ↓
3. Input Validation (Zod schemas)
   ↓
4. API Rate Limiting (Supabase built-in)
   ↓
5. HTTPS/TLS (Supabase + Vercel)
   ↓
6. Audit Logging (audit_logs table)
```

### Best Practices المطبّقة

✅ **Row Level Security (RLS)** على جميع الجداول
✅ **Security Definer Functions** للعمليات الحساسة
✅ **JWT Verification** في Edge Functions
✅ **Input Validation** باستخدام Zod
✅ **CORS Policies** محددة
✅ **Secrets Management** عبر Supabase Vault
✅ **Audit Logging** لجميع العمليات الحساسة
✅ **Rate Limiting** على APIs
✅ **Content Security Policy (CSP)** Headers

---

## 📊 Performance Optimizations

### Database
- Indexes على الأعمدة المستخدمة في WHERE و JOIN
- Materialized Views للتقارير
- Connection Pooling (Supabase built-in)

### Frontend
- Code Splitting (React.lazy)
- Image Optimization
- Service Worker للـ Offline support
- React Query للـ caching

### Monitoring
- Supabase Analytics
- Error tracking (error-tracking Edge Function)
- Performance metrics (web vitals)

---

## 🔄 Future Enhancements

- [ ] WebSocket للـ Real-time chat
- [ ] Push Notifications (FCM)
- [ ] Offline-first architecture (Service Worker + IndexedDB)
- [ ] Advanced Analytics Dashboard
- [ ] Mobile App (React Native أو Capacitor)
- [ ] Multi-tenancy support
- [ ] Advanced Reporting (PDF generation)
- [ ] Integration مع أنظمة المحاسبة

---

هذه معمارية قوية، آمنة، وقابلة للتوسع. ✨
