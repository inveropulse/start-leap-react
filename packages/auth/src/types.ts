// Basic authentication types for multi-portal system
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: PortalPermissions;
  defaultPortal: PortalType;
  isActive: boolean;
}

export type UserRole = "admin" | "staff" | "sedationist" | "patient";

export interface PortalPermissions {
  internal: boolean;
  patient: boolean;
  sedationist: boolean;
  clinic: boolean;
}

export type PortalType = "internal" | "patient" | "sedationist" | "clinic";

export interface LoginCredentials {
  email: string;
  password: string;
}
