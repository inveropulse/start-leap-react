// Shared user-related enums
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

export enum RoleType {
  EDITOR = 'Editor',
  ADMIN = 'Admin',
}