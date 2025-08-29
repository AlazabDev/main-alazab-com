import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { VendorCard } from "@/components/vendors/VendorCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus, Users, Star, Clock } from "lucide-react";

const mockVendors = [
  {
    id: "1",
    name: "أحمد محمد",
    specialty: "سباك محترف",
    rating: 4.8,
    completedJobs: 125,
    location: "المنصورة، الدقهلية",
    phone: "01012345678",
    status: "available" as const,
    hourlyRate: "50 ج.م/ساعة",
    verified: true,
    responseTime: "15 دقيقة"
  },
  {
    id: "2", 
    name: "محمد عزب",
    specialty: "كهربائي معتمد",
    rating: 4.9,
    completedJobs: 89,
    location: "القاهرة، مصر الجديدة",
    phone: "01123456789",
    status: "busy" as const,
    hourlyRate: "45 ج.م/ساعة",
    verified: true,
    responseTime: "30 دقيقة"
  },
  {
    id: "3",
    name: "سارة أحمد",
    specialty: "فني تكييف",
    rating: 4.7,
    completedJobs: 67,
    location: "الإسكندرية",
    phone: "01234567890",
    status: "available" as const,
    hourlyRate: "55 ج.م/ساعة",
    verified: false,
    responseTime: "20 دقيقة"
  },
  {
    id: "4",
    name: "عمر حسن",
    specialty: "نجار ديكور",
    rating: 4.6,
    completedJobs: 45,
    location: "الجيزة، 6 أكتوبر",
    phone: "01345678901",
    status: "offline" as const,
    hourlyRate: "60 ج.م/ساعة",
    verified: true,
    responseTime: "45 دقيقة"
  }
];

export default function Vendors() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const filteredVendors = mockVendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = specialtyFilter === "all" || vendor.specialty.includes(specialtyFilter);
    const matchesStatus = statusFilter === "all" || vendor.status === statusFilter;
    
    return matchesSearch && matchesSpecialty && matchesStatus;
  });

  const handleContact = (vendorId: string) => {
    const vendor = mockVendors.find(v => v.id === vendorId);
    if (vendor) {
      window.open(`tel:${vendor.phone}`);
    }
  };

  const handleAssign = (vendorId: string) => {
    const vendor = mockVendors.find(v => v.id === vendorId);
    alert(`تم تعيين ${vendor?.name} للمهمة`);
  };

  const stats = {
    total: mockVendors.length,
    available: mockVendors.filter(v => v.status === "available").length,
    busy: mockVendors.filter(v => v.status === "busy").length,
    avgRating: (mockVendors.reduce((sum, v) => sum + v.rating, 0) / mockVendors.length).toFixed(1)
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
                <h1 className="text-3xl font-bold text-foreground">الموردين والفنيين</h1>
                <p className="text-muted-foreground">إدارة شبكة الموردين والفنيين</p>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 ml-2" />
                إضافة مورد جديد
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">إجمالي الموردين</p>
                      <p className="text-2xl font-bold text-primary">{stats.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Clock className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">متاحين الآن</p>
                      <p className="text-2xl font-bold text-green-500">{stats.available}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                      <Clock className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">مشغولين</p>
                      <p className="text-2xl font-bold text-yellow-500">{stats.busy}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                      <Star className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">متوسط التقييم</p>
                      <p className="text-2xl font-bold text-orange-500">{stats.avgRating}</p>
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
                      placeholder="البحث في الموردين..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-9"
                    />
                  </div>
                  
                  <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="التخصص" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع التخصصات</SelectItem>
                      <SelectItem value="سباك">سباكة</SelectItem>
                      <SelectItem value="كهربائي">كهرباء</SelectItem>
                      <SelectItem value="تكييف">تكييف</SelectItem>
                      <SelectItem value="نجار">نجارة</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="available">متاح</SelectItem>
                      <SelectItem value="busy">مشغول</SelectItem>
                      <SelectItem value="offline">غير متاح</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline">
                    <Filter className="h-4 w-4 ml-2" />
                    تصفية متقدمة
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Vendors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map((vendor) => (
                <VendorCard
                  key={vendor.id}
                  vendor={vendor}
                  onContact={handleContact}
                  onAssign={handleAssign}
                />
              ))}
            </div>

            {filteredVendors.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground text-lg">لا توجد موردين تطابق معايير البحث</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}