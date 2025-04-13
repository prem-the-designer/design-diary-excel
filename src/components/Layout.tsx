
import React from "react";
import { FileDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
  onExport?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onExport }) => {
  const isMobile = useIsMobile();
  const { signOut } = useAuth();
  
  return (
    <div className="min-h-screen w-full">
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-3">
          <h1 className="text-xl md:text-2xl font-bold text-design-blue">Design Task Diary</h1>
          <div className="flex items-center gap-2">
            {onExport && (
              <Button 
                variant="outline" 
                onClick={onExport}
                className="flex items-center gap-2"
                size={isMobile ? "sm" : "default"}
              >
                <FileDown size={isMobile ? 16 : 18} />
                Export to Excel
              </Button>
            )}
            <Button 
              variant="ghost" 
              onClick={signOut}
              className="flex items-center gap-2"
              size={isMobile ? "sm" : "default"}
            >
              <LogOut size={isMobile ? 16 : 18} />
              {!isMobile && "Logout"}
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 md:py-8">
        {children}
      </main>
      
      <footer className="bg-white border-t border-border py-4 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          Design Task Diary © {new Date().getFullYear()} - Built for Product Designers
        </div>
      </footer>
    </div>
  );
};

export default Layout;
