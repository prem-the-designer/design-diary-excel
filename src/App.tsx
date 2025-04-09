
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import SideNavigation from "./components/SideNavigation";
import { useIsMobile } from "./hooks/use-mobile";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

const AppContent = () => {
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Watch for sidebar expansion/collapse state
  useEffect(() => {
    const handleStorageChange = () => {
      const sidebarState = document.cookie.includes('sidebar:state=true');
      setIsExpanded(sidebarState);
    };
    
    // Initial check
    handleStorageChange();
    
    // Listen for sidebar state changes
    window.addEventListener('storage', handleStorageChange);
    const intervalId = setInterval(handleStorageChange, 500); // Poll for cookie changes
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);
  
  return (
    <div className="flex min-h-screen w-full">
      <SideNavigation />
      <div 
        className={`flex-1 transition-all duration-300 ${
          isMobile 
            ? 'ml-0' 
            : isExpanded 
              ? 'ml-[25%] lg:ml-[20%]' 
              : 'ml-16'
        }`}
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
