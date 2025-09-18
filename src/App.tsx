import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthWrapper } from "@/components/auth/AuthWrapper";
import { useProductionOptimizations } from "@/hooks/useProductionOptimizations";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Requests from "./pages/Requests";
import Vendors from "./pages/Vendors";
import Reports from "./pages/Reports";
import Properties from "./pages/Properties";
import Appointments from "./pages/Appointments";
import Invoices from "./pages/Invoices";
import Map from "./pages/Map";
import Documentation from "./pages/Documentation";
import Settings from "./pages/Settings";
import Testing from "./pages/Testing";
import ProductionReport from "./pages/ProductionReport";
import ProductionMonitor from "./pages/ProductionMonitor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 دقائق
      gcTime: 10 * 60 * 1000, // 10 دقائق (cacheTime جديد)
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

const App = () => {
  // تطبيق تحسينات الإنتاج
  useProductionOptimizations();

  return (
    <ErrorBoundary>
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
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <AuthWrapper>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </AuthWrapper>
            } />
            <Route path="/requests" element={
              <AuthWrapper>
                <AppLayout>
                  <Requests />
                </AppLayout>
              </AuthWrapper>
            } />
            <Route path="/vendors" element={
              <AuthWrapper>
                <AppLayout>
                  <Vendors />
                </AppLayout>
              </AuthWrapper>
            } />
            <Route path="/reports" element={
              <AuthWrapper>
                <AppLayout>
                  <Reports />
                </AppLayout>
              </AuthWrapper>
            } />
            <Route path="/properties" element={
              <AuthWrapper>
                <AppLayout>
                  <Properties />
                </AppLayout>
              </AuthWrapper>
            } />
            <Route path="/appointments" element={
              <AuthWrapper>
                <AppLayout>
                  <Appointments />
                </AppLayout>
              </AuthWrapper>
            } />
            <Route path="/invoices" element={
              <AuthWrapper>
                <AppLayout>
                  <Invoices />
                </AppLayout>
              </AuthWrapper>
            } />
            <Route path="/map" element={
              <AuthWrapper>
                <AppLayout>
                  <Map />
                </AppLayout>
              </AuthWrapper>
            } />
            <Route path="/documentation" element={
              <AuthWrapper>
                <AppLayout>
                  <Documentation />
                </AppLayout>
              </AuthWrapper>
            } />
          <Route path="/settings" element={
            <AuthWrapper>
              <AppLayout>
                <Settings />
              </AppLayout>
            </AuthWrapper>
          } />
          <Route path="/testing" element={
            <AuthWrapper>
              <AppLayout>
                <Testing />
              </AppLayout>
            </AuthWrapper>
          } />
          <Route path="/production-report" element={
            <AuthWrapper>
              <AppLayout>
                <ProductionReport />
              </AppLayout>
            </AuthWrapper>
          } />
          <Route path="/production-monitor" element={
            <AuthWrapper>
              <AppLayout>
                <ProductionMonitor />
              </AppLayout>
            </AuthWrapper>
          } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
    </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
