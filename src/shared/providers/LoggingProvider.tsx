import {
  useRef,
  useMemo,
  useEffect,
  useContext,
  createContext,
  PropsWithChildren,
} from "react";
import { logger } from "../services/logging/logger";
import { APP_CONFIG, Environment } from "../AppConfig";
import { ILogger, LogContext } from "../services/logging/types";

const LoggingContext = createContext<ILogger>(undefined!);

export default function LoggingProvider(props: PropsWithChildren) {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    setupLogging();
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

function setupLogging() {
  // Add global context metadata
  logger.addContext({
    metadata: {
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      version: APP_CONFIG.version,
      environment: APP_CONFIG.environment,
    },
  });

  // Log initialization - ExternalApiLogDestination is now automatically included
  logger.info("🔧 Logging system initialized", {
    services:
      APP_CONFIG.environment == Environment.Production
        ? ["external api destination"]
        : ["console destination"],
  });
}
