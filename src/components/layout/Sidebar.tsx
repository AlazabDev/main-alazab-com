import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  ClipboardList,
  BarChart3,
  Users,
  MapPin,
  FileText,
  Settings,
  Building2,
  Calendar,
  DollarSign
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const menuItems = [
  {
    icon: Home,
    label: "الرئيسية",
    href: "/"
  },
  {
    icon: ClipboardList,
    label: "طلبات الصيانة",
    href: "/requests",
    badge: "2"
  },
  {
    icon: Users,
    label: "الموردين والفنيين",
    href: "/vendors"
  },
  {
    icon: BarChart3,
    label: "التقارير والإحصائيات",
    href: "/reports"
  },
  {
    icon: Building2,
    label: "العقارات",
    href: "/properties"
  },
  {
    icon: Calendar,
    label: "المواعيد",
    href: "/appointments"
  },
  {
    icon: DollarSign,
    label: "الفواتير",
    href: "/invoices"
  },
  {
    icon: MapPin,
    label: "الخريطة",
    href: "/map"
  },
  {
    icon: FileText,
    label: "التوثيق",
    href: "/documentation"
  },
  {
    icon: Settings,
    label: "الإعدادات",
    href: "/settings"
  }
];

export const Sidebar = ({ isOpen = true, onClose }: SidebarProps) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 right-0 z-50 h-full w-80 sm:w-64 bg-card border-l border-border transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:z-auto lg:block",
        isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-border lg:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">A</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-primary">azab.services</h2>
                  <p className="text-xs text-muted-foreground">نظام الصيانة</p>
                </div>
              </div>
              {/* Close button for mobile */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="lg:hidden"
              >
                ×
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <Button
                  key={index}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-12 sm:h-12 text-right text-sm sm:text-base transition-colors",
                    isActive && "bg-primary text-primary-foreground shadow-sm",
                    !isActive && "hover:bg-muted/50"
                  )}
                  asChild
                >
                  <Link to={item.href} onClick={onClose}>
                    <item.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span className="flex-1 text-right">{item.label}</span>
                    {item.badge && (
                      <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full min-w-[1.5rem] text-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </Button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 sm:p-4 border-t border-border">
            <div className="text-center text-xs text-muted-foreground space-y-1">
              <p>الإصدار 2.0.0 📱</p>
              <p>© 2025 azab.services</p>
              <p className="text-[10px] opacity-75">مُحسن للهواتف المحمولة</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};