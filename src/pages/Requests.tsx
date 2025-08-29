import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, MapPin, Clock, User, Search, Filter, Plus } from "lucide-react";
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
  description: string;
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
    estimatedCost: "375.06 ج.م",
    description: "تسريب في المواسير الرئيسية يحتاج إصلاح عاجل"
  },
  {
    id: "MR-250802-4C1E-HXJW", 
    title: "ساكية",
    location: "شارع 500 المعادي 8",
    customer: "أحمد محمد",
    status: "completed",
    priority: "medium",
    date: "09:00 اليوم",
    estimatedCost: "329.00 ج.م",
    description: "صيانة دورية للساكية وتنظيف المرشحات"
  },
  {
    id: "MR-250801-4C1E-ZXCV",
    title: "إصلاح أعمال الكهرباء",
    location: "التجمع الخامس، القاهرة",
    customer: "سارة أحمد",
    status: "pending",
    priority: "high",
    date: "14:30 أمس",
    estimatedCost: "450.00 ج.م",
    description: "مشكلة في الأسلاك الكهربائية بالمحل"
  },
  {
    id: "MR-250800-4C1E-QWER",
    title: "صيانة نظام التكييف",
    location: "مدينة نصر، القاهرة",
    customer: "عمر حسن",
    status: "cancelled",
    priority: "low",
    date: "11:15 أمس",
    estimatedCost: "280.00 ج.م",
    description: "تنظيف وصيانة وحدات التكييف"
  }
];

export default function Requests() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const filteredRequests = mockRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={toggleSidebar} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">طلبات الصيانة</h1>
                <p className="text-muted-foreground">إدارة جميع طلبات الصيانة</p>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 ml-2" />
                طلب جديد
              </Button>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>البحث والتصفية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="البحث في الطلبات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-9"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="حالة الطلب" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="pending">في انتظار التحديد</SelectItem>
                      <SelectItem value="in-progress">في انتظار المورد</SelectItem>
                      <SelectItem value="completed">تم التعيين</SelectItem>
                      <SelectItem value="cancelled">ملغي</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="الأولوية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأولويات</SelectItem>
                      <SelectItem value="high">عالية</SelectItem>
                      <SelectItem value="medium">متوسطة</SelectItem>
                      <SelectItem value="low">منخفضة</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline">
                    <Filter className="h-4 w-4 ml-2" />
                    تصفية متقدمة
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Requests Grid */}
            <div className="grid gap-4">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="card-elegant hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">
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

                        {/* Description */}
                        <p className="text-sm text-muted-foreground">
                          {request.description}
                        </p>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{request.location}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>{request.customer}</span>
                          </div>

                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{request.date}</span>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <Badge className={cn("text-xs", statusConfig[request.status].className)}>
                            {statusConfig[request.status].label}
                          </Badge>
                          <span className="text-lg font-semibold text-primary">
                            {request.estimatedCost}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredRequests.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground text-lg">لا توجد طلبات تطابق معايير البحث</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}