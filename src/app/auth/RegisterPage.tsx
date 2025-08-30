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

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  agreeToTerms: boolean;
}

interface RegisterFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  agreeToTerms?: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();

  const logger = useLogging({
    feature: "RegisterPage",
    metadata: { component: "RegisterPage" },
  });

  const notifications = useNotifications();
  const { isAuthenticated, isLoading } = useAuth();

  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient",
    agreeToTerms: false,
  });

  const [formErrors, setFormErrors] = useState<RegisterFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/clinic");
    }
  }, [isAuthenticated, navigate]);

  const validateForm = (): boolean => {
    const errors: RegisterFormErrors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

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

    if (!formData.agreeToTerms) {
      errors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear field-specific error when user starts typing
    if (formErrors[name as keyof RegisterFormErrors]) {
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

      // Redirect to email verification or login page
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Create Your Account</CardTitle>
          <CardDescription>
            Join Sedation Solutions to access your portal
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className={`w-full px-3 py-2 border rounded-md ${
                    formErrors.firstName
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                  } focus:outline-none focus:ring-1 ${
                    formErrors.firstName
                      ? "focus:ring-red-500"
                      : "focus:ring-blue-500"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="First name"
                />
                {formErrors.firstName && (
                  <p className="text-sm text-red-600">{formErrors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className={`w-full px-3 py-2 border rounded-md ${
                    formErrors.lastName
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                  } focus:outline-none focus:ring-1 ${
                    formErrors.lastName
                      ? "focus:ring-red-500"
                      : "focus:ring-blue-500"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="Last name"
                />
                {formErrors.lastName && (
                  <p className="text-sm text-red-600">{formErrors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
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
                placeholder="Enter your email"
              />
              {formErrors.email && (
                <p className="text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Account Type</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Healthcare Provider</option>
                <option value="nurse">Nurse</option>
                <option value="sedationist">Sedationist</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {/* Password Fields */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
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
                placeholder="Create a password"
              />
              {formErrors.password && (
                <p className="text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>

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
                placeholder="Confirm your password"
              />
              {formErrors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <label className="text-sm text-gray-700">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-blue-600 hover:text-blue-500 underline"
                    target="_blank"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-blue-600 hover:text-blue-500 underline"
                    target="_blank"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {formErrors.agreeToTerms && (
                <p className="text-sm text-red-600">
                  {formErrors.agreeToTerms}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
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
