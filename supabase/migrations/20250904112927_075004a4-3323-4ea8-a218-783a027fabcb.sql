-- Remove public read policies that expose sensitive data
DROP POLICY IF EXISTS "جميع المستخدمين يمكنهم رؤية طلبات" ON public.maintenance_requests;
DROP POLICY IF EXISTS "جميع المستخدمين يمكنهم رؤية العقا" ON public.properties;
DROP POLICY IF EXISTS "read_refs_auth_props" ON public.properties;

-- Create secure policies for maintenance_requests (authenticated users only)
CREATE POLICY "maintenance_requests_authenticated_select" 
ON public.maintenance_requests 
FOR SELECT 
TO authenticated
USING (
  -- Users can see their own requests
  auth.uid() = requested_by 
  OR 
  -- Staff can see all requests
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'technician')
  )
  OR
  -- Vendors can see requests assigned to them
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND vendor_id = maintenance_requests.assigned_vendor_id
  )
);

-- Create secure policies for properties (authenticated users only)
CREATE POLICY "properties_authenticated_select" 
ON public.properties 
FOR SELECT 
TO authenticated
USING (
  -- Staff can see all properties
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'technician')
  )
);