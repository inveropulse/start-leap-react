import {
  Users,
  Shield,
  Calendar,
  BookOpen,
  Stethoscope,
  ClipboardList,
  LayoutDashboard,
} from "lucide-react";
import { lazy } from "react";
import React from "react";
import { AppRoute, PortalConfig } from "./types";
import { PortalType, UserRole } from "@/shared/types";

const SedationistDashboard = lazy(
  () => import("@/app/sedationist/SedationistPortal")
);

// Placeholder components for routes not yet implemented
const SedationistSchedule = () => React.createElement("div");
const SedationistPatients = () => React.createElement("div");
const SedationistProcedures = () => React.createElement("div");
const SedationistMonitoring = () => React.createElement("div");
const SedationistCerts = () => React.createElement("div");
const SedationistGuidelines = () => React.createElement("div");

export enum SedationistQuickActionKey {
  NEW_PROCEDURE = "new_procedure",
}

export enum SedationistRoute {
  ROOT = "/sedationist",
  SCHEDULE = `${SedationistRoute.ROOT}/schedule`,
  PATIENTS = `${SedationistRoute.ROOT}/patients`,
  PROCEDURES = `${SedationistRoute.ROOT}/procedures`,
  MONITORING = `${SedationistRoute.ROOT}/monitoring`,
  CERTIFICATIONS = `${SedationistRoute.ROOT}/certifications`,
  GUIDELINES = `${SedationistRoute.ROOT}/guidelines`,
}

const SEDATIONIST_ROUTES: AppRoute[] = [
  {
    index: true,
    component: SedationistDashboard,
    path: SedationistRoute.ROOT,
    meta: { title: "Dashboard", enabled: true, icon: LayoutDashboard },
  },
  {
    component: SedationistSchedule,
    path: SedationistRoute.SCHEDULE,
    meta: { title: "My Schedule", enabled: true, icon: Calendar },
  },
  {
    component: SedationistPatients,
    path: SedationistRoute.PATIENTS,
    meta: { title: "Patient Records", enabled: true, icon: Users },
  },
  {
    component: SedationistProcedures,
    path: SedationistRoute.PROCEDURES,
    meta: { title: "Procedure Notes", enabled: true, icon: ClipboardList },
  },
  {
    component: SedationistMonitoring,
    path: SedationistRoute.MONITORING,
    meta: {
      title: "Sedation Monitoring",
      enabled: true,
      icon: Stethoscope,
    },
  },
  {
    component: SedationistCerts,
    path: SedationistRoute.CERTIFICATIONS,
    meta: { title: "Certifications", enabled: true, icon: Shield },
  },
  {
    component: SedationistGuidelines,
    path: SedationistRoute.GUIDELINES,
    meta: { title: "Guidelines", enabled: true, icon: BookOpen },
  },
] as const;

export const SEDATIONIST_PORTAL: PortalConfig = {
  key: PortalType.SEDATIONIST,
  name: "Sedationist Portal",
  icon: "⚕️",
  basePath: SedationistRoute.ROOT,
  roles: [UserRole.SEDATIONIST],
  summaryDescription: "Specialized sedation management",
  description:
    "Manage sedation procedures, monitor patients, and maintain certification records.",
  enabled: true,
  isAuthRequired: true,
  routes: SEDATIONIST_ROUTES,
  quickActions: [
    {
      enabled: true,
      icon: ClipboardList,
      title: "New Procedure",
      path: SedationistRoute.PROCEDURES,
      actionKey: SedationistQuickActionKey.NEW_PROCEDURE,
    },
  ] as const,
} as const;
