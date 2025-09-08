import {
  Heart,
  Calendar,
  CreditCard,
  MessageSquare,
  LayoutDashboard,
  User as UserIcon,
} from "lucide-react";
import { lazy } from "react";
import React from "react";
import { AppRoute, PortalConfig } from "./types";
import { PortalType, UserRole } from "@/shared/types";

const PatientDashboard = lazy(() => import("@/app/patient/PatientPortal"));

// Placeholder components for routes not yet implemented
const PatientAppointments = () => React.createElement("div");
const PatientRecords = () => React.createElement("div");
const PatientMessages = () => React.createElement("div");
const PatientBilling = () => React.createElement("div");
const PatientProfile = () => React.createElement("div");

export enum PatientQuickActionKey {
  NEW_APPOINTMENT = "new_appointment",
  VIEW_RECORDS = "view_records",
  SEND_MESSAGE = "send_message",
  MAKE_PAYMENT = "make_payment",
  EDIT_PROFILE = "edit_profile",
}

export enum PatientRoute {
  ROOT = "/patient",
  APPOINTMENTS = `${PatientRoute.ROOT}/appointments`,
  RECORDS = `${PatientRoute.ROOT}/records`,
  MESSAGES = `${PatientRoute.ROOT}/messages`,
  BILLING = `${PatientRoute.ROOT}/billing`,
  PROFILE = `${PatientRoute.ROOT}/profile`,
}

const PATIENT_ROUTES: AppRoute[] = [
  {
    index: true,
    component: PatientDashboard,
    path: PatientRoute.ROOT,
    meta: { title: "Dashboard", enabled: true, icon: LayoutDashboard },
  },
  {
    component: PatientAppointments,
    path: PatientRoute.APPOINTMENTS,
    meta: { title: "My Appointments", enabled: true, icon: Calendar },
  },
  {
    component: PatientRecords,
    path: PatientRoute.RECORDS,
    meta: { title: "Health Records", enabled: true, icon: Heart },
  },
  {
    component: PatientMessages,
    path: PatientRoute.MESSAGES,
    meta: { title: "Messages", enabled: true, icon: MessageSquare },
  },
  {
    component: PatientBilling,
    path: PatientRoute.BILLING,
    meta: { title: "Billing", enabled: true, icon: CreditCard },
  },
  {
    component: PatientProfile,
    path: PatientRoute.PROFILE,
    meta: { title: "Profile", enabled: true, icon: UserIcon },
  },
] as const;

export const PATIENT_PORTAL: PortalConfig = {
  key: PortalType.PATIENT,
  name: "Patient Portal",
  icon: "👤",
  basePath: PatientRoute.ROOT,
  roles: [UserRole.PATIENT],
  summaryDescription: "Your personal health portal",
  description:
    "Access your appointments, medical records, and communicate with your care team.",
  enabled: true,
  isAuthRequired: true,
  routes: PATIENT_ROUTES,
  quickActions: [
    {
      title: "Book Appointment",
      path: PatientRoute.APPOINTMENTS,
      icon: Calendar,
      enabled: true,
      actionKey: PatientQuickActionKey.NEW_APPOINTMENT,
    },
  ] as const,
} as const;
