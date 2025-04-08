
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FileText, BarChart2, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

const SideNavigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const navigationItems = [
    {
      section: "Task",
      items: [
        {
          title: "Record Design Task",
          path: "/",
          icon: FileText,
        },
      ],
    },
    {
      section: "Reports",
      items: [
        {
          title: "Task Reports",
          path: "/reports",
          icon: BarChart2,
        },
      ],
    },
    {
      section: "Settings",
      items: [
        {
          title: "Form Settings",
          path: "/settings",
          icon: Settings,
        },
      ],
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full">
        <Sidebar variant="inset" className="border-r">
          <SidebarContent>
            {navigationItems.map((navGroup) => (
              <SidebarGroup key={navGroup.section}>
                <SidebarGroupLabel>{navGroup.section}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navGroup.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive(item.path)}
                          tooltip={item.title}
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
          <div className="fixed top-4 left-4 z-10">
            <SidebarTrigger />
          </div>
        )}
      </div>
    </SidebarProvider>
  );
};

export default SideNavigation;
