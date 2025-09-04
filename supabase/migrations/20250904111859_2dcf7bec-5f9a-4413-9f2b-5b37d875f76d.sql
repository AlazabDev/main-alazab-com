-- Fix remaining critical security vulnerabilities
-- Secure invoices, vendors, and projects tables from public access

-- 1. Fix invoices table - contains customer financial information
-- Drop any overly permissive policies
DROP POLICY IF EXISTS "Public can view invoices" ON public.invoices;
DROP POLICY IF EXISTS "Anyone can view invoices" ON public.invoices;

-- Invoices already has proper RLS policies, but let's ensure they're comprehensive
-- Keep existing policies: Users can view/create/update their own invoices

-- 2. Fix vendors table - contains business contact information
-- Drop the public SELECT policy
DROP POLICY IF EXISTS "vendors_read" ON public.vendors;
DROP POLICY IF EXISTS "جميع المستخدمين يمكنهم رؤية المور" ON public.vendors;

-- Create secure policies for vendors
-- Staff can view all vendors for business operations
CREATE POLICY "vendors_staff_select" 
ON public.vendors 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('admin', 'manager', 'technician')
  )
);

-- Vendors can view their own profile
CREATE POLICY "vendors_self_select" 
ON public.vendors 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.vendor_id = vendors.id
  )
);

-- 3. Fix projects table - contains client and budget information
-- Drop the public SELECT policy
DROP POLICY IF EXISTS "جميع المستخدمين يمكنهم رؤية المشا" ON public.projects;
DROP POLICY IF EXISTS "Public can view projects" ON public.projects;

-- Create secure policies for projects
-- Staff can view all projects
CREATE POLICY "projects_staff_select" 
ON public.projects 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('admin', 'manager')
  )
);

-- Project managers can view their own projects
CREATE POLICY "projects_manager_select" 
ON public.projects 
FOR SELECT 
USING (auth.uid() = manager_id);

-- 4. Fix vendor_locations table
-- Drop the public SELECT policy
DROP POLICY IF EXISTS "جميع المستخدمين يمكنهم رؤية مواقع" ON public.vendor_locations;

-- Create secure policies for vendor_locations
-- Staff can view all vendor locations
CREATE POLICY "vendor_locations_staff_select" 
ON public.vendor_locations 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('admin', 'manager', 'technician')
  )
);

-- Vendors can view their own locations
CREATE POLICY "vendor_locations_self_select" 
ON public.vendor_locations 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.vendor_id = vendor_locations.vendor_id
  )
);

-- 5. Fix comments table if it has public access
DROP POLICY IF EXISTS "جميع المستخدمين يمكنهم رؤية التعل" ON public.comments;

-- Create secure policy for comments
-- Users can view comments they authored
CREATE POLICY "comments_author_select" 
ON public.comments 
FOR SELECT 
USING (auth.uid() = author_id);

-- Staff can view all comments for moderation
CREATE POLICY "comments_staff_select" 
ON public.comments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('admin', 'manager', 'technician')
  )
);