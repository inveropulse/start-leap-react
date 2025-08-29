// src/lib/logging/setup.ts
import { logger } from "../logger";
import { MockExternalLogService } from "./mockExternalService";

// Initialize external logging services
export const mockDataDogService = new MockExternalLogService("DataDog-Mock");
export const mockSentryService = new MockExternalLogService("Sentry-Mock");

// Add services to logger
logger.addExternalService(mockDataDogService);
logger.addExternalService(mockSentryService);

// Global error handler for uncaught JavaScript errors
const handleGlobalError = (event: ErrorEvent) => {
  try {
    logger.error(
      "Uncaught JavaScript error",
      new Error(event.error || event.message),
      {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        source: "global-error-handler",
      }
    );
  } catch (err) {
    // Fail silently to prevent infinite error loops
    console.error("Logger failed in global error handler:", err);
  }
};

// Unhandled promise rejection handler
const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
  try {
    logger.error(
      "Unhandled promise rejection",
      event.reason instanceof Error
        ? event.reason
        : new Error(String(event.reason)),
      {
        reason: event.reason,
        source: "unhandled-rejection-handler",
      }
    );
  } catch (err) {
    // Fail silently to prevent infinite error loops
    console.error("Logger failed in unhandled rejection handler:", err);
  }
};

// Setup global error handling (only in browser environment)
if (typeof window !== "undefined") {
  // Remove existing listeners to prevent duplicates
  window.removeEventListener("error", handleGlobalError);
  window.removeEventListener("unhandledrejection", handleUnhandledRejection);

  // Add new listeners
  window.addEventListener("error", handleGlobalError);
  window.addEventListener("unhandledrejection", handleUnhandledRejection);
}

// Initialize logger context with application info
logger.setContext({
  metadata: {
    userAgent:
      typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
    timestamp: new Date().toISOString(),
    version: "1.0.0", // You can replace this with your app version
  },
});

// Log that the logging system has been initialized
logger.info("Logging system initialized", {
  environment: import.meta.env.DEV ? "development" : "production",
  services: ["DataDog-Mock", "Sentry-Mock"],
});

export { logger };
