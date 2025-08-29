import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MapPin, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MaintenanceRequest {
  id: string;
  title: string;
  location: string;
  customer: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high";
  date: string;
  estimatedCost: string;
}

const statusConfig = {
  pending: { label: "في انتظار التحديد", className: "status-pending" },
  "in-progress": { label: "في انتظار المورد", className: "status-in-progress" },
  completed: { label: "تم التعيين", className: "status-completed" },
  cancelled: { label: "ملغي", className: "status-cancelled" }
};

const priorityConfig = {
  low: { label: "منخفضة", className: "bg-muted text-muted-foreground" },
  medium: { label: "متوسطة", className: "bg-warning text-warning-foreground" },
  high: { label: "عالية", className: "bg-destructive text-destructive-foreground" }
};

const mockRequests: MaintenanceRequest[] = [
  {
    id: "MR-250803-4C1E-OTYJ",
    title: "مشكلة في السباكة الداخلية بالكامل",
    location: "المنصورة، مصر",
    customer: "محمد عزب",
    status: "in-progress",
    priority: "high",
    date: "12:00 2025-08-04",
    estimatedCost: "375.06 ج.م"
  },
  {
    id: "MR-250802-4C1E-HXJW", 
    title: "ساكية",
    location: "شارع 500 المعادي 8",
    customer: "أحمد محمد",
    status: "completed",
    priority: "medium",
    date: "09:00 اليوم",
    estimatedCost: "329.00 ج.م"
  }
];

export const RecentRequests = () => {
  return (
    <Card className="card-elegant">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">طلبات الصيانة الأخيرة</CardTitle>
        <Button variant="ghost" size="sm">
          عرض الكل
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockRequests.map((request) => (
          <div key={request.id} className="border border-border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-foreground line-clamp-1">
                  {request.title}
                </h3>
                <p className="text-sm text-primary font-medium">{request.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={cn("text-xs", priorityConfig[request.priority].className)}>
                  {priorityConfig[request.priority].label}
                </Badge>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{request.location}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{request.customer}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{request.date}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <Badge className={cn("text-xs", statusConfig[request.status].className)}>
                {statusConfig[request.status].label}
              </Badge>
              <span className="text-sm font-medium text-primary">
                {request.estimatedCost}
              </span>
            </div>
          </div>
        ))}

        {mockRequests.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>لا توجد طلبات صيانة حالياً</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};