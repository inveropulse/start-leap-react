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
import { lazy } from "react";
import { AppRoute, PortalConfig } from "./types";
import { PortalType, UserRole } from "@/shared/types";

const Clinics = <div />;
const Sedationists = <div />;
const Analytics = <div />;
const Reports = <div />;
const UsersMgmt = <div />;
const SettingsScreen = <div />;

const DashboardPage = lazy(
  () => import("@/app/internal/dashboard/DashboardPage")
);
const PatientPage = lazy(() => import("@/app/internal/PatientPage"));
const AppointmentPage = lazy(
  () => import("@/app/internal/appointment/AppointmentPage")
);

export enum InternalQuickActionKey {
  ADD_PATIENT = "add_patient",
  NEW_APPOINTMENT = "new_appointment",
  VIEW_APPOINTMENT = "view_appointment",
}

export enum InternalRoute {
  ROOT = "/internal",
  DASHBOARD = `${InternalRoute.ROOT}/dashboard`,
  PATIENTS = `${InternalRoute.ROOT}/patients`,
  CLINICS = `${InternalRoute.ROOT}/clinics`,
  APPOINTMENTS = `${InternalRoute.ROOT}/appointments`,
  SEDATIONISTS = `${InternalRoute.ROOT}/sedationists`,
  ANALYTICS = `${InternalRoute.ROOT}/analytics`,
  REPORTS = `${InternalRoute.ROOT}/reports`,
  USERS = `${InternalRoute.ROOT}/users`,
  SETTINGS = `${InternalRoute.ROOT}/settings`,
}

const INTERNAL_ROUTES: AppRoute[] = [
  {
    index: true,
    element: <DashboardPage />,
    path: InternalRoute.ROOT,
    meta: { title: "Dashboard", enabled: true, icon: LayoutDashboard },
  },
  {
    element: <PatientPage />,
    path: InternalRoute.PATIENTS,
    meta: { title: "Patients", enabled: true, icon: Users },
  },
  {
    element: Clinics,
    path: InternalRoute.CLINICS,
    meta: { title: "Clinics", enabled: true, icon: Building2 },
  },
  {
    element: <AppointmentPage />,
    path: InternalRoute.APPOINTMENTS,
    meta: { title: "Appointments", enabled: true, icon: Calendar },
  },
  {
    element: Sedationists,
    path: InternalRoute.SEDATIONISTS,
    meta: { title: "Sedationists", enabled: true, icon: UserCheck },
  },
  {
    element: Analytics,
    path: InternalRoute.ANALYTICS,
    meta: { title: "Analytics", enabled: true, icon: Activity },
  },
  {
    path: InternalRoute.REPORTS,
    element: Reports,
    meta: { title: "Reports", enabled: true, icon: FileText },
  },
  {
    element: UsersMgmt,
    path: InternalRoute.USERS,
    meta: { title: "User Management", enabled: true, icon: Shield },
  },
  {
    element: SettingsScreen,
    path: InternalRoute.SETTINGS,
    meta: { title: "Settings", enabled: true, icon: Settings },
  },
] as const;

export const INTERNAL_PORTAL: PortalConfig = {
  key: PortalType.INTERNAL,
  name: "Internal Portal",
  icon: "🏢",
  basePath: InternalRoute.ROOT,
  roles: [UserRole.ADMIN, UserRole.BOOKING_COORDINATOR],
  summaryDescription: "Administrative and staff portal",
  description:
    "This is where internal staff can manage operations, view reports, and handle administrative tasks.",
  enabled: true,
  isAuthRequired: true,
  routes: INTERNAL_ROUTES,
  quickActions: [
    {
      enabled: true,
      icon: Users,
      title: "Add Patient",
      path: InternalRoute.PATIENTS,
      actionKey: InternalQuickActionKey.ADD_PATIENT,
    },
    {
      enabled: true,
      icon: Calendar,
      title: "New Appointment",
      path: InternalRoute.APPOINTMENTS,
      actionKey: InternalQuickActionKey.NEW_APPOINTMENT,
    },
  ] as const,
} as const;
