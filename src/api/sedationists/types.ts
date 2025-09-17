// Sedationist API specific types - following established patterns
import type {
  SearchParams,
  ApiResponse,
  PaginationResponse,
} from "@/shared/types/shared-kernel";
import type {
  Sedationist,
  BaseSedationistFields,
} from "@/shared/types/domains/sedationist/entities";
import type {
  SedationistAvailability,
  SedationistCertification,
} from "@/shared/types/domains/sedationist/value-objects";
import { SedationistAppointment } from "@/shared/types";

export const SEDATIONISTS_REQUEST_BASE_QUERY_KEY = ["sedationists"];

export type SedationistSearchParams = Omit<SearchParams, "sortBy"> & {
  sortBy?: keyof Sedationist;
  status?: string;
  specialty?: string;
  availableOn?: string; // Date filter for availability
  hasActiveCertifications?: boolean;
};

export type CreateSedationistRequest = Partial<BaseSedationistFields>;

export type CreateSedationistResponse = ApiResponse<Sedationist>;

export type FindAllSedationistsResponse = PaginationResponse<Sedationist>;

export type FindByIdSedationistResponse = ApiResponse<Sedationist>;

export type UpdateSedationistRequest = Partial<BaseSedationistFields> & {
  id: string;
};

export type UpdateSedationistResponse = ApiResponse<Sedationist>;

export type DeleteSedationistResponse = ApiResponse<boolean>;

export type SedationistStatsResponse = ApiResponse<{
  totalSedationists: number;
  activeSedationists: number;
  inactiveSedationists: number;
  onLeaveSedationists: number;
  inTrainingSedationists: number;
  averageSuccessRate: number;
  averagePatientRating: number;
  totalProcedures: number;
  averageProcedures: number;
}>;

// Enhanced responses with relations
export type SedationistWithAppointmentsResponse = ApiResponse<{
  sedationist: Sedationist;
  appointments: SedationistAppointment[];
}>;

export type FindSedationistAppointmentsResponse =
  PaginationResponse<SedationistAppointment>;

export type SedationistAvailabilityResponse = ApiResponse<
  SedationistAvailability[]
>;
