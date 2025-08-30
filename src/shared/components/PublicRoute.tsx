import { APP_CONFIG } from "@/shared/AppConfig";
import React, { PropsWithChildren } from "react";
import { useAuth } from "@/shared/services/auth/hooks";
import { PORTALS } from "@/shared/services/auth/types";
import { useLocation, Navigate } from "react-router-dom";

export interface PublicRouteProps extends PropsWithChildren {
  fallback?: React.ReactNode;
  redirectIfAuthenticated?: boolean;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  fallback = null,
  redirectIfAuthenticated = true,
}) => {
  const { isAuthenticated, isLoading, currentPortal } = useAuth();
  const location = useLocation();

  // Show loading while initializing
  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      )
    );
  }

  // If authenticated and should redirect, navigate to appropriate portal
  if (isAuthenticated && redirectIfAuthenticated) {
    // Check if there's a "from" location to redirect back to
    const from = location.state?.from?.pathname;

    if (from && from !== location.pathname) {
      return <Navigate to={from} replace />;
    }

    // Otherwise redirect to current portal or default
    const targetPortal = currentPortal || APP_CONFIG.portals.defaultRedirect;
    const portalInfo = PORTALS[targetPortal];
    return <Navigate to={portalInfo.route} replace />;
  }

  return <>{children}</>;
};
