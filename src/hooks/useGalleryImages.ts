import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface GalleryImage {
  id: string;
  name: string;
  url: string;
  folder: string;
}

export const useGalleryImages = (folder: string) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadImages();
  }, [folder]);

  const loadImages = async () => {
    try {
      setLoading(true);
      setError(null);

      // جلب قائمة الملفات من المجلد المحدد
      const { data, error: storageError } = await supabase.storage
        .from("az_gallery")
        .list(`images/${folder}`, {
          limit: 100,
          offset: 0,
          sortBy: { column: "name", order: "asc" },
        });

      if (storageError) {
        throw storageError;
      }

      if (!data) {
        setImages([]);
        setLoading(false);
        return;
      }

      // تحويل البيانات إلى URLs
      const imageList: GalleryImage[] = data
        .filter((file) => {
          // فلترة الملفات - فقط الصور
          const ext = file.name.toLowerCase();
          return (
            ext.endsWith(".jpg") ||
            ext.endsWith(".jpeg") ||
            ext.endsWith(".png") ||
            ext.endsWith(".webp") ||
            ext.endsWith(".gif")
          );
        })
        .map((file) => {
          const publicUrl = supabase.storage
            .from("az_gallery")
            .getPublicUrl(`images/${folder}/${file.name}`).data.publicUrl;

          return {
            id: file.id || file.name,
            name: file.name,
            url: publicUrl,
            folder: folder,
          };
        });

      setImages(imageList);
    } catch (err) {
      console.error("Error loading gallery images:", err);
      setError(err instanceof Error ? err.message : "فشل تحميل الصور");
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  return { images, loading, error, refresh: loadImages };
};
