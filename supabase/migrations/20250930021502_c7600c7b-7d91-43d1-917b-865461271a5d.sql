-- Remove all security definer views that bypass RLS
-- These views create security vulnerabilities as they run with the creator's permissions

-- Drop the problematic views
DROP VIEW IF EXISTS public.appointments_public;
DROP VIEW IF EXISTS public.appointments_secure; 
DROP VIEW IF EXISTS public.appointments_summary;
DROP VIEW IF EXISTS public.maintenance_requests_summary;
DROP VIEW IF EXISTS public.profiles_public;
DROP VIEW IF EXISTS public.profiles_safe;

-- Instead of views, we'll create regular tables for summary data
-- This allows us to properly implement RLS policies

-- Create summary tables with proper RLS
CREATE TABLE IF NOT EXISTS public.appointments_summary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month timestamp with time zone NOT NULL,
  status text NOT NULL,
  appointment_count bigint NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on appointments summary table
ALTER TABLE public.appointments_summary ENABLE ROW LEVEL SECURITY;

-- Only staff can view appointment summaries
CREATE POLICY "Staff can view appointment summaries" ON public.appointments_summary
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'staff')
  )
);

-- Only staff can manage appointment summaries
CREATE POLICY "Staff can manage appointment summaries" ON public.appointments_summary
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'staff')
  )
);

CREATE TABLE IF NOT EXISTS public.maintenance_requests_summary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month timestamp with time zone NOT NULL,
  status text NOT NULL,
  request_count bigint NOT NULL DEFAULT 0,
  avg_estimated_cost numeric,
  avg_actual_cost numeric,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on maintenance requests summary table
ALTER TABLE public.maintenance_requests_summary ENABLE ROW LEVEL SECURITY;

-- Only staff can view maintenance request summaries
CREATE POLICY "Staff can view maintenance summaries" ON public.maintenance_requests_summary
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'staff')
  )
);

-- Only staff can manage maintenance request summaries
CREATE POLICY "Staff can manage maintenance summaries" ON public.maintenance_requests_summary
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'staff')
  )
);

-- Create function to populate summary data (can be called periodically)
CREATE OR REPLACE FUNCTION public.update_summary_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Clear existing data
  DELETE FROM public.appointments_summary;
  DELETE FROM public.maintenance_requests_summary;
  
  -- Populate appointments summary
  INSERT INTO public.appointments_summary (month, status, appointment_count)
  SELECT 
    DATE_TRUNC('month', created_at) as month,
    status,
    COUNT(*) as appointment_count
  FROM public.appointments
  GROUP BY DATE_TRUNC('month', created_at), status;
  
  -- Populate maintenance requests summary
  INSERT INTO public.maintenance_requests_summary (month, status, request_count, avg_estimated_cost, avg_actual_cost)
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

-- Grant execute permission only to authenticated staff
GRANT EXECUTE ON FUNCTION public.update_summary_data() TO authenticated;