import {
  Users,
  FileText,
  Calendar,
  Settings,
  UserCheck,
  LayoutDashboard,
} from "lucide-react";
import { buildUrl } from "@/shared/utils/url";
import { AppRoute, PortalConfig } from "./types";
import ClinicPortal from "@/app/clinic/ClinicPortal";
import { PortalType, UserRole } from "@/shared/types";

const ClinicDashboard = <ClinicPortal />;
const ClinicSchedule = <div />;
const ClinicPatients = <div />;
const ClinicAppointments = <div />;
const ClinicStaff = <div />;
const ClinicReports = <div />;
const ClinicSettings = <div />;

const CLINIC_BASE_PATH = "/clinic" as const;

const CLINIC_ROUTES: AppRoute[] = [
  {
    index: true,
    element: ClinicDashboard,
    path: buildUrl(CLINIC_BASE_PATH),
    meta: { title: "Dashboard", enabled: true, icon: LayoutDashboard },
  },
  {
    element: ClinicSchedule,
    path: buildUrl(CLINIC_BASE_PATH, "schedule"),
    meta: { title: "Today's Schedule", enabled: true, icon: Calendar },
  },
  {
    element: ClinicPatients,
    path: buildUrl(CLINIC_BASE_PATH, "patients"),
    meta: { title: "Patients", enabled: true, icon: Users },
  },
  {
    element: ClinicAppointments,
    path: buildUrl(CLINIC_BASE_PATH, "appointments"),
    meta: { title: "Appointments", enabled: true, icon: Calendar },
  },
  {
    element: ClinicStaff,
    path: buildUrl(CLINIC_BASE_PATH, "staff"),
    meta: { title: "Staff", enabled: true, icon: UserCheck },
  },
  {
    element: ClinicReports,
    path: buildUrl(CLINIC_BASE_PATH, "reports"),
    meta: { title: "Reports", enabled: true, icon: FileText },
  },
  {
    element: ClinicSettings,
    path: buildUrl(CLINIC_BASE_PATH, "settings"),
    meta: { title: "Settings", enabled: true, icon: Settings },
  },
] as const;

export const CLINIC_PORTAL: PortalConfig = {
  key: PortalType.CLINIC,
  name: "Clinic Portal",
  icon: "🏥",
  basePath: CLINIC_BASE_PATH,
  roles: [UserRole.CLINIC],
  summaryDescription: "Clinic management and operations",
  description:
    "Manage clinic operations, appointment scheduling, and patient flow.",
  enabled: true,
  isAuthRequired: true,
  routes: CLINIC_ROUTES,
  quickActions: [
    {
      title: "Book Appointment",
      path: buildUrl(CLINIC_BASE_PATH, "appointments/new"),
      icon: Calendar,
      enabled: true,
    },
    {
      title: "New Patient",
      path: buildUrl(CLINIC_BASE_PATH, "patients/new"),
      icon: Users,
      enabled: true,
    },
  ] as const,
} as const;
