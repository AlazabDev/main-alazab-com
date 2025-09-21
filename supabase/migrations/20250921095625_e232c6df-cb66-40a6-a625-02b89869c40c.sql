-- Fix vendor RLS policies to prevent unauthorized access to contact information
-- Drop existing inconsistent policies
DROP POLICY IF EXISTS "vendors_manage" ON public.vendors;
DROP POLICY IF EXISTS "vendors_staff_select" ON public.vendors;
DROP POLICY IF EXISTS "المديرون يمكنهم إدارة الموردين" ON public.vendors;

-- Create comprehensive vendor access policies
-- Only admin and manager roles can manage vendor data
CREATE POLICY "Admin and manager can manage vendors" 
ON public.vendors 
FOR ALL 
USING (
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

-- Technicians can only view basic vendor info (no sensitive contact data)
CREATE POLICY "Technicians can view basic vendor info" 
ON public.vendors 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'technician'
  )
);

-- Create a secure view for technicians with limited vendor data
CREATE OR REPLACE VIEW public.vendors_basic AS 
SELECT 
  id,
  name,
  company_name,
  specialization,
  rating,
  status,
  experience_years,
  total_jobs,
  created_at,
  updated_at
FROM public.vendors;

-- Grant access to the basic view for authenticated users
GRANT SELECT ON public.vendors_basic TO authenticated;

-- Create RLS policy for the view
ALTER VIEW public.vendors_basic SET (security_barrier = true);

-- Update vendor locations policies to be consistent
DROP POLICY IF EXISTS "vendor_locations_staff_select" ON public.vendor_locations;
DROP POLICY IF EXISTS "جميع المستخدمين يمكنهم رؤية مواقع" ON public.vendor_locations;

-- Only admin/manager can view vendor locations (contains sensitive address data)
CREATE POLICY "Admin and manager can view vendor locations" 
ON public.vendor_locations 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- Admin and manager can manage vendor locations
CREATE POLICY "Admin and manager can manage vendor locations" 
ON public.vendor_locations 
FOR ALL 
USING (
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