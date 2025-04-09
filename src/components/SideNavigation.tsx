
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FileText, BarChart2, Settings, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Toggle } from "@/components/ui/toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const SideNavigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Set cookie for sidebar state to be used by other components
  useEffect(() => {
    document.cookie = `sidebar:state=${isExpanded}; path=/; max-age=${60 * 60 * 24 * 7}`;
    // Dispatch storage event for other components to detect the change
    window.dispatchEvent(new Event('storage'));
  }, [isExpanded]);
  
  const navigationItems = [{
    section: "Task",
    items: [{
      title: "Record Design Task",
      path: "/",
      icon: FileText
    }]
  }, {
    section: "Reports",
    items: [{
      title: "Task Reports",
      path: "/reports",
      icon: BarChart2
    }]
  }, {
    section: "Settings",
    items: [{
      title: "Form Settings",
      path: "/settings",
      icon: Settings
    }]
  }];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };
  
  // The actual sidebar content (shared between desktop and mobile)
  const SidebarContents = () => (
    <div className={`h-full ${isExpanded ? 'w-full' : 'w-16'} flex flex-col transition-all duration-300`}>
      <SidebarContent>
        {navigationItems.map(navGroup => (
          <SidebarGroup key={navGroup.section}>
            <SidebarGroupLabel className={`${isExpanded ? '' : 'text-white opacity-80'} ${!isExpanded && !isMobile ? 'hidden' : ''}`}>
              {navGroup.section}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navGroup.items.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive(item.path)} 
                      tooltip={!isExpanded ? item.title : undefined}
                      className={`flex items-center ${!isExpanded && 'justify-center'} ${!isExpanded && 'hover:bg-[#1a8bc3] text-white'}`}
                    >
                      <Link to={item.path} className="flex items-center">
                        <item.icon className={`${isExpanded ? 'mr-2' : ''} h-5 w-5`} />
                        {(isExpanded || isMobile) && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </div>
  );

  // For mobile, we'll use Sheet component for better touch interaction
  if (isMobile) {
    return (
      <>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button 
              className="fixed top-4 left-4 z-50 bg-[#20a6e8] text-white p-2 rounded-md hover:bg-[#1a8bc3] focus:outline-none"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className={`p-0 w-3/4 max-w-xs ${isExpanded ? 'bg-white' : 'bg-[#20a6e8] text-white'}`}>
            <div className="flex justify-end p-2 border-b">
              <Toggle 
                pressed={!isExpanded} 
                onPressedChange={toggleSidebar} 
                className={`w-full justify-between px-4 py-2 ${isExpanded ? 'text-gray-800' : 'text-white'}`}
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
            <SidebarContents />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // Desktop sidebar
  return (
    <SidebarProvider defaultOpen={true}>
      <div className={`fixed inset-y-0 left-0 z-20 flex h-full transition-all duration-300 ${isExpanded ? 'w-1/4' : 'w-[10%]'}`}>
        <Sidebar 
          variant="inset" 
          className={`border-r transition-colors duration-300 w-full ${isExpanded ? 'bg-white' : 'bg-[#20a6e8] text-white'}`}
        >
          <SidebarContents />
        </Sidebar>
      </div>
    </SidebarProvider>
  );
};

export default SideNavigation;
