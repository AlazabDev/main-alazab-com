-- Fix infinite recursion in profiles RLS policies
-- Drop the problematic policy that causes recursion
DROP POLICY IF EXISTS "Staff can view basic profile info" ON public.profiles;

-- Update the existing get_user_role function to be more comprehensive
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.profiles 
  WHERE user_id = auth.uid();
  
  RETURN COALESCE(user_role, 'customer');
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- Create a new policy for staff that uses the security definer function
CREATE POLICY "Staff can view basic profile info using function" 
ON public.profiles 
FOR SELECT 
USING (
  -- Staff can see other profiles
  public.get_current_user_role() IN ('admin', 'manager', 'staff') OR 
  -- Users can always see their own profile
  auth.uid() = user_id
);

-- Also update the existing policies to use the function instead of recursive queries
DROP POLICY IF EXISTS "Users can view own profile only" ON public.profiles;

-- Create a comprehensive policy that handles both cases
CREATE POLICY "Users and staff can view appropriate profiles" 
ON public.profiles 
FOR SELECT 
USING (
  -- Users can see their own profile OR staff can see all profiles
  auth.uid() = user_id OR 
  public.get_current_user_role() IN ('admin', 'manager', 'staff')
);