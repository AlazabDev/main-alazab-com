import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Mail, MapPin, Star, Search, Plus, Users } from "lucide-react";

interface Vendor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  completedJobs: number;
  phone: string;
  email: string;
  location: string;
  status: "active" | "inactive" | "pending";
  avatar: string;
  skills: string[];
}

const statusConfig = {
  active: { label: "نشط", className: "bg-success text-success-foreground" },
  inactive: { label: "غير نشط", className: "bg-muted text-muted-foreground" },
  pending: { label: "في الانتظار", className: "bg-warning text-warning-foreground" }
};

const mockVendors: Vendor[] = [
  {
    id: "V-001",
    name: "أحمد محمد العزب",
    specialty: "سباكة",
    rating: 4.8,
    completedJobs: 127,
    phone: "+20 123 456 7890",
    email: "ahmed@email.com",
    location: "المنصورة، مصر",
    status: "active",
    avatar: "/placeholder.svg",
    skills: ["إصلاح تسريبات", "تركيب مواسير", "صيانة عامة"]
  },
  {
    id: "V-002",
    name: "محمد حسن علي",
    specialty: "كهرباء",
    rating: 4.9,
    completedJobs: 89,
    phone: "+20 123 456 7891",
    email: "mohamed@email.com",
    location: "القاهرة، مصر",
    status: "active",
    avatar: "/placeholder.svg",
    skills: ["إصلاح أعطال", "تركيب إضاءة", "صيانة دورية"]
  },
  {
    id: "V-003",
    name: "سارة أحمد محمد",
    specialty: "تكييف وتبريد",
    rating: 4.7,
    completedJobs: 64,
    phone: "+20 123 456 7892",
    email: "sara@email.com",
    location: "الإسكندرية، مصر",
    status: "pending",
    avatar: "/placeholder.svg",
    skills: ["صيانة تكييف", "إصلاح ثلاجات", "تركيب وحدات"]
  },
  {
    id: "V-004",
    name: "عمر حسن محمود",
    specialty: "نجارة",
    rating: 4.6,
    completedJobs: 45,
    phone: "+20 123 456 7893",
    email: "omar@email.com",
    location: "الجيزة، مصر",
    status: "inactive",
    avatar: "/placeholder.svg",
    skills: ["تصنيع أثاث", "إصلاح خشب", "دهان"]
  }
];

export default function Vendors() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVendors = mockVendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="card-elegant">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">127</p>
                      <p className="text-sm text-muted-foreground">إجمالي الموردين</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elegant">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-success/10">
                      <Users className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">89</p>
                      <p className="text-sm text-muted-foreground">نشط</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elegant">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-warning/10">
                      <Users className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">23</p>
                      <p className="text-sm text-muted-foreground">في الانتظار</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elegant">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">4.7</p>
                      <p className="text-sm text-muted-foreground">متوسط التقييم</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle>البحث في الموردين</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative max-w-md">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="البحث بالاسم أو التخصص..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-9"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Vendors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map((vendor) => (
                <Card key={vendor.id} className="card-elegant hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={vendor.avatar} alt={vendor.name} />
                            <AvatarFallback>{vendor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-foreground">{vendor.name}</h3>
                            <p className="text-sm text-primary font-medium">{vendor.specialty}</p>
                          </div>
                        </div>
                        <Badge className={statusConfig[vendor.status].className}>
                          {statusConfig[vendor.status].label}
                        </Badge>
                      </div>

                      {/* Rating and Jobs */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{vendor.rating}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {vendor.completedJobs} مهمة مكتملة
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">المهارات:</p>
                        <div className="flex flex-wrap gap-1">
                          {vendor.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2 pt-2 border-t border-border">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{vendor.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span>{vendor.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{vendor.location}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          عرض التفاصيل
                        </Button>
                        <Button size="sm" className="flex-1">
                          تواصل
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredVendors.length === 0 && (
                <div className="col-span-full">
                  <Card>
                    <CardContent className="text-center py-12">
                      <p className="text-muted-foreground text-lg">لا توجد موردين تطابق معايير البحث</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}