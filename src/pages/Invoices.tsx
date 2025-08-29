import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DollarSign, Download, Plus, FileText } from "lucide-react";

export default function Invoices() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const invoices = [
    {
      id: 1,
      number: "INV-2025-001",
      customer: "شركة الأعمال المتقدمة",
      amount: 2500,
      date: "2025-01-10",
      status: "مدفوعة"
    },
    {
      id: 2,
      number: "INV-2025-002",
      customer: "مجمع الإدارة",
      amount: 1800,
      date: "2025-01-12",
      status: "معلقة"
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
              <h1 className="text-3xl font-bold text-foreground">الفواتير</h1>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                إنشاء فاتورة جديدة
              </Button>
            </div>
            
            <div className="grid gap-6">
              {invoices.map((invoice) => (
                <Card key={invoice.id} className="card-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      {invoice.number}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                      <div>
                        <p className="text-sm text-muted-foreground">العميل</p>
                        <p className="font-semibold">{invoice.customer}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">المبلغ</p>
                        <p className="font-semibold flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {invoice.amount} ريال
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">التاريخ</p>
                        <p className="font-semibold">{invoice.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">الحالة</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          invoice.status === 'مدفوعة' ? 'bg-success text-success-foreground' : 'bg-warning text-warning-foreground'
                        }`}>
                          {invoice.status}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Download className="h-3 w-3" />
                          تحميل
                        </Button>
                      </div>
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