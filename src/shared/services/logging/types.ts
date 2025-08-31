export enum LogLevel {
  Debug = "debug",
  Info = "info",
  Warn = "warn",
  Error = "error",
  Fatal = "fatal",
}

export type LogContext = {
  userId?: string;
  userEmail?: string;
  userName?: string;
  userRole?: string;
  sessionId: string;
  feature?: string;
  action?: string;
  component?: string;
  metadata?: Record<string, any>;
};

export interface EnrichedLogData {
  // User Information
  userId?: string;
  userEmail?: string;
  userName?: string;
  userRole?: string;
  sessionId: string;

  // Time Information
  timestamp: string;
  timezone: string;
  utcOffset: number;

  // Location/Navigation
  url: string;
  pathname: string;
  search: string;
  hash: string;
  referrer: string;

  // Browser/Device Information
  userAgent: string;
  browser: string;
  platform: string;
  language: string;
  languages: string[];
  cookieEnabled: boolean;
  onLine: boolean;

  // Screen/Display
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  pixelRatio: number;
  colorDepth: number;

  // Performance
  performanceNow: number;
  memoryUsage?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };

  // Application Context
  applicationName: string;
  environment: string;
  buildVersion?: string;

  // Action/Event Context
  action?: string;
  component?: string;
  metadata?: Record<string, any>;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  context: Partial<LogContext>;
  data?: EnrichedLogData;
  source: string;
  environment: string;
}

export interface LogEnrichmentOptions {
  includeUserData?: boolean;
  includePerformanceData?: boolean;
  includeDeviceData?: boolean;
  includeLocationData?: boolean;
  action?: string;
  component?: string;
  metadata?: Record<string, any>;
}

export interface IDestinationService {
  sendAsync(entryOrEntries: LogEntry | LogEntry[]): Promise<void>;
  isReady?(): boolean;
  getFailedBatchStatus?(): {
    count: number;
    totalLogs: number;
    oldestBatch: number | null;
    logsByLevel: Record<string, number>;
  };
}

export interface ILogger {
  resetContext(context: Partial<LogContext>): void;
  addContext(context: Partial<LogContext>): void;
  child(additionalContext: Partial<LogContext>): ILogger;
  debug(message: string, data?: any): void;
  info(message: string, data?: any): void;
  warn(message: string, data?: any): void;
  error(message: string, error?: Error, data?: any): void;
  fatal(message: string, error?: Error, data?: any): void;
}

// Retry configuration for failed batches
export interface RetryConfig {
  readonly maxRetries: number;
  readonly baseDelayMs: number;
  readonly backoffMultiplier: number;
}

export interface FailedBatch {
  logs: LogEntry[];
  timestamp: number;
  attempts: number;
  nextRetryTime: number;
}
