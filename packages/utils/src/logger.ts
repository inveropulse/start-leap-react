export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  userId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  [key: string]: unknown;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: LogContext;
  timestamp: string;
  error?: Error;
}

export interface ExternalLogService {
  log(entry: LogEntry): Promise<void> | void;
}

class Logger {
  private context: LogContext = {};
  private externalServices: ExternalLogService[] = [];
  private minLevel: LogLevel;

  constructor() {
    this.minLevel = this.getMinLogLevel();
  }

  private getMinLogLevel(): LogLevel {
    const env = typeof window !== 'undefined' 
      ? (window as any).__APP_ENV__ || 'development'
      : process.env.NODE_ENV || 'development';
    
    return env === 'production' ? 'warn' : 'debug';
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
    return levels[level] >= levels[this.minLevel];
  }

  setContext(context: LogContext): void {
    this.context = { ...this.context, ...context };
  }

  clearContext(): void {
    this.context = {};
  }

  addExternalService(service: ExternalLogService): void {
    this.externalServices.push(service);
  }

  private async logEntry(level: LogLevel, message: string, contextOrError?: LogContext | Error, error?: Error): Promise<void> {
    if (!this.shouldLog(level)) return;

    let logContext: LogContext | undefined;
    let logError: Error | undefined;

    if (contextOrError instanceof Error) {
      logError = contextOrError;
      logContext = undefined;
    } else {
      logContext = contextOrError;
      logError = error;
    }

    const entry: LogEntry = {
      level,
      message,
      context: { ...this.context, ...logContext },
      timestamp: new Date().toISOString(),
      error: logError
    };

    // Console logging for development
    if (this.minLevel === 'debug') {
      const consoleMethod = level === 'debug' ? 'log' : level;
      console[consoleMethod](`[${entry.timestamp}] ${level.toUpperCase()}: ${message}`, {
        context: entry.context,
        error: entry.error
      });
    }

    // External services
    await Promise.allSettled(
      this.externalServices.map(service => service.log(entry))
    );
  }

  debug(message: string, context?: LogContext): void {
    this.logEntry('debug', message, context);
  }

  info(message: string, context?: LogContext): void {
    this.logEntry('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.logEntry('warn', message, context);
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.logEntry('error', message, context, error);
  }
}

export const logger = new Logger();