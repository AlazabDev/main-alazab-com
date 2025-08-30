import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewRequestForm } from "@/components/forms/NewRequestForm";
import { MaintenanceRequestsList } from "@/components/maintenance/MaintenanceRequestsList";

const Requests = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        <div className="flex-1 lg:mr-64">
          <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          
          <main className="p-6 space-y-8">
            <MaintenanceRequestsList />
          </main>
        </div>
      </div>

      <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">إنشاء طلب صيانة جديد</DialogTitle>
          </DialogHeader>
          <NewRequestForm onSuccess={() => setIsNewRequestOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Requests;