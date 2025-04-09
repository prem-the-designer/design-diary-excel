
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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

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

  const toggleSidebar = () => {
    const newState = !isExpanded;
    document.cookie = `sidebar:state=${newState}; path=/; max-age=${60 * 60 * 24 * 7}`;
    setIsExpanded(newState);
    window.dispatchEvent(new Event('storage'));
  };
  
  return (
    <div className="flex min-h-screen w-full">
      <SideNavigation />
      <div 
        className={`flex-1 transition-all duration-300 ${
          isMobile 
            ? 'ml-0 w-full' 
            : isExpanded 
              ? 'ml-[25%]' 
              : 'ml-[10%]'
        }`}
      >
        {!isMobile && (
          <div className="sticky top-0 z-10 bg-white p-2 border-b">
            <Toggle 
              pressed={!isExpanded} 
              onPressedChange={toggleSidebar} 
              className="flex justify-between items-center px-4 py-2 bg-gray-50 rounded-md"
            >
              {isExpanded ? (
                <>
                  <span>Collapse</span>
                  <ChevronLeft className="h-4 w-4" />
                </>
              ) : (
                <>
                  <span>Expand</span>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Toggle>
          </div>
        )}
        <div className="p-4">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
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
