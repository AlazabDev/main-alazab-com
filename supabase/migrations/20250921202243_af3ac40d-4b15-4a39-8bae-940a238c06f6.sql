-- Create additional admin accounts and strengthen RLS policies
-- First, let's create an admin user profile if it doesn't exist
DO $$
BEGIN
  -- Insert admin profile if admin user exists but no profile
  IF EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = 'admin@alazab.online'
  ) AND NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@alazab.online')
  ) THEN
    INSERT INTO public.profiles (user_id, role, first_name, last_name, phone)
    VALUES (
      (SELECT id FROM auth.users WHERE email = 'admin@alazab.online'),
      'admin',
      'Admin',
      'User',
      ''
    );
  END IF;
END $$;

-- Update profiles table to make user_id non-nullable and add constraints
ALTER TABLE public.profiles 
ALTER COLUMN user_id SET NOT NULL;

-- Add unique constraint on user_id if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_user_id_key'
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Strengthen RLS policies for better data protection
-- Drop and recreate maintenance_requests policies with better security
DROP POLICY IF EXISTS "Authorized users can view maintenance requests" ON public.maintenance_requests;
DROP POLICY IF EXISTS "Users can update their own requests" ON public.maintenance_requests;

-- More restrictive policies for maintenance requests
CREATE POLICY "Users can view own maintenance requests" 
ON public.maintenance_requests 
FOR SELECT 
USING (
  auth.uid() = requested_by OR 
  (auth.uid() = assigned_vendor_id AND get_current_user_role() = 'vendor') OR
  get_current_user_role() = ANY(ARRAY['admin', 'manager', 'staff'])
);

CREATE POLICY "Users can update own requests or assigned vendors" 
ON public.maintenance_requests 
FOR UPDATE 
USING (
  (auth.uid() = requested_by AND status IN ('pending', 'scheduled')) OR
  (auth.uid() = assigned_vendor_id AND get_current_user_role() = 'vendor') OR
  get_current_user_role() = ANY(ARRAY['admin', 'manager', 'staff'])
);

-- Strengthen vendor data access
DROP POLICY IF EXISTS "Technicians can view limited vendor data" ON public.vendors;

CREATE POLICY "Role-based vendor data access" 
ON public.vendors 
FOR SELECT 
USING (
  CASE 
    WHEN get_current_user_role() = ANY(ARRAY['admin', 'manager']) THEN true
    WHEN get_current_user_role() = 'staff' THEN true
    WHEN get_current_user_role() = 'technician' THEN true
    ELSE false
  END
);

-- Add audit trail table for sensitive operations
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" 
ON public.audit_logs 
FOR SELECT 
USING (get_current_user_role() = 'admin');

-- Create function to log sensitive operations
CREATE OR REPLACE FUNCTION public.log_audit_trail()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, row_to_json(OLD), row_to_json(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_values)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, OLD.id, row_to_json(OLD));
    RETURN OLD;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_values)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, row_to_json(NEW));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add audit triggers to sensitive tables
DROP TRIGGER IF EXISTS audit_maintenance_requests ON public.maintenance_requests;
CREATE TRIGGER audit_maintenance_requests
  AFTER INSERT OR UPDATE OR DELETE ON public.maintenance_requests
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_trail();

DROP TRIGGER IF EXISTS audit_vendors ON public.vendors;
CREATE TRIGGER audit_vendors
  AFTER INSERT OR UPDATE OR DELETE ON public.vendors
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_trail();

DROP TRIGGER IF EXISTS audit_profiles ON public.profiles;
CREATE TRIGGER audit_profiles
  AFTER UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_trail();