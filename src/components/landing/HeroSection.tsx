import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Wrench, Building2, Zap, Droplets } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://zrrffsjbfkphridqyais.supabase.co/storage/v1/object/public/az_gallery/images/construction/abuauf_47.jpg"
          alt="تجهيز المحلات"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-primary/20"></div>
      </div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                <Wrench className="h-3 w-3 mr-1" />
                خبراء الصيانة وتجهيز المحلات
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="inline-block animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                  حلول
                </span>{' '}
                <span className="inline-block animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                  شاملة
                </span>{' '}
                <span className="inline-block animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                  للصيانة
                </span>
                <span className="bg-gradient-to-l from-primary to-primary/60 bg-clip-text text-transparent block">
                  <span className="inline-block animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                    وتجهيز
                  </span>{' '}
                  <span className="inline-block animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
                    المحلات
                  </span>{' '}
                  <span className="inline-block animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
                    التجارية
                  </span>
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                نوفر خدمات الصيانة الكاملة من كهرباء وسباكة وتكييف، بالإضافة إلى تجهيز المحلات التجارية 
                بأعلى معايير الجودة والاحترافية. فريق متخصص متاح على مدار الساعة.
              </p>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Zap, text: "أعمال الكهرباء" },
                { icon: Droplets, text: "السباكة وإصلاح التسريبات" },
                { icon: Wrench, text: "تركيب وصيانة المكيفات" },
                { icon: Building2, text: "تجهيز المحلات التجارية" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group" onClick={() => window.location.href = '/login'}>
                اطلب خدمة الآن
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button variant="outline" size="lg" className="group" onClick={() => window.location.href = '/register'}>
                <Play className="h-4 w-4 ml-2" />
                عرض أعمالنا
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">+1000</div>
                <div className="text-xs text-muted-foreground">مشروع منجز</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">15+</div>
                <div className="text-xs text-muted-foreground">سنة خبرة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-xs text-muted-foreground">خدمة متواصلة</div>
              </div>
            </div>
          </div>

          {/* Services Showcase */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 shadow-xl border-0 overflow-hidden group cursor-pointer">
                <img 
                  src="https://zrrffsjbfkphridqyais.supabase.co/storage/v1/object/public/az_gallery/images/maintenance/00451-klima-montaj.jpg"
                  alt="تركيب مكيفات"
                  className="w-full h-32 object-cover rounded-lg mb-3 group-hover:scale-110 transition-transform duration-300"
                />
                <h3 className="font-semibold text-sm mb-1">تركيب المكيفات</h3>
                <p className="text-xs text-muted-foreground">تركيب وصيانة جميع أنواع المكيفات</p>
              </Card>

              <Card className="p-4 shadow-xl border-0 overflow-hidden group cursor-pointer">
                <img 
                  src="https://zrrffsjbfkphridqyais.supabase.co/storage/v1/object/public/az_gallery/images/maintenance/62294-establish-electricity.jpg"
                  alt="تأسيس كهرباء"
                  className="w-full h-32 object-cover rounded-lg mb-3 group-hover:scale-110 transition-transform duration-300"
                />
                <h3 className="font-semibold text-sm mb-1">أعمال الكهرباء</h3>
                <p className="text-xs text-muted-foreground">تأسيس وصيانة التمديدات الكهربائية</p>
              </Card>

              <Card className="p-4 shadow-xl border-0 overflow-hidden group cursor-pointer">
                <img 
                  src="https://zrrffsjbfkphridqyais.supabase.co/storage/v1/object/public/az_gallery/images/maintenance/05214-water-leak-repair.jpg"
                  alt="إصلاح تسريبات المياه"
                  className="w-full h-32 object-cover rounded-lg mb-3 group-hover:scale-110 transition-transform duration-300"
                />
                <h3 className="font-semibold text-sm mb-1">معالجة التسريبات</h3>
                <p className="text-xs text-muted-foreground">كشف وإصلاح تسريبات المياه</p>
              </Card>

              <Card className="p-4 shadow-xl border-0 overflow-hidden group cursor-pointer">
                <img 
                  src="https://zrrffsjbfkphridqyais.supabase.co/storage/v1/object/public/az_gallery/images/construction/abuauf_10.jpg"
                  alt="تجهيز محلات"
                  className="w-full h-32 object-cover rounded-lg mb-3 group-hover:scale-110 transition-transform duration-300"
                />
                <h3 className="font-semibold text-sm mb-1">تجهيز المحلات</h3>
                <p className="text-xs text-muted-foreground">تجهيز كامل للمحلات التجارية</p>
              </Card>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/10 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-secondary/10 rounded-full animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
};