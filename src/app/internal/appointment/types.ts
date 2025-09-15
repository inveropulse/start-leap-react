import {
  AppointmentStatus,
  AppointmentType,
  Appointment,
} from "@/shared/types/domains/appointment";
import { AppointmentStats } from "./types/stats.types";
import { Patient } from "@/shared/types/domains/patient";
import { ClinicDoctor, Clinic } from "@/shared/types/domains/clinic";
import { AppointmentSearchParams, PaginationState } from "@/shared/types";

// Re-export shared types for backward compatibility
export { AppointmentStatus, AppointmentType };
export type {
  AppointmentStats,
  Appointment,
  Patient,
  ClinicDoctor as Doctor,
  Clinic,
  AppointmentSearchParams,
  PaginationState,
};
