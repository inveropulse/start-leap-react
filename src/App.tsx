import "./App.css";
import {
  Route,
  Routes,
  Navigate,
  BrowserRouter as Router,
} from "react-router-dom";
import LoginPage from "@/app/auth/login/LoginPage";
import { RegisterPage } from "@/app/auth/register";
import { ForgotPasswordPage } from "@/app/auth/forgot-password";
import { ResetPasswordPage } from "@/app/auth/reset-password";
import { VerifyEmailPage } from "@/app/auth/verify-email";
import { UnauthorizedPage } from "@/app/auth/unauthorized";
import { NotFoundPage } from "@/app/auth/not-found";
import ClinicPortal from "@/app/clinic/ClinicPortal";
import PatientPortal from "@/app/patient/PatientPortal";
import InternalPortal from "@/app/internal/InternalPortal";
import SedationistPortal from "@/app/sedationist/SedationistPortal";
import WithProviders from "./shared/providers/WithProviders";
import { PublicRoute } from "./shared/components/PublicRoute";
import { ProtectedRoute } from "./shared/components/ProtectedRoute";
import { PortalType, PublicRoute as PublicRouteEnum } from "./shared/services/auth/types";
import { usePortalInfoAndRoutes } from "./shared/hooks/usePortalInfoAndRoutes";
import { Layout } from "./shared/components/layout/Layout";

function AppRoutes() {
  const { PORTAL_INFO, getPortalRoutes } = usePortalInfoAndRoutes();

  const renderPortalRoutes = (portalType: PortalType, PortalComponent: React.ComponentType) => {
    const routes = getPortalRoutes(portalType);
    const baseRoute = PORTAL_INFO[portalType].route;

    return (
      <Route
        path={`${baseRoute}/*`}
        element={
          <ProtectedRoute requiredPortal={portalType}>
            <Routes>
              <Route index element={<PortalComponent />} />
              {routes.slice(1).map((route) => (
                <Route
                  key={route.url}
                  path={route.url.replace(baseRoute, '').substring(1)}
                  element={
                    <Layout>
                      <div className="p-6">
                        <div className="text-2xl font-semibold">Page Name: {route.title}</div>
                      </div>
                    </Layout>
                  }
                />
              ))}
            </Routes>
          </ProtectedRoute>
        }
      />
    );
  };

  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to={PublicRouteEnum.LOGIN} replace />} />

      {/* Public Routes (unauthenticated users only) */}
      <Route
        path={PublicRouteEnum.LOGIN}
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path={PublicRouteEnum.REGISTER}
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path={PublicRouteEnum.FORGOT_PASSWORD}
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path={PublicRouteEnum.RESET_PASSWORD}
        element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path={PublicRouteEnum.VERIFY_EMAIL}
        element={
          <PublicRoute>
            <VerifyEmailPage />
          </PublicRoute>
        }
      />

      {/* Error/Access Pages (accessible to everyone) */}
      <Route path={PublicRouteEnum.UNAUTHORIZED} element={<UnauthorizedPage />} />

      {/* Protected Portal Routes */}
      {renderPortalRoutes(PortalType.CLINIC, ClinicPortal)}
      {renderPortalRoutes(PortalType.PATIENT, PatientPortal)}
      {renderPortalRoutes(PortalType.INTERNAL, InternalPortal)}
      {renderPortalRoutes(PortalType.SEDATIONIST, SedationistPortal)}

      {/* 404 Catch-all (accessible to everyone) */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <WithProviders>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AppRoutes />
      </Router>
    </WithProviders>
  );
}
