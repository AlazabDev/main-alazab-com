import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { NewRequestForm } from "@/components/forms/NewRequestForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, MapPin, Clock, User, Search, Filter, Plus, Star } from "lucide-react";
import { cn } from "@/lib/utils";
// import { useMaintenanceRequests } from "@/hooks/useMaintenanceRequests";

const statusConfig = {
  pending: { label: "في انتظار التحديد", className: "bg-yellow-500 text-white" },
  in_progress: { label: "قيد التنفيذ", className: "bg-blue-500 text-white" },
  completed: { label: "مكتمل", className: "bg-green-500 text-white" },
  cancelled: { label: "ملغي", className: "bg-gray-500 text-white" }
};

const priorityConfig = {
  low: { label: "منخفضة", className: "bg-muted text-muted-foreground" },
  medium: { label: "متوسطة", className: "bg-warning text-warning-foreground" },
  high: { label: "عالية", className: "bg-destructive text-destructive-foreground" }
};

const serviceTypeConfig = {
  plumbing: "سباكة",
  electrical: "كهرباء", 
  hvac: "تكييف",
  carpentry: "نجارة",
  painting: "دهانات",
  cleaning: "تنظيف",
  general: "صيانة عامة"
};

export default function Requests() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  
  // const { requests, loading } = useMaintenanceRequests();
  const requests: any[] = [];
  const loading = false;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={() => setShowNewRequestForm(true)}
              >
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
                      <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
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
              {loading ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground text-lg">جاري تحميل الطلبات...</p>
                  </CardContent>
                </Card>
              ) : (
                <>
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
                              {request.description || "لا يوجد وصف"}
                            </p>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{request.address || "غير محدد"}</span>
                              </div>
                              
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <User className="h-4 w-4" />
                                <span>{serviceTypeConfig[request.service_type as keyof typeof serviceTypeConfig] || request.service_type}</span>
                              </div>

                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{new Date(request.created_at).toLocaleDateString('ar-EG')}</span>
                              </div>
                            </div>

                            {/* Rating */}
                            {request.rating && (
                              <div className="flex items-center gap-1">
                                <span className="text-sm text-muted-foreground">التقييم:</span>
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${
                                      i < request.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                    }`} 
                                  />
                                ))}
                                <span className="text-sm text-muted-foreground">({request.rating}/5)</span>
                              </div>
                            )}

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-border">
                              <Badge className={statusConfig[request.status as keyof typeof statusConfig].className}>
                                {statusConfig[request.status as keyof typeof statusConfig].label}
                              </Badge>
                              {request.cost && (
                                <span className="text-lg font-semibold text-primary">
                                  {request.cost} ج.م
                                </span>
                              )}
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
                </>
              )}
            </div>

            {/* New Request Dialog */}
            <Dialog open={showNewRequestForm} onOpenChange={setShowNewRequestForm}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>طلب صيانة جديد</DialogTitle>
                </DialogHeader>
                <NewRequestForm 
                  onSuccess={() => setShowNewRequestForm(false)}
                  onCancel={() => setShowNewRequestForm(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
}