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
import {
  FormTextField,
  FormSelect,
  type SelectOption,
} from "@/shared/components/form";
import { useNotifications } from "@/shared/providers/NotificationProvider";
import { useRegisterForm, RegisterFormData } from "./hooks/useRegisterForm";
import { useRegisterSubmit } from "./hooks/useRegisterSubmit";

const roleOptions: SelectOption[] = [
  { value: "patient", label: "Patient" },
  { value: "doctor", label: "Healthcare Provider" },
  { value: "nurse", label: "Nurse" },
  { value: "sedationist", label: "Sedationist" },
  { value: "admin", label: "Administrator" },
];

export default function RegisterPage() {
  const notifications = useNotifications();
  const { form } = useRegisterForm();
  const { handleSubmit, isSubmitting } = useRegisterSubmit();

  const onSubmit = async (data: RegisterFormData) => {
    await handleSubmit(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted py-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Create Your Account</CardTitle>
          <CardDescription>
            Join Sedation Solutions to access your portal
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <FormTextField
                  control={form.control}
                  name="firstName"
                  label="First Name"
                  placeholder="First name"
                  autoComplete="given-name"
                  loading={isSubmitting}
                  required
                />

                <FormTextField
                  control={form.control}
                  name="lastName"
                  label="Last Name"
                  placeholder="Last name"
                  autoComplete="family-name"
                  loading={isSubmitting}
                  required
                />
              </div>

              {/* Email Field */}
              <FormTextField
                control={form.control}
                name="email"
                label="Email"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                loading={isSubmitting}
                required
              />

              {/* Role Selection */}
              <FormSelect
                control={form.control}
                name="role"
                label="Account Type"
                placeholder="Select account type"
                options={roleOptions}
                loading={isSubmitting}
                required
              />

              {/* Password Fields */}
              <FormTextField
                control={form.control}
                name="password"
                label="Password"
                type="password"
                placeholder="Create a password"
                autoComplete="new-password"
                loading={isSubmitting}
                required
              />

              <FormTextField
                control={form.control}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                autoComplete="new-password"
                loading={isSubmitting}
                required
              />

              {/* Terms Agreement */}
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    {...form.register("agreeToTerms")}
                    disabled={isSubmitting}
                    className="mt-1 h-4 w-4 text-primary focus:ring-primary border-input rounded disabled:opacity-50"
                  />
                  <label className="text-sm text-muted-foreground">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-primary hover:text-primary/80 underline"
                      target="_blank"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-primary hover:text-primary/80 underline"
                      target="_blank"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {form.formState.errors.agreeToTerms && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.agreeToTerms.message}
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
          </Form>

          {/* Login Link */}
          <div className="text-center pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
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
