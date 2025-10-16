-- Fix RLS policies for maintenance_requests table

-- Drop old permissive policies
DROP POLICY IF EXISTS "Users can view own maintenance requests" ON public.maintenance_requests;
DROP POLICY IF EXISTS "maintenance_requests_create" ON public.maintenance_requests;
DROP POLICY IF EXISTS "maintenance_requests_insert" ON public.maintenance_requests;
DROP POLICY IF EXISTS "maintenance_requests_select" ON public.maintenance_requests;

-- Create secure SELECT policy: only owner, assigned vendor, or staff can view
CREATE POLICY "View own/assigned/staff requests" 
ON public.maintenance_requests
FOR SELECT 
USING (
  auth.uid() = requested_by
  OR auth.uid() = assigned_vendor_id
  OR EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.role IN ('admin','manager','staff')
  )
);

-- Create secure INSERT policy: authenticated users only
CREATE POLICY "Authenticated users can create" 
ON public.maintenance_requests
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL
  AND (
    auth.uid() = requested_by
    OR EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid() 
      AND p.role IN ('admin','manager','staff')
    )
  )
);