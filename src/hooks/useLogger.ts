// src/hooks/useLogger.ts
import { useEffect, useMemo } from "react";
import { logger } from "../lib/logger";
import type { LogContext } from "../lib/logger";

interface UseLoggerOptions {
  feature?: string;
  userId?: string;
  action?: string;
  metadata?: Record<string, any>;
}

export const useLogger = (options: UseLoggerOptions = {}) => {
  // Create a child logger with the provided context
  const childLogger = useMemo(() => {
    const context: Partial<LogContext> = {};

    if (options.feature) context.feature = options.feature;
    if (options.userId) context.userId = options.userId;
    if (options.action) context.action = options.action;
    if (options.metadata) context.metadata = options.metadata;

    return logger.child(context);
  }, [options.feature, options.userId, options.action, options.metadata]);

  // Log component lifecycle events
  useEffect(() => {
    if (options.feature) {
      childLogger.debug(`Feature mounted: ${options.feature}`);
    }

    return () => {
      if (options.feature) {
        childLogger.debug(`Feature unmounted: ${options.feature}`);
      }
    };
  }, [childLogger, options.feature]);

  return childLogger;
};

// Hook for error boundary logging
export const useErrorLogger = (componentName: string) => {
  const childLogger = useMemo(() => {
    return logger.child({
      feature: "error-boundary",
      metadata: { componentName },
    });
  }, [componentName]);

  const logError = (error: Error, errorInfo?: any) => {
    childLogger.error(`Error in ${componentName}`, error, {
      errorInfo,
      componentStack: errorInfo?.componentStack,
    });
  };

  return { logError };
};

// Hook for API call logging
export const useApiLogger = (apiEndpoint: string) => {
  const childLogger = useMemo(() => {
    return logger.child({
      feature: "api-calls",
      metadata: { endpoint: apiEndpoint },
    });
  }, [apiEndpoint]);

  const logApiCall = (method: string, data?: any) => {
    childLogger.info(`API ${method} call to ${apiEndpoint}`, data);
  };

  const logApiSuccess = (method: string, responseData?: any) => {
    childLogger.info(`API ${method} success for ${apiEndpoint}`, responseData);
  };

  const logApiError = (method: string, error: Error, requestData?: any) => {
    childLogger.error(
      `API ${method} failed for ${apiEndpoint}`,
      error,
      requestData
    );
  };

  return {
    logApiCall,
    logApiSuccess,
    logApiError,
  };
};
