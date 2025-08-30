import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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

interface ForgotPasswordFormData {
  email: string;
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const logger = useLogging({
    feature: "ForgotPasswordPage",
    metadata: { component: "ForgotPasswordPage" },
  });

  const notifications = useNotifications();
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
  });

  const [formErrors, setFormErrors] = useState<{ email?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/clinic");
    }
  }, [isAuthenticated, navigate]);

  const validateForm = (): boolean => {
    const errors: { email?: string } = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
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
    if (formErrors[name as keyof typeof formErrors]) {
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
        "Please enter a valid email address"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      logger.info("Password reset request started", {
        email: formData.email,
        user: formData.email,
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
        email: formData.email,
        user: formData.email,
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
        email: formData.email,
        errorMessage,
        user: formData.email,
        action: "forgot-password-failed",
      });

      notifications.showError("Reset Failed", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendEmail = async () => {
    setIsEmailSent(false);
    await handleSubmit(new Event("submit") as any);
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Check Your Email</CardTitle>
            <CardDescription>
              We've sent password reset instructions to your email
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
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
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">
                  We sent a password reset link to:
                </p>
                <p className="font-medium text-gray-900">{formData.email}</p>
              </div>

              <div className="text-sm text-gray-600 space-y-2">
                <p>Click the link in the email to reset your password.</p>
                <p>
                  Didn't receive the email? Check your spam folder or try again.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleResendEmail}
                variant="outline"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Resending...</span>
                  </div>
                ) : (
                  "Resend Email"
                )}
              </Button>

              <Button onClick={() => navigate("/login")} className="w-full">
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
          <CardTitle>Forgot Password?</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you instructions to reset
            your password
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border rounded-md ${
                  formErrors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                } focus:outline-none focus:ring-1 ${
                  formErrors.email
                    ? "focus:ring-red-500"
                    : "focus:ring-blue-500"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="Enter your email address"
                autoFocus
              />
              {formErrors.email && (
                <p className="text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </div>
              ) : (
                "Send Reset Instructions"
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
