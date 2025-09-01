import {
  Users,
  Shield,
  Calendar,
  BookOpen,
  Stethoscope,
  ClipboardList,
  LayoutDashboard,
} from "lucide-react";
import { buildUrl } from "@/shared/utils/url";
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

const SEDATIONIST_BASE_PATH = "/sedationist" as const;

const SEDATIONIST_ROUTES: AppRoute[] = [
  {
    index: true,
    element: SedationistDashboard,
    path: buildUrl(SEDATIONIST_BASE_PATH),
    meta: { title: "Dashboard", enabled: true, icon: LayoutDashboard },
  },
  {
    element: SedationistSchedule,
    path: buildUrl(SEDATIONIST_BASE_PATH, "schedule"),
    meta: { title: "My Schedule", enabled: true, icon: Calendar },
  },
  {
    element: SedationistPatients,
    path: buildUrl(SEDATIONIST_BASE_PATH, "patients"),
    meta: { title: "Patient Records", enabled: true, icon: Users },
  },
  {
    element: SedationistProcedures,
    path: buildUrl(SEDATIONIST_BASE_PATH, "procedures"),
    meta: { title: "Procedure Notes", enabled: true, icon: ClipboardList },
  },
  {
    element: SedationistMonitoring,
    path: buildUrl(SEDATIONIST_BASE_PATH, "monitoring"),
    meta: {
      title: "Sedation Monitoring",
      enabled: true,
      icon: Stethoscope,
    },
  },
  {
    element: SedationistCerts,
    path: buildUrl(SEDATIONIST_BASE_PATH, "certifications"),
    meta: { title: "Certifications", enabled: true, icon: Shield },
  },
  {
    element: SedationistGuidelines,
    path: buildUrl(SEDATIONIST_BASE_PATH, "guidelines"),
    meta: { title: "Guidelines", enabled: true, icon: BookOpen },
  },
] as const;

export const SEDATIONIST_PORTAL: PortalConfig = {
  key: PortalType.SEDATIONIST,
  name: "Sedationist Portal",
  icon: "⚕️",
  basePath: SEDATIONIST_BASE_PATH,
  roles: [UserRole.SEDATIONIST],
  summaryDescription: "Specialized sedation management",
  description:
    "Manage sedation procedures, monitor patients, and maintain certification records.",
  enabled: true,
  isAuthRequired: true,
  routes: SEDATIONIST_ROUTES,
  quickActions: [
    {
      title: "New Procedure",
      path: buildUrl(SEDATIONIST_BASE_PATH, "procedures/new"),
      icon: ClipboardList,
      enabled: true,
    },
  ] as const,
} as const;
