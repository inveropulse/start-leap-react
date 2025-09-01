export enum Environment {
  Development = "development",
  Production = "production",
}

export type AppConfig = {
  readonly applicationName: string;
  readonly apiBaseUrl: string;
  readonly apiTimeout: number;
  readonly environment: Environment;
  readonly version: string;
  readonly auth: {
    readonly authStorageKey: string;
    readonly encryptionKey: string;
    readonly tokenRefreshThreshold: number;
    readonly sessionTimeout: number;
    readonly maxLoginAttempts: number;
    readonly tokenLifetime: number;
    readonly lockoutDuration: number;
    readonly sessionWarningTime: number;
    readonly enableSecurityHeaders: boolean;
    readonly requireHttps: boolean;
  };
  readonly security: {
    readonly enableCSP: boolean;
    readonly enableHSTS: boolean;
    readonly maxRequestSize: number;
    readonly rateLimit: {
      readonly enabled: boolean;
      readonly maxRequests: number;
      readonly windowMs: number;
    };
  };
  readonly logging: {
    readonly level: "debug" | "info" | "warn" | "error";
    readonly enableConsole: boolean;
    readonly enableRemote: boolean;
    readonly maxLogSize: number;
    readonly logRetentionDays: number;
  };
};

const DEFAULT_CONFIG: AppConfig = {
  applicationName: "Sedation Solutions Hub",
  apiBaseUrl: "http://localhost:3000/api",
  apiTimeout: 10000, // 10 seconds
  environment: Environment.Development,
  version: "1.0.0",
  auth: {
    authStorageKey: "auth-storage",
    encryptionKey: "dev-fallback-key-change-in-production",
    tokenRefreshThreshold: 5 * 60 * 1000, // 5 minutes in milliseconds
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    maxLoginAttempts: 5,
    tokenLifetime: 60 * 60, // 1 hour in seconds
    lockoutDuration: 15 * 60 * 1000, // 15 minutes in milliseconds
    sessionWarningTime: 10 * 60 * 1000, // 10 minutes warning before expiry
    enableSecurityHeaders: true,
    requireHttps: false, // false for development
  },
  security: {
    enableCSP: true,
    enableHSTS: false, // false for development, true for production
    maxRequestSize: 10 * 1024 * 1024, // 10MB
    rateLimit: {
      enabled: true,
      maxRequests: 100,
      windowMs: 15 * 60 * 1000, // 15 minutes
    },
  },
  logging: {
    level: "debug", // debug for development
    enableConsole: true,
    enableRemote: false, // false for development
    maxLogSize: 1 * 1024 * 1024, // 1MB
    logRetentionDays: 7,
  },
} as const;

// Simplified config builder utility
const getEnvValue = <T>(
  envKey: string,
  defaultValue: T,
  transform?: (value: string) => T
): T => {
  const envValue = import.meta.env[envKey];
  if (!envValue) return defaultValue;
  return transform ? transform(envValue) : (envValue as T);
};

const isProduction = () => import.meta.env.MODE === "production";

export class ApplicationConfig {
  private static config: AppConfig | null = null;

  static createConfig(): AppConfig {
    if (ApplicationConfig.config) return ApplicationConfig.config;

    ApplicationConfig.config = {
      applicationName: getEnvValue(
        "VITE_APP_NAME",
        DEFAULT_CONFIG.applicationName
      ),
      apiBaseUrl: getEnvValue("VITE_API_BASE_URL", DEFAULT_CONFIG.apiBaseUrl),
      apiTimeout: getEnvValue(
        "VITE_API_TIMEOUT",
        DEFAULT_CONFIG.apiTimeout,
        Number
      ),
      environment: getEnvValue(
        "MODE",
        DEFAULT_CONFIG.environment
      ) as Environment,
      version: getEnvValue("VITE_VERSION", DEFAULT_CONFIG.version),

      auth: {
        authStorageKey: getEnvValue(
          "VITE_AUTH_STORAGE_KEY",
          DEFAULT_CONFIG.auth.authStorageKey
        ),
        encryptionKey: getEnvValue(
          "VITE_ENCRYPTION_KEY",
          DEFAULT_CONFIG.auth.encryptionKey
        ),
        tokenRefreshThreshold: getEnvValue(
          "VITE_TOKEN_REFRESH_THRESHOLD",
          DEFAULT_CONFIG.auth.tokenRefreshThreshold,
          Number
        ),
        sessionTimeout: getEnvValue(
          "VITE_SESSION_TIMEOUT",
          DEFAULT_CONFIG.auth.sessionTimeout,
          Number
        ),
        maxLoginAttempts: getEnvValue(
          "VITE_MAX_LOGIN_ATTEMPTS",
          DEFAULT_CONFIG.auth.maxLoginAttempts,
          Number
        ),
        tokenLifetime: getEnvValue(
          "VITE_TOKEN_LIFETIME",
          DEFAULT_CONFIG.auth.tokenLifetime,
          Number
        ),
        lockoutDuration: getEnvValue(
          "VITE_LOCKOUT_DURATION",
          DEFAULT_CONFIG.auth.lockoutDuration,
          Number
        ),
        sessionWarningTime: getEnvValue(
          "VITE_SESSION_WARNING_TIME",
          DEFAULT_CONFIG.auth.sessionWarningTime,
          Number
        ),
        enableSecurityHeaders: getEnvValue(
          "VITE_ENABLE_SECURITY_HEADERS",
          DEFAULT_CONFIG.auth.enableSecurityHeaders,
          (v) => v === "true"
        ),
        requireHttps: getEnvValue(
          "VITE_REQUIRE_HTTPS",
          DEFAULT_CONFIG.auth.requireHttps || isProduction(),
          (v) => v === "true"
        ),
      },

      security: {
        enableCSP: getEnvValue(
          "VITE_ENABLE_CSP",
          DEFAULT_CONFIG.security.enableCSP,
          (v) => v !== "false"
        ),
        enableHSTS: getEnvValue(
          "VITE_ENABLE_HSTS",
          DEFAULT_CONFIG.security.enableHSTS || isProduction(),
          (v) => v === "true"
        ),
        maxRequestSize: getEnvValue(
          "VITE_MAX_REQUEST_SIZE",
          DEFAULT_CONFIG.security.maxRequestSize,
          Number
        ),
        rateLimit: {
          enabled: getEnvValue(
            "VITE_RATE_LIMIT_ENABLED",
            DEFAULT_CONFIG.security.rateLimit.enabled,
            (v) => v !== "false"
          ),
          maxRequests: getEnvValue(
            "VITE_RATE_LIMIT_MAX_REQUESTS",
            DEFAULT_CONFIG.security.rateLimit.maxRequests,
            Number
          ),
          windowMs: getEnvValue(
            "VITE_RATE_LIMIT_WINDOW_MS",
            DEFAULT_CONFIG.security.rateLimit.windowMs,
            Number
          ),
        },
      },

      logging: {
        level: getEnvValue(
          "VITE_LOG_LEVEL",
          isProduction() ? "error" : DEFAULT_CONFIG.logging.level
        ) as "debug" | "info" | "warn" | "error",
        enableConsole: getEnvValue(
          "VITE_ENABLE_CONSOLE_LOGGING",
          DEFAULT_CONFIG.logging.enableConsole,
          (v) => v !== "false"
        ),
        enableRemote: getEnvValue(
          "VITE_ENABLE_REMOTE_LOGGING",
          DEFAULT_CONFIG.logging.enableRemote || isProduction(),
          (v) => v === "true"
        ),
        maxLogSize: getEnvValue(
          "VITE_MAX_LOG_SIZE",
          DEFAULT_CONFIG.logging.maxLogSize,
          Number
        ),
        logRetentionDays: getEnvValue(
          "VITE_LOG_RETENTION_DAYS",
          DEFAULT_CONFIG.logging.logRetentionDays,
          Number
        ),
      },
    };

    return ApplicationConfig.config;
  }
}

export const APP_CONFIG = ApplicationConfig.createConfig();
