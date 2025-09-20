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
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={handleSidebarClose}
        />
      )}
      
      {/* Layout container */}
      <div className="flex min-h-screen w-full">
        {/* Sidebar - Fixed positioning for consistent behavior */}
        <div className={`fixed top-0 right-0 h-full z-50 transform transition-transform duration-300 ease-in-out lg:transform-none lg:relative lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}>
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={handleSidebarClose}
          />
        </div>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0 lg:mr-64">
          {/* Header - Sticky positioning */}
          <div className="sticky top-0 z-30 bg-background border-b border-border">
            <Header onMenuToggle={handleMenuToggle} />
          </div>
          
          {/* Page content with proper spacing */}
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
      
      {/* ChatBot - Fixed positioning */}
      <div className="fixed bottom-4 left-4 z-40">
        <ChatBot />
      </div>
    </div>
  );
}