import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMaintenanceRequests, WorkflowStage } from "@/hooks/useMaintenanceRequests";
import { useRequestLifecycle } from "@/hooks/useRequestLifecycle";
import { 
  ArrowRight, 
  User, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Pause
} from "lucide-react";

interface RequestWorkflowControlsProps {
  request: any;
}

export function RequestWorkflowControls({ request }: RequestWorkflowControlsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [notes, setNotes] = useState("");
  const { updateRequest } = useMaintenanceRequests();
  const { addLifecycleEvent } = useRequestLifecycle();

  const workflowStages = [
    { value: 'submitted', label: 'مقدم', icon: ArrowRight },
    { value: 'acknowledged', label: 'مستلم ومؤكد', icon: CheckCircle },
    { value: 'assigned', label: 'مخصص لفني', icon: User },
    { value: 'scheduled', label: 'مجدول', icon: Calendar },
    { value: 'in_progress', label: 'قيد التنفيذ', icon: Clock },
    { value: 'inspection', label: 'فحص وتقييم', icon: CheckCircle },
    { value: 'waiting_parts', label: 'انتظار قطع غيار', icon: Pause },
    { value: 'completed', label: 'مكتمل', icon: CheckCircle },
    { value: 'billed', label: 'تم الفوترة', icon: CheckCircle },
    { value: 'paid', label: 'مدفوع', icon: CheckCircle },
    { value: 'closed', label: 'مغلق', icon: CheckCircle },
    { value: 'cancelled', label: 'ملغي', icon: AlertTriangle },
    { value: 'on_hold', label: 'متوقف مؤقتاً', icon: Pause }
  ];

  const getCurrentStage = () => {
    return workflowStages.find(stage => stage.value === (request.workflow_stage || request.status));
  };

  const getNextStages = () => {
    const currentIndex = workflowStages.findIndex(stage => stage.value === (request.workflow_stage || request.status));
    return workflowStages.slice(currentIndex + 1);
  };

  const handleStageChange = async (newStage: WorkflowStage) => {
    setIsUpdating(true);
    try {
      // Update the request
      await updateRequest(request.id, {
        workflow_stage: newStage,
        status: newStage // Also update the main status field
      });

      // Add lifecycle event
      await addLifecycleEvent(
        request.id,
        newStage,
        'status_change',
        notes || undefined,
        { previous_stage: request.workflow_stage || request.status }
      );

      setNotes("");
    } catch (error) {
      console.error('Error updating workflow stage:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const currentStage = getCurrentStage();
  const nextStages = getNextStages();
  const CurrentIcon = currentStage?.icon || ArrowRight;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CurrentIcon className="h-5 w-5" />
          إدارة سير العمل
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Stage */}
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
          <Badge variant="outline" className="bg-primary text-primary-foreground">
            المرحلة الحالية
          </Badge>
          <span className="font-medium">{currentStage?.label}</span>
        </div>

        {/* Stage Transition */}
        {nextStages.length > 0 && (
          <div className="space-y-3">
            <Label>الانتقال للمرحلة التالية:</Label>
            <Select onValueChange={handleStageChange} disabled={isUpdating}>
              <SelectTrigger>
                <SelectValue placeholder="اختر المرحلة التالية" />
              </SelectTrigger>
              <SelectContent>
                {nextStages.map((stage) => {
                  const StageIcon = stage.icon;
                  return (
                    <SelectItem key={stage.value} value={stage.value}>
                      <div className="flex items-center gap-2">
                        <StageIcon className="h-4 w-4" />
                        {stage.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">ملاحظات (اختياري)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="أضف ملاحظات حول تغيير المرحلة..."
            rows={3}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStageChange('on_hold')}
            disabled={isUpdating || request.workflow_stage === 'on_hold'}
          >
            <Pause className="h-4 w-4 mr-1" />
            توقيف مؤقت
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStageChange('cancelled')}
            disabled={isUpdating || ['completed', 'cancelled', 'closed'].includes(request.workflow_stage)}
          >
            <AlertTriangle className="h-4 w-4 mr-1" />
            إلغاء
          </Button>
        </div>

        {/* Follow-up Indicator */}
        {request.follow_up_required && (
          <div className="flex items-center gap-2 p-2 bg-warning/10 border border-warning/20 rounded-md">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <span className="text-sm">يتطلب متابعة</span>
            {request.follow_up_date && (
              <span className="text-xs text-muted-foreground">
                - {new Date(request.follow_up_date).toLocaleDateString('ar-SA')}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}