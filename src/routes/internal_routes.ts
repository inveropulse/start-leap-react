import {
  Users,
  Shield,
  Settings,
  Calendar,
  CalendarDays,
  FileText,
  Activity,
  Building2,
  UserCheck,
  LayoutDashboard,
} from "lucide-react";
import { lazy } from "react";
import React from "react";
import { AppRoute, PortalConfig } from "./types";
import { PortalType, UserRole } from "@/shared/types";

const ClinicsPage = lazy(() => import("@/app/internal/clinics/ClinicsPage"));
const SedationistsPage = lazy(
  () => import("@/app/internal/sedationists/SedationistsPage")
);
const UsersPage = lazy(() => import("@/app/internal/users/UsersPage"));
const DashboardPage = lazy(
  () => import("@/app/internal/dashboard/DashboardPage")
);
const PatientPage = lazy(() => import("@/app/internal/patient/PatientPage"));
const PatientDetailPage = lazy(
  () => import("@/app/internal/patient/PatientDetailPage")
);
const CalendarPage = lazy(() => import("@/app/internal/calendar/CalendarPage"));
const AppointmentPage = lazy(
  () => import("@/app/internal/appointment/AppointmentPage")
);

// Placeholder components for routes not yet implemented
const Analytics = () => React.createElement("div");
const Reports = () => React.createElement("div");
const SettingsScreen = () => React.createElement("div");

export enum InternalQuickActionKey {
  ADD_PATIENT = "add_patient",
  ADD_CLINIC = "add_clinic",
  ADD_SEDATIONIST = "add_sedationist",
  ADD_USER = "add_user",
  NEW_APPOINTMENT = "new_appointment",
  VIEW_APPOINTMENT = "view_appointment",
  VIEW_CALENDAR = "view_calendar",
}

export enum InternalRoute {
  ROOT = "/internal",
  DASHBOARD = `${InternalRoute.ROOT}/dashboard`,
  PATIENTS = `${InternalRoute.ROOT}/patients`,
  PATIENT_DETAIL = `${InternalRoute.ROOT}/patients/:id`,
  CLINICS = `${InternalRoute.ROOT}/clinics`,
  CALENDAR = `${InternalRoute.ROOT}/calendar`,
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
    component: DashboardPage,
    path: InternalRoute.ROOT,
    meta: { title: "Dashboard", enabled: true, icon: LayoutDashboard },
  },
  {
    component: PatientPage,
    path: InternalRoute.PATIENTS,
    meta: { title: "Patients", enabled: true, icon: Users },
  },
  {
    component: PatientDetailPage,
    path: InternalRoute.PATIENT_DETAIL,
    meta: {
      title: "Patient Details",
      enabled: true,
      isSubRoute: true,
      icon: Users,
    },
  },
  {
    component: ClinicsPage,
    path: InternalRoute.CLINICS,
    meta: { title: "Clinics", enabled: true, icon: Building2 },
  },
  {
    component: CalendarPage,
    path: InternalRoute.CALENDAR,
    meta: { title: "Calendar", enabled: true, icon: Calendar },
  },
  {
    component: AppointmentPage,
    path: InternalRoute.APPOINTMENTS,
    meta: { title: "Appointments", enabled: true, icon: CalendarDays },
  },
  {
    component: SedationistsPage,
    path: InternalRoute.SEDATIONISTS,
    meta: { title: "Sedationists", enabled: true, icon: UserCheck },
  },
  {
    component: Analytics,
    path: InternalRoute.ANALYTICS,
    meta: { title: "Analytics", enabled: true, icon: Activity },
  },
  {
    path: InternalRoute.REPORTS,
    component: Reports,
    meta: { title: "Reports", enabled: true, icon: FileText },
  },
  {
    component: UsersPage,
    path: InternalRoute.USERS,
    meta: { title: "User Management", enabled: true, icon: Shield },
  },
  {
    component: SettingsScreen,
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
      icon: Building2,
      title: "Add Clinic",
      path: InternalRoute.CLINICS,
      actionKey: InternalQuickActionKey.ADD_CLINIC,
    },
    {
      enabled: true,
      icon: UserCheck,
      title: "Add Sedationist",
      path: InternalRoute.SEDATIONISTS,
      actionKey: InternalQuickActionKey.ADD_SEDATIONIST,
    },
    {
      enabled: true,
      icon: CalendarDays,
      title: "New Appointment",
      path: InternalRoute.APPOINTMENTS,
      actionKey: InternalQuickActionKey.NEW_APPOINTMENT,
    },
    {
      enabled: true,
      icon: Calendar,
      title: "View Calendar",
      path: InternalRoute.CALENDAR,
      actionKey: InternalQuickActionKey.VIEW_CALENDAR,
    },
    {
      enabled: true,
      icon: Shield,
      title: "Add User",
      path: InternalRoute.USERS,
      actionKey: InternalQuickActionKey.ADD_USER,
    },
  ] as const,
} as const;
