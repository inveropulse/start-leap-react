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
  Stethoscope,
} from "lucide-react";
import { PortalType } from "../services/auth/types";

export const usePortalInfoAndRoutes = () => {
  const getPortalBaseRoute = (portalType: PortalType) =>
    PORTAL_INFO[portalType].route;

  const getPortalRoutes = (portalType: PortalType) => PORTAL_ROUTES[portalType];

  const getPortalQuickActionRoutes = (portalType: PortalType) =>
    PORTAL_QUICK_ACTIONS[portalType];

  return {
    PORTAL_NAVIGATION_ITEMS,
    PORTAL_INFO,
    getPortalBaseRoute,
    getPortalRoutes,
    getPortalQuickActionRoutes,
  };
};

const PORTAL_INFO = {
  [PortalType.INTERNAL]: {
    // name: "Sedation Solutions",
    name: "Internal Portal",
    icon: "🏢",
    route: "/internal",
    summaryDescription: "Administrative and staff portal",
    description:
      "  This is where internal staff can manage operations, view reports, and handle administrative tasks.",
  },
  [PortalType.CLINIC]: {
    name: "Clinic Portal",
    icon: "🏥",
    route: "/clinic",
    summaryDescription: "Clinic management and operations",
    description:
      "Manage clinic operations, appointment scheduling, and patient flow.",
  },
  [PortalType.PATIENT]: {
    name: "Patient Portal",
    icon: "👤",
    route: "/patient",
    summaryDescription: "Your personal health portal",
    description:
      "Access your appointments, medical records, and communicate with your care team.",
  },
  [PortalType.SEDATIONIST]: {
    name: "Sedationist Portal",
    icon: "⚕️",
    route: "/sedationist",
    summaryDescription: "Specialized sedation management",
    description:
      "Manage sedation procedures, monitor patients, and maintain certification records.",
  },
} as const;

const PORTAL_ROUTES = {
  [PortalType.INTERNAL]: [
    {
      title: "Dashboard",
      url: PORTAL_INFO[PortalType.INTERNAL].route,
      icon: LayoutDashboard,
    },
    {
      title: "Patients",
      url: `${PORTAL_INFO[PortalType.INTERNAL].route}/patients`,
      icon: Users,
    },
    {
      title: "Clinics",
      url: `${PORTAL_INFO[PortalType.INTERNAL].route}/clinics`,
      icon: Building2,
    },
    {
      title: "Appointments",
      url: `${PORTAL_INFO[PortalType.INTERNAL].route}/appointments`,
      icon: Calendar,
    },
    {
      title: "Sedationists",
      url: `${PORTAL_INFO[PortalType.INTERNAL].route}/sedationists`,
      icon: UserCheck,
    },
    {
      title: "Analytics",
      url: `${PORTAL_INFO[PortalType.INTERNAL].route}/analytics`,
      icon: Activity,
    },
    {
      title: "Reports",
      url: `${PORTAL_INFO[PortalType.INTERNAL].route}/reports`,
      icon: FileText,
    },
    {
      title: "User Management",
      url: `${PORTAL_INFO[PortalType.INTERNAL].route}/users`,
      icon: Shield,
    },
    {
      title: "Settings",
      url: `${PORTAL_INFO[PortalType.INTERNAL].route}/settings`,
      icon: Settings,
    },
  ],
  [PortalType.CLINIC]: [
    {
      title: "Dashboard",
      url: PORTAL_INFO[PortalType.CLINIC].route,
      icon: LayoutDashboard,
    },
    {
      title: "Today's Schedule",
      url: `${PORTAL_INFO[PortalType.CLINIC].route}/schedule`,
      icon: Calendar,
    },
    {
      title: "Patients",
      url: `${PORTAL_INFO[PortalType.CLINIC].route}/patients`,
      icon: Users,
    },
    {
      title: "Appointments",
      url: `${PORTAL_INFO[PortalType.CLINIC].route}/appointments`,
      icon: Calendar,
    },
    {
      title: "Staff",
      url: `${PORTAL_INFO[PortalType.CLINIC].route}/staff`,
      icon: UserCheck,
    },
    {
      title: "Reports",
      url: `${PORTAL_INFO[PortalType.CLINIC].route}/reports`,
      icon: FileText,
    },
    {
      title: "Settings",
      url: `${PORTAL_INFO[PortalType.CLINIC].route}/settings`,
      icon: Settings,
    },
  ],
  [PortalType.PATIENT]: [
    {
      title: "Dashboard",
      url: PORTAL_INFO[PortalType.PATIENT].route,
      icon: LayoutDashboard,
    },
    {
      title: "My Appointments",
      url: `${PORTAL_INFO[PortalType.PATIENT].route}/appointments`,
      icon: Calendar,
    },
    {
      title: "Health Records",
      url: `${PORTAL_INFO[PortalType.PATIENT].route}/records`,
      icon: Heart,
    },
    {
      title: "Messages",
      url: `${PORTAL_INFO[PortalType.PATIENT].route}/messages`,
      icon: MessageSquare,
    },
    {
      title: "Billing",
      url: `${PORTAL_INFO[PortalType.PATIENT].route}/billing`,
      icon: CreditCard,
    },
    {
      title: "Profile",
      url: `${PORTAL_INFO[PortalType.PATIENT].route}/profile`,
      icon: User,
    },
  ],
  [PortalType.SEDATIONIST]: [
    {
      title: "Dashboard",
      url: PORTAL_INFO[PortalType.SEDATIONIST].route,
      icon: LayoutDashboard,
    },
    {
      title: "My Schedule",
      url: `${PORTAL_INFO[PortalType.SEDATIONIST].route}/schedule`,
      icon: Calendar,
    },
    {
      title: "Patient Records",
      url: `${PORTAL_INFO[PortalType.SEDATIONIST].route}/patients`,
      icon: Users,
    },
    {
      title: "Procedure Notes",
      url: `${PORTAL_INFO[PortalType.SEDATIONIST].route}/procedures`,
      icon: ClipboardList,
    },
    {
      title: "Sedation Monitoring",
      url: `${PORTAL_INFO[PortalType.SEDATIONIST].route}/monitoring`,
      icon: Stethoscope,
    },
    {
      title: "Certifications",
      url: `${PORTAL_INFO[PortalType.SEDATIONIST].route}/certifications`,
      icon: Shield,
    },
    {
      title: "Guidelines",
      url: `${PORTAL_INFO[PortalType.SEDATIONIST].route}/guidelines`,
      icon: BookOpen,
    },
  ],
} as const;

const PORTAL_QUICK_ACTIONS = {
  [PortalType.INTERNAL]: [
    {
      title: "Add Patient",
      url: `${PORTAL_INFO[PortalType.INTERNAL].route}/patients/new`,
      icon: Users,
    },
    {
      title: "New Appointment",
      url: `${PORTAL_INFO[PortalType.INTERNAL].route}/appointments/new`,
      icon: Calendar,
    },
  ],
  [PortalType.CLINIC]: [
    {
      title: "Book Appointment",
      url: "/clinic/appointments/new",
      icon: Calendar,
    },
    {
      title: "New Patient",
      url: `${PORTAL_INFO[PortalType.CLINIC].route}/patients/new`,
      icon: Users,
    },
  ],
  [PortalType.PATIENT]: [
    {
      title: "Book Appointment",
      url: `${PORTAL_INFO[PortalType.PATIENT].route}/appointments/book`,
      icon: Calendar,
    },
  ],
  [PortalType.SEDATIONIST]: [
    {
      title: "New Procedure",
      url: `${PORTAL_INFO[PortalType.SEDATIONIST].route}/procedures/new`,
      icon: ClipboardList,
    },
  ],
} as const;

export type QuickActionType =
  (typeof PORTAL_QUICK_ACTIONS)[keyof typeof PORTAL_QUICK_ACTIONS][number];

const PORTAL_NAVIGATION_ITEMS = {
  [PortalType.CLINIC]: {
    routes: PORTAL_ROUTES[PortalType.CLINIC],
    quickActions: PORTAL_QUICK_ACTIONS[PortalType.CLINIC],
  },
  [PortalType.INTERNAL]: {
    routes: PORTAL_ROUTES[PortalType.INTERNAL],
    quickActions: PORTAL_QUICK_ACTIONS[PortalType.INTERNAL],
  },
  [PortalType.PATIENT]: {
    routes: PORTAL_ROUTES[PortalType.PATIENT],
    quickActions: PORTAL_QUICK_ACTIONS[PortalType.PATIENT],
  },
  [PortalType.SEDATIONIST]: {
    routes: PORTAL_ROUTES[PortalType.SEDATIONIST],
    quickActions: PORTAL_QUICK_ACTIONS[PortalType.SEDATIONIST],
  },
} as const;
