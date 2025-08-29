// src/lib/logger.ts - Enterprise logging solution
interface LogContext {
  userId?: string;
  sessionId: string;
  feature?: string;
  action?: string;
  metadata?: Record<string, any>;
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  context: Partial<LogContext>;
  data?: any;
  source: string;
  environment: string;
}

type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

interface ExternalLogService {
  send(logEntry: LogEntry): Promise<void>;
}

class Logger {
  private context: Partial<LogContext> = {};
  private externalServices: ExternalLogService[] = [];
  private buffer: LogEntry[] = [];
  private readonly maxBufferSize = 100;
  private flushInterval: number | null = null;

  constructor() {
    // Initialize session ID
    this.context.sessionId = this.generateSessionId();

    // Flush buffer periodically in production
    if (!import.meta.env.DEV) {
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

  setContext(context: Partial<LogContext>): void {
    this.context = { ...this.context, ...context };
  }

  addExternalService(service: ExternalLogService): void {
    this.externalServices.push(service);
  }

  debug(message: string, data?: any): void {
    this.log("debug", message, data);
  }

  info(message: string, data?: any): void {
    this.log("info", message, data);
  }

  warn(message: string, data?: any): void {
    this.log("warn", message, data);
  }

  error(message: string, error?: Error, data?: any): void {
    const errorData = {
      error: error?.stack,
      errorName: error?.name,
      errorMessage: error?.message,
      ...data,
    };
    this.log("error", message, errorData);
  }

  fatal(message: string, error?: Error, data?: any): void {
    const errorData = {
      error: error?.stack,
      errorName: error?.name,
      errorMessage: error?.message,
      ...data,
    };
    this.log("fatal", message, errorData);
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
        source: "sedation-solutions-portal",
        environment: import.meta.env.DEV ? "development" : "production",
      };

      // Development logging
      if (import.meta.env.DEV) {
        this.consoleLog(logEntry);
      }

      // Production logging
      if (!import.meta.env.DEV) {
        this.addToBuffer(logEntry);
      }

      // Always send critical errors immediately
      if (level === "fatal" || level === "error") {
        this.sendToExternalServices(logEntry).catch(() => {
          // Fail silently to prevent logging errors from breaking the app
        });
      }
    } catch (err) {
      // Fail silently to prevent logging errors from breaking the app
      console.error("Logger internal error:", err);
    }
  }

  private consoleLog(logEntry: LogEntry): void {
    try {
      const style = this.getConsoleStyle(logEntry.level);
      const timestamp = new Date(logEntry.timestamp).toLocaleTimeString();

      console.group(
        `%c[${logEntry.level.toUpperCase()}] ${timestamp} - ${
          logEntry.message
        }`,
        style
      );

      if (logEntry.context && Object.keys(logEntry.context).length > 0) {
        console.log("Context:", logEntry.context);
      }

      if (logEntry.data) {
        console.log("Data:", logEntry.data);
      }

      console.groupEnd();
    } catch (err) {
      // Fallback to simple console log
      console.log(
        `[${logEntry.level.toUpperCase()}]`,
        logEntry.message,
        logEntry.data
      );
    }
  }

  private getConsoleStyle(level: LogLevel): string {
    const styles = {
      debug: "color: #6B7280; font-weight: normal;",
      info: "color: #3B82F6; font-weight: bold;",
      warn: "color: #F59E0B; font-weight: bold;",
      error: "color: #EF4444; font-weight: bold;",
      fatal: "color: #DC2626; font-weight: bold; background: #FEE2E2;",
    };
    return styles[level];
  }

  private addToBuffer(logEntry: LogEntry): void {
    try {
      this.buffer.push(logEntry);

      if (this.buffer.length >= this.maxBufferSize) {
        this.flushBuffer().catch(() => {
          // Fail silently
        });
      }
    } catch (err) {
      // Fail silently
    }
  }

  private async flushBuffer(): Promise<void> {
    if (this.buffer.length === 0) return;

    const logsToSend = [...this.buffer];
    this.buffer = [];

    try {
      await Promise.all(
        logsToSend.map((logEntry) => this.sendToExternalServices(logEntry))
      );
    } catch (error) {
      // Re-add failed logs to buffer (with limit to prevent infinite growth)
      this.buffer = [...logsToSend.slice(-50), ...this.buffer];
    }
  }

  private async sendToExternalServices(logEntry: LogEntry): Promise<void> {
    if (this.externalServices.length === 0) return;

    const promises = this.externalServices.map((service) =>
      service.send(logEntry).catch((error) => {
        // Fail silently for external services
        if (import.meta.env.DEV) {
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

  // Utility method to create child loggers with extended context
  child(additionalContext: Partial<LogContext>): Logger {
    try {
      const childLogger = new Logger();
      childLogger.setContext({ ...this.context, ...additionalContext });
      childLogger.externalServices = this.externalServices;
      return childLogger;
    } catch {
      // Return main logger as fallback
      return this;
    }
  }
}

// Create singleton instance
export const logger = new Logger();

// Export types for use in other files
export type { LogContext, LogEntry, LogLevel, ExternalLogService };
