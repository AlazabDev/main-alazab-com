-- Phase 1: Critical Security Fixes

-- 1. Drop insecure Security Definer views
DROP VIEW IF EXISTS public.appointments_protected CASCADE;
DROP VIEW IF EXISTS public.appointments_safe CASCADE;

-- 2. Consolidate role checking functions - update to use user_roles table
-- Drop old role functions that used profiles.role
DROP FUNCTION IF EXISTS public.get_user_role() CASCADE;
DROP FUNCTION IF EXISTS public.get_current_user_role() CASCADE;
DROP FUNCTION IF EXISTS public.current_user_role() CASCADE;

-- Keep only has_role() which uses the secure user_roles table
-- (already exists from previous migration)

-- 3. Enable RLS on kv_store table
ALTER TABLE public.kv_store_4e5b82c2 ENABLE ROW LEVEL SECURITY;

-- Only admins can access kv_store
CREATE POLICY "Only admins can manage kv_store"
ON public.kv_store_4e5b82c2 FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Restrict vendor data access - technicians should NOT see contact info
DROP POLICY IF EXISTS "Technicians can view vendors" ON public.vendors;
DROP POLICY IF EXISTS "Staff can view all vendors" ON public.vendors;

-- Admins/managers get full vendor data
CREATE POLICY "Admins and managers can view all vendor data"
ON public.vendors FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'manager')
);

-- Vendors can view their own data
CREATE POLICY "Vendors can view their own data"
ON public.vendors FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id FROM public.profiles WHERE id = vendors.id
  ) AND public.has_role(auth.uid(), 'vendor')
);

-- 5. Add customer data access logging function
CREATE OR REPLACE FUNCTION public.log_customer_data_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log when staff access customer contact info
  IF TG_OP = 'SELECT' AND (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'manager') OR 
    public.has_role(auth.uid(), 'staff')
  ) THEN
    INSERT INTO public.audit_logs (
      user_id, 
      action, 
      table_name, 
      record_id,
      new_values
    )
    VALUES (
      auth.uid(), 
      'CUSTOMER_DATA_ACCESS', 
      TG_TABLE_NAME, 
      NEW.id,
      jsonb_build_object('accessed_at', NOW())
    );
  END IF;
  RETURN NEW;
END;
$$;

-- 6. Create secure function to get customer contact info (field-level security)
CREATE OR REPLACE FUNCTION public.get_customer_contact_info(
  appointment_id UUID
)
RETURNS TABLE(
  customer_name TEXT,
  customer_phone TEXT,
  customer_email TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only admin/manager can access customer contact info
  IF NOT (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'manager')
  ) THEN
    RAISE EXCEPTION 'Access denied: Only admins and managers can access customer contact information';
  END IF;

  -- Log the access
  INSERT INTO public.audit_logs (
    user_id, 
    action, 
    table_name, 
    record_id,
    new_values
  )
  VALUES (
    auth.uid(), 
    'CUSTOMER_DATA_ACCESS', 
    'appointments', 
    appointment_id,
    jsonb_build_object('accessed_at', NOW(), 'accessor_role', 'admin_or_manager')
  );

  -- Return the data
  RETURN QUERY
  SELECT a.customer_name, a.customer_phone, a.customer_email
  FROM public.appointments a
  WHERE a.id = appointment_id;
END;
$$;

-- 7. Update ALL RLS policies that used old role functions
-- Update maintenance_requests policies
DROP POLICY IF EXISTS "Users can update own requests or assigned vendors" ON public.maintenance_requests;
DROP POLICY IF EXISTS "Users can view own maintenance requests" ON public.maintenance_requests;

CREATE POLICY "Users can view own maintenance requests"
ON public.maintenance_requests FOR SELECT
TO authenticated
USING (
  auth.uid() = requested_by OR
  (auth.uid() = assigned_vendor_id AND public.has_role(auth.uid(), 'vendor')) OR
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'manager') OR 
  public.has_role(auth.uid(), 'staff')
);

CREATE POLICY "Users can update own requests or assigned vendors"
ON public.maintenance_requests FOR UPDATE
TO authenticated
USING (
  (auth.uid() = requested_by AND status IN ('pending', 'scheduled')) OR
  (auth.uid() = assigned_vendor_id AND public.has_role(auth.uid(), 'vendor')) OR
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'manager') OR 
  public.has_role(auth.uid(), 'staff')
);

-- Update request_lifecycle policies
DROP POLICY IF EXISTS "Staff can manage request lifecycle" ON public.request_lifecycle;
DROP POLICY IF EXISTS "Users can view request lifecycle" ON public.request_lifecycle;

CREATE POLICY "Staff can manage request lifecycle"
ON public.request_lifecycle FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'manager') OR 
  public.has_role(auth.uid(), 'staff')
);

CREATE POLICY "Users can view request lifecycle"
ON public.request_lifecycle FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.maintenance_requests mr
    WHERE mr.id = request_lifecycle.request_id 
    AND (mr.requested_by = auth.uid() OR mr.assigned_vendor_id = auth.uid())
  ) OR
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'manager') OR 
  public.has_role(auth.uid(), 'staff')
);

-- Update request_reviews policies
DROP POLICY IF EXISTS "Users can view relevant reviews" ON public.request_reviews;

CREATE POLICY "Users can view relevant reviews"
ON public.request_reviews FOR SELECT
TO authenticated
USING (
  reviewer_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.maintenance_requests mr
    WHERE mr.id = request_reviews.request_id 
    AND (mr.requested_by = auth.uid() OR mr.assigned_vendor_id = auth.uid())
  ) OR
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'manager') OR 
  public.has_role(auth.uid(), 'staff')
);

-- 8. Add comment to deprecate profiles.role column
COMMENT ON COLUMN public.profiles.role IS 'DEPRECATED: Use user_roles table instead. This column will be removed in a future migration.';

-- 9. Clean up duplicate/overlapping profiles policies
DROP POLICY IF EXISTS "Users and staff can view appropriate profiles" ON public.profiles;
DROP POLICY IF EXISTS "Staff can view basic profile info using function" ON public.profiles;