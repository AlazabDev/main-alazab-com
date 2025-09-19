import { Plus, FileText, Users, BarChart3, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChatBot } from "@/components/chatbot/ChatBot";
import { cn } from "@/lib/utils";

// مكون البطاقة الأساسي
interface ActionCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  color: "blue" | "orange" | "green" | "purple" | "gray";
  onClick?: () => void;
  className?: string;
}

function ActionCard({ title, subtitle, icon, color, onClick, className }: ActionCardProps) {
  const colorVariants = {
    blue: "bg-blue-600 hover:bg-blue-700 text-white",
    orange: "bg-orange-500 hover:bg-orange-600 text-white", 
    green: "bg-green-600 hover:bg-green-700 text-white",
    purple: "bg-purple-600 hover:bg-purple-700 text-white",
    gray: "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-200 hover:shadow-lg cursor-pointer border-0",
        colorVariants[color],
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4 h-full flex flex-col justify-between min-h-[100px]">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight mb-1 break-words">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs opacity-90 leading-relaxed break-words">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// مكون إحصائيات طلبات الصيانة
export function MaintenanceStats() {
  const stats = [
    {
      id: 1,
      title: "طلب صيانة جديد",
      subtitle: "إضافة طلب صيانة جديد",
      icon: <Plus className="h-5 w-5" />,
      color: "blue" as const,
      onClick: () => console.log("إضافة طلب جديد")
    },
    {
      id: 2,
      title: "تقرير المعدومات",
      subtitle: "عرض تقارير المعدومات والأجهزة التالفة",
      icon: <FileText className="h-5 w-5" />,
      color: "orange" as const,
      onClick: () => console.log("تقرير المعدومات")
    },
    {
      id: 3,
      title: "تقرير المستخدمين",
      subtitle: "إحصائيات المستخدمين والفنيين",
      icon: <Users className="h-5 w-5" />,
      color: "blue" as const,
      onClick: () => console.log("تقرير المستخدمين")
    },
    {
      id: 4,
      title: "تقرير الميزانية",
      subtitle: "تحليل ميزانية أعمال الصيانة",
      icon: <BarChart3 className="h-5 w-5" />,
      color: "green" as const,
      onClick: () => console.log("تقرير الميزانية")
    }
  ];

  return (
    <div className="space-y-6">
      {/* العنوان الرئيسي */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          إحصائيات طلبات الصيانة
        </h1>
      </div>

      {/* البطاقات الأساسية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {stats.map((stat) => (
          <ActionCard
            key={stat.id}
            title={stat.title}
            subtitle={stat.subtitle}
            icon={stat.icon}
            color={stat.color}
            onClick={stat.onClick}
            className="w-full"
          />
        ))}
      </div>

      {/* بطاقة تقرير العقارات */}
      <div className="mt-6">
        <ActionCard
          title="تقرير العقارات والوحدات"
          subtitle="إحصائيات العقارات والوحدات التابعة"
          icon={<Download className="h-5 w-5" />}
          color="gray"
          onClick={() => console.log("تقرير العقارات")}
          className="w-full max-w-md mx-auto"
        />
      </div>
    </div>
  );
}

// مكون منفصل للبطاقات الصغيرة
interface SmallCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: "blue" | "orange" | "green" | "red";
}

function SmallCard({ title, count, icon, color }: SmallCardProps) {
  const colorVariants = {
    blue: "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
    orange: "bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800",
    green: "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
    red: "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
  };

  const iconColors = {
    blue: "text-blue-600 dark:text-blue-400",
    orange: "text-orange-600 dark:text-orange-400", 
    green: "text-green-600 dark:text-green-400",
    red: "text-red-600 dark:text-red-400"
  };

  return (
    <Card className={cn("border-2", colorVariants[color])}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg", iconColors[color])}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-2xl font-bold text-foreground">
              {count.toLocaleString('ar-SA')}
            </div>
            <div className="text-sm text-muted-foreground break-words">
              {title}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// مكون الإحصائيات السريعة
export function QuickStats() {
  const stats = [
    { title: "الطلبات المعلقة", count: 15, icon: <FileText className="h-5 w-5" />, color: "orange" as const },
    { title: "الطلبات المكتملة", count: 245, icon: <BarChart3 className="h-5 w-5" />, color: "green" as const },
    { title: "الفنيين النشطين", count: 12, icon: <Users className="h-5 w-5" />, color: "blue" as const },
    { title: "الطلبات المتأخرة", count: 3, icon: <FileText className="h-5 w-5" />, color: "red" as const }
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <SmallCard
            key={index}
            title={stat.title}
            count={stat.count}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>
      {/* ChatBot - مع التأكد من عدم تداخله مع العناصر الأخرى */}
      <ChatBot />    
    </>
  );
}

// Export AppLayout as the default layout wrapper
export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto p-4">
      {children}
    </div>
  );
}