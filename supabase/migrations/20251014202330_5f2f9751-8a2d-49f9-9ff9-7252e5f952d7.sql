-- Add QR code data to properties table
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS qr_code_data TEXT,
ADD COLUMN IF NOT EXISTS qr_code_generated_at TIMESTAMP WITH TIME ZONE;

-- Create quick maintenance requests table for simplified urgent requests
CREATE TABLE IF NOT EXISTS public.quick_maintenance_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  issue_description TEXT NOT NULL,
  urgency_level TEXT NOT NULL DEFAULT 'high' CHECK (urgency_level IN ('high', 'urgent', 'emergency')),
  location_details TEXT,
  images TEXT[],
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'converted', 'cancelled')),
  converted_to_request_id UUID REFERENCES public.maintenance_requests(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quick_maintenance_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quick_maintenance_requests
CREATE POLICY "Anyone can create quick requests"
ON public.quick_maintenance_requests
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Staff can view all quick requests"
ON public.quick_maintenance_requests
FOR SELECT
TO authenticated
USING (is_staff(auth.uid()));

CREATE POLICY "Staff can update quick requests"
ON public.quick_maintenance_requests
FOR UPDATE
TO authenticated
USING (is_staff(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_quick_maintenance_requests_updated_at
BEFORE UPDATE ON public.quick_maintenance_requests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_quick_maintenance_requests_property_id 
ON public.quick_maintenance_requests(property_id);

CREATE INDEX IF NOT EXISTS idx_quick_maintenance_requests_status 
ON public.quick_maintenance_requests(status);

CREATE INDEX IF NOT EXISTS idx_quick_maintenance_requests_created_at 
ON public.quick_maintenance_requests(created_at DESC);