import {
  SidebarInset,
  SidebarTrigger,
  SidebarProvider,
} from "@/shared/components/ui/sidebar";
import { Menu } from "../Menu";
import { cn } from "@/shared/utils/cn";
import { PropsWithChildren } from "react";
import { AppSidebar } from "./AppSidebar";
import { Bell as BellIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useAuth } from "@/shared/services/auth/hooks";
import { usePortalTheme } from "@/shared/hooks/usePortalTheme";
import { useLocation } from "react-router-dom";

export default function DesktopLayout(props: PropsWithChildren) {
  const { currentPortal, availablePortals } = useAuth();
  const theme = usePortalTheme(currentPortal);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === `/${currentPortal}`) {
      return (
        location.pathname === `/${currentPortal}` ||
        location.pathname === `/${currentPortal}/`
      );
    }
    return location.pathname.startsWith(path);
  };

  const routes =
    availablePortals.find((portal) => portal.key === currentPortal)?.routes ||
    [];

  const currentRoute = routes.filter((route) => isActive(route.path))[0];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className={cn("min-h-screen w-full flex", theme.backgroundClass)}>
        <AppSidebar portal={currentPortal} />
        <SidebarInset className="flex flex-col overflow-x-hidden">
          {/* Desktop Header - Sticky to top */}
          <header
            className={cn(
              "sticky top-0 z-10 flex py-3 shrink-0 items-center justify-between px-4 border-b",
              theme.gradientClass,
              "text-white"
            )}
          >
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-white">
                  {currentRoute?.meta.title || theme.name}
                </h1>
              </div>
            </div>

            {/* Desktop Header Actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
              >
                <BellIcon className="h-4 w-4" />
                <span className="sr-only">Notifications</span>
              </Button>

              {/* User Menu with Portal Switcher */}
              <Menu />
            </div>
          </header>

          {/* Desktop Main Content - Scrollable with vertical padding */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden py-6">
            {props.children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
