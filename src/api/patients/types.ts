import type {
  SearchParams,
  ApiResponse,
  ApiPaginationResponse,
} from "@/shared/types/shared-kernel";
import type {
  Patient,
  BasePatientFields,
} from "@/shared/types/domains/patient/entities";
import { PatientAppointment } from "@/shared/types";

export const PATIENTS_REQUEST_BASE_QUERY_KEY = ["patients"];

export type PatientSearchParams = Omit<SearchParams, "sortBy"> & {
  sortBy?: keyof Patient;
  clinicId?: string;
  hasAppointments?: boolean;
  appointmentStatus?: string;
};

export type CreatePatientRequest = Partial<BasePatientFields>;

export type CreatePatientResponse = ApiResponse<Patient>;

export type FindAllPatientsResponse = ApiPaginationResponse<Patient>;

export type FindByIdPatientResponse = ApiResponse<Patient>;

export type UpdatePatientRequest = Partial<BasePatientFields> & {
  id: string;
};

export type UpdatePatientResponse = ApiResponse<Patient>;

export type DeletePatientResponse = ApiResponse<boolean>;

export type PatientStatsResponse = ApiResponse<{
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
  totalAppointments: number;
  averageAge: number;
}>;

export type FindPatientAppointmentsResponse =
  ApiPaginationResponse<PatientAppointment>;

export type PatientAppointmentsResponse = ApiResponse<{
  upcoming: PatientAppointment[];
  past: PatientAppointment[];
}>;
