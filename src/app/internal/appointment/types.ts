import { AppointmentStatus, AppointmentType, AppointmentStats, Appointment } from "@/shared/types/entities/appointment";
import { Patient, ClinicDoctor, Clinic } from "@/shared/types/entities";
import { AppointmentFilters, PaginationState } from "@/shared/types";

// Re-export shared types for backward compatibility
export { 
  AppointmentStatus, 
  AppointmentType, 
  AppointmentStats,
  Appointment,
  Patient,
  ClinicDoctor as Doctor,
  Clinic,
  AppointmentFilters,
  PaginationState
};