import {
  Users,
  Shield,
  Calendar,
  BookOpen,
  Stethoscope,
  ClipboardList,
  LayoutDashboard,
} from "lucide-react";
import { AppRoute, PortalConfig } from "./types";
import { PortalType, UserRole } from "@/shared/types";
import SedationistPortal from "@/app/sedationist/SedationistPortal";

const SedationistDashboard = <SedationistPortal />;
const SedationistSchedule = <div />;
const SedationistPatients = <div />;
const SedationistProcedures = <div />;
const SedationistMonitoring = <div />;
const SedationistCerts = <div />;
const SedationistGuidelines = <div />;

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
    element: SedationistDashboard,
    path: SedationistRoute.ROOT,
    meta: { title: "Dashboard", enabled: true, icon: LayoutDashboard },
  },
  {
    element: SedationistSchedule,
    path: SedationistRoute.SCHEDULE,
    meta: { title: "My Schedule", enabled: true, icon: Calendar },
  },
  {
    element: SedationistPatients,
    path: SedationistRoute.PATIENTS,
    meta: { title: "Patient Records", enabled: true, icon: Users },
  },
  {
    element: SedationistProcedures,
    path: SedationistRoute.PROCEDURES,
    meta: { title: "Procedure Notes", enabled: true, icon: ClipboardList },
  },
  {
    element: SedationistMonitoring,
    path: SedationistRoute.MONITORING,
    meta: {
      title: "Sedation Monitoring",
      enabled: true,
      icon: Stethoscope,
    },
  },
  {
    element: SedationistCerts,
    path: SedationistRoute.CERTIFICATIONS,
    meta: { title: "Certifications", enabled: true, icon: Shield },
  },
  {
    element: SedationistGuidelines,
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
