-- إضافة الحقول المفقودة لجدول maintenance_requests
ALTER TABLE public.maintenance_requests
ADD COLUMN IF NOT EXISTS client_name TEXT,
ADD COLUMN IF NOT EXISTS client_phone TEXT,
ADD COLUMN IF NOT EXISTS client_email TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS service_type TEXT,
ADD COLUMN IF NOT EXISTS estimated_cost NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS actual_cost NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 5),
ADD COLUMN IF NOT EXISTS workflow_stage TEXT DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS sla_due_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS assigned_vendor_id UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS vendor_notes TEXT,
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- إنشاء trigger لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_maintenance_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_maintenance_requests_updated_at ON public.maintenance_requests;

CREATE TRIGGER set_maintenance_requests_updated_at
  BEFORE UPDATE ON public.maintenance_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_maintenance_requests_updated_at();

-- إنشاء index للحقول الجديدة المهمة
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_workflow_stage ON public.maintenance_requests(workflow_stage);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_assigned_vendor ON public.maintenance_requests(assigned_vendor_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_service_type ON public.maintenance_requests(service_type);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_sla_due ON public.maintenance_requests(sla_due_date);