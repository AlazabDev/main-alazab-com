import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface RequestPriorityBadgeProps {
  priority: string;
  className?: string;
}

export function RequestPriorityBadge({ priority, className }: RequestPriorityBadgeProps) {
  const priorityConfig = {
    low: { 
      label: "منخفضة", 
      icon: Info,
      className: "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900 dark:text-blue-100"
    },
    medium: { 
      label: "متوسطة", 
      icon: AlertTriangle,
      className: "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-100"
    },
    high: { 
      label: "عالية", 
      icon: AlertCircle,
      className: "bg-red-100 text-red-700 border-red-300 dark:bg-red-900 dark:text-red-100"
    }
  };

  const config = priorityConfig[priority] || priorityConfig.medium;
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline"
      className={cn(
        "text-xs font-medium gap-1",
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
