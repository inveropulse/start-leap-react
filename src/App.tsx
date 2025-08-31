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
import { PortalType } from "./shared/services/auth/types";

export default function App() {
  return (
    <WithProviders>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public Routes (unauthenticated users only) */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPasswordPage />
              </PublicRoute>
            }
          />
          <Route
            path="/verify-email"
            element={
              <PublicRoute>
                <VerifyEmailPage />
              </PublicRoute>
            }
          />

          {/* Error/Access Pages (accessible to everyone) */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected Portal Routes */}
          <Route
            path="/clinic/*"
            element={
              <ProtectedRoute requiredPortal={PortalType.CLINIC}>
                <ClinicPortal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/*"
            element={
              <ProtectedRoute requiredPortal={PortalType.PATIENT}>
                <PatientPortal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/internal/*"
            element={
              <ProtectedRoute requiredPortal={PortalType.INTERNAL}>
                <InternalPortal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sedationist/*"
            element={
              <ProtectedRoute requiredPortal={PortalType.SEDATIONIST}>
                <SedationistPortal />
              </ProtectedRoute>
            }
          />

          {/* 404 Catch-all (accessible to everyone) */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </WithProviders>
  );
}
