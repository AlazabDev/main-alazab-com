-- Remove security definer views that bypass RLS
-- These views create security vulnerabilities as they run with the creator's permissions

-- Drop the security definer views completely  
DROP VIEW IF EXISTS public.appointments_public CASCADE;
DROP VIEW IF EXISTS public.appointments_secure CASCADE; 
DROP VIEW IF EXISTS public.appointments_summary CASCADE;
DROP VIEW IF EXISTS public.maintenance_requests_summary CASCADE;
DROP VIEW IF EXISTS public.profiles_public CASCADE;
DROP VIEW IF EXISTS public.profiles_safe CASCADE;

-- Create secure tables for summary data instead of views
-- These will have proper RLS policies

CREATE TABLE IF NOT EXISTS public.appointments_summary_secure (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month timestamp with time zone NOT NULL,
  status text NOT NULL,
  appointment_count bigint NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on the table
ALTER TABLE public.appointments_summary_secure ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for appointments summary - only staff can access
CREATE POLICY "Staff can view appointment summaries" ON public.appointments_summary_secure
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'staff')
  )
);

CREATE POLICY "Staff can manage appointment summaries" ON public.appointments_summary_secure
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'staff')
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'staff')
  )
);

CREATE TABLE IF NOT EXISTS public.maintenance_requests_summary_secure (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month timestamp with time zone NOT NULL,
  status text NOT NULL,
  request_count bigint NOT NULL DEFAULT 0,
  avg_estimated_cost numeric,
  avg_actual_cost numeric,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on maintenance requests summary
ALTER TABLE public.maintenance_requests_summary_secure ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for maintenance requests summary - only staff can access
CREATE POLICY "Staff can view maintenance request summaries" ON public.maintenance_requests_summary_secure
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'staff')
  )
);

CREATE POLICY "Staff can manage maintenance request summaries" ON public.maintenance_requests_summary_secure
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'staff')
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'staff')
  )
);

-- Create a function to populate these summary tables (can be called by a cron job)
CREATE OR REPLACE FUNCTION public.update_summary_tables()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Clear existing data
  DELETE FROM public.appointments_summary_secure;
  DELETE FROM public.maintenance_requests_summary_secure;
  
  -- Populate appointments summary
  INSERT INTO public.appointments_summary_secure (month, status, appointment_count)
  SELECT 
    DATE_TRUNC('month', created_at) as month,
    status,
    COUNT(*) as appointment_count
  FROM public.appointments
  GROUP BY DATE_TRUNC('month', created_at), status;
  
  -- Populate maintenance requests summary
  INSERT INTO public.maintenance_requests_summary_secure (month, status, request_count, avg_estimated_cost, avg_actual_cost)
  SELECT 
    DATE_TRUNC('month', created_at) as month,
    status,
    COUNT(*) as request_count,
    AVG(estimated_cost) as avg_estimated_cost,
    AVG(actual_cost) as avg_actual_cost
  FROM public.maintenance_requests
  GROUP BY DATE_TRUNC('month', created_at), status;
END;
$$;

-- Grant execute permission to authenticated users so staff can refresh if needed
GRANT EXECUTE ON FUNCTION public.update_summary_tables() TO authenticated;