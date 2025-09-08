import {
  Users,
  Settings,
  Calendar,
  FileText,
  UserCheck,
  LayoutDashboard,
} from "lucide-react";
import { lazy } from "react";
import React from "react";
import { AppRoute, PortalConfig } from "./types";
import { PortalType, UserRole } from "@/shared/types";

const ClinicDashboardPage = lazy(() => import("@/app/clinic/ClinicPortal"));

// Placeholder components for routes not yet implemented
const ClinicSchedule = () => React.createElement("div");
const ClinicPatients = () => React.createElement("div");
const ClinicAppointments = () => React.createElement("div");
const ClinicStaff = () => React.createElement("div");
const ClinicReports = () => React.createElement("div");
const ClinicSettings = () => React.createElement("div");

export enum ClinicQuickActionKey {
  NEW_APPOINTMENT = "new_appointment",
  NEW_PATIENT = "new_patient",
}

export enum ClinicRoute {
  ROOT = "/clinic",
  SCHEDULE = `${ClinicRoute.ROOT}/schedule`,
  PATIENTS = `${ClinicRoute.ROOT}/patients`,
  APPOINTMENTS = `${ClinicRoute.ROOT}/appointments`,
  STAFF = `${ClinicRoute.ROOT}/staff`,
  REPORTS = `${ClinicRoute.ROOT}/reports`,
  SETTINGS = `${ClinicRoute.ROOT}/settings`,
}

const CLINIC_ROUTES: AppRoute[] = [
  {
    index: true,
    component: ClinicDashboardPage,
    path: ClinicRoute.ROOT,
    meta: { title: "Dashboard", enabled: true, icon: LayoutDashboard },
  },
  {
    component: ClinicSchedule,
    path: ClinicRoute.SCHEDULE,
    meta: { title: "Today's Schedule", enabled: true, icon: Calendar },
  },
  {
    component: ClinicPatients,
    path: ClinicRoute.PATIENTS,
    meta: { title: "Patients", enabled: true, icon: Users },
  },
  {
    component: ClinicAppointments,
    path: ClinicRoute.APPOINTMENTS,
    meta: { title: "Appointments", enabled: true, icon: Calendar },
  },
  {
    component: ClinicStaff,
    path: ClinicRoute.STAFF,
    meta: { title: "Staff", enabled: true, icon: UserCheck },
  },
  {
    component: ClinicReports,
    path: ClinicRoute.REPORTS,
    meta: { title: "Reports", enabled: true, icon: FileText },
  },
  {
    component: ClinicSettings,
    path: ClinicRoute.SETTINGS,
    meta: { title: "Settings", enabled: true, icon: Settings },
  },
] as const;

export const CLINIC_PORTAL: PortalConfig = {
  key: PortalType.CLINIC,
  name: "Clinic Portal",
  icon: "🏥",
  basePath: ClinicRoute.ROOT,
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
      path: ClinicRoute.APPOINTMENTS,
      icon: Calendar,
      enabled: true,
      actionKey: ClinicQuickActionKey.NEW_APPOINTMENT,
    },
    {
      title: "New Patient",
      path: ClinicRoute.PATIENTS,
      icon: Users,
      enabled: true,
      actionKey: ClinicQuickActionKey.NEW_PATIENT,
    },
  ] as const,
} as const;
