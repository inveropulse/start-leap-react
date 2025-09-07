import { 
  Sedationist, 
  CreateSedationistData, 
  UpdateSedationistData,
  SedationistCertification,
  SedationistAvailability,
  SedationistCase
} from "@/shared/types/entities/sedationist";
import { SedationistFilters, SedationistSearchParams } from "@/shared/types/filters";
import { PaginationResponse, PaginationState } from "@/shared/types";
import { SedationistStatus, SedationistSpecialty, CertificationStatus } from "@/shared/types/enums/sedationist";

// Define typed pagination response for sedationists
export type SedationistPaginationResponse = PaginationResponse<Sedationist>;

// Re-export shared types for backward compatibility
export { 
  SedationistStatus,
  SedationistSpecialty,
  CertificationStatus
};
export type { 
  Sedationist,
  CreateSedationistData,
  UpdateSedationistData,
  SedationistFilters,
  SedationistSearchParams,
  PaginationState,
  SedationistCertification,
  SedationistAvailability,
  SedationistCase
};