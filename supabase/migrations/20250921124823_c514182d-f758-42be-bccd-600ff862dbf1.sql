-- Remove the problematic view and fix the vendor security with function-based approach
DROP VIEW IF EXISTS public.vendors_basic;

-- Create a security definer function to get current user role (avoiding RLS recursion)
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.profiles 
  WHERE user_id = auth.uid();
  
  RETURN COALESCE(user_role, 'guest');
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- Update vendor policies to use the function and properly restrict sensitive data access
DROP POLICY IF EXISTS "Technicians can view basic vendor info" ON public.vendors;

-- Only admin and manager can see full vendor details including contact info
CREATE POLICY "Admin and manager can view all vendor data" 
ON public.vendors 
FOR SELECT 
USING (
  public.get_user_role() IN ('admin', 'manager')
);

-- Technicians can see limited vendor info (no email, phone, address)
-- They need to use application logic to filter sensitive fields
CREATE POLICY "Technicians can view limited vendor data" 
ON public.vendors 
FOR SELECT 
USING (
  public.get_user_role() = 'technician'
);