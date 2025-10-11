import { LandingHeader } from "@/components/landing/LandingHeader";
import { Footer } from "@/components/landing/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const SUPABASE_URL = "https://zrrffsjbfkphridqyais.supabase.co/storage/v1/object/public/az_gallery";

const FOLDERS = [
  { key: "commercial", label: "تجاري", preview: "abuauf_35.jpg" },
  { key: "construction", label: "إنشائي", preview: "abuauf_1.jpg" },
  { key: "cuate", label: "تصميمات كرتونية", preview: "cuate003.png" },
  { key: "live_edge", label: "خشب طبيعي", preview: "Blackwood.png" },
  { key: "maintenance", label: "صيانة", preview: "01709-finishing-villas.jpg" },
  { key: "residential", label: "سكني", preview: "Arclinea%20-%20Italia%20kitchen%20-%20Naples%20-%20cover%20hp.jpeg" },
  { key: "shops", label: "محلات", preview: "abuauf_16.jpg" },
];

interface GalleryImage {
  id: string;
  url: string;
  category: string;
  title: string;
}

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("commercial");

  useEffect(() => {
    loadImages();
  }, [selectedCategory]);

  const loadImages = async () => {
    setLoading(true);
    
    // جلب الصور من المجلد المحدد
    const folder = FOLDERS.find(f => f.key === selectedCategory);
    if (!folder) {
      setLoading(false);
      return;
    }

    // إنشاء قائمة بأسماء الصور المحتملة
    const imageExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const possibleImages: GalleryImage[] = [];
    
    // إضافة صورة المعاينة الأساسية
    possibleImages.push({
      id: `${selectedCategory}_preview`,
      url: `${SUPABASE_URL}/${selectedCategory}/${folder.preview}`,
      category: folder.label,
      title: folder.label
    });

    // إضافة صور إضافية محتملة (50 صورة كحد أقصى)
    for (let i = 1; i <= 50; i++) {
      for (const ext of imageExtensions) {
        possibleImages.push({
          id: `${selectedCategory}_${i}_${ext}`,
          url: `${SUPABASE_URL}/${selectedCategory}/${selectedCategory}_${i}.${ext}`,
          category: folder.label,
          title: `${folder.label} ${i}`
        });
      }
    }

    setImages(possibleImages);
    setLoading(false);
  };

  const filteredImages = images;

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
            {FOLDERS.map((folder) => (
              <Card 
                key={folder.key} 
                className={`px-6 py-3 transition-all cursor-pointer hover:-translate-y-0.5 ${
                  selectedCategory === folder.key 
                    ? 'bg-primary text-primary-foreground shadow-lg' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedCategory(folder.key)}
              >
                <span className="font-medium">{folder.label}</span>
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
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredImages.map((image) => (
                <Card 
                  key={image.id}
                  className="group overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img 
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <Badge variant="secondary" className="mb-2">{image.category}</Badge>
                        <h3 className="font-bold text-sm">{image.title}</h3>
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
                  src={selectedImage.url}
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
