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

import { PortalType } from "@/shared/services/auth/types";
import { usePortalTheme } from "@/shared/hooks/usePortalTheme";
import { cn } from "@/shared/utils/cn";

interface MobileNavigationProps {
  portal: PortalType;
  onNavigate?: () => void;
}

export function MobileNavigation({ portal, onNavigate }: MobileNavigationProps) {
  const location = useLocation();
  const theme = usePortalTheme(portal);

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

  const quickActions = {
    [PortalType.INTERNAL]: [
      { title: "Add Patient", url: "/internal/patients/new", icon: Users },
      { title: "New Appointment", url: "/internal/appointments/new", icon: Calendar },
    ],
    [PortalType.CLINIC]: [
      { title: "Book Appointment", url: "/clinic/appointments/new", icon: Calendar },
      { title: "New Patient", url: "/clinic/patients/new", icon: Users },
    ],
    [PortalType.PATIENT]: [
      { title: "Book Appointment", url: "/patient/appointments/book", icon: Calendar },
    ],
    [PortalType.SEDATIONIST]: [
      { title: "New Procedure", url: "/sedationist/procedures/new", icon: ClipboardList },
    ],
  };

  const actions = quickActions[portal] || [];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-4 border-b">
        <div className={cn(
          "flex items-center justify-center rounded-md text-white h-10 w-10",
          theme.primaryClass
        )}>
          <Activity className="h-6 w-6" />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">
            {portalInfo[portal].name}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {portalInfo[portal].subtitle}
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
            {items.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                onClick={onNavigate}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                  isActive(item.url) ? cn("text-white", theme.primaryClass) : "text-muted-foreground"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </NavLink>
            ))}
          </div>
        </div>

        {actions.length > 0 && (
          <>
            <div className="px-3 py-2 mt-4">
              <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                Quick Actions
              </h2>
              <div className="space-y-1">
                {actions.map((action) => (
                  <NavLink
                    key={action.title}
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