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
        "fixed top-0 right-0 z-50 h-full w-64 bg-card border-l border-border transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:z-auto",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border lg:hidden">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">A</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-primary">azab.services</h2>
                <p className="text-xs text-muted-foreground">نظام الصيانة</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <Button
                  key={index}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-12 text-right",
                    isActive && "bg-primary text-primary-foreground"
                  )}
                  asChild
                >
                  <Link to={item.href} onClick={onClose}>
                    <item.icon className="h-5 w-5" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </Button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="text-center text-xs text-muted-foreground">
              <p>الإصدار 2.0.0</p>
              <p>© 2025 azab.services</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};