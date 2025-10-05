-- Phase 1: Create Secure Role System (Fixed)

-- 1. Create user_roles table (app_role type already exists)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES auth.users(id),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 2. Migrate existing roles from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, role::app_role
FROM public.profiles
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- 3. Create RLS policies for user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Update appointments RLS policies to restrict customer data
DROP POLICY IF EXISTS "Anyone can view appointments" ON public.appointments;
DROP POLICY IF EXISTS "Vendors can view assigned appointments without contact info" ON public.appointments;
DROP POLICY IF EXISTS "Staff can view all appointments" ON public.appointments;
DROP POLICY IF EXISTS "Vendors can view assigned appointments" ON public.appointments;
DROP POLICY IF EXISTS "Customers can view their own appointments" ON public.appointments;

CREATE POLICY "Staff can view all appointments"
ON public.appointments FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'manager') OR 
  public.has_role(auth.uid(), 'staff')
);

CREATE POLICY "Vendors can view assigned appointments"
ON public.appointments FOR SELECT
TO authenticated
USING (
  auth.uid() = vendor_id AND 
  public.has_role(auth.uid(), 'vendor')
);

CREATE POLICY "Customers can view their own appointments"
ON public.appointments FOR SELECT
TO authenticated
USING (
  created_by = auth.uid() AND 
  public.has_role(auth.uid(), 'customer')
);

-- 5. Restrict error_logs access to admins only
DROP POLICY IF EXISTS "المديرون يمكنهم رؤية جميع الأخطاء" ON public.error_logs;
DROP POLICY IF EXISTS "Only admins can view error logs" ON public.error_logs;
DROP POLICY IF EXISTS "Only admins can insert error logs" ON public.error_logs;

CREATE POLICY "Only admins can view error logs"
ON public.error_logs FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert error logs"
ON public.error_logs FOR INSERT
TO authenticated
WITH CHECK (true);

-- 6. Update profiles RLS to use new role system
DROP POLICY IF EXISTS "Users can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Staff can view all profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Staff can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'manager') OR 
  public.has_role(auth.uid(), 'staff')
);