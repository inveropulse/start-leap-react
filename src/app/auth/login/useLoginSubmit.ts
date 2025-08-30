import { useNavigate } from "react-router-dom";
import { useLogging } from "@/shared/providers/LoggingProvider";
import { useNotifications } from "@/shared/providers/NotificationProvider";
import { useAuth } from "@/shared/services/auth/hooks";
import { PORTALS } from "@/shared/services/auth/types";
import { useLoginRequest } from "@/api/auth/login";

interface LoginFormData {
  email: string;
  password: string;
}

export function useLoginSubmit() {
  const navigate = useNavigate();
  const loginRequest = useLoginRequest();
  const logger = useLogging({ feature: "LoginPage" });
  const notifications = useNotifications();
  const { login } = useAuth();

  const handleSubmit = async (formData: LoginFormData) => {
    try {
      logger.info("Login attempt started", {
        email: formData.email,
        user: formData.email,
        action: "login-attempt",
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
        notifications.showError("Login Failed", result.error);
        logger.error("Login failed", null, {
          errorCode: result.errorCode,
          errorMessage: result.error,
          userEmail: formData.email,
          action: "login-failed",
        });
        return;
      }

      login(result);

      logger.info("Login successful, redirecting to portal", {
        email: formData.email,
        portal: result.currentPortal,
        user: formData.email,
        action: "login-success",
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

      logger.error("Login failed", error, {
        email: formData.email,
        errorMessage,
        user: formData.email,
        action: "login-failed",
      });

      notifications.showError("Login Failed", errorMessage);
    }
  };

  return {
    handleSubmit,
  };
}
