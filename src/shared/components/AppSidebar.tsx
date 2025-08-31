import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Building2, 
  UserCheck, 
  FileText, 
  Settings, 
  Activity,
  Heart,
  MessageSquare,
  CreditCard,
  User,
  ClipboardList,
  Shield,
  BookOpen,
  Stethoscope
} from "lucide-react";

import { PortalType, UserRole } from "@/shared/services/auth/types";
import { useAuth } from "@/shared/services/auth/hooks";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip";

interface AppSidebarProps {
  portal: PortalType;
}

export function AppSidebar({ portal }: AppSidebarProps) {
  const { user } = useAuth();
  const location = useLocation();
  const { state } = useSidebar();
  
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === `/${portal}`) {
      return location.pathname === `/${portal}` || location.pathname === `/${portal}/`;
    }
    return location.pathname.startsWith(path);
  };

  const navigationItems = {
    [PortalType.INTERNAL]: [
      { title: "Dashboard", url: "/internal", icon: LayoutDashboard },
      { title: "Patients", url: "/internal/patients", icon: Users },
      { title: "Clinics", url: "/internal/clinics", icon: Building2 },
      { title: "Appointments", url: "/internal/appointments", icon: Calendar },
      { title: "Sedationists", url: "/internal/sedationists", icon: UserCheck },
      { title: "Analytics", url: "/internal/analytics", icon: Activity },
      { title: "Reports", url: "/internal/reports", icon: FileText },
      { title: "User Management", url: "/internal/users", icon: Shield },
      { title: "Settings", url: "/internal/settings", icon: Settings },
    ],
    [PortalType.CLINIC]: [
      { title: "Dashboard", url: "/clinic", icon: LayoutDashboard },
      { title: "Today's Schedule", url: "/clinic/schedule", icon: Calendar },
      { title: "Patients", url: "/clinic/patients", icon: Users },
      { title: "Appointments", url: "/clinic/appointments", icon: Calendar },
      { title: "Staff", url: "/clinic/staff", icon: UserCheck },
      { title: "Reports", url: "/clinic/reports", icon: FileText },
      { title: "Settings", url: "/clinic/settings", icon: Settings },
    ],
    [PortalType.PATIENT]: [
      { title: "Dashboard", url: "/patient", icon: LayoutDashboard },
      { title: "My Appointments", url: "/patient/appointments", icon: Calendar },
      { title: "Health Records", url: "/patient/records", icon: Heart },
      { title: "Messages", url: "/patient/messages", icon: MessageSquare },
      { title: "Billing", url: "/patient/billing", icon: CreditCard },
      { title: "Profile", url: "/patient/profile", icon: User },
    ],
    [PortalType.SEDATIONIST]: [
      { title: "Dashboard", url: "/sedationist", icon: LayoutDashboard },
      { title: "My Schedule", url: "/sedationist/schedule", icon: Calendar },
      { title: "Patient Records", url: "/sedationist/patients", icon: Users },
      { title: "Procedure Notes", url: "/sedationist/procedures", icon: ClipboardList },
      { title: "Sedation Monitoring", url: "/sedationist/monitoring", icon: Stethoscope },
      { title: "Certifications", url: "/sedationist/certifications", icon: Shield },
      { title: "Guidelines", url: "/sedationist/guidelines", icon: BookOpen },
    ],
  };

  const items = navigationItems[portal] || [];

  const portalInfo = {
    [PortalType.INTERNAL]: { name: "Sedation Solutions", subtitle: "Internal Portal" },
    [PortalType.CLINIC]: { name: "Sedation Solutions", subtitle: "Clinic Portal" },
    [PortalType.PATIENT]: { name: "Sedation Solutions", subtitle: "Patient Portal" },
    [PortalType.SEDATIONIST]: { name: "Sedation Solutions", subtitle: "Sedationist Portal" },
  };

  return (
    <TooltipProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Activity className={`transition-all duration-300 ${isCollapsed ? 'h-6 w-6' : 'h-4 w-4'}`} />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold text-sidebar-foreground">
                {portalInfo[portal].name}
              </span>
              <span className="truncate text-xs text-sidebar-foreground/70">
                {portalInfo[portal].subtitle}
              </span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {isCollapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton asChild isActive={isActive(item.url)}>
                            <NavLink to={item.url} className="flex items-center gap-2">
                              <item.icon className={`transition-all duration-300 ${isCollapsed ? 'h-6 w-6' : 'h-4 w-4'}`} />
                              <span>{item.title}</span>
                            </NavLink>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{item.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <SidebarMenuButton asChild isActive={isActive(item.url)}>
                        <NavLink to={item.url} className="flex items-center gap-2">
                          <item.icon className={`transition-all duration-300 ${isCollapsed ? 'h-6 w-6' : 'h-4 w-4'}`} />
                          <span>{item.title}</span>
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
                {portal === PortalType.INTERNAL && (
                  <>
                    <SidebarMenuItem>
                      {isCollapsed ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton asChild>
                              <NavLink to="/internal/patients/new" className="flex items-center gap-2">
                                <Users className={`transition-all duration-300 ${isCollapsed ? 'h-6 w-6' : 'h-4 w-4'}`} />
                                <span>Add Patient</span>
                              </NavLink>
                            </SidebarMenuButton>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>Add Patient</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <SidebarMenuButton asChild>
                          <NavLink to="/internal/patients/new" className="flex items-center gap-2">
                            <Users className={`transition-all duration-300 ${isCollapsed ? 'h-6 w-6' : 'h-4 w-4'}`} />
                            <span>Add Patient</span>
                          </NavLink>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      {isCollapsed ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton asChild>
                              <NavLink to="/internal/appointments/new" className="flex items-center gap-2">
                                <Calendar className={`transition-all duration-300 ${isCollapsed ? 'h-6 w-6' : 'h-4 w-4'}`} />
                                <span>New Appointment</span>
                              </NavLink>
                            </SidebarMenuButton>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>New Appointment</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <SidebarMenuButton asChild>
                          <NavLink to="/internal/appointments/new" className="flex items-center gap-2">
                            <Calendar className={`transition-all duration-300 ${isCollapsed ? 'h-6 w-6' : 'h-4 w-4'}`} />
                            <span>New Appointment</span>
                          </NavLink>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  </>
                )}
                
                {portal === PortalType.CLINIC && (
                  <>
                    <SidebarMenuItem>
                      {isCollapsed ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton asChild>
                              <NavLink to="/clinic/appointments/new" className="flex items-center gap-2">
                                <Calendar className={`transition-all duration-300 ${isCollapsed ? 'h-6 w-6' : 'h-4 w-4'}`} />
                                <span>Book Appointment</span>
                              </NavLink>
                            </SidebarMenuButton>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>Book Appointment</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <SidebarMenuButton asChild>
                          <NavLink to="/clinic/appointments/new" className="flex items-center gap-2">
                            <Calendar className={`transition-all duration-300 ${isCollapsed ? 'h-6 w-6' : 'h-4 w-4'}`} />
                            <span>Book Appointment</span>
                          </NavLink>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      {isCollapsed ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton asChild>
                              <NavLink to="/clinic/patients/new" className="flex items-center gap-2">
                                <Users className={`transition-all duration-300 ${isCollapsed ? 'h-6 w-6' : 'h-4 w-4'}`} />
                                <span>New Patient</span>
                              </NavLink>
                            </SidebarMenuButton>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>New Patient</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <SidebarMenuButton asChild>
                          <NavLink to="/clinic/patients/new" className="flex items-center gap-2">
                            <Users className={`transition-all duration-300 ${isCollapsed ? 'h-6 w-6' : 'h-4 w-4'}`} />
                            <span>New Patient</span>
                          </NavLink>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  </>
                )}
                
                {portal === PortalType.PATIENT && (
                  <SidebarMenuItem>
                    {isCollapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton asChild>
                            <NavLink to="/patient/appointments/book" className="flex items-center gap-2">
                              <Calendar className={`transition-all duration-300 ${isCollapsed ? 'h-6 w-6' : 'h-4 w-4'}`} />
                              <span>Book Appointment</span>
                            </NavLink>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>Book Appointment</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <SidebarMenuButton asChild>
                        <NavLink to="/patient/appointments/book" className="flex items-center gap-2">
                          <Calendar className={`transition-all duration-300 ${isCollapsed ? 'h-6 w-6' : 'h-4 w-4'}`} />
                          <span>Book Appointment</span>
                        </NavLink>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                )}
                
                {portal === PortalType.SEDATIONIST && (
                  <SidebarMenuItem>
                    {isCollapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton asChild>
                            <NavLink to="/sedationist/procedures/new" className="flex items-center gap-2">
                              <ClipboardList className={`transition-all duration-300 ${isCollapsed ? 'h-6 w-6' : 'h-4 w-4'}`} />
                              <span>New Procedure</span>
                            </NavLink>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>New Procedure</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <SidebarMenuButton asChild>
                        <NavLink to="/sedationist/procedures/new" className="flex items-center gap-2">
                          <ClipboardList className={`transition-all duration-300 ${isCollapsed ? 'h-6 w-6' : 'h-4 w-4'}`} />
                          <span>New Procedure</span>
                        </NavLink>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </TooltipProvider>
  );
}