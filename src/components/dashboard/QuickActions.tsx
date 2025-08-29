import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Calendar, Users, Download, BarChart3 } from "lucide-react";

const quickActions = [
  {
    icon: Plus,
    label: "طلب صيانة جديد",
    description: "إضافة طلب صيانة جديد",
    color: "bg-primary text-primary-foreground",
    variant: "default" as const
  },
  {
    icon: FileText,
    label: "تقرير المصروفات والمدفوعات",
    description: "تحليل تفصيلي للميزانية",
    color: "bg-secondary text-secondary-foreground",
    variant: "secondary" as const
  },
  {
    icon: BarChart3,
    label: "تقرير الميزانية",
    description: "تحليل شامل للميزانية",
    color: "bg-success text-success-foreground",
    variant: "default" as const
  },
  {
    icon: Users,
    label: "تقرير المستخدمين والنشاط",
    description: "إحصائيات المستخدمين والنشاط",
    color: "bg-warning text-warning-foreground",
    variant: "default" as const
  },
  {
    icon: BarChart3,
    label: "تقرير العقارات وإحصائيات العقارات والوحدات",
    description: "إحصائيات العقارات والوحدات",
    color: "bg-muted text-muted-foreground",
    variant: "outline" as const
  },
  {
    icon: Download,
    label: "قراءة",
    description: "",
    color: "bg-muted text-muted-foreground",
    variant: "outline" as const
  }
];

export const QuickActions = () => {
  return (
    <Card className="card-elegant">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">إحصائيات طلبات الصيانة</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              className="h-auto p-4 justify-start gap-3 text-right"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                <action.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 text-right">
                <p className="font-medium text-sm leading-tight">{action.label}</p>
                {action.description && (
                  <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                )}
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};