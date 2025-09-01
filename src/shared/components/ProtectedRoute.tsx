import { PortalType } from "../types";
import { Layout } from "./layout/Layout";
import React, { PropsWithChildren } from "react";
import { PublicRoute } from "@/routes/auth_routes";
import { getPortalByType } from "@/routes/registry";
import { useAuth } from "@/shared/services/auth/hooks";
import { useLocation, Navigate } from "react-router-dom";

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
  const location = useLocation();

  if (isLoading) {
    return fallback || <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <Navigate to={PublicRoute.LOGIN} state={{ from: location }} replace />
    );
  }

  if (requiredPortal && !hasPortalAccess(requiredPortal)) {
    return <Navigate to={PublicRoute.UNAUTHORIZED} replace />;
  }

  if (requiredPortal && currentPortal !== requiredPortal) {
    const correctRoute = getPortalByType(requiredPortal).basePath;
    return <Navigate to={correctRoute} replace />;
  }

  return <Layout>{children}</Layout>;
};
