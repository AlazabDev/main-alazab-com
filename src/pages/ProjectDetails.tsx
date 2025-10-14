import { useParams } from 'react-router-dom';
import { useProjectDetails } from '@/hooks/useProjects';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Calendar, MapPin, TrendingUp, Users, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { project, phases, updates, loading } = useProjectDetails(id!);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planning: 'bg-blue-500',
      design: 'bg-purple-500',
      licensing: 'bg-yellow-500',
      construction: 'bg-orange-500',
      finishing: 'bg-cyan-500',
      completed: 'bg-green-500',
      on_hold: 'bg-gray-500',
      cancelled: 'bg-red-500',
      pending: 'bg-gray-400',
      in_progress: 'bg-blue-500',
      delayed: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      planning: 'التخطيط',
      design: 'التصميم',
      licensing: 'الترخيص',
      construction: 'البناء',
      finishing: 'التشطيب',
      completed: 'مكتمل',
      on_hold: 'معلق',
      cancelled: 'ملغي',
      pending: 'قيد الانتظار',
      in_progress: 'قيد التنفيذ',
      delayed: 'متأخر',
    };
    return labels[status] || status;
  };

  const getUpdateTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      general: 'عام',
      milestone: 'إنجاز',
      issue: 'مشكلة',
      progress: 'تقدم',
    };
    return labels[type] || type;
  };

  const getUpdateTypeIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'issue':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'progress':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">المشروع غير موجود</h3>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Project Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl mb-2">{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </div>
            <Badge className={getStatusColor(project.status)}>
              {getStatusLabel(project.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">العميل</p>
                <p className="font-semibold">{project.client_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">الموقع</p>
                <p className="font-semibold">{project.location}</p>
              </div>
            </div>
            {project.start_date && (
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">تاريخ البدء</p>
                  <p className="font-semibold">
                    {format(new Date(project.start_date), 'dd MMMM yyyy', { locale: ar })}
                  </p>
                </div>
              </div>
            )}
            {project.budget && (
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">الميزانية</p>
                  <p className="font-semibold">{project.budget.toLocaleString('ar-EG')} جنيه</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">التقدم الإجمالي</span>
              <span className="text-2xl font-bold">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="phases" dir="rtl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="phases">المراحل</TabsTrigger>
          <TabsTrigger value="updates">التحديثات</TabsTrigger>
          <TabsTrigger value="info">معلومات إضافية</TabsTrigger>
        </TabsList>

        <TabsContent value="phases" className="space-y-4">
          {phases.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground">لا توجد مراحل بعد</p>
              </CardContent>
            </Card>
          ) : (
            phases.map((phase, index) => (
              <Card key={phase.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{phase.name}</CardTitle>
                        {phase.description && (
                          <CardDescription>{phase.description}</CardDescription>
                        )}
                      </div>
                    </div>
                    <Badge className={getStatusColor(phase.status)}>
                      {getStatusLabel(phase.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {phase.start_date && (
                        <div>
                          <p className="text-muted-foreground">تاريخ البدء المخطط</p>
                          <p className="font-semibold">
                            {format(new Date(phase.start_date), 'dd/MM/yyyy')}
                          </p>
                        </div>
                      )}
                      {phase.end_date && (
                        <div>
                          <p className="text-muted-foreground">تاريخ الانتهاء المخطط</p>
                          <p className="font-semibold">
                            {format(new Date(phase.end_date), 'dd/MM/yyyy')}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">التقدم</span>
                        <span className="font-semibold">{phase.progress}%</span>
                      </div>
                      <Progress value={phase.progress} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="updates" className="space-y-4">
          {updates.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground">لا توجد تحديثات بعد</p>
              </CardContent>
            </Card>
          ) : (
            updates.map((update) => (
              <Card key={update.id}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    {getUpdateTypeIcon(update.update_type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-lg">{update.title}</CardTitle>
                        <Badge variant="outline">
                          {getUpdateTypeLabel(update.update_type)}
                        </Badge>
                      </div>
                      {update.description && (
                        <CardDescription>{update.description}</CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                {(update.progress_percentage !== null || update.images?.length) && (
                  <CardContent>
                    {update.progress_percentage !== null && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">نسبة التقدم</span>
                          <span className="font-semibold">{update.progress_percentage}%</span>
                        </div>
                        <Progress value={update.progress_percentage} className="h-2" />
                      </div>
                    )}
                    {update.images && update.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {update.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`تحديث ${idx + 1}`}
                            className="rounded-lg object-cover w-full h-32"
                          />
                        ))}
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground mt-4">
                      {format(new Date(update.created_at), 'dd MMMM yyyy - HH:mm', { locale: ar })}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>معلومات إضافية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.budget && (
                  <div>
                    <p className="text-sm text-muted-foreground">الميزانية المحددة</p>
                    <p className="text-lg font-semibold">
                      {project.budget.toLocaleString('ar-EG')} جنيه
                    </p>
                  </div>
                )}
                {project.actual_cost !== undefined && (
                  <div>
                    <p className="text-sm text-muted-foreground">التكلفة الفعلية</p>
                    <p className="text-lg font-semibold">
                      {project.actual_cost.toLocaleString('ar-EG')} جنيه
                    </p>
                  </div>
                )}
                {project.end_date && (
                  <div>
                    <p className="text-sm text-muted-foreground">تاريخ الانتهاء المتوقع</p>
                    <p className="text-lg font-semibold">
                      {format(new Date(project.end_date), 'dd MMMM yyyy', { locale: ar })}
                    </p>
                  </div>
                )}
                {project.actual_end_date && (
                  <div>
                    <p className="text-sm text-muted-foreground">تاريخ الانتهاء الفعلي</p>
                    <p className="text-lg font-semibold">
                      {format(new Date(project.actual_end_date), 'dd MMMM yyyy', { locale: ar })}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetails;
