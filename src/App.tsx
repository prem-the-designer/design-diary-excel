
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Index from "./pages/Index";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  return (
    <div className="min-h-screen w-full">
      <nav className="w-full" style={{ backgroundColor: '#20a6e8' }}>
        <div className="container mx-auto px-4 py-3 flex space-x-4">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `text-white font-semibold ${isActive ? 'underline' : ''}`
            }
          >
            Home
          </NavLink>
          <NavLink 
            to="/reports" 
            className={({ isActive }) => 
              `text-white font-semibold ${isActive ? 'underline' : ''}`
            }
          >
            Reports
          </NavLink>
          <NavLink 
            to="/settings" 
            className={({ isActive }) => 
              `text-white font-semibold ${isActive ? 'underline' : ''}`
            }
          >
            Settings
          </NavLink>
        </div>
      </nav>
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

