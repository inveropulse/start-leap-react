// API-specific types for clinics
import { ClinicSearchParams } from "../../shared/types/shared-kernel/filters";
import {
  Clinic,
  CreateClinicRequest,
  UpdateClinicRequest,
  ClinicManagementData,
} from "../../shared/types/domains/clinic/entities";
import {
  PaginationResponse,
  ApiResponse,
} from "../../shared/types/shared-kernel/common";

// Re-export domain types for convenience
export type {
  Clinic,
  CreateClinicRequest,
  UpdateClinicRequest,
  ClinicManagementData,
  ClinicSearchParams,
};

// API-specific response types
export type ClinicPaginationResponse = PaginationResponse<Clinic>;
export type ClinicApiResponse = ApiResponse<Clinic>;
export type ClinicListApiResponse = ApiResponse<ClinicPaginationResponse>;

// Statistics types
export interface ClinicStats {
  totalClinics: number;
  activeClinics: number;
  inactiveClinics: number;
  pendingClinics: number;
  totalDoctors: number;
  totalAppointments: number;
}

export type ClinicStatsApiResponse = ApiResponse<ClinicStats>;
