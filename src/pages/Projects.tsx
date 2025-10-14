import { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Building2, Calendar, MapPin, TrendingUp, Users, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const { projects, loading } = useProjects();
  const navigate = useNavigate();

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
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">المشروعات المعمارية</h1>
          <p className="text-muted-foreground mt-2">تابع مشروعاتك المعمارية بكل سهولة</p>
        </div>
        <Button onClick={() => navigate('/projects/new')}>
          <Plus className="ml-2 h-4 w-4" />
          مشروع جديد
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد مشروعات بعد</h3>
            <p className="text-muted-foreground mb-4">ابدأ بإضافة مشروعك الأول</p>
            <Button onClick={() => navigate('/projects/new')}>
              <Plus className="ml-2 h-4 w-4" />
              إضافة مشروع
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{project.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.description || 'لا يوجد وصف'}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusLabel(project.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">التقدم</span>
                    <span className="font-semibold">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{project.client_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{project.location}</span>
                  </div>
                  {project.start_date && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(project.start_date).toLocaleDateString('ar-EG')}</span>
                    </div>
                  )}
                  {project.budget && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span>{project.budget.toLocaleString('ar-EG')} جنيه</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
