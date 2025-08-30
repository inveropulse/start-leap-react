import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const logger = useLogging({
    feature: "ResetPasswordPage",
    metadata: { component: "ResetPasswordPage" },
  });

  const notifications = useNotifications();
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState<Partial<ResetPasswordFormData>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  // Extract reset token from URL
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

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/clinic");
    }
  }, [isAuthenticated, navigate]);

  const validateForm = (): boolean => {
    const errors: Partial<ResetPasswordFormData> = {};

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-specific error when user starts typing
    if (formErrors[name as keyof ResetPasswordFormData]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      notifications.showError(
        "Form Validation Failed",
        "Please correct the errors and try again"
      );
      return;
    }

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

  // Show loading while validating token
  if (isValidToken === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">Validating reset link...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error if token is invalid
  if (isValidToken === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Invalid Reset Link</CardTitle>
            <CardDescription>
              This password reset link is invalid or has expired
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-4">
                  The reset link may have expired or been used already. Please
                  request a new password reset.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => navigate("/forgot-password")}
                className="w-full"
              >
                Request New Reset Link
              </Button>

              <Button
                onClick={() => navigate("/login")}
                variant="outline"
                className="w-full"
              >
                Back to Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border rounded-md ${
                  formErrors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                } focus:outline-none focus:ring-1 ${
                  formErrors.password
                    ? "focus:ring-red-500"
                    : "focus:ring-blue-500"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="Enter your new password"
                autoFocus
              />
              {formErrors.password && (
                <p className="text-sm text-red-600">{formErrors.password}</p>
              )}
              <p className="text-xs text-gray-500">
                Must be at least 8 characters with uppercase, lowercase, and
                number
              </p>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border rounded-md ${
                  formErrors.confirmPassword
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                } focus:outline-none focus:ring-1 ${
                  formErrors.confirmPassword
                    ? "focus:ring-red-500"
                    : "focus:ring-blue-500"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="Confirm your new password"
              />
              {formErrors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Resetting Password...</span>
                </div>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>

          {/* Back to Login */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
