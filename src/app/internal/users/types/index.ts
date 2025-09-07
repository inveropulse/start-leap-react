import { 
  InternalUser, 
  CreateUserData, 
  UpdateUserData, 
  UserActivity, 
  UserSession 
} from "@/shared/types/entities/user";
import { UserFilters, UserSearchParams } from "@/shared/types/filters";
import { PaginationResponse as UserPaginationResponse } from "@/shared/types";
import { UserStatus, Department, PermissionLevel } from "@/shared/types/enums/user";

// Re-export shared types for backward compatibility
export { 
  UserStatus,
  Department,
  PermissionLevel
};
export type { 
  InternalUser,
  CreateUserData,
  UpdateUserData,
  UserFilters,
  UserActivity,
  UserSession,
  UserSearchParams,
  UserPaginationResponse
};