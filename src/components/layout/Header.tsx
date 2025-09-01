import { Settings, User, Menu, LogOut, Cog } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { NotificationsList } from "@/components/notifications/NotificationsList";

interface HeaderProps {
  onMenuToggle?: () => void;
}

export const Header = ({ onMenuToggle }: HeaderProps) => {
  const { toast } = useToast();

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
    <header className="bg-card/95 backdrop-blur-md border-b border-border/50 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      {/* Logo and Menu */}
      <div className="flex items-center gap-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuToggle}
          className="hover:bg-primary/10 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-3">
          {/* Professional Logo with A and Gear */}
          <div className="relative w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
            <div className="relative">
              <span className="text-primary-foreground font-bold text-lg">A</span>
              <Cog className="absolute -top-1 -right-1 h-3 w-3 text-primary-foreground/80 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary tracking-tight">azab.services</h1>
            <p className="text-xs text-muted-foreground font-medium">نظام إدارة طلبات الصيانة المتطور</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <NotificationsList />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 hover:bg-primary/10 transition-colors p-2 rounded-xl">
              <Avatar className="h-10 w-10 border-2 border-primary/20 shadow-md">
                <AvatarImage 
                  src="/lovable-uploads/fb9d438e-077d-4ce0-997b-709c295e2b35.png" 
                  alt="محمد عزب" 
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-secondary text-secondary-foreground font-semibold">
                  م ع
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-foreground">محمد عزب</p>
                <p className="text-xs text-muted-foreground">مسؤول الشركة</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-right">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">محمد عزب</p>
                <p className="text-xs leading-none text-muted-foreground">
                  m.azab@azab.services
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>الملف الشخصي</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>الإعدادات</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="text-destructive cursor-pointer focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>تسجيل الخروج</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};