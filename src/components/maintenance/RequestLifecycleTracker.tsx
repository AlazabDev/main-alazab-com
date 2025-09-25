import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Calendar,
  MessageSquare,
  Star,
  Settings,
  Timer,
  Wrench
} from "lucide-react";
import { useRequestLifecycle } from "@/hooks/useRequestLifecycle";
import { WorkTaskManager } from "./WorkTaskManager";
import { RequestReviewForm } from "./RequestReviewForm";

interface RequestLifecycleTrackerProps {
  requestId: string;
  requestStatus: string;
  requestTitle: string;
}

export function RequestLifecycleTracker({ 
  requestId, 
  requestStatus, 
  requestTitle 
}: RequestLifecycleTrackerProps) {
  const [selectedTab, setSelectedTab] = useState("timeline");
  const { 
    lifecycleEvents, 
    workTasks, 
    reviews, 
    loading, 
    error,
    addLifecycleEvent,
    createWorkTask,
    updateWorkTask,
    submitReview
  } = useRequestLifecycle(requestId);

  const statusStages = [
    { key: 'submitted', label: 'مقدم', icon: MessageSquare },
    { key: 'acknowledged', label: 'مستلم', icon: CheckCircle },
    { key: 'assigned', label: 'مخصص', icon: User },
    { key: 'scheduled', label: 'مجدول', icon: Calendar },
    { key: 'in_progress', label: 'قيد التنفيذ', icon: Wrench },
    { key: 'inspection', label: 'فحص', icon: Settings },
    { key: 'completed', label: 'مكتمل', icon: CheckCircle },
    { key: 'closed', label: 'مغلق', icon: CheckCircle }
  ];

  const getCurrentStageIndex = () => {
    return statusStages.findIndex(stage => stage.key === requestStatus);
  };

  const getProgressPercentage = () => {
    const currentIndex = getCurrentStageIndex();
    return currentIndex >= 0 ? ((currentIndex + 1) / statusStages.length) * 100 : 0;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'draft': 'bg-muted text-muted-foreground',
      'submitted': 'bg-blue-100 text-blue-800',
      'acknowledged': 'bg-cyan-100 text-cyan-800',
      'assigned': 'bg-purple-100 text-purple-800',
      'scheduled': 'bg-orange-100 text-orange-800',
      'in_progress': 'bg-amber-100 text-amber-800',
      'inspection': 'bg-yellow-100 text-yellow-800',
      'waiting_parts': 'bg-gray-100 text-gray-800',
      'completed': 'bg-green-100 text-green-800',
      'billed': 'bg-indigo-100 text-indigo-800',
      'paid': 'bg-emerald-100 text-emerald-800',
      'closed': 'bg-slate-100 text-slate-800',
      'cancelled': 'bg-red-100 text-red-800',
      'on_hold': 'bg-rose-100 text-rose-800'
    };
    return colors[status] || colors.submitted;
  };

  const formatEventType = (type: string) => {
    const types = {
      'status_change': 'تغيير الحالة',
      'assignment': 'تخصيص فني',
      'scheduling': 'جدولة',
      'cost_estimate': 'تقدير التكلفة',
      'completion': 'إكمال',
      'feedback': 'تعليق',
      'payment': 'دفع',
      'note': 'ملاحظة'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">جاري تحميل دورة الحياة...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-center text-destructive">خطأ في تحميل دورة الحياة: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="card-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            دورة حياة الطلب - {requestTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>التقدم العام</span>
            <span>{Math.round(getProgressPercentage())}%</span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
          
          {/* Status Timeline */}
          <div className="flex flex-wrap gap-2 mt-4">
            {statusStages.map((stage, index) => {
              const isCompleted = index <= getCurrentStageIndex();
              const isCurrent = index === getCurrentStageIndex();
              const IconComponent = stage.icon;
              
              return (
                <div 
                  key={stage.key}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs transition-colors ${
                    isCompleted 
                      ? isCurrent 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-success text-success-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <IconComponent className="h-3 w-3" />
                  {stage.label}
                  {isCompleted && !isCurrent && <CheckCircle className="h-3 w-3 ml-1" />}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tracking */}
      <Card className="card-elegant">
        <CardHeader>
          <CardTitle>تفاصيل المتابعة</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="timeline">الأحداث</TabsTrigger>
              <TabsTrigger value="tasks">المهام</TabsTrigger>
              <TabsTrigger value="reviews">التقييمات</TabsTrigger>
              <TabsTrigger value="sla">SLA</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="p-6">
              <div className="space-y-4">
                {lifecycleEvents.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    لا توجد أحداث مسجلة بعد
                  </p>
                ) : (
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
                    {lifecycleEvents.map((event, index) => (
                      <div key={event.id} className="relative flex gap-4 pb-6">
                        <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background border-2 border-primary">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(event.status)}>
                              {formatEventType(event.update_type)}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(event.created_at).toLocaleString('ar-SA')}
                            </span>
                          </div>
                          {event.update_notes && (
                            <p className="text-sm text-foreground">{event.update_notes}</p>
                          )}
                          {event.metadata && Object.keys(event.metadata).length > 0 && (
                            <details className="text-xs text-muted-foreground">
                              <summary className="cursor-pointer">تفاصيل إضافية</summary>
                              <pre className="mt-1 text-xs bg-muted p-2 rounded">
                                {JSON.stringify(event.metadata, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="p-6">
              <WorkTaskManager 
                requestId={requestId}
                tasks={workTasks}
                onCreateTask={createWorkTask}
                onUpdateTask={updateWorkTask}
              />
            </TabsContent>

            <TabsContent value="reviews" className="p-6">
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">لا توجد تقييمات بعد</p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="gap-2">
                          <Star className="h-4 w-4" />
                          إضافة تقييم
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>تقييم الخدمة</DialogTitle>
                        </DialogHeader>
                        <RequestReviewForm 
                          requestId={requestId}
                          onSubmit={submitReview}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{review.reviewer_type}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.created_at).toLocaleDateString('ar-SA')}
                            </span>
                          </div>
                          {review.overall_rating && (
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${
                                    i < review.overall_rating! 
                                      ? 'text-warning fill-warning' 
                                      : 'text-muted-foreground'
                                  }`} 
                                />
                              ))}
                              <span className="text-sm text-muted-foreground mr-2">
                                {review.overall_rating}/5
                              </span>
                            </div>
                          )}
                          {review.feedback_text && (
                            <p className="text-sm">{review.feedback_text}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="sla" className="p-6">
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-warning" />
                      <h4 className="font-medium">مستوى الخدمة (SLA)</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      سيتم تطوير وعرض معلومات SLA وأوقات الاستجابة هنا
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}