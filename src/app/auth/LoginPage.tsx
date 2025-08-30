import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { useLogging } from "@/shared/providers/LoggingProvider";
import { useNotifications } from "@/shared/providers/NotificationProvider";
import { useAuth } from "@/shared/services/auth/hooks";
import { PORTALS } from "@/shared/services/auth/types";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();

  const logger = useLogging({
    feature: "LoginPage",
    metadata: { component: "LoginPage" },
  });

  const notifications = useNotifications();

  const {
    login,
    isAuthenticated,
    isLoading,
    error,
    clearError,
    currentPortal,
    switchPortal,
    user,
  } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState<Partial<LoginFormData>>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user && currentPortal) {
      const portalInfo = PORTALS[currentPortal];
      navigate(portalInfo.route);

      logger.info("User already authenticated, redirecting to current portal", {
        portal: portalInfo.name,
        user: user.email || "authenticated-user",
        action: "auto-redirect",
      });
    }
  }, [isAuthenticated, user, currentPortal, navigate, logger]);

  // Clear errors when user starts typing
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formData.email, formData.password, error, clearError]);

  const validateForm = (): boolean => {
    const errors: Partial<LoginFormData> = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
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
    if (formErrors[name as keyof LoginFormData]) {
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

      await login({
        email: formData.email,
        password: formData.password,
      });

      // Success - login should set the current portal automatically
      // The store will determine the appropriate portal based on user role

      logger.info("Login successful, redirecting to portal", {
        email: formData.email,
        portal: currentPortal,
        user: formData.email,
        action: "login-success",
      });

      notifications.showSuccess(
        "Login Successful!",
        `Redirecting to ${PORTALS[currentPortal].name}...`
      );

      // Navigate to the portal
      setTimeout(() => {
        navigate(PORTALS[currentPortal].route);
      }, 1000); // Small delay to show success message
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

  // Development portal navigation handlers (keep for dev convenience)
  const handleDevPortalNavigation = (portal: string) => {
    logger.info(`Dev navigation to ${portal}`, {
      user: "dev-user",
      action: "dev-navigate",
      portal,
    });

    notifications.showInfo(
      `Navigating to ${portal} Portal`,
      "Development mode"
    );
    window.location.href = `/${portal}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sedation Solutions Portal</CardTitle>
          <CardDescription>
            {isAuthenticated
              ? "Redirecting to your portal..."
              : "Sign in to access your portal"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md ${
                  formErrors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                } focus:outline-none focus:ring-1 ${
                  formErrors.email
                    ? "focus:ring-red-500"
                    : "focus:ring-blue-500"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="Enter your email"
              />
              {formErrors.email && (
                <p className="text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md ${
                  formErrors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                } focus:outline-none focus:ring-1 ${
                  formErrors.password
                    ? "focus:ring-red-500"
                    : "focus:ring-blue-500"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="Enter your password"
              />
              {formErrors.password && (
                <p className="text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>

            {/* Global Error Display */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || isAuthenticated}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : isAuthenticated ? (
                "Redirecting..."
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Forgot Password Link */}
            <div className="text-center">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>
          </form>

          {/* Register Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Create one
              </Link>
            </p>
          </div>

          {/* Development Quick Access */}
          {import.meta.env.DEV && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                Quick access (dev only):
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDevPortalNavigation("internal")}
                  disabled={isLoading}
                >
                  Internal
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDevPortalNavigation("patient")}
                  disabled={isLoading}
                >
                  Patient
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDevPortalNavigation("sedationist")}
                  disabled={isLoading}
                >
                  Sedationist
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDevPortalNavigation("clinic")}
                  disabled={isLoading}
                >
                  Clinic
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
