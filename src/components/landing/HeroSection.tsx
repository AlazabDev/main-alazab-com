import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, CheckCircle, Users, Clock, Shield } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f1f5f9' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                <Shield className="h-3 w-3 mr-1" />
                نظام إدارة الصيانة الذكي
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                منصة ذكية لإدارة الصيانة
                <span className="bg-gradient-to-l from-primary to-primary/60 bg-clip-text text-transparent block">
                  والعقارات بكفاءة معاصرة
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                نظام شامل لإدارة طلبات الصيانة والعقارات مع إمكانيات متقدمة للتحكم والمتابعة.
                احصل على تجربة سلسة وفعالة لإدارة جميع احتياجاتك من مكان واحد.
              </p>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: CheckCircle, text: "إدارة طلبات الصيانة" },
                { icon: Users, text: "إدارة الموردين والفنيين" },
                { icon: Clock, text: "متابعة المواعيد" },
                { icon: Shield, text: "نظام أمان متقدم" }
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
              <Button size="lg" className="group">
                ابدأ التجربة المجانية
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button variant="outline" size="lg" className="group">
                <Play className="h-4 w-4 ml-2" />
                شاهد العرض التوضيحي
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">+500</div>
                <div className="text-xs text-muted-foreground">عميل راضي</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">99.9%</div>
                <div className="text-xs text-muted-foreground">وقت التشغيل</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-xs text-muted-foreground">دعم فني</div>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative">
            <Card className="p-6 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-sm">A</span>
                    </div>
                    <span className="font-semibold">لوحة التحكم</span>
                  </div>
                  <Badge variant="secondary">مباشر</Badge>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100">
                    <div className="text-2xl font-bold text-blue-600">142</div>
                    <div className="text-sm text-blue-600/70">طلبات جديدة</div>
                  </Card>
                  <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100">
                    <div className="text-2xl font-bold text-green-600">89</div>
                    <div className="text-sm text-green-600/70">مكتملة</div>
                  </Card>
                </div>

                {/* Chart Placeholder */}
                <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">إحصائيات الأداء</div>
                    <div className="h-20 bg-gradient-to-r from-primary/20 to-primary/40 rounded-lg flex items-end justify-between p-2">
                      {[40, 60, 45, 80, 65, 90, 75].map((height, i) => (
                        <div 
                          key={i} 
                          className="bg-primary rounded-sm opacity-80" 
                          style={{ height: `${height}%`, width: '8px' }}
                        />
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Recent Activity */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">النشاط الأخير</div>
                  {[
                    { title: "طلب صيانة كهرباء", time: "منذ 5 دقائق", status: "جديد" },
                    { title: "إكمال صيانة سباكة", time: "منذ 15 دقيقة", status: "مكتمل" }
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <div>
                        <div className="text-sm font-medium">{activity.title}</div>
                        <div className="text-xs text-muted-foreground">{activity.time}</div>
                      </div>
                      <Badge variant={activity.status === "جديد" ? "default" : "secondary"} className="text-xs">
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/10 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-secondary/10 rounded-full animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
};