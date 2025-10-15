import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Building2, MapPin, Calendar, Eye } from "lucide-react";
import { Project } from "@/hooks/useProjects";
import { useNavigate } from "react-router-dom";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planning: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      design: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      licensing: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      construction: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      finishing: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      completed: "bg-green-500/20 text-green-300 border-green-500/30",
      maintenance: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      on_hold: "bg-gray-500/20 text-gray-300 border-gray-500/30",
      cancelled: "bg-red-500/20 text-red-300 border-red-500/30",
    };
    return colors[status] || colors.planning;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      planning: "التخطيط",
      design: "التصميم",
      licensing: "الترخيص",
      construction: "قيد التنفيذ",
      finishing: "التشطيب",
      completed: "مكتمل",
      maintenance: "صيانة دورية",
      on_hold: "معلق",
      cancelled: "ملغي",
    };
    return labels[status] || status;
  };

  return (
    <Card 
      className="group overflow-hidden bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 cursor-pointer"
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
        {project.cover_image_url ? (
          <img
            src={project.cover_image_url}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building2 className="h-20 w-20 text-primary/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
        <Badge className={`absolute top-3 right-3 ${getStatusColor(project.status)}`}>
          {getStatusLabel(project.status)}
        </Badge>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-1">
            {project.name}
          </h3>
          {project.code && (
            <p className="text-xs text-muted-foreground">الكود: {project.code}</p>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">العميل:</span>
            <span className="font-medium">{project.client_name}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">الموقع:</span>
            <span className="font-medium line-clamp-1">{project.location}</span>
          </div>

          {project.start_date && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">البداية:</span>
              <span className="font-medium">{new Date(project.start_date).toLocaleDateString('ar-EG')}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">نسبة الإنجاز</span>
            <span className="font-bold text-primary">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        {project.budget && (
          <div className="flex items-center justify-between text-sm pt-2 border-t border-border/50">
            <span className="text-muted-foreground">الميزانية:</span>
            <span className="font-bold text-primary">
              {project.budget.toLocaleString('ar-EG')} جنيه
            </span>
          </div>
        )}

        <div className="pt-2">
          <div className="flex items-center justify-center gap-2 text-sm text-primary group-hover:text-primary/80 transition-colors">
            <Eye className="h-4 w-4" />
            <span>عرض التفاصيل</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
