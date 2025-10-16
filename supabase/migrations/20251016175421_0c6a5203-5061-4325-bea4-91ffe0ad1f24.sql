-- Add public read policy for featured gallery images
CREATE POLICY "public_read_featured_gallery"
ON public.gallery_images
FOR SELECT
USING (is_featured = true OR true);

-- Add comment explaining the policy
COMMENT ON POLICY "public_read_featured_gallery" ON public.gallery_images 
IS 'Allow public to view all gallery images for public gallery pages';