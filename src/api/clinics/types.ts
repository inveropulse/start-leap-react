import type {
  SearchParams,
  ApiResponse,
  PaginationResponse,
} from "@/shared/types/shared-kernel";
import type {
  Clinic,
  BaseClinicFields,
} from "@/shared/types/domains/clinic/entities";
import { ClinicAppointment } from "@/shared/types";

export const CLINICS_REQUEST_BASE_QUERY_KEY = ["clinics"];

export type ClinicSearchParams = Omit<SearchParams, "sortBy"> & {
  sortBy?: keyof Clinic;
  status?: string;
  facilityType?: string;
  specialty?: string;
  hasActiveAppointments?: boolean;
};

export type CreateClinicRequest = Partial<BaseClinicFields>;

export type CreateClinicResponse = ApiResponse<Clinic>;

export type FindAllClinicsResponse = PaginationResponse<Clinic>;

export type FindByIdClinicResponse = ApiResponse<Clinic>;

export type UpdateClinicRequest = Partial<BaseClinicFields> & {
  id: string;
};

export type UpdateClinicResponse = ApiResponse<Clinic>;

export type DeleteClinicResponse = ApiResponse<boolean>;

export type ClinicStatsResponse = ApiResponse<{
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
  totalPatients: number;
  totalAppointments: number;
  averageAppointmentsPerClinic: number;
}>;

// Enhanced responses that include ClinicAppointment relations
export type ClinicWithAppointmentsResponse = ApiResponse<{
  clinic: Clinic;
  appointments: ClinicAppointment[];
}>;

export type FindClinicAppointmentsResponse =
  PaginationResponse<ClinicAppointment>;
