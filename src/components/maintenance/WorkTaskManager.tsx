import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  CheckCircle, 
  Clock, 
  User, 
  Calendar,
  Play,
  Pause,
  Square
} from "lucide-react";
import { WorkTask } from "@/hooks/useRequestLifecycle";

interface WorkTaskManagerProps {
  requestId: string;
  tasks: WorkTask[];
  onCreateTask: (task: Partial<WorkTask>) => Promise<WorkTask>;
  onUpdateTask: (taskId: string, updates: Partial<WorkTask>) => Promise<WorkTask>;
}

export function WorkTaskManager({ 
  requestId, 
  tasks, 
  onCreateTask, 
  onUpdateTask 
}: WorkTaskManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newTask, setNewTask] = useState({
    task_name: '',
    description: '',
    estimated_duration: '',
    materials_needed: ''
  });

  const getStatusColor = (status: string) => {
    const colors = {
      'pending': 'bg-muted text-muted-foreground',
      'in_progress': 'bg-amber-100 text-amber-800',
      'completed': 'bg-green-100 text-green-800',
      'blocked': 'bg-red-100 text-red-800',
      'on_hold': 'bg-orange-100 text-orange-800'
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in_progress': return Play;
      case 'on_hold': return Pause;
      case 'blocked': return Square;
      default: return Clock;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'pending': 'في الانتظار',
      'in_progress': 'قيد التنفيذ',
      'completed': 'مكتمل',
      'blocked': 'معطل',
      'on_hold': 'متوقف مؤقتاً'
    };
    return labels[status] || status;
  };

  const handleCreateTask = async () => {
    try {
      const materialsArray = newTask.materials_needed 
        ? newTask.materials_needed.split(',').map(item => item.trim()).filter(Boolean)
        : [];

      await onCreateTask({
        request_id: requestId,
        task_name: newTask.task_name,
        description: newTask.description,
        estimated_duration: newTask.estimated_duration ? parseInt(newTask.estimated_duration) : undefined,
        materials_needed: materialsArray,
        sort_order: tasks.length
      });

      setNewTask({
        task_name: '',
        description: '',
        estimated_duration: '',
        materials_needed: ''
      });
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const updates: Partial<WorkTask> = { status: newStatus };
      
      if (newStatus === 'completed') {
        updates.completed_at = new Date().toISOString();
      }

      await onUpdateTask(taskId, updates);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const getTaskProgress = () => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    return (completedTasks / tasks.length) * 100;
  };

  const getTotalEstimatedTime = () => {
    return tasks.reduce((total, task) => total + (task.estimated_duration || 0), 0);
  };

  const getTotalActualTime = () => {
    return tasks.reduce((total, task) => total + (task.actual_duration || 0), 0);
  };

  return (
    <div className="space-y-6">
      {/* Task Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي المهام</p>
                <p className="text-2xl font-bold">{tasks.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">التقدم</p>
                <p className="text-2xl font-bold">{Math.round(getTaskProgress())}%</p>
              </div>
              <Progress value={getTaskProgress()} className="w-16 h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">الوقت المقدر</p>
                <p className="text-2xl font-bold">{getTotalEstimatedTime()}د</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>مهام العمل</CardTitle>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                إضافة مهمة
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة مهمة عمل جديدة</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="task_name">اسم المهمة</Label>
                  <Input
                    id="task_name"
                    value={newTask.task_name}
                    onChange={(e) => setNewTask({ ...newTask, task_name: e.target.value })}
                    placeholder="أدخل اسم المهمة"
                  />
                </div>
                <div>
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="وصف تفصيلي للمهمة"
                  />
                </div>
                <div>
                  <Label htmlFor="estimated_duration">الوقت المقدر (بالدقائق)</Label>
                  <Input
                    id="estimated_duration"
                    type="number"
                    value={newTask.estimated_duration}
                    onChange={(e) => setNewTask({ ...newTask, estimated_duration: e.target.value })}
                    placeholder="60"
                  />
                </div>
                <div>
                  <Label htmlFor="materials_needed">المواد المطلوبة (مفصولة بفواصل)</Label>
                  <Input
                    id="materials_needed"
                    value={newTask.materials_needed}
                    onChange={(e) => setNewTask({ ...newTask, materials_needed: e.target.value })}
                    placeholder="مفتاح، براغي، لحام"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleCreateTask} className="flex-1">
                    إنشاء المهمة
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreating(false)}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="p-0">
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">لا توجد مهام عمل بعد</p>
            </div>
          ) : (
            <div className="space-y-4 p-6">
              {tasks.map((task) => {
                const StatusIcon = getStatusIcon(task.status);
                return (
                  <Card key={task.id} className="border-l-4 border-l-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground mb-1">
                            {task.task_name}
                          </h4>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(task.status)}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {getStatusLabel(task.status)}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-3">
                        {task.estimated_duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.estimated_duration}د مقدر
                          </div>
                        )}
                        {task.actual_duration && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {task.actual_duration}د فعلي
                          </div>
                        )}
                        {task.assigned_to && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            مخصص
                          </div>
                        )}
                      </div>

                      {task.materials_needed && task.materials_needed.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-muted-foreground mb-1">المواد المطلوبة:</p>
                          <div className="flex flex-wrap gap-1">
                            {task.materials_needed.map((material, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {material}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Select
                          value={task.status}
                          onValueChange={(value) => handleStatusChange(task.id, value)}
                        >
                          <SelectTrigger className="w-40 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">في الانتظار</SelectItem>
                            <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                            <SelectItem value="completed">مكتمل</SelectItem>
                            <SelectItem value="on_hold">متوقف مؤقتاً</SelectItem>
                            <SelectItem value="blocked">معطل</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {task.notes && (
                        <div className="mt-3 p-2 bg-muted/50 rounded text-xs">
                          <p className="font-medium text-muted-foreground mb-1">ملاحظات:</p>
                          <p>{task.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}