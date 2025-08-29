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
};

const DEFAULT_CONFIG: AppConfig = {
  applicationName: "Sedation Solutions Hub",
  apiBaseUrl: "http://localhost:3000/api",
  apiTimeout: 10000, // 10 seconds
  environment: Environment.Development,
  version: "1.0.0",
} as const;

export class ApplicationConfig {
  private static config: AppConfig | null = null;

  static createConfig(): AppConfig {
    if (ApplicationConfig.config) return ApplicationConfig.config;

    ApplicationConfig.config = {
      applicationName:
        import.meta.env.VITE_APP_NAME || DEFAULT_CONFIG.applicationName,
      apiBaseUrl:
        import.meta.env.VITE_API_BASE_URL || DEFAULT_CONFIG.apiBaseUrl,
      apiTimeout:
        Number(import.meta.env.VITE_API_TIMEOUT) || DEFAULT_CONFIG.apiTimeout,
      environment:
        (import.meta.env.MODE as Environment) || Environment.Development,
      version: import.meta.env.VITE_VERSION || DEFAULT_CONFIG.version,
    };

    return ApplicationConfig.config;
  }
}

export const APP_CONFIG = ApplicationConfig.createConfig();
