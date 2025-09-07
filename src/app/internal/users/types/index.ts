import { 
  InternalUser, 
  CreateUserData, 
  UpdateUserData, 
  UserActivity, 
  UserSession,
  UserStatus,
  Department,
  PermissionLevel
} from "@/shared/types/domains/user-access";
import { UserFilters, UserSearchParams } from "@/shared/types/shared-kernel/filters";
import { PaginationResponse } from "@/shared/types";

// Define typed pagination response for users
export type UserPaginationResponse = PaginationResponse<InternalUser>;

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
  UserSearchParams
};