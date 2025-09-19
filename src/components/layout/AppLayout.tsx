import { useState, useEffect, useCallback } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // تحديد حجم الشاشة
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // إغلاق الـ sidebar عند الضغط على Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  // منع التمرير عندما يكون الـ sidebar مفتوحاً على الهاتف
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, sidebarOpen]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleOverlayClick = useCallback(() => {
    if (isMobile) {
      closeSidebar();
    }
  }, [isMobile, closeSidebar]);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar - Desktop */}
        <div 
          className={cn(
            "hidden lg:block transition-all duration-300 ease-in-out",
            sidebarOpen ? "w-64" : "w-0"
          )}
        >
          <div className={cn(
            "fixed top-0 right-0 h-full w-64 bg-card border-l border-border shadow-lg transition-transform duration-300 ease-in-out z-30",
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          )}>
            <Sidebar 
              isOpen={sidebarOpen} 
              onClose={closeSidebar}
              isMobile={false}
            />
          </div>
        </div>

        {/* Sidebar - Mobile */}
        {isMobile && (
          <>
            <div className={cn(
              "fixed top-0 right-0 h-full w-64 bg-card border-l border-border shadow-lg transition-transform duration-300 ease-in-out z-50",
              sidebarOpen ? "translate-x-0" : "translate-x-full"
            )}>
              <Sidebar 
                isOpen={sidebarOpen} 
                onClose={closeSidebar}
                isMobile={true}
              />
            </div>
            
            {/* Overlay للهاتف المحمول */}
            {sidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
                onClick={handleOverlayClick}
                aria-hidden="true"
              />
            )}
          </>
        )}
        
        {/* Main Content */}
        <div className="flex-1 transition-all duration-300 ease-in-out">
          {/* Header */}
          <Header 
            onMenuToggle={toggleSidebar}
            sidebarOpen={sidebarOpen}
          />
          
          {/* Page Content */}
          <main 
            className="p-3 sm:p-4 lg:p-6 min-h-[calc(100vh-4rem)]"
            role="main"
            aria-label="المحتوى الرئيسي"
          >
            {children}
          </main>
        </div>       
      </div>
      {/* ChatBot */}
     <ChatBot />       
    </div>
  );
}
