import { useNavigate } from "react-router-dom";
import { logger } from "@/shared/services/logging/logger";
import { useNotifications } from "@/shared/providers/NotificationProvider";
import { useAuth } from "@/shared/services/auth/hooks";
import { PORTALS } from "@/shared/services/auth/types";
import { useLoginRequest } from "@/api/auth/login";
import { LoginFormData } from "./useLoginForm";

export function useLoginSubmit() {
  const navigate = useNavigate();
  const loginRequest = useLoginRequest();
  const notifications = useNotifications();
  const { login } = useAuth();

  const handleSubmit = async (formData: LoginFormData) => {
    const startTime = performance.now();

    try {
      // Log login attempt with method-specific context
      logger.info("Login attempt started", {
        loginMethod: "email_password",
        email: formData.email, // Consider hashing in production
        hasRememberedCredentials: !!localStorage.getItem("rememberedEmail"),
        formValidationPassed: true,
      });

      notifications.showInfo(
        "Signing In",
        "Authenticating your credentials..."
      );

      const result = await loginRequest.mutateAsync({
        email: formData.email,
        password: formData.password,
      });

      if (!result.isAuthenticated) {
        // Log authentication failure with specific error context
        logger.error("Authentication failed", undefined, {
          loginMethod: "email_password",
          errorCode: result.errorCode,
          errorType: "authentication_rejected",
          email: formData.email,
          attemptDuration: performance.now() - startTime,
        });

        notifications.showError("Login Failed", result.error);
        return;
      }

      login(result);

      // Log successful login with session context
      logger.info("Login successful", {
        loginMethod: "email_password",
        userId: result.user?.id,
        userRole: result.user?.role,
        targetPortal: result.currentPortal,
        sessionId: result.sessionId,
        loginDuration: performance.now() - startTime,
      });

      notifications.showSuccess(
        "Login Successful!",
        `Redirecting to ${PORTALS[result.currentPortal].name}...`
      );

      setTimeout(() => {
        navigate(PORTALS[result.currentPortal].route);
      }, 1000);
    } catch (error: any) {
      const errorMessage = error?.message || "Login failed. Please try again.";

      // Log login failure with comprehensive error context
      logger.error("Login request failed", error, {
        loginMethod: "email_password",
        errorType: error?.name || "unknown_error",
        errorCode: error?.code,
        errorMessage: error?.message,
        email: formData.email,
        attemptDuration: performance.now() - startTime,
        networkError: error?.isNetworkError,
        statusCode: error?.response?.status,
      });

      notifications.showError("Login Failed", errorMessage);
    }
  };

  return {
    handleSubmit,
  };
}
