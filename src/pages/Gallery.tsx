import { LandingHeader } from "@/components/landing/LandingHeader";
import { Footer } from "@/components/landing/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Camera, X } from "lucide-react";

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const categories = [
    { name: "مشاريع سكنية", count: 45 },
    { name: "مشاريع تجارية", count: 32 },
    { name: "أعمال الصيانة", count: 56 },
    { name: "التشطيبات", count: 28 }
  ];

  // Gallery images - using real images from al-azab.co
  const images = [
    { src: "https://al-azab.co/images/project-1.jpg", category: "مشاريع سكنية", title: "فيلا سكنية فاخرة" },
    { src: "https://al-azab.co/images/project-2.jpg", category: "مشاريع تجارية", title: "مجمع تجاري" },
    { src: "https://al-azab.co/images/project-3.jpg", category: "أعمال الصيانة", title: "صيانة شاملة" },
    { src: "https://al-azab.co/images/project-4.jpg", category: "التشطيبات", title: "تشطيبات داخلية" },
    { src: "https://al-azab.co/images/project-5.jpg", category: "مشاريع سكنية", title: "مبنى سكني" },
    { src: "https://al-azab.co/images/project-6.jpg", category: "مشاريع تجارية", title: "مكاتب إدارية" },
    { src: "https://al-azab.co/images/project-7.jpg", category: "أعمال الصيانة", title: "ترميم وصيانة" },
    { src: "https://al-azab.co/images/project-8.jpg", category: "التشطيبات", title: "تشطيبات خارجية" },
    { src: "https://al-azab.co/images/electrical-1.jpg", category: "أعمال الصيانة", title: "أعمال كهربائية" },
    { src: "https://al-azab.co/images/plumbing-1.jpg", category: "أعمال الصيانة", title: "أعمال سباكة" },
    { src: "https://al-azab.co/images/painting-1.jpg", category: "التشطيبات", title: "أعمال الدهانات" },
    { src: "https://al-azab.co/images/construction-1.jpg", category: "مشاريع سكنية", title: "بناء وتشييد" }
  ];

  // Fallback images from Unsplash
  const fallbackImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1600573472556-e636c2f75494?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1600607686625-02cb5816c96f?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop"
  ];

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

      {/* Categories */}
      <section className="py-12 bg-card border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => (
              <Card key={index} className="px-6 py-3 hover:shadow-lg transition-all cursor-pointer hover:-translate-y-0.5">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{category.name}</span>
                  <Badge variant="secondary">{category.count}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((image, index) => (
              <Card 
                key={index}
                className="group overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300"
                onClick={() => setSelectedImage(image.src)}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img 
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = fallbackImages[index % fallbackImages.length];
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <Badge variant="secondary" className="mb-2">{image.category}</Badge>
                      <h3 className="font-bold text-lg">{image.title}</h3>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden">
          <div className="relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            {selectedImage && (
              <img 
                src={selectedImage}
                alt="صورة مكبرة"
                className="w-full h-auto max-h-[90vh] object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
