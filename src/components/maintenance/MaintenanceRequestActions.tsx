import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash2, UserCheck, DollarSign, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRequestLifecycle } from "@/hooks/useRequestLifecycle";

interface MaintenanceRequestActionsProps {
  request: any;
}

export function MaintenanceRequestActions({ request }: MaintenanceRequestActionsProps) {
  const { toast } = useToast();
  const { addLifecycleEvent } = useRequestLifecycle();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showCostDialog, setShowCostDialog] = useState(false);
  const [showVendorDialog, setShowVendorDialog] = useState(false);
  
  const [newStatus, setNewStatus] = useState(request.status);
  const [estimatedCost, setEstimatedCost] = useState(request.estimated_cost || '');
  const [actualCost, setActualCost] = useState(request.actual_cost || '');
  const [vendorNotes, setVendorNotes] = useState(request.vendor_notes || '');

  const updateRequestStatus = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('maintenance_requests')
        .update({ 
          status: newStatus,
          workflow_stage: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', request.id);

      if (error) throw error;

      // إنشاء حدث دورة حياة
      await addLifecycleEvent(
        request.id,
        newStatus,
        'status_change',
        `تغيير الحالة من ${request.status} إلى ${newStatus}`,
        { old_status: request.status, new_status: newStatus }
      );

      // إنشاء إشعار للمستخدم
      if (request.requested_by) {
        const statusMessages: Record<string, string> = {
          'pending': 'طلبك في الانتظار',
          'scheduled': 'تم جدولة طلبك',
          'in_progress': 'جاري العمل على طلبك',
          'completed': 'تم إكمال طلبك',
          'cancelled': 'تم إلغاء طلبك'
        };

        await supabase.from('notifications').insert({
          recipient_id: request.requested_by,
          title: 'تحديث حالة الطلب',
          message: statusMessages[newStatus] || 'تم تحديث حالة طلبك',
          type: newStatus === 'completed' ? 'success' : 'info',
          entity_type: 'maintenance_request',
          entity_id: request.id
        });
      }

      toast({
        title: "تم تحديث الحالة",
        description: "تم تحديث حالة الطلب بنجاح وإرسال إشعار للعميل",
      });

      setShowStatusDialog(false);
      window.location.reload();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحديث حالة الطلب",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const updateCost = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('maintenance_requests')
        .update({ 
          estimated_cost: estimatedCost ? parseFloat(estimatedCost) : null,
          actual_cost: actualCost ? parseFloat(actualCost) : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', request.id);

      if (error) throw error;

      // إنشاء حدث دورة حياة
      await addLifecycleEvent(
        request.id,
        request.workflow_stage || request.status,
        'cost_update',
        'تم تحديث التكلفة',
        { 
          estimated_cost: estimatedCost ? parseFloat(estimatedCost) : null,
          actual_cost: actualCost ? parseFloat(actualCost) : null
        }
      );

      // إشعار للعميل بالتكلفة المقدرة
      if (estimatedCost && request.requested_by) {
        await supabase.from('notifications').insert({
          recipient_id: request.requested_by,
          title: 'تقدير تكلفة الطلب',
          message: `التكلفة المقدرة لطلبك: ${estimatedCost} جنيه`,
          type: 'info',
          entity_type: 'maintenance_request',
          entity_id: request.id
        });
      }

      toast({
        title: "تم تحديث التكلفة",
        description: "تم تحديث تكلفة الطلب بنجاح",
      });

      setShowCostDialog(false);
      window.location.reload();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحديث التكلفة",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const updateVendorNotes = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('maintenance_requests')
        .update({ 
          vendor_notes: vendorNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', request.id);

      if (error) throw error;

      // إنشاء حدث دورة حياة
      await addLifecycleEvent(
        request.id,
        request.workflow_stage || request.status,
        'note_added',
        'تم إضافة ملاحظات من الفني',
        { notes_length: vendorNotes.length }
      );

      toast({
        title: "تم تحديث الملاحظات",
        description: "تم تحديث ملاحظات الفني بنجاح",
      });

      setShowVendorDialog(false);
      window.location.reload();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحديث الملاحظات",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteRequest = async () => {
    if (!confirm("هل أنت متأكد من حذف هذا الطلب؟")) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('maintenance_requests')
        .delete()
        .eq('id', request.id);

      if (error) throw error;

      toast({
        title: "تم حذف الطلب",
        description: "تم حذف الطلب بنجاح",
      });

      window.location.reload();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حذف الطلب",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" disabled={isUpdating}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setShowStatusDialog(true)}>
            <Edit className="h-4 w-4 ml-2" />
            تحديث الحالة
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowCostDialog(true)}>
            <DollarSign className="h-4 w-4 ml-2" />
            تحديث التكلفة
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowVendorDialog(true)}>
            <UserCheck className="h-4 w-4 ml-2" />
            ملاحظات الفني
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={deleteRequest}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 ml-2" />
            حذف الطلب
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Status Update Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تحديث حالة الطلب</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>الحالة الحالية</Label>
              <Badge variant="outline" className="mt-1">
                {request.status === 'pending' ? 'في الانتظار' : 
                 request.status === 'in_progress' ? 'قيد التنفيذ' :
                 request.status === 'completed' ? 'مكتمل' : 'ملغي'}
              </Badge>
            </div>
            
            <div>
              <Label htmlFor="status">الحالة الجديدة</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">في الانتظار</SelectItem>
                  <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                  <SelectItem value="completed">مكتمل</SelectItem>
                  <SelectItem value="cancelled">ملغي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowStatusDialog(false)}
                disabled={isUpdating}
              >
                إلغاء
              </Button>
              <Button 
                onClick={updateRequestStatus}
                disabled={isUpdating || newStatus === request.status}
              >
                {isUpdating ? "جاري التحديث..." : "تحديث"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cost Update Dialog */}
      <Dialog open={showCostDialog} onOpenChange={setShowCostDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تحديث التكلفة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="estimated_cost">التكلفة المقدرة (جنيه)</Label>
              <Input
                id="estimated_cost"
                type="number"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                placeholder="0.00"
              />
            </div>
            
            <div>
              <Label htmlFor="actual_cost">التكلفة الفعلية (جنيه)</Label>
              <Input
                id="actual_cost"
                type="number"
                value={actualCost}
                onChange={(e) => setActualCost(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowCostDialog(false)}
                disabled={isUpdating}
              >
                إلغاء
              </Button>
              <Button 
                onClick={updateCost}
                disabled={isUpdating}
              >
                {isUpdating ? "جاري التحديث..." : "تحديث"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Vendor Notes Dialog */}
      <Dialog open={showVendorDialog} onOpenChange={setShowVendorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ملاحظات الفني</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="vendor_notes">الملاحظات</Label>
              <Textarea
                id="vendor_notes"
                value={vendorNotes}
                onChange={(e) => setVendorNotes(e.target.value)}
                placeholder="أضف ملاحظات حول التنفيذ، المشاكل، أو التوصيات..."
                rows={4}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowVendorDialog(false)}
                disabled={isUpdating}
              >
                إلغاء
              </Button>
              <Button 
                onClick={updateVendorNotes}
                disabled={isUpdating}
              >
                {isUpdating ? "جاري الحفظ..." : "حفظ"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}