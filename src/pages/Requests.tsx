import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NewRequestForm } from "@/components/forms/NewRequestForm";
import { MaintenanceRequestsList } from "@/components/maintenance/MaintenanceRequestsList";

const Requests = () => {
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);

  return (
    <div className="space-y-8">
      <MaintenanceRequestsList onNewRequestClick={() => setIsNewRequestOpen(true)} />

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