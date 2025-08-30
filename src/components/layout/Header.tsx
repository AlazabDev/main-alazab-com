import { Bell, Settings, User, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { useNotifications } from "@/hooks/useMaintenanceRequests";

interface HeaderProps {
  onMenuToggle?: () => void;
}

export const Header = ({ onMenuToggle }: HeaderProps) => {
  const { toast } = useToast();
  // const { notifications, unreadCount, markAsRead } = useNotifications();
  const notifications: any[] = [];
  const unreadCount = 0;
  const markAsRead = (id: string) => {};

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "تم تسجيل الخروج",
        description: "نراك قريباً",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تسجيل الخروج",
        variant: "destructive",
      });
    }
  };
  return (
    <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Logo and Menu */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">A</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-primary">azab.services</h1>
            <p className="text-xs text-muted-foreground">نظام إدارة طلبات الصيانة</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>الإشعارات</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              notifications.slice(0, 5).map((notification) => (
                <DropdownMenuItem 
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={notification.is_read ? 'opacity-60' : ''}
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem>
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">لا توجد إشعارات</p>
                </div>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">محمد عزب</p>
                <p className="text-xs text-muted-foreground">مسؤول الشركة</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>حسابي</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>الملف الشخصي</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>الإعدادات</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>تسجيل الخروج</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};