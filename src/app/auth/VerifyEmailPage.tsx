import { useState, useEffect } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { useLogging } from "@/shared/provider/LoggingProvider";
import { useNotifications } from "@/shared/provider/NotificationProvider";
import { useAuth } from "@/shared/services/auth/hooks";

type VerificationStatus =
  | "verifying"
  | "success"
  | "failed"
  | "expired"
  | "pending";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const logger = useLogging({
    feature: "VerifyEmailPage",
    metadata: { component: "VerifyEmailPage" },
  });

  const notifications = useNotifications();
  const { isAuthenticated } = useAuth();

  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>("pending");
  const [email, setEmail] = useState<string>("");
  const [isResending, setIsResending] = useState(false);

  // Extract verification details from URL or state
  useEffect(() => {
    const token = searchParams.get("token") || searchParams.get("t");
    const emailParam = searchParams.get("email") || searchParams.get("e");
    const stateEmail = location.state?.email;

    const userEmail = emailParam || stateEmail || "";
    setEmail(userEmail);

    if (token) {
      // Auto-verify if token is present
      verifyEmail(token, userEmail);
    } else if (!userEmail) {
      // No email provided, redirect to register
      notifications.showError(
        "Invalid Verification Link",
        "Please use the verification link from your email"
      );
      navigate("/register");
    }
  }, [searchParams, location.state, navigate, notifications]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/clinic");
    }
  }, [isAuthenticated, navigate]);

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

  const handleResendVerification = async () => {
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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case "verifying":
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Verifying Your Email
              </h3>
              <p className="text-sm text-gray-600">
                Please wait while we verify your email address...
              </p>
            </div>
          </div>
        );

      case "success":
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Email Verified Successfully!
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Your email address has been verified. You can now sign in to
                your account.
              </p>
            </div>
            <Button onClick={() => navigate("/login")} className="w-full">
              Sign In to Your Account
            </Button>
          </div>
        );

      case "failed":
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-red-600 mb-2">
                Verification Failed
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                We couldn't verify your email address. Please try again or
                request a new verification email.
              </p>
            </div>
            <Button
              onClick={handleResendVerification}
              disabled={isResending}
              className="w-full"
            >
              {isResending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </div>
              ) : (
                "Resend Verification Email"
              )}
            </Button>
          </div>
        );

      case "expired":
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-yellow-600 mb-2">
                Verification Link Expired
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                This verification link has expired. Please request a new
                verification email.
              </p>
            </div>
            <Button
              onClick={handleResendVerification}
              disabled={isResending}
              className="w-full"
            >
              {isResending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </div>
              ) : (
                "Send New Verification Email"
              )}
            </Button>
          </div>
        );

      case "pending":
      default:
        return (
          <div className="space-y-4">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Verify Your Email Address
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  We've sent a verification link to your email address. Click
                  the link to verify your account.
                </p>
                {email && (
                  <p className="text-sm font-medium text-gray-900">{email}</p>
                )}
              </div>
            </div>

            {!email && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter your email address"
                />
              </div>
            )}

            <Button
              onClick={handleResendVerification}
              disabled={isResending || !email}
              variant="outline"
              className="w-full"
            >
              {isResending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </div>
              ) : (
                "Resend Verification Email"
              )}
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>
            Verify your email address to activate your account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {renderContent()}

          {/* Back to Login */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Back to Sign In
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
