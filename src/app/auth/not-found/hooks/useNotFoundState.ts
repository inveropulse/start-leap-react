import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLogging } from "@/shared/providers/LoggingProvider";
import { useAuth } from "@/shared/services/auth/hooks";

export function useNotFoundState() {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const logger = useLogging({
    feature: "NotFoundPage",
    metadata: { component: "NotFoundPage" },
  });

  const currentPath = location.pathname;

  // Log 404 access
  useEffect(() => {
    logger.info("404 page accessed", {
      path: currentPath,
      isAuthenticated,
      user: user?.email || "anonymous",
      referrer: document.referrer,
      action: "404-access",
    });
  }, [logger, currentPath, isAuthenticated, user?.email]);

  return {
    currentPath,
    isAuthenticated,
    user,
  };
}
