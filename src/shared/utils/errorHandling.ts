import { AuthErrorCode } from "../services/auth/types";

/**
 * Enhanced error class for authentication-related errors
 */
export class AuthError extends Error {
  public readonly code: AuthErrorCode;
  public readonly details?: any;
  public readonly timestamp: number;
  public readonly userAction?: string;

  constructor(
    code: AuthErrorCode,
    message: string,
    details?: any,
    userAction?: string
  ) {
    super(message);
    this.name = "AuthError";
    this.code = code;
    this.details = details;
    this.timestamp = Date.now();
    this.userAction = userAction;

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, AuthError.prototype);
  }

  /**
   * Creates a user-friendly error message
   */
  toUserMessage(): string {
    switch (this.code) {
      case AuthErrorCode.INVALID_CREDENTIALS:
        return "Invalid email or password. Please check your credentials and try again.";

      case AuthErrorCode.TOKEN_EXPIRED:
        return "Your session has expired. Please sign in again.";

      case AuthErrorCode.PORTAL_ACCESS_DENIED:
        return "You don't have permission to access this portal. Please contact your administrator.";

      case AuthErrorCode.NETWORK_ERROR:
        return "Connection failed. Please check your internet connection and try again.";

      case AuthErrorCode.SERVER_ERROR:
        return "Server is temporarily unavailable. Please try again later.";

      case AuthErrorCode.VALIDATION_ERROR:
        return this.details?.fieldErrors
          ? "Please correct the highlighted fields and try again."
          : "Please check your input and try again.";

      case AuthErrorCode.RATE_LIMITED:
        return "Too many requests. Please wait a moment before trying again.";

      case AuthErrorCode.ACCOUNT_LOCKED:
        return "Your account has been temporarily locked. Please contact support.";

      case AuthErrorCode.ACCOUNT_DISABLED:
        return "Your account is disabled. Please contact your administrator.";

      case AuthErrorCode.EMAIL_NOT_VERIFIED:
        return "Please verify your email address before signing in.";

      case AuthErrorCode.PASSWORD_RESET_REQUIRED:
        return "You must reset your password before continuing.";

      case AuthErrorCode.INSUFFICIENT_PERMISSIONS:
        return "You don't have sufficient permissions for this action.";

      case AuthErrorCode.SESSION_CONFLICT:
        return "Another session is active. Please sign out from other devices.";

      case AuthErrorCode.FEATURE_DISABLED:
        return "This feature is currently unavailable.";

      case AuthErrorCode.MAINTENANCE_MODE:
        return "The system is undergoing maintenance. Please try again later.";

      default:
        return (
          this.message || "An unexpected error occurred. Please try again."
        );
    }
  }

  /**
   * Determines if the error is recoverable by the user
   */
  isRecoverable(): boolean {
    const recoverableErrors = [
      AuthErrorCode.INVALID_CREDENTIALS,
      AuthErrorCode.VALIDATION_ERROR,
      AuthErrorCode.NETWORK_ERROR,
      AuthErrorCode.RATE_LIMITED,
      AuthErrorCode.EMAIL_NOT_VERIFIED,
    ];

    return recoverableErrors.includes(this.code);
  }

  /**
   * Determines if the error requires re-authentication
   */
  requiresReauth(): boolean {
    const reauthErrors = [
      AuthErrorCode.TOKEN_EXPIRED,
      AuthErrorCode.SESSION_CONFLICT,
      AuthErrorCode.PASSWORD_RESET_REQUIRED,
      AuthErrorCode.ACCOUNT_LOCKED,
      AuthErrorCode.ACCOUNT_DISABLED,
    ];

    return reauthErrors.includes(this.code);
  }

  /**
   * Gets suggested user actions for the error
   */
  getSuggestedActions(): string[] {
    switch (this.code) {
      case AuthErrorCode.INVALID_CREDENTIALS:
        return [
          "Double-check your email and password",
          "Use 'Forgot Password' if you can't remember your password",
          "Ensure Caps Lock is not enabled",
        ];

      case AuthErrorCode.TOKEN_EXPIRED:
        return ["Sign in again to continue"];

      case AuthErrorCode.NETWORK_ERROR:
        return [
          "Check your internet connection",
          "Try refreshing the page",
          "Contact IT support if the problem persists",
        ];

      case AuthErrorCode.EMAIL_NOT_VERIFIED:
        return [
          "Check your email for a verification link",
          "Click 'Resend verification email' if needed",
          "Check your spam/junk folder",
        ];

      case AuthErrorCode.ACCOUNT_LOCKED:
        return [
          "Wait for the lockout period to expire",
          "Contact your administrator",
          "Use account recovery options",
        ];

      default:
        return ["Try again later", "Contact support if the problem continues"];
    }
  }

  /**
   * Converts the error to a JSON representation for logging
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp,
      userAction: this.userAction,
      stack: this.stack,
    };
  }
}

/**
 * Error factory for creating consistent AuthError instances
 */
export class AuthErrorFactory {
  static fromApiError(error: any, userAction?: string): AuthError {
    // Handle different API error formats
    const status = error?.response?.status || error?.status;
    const data = error?.response?.data || error?.data || {};
    const message = data.message || error.message || "Unknown error";

    let code: AuthErrorCode;

    switch (status) {
      case 400:
        code =
          data.code === "VALIDATION_ERROR"
            ? AuthErrorCode.VALIDATION_ERROR
            : AuthErrorCode.INVALID_CREDENTIALS;
        break;
      case 401:
        code = AuthErrorCode.TOKEN_EXPIRED;
        break;
      case 403:
        code = AuthErrorCode.PORTAL_ACCESS_DENIED;
        break;
      case 429:
        code = AuthErrorCode.RATE_LIMITED;
        break;
      case 423:
        code = AuthErrorCode.ACCOUNT_LOCKED;
        break;
      case 500:
      case 502:
      case 503:
        code = AuthErrorCode.SERVER_ERROR;
        break;
      default:
        if (error.code === "NETWORK_ERROR" || !status) {
          code = AuthErrorCode.NETWORK_ERROR;
        } else {
          code = AuthErrorCode.SERVER_ERROR;
        }
    }

    return new AuthError(code, message, data, userAction);
  }

  static invalidCredentials(details?: any): AuthError {
    return new AuthError(
      AuthErrorCode.INVALID_CREDENTIALS,
      "Invalid email or password",
      details,
      "login"
    );
  }

  static tokenExpired(details?: any): AuthError {
    return new AuthError(
      AuthErrorCode.TOKEN_EXPIRED,
      "Session expired",
      details,
      "refresh_token"
    );
  }

  static portalAccessDenied(portalId: string, details?: any): AuthError {
    return new AuthError(
      AuthErrorCode.PORTAL_ACCESS_DENIED,
      `Access denied to ${portalId} portal`,
      { portalId, ...details },
      "portal_access"
    );
  }

  static networkError(details?: any): AuthError {
    return new AuthError(
      AuthErrorCode.NETWORK_ERROR,
      "Network connection failed",
      details,
      "network_request"
    );
  }

  static validationError(
    fieldErrors: Record<string, string>,
    details?: any
  ): AuthError {
    return new AuthError(
      AuthErrorCode.VALIDATION_ERROR,
      "Validation failed",
      { fieldErrors, ...details },
      "form_validation"
    );
  }

  static rateLimited(context?: {
    retryAfter?: number;
    endpoint?: string;
    details?: string;
  }): AuthError {
    return new AuthError(
      AuthErrorCode.RATE_LIMITED,
      `Too many requests. Please wait ${
        context?.retryAfter || 5
      } seconds before trying again.`,
      {
        endpoint: context?.endpoint,
        retryAfter: context?.retryAfter,
        details: context?.details,
      },
      "rate_limit_exceeded"
    );
  }

  static serverError(context?: {
    status?: number;
    endpoint?: string;
    details?: string;
  }): AuthError {
    const statusCode = context?.status || 500;

    return new AuthError(
      AuthErrorCode.SERVER_ERROR,
      statusCode >= 500
        ? `Server error (${statusCode}). The service is temporarily unavailable.`
        : `Request failed (${statusCode}). Please check your request and try again.`,
      {
        endpoint: context?.endpoint,
        status: statusCode,
        details: context?.details,
      },
      "server_error"
    );
  }
}

/**
 * Type guard to check if an error is an AuthError
 */
export function isAuthError(error: any): error is AuthError {
  return error instanceof AuthError;
}

/**
 * Utility to safely extract error information from unknown error types
 */
export function extractErrorInfo(error: unknown): {
  message: string;
  code?: AuthErrorCode;
  details?: any;
} {
  if (isAuthError(error)) {
    return {
      message: error.toUserMessage(),
      code: error.code,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      details: { originalError: error.name },
    };
  }

  if (typeof error === "string") {
    return { message: error };
  }

  return {
    message: "An unexpected error occurred",
    details: { unknownError: error },
  };
}
