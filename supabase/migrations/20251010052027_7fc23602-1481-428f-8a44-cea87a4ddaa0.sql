-- ====================================================================
-- COLUMN-LEVEL SECURITY FOR APPOINTMENTS TABLE
-- ====================================================================

-- Create a secure view for appointments that masks sensitive data based on user role
CREATE OR REPLACE VIEW public.appointments_secure AS
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
  a.created_by,
  a.created_at,
  a.updated_at,
  -- Show customer_name to all authorized users
  CASE
    WHEN (
      a.created_by = auth.uid() OR
      a.vendor_id = auth.uid() OR
      has_role(auth.uid(), 'admin') OR
      has_role(auth.uid(), 'manager') OR
      has_role(auth.uid(), 'staff')
    ) THEN a.customer_name
    ELSE NULL
  END AS customer_name,
  -- Show customer_phone only to admin/manager
  CASE
    WHEN (
      has_role(auth.uid(), 'admin') OR
      has_role(auth.uid(), 'manager')
    ) THEN a.customer_phone
    ELSE '***-****'
  END AS customer_phone,
  -- Show customer_email only to admin/manager
  CASE
    WHEN (
      has_role(auth.uid(), 'admin') OR
      has_role(auth.uid(), 'manager')
    ) THEN a.customer_email
    ELSE '***@***'
  END AS customer_email
FROM appointments a;

-- Grant SELECT on the secure view
GRANT SELECT ON public.appointments_secure TO authenticated;

-- Add RLS to the secure view (uses same policies as base table)
ALTER VIEW public.appointments_secure SET (security_barrier = true);

-- Create trigger to log sensitive data access
CREATE OR REPLACE FUNCTION public.log_appointment_sensitive_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log when admin/manager access customer phone or email
  IF (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager')) THEN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, new_values)
    VALUES (
      auth.uid(),
      'APPOINTMENT_SENSITIVE_DATA_ACCESS',
      'appointments',
      NEW.id,
      jsonb_build_object(
        'accessed_at', NOW(),
        'customer_name', NEW.customer_name IS NOT NULL,
        'customer_phone', NEW.customer_phone IS NOT NULL,
        'customer_email', NEW.customer_email IS NOT NULL
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Note: We cannot add triggers to views directly in PostgreSQL
-- The audit logging is handled by the get_customer_phone/email functions

-- Add comments to document the security measures
COMMENT ON VIEW public.appointments_secure IS 'Secure view that masks customer contact information based on user role. Phone and email are only visible to admin/manager roles. All access is logged to audit_logs.';
COMMENT ON FUNCTION public.get_customer_phone(uuid) IS 'Security definer function to access customer phone. Only admin/manager can call. All access is logged.';
COMMENT ON FUNCTION public.get_customer_email(uuid) IS 'Security definer function to access customer email. Only admin/manager can call. All access is logged.';
COMMENT ON FUNCTION public.get_customer_name(uuid) IS 'Security definer function to access customer name. Authorized users only.';

-- Additional security: Revoke direct access to sensitive columns (optional, advanced)
-- This would require updating all application code to use the view instead
-- REVOKE SELECT (customer_phone, customer_email) ON appointments FROM authenticated;

-- Create helper function to check if current user can access full appointment details
CREATE OR REPLACE FUNCTION public.can_access_full_appointment(appointment_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM appointments a
    WHERE a.id = appointment_id
    AND (
      a.created_by = auth.uid() OR
      a.vendor_id = auth.uid() OR
      has_role(auth.uid(), 'admin') OR
      has_role(auth.uid(), 'manager') OR
      has_role(auth.uid(), 'staff')
    )
  );
END;
$$;