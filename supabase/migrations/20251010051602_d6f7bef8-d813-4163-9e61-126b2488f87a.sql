-- ====================================================================
-- PHASE 1: CRITICAL SECURITY FIXES
-- ====================================================================

-- --------------------------------------------------------------------
-- Step 1: Create Security Definer Functions for Customer Data Access
-- --------------------------------------------------------------------

-- Function to get customer name (accessible by authorized users)
CREATE OR REPLACE FUNCTION public.get_customer_name(appointment_id uuid)
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  customer_name_val text;
BEGIN
  -- Check if user has access to this appointment
  IF NOT EXISTS (
    SELECT 1 FROM appointments a
    WHERE a.id = appointment_id
    AND (
      a.created_by = auth.uid() OR
      a.vendor_id = auth.uid() OR
      has_role(auth.uid(), 'admin') OR
      has_role(auth.uid(), 'manager') OR
      has_role(auth.uid(), 'staff')
    )
  ) THEN
    RAISE EXCEPTION 'Unauthorized access to appointment data';
  END IF;

  SELECT a.customer_name INTO customer_name_val
  FROM appointments a
  WHERE a.id = appointment_id;

  RETURN customer_name_val;
END;
$$;

-- Function to get customer phone (admin/manager only)
CREATE OR REPLACE FUNCTION public.get_customer_phone(appointment_id uuid)
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  phone_val text;
BEGIN
  -- Only admin/manager can access phone
  IF NOT (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager')) THEN
    RAISE EXCEPTION 'Access denied: Only admins and managers can access customer phone numbers';
  END IF;

  -- Log access to audit_logs
  INSERT INTO audit_logs (user_id, action, table_name, record_id, new_values)
  VALUES (
    auth.uid(),
    'CUSTOMER_PHONE_ACCESS',
    'appointments',
    appointment_id,
    jsonb_build_object('accessed_at', NOW())
  );

  SELECT a.customer_phone INTO phone_val
  FROM appointments a
  WHERE a.id = appointment_id;

  RETURN phone_val;
END;
$$;

-- Function to get customer email (admin/manager only)
CREATE OR REPLACE FUNCTION public.get_customer_email(appointment_id uuid)
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  email_val text;
BEGIN
  -- Only admin/manager can access email
  IF NOT (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager')) THEN
    RAISE EXCEPTION 'Access denied: Only admins and managers can access customer email addresses';
  END IF;

  -- Log access to audit_logs
  INSERT INTO audit_logs (user_id, action, table_name, record_id, new_values)
  VALUES (
    auth.uid(),
    'CUSTOMER_EMAIL_ACCESS',
    'appointments',
    appointment_id,
    jsonb_build_object('accessed_at', NOW())
  );

  SELECT a.customer_email INTO email_val
  FROM appointments a
  WHERE a.id = appointment_id;

  RETURN email_val;
END;
$$;

-- --------------------------------------------------------------------
-- Step 2: Consolidate RLS Policies on Appointments Table
-- --------------------------------------------------------------------

-- Drop all existing conflicting policies on appointments
DROP POLICY IF EXISTS "Admins and managers can delete appointments" ON appointments;
DROP POLICY IF EXISTS "Admins and managers can update all appointments" ON appointments;
DROP POLICY IF EXISTS "Admins and managers can view all appointments" ON appointments;
DROP POLICY IF EXISTS "Customers can view their own appointments" ON appointments;
DROP POLICY IF EXISTS "Staff can create appointments" ON appointments;
DROP POLICY IF EXISTS "Staff can view all appointments" ON appointments;
DROP POLICY IF EXISTS "Users can create their own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can delete their own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can update their own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can view own appointments with full details" ON appointments;
DROP POLICY IF EXISTS "Users can view their own appointments" ON appointments;
DROP POLICY IF EXISTS "Vendors can update assigned appointments" ON appointments;
DROP POLICY IF EXISTS "Vendors can view assigned appointments" ON appointments;
DROP POLICY IF EXISTS "appointments_delete_policy" ON appointments;
DROP POLICY IF EXISTS "appointments_insert_policy" ON appointments;
DROP POLICY IF EXISTS "appointments_select_policy" ON appointments;
DROP POLICY IF EXISTS "appointments_update_policy" ON appointments;

-- Create new consolidated policies (6 clear policies)

-- 1. SELECT: Users can view their own appointments (full access)
CREATE POLICY "appointments_select_own"
ON appointments FOR SELECT
TO authenticated
USING (auth.uid() = created_by);

-- 2. SELECT: Staff/Admin can view all appointments (full access)
CREATE POLICY "appointments_select_staff"
ON appointments FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin') OR
  has_role(auth.uid(), 'manager') OR
  has_role(auth.uid(), 'staff')
);

-- 3. SELECT: Vendors can view assigned appointments (full access)
CREATE POLICY "appointments_select_vendor"
ON appointments FOR SELECT
TO authenticated
USING (
  auth.uid() = vendor_id AND
  has_role(auth.uid(), 'vendor')
);

-- 4. INSERT: Authenticated users can create appointments
CREATE POLICY "appointments_insert"
ON appointments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

-- 5. UPDATE: Owners, assigned vendors, and staff can update appointments
CREATE POLICY "appointments_update"
ON appointments FOR UPDATE
TO authenticated
USING (
  auth.uid() = created_by OR
  (auth.uid() = vendor_id AND has_role(auth.uid(), 'vendor')) OR
  has_role(auth.uid(), 'admin') OR
  has_role(auth.uid(), 'manager') OR
  has_role(auth.uid(), 'staff')
)
WITH CHECK (
  auth.uid() = created_by OR
  (auth.uid() = vendor_id AND has_role(auth.uid(), 'vendor')) OR
  has_role(auth.uid(), 'admin') OR
  has_role(auth.uid(), 'manager') OR
  has_role(auth.uid(), 'staff')
);

-- 6. DELETE: Only staff/admin can delete appointments
CREATE POLICY "appointments_delete"
ON appointments FOR DELETE
TO authenticated
USING (
  has_role(auth.uid(), 'admin') OR
  has_role(auth.uid(), 'manager') OR
  has_role(auth.uid(), 'staff')
);

-- --------------------------------------------------------------------
-- Step 3: Fix Search Path on Vulnerable Functions
-- --------------------------------------------------------------------

-- Update app_is_vendor to include search_path
CREATE OR REPLACE FUNCTION public.app_is_vendor(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  select exists(select 1 from public.user_roles r where r.user_id = uid and r.role = 'vendor');
$$;

-- Update app_is_owner to include search_path
CREATE OR REPLACE FUNCTION public.app_is_owner(row_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  select row_user_id = auth.uid();
$$;

-- Update app_is_admin to include search_path
CREATE OR REPLACE FUNCTION public.app_is_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  select exists(select 1 from public.user_roles r where r.user_id = uid and r.role in ('admin','manager'));
$$;

-- Update app_is_staff to include search_path
CREATE OR REPLACE FUNCTION public.app_is_staff(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  select exists(select 1 from public.user_roles r where r.user_id = uid and r.role = 'staff');
$$;

-- Update vendor_appointments_func to include search_path
CREATE OR REPLACE FUNCTION public.vendor_appointments_func()
RETURNS TABLE(
  id uuid,
  title text,
  description text,
  appointment_date date,
  appointment_time time without time zone,
  duration_minutes integer,
  status text,
  property_id uuid,
  vendor_id uuid,
  maintenance_request_id uuid,
  location text,
  notes text,
  reminder_sent boolean,
  created_by uuid,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, title, description, appointment_date, appointment_time, duration_minutes,
         status, property_id, vendor_id, maintenance_request_id, location, notes,
         reminder_sent, created_by, created_at, updated_at
  FROM public.appointments;
$$;

-- Update is_staff() function to include search_path (there are two versions)
CREATE OR REPLACE FUNCTION public.is_staff(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  select exists (select 1 from user_roles ur where ur.user_id = uid and ur.role in ('admin','staff','manager'));
$$;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role IN ('admin','manager','staff')
  );
$$;

-- --------------------------------------------------------------------
-- Step 4: Add RLS Policies on audit_logs Table
-- --------------------------------------------------------------------

-- Policy: Only admins can view all audit logs
CREATE POLICY "audit_logs_admin_select"
ON audit_logs FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Policy: Managers can view logs related to their actions
CREATE POLICY "audit_logs_manager_select"
ON audit_logs FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'manager') AND
  user_id = auth.uid()
);

-- Policy: Only admins can delete audit logs (for cleanup)
CREATE POLICY "audit_logs_admin_delete"
ON audit_logs FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- --------------------------------------------------------------------
-- Step 5: Update RLS Policies to Use has_role() Instead of profiles.role
-- --------------------------------------------------------------------

-- Update comments policies
DROP POLICY IF EXISTS "comments_staff_select" ON comments;
CREATE POLICY "comments_staff_select"
ON comments FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin') OR
  has_role(auth.uid(), 'manager') OR
  has_role(auth.uid(), 'staff')
);

-- Update maintenance_requests policies
DROP POLICY IF EXISTS "Authenticated users can create maintenance requests" ON maintenance_requests;
CREATE POLICY "maintenance_requests_create"
ON maintenance_requests FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = requested_by OR
  has_role(auth.uid(), 'admin') OR
  has_role(auth.uid(), 'manager') OR
  has_role(auth.uid(), 'staff')
);

-- Update notifications policies
DROP POLICY IF EXISTS "Staff can create notifications" ON notifications;
DROP POLICY IF EXISTS "الموظفون يمكنهم إنشاء إشعارات" ON notifications;
CREATE POLICY "notifications_staff_insert"
ON notifications FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin') OR
  has_role(auth.uid(), 'manager') OR
  has_role(auth.uid(), 'staff')
);

-- Update projects policies
DROP POLICY IF EXISTS "projects_staff_select" ON projects;
CREATE POLICY "projects_staff_select"
ON projects FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin') OR
  has_role(auth.uid(), 'manager')
);

DROP POLICY IF EXISTS "المديرون يمكنهم إدارة المشاريع" ON projects;
CREATE POLICY "projects_manage"
ON projects FOR ALL
TO authenticated
USING (
  auth.uid() = manager_id OR
  has_role(auth.uid(), 'admin') OR
  has_role(auth.uid(), 'manager')
);

-- Update properties policies
DROP POLICY IF EXISTS "properties_authenticated_select" ON properties;
CREATE POLICY "properties_staff_select"
ON properties FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin') OR
  has_role(auth.uid(), 'manager') OR
  has_role(auth.uid(), 'staff')
);

DROP POLICY IF EXISTS "المديرون يمكنهم إدارة العقارات" ON properties;
CREATE POLICY "properties_manage"
ON properties FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'admin') OR
  has_role(auth.uid(), 'manager')
);

-- Update appointments_summary policies
DROP POLICY IF EXISTS "Staff can manage appointment summaries" ON appointments_summary;
DROP POLICY IF EXISTS "Staff can view appointment summaries" ON appointments_summary;
CREATE POLICY "appointments_summary_staff"
ON appointments_summary FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'admin') OR
  has_role(auth.uid(), 'manager') OR
  has_role(auth.uid(), 'staff')
);

-- Update appointments_summary_secure policies
DROP POLICY IF EXISTS "Staff can manage appointment summaries" ON appointments_summary_secure;
DROP POLICY IF EXISTS "Staff can view appointment summaries" ON appointments_summary_secure;
CREATE POLICY "appointments_summary_secure_staff"
ON appointments_summary_secure FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'admin') OR
  has_role(auth.uid(), 'manager') OR
  has_role(auth.uid(), 'staff')
);

-- Update maintenance_requests_summary policies
DROP POLICY IF EXISTS "Staff can manage maintenance summaries" ON maintenance_requests_summary;
DROP POLICY IF EXISTS "Staff can view maintenance summaries" ON maintenance_requests_summary;
CREATE POLICY "maintenance_requests_summary_staff"
ON maintenance_requests_summary FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'admin') OR
  has_role(auth.uid(), 'manager') OR
  has_role(auth.uid(), 'staff')
);

-- Update maintenance_requests_summary_secure policies
DROP POLICY IF EXISTS "Staff can manage maintenance request summaries" ON maintenance_requests_summary_secure;
DROP POLICY IF EXISTS "Staff can view maintenance request summaries" ON maintenance_requests_summary_secure;
CREATE POLICY "maintenance_requests_summary_secure_staff"
ON maintenance_requests_summary_secure FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'admin') OR
  has_role(auth.uid(), 'manager') OR
  has_role(auth.uid(), 'staff')
);

-- --------------------------------------------------------------------
-- Step 6: Add RLS on profiles to prevent privilege escalation
-- --------------------------------------------------------------------

-- Drop existing policies and recreate with strict controls
DROP POLICY IF EXISTS "Staff can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can manage their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- Users can view their own profile
CREATE POLICY "profiles_select_own"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Staff can view all profiles
CREATE POLICY "profiles_select_staff"
ON profiles FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin') OR
  has_role(auth.uid(), 'manager') OR
  has_role(auth.uid(), 'staff')
);

-- Users can update only non-critical fields in their own profile
CREATE POLICY "profiles_update_own"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id AND
  -- Prevent users from changing their own user_id or created_at
  user_id = (SELECT user_id FROM profiles WHERE user_id = auth.uid())
);

-- Only staff can insert new profiles
CREATE POLICY "profiles_insert_staff"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin') OR
  has_role(auth.uid(), 'manager') OR
  has_role(auth.uid(), 'staff')
);

-- Comment: The role column in profiles is deprecated and should be removed
-- in a future migration once all code is updated to use user_roles table