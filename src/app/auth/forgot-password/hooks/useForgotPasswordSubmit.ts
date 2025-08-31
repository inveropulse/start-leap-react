import { useState } from "react";
import { useLogging } from "@/shared/providers/LoggingProvider";
import { useNotifications } from "@/shared/providers/NotificationProvider";
import type { ForgotPasswordFormData } from "./useForgotPasswordForm";

export function useForgotPasswordSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const logger = useLogging({
    feature: "ForgotPasswordPage",
    metadata: { component: "ForgotPasswordPage" },
  });

  const notifications = useNotifications();

  const handleSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);

    try {
      logger.info("Password reset request started", {
        email: data.email,
        user: data.email,
        action: "forgot-password-attempt",
      });

      notifications.showInfo(
        "Processing Request",
        "Sending password reset instructions..."
      );

      // TODO: Implement actual forgot password API call
      // This is a placeholder for the forgot password logic
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

      logger.info("Password reset email sent", {
        email: data.email,
        user: data.email,
        action: "forgot-password-success",
      });

      notifications.showSuccess(
        "Reset Email Sent!",
        "Check your email for password reset instructions"
      );

      setIsEmailSent(true);
    } catch (error: any) {
      const errorMessage =
        error?.message || "Failed to send reset email. Please try again.";

      logger.error("Password reset request failed", error, {
        email: data.email,
        errorMessage,
        user: data.email,
        action: "forgot-password-failed",
      });

      notifications.showError("Reset Failed", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendEmail = () => {
    setIsEmailSent(false);
  };

  return {
    handleSubmit,
    handleResendEmail,
    isSubmitting,
    isEmailSent,
  };
}
