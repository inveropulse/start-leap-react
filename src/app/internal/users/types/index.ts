import { 
  InternalUser, 
  CreateUserData, 
  UpdateUserData, 
  UserFilters, 
  UserActivity, 
  UserSession 
} from "@/shared/types/entities/user";
import { UserSearchParams, PaginationResponse as UserPaginationResponse } from "@/shared/types";
import { UserStatus, Department, PermissionLevel } from "@/shared/types/enums/user";

// Re-export shared types for backward compatibility
export { 
  InternalUser,
  CreateUserData,
  UpdateUserData,
  UserFilters,
  UserActivity,
  UserSession,
  UserSearchParams,
  UserPaginationResponse,
  UserStatus,
  Department,
  PermissionLevel
};