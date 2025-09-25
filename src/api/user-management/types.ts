import {
  ApiResponse,
  SearchParams,
  ManageableUser,
  BaseUserFields,
  ApiBooleanResponse,
  ApiPaginationResponse,
  UserStatus,
  UserRole,
  Department,
  UserActivity,
  UserSession,
} from "@/shared/types";

// create
export type CreateUserRequest = BaseUserFields & {
  sendWelcomeEmail?: boolean;
};

export type CreateUserResponse = ApiResponse<ManageableUser>;

// update
export type UpdateUserRequest = ManageableUser;

export type UpdateUserResponse = ApiResponse<UpdateUserRequest>;

// delete
export type DeleteUserResponse = ApiBooleanResponse;

// find all
export const USERS_REQUEST_BASE_QUERY_KEY = ["manageable.users"];

export type UserSearchParams = Omit<SearchParams, "sortBy"> & {
  sortBy?: keyof ManageableUser;
  status?: UserStatus[];
  roles?: UserRole[];
  departments?: Department[];
};

export type FindAllUsersResponse = ApiPaginationResponse<ManageableUser>;

// find by id
export type FindUserByIdResponse = ApiResponse<ManageableUser>;

// stats
export type UsersStatsResponse = ApiResponse<{
  total: number;
  active: number;
  pending: number;
  admins: number;
}>;

// User activities
export type FindUserActivitiesResponse = ApiResponse<UserActivity[]>;

// User sessions
export type FindUserSessionsResponse = ApiResponse<UserSession[]>;
