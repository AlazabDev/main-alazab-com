import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ChatBot } from "@/components/chatbot/ChatBot";

// Main App Layout Component
export function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex w-full" dir="rtl">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={handleSidebarClose}
      />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header onMenuToggle={handleMenuToggle} />
        
        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
        
        {/* ChatBot positioned at bottom right */}
        <ChatBot />
      </div>
    </div>
  );
}