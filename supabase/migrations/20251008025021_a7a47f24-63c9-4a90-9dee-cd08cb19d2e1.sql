-- إنشاء جدول طلبات المواد والأذون المخزنية
CREATE TABLE IF NOT EXISTS public.material_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.maintenance_requests(id) ON DELETE CASCADE,
  material_name TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  estimated_cost NUMERIC,
  actual_cost NUMERIC,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'issued', 'returned')),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  issued_by UUID REFERENCES auth.users(id),
  issued_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول التقارير
CREATE TABLE IF NOT EXISTS public.maintenance_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.maintenance_requests(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN ('progress', 'engineering', 'final', 'accounting')),
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  data_analysis JSONB,
  attachments TEXT[],
  prepared_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول موافقات الطلبات
CREATE TABLE IF NOT EXISTS public.request_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.maintenance_requests(id) ON DELETE CASCADE,
  approval_type TEXT NOT NULL CHECK (approval_type IN ('request', 'materials', 'completion', 'billing')),
  approver_id UUID NOT NULL REFERENCES auth.users(id),
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  comments TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تفعيل RLS
ALTER TABLE public.material_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_approvals ENABLE ROW LEVEL SECURITY;

-- سياسات RLS لطلبات المواد
CREATE POLICY "الموظفون يمكنهم عرض طلبات المواد"
ON public.material_requests FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.maintenance_requests mr
    WHERE mr.id = material_requests.request_id
    AND (mr.requested_by = auth.uid() OR mr.assigned_vendor_id = auth.uid() OR is_staff(auth.uid()))
  )
);

CREATE POLICY "الموظفون يمكنهم إدارة طلبات المواد"
ON public.material_requests FOR ALL
TO authenticated
USING (is_staff(auth.uid()))
WITH CHECK (is_staff(auth.uid()));

-- سياسات RLS للتقارير
CREATE POLICY "المستخدمون يمكنهم عرض تقاريرهم"
ON public.maintenance_reports FOR SELECT
TO authenticated
USING (
  prepared_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.maintenance_requests mr
    WHERE mr.id = maintenance_reports.request_id
    AND (mr.requested_by = auth.uid() OR is_staff(auth.uid()))
  )
);

CREATE POLICY "الموظفون يمكنهم إدارة التقارير"
ON public.maintenance_reports FOR ALL
TO authenticated
USING (is_staff(auth.uid()))
WITH CHECK (is_staff(auth.uid()));

-- سياسات RLS للموافقات
CREATE POLICY "المستخدمون يمكنهم عرض الموافقات"
ON public.request_approvals FOR SELECT
TO authenticated
USING (
  approver_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.maintenance_requests mr
    WHERE mr.id = request_approvals.request_id
    AND (mr.requested_by = auth.uid() OR is_staff(auth.uid()))
  )
);

CREATE POLICY "المعتمدون يمكنهم إدارة الموافقات"
ON public.request_approvals FOR ALL
TO authenticated
USING (approver_id = auth.uid() OR is_staff(auth.uid()))
WITH CHECK (is_staff(auth.uid()));

-- إضافة أدوار جديدة لقاعدة البيانات
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'staff', 'technician', 'vendor', 'customer', 'warehouse', 'accounting', 'engineering');
  ELSE
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'warehouse';
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'accounting';
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'engineering';
  END IF;
END
$$;

-- إنشاء دالة لتحديث التوقيت
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إضافة triggers للتحديث التلقائي
CREATE TRIGGER update_material_requests_updated_at
BEFORE UPDATE ON public.material_requests
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_reports_updated_at
BEFORE UPDATE ON public.maintenance_reports
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();