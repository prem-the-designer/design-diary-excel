
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FileText, BarChart2, Settings, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

const SideNavigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = React.useState(true);
  
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
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className={`fixed inset-y-0 left-0 z-20 flex h-full ${isExpanded ? 'w-1/4 md:w-1/4 lg:w-1/5' : 'w-auto'} transition-all duration-300`}>
        <Sidebar 
          variant="inset" 
          className={`border-r transition-colors duration-300 w-full ${isExpanded ? 'bg-white' : 'bg-[#20a6e8] text-white'}`}
        >
          <div className="flex justify-end p-2">
            <Toggle 
              pressed={!isExpanded} 
              onPressedChange={() => toggleSidebar()} 
              className={`w-full justify-between px-4 py-2 ${isExpanded ? 'text-gray-800' : 'text-white'}`}
            >
              {isExpanded ? (
                <>
                  <span>Collapse</span>
                  <ChevronLeft className="h-4 w-4" />
                </>
              ) : (
                <>
                  {!isMobile && <span>Expand</span>}
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Toggle>
          </div>
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
        </Sidebar>
        
        {/* Mobile sidebar trigger with hamburger icon */}
        {isMobile && (
          <div className="fixed top-4 left-4 z-30">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="bg-[#20a6e8] text-white p-2 rounded-md hover:bg-[#1a8bc3]">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </SidebarProvider>
  );
};

export default SideNavigation;
