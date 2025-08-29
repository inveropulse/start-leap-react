export type LogContext = {
  userId?: string;
  sessionId: string;
  feature?: string;
  action?: string;
  metadata?: Record<string, any>;
};

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  context: Partial<LogContext>;
  data?: any;
  source: string;
  environment: string;
}

export enum LogLevel {
  Debug = "debug",
  Info = "info",
  Warn = "warn",
  Error = "error",
  Fatal = "fatal",
}

export interface IDestinationService {
  sendAsync(entryOrEntries: LogEntry | LogEntry[]): Promise<void>;
}

export interface ILogger {
  resetContext(context: Partial<LogContext>): void;
  addContext(context: Partial<LogContext>): void;
  addExternalService(service: IDestinationService): void;
  child(additionalContext: Partial<LogContext>): ILogger;
  debug(message: string, data?: any): void;
  info(message: string, data?: any): void;
  warn(message: string, data?: any): void;
  error(message: string, error?: Error, data?: any): void;
  fatal(message: string, error?: Error, data?: any): void;
}
