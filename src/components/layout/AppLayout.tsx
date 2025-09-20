import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ChatBot } from "@/components/chatbot/ChatBot";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          
          <main className="flex-1 flex flex-col">
            {/* Header with trigger */}
            <header className="h-12 flex items-center border-b border-border px-4 bg-background sticky top-0 z-30">
              <SidebarTrigger className="ml-2" />
              <div className="flex-1 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">A</span>
                  </div>
                  <span className="font-semibold text-foreground">azab.services</span>
                </div>
              </div>
            </header>
            
            {/* Page content */}
            <div className="flex-1 overflow-auto">
              <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
                {children}
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
      
      {/* ChatBot - Fixed positioning */}
      <div className="fixed bottom-4 left-4 z-40">
        <ChatBot />
      </div>
    </div>
  );
}