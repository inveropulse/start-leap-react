import { 
  Sedationist, 
  CreateSedationistData, 
  UpdateSedationistData,
  SedationistCertification,
  SedationistAvailability,
  SedationistCase
} from "@/shared/types/entities/sedationist";
import { SedationistFilters, SedationistSearchParams } from "@/shared/types/filters";
import { PaginationResponse as SedationistPaginationResponse, PaginationState } from "@/shared/types";
import { SedationistStatus, SedationistSpecialty, CertificationStatus } from "@/shared/types/enums/sedationist";

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
  SedationistPaginationResponse,
  PaginationState,
  SedationistCertification,
  SedationistAvailability,
  SedationistCase
};