-- Fix customer contact information security issue in appointments table
-- Replace overly permissive RLS policies with more restrictive ones

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view relevant appointments" ON public.appointments;
DROP POLICY IF EXISTS "Authenticated users can create appointments" ON public.appointments;
DROP POLICY IF EXISTS "Authorized users can update appointments" ON public.appointments;
DROP POLICY IF EXISTS "Authorized users can delete appointments" ON public.appointments;

-- Create more secure policies that protect customer contact information

-- 1. Users can view appointments they created
CREATE POLICY "Users can view their own appointments" ON public.appointments
FOR SELECT USING (auth.uid() = created_by);

-- 2. Assigned vendors can view only their assigned appointments
CREATE POLICY "Vendors can view assigned appointments" ON public.appointments
FOR SELECT USING (auth.uid() = vendor_id);

-- 3. Admins and managers can view all appointments (they need full access for management)
CREATE POLICY "Admins and managers can view all appointments" ON public.appointments
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- 4. Users can create appointments for themselves
CREATE POLICY "Users can create their own appointments" ON public.appointments
FOR INSERT WITH CHECK (auth.uid() = created_by);

-- 5. Staff can create appointments (but only admins/managers for now)
CREATE POLICY "Staff can create appointments" ON public.appointments
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'staff')
  )
);

-- 6. Users can update their own appointments
CREATE POLICY "Users can update their own appointments" ON public.appointments
FOR UPDATE USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

-- 7. Assigned vendors can update their assigned appointments
CREATE POLICY "Vendors can update assigned appointments" ON public.appointments
FOR UPDATE USING (auth.uid() = vendor_id)
WITH CHECK (auth.uid() = vendor_id);

-- 8. Admins and managers can update all appointments
CREATE POLICY "Admins and managers can update all appointments" ON public.appointments
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- 9. Only creators and admins/managers can delete appointments
CREATE POLICY "Users can delete their own appointments" ON public.appointments
FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Admins and managers can delete appointments" ON public.appointments
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- Create a security definer function for staff to get limited appointment info without customer contact details
CREATE OR REPLACE FUNCTION public.get_appointments_for_staff()
RETURNS TABLE (
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
  updated_at timestamptz
) AS $$
BEGIN
  -- Only return data if user is staff/technician
  IF EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('staff', 'technician')
  ) THEN
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
      a.updated_at
    FROM public.appointments a;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;