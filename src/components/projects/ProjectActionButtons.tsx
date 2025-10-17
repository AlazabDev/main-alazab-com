import { Button } from "@/components/ui/button";
import { ExternalLink, Image as ImageIcon, FileText, View } from "lucide-react";

interface ProjectActionButtonsProps {
  magicplanUrl?: string;
  galleryUrl?: string;
  sketchUrl?: string;
}

export function ProjectActionButtons({ 
  magicplanUrl, 
  galleryUrl, 
  sketchUrl 
}: ProjectActionButtonsProps) {
  const buttons = [
    {
      label: "عرض 3D",
      icon: View,
      url: magicplanUrl,
      gradient: "from-blue-500 to-cyan-500",
      hoverGradient: "from-blue-600 to-cyan-600",
    },
    {
      label: "معرض الصور",
      icon: ImageIcon,
      url: galleryUrl,
      gradient: "from-purple-500 to-pink-500",
      hoverGradient: "from-purple-600 to-pink-600",
    },
    {
      label: "المخطط 2D",
      icon: FileText,
      url: sketchUrl,
      gradient: "from-orange-500 to-red-500",
      hoverGradient: "from-orange-600 to-red-600",
    },
  ];

  return (
    <div className="flex gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
      {buttons.map((button) => {
        if (!button.url) return null;
        
        const Icon = button.icon;
        
        return (
          <Button
            key={button.label}
            variant="outline"
            size="sm"
            className={`group relative overflow-hidden border-0 bg-gradient-to-r ${button.gradient} text-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300`}
            asChild
          >
            <a
              href={button.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${button.hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <Icon className="h-4 w-4 relative z-10" />
              <span className="relative z-10 font-medium">{button.label}</span>
              <ExternalLink className="h-3 w-3 relative z-10 opacity-70" />
            </a>
          </Button>
        );
      })}
    </div>
  );
}
