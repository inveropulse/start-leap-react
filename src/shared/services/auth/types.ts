import { PortalType, AuthenticatedUser } from "@/shared/types";

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

export type AuthState = {
  readonly user: AuthenticatedUser | null;
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
