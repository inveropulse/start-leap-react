// Core Enums
export enum PortalType {
  CLINIC = "clinic",
  INTERNAL = "internal",
  PATIENT = "patient",
  SEDATIONIST = "sedationist",
}

export enum PublicRoute {
  LOGIN = "/login",
  REGISTER = "/register",
  FORGOT_PASSWORD = "/forgot-password",
  RESET_PASSWORD = "/reset-password",
  VERIFY_EMAIL = "/verify-email",
  UNAUTHORIZED = "/unauthorized",
  NOT_FOUND = "/404",
}

export enum AuthErrorCode {
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  PORTAL_ACCESS_DENIED = "PORTAL_ACCESS_DENIED",
  NETWORK_ERROR = "NETWORK_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  RATE_LIMITED = "RATE_LIMITED",
  ACCOUNT_LOCKED = "ACCOUNT_LOCKED",
  ACCOUNT_DISABLED = "ACCOUNT_DISABLED",
  EMAIL_NOT_VERIFIED = "EMAIL_NOT_VERIFIED",
  PASSWORD_RESET_REQUIRED = "PASSWORD_RESET_REQUIRED",
  INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",
  SESSION_CONFLICT = "SESSION_CONFLICT",
  FEATURE_DISABLED = "FEATURE_DISABLED",
  MAINTENANCE_MODE = "MAINTENANCE_MODE",
  ACCESS_DENIED = "ACCESS_DENIED",
  INVALID_ROLE = "INVALID_ROLE",
  INVALID_USER_ID = "INVALID_USER_ID",
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

// Core Types
export type User = {
  readonly id: string;
  readonly email: string;
  readonly fullName: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: UserRole;
  readonly avatar?: string;
  readonly portalAccess: {
    [PortalType.CLINIC]: boolean;
    [PortalType.INTERNAL]: boolean;
    [PortalType.PATIENT]: boolean;
    [PortalType.SEDATIONIST]: boolean;
  };
};

export type AuthState = {
  readonly user: User | null;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly errorCode: AuthErrorCode | null;
  readonly accessToken: string | null;
  readonly refreshToken: string | null;
  readonly tokenExpiry: number | null;
  readonly currentPortal: PortalType | null;
  readonly sessionId: string;
};

export const PORTALS = {
  [PortalType.CLINIC]: {
    name: "Clinic Portal",
    icon: "🏥",
    route: "/clinic",
    description:
      "Access patient records, schedule appointments, and manage clinic operations.",
  },
  [PortalType.INTERNAL]: {
    name: "Internal Portal",
    icon: "🏢",
    route: "/internal",
    description:
      "Access internal tools, manage users, and oversee clinic operations.",
  },
  [PortalType.PATIENT]: {
    name: "Patient Portal",
    icon: "👤",
    route: "/patient",
    description:
      "Access personal health information, communicate with providers, and manage appointments.",
  },
  [PortalType.SEDATIONIST]: {
    name: "Sedationist Portal",
    icon: "⚕️",
    route: "/sedationist",
    description:
      "Access sedation-related tools, manage patient sedation records, and collaborate with other providers.",
  },
} as const;

// Helper function
export const getPortalRoute = (portalType: PortalType) =>
  PORTALS[portalType].route;

// Storage keys - MOVE TO APP_CONFIG
export const STORAGE_KEYS = {
  AUTH_STATE: "auth-storage",
} as const;
