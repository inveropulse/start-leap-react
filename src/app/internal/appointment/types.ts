import { AppointmentStatus, AppointmentType, Appointment } from "@/shared/types/entities/appointment";
import { AppointmentStats } from "./types/stats.types";
import { Patient, ClinicDoctor, Clinic } from "@/shared/types/entities";
import { AppointmentFilters, PaginationState } from "@/shared/types";

// Re-export shared types for backward compatibility
export { 
  AppointmentStatus, 
  AppointmentType
};
export type { 
  AppointmentStats,
  Appointment,
  Patient,
  ClinicDoctor as Doctor,
  Clinic,
  AppointmentFilters,
  PaginationState
};