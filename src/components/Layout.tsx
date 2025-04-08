
import React from "react";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
  onExport: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onExport }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-3">
          <h1 className="text-xl md:text-2xl font-bold text-design-blue">Design Task Diary</h1>
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
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-full overflow-x-hidden">
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
