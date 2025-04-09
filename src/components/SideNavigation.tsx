
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FileText, BarChart2, Settings, ChevronLeft, ChevronRight } from "lucide-react";
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
      <div className="fixed inset-y-0 left-0 z-20 flex h-full">
        <Sidebar 
          variant="inset" 
          className={`border-r transition-colors duration-300 ${isExpanded ? 'bg-white' : 'bg-[#20a6e8] text-white'}`}
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
                  <span>Expand</span>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Toggle>
          </div>
          <SidebarContent>
            {navigationItems.map(navGroup => (
              <SidebarGroup key={navGroup.section}>
                <SidebarGroupLabel className={isExpanded ? '' : 'text-white opacity-80'}>
                  {navGroup.section}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navGroup.items.map(item => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          isActive={isActive(item.path)} 
                          tooltip={item.title}
                          className={`${!isExpanded && 'hover:bg-[#1a8bc3] text-white'}`}
                        >
                          <Link to={item.path} className="flex items-center">
                            <item.icon className="mr-2 h-4 w-4" />
                            <span>{item.title}</span>
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
        
        {/* Mobile sidebar trigger */}
        {isMobile && (
          <div className="fixed top-4 left-4 z-30">
            <SidebarTrigger />
          </div>
        )}
      </div>
    </SidebarProvider>
  );
};

export default SideNavigation;
