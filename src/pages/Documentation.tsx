import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { FileText, Book, HelpCircle } from "lucide-react";

export default function Documentation() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const docs = [
    {
      title: "دليل المستخدم",
      description: "شرح كامل لاستخدام نظام الصيانة",
      icon: Book
    },
    {
      title: "الأسئلة الشائعة",
      description: "إجابات على الأسئلة المتكررة",
      icon: HelpCircle
    },
    {
      title: "إجراءات الصيانة",
      description: "دليل الإجراءات والعمليات",
      icon: FileText
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
              <h1 className="text-3xl font-bold text-foreground">التوثيق</h1>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {docs.map((doc, index) => (
                <Card key={index} className="card-elegant cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <doc.icon className="h-5 w-5 text-primary" />
                      {doc.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{doc.description}</p>
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