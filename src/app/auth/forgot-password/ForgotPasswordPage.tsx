import { Link, useNavigate } from "react-router-dom";
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
  useForgotPasswordForm,
  ForgotPasswordFormData,
} from "./hooks/useForgotPasswordForm";
import { useForgotPasswordSubmit } from "./hooks/useForgotPasswordSubmit";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { form } = useForgotPasswordForm();
  const { handleSubmit, handleResendEmail, isSubmitting, isEmailSent } =
    useForgotPasswordSubmit();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await handleSubmit(data);
  };

  const onResendEmail = async () => {
    handleResendEmail();
    // Re-submit with current form values
    const currentValues = form.getValues();
    await handleSubmit(currentValues);
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
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
                <p className="text-sm text-muted-foreground mb-2">
                  We sent a password reset link to:
                </p>
                <p className="font-medium text-foreground">
                  {form.getValues("email")}
                </p>
              </div>

              <div className="text-sm text-muted-foreground space-y-2">
                <p>Click the link in the email to reset your password.</p>
                <p>
                  Didn't receive the email? Check your spam folder or try again.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={onResendEmail}
                variant="outline"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
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
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot Password?</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you instructions to reset
            your password
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormTextField
                control={form.control}
                name="email"
                label="Email Address"
                type="email"
                placeholder="Enter your email address"
                autoComplete="email"
                loading={isSubmitting}
                autoFocus
                required
              />

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
