import { Activity } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { NavLink, useLocation } from "react-router-dom";
import { usePortalTheme } from "@/shared/hooks/usePortalTheme";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { PortalType } from "@/shared/types";
import { getPortalByType } from "@/routes/registry";

export interface AppSidebarProps {
  portal: PortalType;
}

export function AppSidebar({ portal }: AppSidebarProps) {
  const location = useLocation();
  const { state } = useSidebar();
  const theme = usePortalTheme(portal);
  const isCollapsed = state === "collapsed";
  const portalConfig = getPortalByType(portal);
  const routeItems = portalConfig.routes || [];
  const quickActions = portalConfig.quickActions || [];

  const isActive = (path: string) => {
    if (path === `/${portal}`) {
      return (
        location.pathname === `/${portal}` ||
        location.pathname === `/${portal}/`
      );
    }
    return location.pathname.startsWith(path);
  };

  return (
    <TooltipProvider>
      <Sidebar
        variant="inset"
        collapsible="icon"
        style={{ width: "var(--sidebar-width)" }}
      >
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-2">
            <div
              className={cn(
                "flex items-center justify-center rounded-md text-white transition-all duration-300",
                theme.primaryClass,
                isCollapsed ? "h-10 w-10 -ml-3" : "h-8 w-8"
              )}
            >
              <Activity
                className={`transition-all duration-300 ${
                  isCollapsed ? "h-6 w-10" : "h-6 w-6"
                }`}
              />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold text-sidebar-foreground">
                Sedation Solutions
              </span>
              <span className="truncate text-xs text-sidebar-foreground/70">
                {portalConfig.name}
              </span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {routeItems.map((item, key) => (
                  <SidebarMenuItem key={item.path + key}>
                    {isCollapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive(item.path)}
                            className={
                              isActive(item.path)
                                ? cn("text-white", theme.primaryClass)
                                : ""
                            }
                          >
                            <NavLink
                              to={item.path}
                              className="flex items-center gap-2"
                            >
                              <item.meta.icon
                                className={`transition-all duration-300 ${
                                  isCollapsed ? "h-6 w-6" : "h-4 w-4"
                                }`}
                              />
                              <span>{item.meta.title}</span>
                            </NavLink>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{item.meta.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.path)}
                        className={
                          isActive(item.path)
                            ? cn("text-white", theme.primaryClass)
                            : ""
                        }
                      >
                        <NavLink
                          to={item.path}
                          className="flex items-center gap-2"
                        >
                          <item.meta.icon
                            className={`transition-all duration-300 ${
                              isCollapsed ? "h-6 w-6" : "h-4 w-4"
                            }`}
                          />
                          <span>{item.meta.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {quickActions.map((action, key) => (
                  <SidebarMenuItem key={action.path + key}>
                    {isCollapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton asChild>
                            <NavLink
                              to={action.path}
                              className="flex items-center gap-2"
                            >
                              <action.icon
                                className={`transition-all duration-300 ${
                                  isCollapsed ? "h-6 w-6" : "h-4 w-4"
                                }`}
                              />
                              <span>{action.title}</span>
                            </NavLink>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{action.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={action.path}
                          className="flex items-center gap-2"
                        >
                          <action.icon
                            className={`transition-all duration-300 ${
                              isCollapsed ? "h-6 w-6" : "h-4 w-4"
                            }`}
                          />
                          <span>{action.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </TooltipProvider>
  );
}
