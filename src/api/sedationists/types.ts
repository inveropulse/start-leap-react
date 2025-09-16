// Sedationist API specific types - following clinics/types.ts pattern

import {
  Sedationist,
  CreateSedationistData,
  UpdateSedationistData,
} from "@/shared/types/domains/sedation";
import { SedationistSearchParams } from "@/shared/types/shared-kernel/filters";
import {
  PaginationResponse,
  ApiResponse,
  BooleanResponse,
} from "@/shared/types/shared-kernel/common";

// API Response types using shared-kernel
export type SedationistsResponse = PaginationResponse<Sedationist>;
export type SedationistResponse = ApiResponse<Sedationist>;
export type CreateSedationistResponse = ApiResponse<Sedationist>;
export type UpdateSedationistResponse = ApiResponse<Sedationist>;
export type DeleteSedationistResponse = BooleanResponse;

// Re-export for convenience
export type {
  Sedationist,
  CreateSedationistData,
  UpdateSedationistData,
  SedationistSearchParams,
};
