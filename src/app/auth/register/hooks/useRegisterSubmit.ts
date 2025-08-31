import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogging } from "@/shared/providers/LoggingProvider";
import { useNotifications } from "@/shared/providers/NotificationProvider";
import { RegisterFormData } from "./useRegisterForm";

export function useRegisterSubmit() {
  const navigate = useNavigate();
  const logger = useLogging({ feature: "RegisterPage" });
  const notifications = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: RegisterFormData) => {
    setIsSubmitting(true);

    try {
      logger.info("Registration attempt started", {
        email: formData.email,
        role: formData.role,
        user: formData.email,
        action: "register-attempt",
      });

      notifications.showInfo(
        "Creating Account",
        "Please wait while we create your account..."
      );

      // TODO: Implement actual registration API call
      // This is a placeholder for the registration logic
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

      logger.info("Registration successful", {
        email: formData.email,
        role: formData.role,
        user: formData.email,
        action: "register-success",
      });

      notifications.showSuccess(
        "Account Created!",
        "Please check your email to verify your account"
      );

      // Redirect to email verification page
      navigate("/verify-email", { state: { email: formData.email } });
    } catch (error: any) {
      const errorMessage =
        error?.message || "Registration failed. Please try again.";

      logger.error("Registration failed", error, {
        email: formData.email,
        errorMessage,
        user: formData.email,
        action: "register-failed",
      });

      notifications.showError("Registration Failed", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting,
  };
}
