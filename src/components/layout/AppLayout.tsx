import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ChatBot } from "@/components/chatbot/ChatBot";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        {/* Main Content */}
        <div className="flex-1 lg:mr-64">
          {/* Header - only once for the entire app */}
          <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          
          {/* Page Content - Responsive padding for mobile */}
          <main className="p-3 sm:p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
      
      {/* ChatBot */}
      <ChatBot />
    </div>
  );
}