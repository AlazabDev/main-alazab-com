import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthWrapper } from "@/components/auth/AuthWrapper";
import Index from "./pages/Index";
import Requests from "./pages/Requests";
import Vendors from "./pages/Vendors";
import Reports from "./pages/Reports";
import Properties from "./pages/Properties";
import Appointments from "./pages/Appointments";
import Invoices from "./pages/Invoices";
import Map from "./pages/Map";
import Documentation from "./pages/Documentation";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthWrapper>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/requests" element={<Requests />} />
                <Route path="/vendors" element={<Vendors />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/map" element={<Map />} />
                <Route path="/documentation" element={<Documentation />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </AuthWrapper>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
