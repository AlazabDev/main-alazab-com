-- Fix the security definer view issue
-- Remove the problematic security_barrier setting and use proper RLS instead
DROP VIEW IF EXISTS public.vendors_basic;

-- Create the view without security definer
CREATE VIEW public.vendors_basic AS 
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

-- Grant proper access
GRANT SELECT ON public.vendors_basic TO authenticated;

-- Enable RLS on the view
ALTER VIEW public.vendors_basic ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for the basic view that allows technicians to see basic info
CREATE POLICY "Technicians can view basic vendor data" 
ON public.vendors_basic 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'technician')
  )
);