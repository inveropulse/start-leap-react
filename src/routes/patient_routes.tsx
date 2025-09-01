import {
  Heart,
  Calendar,
  CreditCard,
  MessageSquare,
  LayoutDashboard,
  User as UserIcon,
} from "lucide-react";
import { buildUrl } from "@/shared/utils/url";
import { AppRoute, PortalConfig } from "./types";
import { PortalType, UserRole } from "@/shared/types";
import PatientPortal from "@/app/patient/PatientPortal";

const PatientDashboard = <PatientPortal />;
const PatientAppointments = <div />;
const PatientRecords = <div />;
const PatientMessages = <div />;
const PatientBilling = <div />;
const PatientProfile = <div />;

const PATIENT_BASE_PATH = "/patient" as const;

const PATIENT_ROUTES: AppRoute[] = [
  {
    index: true,
    element: PatientDashboard,
    path: buildUrl(PATIENT_BASE_PATH),
    meta: { title: "Dashboard", enabled: true, icon: LayoutDashboard },
  },
  {
    element: PatientAppointments,
    path: buildUrl(PATIENT_BASE_PATH, "appointments"),
    meta: { title: "My Appointments", enabled: true, icon: Calendar },
  },
  {
    element: PatientRecords,
    path: buildUrl(PATIENT_BASE_PATH, "records"),
    meta: { title: "Health Records", enabled: true, icon: Heart },
  },
  {
    element: PatientMessages,
    path: buildUrl(PATIENT_BASE_PATH, "messages"),
    meta: { title: "Messages", enabled: true, icon: MessageSquare },
  },
  {
    element: PatientBilling,
    path: buildUrl(PATIENT_BASE_PATH, "billing"),
    meta: { title: "Billing", enabled: true, icon: CreditCard },
  },
  {
    element: PatientProfile,
    path: buildUrl(PATIENT_BASE_PATH, "profile"),
    meta: { title: "Profile", enabled: true, icon: UserIcon },
  },
] as const;

export const PATIENT_PORTAL: PortalConfig = {
  key: PortalType.PATIENT,
  name: "Patient Portal",
  icon: "👤",
  basePath: PATIENT_BASE_PATH,
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
      path: buildUrl(PATIENT_BASE_PATH, "appointments/book"),
      icon: Calendar,
      enabled: true,
    },
  ] as const,
} as const;
