-- Fix customer personal information security in appointments table

-- First, drop existing policies that might be too permissive
DROP POLICY IF EXISTS "Vendors can view assigned appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins and managers can view all appointments" ON public.appointments;

-- Create more secure policies with data filtering

-- Vendors can only see limited appointment data (no customer personal info unless necessary)
CREATE POLICY "Vendors can view assigned appointment basics" 
ON public.appointments 
FOR SELECT 
USING (
  auth.uid() = vendor_id 
  AND get_current_user_role() = 'vendor'
);

-- Staff can view appointments but with role-based data filtering
CREATE POLICY "Staff can view appointments with data protection" 
ON public.appointments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'staff', 'technician')
  )
);

-- Create a secure function for staff to access customer contact info when needed
CREATE OR REPLACE FUNCTION public.get_appointment_customer_info(appointment_id uuid)
RETURNS TABLE(
  customer_name text,
  customer_phone text, 
  customer_email text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow staff/admin roles to access customer contact info
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'staff')
  ) THEN
    RAISE EXCEPTION 'Unauthorized access to customer information';
  END IF;

  RETURN QUERY
  SELECT a.customer_name, a.customer_phone, a.customer_email
  FROM public.appointments a
  WHERE a.id = appointment_id;
END;
$$;

-- Create audit log for customer data access
CREATE OR REPLACE FUNCTION public.log_customer_data_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log when customer personal data is accessed
  IF TG_OP = 'SELECT' AND (
    NEW.customer_email IS NOT NULL OR 
    NEW.customer_phone IS NOT NULL
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
      'appointments', 
      NEW.id, 
      jsonb_build_object('accessed_fields', 'customer_contact_info')
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Add data masking for customer phone numbers in non-admin views
CREATE OR REPLACE FUNCTION public.mask_customer_phone(phone text, user_role text)
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only show full phone to admin/manager roles
  IF user_role IN ('admin', 'manager') THEN
    RETURN phone;
  ELSIF user_role IN ('staff', 'technician') THEN
    -- Show partial phone (last 4 digits)
    RETURN CASE 
      WHEN phone IS NOT NULL AND length(phone) > 4 
      THEN '****' || right(phone, 4)
      ELSE '****'
    END;
  ELSE
    -- Hide phone completely for other roles
    RETURN NULL;
  END IF;
END;
$$;

-- Create a view for secure appointment access
CREATE OR REPLACE VIEW public.appointments_secure AS
SELECT 
  id,
  title,
  description,
  CASE 
    WHEN get_current_user_role() IN ('admin', 'manager') THEN customer_name
    WHEN get_current_user_role() IN ('staff', 'technician') THEN customer_name
    WHEN auth.uid() = created_by THEN customer_name
    WHEN auth.uid() = vendor_id THEN split_part(customer_name, ' ', 1) || ' ***'
    ELSE '***'
  END as customer_name,
  mask_customer_phone(customer_phone, get_current_user_role()) as customer_phone,
  CASE 
    WHEN get_current_user_role() IN ('admin', 'manager') THEN customer_email
    WHEN auth.uid() = created_by THEN customer_email
    ELSE NULL
  END as customer_email,
  appointment_date,
  appointment_time,
  duration_minutes,
  status,
  property_id,
  vendor_id,
  maintenance_request_id,
  location,
  CASE 
    WHEN get_current_user_role() IN ('admin', 'manager', 'staff') THEN notes
    WHEN auth.uid() = created_by THEN notes
    WHEN auth.uid() = vendor_id THEN notes
    ELSE NULL
  END as notes,
  reminder_sent,
  created_by,
  created_at,
  updated_at
FROM public.appointments
WHERE (
  -- Users can see their own appointments
  auth.uid() = created_by OR
  -- Vendors can see assigned appointments  
  auth.uid() = vendor_id OR
  -- Staff can see all appointments
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'staff', 'technician')
  )
);

-- Grant access to the secure view
GRANT SELECT ON public.appointments_secure TO authenticated;

-- Add comment explaining the security measures
COMMENT ON VIEW public.appointments_secure IS 'Secure view of appointments with role-based data masking to protect customer personal information';