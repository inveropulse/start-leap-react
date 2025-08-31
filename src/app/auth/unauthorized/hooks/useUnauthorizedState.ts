import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLogging } from "@/shared/providers/LoggingProvider";
import { useAuth } from "@/shared/services/auth/hooks";

export function useUnauthorizedState() {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const logger = useLogging({
    feature: "UnauthorizedPage",
    metadata: { component: "UnauthorizedPage" },
  });

  const fromPath = location.state?.from?.pathname || "";
  const attemptedAction =
    location.state?.attemptedAction || "access this resource";

  // Log unauthorized access attempt
  useEffect(() => {
    logger.info("Unauthorized access attempt", {
      isAuthenticated,
      fromPath,
      attemptedAction,
      user: user?.email || "anonymous",
      action: "unauthorized-access",
    });
  }, [logger, isAuthenticated, fromPath, attemptedAction, user?.email]);

  return {
    fromPath,
    attemptedAction,
    isAuthenticated,
    user,
    location,
  };
}
