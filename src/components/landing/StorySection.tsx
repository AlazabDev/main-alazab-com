import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote, Award, Users, Target } from "lucide-react";

export const StorySection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <Badge variant="secondary" className="w-fit mx-auto">
            <Award className="h-3 w-3 mr-1" />
            قصة نجاح
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-bold">
            من فني إلى مدير تنفيذي
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            رحلة محمد العزب من تقديم خدمة صيانة واحدة إلى بناء شركة وطنية لإدارة المرافق
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Image Side */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://zrrffsjbfkphridqyais.supabase.co/storage/v1/object/public/az_gallery/images/construction/abuauf_47.jpg"
                alt="محمد العزب - مؤسس شركة العزب"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-2xl font-bold text-white mb-2">محمد العزب</h3>
                <p className="text-white/90">مؤسس ومالك شركة العزب للمقاولات</p>
              </div>
            </div>
            
            {/* Floating Stats */}
            <Card className="absolute -bottom-6 -right-6 p-6 bg-background/95 backdrop-blur-sm border-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">+5</div>
                  <div className="text-xs text-muted-foreground">سنوات من النجاح</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Story Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-lg leading-relaxed">
                بعد نشأته في قطاع البناء التجاري، انضم محمد العزب (مالك شركة العزب) إلى قطاع إدارة المرافق الوطنية. 
                تلقى طلب خدمة صيانة من شركة أبو عوف، إحدى أكبر شركات التجزئة، في عام 2019.
              </p>

              <p className="text-lg leading-relaxed">
                بعد فترة وجيزة من إتمام هذه الصيانة وبناء علاقة طويلة الأمد مع العملاء، بدأ محمد العزب رحلته نحو 
                بناء شركة وطنية لإدارة المرافق. بعد سنوات من العمل في البناء التجاري والتجديدات، وضع محمد نصب عينيه 
                أن يصبح خبيراً في صيانة متاجر ومطاعم متعددة المواقع.
              </p>

              <p className="text-lg leading-relaxed">
                استمر محمد العزب في تلبية احتياجات الصيانة لتجار التجزئة وسلاسل المطاعم في جميع المحافظات، 
                مجيباً على جميع مكالمات العملاء ومكملاً الأوراق حتى وقت متأخر من الليل.
              </p>
            </div>

            {/* Key Highlights */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Card className="p-4 border-l-4 border-l-primary">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">فريق متخصص</h4>
                    <p className="text-sm text-muted-foreground">
                      تم توظيف وتدريب فريق مكتبي محترف
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-l-4 border-l-secondary">
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-secondary mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">ثقة العملاء</h4>
                    <p className="text-sm text-muted-foreground">
                      خدمة سلاسل البيع بالتجزئة الكبرى
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Innovation & Growth Section */}
        <Card className="p-8 lg:p-12 bg-gradient-to-br from-primary/5 to-secondary/5 border-0 mb-12">
          <div className="space-y-6">
            <h3 className="text-2xl lg:text-3xl font-bold text-center mb-8">
              الابتكار والاستدامة
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-xl font-semibold">التحول الرقمي</h4>
                <p className="leading-relaxed">
                  مع توسع الشركة، ركز محمد العزب على الابتكار والاستدامة لضمان بقاء العزب في طليعة اتجاهات الصناعة. 
                  قدم حلول تكنولوجية متقدمة لتبسيط العمليات وتحسين كفاءة الخدمة. وشمل ذلك تطبيق منصة رقمية متطورة 
                  تمكن العملاء من تتبع طلبات الخدمة بسهولة وتلقي التحديثات في الوقت الفعلي.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-semibold">الجودة والتميز</h4>
                <p className="leading-relaxed">
                  ساعد تركيز محمد على الجودة ورضا العملاء في بناء سمعة العزب من حيث الموثوقية والتميز. 
                  بدأت الشركة في تلقي جوائز من جمعيات الصناعة، وسلطت شهادات العملاء الضوء ليس فقط على خبرتها 
                  التقنية ولكن أيضاً على التزامها بالخدمة الشخصية.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quote Section */}
        <Card className="relative p-8 lg:p-12 bg-gradient-to-br from-primary to-primary/80 text-white overflow-hidden">
          <div className="absolute top-4 right-4 opacity-10">
            <Quote className="h-32 w-32" />
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <blockquote className="text-xl lg:text-2xl font-medium leading-relaxed mb-6 text-center">
              "النية مهمة. نحن جميعاً ملتزمون بنقاء النية. شعبنا مهم، ولا نركز على النجاح المالي أو إمكانات النمو. 
              فريقنا الداخلي هو الأهم، وسنبذل قصارى جهدنا لتحقيق ذلك. هذا ما يبقينا صادقين مع نوايانا، 
              ومن هناك يمكن لعملائنا وشركائنا الموردين الاستمتاع بنفس التفاني المزدوج."
            </blockquote>
            
            <div className="text-center">
              <div className="font-bold text-lg">محمد العزب</div>
              <div className="text-white/80">مؤسس ومالك شركة العزب للمقاولات</div>
            </div>
          </div>
        </Card>

        {/* Future Vision */}
        <div className="text-center mt-16 max-w-3xl mx-auto space-y-4">
          <h3 className="text-2xl lg:text-3xl font-bold">رؤية المستقبل</h3>
          <p className="text-lg leading-relaxed">
            بالنظر إلى المستقبل، يرى محمد العزب شركة العزب كشركة رائدة في قطاع إدارة المرافق، 
            تضع باستمرار معايير جديدة للخدمة والاستدامة. قصته هي شهادة على قوة التفاني والابتكار، 
            وأهمية بناء علاقات مثمرة مع العملاء والمجتمع.
          </p>
        </div>
      </div>
    </section>
  );
};
