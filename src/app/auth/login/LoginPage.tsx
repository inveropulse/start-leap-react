import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/shared/components/ui/card";
import { Link } from "react-router-dom";
import { useLoginSubmit } from "./hooks/useLoginSubmit";
import { Form } from "@/shared/components/ui/form";
import { useAuth } from "@/shared/services/auth/hooks";
import { Button } from "@/shared/components/ui/button";
import { useLoginForm, LoginFormData } from "./hooks/useLoginForm";
import { FormTextField } from "@/shared/components/form/FormTextField";
import { useEffect } from "react";
import { logger } from "@/shared/services/logging/logger";

export default function LoginPage() {
  const { isAuthenticated, isLoading, error } = useAuth();
  const { handleSubmit: submitLogin } = useLoginSubmit();
  const { form } = useLoginForm();

  // Log page view with login-specific context
  useEffect(() => {
    logger.info("Login page viewed", {
      pageType: "authentication",
      authMethod: "email_password",
      hasRememberedUser: !!localStorage.getItem("rememberedEmail"),
      isAlreadyAuthenticated: isAuthenticated,
    });
  }, [isAuthenticated]);

  // Log authentication errors from useAuth hook
  useEffect(() => {
    if (error && !isLoading) {
      logger.warn("Login page showing auth error", {
        errorMessage: error,
        errorSource: "auth_hook",
        isAuthenticated: isAuthenticated,
      });
    }
  }, [error, isLoading, isAuthenticated]);

  const onSubmit = async (data: LoginFormData) => {
    // Log form submission attempt (before actual login)
    logger.info("Login form submitted", {
      formData: {
        hasEmail: !!data.email,
        hasPassword: !!data.password,
        emailDomain: data.email?.split("@")[1], // Useful for analytics
        emailLength: data.email?.length,
        passwordLength: data.password?.length,
      },
      formValidation: form.formState.isValid,
    });

    await submitLogin(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sedation Solutions Hub</CardTitle>
          <CardDescription>
            {isAuthenticated
              ? "Redirecting to your portal..."
              : "Sign in to access your portal"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormTextField
                control={form.control}
                name="email"
                label="Email"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                loading={isLoading}
                required
              />

              <FormTextField
                control={form.control}
                name="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                loading={isLoading}
                required
              />

              {/* Global Error Display */}
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

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

              <div className="text-center">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Forgot your password?
                </Link>
              </div>
            </form>
          </Form>

          <div className="pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground mb-3">
              <p className="font-medium mb-2">Test Accounts:</p>
              <div className="space-y-1">
                <p><span className="font-medium">Internal:</span> admin@sedation.com</p>
                <p><span className="font-medium">Clinic:</span> clinic@sedation.com</p>
                <p><span className="font-medium">Patient:</span> patient@sedation.com</p>
                <p><span className="font-medium">Sedationist:</span> sedationist@sedation.com</p>
              </div>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary hover:text-primary/80 font-medium"
              >
                Create one
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
