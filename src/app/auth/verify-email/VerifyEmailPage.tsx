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
  useVerifyEmailForm,
  VerifyEmailFormData,
} from "./hooks/useVerifyEmailForm";
import { useVerifyEmailSubmit } from "./hooks/useVerifyEmailSubmit";

export default function VerifyEmailPage() {
  const {
    form,
    verificationStatus,
    setVerificationStatus,
    extractedEmail,
    searchParams,
  } = useVerifyEmailForm();

  const { handleResendVerification, handleGoToLogin, isResending } =
    useVerifyEmailSubmit(
      verificationStatus,
      setVerificationStatus,
      extractedEmail,
      searchParams
    );

  const onResendSubmit = async (data: VerifyEmailFormData) => {
    await handleResendVerification(data);
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case "verifying":
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Verifying Your Email
              </h3>
              <p className="text-sm text-muted-foreground">
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
              <h3 className="text-lg font-medium text-foreground mb-2">
                Email Verified Successfully!
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your email address has been verified. You can now sign in to
                your account.
              </p>
            </div>
            <Button onClick={handleGoToLogin} className="w-full">
              Sign In to Your Account
            </Button>
          </div>
        );

      case "failed":
        return (
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-destructive mb-2">
                Verification Failed
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                We couldn't verify your email address. Please try again or
                request a new verification email.
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onResendSubmit)}
                className="space-y-4"
              >
                {!extractedEmail && (
                  <FormTextField
                    control={form.control}
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email address"
                    autoComplete="email"
                    loading={isResending}
                    required
                  />
                )}
                <Button type="submit" disabled={isResending} className="w-full">
                  {isResending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    "Resend Verification Email"
                  )}
                </Button>
              </form>
            </Form>
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
              <p className="text-sm text-muted-foreground mb-4">
                This verification link has expired. Please request a new
                verification email.
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onResendSubmit)}
                className="space-y-4"
              >
                {!extractedEmail && (
                  <FormTextField
                    control={form.control}
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email address"
                    autoComplete="email"
                    loading={isResending}
                    required
                  />
                )}
                <Button type="submit" disabled={isResending} className="w-full">
                  {isResending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    "Send New Verification Email"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        );

      case "pending":
      default:
        return (
          <div className="space-y-4">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-primary"
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
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Verify Your Email Address
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We've sent a verification link to your email address. Click
                  the link to verify your account.
                </p>
                {extractedEmail && (
                  <p className="text-sm font-medium text-foreground">
                    {extractedEmail}
                  </p>
                )}
              </div>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onResendSubmit)}
                className="space-y-4"
              >
                {!extractedEmail && (
                  <FormTextField
                    control={form.control}
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email address"
                    autoComplete="email"
                    loading={isResending}
                    required
                  />
                )}

                <Button
                  type="submit"
                  disabled={isResending}
                  variant="outline"
                  className="w-full"
                >
                  {isResending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    "Resend Verification Email"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
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
          <div className="text-center pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              <Link
                to="/login"
                className="text-primary hover:text-primary/80 font-medium"
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
