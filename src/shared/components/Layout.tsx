import React, { useState } from "react";
import { useAuth } from "@/shared/services/auth/hooks";
import { PortalType } from "@/shared/services/auth/types";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/shared/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/components/ui/sheet";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/shared/components/ui/button";
import { LogOut, User, Bell, ChevronDown, Menu } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { usePortalTheme } from "@/shared/hooks/usePortalTheme";
import { useIsMobile } from "@/shared/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
  portal: PortalType;
}

export function Layout({ children, portal }: LayoutProps) {
  const { user, logout } = useAuth();
  const theme = usePortalTheme(portal);
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  console.log("Layout rendering for portal:", portal, "with user:", user?.fullName);

  if (isMobile) {
    return (
      <div className={cn("min-h-screen w-full flex flex-col", theme.backgroundClass)}>
        {/* Mobile Header */}
        <header className={cn("sticky top-0 z-50 flex py-3 shrink-0 items-center justify-between px-4 border-b", theme.gradientClass, "text-white")}>
          <div className="flex items-center gap-3">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <AppSidebar portal={portal} />
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-semibold text-white">
              {theme.name}
            </h1>
          </div>

          {/* Mobile Header Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>

            <div className="h-8 w-8 rounded-full bg-white/20 text-white flex items-center justify-center text-sm font-medium">
              {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={logout}
              className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </header>

        {/* Mobile Main Content */}
        <main className="flex-1 overflow-auto py-4 px-4">
          {children}
        </main>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className={cn("min-h-screen w-full flex", theme.backgroundClass)}>
        <AppSidebar portal={portal} />
        <SidebarInset className="flex flex-col">
          {/* Desktop Header - Sticky to top */}
          <header className={cn("sticky top-0 z-10 flex py-3 shrink-0 items-center justify-between px-4 border-b", theme.gradientClass, "text-white")}>
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-white">
                  {theme.name}
                </h1>
              </div>
            </div>

            {/* Desktop Header Actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Notifications</span>
              </Button>

              {/* User Menu */}
              <div className="flex items-center gap-2 pl-2 border-l border-white/20">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-white/20 text-white flex items-center justify-center text-sm font-medium">
                    {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden md:block text-sm">
                    <div className="font-medium text-white">{user?.fullName}</div>
                    <div className="text-xs text-white/70">{user?.email}</div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-white/70" />
                </div>
              </div>

              {/* Logout */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={logout}
                className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          </header>

          {/* Desktop Main Content - Scrollable with vertical padding */}
          <main className="flex-1 overflow-auto py-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}