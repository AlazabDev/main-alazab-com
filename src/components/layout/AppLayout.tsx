import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ChatBot } from "@/components/chatbot/ChatBot";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Mobile overlay when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={handleSidebarClose}
        />
      )}
      
      {/* Layout container */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={handleSidebarClose}
        />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0 lg:mr-64">
          {/* Header */}
          <Header onMenuToggle={handleMenuToggle} />
          
          {/* Page content */}
          <main className="flex-1 p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
      
      {/* ChatBot positioned at bottom right */}
      <ChatBot />
    </div>
  );
}