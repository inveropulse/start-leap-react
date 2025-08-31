import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLogging } from "@/shared/providers/LoggingProvider";
import { useNotifications } from "@/shared/providers/NotificationProvider";
import type { ResetPasswordFormData } from "./useResetPasswordForm";

export function useResetPasswordSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const logger = useLogging({
    feature: "ResetPasswordPage",
    metadata: { component: "ResetPasswordPage" },
  });

  const notifications = useNotifications();

  // Extract and validate reset token from URL
  useEffect(() => {
    const token = searchParams.get("token") || searchParams.get("t");
    const email = searchParams.get("email") || searchParams.get("e");

    if (token) {
      setResetToken(token);
      // TODO: Validate token with API
      setIsValidToken(true); // Placeholder - should validate with API

      logger.info("Reset password page accessed with token", {
        hasToken: !!token,
        hasEmail: !!email,
        action: "reset-password-access",
      });
    } else {
      setIsValidToken(false);
      notifications.showError(
        "Invalid Reset Link",
        "This password reset link is invalid or expired"
      );
    }
  }, [searchParams, logger, notifications]);

  const handleSubmit = async (data: ResetPasswordFormData) => {
    if (!resetToken) {
      notifications.showError(
        "Invalid Reset Token",
        "This password reset link is invalid or expired"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      logger.info("Password reset attempt started", {
        hasToken: !!resetToken,
        action: "reset-password-attempt",
      });

      notifications.showInfo(
        "Resetting Password",
        "Please wait while we update your password..."
      );

      // TODO: Implement actual reset password API call
      // This is a placeholder for the reset password logic
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

      logger.info("Password reset successful", {
        action: "reset-password-success",
      });

      notifications.showSuccess(
        "Password Reset Successful!",
        "Your password has been updated. You can now sign in."
      );

      // Redirect to login page after successful reset
      setTimeout(() => {
        navigate("/login", {
          state: {
            message:
              "Your password has been reset successfully. Please sign in with your new password.",
          },
        });
      }, 2000);
    } catch (error: any) {
      const errorMessage =
        error?.message || "Failed to reset password. Please try again.";

      logger.error("Password reset failed", error, {
        errorMessage,
        action: "reset-password-failed",
      });

      notifications.showError("Reset Failed", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestNewReset = () => {
    navigate("/forgot-password");
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return {
    handleSubmit,
    handleRequestNewReset,
    handleBackToLogin,
    isSubmitting,
    resetToken,
    isValidToken,
  };
}
