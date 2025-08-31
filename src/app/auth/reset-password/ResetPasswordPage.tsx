import { Link } from "react-router-dom";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { FormTextField } from "@/shared/components/form";
import {
  useResetPasswordForm,
  ResetPasswordFormData,
} from "./hooks/useResetPasswordForm";
import { useResetPasswordSubmit } from "./hooks/useResetPasswordSubmit";

export default function ResetPasswordPage() {
  const { form } = useResetPasswordForm();
  const {
    handleSubmit,
    handleRequestNewReset,
    handleBackToLogin,
    isSubmitting,
    isValidToken,
  } = useResetPasswordSubmit();

  const onSubmit = async (data: ResetPasswordFormData) => {
    await handleSubmit(data);
  };

  // Show loading while validating token
  if (isValidToken === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-muted-foreground">
                Validating reset link...
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error if token is invalid
  if (isValidToken === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">
              Invalid Reset Link
            </CardTitle>
            <CardDescription>
              This password reset link is invalid or has expired
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-destructive"
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
                <p className="text-sm text-muted-foreground mb-4">
                  The reset link may have expired or been used already. Please
                  request a new password reset.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button onClick={handleRequestNewReset} className="w-full">
                Request New Reset Link
              </Button>

              <Button
                onClick={handleBackToLogin}
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
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormTextField
                control={form.control}
                name="password"
                label="New Password"
                type="password"
                placeholder="Enter your new password"
                autoComplete="new-password"
                loading={isSubmitting}
                autoFocus
                required
                description="Must be at least 8 characters with uppercase, lowercase, and number"
              />

              <FormTextField
                control={form.control}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm your new password"
                autoComplete="new-password"
                loading={isSubmitting}
                required
              />

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
          </Form>

          {/* Back to Login */}
          <div className="text-center pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-primary/80 font-medium"
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
