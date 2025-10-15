import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface GalleryImage {
  id: string;
  title: string;
  url: string;
  folder: string;
  category: string;
  description?: string;
  tags?: string[];
  is_featured?: boolean;
  display_order?: number;
  thumbnail_url?: string;
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

      // جلب الصور من جدول gallery_images - البحث في مسار الصورة عن الفئة
      const { data, error: dbError } = await supabase
        .from("gallery_images")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (dbError) {
        throw dbError;
      }

      if (!data) {
        setImages([]);
        setLoading(false);
        return;
      }

      // تصفية الصور حسب المجلد من مسار الصورة وتحويلها للصيغة المطلوبة
      const imageList: GalleryImage[] = data
        .filter((img) => {
          // إذا كان المجلد "all"، عرض جميع الصور
          if (folder === "all") return true;
          
          // استخراج اسم المجلد من مسار الصورة (مثال: images/commercial/image.jpg)
          const urlFolder = img.image_url?.split('/images/')[1]?.split('/')[0];
          return urlFolder === folder;
        })
        .map((img) => {
          // استخراج المجلد من مسار الصورة
          const urlFolder = img.image_url?.split('/images/')[1]?.split('/')[0] || folder;
          
          return {
            id: img.id,
            title: img.title,
            url: img.image_url,
            folder: urlFolder,
            category: img.category,
            description: img.description,
            tags: img.tags,
            is_featured: img.is_featured,
            display_order: img.display_order,
            thumbnail_url: img.thumbnail_url,
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
