import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Building2, MapPin, Plus } from "lucide-react";

export default function Properties() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const properties = [
    {
      id: 1,
      name: "مجمع الأعمال الرئيسي",
      address: "الرياض، حي العليا",
      type: "مكاتب تجارية",
      units: 25,
      status: "نشط"
    },
    {
      id: 2,
      name: "برج السكني الشمالي",
      address: "جدة، حي النزهة",
      type: "سكني",
      units: 50,
      status: "نشط"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={() => setSidebarOpen(true)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-6 lg:pr-64">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-foreground">العقارات</h1>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                إضافة عقار جديد
              </Button>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <Card key={property.id} className="card-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      {property.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {property.address}
                      </div>
                      <p className="text-sm"><span className="font-semibold">النوع:</span> {property.type}</p>
                      <p className="text-sm"><span className="font-semibold">الوحدات:</span> {property.units}</p>
                      <span className="inline-block px-2 py-1 bg-success text-success-foreground text-xs rounded-full">
                        {property.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}