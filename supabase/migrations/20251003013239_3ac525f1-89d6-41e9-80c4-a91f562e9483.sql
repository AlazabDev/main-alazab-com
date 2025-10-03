-- Create gallery_images table
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Allow public read access to gallery images
CREATE POLICY "Gallery images are publicly viewable"
ON public.gallery_images
FOR SELECT
USING (true);

-- Only staff can manage gallery images
CREATE POLICY "Staff can manage gallery images"
ON public.gallery_images
FOR ALL
USING (is_staff(auth.uid()))
WITH CHECK (is_staff(auth.uid()));

-- Create index for better performance
CREATE INDEX idx_gallery_category ON public.gallery_images(category);
CREATE INDEX idx_gallery_featured ON public.gallery_images(is_featured);
CREATE INDEX idx_gallery_order ON public.gallery_images(display_order);

-- Add trigger for updated_at
CREATE TRIGGER update_gallery_images_updated_at
BEFORE UPDATE ON public.gallery_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();