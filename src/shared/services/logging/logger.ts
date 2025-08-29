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
  private readonly maxBufferSize = 100;
  private flushInterval: number | null = null;

  constructor() {
    this.context.sessionId = this.generateSessionId();

    // Flush buffer periodically in production
    if (APP_CONFIG.environment === Environment.Production) {
      this.flushInterval = setInterval(() => this.flushBuffer(), 30000); // Flush every 30 seconds
    }

    // Cleanup on page unload
    if (typeof window !== "undefined") {
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

      // Production logging
      if (APP_CONFIG.environment === Environment.Production) {
        this.addToBuffer(logEntry);
      }

      // Always send critical errors immediately
      if (level === "fatal" || level === "error") {
        this.sendToExternalServices([logEntry]).catch(() => {});
      }
    } catch (err) {
      console.error("Logger internal error:", err);
    }
  }

  private addToBuffer(logEntry: LogEntry): void {
    try {
      this.buffer.push(logEntry);

      if (this.buffer.length >= this.maxBufferSize) {
        this.flushBuffer().catch(() => {});
      }
    } catch (err) {}
  }

  private async flushBuffer(): Promise<void> {
    if (this.buffer.length === 0) return;

    const logsToSend = [...this.buffer];
    this.buffer = [];

    try {
      await this.sendToExternalServices(logsToSend);
    } catch (error) {
      // Re-add failed logs to buffer (with limit to prevent infinite growth)
      this.buffer = [...logsToSend.slice(-50), ...this.buffer];
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
