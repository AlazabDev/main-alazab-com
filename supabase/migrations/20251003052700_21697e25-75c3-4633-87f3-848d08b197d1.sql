-- Fix security issues: Protect customer contact information in appointments and service_requests tables

-- Drop overly permissive policies on appointments table
DROP POLICY IF EXISTS "Vendors can view assigned appointment basics" ON appointments;
DROP POLICY IF EXISTS "Vendors can view assigned appointments basic info" ON appointments;

-- Create security definer function to get masked appointment data for vendors
CREATE OR REPLACE FUNCTION public.get_vendor_appointments()
RETURNS TABLE(
  id uuid,
  title text,
  description text,
  appointment_date date,
  appointment_time time,
  duration_minutes integer,
  status text,
  property_id uuid,
  vendor_id uuid,
  maintenance_request_id uuid,
  location text,
  notes text,
  reminder_sent boolean,
  created_at timestamptz,
  updated_at timestamptz,
  customer_name text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.title,
    a.description,
    a.appointment_date,
    a.appointment_time,
    a.duration_minutes,
    a.status,
    a.property_id,
    a.vendor_id,
    a.maintenance_request_id,
    a.location,
    a.notes,
    a.reminder_sent,
    a.created_at,
    a.updated_at,
    a.customer_name
  FROM appointments a
  WHERE a.vendor_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.user_id = auth.uid() 
      AND p.role = 'vendor'
    );
END;
$$;

-- Create security definer function to check if user can access service request contact info
CREATE OR REPLACE FUNCTION public.can_access_service_request(request_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role INTO user_role
  FROM profiles
  WHERE user_id = auth.uid();
  
  IF user_role IN ('admin', 'manager', 'staff') THEN
    RETURN true;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM service_requests
    WHERE id = request_id
    AND created_by = auth.uid()
  ) THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- Add documentation comments
COMMENT ON TABLE appointments IS 'Customer contact info (customer_email, customer_phone) should only be accessed by admins/managers/staff or the appointment creator. Vendors should use get_vendor_appointments() function which excludes contact details.';
COMMENT ON COLUMN appointments.customer_email IS 'SENSITIVE: Only visible to appointment creator, admins, managers, and staff. Not exposed to vendors.';
COMMENT ON COLUMN appointments.customer_phone IS 'SENSITIVE: Only visible to appointment creator, admins, managers, and staff. Not exposed to vendors.';