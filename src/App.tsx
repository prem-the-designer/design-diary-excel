
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Growth from "./pages/Growth";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  return <>{children}</>;
};

const AppContent = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";
  
  return (
    <div className="min-h-screen w-full">
      {!isAuthPage && (
        <nav className="w-full" style={{ backgroundColor: '#20a6e8' }}>
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex space-x-4">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `text-white font-semibold ${isActive ? 'underline' : ''}`
                }
              >
                Activity
              </NavLink>
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => 
                  `text-white font-semibold ${isActive ? 'underline' : ''}`
                }
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/growth" 
                className={({ isActive }) => 
                  `text-white font-semibold ${isActive ? 'underline' : ''}`
                }
              >
                Growth
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
            {user && (
              <div className="flex items-center gap-4">
                <span className="text-white">{user.email}</span>
                <button 
                  onClick={() => signOut()} 
                  className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </nav>
      )}
      <div className={`${isAuthPage ? 'p-0' : 'p-4'}`}>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/growth" element={<ProtectedRoute><Growth /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
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
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
