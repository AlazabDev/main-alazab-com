-- Fix critical security vulnerability in maintenance_requests table
-- First check and drop existing policies, then create secure ones

-- Drop all existing SELECT policies for maintenance_requests
DROP POLICY IF EXISTS "جميع المستخدمين يمكنهم رؤية طلبات" ON public.maintenance_requests;
DROP POLICY IF EXISTS "Users can view own maintenance requests" ON public.maintenance_requests;
DROP POLICY IF EXISTS "Staff can view all maintenance requests" ON public.maintenance_requests;
DROP POLICY IF EXISTS "Vendors can view assigned requests" ON public.maintenance_requests;

-- Create secure RLS policies for maintenance_requests
-- Users can only see their own requests
CREATE POLICY "maintenance_requests_user_own_select" 
ON public.maintenance_requests 
FOR SELECT 
USING (auth.uid() = requested_by);

-- Staff (admin, manager, technician) can view all requests for business purposes
CREATE POLICY "maintenance_requests_staff_all_select" 
ON public.maintenance_requests 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('admin', 'manager', 'technician')
  )
);

-- Assigned vendors can view requests assigned to them
CREATE POLICY "maintenance_requests_vendor_assigned_select" 
ON public.maintenance_requests 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.vendor_id = maintenance_requests.assigned_vendor_id
  )
);