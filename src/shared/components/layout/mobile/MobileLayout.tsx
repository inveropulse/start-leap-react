import {
  Sheet,
  SheetTitle,
  SheetTrigger,
  SheetContent,
} from "@/shared/components/ui/sheet";
import { UserMenu } from "../UserMenu";
import { cn } from "@/shared/utils/cn";
import { useLocation } from "react-router-dom";
import { getPortalByType } from "@/routes/registry";
import { PropsWithChildren, useState } from "react";
import { MobileNavigation } from "./MobileNavigation";
import { useAuth } from "@/shared/services/auth/hooks";
import { Button } from "@/shared/components/ui/button";
import { usePortalTheme } from "@/shared/hooks/usePortalTheme";
import { Bell as BellIcon, Menu as MenuIcon } from "lucide-react";
import { VisuallyHidden } from "@/shared/components/ui/visually-hidden";

export default function MobileLayout(props: PropsWithChildren) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentPortal } = useAuth();
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
  const routes = getPortalByType(currentPortal).routes;
  const currentRoute = routes.filter((route) => isActive(route.path))[0];

  return (
    <div
      className={cn("min-h-screen w-full flex flex-col", theme.backgroundClass)}
    >
      {/* Mobile Header */}
      <header
        className={cn(
          "sticky top-0 z-50 flex py-3 shrink-0 items-center justify-between px-4 border-b",
          theme.gradientClass,
          "text-white"
        )}
      >
        <div className="flex items-center gap-3">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
              >
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="p-0 w-72"
              aria-describedby="navigation-menu-description"
            >
              <VisuallyHidden>
                <SheetTitle>Navigation Menu</SheetTitle>
                <div id="navigation-menu-description">
                  Use the navigation menu to explore different sections of the
                  portal.
                </div>
              </VisuallyHidden>
              <MobileNavigation
                portal={currentPortal}
                onNavigate={() => setMobileMenuOpen(false)}
              />
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-semibold text-white">
            {currentRoute?.meta.title || theme.name}
          </h1>
        </div>

        {/* Mobile Header Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
          >
            <BellIcon className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>

          <UserMenu />
        </div>
      </header>

      {/* Mobile Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-4">
        {props.children}
      </main>
    </div>
  );
}
