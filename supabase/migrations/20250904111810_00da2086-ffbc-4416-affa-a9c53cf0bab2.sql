-- Fix critical security vulnerability in appointments table
-- Remove public access to sensitive customer information

-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "جميع المستخدمين يمكنهم رؤية الموا" ON public.appointments;
DROP POLICY IF EXISTS "Users can view all appointments" ON public.appointments;
DROP POLICY IF EXISTS "Public can view appointments" ON public.appointments;

-- Create secure RLS policies for appointments
-- Users can only see appointments they created
CREATE POLICY "appointments_user_own_select" 
ON public.appointments 
FOR SELECT 
USING (auth.uid() = created_by);

-- Staff (admin, manager, technician) can view all appointments for business operations
CREATE POLICY "appointments_staff_all_select" 
ON public.appointments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('admin', 'manager', 'technician')
  )
);

-- Assigned vendors can view appointments assigned to them (if vendor_id is set)
CREATE POLICY "appointments_vendor_assigned_select" 
ON public.appointments 
FOR SELECT 
USING (
  vendor_id IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.vendor_id = appointments.vendor_id
  )
);