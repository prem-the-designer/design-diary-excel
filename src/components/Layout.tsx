
import React from "react";
import { FileExport } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
  onExport: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onExport }) => {
  return (
    <div className="min-h-screen bg-design-lightgray">
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-design-blue">Design Task Diary</h1>
          <Button 
            variant="outline" 
            onClick={onExport}
            className="flex items-center gap-2"
          >
            <FileExport size={18} />
            Export to Excel
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
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
