import React from "react";
import { useAuth } from "@/shared/services/auth/hooks";
import { PortalType } from "@/shared/services/auth/types";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/shared/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/shared/components/ui/button";
import { LogOut, User, Bell, ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface LayoutProps {
  children: React.ReactNode;
  portal: PortalType;
}

export function Layout({ children, portal }: LayoutProps) {
  const { user, logout } = useAuth();

  const portalConfig = {
    [PortalType.INTERNAL]: {
      name: "Internal Portal",
      bgClass: "bg-portal-internal-background",
      headerClass: "bg-portal-internal-primary",
    },
    [PortalType.CLINIC]: {
      name: "Clinic Portal", 
      bgClass: "bg-portal-clinic-background",
      headerClass: "bg-portal-clinic-primary",
    },
    [PortalType.PATIENT]: {
      name: "Patient Portal",
      bgClass: "bg-portal-patient-background", 
      headerClass: "bg-portal-patient-primary",
    },
    [PortalType.SEDATIONIST]: {
      name: "Sedationist Portal",
      bgClass: "bg-portal-sedationist-background",
      headerClass: "bg-portal-sedationist-primary",
    },
  };

  const config = portalConfig[portal];

  console.log("Layout rendering for portal:", portal, "with user:", user?.fullName);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen w-full flex bg-background">
        <AppSidebar portal={portal} />
        <SidebarInset>
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center justify-between px-4 border-b bg-background">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">
                  {config.name}
                </h1>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Notifications</span>
              </Button>

              {/* User Menu */}
              <div className="flex items-center gap-2 pl-2 border-l">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden md:block text-sm">
                    <div className="font-medium">{user?.fullName}</div>
                    <div className="text-xs text-muted-foreground">{user?.email}</div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {/* Logout */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={logout}
                className="h-8 w-8"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}