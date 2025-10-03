import { LandingHeader } from "@/components/landing/LandingHeader";
import { Footer } from "@/components/landing/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  category: string;
  image_url: string;
  thumbnail_url: string | null;
  is_featured: boolean;
  tags: string[] | null;
}

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setImages(data);
        
        // Calculate categories with counts
        const categoryMap = new Map<string, number>();
        data.forEach(img => {
          categoryMap.set(img.category, (categoryMap.get(img.category) || 0) + 1);
        });
        
        const categoriesArray = [
          { name: "الكل", count: data.length },
          ...Array.from(categoryMap.entries()).map(([name, count]) => ({ name, count }))
        ];
        
        setCategories(categoriesArray);
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = selectedCategory === "الكل" 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  const currentImageIndex = selectedImage 
    ? filteredImages.findIndex(img => img.id === selectedImage.id)
    : -1;

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setSelectedImage(filteredImages[currentImageIndex - 1]);
    }
  };

  const handleNextImage = () => {
    if (currentImageIndex < filteredImages.length - 1) {
      setSelectedImage(filteredImages[currentImageIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f1f5f9' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="w-fit mx-auto">
              <Camera className="h-3 w-3 ml-1" />
              معرض أعمالنا
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold">
              شاهد <span className="bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent">إنجازاتنا</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              مجموعة مختارة من أفضل أعمالنا ومشاريعنا المنجزة بنجاح
            </p>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-12 bg-card border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => (
              <Card 
                key={index} 
                className={`px-6 py-3 transition-all cursor-pointer hover:-translate-y-0.5 ${
                  selectedCategory === category.name 
                    ? 'bg-primary text-primary-foreground shadow-lg' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">{category.name}</span>
                  <Badge variant={selectedCategory === category.name ? "secondary" : "outline"}>
                    {category.count}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-[4/3] w-full" />
                </Card>
              ))}
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-20">
              <Camera className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-2xl font-bold mb-2">لا توجد صور</h3>
              <p className="text-muted-foreground">لم يتم العثور على صور في هذه الفئة</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((image) => (
                <Card 
                  key={image.id}
                  className="group overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img 
                      src={image.thumbnail_url || image.image_url}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <Badge variant="secondary" className="mb-2">{image.category}</Badge>
                        <h3 className="font-bold text-lg">{image.title}</h3>
                        {image.description && (
                          <p className="text-sm text-white/90 mt-1 line-clamp-2">{image.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Image Lightbox with Carousel */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-7xl p-0 overflow-hidden bg-black/95">
          <div className="relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 left-4 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all backdrop-blur-sm"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation Buttons */}
            {currentImageIndex > 0 && (
              <button
                onClick={handlePrevImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all backdrop-blur-sm"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
            
            {currentImageIndex < filteredImages.length - 1 && (
              <button
                onClick={handleNextImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all backdrop-blur-sm"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {selectedImage && (
              <div className="relative">
                <img 
                  src={selectedImage.image_url}
                  alt={selectedImage.title}
                  className="w-full h-auto max-h-[85vh] object-contain"
                />
                
                {/* Image Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="secondary">{selectedImage.category}</Badge>
                    <span className="text-sm text-white/70">
                      {currentImageIndex + 1} / {filteredImages.length}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{selectedImage.title}</h3>
                  {selectedImage.description && (
                    <p className="text-white/90">{selectedImage.description}</p>
                  )}
                  {selectedImage.tags && selectedImage.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedImage.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-white border-white/30">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
