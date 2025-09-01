import {
  Users,
  Shield,
  Settings,
  Calendar,
  FileText,
  Activity,
  Building2,
  UserCheck,
  LayoutDashboard,
} from "lucide-react";
import { buildUrl } from "@/shared/utils/url";
import { AppRoute, PortalConfig } from "./types";
import { PortalType, UserRole } from "@/shared/types";
import InternalPortal from "@/app/internal/InternalPortal";

const Clinics = <div />;
const Appointments = <div />;
const Sedationists = <div />;
const Analytics = <div />;
const Reports = <div />;
const UsersMgmt = <div />;
const SettingsScreen = <div />;

const INTERNAL_BASE_PATH = "/internal" as const;

const INTERNAL_ROUTES: AppRoute[] = [
  {
    index: true,
    path: buildUrl(INTERNAL_BASE_PATH),
    element: <InternalPortal />,
    meta: { title: "Dashboard", enabled: true, icon: LayoutDashboard },
  },
  {
    element: <div>Internal Patients Page</div>,
    path: buildUrl(INTERNAL_BASE_PATH, "patients"),
    meta: { title: "Patients", enabled: true, icon: Users },
  },
  {
    element: Clinics,
    path: buildUrl(INTERNAL_BASE_PATH, "clinics"),
    meta: { title: "Clinics", enabled: true, icon: Building2 },
  },
  {
    element: Appointments,
    path: buildUrl(INTERNAL_BASE_PATH, "appointments"),
    meta: { title: "Appointments", enabled: true, icon: Calendar },
  },
  {
    element: Sedationists,
    path: buildUrl(INTERNAL_BASE_PATH, "sedationists"),
    meta: { title: "Sedationists", enabled: true, icon: UserCheck },
  },
  {
    element: Analytics,
    path: buildUrl(INTERNAL_BASE_PATH, "analytics"),
    meta: { title: "Analytics", enabled: true, icon: Activity },
  },
  {
    path: buildUrl(INTERNAL_BASE_PATH, "reports"),
    element: Reports,
    meta: { title: "Reports", enabled: true, icon: FileText },
  },
  {
    element: UsersMgmt,
    path: buildUrl(INTERNAL_BASE_PATH, "users"),
    meta: { title: "User Management", enabled: true, icon: Shield },
  },
  {
    element: SettingsScreen,
    path: buildUrl(INTERNAL_BASE_PATH, "settings"),
    meta: { title: "Settings", enabled: true, icon: Settings },
  },
] as const;

export const INTERNAL_PORTAL: PortalConfig = {
  key: PortalType.INTERNAL,
  name: "Internal Portal",
  icon: "🏢",
  basePath: INTERNAL_BASE_PATH,
  roles: [UserRole.ADMIN, UserRole.BOOKING_COORDINATOR],
  summaryDescription: "Administrative and staff portal",
  description:
    "This is where internal staff can manage operations, view reports, and handle administrative tasks.",
  enabled: true,
  isAuthRequired: true,
  routes: INTERNAL_ROUTES,
  quickActions: [
    {
      title: "Add Patient",
      path: buildUrl(INTERNAL_BASE_PATH, "patients/new"),
      icon: Users,
      enabled: true,
    },
    {
      title: "New Appointment",
      path: buildUrl(INTERNAL_BASE_PATH, "appointments/new"),
      icon: Calendar,
      enabled: true,
    },
  ] as const,
} as const;
