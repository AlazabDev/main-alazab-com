import { LandingHeader } from "@/components/landing/LandingHeader";
import { Footer } from "@/components/landing/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Building, CheckCircle2 } from "lucide-react";

export default function Projects() {
  const projects = [
    {
      title: "مجمع فلل العليا السكني",
      location: "الرياض - حي العليا",
      category: "مشاريع سكنية",
      status: "مكتمل",
      year: "2024",
      description: "مشروع سكني متكامل يتضمن 15 فيلا فاخرة بتصميم عصري وتشطيبات راقية",
      image: "villa-project.jpg",
      stats: {
        area: "5,000 م²",
        units: "15 وحدة",
        duration: "18 شهر"
      }
    },
    {
      title: "برج المكاتب التجاري",
      location: "جدة - الكورنيش",
      category: "مشاريع تجارية",
      status: "مكتمل",
      year: "2023",
      description: "برج تجاري حديث من 10 طوابق بأحدث المواصفات والتجهيزات",
      image: "office-tower.jpg",
      stats: {
        area: "8,500 م²",
        floors: "10 طوابق",
        duration: "24 شهر"
      }
    },
    {
      title: "مجمع المدارس الأهلية",
      location: "الدمام - الفيصلية",
      category: "مشاريع تعليمية",
      status: "مكتمل",
      year: "2023",
      description: "مجمع تعليمي متكامل يشمل المراحل الابتدائية والمتوسطة والثانوية",
      image: "school-complex.jpg",
      stats: {
        area: "12,000 م²",
        classrooms: "45 فصل",
        duration: "20 شهر"
      }
    },
    {
      title: "مستشفى الرعاية الصحية",
      location: "مكة المكرمة - العزيزية",
      category: "مشاريع صحية",
      status: "قيد التنفيذ",
      year: "2024",
      description: "مستشفى تخصصي بسعة 150 سرير مع أحدث التجهيزات الطبية",
      image: "hospital.jpg",
      stats: {
        area: "15,000 م²",
        beds: "150 سرير",
        duration: "30 شهر"
      }
    },
    {
      title: "مول البيع بالتجزئة",
      location: "الخبر - الكورنيش",
      category: "مشاريع تجارية",
      status: "مكتمل",
      year: "2022",
      description: "مركز تسوق حديث يضم أكثر من 100 محل تجاري ومرافق ترفيهية",
      image: "mall.jpg",
      stats: {
        area: "20,000 م²",
        stores: "100+ محل",
        duration: "28 شهر"
      }
    },
    {
      title: "مشروع الوحدات السكنية",
      location: "المدينة المنورة - الخالدية",
      category: "مشاريع سكنية",
      status: "قيد التنفيذ",
      year: "2024",
      description: "مشروع سكني يتكون من 50 وحدة سكنية بمساحات متنوعة",
      image: "residential.jpg",
      stats: {
        area: "25,000 م²",
        units: "50 وحدة",
        duration: "22 شهر"
      }
    }
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
              <Building className="h-3 w-3 ml-1" />
              مشاريعنا
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold">
              مشاريع <span className="bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent">متميزة</span> أنجزناها
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              تعرف على أبرز المشاريع التي نفذناها بنجاح عبر مختلف القطاعات
            </p>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-12 bg-card border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "مشروع منجز", value: "350+", color: "text-green-600" },
              { label: "عميل راضٍ", value: "500+", color: "text-blue-600" },
              { label: "مشروع قائم", value: "25", color: "text-orange-600" },
              { label: "متر مربع", value: "500K+", color: "text-purple-600" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card 
                key={index}
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Project Image */}
                <div className="relative h-64 overflow-hidden bg-muted">
                  <img 
                    src={`https://al-azab.co/images/${project.image}`}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const fallbacks = [
                        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
                        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
                        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
                        "https://images.unsplash.com/photo-1600573472556-e636c2f75494?w=800&h=600&fit=crop",
                        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop",
                        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"
                      ];
                      e.currentTarget.src = fallbacks[index % fallbacks.length];
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <Badge 
                      variant={project.status === "مكتمل" ? "default" : "secondary"}
                      className={project.status === "مكتمل" ? "bg-green-600" : ""}
                    >
                      {project.status === "مكتمل" && <CheckCircle2 className="h-3 w-3 ml-1" />}
                      {project.status}
                    </Badge>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge variant="outline" className="bg-white/90 text-foreground border-0">
                      {project.year}
                    </Badge>
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-6 space-y-4">
                  <div>
                    <Badge className="mb-2">{project.category}</Badge>
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4" />
                      <span>{project.location}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Project Stats */}
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/50">
                    {Object.entries(project.stats).map(([key, value], idx) => (
                      <div key={idx} className="text-center">
                        <div className="text-sm font-bold text-primary">{value}</div>
                        <div className="text-xs text-muted-foreground capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="p-12 text-center bg-gradient-to-br from-primary to-primary-dark text-primary-foreground">
            <h2 className="text-3xl font-bold mb-4">مستعد لبدء مشروعك القادم؟</h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              دعنا نحول رؤيتك إلى واقع ملموس مع فريقنا المحترف
            </p>
            <Button size="lg" variant="secondary">
              تواصل معنا الآن
            </Button>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
