import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, MapPin, Calendar, DollarSign, Search, Plus, Eye, Edit } from "lucide-react";

const mockProperties = [
  {
    id: "PROP-001",
    name: "مجمع العزب التجاري",
    type: "تجاري",
    location: "المنصورة، شارع الجمهورية",
    area: "500 م²",
    value: "2,500,000 ج.م",
    status: "active",
    maintenanceRequests: 5,
    lastMaintenance: "2025-01-15",
    manager: "أحمد محمد",
    description: "مجمع تجاري يحتوي على 8 محلات تجارية"
  },
  {
    id: "PROP-002", 
    name: "برج السكن الفاخر",
    type: "سكني",
    location: "القاهرة، مصر الجديدة",
    area: "1200 م²",
    value: "8,000,000 ج.م",
    status: "active",
    maintenanceRequests: 3,
    lastMaintenance: "2025-01-20",
    manager: "فاطمة أحمد",
    description: "برج سكني مكون من 15 طابق"
  },
  {
    id: "PROP-003",
    name: "مصنع الإنتاج",
    type: "صناعي", 
    location: "الإسكندرية، برج العرب",
    area: "2000 م²",
    value: "5,000,000 ج.م",
    status: "maintenance",
    maintenanceRequests: 8,
    lastMaintenance: "2025-01-10",
    manager: "محمد عزب",
    description: "مصنع لإنتاج المواد الغذائية"
  }
];

export default function Properties() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const filteredProperties = mockProperties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || property.type === typeFilter;
    const matchesStatus = statusFilter === "all" || property.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const statusConfig = {
    active: { label: "نشط", className: "bg-green-500 text-white" },
    maintenance: { label: "تحت الصيانة", className: "bg-yellow-500 text-white" },
    inactive: { label: "غير نشط", className: "bg-gray-500 text-white" }
  };

  const typeConfig = {
    "تجاري": { className: "bg-blue-500 text-white" },
    "سكني": { className: "bg-green-500 text-white" },
    "صناعي": { className: "bg-orange-500 text-white" }
  };

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
                <h1 className="text-3xl font-bold text-foreground">إدارة العقارات</h1>
                <p className="text-muted-foreground">إدارة ومتابعة العقارات والممتلكات</p>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 ml-2" />
                إضافة عقار جديد
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">إجمالي العقارات</p>
                      <p className="text-2xl font-bold text-primary">{mockProperties.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Building2 className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">نشطة</p>
                      <p className="text-2xl font-bold text-green-500">
                        {mockProperties.filter(p => p.status === "active").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                      <Building2 className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">تحت الصيانة</p>
                      <p className="text-2xl font-bold text-yellow-500">
                        {mockProperties.filter(p => p.status === "maintenance").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                      <DollarSign className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">القيمة الإجمالية</p>
                      <p className="text-lg font-bold text-orange-500">15.5M ج.م</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                      placeholder="البحث في العقارات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-9"
                    />
                  </div>
                  
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="نوع العقار" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأنواع</SelectItem>
                      <SelectItem value="تجاري">تجاري</SelectItem>
                      <SelectItem value="سكني">سكني</SelectItem>
                      <SelectItem value="صناعي">صناعي</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="maintenance">تحت الصيانة</SelectItem>
                      <SelectItem value="inactive">غير نشط</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline">
                    تصدير التقرير
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Properties Grid */}
            <div className="grid gap-4">
              {filteredProperties.map((property) => (
                <Card key={property.id} className="card-elegant hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-semibold text-foreground">
                                {property.name}
                              </h3>
                              <Badge className={typeConfig[property.type as keyof typeof typeConfig].className}>
                                {property.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-primary font-medium">{property.id}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={statusConfig[property.status as keyof typeof statusConfig].className}>
                              {statusConfig[property.status as keyof typeof statusConfig].label}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground">
                          {property.description}
                        </p>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{property.location}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Building2 className="h-4 w-4" />
                            <span>{property.area}</span>
                          </div>

                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>آخر صيانة: {property.lastMaintenance}</span>
                          </div>

                          <div className="flex items-center gap-2 text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            <span>{property.value}</span>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="text-sm text-muted-foreground">
                            المسؤول: {property.manager}
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">طلبات الصيانة: </span>
                            <span className="font-semibold text-primary">{property.maintenanceRequests}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredProperties.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground text-lg">لا توجد عقارات تطابق معايير البحث</p>
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