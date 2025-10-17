-- إضافة الأعمدة المفقودة لجدول profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS avatar_url text;

-- إنشاء جدول stores
CREATE TABLE IF NOT EXISTS public.stores (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  name text NOT NULL,
  location text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT stores_pkey PRIMARY KEY (id)
);

ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS stores_read_all ON public.stores;
CREATE POLICY stores_read_all ON public.stores
FOR SELECT USING (true);

DROP POLICY IF EXISTS stores_staff_manage ON public.stores;
CREATE POLICY stores_staff_manage ON public.stores
FOR ALL USING (is_staff(auth.uid()))
WITH CHECK (is_staff(auth.uid()));

-- إنشاء جدول maintenance_requests_archive
CREATE TABLE IF NOT EXISTS public.maintenance_requests_archive (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  store_id uuid,
  title text NOT NULL,
  description text,
  status text,
  priority text,
  service_type text,
  primary_service_id uuid,
  created_by uuid,
  updated_by uuid,
  assigned_to uuid,
  estimated_cost numeric,
  actual_cost numeric,
  scheduled_date timestamp without time zone,
  completion_date timestamp without time zone,
  is_deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT maintenance_requests_archive_pkey PRIMARY KEY (id),
  CONSTRAINT maintenance_requests_archive_status_check CHECK (
    status = ANY (ARRAY['pending'::text, 'in-progress'::text, 'completed'::text])
  ),
  CONSTRAINT maintenance_requests_archive_priority_check CHECK (
    priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'urgent'::text])
  ),
  CONSTRAINT maintenance_requests_archive_service_type_check CHECK (
    service_type = ANY (ARRAY['maintenance'::text, 'renovation'::text])
  )
);

ALTER TABLE public.maintenance_requests_archive ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS archive_read_all ON public.maintenance_requests_archive;
CREATE POLICY archive_read_all ON public.maintenance_requests_archive
FOR SELECT USING (
  is_staff(auth.uid()) OR created_by = auth.uid()
);

DROP POLICY IF EXISTS archive_staff_manage ON public.maintenance_requests_archive;
CREATE POLICY archive_staff_manage ON public.maintenance_requests_archive
FOR ALL USING (is_staff(auth.uid()))
WITH CHECK (is_staff(auth.uid()));

-- trigger لتحديث updated_at
CREATE OR REPLACE FUNCTION update_archive_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS maintenance_requests_archive_updated_at ON public.maintenance_requests_archive;
CREATE TRIGGER maintenance_requests_archive_updated_at
BEFORE UPDATE ON public.maintenance_requests_archive
FOR EACH ROW
EXECUTE FUNCTION update_archive_updated_at();