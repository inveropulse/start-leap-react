import {
  Users,
  FileText,
  Calendar,
  Settings,
  UserCheck,
  LayoutDashboard,
} from "lucide-react";
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
    element: ClinicDashboard,
    path: ClinicRoute.ROOT,
    meta: { title: "Dashboard", enabled: true, icon: LayoutDashboard },
  },
  {
    element: ClinicSchedule,
    path: ClinicRoute.SCHEDULE,
    meta: { title: "Today's Schedule", enabled: true, icon: Calendar },
  },
  {
    element: ClinicPatients,
    path: ClinicRoute.PATIENTS,
    meta: { title: "Patients", enabled: true, icon: Users },
  },
  {
    element: ClinicAppointments,
    path: ClinicRoute.APPOINTMENTS,
    meta: { title: "Appointments", enabled: true, icon: Calendar },
  },
  {
    element: ClinicStaff,
    path: ClinicRoute.STAFF,
    meta: { title: "Staff", enabled: true, icon: UserCheck },
  },
  {
    element: ClinicReports,
    path: ClinicRoute.REPORTS,
    meta: { title: "Reports", enabled: true, icon: FileText },
  },
  {
    element: ClinicSettings,
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
