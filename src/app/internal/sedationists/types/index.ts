import { 
  Sedationist, 
  CreateSedationistData, 
  UpdateSedationistData, 
  SedationistFilters 
} from "@/shared/types/entities/sedationist";
import { SedationistSearchParams, PaginationResponse as SedationistPaginationResponse, PaginationState } from "@/shared/types";
import { SedationistStatus, SedationistSpecialty, CertificationStatus } from "@/shared/types/enums/sedationist";

// Re-export shared types for backward compatibility
export { 
  Sedationist,
  CreateSedationistData,
  UpdateSedationistData,
  SedationistFilters,
  SedationistSearchParams,
  SedationistPaginationResponse,
  PaginationState,
  SedationistStatus,
  SedationistSpecialty,
  CertificationStatus
};