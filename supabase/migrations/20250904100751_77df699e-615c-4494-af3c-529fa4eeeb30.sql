-- Fix critical security vulnerability in maintenance_requests table
-- Remove the overly permissive RLS policy that allows everyone to read all maintenance requests

-- Drop the existing overly permissive SELECT policy
DROP POLICY IF EXISTS "جميع المستخدمين يمكنهم رؤية طلبات" ON public.maintenance_requests;

-- Create secure RLS policies for maintenance_requests
-- Users can only see their own requests
CREATE POLICY "Users can view own maintenance requests" 
ON public.maintenance_requests 
FOR SELECT 
USING (auth.uid() = requested_by);

-- Staff (admin, manager, technician) can view all requests for business purposes
CREATE POLICY "Staff can view all maintenance requests" 
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
CREATE POLICY "Vendors can view assigned requests" 
ON public.maintenance_requests 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.vendor_id = maintenance_requests.assigned_vendor_id
  )
);