import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogging } from "@/shared/providers/LoggingProvider";
import { useNotifications } from "@/shared/providers/NotificationProvider";
import type {
  VerificationStatus,
  VerifyEmailFormData,
} from "./useVerifyEmailForm";

export function useVerifyEmailSubmit(
  verificationStatus: VerificationStatus,
  setVerificationStatus: (status: VerificationStatus) => void,
  extractedEmail: string,
  searchParams: URLSearchParams
) {
  const [isResending, setIsResending] = useState(false);

  const navigate = useNavigate();

  const logger = useLogging({
    feature: "VerifyEmailPage",
    metadata: { component: "VerifyEmailPage" },
  });

  const notifications = useNotifications();

  // Auto-verify if token is present in URL
  useEffect(() => {
    const token = searchParams.get("token") || searchParams.get("t");

    if (token) {
      verifyEmail(token, extractedEmail);
    }
  }, [searchParams, extractedEmail]);

  const verifyEmail = async (token: string, userEmail: string) => {
    setVerificationStatus("verifying");

    try {
      logger.info("Email verification attempt started", {
        email: userEmail,
        hasToken: !!token,
        user: userEmail,
        action: "verify-email-attempt",
      });

      // TODO: Implement actual email verification API call
      // This is a placeholder for the verification logic
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

      logger.info("Email verification successful", {
        email: userEmail,
        user: userEmail,
        action: "verify-email-success",
      });

      setVerificationStatus("success");
      notifications.showSuccess(
        "Email Verified!",
        "Your email has been successfully verified"
      );
    } catch (error: any) {
      const errorMessage = error?.message || "Email verification failed";

      logger.error("Email verification failed", error, {
        email: userEmail,
        errorMessage,
        user: userEmail,
        action: "verify-email-failed",
      });

      if (
        errorMessage.includes("expired") ||
        errorMessage.includes("invalid")
      ) {
        setVerificationStatus("expired");
      } else {
        setVerificationStatus("failed");
      }

      notifications.showError("Verification Failed", errorMessage);
    }
  };

  const handleResendVerification = async (data: VerifyEmailFormData) => {
    const email = data.email || extractedEmail;

    if (!email) {
      notifications.showError(
        "Email Required",
        "Please provide your email address to resend verification"
      );
      return;
    }

    setIsResending(true);

    try {
      logger.info("Resend verification email attempt", {
        email: email,
        user: email,
        action: "resend-verification-attempt",
      });

      notifications.showInfo(
        "Sending Verification Email",
        "Please wait while we send a new verification email..."
      );

      // TODO: Implement actual resend verification API call
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

      logger.info("Verification email resent successfully", {
        email: email,
        user: email,
        action: "resend-verification-success",
      });

      notifications.showSuccess(
        "Verification Email Sent!",
        "Check your email for the new verification link"
      );

      setVerificationStatus("pending");
    } catch (error: any) {
      const errorMessage =
        error?.message || "Failed to resend verification email";

      logger.error("Resend verification email failed", error, {
        email: email,
        errorMessage,
        user: email,
        action: "resend-verification-failed",
      });

      notifications.showError("Resend Failed", errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return {
    handleResendVerification,
    handleGoToLogin,
    isResending,
  };
}
