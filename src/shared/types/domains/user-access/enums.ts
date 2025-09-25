// User access domain enums
export enum PortalType {
  CLINIC = "clinic",
  PATIENT = "patient",
  INTERNAL = "internal",
  SEDATIONIST = "sedationist",
}

export enum UserRole {
  ADMIN = "admin",
  CLINIC = "clinic",
  PATIENT = "patient",
  SEDATIONIST = "sedationist",
  BOOKING_COORDINATOR = "booking_coordinator",

  // TODO - NOT NEEDED NOW BUT CAN BE USEFUL LATER
  // MANAGER = "manager",
  // USER = "user",
  // DOCTOR = "doctor",
  // NURSE = "nurse",
}

export enum UserStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  SUSPENDED = "Suspended",
  PENDING_ACTIVATION = "Pending Activation",
}

export enum Department {
  UNASSIGNED = "Unassigned",
  ADMINISTRATION = "Administration",
  BOOKING = "Booking",
  OPERATIONS = "Operations",
  IT = "IT",
  MANAGEMENT = "Management",
}

export enum PermissionLevel {
  UNASSIGNED = "Unassigned",
  FULL_ACCESS = "Full Access",
  LIMITED_ACCESS = "Limited Access",
  READ_ONLY = "Read Only",
  CUSTOM = "Custom",
}

export enum RoleType {
  EDITOR = "Editor",
  ADMIN = "Admin",
}
