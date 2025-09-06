export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  PENDING_ACTIVATION = "pending_activation",
}

export enum Department {
  ADMINISTRATION = "administration",
  BOOKING = "booking", 
  OPERATIONS = "operations",
  IT = "it",
  MANAGEMENT = "management",
}

export enum PermissionLevel {
  FULL_ACCESS = "full_access",
  LIMITED_ACCESS = "limited_access", 
  READ_ONLY = "read_only",
  CUSTOM = "custom",
}

export interface InternalUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: UserStatus;
  role: string; // Will use UserRole from shared types
  department: Department;
  permissionLevel: PermissionLevel;
  joinDate: string;
  lastLogin?: string;
  lastPasswordChange?: string;
  profileImageUrl?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSearchParams {
  search?: string;
  status?: UserStatus[];
  roles?: string[];
  departments?: Department[];
  permissionLevels?: PermissionLevel[];
  lastLoginAfter?: string;
  pageNo?: number;
  pageSize?: number;
}

export interface UserPaginationResponse {
  items: InternalUser[];
  totalCount: number;
  pageNo: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  department: Department;
  permissionLevel: PermissionLevel;
  notes?: string;
  sendWelcomeEmail?: boolean;
}

export interface UpdateUserData {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  department?: Department;
  permissionLevel?: PermissionLevel;
  status?: UserStatus;
  notes?: string;
}

export interface UserFilters {
  search: string;
  status: UserStatus[];
  roles: string[];
  departments: Department[];
  permissionLevels: PermissionLevel[];
  lastLoginAfter: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  description: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface UserSession {
  id: string;
  userId: string;
  device: string;
  location: string;
  lastActive: string;
  isActive: boolean;
}