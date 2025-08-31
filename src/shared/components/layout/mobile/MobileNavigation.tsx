import { cn } from "@/shared/utils/cn";
import { Activity } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { PortalType } from "@/shared/services/auth/types";
import { usePortalTheme } from "@/shared/hooks/usePortalTheme";
import { usePortalInfoAndRoutes } from "@/shared/hooks/usePortalInfoAndRoutes";

export interface MobileNavigationProps {
  portal: PortalType;
  onNavigate?: () => void;
}

export function MobileNavigation({
  portal,
  onNavigate,
}: MobileNavigationProps) {
  const location = useLocation();
  const theme = usePortalTheme(portal);
  const { PORTAL_INFO, getPortalRoutes, getPortalQuickActionRoutes } =
    usePortalInfoAndRoutes();

  const isActive = (path: string) => {
    if (path === `/${portal}`) {
      return (
        location.pathname === `/${portal}` ||
        location.pathname === `/${portal}/`
      );
    }
    return location.pathname.startsWith(path);
  };

  const routeItems = getPortalRoutes(portal) || [];
  const quickActions = getPortalQuickActionRoutes(portal) || [];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-4 border-b">
        <div
          className={cn(
            "flex items-center justify-center rounded-md text-white h-10 w-10",
            theme.primaryClass
          )}
        >
          <Activity className="h-6 w-6" />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">Sedation Solutions</span>
          <span className="truncate text-xs text-muted-foreground">
            {PORTAL_INFO[portal].name}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Navigation
          </h2>
          <div className="space-y-1">
            {routeItems.map((item) => (
              <NavLink
                key={item.url}
                to={item.url}
                onClick={onNavigate}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                  isActive(item.url)
                    ? cn("text-white", theme.primaryClass)
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </NavLink>
            ))}
          </div>
        </div>

        {quickActions.length > 0 && (
          <>
            <div className="px-3 py-2 mt-4">
              <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                Quick Actions
              </h2>
              <div className="space-y-1">
                {quickActions.map((action) => (
                  <NavLink
                    key={action.url}
                    to={action.url}
                    onClick={onNavigate}
                    className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <action.icon className="mr-2 h-4 w-4" />
                    {action.title}
                  </NavLink>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
