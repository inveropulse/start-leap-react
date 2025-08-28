interface LogContext {
  [key: string]: any;
}

export const logger = {
  info: (message: string, context?: LogContext) => {
    console.log(`[INFO] ${message}`, context || {});
  },
  
  error: (message: string, error?: Error | any, context?: LogContext) => {
    console.error(`[ERROR] ${message}`, error || {}, context || {});
  },
  
  warn: (message: string, context?: LogContext) => {
    console.warn(`[WARN] ${message}`, context || {});
  },
  
  debug: (message: string, context?: LogContext) => {
    console.debug(`[DEBUG] ${message}`, context || {});
  }
};