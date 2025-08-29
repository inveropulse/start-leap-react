import {
  useRef,
  useMemo,
  useEffect,
  useContext,
  createContext,
  PropsWithChildren,
} from "react";
import { logger } from "../logging/logger";
import { APP_CONFIG, Environment } from "../AppConfig";
import { ILogger, LogContext } from "../logging/types";
import { SendLogRequest, useSendLogRequest } from "@/api/logging/sendLog";
import { ExternalApiLogDestination } from "../logging/destination/externalApi";

const LoggingContext = createContext<ILogger>(undefined!);

export default function LoggingProvider(props: PropsWithChildren) {
  const sendLogRequest = useSendLogRequest();

  const isInitialized = useRef(false);
  useEffect(() => {
    if (isInitialized.current) return;
    setupLogging((logRequest) => {
      sendLogRequest.mutate(logRequest);
    });
    setupGlobalErrorHandlers();
    isInitialized.current = true;
  }, []);

  return (
    <LoggingContext.Provider value={logger}>
      {props.children}
    </LoggingContext.Provider>
  );
}

export function useLogging(logContext?: Partial<LogContext>) {
  const log = useContext(LoggingContext);

  if (log == null) {
    throw new Error(
      `Invocations to ${useLogging.name} should be within a node that is a child of ${LoggingProvider.name}`
    );
  }

  return useMemo(() => {
    return logContext ? log.child(logContext) : log;
  }, [logContext, log]);
}

function setupLogging(sendLogFn: (request: SendLogRequest) => void) {
  if (APP_CONFIG.environment === Environment.Development) {
    const api = new ExternalApiLogDestination();
    api.initialize(sendLogFn);
    logger.addExternalService(api);
  }

  logger.addContext({
    metadata: {
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      version: APP_CONFIG.version,
      environment: APP_CONFIG.environment,
    },
  });

  logger.info("🔧 Logging system initialized", {
    services:
      APP_CONFIG.environment === Environment.Production
        ? ["external api destination"]
        : ["console destination"],
  });
}

function setupGlobalErrorHandlers() {
  // Global error handlers
  const handleUncaughtError = (event: ErrorEvent) => {
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
      console.error("Logger failed in global error handler:", err);
    }
  };

  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    try {
      const error =
        event.reason instanceof Error
          ? event.reason
          : new Error(String(event.reason));

      logger.error("Unhandled promise rejection", error, {
        reason: event.reason,
        source: "unhandled-rejection-handler",
      });
    } catch (err) {
      console.error("Logger failed in unhandled rejection handler:", err);
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("error", handleUncaughtError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
  }
}
