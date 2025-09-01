import React, { PropsWithChildren } from "react";
import { getPortalByType } from "@/routes/registry";
import { useAuth } from "@/shared/services/auth/hooks";
import { useLocation, Navigate } from "react-router-dom";
import { AuthLayout } from "../../app/auth/shared/AuthLayout";

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
        <AuthLayout>
          <div className="flex items-center justify-center">
            <div className="text-lg text-muted-foreground">Loading...</div>
          </div>
        </AuthLayout>
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
    const targetPortal = currentPortal;
    return <Navigate to={getPortalByType(targetPortal).basePath} replace />;
  }

  return <AuthLayout>{children}</AuthLayout>;
};
