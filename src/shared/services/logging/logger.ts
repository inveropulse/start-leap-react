import {
  ILogger,
  LogLevel,
  LogEntry,
  LogContext,
  IDestinationService,
} from "./types";
import { APP_CONFIG, Environment } from "../../AppConfig";
import { ConsoleDestination } from "./destination/console";
import { ExternalApiLogDestination } from "./destination/externalApi";

class Logger implements ILogger {
  private context: Partial<LogContext> = {};
  private externalDestinations: IDestinationService[] = [
    new ExternalApiLogDestination(),
  ];
  private consoleDestination: IDestinationService = new ConsoleDestination();
  private buffer: LogEntry[] = [];
  private readonly maxBufferSize = 300; // Increased from 200 to 300
  private flushInterval: number | null = null;
  private isFlushPending = false; // Prevent concurrent flushes

  constructor() {
    this.context.sessionId = this.generateSessionId();

    // Flush buffer periodically in production
    if (APP_CONFIG.environment === Environment.Production) {
      this.flushInterval = setInterval(() => this.smartFlush(), 45000); // Reduced to 45s for better responsiveness
    }

    // Enhanced cleanup on page visibility change
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
          this.flushBuffer();
        }
      });

      window.addEventListener("beforeunload", () => {
        this.flushBuffer();
        if (this.flushInterval) {
          clearInterval(this.flushInterval);
        }
      });
    }
  }

  resetContext(context: Partial<LogContext>): void {
    this.context = { ...context };
  }

  addContext(context: Partial<LogContext>): void {
    this.context = { ...this.context, ...context };
  }

  child(additionalContext: Partial<LogContext>): Logger {
    try {
      const childLogger = new Logger();
      childLogger.addContext({ ...this.context, ...additionalContext });
      childLogger.externalDestinations = this.externalDestinations;
      return childLogger;
    } catch {
      // Return main logger as fallback
      return this;
    }
  }

  debug(message: string, data?: any): void {
    this.log(LogLevel.Debug, message, data);
  }

  info(message: string, data?: any): void {
    this.log(LogLevel.Info, message, data);
  }

  warn(message: string, data?: any): void {
    this.log(LogLevel.Warn, message, data);
  }

  error(message: string, error?: Error, data?: any): void {
    const errorData = {
      error: error?.stack,
      errorName: error?.name,
      errorMessage: error?.message,
      ...data,
    };
    this.log(LogLevel.Error, message, errorData);
  }

  fatal(message: string, error?: Error, data?: any): void {
    const errorData = {
      error: error?.stack,
      errorName: error?.name,
      errorMessage: error?.message,
      ...data,
    };
    this.log(LogLevel.Fatal, message, errorData);
  }

  private log(level: LogLevel, message: string, data?: any): void {
    try {
      const logEntry: LogEntry = {
        id: this.generateLogId(),
        timestamp: new Date().toISOString(),
        level,
        message,
        context: { ...this.context },
        data,
        source: APP_CONFIG.applicationName,
        environment: APP_CONFIG.environment,
      };

      // Development logging
      if (APP_CONFIG.environment === Environment.Development) {
        this.consoleDestination.sendAsync(logEntry);
      }

      // Production logging - always buffer, even critical errors
      if (APP_CONFIG.environment === Environment.Production) {
        this.addToBuffer(logEntry);

        // For critical errors, force a flush but don't send individually
        if (level === "fatal" || level === "error") {
          this.flushBuffer().catch(() => {});
        }
      }
    } catch (err) {
      console.error("Logger internal error:", err);
    }
  }

  private addToBuffer(logEntry: LogEntry): void {
    try {
      this.buffer.push(logEntry);

      // Smart flush based on log level and buffer size
      if (this.shouldTriggerFlush()) {
        this.smartFlush();
      }
    } catch (err) {}
  }

  private shouldTriggerFlush(): boolean {
    if (this.buffer.length >= this.maxBufferSize) {
      return true;
    }

    // Flush if we have critical logs and buffer is getting full
    const criticalLogs = this.buffer.filter(
      (log) => log.level === "fatal" || log.level === "error"
    );
    if (criticalLogs.length > 0 && this.buffer.length >= 50) {
      return true;
    }

    return false;
  }

  private async smartFlush(): Promise<void> {
    if (this.isFlushPending || this.buffer.length === 0) {
      return;
    }

    this.isFlushPending = true;
    try {
      await this.flushBuffer();
    } finally {
      this.isFlushPending = false;
    }
  }

  private async flushBuffer(): Promise<void> {
    if (this.buffer.length === 0) return;

    const logsToSend = [...this.buffer];
    this.buffer = [];

    try {
      await this.sendToExternalServices(logsToSend);
    } catch (error) {
      // Only re-add critical logs if flush fails
      const criticalLogs = logsToSend.filter(
        (log) => log.level === "fatal" || log.level === "error"
      );
      this.buffer = [...criticalLogs.slice(-50), ...this.buffer];
    }
  }

  private async sendToExternalServices(entries: LogEntry[]): Promise<void> {
    if (this.externalDestinations.length === 0) return;

    const promises = this.externalDestinations.map((service) =>
      service.sendAsync(entries).catch((error) => {
        if (APP_CONFIG.environment === Environment.Development) {
          console.warn("External logging service failed:", error);
        }
      })
    );

    await Promise.allSettled(promises);
  }

  private generateSessionId(): string {
    try {
      return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    } catch {
      return `session_${Date.now()}_fallback`;
    }
  }

  private generateLogId(): string {
    try {
      return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    } catch {
      return `log_${Date.now()}_${Math.random()}`;
    }
  }
}

export const logger = new Logger();
