import {
  PortalType,
  PublicRoute as PublicRouteEnum,
} from "@/shared/services/auth/types";
import React, { PropsWithChildren } from "react";
import { useAuth } from "@/shared/services/auth/hooks";
import { useLocation, Navigate } from "react-router-dom";
import { usePortalInfoAndRoutes } from "../hooks/usePortalInfoAndRoutes";

export interface ProtectedRouteProps extends PropsWithChildren {
  requiredPortal: PortalType;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
  requiredPortal,
}) => {
  const { isAuthenticated, isLoading, hasPortalAccess, currentPortal } =
    useAuth();
  const { getPortalBaseRoute } = usePortalInfoAndRoutes();
  const location = useLocation();

  // Show loading while initializing
  if (isLoading) {
    return fallback || <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate to={PublicRouteEnum.LOGIN} state={{ from: location }} replace />
    );
  }

  // Check portal access if required
  if (requiredPortal && !hasPortalAccess(requiredPortal)) {
    return <Navigate to={PublicRouteEnum.UNAUTHORIZED} replace />;
  }

  // Auto-redirect to correct portal if user is in wrong portal
  if (requiredPortal && currentPortal !== requiredPortal) {
    const correctRoute = getPortalBaseRoute(requiredPortal);
    return <Navigate to={correctRoute} replace />;
  }

  return <>{children}</>;
};
