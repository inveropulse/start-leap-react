import { 
  Sedationist, 
  CreateSedationistData, 
  UpdateSedationistData,
  SedationistCertification,
  SedationistAvailability,
  SedationistCase,
  SedationistStatus,
  SedationistSpecialty,
  CertificationStatus
} from "@/shared/types/domains/sedation";
import { SedationistFilters, SedationistSearchParams } from "@/shared/types/shared-kernel/filters";
import { PaginationResponse, PaginationState } from "@/shared/types";

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